import { useId, useState } from "react";
import {
  Box,
  Check,
  ExternalLink,
  Ruler,
  Scale,
  TriangleAlert,
} from "lucide-react";
import { Dialog } from "../marketplace/Dialog";
import type { TransportContext } from "../../services/transportDocuments";
import {
  cabinFits,
  logisticsNumber,
  parcelCalculation,
  type ParcelMeasurements,
} from "../../services/logisticsTools";
import {
  airlineBaggagePolicies,
  logisticsSources,
} from "../../data/logisticsPolicies";

function ComplianceGauge({
  name,
  ratio,
  detail,
  valid,
}: {
  name: string;
  ratio: number;
  detail: string;
  valid: boolean;
}) {
  const pass = valid && ratio <= 1;
  return (
    <section
      className={`bv-compliance ${pass ? "is-compatible" : "is-exceeded"}`}
    >
      <h3>
        {pass ? <Check size={18} /> : <TriangleAlert size={18} />}
        {name}
        <span>
          {!valid ? "À renseigner" : pass ? "Compatible" : "Dépassement"}
        </span>
      </h3>
      <p>{detail}</p>
      <progress
        aria-label={name}
        value={valid ? Math.min(100, ratio * 100) : 0}
        max={100}
      />
    </section>
  );
}

function ParcelPreview({ parcel }: { parcel: ParcelMeasurements }) {
  const id = useId();
  const valid = Boolean(parcelCalculation(parcel));
  const scale =
    140 / Math.max(parcel.length || 1, parcel.width || 1, parcel.height || 1);
  const l = valid ? Math.max(10, parcel.length * scale) : 100;
  const w = valid ? Math.max(10, parcel.width * scale * 0.55) : 50;
  const h = valid ? Math.max(10, parcel.height * scale) : 70;
  const x = (320 - l - w) / 2;
  const y = 160 - h / 2;
  return (
    <svg
      className="bv-parcel-preview"
      viewBox="0 0 320 300"
      role="img"
      aria-label={
        valid
          ? `Gabarit du colis : ${parcel.length} par ${parcel.width} par ${parcel.height} centimètres`
          : "Renseignez les dimensions du colis"
      }
    >
      <defs>
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#e2e8f0" strokeWidth="0.7" />
        </pattern>
      </defs>
      <rect width="320" height="300" rx="20" fill={`url(#${id})`} />
      <ellipse cx="160" cy="263" rx="92" ry="13" fill="#dbe4ef" opacity="0.5" />
      <g stroke="#2563eb" strokeWidth="1.5" strokeLinejoin="round">
        <polygon
          points={`${x},${y} ${x + l},${y} ${x + l},${y + h} ${x},${y + h}`}
          fill="#dbeafe"
        />
        <polygon
          points={`${x},${y} ${x + w},${y - w * 0.65} ${x + l + w},${y - w * 0.65} ${x + l},${y}`}
          fill="#eff6ff"
        />
        <polygon
          points={`${x + l},${y} ${x + l + w},${y - w * 0.65} ${x + l + w},${y + h - w * 0.65} ${x + l},${y + h}`}
          fill="#93c5fd"
        />
      </g>
      {valid && (
        <g fill="#0f172a" fontSize="12" fontWeight="650" textAnchor="middle">
          <text x={x + l / 2} y={y + h + 22}>
            {parcel.length} cm
          </text>
          <text x={x + l + w / 2} y={y - w * 0.65 - 14}>
            {parcel.width} cm
          </text>
          <text
            x={x - 20}
            y={y + h / 2}
            transform={`rotate(-90 ${x - 20} ${y + h / 2})`}
          >
            {parcel.height} cm
          </text>
        </g>
      )}
    </svg>
  );
}

export function VolumetricCalculatorModal({
  context,
  onClose,
}: {
  context: TransportContext;
  onClose: () => void;
}) {
  const [parcel, setParcel] = useState<ParcelMeasurements>({
    length: 40,
    width: 30,
    height: 20,
    weight: context.weight && context.weight > 0 ? context.weight : 5,
  });
  const [divisor, setDivisor] = useState(5000);
  const [holdLimit, setHoldLimit] = useState(23);
  const result = parcelCalculation(parcel, divisor);
  const sorted = [parcel.length, parcel.width, parcel.height].sort(
    (a, b) => b - a,
  );
  const cabinRatio = Math.max(
    sorted[0] / 55,
    sorted[1] / 35,
    sorted[2] / 25,
    parcel.weight / 10,
  );
  const holdRatio = Math.max(
    (result?.total ?? 0) / 158,
    parcel.weight / holdLimit,
  );
  return (
    <Dialog title="Calculateur volumétrique" onClose={onClose} wide>
      <div className="bv-logistics-tool">
        <div className="bv-tool-intro">
          <span className="bv-tool-badge">
            <Ruler size={15} /> POIDS & GABARIT
          </span>
          <p>Le bon volume. Le juste poids facturable.</p>
          <small>Mesurez le colis emballé, roues et poignées comprises.</small>
        </div>
        <div className="bv-volume-layout">
          <div className="bv-tool-form">
            <div className="bv-tool-grid">
              {(
                [
                  ["length", "Longueur (cm)"],
                  ["width", "Largeur (cm)"],
                  ["height", "Hauteur (cm)"],
                  ["weight", "Poids réel (kg)"],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    type="number"
                    inputMode="decimal"
                    required
                    min="0.01"
                    max={key === "weight" ? 1000 : 300}
                    step="0.01"
                    value={Number.isFinite(parcel[key]) ? parcel[key] : ""}
                    onChange={(event) =>
                      setParcel((current) => ({
                        ...current,
                        [key]: event.target.valueAsNumber,
                      }))
                    }
                  />
                </label>
              ))}
            </div>
            <label>
              Barème volumétrique
              <select
                value={divisor}
                onChange={(event) => setDivisor(Number(event.target.value))}
              >
                <option value={5000}>BagVoyage · diviseur 5 000</option>
                <option value={6000}>
                  Référence fret IATA · diviseur 6 000
                </option>
              </select>
            </label>
            <div
              className="bv-tool-presets"
              role="group"
              aria-label="Exemples de gabarits"
            >
              <button
                type="button"
                onClick={() =>
                  setParcel({ length: 55, width: 35, height: 25, weight: 8 })
                }
              >
                Exemple cabine
              </button>
              <button
                type="button"
                onClick={() =>
                  setParcel({ length: 70, width: 50, height: 38, weight: 23 })
                }
              >
                Exemple soute
              </button>
            </div>
          </div>
          <ParcelPreview parcel={parcel} />
        </div>
        {!result && (
          <p className="bv-tool-alert" role="alert">
            Saisissez des dimensions entre 0,01 et 300 cm et un poids entre 0,01
            et 1 000 kg.
          </p>
        )}
        <div className="bv-volume-results" aria-live="polite">
          <section>
            <span>
              <Box size={16} /> Poids volumétrique
            </span>
            <output data-testid="volumetric-weight">
              {result ? logisticsNumber(result.volumetric) : "—"}{" "}
              <small>kg</small>
            </output>
            <p>(L × l × h) / {logisticsNumber(divisor, 0)}</p>
          </section>
          <section className="bv-billable">
            <span>
              <Scale size={16} /> Poids facturable
            </span>
            <output data-testid="billable-weight">
              {result ? logisticsNumber(result.billable) : "—"}{" "}
              <small>kg</small>
            </output>
            <p>
              {!result
                ? "En attente de mesures valides"
                : result.volumetric > parcel.weight
                  ? "Le volume détermine la facturation"
                  : "Le poids réel détermine la facturation"}
            </p>
          </section>
        </div>
        <p className="bv-tool-note">
          Le diviseur 5 000 est le barème de cette simulation BagVoyage. La
          règle générale publiée par l’IATA pour le fret utilise 6 000. Les
          franchises passagers se contrôlent sur le poids réel.{" "}
          <a
            href={logisticsSources.iataVolume}
            target="_blank"
            rel="noreferrer"
          >
            Référence IATA
          </a>
        </p>
        <div className="bv-tool-grid">
          <ComplianceGauge
            name="Format cabine standard"
            valid={Boolean(result)}
            ratio={cabinRatio}
            detail="55 × 35 × 25 cm · 10 kg maximum"
          />
          <div>
            <ComplianceGauge
              name="Format soute standard"
              valid={Boolean(result)}
              ratio={holdRatio}
              detail={`${result ? logisticsNumber(result.total) : "—"} / 158 cm cumulés · ${holdLimit} kg maximum`}
            />
            <label className="bv-hold-select">
              Limite de poids en soute
              <select
                value={holdLimit}
                onChange={(event) => setHoldLimit(Number(event.target.value))}
              >
                <option value={23}>23 kg</option>
                <option value={32}>32 kg</option>
              </select>
            </label>
          </div>
        </div>
        <section className="bv-airline-comparison">
          <h3>Comparer les compagnies</h3>
          <p className="bv-tool-note">
            Repères en classe économique, consultés le 1 novembre 2026. Le
            billet, le trajet et les accessoires peuvent modifier la franchise.
          </p>
          <div
            className="bv-tool-table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Politiques bagages des compagnies"
          >
            <table>
              <caption className="sr-only">
                Comparaison du gabarit cabine et des franchises en soute
              </caption>
              <thead>
                <tr>
                  <th scope="col">Compagnie</th>
                  <th scope="col">Cabine</th>
                  <th scope="col">Soute / conditions</th>
                  <th scope="col">Votre colis</th>
                </tr>
              </thead>
              <tbody>
                {airlineBaggagePolicies.map((policy) => (
                  <tr key={policy.name}>
                    <th scope="row">
                      <a href={policy.source} target="_blank" rel="noreferrer">
                        {policy.name}
                        <ExternalLink size={12} />
                      </a>
                    </th>
                    <td>
                      {policy.cabin.join(" × ")} cm
                      <br />
                      {policy.kg === null
                        ? "Levage sans aide"
                        : `${policy.kg} kg`}
                    </td>
                    <td>
                      {policy.hold}
                      <small>{policy.note}</small>
                    </td>
                    <td>
                      <span
                        className={`bv-fit-badge ${result && cabinFits(parcel, policy.cabin, policy.kg) ? "is-compatible" : ""}`}
                      >
                        {!result
                          ? "À renseigner"
                          : cabinFits(parcel, policy.cabin, policy.kg)
                            ? "Gabarit compatible"
                            : "Hors gabarit"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Dialog>
  );
}
