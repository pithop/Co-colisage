export type UserRole = 'expediteur' | 'voyageur' | 'transporteur_pro';
export type ActivePlatform = 'shopandgo' | 'bagandgo';
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

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  city?: string;
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
}

