import { getRecord, saveRecord, subscribeToDatabase } from '../services/productionDb';
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  ActivePlatform,
  UserProfileSelection,
  KycDocument,
  KycDocumentType,
  demoUsers,
} from '../types/auth';
import { authenticateLocalAccount, registerLocalAccount, Registration } from '../lib/localAuth';

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
  loginWithGoogle: () => void;
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
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [activeDashboard, setActiveDashboard] = useState<'none' | 'voyageur' | 'transporteur' | 'expediteur'>('none');

  const [activePlatform, setActivePlatformState] = useState<ActivePlatform>(() => {
    try {
      const saved = localStorage.getItem('bagvoyage_platform');
      if (saved === 'shopandgo' || saved === 'bagandgo') return saved;
    } catch { /* ignore storage errors */ }
    return user?.activePlatform || 'shopandgo';
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
    if (!user) return;
    const newDoc: KycDocument = {
      id: `kyc-${Date.now()}`,
      type,
      title,
      fileName,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'verified',
    };

    const currentDocs = user.kycDocuments || [];
    const updatedDocs = [...currentDocs.filter(d => d.type !== type), newDoc];
    const updatedUser: User = {
      ...user,
      kycStatus: 'verified',
      kycDocuments: updatedDocs,
    };
    setUser(updatedUser);
    await saveRecord('users', updatedUser);
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
    const base = demoUsers[role];
    const newUser: User = {
      ...base,
      email: email || base.email,
    };
    setUser(newUser);
    if (newUser.activePlatform) setActivePlatformState(newUser.activePlatform);
    if (newUser.profileSelection) setProfileSelectionState(newUser.profileSelection);
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = () => {
    // Simulated Google OAuth login
    const googleUser: User = {
      ...demoUsers.voyageur,
      name: 'Utilisateur Google Certifié',
      email: 'user.google@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      kycStatus: 'verified',
      activePlatform: 'shopandgo',
      profileSelection: 'both'
    };
    setUser(googleUser);
    setActivePlatformState('shopandgo');
    setProfileSelectionState('both');
    setIsAuthModalOpen(false);
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
