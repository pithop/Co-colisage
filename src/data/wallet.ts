import type { ConversationData } from "../components/marketplace/Conversation";

export type TransactionStatus =
  | "Séquestré"
  | "Débloqué"
  | "Virement"
  | "Remboursé";
export interface WalletTransaction {
  id: string;
  title: string;
  detail: string;
  at: string;
  cents: number;
  status: TransactionStatus;
}

export const money = (cents: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    cents / 100,
  );

const history: WalletTransaction[] = [];

// Derive releases from the persisted handover state: visiting the wallet cannot
// release a deposit or credit the same completed delivery twice.
export function walletTransactions(
  conversations: ConversationData[],
  transfers: WalletTransaction[],
  userRole?: string,
) {
  const isSenderRole = userRole === "expediteur";
  const deposits: WalletTransaction[] = conversations
    .filter((c) => c.stage !== "discussion")
    .map((c) => {
      const isDelivered = c.stage === "delivered";
      const isRefunded = c.resolution?.outcome === "refund";
      const isReleased = c.resolution?.outcome === "release" || isDelivered;
      // Remuneration earned by carrier vs payment escrowed by sender
      const earnings = Math.round((c.serviceAmount || c.amount) * 100);
      const totalEscrow = Math.round(c.amount * 100);

      const status: TransactionStatus = isRefunded
        ? "Remboursé"
        : isReleased
          ? "Débloqué"
          : "Séquestré";

      let detail = "Caution · en attente de remise validée";
      if (c.resolution) {
        detail = `Décision du support : ${c.resolution.reason}`;
      } else if (isDelivered) {
        detail = isSenderRole
          ? "Livraison confirmée · Fonds libérés au voyageur"
          : "Rémunération fret créditée suite à validation de livraison";
      }

      return {
        id: `deposit-${c.id}`,
        title: `${isSenderRole ? "Paiement mission" : "Rémunération fret"} · ${c.subject}`,
        detail,
        at:
          c.resolution?.at ||
          c.handovers?.find((h) => h.stage === "delivery")?.at ||
          c.securedAt ||
          "2026-10-19T08:30:00Z",
        cents: status === "Séquestré" ? totalEscrow : isSenderRole ? 0 : earnings,
        status,
      };
    });
  return [...transfers, ...deposits, ...history].sort((a, b) =>
    b.at.localeCompare(a.at),
  );
}

export function walletBalances(transactions: WalletTransaction[]) {
  const result = transactions.reduce(
    (balance, t) => {
      if (t.status === "Séquestré") {
        balance.escrow += Math.max(0, t.cents);
      } else if (t.status === "Débloqué") {
        balance.available += Math.max(0, t.cents);
      } else if (t.status === "Virement") {
        balance.available += t.cents; // Virement has negative cents
      }
      return balance;
    },
    { available: 0, escrow: 0 },
  );
  result.available = Math.max(0, result.available);
  return result;
}

export function validAlgerianRib(value: string) {
  const rib = value.replace(/[\s-]/g, "");
  return /^\d{20}$/.test(rib);
}

export function validBankDetails(value: string) {
  const clean = value.replace(/[\s-]/g, "").toUpperCase();
  if (/^\d{20}$/.test(clean)) return true;
  return validIban(clean);
}

export function validIban(value: string) {
  const iban = value.replace(/\s/g, "").toUpperCase();
  const lengths: Record<string, number> = {
    FR: 27,
    DE: 22,
    ES: 24,
    IT: 27,
    BE: 16,
    NL: 18,
    PT: 25,
    IE: 22,
    LU: 20,
    AT: 20,
    FI: 18,
    MC: 27,
    GB: 22,
    CH: 21,
    LI: 21,
    GR: 27,
    CY: 28,
    MT: 31,
    EE: 20,
    LV: 21,
    LT: 20,
    SK: 24,
    SI: 19,
    HR: 21,
    BG: 22,
    RO: 24,
    PL: 28,
    CZ: 24,
    HU: 28,
    DK: 18,
    SE: 24,
    NO: 15,
    IS: 26,
    SM: 27,
    AD: 24,
    MA: 28,
    TN: 24,
    DZ: 26,
  };
  if (
    !/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban) ||
    iban.length !== lengths[iban.slice(0, 2)]
  )
    return false;
  const digits = (iban.slice(4) + iban.slice(0, 4)).replace(/[A-Z]/g, (c) =>
    String(c.charCodeAt(0) - 55),
  );
  let remainder = 0;
  for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
  return remainder === 1;
}

export function downloadReceipt(t: WalletTransaction) {
  const content = [
    "BAGVOYAGE",
    "RELEVÉ D’OPÉRATION — SANS VALEUR COMPTABLE",
    "",
    `Référence : ${t.id}`,
    `Date : ${new Date(t.at).toLocaleString("fr-FR")}`,
    `Opération : ${t.title}`,
    `Montant : ${money(t.cents)}`,
    `Statut : ${t.status}`,
    t.detail,
    "",
    "Registre local BagVoyage. Ce relevé ne constitue pas une confirmation bancaire. Le transfert et la conservation de fonds nécessitent un prestataire de paiement connecté.",
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `recu-${t.id}.txt`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
