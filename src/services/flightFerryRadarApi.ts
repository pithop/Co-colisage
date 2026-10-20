import { airports, type Corridor } from "../data/international";

export interface GeoPoint {
  latitude: number;
  longitude: number;
}
export interface RadarNode extends GeoPoint {
  code: string;
  name: string;
  kind: "airport" | "port";
}
export type RadarKind = "flight" | "ferry";
export type RadarStatus = "scheduled" | "boarding" | "moving" | "arrived";
export interface RadarRoute {
  corridor: Corridor;
  id: string;
  reference: string;
  operator: string;
  vehicle: string;
  kind: RadarKind;
  origin: RadarNode;
  destination: RadarNode;
  waypoints: GeoPoint[];
  departureAt: number;
  arrivalAt: number;
  capacityKg: number;
  availableKg: number;
  pricePerKg: number;
}
export interface RadarMovement extends RadarRoute {
  position: GeoPoint;
  heading: number;
  progress: number;
  status: RadarStatus;
  altitudeM: number;
  groundSpeedKmh: number;
  distanceKm: number;
  remainingKm: number;
  weather: {
    windKmh: number;
    windDirection: number;
    waveHeightM: number | null;
    temperatureC: number;
    description: string;
  };
}
export interface RadarSnapshot {
  source: "simulation";
  updatedAt: number;
  movements: RadarMovement[];
}

export const radarNodes: readonly RadarNode[] = [
  { code: "CMN", name: "Casablanca Mohammed V", latitude: 33.3675, longitude: -7.5898, kind: "airport" },
  { code: "RAK", name: "Marrakech Ménara", latitude: 31.6069, longitude: -8.0363, kind: "airport" },
  { code: "TUN", name: "Tunis Carthage", latitude: 36.851, longitude: 10.2272, kind: "airport" },
  { code: "DJE", name: "Djerba Zarzis", latitude: 33.875, longitude: 10.7755, kind: "airport" },
  { code: "DSS", name: "Dakar Blaise Diagne", latitude: 14.67, longitude: -17.0733, kind: "airport" },
  { code: "ABJ", name: "Abidjan Félix Houphouët-Boigny", latitude: 5.2614, longitude: -3.9263, kind: "airport" },
  { code: "YUL", name: "Montréal Pierre Elliott Trudeau", latitude: 45.4706, longitude: -73.7408, kind: "airport" },
  { code: "DXB", name: "Dubaï International", latitude: 25.2532, longitude: 55.3657, kind: "airport" },
  {
    code: "CDG",
    name: "Paris Charles de Gaulle",
    latitude: 49.0097,
    longitude: 2.5479,
    kind: "airport",
  },
  {
    code: "ORY",
    name: "Paris Orly",
    latitude: 48.7262,
    longitude: 2.3652,
    kind: "airport",
  },
  {
    code: "MRS",
    name: "Marseille Provence",
    latitude: 43.4393,
    longitude: 5.2214,
    kind: "airport",
  },
  {
    code: "LYS",
    name: "Lyon Saint-Exupéry",
    latitude: 45.7256,
    longitude: 5.0811,
    kind: "airport",
  },
  {
    code: "NCE",
    name: "Nice Côte d’Azur",
    latitude: 43.6584,
    longitude: 7.2159,
    kind: "airport",
  },
  {
    code: "ALG",
    name: "Alger Houari Boumediene",
    latitude: 36.691,
    longitude: 3.2154,
    kind: "airport",
  },
  {
    code: "ORN",
    name: "Oran Ahmed Ben Bella",
    latitude: 35.6239,
    longitude: -0.6212,
    kind: "airport",
  },
  {
    code: "CZL",
    name: "Constantine Mohamed Boudiaf",
    latitude: 36.276,
    longitude: 6.6204,
    kind: "airport",
  },
  {
    code: "MRS-PORT",
    name: "Gare maritime de Marseille",
    latitude: 43.323,
    longitude: 5.346,
    kind: "port",
  },
  {
    code: "SETE-PORT",
    name: "Gare maritime de Sète",
    latitude: 43.394,
    longitude: 3.704,
    kind: "port",
  },
  {
    code: "ALG-PORT",
    name: "Port d’Alger",
    latitude: 36.765,
    longitude: 3.067,
    kind: "port",
  },
  {
    code: "ORN-PORT",
    name: "Port d’Oran",
    latitude: 35.716,
    longitude: -0.647,
    kind: "port",
  },
];
const radians = (n: number) => (n * Math.PI) / 180;
const degrees = (n: number) => (n * 180) / Math.PI;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
export function geodesicDistance(a: GeoPoint, b: GeoPoint): number {
  const dLat = radians(b.latitude - a.latitude),
    dLon = radians(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radians(a.latitude)) *
      Math.cos(radians(b.latitude)) *
      Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(clamp(h)), Math.sqrt(1 - clamp(h)));
}
export function geodesicPoint(
  a: GeoPoint,
  b: GeoPoint,
  fraction: number,
): GeoPoint {
  const t = clamp(fraction),
    angle = geodesicDistance(a, b) / 6371;
  if (angle < 1e-9) return { latitude: a.latitude, longitude: a.longitude };
  const s = Math.sin(angle),
    wa = Math.sin((1 - t) * angle) / s,
    wb = Math.sin(t * angle) / s;
  const la = radians(a.latitude),
    lb = radians(b.latitude),
    oa = radians(a.longitude),
    ob = radians(b.longitude);
  const x = wa * Math.cos(la) * Math.cos(oa) + wb * Math.cos(lb) * Math.cos(ob);
  const y = wa * Math.cos(la) * Math.sin(oa) + wb * Math.cos(lb) * Math.sin(ob);
  const z = wa * Math.sin(la) + wb * Math.sin(lb);
  return {
    latitude: degrees(Math.atan2(z, Math.hypot(x, y))),
    longitude: degrees(Math.atan2(y, x)),
  };
}
export function geodesicHeading(a: GeoPoint, b: GeoPoint): number {
  const la = radians(a.latitude),
    lb = radians(b.latitude),
    delta = radians(b.longitude - a.longitude);
  return (
    (degrees(
      Math.atan2(
        Math.sin(delta) * Math.cos(lb),
        Math.cos(la) * Math.sin(lb) -
          Math.sin(la) * Math.cos(lb) * Math.cos(delta),
      ),
    ) +
      360) %
    360
  );
}
function routeSegments(route: RadarRoute) {
  const points = [route.origin, ...route.waypoints, route.destination];
  return points
    .slice(1)
    .map((end, i) => ({
      start: points[i],
      end,
      length: geodesicDistance(points[i], end),
    }));
}
export function routePosition(
  route: RadarRoute,
  fraction: number,
): { position: GeoPoint; heading: number; distance: number } {
  const segments = routeSegments(route),
    distance = segments.reduce((sum, s) => sum + s.length, 0);
  let remaining = clamp(fraction) * distance;
  for (const [i, segment] of segments.entries()) {
    if (remaining <= segment.length || i === segments.length - 1) {
      const t = segment.length ? clamp(remaining / segment.length) : 0;
      const position = geodesicPoint(segment.start, segment.end, t);
      const ahead = geodesicPoint(
        segment.start,
        segment.end,
        Math.min(1, t + 0.001),
      );
      return {
        position,
        heading:
          t >= 0.999
            ? geodesicHeading(
                geodesicPoint(segment.start, segment.end, 0.999),
                segment.end,
              )
            : geodesicHeading(position, ahead),
        distance,
      };
    }
    remaining -= segment.length;
  }
  return { position: route.destination, heading: 0, distance };
}
const node = (code: string): RadarNode => {
  const found = radarNodes.find((n) => n.code === code);
  if (!found) throw new Error(`Nœud radar inconnu : ${code}`);
  return found;
};
const simulationEpoch = Date.now();
// Identifiers refer to real operators; assignments, times, cargo and telemetry are demonstration data.
// The regional constructor remains backward compatible; the UI subscribes to the worldwide feed.
export function createRadarRoutes(epoch = simulationEpoch, worldwide = false): RadarRoute[] {
  const definitions: [
    string,
    string,
    string,
    RadarKind,
    string,
    string,
    number,
    number,
    number,
    number,
    number,
  ][] = [
    [
      "AH1000",
      "Air Algérie",
      "Boeing 737-800",
      "flight",
      "ALG",
      "CDG",
      -70,
      145,
      90,
      32,
      9,
    ],
    [
      "AH1021",
      "Air Algérie",
      "Boeing 737-800",
      "flight",
      "MRS",
      "ALG",
      -40,
      95,
      75,
      18,
      8,
    ],
    [
      "AH1061",
      "Air Algérie",
      "Boeing 737-800",
      "flight",
      "LYS",
      "CZL",
      85,
      115,
      60,
      26,
      10,
    ],
    [
      "TO7240",
      "Transavia",
      "Boeing 737-800",
      "flight",
      "ORY",
      "ALG",
      -65,
      150,
      80,
      42,
      7.5,
    ],
    [
      "TO7242",
      "Transavia",
      "Boeing 737-800",
      "flight",
      "ORY",
      "ORN",
      -20,
      155,
      70,
      21,
      8.5,
    ],
    [
      "AF1154",
      "Air France",
      "Airbus A320",
      "flight",
      "CDG",
      "ALG",
      20,
      150,
      80,
      36,
      11,
    ],
    [
      "CL-JN",
      "Corsica Linea",
      "Jean Nicoli",
      "ferry",
      "MRS-PORT",
      "ALG-PORT",
      -620,
      1260,
      2500,
      840,
      4.5,
    ],
    [
      "CL-DC",
      "Corsica Linea",
      "Danielle Casanova",
      "ferry",
      "ALG-PORT",
      "MRS-PORT",
      -400,
      1320,
      3200,
      1260,
      4,
    ],
    [
      "AF-BM3",
      "Algérie Ferries",
      "Badji Mokhtar III",
      "ferry",
      "SETE-PORT",
      "ORN-PORT",
      -800,
      1560,
      4000,
      1640,
      3.5,
    ],
  ];
  if (worldwide) definitions.push(
    ["AT780", "Royal Air Maroc", "Boeing 737-800", "flight", "CMN", "ORY", 300, 190, 96, 38, 9],
    ["TU720", "Tunisair", "Airbus A320", "flight", "TUN", "ORY", 330, 155, 80, 32, 8],
    ["HC404", "Air Sénégal", "Airbus A330-900", "flight", "DSS", "CDG", 360, 355, 160, 54, 10.5],
    ["AC870", "Air Canada", "Boeing 777-300ER", "flight", "YUL", "CDG", 390, 415, 180, 64, 10],
    ["EK074", "Emirates", "Airbus A380", "flight", "CDG", "DXB", 420, 410, 240, 92, 10.5],
    ["AF702", "Air France", "Boeing 777-300ER", "flight", "CDG", "ABJ", 450, 390, 160, 48, 10],
    ["TO3010", "Transavia", "Boeing 737-800", "flight", "ORY", "RAK", 480, 200, 75, 24, 8],
    ["BJ575", "Nouvelair", "Airbus A320", "flight", "LYS", "DJE", 510, 145, 70, 28, 8.5],
  );
  return definitions.map(
    ([
      reference,
      operator,
      vehicle,
      kind,
      from,
      to,
      offset,
      duration,
      capacityKg,
      availableKg,
      pricePerKg,
    ]) => ({
      id: reference,
      reference,
      operator,
      vehicle,
      kind,
      corridor: airports[from]?.corridor ?? airports[to]?.corridor ?? "maghreb",
      origin: node(from),
      destination: node(to),
      waypoints:
        reference === "AF-BM3"
          ? [
              { latitude: 41.5, longitude: 4.4 },
              { latitude: 38.8, longitude: 3.7 },
              { latitude: 37, longitude: 0.5 },
            ]
          : [],
      departureAt: epoch + offset * 60000,
      arrivalAt: epoch + (offset + duration) * 60000,
      capacityKg,
      availableKg,
      pricePerKg,
    }),
  );
}
export function getRadarSnapshot(
  now = Date.now(),
  epoch = simulationEpoch,
  worldwide = false,
): RadarSnapshot {
  if (!Number.isFinite(now) || !Number.isFinite(epoch))
    throw new Error("Horodatage radar invalide.");
  return {
    source: "simulation",
    updatedAt: now,
    movements: createRadarRoutes(epoch, worldwide).map((route, index) => {
      const progress = clamp(
        (now - route.departureAt) / (route.arrivalAt - route.departureAt),
      );
      const status: RadarStatus =
        now >= route.arrivalAt
          ? "arrived"
          : now >= route.departureAt
            ? "moving"
            : route.departureAt - now <= 30 * 60000
              ? "boarding"
              : "scheduled";
      const { position, heading, distance } = routePosition(route, progress);
      const variation = Math.sin(now / 120000 + index);
      return {
        ...route,
        position,
        heading,
        progress,
        status,
        distanceKm: distance,
        remainingKm: distance * (1 - progress),
        altitudeM:
          route.kind === "flight" && status === "moving"
            ? Math.round(
                11000 * Math.min(1, progress / 0.15, (1 - progress) / 0.15),
              )
            : 0,
        groundSpeedKmh:
          status === "moving"
            ? Math.round(
                distance / ((route.arrivalAt - route.departureAt) / 3600000),
              )
            : 0,
        weather: {
          windKmh: Math.round(18 + index + variation * 4),
          windDirection: Math.round(290 + variation * 15),
          waveHeightM:
            route.kind === "ferry"
              ? Math.round((0.8 + (variation + 1) * 0.4) * 10) / 10
              : null,
          temperatureC: Math.round(20 + variation * 2),
          description:
            route.kind === "ferry" ? "Mer peu agitée" : "Visibilité dégagée",
        },
      };
    }),
  };
}
export const radarStatusLabels: Record<RadarStatus, string> = {
  scheduled: "Programmé",
  boarding: "Embarquement",
  moving: "En route",
  arrived: "Arrivé",
};
export const flightFerryRadarApi = {
  getSnapshot: () => getRadarSnapshot(Date.now(), simulationEpoch, true),
  async getManifest(): Promise<RadarSnapshot> {
    return getRadarSnapshot(Date.now(), simulationEpoch, true);
  },
  subscribe(listener: (snapshot: RadarSnapshot) => void): () => void {
    listener(getRadarSnapshot(Date.now(), simulationEpoch, true));
    const timer = setInterval(() => listener(getRadarSnapshot(Date.now(), simulationEpoch, true)), 1000);
    return () => clearInterval(timer);
  },
};
