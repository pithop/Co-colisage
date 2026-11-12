import React from "react";
import { ActivePlatform } from "../types/auth";
import { Package, Plane, ShoppingBag } from "lucide-react";

export function BrandMark({ platform = "voyageur" }: { platform?: ActivePlatform }) {
  const getPlatformDetails = () => {
    switch (platform) {
      case "shopandgo":
        return {
          tag: "SHOP & GO",
          sub: "Concierge & Achats Officiels",
          accentDot: "bg-blue-600 dark:bg-blue-400",
          badgeBg: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60",
          icon: ShoppingBag,
        };
      case "bagandgo":
        return {
          tag: "BAG & GO",
          sub: "Expédition Fret Aérien OACI",
          accentDot: "bg-emerald-500",
          badgeBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60",
          icon: Package,
        };
      case "voyageur":
      default:
        return {
          tag: "VOYAGEUR",
          sub: "Fret Collaboratif & Séquestre Stripe",
          accentDot: "bg-blue-600 dark:bg-blue-400",
          badgeBg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
          icon: Plane,
        };
    }
  };

  const details = getPlatformDetails();
  const Icon = details.icon;

  return (
    <div className="bagvoyage-brand flex items-center gap-2.5 sm:gap-3 select-none">
      {/* Luxury FinTech aeronautical insignia */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-950 flex items-center justify-center shadow-md shadow-blue-900/20 border border-blue-400/20 shrink-0">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="w-5 h-5 text-white"
          aria-hidden="true"
        >
          <path
            d="M5 16.5C5 16.5 10 11.5 16 11.5C22 11.5 27 16.5 27 16.5C27 16.5 22 21.5 16 21.5C10 21.5 5 16.5 5 16.5Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="16.5" r="3" fill="currentColor" />
          <path
            d="M16 6.5V11.5M16 21.5V26.5M8 9.5L11.5 12.5M20.5 20.5L24 23.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${details.accentDot} border-2 border-white dark:border-slate-900`}
        />
      </div>

      {/* High-end typography */}
      <div className="flex flex-col text-left leading-none">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold tracking-tight text-base sm:text-lg text-slate-900 dark:text-white">
            BagVoyage
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-black text-lg leading-none">.</span>
          <span className={`hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${details.badgeBg}`}>
            <Icon size={10} />
            {details.tag}
          </span>
        </div>
        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-tight mt-1">
          {details.sub}
        </span>
      </div>
    </div>
  );
}
