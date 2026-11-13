import { useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  Landmark,
  LockKeyhole,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Dialog } from "./Dialog";
import {
  downloadReceipt,
  money,
  validAlgerianRib,
  validBankDetails,
  validIban,
  walletBalances,
  type WalletTransaction,
  type TransactionStatus,
} from "../../data/wallet";

export function WalletView({
  transactions,
  onTransfer,
  userIban,
}: {
  transactions: WalletTransaction[];
  onTransfer: (transaction: WalletTransaction) => void;
  userIban?: string;
}) {
  const { available, escrow } = walletBalances(transactions);
  const totalGains = transactions
    .filter((t) => t.status === "Débloqué")
    .reduce((sum, t) => sum + Math.max(0, t.cents), 0);

  const [transferOpen, setTransferOpen] = useState(false);
  const [filter, setFilter] = useState<TransactionStatus | "Tout">("Tout");
  const [bankInput, setBankInput] = useState(
    userIban || "FR76 3000 6000 0112 3456 7890 189",
  );

  const cleanBank = bankInput.replace(/[\s-]/g, "").toUpperCase();
  const isRib20 = validAlgerianRib(cleanBank);
  const isIbanValid = validIban(cleanBank);
  const isBankValid = validBankDetails(cleanBank);
  const digitsOnly = cleanBank.replace(/\D/g, "");

  const formattedBlocks = (() => {
    const chunks = cleanBank.match(/.{1,4}/g) || [];
    const blocks = [...chunks];
    while (blocks.length < 5) blocks.push("••••");
    return blocks.slice(0, 7);
  })();

  const visible = transactions.filter(
    (t) => filter === "Tout" || t.status === filter,
  );

  return (
    <section className="min-h-screen bg-[#F8FAFC] text-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* En-tête Néo-banque */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] text-xs font-bold text-slate-700 mb-3">
              <ShieldCheck size={14} className="text-[#059669]" />
              Portefeuille Séquestre &amp; Virements SEPA / RIB
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Mon Portefeuille
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Gérez vos fonds disponibles, vos cautions sous séquestre et vos virements instantanés.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTransferOpen(true)}
            disabled={available <= 0}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold transition-colors cursor-pointer disabled:cursor-not-allowed tabular-nums"
          >
            <ArrowUpRight size={18} />
            {available > 0
              ? `Virer ${money(available)}`
              : "Aucun solde à virer (0,00 €)"}
          </button>
        </header>

        {/* Carte virtuelle métallique sombre #0F172A en haut + Validation RIB/IBAN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Carte virtuelle métallique #0F172A */}
          <div
            className="lg:col-span-7 bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg flex flex-col justify-between relative overflow-hidden tabular-nums"
            aria-label="Carte virtuelle métallique BagVoyage"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white font-black text-sm">
                  BV
                </span>
                <div>
                  <span className="block text-xs font-bold tracking-wider uppercase text-slate-300">
                    BagVoyage Metal
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    Escrow &amp; Payouts Multi-Corridors
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#059669]/20 border border-[#059669]/40 text-[#059669] text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                {isRib20
                  ? "RIB 20 chiffres"
                  : isIbanValid
                    ? "IBAN SEPA"
                    : "Compte actif"}
              </span>
            </div>

            <div className="my-6 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                  Solde immédiatement disponible
                </span>
                <strong className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1 block tabular-nums">
                  {money(available)}
                </strong>
              </div>
              <svg
                width="46"
                height="36"
                viewBox="0 0 48 38"
                aria-hidden="true"
                className="shrink-0 opacity-90"
              >
                <defs>
                  <linearGradient id="wallet-chip-gold">
                    <stop stopColor="#eddcb1" />
                    <stop offset="1" stopColor="#ab8649" />
                  </linearGradient>
                </defs>
                <rect
                  x="1"
                  y="1"
                  width="46"
                  height="36"
                  rx="8"
                  fill="url(#wallet-chip-gold)"
                />
                <g fill="none" stroke="#826634" strokeWidth="1">
                  <rect x="16" y="8" width="16" height="22" rx="4" />
                  <path d="M0 12h16M0 26h16M32 12h16M32 26h16M24 0v8M24 30v8" />
                </g>
              </svg>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <div
                className="flex flex-wrap items-center gap-2 font-mono text-sm sm:text-base tracking-widest text-slate-200 tabular-nums"
                aria-label="Aperçu du compte bancaire rattaché"
              >
                {formattedBlocks.map((block, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-md bg-white/5 border border-white/10"
                  >
                    {block}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Landmark size={14} className="text-slate-300" />
                  Virement SEPA &amp; Maghreb sans frais cachés
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-bold ${
                    isBankValid ? "text-[#059669]" : "text-amber-400"
                  }`}
                >
                  <ShieldCheck size={14} />
                  {isRib20
                    ? "RIB 20 chiffres vérifié"
                    : isIbanValid
                      ? "IBAN vérifié (Mod 97)"
                      : "Format à compléter"}
                </span>
              </div>
            </div>
          </div>

          {/* Carte Validation visuelle instantanée du RIB 20 chiffres / IBAN */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between gap-4 tabular-nums">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <CreditCard size={14} className="text-slate-700" />
                  Compte de versement
                </span>
                {isBankValid ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#059669]/10 text-[#059669] text-xs font-bold">
                    <CheckCircle2 size={13} />
                    {isRib20 ? "RIB 20 chiffres valide" : "IBAN valide"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold tabular-nums">
                    {/^\d+$/.test(cleanBank)
                      ? `${digitsOnly.length} / 20 chiffres`
                      : `${cleanBank.length} caractères`}
                  </span>
                )}
              </div>
              <h2 className="text-base font-extrabold text-slate-900">
                Validation instantanée RIB 20 chiffres / IBAN
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Saisissez un RIB bancaire à 20 chiffres (Algérie / Maghreb) ou un IBAN européen (FR, ES, DE, IT…) pour vérifier instantanément vos coordonnées.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-bold text-slate-700 block mb-1.5">
                  Numéro RIB (20 chiffres) ou IBAN
                </span>
                <input
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  value={bankInput}
                  onChange={(e) => setBankInput(e.target.value.toUpperCase())}
                  placeholder="Ex: 00799999000123456789 ou FR76..."
                  aria-label="Numéro RIB 20 chiffres ou IBAN"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono tabular-nums outline-none transition-colors ${
                    isBankValid
                      ? "border-[#059669] bg-[#059669]/5 text-slate-900"
                      : "border-[#E2E8F0] bg-[#F8FAFC] text-slate-900 focus:border-[#2563EB]"
                  }`}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setBankInput("00799999000123456789")}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 cursor-pointer tabular-nums"
                >
                  Tester RIB 20 chiffres
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setBankInput("FR76 3000 6000 0112 3456 7890 189")
                  }
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 cursor-pointer tabular-nums"
                >
                  Tester IBAN FR
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
              <div className="text-xs">
                {isRib20 ? (
                  <span className="font-bold text-[#059669]">
                    ✓ Format RIB national 20 chiffres certifié
                  </span>
                ) : isIbanValid ? (
                  <span className="font-bold text-[#059669]">
                    ✓ Clé IBAN ISO-13616 (Modulo 97) certifiée
                  </span>
                ) : (
                  <span className="text-slate-500">
                    Attendu : 20 chiffres (RIB) ou IBAN valide
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setTransferOpen(true)}
                disabled={available <= 0}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                Virer
              </button>
            </div>
          </div>
        </div>

        {/* 3 KPI alignés sur une grille propre (Disponible, Séquestre, Gains totaux) en tabular-nums */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 tabular-nums"
          aria-label="Indicateurs financiers du portefeuille"
        >
          {/* KPI 1 : Disponible */}
          <section
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col justify-between gap-3"
            aria-label="Solde disponible"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Disponible
              </span>
              <span className="w-8 h-8 rounded-xl bg-[#059669]/10 text-[#059669] flex items-center justify-center">
                <Wallet size={16} />
              </span>
            </div>
            <strong
              className="text-2xl sm:text-3xl font-extrabold text-[#059669] tracking-tight tabular-nums"
              data-testid="available-balance"
            >
              {money(available)}
            </strong>
            <p className="text-xs text-slate-500">
              Prêt pour virement immédiat vers votre RIB ou IBAN.
            </p>
          </section>

          {/* KPI 2 : Séquestre */}
          <section
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col justify-between gap-3"
            aria-label="Fonds sous séquestre actifs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Séquestre
              </span>
              <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <LockKeyhole size={16} />
              </span>
            </div>
            <strong
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums"
              data-testid="escrow-balance"
            >
              {money(escrow)}
            </strong>
            <p className="text-xs text-slate-500">
              Fonds protégés débloqués dès validation du code PIN à 4 chiffres.
            </p>
          </section>

          {/* KPI 3 : Gains totaux */}
          <section
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col justify-between gap-3"
            aria-label="Gains totaux cumulés"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Gains totaux
              </span>
              <span className="w-8 h-8 rounded-xl bg-[#059669]/10 text-[#059669] flex items-center justify-center">
                <TrendingUp size={16} />
              </span>
            </div>
            <strong
              className="text-2xl sm:text-3xl font-extrabold text-[#059669] tracking-tight tabular-nums"
              data-testid="total-gains-balance"
            >
              {money(totalGains)}
            </strong>
            <p className="text-xs text-slate-500">
              Cumul des rémunérations débloquées sur vos missions livrées.
            </p>
          </section>
        </div>

        {/* Historique de transactions aéré dans des cartes #FFFFFF (1px solid #E2E8F0, rounded-2xl) */}
        <section className="space-y-4 pt-2" aria-labelledby="history-title">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2
                id="history-title"
                className="text-lg font-extrabold text-slate-900"
              >
                Historique des transactions
              </h2>
              <p className="text-xs text-slate-500">
                Toutes vos opérations séquestrées, débloquées et virements bancaires ({transactions.length} opérations).
              </p>
            </div>
            <div
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-label="Filtrer les transactions"
            >
              {(
                ["Tout", "Séquestré", "Débloqué", "Virement", "Remboursé"] as const
              ).map((status) => (
                <button
                  key={status}
                  type="button"
                  aria-pressed={filter === status}
                  onClick={() => setFilter(status)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    filter === status
                      ? "bg-[#0F172A] text-white border-[#0F172A]"
                      : "bg-[#FFFFFF] text-slate-600 border-[#E2E8F0] hover:bg-slate-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <ul
            className="space-y-3 list-none p-0 m-0"
            aria-label="Historique des transactions"
          >
            {visible.map((t) => {
              const isReleased = t.status === "Débloqué";
              const isHeld = t.status === "Séquestré";
              return (
                <li
                  key={t.id}
                  className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 tabular-nums"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isReleased
                          ? "bg-[#059669]/10 text-[#059669]"
                          : isHeld
                            ? "bg-slate-100 text-slate-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                      aria-hidden="true"
                    >
                      {isHeld ? (
                        <LockKeyhole size={18} />
                      ) : t.status === "Virement" ? (
                        <ArrowUpRight size={18} />
                      ) : (
                        <ArrowDownLeft size={18} />
                      )}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {t.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{t.detail}</p>
                      <time
                        dateTime={t.at}
                        className="block text-[11px] text-slate-400 mt-1 tabular-nums"
                      >
                        {new Date(t.at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2E8F0]">
                    <div className="text-left sm:text-right">
                      <strong
                        className={`block text-base font-extrabold tabular-nums ${
                          isReleased ? "text-[#059669]" : "text-slate-900"
                        }`}
                      >
                        {isReleased ? "+" : ""}
                        {money(t.cents)}
                      </strong>
                      <span
                        className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isReleased
                            ? "bg-[#059669]/10 text-[#059669]"
                            : isHeld
                              ? "bg-slate-100 text-slate-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="w-9 h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      aria-label={`Télécharger le reçu de ${t.title}`}
                      title="Télécharger le relevé de l’opération (.txt)"
                      onClick={() => downloadReceipt(t)}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {!visible.length && (
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-8 text-center text-sm text-slate-500">
              Aucune transaction dans cette catégorie.
            </div>
          )}
        </section>
      </div>

      {transferOpen && (
        <TransferDialog
          available={available}
          userIban={bankInput || userIban}
          onClose={() => setTransferOpen(false)}
          onTransfer={onTransfer}
        />
      )}
    </section>
  );
}

function TransferDialog({
  available,
  userIban,
  onClose,
  onTransfer,
}: {
  available: number;
  userIban?: string;
  onClose: () => void;
  onTransfer: (transaction: WalletTransaction) => void;
}) {
  const [iban, setIban] = useState(userIban || "");
  const [bic, setBic] = useState("");
  const [amount, setAmount] = useState((available / 100).toFixed(2));
  const [error, setError] = useState("");
  const [review, setReview] = useState(false);
  const [receipt, setReceipt] = useState<WalletTransaction | null>(null);
  const submitted = useRef(false);
  const cents = Math.round(Number(amount.replace(",", ".")) * 100);
  const cleanAccount = iban.replace(/[\s-]/g, "").toUpperCase();
  const masked = cleanAccount ? `•••• ${cleanAccount.slice(-4)}` : "•••• ----";
  const isRib20 = validAlgerianRib(cleanAccount);
  const isIbanValid = validIban(cleanAccount);
  const isAccountValid = validBankDetails(iban);

  const validate = () => {
    if (!isAccountValid) {
      setError(
        "Saisissez un IBAN valide ou un RIB bancaire à 20 chiffres (Algérie, France, UE & Maghreb).",
      );
      return false;
    }
    if (bic && !/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(bic)) {
      setError("Saisissez un code BIC/SWIFT de 8 ou 11 caractères.");
      return false;
    }
    if (
      !/^\d+(?:[.,]\d{1,2})?$/.test(amount) ||
      !Number.isSafeInteger(cents) ||
      cents <= 0 ||
      cents > available
    ) {
      setError(
        `Le montant doit être compris entre 0,01 € et ${money(available)}.`,
      );
      return false;
    }
    setError("");
    return true;
  };

  return (
    <Dialog
      title="Virement Bancaire Immédiat (SEPA / Maghreb)"
      onClose={onClose}
    >
      {receipt ? (
        <div
          className="transfer-success space-y-4 text-center tabular-nums"
          role="status"
        >
          <span className="w-14 h-14 rounded-full bg-[#059669]/10 text-[#059669] mx-auto flex items-center justify-center">
            <Check size={28} />
          </span>
          <h3 className="text-lg font-extrabold text-slate-900">
            Demande de virement enregistrée
          </h3>
          <strong className="block text-3xl font-black text-[#059669] tabular-nums">
            {money(-receipt.cents)}
          </strong>
          <p className="text-sm text-slate-600">
            Vers le compte {masked}. Votre solde et votre historique ont été mis
            à jour.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-slate-700 text-xs font-bold"
              onClick={() => downloadReceipt(receipt)}
            >
              <Download size={16} /> Télécharger le reçu
            </button>
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
              onClick={onClose}
            >
              Terminer
            </button>
          </div>
        </div>
      ) : (
        <form
          className="publish-form transfer-form space-y-4 tabular-nums"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (submitted.current || !validate()) return;
            if (!review) {
              setReview(true);
              return;
            }
            submitted.current = true;
            const transaction: WalletTransaction = {
              id: crypto.randomUUID(),
              title: "Virement bancaire",
              detail: `Compte ${masked} · demande enregistrée`,
              at: new Date().toISOString(),
              cents: -cents,
              status: "Virement",
            };
            onTransfer(transaction);
            setReceipt(transaction);
          }}
        >
          <div
            className="bg-[#0F172A] text-white rounded-2xl p-5 border border-slate-800 space-y-4 tabular-nums"
            aria-label="Aperçu de votre compte destinataire"
          >
            <div className="flex items-center justify-between text-xs">
              <strong className="uppercase tracking-wider text-slate-300">
                BagVoyage Metal
              </strong>
              <span className="text-[#059669] font-bold">
                {isRib20
                  ? "RIB ALGÉRIE (20 CHIFFRES)"
                  : isIbanValid
                    ? "IBAN SEPA VÉRIFIÉ"
                    : "COMPTE DESTINATAIRE"}
              </span>
            </div>
            <div
              className="flex flex-wrap gap-2 font-mono text-sm text-slate-100 tabular-nums"
              aria-label="Coordonnées saisies"
            >
              {(() => {
                const chunks = cleanAccount.match(/.{1,4}/g) || [];
                const blocks = [...chunks];
                while (blocks.length < 4) blocks.push("----");
                return blocks.slice(0, 7).map((block, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded bg-white/10 border border-white/10"
                  >
                    {block}
                  </span>
                ));
              })()}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Virement sans frais (0,00 €)</span>
              <span
                className={`inline-flex items-center gap-1 font-bold ${
                  isAccountValid ? "text-[#059669]" : "text-amber-400"
                }`}
              >
                <ShieldCheck size={14} />
                {isAccountValid
                  ? "Format compte vérifié"
                  : "Coordonnées à renseigner"}
              </span>
            </div>
          </div>

          {review ? (
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 space-y-3 tabular-nums">
              <h3 className="text-base font-extrabold text-slate-900">
                Vérifier votre virement
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Compte destinataire</dt>
                  <dd className="font-bold text-slate-900">{masked}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Montant</dt>
                  <dd className="font-extrabold text-[#059669]">
                    {money(cents)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Frais estimés</dt>
                  <dd className="font-bold text-[#059669]">0,00 €</dd>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E2E8F0]">
                  <dt className="text-slate-500">Solde après virement</dt>
                  <dd className="font-bold text-slate-900">
                    {money(available - cents)}
                  </dd>
                </div>
              </dl>
              <button
                className="w-full py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold text-slate-700"
                type="button"
                onClick={() => setReview(false)}
              >
                Modifier
              </button>
            </div>
          ) : (
            <>
              <label className="block space-y-1">
                <span className="text-xs font-bold text-slate-700">
                  IBAN ou RIB à 20 chiffres
                </span>
                <input
                  autoComplete="off"
                  spellCheck={false}
                  value={iban}
                  onChange={(e) => {
                    setIban(e.target.value.toUpperCase());
                    if (error) setError("");
                  }}
                  placeholder="FR76 3000 6000 0112 3456 7890 189 ou RIB 20 chiffres"
                  aria-invalid={!!error}
                  aria-describedby={error ? "transfer-error" : undefined}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-bold text-slate-700">
                  Code BIC/SWIFT (facultatif)
                </span>
                <input
                  value={bic}
                  onChange={(e) =>
                    setBic(e.target.value.toUpperCase().replace(/\s/g, ""))
                  }
                  maxLength={11}
                  placeholder="Ex. AGRIFRPP"
                  autoComplete="off"
                />
              </label>
              <div
                className="quick-withdrawals"
                role="group"
                aria-label="Montants de retrait rapide"
              >
                {[25, 50, 100, 250].map((value) => (
                  <button
                    type="button"
                    key={value}
                    disabled={value * 100 > available}
                    aria-pressed={cents === value * 100}
                    onClick={() => {
                      setAmount(value.toFixed(2));
                      setError("");
                    }}
                  >
                    {value} €
                  </button>
                ))}
                <button
                  type="button"
                  aria-pressed={cents === available}
                  onClick={() => {
                    setAmount((available / 100).toFixed(2));
                    setError("");
                  }}
                >
                  Solde total
                </button>
              </div>
              <label className="block space-y-1">
                <span className="text-xs font-bold text-slate-700">
                  Montant du virement (€)
                </span>
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  aria-describedby="transfer-available"
                />
              </label>
              <p className="text-xs text-slate-500 tabular-nums" id="transfer-available">
                Disponible : <strong className="text-[#059669]">{money(available)}</strong>
              </p>
            </>
          )}
          {error && (
            <p className="form-error" id="transfer-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer"
            type="submit"
          >
            <ArrowUpRight size={18} />
            {review
              ? "Confirmer la demande de virement"
              : "Vérifier le virement"}
          </button>
        </form>
      )}
    </Dialog>
  );
}
