import React, { useState } from 'react';
import { 
  Zap, 
  Plane, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock 
} from 'lucide-react';
import { ArbitrageOpportunity } from '../types';

interface SmartFlightArbitrageProps {
  opportunities: ArbitrageOpportunity[];
  onSelectOpportunity: (opportunity: ArbitrageOpportunity) => void;
}

export const SmartFlightArbitrage: React.FC<SmartFlightArbitrageProps> = ({
  opportunities,
  onSelectOpportunity
}) => {
  const [selectedId, setSelectedId] = useState<string>(opportunities[0]?.id || '');
  const activeOpp = opportunities.find(o => o.id === selectedId) || opportunities[0];

  if (!activeOpp) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 text-white border border-blue-500/20 shadow-2xl">
        
        {/* Glow ambient background effects */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -left-12 h-64 w-96 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute -bottom-24 -right-12 h-64 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
        </div>

        {/* Top Header Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-bold text-blue-200">
            <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Algorithme IA de Billetterie & Arbitrage en Direct</span>
          </div>

          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Opportunités d'arbitrage actives aujourd'hui
          </span>
        </div>

        {/* Main Headline */}
        <div className="max-w-2xl mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            Voyagez <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">100% Gratuitement</span> et gagnez de l'argent
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            L'algorithme compare en continu les billets d'avion les moins chers avec les commandes d'achats en attente. <strong>Vos courses remboursent votre vol</strong> et vous dégagez un bénéfice net immédiat.
          </p>
        </div>

        {/* City Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {opportunities.map((opp) => {
            const isCurrent = opp.id === activeOpp.id;
            return (
              <button
                key={opp.id}
                onClick={() => setSelectedId(opp.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400/40 scale-102'
                    : 'bg-white/10 hover:bg-white/15 text-slate-300'
                }`}
              >
                <span>{opp.city}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isCurrent ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  +{opp.netProfit} € net
                </span>
              </button>
            );
          })}
        </div>

        {/* The Live Interactive Arbitrage Comparison Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 sm:p-7 text-slate-900 shadow-xl border border-white/40 space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Box 1 : Billet d'avion le moins cher */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-extrabold text-blue-600 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                    <Plane className="w-3.5 h-3.5 -rotate-45" />
                    Billet le Moins Cher Trouvé
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    {activeOpp.flight.airline}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="text-xs text-slate-400 font-bold">Départ</p>
                    <p className="text-sm font-black text-slate-900">{activeOpp.flight.origin}</p>
                    <p className="text-[11px] text-slate-500">{activeOpp.flight.departureDate} à {activeOpp.flight.departureTime}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mx-2" />
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold">Arrivée</p>
                    <p className="text-sm font-black text-emerald-600">{activeOpp.flight.destination}</p>
                    <p className="text-[11px] text-slate-500">Vol {activeOpp.flight.flightNumber}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-semibold">Prix du billet négocié :</span>
                <span className="text-lg font-black text-blue-600">{activeOpp.flight.flightPrice} €</span>
              </div>
            </div>

            {/* Box 2 : Commandes d'achats en attente */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-extrabold text-emerald-700 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                    Commandes Rémunérées en Attente
                  </span>
                  <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                    Séquestre Stripe Garanti
                  </span>
                </div>

                <div className="flex items-start gap-3 mt-2">
                  <img 
                    src={activeOpp.clientAvatar} 
                    alt={activeOpp.clientName} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {activeOpp.ordersDescription}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Commandé par <strong>{activeOpp.clientName}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-semibold">Rémunération bloquée pour vous :</span>
                <span className="text-lg font-black text-emerald-700">+{activeOpp.totalOrderReward} €</span>
              </div>
            </div>
          </div>

          {/* Mathematical Arbitrage Bar (Stripe / Apple Keynote style) */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-bold text-center sm:text-left">
              <span className="text-slate-400">
                🎫 Vol : <strong className="text-rose-300">-{activeOpp.flight.flightPrice} €</strong>
              </span>
              <span className="text-slate-500">+</span>
              <span className="text-slate-400">
                🛍️ Courses : <strong className="text-emerald-400">+{activeOpp.totalOrderReward} €</strong>
              </span>
              <span className="text-slate-500">=</span>
              <span className="text-emerald-400 text-sm font-black flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{activeOpp.netProfit} € de Bénéfice Net
              </span>
            </div>

            <button
              onClick={() => onSelectOpportunity(activeOpp)}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Saisir cette opportunité & Partir</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
