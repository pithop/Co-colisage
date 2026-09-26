import React from 'react';
import { Store, MapPin, Sparkles, ArrowRight, LockKeyhole } from 'lucide-react';
import { ReceiverShoppingRequest } from '../types';

interface ReceiverShoppingCardProps {
  request: ReceiverShoppingRequest;
  onAccept: (request: ReceiverShoppingRequest) => void;
}

export const ReceiverShoppingCard: React.FC<ReceiverShoppingCardProps> = ({ request, onAccept }) => (
  <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft transition duration-300 hover:border-emerald-200 hover:shadow-elevated motion-safe:hover:-translate-y-1 motion-reduce:transition-none">
    <div className="relative m-3 mb-0 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-emerald-50/60 p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-white bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 shadow-sm"><Store className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" /><span className="truncate">{request.storeName}</span></span>
        <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
      </div>
      <div className="mx-auto mt-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-white p-3 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/5">
        <img src={request.image} alt={request.productName} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 motion-safe:group-hover:scale-105 motion-reduce:transition-none" />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">Personal shopping</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold tabular-nums text-emerald-800 shadow-[0_0_18px_rgba(16,185,129,0.12)]" aria-label={`Commission : ${request.offeredCommission} euros`}>+{request.offeredCommission} €</span>
      </div>
    </div>
    <div className="flex flex-1 flex-col p-5 sm:p-6">
      <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-slate-900">{request.productName}</h3>
      <p className="mt-2 text-xs text-slate-500">Pour <span className="font-medium text-slate-700">{request.receiverName}</span></p>
      <div className="mb-5 mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
        <div className="min-w-0"><p className="mb-1 text-[10px] text-slate-500">Livraison à</p><p className="flex items-center gap-1 text-xs font-semibold text-slate-800"><MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />{request.city}</p></div>
        <div className="text-right"><p className="mb-1 text-[10px] text-slate-500">Prix magasin</p><p className="text-xs font-semibold tabular-nums text-slate-800">{request.estimatedPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p></div>
      </div>
      <div className="mt-auto">
        <p className="mb-4 flex items-center justify-center gap-1.5 text-[10px] font-medium text-emerald-700"><LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />Fonds bloqués · Séquestre garanti</p>
        <button type="button" onClick={() => onAccept(request)} className="flex min-h-11 w-full items-center justify-between rounded-xl bg-emerald-700 px-4 py-3 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(5,150,105,0.16)] transition duration-200 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 motion-safe:active:scale-[0.98] motion-reduce:transition-none">Acheter & rapporter<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
      </div>
    </div>
  </article>
);
