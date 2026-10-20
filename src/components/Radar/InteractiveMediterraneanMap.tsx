import { useEffect, useId, useRef, useState } from "react";
import { Anchor, Minus, Plane, Plus, RotateCcw, Ship } from "lucide-react";
import {
  radarNodes,
  routePosition,
  type GeoPoint,
  type RadarMovement,
} from "../../services/flightFerryRadarApi";

export const projectMediterranean = (p: GeoPoint) => ({
  x: ((p.longitude + 5) / 17) * 1000,
  y: ((51 - p.latitude) / 18) * 680,
});
const outline = (points: [number, number][]) =>
  points
    .map(([longitude, latitude], i) => {
      const p = projectMediterranean({ longitude, latitude });
      return `${i ? "L" : "M"}${p.x},${p.y}`;
    })
    .join(" ") + " Z";
const land = [
  [
    [-5, 51],
    [12, 51],
    [12, 45],
    [9, 44.4],
    [8.7, 44.1],
    [7.5, 43.8],
    [7, 43.5],
    [6.3, 43.1],
    [5.9, 43],
    [5.4, 43.2],
    [5, 43.35],
    [4.7, 43.4],
    [4.1, 43.55],
    [3.7, 43.4],
    [3.1, 43.05],
    [3, 42.5],
    [2.1, 42.4],
    [0.7, 42.7],
    [-1.8, 43.35],
    [-1.3, 46],
    [-4.8, 48.5],
  ],
  [
    [-5, 43.7],
    [-1.8, 43.35],
    [0.7, 42.7],
    [2.1, 42.4],
    [3, 42.5],
    [3.2, 41.9],
    [2.2, 41.4],
    [1, 41],
    [0.2, 40.5],
    [-0.3, 39.4],
    [0.2, 38.8],
    [-0.6, 38],
    [-1.7, 37.4],
    [-2.4, 36.8],
    [-4.5, 36.6],
    [-5, 36],
  ],
  [
    [-5, 33],
    [12, 33],
    [12, 36.8],
    [10.8, 37.1],
    [10, 37.3],
    [9, 37.2],
    [8.6, 36.9],
    [7.2, 37],
    [6.3, 36.9],
    [5.3, 36.7],
    [4.6, 36.9],
    [3.1, 36.8],
    [2.2, 36.6],
    [1, 36.5],
    [0.2, 36],
    [-0.6, 35.75],
    [-1.1, 35.65],
    [-2.2, 35.1],
    [-3, 35.3],
    [-4, 35.2],
    [-5, 35.5],
  ],
  [
    [8.6, 42.4],
    [9.35, 43],
    [9.55, 42.5],
    [9.4, 41.4],
    [8.8, 41.5],
    [8.6, 42.4],
  ],
  [
    [8.2, 40.9],
    [9.3, 41.25],
    [9.8, 40.5],
    [9.6, 39.1],
    [9, 38.9],
    [8.4, 39],
    [8.2, 40],
  ],
  [
    [2.3, 39.6],
    [3.2, 39.95],
    [3.5, 39.7],
    [3, 39.3],
    [2.5, 39.4],
  ],
] satisfies [number, number][][];
export function InteractiveMediterraneanMap({
  movements,
  selectedId,
  onSelect,
}: {
  movements: RadarMovement[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const id = useId().replace(/:/g, "");
  const [zoom, setZoom] = useState(1);
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = viewport.current;
    if (element)
      element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
  }, []);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const current = movements.find((m) => m.id === hovered);
  return (
    <div className="bv-map-wrap">
      <div className="bv-map-caption">
        <span className="bv-live-dot" /> MÉDITERRANÉE OCCIDENTALE{" "}
        <span>Simulation</span>
      </div>
      <div ref={viewport} className="bv-map-viewport">
        <svg
          className="bv-interactive-map"
          viewBox={`${500 - 500 / zoom} ${340 - 340 / zoom} ${1000 / zoom} ${680 / zoom}`}
          aria-label="Carte interactive des vols et ferries France Algérie"
          role="group"
        >
          <defs>
            <pattern
              id={`${id}-grid`}
              width="58.8"
              height="37.8"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 58.8 0 L 0 0 0 37.8"
                fill="none"
                stroke="#c6d8de"
                strokeWidth="0.5"
              />
            </pattern>
            <radialGradient id={`${id}-sea`}>
              <stop stopColor="#f1fafb" />
              <stop offset="1" stopColor="#dcecef" />
            </radialGradient>
          </defs>
          <rect
            x="-1000"
            y="-1000"
            width="3000"
            height="3000"
            fill={`url(#${id}-sea)`}
          />
          <rect width="1000" height="680" fill={`url(#${id}-grid)`} />
          {land.map((points, i) => (
            <path
              key={i}
              d={outline(points)}
              fill="#fafbf8"
              stroke="#b5c6c8"
              strokeWidth="1.5"
            />
          ))}
          <g className="bv-map-country">
            <text x="460" y="160">
              FRANCE
            </text>
            <text x="155" y="375">
              ESPAGNE
            </text>
            <text x="455" y="635">
              ALGÉRIE
            </text>
            <text x="900" y="270">
              ITALIE
            </text>
          </g>
          <text x="570" y="460" className="bv-map-sea">
            Mer Méditerranée
          </text>
          {movements.map((m) => {
            const path = Array.from({ length: 65 }, (_, i) => {
              const p = projectMediterranean(routePosition(m, i / 64).position);
              return `${i ? "L" : "M"}${p.x.toFixed(2)},${p.y.toFixed(2)}`;
            }).join(" ");
            return (
              <path
                key={m.id}
                className={`bv-map-route ${m.kind} ${selectedId === m.id ? "selected" : ""}`}
                d={path}
                fill="none"
              />
            );
          })}
          {radarNodes.map((n) => {
            const p = projectMediterranean(n),
              port = n.kind === "port";
            const offsets: Record<string, [number, number]> = {
              CDG: [12, -16],
              ORY: [-45, 16],
              MRS: [12, -15],
              "MRS-PORT": [14, 25],
              "SETE-PORT": [-70, -14],
              ALG: [14, 22],
              "ALG-PORT": [-80, -12],
              ORN: [-45, 25],
              "ORN-PORT": [-78, -12],
            };
            const [dx, dy] = offsets[n.code] || [13, -10];
            return (
              <g
                key={n.code}
                role="button"
                tabIndex={0}
                aria-label={`${n.name}, ${port ? "port" : "aéroport"}`}
                aria-pressed={selectedNode === n.code}
                className="bv-map-node"
                onClick={() => setSelectedNode(n.code)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedNode(n.code);
                  }
                }}
              >
                <title>{n.name}</title>
                <circle cx={p.x} cy={p.y} r="13" fill="transparent" />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={port ? 4 : 5}
                  fill={port ? "#087c77" : "#253d58"}
                  stroke="white"
                  strokeWidth="2"
                />
                <text x={p.x + dx} y={p.y + dy}>
                  {n.code.replace("-PORT", " · PORT")}
                </text>
              </g>
            );
          })}
          {movements.map((m) => {
            const p = projectMediterranean(m.position);
            return (
              <g
                key={m.id}
                transform={`translate(${p.x} ${p.y})`}
                className={`bv-map-vehicle ${m.kind}`}
                role="button"
                tabIndex={0}
                aria-label={`${m.reference}, ${m.origin.code} vers ${m.destination.code}`}
                aria-pressed={selectedId === m.id}
                onMouseEnter={() => setHovered(m.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(m.id)}
                onBlur={() => setHovered(null)}
                onClick={() => onSelect(m.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(m.id);
                  }
                }}
              >
                <circle
                  r="18"
                  fill={selectedId === m.id ? "#152e45" : "white"}
                  stroke={m.kind === "flight" ? "#336195" : "#087c77"}
                  strokeWidth="1.5"
                />
                <g
                  transform={`rotate(${m.heading - (m.kind === "flight" ? 45 : 0)})`}
                  style={{
                    color:
                      selectedId === m.id
                        ? "white"
                        : m.kind === "flight"
                          ? "#244d7b"
                          : "#087c77",
                  }}
                >
                  {m.kind === "flight" ? (
                    <Plane x={-10} y={-10} size={20} />
                  ) : (
                    <Ship x={-10} y={-10} size={20} />
                  )}
                </g>
              </g>
            );
          })}
        </svg>
      </div>
      {current && (
        <div className="bv-map-hud" role="status">
          <strong>
            {current.reference} <span>{current.vehicle}</span>
          </strong>
          <p>
            {current.origin.code} / {current.destination.code}
          </p>
          <span>
            {current.altitudeM.toLocaleString("fr-FR")} m ·{" "}
            {current.groundSpeedKmh} km/h · {current.availableKg} kg libres
          </span>
        </div>
      )}
      {selectedNode && (
        <div className="bv-map-node-info" role="status">
          <Anchor size={15} />
          <span>{radarNodes.find((n) => n.code === selectedNode)?.name}</span>
          <button
            onClick={() => setSelectedNode(null)}
            aria-label="Fermer les informations du point"
          >
            Fermer
          </button>
        </div>
      )}
      <div className="bv-map-legend">
        <span>
          <Plane size={14} /> Vol
        </span>
        <span>
          <Ship size={14} /> Ferry
        </span>
        <span>Tracés indicatifs</span>
      </div>
      <div className="bv-map-controls">
        <button
          aria-label="Zoom avant"
          disabled={zoom >= 2}
          onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
        >
          <Plus size={18} />
        </button>
        <button
          aria-label="Zoom arrière"
          disabled={zoom <= 1}
          onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
        >
          <Minus size={18} />
        </button>
        <button aria-label="Recentrer la carte" onClick={() => setZoom(1)}>
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
