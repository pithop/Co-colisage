import React from 'react';
import { ArrowRight, ArrowUpRight, Headphones, LockKeyhole, Plane, ShieldCheck } from 'lucide-react';
import { PlatformMode } from '../types';

interface FooterProps {
  mode: PlatformMode;
  onOpenHowItWorks: () => void;
  onOpenPublishModal: () => void;
}

const routes = ['Marseille ⇄ Alger', 'Paris ⇄ Alger', 'Lyon ⇄ Oran', 'Marseille ⇄ Tunis'];
const trustBadges = [
  { icon: LockKeyhole, title: 'Stripe Connect Escrow', description: 'Fonds bloqués jusqu’à validation' },
  { icon: ShieldCheck, title: 'Assurance partenaire', description: 'Une protection pour vos envois' },
  { icon: Headphones, title: 'Support 24/7', description: 'À vos côtés, à chaque étape' },
];
const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950';
const linkStyle = `inline-flex min-h-11 items-center rounded-md text-sm text-slate-400 transition-colors hover:text-white ${focus}`;

export const Footer: React.FC<FooterProps> = ({ mode, onOpenHowItWorks, onOpenPublishModal }) => (
  <footer id="footer" className="relative isolate overflow-hidden border-t border-indigo-900/70 bg-slate-950 px-4 pb-24 text-white sm:px-6 sm:pb-8">
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_at_top_right,rgba(49,46,129,0.3),transparent_65%)]" />
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-8 border-b border-white/10 py-12 sm:py-16 lg:flex-row lg:items-center">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">D’une rive à l’autre</p>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Le prochain départ<br /><span className="text-slate-400">rapproche vos envies.</span></h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-400">Une place dans une valise. Un achat qui vous attend.<br className="hidden sm:block" /> Et toute une communauté pour faire le lien.</p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-4">
          <button type="button" onClick={onOpenPublishModal} className={`group inline-flex min-h-12 items-center justify-center gap-6 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_-12px_rgba(165,180,252,0.6)] transition-colors hover:bg-indigo-100 ${focus}`}>Publier une annonce<ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" /></button>
          <button type="button" onClick={onOpenHowItWorks} className={`inline-flex min-h-11 items-center gap-3 rounded-md px-2 text-sm text-slate-300 transition-colors hover:text-white ${focus}`}>Découvrir le fonctionnement<ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
        </div>
      </div>

      <ul aria-label="Confiance et garanties" className="grid gap-3 py-8 md:grid-cols-3">
        {trustBadges.map(({ icon: Icon, title, description }) => <li key={title} className="flex items-center gap-4 rounded-2xl border border-indigo-300/10 bg-white/[0.025] p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-300/15 bg-indigo-400/10 text-indigo-200"><Icon aria-hidden="true" className="h-5 w-5" /></span>
          <div><p className="text-sm font-semibold text-slate-100">{title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{description}</p></div>
        </li>)}
      </ul>

      <div className="grid gap-10 pb-12 pt-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr] lg:gap-16">
        <div className="sm:col-span-2 lg:col-span-1">
          <a href="#hero" aria-label={`${mode === 'shop' ? 'Shop&Go' : 'BagVoyage'} — Accueil`} className={`inline-flex items-center gap-3 rounded-lg ${focus}`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/30 bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg shadow-indigo-950"><Plane aria-hidden="true" className="h-5 w-5" /></span>
            <span className="text-xl font-semibold tracking-tight">{mode === 'shop' ? 'Shop&Go' : 'BagVoyage'}<span className="text-blue-400">.</span></span>
          </a>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">BagVoyage & Shop&Go relient voyageurs, expéditeurs et acheteurs. Des échanges plus simples, de part et d’autre de la Méditerranée.</p>
          <a href="#securite" className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-md text-xs font-medium text-emerald-300 transition-colors hover:text-emerald-200 ${focus}`}><ShieldCheck aria-hidden="true" className="h-4 w-4" />La confiance à chaque étape<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></a>
        </div>
        <nav aria-label="Navigation de pied de page">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">La plateforme</h3>
          <ul className="space-y-1">
            <li><a href="#hero" className={linkStyle}>Accueil</a></li>
            <li><a href="#section-resultats" className={linkStyle}>Explorer les offres</a></li>
            <li><button type="button" onClick={onOpenHowItWorks} className={linkStyle}>Comment ça marche</button></li>
            <li><a href="#securite" className={linkStyle}>Sécurité & garanties</a></li>
            <li><button type="button" onClick={onOpenPublishModal} className={linkStyle}>Publier une annonce</button></li>
          </ul>
        </nav>
        <nav aria-label="Liaisons méditerranéennes">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">La Méditerranée nous relie</h3>
          <ul className="space-y-1">{routes.map(route => <li key={route}><a href="#section-resultats" className={`group flex min-h-12 items-center justify-between gap-4 rounded-md border-b border-white/5 text-sm text-slate-400 transition-colors hover:text-white ${focus}`}><span>{route}</span><ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-indigo-300" /></a></li>)}</ul>
          <p className="mt-4 text-xs leading-5 text-slate-500">Retrouvez les trajets dans nos offres.</p>
        </nav>
      </div>

      <div className="flex flex-col justify-between gap-4 border-t border-indigo-900/50 pt-6 text-xs leading-6 text-slate-400 md:flex-row">
        <p>© {new Date().getFullYear()} BagVoyage & Shop&Go. Tous droits réservés.</p>
        <p className="flex items-start gap-2"><LockKeyhole aria-hidden="true" className="mt-1 h-3.5 w-3.5 shrink-0 text-indigo-300" /><span>Paiements sécurisés par Stripe Connect · Remise validée par PIN.</span></p>
      </div>
    </div>
  </footer>
);
