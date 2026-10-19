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
        <span /> Espace de démonstration · aucun mouvement d’argent réel
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
            <Landmark size={14} /> SEPA instantané · simulation sans frais
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
              Protection Stripe Escrow{" "}
              <small>Parcours simulé · aucun séquestre Stripe réel</small>
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
            <p>Historique des transactions et reçus de démonstration.</p>
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
                title="Télécharger le reçu de démonstration (.txt)"
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
        "Saisissez un IBAN valide d’un pays pris en charge pour cette simulation SEPA.",
      );
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
          <h3>Virement simulé avec succès</h3>
          <strong>{money(-receipt.cents)}</strong>
          <p>
            Vers le compte {masked}. Votre solde de démonstration et votre
            historique ont été mis à jour.
          </p>
          <p className="muted">Aucun argent réel n’a été transféré.</p>
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
              detail: `Compte bancaire ${masked} · simulation`,
              at: new Date().toISOString(),
              cents: -cents,
              status: "Virement",
            };
            onTransfer(transaction);
            setReceipt(transaction);
          }}
        >
          <p className="finance-demo">
            Simulation uniquement · aucun débit bancaire
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
                  <dt>Frais simulés</dt>
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
                  onChange={(e) => setIban(e.target.value)}
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
                Utiliser un IBAN de démonstration
              </button>
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
            {review ? "Confirmer le virement simulé" : "Vérifier le virement"}
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
