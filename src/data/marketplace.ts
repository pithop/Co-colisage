import type { FreightItem } from "../types";
import { internationalRequests, internationalTrips } from "./international";

export interface ShoppingItem {
  id: string;
  name: string;
  url: string;
  specifications: string;
  price: number;
  photo?: import('../services/uploads').Attachment;
}
export interface PurchaseRequest {
  market?: "international";
  demo?: boolean;
  status?: "available" | "reserved" | "unavailable";
  originCode?: string;
  destinationCode?: string;
  availableFrom?: string;
  ownerId?: string;
  kind?: 'shopping' | 'parcel';
  items?: ShoppingItem[];
  photos?: import('../services/uploads').Attachment[];
  flexibility?: 'urgent' | 'week' | 'deadline';
  dimensions?: { length: number; width: number; height: number };
  declaredValue?: number;
  declaredCurrency?: 'EUR' | 'DZD';
  customsDirection?: 'FR-DZ' | 'DZ-FR';
  transportReference?: string;
  pickupLocation?: string;
  recipientName?: string;
  recipientEmail?: string;
  id: string;
  title: string;
  origin: string;
  destination: string;
  date: string;
  budget: number;
  reward: number;
  serviceGross?: number;
  platformFee?: number;
  image: string;
  buyer: string;
  buyerAvatar?: string;
  specifications: string;
  location: string;
  weightKg?: number;
}
export const acceptedCategories = [
  "Électronique",
  "Mode",
  "Cosmétiques",
  "Documents",
  "Terroir",
] as const;
export type AcceptedCategory = (typeof acceptedCategories)[number];
export interface Trip extends FreightItem {
  market?: "international";
  demo?: boolean;
  reviews?: { id: string; author: string; rating: number; date: string; comment: string; demo: boolean }[];
  ownerId?: string;
  professional?: { companyName: string; registration: string; volume: number };
  status?: 'scheduled' | 'in_transit' | 'completed' | 'cancelled';
  delayMinutes?: number;
  transportedKg?: number;
  capacity?: string;
  dimensions?: string;
  startingPrice?: number;
  flightNumber?: string;
  autoAccept?: boolean;
  isSuperTraveler?: boolean;
  acceptedCategories?: AcceptedCategory[];
}
function upcomingDate(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export const requests: PurchaseRequest[] = [
  {
    id: "req-med-1",
    kind: "parcel",
    title: "iPhone 15 Pro Max (256 Go) Titane Naturel",
    origin: "Paris (CDG)",
    destination: "Alger (ALG)",
    date: upcomingDate(3),
    budget: 1244,
    reward: 45,
    serviceGross: 1199,
    platformFee: 45,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    buyer: "Karim Bouzid",
    buyerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    specifications: "Boîte scellée neuve avec facture d'achat Apple Store Opéra. Scellé STEB requis.",
    location: "Aéroport Paris-CDG T2E",
    weightKg: 0.5,
    flexibility: "urgent",
    declaredValue: 1199,
    declaredCurrency: "EUR",
    customsDirection: "FR-DZ",
    transportReference: "Air Algérie AH1021",
    status: "available",
  },
  {
    id: "req-med-2",
    kind: "parcel",
    title: "Coffret Parfums & Cosmétiques Armani Code + Soins",
    origin: "Marseille (MRS)",
    destination: "Oran (ORN)",
    date: upcomingDate(5),
    budget: 230,
    reward: 35,
    serviceGross: 195,
    platformFee: 35,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    buyer: "Nadia Khemis",
    buyerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    specifications: "Flacon 100ml sous blister d'origine Sephora Terrasses du Port + échantillon crème.",
    location: "Gare Maritime de Marseille",
    weightKg: 1.8,
    flexibility: "week",
    declaredValue: 195,
    declaredCurrency: "EUR",
    customsDirection: "FR-DZ",
    transportReference: "Corsica Linea 'A Nepita'",
    status: "available",
  },
  {
    id: "req-med-3",
    kind: "parcel",
    title: "Sneakers Nike Air Jordan 1 Retro High OG",
    origin: "Lyon (LYS)",
    destination: "Constantine (CZL)",
    date: upcomingDate(7),
    budget: 190,
    reward: 30,
    serviceGross: 160,
    platformFee: 30,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    buyer: "Yassine Mansouri",
    buyerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    specifications: "Boîte à chaussures d'origine neuve non compressée. Reçu Nike Store Part-Dieu inclus.",
    location: "Lyon Saint-Exupéry (LYS)",
    weightKg: 1.4,
    flexibility: "urgent",
    declaredValue: 160,
    declaredCurrency: "EUR",
    customsDirection: "FR-DZ",
    transportReference: "Transavia TO7240",
    status: "available",
  },
  {
    id: "req-med-4",
    kind: "parcel",
    title: "Dossier Médical & Papiers Notariés Urgents",
    origin: "Paris (ORY)",
    destination: "Tunis (TUN)",
    date: upcomingDate(2),
    budget: 105,
    reward: 25,
    serviceGross: 80,
    platformFee: 25,
    image: "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=800&q=80",
    buyer: "Selma Trabelsi",
    buyerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    specifications: "Enveloppe A4 renforcée inviolable avec certificat de non-ouverture au départ.",
    location: "Aéroport Paris-Orly 4",
    weightKg: 0.3,
    flexibility: "urgent",
    declaredValue: 80,
    declaredCurrency: "EUR",
    customsDirection: "FR-DZ",
    transportReference: "Tunisair TU721",
    status: "available",
  },
  {
    id: "req-med-5",
    kind: "shopping",
    title: "Sac à Main Cuir Créateur & Accessoires de Luxe",
    origin: "Paris (CDG)",
    destination: "Casablanca (CMN)",
    date: upcomingDate(4),
    budget: 680,
    reward: 55,
    serviceGross: 625,
    platformFee: 55,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    buyer: "Amina Alami",
    buyerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    specifications: "Achat boutique Galeries Lafayette Haussmann avec détaxe douanière 12% et ticket fiscal.",
    location: "Galeries Lafayette Paris",
    weightKg: 1.1,
    flexibility: "week",
    declaredValue: 625,
    declaredCurrency: "EUR",
    status: "available",
  },
];

export const trips: Trip[] = [
  {
    id: "trip-med-1",
    title: "Paris (CDG) → Alger (ALG) · Air Algérie",
    transportType: "avion",
    transportLabel: "Avion · Vol Régulier",
    origin: "Paris (CDG)",
    originCode: "CDG",
    destination: "Alger (ALG)",
    destinationCode: "ALG",
    departureDate: upcomingDate(3),
    departureTime: "07:30",
    flightNumber: "AH1021",
    pricePerKg: 10,
    startingPrice: 10,
    availableKg: 14,
    travelerName: "Karim Bouzid",
    travelerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    rating: 4.95,
    reviewsCount: 38,
    isSuperTraveler: true,
    isIdentityVerified: true,
    isTicketVerified: true,
    canCarryParcel: true,
    canBuyProduct: true,
    shoppingCommission: 25,
    description: "Vol direct Paris-Alger. Kilos en soute disponibles pour vos colis scellés et achats Duty-Free aéroportuaires.",
    status: "scheduled",
  },
  {
    id: "trip-med-2",
    title: "Marseille Port → Oran Port · Corsica Linea",
    transportType: "bateau",
    transportLabel: "Bateau · Car-Ferry",
    origin: "Marseille (MRS-PORT)",
    originCode: "MRS",
    destination: "Oran (ORN-PORT)",
    destinationCode: "ORN",
    departureDate: upcomingDate(5),
    departureTime: "12:00",
    flightNumber: "Navire A Nepita",
    pricePerKg: 8,
    startingPrice: 8,
    availableKg: 35,
    travelerName: "Sofiane Meziane",
    travelerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 24,
    isSuperTraveler: true,
    isIdentityVerified: true,
    isTicketVerified: true,
    canCarryParcel: true,
    canBuyProduct: false,
    description: "Traversée maritime en ferry avec grand coffre SUV. Parfait pour cartons volumineux, électroménager et fret.",
    status: "scheduled",
  },
  {
    id: "trip-med-3",
    title: "Paris Gare de Lyon → Marseille Saint-Charles · TGV InOui",
    transportType: "train",
    transportLabel: "Train · TGV Grande Vitesse",
    origin: "Paris Gare de Lyon",
    originCode: "PAR",
    destination: "Marseille Saint-Charles",
    destinationCode: "MRS",
    departureDate: upcomingDate(2),
    departureTime: "09:15",
    flightNumber: "TGV InOui 6612",
    pricePerKg: 7,
    startingPrice: 7,
    availableKg: 10,
    travelerName: "Inès Benali",
    travelerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
    rating: 4.98,
    reviewsCount: 42,
    isSuperTraveler: true,
    isIdentityVerified: true,
    isTicketVerified: true,
    canCarryParcel: true,
    canBuyProduct: true,
    shoppingCommission: 20,
    description: "Trajet TGV rapide. Prise en charge de plis urgents, documents juridiques et petits paquets d'une gare à l'autre.",
    status: "scheduled",
  },
  {
    id: "trip-med-4",
    title: "Lyon (LYS) → Constantine (CZL) · Transavia",
    transportType: "avion",
    transportLabel: "Avion · Vol Direct",
    origin: "Lyon (LYS)",
    originCode: "LYS",
    destination: "Constantine (CZL)",
    destinationCode: "CZL",
    departureDate: upcomingDate(6),
    departureTime: "14:45",
    flightNumber: "TO7240",
    pricePerKg: 11,
    startingPrice: 11,
    availableKg: 12,
    travelerName: "Mehdi Cherif",
    travelerAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
    rating: 4.88,
    reviewsCount: 19,
    isSuperTraveler: true,
    isIdentityVerified: true,
    isTicketVerified: true,
    canCarryParcel: true,
    canBuyProduct: true,
    shoppingCommission: 30,
    description: "Vol direct Lyon-Constantine. Kilos valise disponibles pour cosmétiques, matériel high-tech et colis familiaux.",
    status: "scheduled",
  },
  {
    id: "trip-med-5",
    title: "Paris → Lyon → Marseille → Alger · Fret Express",
    transportType: "camion",
    transportLabel: "Utilitaire · Renault Master 14m³",
    origin: "Paris (Île-de-France)",
    originCode: "PAR",
    destination: "Alger (Grand Alger)",
    destinationCode: "ALG",
    departureDate: upcomingDate(8),
    departureTime: "06:00",
    flightNumber: "Master 14m³ Hayon",
    pricePerKg: 6,
    startingPrice: 6,
    availableKg: 180,
    travelerName: "Express Maghreb Fret",
    travelerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
    rating: 4.96,
    reviewsCount: 67,
    isSuperTraveler: true,
    isIdentityVerified: true,
    isTicketVerified: true,
    canCarryParcel: true,
    canBuyProduct: false,
    description: "Camion utilitaire grand volume sécurisé avec hayon. Déménagements partiels, malles et palettes professionnelles.",
    status: "scheduled",
  },
];

export const euro = (value: number) =>
  `${new Intl.NumberFormat("fr-FR").format(value)} €`;
export const dateLabel = (value: string, long = false) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: long ? "long" : "short",
  });
export const timeLabel = (value = "") =>
  value.replace(":00", " h").replace(":", " h ");
export const vehicleLabel = (trip: Trip) =>
  ({
    voiture: "Voiture",
    camion: "Camionnette",
    avion: trip.id === "emma" ? "Bagage" : "Avion",
    bateau: "Bateau",
    train: "Train & TGV",
    dutyfree: "Bagage",
  })[trip.transportType];
export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
