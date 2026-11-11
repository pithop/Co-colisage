import { useId, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Luggage,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { euro } from "../../data/marketplace";

export type VisualizerTransportMode = "avion" | "voiture" | "train" | "bateau" | "camion";

interface LuggageVisualizerProps {
  onSelectCapacity?: (kg: number) => void;
  parcelWeights?: number[];
  transportMode?: VisualizerTransportMode;
}

export function LuggageVisualizer({
  onSelectCapacity,
  parcelWeights,
  transportMode = "avion",
}: LuggageVisualizerProps) {
  const isCar = transportMode === "voiture";
  const isTruck = transportMode === "camion";
  const isTrain = transportMode === "train";
  const isBoat = transportMode === "bateau";

  const defaultVal = isTruck ? 2 : isCar ? 150 : isBoat ? 25 : isTrain ? 15 : 10;
  const maxVal = isTruck ? 12 : isCar ? 450 : isBoat ? 80 : isTrain ? 40 : 30;
  const minVal = isTruck ? 0.5 : isCar ? 30 : isBoat ? 5 : isTrain ? 5 : 1;
  const stepVal = isTruck ? 0.5 : isCar ? 10 : 1;
  const unitLabel = isTruck ? "m³" : isCar ? "L" : "kg";

  const [capacity, setCapacity] = useState(defaultVal);
  const id = useId();

  // Mode-based fill and earnings calculations
  const fill = Math.min(100, Math.max(10, ((capacity - minVal) / (maxVal - minVal)) * 100));
  const ratePerUnit = isTruck ? 45 : isCar ? 0.45 : isBoat ? 6.5 : isTrain ? 7.0 : 7.5;
  const earnings = Math.round(capacity * ratePerUnit);
  const parcels = parcelWeights
    ? parcelWeights.filter((weight) => weight <= capacity).length
    : Math.max(1, Math.floor(isCar ? capacity / 40 : isTruck ? capacity * 4 : capacity / 3));

  // Legacy compatibility
  const kg = capacity;


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
              <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2=".8">
                <stop stopColor="#475569" />
                <stop offset=".35" stopColor="#f8fafc" />
                <stop offset=".6" stopColor="#94a3b8" />
                <stop offset="1" stopColor="#334155" />
              </linearGradient>
              <pattern
                id={`${id}-texture`}
                width="4"
                height="4"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 4L4 0"
                  stroke="#64748b"
                  strokeWidth=".5"
                  opacity=".2"
                />
              </pattern>
              <linearGradient id={`${id}-shell`} x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#ecfeff" stopOpacity=".9" />
                <stop offset="1" stopColor="#dbeafe" stopOpacity=".3" />
              </linearGradient>
              <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#3b82f6" />
                <stop offset=".5" stopColor="#2563eb" />
                <stop offset="1" stopColor="#1d4ed8" />
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
              opacity=".12"
            />
            <path
              d="M78 43V22a8 8 0 0 1 8-8h28a8 8 0 0 1 8 8v21"
              fill="none"
              stroke={`url(#${id}-metal)`}
              strokeWidth="5"
            />
            <path
              d="M85 17h30"
              stroke="#0f172a"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <rect x="76" y="13" width="48" height="10" rx="5" fill="#0f172a" />
            <path
              d="M86 17h28"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M78 30v12m44-12v12" stroke="#cbd5e1" strokeWidth="2" />
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
              <rect
                x="39"
                y="49"
                width="122"
                height="160"
                fill={`url(#${id}-texture)`}
              />
              <path d="M41 51h116L41 185Z" fill="#fff" opacity=".16" />
            </g>
            <g fill={`url(#${id}-metal)`} stroke="#64748b" strokeWidth=".6">
              <path d="M36 72V69a24 24 0 0 1 24-24h7v8h-7a16 16 0 0 0-16 16v3Z" />
              <path d="M133 45h7a24 24 0 0 1 24 24v3h-8v-3a16 16 0 0 0-16-16h-7Z" />
              <path d="M36 186v3a24 24 0 0 0 24 24h7v-8h-7a16 16 0 0 1-16-16v-3Z" />
              <path d="M133 213h7a24 24 0 0 0 24-24v-3h-8v3a16 16 0 0 1-16 16h-7Z" />
            </g>
            {[63, 137].map((x) => (
              <g key={x}>
                <rect
                  x={x - 4}
                  y="210"
                  width="8"
                  height="8"
                  rx="2"
                  fill={`url(#${id}-metal)`}
                />
                <rect
                  x={x - 10}
                  y="216"
                  width="20"
                  height="12"
                  rx="5"
                  fill="#0f172a"
                />
                <circle cx={x} cy="222" r="5" fill={`url(#${id}-metal)`} />
                <circle cx={x} cy="222" r="2" fill="#334155" />
                <path d={`M${x - 7} 218v8m14-8v8`} stroke="#475569" />
              </g>
            ))}
            <rect
              x="86"
              y="79"
              width="28"
              height="12"
              rx="3"
              fill={`url(#${id}-metal)`}
            />
            <path d="M94 85h12" stroke="#475569" strokeWidth="2" />
            <rect x="150" y="82" width="8" height="24" rx="4" fill="#0f172a" />
          </svg>
          <span className="luggage-capacity">
            {Math.round(fill)} % de capacité ({capacity} {unitLabel})
          </span>
        </div>
        <div className="luggage-summary" aria-live="polite" aria-atomic="true">
          <span className="luggage-metric-label">
            {isCar ? "Volume coffre alloué" : isTruck ? "Volume fret alloué" : "Capacité allouée"}
          </span>
          <strong className="luggage-weight">
            {capacity}
            <span> {unitLabel}</span>
          </strong>
          <div className="luggage-gain">
            <Sparkles size={16} />
            <strong>+{euro(earnings)}</strong>
          </div>
          <span className="luggage-metric-label">Gain net estimé</span>
          <p className="luggage-parcels">
            <strong>{parcels} {isTruck ? "lots fret" : "colis"}</strong> compatibles disponibles
          </p>
        </div>
      </div>
      <div
        className="luggage-compartments"
        role="group"
        aria-label="Format de transport"
      >
        <button
          type="button"
          aria-pressed={capacity <= (maxVal + minVal) / 2}
          onClick={() => setCapacity(minVal + Math.round((maxVal - minVal) * 0.3))}
        >
          <Luggage size={17} aria-hidden="true" />
          <span>
            {isCar ? "Format Coffre partiel" : isTruck ? "Format Demi-fourgon" : "Format Cabine / Standard"}
            <small>{minVal} à {Math.round((maxVal + minVal) / 2)} {unitLabel}</small>
          </span>
        </button>
        <button
          type="button"
          aria-pressed={capacity > (maxVal + minVal) / 2}
          onClick={() => setCapacity(maxVal)}
        >
          <Luggage size={21} aria-hidden="true" />
          <span>
            {isCar ? "Format Coffre complet" : isTruck ? "Format Plein volume" : "Format Soute / Grand volume"}
            <small>{Math.round((maxVal + minVal) / 2) + 1} à {maxVal} {unitLabel}</small>
          </span>
        </button>
      </div>
      <div className="luggage-slider-control">
        <label htmlFor={`${id}-capacity`}>
          Votre espace disponible <strong>{capacity} {unitLabel}</strong>
        </label>
        <input
          id={`${id}-capacity`}
          className="luggage-slider"
          type="range"
          role="slider"
          aria-label={`Espace disponible en ${unitLabel}`}
          aria-valuetext={`${capacity} ${unitLabel}, gain estimé ${euro(earnings)}`}
          min={minVal}
          max={maxVal}
          step={stepVal}
          value={capacity}
          style={
            { "--slider-fill": `${Math.max(0, Math.min(100, ((capacity - minVal) / (maxVal - minVal)) * 100))}%` } as CSSProperties
          }
          onChange={(event) => setCapacity(Number(event.target.value))}
        />
        <div className="luggage-slider-scale">
          <span>{minVal} {unitLabel}</span>
          <span>{maxVal} {unitLabel}</span>
        </div>
      </div>
      <p className="luggage-flight">
        <Plane size={17} />
        <span>
          {isCar
            ? "Amortit vos frais de carburant et péages d'autoroute"
            : isTruck
            ? "Optimise vos retours à vide et rentabilise votre utilitaire"
            : isBoat
            ? "Couvre une cabine privée et la traversée ferry"
            : isTrain
            ? "Rembourse l'intégralité de votre billet TGV"
            : capacity >= 8
            ? "Vos gains estimés peuvent couvrir un billet à 60 €"
            : "Finance une grande partie de votre trajet"}
        </span>
      </p>
      <button
        className="w-full py-3.5 px-6 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
        onClick={() => onSelectCapacity?.(capacity)}
      >
        <span>Filtrer les annonces pour {capacity} {unitLabel}</span>
        <ArrowRight size={17} />
      </button>
      <p className="luggage-security">
        <ShieldCheck size={16} /> Suivi des remises · Validation par QR
      </p>
      <small className="luggage-disclaimer">
        Hypothèse : 7,50 €/kg, billet à 60 €. Estimation hors frais, sous
        réserve de réservations confirmées.
        {parcelWeights
          ? " Compatibilité selon le poids renseigné, par colis."
          : " Colis estimés à 3 kg chacun."}
      </small>
    </section>
  );
}
