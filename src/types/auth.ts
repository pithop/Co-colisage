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

export const demoUsers: Record<UserRole, User> = {
  voyageur: {
    id: 'user-voyageur-1',
    name: 'Karim Bouzid',
    email: 'karim.bouzid@voyageur.fr',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'voyageur',
    activePlatform: 'shopandgo',
    profileSelection: 'both',
    kycStatus: 'verified',
    kycDocuments: [
      {
        id: 'doc-1',
        type: 'passport',
        title: 'Passeport biométrique français',
        fileName: 'passport_karim_bouzid.pdf',
        uploadedAt: '2026-10-15',
        status: 'verified',
      },
      {
        id: 'doc-2',
        type: 'selfie',
        title: 'Selfie de conformité faciale',
        fileName: 'selfie_biometrique.jpg',
        uploadedAt: '2026-10-15',
        status: 'verified',
      },
    ],
    phone: '+33 6 45 92 10 34',
    rating: 4.9,
    reviewsCount: 54,
    stripeBalance: 345.00,
    pendingEscrow: 154.99,
    completedDeliveries: 42,
    activeTripsCount: 2
  },
  transporteur_pro: {
    id: 'user-pro-1',
    name: 'TransMed Logistique SARL',
    email: 'direction@transmed-fret.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    role: 'transporteur_pro',
    activePlatform: 'shopandgo',
    profileSelection: 'both',
    kycStatus: 'verified',
    siret: '849 102 938 00024',
    companyName: 'TransMed Logistique SARL (Licence n° 2024/75/001)',
    phone: '+33 4 91 22 88 00',
    rating: 5.0,
    reviewsCount: 128,
    stripeBalance: 1840.50,
    pendingEscrow: 620.00,
    completedDeliveries: 156,
    activeTripsCount: 4
  },
  expediteur: {
    id: 'user-exp-1',
    name: 'Mohamed Touati',
    email: 'mohamed.t@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'expediteur',
    activePlatform: 'bagandgo',
    profileSelection: 'expediteur',
    kycStatus: 'verified',
    kycDocuments: [
      {
        id: 'doc-3',
        type: 'cni',
        title: 'Carte Nationale d’Identité',
        fileName: 'cni_mohamed_touati.pdf',
        uploadedAt: '2026-10-20',
        status: 'verified',
      },
    ],
    phone: '+33 7 88 12 45 67',
    rating: 4.8,
    reviewsCount: 19,
    stripeBalance: 0,
    pendingEscrow: 154.99,
    completedDeliveries: 14,
    activeTripsCount: 1
  }
};
