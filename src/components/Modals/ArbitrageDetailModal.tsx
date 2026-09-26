import React, { useState } from 'react';
import { 
  X, 
  Plane, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  ShoppingBag, 
  TrendingUp,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ArbitrageOpportunity } from '../../types';

interface ArbitrageDetailModalProps {
  opportunity: ArbitrageOpportunity | null;
  onClose: () => void;
  onSuccess: (opportunity: ArbitrageOpportunity) => void;
}

export const ArbitrageDetailModal: React.FC<ArbitrageDetailModalProps> = ({
  opportunity,
  onClose,
  onSuccess
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!opportunity) return null;

  const handleConfirm = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsConfirmed(true);
    setTimeout(() => {
      onSuccess(opportunity);
      setIsConfirmed(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Algorithme d'Arbitrage IA</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-extrabold">
                  {opportunity.netProfit >= 0 ? 'Voyage 100% financé' : 'Voyage à compléter'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Billet d'avion financé par les commissions de courses
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isConfirmed ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900">Mission & Vol Confirmés !</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Le séquestre de <strong>{opportunity.totalOrderReward} €</strong> est sécurisé sur Stripe. Vos billets et instructions de remise à {opportunity.city} vous ont été transmis.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
                <TrendingUp className="w-4 h-4" />
                <span>Bénéfice net garanti : +{opportunity.netProfit} €</span>
              </div>
            </div>
          ) : (
            <>
              {/* Le vol le moins cher trouvé par l'algo */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Plane className="w-4 h-4 text-blue-600" />
                    Billet le moins cher détecté
                  </span>
                  <span className="font-black text-blue-600 text-sm">
                    {opportunity.flight.flightPrice} €
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-xs font-black text-slate-900">{opportunity.flight.origin}</p>
                    <p className="text-[11px] text-slate-500">{opportunity.flight.departureDate} • {opportunity.flight.departureTime}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600">{opportunity.flight.destination}</p>
                    <p className="text-[11px] text-slate-500 font-semibold">{opportunity.flight.airline} ({opportunity.flight.flightNumber})</p>
                  </div>
                </div>
              </div>

              {/* Les commandes associées par l'algo */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    Commandes en attente sur ce vol
                  </span>
                  <span className="font-black text-emerald-700 text-sm">
                    +{opportunity.totalOrderReward} € versés
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  {opportunity.clientAvatar && <img
                    src={opportunity.clientAvatar} 
                    alt={opportunity.clientName} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                  />}
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{opportunity.ordersDescription}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Demandé par {opportunity.clientName} • Fonds sous séquestre Stripe garanti
                    </p>
                  </div>
                </div>
              </div>

              {/* Le Bilan Financier Limpide (Stripe / Apple style) */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2.5 shadow-md">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Bilan Financier de l'Arbitrage
                </span>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Coût du billet d'avion :</span>
                  <span className="font-bold text-rose-300">- {opportunity.flight.flightPrice},00 €</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Rémunération de la mission shopping :</span>
                  <span className="font-bold text-emerald-400">+ {opportunity.totalOrderReward},00 €</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold">Votre Bénéfice Net :</p>
                    <p className="text-2xl font-black text-emerald-400">{opportunity.netProfit > 0 ? '+' : ''}{opportunity.netProfit},00 €</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wide">
                      {opportunity.netProfit >= 0 ? 'Billet 100% financé' : 'Billet partiellement financé'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Les 3 Étapes Simples */}
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 text-slate-600">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Comment ça se passe ?
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-500 pl-1">
                  <li>L'acheteur a déjà bloqué les <strong>{opportunity.totalOrderReward} €</strong> sur Stripe.</li>
                  <li>Vous prenez en charge les missions sélectionnées : {opportunity.ordersDescription}.</li>
                  <li>À l'arrivée à {opportunity.city}, vous remettez les articles et encaissez <strong>{opportunity.totalOrderReward} €</strong> instantanément.</li>
                </ol>
              </div>

              {/* Bouton CTA */}
              <button
                onClick={handleConfirm}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirmer les missions sélectionnées</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
