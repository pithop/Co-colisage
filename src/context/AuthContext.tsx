import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, demoUsers } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
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
  // Default logged in with Karim Bouzid (Voyageur) so user immediately enjoys a rich experience
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bagvoyage_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return demoUsers.voyageur;
      }
    }
    return demoUsers.voyageur;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeDashboard, setActiveDashboard] = useState<'none' | 'voyageur' | 'transporteur' | 'expediteur'>('none');

  useEffect(() => {
    if (user) {
      localStorage.setItem('bagvoyage_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bagvoyage_user');
    }
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
    setUser(demoUsers[newRole]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
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
