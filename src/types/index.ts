export type PlatformMode = 'shop' | 'bag';

export type MainPillar = 'voyageur' | 'expediteur' | 'destinataire';

export type TransportType = 'avion' | 'voiture' | 'bateau' | 'camion' | 'dutyfree';

export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  gain: number;
  destination: string;
  destinationCode: string;
  originStore: string;
  originCity: string;
  category: string;
  image: string;
  rating?: number;
  deliveryPeriod: string;
  isPopular?: boolean;
  officialUrl?: string;
  weightEst?: string;
  sizeFormat?: 'S' | 'M' | 'L' | 'XL';
}

export interface FreightItem {
  id: string;
  title: string;
  transportType: TransportType;
  transportLabel: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  pricePerKg: number;
  availableKg: number;
  departureDate: string;
  departureTime?: string;
  canCarryParcel?: boolean; // Prêt à transporter le colis d'un tiers
  canBuyProduct?: boolean;  // Prêt à acheter une marchandise pour quelqu'un
  shoppingCommission?: number; // Commission souhaitée pour l'achat
  travelerName: string;
  travelerAvatar: string;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  remainingMinutes?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  image: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'escrow' | 'mission' | 'kyc' | 'delivery' | 'chat';
}

export interface SenderParcelRequest {
  id: string;
  senderName: string;
  senderAvatar: string;
  origin: string;
  destination: string;
  dateDesired: string;
  weightKg: number;
  itemDescription: string;
  budgetOffer: number; // Montant proposé au voyageur en €
  category: string;
  urgent?: boolean;
}

export interface ReceiverShoppingRequest {
  id: string;
  receiverName: string;
  receiverAvatar: string;
  city: string;
  productName: string;
  storeName: string;
  estimatedPrice: number;
  offeredCommission: number; // Commission offerte au voyageur en €
  desiredDate: string;
  image: string;
  urgent?: boolean;
}
