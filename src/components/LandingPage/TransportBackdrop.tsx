import type { ShowcaseScenario } from "./BagVoyageLiveShowcase";

export type TransportKind = "avion" | "bateau" | "voiture";

/**
 * Architectural atmospheric background motion layer rendering refined vector crafts
 * (Airliner, Mediterranean Ferry, Express Van) on GPU-composited lanes.
 * Calibrated for high visibility in open sky and horizon whitespace without
 * colliding with editorial typography.
 */
export function TransportBackdrop({
  activeMode = "voyageur",
  activeTransport = "avion",
}: {
  activeMode?: ShowcaseScenario;
  activeTransport?: TransportKind;
}) {
  const emphasizeAir = activeMode === "voyageur" && activeTransport === "avion";
  const emphasizeSea = activeMode === "voyageur" && activeTransport === "bateau";
  const emphasizeRoad =
    (activeMode === "voyageur" && activeTransport === "voiture") ||
    activeMode === "bagandgo";

  return (
    <div
      className="bv-transport-backdrop pointer-events-none absolute inset-0 overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* Daylight atmospheric radial lighting */}
      <div className="bv-hero-mesh absolute inset-0" />

      {/* Subtle Curated Corridor Arcs (Air / Sea / Overland) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 720"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="bv-air-trail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
            <stop offset="45%" stopColor="#2563EB" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.62" />
          </linearGradient>
          <linearGradient id="bv-sea-trail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0" />
            <stop offset="50%" stopColor="#0D9488" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.58" />
          </linearGradient>
          <linearGradient id="bv-road-trail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#475569" stopOpacity="0" />
            <stop offset="55%" stopColor="#2563EB" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* High-Altitude Flight Trajectory */}
        <path
          d="M -20 46 Q 500 8 1020 42"
          stroke="url(#bv-air-trail)"
          strokeWidth={emphasizeAir ? "2" : "1.25"}
          strokeDasharray="6 8"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: emphasizeAir ? 0.95 : 0.55 }}
        />

        {/* Maritime Sea Horizon Curve */}
        <path
          d="M -20 612 Q 300 594 560 614 T 1020 600"
          stroke="url(#bv-sea-trail)"
          strokeWidth={emphasizeSea ? "2" : "1.35"}
          strokeDasharray="4 6"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: emphasizeSea ? 0.95 : 0.6 }}
        />

        {/* Express Ground Highway Track */}
        <path
          d="M -20 676 Q 500 662 1020 674"
          stroke="url(#bv-road-trail)"
          strokeWidth={emphasizeRoad ? "1.8" : "1.25"}
          vectorEffect="non-scaling-stroke"
          style={{ opacity: emphasizeRoad ? 0.9 : 0.55 }}
        />
      </svg>

      {/* Kinetic Craft Stage (GPU-composited container-width trajectories) */}
      <div className="absolute inset-0">
        {/* 1. Primary Airliner (Avion) */}
        <div
          className={`bv-craft bv-craft-air ${
            emphasizeAir ? "opacity-90" : "opacity-65"
          }`}
        >
          <span className="bv-craft-contrail" />
          <svg
            width="34"
            height="34"
            viewBox="0 0 32 32"
            fill="none"
            className="text-[#2563EB] drop-shadow-xs"
          >
            <path
              d="M27.5 16c0 1.2-2.2 2.2-5 2.4l-6.8.5-5.6 8.6h-2.5l2.7-8.7-4.8.2-2.2 3.1H1.5l1.3-4.6L1.5 13h1.8l2.2 3 4.8.2-2.7-8.7h2.5l5.6 8.6 6.8.5c2.8.2 5 1.2 5 2.4Z"
              fill="currentColor"
            />
            <path
              d="M24 15.3c1.6.1 2.7.4 2.7.7s-1.1.6-2.7.7v-1.4Z"
              fill="#FFFFFF"
              fillOpacity="0.9"
            />
          </svg>
        </div>

        {/* 2. Secondary Counter-Corridor Jet (Desktop) */}
        <div
          className={`bv-craft bv-craft-air-return hidden sm:flex ${
            emphasizeAir ? "opacity-60" : "opacity-40"
          }`}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 32 32"
            fill="none"
            className="text-[#0EA5E9]"
          >
            <path
              d="M27.5 16c0 1.2-2.2 2.2-5 2.4l-6.8.5-5.6 8.6h-2.5l2.7-8.7-4.8.2-2.2 3.1H1.5l1.3-4.6L1.5 13h1.8l2.2 3 4.8.2-2.7-8.7h2.5l5.6 8.6 6.8.5c2.8.2 5 1.2 5 2.4Z"
              fill="currentColor"
              transform="rotate(180 16 16)"
            />
          </svg>
        </div>

        {/* 3. Mediterranean Maritime Ferry (Bateau) */}
        <div
          className={`bv-craft bv-craft-sea ${
            emphasizeSea ? "opacity-95" : "opacity-75"
          }`}
        >
          <span className="bv-craft-wake" />
          <svg
            width="42"
            height="26"
            viewBox="0 0 44 26"
            fill="none"
            className="text-[#059669]"
          >
            <path
              d="M3 16.5h31.2l5.8-5.2H24.5L21.8 6H10.2L8.4 11.3H4.2L3 16.5Z"
              fill="currentColor"
            />
            <rect x="11.5" y="7.5" width="8.5" height="3.2" rx="0.9" fill="#FFFFFF" fillOpacity="0.92" />
            <rect x="21.5" y="8.2" width="4" height="2.5" rx="0.6" fill="#A7F3D0" />
            <path
              d="M1 20.2c3 1.4 6 1.4 9 0s6-1.4 9 0 6 1.4 9 0 6-1.4 9 0"
              stroke="#0D9488"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* 4. Express Overland Van / Car (Voiture) */}
        <div
          className={`bv-craft bv-craft-road ${
            emphasizeRoad ? "opacity-90" : "opacity-70"
          }`}
        >
          <span className="bv-craft-headlight" />
          <svg
            width="36"
            height="22"
            viewBox="0 0 38 22"
            fill="none"
            className="text-[#0F172A]"
          >
            <path
              d="M3 15.2V11c0-1.1.7-2.1 1.7-2.4l4-1.3L12.2 3.8c.7-.7 1.7-1.1 2.7-1.1h9.6c1.2 0 2.3.6 2.9 1.6l2.4 3.4 3 .9c1.2.4 2.1 1.5 2.1 2.8v3.8H32a3.1 3.1 0 0 1-6.2 0H12.2a3.1 3.1 0 0 1-6.2 0H3Z"
              fill="currentColor"
              fillOpacity="0.9"
            />
            <circle cx="9.1" cy="15.5" r="2.6" fill="#2563EB" />
            <circle cx="9.1" cy="15.5" r="1" fill="#FFFFFF" />
            <circle cx="28.9" cy="15.5" r="2.6" fill="#2563EB" />
            <circle cx="28.9" cy="15.5" r="1" fill="#FFFFFF" />
            <rect x="13.5" y="4.5" width="6.2" height="3.2" rx="0.8" fill="#FFFFFF" fillOpacity="0.9" />
            <rect x="21" y="4.5" width="5.5" height="3.2" rx="0.8" fill="#E0F2FE" />
          </svg>
        </div>
      </div>

      {/* Bottom edge blend into white surface */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
    </div>
  );
}
