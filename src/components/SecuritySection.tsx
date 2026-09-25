import React from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  FileCheck, 
  Plane, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  UserCheck 
} from 'lucide-react';

export const SecuritySection: React.FC = () => {
  return (
    <section id="securite" className="py-14 px-4 sm:px-6 bg-slate-950 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Header with Powered by Stripe */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold mb-3 border border-blue-500/30">
              <Lock className="w-3.5 h-3.5" />
              <span>Garantie Totale & Zéro Fraude</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Confiance & Sécurité
            </h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Votre sécurité et la transparence financière sont nos priorités absolues. Tout repose sur le séquestre bancaire et le contrôle KYC.
            </p>
          </div>

          {/* Stripe Badge */}
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl">
            <span className="text-xs text-slate-400 font-medium">Infrastructure :</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-200">Powered by</span>
              <span className="text-base font-black tracking-tight text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                stripe
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          
          {/* Card 1: KYC */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">KYC obligatoire</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Identité vérifiée pour tous les acteurs (CNI ou Passeport pour particuliers + SIRET/Kbis pour les micro-entreprises).
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Stripe Identity certifié</span>
            </div>
          </div>

          {/* Card 2: Stripe Connect Escrow */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">Paiement sécurisé</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Via Stripe Connect (système de séquestre / Escrow). Les fonds sont bloqués dès la commande et libérés uniquement à la remise.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Fonds 100% cantonnés</span>
            </div>
          </div>

          {/* Card 3: Proof of purchase */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">Preuves d'achat</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Facture et capture d'écran du ticket de caisse obligatoires. Le Shopper achète lui-même en boutique avec traçabilité intégrale.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Contrôle anti-contrefaçon</span>
            </div>
          </div>

          {/* Card 4: Proof of travel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <h4 className="font-bold text-base text-white">Preuve de voyage</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Billet d'avion ou carte d'embarquement vérifiée. Correspondance stricte entre le trajet déclaré et le vol réel du voyageur.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Vols géolocalisés & suivis</span>
            </div>
          </div>

        </div>

        {/* Visual Escrow Flow Diagram */}
        <div className="mt-10 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">
            Circuit Financier & Séquestre Stripe Connect (Pas-à-Pas)
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                1
              </div>
              <p className="font-bold text-xs text-white">Acheteur (Paiement)</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Règlement du total (prix + marge + frais de plateforme)
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                2
              </div>
              <p className="font-bold text-xs text-white">Séquestre Stripe</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Fonds cantonnés et protégés sur Stripe Connect
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                3
              </div>
              <p className="font-bold text-xs text-white">Shopper (Achat & Vol)</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Achat officiel en magasin + upload facture & vol
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                4
              </div>
              <p className="font-bold text-xs text-emerald-300">Code PIN & Payout</p>
              <p className="text-[11px] text-slate-300 mt-1">
                Déblocage instantané vers le compte bancaire du Shopper
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
