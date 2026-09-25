import React from 'react';
import { 
  X, 
  Package, 
  MapPin, 
  KeyRound, 
  Radio, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ExpediteurDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGps: () => void;
  onOpenMessaging: () => void;
}

export const ExpediteurDashboard: React.FC<ExpediteurDashboardProps> = ({
  isOpen,
  onClose,
  onOpenGps,
  onOpenMessaging,
}) => {
  const { user } = useAuth();

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">{user.name}</h3>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-bold">
                  Client Acheteur & Expéditeur
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mes Commandes • Séquestre Stripe actif
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Active order card with PIN code */}
          <div className="bg-white rounded-2xl border-2 border-blue-600/30 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs text-slate-900">Commande #BV-84912 en cours d'acheminement</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Séquestre 154,99 € Bloqué
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Trajet :</p>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Marseille ➔ Alger (Port)
                </p>
                <p className="text-xs text-slate-500 mt-2">Voyageur en charge :</p>
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Karim Bouzid (Ferry Corsica Linea)
                </p>
              </div>

              {/* Secret PIN Box for the sender */}
              <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" /> Votre Code PIN Secret de Remise
                </span>
                <p className="text-2xl font-black tracking-widest text-white mt-1">
                  4 8 2 1
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  À ne communiquer au voyageur qu'au moment de la remise physique à Alger.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={onOpenGps}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse text-blue-600" />
                <span>Suivre le Ferry en Direct (GPS)</span>
              </button>
              <button
                onClick={onOpenMessaging}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Contacter le voyageur
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
