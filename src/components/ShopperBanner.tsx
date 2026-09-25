import React from 'react';
import { ArrowRight, Plane, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';
import { PlatformMode } from '../types';

interface ShopperBannerProps {
  mode: PlatformMode;
  onOpenPublishModal: () => void;
}

export const ShopperBanner: React.FC<ShopperBannerProps> = ({
  mode,
  onOpenPublishModal,
}) => {
  return (
    <section className="py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-sky-700 shadow-xl text-white p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />

          {/* Left Text */}
          <div className="relative z-10 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white mb-4">
              <Briefcase className="w-3.5 h-3.5 text-cyan-200" />
              <span>Vous êtes voyageur ?</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {mode === 'shop' 
                ? 'Emportez des articles, gagnez de l\'argent !' 
                : 'Rentabilisez votre espace bagage disponible !'}
            </h3>

            <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
              {mode === 'shop'
                ? 'Devenez Shopper et transportez des articles pour les autres. Rentabilisez votre valise et couvrez vos frais de billet en toute légalité.'
                : 'Proposez vos kilos libres dans votre coffre ou bagage soute. Paiement garanti par le séquestre Stripe dès la livraison.'}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenPublishModal}
                className="px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 active:scale-95 font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <span>{mode === 'shop' ? 'Devenir Shopper' : 'Devenir transporteur'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Validation KYC rapide en 3 min</span>
              </div>
            </div>
          </div>

          {/* Right Visual Suitcase & Boarding Pass simulation */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-72 sm:w-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-slate-900 group">
              <img 
                src="https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=600&q=80" 
                alt="Valise de voyage et billets d'avion" 
                className="w-full h-52 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              {/* Boarding pass mock tag */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 p-2.5 rounded-xl shadow-md text-xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Carte d'embarquement</p>
                  <p className="font-bold text-slate-800">PARIS CDG ➔ ABIDJAN</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    +150€ de gains
                  </span>
                </div>
              </div>
            </div>

            {/* Handwritten note with arrow */}
            <div className="mt-3 font-handwritten text-2xl text-amber-200 font-bold -rotate-2">
              Votre voyage peut rapporter plus ! ✈
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
