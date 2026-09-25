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
        className="relative w-full max-w-4xl bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">{user.companyName || user.name}</h3>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-bold">
                  PRO SIRET Vérifié
                </span>
              </div>
              <p className="text-xs text-slate-400">
                SIRET : {user.siret || '849 102 938 00024'} • Licence Transport Intracommunautaire
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Revenue & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Chiffre d'Affaires Encaissé</span>
              <p className="text-3xl font-black text-slate-900 mt-1">{user.stripeBalance.toFixed(2)} €</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Facturation TVA 20% automatisée
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Fret Sous Séquestre Stripe</span>
              <p className="text-3xl font-black text-blue-600 mt-1">{user.pendingEscrow.toFixed(2)} €</p>
              <p className="text-[11px] text-slate-500 mt-1">4 expéditions pro en cours</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Capacité Flotte Fret</span>
                <p className="text-sm font-extrabold text-slate-900 mt-1">Fourgon Master (14 m³) & Soute</p>
              </div>
              <button
                onClick={onOpenPublish}
                className="mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Déposer un chargement groupé</span>
              </button>
            </div>
          </div>

          {/* Compliance & Legal notice */}
          <div className="p-4 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-blue-900">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>
                <strong>Statut Fiscal Conforme :</strong> Édition automatique des factures de commissions avec mentions légales ANPDP et droit douanier.
              </span>
            </div>
            <button className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 font-bold rounded-xl flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              <span>Export Comptable</span>
            </button>
          </div>

          {/* Bulk Shipments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h4 className="font-extrabold text-sm text-slate-900 mb-3">Lignes de Fret Routier & Maritime Régulières</h4>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Marseille ➔ Alger & Oran (Groupage Hebdomadaire)</h5>
                    <p className="text-[11px] text-slate-500">Volume restant : 450 kg / 4 m³ • Tarif dégressif professionnel</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
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
