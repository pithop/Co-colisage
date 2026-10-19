import type { ConversationData } from "../components/marketplace/Conversation";

export type TransactionStatus = "Séquestré" | "Débloqué" | "Virement";
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

const history: WalletTransaction[] = [
  {
    id: "EP-0144",
    title: "Commission · Paris–Lyon",
    detail: "Remise validée par QR code",
    at: "2026-10-18T14:30:00Z",
    cents: 22000,
    status: "Débloqué",
  },
  {
    id: "EP-0143",
    title: "Commission · Marseille–Alger",
    detail: "Remise validée par QR code",
    at: "2026-10-17T10:00:00Z",
    cents: 12500,
    status: "Débloqué",
  },
  {
    id: "EP-0142",
    title: "Virement SEPA instantané",
    detail: "Compte bancaire •••• 0189 · demande enregistrée",
    at: "2026-10-16T12:00:00Z",
    cents: -10000,
    status: "Virement",
  },
  {
    id: "EP-0141",
    title: "Commission · Paris–Lille",
    detail: "Remise validée par QR code",
    at: "2026-10-15T09:00:00Z",
    cents: 10000,
    status: "Débloqué",
  },
];

// Derive releases from the persisted handover state: visiting the wallet cannot
// release a deposit or credit the same completed delivery twice.
export function walletTransactions(
  conversations: ConversationData[],
  transfers: WalletTransaction[],
) {
  const deposits: WalletTransaction[] = conversations
    .filter((c) => c.id === "nike-air-max" || c.stage !== "discussion")
    .map((c) => ({
      id: `deposit-${c.id}`,
      title: `Caution · ${c.subject}`,
      detail:
        c.stage === "delivered"
          ? "Caution restituée après validation de la livraison"
          : "Caution · en attente de remise validée",
      at:
        c.handovers?.find((h) => h.stage === "delivery")?.at ||
        c.securedAt ||
        "2026-10-19T08:30:00Z",
      cents: Math.round(c.amount * 100),
      status: c.stage === "delivered" ? "Débloqué" : "Séquestré",
    }));
  return [...transfers, ...deposits, ...history].sort((a, b) =>
    b.at.localeCompare(a.at),
  );
}

export function walletBalances(transactions: WalletTransaction[]) {
  return transactions.reduce(
    (balance, t) => {
      if (t.status === "Séquestré") balance.escrow += t.cents;
      else balance.available += t.cents;
      return balance;
    },
    { available: 0, escrow: 0 },
  );
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
