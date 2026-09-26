import React, { useState } from 'react';
import { Plane, Car, Ship, Truck, Star, Heart, BadgeCheck, Clock, CalendarDays, Package, ShoppingBag, ArrowRight, Luggage } from 'lucide-react';
import { FreightItem } from '../types';

interface FreightCardProps {
  item: FreightItem;
  onSelect: (item: FreightItem) => void;
}

const money = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });

export const FreightCard: React.FC<FreightCardProps> = ({ item, onSelect }) => {
  const [isLiked, setIsLiked] = useState(false);
  const TransportIcon = item.transportType === 'voiture' ? Car : item.transportType === 'bateau' ? Ship : item.transportType === 'camion' ? Truck : Plane;
  const airline = `${item.transportLabel} ${item.title} ${item.description}`.match(/Air Algérie|Vueling|Air France|Transavia|EasyJet|Ryanair/i)?.[0];
  const transportLabel = item.transportType === 'avion' ? airline ?? (item.transportLabel === 'Avion' ? 'Vol' : item.transportLabel) : item.transportLabel;
  const availableKg = Math.max(0, item.availableKg);
  // Each suitcase represents 5 kg, rather than an invented total baggage allowance.
  const suitcaseCount = Math.min(5, Math.max(1, Math.ceil(availableKg / 5)));

  return (
    <article className="group relative isolate flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-soft transition-all duration-300 hover:border-slate-300 hover:shadow-elevated motion-safe:hover:-translate-y-1 motion-reduce:transition-none">
      <div className="relative overflow-hidden bg-slate-950 px-5 pb-5 pt-4 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative flex min-h-11 items-center justify-between gap-3">
          <span className="inline-flex min-w-0 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold">
            <TransportIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
            <span className="break-words">{transportLabel}</span>
          </span>
          <button type="button" aria-pressed={isLiked} aria-label={`${isLiked ? 'Retirer des' : 'Ajouter aux'} favoris : ${item.title}`} onClick={() => setIsLiked(value => !value)} className={`relative z-20 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 motion-safe:active:scale-95 ${isLiked ? 'bg-rose-400/20 text-rose-300' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <Heart aria-hidden="true" className={`h-[18px] w-[18px] ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="relative mt-5 grid grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] items-center gap-2">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">Départ</p>
            <p className="mt-1 break-words text-4xl font-semibold tracking-tighter">{item.originCode}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">{item.origin}</p>
          </div>
          <div aria-hidden="true" className="flex items-center gap-1 text-cyan-300"><span className="h-px flex-1 bg-white/20" /><ArrowRight className="h-5 w-5" /><span className="h-px flex-1 bg-white/20" /></div>
          <div className="text-right">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">Arrivée</p>
            <p className="mt-1 break-words text-4xl font-semibold tracking-tighter">{item.destinationCode}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">{item.destination}</p>
          </div>
        </div>

        <div className="relative mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-white/10 pt-4 text-xs">
          <span className="flex items-center gap-2 font-medium"><CalendarDays aria-hidden="true" className="h-4 w-4 text-cyan-300" />{item.departureDate}</span>
          <span className="flex items-center gap-1.5 tabular-nums text-slate-300"><Clock aria-hidden="true" className="h-3.5 w-3.5" />{item.departureTime?.replace(':', ' h ') ?? 'Horaire à confirmer'}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-5">
        <h3 className="text-sm font-semibold leading-relaxed text-slate-900">{item.title}</h3>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
          <div><p className="text-sm font-semibold text-slate-900">{availableKg.toLocaleString('fr-FR')} kg disponibles</p><p className="mt-0.5 text-[10px] text-slate-500">Une valise = 5 kg</p></div>
          <div aria-hidden="true" className="flex gap-1">
            {Array.from({ length: suitcaseCount }, (_, index) => (
              <span key={index} className="relative text-slate-300">
                <Luggage className="h-7 w-5" />
                <span className="absolute inset-x-0 bottom-0 overflow-hidden text-teal-600" style={{ height: `${Math.min(1, Math.max(0, (availableKg - index * 5) / 5)) * 100}%` }}><Luggage className="absolute bottom-0 h-7 w-5" /></span>
              </span>
            ))}
            {availableKg > 25 && <span className="self-center text-xs font-semibold text-teal-700">+</span>}
          </div>
        </div>

        <div className="my-4 space-y-2">
          <div className={`flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-xs ${item.canCarryParcel ? 'bg-blue-50/80 text-blue-900' : 'bg-slate-50 text-slate-500'}`}>
            <Package aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /><div className="flex flex-1 flex-wrap justify-between gap-x-2 gap-y-1"><span className="font-medium">Transporter colis</span><span className="font-semibold">{item.canCarryParcel ? `${money.format(item.pricePerKg)}/kg` : 'Non proposé'}</span></div>
          </div>
          <div className={`flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-xs ${item.canBuyProduct ? 'bg-emerald-50/80 text-emerald-900' : 'bg-slate-50 text-slate-500'}`}>
            <ShoppingBag aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="font-medium">Acheter en Duty Free / Boutique</p><p className="mt-1 text-[11px]">{item.canBuyProduct ? item.shoppingCommission != null ? `Commission : +${money.format(item.shoppingCommission)}` : 'Commission à convenir' : 'Non proposé'}</p></div>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-3 pb-5">
          <div className="relative shrink-0">
            <img src={item.travelerAvatar} alt="" loading="lazy" className="h-10 w-10 rounded-full bg-slate-100 object-cover ring-2 ring-white" />
            {item.isIdentityVerified && <BadgeCheck aria-hidden="true" className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white text-blue-600" />}
          </div>
          <div className="min-w-0"><p className="break-words text-xs font-semibold text-slate-900">{item.travelerName}</p><div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-slate-500"><Star aria-hidden="true" className="h-3 w-3 fill-amber-400 text-amber-500" /><span className="font-semibold text-slate-800">{item.rating.toFixed(1)}<span className="sr-only"> sur 5</span></span><span>· {item.completedTrips != null ? `${item.completedTrips} voyages effectués` : `${item.reviewsCount} avis`}</span></div>{item.isIdentityVerified && <p className="mt-1 text-[10px] font-medium text-blue-700">Identité vérifiée</p>}</div>
        </div>
      </div>

      <div aria-hidden="true" className="relative border-t border-dashed border-slate-200">
        <span aria-hidden="true" className="absolute -left-2 -top-2 h-4 w-4 rounded-full border border-slate-200 bg-slate-50" /><span aria-hidden="true" className="absolute -right-2 -top-2 h-4 w-4 rounded-full border border-slate-200 bg-slate-50" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 px-5 py-4">
        <div><p className="text-[10px] font-medium text-slate-500">Transport de colis</p><p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-950">{money.format(item.pricePerKg)}<span className="ml-1 text-xs font-normal tracking-normal text-slate-500">/ kg</span></p></div>
        <button type="button" onClick={() => onSelect(item)} aria-label={`Réserver : ${item.title}`} className="flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-semibold text-white transition-colors after:absolute after:inset-0 after:z-10 after:rounded-[28px] hover:bg-blue-700 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-blue-500">
          Réserver <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
};
