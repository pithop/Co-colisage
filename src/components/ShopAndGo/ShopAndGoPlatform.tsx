import React, { useState, useMemo } from 'react';
import {
  Plane,
  Luggage,
  ShoppingBag,
  Sparkles,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Lock,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ScanLine,
  PlusCircle,
  HelpCircle,
  Package,
  Layers,
  ChevronRight,
  BadgePercent
} from 'lucide-react';
import { PurchaseRequest, Trip, euro, normalize } from '../../data/marketplace';
import { useAuth } from '../../context/AuthContext';
import { flightRoutes } from '../../data/flightSimulation';

export interface ShopAndGoPlatformProps {
  requests: PurchaseRequest[];
  trips: Trip[];
  onRequest: (request: PurchaseRequest) => void;
  onTrip: (trip: Trip) => void;
  onPublishTrip: () => void;
  onScanBoardingPass: () => void;
  onArbitrage: (routeId?: string) => void;
}

export const ShopAndGoPlatform: React.FC<ShopAndGoPlatformProps> = ({
  requests,
  trips,
  onRequest,
  onTrip,
  onPublishTrip,
  onScanBoardingPass,
  onArbitrage,
}) => {
  const { user, openKycModal, isKycVerified } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'shopping' | 'parcel' | 'urgent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minReward, setMinReward] = useState<number>(0);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('mrs-alg');

  // Filter requests matching traveler criteria
  const filteredMissions = useMemo(() => {
    const q = normalize(searchQuery);
    return requests.filter((r) => {
      // Status filter
      if (r.status && r.status !== 'available') return false;

      // Tab filter
      if (activeTab === 'shopping' && r.kind === 'parcel') return false;
      if (activeTab === 'parcel' && r.kind !== 'parcel') return false;
      if (activeTab === 'urgent' && r.flexibility !== 'urgent') return false;

      // Min reward
      const netReward = r.serviceGross ?? r.reward;
      if (netReward < minReward) return false;

      // Search query (origin, destination, title, buyer)
      if (q) {
        const text = normalize(`${r.title} ${r.origin} ${r.destination} ${r.buyer} ${r.specifications}`);
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [requests, activeTab, minReward, searchQuery]);

  const activeRoute = flightRoutes.find((r) => r.id === selectedRouteId) || flightRoutes[0];
  const ticketCost = Math.min(...activeRoute.prices);
  const potentialKilosRevenue = 180; // Estimated 15kg * 12€/kg average
  const netProfit = potentialKilosRevenue - ticketCost;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Hero / Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-10 border border-emerald-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide uppercase">
              <ShoppingBag size={14} />
              <span>Shop &amp; Go · Espace Voyageur &amp; Shopper</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Financez vos voyages avec vos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                kilos de bagages
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Achetez des articles demandés (sneakers, parfums, high-tech) ou acheminez des colis vérifiés.
              Paiement 100% garanti par séquestre Stripe et débloqué par code PIN à l&apos;arrivée.
            </p>

            {/* Quick Actions Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onPublishTrip}
                className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2"
              >
                <PlusCircle size={18} />
                <span>Publier mes kilos disponibles</span>
              </button>

              <button
                type="button"
                onClick={onScanBoardingPass}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-medium text-sm backdrop-blur-md border border-white/10 transition-all flex items-center gap-2"
              >
                <ScanLine size={18} className="text-emerald-400" />
                <span>Scanner billet IATA</span>
              </button>

              <button
                type="button"
                onClick={() => onArbitrage(selectedRouteId)}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-medium text-sm backdrop-blur-md border border-white/10 transition-all flex items-center gap-2"
              >
                <TrendingUp size={18} className="text-teal-300" />
                <span>Arbitrage Vols IA</span>
              </button>
            </div>
          </div>

          {/* Wallet / Earnings Summary Pill Card */}
          <div className="w-full lg:w-80 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 text-white space-y-4 shrink-0 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-emerald-400" />
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  Mon Portefeuille
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-medium">
                Stripe Connect
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-400">Solde disponible immédiatement</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
                {euro(user?.stripeBalance || 345)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                <p className="text-slate-400">En séquestre</p>
                <p className="font-bold text-white text-sm mt-0.5">
                  {euro(user?.pendingEscrow || 154.99)}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                <p className="text-slate-400">Missions finies</p>
                <p className="font-bold text-white text-sm mt-0.5">
                  {user?.completedDeliveries || 42}
                </p>
              </div>
            </div>

            {!isKycVerified && (
              <button
                type="button"
                onClick={openKycModal}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-amber-500/30 transition-colors"
              >
                <ShieldCheck size={14} />
                <span>Activer certification KYC</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* AI Flight Arbitrage Widget Card */}
      <section className="rounded-2xl border border-teal-500/20 bg-gradient-to-r from-teal-500/5 via-emerald-500/5 to-slate-50 dark:to-slate-900/40 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Sparkles size={18} />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Vols 100% financés par vos bagages (Arbitrage IA)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Sur ces liaisons, la rémunération de vos kilos excède le coût du billet d&apos;avion.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'mrs-alg', label: 'Marseille → Alger' },
              { id: 'par-orn', label: 'Paris → Oran' },
              { id: 'lys-czl', label: 'Lyon → Constantine' },
            ].map((route) => (
              <button
                key={route.id}
                type="button"
                onClick={() => setSelectedRouteId(route.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedRouteId === route.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-500'
                }`}
              >
                {route.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onArbitrage(selectedRouteId)}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 ml-1"
            >
              <span>Voir l&apos;analyse</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Realtime profitability pill row */}
        <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70">
            <span className="text-slate-500 dark:text-slate-400">Prix du billet d&apos;avion :</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{euro(ticketCost)}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70">
            <span className="text-slate-500 dark:text-slate-400">Gains bagages estimés :</span>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">+{euro(potentialKilosRevenue)}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="text-emerald-800 dark:text-emerald-300 font-medium">Bénéfice net voyageur :</span>
            <p className="text-sm font-black text-emerald-700 dark:text-emerald-300 mt-0.5">+{euro(netProfit)}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Demande active :</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Très Forte</p>
            </div>
            <button
              type="button"
              onClick={() => onArbitrage(selectedRouteId)}
              className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px]"
            >
              Réserver
            </button>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
            {[
              { id: 'all' as const, label: 'Toutes les missions', count: requests.length },
              {
                id: 'shopping' as const,
                label: 'Achats Shop & Go',
                count: requests.filter((r) => r.kind !== 'parcel').length,
              },
              {
                id: 'parcel' as const,
                label: 'Colis & Plis',
                count: requests.filter((r) => r.kind === 'parcel').length,
              },
              {
                id: 'urgent' as const,
                label: 'Urgents (< 48h)',
                count: requests.filter((r) => r.flexibility === 'urgent').length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Quick Min Reward Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Gain min :
            </span>
            {[0, 20, 40, 60].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setMinReward(amount)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  minReward === amount
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {amount === 0 ? 'Tous' : `${amount}€+`}
              </button>
            ))}
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une destination (Alger, Oran, Tunis...), un article (iPhone, sneakers, parfum) ou un client..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
          />
        </div>
      </section>

      {/* Missions Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Missions disponibles pour voyageurs</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''}
            </span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Lock size={12} className="text-emerald-500" />
            Séquestre garanti à 100%
          </span>
        </div>

        {filteredMissions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <Package size={40} className="mx-auto text-slate-400" />
            <p className="text-slate-700 dark:text-slate-300 font-semibold">
              Aucune mission ne correspond à vos filtres actuels.
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Essayez de réduire le montant du gain minimum ou d&apos;élargir vos termes de recherche.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                setMinReward(0);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMissions.map((mission) => {
              const netReward = mission.serviceGross ?? mission.reward;
              const isShopping = mission.kind !== 'parcel';

              return (
                <div
                  key={mission.id}
                  onClick={() => onRequest(mission)}
                  className="group relative cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Row: Type Badge + Reward */}
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isShopping
                            ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                        }`}
                      >
                        {isShopping ? <ShoppingBag size={13} /> : <Package size={13} />}
                        {isShopping ? 'Achat Shop & Go' : 'Colis Express'}
                      </span>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block">
                          Votre prime nette
                        </span>
                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                          +{euro(netReward)}
                        </span>
                      </div>
                    </div>

                    {/* Image & Title */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700/60">
                        <img
                          src={mission.image}
                          alt={mission.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {mission.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {mission.specifications}
                        </p>
                        {mission.weightKg !== undefined && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">
                            <Luggage size={12} className="text-slate-400" />
                            Poids : {mission.weightKg} kg
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Route Line */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-emerald-500 shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {mission.origin}
                        </span>
                        <ArrowRight size={12} className="text-slate-400" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {mission.destination}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        <Calendar size={12} />
                        {mission.date}
                      </span>
                    </div>
                  </div>

                  {/* Buyer & Card CTA Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {mission.buyerAvatar ? (
                        <img
                          src={mission.buyerAvatar}
                          alt={mission.buyer}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {mission.buyer[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                          {mission.buyer}
                        </p>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                          <CheckCircle2 size={10} /> Acheteur vérifié
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors flex items-center gap-1 group-hover:bg-emerald-600"
                    >
                      <span>Accepter</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Traveler Workflow Trust Pillars */}
      <section className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 text-center">
          Comment fonctionne la rémunération d&apos;un voyageur Shop &amp; Go ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              1
            </div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Sélectionnez votre mission</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Consultez les demandes d&apos;achats ou de transport correspondant à vos dates et votre destination de vol.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              2
            </div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Fonds séquestrés sur Stripe</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Le montant total (achat + prime) est bloqué avant votre départ. Aucun risque d&apos;impayé.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              3
            </div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Déblocage instantané par PIN</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              À la remise de l&apos;article, le destinataire vous communique un code PIN secret qui libère immédiatement vos fonds.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
