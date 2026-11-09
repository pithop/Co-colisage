import { useId } from "react";
import {
  CheckCircle2,
  Lock,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

interface ShopBudgetVisualizerProps {
  productPrice: number;
  commission: number;
  onPriceChange?: (price: number) => void;
  onCommissionChange?: (commission: number) => void;
}

export function ShopBudgetVisualizer({
  productPrice,
  commission,
  onPriceChange: _onPriceChange,
  onCommissionChange: _onCommissionChange,
}: ShopBudgetVisualizerProps) {
  const id = useId();
  const total = Math.max(0, productPrice + commission);
  const pricePct = total > 0 ? Math.round((productPrice / total) * 100) : 80;
  const commPct = 100 - pricePct;

  return (
    <section className="shop-budget-visualizer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 sm:p-5 shadow-sm overflow-hidden relative">
      <header className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-[#00838f] dark:text-cyan-400 flex items-center justify-center">
            <ShoppingCart size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#00838f] dark:text-cyan-400 uppercase tracking-widest block">
              Simulateur de Panier &amp; Séquestre
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Répartition Transparente du Budget
            </h3>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200/60 dark:border-cyan-800/50 text-[#00838f] dark:text-cyan-300 text-[11px] font-semibold">
          <Sparkles size={12} />
          <span>Calcul Direct</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-3">
        {/* Animated Shopping Cart & Escrow Lock Graphic */}
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
          <svg
            className="w-48 h-36"
            viewBox="0 0 200 150"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`${id}-cartMetal`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00bcd4" />
                <stop offset="100%" stopColor="#00838f" />
              </linearGradient>
              <linearGradient id={`${id}-bag1`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#be185d" />
              </linearGradient>
              <linearGradient id={`${id}-bag2`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id={`${id}-vault`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* Platform Floor */}
            <ellipse cx="100" cy="140" rx="76" ry="8" fill="#00bcd4" opacity="0.15" />

            {/* Shopping Bags in Cart */}
            {/* Bag 1 (Duty Free) */}
            <rect x="70" y="44" width="32" height="38" rx="3" fill={`url(#${id}-bag1)`} />
            <path d="M78 44 C78 34, 94 34, 94 44" fill="none" stroke="#fbcfe8" strokeWidth="2" />
            <circle cx="86" cy="62" r="6" fill="#fdf2f8" opacity="0.3" />

            {/* Bag 2 (Boutique) */}
            <rect x="94" y="38" width="38" height="44" rx="3" fill={`url(#${id}-bag2)`} />
            <path d="M104 38 C104 26, 122 26, 122 38" fill="none" stroke="#fef3c7" strokeWidth="2.5" />
            <rect x="100" y="58" width="26" height="3" rx="1.5" fill="#fef3c7" opacity="0.6" />

            {/* Cart Wireframe */}
            <path
              d="M36 50 h20 l16 46 h64 l14 -36 h-96"
              fill="none"
              stroke={`url(#${id}-cartMetal)`}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Cart Handle */}
            <path d="M36 50 l-8 -12" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            {/* Cart Grid Lines */}
            <line x1="80" y1="60" x2="136" y2="60" stroke="#00bcd4" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.7" />
            <line x1="88" y1="76" x2="130" y2="76" stroke="#00bcd4" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.7" />
            <line x1="90" y1="52" x2="80" y2="94" stroke="#00bcd4" strokeWidth="1.5" opacity="0.5" />
            <line x1="112" y1="52" x2="108" y2="94" stroke="#00bcd4" strokeWidth="1.5" opacity="0.5" />
            <line x1="134" y1="52" x2="128" y2="94" stroke="#00bcd4" strokeWidth="1.5" opacity="0.5" />

            {/* Cart Wheels */}
            <circle cx="80" cy="112" r="9" fill="#0f172a" stroke="#00bcd4" strokeWidth="2" />
            <circle cx="80" cy="112" r="3" fill="#00bcd4" />
            <circle cx="132" cy="112" r="9" fill="#0f172a" stroke="#00bcd4" strokeWidth="2" />
            <circle cx="132" cy="112" r="3" fill="#00bcd4" />

            {/* Floating Escrow Vault Shield */}
            <g transform="translate(142, 24)">
              <circle cx="16" cy="16" r="16" fill={`url(#${id}-vault)`} filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
              <path
                d="M16 8 C11 8 8 11 8 16 C8 24 16 28 16 28 C16 28 24 24 24 16 C24 11 21 8 16 8 Z"
                fill="#ffffff"
                opacity="0.95"
              />
              <path
                d="M13 15 L15.5 17.5 L19 13"
                fill="none"
                stroke="#059669"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>

          {/* Escrow Status Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold mt-1">
            <Lock size={11} />
            <span>Séquestre Stripe activé à 100%</span>
          </div>
        </div>

        {/* Budget Breakdown & Progress Bars */}
        <div className="space-y-3.5">
          {/* Dual Segment Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                <Receipt size={13} className="text-[#00838f] dark:text-cyan-400" />
                Ventilation des fonds
              </span>
              <span className="text-xs font-extrabold text-[#00838f] dark:text-cyan-400">{total} €</span>
            </div>

            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex p-0.5 gap-0.5 border border-slate-200/80 dark:border-slate-700">
              <div
                className="h-full rounded-l-full bg-gradient-to-r from-[#00838f] to-[#00bcd4] transition-all duration-300"
                style={{ width: `${pricePct}%` }}
                title={`Prix Produit : ${productPrice} € (${pricePct}%)`}
              />
              <div
                className="h-full rounded-r-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${commPct}%` }}
                title={`Commission Voyageur : ${commission} € (${commPct}%)`}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] mt-1.5 font-medium">
              <span className="text-[#00838f] dark:text-cyan-300">
                ● Prix boutique : <strong>{productPrice} €</strong> ({pricePct}%)
              </span>
              <span className="text-emerald-700 dark:text-emerald-300">
                ● Commission : <strong>{commission} €</strong> ({commPct}%)
              </span>
            </div>
          </div>

          {/* Total Budget Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase tracking-wide font-medium">
                Budget total estimé
              </span>
              <span className="text-xl font-extrabold text-[#072a4a] dark:text-white tracking-tight">
                {total} €
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#00838f] dark:text-cyan-400 font-semibold block">Déblocage sécurisé</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end font-bold">
                <CheckCircle2 size={12} /> À la remise en main propre
              </span>
            </div>
          </div>

          {/* Guarantee Highlights */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
              <ShieldCheck size={14} className="text-[#00838f] dark:text-cyan-400 shrink-0" />
              <span>Ticket de caisse certifié</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
              <Lock size={14} className="text-[#00838f] dark:text-cyan-400 shrink-0" />
              <span>Remboursement si non livré</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
