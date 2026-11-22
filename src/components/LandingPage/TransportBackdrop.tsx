import type { ShowcaseScenario } from "./BagVoyageLiveShowcase";

export type TransportKind = "avion" | "bateau" | "voiture";

/**
 * Architectural background motion layer rendering GPU-composited vector trajectories
 * for air (plane), maritime (ferry), and overland (car/van) corridors.
 * Responsive across 390px mobile and 1440px desktop via CSS container queries (cqw),
 * strictly decorative (aria-hidden), low-contrast, and gated under prefers-reduced-motion.
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
      {/* Subtle daylight atmospheric radial mesh */}
      <div className="bv-hero-mesh absolute inset-0" />

      {/* Architectural SVG Corridor Arcs (stretched proportionally to full container width) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 720"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="bv-air-trail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.52" />
          </linearGradient>
          <linearGradient id="bv-sea-trail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0" />
            <stop offset="50%" stopColor="#0D9488" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.48" />
          </linearGradient>
          <linearGradient id="bv-road-trail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#64748B" stopOpacity="0" />
            <stop offset="55%" stopColor="#2563EB" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.32" />
          </linearGradient>
        </defs>

        {/* Fine architectural latitude lines */}
        <g stroke="#CBD5E1" strokeOpacity="0.3" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <line x1="0" y1="88" x2="1000" y2="88" strokeDasharray="3 10" />
          <line x1="0" y1="538" x2="1000" y2="538" strokeDasharray="3 10" />
          <line x1="0" y1="652" x2="1000" y2="652" strokeDasharray="3 10" />
        </g>

        {/* Air Arc (High-altitude sky lane cleanly above typography) */}
        <path
          d="M -20 96 Q 500 22 1020 82"
          stroke="url(#bv-air-trail)"
          strokeWidth={emphasizeAir ? "2" : "1.25"}
          strokeDasharray="6 8"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: emphasizeAir ? 0.92 : 0.48 }}
        />

        {/* Maritime Ferry Arc (Calm Mediterranean gap lane) */}
        <path
          d="M -20 545 Q 320 515 580 552 T 1020 532"
          stroke="url(#bv-sea-trail)"
          strokeWidth={emphasizeSea ? "2" : "1.25"}
          strokeDasharray="4 6"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: emphasizeSea ? 0.92 : 0.48 }}
        />

        {/* Express Overland Lane (Ground express highway corridor) */}
        <path
          d="M -20 656 Q 500 634 1020 652"
          stroke="url(#bv-road-trail)"
          strokeWidth={emphasizeRoad ? "1.8" : "1.15"}
          vectorEffect="non-scaling-stroke"
          style={{ opacity: emphasizeRoad ? 0.88 : 0.44 }}
        />
      </svg>

      {/* GPU-Composited Kinetic Craft Stage */}
      <div className="absolute inset-0">
        {/* 1. Primary Airliner (Avion) */}
        <div
          className={`bv-craft bv-craft-air ${
            emphasizeAir ? "opacity-80" : "opacity-55"
          }`}
        >
          <span className="bv-craft-contrail" />
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#2563EB]"
          >
            <path
              d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z"
              fill="currentColor"
              transform="rotate(90 12 12)"
            />
          </svg>
        </div>

        {/* 2. Secondary Counter-Corridor Jet */}
        <div
          className={`bv-craft bv-craft-air-return hidden sm:flex ${
            emphasizeAir ? "opacity-55" : "opacity-35"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#0EA5E9]"
          >
            <path
              d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z"
              fill="currentColor"
              transform="rotate(-90 12 12)"
            />
          </svg>
        </div>

        {/* 3. Maritime Ferry (Bateau) */}
        <div
          className={`bv-craft bv-craft-sea ${
            emphasizeSea ? "opacity-85" : "opacity-55"
          }`}
        >
          <span className="bv-craft-wake" />
          <svg
            width="32"
            height="22"
            viewBox="0 0 36 22"
            fill="none"
            className="text-[#059669]"
          >
            <path
              d="M3 14.5h25.5l4.2-4.5H19.5l-2.2-4.5H8.5L7 10H3.8L3 14.5Z"
              fill="currentColor"
              fillOpacity="0.9"
            />
            <rect x="10.5" y="7" width="6" height="3" rx="0.8" fill="#FFFFFF" fillOpacity="0.9" />
            <path
              d="M2 17.5c2.5 1.2 5 1.2 7.5 0s5-1.2 7.5 0 5 1.2 7.5 0 5-1.2 7.5 0"
              stroke="#0D9488"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* 4. Express Overland Van / Car (Voiture) */}
        <div
          className={`bv-craft bv-craft-road ${
            emphasizeRoad ? "opacity-80" : "opacity-55"
          }`}
        >
          <span className="bv-craft-headlight" />
          <svg
            width="28"
            height="18"
            viewBox="0 0 32 18"
            fill="none"
            className="text-[#0F172A]"
          >
            <path
              d="M3 12.5V9.2c0-.9.6-1.7 1.4-2l3.4-1.2L10.8 3c.6-.6 1.4-1 2.3-1h8.1c1 0 1.9.5 2.4 1.3l2.1 3 2.5.8c1 .3 1.8 1.2 1.8 2.3v3.1h-2.2a2.6 2.6 0 0 1-5.2 0H9.6a2.6 2.6 0 0 1-5.2 0H3Z"
              fill="currentColor"
              fillOpacity="0.88"
            />
            <circle cx="7" cy="13" r="2.2" fill="#2563EB" />
            <circle cx="25.2" cy="13" r="2.2" fill="#2563EB" />
            <rect x="11.5" y="3.8" width="5.5" height="2.8" rx="0.6" fill="#FFFFFF" fillOpacity="0.88" />
            <rect x="18.2" y="3.8" width="4.8" height="2.8" rx="0.6" fill="#FFFFFF" fillOpacity="0.88" />
          </svg>
        </div>
      </div>

      {/* Seamless fade at top/bottom edges so sections stitch cleanly */}
      <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#F8FAFC] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
    </div>
  );
}
