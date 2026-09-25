import React, { useState } from 'react';
import { 
  X, 
  Plane, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Ship, 
  Plus, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  Camera, 
  KeyRound, 
  Building,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface VoyageurDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUploadProof: () => void;
  onOpenPinModal: () => void;
  onOpenInspection: () => void;
  onOpenPublish: () => void;
}

export const VoyageurDashboard: React.FC<VoyageurDashboardProps> = ({
  isOpen,
  onClose,
  onOpenUploadProof,
  onOpenPinModal,
  onOpenInspection,
  onOpenPublish,
}) => {
  const { user } = useAuth();
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const handlePayout = () => {
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">{user.name}</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> KYC Vérifié
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Espace Voyageur • Shopper Certifié (⭐ {user.rating} - {user.completedDeliveries} livraisons)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Wallet & Stripe Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Stripe Available Balance */}
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
                  <span className="font-semibold">Portefeuille Stripe Connect</span>
                  <Wallet className="w-4 h-4" />
                </div>
                <p className="text-3xl font-black">{user.stripeBalance.toFixed(2)} €</p>
                <p className="text-[11px] text-blue-200 mt-1">Disponible immédiatement</p>
              </div>

              <button
                onClick={handlePayout}
                className="mt-4 py-2 bg-white hover:bg-blue-50 text-blue-800 font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Building className="w-3.5 h-3.5" />
                <span>Virer vers mon IBAN (••• 4291)</span>
              </button>
            </div>

            {/* Escrow Pending */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold">Fonds Sous Séquestre</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-3xl font-black text-amber-600">+{user.pendingEscrow.toFixed(2)} €</p>
                <p className="text-[11px] text-slate-500 mt-1">En attente de validation PIN</p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>1 mission en cours</span>
                <span className="font-bold text-emerald-600">100% garanti</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Actions Rapides</span>
                <h4 className="font-extrabold text-sm text-slate-900 mt-1">Rentabiliser un voyage</h4>
                <p className="text-xs text-slate-500 mt-1">Publiez vos kilos libres et vos trajets.</p>
              </div>

              <button
                onClick={onOpenPublish}
                className="mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publier un nouveau trajet</span>
              </button>
            </div>

          </div>

          {payoutSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Virement Stripe de 345,00 € initié vers votre compte bancaire. Arrivée estimée sous 24h.</span>
            </div>
          )}

          {/* Active Missions (Shopping Inversé) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Missions de Shopping en Cours</h4>
                <p className="text-xs text-slate-500">Articles achetés pour le compte des clients</p>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                1 mission active
              </span>
            </div>

            <div className="border border-slate-200/70 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=200&q=80" 
                  alt="Dior Sauvage" 
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Dior Sauvage Eau de Parfum</span>
                    <span className="text-[10px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full font-semibold">
                      Marseille ➔ Alger
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Magasin : Duty Free MRS • Destination : Mohamed T. (Alger)
                  </p>
                  <p className="text-xs font-bold text-emerald-600 mt-1">
                    ✦ Votre gain : +25,00 € (Achat remboursé : 99,00 €)
                  </p>
                </div>
              </div>

              {/* Action buttons on this mission */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  onClick={onOpenUploadProof}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Preuves d'achat</span>
                </button>
                <button
                  onClick={onOpenInspection}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-600" />
                  <span>Contrôle vidéo 15s</span>
                </button>
                <button
                  onClick={onOpenPinModal}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Saisir Code PIN</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Trips & Capacities */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h4 className="font-extrabold text-sm text-slate-900 mb-3">Mes Trajets & Kilos Disponibles</h4>

            <div className="space-y-3">
              <div className="p-4 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Ship className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Marseille (Port) ➔ Alger (Port)</h5>
                    <p className="text-[11px] text-slate-500">Départ le 14 octobre 2026 • Ferry Corsica Linea • Tarif : 60€/kg</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full" style={{ width: '65%' }} />
                    </div>
                    <span className="text-xs font-bold text-slate-800">12 / 18 kg</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">6 kg restants</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
