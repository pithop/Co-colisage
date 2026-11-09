import { useId, useState } from "react";
import {
  Box,
  CheckCircle2,
  PackageCheck,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface ParcelVisualizerProps {
  initialWeight?: number;
  initialCategory?: string;
  onWeightChange?: (kg: number) => void;
}

export function ParcelVisualizer({
  initialWeight = 1.5,
  initialCategory = "Pharmacie & Médical",
  onWeightChange,
}: ParcelVisualizerProps) {
  const [kg, setKg] = useState(initialWeight);
  const id = useId();

  const handleWeight = (val: number) => {
    setKg(val);
    if (onWeightChange) onWeightChange(val);
  };

  // Calculations
  const maxKg = 15;
  const fillPct = Math.min(100, Math.max(10, (kg / maxKg) * 100));
  // Box scale factor: between 0.85 and 1.15 based on weight
  const boxScale = 0.85 + (kg / maxKg) * 0.3;
  // Suggested price based on weight
  const estimatedCost = Math.round(15 + kg * 12);

  return (
    <section className="parcel-visualizer rounded-2xl border border-cyan-500/25 bg-slate-900/95 text-white p-4 sm:p-5 shadow-lg overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none" />

      <header className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Scale size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
              Simulateur de Colis Dynamique
            </span>
            <h3 className="text-sm font-bold text-white">
              Gabarit, Poids &amp; Sécurisation
            </h3>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
          <Sparkles size={12} />
          <span>Temps réel</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-3">
        {/* Animated 3D Isometric Parcel Box SVG */}
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <svg
            className="w-48 h-40 transition-transform duration-300 ease-out"
            style={{ transform: `scale(${boxScale})` }}
            viewBox="0 0 200 160"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`${id}-boxTop`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e2b17a" />
                <stop offset="100%" stopColor="#c59157" />
              </linearGradient>
              <linearGradient id={`${id}-boxLeft`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b67f46" />
                <stop offset="100%" stopColor="#8d5d2c" />
              </linearGradient>
              <linearGradient id={`${id}-boxRight`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#cf9c63" />
                <stop offset="100%" stopColor="#a36e37" />
              </linearGradient>
              <linearGradient id={`${id}-tape`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00bcd4" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* Scale Base Platform */}
            <ellipse cx="100" cy="148" rx="72" ry="10" fill="#0369a1" opacity="0.25" />
            <path
              d="M38 138 h124 l-12 12 h-100 z"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* LED Display on Scale */}
            <rect x="76" y="142" width="48" height="12" rx="2" fill="#020617" />
            <text
              x="100"
              y="151"
              textAnchor="middle"
              fill="#22d3ee"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {kg.toFixed(2)} KG
            </text>

            {/* Isometric Parcel Box */}
            {/* Top Face */}
            <polygon
              points="100,28 152,54 100,80 48,54"
              fill={`url(#${id}-boxTop)`}
              stroke="#8d5d2c"
              strokeWidth="1"
            />
            {/* Left Face */}
            <polygon
              points="48,54 100,80 100,132 48,106"
              fill={`url(#${id}-boxLeft)`}
              stroke="#6b441f"
              strokeWidth="1"
            />
            {/* Right Face */}
            <polygon
              points="100,80 152,54 152,106 100,132"
              fill={`url(#${id}-boxRight)`}
              stroke="#6b441f"
              strokeWidth="1"
            />

            {/* Cyan Tamper-Evident Security Tape */}
            {/* Across top */}
            <polygon
              points="94,31 106,37 106,77 94,71"
              fill={`url(#${id}-tape)`}
              opacity="0.9"
            />
            {/* Down front */}
            <polygon
              points="96,78 104,82 104,130 96,126"
              fill={`url(#${id}-tape)`}
              opacity="0.85"
            />

            {/* Shipping Label on Left Face */}
            <polygon
              points="58,74 88,89 88,110 58,95"
              fill="#ffffff"
              opacity="0.9"
            />
            <line x1="62" y1="80" x2="84" y2="91" stroke="#0f172a" strokeWidth="1" />
            <line x1="62" y1="84" x2="80" y2="93" stroke="#0f172a" strokeWidth="0.8" />
            <line x1="62" y1="88" x2="75" y2="94" stroke="#0f172a" strokeWidth="0.8" />
            {/* Barcode lines */}
            <line x1="64" y1="94" x2="84" y2="104" stroke="#0284c7" strokeWidth="2" strokeDasharray="1,1" />

            {/* Security Stamp badge */}
            <circle cx="128" cy="88" r="10" fill="#00bcd4" opacity="0.9" />
            <polyline
              points="124,88 127,91 133,85"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
            {[0.5, 1.5, 3.0, 5.0, 10.0].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleWeight(preset)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  kg === preset
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {preset} kg
              </button>
            ))}
          </div>
        </div>

        {/* Controls & Metrics */}
        <div className="space-y-3">
          {/* Live Weight Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-400 font-medium">Poids sélectionné :</span>
              <span className="font-bold text-cyan-400 text-sm">{kg} kg</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={kg}
              onChange={(e) => handleWeight(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-0.5">
              <span>0.5 kg (Enveloppe)</span>
              <span>7.5 kg</span>
              <span>15 kg (Fret lourd)</span>
            </div>
          </div>

          {/* Pricing Estimation Card */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">Indemnité recommandée :</span>
              <span className="text-base font-extrabold text-white">~ {estimatedCost} €</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-cyan-400 font-semibold block">Garantie séquestre</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end font-bold">
                <CheckCircle2 size={12} /> Fonds protégés
              </span>
            </div>
          </div>

          {/* Security Features */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <ShieldCheck size={14} className="text-cyan-400 shrink-0" />
              <span>PIN secret de livraison</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <PackageCheck size={14} className="text-cyan-400 shrink-0" />
              <span>Inspection cabine IATA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
