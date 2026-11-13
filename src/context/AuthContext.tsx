import { getRecord, saveRecord, subscribeToDatabase, saveProfile } from '../services/productionDb';
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserProfile,
  UserRole,
  ActivePlatform,
  UserProfileSelection,
  KycDocument,
  KycDocumentType,
} from '../types/auth';
import { authenticateLocalAccount, registerLocalAccount, Registration } from '../lib/localAuth';
import { GoogleSignInModal } from '../components/Auth/GoogleSignInModal';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  activePlatform: ActivePlatform;
  setActivePlatform: (platform: ActivePlatform) => void;
  profileSelection: UserProfileSelection;
  setProfileSelection: (selection: UserProfileSelection) => { success: boolean; requiresKyc?: boolean; };
  isKycVerified: boolean;
  kycDocuments: KycDocument[];
  uploadKycDocument: (type: KycDocumentType, title: string, fileName: string) => Promise<void>;
  isKycModalOpen: boolean;
  openKycModal: () => void;
  closeKycModal: () => void;
  login: (email: string, role?: UserRole, remember?: boolean) => void;
  signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (input: Registration) => Promise<void>;
  loginWithGoogle: (customUser?: User) => void;
  isGoogleModalOpen: boolean;
  openGoogleModal: () => void;
  closeGoogleModal: () => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  activeDashboard: 'none' | 'voyageur' | 'transporteur' | 'expediteur';
  setActiveDashboard: (dash: 'none' | 'voyageur' | 'transporteur' | 'expediteur') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start signed out; the demo account is entered explicitly.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = sessionStorage.getItem('bagvoyage_session_user') || localStorage.getItem('bagvoyage_user');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && typeof parsed.name === 'string' ? parsed : null;
    } catch { return null; }
  });

  const [rememberSession, setRememberSession] = useState(() => {
    try { return !sessionStorage.getItem('bagvoyage_session_user'); } catch { return true; }
  });

  useEffect(() => {
    if (!user) return;
    let active = true;
    const id = user.id;
    const refresh = async () => {
      const saved = await getRecord('users', id);
      if (active && saved) setUser(current => current?.id === id && JSON.stringify(current) !== JSON.stringify(saved) ? saved : current);
    };
    void refresh().catch(() => undefined);
    const unsubscribe = subscribeToDatabase(store => { if (store === 'users') void refresh().catch(() => undefined); });
    return () => { active = false; unsubscribe(); };
  }, [user?.id]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [activeDashboard, setActiveDashboard] = useState<'none' | 'voyageur' | 'transporteur' | 'expediteur'>('none');

  const [activePlatform, setActivePlatformState] = useState<ActivePlatform>(() => {
    try {
      const saved = localStorage.getItem('bagvoyage_platform');
      if (saved === 'voyageur' || saved === 'bagandgo' || saved === 'shopandgo') return saved;
    } catch { /* ignore storage errors */ }
    return user?.activePlatform || 'voyageur';
  });

  const [profileSelection, setProfileSelectionState] = useState<UserProfileSelection>(() => {
    return user?.profileSelection || 'both';
  });

  // Keep state synchronized with user record when switching users
  useEffect(() => {
    if (user?.profileSelection && user.profileSelection !== profileSelection) {
      setProfileSelectionState(user.profileSelection);
    }
    if (user?.activePlatform && user.activePlatform !== activePlatform) {
      setActivePlatformState(user.activePlatform);
    }
  }, [user?.id, user?.profileSelection, user?.activePlatform]);

  const isKycVerified = !!(
    user &&
    (user.kycStatus === 'verified' ||
      (user.kycDocuments && user.kycDocuments.some(d => d.status === 'verified')))
  );

  const kycDocuments: KycDocument[] = user?.kycDocuments || [];

  const setActivePlatform = (platform: ActivePlatform) => {
    setActivePlatformState(platform);
    try {
      localStorage.setItem('bagvoyage_platform', platform);
    } catch { /* ignore */ }
    if (user) {
      const updated: User = { ...user, activePlatform: platform };
      setUser(updated);
      void saveRecord('users', updated).catch(() => undefined);
    }
  };

  const setProfileSelection = (selection: UserProfileSelection) => {
    // If switching to voyageur or both, KYC document verification is required
    if ((selection === 'voyageur' || selection === 'both') && !isKycVerified) {
      setIsKycModalOpen(true);
      return { success: false, requiresKyc: true };
    }

    setProfileSelectionState(selection);
    if (user) {
      const updated: User = { ...user, profileSelection: selection };
      setUser(updated);
      void saveRecord('users', updated).catch(() => undefined);
    }
    return { success: true };
  };

  const uploadKycDocument = async (type: KycDocumentType, title: string, fileName: string) => {
    let currentUser = user;
    if (!currentUser) {
      currentUser = {
        id: `user-${Date.now()}`,
        name: 'Membre Vérifié',
        email: 'utilisateur@bagvoyage.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: 'voyageur',
        activePlatform: activePlatform || 'shopandgo',
        profileSelection: profileSelection || 'both',
        kycStatus: 'unverified',
        kycDocuments: [],
        rating: 5.0,
        reviewsCount: 0,
        stripeBalance: 0,
        pendingEscrow: 0,
        completedDeliveries: 0,
        activeTripsCount: 0,
      };
    }

    const newDoc: KycDocument = {
      id: `kyc-${Date.now()}`,
      type,
      title,
      fileName,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'verified',
    };

    const currentDocs = currentUser.kycDocuments || [];
    const updatedDocs = [...currentDocs.filter(d => d.type !== type), newDoc];
    const updatedUser: User = {
      ...currentUser,
      kycStatus: 'verified',
      kycDocuments: updatedDocs,
    };
    setUser(updatedUser);
    await saveRecord('users', updatedUser);
    await saveRecord('kyc_records', {
      id: `kyc-${currentUser.id}`,
      userId: currentUser.id,
      status: 'verified',
      documentType: type,
      documents: updatedDocs.map((d, index) => ({
        id: `att-${currentUser.id}-${index}`,
        name: d.title || d.fileName || 'document.pdf',
        data: d.fileName || 'document.pdf',
        type: 'application/pdf',
        size: 1024,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  useEffect(() => {
    try {
      localStorage.removeItem('bagvoyage_user');
      sessionStorage.removeItem('bagvoyage_session_user');
      if (user) {
        if (rememberSession) localStorage.setItem('bagvoyage_user', JSON.stringify(user));
        else sessionStorage.setItem('bagvoyage_session_user', JSON.stringify(user));
      }
    } catch { /* Keep the session usable if browser storage is unavailable. */ }
  }, [user, rememberSession]);

  const login = (email: string, role: UserRole = 'voyageur', remember = true) => {
    setRememberSession(remember);
    const nameFromEmail = email ? email.split('@')[0].replace('.', ' ') : 'Nouvel Utilisateur';
    const cleanUser: User = {
      id: `user-${Date.now()}`,
      name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
      email: email || 'utilisateur@bagvoyage.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role,
      activePlatform: role === 'expediteur' ? 'bagandgo' : 'shopandgo',
      profileSelection: role === 'expediteur' ? 'expediteur' : 'voyageur',
      kycStatus: 'unverified',
      kycDocuments: [],
      rating: 5.0,
      reviewsCount: 0,
      stripeBalance: 0,
      pendingEscrow: 0,
      completedDeliveries: 0,
      activeTripsCount: 0,
    };
    setUser(cleanUser);
    if (cleanUser.activePlatform) setActivePlatformState(cleanUser.activePlatform);
    if (cleanUser.profileSelection) setProfileSelectionState(cleanUser.profileSelection);
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = (customUser?: User) => {
    const googleUser: User = customUser || {
      id: "user-demo-amine",
      name: "Amine Belkacem",
      email: "amine.belkacem@gmail.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      role: "voyageur",
      kycStatus: "verified",
      kycDocuments: [],
      rating: 4.95,
      reviewsCount: 38,
      stripeBalance: 320,
      pendingEscrow: 85,
      completedDeliveries: 42,
      activeTripsCount: 2,
      activePlatform: "shopandgo",
      profileSelection: "both",
      phone: "+33 6 12 34 56 78",
      phoneVerified: true,
      emailVerified: true,
      city: "Paris",
      country: "France",
      homeAirport: "CDG",
      iban: "FR7630001007941234567890185",
      trustScore: 98,
      bio: "Navette bi-hebdomadaire Paris CDG ✈️ Alger ALG.",
      googleId: `google_oauth_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUser(googleUser);
    setActivePlatformState(googleUser.activePlatform || "shopandgo");
    setProfileSelectionState(googleUser.profileSelection || "both");
    void saveRecord("users", googleUser).catch(() => undefined);
    void saveProfile({
      id: googleUser.id,
      userId: googleUser.id,
      firstName: googleUser.name.split(" ")[0] || googleUser.name,
      lastName: googleUser.name.split(" ").slice(1).join(" ") || "",
      email: googleUser.email,
      phone: googleUser.phone || "+33 6 12 34 56 78",
      city: googleUser.city || "Paris",
      country: googleUser.country || "France",
      bio: googleUser.bio,
      homeAirport: googleUser.homeAirport || "CDG",
      preferredCorridors: ["Paris CDG → Alger ALG"],
      iban: googleUser.iban,
      phoneVerified: true,
      emailVerified: true,
      trustScore: googleUser.trustScore || 98,
      avatarUrl: googleUser.avatar,
      createdAt: googleUser.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).catch(() => undefined);
    setIsAuthModalOpen(false);
    setIsGoogleModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setActiveDashboard('none');
  };

  const switchRole = (newRole: UserRole) => {
    setUser(current => current ? { ...current, role: newRole } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        activePlatform,
        setActivePlatform,
        profileSelection,
        setProfileSelection,
        isKycVerified,
        kycDocuments,
        uploadKycDocument,
        isKycModalOpen,
        openKycModal: () => setIsKycModalOpen(true),
        closeKycModal: () => setIsKycModalOpen(false),
        login,
        signIn: async (email, password, remember = true) => {
          const authenticated = await authenticateLocalAccount(email, password);
          setRememberSession(remember);
          setUser(authenticated);
          if (authenticated.activePlatform) setActivePlatformState(authenticated.activePlatform);
          if (authenticated.profileSelection) setProfileSelectionState(authenticated.profileSelection);
          setIsAuthModalOpen(false);
        },
        register: async (input) => {
          const created = await registerLocalAccount(input);
          setUser(created);
          if (created.activePlatform) setActivePlatformState(created.activePlatform);
          if (created.profileSelection) setProfileSelectionState(created.profileSelection);
          setIsAuthModalOpen(false);
        },
        loginWithGoogle,
        isGoogleModalOpen,
        openGoogleModal: () => setIsGoogleModalOpen(true),
        closeGoogleModal: () => setIsGoogleModalOpen(false),
        logout,
        switchRole,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        activeDashboard,
        setActiveDashboard
      }}
    >
      {children}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
