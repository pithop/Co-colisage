import React from 'react';
import { X, MapPin, Navigation, Compass, Radio, Plane, Ship } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="font-bold text-sm">Télémétrie & Suivi GPS en Temps Réel</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Simulated Map Visual */}
          <div className="relative w-full h-64 rounded-2xl bg-gradient-to-b from-sky-900 to-indigo-950 overflow-hidden p-4 text-white flex flex-col justify-between border border-slate-800">
            {/* Background grid lines */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 flex justify-between items-center text-xs">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Signal GPS Actif (Méditerranée)
              </span>
              <span className="text-slate-300 font-mono">37°48'N 3°12'E</span>
            </div>

            {/* Travel Line */}
            <div className="relative z-10 flex items-center justify-between px-6 my-auto">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[10px]">
                  MRS
                </div>
                <span className="text-[10px] mt-1 font-bold">Marseille</span>
              </div>

              {/* Trajectory */}
              <div className="flex-1 mx-4 relative flex items-center justify-center">
                <div className="w-full h-0.5 bg-dashed border-t-2 border-dashed border-cyan-400/60" />
                <div className="absolute bg-cyan-400 text-slate-900 p-1.5 rounded-full shadow-lg animate-pulse">
                  <Ship className="w-4 h-4" />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-[10px]">
                  ALG
                </div>
                <span className="text-[10px] mt-1 font-bold">Alger</span>
              </div>
            </div>

            <div className="relative z-10 flex justify-between text-[11px] text-slate-300 border-t border-white/10 pt-2">
              <span>Vitesse : <strong>21 nœuds</strong></span>
              <span>Arrivée estimée : <strong>Demain 07h30</strong></span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs space-y-1">
            <p className="font-bold text-slate-800">Transporteur : Karim Bouzid (Ferry)</p>
            <p className="text-slate-500">
              Colis scellé #DZ-8491 en sécurité dans le compartiment bagages contrôlé.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
          >
            Fermer le suivi
          </button>
        </div>
      </div>
    </div>
  );
};
