import type { FreightItem } from "../types";

export interface PurchaseRequest {
  id: string;
  title: string;
  origin: string;
  destination: string;
  date: string;
  budget: number;
  reward: number;
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
  capacity?: string;
  dimensions?: string;
  startingPrice?: number;
  flightNumber?: string;
  autoAccept?: boolean;
  isSuperTraveler?: boolean;
  acceptedCategories?: AcceptedCategory[];
}
export const requests: PurchaseRequest[] = [
  {
    id: "nike-air-max",
    weightKg: 2,
    title: "Nike Air Max · pointure 42",
    origin: "Paris",
    destination: "Lyon",
    date: "2026-10-12",
    budget: 120,
    reward: 25,
    image: "/images/nike.jpg",
    buyer: "Sarah",
    buyerAvatar: "/images/avatar-sarah.svg",
    specifications: "Neuves · Noires · Pointure 42",
    location: "Lyon, Part-Dieu",
  },
  {
    id: "dior-sauvage",
    weightKg: 1,
    title: "Parfum Dior Sauvage · 100 ml",
    origin: "Nice",
    destination: "Marseille",
    date: "2026-10-12",
    budget: 100,
    reward: 20,
    image: "/images/perfume.jpg",
    buyer: "Julie",
    buyerAvatar: "/images/avatar-emma.svg",
    specifications: "Neuf · Eau de parfum · 100 ml",
    location: "Marseille, Saint-Charles",
  },
];
const trip = (
  id: string,
  name: string,
  origin: string,
  destination: string,
  date: string,
  time: string,
  type: Trip["transportType"],
  label: string,
  rating: number,
  extra: Partial<Trip>,
): Trip => ({
  id,
  travelerName: name,
  title: `${origin} → ${destination}`,
  origin,
  destination,
  originCode: origin.slice(0, 3).toUpperCase(),
  destinationCode: destination.slice(0, 3).toUpperCase(),
  departureDate: date,
  departureTime: time,
  transportType: type,
  transportLabel: label,
  rating,
  availableKg: 5,
  pricePerKg: 9,
  travelerAvatar: `/images/avatar-${id.split("-")[0]}.svg`,
  reviewsCount: 12,
  image:
    type === "voiture"
      ? "/images/vehicle-car.svg"
      : type === "camion"
        ? "/images/vehicle-van.svg"
        : type === "avion" && id === "emma"
          ? "/images/vehicle-luggage.svg"
          : "/images/vehicle-plane.svg",
  description:
    "Un peu de place sur mon trajet pour vos affaires. Échangeons pour convenir du point de rendez-vous.",
  canCarryParcel: true,
  ...extra,
});
export const trips: Trip[] = [
  trip(
    "thomas",
    "Thomas",
    "Paris",
    "Lille",
    "2026-10-10",
    "09:00",
    "voiture",
    "Peugeot 208",
    5,
    {
      capacity: "2 cartons",
      dimensions: "80 × 60 × 40 cm",
      autoAccept: true,
      isSuperTraveler: true,
    },
  ),
  trip(
    "lucas",
    "Lucas",
    "Lyon",
    "Grenoble",
    "2026-10-11",
    "14:00",
    "camion",
    "Camionnette",
    4.9,
    { capacity: "Petit meuble", startingPrice: 45 },
  ),
  trip(
    "emma",
    "Emma",
    "Nice",
    "Paris",
    "2026-10-12",
    "16:00",
    "avion",
    "Valise",
    4.8,
    { capacity: "5 kg disponibles" },
  ),
  trip(
    "karim-mrs",
    "Karim",
    "Marseille",
    "Alger",
    "2026-10-14",
    "08:30",
    "avion",
    "Air Algérie · AH1021",
    4.9,
    {
      availableKg: 9,
      capacity: "9 kg disponibles",
      description:
        "Vol Marseille → Alger. Franchise de 10 kg, dont 1 kg réservé aux effets personnels. Je peux également acheter un article pour vous.",
      canBuyProduct: true,
      autoAccept: true,
      isSuperTraveler: true,
      flightNumber: "AH1021",
    },
  ),
  trip(
    "ines-mrs",
    "Inès",
    "Marseille",
    "Alger",
    "2026-10-15",
    "11:00",
    "bateau",
    "Traversée en bateau",
    4.9,
    { availableKg: 20, capacity: "20 kg disponibles", pricePerKg: 6 },
  ),
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
    dutyfree: "Bagage",
  })[trip.transportType];
export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
