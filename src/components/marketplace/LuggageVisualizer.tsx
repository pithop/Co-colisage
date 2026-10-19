import { useId, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Luggage,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { euro } from "../../data/marketplace";

interface LuggageVisualizerProps {
  onSelectCapacity?: (kg: number) => void;
  parcelWeights?: number[];
}

export function LuggageVisualizer({
  onSelectCapacity,
  parcelWeights,
}: LuggageVisualizerProps) {
  const [kg, setKg] = useState(10);
  const id = useId();
  const fill = (kg / 30) * 100;
  const earnings = kg * 7.5;
  const parcels = parcelWeights
    ? parcelWeights.filter((weight) => weight <= kg).length
    : Math.floor(kg / 3);

  return (
    <section className="luggage-visualizer" aria-labelledby={`${id}-title`}>
      <header className="luggage-heading">
        <span className="luggage-icon">
          <Luggage size={20} />
        </span>
        <div>
          <span className="eyebrow">DE LA PLACE POUR PLUS</span>
          <h2 id={`${id}-title`}>Vos kilos ont de la valeur.</h2>
        </div>
        <span className="luggage-live">
          <Sparkles size={13} /> Estimation
        </span>
      </header>
      <div className="luggage-body">
        <div className="luggage-stage">
          <svg
            className="luggage-vector"
            viewBox="0 0 200 240"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`${id}-shell`} x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#ecfeff" stopOpacity=".9" />
                <stop offset="1" stopColor="#dbeafe" stopOpacity=".3" />
              </linearGradient>
              <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#22d3ee" />
                <stop offset=".5" stopColor="#2563eb" />
                <stop offset="1" stopColor="#10b981" />
              </linearGradient>
              <clipPath id={`${id}-clip`}>
                <rect x="39" y="49" width="122" height="160" rx="22" />
              </clipPath>
            </defs>
            <ellipse
              cx="100"
              cy="229"
              rx="68"
              ry="6"
              fill="#2563eb"
              opacity=".1"
            />
            <path
              d="M78 43V22a8 8 0 0 1 8-8h28a8 8 0 0 1 8 8v21"
              fill="none"
              stroke="#64748b"
              strokeWidth="5"
            />
            <path
              d="M85 17h30"
              stroke="#0f172a"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <rect
              x="35"
              y="45"
              width="130"
              height="168"
              rx="26"
              fill={`url(#${id}-shell)`}
              stroke="#93c5fd"
              strokeWidth="2"
            />
            <g clipPath={`url(#${id}-clip)`}>
              <rect
                className="luggage-fill"
                x="39"
                y="49"
                width="122"
                height="160"
                fill={`url(#${id}-fill)`}
                style={{ transform: `scaleY(${kg / 30})` }}
              />
              <path
                d="M64 65v125m24-125v125m24-125v125m24-125v125"
                stroke="#fff"
                strokeOpacity=".55"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path d="M41 51h116L41 185Z" fill="#fff" opacity=".16" />
            </g>
            <rect x="57" y="212" width="14" height="13" rx="5" fill="#334155" />
            <rect
              x="129"
              y="212"
              width="14"
              height="13"
              rx="5"
              fill="#334155"
            />
            <rect x="150" y="82" width="8" height="24" rx="4" fill="#0f172a" />
          </svg>
          <span className="luggage-capacity">
            {Math.round(fill)} % de 30 kg
          </span>
        </div>
        <div className="luggage-summary" aria-live="polite" aria-atomic="true">
          <span className="luggage-metric-label">Kilos alloués</span>
          <strong className="luggage-weight">
            {kg}
            <span> kg</span>
          </strong>
          <div className="luggage-gain">
            <Sparkles size={16} />
            <strong>+{euro(earnings)}</strong>
          </div>
          <span className="luggage-metric-label">Gain estimé voyageur</span>
          <p className="luggage-parcels">
            <strong>{parcels} colis</strong> compatibles disponibles
          </p>
        </div>
      </div>
      <div className="luggage-slider-control">
        <label htmlFor={`${id}-capacity`}>
          Votre espace disponible <strong>{kg} kg</strong>
        </label>
        <input
          id={`${id}-capacity`}
          className="luggage-slider"
          type="range"
          role="slider"
          aria-label="Kilos disponibles dans vos bagages"
          aria-valuetext={`${kg} kilos, gain estimé ${euro(earnings)}`}
          min={1}
          max={30}
          step={1}
          value={kg}
          style={
            { "--slider-fill": `${((kg - 1) / 29) * 100}%` } as CSSProperties
          }
          onChange={(event) => setKg(Number(event.target.value))}
        />
        <div className="luggage-slider-scale">
          <span>1 kg</span>
          <span>30 kg</span>
        </div>
      </div>
      <p className="luggage-flight">
        <Plane size={17} />
        <span>
          {kg >= 8
            ? "Vos gains estimés peuvent couvrir un billet à 60 €"
            : "Finance une grande partie de votre trajet"}
        </span>
      </p>
      <button
        className="primary-button luggage-cta"
        onClick={() => onSelectCapacity?.(kg)}
      >
        Filtrer les annonces pour {kg} kg <ArrowRight size={17} />
      </button>
      <p className="luggage-security">
        <ShieldCheck size={16} /> Suivi des remises · Validation par QR
      </p>
      <small className="luggage-disclaimer">
        Hypothèse : 7,50 €/kg, billet à 60 €. Estimation hors frais, sous réserve de réservations confirmées.
        {parcelWeights
          ? " Compatibilité selon le poids renseigné, par colis."
          : " Colis estimés à 3 kg chacun."}
      </small>
    </section>
  );
}
