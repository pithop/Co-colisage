import React from 'react';
import { Plane, Package, ShoppingBag } from 'lucide-react';
import { MainPillar } from '../types';

interface ThreePillarsTabsProps {
  activePillar: MainPillar;
  onSelectPillar: (pillar: MainPillar) => void;
}

export const ThreePillarsTabs: React.FC<ThreePillarsTabsProps> = ({
  activePillar,
  onSelectPillar,
}) => {
  const tabs = [
    {
      id: 'voyageur' as MainPillar,
      icon: Plane,
      title: '1. Je Voyage',
      subtitle: 'Rentabiliser ma valise',
      badge: 'Gain moyen : 150€+',
    },
    {
      id: 'expediteur' as MainPillar,
      icon: Package,
      title: "2. J'Expédie un Colis",
      subtitle: 'Envoyer à un proche',
      badge: 'Dès 9€ / kg',
    },
    {
      id: 'destinataire' as MainPillar,
      icon: ShoppingBag,
      title: '3. Je Reçois un Produit',
      subtitle: 'Faire acheter & rapporter',
      badge: 'Duty Free & Magasins',
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-2">
      <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePillar === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectPillar(tab.id)}
                className={`relative flex items-center justify-between sm:justify-start gap-3.5 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg ring-2 ring-blue-500/20'
                    : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                }`}
              >
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-white text-slate-600 border border-slate-200/80'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs sm:text-sm tracking-tight truncate">
                      {tab.title}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] truncate ${
                      isActive ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {tab.subtitle}
                  </p>
                </div>

                <div className="shrink-0 hidden xs:block">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-blue-500/30 text-blue-200 border border-blue-400/30'
                        : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
