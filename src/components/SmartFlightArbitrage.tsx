import React, { useId, useState } from 'react';
import {
  ArrowRight, Check, CheckCircle2, ChevronDown, Gift, LockKeyhole,
  Package, Plane, ShieldCheck, ShoppingBag, Smartphone, Sparkles, TrendingUp,
} from 'lucide-react';
import type { ArbitrageOpportunity } from '../types';

interface SmartFlightArbitrageProps {
  opportunities: ArbitrageOpportunity[];
  onSelectDeal: (opportunity: ArbitrageOpportunity) => void;
}

type Route = {
  id: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  prices: [number, number, number];
  airlines: [string, string, string];
};

// Illustrative inventory: replace with bookable fares and route-specific missions.
const ROUTES: Route[] = [
  { id: 'mrs-alg', origin: 'Marseille', originCode: 'MRS', destination: 'Alger', destinationCode: 'ALG', prices: [65, 49, 79], airlines: ['Air Algérie', 'Vueling', 'Transavia'] },
  { id: 'par-alg', origin: 'Paris', originCode: 'ORY', destination: 'Alger', destinationCode: 'ALG', prices: [89, 59, 75], airlines: ['Air Algérie', 'Transavia', 'Vueling'] },
  { id: 'lys-orn', origin: 'Lyon', originCode: 'LYS', destination: 'Oran', destinationCode: 'ORN', prices: [69, 85, 55], airlines: ['Transavia', 'Air Algérie', 'Transavia'] },
  { id: 'mrs-tun', origin: 'Marseille', originCode: 'MRS', destination: 'Tunis', destinationCode: 'TUN', prices: [45, 62, 79], airlines: ['Transavia', 'Transavia', 'Transavia'] },
  { id: 'tls-cmn', origin: 'Toulouse', originCode: 'TLS', destination: 'Casablanca', destinationCode: 'CMN', prices: [95, 69, 89], airlines: ['Vueling', 'Vueling', 'Vueling'] },
];

const ERRANDS = [
  { id: 'dior', name: '2 Parfums Dior Sauvage', detail: 'Shopping · 2 articles · 0,8 kg', reward: 150, weight: 0.8, Icon: Gift, color: 'bg-violet-400/10 text-violet-300' },
  { id: 'iphone', name: 'iPhone 16 Pro', detail: 'Shopping · 1 article · 0,4 kg', reward: 180, weight: 0.4, Icon: Smartphone, color: 'bg-sky-400/10 text-sky-300' },
  { id: 'parcel', name: 'Colis express 10 kg', detail: 'Transport · colis prêt à emporter', reward: 80, weight: 10, Icon: Package, color: 'bg-amber-400/10 text-amber-300' },
  { id: 'beauty', name: 'Chocolats & Cosmétiques', detail: 'Shopping · 1 lot · 1,5 kg', reward: 75, weight: 1.5, Icon: ShoppingBag, color: 'bg-rose-400/10 text-rose-300' },
];

const DAY_LABELS = ["Aujourd’hui", 'Demain', 'J+2'];
const euro = (amount: number) => `${new Intl.NumberFormat('fr-FR').format(amount)} €`;
const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950';

export const SmartFlightArbitrage: React.FC<SmartFlightArbitrageProps> = ({ opportunities, onSelectDeal }) => {
  const id = useId();
  const [routeId, setRouteId] = useState(ROUTES[0].id);
  const [dayIndex, setDayIndex] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>(['dior']);
  const [today] = useState(() => new Date());
  const route = ROUTES.find(item => item.id === routeId) ?? ROUTES[0];
  const cheapest = Math.min(...route.prices);
  const selectedErrands = ERRANDS.filter(item => selectedIds.includes(item.id));
  const commission = selectedErrands.reduce((sum, item) => sum + item.reward, 0);
  const weight = selectedErrands.reduce((sum, item) => sum + item.weight, 0);
  const price = route.prices[dayIndex];
  const profit = commission - price;
  const coverage = Math.min(100, Math.round(commission / price * 100));
  const dateFor = (offset: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + offset);
    return date;
  };
  const changeRoute = (nextId: string) => {
    const next = ROUTES.find(item => item.id === nextId);
    if (!next) return;
    setRouteId(nextId);
    setDayIndex(next.prices.indexOf(Math.min(...next.prices)));
  };
  const toggleErrand = (errandId: string) => {
    setSelectedIds(current => current.includes(errandId)
      ? current.filter(item => item !== errandId)
      : [...current, errandId]);
  };
  const selectDeal = () => {
    if (!selectedErrands.length) return;
    const source = opportunities.find(item => item.flight.originCode === route.originCode && item.flight.destinationCode === route.destinationCode);
    onSelectDeal({
      id: `simulation-${route.id}-${dayIndex}-${selectedIds.join('-')}`,
      title: `${route.origin} ➔ ${route.destination}`,
      city: route.destination,
      flight: {
        id: `simulation-${route.id}-${dayIndex}`, origin: route.origin, originCode: route.originCode,
        destination: route.destination, destinationCode: route.destinationCode,
        departureDate: dateFor(dayIndex).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        departureTime: 'À confirmer', airline: route.airlines[dayIndex], flightNumber: 'À confirmer',
        flightPrice: price, carrierType: 'avion',
      },
      ordersCount: selectedErrands.length,
      ordersDescription: selectedErrands.map(item => item.name).join(' · '),
      totalOrderReward: commission, netProfit: profit,
      clientName: selectedErrands.length === 1 && source ? source.clientName : 'Clients de la simulation',
      clientAvatar: source?.clientAvatar ?? '',
      escrowSecured: false,
      tag: profit > 0 ? `Vol financé + ${euro(profit)} net` : profit === 0 ? 'Vol financé à 100 %' : `${euro(-profit)} restant à financer`,
    });
  };

  return (
    <section aria-labelledby={`${id}-title`} className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-indigo-300/15 bg-slate-950 text-white shadow-2xl shadow-indigo-950/25">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 -top-48 h-[32rem] w-[32rem] rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <header className="px-5 pb-7 pt-7 sm:px-8 sm:pt-9">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200"><Sparkles aria-hidden="true" className="h-4 w-4" /> Le voyage qui vous rapporte</span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" /> Simulateur interactif</span>
          </div>
          <h2 id={`${id}-title`} className="max-w-2xl text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem]">Votre prochain vol.<br /><span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">Financé par vos courses.</span></h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">Choisissez votre vol, ajoutez des missions. Découvrez ce qu’il vous reste en poche, avant même de faire votre valise.</p>
        </header>

        <div className="grid gap-6 px-5 pb-6 sm:px-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-8">
          <div className="min-w-0 space-y-7">
            <fieldset className="min-w-0">
              <legend className="mb-4 flex items-center gap-3 text-sm font-semibold"><span className="flex h-6 w-6 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-400/10 text-[11px] text-indigo-200">01</span> Trouvez votre prochain départ</legend>
              <label htmlFor={`${id}-route`} className="sr-only">Itinéraire du vol</label>
              <div className="relative">
                <Plane aria-hidden="true" className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-indigo-300" />
                <select id={`${id}-route`} value={routeId} onChange={event => changeRoute(event.target.value)} className={`w-full appearance-none rounded-xl border border-white/15 bg-slate-900 py-4 pl-12 pr-10 text-sm font-semibold text-white ${focus}`}>
                  {ROUTES.map(item => <option key={item.id} value={item.id}>{item.origin} ➔ {item.destination}</option>)}
                </select>
                <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-4 h-5 w-5 text-slate-400" />
              </div>
              <div className="mb-3 mt-4 flex items-center justify-between gap-2 text-[11px] text-slate-400"><span>Départs sur 3 jours</span><span>Tarifs indicatifs · aller simple</span></div>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Date de départ et prix du billet">
                {route.prices.map((fare, index) => {
                  const selected = dayIndex === index;
                  const best = fare === cheapest;
                  return (
                    <button key={index} type="button" aria-pressed={selected} aria-label={`${DAY_LABELS[index]}, ${route.airlines[index]}, ${euro(fare)}${best ? ', meilleur tarif' : ''}`} onClick={() => setDayIndex(index)} className={`relative flex min-w-0 flex-col items-center rounded-xl border px-1 py-3 text-center transition duration-200 motion-reduce:transition-none ${focus} ${selected ? 'border-emerald-400/70 bg-emerald-400/10 shadow-lg shadow-emerald-500/5' : 'border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]'}`}>
                      <span className={`mb-2 h-4 text-[9px] font-bold tracking-wider ${best ? 'text-emerald-300' : 'text-slate-500'}`}>{best ? 'BEST DEAL' : 'VOL SIMULÉ'}</span>
                      <span className="text-xs font-medium text-slate-200">{DAY_LABELS[index]}</span>
                      <span className="mt-1 text-[10px] text-slate-400">{dateFor(index).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                      <span className={`my-2 text-2xl font-semibold tracking-tight tabular-nums ${selected ? 'text-emerald-300' : 'text-white'}`}>{fare}<span className="ml-0.5 text-sm">€</span></span>
                      <span className="text-[10px] text-slate-300">{route.airlines[index]}</span>
                      <span className={`mt-3 flex h-4 w-4 items-center justify-center rounded-full border ${selected ? 'border-emerald-300 bg-emerald-300 text-slate-950' : 'border-slate-600'}`}>{selected && <Check aria-hidden="true" className="h-3 w-3" />}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="min-w-0">
              <legend className="mb-4 flex items-center gap-3 text-sm font-semibold"><span className="flex h-6 w-6 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-400/10 text-[11px] text-indigo-200">02</span> Composez vos missions</legend>
              <div className="mb-3 flex flex-wrap justify-between gap-2 text-[11px] text-slate-400"><span>Exemples de courses vers {route.destination}</span><span>Commissions cumulables</span></div>
              <div className="space-y-2">
                {ERRANDS.map(({ id: errandId, name, detail, reward, Icon, color }) => {
                  const selected = selectedIds.includes(errandId);
                  return (
                    <label key={errandId} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors motion-reduce:transition-none sm:p-3.5 ${selected ? 'border-emerald-400/35 bg-emerald-400/[0.06]' : 'border-white/10 bg-white/[0.025] hover:bg-white/[0.06]'}`}>
                      <span className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl min-[380px]:flex ${color}`}><Icon aria-hidden="true" className="h-5 w-5" /></span>
                      <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-100 sm:text-sm">{name}</span><span className="mt-1 block text-[10px] leading-relaxed text-slate-400">{detail}</span></span>
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-emerald-300">+{reward} €</span>
                      <input type="checkbox" checked={selected} onChange={() => toggleErrand(errandId)} aria-label={`Ajouter ${name}, commission ${reward} euros`} className={`h-4 w-4 shrink-0 cursor-pointer rounded accent-emerald-400 ${focus}`} />
                    </label>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] text-slate-400">{selectedErrands.length} mission{selectedErrands.length !== 1 ? 's' : ''} sélectionnée{selectedErrands.length !== 1 ? 's' : ''} <span aria-hidden="true">·</span> {new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(weight)} kg à transporter</p>
            </fieldset>
          </div>

          <aside aria-label="Bilan de votre voyage" className="flex flex-col self-start overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] shadow-xl backdrop-blur-xl lg:sticky lg:top-6">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Votre voyage, votre gain</span><TrendingUp aria-hidden="true" className="h-4 w-4 text-emerald-300" /></div>
              <div className="mt-5 flex items-center gap-4"><div><p className="text-2xl font-semibold tracking-tight">{route.originCode}</p><p className="mt-1 text-xs text-slate-400">{route.origin}</p></div><div aria-hidden="true" className="flex flex-1 items-center gap-2 text-indigo-300"><span className="h-px flex-1 bg-white/15" /><Plane className="h-5 w-5" /><span className="h-px flex-1 bg-white/15" /></div><div className="text-right"><p className="text-2xl font-semibold tracking-tight">{route.destinationCode}</p><p className="mt-1 text-xs text-slate-400">{route.destination}</p></div></div>
              <p className="mt-4 text-[11px] text-slate-400">{DAY_LABELS[dayIndex]} · {route.airlines[dayIndex]} · Aller simple</p>
            </div>

            <div className="px-5 py-6 sm:px-6">
              <dl className="space-y-4 text-sm"><div className="flex justify-between gap-3"><dt className="text-slate-300">Votre billet d’avion</dt><dd className="font-medium tabular-nums text-rose-300">−{euro(price)}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-300">Vos commissions <span className="text-slate-500">({selectedErrands.length})</span></dt><dd className="font-medium tabular-nums text-emerald-300">+{euro(commission)}</dd></div></dl>
              <div className="my-5 border-t border-dashed border-white/15" />
              <div role="status" aria-live="polite" aria-atomic="true">
                <p className="text-xs font-medium text-slate-300">{profit >= 0 ? 'BÉNÉFICE NET ESTIMÉ' : 'RESTE À FINANCER'}</p>
                <p className={`mt-2 text-5xl font-semibold tracking-tighter tabular-nums sm:text-6xl ${profit >= 0 ? 'text-emerald-300' : 'text-amber-200'}`}>{profit > 0 ? '+' : profit < 0 ? '−' : ''}{Math.abs(profit)}<span className="ml-2 text-3xl font-normal">€</span></p>
                <p className="mt-2 text-sm text-slate-400">{profit > 0 ? 'dans votre poche, billet déduit.' : profit === 0 ? 'Votre billet est entièrement financé.' : 'Ajoutez des missions pour couvrir votre vol.'}</p>
                <div className={`mt-5 flex items-center gap-2 rounded-lg border px-3 py-3 text-[10px] font-bold leading-relaxed tracking-wide ${profit >= 0 ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' : 'border-amber-300/20 bg-amber-300/5 text-amber-200'}`}><Sparkles aria-hidden="true" className="h-4 w-4 shrink-0" />{profit > 0 ? 'VOYAGE 100% GRATUIT & PAYÉ !' : profit === 0 ? 'VOYAGE 100% FINANCÉ !' : 'VOTRE PROCHAIN VOYAGE SE CONSTRUIT'}</div>
              </div>
              <div className="mt-5 flex justify-between text-[11px] text-slate-400"><span>Billet couvert</span><span className="font-semibold text-slate-200">{coverage} %</span></div>
              <div role="progressbar" aria-label="Part du billet financée par les commissions" aria-valuenow={coverage} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"><div style={{ width: `${coverage}%` }} className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-300 transition-[width] duration-500 motion-reduce:transition-none" /></div>
              <button type="button" onClick={selectDeal} disabled={!selectedErrands.length} className={`mt-6 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-emerald-300 px-4 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-400/10 transition duration-200 hover:bg-emerald-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none motion-reduce:transform-none motion-reduce:transition-none ${focus}`}><span>{selectedErrands.length ? 'Choisir ce voyage' : 'Ajoutez une mission'}</span><ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
              <p className="mt-3 text-center text-[10px] text-slate-400">En 1 clic · Consultez le détail avant de confirmer</p>
            </div>
            <div className="border-t border-white/10 bg-slate-950/30 px-5 py-4 sm:px-6"><p className="flex items-center gap-2 text-xs font-semibold text-indigo-200"><ShieldCheck aria-hidden="true" className="h-4 w-4" /> Protection par séquestre Stripe</p><p className="mt-2 text-[11px] leading-relaxed text-slate-400">Parcours prévu : fonds sécurisés avant le départ, commission libérée après validation de la remise.</p></div>
          </aside>
        </div>

        <footer className="border-t border-white/10 bg-slate-950/30 px-5 py-5 sm:px-8">
          <ol aria-label="Les étapes du paiement sécurisé" className="grid gap-4 sm:grid-cols-3">
            {[{ Icon: LockKeyhole, title: '01. Fonds sous séquestre', text: 'L’acheteur sécurise la commission.' }, { Icon: Plane, title: '02. Voyagez sereinement', text: 'Vous transportez les articles convenus.' }, { Icon: CheckCircle2, title: '03. Remettez & encaissez', text: 'La remise validée déclenche le paiement.' }].map(({ Icon, title, text }) => <li key={title} className="flex items-start gap-3"><Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300" /><div><p className="text-[11px] font-semibold text-slate-200">{title}</p><p className="mt-1 text-[10px] leading-relaxed text-slate-400">{text}</p></div></li>)}
          </ol>
          <p className="mt-5 text-[10px] leading-relaxed text-slate-500">Simulation illustrative, sans réservation ni fonds bloqués. Gain = commissions − billet, hors bagages, achats et frais éventuels. Tarifs, missions et conditions de transport à confirmer.</p>
        </footer>
      </div>
    </section>
  );
};
