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
  activeOrder?: {
    id: string;
    subject: string;
    carrierName: string;
    origin: string;
    destination: string;
    amount: number;
    pin: string;
  } | null;
}

export const ExpediteurDashboard: React.FC<ExpediteurDashboardProps> = ({
  isOpen,
  onClose,
  onOpenGps,
  onOpenMessaging,
  activeOrder,
}) => {
  const { user } = useAuth();

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="expediteur-title"
        className="relative w-full max-w-3xl bg-slate-50 dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 id="expediteur-title" className="font-extrabold text-base text-white">{user.name}</h3>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                  Client Acheteur &amp; Expéditeur
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mes Commandes &middot; Séquestre Stripe actif
              </p>
            </div>
          </div>

          <button onClick={onClose} aria-label="Fermer le tableau de bord" className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeOrder ? (
            /* Active order card with real PIN code */
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-blue-200 dark:border-blue-800/60 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Expédition {activeOrder.id} en cours
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  Séquestre {activeOrder.amount.toFixed(2)} € Bloqué
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Objet &amp; Trajet :</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    {activeOrder.origin} &rarr; {activeOrder.destination}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Voyageur en charge :</p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                    <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {activeOrder.carrierName}
                  </p>
                </div>

                {/* Secret PIN Box for the sender */}
                <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-xl flex flex-col items-center justify-center text-center border border-slate-800">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5" /> Votre Code PIN Secret de Remise
                  </span>
                  <p className="text-2xl font-black tracking-widest text-white mt-1">
                    {activeOrder.pin.split('').join(' ')}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    À ne communiquer au voyageur qu'au moment de la remise physique à destination.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={onOpenGps}
                  className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse text-blue-600 dark:text-blue-400" />
                  <span>Suivre le trajet en direct (GPS)</span>
                </button>
                <button
                  onClick={onOpenMessaging}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
                >
                  Contacter le voyageur
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Aucune expédition active</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Vous n'avez aucun colis sous séquestre pour le moment. Déposez une annonce d'expédition ou passez commande pour confier votre paquet à un voyageur certifié.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMessaging();
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                Explorer mes messages &amp; commandes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
