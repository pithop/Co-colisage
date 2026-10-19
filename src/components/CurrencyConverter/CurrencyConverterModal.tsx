import { useId, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowDownUp,
  ArrowLeftRight,
  Landmark,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";
import { useModalFocus } from "../../hooks/useModalFocus";

const rates = { square: 242.5, official: 145.8 } as const;
type Currency = "EUR" | "DZD";
const amounts = [
  [20, "parfum"],
  [50, "colis standard"],
  [100, "cadeau"],
  [250, "high-tech"],
  [500, "smartphone"],
] as const;
const dinars = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });

export function CurrencyRatePill({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="currency-rate-pill"
      onClick={onClick}
      aria-haspopup="dialog"
    >
      <TrendingUp size={15} aria-hidden="true" />
      <span>1 EUR = 242.50 DZD · Square Port-Saïd</span>
    </button>
  );
}

export function CurrencyConverterModal({ onClose }: { onClose: () => void }) {
  const ref = useModalFocus(true, onClose);
  const id = useId();
  const [mode, setMode] = useState<keyof typeof rates>("square");
  const [reversed, setReversed] = useState(false);
  const [entry, setEntry] = useState<{ currency: Currency; value: string }>({
    currency: "EUR",
    value: "100",
  });
  const rate = rates[mode];
  const numeric = Number(entry.value.replace(",", "."));
  const valid = entry.value !== "" && Number.isFinite(numeric) && numeric >= 0;
  const euros = valid
    ? entry.currency === "EUR"
      ? numeric
      : numeric / rate
    : 0;
  const valueFor = (currency: Currency) =>
    currency === entry.currency
      ? entry.value
      : valid
        ? (currency === "EUR" ? euros : euros * rate).toFixed(2)
        : "";
  const currencies: Currency[] = reversed ? ["DZD", "EUR"] : ["EUR", "DZD"];
  return createPortal(
    <div
      className="market-dialog-backdrop currency-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="currency-modal"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-reference`}
      >
        <header className="currency-heading">
          <span className="currency-emblem">
            <ArrowLeftRight size={24} aria-hidden="true" />
          </span>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Fermer le convertisseur"
          >
            <X size={21} />
          </button>
        </header>
        <p className="currency-eyebrow">
          FRANCE <ArrowLeftRight size={13} aria-hidden="true" /> ALGÉRIE
        </p>
        <h2 id={`${id}-title`}>
          Deux rives.
          <br />
          <span>Une valeur claire.</span>
        </h2>
        <p id={`${id}-reference`} className="currency-reference">
          Comparez vos euros et vos dinars. Taux de référence fixes, non
          actualisés en direct.
        </p>
        <label className="currency-mode">
          Mode de conversion
          <select
            value={mode}
            onChange={(event) =>
              setMode(event.target.value as keyof typeof rates)
            }
          >
            <option value="square">Taux Marché Square (242.50 DZD)</option>
            <option value="official">
              Taux Officiel Banque d'Algérie (145.80 DZD)
            </option>
          </select>
        </label>
        <div className="currency-fields">
          {currencies.map((currency, index) => (
            <div key={currency}>
              {index === 1 && (
                <button
                  type="button"
                  className="currency-swap"
                  aria-label="Inverser EUR et DZD"
                  onClick={() => setReversed((current) => !current)}
                >
                  <ArrowDownUp size={18} />
                </button>
              )}
              <label className="currency-amount">
                <span>
                  {currency === "EUR" ? "Euros" : "Dinars algériens"}
                  <strong>{currency}</strong>
                </span>
                <input
                  aria-label={`Montant en ${currency}`}
                  inputMode="decimal"
                  autoComplete="off"
                  maxLength={15}
                  value={valueFor(currency)}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (/^\d*(?:[.,]\d{0,2})?$/.test(value))
                      setEntry({ currency, value });
                  }}
                />
              </label>
            </div>
          ))}
        </div>
        <div
          className="currency-presets"
          role="group"
          aria-label="Montants rapides en euros"
        >
          {amounts.map(([amount, purpose]) => (
            <button
              type="button"
              key={amount}
              onClick={() =>
                setEntry({ currency: "EUR", value: String(amount) })
              }
            >
              <strong>{amount} EUR</strong>
              <span>{purpose}</span>
            </button>
          ))}
        </div>
        <div
          className="currency-comparison"
          aria-live="polite"
          aria-atomic="true"
        >
          <TrendingUp size={22} aria-hidden="true" />
          <div>
            <strong>
              +{((rates.square / rates.official - 1) * 100).toFixed(1)}% de
              pouvoir d’achat
            </strong>
            <p>
              Écart Square / officiel :{" "}
              {dinars.format(euros * (rates.square - rates.official))} DZD pour{" "}
              {dinars.format(euros)} EUR.
            </p>
          </div>
        </div>
        <div className="currency-escrow">
          <ShieldCheck size={21} aria-hidden="true" />
          <div>
            <h3>Votre accord, sécurisé en euros</h3>
            <p>
              Séquestre en ligne sécurisé Stripe en EUR. Règlement espèces en
              DZD possible à l’arrivée uniquement après validation mutuelle du
              QR code / PIN.
            </p>
          </div>
        </div>
        <p className="currency-footnote">
          <Landmark size={14} aria-hidden="true" /> Comparateur indicatif, sans
          opération de change.
        </p>
      </div>
    </div>,
    document.body,
  );
}
