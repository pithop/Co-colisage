import React, { useState } from 'react';
import { Heart, MapPin, Sparkles, Store, ArrowUpRight, ArrowRight } from 'lucide-react';
import { ProductItem } from '../types';

interface ProductCardProps {
  product: ProductItem;
  onSelect: (product: ProductItem) => void;
}

const retailPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
const reward = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2, signDisplay: 'always' });

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <article className="group relative isolate flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-2 shadow-soft transition-all duration-300 hover:border-slate-300 hover:shadow-elevated motion-safe:hover:-translate-y-1 motion-reduce:transition-none">
      <div className="relative aspect-[5/4] overflow-hidden rounded-[20px] bg-[#f3f1ed]">
        <img src={product.image} alt={`${product.brand} — ${product.name}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.06] motion-reduce:transition-none" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/5" />
        <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-800 backdrop-blur-md">{ /duty\s*free/i.test(product.originStore) ? 'Duty Free' : 'Personal shopping'}</span>
        <button type="button" aria-pressed={isLiked} aria-label={`${isLiked ? 'Retirer des' : 'Ajouter aux'} favoris : ${product.name}`} onClick={() => setIsLiked(value => !value)} className={`absolute right-2 top-2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 shadow-sm backdrop-blur-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-safe:active:scale-90 motion-reduce:transition-none ${isLiked ? 'bg-rose-50 text-rose-600' : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-600'}`}>
          <Heart aria-hidden="true" className={`h-[18px] w-[18px] ${isLiked ? 'fill-current' : ''}`} />
        </button>
        <span className="absolute bottom-3 left-3 right-3 flex w-fit max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full border border-white/25 bg-slate-950/60 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md"><MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-cyan-200" /><span className="break-words">{product.destination}</span></span>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{product.brand}</p>
        <h3 className="mt-2 text-base font-semibold leading-snug tracking-tight text-slate-950">{product.name}</h3>
        <div className="mt-3 flex items-start gap-2 self-start rounded-xl border border-slate-200/80 bg-slate-50 px-2.5 py-2">
          <Store aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
          <div className="min-w-0"><p className="text-[11px] font-medium leading-relaxed text-slate-700">{product.originStore}</p><p className="mt-0.5 text-[10px] text-slate-500">{product.originCity}</p></div>
        </div>

        <div className="mt-auto pt-5">
          <div className="relative flex items-center gap-2 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-100/80 px-3 py-3 shadow-[0_3px_18px_-5px_rgba(16,185,129,0.3)]">
            <span aria-hidden="true" className="absolute -right-3 -top-5 h-16 w-16 rounded-full bg-emerald-300/30 blur-xl" />
            <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-700" />
            <p className="relative flex flex-1 flex-wrap items-baseline justify-between gap-x-1 gap-y-1 text-[11px] font-medium text-emerald-900"><span>Gain net voyageur :</span><span className="text-lg font-bold tracking-tight">{reward.format(product.gain)}</span></p>
          </div>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-2 border-t border-slate-100 pt-4">
            <div><p className="text-[10px] font-medium text-slate-500">Prix boutique officiel</p><p className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{retailPrice.format(product.price)}</p></div>
            <ArrowUpRight aria-hidden="true" className="mb-1 h-4 w-4 text-slate-400" />
          </div>
          <button type="button" onClick={() => onSelect(product)} aria-label={`Voir la mission : ${product.name}`} className="mt-4 flex min-h-11 w-full items-center justify-between gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-semibold text-white transition-colors after:absolute after:inset-0 after:z-10 after:rounded-[28px] hover:bg-blue-700 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-blue-500">
            Voir la mission <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
