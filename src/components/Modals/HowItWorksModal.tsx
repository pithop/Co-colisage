import React from 'react';
import { X, CheckCircle2, ShieldCheck, ShoppingCart, UserCheck, Plane, FileCheck } from 'lucide-react';
import { PlatformMode } from '../../types';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: PlatformMode;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  mode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <h3 className="font-bold text-sm">Le Concept : La Boutique Inversée & Fret Bag & Go</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs leading-relaxed">
          
          <div>
            <h4 className="font-extrabold text-base text-slate-900 mb-2">
              1. L'Interface Boutique Inversée
            </h4>
            <p>
              Notre plateforme rompt totalement avec les listes de petites annonces classiques. Elle adopte les codes visuels d'un site e-commerce ultra-moderne : le voyageur visualise directement le produit souhaité, le magasin officiel et la marge nette qu'il gagne en l'emportant dans sa valise.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h4 className="font-extrabold text-base text-slate-900">
              2. Protocole de Preuves Obligatoires
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Preuve d'Achat :</strong> Le Shopper achète l'article lui-même avec traçabilité intégrale et téléverse le ticket de caisse à son nom.</span>
              </li>
              <li className="flex items-start gap-2">
                <Plane className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <span><strong>Preuve de Voyage :</strong> Téléversement de la carte d'embarquement officielle pour garantir les dates et le trajet.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <h4 className="font-extrabold text-base text-slate-900">
              3. Sécurité Stripe Connect & Code PIN
            </h4>
            <p>
              L'acheteur paye à la commande (fonds sécurisés sous séquestre). À la remise en main propre, le destinataire transmet un code PIN unique à 4 chiffres qui débloque instantanément les fonds vers le compte bancaire du voyageur.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
          >
            J'ai compris, explorer les offres
          </button>
        </div>
      </div>
    </div>
  );
};
