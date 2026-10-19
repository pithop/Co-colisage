export type FlightRoute = {
  id: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  prices: [number, number, number];
  airlines: [string, string, string];
};

// Illustrative inventory: replace with bookable fares and route-specific missions.
export const flightRoutes: FlightRoute[] = [
  {
    id: "mrs-alg",
    origin: "Marseille",
    originCode: "MRS",
    destination: "Alger",
    destinationCode: "ALG",
    prices: [65, 49, 79],
    airlines: ["Air Algérie", "Vueling", "Transavia"],
  },
  {
    id: "par-alg",
    origin: "Paris",
    originCode: "ORY",
    destination: "Alger",
    destinationCode: "ALG",
    prices: [89, 59, 75],
    airlines: ["Air Algérie", "Transavia", "Vueling"],
  },
  {
    id: "lys-orn",
    origin: "Lyon",
    originCode: "LYS",
    destination: "Oran",
    destinationCode: "ORN",
    prices: [69, 85, 55],
    airlines: ["Transavia", "Air Algérie", "Transavia"],
  },
  {
    id: "mrs-tun",
    origin: "Marseille",
    originCode: "MRS",
    destination: "Tunis",
    destinationCode: "TUN",
    prices: [45, 62, 79],
    airlines: ["Transavia", "Transavia", "Transavia"],
  },
  {
    id: "tls-cmn",
    origin: "Toulouse",
    originCode: "TLS",
    destination: "Casablanca",
    destinationCode: "CMN",
    prices: [95, 69, 89],
    airlines: ["Vueling", "Vueling", "Vueling"],
  },
];

export const demoCommission = 150;
