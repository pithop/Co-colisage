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
  Menu
} from 'lucide-react';
import { PlatformMode, NotificationItem } from '../types';

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
  const [showNotifications, setShowNotifications] = useState(false);
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
              Paiement bloqué & garanti jusqu'à la remise avec code PIN
            </span>
          </div>

          <div className="flex items-center gap-3">
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
                  <span className="hidden sm:inline">Vue Plein Écran (Desktop XXL)</span>
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
        <nav className="hidden xl:flex items-center gap-7 text-sm font-medium text-slate-600">
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
          <a href="#footer" className="hover:text-slate-900 transition-colors">
            Aide
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search input on desktop */}
          <div className="hidden md:flex items-center relative w-52 lg:w-64">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un article, destination..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
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
            <span>+ Publier une annonce</span>
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
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 mt-2 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-3 px-1 flex gap-3 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        {n.type === 'escrow' ? <CreditCard className="w-4 h-4 text-emerald-600" /> : <CheckCircle2 className="w-4 h-4 text-blue-600" />}
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

          {/* User profile avatar */}
          <div className="flex items-center gap-2 pl-1">
            <button className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm hover:ring-2 hover:ring-blue-500 transition-all">
              <User className="w-4 h-4" />
            </button>
          </div>

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
            <a 
              href="#hero" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Accueil
            </a>
            <a 
              href="#offres" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Explorer les offres
            </a>
            <button 
              onClick={() => { onOpenHowItWorks(); setMobileMenuOpen(false); }}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 text-left"
            >
              Comment ça marche ?
            </button>
            <a 
              href="#securite" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 text-emerald-600 font-semibold"
            >
              Sécurité & KYC Stripe
            </a>
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
