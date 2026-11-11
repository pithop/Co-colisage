import React from 'react';
import { 
  X, 
  MapPin, 
  Radio, 
  Ship, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface GpsTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GpsTrackingModal: React.FC<GpsTrackingModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="gps-title"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-cyan-500/30 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brand Header */}
        <div className="relative bg-slate-900 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">
                Télémétrie en Direct
              </span>
            </div>
            <h3 id="gps-title" className="font-black text-lg text-white">
              Suivi Satellite &amp; GPS en Temps Réel
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Position vérifiée par balise AIS maritime et réseau cellulaire
            </p>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Fermer" 
            className="p-1.5 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {/* 3-Step Transit Timeline */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-1.5 p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                <CheckCircle2 size={12} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold truncate">Marseille</div>
                <div className="text-[8px] text-slate-400 truncate">Prise en charge</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-2 rounded-xl border bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-600 dark:text-blue-200 ring-2 ring-blue-500/20">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 animate-pulse">
                2
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold truncate">En Mer</div>
                <div className="text-[8px] text-blue-600 dark:text-blue-400 truncate font-bold">Transit actif</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500">
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-black shrink-0">
                3
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold truncate">Alger</div>
                <div className="text-[8px] text-slate-400 truncate">Remise PIN</div>
              </div>
            </div>
          </div>

          {/* Simulated Map Visual */}
          <div className="relative w-full h-56 rounded-2xl bg-slate-900 overflow-hidden p-4 text-white flex flex-col justify-between border border-slate-800 shadow-inner">
            {/* Background grid lines */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 flex justify-between items-center text-xs">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Signal GPS Actif (Méditerranée)
              </span>
              <span className="text-slate-400 font-mono text-[11px]">37°48'N 3°12'E</span>
            </div>

            {/* Travel Line */}
            <div className="relative z-10 flex items-center justify-between px-6 my-auto">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  MRS
                </div>
                <span className="text-[10px] mt-1 font-bold text-slate-300">Marseille</span>
              </div>

              {/* Trajectory */}
              <div className="flex-1 mx-4 relative flex items-center justify-center">
                <div className="w-full h-0.5 border-t-2 border-dashed border-blue-400/60" />
                <div className="absolute bg-blue-600 text-white p-1.5 rounded-full shadow-xs animate-bounce">
                  <Ship className="w-4 h-4" />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  ALG
                </div>
                <span className="text-[10px] mt-1 font-bold text-emerald-300">Alger</span>
              </div>
            </div>

            <div className="relative z-10 flex justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2 font-medium">
              <span>Vitesse : <strong>21 nœuds (Ferry)</strong></span>
              <span>Arrivée estimée : <strong>Demain 07h30</strong></span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs space-y-1">
            <p className="font-bold text-slate-900 dark:text-slate-100">Transporteur : Karim Bouzid (Traversée Maritime)</p>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Colis scellé <strong>#DZ-8491</strong> en sécurité dans le compartiment bagages contrôlé.
            </p>
          </div>

          {/* 3 Reassurance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <Radio size={14} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-slate-900 dark:text-white">Balise AIS Active</p>
                <p className="text-[9px] text-slate-500">Mise à jour toutes les 3 min.</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <Lock size={14} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-slate-900 dark:text-white">Scellé Inviolable</p>
                <p className="text-[9px] text-slate-500">Intégrité physique surveillée.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <ShieldCheck size={14} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-slate-900 dark:text-white">Séquestre Bloqué</p>
                <p className="text-[9px] text-slate-500">Paiement libéré au code PIN.</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all active:scale-95"
          >
            Fermer le suivi en direct
          </button>
        </div>
      </div>
    </div>
  );
};
