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
  validIban,
  walletBalances,
  type WalletTransaction,
  type TransactionStatus,
} from "../../data/wallet";

export function WalletView({
  transactions,
  onTransfer,
}: {
  transactions: WalletTransaction[];
  onTransfer: (transaction: WalletTransaction) => void;
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
        <span className="eyebrow">
          <Wallet size={15} /> VOTRE ARGENT, EN CLAIR
        </span>
        <h1>Mon portefeuille</h1>
        <p>
          Vos gains disponibles. Vos cautions protégées. Chaque mouvement, au
          même endroit.
        </p>
      </div>
      <p className="finance-demo">
        <span /> Votre activité BagVoyage · registre enregistré sur cet appareil
      </p>
      <div className="wallet-overview">
        <section className="wallet-balance" aria-label="Solde disponible">
          <div className="wallet-card-top">
            <span>Solde disponible</span>
            <Wallet size={22} />
          </div>
          <strong className="wallet-amount" data-testid="available-balance">
            {money(available)}
          </strong>
          <p>Prêt à rejoindre votre compte bancaire.</p>
          <button
            className="wallet-transfer-button"
            onClick={() => setTransferOpen(true)}
            disabled={available <= 0}
          >
            <ArrowUpRight size={18} /> Virer vers mon IBAN / compte bancaire
          </button>
          <small>
            <Landmark size={14} /> Coordonnées SEPA · confirmation bancaire
            requise
          </small>
        </section>
        <section
          className="wallet-escrow"
          aria-label="Fonds sous séquestre actifs"
        >
          <div className="wallet-card-top">
            <span>Fonds sous séquestre actifs</span>
            <LockKeyhole size={22} />
          </div>
          <strong className="wallet-amount" data-testid="escrow-balance">
            {money(escrow)}
          </strong>
          <p>Restitués après validation de la remise.</p>
          <div className="escrow-provider">
            <ShieldCheck size={18} />
            <span>
              Suivi des cautions <small>Prestataire bancaire à connecter</small>
            </span>
          </div>
        </section>
      </div>
      <section className="wallet-cash" aria-labelledby="cash-title">
        <span className="finance-icon">
          <Banknote size={23} />
        </span>
        <div>
          <h2 id="cash-title">Vous payez en espèces à la remise ?</h2>
          <p>
            Le prix convenu est réglé en espèces lors de la remise. Votre
            caution reste bloquée sous séquestre pendant le trajet, puis vous
            est restituée après validation de la livraison par QR code.
          </p>
          <span>
            <QrCode size={15} /> La prise en charge seule ne débloque pas la
            caution.
          </span>
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
          {(["Tout", "Séquestré", "Débloqué", "Virement"] as const).map(
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
          onClose={() => setTransferOpen(false)}
          onTransfer={onTransfer}
        />
      )}
    </section>
  );
}

function TransferDialog({
  available,
  onClose,
  onTransfer,
}: {
  available: number;
  onClose: () => void;
  onTransfer: (transaction: WalletTransaction) => void;
}) {
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [amount, setAmount] = useState((available / 100).toFixed(2));
  const [error, setError] = useState("");
  const [review, setReview] = useState(false);
  const [receipt, setReceipt] = useState<WalletTransaction | null>(null);
  const submitted = useRef(false);
  const cents = Math.round(Number(amount.replace(",", ".")) * 100);
  const masked = `•••• ${iban.replace(/\s/g, "").slice(-4).toUpperCase()}`;
  const validate = () => {
    if (!validIban(iban)) {
      setError(
        "Saisissez un IBAN valide d’un pays pris en charge pour un virement SEPA.",
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
    <Dialog title="Virement SEPA instantané" onClose={onClose}>
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
              title: "Virement SEPA instantané",
              detail: `Compte bancaire ${masked} · demande enregistrée`,
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
              {(
                iban
                  .replace(/\s/g, "")
                  .toUpperCase()
                  .match(/.{1,4}/g) || ["----", "----", "----", "----"]
              ).map((block, index) => (
                <span key={index}>{block}</span>
              ))}
            </div>
            <div className="metallic-card-footer">
              <span>VIREMENT SEPA</span>
              <span>
                <ShieldCheck size={14} />
                {validIban(iban) ? "Format IBAN vérifié" : "IBAN à renseigner"}
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
              <button
                type="button"
                className="transfer-demo-button"
                onClick={() => setIban("FR76 3000 6000 0112 3456 7890 189")}
              >
                Préremplir un exemple d’IBAN
              </button>
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
