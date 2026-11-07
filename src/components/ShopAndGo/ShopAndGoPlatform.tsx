import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Luggage,
  Search,
  ShieldCheck,
  ArrowRight,
  ScanLine,
  PlusCircle,
  Package,
  ChevronRight,
  Clock,
  MapPin,
  Lock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
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
  trips: _trips,
  onRequest,
  onTrip: _onTrip,
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
    <div className="w-full max-w-6xl mx-auto px-3.5 sm:px-6 pt-3 pb-36 sm:py-8 space-y-5 sm:space-y-7 animate-fadeIn text-slate-900 dark:text-slate-100">
      {/* Header Section */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-4 sm:pb-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300 font-mono tracking-wide uppercase">
              <ShoppingBag size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Shop &amp; Go &middot; Espace Voyageur</span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
              Monétisez votre franchise bagages
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Rentabilisez vos trajets aériens et maritimes en transportant des colis certifiés ou en réalisant des achats à la demande. Paiement sous séquestre bancaire Stripe libéré à la remise.
            </p>

            <div className="pt-2 flex items-center gap-2 overflow-x-auto sm:flex-wrap no-scrollbar">
              <button
                type="button"
                onClick={onPublishTrip}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-2 shrink-0 min-h-[44px]"
              >
                <PlusCircle size={16} />
                <span>Proposer mes kilos</span>
              </button>
              <button
                type="button"
                onClick={onScanBoardingPass}
                className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition-all flex items-center gap-2 shrink-0 min-h-[44px]"
              >
                <ScanLine size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Scanner billet IATA</span>
              </button>
              <button
                type="button"
                onClick={() => onArbitrage('mrs-alg')}
                className="px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 min-h-[44px]"
              >
                <TrendingUp size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span>Vols rentables</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Account status card - Desktop */}
          <div className="hidden lg:block p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 w-72 shrink-0 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Solde disponible</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base">
                {euro(user?.stripeBalance || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Fonds sous séquestre</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-xs">
                {euro(user?.pendingEscrow || 0)}
              </span>
            </div>
            <div className="pt-1">
              {isKycVerified ? (
                <div className="py-1.5 px-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Identité vérifiée eIDAS</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openKycModal}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[36px]"
                >
                  <AlertCircle size={14} className="text-amber-600 dark:text-amber-400" />
                  <span>Vérification d&apos;identité requise</span>
                </button>
              )}
            </div>
          </div>

          {/* Account status strip - Mobile */}
          <div className="lg:hidden p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Solde</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {euro(user?.stripeBalance || 0)}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Séquestre</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 text-xs">
                  {euro(user?.pendingEscrow || 0)}
                </span>
              </div>
            </div>
            <div>
              {isKycVerified ? (
                <span className="py-1 px-2.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Vérifié</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={openKycModal}
                  className="py-1 px-2.5 rounded-lg bg-amber-500/10 active:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-semibold flex items-center gap-1"
                >
                  <AlertCircle size={12} />
                  <span>Activer KYC</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Filter and Search Navigation */}
      <section className="space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Segmented Mission Type Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs overflow-x-auto no-scrollbar">
            {[
              { id: 'all' as const, label: 'Toutes les missions', count: requests.length },
              {
                id: 'shopping' as const,
                label: 'Achats boutique',
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
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {requests.length > 0 && (
                  <span className="text-[10px] font-mono px-1 rounded bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
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
            placeholder="Rechercher une destination ou un article..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs"
          />
        </div>
      </section>

      {/* Missions Grid or Virgin Empty State */}
      <section className="space-y-4">
        {requests.length > 0 && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''} disponible{filteredMissions.length > 1 ? 's' : ''}</span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              <Lock size={12} className="text-emerald-600 dark:text-emerald-400" />
              Garantie séquestre bancaire Stripe
            </span>
          </div>
        )}

        {filteredMissions.length === 0 ? (
          /* Virgin / Clean Empty State (Apple HIG & Stripe Level) */
          <div className="p-8 sm:p-12 text-center rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/40 dark:to-slate-900/80 shadow-xs space-y-6">
            <div className="inline-flex p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 shadow-xs">
              <ShoppingBag size={32} />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                {requests.length === 0
                  ? 'Aucune mission disponible pour le moment'
                  : 'Aucune mission ne correspond à votre recherche'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {requests.length === 0
                  ? 'Soyez le premier à proposer votre franchise bagages. Les expéditeurs et acheteurs réservent dès parution de votre vol.'
                  : 'Modifiez vos filtres ou réinitialisez votre recherche pour afficher toutes les opportunités.'}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onPublishTrip}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
              >
                <PlusCircle size={16} />
                <span>Proposer mes kilos disponibles</span>
              </button>
              <button
                type="button"
                onClick={onScanBoardingPass}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <ScanLine size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Scanner ma carte d&apos;embarquement</span>
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('all');
                    setSelectedDestination('all');
                    setSearchQuery('');
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-medium"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>

            {/* 3 Step Traveler Value Pillars */}
            <div className="pt-8 border-t border-slate-200/70 dark:border-slate-800/70 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1.5 shadow-xs">
                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 block uppercase">
                  1. Publiez votre vol
                </span>
                <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Déclarez vos kilos libres
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Renseignez votre compagnie, date et liaison aérienne ou maritime.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1.5 shadow-xs">
                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 block uppercase">
                  2. Validez les missions
                </span>
                <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Colis certifiés &amp; achats
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Acceptez uniquement les demandes compatibles avec votre bagage et inspectées.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1.5 shadow-xs">
                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 block uppercase">
                  3. Encaissez garanti
                </span>
                <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Séquestre Stripe libéré
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Fonds protégés en amont et versés sur votre compte à la remise en main propre.
                </p>
              </div>
            </div>
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
                  className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 p-4 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4 shadow-xs"
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
                      <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center">
                        {mission.image ? (
                          <img
                            src={mission.image}
                            alt={mission.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <Package size={22} className="text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
                          {isShopping ? 'Achat Shop & Go' : 'Colis certifié'}
                        </span>
                        <h2 className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {mission.title}
                        </h2>
                        {mission.weightKg !== undefined && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
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
                        Rémunération nette
                      </span>
                      <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        +{euro(netReward)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center gap-1 min-h-[36px]"
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

