import { createMessage, type ConversationData } from "../components/marketplace/Conversation";
import { createCodes } from "../data/conversations";
import type { PurchaseRequest } from "../data/marketplace";
import { cents, matchFlight, type MatchedOpportunity } from "./flightArbitrageApi";
import { initDB, notifyStore } from "./productionDb";

export async function prepareArbitrageDeal(deal: MatchedOpportunity, actorId: string): Promise<ConversationData[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(["purchase_requests", "conversations"], "readwrite");
    const requestRead = tx.objectStore("purchase_requests").getAll();
    const conversationStore = tx.objectStore("conversations");
    const conversationRead = conversationStore.getAll();
    let requests: PurchaseRequest[] | undefined;
    let conversations: ConversationData[] | undefined;
    let result: ConversationData[] = [];
    let failure = "Impossible d’enregistrer les discussions. Réessayez.";
    const prepare = () => {
      if (!requests || !conversations) return;
      try {
        const selected = requests.filter(request => deal.requestIds.includes(request.id));
        const checked = matchFlight(deal.flight, selected, conversations.filter(c => c.stage !== "discussion").map(c => c.id));
        if (!checked.ordersCount || checked.ordersCount !== deal.requestIds.length
          || cents(checked.totalOrderReward) !== cents(deal.totalOrderReward)
          || checked.netProfit !== deal.netProfit
          || selected.some(request => request.ownerId === actorId))
          throw new Error("Ces missions ou ce tarif ont changé. Actualisez les vols avant de réessayer.");
        result = selected.map(request => {
          const existing = conversations!.find(c => c.id === request.id);
          if (existing?.participantIds?.length && !existing.participantIds.includes(actorId))
            throw new Error("Une de ces demandes fait déjà l’objet d’un accord avec un autre voyageur.");
          if (existing?.arbitrage?.groupId === deal.id) return existing;
          const message = createMessage(
            `Bonjour ${request.buyer}, je propose ${request.kind === "parcel" ? "de transporter votre colis" : "d’acheter et livrer votre article"} : ${request.title}. Trajet ${deal.flight.origin} → ${deal.flight.destination}, départ le ${deal.flight.departureDate}, ${deal.flight.airline}. Commission voyageur : ${request.reward} €. Confirmons le contenu, les frais et les lieux de remise avant réservation.`,
          );
          return {
            ...existing,
            id: request.id, name: request.buyer, subject: request.title,
            amount: request.budget + (request.serviceGross ?? request.reward),
            serviceAmount: request.serviceGross ?? request.reward,
            participantIds: [...new Set([actorId, ...(request.ownerId ? [request.ownerId] : [])])],
            stage: "discussion",
            ...(existing ? { pickupCode: existing.pickupCode, deliveryCode: existing.deliveryCode } : createCodes()),
            messages: [...(existing?.messages ?? []), message],
            arbitrage: { groupId: deal.id, flightId: deal.flight.id, requestIds: deal.requestIds, source: deal.flight.source },
          };
        });
        for (const conversation of result) conversationStore.put(conversation);
      } catch (cause) {
        failure = cause instanceof Error ? cause.message : failure;
        tx.abort();
      }
    };
    requestRead.onsuccess = () => { requests = requestRead.result; prepare(); };
    conversationRead.onsuccess = () => { conversations = conversationRead.result; prepare(); };
    tx.oncomplete = () => { notifyStore("conversations"); resolve(result); };
    tx.onabort = tx.onerror = () => reject(new Error(failure));
  });
}
