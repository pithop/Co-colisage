export type UserRole = 'expediteur' | 'voyageur' | 'transporteur_pro';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  kycStatus: 'verified' | 'pending' | 'unverified';
  phone?: string;
  siret?: string;
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
    kycStatus: 'verified',
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
    kycStatus: 'verified',
    phone: '+33 7 88 12 45 67',
    rating: 4.8,
    reviewsCount: 19,
    stripeBalance: 0,
    pendingEscrow: 154.99,
    completedDeliveries: 14,
    activeTripsCount: 1
  }
};
