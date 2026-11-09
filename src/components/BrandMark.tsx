import { ActivePlatform } from "../types/auth";

function GlobePlaneIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="22" cy="24" r="14" stroke="#00d2d3" strokeWidth="2.5" fill="#00d2d3" fillOpacity="0.15" />
      <ellipse cx="22" cy="24" rx="7" ry="14" stroke="#00d2d3" strokeWidth="2" strokeDasharray="3 2" />
      <line x1="8" y1="24" x2="36" y2="24" stroke="#00d2d3" strokeWidth="2" />
      <path d="M10 32 C 16 38, 30 38, 38 28 C 42 22, 40 14, 34 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 12 L35 15 L32 14 L30 16 L33 17 L31 20 L33 21 L36 18 L39 19 L40 18 L38 15 L41 13 Z" fill="#ffffff" />
    </svg>
  );
}

function CartSpeedIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <line x1="6" y1="18" x2="16" y2="18" stroke="#00d2d3" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="8" y1="24" x2="18" y2="24" stroke="#00d2d3" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10" y1="30" x2="16" y2="30" stroke="#00d2d3" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 16 h6 l4 14 h14 l3 -11 h-23" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="28" cy="36" r="2.5" fill="#00d2d3" />
      <circle cx="39" cy="36" r="2.5" fill="#00d2d3" />
    </svg>
  );
}

export function BrandMark({ platform = "voyageur" }: { platform?: ActivePlatform }) {
  if (platform === "shopandgo") {
    return (
      <span className="bagvoyage-brand flex items-center gap-2.5">
        <CartSpeedIcon className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 drop-shadow-sm" />
        <span className="flex flex-col text-left leading-none">
          <span className="font-black tracking-tight text-base sm:text-lg text-white uppercase flex items-center gap-0.5">
            <span>SHOP</span>
            <span className="text-[#00d2d3]">&amp;GO</span>
          </span>
          <span className="text-[9.5px] font-medium text-white/90 tracking-wide mt-1">
            Acheter · Livrer
          </span>
        </span>
      </span>
    );
  }

  if (platform === "bagandgo") {
    return (
      <span className="bagvoyage-brand flex items-center gap-2.5">
        <GlobePlaneIcon className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 drop-shadow-sm" />
        <span className="flex flex-col text-left leading-none">
          <span className="font-black tracking-tight text-base sm:text-lg text-white uppercase flex items-center gap-0.5">
            <span>BAG</span>
            <span className="text-[#00d2d3]">&amp;GO</span>
          </span>
          <span className="text-[9.5px] font-medium text-white/90 tracking-wide mt-1">
            Récupérer · Expédier
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className="bagvoyage-brand flex items-center gap-2.5">
      <GlobePlaneIcon className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 drop-shadow-sm" />
      <span className="flex flex-col text-left leading-none">
        <span className="font-black tracking-tight text-sm sm:text-base text-white uppercase flex items-center gap-1.5">
          <span>BAG&amp;GO</span>
          <span className="text-[#00d2d3]">SHOP&amp;GO</span>
        </span>
        <span className="text-[9px] sm:text-[9.5px] font-medium text-white/90 tracking-tight mt-1">
          Voyagez · Transportez · Achetez · Livrez
        </span>
      </span>
    </span>
  );
}
