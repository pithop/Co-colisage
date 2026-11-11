import React from 'react';
import { 
  X, 
  MapPin, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  Store, 
  CreditCard, 
  ArrowRight,
  Plane
} from 'lucide-react';
import { ProductItem } from '../../types';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAcceptMission: (product: ProductItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAcceptMission,
}) => {
  if (!product) return null;

  // Platform fee calculation (15% approx)
  const platformFee = Number((product.price * 0.12).toFixed(2));
  const totalEscrow = Number((product.price + product.gain + platformFee).toFixed(2));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brand Top Header */}
        <div className="relative bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400 bg-white/10 px-2 py-0.5 rounded-full">
              {product.brand}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <Sparkles size={14} className="text-blue-400" />
              Boutique Inversée
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer"
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Visual & Info Row */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/2 h-64 rounded-2xl overflow-hidden bg-slate-100 relative shadow-inner">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-xs flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Destination : {product.destination}</span>
              </div>
            </div>

            <div className="w-full sm:w-1/2 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {product.name}
                </h3>

                <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>Magasin d'origine : <strong className="text-slate-800 dark:text-slate-100">{product.originStore}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>Livraison souhaitée : <strong className="text-slate-800 dark:text-slate-100">{product.deliveryPeriod}</strong></span>
                  </div>
                  {product.weightEst && (
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span>Poids estimé : <strong className="text-slate-800 dark:text-slate-100">{product.weightEst}</strong></span>
                    </div>
                  )}
                </div>

                {product.officialUrl && (
                  <a 
                    href={product.officialUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold mt-3"
                  >
                    <span>Voir sur la boutique officielle</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Shopper Bounty Pill */}
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                    Rémunération du voyageur
                  </p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    +{product.gain.toFixed(2)} €
                  </p>
                </div>
                <span className="text-[10px] bg-emerald-600 dark:bg-emerald-500 text-white font-bold px-2 py-1 rounded-full">
                  Net d'impôt
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Financial Calculation breakdown (Escrow) */}
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Transparence Financière &amp; Séquestre Stripe</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Prix de l'article en boutique</span>
                <span className="font-semibold text-slate-900 dark:text-white">{product.price.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Marge nette pour le Shopper</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+{product.gain.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Frais de service &amp; assurance transport (Stripe)</span>
                <span className="font-semibold text-slate-900 dark:text-white">+{platformFee.toFixed(2)} €</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Total sécurisé sur le séquestre Stripe</span>
                <span className="text-blue-600 dark:text-blue-400">{totalEscrow.toFixed(2)} €</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                L'acheteur a déjà pré-bloqué ces fonds sur Stripe. Vous êtes certain d'être remboursé et payé dès la livraison.
              </span>
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Fermer
          </button>

          <button
            onClick={() => onAcceptMission(product)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Plane className="w-4 h-4 -rotate-45" />
            <span>Accepter d'acheter et transporter (Shopper)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
