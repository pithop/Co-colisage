import React from 'react';
import { Plane, Package, ShoppingBag } from 'lucide-react';
import { MainPillar } from '../types';

interface ThreePillarsTabsProps {
  activePillar: MainPillar;
  onSelectPillar: (pillar: MainPillar) => void;
}

// Illustrative activity until live counts are supplied by the application.
const tabs = [
  {
    id: 'voyageur' as MainPillar,
    icon: Plane,
    title: '1. Je Voyage',
    subtitle: 'Rentabiliser ma valise',
    badge: 'Gain moyen : 150 €+',
    activity: '14 départs Marseille–Alger',
    iconColor: 'text-blue-600',
    activeIcon: 'from-blue-400 to-blue-600 shadow-blue-500/30',
    dot: 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.65)]',
    movement: 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:-rotate-6',
  },
  {
    id: 'expediteur' as MainPillar,
    icon: Package,
    title: "2. J’Expédie",
    subtitle: 'Envoyer à un proche',
    badge: 'Dès 9 € / kg',
    activity: '8 colis prêts',
    iconColor: 'text-cyan-700',
    activeIcon: 'from-cyan-400 to-cyan-600 shadow-cyan-500/30',
    dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.65)]',
    movement: 'group-hover:-translate-y-0.5 group-hover:rotate-6',
  },
  {
    id: 'destinataire' as MainPillar,
    icon: ShoppingBag,
    title: '3. Je Reçois',
    subtitle: 'Faire acheter & rapporter',
    badge: 'Duty Free & Magasins',
    activity: '32 articles demandés',
    iconColor: 'text-emerald-700',
    activeIcon: 'from-emerald-400 to-emerald-600 shadow-emerald-500/30',
    dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.65)]',
    movement: 'group-hover:-translate-y-0.5 group-hover:-rotate-6',
  },
];

export const ThreePillarsTabs: React.FC<ThreePillarsTabsProps> = ({
  activePillar,
  onSelectPillar,
}) => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-2 pt-6 sm:px-6">
      <div className="relative isolate rounded-[28px] bg-gradient-to-br from-white via-blue-200/60 to-slate-200/80 p-px shadow-[0_16px_48px_-20px_rgba(15,23,42,0.22),0_2px_8px_-4px_rgba(15,23,42,0.08)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[28px]">
          <div className="absolute -left-8 -top-16 h-40 w-64 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -bottom-16 right-0 h-40 w-64 rounded-full bg-cyan-100/60 blur-3xl" />
        </div>

        <div className="rounded-[27px] bg-white/70 p-2 backdrop-blur-xl sm:p-3">
          <div
            role="group"
            aria-label="Choisir votre pilier"
            className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activePillar === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onSelectPillar(tab.id)}
                  className={`group relative isolate flex min-w-0 flex-col overflow-hidden rounded-[20px] border p-4 text-left transition-[transform,background-color,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none ${
                    isActive
                      ? 'border-slate-700 bg-slate-900 text-white shadow-[0_8px_20px_-8px_rgba(15,23,42,0.55)]'
                      : 'border-white/80 bg-white/40 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-blue-200/80 hover:bg-white/90 hover:shadow-md'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-400/20 via-transparent to-cyan-300/10 transition-opacity duration-300 motion-reduce:transition-none ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}
                  />
                  <span aria-hidden="true" className={`pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${isActive ? 'via-blue-200/60' : 'via-white'}`} />

                  <span className="flex w-full items-center gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-[background-color,box-shadow] duration-300 motion-reduce:transition-none ${
                        isActive
                          ? `border-white/20 bg-gradient-to-br text-white shadow-lg ${tab.activeIcon}`
                          : `border-slate-200/70 bg-white/90 shadow-sm ${tab.iconColor}`
                      }`}
                    >
                      <Icon aria-hidden="true" strokeWidth={1.75} className={`h-5 w-5 transition-transform duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none ${tab.movement}`} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold tracking-tight">{tab.title}</span>
                      <span className={`mt-1 block text-xs leading-relaxed ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                        {tab.subtitle}
                      </span>
                    </span>
                    <span aria-hidden="true" className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${isActive ? 'border-blue-300/60 bg-blue-400/15' : 'border-slate-300 bg-white/60'}`}>
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-blue-200 shadow-[0_0_8px_rgba(147,197,253,0.7)]" />}
                    </span>
                  </span>

                  <span className={`mt-4 inline-flex max-w-full items-center gap-2 self-start rounded-full border px-2.5 py-1 text-[10px] font-semibold leading-4 ${
                    isActive ? 'border-white/15 bg-white/[0.07] text-slate-100' : 'border-slate-200/80 bg-white/80 text-slate-700'
                  }`}>
                    <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full motion-safe:animate-pulse ${tab.dot}`} />
                    {tab.badge}
                  </span>

                  <span className={`mt-3 block w-full border-t pt-3 text-[11px] font-medium leading-relaxed tabular-nums ${isActive ? 'border-white/10 text-slate-300' : 'border-slate-200/70 text-slate-600'}`}>
                    {tab.activity}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
