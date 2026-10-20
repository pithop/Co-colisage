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

const people = [
  ["Amine Zeroual", "photo-1500648767791-00dcc994a43e"],
  ["Yasmine Benali", "photo-1534528741775-53994a69daeb"],
  ["Thomas Dubois", "photo-1507003211169-0a1dd7228f2d"],
  ["Fatou Diallo", "photo-1531123897727-8f129e1688ce"],
  ["Mehdi Trabelsi", "photo-1506794778202-cad84cf45f1d"],
  ["Sofia Martinez", "photo-1494790108377-be9c29b29330"],
  ["Nadia Koné", "photo-1544005313-94ddf0286df2"],
] as const;
const portrait = (index: number) => `/images/portraits/${people[index % people.length][1]}.jpg`;
export const internationalTrips: Trip[] = internationalRoutes.map((route, index) => ({
  id: `world-trip-${route.id}`,
  market: "international", demo: true,
  title: `${route.origin} → ${route.destination}`,
  origin: route.origin, destination: route.destination,
  originCode: route.originCode, destinationCode: route.destinationCode,
  travelerName: people[index % people.length][0], travelerAvatar: portrait(index),
  transportType: "avion", transportLabel: route.airlines[0],
  departureDate: demoDate(2 + index % 8), departureTime: ["08:40", "12:15", "16:30", "20:10"][index % 4],
  availableKg: 8 + index % 5, pricePerKg: 8 + index % 4,
  rating: 4.5, reviewsCount: 2,
  image: "/images/vehicle-plane.svg",
  canCarryParcel: true, canBuyProduct: true, shoppingCommission: 35,
  description: `Je rejoins ${route.destination} avec ${route.airlines[0]}. Remise à ${route.origin} la veille du départ, sur rendez-vous. Merci de préciser le contenu, le poids et la valeur du colis ; facture à joindre pour les articles neufs. Je peux passer en boutique sur confirmation préalable.`,
  reviews: [
    { id: `${route.id}-review-1`, author: people[(index + 2) % people.length][0], rating: 5, date: demoDate(-12), comment: "Rendez-vous confirmé la veille. Le colis a été pesé ensemble et photographié avant la fermeture. Remise à l’arrivée à l’heure convenue, avec un message pour prévenir du passage des contrôles.", demo: true },
    { id: `${route.id}-review-2`, author: people[(index + 4) % people.length][0], rating: 4, date: demoDate(-26), comment: "Article reçu avec la facture et son emballage d’origine. Le départ a pris quarante minutes de retard ; j’ai été prévenue et nous avons ajusté le rendez-vous sans difficulté.", demo: true },
  ],
}));

export const internationalRequests: PurchaseRequest[] = internationalRoutes.flatMap((route, index) => {
  const reverse = route.id.endsWith("-return");
  const longHaul = [route.originCode, route.destinationCode].some(code => ["YUL", "DSS", "ABJ", "DXB"].includes(code));
  const rewards = longHaul ? [90, 65, 55, 140] : [60, 55, 45, 120];
  const articles: readonly (readonly [string, string, number])[] = reverse ? [
    ["Céramiques artisanales · coffret de quatre tasses", "Chaque pièce est emballée séparément dans un carton double cannelure. Facture de l’atelier jointe, valeur déclarée 85 €.", 2.4],
    ["Documents de famille · enveloppe scellée", "Copies certifiées et dossier de scolarité. Enveloppe A4 renforcée, remise au destinataire sur rendez-vous.", 0.3],
    ["Linge de maison · deux housses tissées", "Housses en coton sans rembourrage, dimensions 40 × 40 cm. Sachet protecteur et facture de l’artisan.", 0.7],
    ["Création artisanale · sac en toile", "Achat auprès de l’atelier, modèle sable, anses en cuir. Faire confirmer la photo avant achat et conserver le reçu.", 0.8],
  ] as const : [
    ["Pièces auto · capteur ABS neuf avec facture", "Capteur Bosch dans sa boîte, référence à vérifier avec l’expéditeur. Aucun liquide ni batterie. Carton 24 × 18 × 10 cm, valeur déclarée 95 €.", 1.8],
    ["Ordonnances urgentes · documents originaux", "Enveloppe scellée contenant uniquement des documents papier pour un dossier médical. Aucun médicament. Remise à un proche nommé dans la demande.", 0.3],
    ["Matériel médical · brassard de tensiomètre", "Brassard adulte neuf, sans appareil électrique ni batterie, sous emballage fabricant. Référence et facture fournies avant prise en charge.", 0.4],
    [index % 3 === 0 ? "iPhone 16 scellé avec facture" : "Cosmétiques parapharmacie · coffret soin", index % 3 === 0
      ? "128 Go, noir, neuf et scellé. Achat après validation du prix ; facture nominative et numéro de série à transmettre. Transport et déclaration à confirmer avant accord."
      : "Deux crèmes hydratantes 50 ml et un sérum 30 ml, produits non aérosols. Vérifier les références avec l’acheteuse et joindre le ticket de pharmacie.", 0.8],
  ];
  return articles.map(([title, specifications, weightKg], itemIndex): PurchaseRequest => ({
    id: `world-request-${route.id}-${itemIndex}`,
    market: "international", demo: true, status: "available",
    kind: itemIndex === 3 ? "shopping" : "parcel",
    origin: route.origin, destination: route.destination,
    originCode: route.originCode, destinationCode: route.destinationCode,
    availableFrom: demoDate(0), date: demoDate(14),
    title, specifications, weightKg,
    budget: itemIndex === 3 ? (title.includes("iPhone") ? 869 : reverse ? 85 : 78) : 0,
    reward: rewards[itemIndex],
    buyer: people[(index + itemIndex + 1) % people.length][0],
    buyerAvatar: portrait(index + itemIndex + 1),
    image: title.includes("iPhone") ? "/images/phone.jpg" : "/images/parcel.svg",
    location: `${route.destination}, rendez-vous à convenir`,
    pickupLocation: `${route.origin}, remise la veille du départ`,
    flexibility: itemIndex === 1 ? "urgent" : "week",
  }));
});

// Existing express itineraries retain a single, corridor-specific example mission.
for (const id of ["mrs-alg", "lys-orn", "mrs-tun", "tls-cmn"]) {
  const route = internationalRoutes.find(item => item.id === id)!;
  const existing = internationalRequests.filter(item => item.id.startsWith(`world-request-${id}-`) && !item.id.includes("-return-"));
  existing.forEach(item => { item.status = "unavailable"; });
  internationalRequests.push({
    id: `world-request-${id}-dior`, market: "international", demo: true, status: "available",
    kind: "shopping", title: "2 Parfums Dior Sauvage",
    origin: route.origin, destination: route.destination,
    originCode: route.originCode, destinationCode: route.destinationCode,
    availableFrom: demoDate(0), date: demoDate(14), budget: 258, reward: 150, weightKg: 0.8,
    image: "/images/perfume.jpg", buyer: "Yasmine Benali", buyerAvatar: portrait(1),
    specifications: "Deux flacons de 100 ml dans leur emballage d’origine. Références et prix à confirmer avant achat ; ticket de caisse demandé.",
    location: `${route.destination}, rendez-vous à convenir`,
  });
}
