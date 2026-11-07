import React, { useState, useMemo } from 'react';
import {
  Package,
  Plane,
  Ship,
  Car,
  Search,
  ShieldCheck,
  Send,
  ShoppingBag,
  ArrowRight,
  Luggage,
  Lock,
  Star,
  ChevronRight,
  MapPin,
  Calendar,
  KeyRound,
  CheckCircle2,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { Trip, PurchaseRequest, euro, normalize } from '../../data/marketplace';
import { useAuth } from '../../context/AuthContext';

export interface BagAndGoPlatformProps {
  trips: Trip[];
  requests: PurchaseRequest[];
  onTrip: (trip: Trip) => void;
  onRequest: (request: PurchaseRequest) => void;
  onPublishParcel: () => void;
  onPublishRequest: () => void;
  onTracking: () => void;
}

export const BagAndGoPlatform: React.FC<BagAndGoPlatformProps> = ({
  trips,
  requests: _requests,
  onTrip,
  onRequest: _onRequest,
  onPublishParcel,
  onPublishRequest,
  onTracking,
}) => {
  const { user: _user } = useAuth();

  const [activeTransport, setActiveTransport] = useState<'all' | 'avion' | 'bateau' | 'voiture'>('all');
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = useMemo(() => {
    const q = normalize(searchQuery);
    return trips.filter((t) => {
      if (activeTransport !== 'all' && t.transportType !== activeTransport) return false;

      if (selectedDestination !== 'all') {
        const dest = normalize(t.destination);
        if (!dest.includes(normalize(selectedDestination))) return false;
      }

      if (q) {
        const text = normalize(`${t.travelerName} ${t.origin} ${t.destination} ${t.transportLabel || ''}`);
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [trips, activeTransport, selectedDestination, searchQuery]);

  return (
    <div className="w-full max-w-6xl mx-auto px-3.5 sm:px-6 pt-3 pb-36 sm:py-8 space-y-5 sm:space-y-7 animate-fadeIn text-slate-900 dark:text-slate-100">
      {/* Header Section */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-4 sm:pb-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/60 text-xs font-semibold text-blue-800 dark:text-blue-300 font-mono tracking-wide uppercase">
              <Package size={13} className="text-blue-600 dark:text-blue-400" />
              <span>Bag &amp; Go &middot; Espace Expéditeur</span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
              Expédiez vos colis avec des voyageurs certifiés
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Vos biens voyagent en cabine avec des voyageurs vérifiés eIDAS. Paiement sécurisé sous séquestre Stripe libéré par code PIN secret à la réception.
            </p>

            <div className="pt-2 flex items-center gap-2 overflow-x-auto sm:flex-wrap no-scrollbar">
              <button
                type="button"
                onClick={onPublishParcel}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-2 shrink-0 min-h-[44px]"
              >
                <Send size={15} />
                <span>Déposer un colis</span>
              </button>
              <button
                type="button"
                onClick={onPublishRequest}
                className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition-all flex items-center gap-2 shrink-0 min-h-[44px]"
              >
                <ShoppingBag size={15} className="text-blue-600 dark:text-blue-400" />
                <span>Commander achat</span>
              </button>
              <button
                type="button"
                onClick={onTracking}
                className="px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 min-h-[44px]"
              >
                <span>Suivre mes envois</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Senders Trust Overview Card - Desktop */}
          <div className="hidden lg:block p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 w-72 shrink-0 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 shadow-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-xs pb-1.5 border-b border-slate-200/50 dark:border-slate-800/50">
              <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
              <span>Garanties expéditeur certifié</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Lock size={13} className="text-slate-400 shrink-0" />
              <span>Séquestre Stripe bloqué jusqu&apos;à remise</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <KeyRound size={13} className="text-slate-400 shrink-0" />
              <span>Code PIN secret requis pour libérer les fonds</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
              <span>Passeports et billets vérifiés eIDAS</span>
            </div>
          </div>

          {/* Senders Trust Overview Strip - Mobile */}
          <div className="lg:hidden p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 gap-2">
            <span className="flex items-center gap-1.5 font-medium shrink-0">
              <Lock size={12} className="text-blue-600 dark:text-blue-400" />
              <span>Séquestre Stripe</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">&middot;</span>
            <span className="flex items-center gap-1.5 font-medium shrink-0">
              <KeyRound size={12} className="text-amber-500" />
              <span>PIN secret</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">&middot;</span>
            <span className="flex items-center gap-1.5 font-medium shrink-0">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>Profils eIDAS</span>
            </span>
          </div>
        </div>
      </header>

      {/* Filter and Search Navigation */}
      <section className="space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Segmented Mode Tabs - Responsive and clean */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs overflow-x-auto no-scrollbar">
            {[
              { id: 'all' as const, label: 'Tous', count: trips.length, icon: Luggage },
              {
                id: 'avion' as const,
                label: 'Avion',
                count: trips.filter((t) => t.transportType === 'avion').length,
                icon: Plane,
              },
              {
                id: 'bateau' as const,
                label: 'Ferry',
                count: trips.filter((t) => t.transportType === 'bateau').length,
                icon: Ship,
              },
              {
                id: 'voiture' as const,
                label: 'Route',
                count: trips.filter((t) => t.transportType === 'voiture' || t.transportType === 'camion').length,
                icon: Car,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTransport(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    activeTransport === tab.id
                      ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                  {trips.length > 0 && (
                    <span className="text-[10px] font-mono px-1 rounded bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Destination Quick Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar pb-0.5">
            {[
              { id: 'all', label: 'Toutes destinations' },
              { id: 'Alger', label: 'Alger' },
              { id: 'Oran', label: 'Oran' },
              { id: 'Constantine', label: 'Constantine' },
              { id: 'Tunis', label: 'Tunis' },
              { id: 'Casablanca', label: 'Casablanca' },
            ].map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => setSelectedDestination(city.id)}
                className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedDestination === city.id
                    ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-semibold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une destination ou un voyageur..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-xs"
          />
        </div>
      </section>

      {/* Trips Grid or Virgin Empty State */}
      <section className="space-y-4">
        {trips.length > 0 && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{filteredTrips.length} voyageur{filteredTrips.length > 1 ? 's' : ''} disponible{filteredTrips.length > 1 ? 's' : ''}</span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
              <CheckCircle2 size={12} className="text-blue-600 dark:text-blue-400" />
              Pièces d&apos;identité et billets validés eIDAS
            </span>
          </div>
        )}

        {filteredTrips.length === 0 ? (
          /* Virgin / Clean Empty State (Apple HIG & Stripe Level) */
          <div className="p-8 sm:p-12 text-center rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/40 dark:to-slate-900/80 shadow-xs space-y-6">
            <div className="inline-flex p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 shadow-xs">
              <Package size={32} />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                {trips.length === 0
                  ? 'Aucun voyageur disponible pour l’instant'
                  : 'Aucun voyageur ne correspond à votre recherche'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {trips.length === 0
                  ? 'Déposez votre demande de colis dès maintenant. Les voyageurs empruntant votre liaison seront immédiatement notifiés pour prendre en charge vos biens.'
                  : 'Modifiez vos critères de transport ou élargissez votre sélection de destination.'}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onPublishParcel}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Send size={16} />
                <span>Déposer une demande de colis</span>
              </button>
              <button
                type="button"
                onClick={onPublishRequest}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <ShoppingBag size={16} className="text-blue-600 dark:text-blue-400" />
                <span>Commander un achat en boutique</span>
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTransport('all');
                    setSelectedDestination('all');
                    setSearchQuery('');
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-medium"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>

            {/* 3 Step Sender Value Pillars */}
            <div className="pt-8 border-t border-slate-200/70 dark:border-slate-800/70 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1.5 shadow-xs">
                <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 block uppercase">
                  1. Déposez votre besoin
                </span>
                <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Colis ou achat en boutique
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Indiquez le volume, le poids et la valeur déclarée de vos biens.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1.5 shadow-xs">
                <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 block uppercase">
                  2. Voyageurs certifiés
                </span>
                <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Identité &amp; billet eIDAS
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Chaque voyageur est identifié et son titre de transport aérien ou maritime vérifié.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1.5 shadow-xs">
                <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 block uppercase">
                  3. Séquestre &amp; PIN secret
                </span>
                <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Protection à 100%
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Paiement sous séquestre Stripe libéré uniquement après remise en main propre.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrips.map((trip) => {
              const TransportIcon =
                trip.transportType === 'avion'
                  ? Plane
                  : trip.transportType === 'bateau'
                  ? Ship
                  : Car;

              return (
                <article
                  key={trip.id}
                  onClick={() => onTrip(trip)}
                  className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 p-4 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="space-y-3">
                    {/* Header: Transport & Rating */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400 text-[11px]">
                        <TransportIcon size={13} className="text-blue-600 dark:text-blue-400" />
                        <span className="capitalize">{trip.transportLabel || trip.transportType}</span>
                      </span>

                      <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span>{trip.rating ? trip.rating.toFixed(1) : '5.0'}</span>
                      </div>
                    </div>

                    {/* Route Line */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                        <span>{trip.origin}</span>
                        <ArrowRight size={13} className="text-slate-400" />
                        <span>{trip.destination}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        <span>Départ {trip.departureDate}</span>
                        {trip.flightNumber && <span>{trip.flightNumber}</span>}
                      </div>
                    </div>

                    {/* Traveler Info */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-xs overflow-hidden">
                        {trip.travelerAvatar && !trip.travelerAvatar.includes('avatar-thomas') ? (
                          <img
                            src={trip.travelerAvatar}
                            alt={trip.travelerName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <UserRound size={14} className="text-slate-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {trip.travelerName}
                        </p>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 size={10} /> Profil vérifié eIDAS
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Capacity, Price & CTA */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {trip.availableKg} kg disponibles
                      </span>
                      <span className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {euro(trip.pricePerKg)}
                        <span className="text-xs font-normal text-slate-400 font-sans">/kg</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center gap-1 min-h-[36px]"
                    >
                      <span>Réserver</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

