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
export const requests: PurchaseRequest[] = [];
export const trips: Trip[] = [];

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
