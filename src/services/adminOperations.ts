import {
  initDB,
  notifyStore,
  type StoreName,
  type Conversation,
  type ProApplication,
  type KycRecord,
} from "./productionDb";

// IndexedDB is a local workbench. Production privileges must be granted by a server.
export const localAdminEnabled = import.meta.env.DEV;
function assertLocalAdmin() {
  if (!localAdminEnabled)
    throw new Error(
      "Administration indisponible : connectez un service administrateur authentifié.",
    );
}
async function mutate(stores: StoreName[], run: (tx: IDBTransaction) => void) {
  assertLocalAdmin();
  const db = await initDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(stores, "readwrite");
    tx.oncomplete = () => {
      stores.forEach(notifyStore);
      resolve();
    };
    tx.onerror = () =>
      reject(tx.error || new Error("Enregistrement impossible."));
    tx.onabort = () =>
      reject(
        tx.error ||
          new Error(
            "Action refusée : dossier incomplet, déjà traité ou introuvable.",
          ),
      );
    run(tx);
  });
}
export async function sendOfficialMessage(
  target: { conversationId?: string; userId?: string },
  text: string,
) {
  if (
    !text.trim() ||
    text.length > 2000 ||
    (!target.conversationId && !target.userId)
  )
    throw new Error(
      "Choisissez un destinataire et saisissez un message de 1 à 2 000 caractères.",
    );
  const id = crypto.randomUUID();
  const at = new Date().toISOString();
  await mutate(["conversations", "admin_messages", "users"], (tx) => {
    const conversationId = target.conversationId || `support-${target.userId}`;
    const write = (name?: string) => {
      const store = tx.objectStore("conversations");
      const req = store.get(conversationId);
      req.onsuccess = () => {
        const previous: Conversation | undefined = req.result;
        if (!previous && target.conversationId) {
          tx.abort();
          return;
        }
        const conversation: Conversation = previous || {
          id: conversationId,
          name: "Support BagVoyage",
          subject: `Assistance BagVoyage${name ? ` / ${name}` : ""}`,
          amount: 0,
          participantIds: target.userId ? [target.userId] : [],
          messages: [],
          stage: "discussion",
          pickupCode: "",
          deliveryCode: "",
        };
        store.put({
          ...conversation,
          messages: [
            ...conversation.messages,
            {
              id,
              text: text.trim(),
              mine: false,
              official: true,
              time: new Date(at).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ],
        });
        tx.objectStore("admin_messages").add({
          id,
          conversationId,
          userId: target.userId,
          text: text.trim(),
          createdAt: at,
          author: "Support Officiel BagVoyage",
        });
      };
    };
    if (target.userId) {
      const req = tx.objectStore("users").get(target.userId);
      req.onsuccess = () => {
        if (!req.result) tx.abort();
        else write(req.result.name);
      };
    } else write();
  });
}
export async function reviewProApplication(
  id: string,
  outcome: "approved" | "rejected",
  reason: string,
) {
  if (outcome === "rejected" && !reason.trim())
    throw new Error("Un motif de rejet est obligatoire.");
  await mutate(["pro_applications", "users"], (tx) => {
    const store = tx.objectStore("pro_applications");
    const req = store.get(id);
    req.onsuccess = () => {
      const application: ProApplication | undefined = req.result;
      if (
        !application ||
        application.status !== "pending" ||
        (outcome === "approved" &&
          (!["registry", "license", "insurance", "identity"].every(
            (key) =>
              application.documents[key as keyof ProApplication["documents"]]
                ?.data,
          ) ||
            !application.fleet.length))
      ) {
        tx.abort();
        return;
      }
      const userReq = tx.objectStore("users").get(application.userId);
      userReq.onsuccess = () => {
        if (!userReq.result) {
          tx.abort();
          return;
        }
        store.put({
          ...application,
          status: outcome,
          reason: reason.trim(),
          reviewedAt: new Date().toISOString(),
        });
        tx.objectStore("users").put({
          ...userReq.result,
          proVerified: outcome === "approved",
          companyName: application.companyName,
          siret: application.registration,
        });
      };
    };
  });
}
export async function reviewKyc(id: string, approve: boolean, reason: string) {
  if (!approve && !reason.trim())
    throw new Error("Un motif de rejet est obligatoire.");
  await mutate(["kyc_records", "users"], (tx) => {
    const store = tx.objectStore("kyc_records");
    const req = store.get(id);
    req.onsuccess = () => {
      const record: KycRecord | undefined = req.result;
      if (
        !record ||
        record.status !== "pending" ||
        (approve && (record.documents?.length || 0) < 2)
      ) {
        tx.abort();
        return;
      }
      const userReq = tx.objectStore("users").get(record.userId);
      userReq.onsuccess = () => {
        if (!userReq.result) {
          tx.abort();
          return;
        }
        const status = approve ? "verified" : "unverified";
        store.put({
          ...record,
          status,
          reason,
          updatedAt: new Date().toISOString(),
        });
        tx.objectStore("users").put({ ...userReq.result, kycStatus: status });
      };
    };
  });
}
export async function resolveEscrow(
  id: string,
  outcome: "release" | "refund",
  reason: string,
) {
  if (!reason.trim())
    throw new Error("Expliquez la décision avant de la confirmer.");
  await mutate(["conversations", "wallet_transactions"], (tx) => {
    const store = tx.objectStore("conversations");
    const req = store.get(id);
    req.onsuccess = () => {
      const conversation: Conversation | undefined = req.result;
      if (
        !conversation ||
        !["secured", "collected"].includes(conversation.stage) ||
        conversation.resolution
      ) {
        tx.abort();
        return;
      }
      const at = new Date().toISOString();
      store.put({
        ...conversation,
        resolution: { outcome, reason, at },
        messages: [
          ...conversation.messages,
          {
            id: crypto.randomUUID(),
            official: true,
            mine: false,
            time: new Date(at).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            text: `${outcome === "release" ? "Déblocage en faveur du voyageur" : "Remboursement de l’expéditeur"} enregistré dans le registre local. Motif : ${reason}. Aucun mouvement bancaire.`,
          },
        ],
      });
      tx.objectStore("wallet_transactions").put({
        id: `deposit-${id}`,
        title: `Caution · ${conversation.subject}`,
        detail: reason,
        at,
        cents: Math.round(conversation.amount * 100),
        status: outcome === "release" ? "Débloqué" : "Remboursé",
      });
    };
  });
}
