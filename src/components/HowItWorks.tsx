import React, { useId, useState } from 'react';
import { ArrowRight, Check, CheckCheck, CreditCard, Fingerprint, LockKeyhole, MapPin, Package, Plane, ShieldCheck, Sparkles } from 'lucide-react';
import { PlatformMode } from '../types';

interface HowItWorksProps {
  mode: PlatformMode;
  onOpenDetails: () => void;
}

const steps = [
  { title: 'Publication ou Détection de Vol', description: 'Le voyageur publie son trajet ou utilise l’arbitrage vol pas cher.', label: 'Un trajet, une opportunité', icon: Plane, detail: 'Indiquez votre destination et la place disponible dans votre valise. Ou découvrez un vol à petit prix et les opportunités de transport associées.', note: 'Votre voyage devient utile.' },
  { title: 'Colis & Achats sous Séquestre', description: 'L’expéditeur ou l’acheteur réserve. Les fonds sont 100 % bloqués et garantis par Stripe.', label: 'La confiance, dès la réservation', icon: LockKeyhole, detail: 'La réservation relie le voyageur à l’expéditeur ou à l’acheteur. Le paiement reste sous séquestre jusqu’à la validation de la remise : chacun sait quand les fonds seront libérés.', note: 'Fonds bloqués jusqu’à la remise.' },
  { title: 'Voyage & Remise en main propre', description: 'L’article voyage dans la valise. La rencontre se fait à l’aéroport ou en ville.', label: 'Un voyage. Une vraie rencontre.', icon: Package, detail: 'Le voyageur transporte l’article dans sa valise. Voyageur et destinataire conviennent ensemble d’un lieu de rendez-vous, à l’aéroport ou en ville, pour une remise directe.', note: 'Un rendez-vous convenu ensemble.' },
  { title: 'Validation par Code PIN & Paiement', description: 'Le destinataire donne son PIN unique à 4 chiffres. Les gains sont virés immédiatement au voyageur.', label: 'Le dernier geste, en toute confiance', icon: Fingerprint, detail: 'Le destinataire vérifie l’article, puis communique son code PIN unique à 4 chiffres au voyageur. Cette confirmation valide la remise et déclenche immédiatement le paiement des gains.', note: 'Le PIN confirme la bonne réception.' },
] as const;

const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4';

function StepIllustration({ step, shopping }: { step: number; shopping: boolean }) {
  return (
    <div aria-hidden="true" className="relative flex min-h-60 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-8">
      <div className="absolute h-56 w-56 rounded-full border border-white/5" />
      <div className="absolute h-80 w-80 rounded-full border border-white/5" />
      <div className="absolute h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
      <div key={step} className="relative w-full max-w-64 rounded-2xl border border-white/15 bg-white/[0.06] p-5 shadow-2xl">
        <div className="mb-6 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          <span>{['Carte d’embarquement', 'Paiement protégé', 'Remise en main propre', 'Confirmation de remise'][step]}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_#6ee7b7]" />
        </div>
        {step === 0 && <>
          <div className="flex items-center justify-between text-white"><span className="text-3xl font-semibold tracking-tight">MRS</span><Plane className="h-5 w-5 text-blue-300" /><span className="text-3xl font-semibold tracking-tight">ALG</span></div>
          <div className="mt-2 flex justify-between text-xs text-slate-400"><span>Marseille</span><span>Alger</span></div>
          <div className="mt-6 flex items-center gap-2 border-t border-dashed border-white/20 pt-4 text-xs text-blue-200"><Sparkles className="h-4 w-4" />Votre valise a du potentiel</div>
        </>}
        {step === 1 && <>
          <div className="flex items-center gap-3"><div className="rounded-xl bg-blue-400/10 p-3"><CreditCard className="h-6 w-6 text-blue-300" /></div><div><p className="text-sm font-semibold text-white">{shopping ? 'Votre achat' : 'Votre colis'}</p><p className="mt-1 text-xs text-slate-400">Réservation sécurisée</p></div></div>
          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 py-3 text-xs font-medium text-emerald-200"><LockKeyhole className="h-4 w-4" />100 % des fonds bloqués</div>
        </>}
        {step === 2 && <>
          <div className="flex items-center justify-center gap-4"><div className="rounded-full border border-white/15 p-3"><Package className="h-6 w-6 text-blue-200" /></div><span className="w-10 border-t border-dashed border-blue-300/50" /><div className="rounded-full border border-emerald-300/30 bg-emerald-400/10 p-3"><MapPin className="h-6 w-6 text-emerald-200" /></div></div>
          <p className="mt-5 text-center text-sm font-medium text-white">À l’aéroport ou en ville</p><p className="mt-2 text-center text-xs text-slate-400">De main en main. Tout simplement.</p>
        </>}
        {step === 3 && <>
          <div className="flex justify-center gap-2">{[0, 1, 2, 3].map(digit => <span key={digit} className="flex h-12 w-11 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-xl text-white">•</span>)}</div>
          <div className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-emerald-200"><CheckCheck className="h-5 w-5" />PIN validé · Gains libérés</div>
        </>}
      </div>
    </div>
  );
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ mode, onOpenDetails }) => {
  const [activeStep, setActiveStep] = useState(0);
  const id = useId();
  const selected = steps[activeStep];

  return (
    <section id="comment-ca-marche" aria-labelledby={`${id}-title`} className="relative isolate overflow-hidden border-y border-slate-200/70 bg-slate-50 px-4 py-16 sm:px-6 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 -z-10 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700"><span className="h-1.5 w-1.5 rounded-full bg-blue-600 shadow-[0_0_10px_#93c5fd]" />Le parcours {mode === 'shop' ? 'Shop&Go' : 'BagVoyage'}</p>
            <h2 id={`${id}-title`} className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">Un voyage. Quatre étapes.<br /><span className="text-slate-500">Tout devient plus simple.</span></h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">Du premier trajet au dernier code PIN, découvrez comment vos {mode === 'shop' ? 'achats' : 'colis'} arrivent entre de bonnes mains.</p>
          </div>
          <button type="button" onClick={onOpenDetails} className={`group inline-flex min-h-12 items-center justify-center gap-3 self-start rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:border-blue-300 hover:text-blue-700 ${focus}`}>
            Le guide complet<ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
          </button>
        </div>

        <ol aria-label="Les quatre étapes du parcours" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const active = activeStep === index;
            return <li key={step.title} className="flex">
              <button type="button" aria-pressed={active} aria-controls={`${id}-detail`} onClick={() => setActiveStep(index)} className={`group relative flex w-full flex-col rounded-2xl border p-6 text-left transition-all duration-300 motion-reduce:transition-none ${focus} ${active ? 'border-blue-300 bg-white shadow-[0_8px_32px_-12px_rgba(37,99,235,0.25)]' : 'border-slate-200 bg-white/60 hover:border-blue-200 hover:bg-white motion-safe:hover:-translate-y-1'}`}>
                <span className="mb-6 flex w-full items-center justify-between"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors ${active ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'border-slate-200 bg-slate-50 text-slate-500'}`}><Icon aria-hidden="true" className="h-5 w-5" /></span><span className={`text-xs font-semibold tabular-nums ${active ? 'text-blue-600' : 'text-slate-400'}`}>0{index + 1}</span></span>
                <span className="text-base font-semibold leading-6 tracking-tight text-slate-950">{step.title}</span>
                <span className="mb-6 mt-3 text-sm leading-6 text-slate-600">{step.description}</span>
                <span className={`mt-auto flex w-full items-center justify-between border-t pt-4 text-xs font-semibold ${active ? 'border-blue-100 text-blue-700' : 'border-slate-100 text-slate-500'}`}>{active ? 'Étape sélectionnée' : 'Explorer cette étape'}<ArrowRight aria-hidden="true" className="h-4 w-4" /></span>
              </button>
            </li>;
          })}
        </ol>

        <div id={`${id}-detail`} className="mt-6 grid gap-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          <StepIllustration step={activeStep} shopping={mode === 'shop'} />
          <div aria-live="polite" aria-atomic="true" className="flex flex-col justify-center py-2 sm:px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">En pratique · Étape 0{activeStep + 1}</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{selected.label}</h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{selected.detail}</p>
            <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-700"><Check aria-hidden="true" className="h-4 w-4 shrink-0" />{selected.note}</p>
          </div>
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs leading-5 text-slate-500"><ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0" />Réservation protégée. Remise en main propre. Validation par PIN.</p>
      </div>
    </section>
  );
};
