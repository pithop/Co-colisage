import { airports, internationalRoutes } from "../data/international";
import { flightRoutes } from "../data/flightSimulation";
import { normalize, type PurchaseRequest } from "../data/marketplace";
import type { ArbitrageOpportunity, FlightDeal } from "../types";

export interface FlightOffer extends FlightDeal {
  routeId: string;
  departureAt: string;
  arrivalAt: string;
  currency: "EUR";
  source: "estimate" | "live";
  fetchedAt: string;
  expiresAt: string;
  availableKg: number;
  baggageCost: number;
  fees: number;
}
export interface MatchedOpportunity extends ArbitrageOpportunity {
  flight: FlightOffer;
  requestIds: string[];
  totalWeightKg: number;
  roi: number | null;
  additionalCosts: number;
}
export interface ArbitrageSnapshot {
  source: "estimate" | "live";
  updatedAt: string;
  offers: FlightOffer[];
  opportunities: MatchedOpportunity[];
  error?: string;
}
export interface ArbitrageFilters {
  origin?: string;
  destination?: string;
  minNetProfit?: number;
  sort?: "profit" | "roi";
}

export function cents(amount: number): number {
  if (!Number.isFinite(amount) || amount < 0 || !Number.isSafeInteger(Math.round(amount * 100)))
    throw new Error("Montant invalide.");
  return Math.round(amount * 100);
}

export function calculateProfit(rewards: number[], fare: number, baggage = 0, fees = 0) {
  const commissionCents = rewards.reduce((sum, reward) => sum + cents(reward), 0);
  const costCents = cents(fare) + cents(baggage) + cents(fees);
  if (!Number.isSafeInteger(commissionCents) || !Number.isSafeInteger(costCents))
    throw new Error("Montant total invalide.");
  return {
    totalOrderReward: commissionCents / 100,
    netProfit: (commissionCents - costCents) / 100,
    roi: costCents ? Math.round((commissionCents - costCents) / costCents * 1000) / 10 : null,
    additionalCosts: (cents(baggage) + cents(fees)) / 100,
  };
}

function samePlace(city: string, airportCode: string | undefined, flightCity: string, flightCode: string) {
  if (airportCode) return airportCode.toUpperCase() === flightCode;
  const clean = normalize(city).trim();
  return clean === normalize(flightCity).trim()
    || clean === normalize(airports[flightCode]?.city ?? flightCity)
    || clean === normalize(flightCode);
}
const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(`${value}T00:00:00Z`))
  && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;

export function matchFlight(
  flight: FlightOffer,
  requests: PurchaseRequest[],
  reservedIds: readonly string[] = [],
  now = Date.now(),
): MatchedOpportunity {
  const seen = new Set<string>(reservedIds);
  const departureDay = flight.departureAt.slice(0, 10);
  const arrivalDay = flight.arrivalAt.slice(0, 10);
  const eligible = requests.filter(request => {
    if (seen.has(request.id)) return false;
    seen.add(request.id);
    return (!request.status || request.status === "available")
      && Date.parse(flight.departureAt) > now && Date.parse(flight.expiresAt) > now
      && Number.isFinite(request.reward) && request.reward > 0
      && Number.isFinite(request.weightKg) && request.weightKg! > 0
      && validDate(request.date) && request.date >= arrivalDay
      && (!request.availableFrom || (validDate(request.availableFrom) && request.availableFrom <= departureDay))
      && samePlace(request.origin, request.originCode, flight.origin, flight.originCode)
      && samePlace(request.destination, request.destinationCode, flight.destination, flight.destinationCode);
  }).sort((a, b) => a.id.localeCompare(b.id));

  // Sparse knapsack in grams: choose the highest commission that fits, without duplicate requests.
  const capacity = Math.floor(flight.availableKg * 1000);
  const bundles = new Map<number, { reward: number; requests: PurchaseRequest[] }>([[0, { reward: 0, requests: [] }]]);
  for (const request of eligible) {
    const grams = Math.ceil(request.weightKg! * 1000);
    for (const [weight, bundle] of [...bundles]) {
      const nextWeight = weight + grams;
      if (nextWeight > capacity) continue;
      const reward = bundle.reward + cents(request.reward);
      if (reward > (bundles.get(nextWeight)?.reward ?? -1))
        bundles.set(nextWeight, { reward, requests: [...bundle.requests, request] });
    }
  }
  let selected: PurchaseRequest[] = [];
  let bestReward = -1;
  let totalWeight = 0;
  for (const [weight, bundle] of bundles) {
    if (bundle.reward > bestReward || (bundle.reward === bestReward && weight < totalWeight)) {
      selected = bundle.requests; bestReward = bundle.reward; totalWeight = weight;
    }
  }
  const result = calculateProfit(selected.map(request => request.reward), flight.flightPrice, flight.baggageCost, flight.fees);
  return {
    id: `arbitrage-${flight.id}`, title: `${flight.origin} → ${flight.destination}`,
    city: flight.destination, flight,
    requestIds: selected.map(request => request.id),
    ordersCount: selected.length, ordersDescription: selected.map(request => request.title).join(" · "),
    clientName: selected[0]?.buyer ?? "Aucune demande", clientAvatar: selected[0]?.buyerAvatar ?? "",
    totalWeightKg: totalWeight / 1000, escrowSecured: false,
    ...result,
  };
}

export function filterOpportunities(opportunities: MatchedOpportunity[], filters: ArbitrageFilters = {}) {
  return opportunities.filter(deal =>
    (!filters.origin || deal.flight.origin === filters.origin)
    && (!filters.destination || deal.flight.destination === filters.destination)
    && (filters.minNetProfit === undefined || deal.netProfit >= filters.minNetProfit),
  ).sort((a, b) =>
    (filters.sort === "roi" ? (b.roi ?? -Infinity) - (a.roi ?? -Infinity) : b.netProfit - a.netProfit)
    || b.netProfit - a.netProfit || a.flight.departureAt.localeCompare(b.flight.departureAt) || a.id.localeCompare(b.id),
  );
}

export function estimatedFlightOffers(now = new Date()): FlightOffer[] {
  const routes = [
    ...flightRoutes.map(route => route.id === "mrs-tun" ? internationalRoutes.find(item => item.id === route.id)! : route),
    ...internationalRoutes.filter(route => !flightRoutes.some(legacy => legacy.id === route.id)),
  ];
  return routes.flatMap(route => route.prices.map((fare, index) => {
    const departure = new Date(now);
    departure.setUTCDate(departure.getUTCDate() + index + 1);
    departure.setUTCHours(10, 0, 0, 0);
    const longHaul = [route.originCode, route.destinationCode].some(code => ["YUL", "DSS", "ABJ", "DXB"].includes(code));
    return {
      id: `estimate-${route.id}-${departure.toISOString().slice(0, 10)}`, routeId: route.id,
      origin: route.origin, originCode: route.originCode, destination: route.destination, destinationCode: route.destinationCode,
      departureDate: departure.toISOString().slice(0, 10), departureTime: "10:00",
      departureAt: departure.toISOString(), arrivalAt: new Date(+departure + (longHaul ? 8 : 3) * 3600000).toISOString(),
      airline: route.airlines[index], flightNumber: "À confirmer", flightPrice: fare, carrierType: "avion",
      currency: "EUR", source: "estimate", fetchedAt: now.toISOString(),
      expiresAt: new Date(+now + 5 * 60000).toISOString(),
      availableKg: longHaul ? 12 : 8, baggageCost: 0, fees: 0,
    };
  }));
}

export function parseLiveOffers(payload: unknown, now = Date.now()): FlightOffer[] {
  if (!payload || typeof payload !== "object" || !("offers" in payload) || !Array.isArray(payload.offers))
    throw new Error("Réponse du fournisseur invalide.");
  const ids = new Set<string>();
  return payload.offers.map((value: unknown) => {
    if (!value || typeof value !== "object") throw new Error("Offre invalide.");
    const offer = value as Record<string, unknown>;
    const strings = ["id", "routeId", "origin", "destination", "originCode", "destinationCode", "airline", "flightNumber", "departureAt", "arrivalAt", "fetchedAt", "expiresAt"];
    if (strings.some(key => typeof offer[key] !== "string" || !String(offer[key]).trim())
      || offer.currency !== "EUR" || ids.has(String(offer.id))
      || !/^[A-Z]{3}$/.test(String(offer.originCode)) || !/^[A-Z]{3}$/.test(String(offer.destinationCode)))
      throw new Error("Offre incomplète ou devise non prise en charge.");
    for (const key of ["flightPrice", "baggageCost", "fees", "availableKg"]) {
      if (typeof offer[key] !== "number") throw new Error("Coûts ou franchise absents.");
      cents(offer[key] as number);
    }
    const times = ["departureAt", "arrivalAt", "fetchedAt", "expiresAt"].map(key => Date.parse(String(offer[key])));
    if (times.some(time => !Number.isFinite(time)) || times[0] <= now || times[1] <= times[0]
      || times[2] > now + 60000 || times[3] <= now || times[3] <= times[2] || times[3] > times[0]
      || Number(offer.availableKg) > 100 || Number(offer.availableKg) <= 0)
      throw new Error("Offre expirée, dates ou franchise invalides.");
    ids.add(String(offer.id));
    return {
      ...offer, source: "live", carrierType: "avion",
      departureDate: String(offer.departureAt).slice(0, 10),
      departureTime: new Date(times[0]).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }),
    } as unknown as FlightOffer;
  });
}

// A server adapter holds supplier credentials and returns priced EUR offers.
// No private API key is ever shipped in the browser bundle.
export const flightArbitrageApi = {
  async scan(requests: PurchaseRequest[], reservedIds: readonly string[] = [], signal?: AbortSignal, options: { endpoint?: string } = {}): Promise<ArbitrageSnapshot> {
    let offers = estimatedFlightOffers();
    let source: ArbitrageSnapshot["source"] = "estimate";
    let error: string | undefined;
    const endpoint = options.endpoint ?? import.meta.env.VITE_FLIGHT_ARBITRAGE_URL as string | undefined;
    if (endpoint) {
      try {
        const response = await fetch(endpoint, { signal, headers: { Accept: "application/json" }, cache: "no-store" });
        if (!response.ok) throw new Error("Le fournisseur de vols est indisponible.");
        offers = parseLiveOffers(await response.json());
        source = "live";
      } catch (cause) {
        if (signal?.aborted) throw cause;
        error = "Tarifs en direct indisponibles. Les estimations sont affichées.";
      }
    }
    return { source, offers, updatedAt: new Date().toISOString(), error, opportunities: offers.map(offer => matchFlight(offer, requests, reservedIds)) };
  },
};
