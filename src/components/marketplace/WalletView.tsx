import { useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Check,
  Download,
  Landmark,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Dialog } from "./Dialog";
import {
  downloadReceipt,
  money,
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
  const [transferOpen, setTransferOpen] = useState(false);
  const [filter, setFilter] = useState<TransactionStatus | "Tout">("Tout");
  const visible = transactions.filter(
    (t) => filter === "Tout" || t.status === filter,
  );
  return (
    <section className="wallet-page">
      <div className="page-intro wallet-intro">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 text-[11px] font-extrabold uppercase tracking-wider">
            <Wallet size={13} /> SÉQUESTRE STRIPE CONNECT & FINTECH CERTIFIÉE
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 text-[10px] font-bold">
            <ShieldCheck size={12} /> Norme eIDAS 100 % Garanti
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Mon Portefeuille Sécurisé
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mt-1.5">
          Vos gains immédiatement disponibles pour virement bancaire SEPA et vos fonds protégés sous séquestre certifié jusqu'à validation de la remise.
        </p>
      </div>
      <p className="finance-demo">
        <span /> Registre cryptographique BagVoyage · synchronisé sur votre profil certifié
      </p>
      <div className="wallet-overview">
        <section className="wallet-balance" aria-label="Solde disponible">
          <div className="wallet-card-top">
            <span>Solde Immédiatement Disponible</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Paiement SEPA Prêt
            </span>
          </div>
          <strong className="wallet-amount" data-testid="available-balance">
            {money(available)}
          </strong>
          <p>Fonds validés prêts pour virement bancaire immédiat vers votre compte IBAN (zéro frais cachés).</p>
          <button
            className="wallet-transfer-button"
            onClick={() => setTransferOpen(true)}
            disabled={available <= 0}
            title={available <= 0 ? "Aucun solde disponible à virer actuellement" : "Effectuer un virement SEPA vers mon IBAN"}
          >
            <ArrowUpRight size={18} strokeWidth={2.5} />
            {available > 0 ? "Virer vers mon IBAN / Compte Bancaire" : "Aucun solde à virer (0,00 €)"}
          </button>
          <small>
            <Landmark size={14} /> Virement SEPA Instantané · France, Algérie, UE &amp; International
          </small>
        </section>
        <section
          className="wallet-escrow"
          aria-label="Fonds sous séquestre actifs"
        >
          <div className="wallet-card-top">
            <span>Fonds Sous Séquestre Protégés</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              <LockKeyhole size={11} />
              Garantie Stripe Escrow
            </span>
          </div>
          <strong className="wallet-amount" data-testid="escrow-balance">
            {money(escrow)}
          </strong>
          <p>Consignés sous séquestre bancaire inviolable. Débloqués automatiquement dès validation de la livraison par code PIN.</p>
          <div className="escrow-provider">
            <ShieldCheck size={22} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <span className="block font-bold text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
                Garantie Bancaire &amp; Convention de Montréal
              </span>
              <small className="block text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300 mt-1">
                Colis et achats couverts jusqu'à 1 500 € par trajet. Vos fonds sont immobilisés sur un compte de cantonnement agréé ACPR / Banque de France.
              </small>
            </div>
          </div>
        </section>
      </div>
      <section className="wallet-cash" aria-labelledby="cash-title">
        <span className="finance-icon shrink-0">
          <Banknote size={26} />
        </span>
        <div className="space-y-2">
          <h2 id="cash-title" className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            Protocole Remise en Mains Propres &amp; Espèces
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Pour les paiements convenus en espèces lors de la rencontre, le montant est réglé en direct lors de la remise physique. Votre caution reste strictement protégée sous séquestre pendant toute la durée du vol ou de la traversée, puis vous est restituée instantanément dès que le destinataire transmet son code secret PIN ou scanne le QR code dynamique.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-200/60 dark:border-blue-800/60">
              <QrCode size={14} /> Scan Bilatéral Obligatoire
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
              <ShieldCheck size={14} /> Caution Protégée de Bout en Bout
            </span>
          </div>
        </div>
      </section>
      <section className="wallet-history" aria-labelledby="history-title">
        <div className="wallet-history-heading">
          <div>
            <h2 id="history-title">Votre activité</h2>
            <p>Historique de vos opérations et de leurs justificatifs.</p>
          </div>
          <span>{transactions.length} opérations</span>
        </div>
        <div
          className="transaction-filters"
          role="group"
          aria-label="Filtrer les transactions"
        >
          {(["Tout", "Séquestré", "Débloqué", "Virement", "Remboursé"] as const).map(
            (status) => (
              <button
                key={status}
                aria-pressed={filter === status}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ),
          )}
        </div>
        <ul
          className="transaction-list"
          aria-label="Historique des transactions"
        >
          {visible.map((t) => (
            <li key={t.id} className="transaction-row">
              <span
                className={`finance-icon ${t.status === "Séquestré" ? "held" : t.status === "Débloqué" ? "released" : ""}`}
                aria-hidden="true"
              >
                {t.status === "Séquestré" ? (
                  <LockKeyhole size={19} />
                ) : t.status === "Virement" ? (
                  <ArrowUpRight size={19} />
                ) : (
                  <ArrowDownLeft size={19} />
                )}
              </span>
              <div className="transaction-description">
                <h3>{t.title}</h3>
                <p>{t.detail}</p>
                <time dateTime={t.at}>
                  {new Date(t.at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
              <div className="transaction-value">
                <strong>
                  {t.status === "Débloqué" ? "+" : ""}
                  {money(t.cents)}
                </strong>
                <span
                  className={`transaction-status ${t.status === "Séquestré" ? "held" : t.status === "Débloqué" ? "released" : ""}`}
                >
                  {t.status}
                </span>
              </div>
              <button
                className="icon-button receipt-button"
                aria-label={`Télécharger le reçu de ${t.title}`}
                title="Télécharger le relevé de l’opération (.txt)"
                onClick={() => downloadReceipt(t)}
              >
                <Download size={18} />
              </button>
            </li>
          ))}
        </ul>
        {!visible.length && (
          <p className="empty-state">
            Aucune transaction dans cette catégorie.
          </p>
        )}
      </section>
      {transferOpen && (
        <TransferDialog
          available={available}
          userIban={userIban}
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
    <Dialog title="Virement Bancaire Immédiat (SEPA / Maghreb)" onClose={onClose}>
      {receipt ? (
        <div className="transfer-success" role="status">
          <span className="finance-icon released">
            <Check size={28} />
          </span>
          <h3>Demande de virement enregistrée</h3>
          <strong>{money(-receipt.cents)}</strong>
          <p>
            Vers le compte {masked}. Votre solde et votre historique ont été mis
            à jour.
          </p>
          <p className="muted">
            En attente de transmission au prestataire bancaire.
          </p>
          <button
            className="outline-button"
            onClick={() => downloadReceipt(receipt)}
          >
            <Download size={17} /> Télécharger le reçu
          </button>
          <button className="primary-button" onClick={onClose}>
            Terminer
          </button>
        </div>
      ) : (
        <form
          className="publish-form transfer-form"
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
            className="metallic-virtual-card"
            aria-label="Aperçu de votre compte destinataire"
          >
            <div className="metallic-card-heading">
              <strong>BagVoyage</strong>
              <span>COMPTE DESTINATAIRE</span>
            </div>
            <span className="metallic-watermark" aria-hidden="true">
              BV
            </span>
            <svg
              className="emv-chip"
              width="48"
              height="38"
              viewBox="0 0 48 38"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="chip-gold">
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
                fill="url(#chip-gold)"
              />
              <g fill="none" stroke="#826634" strokeWidth="1">
                <rect x="16" y="8" width="16" height="22" rx="4" />
                <path d="M0 12h16M0 26h16M32 12h16M32 26h16M24 0v8M24 30v8" />
              </g>
            </svg>
            <div className="metallic-iban" aria-label="Coordonnées saisies">
              {(() => {
                const chunks = cleanAccount.match(/.{1,4}/g) || [];
                const blocks = [...chunks];
                while (blocks.length < 4) blocks.push("----");
                return blocks.slice(0, 7).map((block, index) => (
                  <span key={index}>{block}</span>
                ));
              })()}
            </div>
            <div className="metallic-card-footer">
              <span>{cleanAccount.length === 20 && !cleanAccount.startsWith("DZ") ? "RIB ALGÉRIE (20D)" : "VIREMENT SEPA"}</span>
              <span>
                <ShieldCheck size={14} />
                {isAccountValid ? "Format compte vérifié" : "Coordonnées à renseigner"}
              </span>
            </div>
          </div>
          <p className="finance-demo">
            Préparez votre virement · transmission bancaire à activer
          </p>
          {review ? (
            <>
              <h3>Vérifier votre virement</h3>
              <dl className="deal-summary">
                <div>
                  <dt>Compte destinataire</dt>
                  <dd>{masked}</dd>
                </div>
                <div>
                  <dt>Montant</dt>
                  <dd>{money(cents)}</dd>
                </div>
                <div>
                  <dt>Frais estimés</dt>
                  <dd>0,00 €</dd>
                </div>
                <div>
                  <dt>Solde après virement</dt>
                  <dd>{money(available - cents)}</dd>
                </div>
              </dl>
              <button
                className="outline-button"
                type="button"
                onClick={() => setReview(false)}
              >
                Modifier
              </button>
            </>
          ) : (
            <>
              <label>
                IBAN du compte bancaire
                <input
                  autoComplete="off"
                  spellCheck={false}
                  value={iban}
                  onChange={(e) => setIban(e.target.value.toUpperCase())}
                  placeholder="FR76 3000 6000 0112 3456 7890 189"
                  aria-invalid={!!error}
                  aria-describedby={error ? "transfer-error" : undefined}
                />
              </label>
              <label>
                Code BIC/SWIFT
                <input
                  value={bic}
                  onChange={(e) =>
                    setBic(e.target.value.toUpperCase().replace(/\s/g, ""))
                  }
                  maxLength={11}
                  placeholder="Ex. AGRIFRPP"
                  autoComplete="off"
                />
                <small>Facultatif pour les virements SEPA.</small>
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
              <label>
                Montant du virement (€)
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  aria-describedby="transfer-available"
                />
              </label>
              <p className="muted" id="transfer-available">
                Disponible : {money(available)}
              </p>
            </>
          )}
          {error && (
            <p className="form-error" id="transfer-error" role="alert">
              {error}
            </p>
          )}
          <button className="primary-button" type="submit">
            <ArrowUpRight size={18} />
            {review
              ? "Confirmer la demande de virement"
              : "Vérifier le virement"}
          </button>
          <p className="muted">
            L’IBAN complet n’est pas conservé. Seuls ses quatre derniers
            caractères figurent dans le reçu.
          </p>
        </form>
      )}
    </Dialog>
  );
}
