export type UserRole = 'expediteur' | 'voyageur' | 'transporteur_pro';
export type ActivePlatform = 'voyageur' | 'bagandgo' | 'shopandgo';
export type UserProfileSelection = 'voyageur' | 'expediteur' | 'both';

export type KycDocumentType = 'cni' | 'passport' | 'selfie' | 'proof_of_address';
export type KycDocumentStatus = 'missing' | 'pending' | 'verified' | 'rejected';

export interface KycDocument {
  id: string;
  type: KycDocumentType;
  title: string;
  fileName?: string;
  fileUrl?: string;
  uploadedAt?: string;
  status: KycDocumentStatus;
  rejectionReason?: string;
}

export interface UserProfile {
  id: string; // matches user.id
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  bio?: string;
  homeAirport?: string;
  preferredCorridors?: string[];
  iban?: string;
  bic?: string;
  bankName?: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  trustScore: number;
  avatarUrl?: string;
  googleSub?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  city?: string;
  country?: string;
  avatar: string;
  role: UserRole;
  activePlatform?: ActivePlatform;
  profileSelection?: UserProfileSelection;
  kycStatus: 'verified' | 'pending' | 'unverified';
  kycDocuments?: KycDocument[];
  phone?: string;
  siret?: string;
  proVerified?: boolean;
  roles?: ('carrier' | 'sender' | 'buyer' | 'receiver')[];
  companyName?: string;
  rating: number;
  reviewsCount: number;
  stripeBalance: number;
  pendingEscrow: number;
  completedDeliveries: number;
  activeTripsCount: number;
  googleId?: string;
  bio?: string;
  homeAirport?: string;
  iban?: string;
  bic?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  trustScore?: number;
  createdAt?: string;
}

