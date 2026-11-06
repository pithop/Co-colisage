import React, { useState, useMemo } from 'react';
import {
  Plane,
  Luggage,
  ShoppingBag,
  Search,
  ShieldCheck,
  ArrowRight,
  ScanLine,
  PlusCircle,
  Package,
  ChevronRight,
  Clock,
  MapPin,
  Calendar,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PurchaseRequest, Trip, euro, normalize } from '../../data/marketplace';
import { useAuth } from '../../context/AuthContext';

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
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMissions = useMemo(() => {
    const q = normalize(searchQuery);
    return requests.filter((r) => {
      if (r.status && r.status !== 'available') return false;

      if (activeTab === 'shopping' && r.kind === 'parcel') return false;
      if (activeTab === 'parcel' && r.kind !== 'parcel') return false;
      if (activeTab === 'urgent' && r.flexibility !== 'urgent') return false;

      if (selectedDestination !== 'all') {
        const dest = normalize(r.destination);
        if (!dest.includes(normalize(selectedDestination))) return false;
      }

      if (q) {
        const text = normalize(`${r.title} ${r.origin} ${r.destination} ${r.buyer} ${r.specifications}`);
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [requests, activeTab, selectedDestination, searchQuery]);

  return (
    <div className="w-full max-w-6xl mx-auto px-3.5 sm:px-6 pt-3 pb-32 sm:py-8 space-y-5 sm:space-y-8 animate-fadeIn text-slate-900 dark:text-slate-100">
      {/* Header Section */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-4 sm:pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase font-mono">
              <ShoppingBag size={14} />
              <span>Shop &amp; Go &middot; Espace Voyageur</span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Monétisez votre franchise bagages
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
              Achetez des articles demandés en Europe ou transportez des colis certifiés pour des clients locaux.
              Paiement sous séquestre Stripe libéré à la remise en main propre.
            </p>

            <div className="pt-1 sm:pt-2 flex items-center gap-2 overflow-x-auto sm:flex-wrap no-scrollbar pb-1">
              <button
                type="button"
                onClick={onPublishTrip}
                className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <PlusCircle size={15} />
                <span>Proposer mes kilos</span>
              </button>
              <button
                type="button"
                onClick={onScanBoardingPass}
                className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-slate-700 transition-all flex items-center gap-1.5 shrink-0"
              >
                <ScanLine size={15} />
                <span>Scanner billet IATA</span>
              </button>
              <button
                type="button"
                onClick={() => onArbitrage('mrs-alg')}
                className="px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
              >
                <span>Vols rentables</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Account status card - Desktop */}
          <div className="hidden lg:block p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 w-72 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Solde disponible</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                {euro(user?.stripeBalance || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 font-medium">En séquestre</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-xs">
                {euro(user?.pendingEscrow || 0)}
              </span>
            </div>
            <div className="pt-1">
              {isKycVerified ? (
                <div className="py-1.5 px-2.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  <span>Identité vérifiée eIDAS</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openKycModal}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertCircle size={13} />
                  <span>Vérification d&apos;identité requise</span>
                </button>
              )}
            </div>
          </div>

          {/* Account status strip - Mobile */}
          <div className="lg:hidden p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Solde</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                  {euro(user?.stripeBalance || 0)}
                </span>
              </div>
              <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Séquestre</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 text-xs">
                  {euro(user?.pendingEscrow || 0)}
                </span>
              </div>
            </div>
            <div>
              {isKycVerified ? (
                <span className="py-1 px-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>Vérifié</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={openKycModal}
                  className="py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-semibold flex items-center gap-1"
                >
                  <AlertCircle size={11} />
                  <span>Activer KYC</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Filter and Search Navigation */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Segmented Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs overflow-x-auto no-scrollbar">
            {[
              { id: 'all' as const, label: 'Toutes les missions', count: requests.length },
              {
                id: 'shopping' as const,
                label: 'Achats Shop & Go',
                count: requests.filter((r) => r.kind !== 'parcel').length,
              },
              {
                id: 'parcel' as const,
                label: 'Colis simples',
                count: requests.filter((r) => r.kind === 'parcel').length,
              },
              {
                id: 'urgent' as const,
                label: 'Urgents',
                count: requests.filter((r) => r.flexibility === 'urgent').length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono px-1 rounded bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Destination Quick Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar pb-0.5">
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
            placeholder="Filtrer par destination, produit (iPhone, sneakers, parfum) ou acheteur..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
      </section>

      {/* Missions Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''} active{filteredMissions.length > 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Lock size={11} className="text-emerald-500" />
            Garantie séquestre Stripe
          </span>
        </div>

        {filteredMissions.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <Package size={36} className="mx-auto text-slate-400" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Aucune demande ne correspond à ces critères
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Vous pouvez publier vos disponibilités de vol ou élargir vos critères de destination.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                setSelectedDestination('all');
                setSearchQuery('');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMissions.map((mission) => {
              const netReward = mission.serviceGross ?? mission.reward;
              const isShopping = mission.kind !== 'parcel';

              return (
                <article
                  key={mission.id}
                  onClick={() => onRequest(mission)}
                  className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow"
                >
                  <div className="space-y-3">
                    {/* Header route line */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                        <span>{mission.origin}</span>
                        <ArrowRight size={12} className="text-slate-400" />
                        <span>{mission.destination}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        {mission.date}
                      </span>
                    </div>

                    {/* Item Photo & Title */}
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-700/60">
                        <img
                          src={mission.image}
                          alt={mission.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                          {isShopping ? 'Achat Shop & Go' : 'Colis'}
                        </span>
                        <h2 className="font-medium text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {mission.title}
                        </h2>
                        {mission.weightKg !== undefined && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Luggage size={12} />
                            <span>Poids : {mission.weightKg} kg</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Reward & CTA */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">
                        Prime nette
                      </span>
                      <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        +{euro(netReward)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>Accepter</span>
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
