import React from 'react';
import { Package, Calendar, Weight, ArrowRight, ShieldCheck, BadgeCheck } from 'lucide-react';
import { SenderParcelRequest } from '../types';

interface SenderParcelCardProps {
  request: SenderParcelRequest;
  onAccept: (request: SenderParcelRequest) => void;
}

const cityCode = (city: string) => {
  const normalized = city.trim().toLowerCase();
  if (normalized.startsWith('marseille')) return 'MRS';
  if (normalized.startsWith('alger')) return 'ALG';
  return city;
};

export const SenderParcelCard: React.FC<SenderParcelCardProps> = ({ request, onAccept }) => (
  <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft transition duration-300 hover:border-amber-300 hover:shadow-elevated motion-safe:hover:-translate-y-1 motion-reduce:transition-none">
    <div className="flex-1 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex max-w-[65%] items-center gap-1.5 rounded-lg border border-amber-200/70 bg-amber-50 px-2.5 py-1.5 text-[10px] font-semibold text-amber-800">
          <Package className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{request.category}
        </span>
        <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600"><Weight className="h-3.5 w-3.5" aria-hidden="true" />{request.weightKg} kg</span>
      </div>

      <div className="my-6 flex items-center gap-4" aria-label={`Trajet de ${request.origin} vers ${request.destination}`}>
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">Départ</p>
          <p className="break-words text-3xl font-semibold tracking-tight text-slate-900">{cityCode(request.origin)}</p>
          <p className="mt-1 break-words text-xs text-slate-500">{request.origin}</p>
        </div>
        <div className="flex w-16 shrink-0 items-center gap-1 text-slate-400" aria-hidden="true"><span className="h-1.5 w-1.5 rounded-full border border-slate-300" /><span className="flex-1 border-t border-dashed border-slate-300" /><ArrowRight className="h-4 w-4" /></div>
        <div className="min-w-0 flex-1 text-right">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">Arrivée</p>
          <p className="break-words text-3xl font-semibold tracking-tight text-slate-900">{cityCode(request.destination)}</p>
          <p className="mt-1 break-words text-xs text-slate-500">{request.destination}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 border-y border-slate-100 py-3 text-xs text-slate-600"><Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />{request.dateDesired}</div>
      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600">{request.itemDescription}</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="relative shrink-0"><img src={request.senderAvatar} alt="" loading="lazy" className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 ring-offset-2" /><BadgeCheck className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white text-blue-600" aria-hidden="true" /></div>
        <div className="min-w-0"><h3 className="truncate text-xs font-semibold text-slate-900">{request.senderName}</h3><p className="mt-0.5 text-[10px] text-slate-500">Expéditeur vérifié</p></div>
      </div>
    </div>
    <div className="relative border-t border-dashed border-slate-300 bg-gradient-to-br from-amber-50/80 to-white p-5 sm:p-6">
      <span aria-hidden="true" className="absolute -left-2 -top-2 h-4 w-4 rounded-full border border-slate-200 bg-slate-50" /><span aria-hidden="true" className="absolute -right-2 -top-2 h-4 w-4 rounded-full border border-slate-200 bg-slate-50" />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-[10px] font-medium text-amber-800">Votre récompense</p><p className="mt-1 text-3xl font-semibold tracking-tight text-amber-700">+{request.budgetOffer} <span className="text-xl">€</span></p></div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-white/80 px-2.5 py-1.5 text-[10px] font-medium text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />Paiement garanti PIN</span>
      </div>
      <button type="button" onClick={() => onAccept(request)} className="flex min-h-11 w-full items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-sm transition duration-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 motion-safe:active:scale-[0.98] motion-reduce:transition-none">Prendre ce colis<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
    </div>
  </article>
);
