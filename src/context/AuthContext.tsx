import { getRecord, subscribeToDatabase } from '../services/productionDb';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, demoUsers } from '../types/auth';
import { authenticateLocalAccount, registerLocalAccount, Registration } from '../lib/localAuth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
  signIn: (email: string, password: string) => Promise<void>;
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
      const saved = localStorage.getItem('bagvoyage_user');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && typeof parsed.name === 'string' ? parsed : null;
    } catch { return null; }
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
  const [activeDashboard, setActiveDashboard] = useState<'none' | 'voyageur' | 'transporteur' | 'expediteur'>('none');

  useEffect(() => {
    try {
      if (user) localStorage.setItem('bagvoyage_user', JSON.stringify(user));
      else localStorage.removeItem('bagvoyage_user');
    } catch { /* Keep the session usable if browser storage is unavailable. */ }
  }, [user]);

  const login = (email: string, role: UserRole = 'voyageur') => {
    const base = demoUsers[role];
    const newUser: User = {
      ...base,
      email: email || base.email,
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = () => {
    // Simulated Google OAuth login
    const googleUser: User = {
      ...demoUsers.voyageur,
      name: 'Utilisateur Google Certifié',
      email: 'user.google@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      kycStatus: 'verified'
    };
    setUser(googleUser);
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
        login,
        signIn: async (email, password) => {
          setUser(await authenticateLocalAccount(email, password));
          setIsAuthModalOpen(false);
        },
        register: async (input) => {
          setUser(await registerLocalAccount(input));
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
