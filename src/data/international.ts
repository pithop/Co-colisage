import type { PurchaseRequest, Trip } from "./marketplace";
import type { FlightRoute } from "./flightSimulation";

export type Corridor = "maghreb" | "west-africa" | "transatlantic" | "middle-east";
export const corridorLabels: Record<Corridor, string> = {
  maghreb: "Maghreb",
  "west-africa": "Afrique de l’Ouest",
  transatlantic: "Transatlantique",
  "middle-east": "Moyen-Orient",
};

export const airports: Record<string, { city: string; country: string; corridor?: Corridor }> = {
  CDG: { city: "Paris", country: "FR" }, ORY: { city: "Paris", country: "FR" },
  BVA: { city: "Paris", country: "FR" }, MRS: { city: "Marseille", country: "FR" },
  LYS: { city: "Lyon", country: "FR" }, NCE: { city: "Nice", country: "FR" },
  TLS: { city: "Toulouse", country: "FR" },
  ALG: { city: "Alger", country: "DZ", corridor: "maghreb" },
  ORN: { city: "Oran", country: "DZ", corridor: "maghreb" },
  CZL: { city: "Constantine", country: "DZ", corridor: "maghreb" },
  CMN: { city: "Casablanca", country: "MA", corridor: "maghreb" },
  RAK: { city: "Marrakech", country: "MA", corridor: "maghreb" },
  TUN: { city: "Tunis", country: "TN", corridor: "maghreb" },
  DJE: { city: "Djerba", country: "TN", corridor: "maghreb" },
  DSS: { city: "Dakar", country: "SN", corridor: "west-africa" },
  ABJ: { city: "Abidjan", country: "CI", corridor: "west-africa" },
  YUL: { city: "Montréal", country: "CA", corridor: "transatlantic" },
  DXB: { city: "Dubaï", country: "AE", corridor: "middle-east" },
};

export function demoDate(days: number, now = new Date()): string {
  const date = new Date(now);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// Illustrative fares, never a claim of live availability. Portraits are stock photography.
const routeDefinitions: [string, string, string, number, [string, string, string]][] = [
  ["par-alg", "ORY", "ALG", 49, ["Transavia", "Air Algérie", "Air France"]],
  ["par-cmn", "ORY", "CMN", 59, ["Transavia", "Royal Air Maroc", "Transavia"]],
  ["mrs-cmn", "MRS", "CMN", 79, ["Royal Air Maroc", "Royal Air Maroc", "Royal Air Maroc"]],
  ["par-rak", "ORY", "RAK", 69, ["Transavia", "Royal Air Maroc", "Transavia"]],
  ["mrs-rak", "MRS", "RAK", 39, ["Ryanair", "Ryanair", "Ryanair"]],
  ["lys-rak", "LYS", "RAK", 65, ["EasyJet", "Transavia", "EasyJet"]],
  ["par-tun", "ORY", "TUN", 65, ["Tunisair", "Transavia", "Tunisair"]],
  ["lys-tun", "LYS", "TUN", 59, ["Nouvelair", "Tunisair", "Nouvelair"]],
  ["par-dje", "ORY", "DJE", 79, ["Transavia", "Tunisair", "Transavia"]],
  ["lys-dje", "LYS", "DJE", 85, ["Nouvelair", "Nouvelair", "Nouvelair"]],
  ["par-dss", "CDG", "DSS", 249, ["Air Sénégal", "Air France", "Air Sénégal"]],
  ["par-abj", "CDG", "ABJ", 279, ["Air France", "Air France", "Air France"]],
  ["ory-abj", "ORY", "ABJ", 269, ["Corsair", "Corsair", "Corsair"]],
  ["par-yul", "CDG", "YUL", 229, ["Air Canada", "Air Transat", "Air France"]],
  ["par-dxb", "CDG", "DXB", 299, ["Emirates", "Emirates", "Emirates"]],
  ["mrs-orn", "MRS", "ORN", 55, ["Volotea", "Air Algérie", "Volotea"]],
  ["lys-czl", "LYS", "CZL", 69, ["Air Algérie", "Air Algérie", "Air Algérie"]],
  ["nce-alg", "NCE", "ALG", 59, ["Air Algérie", "Air Algérie", "Air Algérie"]],
  ["mrs-alg", "MRS", "ALG", 49, ["Air Algérie", "Air Algérie", "Air Algérie"]],
  ["lys-orn", "LYS", "ORN", 55, ["Transavia", "Air Algérie", "Transavia"]],
  ["mrs-tun", "MRS", "TUN", 39, ["Tunisair", "Nouvelair", "Tunisair"]],
  ["tls-cmn", "TLS", "CMN", 69, ["Royal Air Maroc", "Royal Air Maroc", "Royal Air Maroc"]],
];
export const internationalRoutes: FlightRoute[] = routeDefinitions.flatMap(
  ([id, from, to, fare, airlines]) => [false, true].map(reverse => ({
    id: reverse ? `${id}-return` : id,
    origin: airports[reverse ? to : from].city,
    destination: airports[reverse ? from : to].city,
    originCode: reverse ? to : from,
    destinationCode: reverse ? from : to,
    prices: [fare + (reverse ? 10 : 0), fare + 25, fare + 45],
    airlines,
  })),
);

export const internationalTrips: Trip[] = [];
export const internationalRequests: PurchaseRequest[] = [];

