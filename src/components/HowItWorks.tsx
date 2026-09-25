import React from 'react';
import { ShoppingCart, UserCheck, Plane, ShieldCheck, ArrowRight } from 'lucide-react';
import { PlatformMode } from '../types';

interface HowItWorksProps {
  mode: PlatformMode;
  onOpenDetails: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  mode,
  onOpenDetails,
}) => {
  const steps = mode === 'shop' ? [
    {
      num: '1',
      title: 'Vous achetez',
      subtitle: 'Vous sélectionnez l\'article et la destination.',
      icon: <ShoppingCart className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      num: '2',
      title: 'Un voyageur accepte',
      subtitle: 'Il achète l\'article officiel et prépare son voyage.',
      icon: <UserCheck className="w-5 h-5 text-cyan-600" />,
      bg: 'bg-cyan-50',
    },
    {
      num: '3',
      title: 'L\'article voyage',
      subtitle: 'Le colis est remis au voyageur et suivi en temps réel.',
      icon: <Plane className="w-5 h-5 text-indigo-600 -rotate-45" />,
      bg: 'bg-indigo-50',
    },
    {
      num: '4',
      title: 'Vous recevez',
      subtitle: 'Vous êtes livré en toute sécurité et validez avec code PIN.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
  ] : [
    {
      num: '1',
      title: 'Publication du trajet',
      subtitle: 'Le voyageur indique son itinéraire et ses kilos libres.',
      icon: <Plane className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      num: '2',
      title: 'Réservation sécurisée',
      subtitle: 'L\'expéditeur réserve et les fonds sont bloqués sur Stripe.',
      icon: <ShoppingCart className="w-5 h-5 text-cyan-600" />,
      bg: 'bg-cyan-50',
    },
    {
      num: '3',
      title: 'Contrôle & départ',
      subtitle: 'Inspection visuelle et photo du colis avant l\'embarquement.',
      icon: <UserCheck className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
    },
    {
      num: '4',
      title: 'Code PIN & libération',
      subtitle: 'Le destinataire fournit le PIN unique pour payer le voyageur.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <section id="comment-ca-marche" className="py-12 px-4 sm:px-6 bg-slate-50/60 border-y border-slate-200/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-2">
              Simple et rapide
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Comment ça marche ?
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              En 4 étapes claires, vos achats voyagent avec vous en toute sérénité.
            </p>
          </div>

          <button
            onClick={onOpenDetails}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs hover:shadow"
          >
            <span>Voir le détail pédagogique</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((st) => (
            <div 
              key={st.num}
              className="relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${st.bg} flex items-center justify-center font-bold`}>
                    {st.icon}
                  </div>
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    {st.num}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                  {st.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {st.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
                <span>Étape {st.num}/4</span>
                <span className="text-emerald-600 font-semibold">100% garanti</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
