import React, { useState, useMemo } from 'react';
import {
  Send,
  Package,
  Plane,
  Ship,
  Car,
  ShieldCheck,
  Lock,
  KeyRound,
  Search,
  MapPin,
  Calendar,
  CheckCircle2,
  Star,
  Luggage,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Navigation,
  ChevronRight,
  ShoppingBag,
  SlidersHorizontal,
  BadgeCheck,
  Calculator
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

  const [activeTransportFilter, setActiveTransportFilter] = useState<'all' | 'avion' | 'bateau' | 'voiture'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minAvailableKg, setMinAvailableKg] = useState<number>(0);
  const [calculatorKg, setCalculatorKg] = useState<number>(5);

  // Filter trips
  const filteredTrips = useMemo(() => {
    const q = normalize(searchQuery);
    return trips.filter((t) => {
      // Transport filter
      if (activeTransportFilter !== 'all' && t.transportType !== activeTransportFilter) {
        return false;
      }

      // Available kg
      if (t.availableKg < minAvailableKg) return false;

      // Search query (origin, destination, travelerName, transportLabel)
      if (q) {
        const text = normalize(`${t.travelerName} ${t.origin} ${t.destination} ${t.transportLabel || ''}`);
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [trips, activeTransportFilter, minAvailableKg, searchQuery]);

  // Price comparison calculation
  const estimatedBagVoyagePrice = calculatorKg * 9;
  const traditionalExpressPrice = calculatorKg * 26 + 15;
  const savingsPercent = Math.round(((traditionalExpressPrice - estimatedBagVoyagePrice) / traditionalExpressPrice) * 100);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Hero / Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-10 border border-blue-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide uppercase">
              <Package size={14} />
              <span>Bag &amp; Go · Espace Expéditeur &amp; Client Acheteur</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Envoyez vos colis &amp; recevez vos achats avec des{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-200">
                voyageurs de confiance
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Vos envois voyagent en cabine avec des voyageurs certifiés eIDAS.
              Règlement sous séquestre Stripe et libération des fonds uniquement après remise avec code PIN secret.
            </p>

            {/* Quick Actions Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onPublishParcel}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <Send size={18} />
                <span>Déposer un colis à expédier</span>
              </button>

              <button
                type="button"
                onClick={onPublishRequest}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-medium text-sm backdrop-blur-md border border-white/10 transition-all flex items-center gap-2"
              >
                <ShoppingBag size={18} className="text-cyan-300" />
                <span>Demander un achat Shop &amp; Go</span>
              </button>

              <button
                type="button"
                onClick={onTracking}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-medium text-sm backdrop-blur-md border border-white/10 transition-all flex items-center gap-2"
              >
                <Navigation size={18} className="text-blue-300" />
                <span>Suivre mes envois en direct</span>
              </button>
            </div>
          </div>

          {/* Senders Trust Guarantee Card */}
          <div className="w-full lg:w-80 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 text-white space-y-4 shrink-0 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-cyan-400" />
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  Garanties Expéditeur
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-medium">
                100% Sérénité
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-blue-500/20 text-blue-300 shrink-0 mt-0.5">
                  <Lock size={14} />
                </div>
                <div>
                  <p className="font-semibold text-white">Séquestre Stripe Garanti</p>
                  <p className="text-slate-300 text-[11px]">L&apos;argent ne quitte pas le compte séquestre tant que vous n&apos;avez pas reçu votre colis.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-cyan-500/20 text-cyan-300 shrink-0 mt-0.5">
                  <KeyRound size={14} />
                </div>
                <div>
                  <p className="font-semibold text-white">Code PIN Secret de Livraison</p>
                  <p className="text-slate-300 text-[11px]">Le voyageur ne peut débloquer son virement qu&apos;en saisissant le PIN donné par votre destinataire.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
                  <BadgeCheck size={14} />
                </div>
                <div>
                  <p className="font-semibold text-white">Pièces d&apos;Identité Vérifiées</p>
                  <p className="text-slate-300 text-[11px]">Tous les voyageurs fournissent un passeport certifié et leur billet de transport.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Savings & Kilogram Calculator Card */}
      <section className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-slate-50 dark:to-slate-900/40 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-md">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Calculator size={18} />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Simulateur d&apos;économies d&apos;envoi
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Comparez le coût d&apos;acheminement Bag &amp; Go avec les transporteurs traditionnels express.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Poids de votre colis :</span>
              <div className="flex items-center gap-1.5">
                {[1, 3, 5, 10, 20].map((kg) => (
                  <button
                    key={kg}
                    type="button"
                    onClick={() => setCalculatorKg(kg)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      calculatorKg === kg
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {kg} kg
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
              <span className="text-blue-700 dark:text-blue-300 font-medium">Tarif Bag &amp; Go ({calculatorKg} kg) :</span>
              <p className="text-lg font-extrabold text-blue-700 dark:text-blue-300 mt-1">{euro(estimatedBagVoyagePrice)}</p>
              <span className="text-[10px] text-blue-600/80 dark:text-blue-400">Livraison en main propre</span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-slate-500 dark:text-slate-400">Transporteur express classique :</span>
              <p className="text-lg font-bold text-slate-500 dark:text-slate-400 line-through mt-1">{euro(traditionalExpressPrice)}</p>
              <span className="text-[10px] text-slate-400">Frais de douane non inclus</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center flex flex-col justify-center">
              <span className="text-emerald-800 dark:text-emerald-300 font-semibold">Votre économie :</span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">
                -{savingsPercent}% ({euro(traditionalExpressPrice - estimatedBagVoyagePrice)})
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
            {[
              { id: 'all' as const, label: 'Tous les voyageurs', count: trips.length, icon: Luggage },
              {
                id: 'avion' as const,
                label: 'Vols (Avion)',
                count: trips.filter((t) => t.transportType === 'avion').length,
                icon: Plane,
              },
              {
                id: 'bateau' as const,
                label: 'Ferries (Bateau)',
                count: trips.filter((t) => t.transportType === 'bateau').length,
                icon: Ship,
              },
              {
                id: 'voiture' as const,
                label: 'Véhicules (Voiture/Van)',
                count: trips.filter((t) => t.transportType === 'voiture' || t.transportType === 'camion').length,
                icon: Car,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTransportFilter(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTransportFilter === tab.id
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Available Kg Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Kilos requis :
            </span>
            {[0, 2, 5, 10].map((kg) => (
              <button
                key={kg}
                type="button"
                onClick={() => setMinAvailableKg(kg)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  minAvailableKg === kg
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {kg === 0 ? 'Tous' : `${kg} kg+`}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une liaison (ex: Paris → Alger, Marseille → Oran, Lyon → Tunis) ou un voyageur certifié..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>
      </section>

      {/* Trips Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Voyageurs vérifiés disponibles</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {filteredTrips.length} voyageur{filteredTrips.length > 1 ? 's' : ''}
            </span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-blue-500" />
            Vérification eIDAS obligatoire
          </span>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <Luggage size={40} className="mx-auto text-slate-400" />
            <p className="text-slate-700 dark:text-slate-300 font-semibold">
              Aucun voyageur ne correspond à vos critères de recherche.
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Vous pouvez publier votre demande d&apos;envoi pour que des voyageurs vous contactent directement dès l&apos;ouverture d&apos;une liaison.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTransportFilter('all');
                  setMinAvailableKg(0);
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300"
              >
                Réinitialiser les filtres
              </button>
              <button
                type="button"
                onClick={onPublishParcel}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
              >
                Déposer mon colis
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTrips.map((trip) => {
              const TransportIcon =
                trip.transportType === 'avion'
                  ? Plane
                  : trip.transportType === 'bateau'
                  ? Ship
                  : Car;

              return (
                <div
                  key={trip.id}
                  onClick={() => onTrip(trip)}
                  className="group relative cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Row: Transport badge + Rating */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                        <TransportIcon size={13} />
                        <span className="capitalize">{trip.transportLabel || trip.transportType}</span>
                      </span>

                      <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                        <span>{trip.rating ? trip.rating.toFixed(1) : '5.0'}</span>
                        <span className="text-slate-400 font-normal">({trip.reviewsCount || 12})</span>
                      </div>
                    </div>

                    {/* Traveler Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                        <img
                          src={trip.travelerAvatar || `/images/avatar-thomas.svg`}
                          alt={trip.travelerName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {trip.travelerName}
                          </h3>
                          {trip.isSuperTraveler && (
                            <span className="p-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" title="Super Voyageur Certifié">
                              <ShieldCheck size={13} />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Identité vérifiée · Voyage confirmé
                        </p>
                      </div>
                    </div>

                    {/* Route Line */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-blue-500 shrink-0" />
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {trip.origin}
                          </span>
                          <ArrowRight size={13} className="text-slate-400" />
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {trip.destination}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          Départ : {trip.departureDate} ({trip.departureTime || '14:00'})
                        </span>
                        {trip.flightNumber && (
                          <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">
                            {trip.flightNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Capacity & Price Row */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                          Capacité restante
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <Luggage size={14} className="text-blue-500" />
                          {trip.availableKg} kg disponibles
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                          Tarif au kilo
                        </span>
                        <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                          {euro(trip.pricePerKg)}
                          <span className="text-xs font-normal text-slate-400">/kg</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer CTA */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Lock size={12} className="text-emerald-500" />
                      Séquestre Stripe inclus
                    </span>

                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition-colors flex items-center gap-1 group-hover:bg-blue-600"
                    >
                      <span>Réserver</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Safety & Anti-Fraud Timeline Section */}
      <section className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 text-center">
          Comment vos envois sont-ils protégés à 100% avec Bag &amp; Go ?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              1
            </div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Réservation en ligne</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Choisissez un voyageur sur votre trajet ou publiez votre colis. Le montant est bloqué sous séquestre Stripe.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              2
            </div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Inspection au départ</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Le voyageur vérifie le contenu du colis ouvert pour des raisons de conformité aérienne IATA et douanière.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              3
            </div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Génération du code PIN</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Un code secret unique à 4 chiffres est généré pour votre destinataire. Seul votre destinataire le possède.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              4
            </div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Remise &amp; Libération</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Après remise en main propre, le destinataire transmet le code PIN au voyageur pour libérer le virement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
