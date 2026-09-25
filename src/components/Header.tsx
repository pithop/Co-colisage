import React, { useState } from 'react';
import { 
  Plane, 
  Package, 
  Search, 
  Bell, 
  User, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  CreditCard,
  Menu,
  Building2,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';
import { PlatformMode, NotificationItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

interface HeaderProps {
  mode: PlatformMode;
  onModeChange: (mode: PlatformMode) => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  notifications: NotificationItem[];
  onOpenPublishModal: () => void;
  onOpenHowItWorks: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  isPhoneFrame,
  onTogglePhoneFrame,
  notifications,
  onOpenPublishModal,
  onOpenHowItWorks,
  searchQuery,
  onSearchChange,
}) => {
  const { user, isAuthenticated, logout, switchRole, openAuthModal, setActiveDashboard } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-200">
      {/* Top utility bar on desktop */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Stripe Connect Séquestre Actif
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              Ligne active : Marseille (MRS) ➔ Alger (ALG) • Paiement garanti par code PIN
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick dashboard direct triggers */}
            {user && (
              <div className="hidden lg:flex items-center gap-2 pr-2 border-r border-slate-700">
                <button
                  onClick={() => setActiveDashboard('voyageur')}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold text-blue-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Espace Voyageur
                </button>
                <button
                  onClick={() => setActiveDashboard('transporteur')}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Espace Pro
                </button>
                <button
                  onClick={() => setActiveDashboard('expediteur')}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold text-cyan-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Mes Commandes
                </button>
              </div>
            )}

            {/* Viewport Frame Mode Toggle Button */}
            <button
              onClick={onTogglePhoneFrame}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                isPhoneFrame 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Basculer entre la vue responsive desktop et le simulateur iPhone 16 Pro"
            >
              {isPhoneFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-blue-200" />
                  <span className="hidden sm:inline">Vue Plein Écran (Desktop)</span>
                  <span className="sm:hidden">Desktop</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Simuler App Mobile (iOS)</span>
                  <span className="sm:hidden">Mobile iOS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onModeChange(mode === 'shop' ? 'bag' : 'shop')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="Cliquer pour basculer Shop & Go / Bag & Go"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md transition-transform group-hover:scale-105 ${
              mode === 'shop' ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-sky-600 to-blue-800'
            }`}>
              {mode === 'shop' ? (
                <Plane className="w-5 h-5 -rotate-45" />
              ) : (
                <Package className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  {mode === 'shop' ? 'Shop' : 'Bag'}
                </span>
                <span className="font-extrabold text-xl tracking-tight text-blue-600">
                  &Go
                </span>
                {mode === 'shop' ? (
                  <Plane className="w-4 h-4 text-blue-600 -rotate-45" />
                ) : (
                  <Package className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                {mode === 'shop' ? 'Le shopping n\'a plus de frontières' : 'Voyagez. Envoyez. Partagez.'}
              </p>
            </div>
          </button>

          {/* Mode Switcher Pill */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => onModeChange('shop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'shop'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              Shop & Go ✈️
            </button>
            <button
              onClick={() => onModeChange('bag')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'bag'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Bag & Go 📦
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#hero" className="text-blue-600 font-semibold transition-colors">
            Accueil
          </a>
          <a href="#offres" className="hover:text-slate-900 transition-colors">
            Explorer
          </a>
          <button 
            onClick={onOpenHowItWorks} 
            className="hover:text-slate-900 transition-colors text-left"
          >
            Comment ça marche
          </button>
          <a href="#securite" className="hover:text-slate-900 transition-colors flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Sécurité & KYC
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="hidden md:flex items-center relative w-48 lg:w-56">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Post an Ad Button */}
          <button
            onClick={onOpenPublishModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-full shadow-sm hover:shadow transition-all"
          >
            <span>+ Publier</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                      {unreadCount} nouvelles
                    </span>
                  </div>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 mt-2 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-3 px-1 flex gap-3 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-slate-800">{n.title}</p>
                        <p className="text-slate-500 mt-0.5 leading-relaxed">{n.description}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Profile Dropdown */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/80"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[90px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="pb-3 border-b border-slate-100 flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="overflow-hidden">
                      <p className="font-bold text-xs text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                        KYC Validé (Stripe)
                      </span>
                    </div>
                  </div>

                  {/* Direct Dashboard links */}
                  <div className="py-2 space-y-1">
                    <button
                      onClick={() => { setActiveDashboard('voyageur'); setShowUserDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl flex items-center gap-2"
                    >
                      <Plane className="w-4 h-4 text-blue-600" />
                      <span>Espace Voyageur (Shopper)</span>
                    </button>

                    <button
                      onClick={() => { setActiveDashboard('transporteur'); setShowUserDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl flex items-center gap-2"
                    >
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>Espace Transporteur Pro</span>
                    </button>

                    <button
                      onClick={() => { setActiveDashboard('expediteur'); setShowUserDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-cyan-600" />
                      <span>Mes Commandes (Expéditeur)</span>
                    </button>
                  </div>

                  {/* Switch Role Fast Bar */}
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                      Changer de profil démo :
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => { switchRole('voyageur'); setShowUserDropdown(false); }}
                        className={`text-[10px] py-1 font-bold rounded-lg ${user.role === 'voyageur' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                      >
                        Voyageur
                      </button>
                      <button
                        onClick={() => { switchRole('transporteur_pro'); setShowUserDropdown(false); }}
                        className={`text-[10px] py-1 font-bold rounded-lg ${user.role === 'transporteur_pro' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                      >
                        Transp. Pro
                      </button>
                      <button
                        onClick={() => { switchRole('expediteur'); setShowUserDropdown(false); }}
                        className={`text-[10px] py-1 font-bold rounded-lg ${user.role === 'expediteur' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                      >
                        Expéditeur
                      </button>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <button
                      onClick={() => { logout(); setShowUserDropdown(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={openAuthModal}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
              >
                Connexion
              </button>
              <button
                onClick={openAuthModal}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs"
              >
                S'inscrire
              </button>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => { onModeChange('shop'); setMobileMenuOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold ${
                mode === 'shop' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Plane className="w-4 h-4" />
              Shop & Go ✈️
            </button>
            <button
              onClick={() => { onModeChange('bag'); setMobileMenuOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold ${
                mode === 'bag' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Package className="w-4 h-4" />
              Bag & Go 📦
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-2 text-sm font-medium text-slate-700">
            <button 
              onClick={() => { setActiveDashboard('voyageur'); setMobileMenuOpen(false); }}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 text-blue-600 font-bold text-left flex items-center gap-2"
            >
              <Plane className="w-4 h-4" />
              Espace Voyageur (Shopper)
            </button>
            <button 
              onClick={() => { setActiveDashboard('transporteur'); setMobileMenuOpen(false); }}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 text-emerald-600 font-bold text-left flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Espace Transporteur Pro
            </button>
            <button 
              onClick={() => { setActiveDashboard('expediteur'); setMobileMenuOpen(false); }}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 text-cyan-600 font-bold text-left flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Mes Commandes
            </button>
            <button
              onClick={() => { onOpenPublishModal(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 mt-2 bg-blue-600 text-white font-bold rounded-xl text-center shadow-sm"
            >
              + Publier une annonce
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
