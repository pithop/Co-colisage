import React from 'react';
import { 
  X, 
  Building2, 
  Truck, 
  FileCheck, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  TrendingUp, 
  Download,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CarrierDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPublish: () => void;
}

export const CarrierDashboard: React.FC<CarrierDashboardProps> = ({
  isOpen,
  onClose,
  onOpenPublish,
}) => {
  const { user } = useAuth();

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="carrier-title"
        className="relative w-full max-w-4xl bg-slate-50 dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="carrier-title" className="font-extrabold text-base text-white">{user.companyName || user.name}</h3>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                  {user.siret ? "PRO SIRET Vérifié" : "Compte Professionnel"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {user.siret ? `SIRET : ${user.siret} &middot; Licence Transport` : "Dossier transporteur certifié eIDAS"}
              </p>
            </div>
          </div>

          <button onClick={onClose} aria-label="Fermer le tableau de bord" className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Revenue & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase">Chiffre d'Affaires Encaissé</span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{(user.stripeBalance || 0).toFixed(2)} €</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Facturation TVA automatisée
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase">Fret Sous Séquestre Stripe</span>
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">{(user.pendingEscrow || 0).toFixed(2)} €</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {(user.completedDeliveries || 0) > 0
                  ? `${user.completedDeliveries} expéditions terminées`
                  : "Aucune retenue sous séquestre"}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase">Capacité Flotte Fret</span>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                  {user.companyName ? "Flotte commerciale active" : "Véhicules & soutes disponibles"}
                </p>
              </div>
              <button
                onClick={onOpenPublish}
                className="mt-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Déposer un chargement groupé</span>
              </button>
            </div>
          </div>

          {/* Compliance & Legal notice */}
          <div className="p-4 bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>
                <strong>Statut Fiscal Conforme :</strong> Édition automatique des factures de commissions avec mentions légales ANPDP et droit douanier.
              </span>
            </div>
            <button className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1 shrink-0 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Download className="w-3.5 h-3.5" />
              <span>Export Comptable</span>
            </button>
          </div>

          {/* Bulk Shipments */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">Lignes de Fret Routier & Maritime Régulières</h4>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Marseille → Alger & Oran (Groupage Hebdomadaire)</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Volume restant : 450 kg / 4 m³ • Tarif dégressif professionnel</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1 rounded-full">
                  Réservations ouvertes
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
