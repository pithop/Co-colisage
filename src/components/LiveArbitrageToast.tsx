import React, { useState, useEffect } from 'react';
import { Zap, X, ArrowRight, Plane, Sparkles } from 'lucide-react';
import { ArbitrageOpportunity } from '../types';

interface LiveArbitrageToastProps {
  opportunity: ArbitrageOpportunity;
  onOpen: (opportunity: ArbitrageOpportunity) => void;
}

export const LiveArbitrageToast: React.FC<LiveArbitrageToastProps> = ({
  opportunity,
  onOpen
}) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show toast after 2.5 seconds to simulate incoming live push notification
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="relative bg-slate-900/95 backdrop-blur-xl border border-blue-500/40 p-4 rounded-2xl shadow-2xl text-white overflow-hidden">
        
        {/* Glow ambient */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/20 rounded-full blur-xl" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                Alerte Algorithme IA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h4 className="text-xs font-black text-white leading-tight">
              Voyagez gratuit pour {opportunity.city} & gagnez +{opportunity.netProfit} € !
            </h4>

            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              Billet {opportunity.flight.airline} détecté à <strong>{opportunity.flight.flightPrice} €</strong>. Commande de <strong>{opportunity.totalOrderReward} €</strong> en attente !
            </p>

            <button
              onClick={() => {
                onOpen(opportunity);
                setVisible(false);
              }}
              className="mt-2.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Voir l'opportunité</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              setVisible(false);
              setDismissed(true);
            }}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
