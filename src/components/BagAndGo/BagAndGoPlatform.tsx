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
  CheckCircle2
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
  requests,
  onTrip,
  onRequest,
  onPublishParcel,
  onPublishRequest,
  onTracking,
}) => {
  const { user } = useAuth();

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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10 animate-fadeIn text-slate-900 dark:text-slate-100">
      {/* Header Section */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 tracking-wide uppercase font-mono">
              <Package size={14} />
              <span>Bag &amp; Go &middot; Espace Expéditeur</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Expédiez vos colis avec des voyageurs vérifiés
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Vos biens voyagent en cabine avec des voyageurs certifiés.
              Paiement bloqué sous séquestre bancaire Stripe et libéré uniquement sur remise en main propre avec code PIN secret.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onPublishParcel}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
              >
                <Send size={15} />
                <span>Déposer un colis</span>
              </button>
              <button
                type="button"
                onClick={onPublishRequest}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-slate-700 transition-all flex items-center gap-2"
              >
                <ShoppingBag size={15} />
                <span>Commander un achat</span>
              </button>
              <button
                type="button"
                onClick={onTracking}
                className="px-3.5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Suivre mes envois</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Senders Trust Overview Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 w-full sm:w-72 shrink-0 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white text-xs pb-1 border-b border-slate-200/50 dark:border-slate-800/50">
              <ShieldCheck size={15} className="text-blue-600 dark:text-blue-400" />
              <span>Garanties expéditeur</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Lock size={12} className="text-slate-400 shrink-0" />
              <span>Séquestre Stripe bloqué jusqu&apos;à réception</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <KeyRound size={12} className="text-slate-400 shrink-0" />
              <span>Code PIN secret requis pour libérer les fonds</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
              <span>Passeports et billets vérifiés eIDAS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Filter and Search Navigation */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Segmented Mode Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs overflow-x-auto">
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
                label: 'Ferries',
                count: trips.filter((t) => t.transportType === 'bateau').length,
                icon: Ship,
              },
              {
                id: 'voiture' as const,
                label: 'Véhicules',
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
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTransport === tab.id
                      ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                  <span className="text-[10px] font-mono px-1 rounded bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Destination Quick Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: 'all', label: 'Toutes villes' },
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
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
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
            placeholder="Rechercher une liaison (Paris → Alger, Marseille → Oran...) ou un voyageur..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </section>

      {/* Trips Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{filteredTrips.length} voyageur{filteredTrips.length > 1 ? 's' : ''} disponible{filteredTrips.length > 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <CheckCircle2 size={11} className="text-blue-500" />
            Pièces d&apos;identité vérifiées
          </span>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <Luggage size={36} className="mx-auto text-slate-400" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Aucun voyageur ne correspond à ces critères
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Vous pouvez publier votre colis : les voyageurs sur cette ligne seront notifiés immédiatement.
            </p>
            <button
              type="button"
              onClick={onPublishParcel}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
            >
              Déposer mon colis
            </button>
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
                  className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow"
                >
                  <div className="space-y-3">
                    {/* Header: Transport & Rating */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400 text-[11px]">
                        <TransportIcon size={13} className="text-slate-400" />
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
                      <img
                        src={trip.travelerAvatar || '/images/avatar-thomas.svg'}
                        alt={trip.travelerName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                          {trip.travelerName}
                        </p>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 size={10} /> Profil vérifié
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
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center gap-1"
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
