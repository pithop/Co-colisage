import React from 'react';
import { Plane, Package, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { PlatformMode } from '../types';

interface FooterProps {
  mode: PlatformMode;
  onOpenHowItWorks: () => void;
  onOpenPublishModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  mode,
  onOpenHowItWorks,
  onOpenPublishModal
}) => {
  return (
    <footer id="footer" className="bg-slate-900 text-white border-t border-slate-800">
      
      {/* Banner Bottom Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-slate-700 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
              Vos envies n'ont plus de frontières
            </h4>
            <p className="text-slate-300 text-sm mt-2">
              Shopping, voyage, économies... tout est possible avec notre communauté internationale.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                onClick={onOpenPublishModal}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Explorer maintenant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenHowItWorks}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all"
              >
                Comment ça marche ?
              </button>
            </div>
          </div>

          <div className="relative z-10 text-center md:text-right">
            <div className="font-handwritten text-3xl sm:text-4xl text-amber-200 font-bold -rotate-3">
              Le monde à portée de main ✈
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Plus de 45 000 voyageurs connectés chaque mois.
            </p>
          </div>
        </div>

        {/* Mega Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-12 pt-8 border-t border-slate-800 text-xs">
          
          {/* Col 1 : Brand & App badges */}
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
                {mode === 'shop' ? <Plane className="w-4 h-4 -rotate-45" /> : <Package className="w-4 h-4" />}
              </div>
              <span className="font-extrabold text-lg text-white">
                Shop&Go <span className="text-blue-400">/ Bag&Go</span>
              </span>
            </div>
            <p className="text-slate-400 mt-3 leading-relaxed max-w-sm">
              Plateforme pionnière de shopping collaboratif et fret de bagages de confiance. Sécurisée par Stripe Connect et vérifiée par Stripe Identity.
            </p>

            {/* Mobile App Download Badges */}
            <div className="flex items-center gap-3 mt-5">
              {/* App Store button */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 cursor-pointer transition-colors">
                <span className="text-base"></span>
                <div className="text-left">
                  <p className="text-[9px] text-slate-400 leading-none">Télécharger sur</p>
                  <p className="text-[11px] font-bold text-white leading-tight">App Store</p>
                </div>
              </div>

              {/* Google Play button */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 cursor-pointer transition-colors">
                <span className="text-base">▶</span>
                <div className="text-left">
                  <p className="text-[9px] text-slate-400 leading-none">DISPONIBLE SUR</p>
                  <p className="text-[11px] font-bold text-white leading-tight">Google Play</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2 : Plateforme */}
          <div>
            <h5 className="font-bold text-slate-200 uppercase tracking-wider mb-3">Navigation</h5>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#hero" className="hover:text-white transition-colors">Accueil</a></li>
              <li><a href="#offres" className="hover:text-white transition-colors">Explorer les offres</a></li>
              <li><a href="#comment-ca-marche" className="hover:text-white transition-colors">Comment ça marche</a></li>
              <li><a href="#securite" className="hover:text-white transition-colors">Sécurité & KYC</a></li>
              <li><button onClick={onOpenPublishModal} className="hover:text-white transition-colors text-left">Publier une annonce</button></li>
            </ul>
          </div>

          {/* Col 3 : Destinations */}
          <div>
            <h5 className="font-bold text-slate-200 uppercase tracking-wider mb-3">Destinations Clés</h5>
            <ul className="space-y-2 text-slate-400">
              <li>Paris (CDG/ORY) ➔ Abidjan (ABJ)</li>
              <li>Paris ➔ Dakar (DSS)</li>
              <li>Lyon ➔ Cotonou (COO)</li>
              <li>Marseille ➔ Alger (ALG)</li>
              <li>Bruxelles ➔ Douala (DLA)</li>
              <li>New York ➔ Paris</li>
            </ul>
          </div>

          {/* Col 4 : Sécurité & Légal */}
          <div>
            <h5 className="font-bold text-slate-200 uppercase tracking-wider mb-3">Sécurité & Garanties</h5>
            <ul className="space-y-2 text-slate-400">
              <li>Stripe Connect Séquestre</li>
              <li>Vérification KYC (Stripe Identity)</li>
              <li>Contrôle de ticket de caisse</li>
              <li>Vérification carte d'embarquement</li>
              <li>Assurance et litiges</li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & legal bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Shop&Go & Bag&Go. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">CGU</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Politique de confidentialité</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Mentions légales</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
