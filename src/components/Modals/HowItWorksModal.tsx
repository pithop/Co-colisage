import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  ShoppingCart,
  Package,
  Plane,
  FileCheck,
  KeyRound,
  Sparkles,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { PlatformMode } from '../../types';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: PlatformMode;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  mode = 'shop',
}) => {
  const [selectedPillar, setSelectedPillar] = useState<'shop' | 'parcel' | 'traveler'>('shop');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Noble Slate Brand */}
        <header className="relative bg-slate-900 dark:bg-slate-950 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">
                Guide Interactif
              </span>
            </div>
            <h3 className="font-black text-lg text-white">
              Comment fonctionne BagVoyage ?
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              Le protocole de co-bagage &amp; boutique inversée le plus sécurisé au monde
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="p-1.5 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* 3 Pillars Selector */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2">
          {[
            { id: 'shop' as const, label: 'Shop & Go', sub: 'Achats Boutiques', icon: ShoppingCart },
            { id: 'parcel' as const, label: 'Bag & Go', sub: 'Envoi de Colis', icon: Package },
            { id: 'traveler' as const, label: 'Voyageur', sub: 'Monétiser mes kilos', icon: Plane },
          ].map((pill) => {
            const active = selectedPillar === pill.id;
            const Icon = pill.icon;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSelectedPillar(pill.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  active
                    ? 'border-blue-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs ring-1 ring-blue-500/20'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <Icon size={16} className={active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                  <span className="font-bold text-xs">{pill.label}</span>
                </div>
                <p className="text-[10px] opacity-75 truncate">{pill.sub}</p>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 dark:text-slate-200 text-xs leading-relaxed">
          {/* Dynamic 3-Step Timeline based on chosen pillar */}
          {selectedPillar === 'shop' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                  1
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Vous commandez un article précis en boutique
                </h4>
              </div>
              <p className="pl-8 text-slate-600 dark:text-slate-300">
                Vous renseignez le lien ou la référence du produit (parfums, vêtements, high-tech, duty-free). Les fonds du produit + la rémunération du voyageur sont placés en séquestre bancaire Stripe Escrow.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                  2
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Le voyageur achète avec facture officielle
                </h4>
              </div>
              <p className="pl-8 text-slate-600 dark:text-slate-300">
                Le voyageur avance l'achat dans la boutique officielle, téléverse le ticket de caisse certifié avec horodatage et place l'article scellé dans sa valise.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                  3
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Remise en main propre &amp; Code PIN de déblocage
                </h4>
              </div>
              <p className="pl-8 text-slate-600 dark:text-slate-300">
                À l'arrivée (aéroport ou ville de destination), vous inspectez l'article et transmettez votre code PIN secret à 4 chiffres. Le virement bancaire est immédiatement versé au voyageur.
              </p>
            </div>
          )}

          {selectedPillar === 'parcel' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                  1
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Vous décrivez votre colis &amp; son poids
                </h4>
              </div>
              <p className="pl-8 text-slate-600 dark:text-slate-300">
                Vous indiquez le trajet (ex: Paris vers Alger), le poids en kilos, la nature du contenu et la valeur déclarée. L'estimation des frais douaniers est calculée en temps réel.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                  2
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Un voyageur certifié accepte la mission
                </h4>
              </div>
              <p className="pl-8 text-slate-600 dark:text-slate-300">
                Vous confiez le colis lors d'un rendez-vous de départ. Le voyageur vérifie le contenu conformément aux réglementations de sécurité aérienne et douanière.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                  3
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Livraison par code PIN &amp; Séquestre libéré
                </h4>
              </div>
              <p className="pl-8 text-slate-600 dark:text-slate-300">
                Le destinataire final reçoit le colis en main propre, donne le code PIN de validation et la transaction est clôturée avec avis bilatéral certifié.
              </p>
            </div>
          )}

          {selectedPillar === 'traveler' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                  1
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Scannez votre billet d'avion ou publiez votre vol
                </h4>
              </div>
              <p className="pl-8 text-slate-600 dark:text-slate-300">
                Grâce au scanner IATA OCR, votre franchise bagage est calculée automatiquement. Vous définissez le nombre de kilos que vous souhaitez monétiser (ex: 15 kg à 12 €/kg = 180 € de gain net).
              </p>

              <div className="flex items-center gap-2 pt-2">
                <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                  2
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Sélectionnez les missions à forte rentabilité
                </h4>
              </div>
              <p className="pl-8 text-slate-600 dark:text-slate-300">
                Vous recevez des propositions d'acheminement de colis ou d'achats en boutique avec rémunération garantie par séquestre bancaire Stripe.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                  3
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Remettez et encaissez instantanément
                </h4>
              </div>
              <p className="pl-8 text-slate-600 dark:text-slate-300">
                À la remise en main propre, saisissez le code PIN à 4 chiffres du destinataire pour recevoir votre virement instantané directement sur votre compte bancaire.
              </p>
            </div>
          )}

          {/* 3 Core Security Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
              <ShieldCheck size={20} className="text-emerald-500 mb-1.5" />
              <p className="font-bold text-slate-900 dark:text-white text-xs">Séquestre Stripe</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Fonds consignés jusqu'à la remise physique validée.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
              <KeyRound size={20} className="text-blue-600 dark:text-blue-400 mb-1.5" />
              <p className="font-bold text-slate-900 dark:text-white text-xs">Code PIN Unique</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Déblocage physique impossible sans l'accord du destinataire.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
              <FileCheck size={20} className="text-blue-500 mb-1.5" />
              <p className="font-bold text-slate-900 dark:text-white text-xs">Preuves d'Achat</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Tickets de caisse officiels &amp; cartes d'embarquement vérifiées.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <span>J'ai compris, explorer les opportunités</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

