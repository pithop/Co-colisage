import { Globe2, ShoppingCart } from "lucide-react";
import { ActivePlatform } from "../types/auth";

export function BrandMark({ platform = "voyageur" }: { platform?: ActivePlatform }) {
  if (platform === "shopandgo") {
    return (
      <span className="bagvoyage-brand flex items-center gap-2">
        <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-white flex items-center justify-center shadow-sm shrink-0">
          <ShoppingCart size={18} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <span className="flex flex-col text-left leading-none">
          <span className="font-extrabold tracking-tight text-base text-slate-900 dark:text-white uppercase flex items-center gap-1">
            <span>Shop</span>
            <span className="text-cyan-500">&amp;</span>
            <span>Go</span>
          </span>
          <span className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide mt-0.5">
            Acheter · Livrer
          </span>
        </span>
      </span>
    );
  }

  if (platform === "bagandgo") {
    return (
      <span className="bagvoyage-brand flex items-center gap-2">
        <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 text-white flex items-center justify-center shadow-sm shrink-0">
          <Globe2 size={18} strokeWidth={2.2} aria-hidden="true" />
        </span>
        <span className="flex flex-col text-left leading-none">
          <span className="font-extrabold tracking-tight text-base text-slate-900 dark:text-white uppercase flex items-center gap-1">
            <span>Bag</span>
            <span className="text-cyan-500">&amp;</span>
            <span>Go</span>
          </span>
          <span className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide mt-0.5">
            Récupérer · Expédier
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className="bagvoyage-brand flex items-center gap-2">
      <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-sky-400 text-white flex items-center justify-center shadow-sm shrink-0">
        <Globe2 size={18} strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="flex flex-col text-left leading-none">
        <span className="font-extrabold tracking-tight text-sm sm:text-base text-slate-900 dark:text-white uppercase flex items-center gap-1">
          <span>Bag&amp;Go</span>
          <span className="text-cyan-500">/</span>
          <span>Shop&amp;Go</span>
        </span>
        <span className="text-[9px] sm:text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 tracking-tight mt-0.5">
          Voyagez · Transportez · Achetez · Livrez
        </span>
      </span>
    </span>
  );
}
