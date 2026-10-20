import { useEffect, useId, useRef, useState } from "react";
import { Anchor, Minus, Plane, Plus, RotateCcw, Ship } from "lucide-react";
import {
  radarNodes,
  routePosition,
  type GeoPoint,
  type RadarMovement,
} from "../../services/flightFerryRadarApi";

import { worldLand } from "../../data/worldLand";

export const projectMediterranean = (p: GeoPoint) => ({
  x: ((p.longitude + 180) / 360) * 1000,
  y: ((90 - p.latitude) / 180) * 680,
});
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
        <span className="bv-live-dot" /> RÉSEAU INTERNATIONAL{" "}
        <span>Simulation</span>
      </div>
      <div ref={viewport} className="bv-map-viewport">
        <svg
          className="bv-interactive-map"
          viewBox={`${490 - 270 / zoom} ${230 - 180 / zoom} ${540 / zoom} ${360 / zoom}`}
          aria-label="Carte interactive des vols et ferries dans le monde"
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
          {worldLand.map((path, i) => (
            <path
              key={i}
              d={path}
              fill="#fafbf8"
              stroke="#b5c6c8"
              strokeWidth="0.5"
            />
          ))}
          <g className="bv-map-country" style={{ fontSize: 7 }}>
            <text x="265" y="140">CANADA</text>
            <text x="490" y="135">EUROPE</text>
            <text x="500" y="285">AFRIQUE</text>
            <text x="665" y="200">MOYEN-ORIENT</text>
          </g>
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
          {radarNodes.filter(n => movements.some(m => m.origin.code === n.code || m.destination.code === n.code)).map((n) => {
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
                  r={port ? 1.8 : 2.2}
                  fill={port ? "#087c77" : "#253d58"}
                  stroke="white"
                  strokeWidth="0.8"
                />
                {(!port && !["ORY", "LYS", "MRS", "NCE", "ORN", "CZL"].includes(n.code) || zoom > 1.5 || selectedNode === n.code) && <text x={p.x + dx / 2} y={p.y + dy / 2} style={{ fontSize: 6 }}>
                  {n.code.replace("-PORT", " · PORT")}
                </text>}
              </g>
            );
          })}
          {movements.map((m) => {
            const p = projectMediterranean(m.position);
            return (
              <g
                key={m.id}
                transform={`translate(${p.x} ${p.y}) scale(0.5)`}
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
                  strokeWidth="0.5"
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
