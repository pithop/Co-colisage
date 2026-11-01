import { useState } from "react";
import {
  Check,
  ExternalLink,
  Landmark,
  Search,
  TriangleAlert,
} from "lucide-react";
import { Dialog } from "../marketplace/Dialog";
import type { TransportContext } from "../../services/transportDocuments";
import {
  customsPolicies,
  hsArticles,
  type CustomsDestination,
} from "../../data/logisticsPolicies";
import { logisticsNumber } from "../../services/logisticsTools";

const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[.\s-]+/g, "");
const destinationFor = (value: string): CustomsDestination =>
  /alg|algérie/i.test(value)
    ? "DZ"
    : /maroc|casablanca|cmn/i.test(value)
      ? "MA"
      : /tun/i.test(value)
        ? "TN"
        : /canada|montréal|yul/i.test(value)
          ? "CA"
          : "EU";

export function CustomsHsClassifierModal({
  context,
  onClose,
}: {
  context: TransportContext;
  onClose: () => void;
}) {
  const [destination, setDestination] = useState<CustomsDestination>(() =>
    destinationFor(context.destination ?? ""),
  );
  const [query, setQuery] = useState("");
  const [article, setArticle] = useState<(typeof hsArticles)[number]>();
  const policy = customsPolicies[destination];
  const [value, setValue] = useState(() =>
    context.currency === policy.currency && context.value !== undefined
      ? String(context.value)
      : "",
  );
  const [used, setUsed] = useState("0");
  const [personal, setPersonal] = useState(false);
  const [rate, setRate] = useState(destination === "DZ" ? "30" : "");
  const [basis, setBasis] = useState<"full" | "excess">("full");
  const [legacyTunisia, setLegacyTunisia] = useState(false);
  const [indivisible, setIndivisible] = useState(true);
  const amount = Number(value),
    prior = Number(used),
    percent = Number(rate);
  const valid =
    value.trim() !== "" &&
    used.trim() !== "" &&
    [amount, prior].every((n) => Number.isFinite(n) && n >= 0 && n <= 10000000);
  const validRate =
    rate.trim() !== "" &&
    Number.isFinite(percent) &&
    percent >= 0 &&
    percent <= 100;
  const allowance =
    destination === "TN" && legacyTunisia ? 2000 : policy.allowance;
  const amountCents = Math.round(amount * 100),
    priorCents = Math.round(prior * 100),
    limitCents = allowance * 100;
  const before = personal ? Math.max(0, limitCents - priorCents) : 0;
  const excessCents = Math.max(0, amountCents - before);
  const indivisibleExcluded =
    destination === "EU" && indivisible && amountCents > before;
  const exemptCents = indivisibleExcluded ? 0 : Math.min(before, amountCents);
  const consumption =
    valid && personal
      ? Math.min(limitCents, priorCents + exemptCents) / 100
      : 0;
  const remaining =
    valid && personal ? Math.max(0, before - exemptCents) / 100 : 0;
  const fullBase =
    !personal ||
    (destination === "EU" && indivisible) ||
    (destination === "DZ" && basis === "full");
  const taxable =
    valid && excessCents > 0 ? (fullBase ? amountCents : excessCents) / 100 : 0;
  const tax =
    valid && article && (taxable === 0 || validRate)
      ? Math.round(taxable * (validRate ? percent : 0)) / 100
      : null;
  const results = hsArticles.filter((item) =>
    normalizeSearch(`${item.name} ${item.code} ${item.keywords}`).includes(
      normalizeSearch(query),
    ),
  );
  const money = (n: number) => `${logisticsNumber(n)} ${policy.currency}`;
  return (
    <Dialog title="Douane SH" onClose={onClose} wide>
      <div className="bv-logistics-tool">
        <div className="bv-tool-intro">
          <span className="bv-tool-badge">
            <Landmark size={15} /> CLASSIFICATION & FRANCHISE
          </span>
          <p>Déclarer avec les bonnes références.</p>
          <small>Estimation en devise locale, sans conversion implicite.</small>
        </div>
        <label className="bv-hs-search">
          <Search size={18} />
          <span className="sr-only">Rechercher un article ou un code SH</span>
          <input
            type="search"
            placeholder="Smartphone, parfum, 8517.13…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="bv-hs-catalog" role="group" aria-label="Catalogue SH">
          {results.map((item) => (
            <button
              type="button"
              key={item.code}
              aria-pressed={article?.code === item.code}
              onClick={() => setArticle(item)}
            >
              <span>{item.name}</span>
              <strong>SH {item.code}</strong>
              {article?.code === item.code && <Check size={16} />}
            </button>
          ))}
        </div>
        {!results.length && (
          <p role="status" className="bv-tool-note">
            Aucun article trouvé. Essayez une désignation ou un code du
            catalogue.
          </p>
        )}
        {article && (
          <div className="bv-hs-selection">
            <strong>Classification proposée : SH {article.code}</strong>
            <p>{article.scope}</p>
            <small>
              Le classement final dépend des caractéristiques exactes et du
              tarif national.
            </small>
          </div>
        )}
        <div className="bv-tool-form">
          <div className="bv-tool-grid">
            <label>
              Pays de destination
              <select
                value={destination}
                onChange={(event) => {
                  const next = event.target.value as CustomsDestination;
                  setDestination(next);
                  setValue("");
                  setUsed("0");
                  setPersonal(false);
                  setRate(next === "DZ" ? "30" : "");
                  setLegacyTunisia(false);
                  setBasis("full");
                }}
              >
                {(
                  Object.entries(customsPolicies) as [
                    CustomsDestination,
                    typeof policy,
                  ][]
                ).map(([code, entry]) => (
                  <option key={code} value={code}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Valeur déclarée ({policy.currency})
              <input
                type="number"
                min="0"
                max="10000000"
                step="0.01"
                inputMode="decimal"
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
            </label>
          </div>
          <p className="bv-tool-note">
            {policy.condition}{" "}
            <a href={policy.source} target="_blank" rel="noreferrer">
              Consulter les douanes <ExternalLink size={12} />
            </a>
          </p>
          {destination === "TN" && (
            <label>
              Référence de franchise
              <select
                value={legacyTunisia ? "legacy" : "current"}
                onChange={(event) => {
                  setLegacyTunisia(event.target.value === "legacy");
                  setPersonal(false);
                }}
              >
                <option value="current">
                  Retour provisoire actuel · 5 000 TND
                </option>
                <option value="legacy">
                  Scénario historique du rapport · 2 000 TND
                </option>
              </select>
            </label>
          )}
          <label className="bv-tool-check">
            <input
              type="checkbox"
              checked={personal}
              onChange={(event) => setPersonal(event.target.checked)}
            />
            <span>
              Je confirme remplir les conditions de franchise personnelle de ce
              pays, pour des biens non commerciaux admissibles.
            </span>
          </label>
          {!personal && (
            <p className="bv-tool-notice">
              <TriangleAlert size={18} />
              <span>
                Franchise personnelle non appliquée. Un colis confié par un
                tiers ou un achat commercial n’en bénéficie pas automatiquement.
              </span>
            </p>
          )}
          <div className="bv-tool-grid">
            <label>
              Franchise déjà consommée ({policy.currency})
              <input
                type="number"
                min="0"
                max="10000000"
                step="0.01"
                value={used}
                onChange={(event) => setUsed(event.target.value)}
              />
            </label>
            <label>
              Taux estimatif global (%)
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="À renseigner selon le tarif national"
                value={rate}
                onChange={(event) => setRate(event.target.value)}
              />
            </label>
          </div>
          {destination === "DZ" && (
            <label>
              Assiette du scénario à 30 %
              <select
                value={basis}
                onChange={(event) =>
                  setBasis(event.target.value as "full" | "excess")
                }
              >
                <option value="full">
                  Valeur globale si dépassement · à confirmer
                </option>
                <option value="excess">
                  Excédent seulement · hypothèse du rapport à valider
                </option>
              </select>
            </label>
          )}
          {destination === "EU" && (
            <label className="bv-tool-check">
              <input
                type="checkbox"
                checked={indivisible}
                onChange={(event) => setIndivisible(event.target.checked)}
              />
              <span>
                La valeur correspond à un objet indivisible (taxation intégrale
                en cas de dépassement).
              </span>
            </label>
          )}
        </div>
        <section
          className="bv-customs-result"
          aria-live="polite"
          aria-label="Simulation douanière"
        >
          <div className="bv-customs-limit">
            <span>
              Franchise de référence
              {legacyTunisia && destination === "TN" ? " · historique" : ""}
            </span>
            <strong>{money(allowance)}</strong>
          </div>
          <progress
            aria-label="Franchise consommée"
            max={allowance}
            value={consumption}
          />
          <dl className="bv-tool-facts">
            <div>
              <dt>Franchise consommée</dt>
              <dd data-testid="customs-consumed">
                {valid ? money(consumption) : "À renseigner"}
              </dd>
            </div>
            <div>
              <dt>Franchise restante</dt>
              <dd data-testid="customs-remaining">
                {valid ? money(remaining) : "À renseigner"}
              </dd>
            </div>
            <div>
              <dt>Droits et taxes prévisionnels</dt>
              <dd data-testid="customs-tax">
                {tax === null ? "À déterminer" : money(tax)}
              </dd>
            </div>
          </dl>
          {valid && excessCents > 0 && (
            <p className="bv-tool-alert" role="status">
              <TriangleAlert size={18} />
              {personal
                ? `Dépassement de franchise : ${money(excessCents / 100)}.`
                : "Biens à déclarer : aucune franchise appliquée."}
            </p>
          )}
          {valid && (
            <p className="bv-tool-note">
              Assiette de simulation : {money(taxable)}.
              {taxable > 0 && !validRate
                ? " Renseignez un taux pour chiffrer les droits."
                : ""}
              {!article ? " Sélectionnez un article du catalogue." : ""}
            </p>
          )}
          {!valid && (
            <p className="bv-tool-note" role="status">
              Renseignez des montants valides, entre 0 et 10 000 000, dans la
              devise du pays sélectionné.
            </p>
          )}
        </section>
        <p className="bv-tool-note">{policy.cash}</p>
        <p className="bv-tool-note">
          Le taux saisi est une hypothèse de calcul, pas un tarif officiel
          déduit du code SH. TVA, droits spécifiques, origine des biens et
          autorisations doivent être confirmés auprès des douanes. Aucun montant
          n’est provisionné ou payé ici.
        </p>
      </div>
    </Dialog>
  );
}
