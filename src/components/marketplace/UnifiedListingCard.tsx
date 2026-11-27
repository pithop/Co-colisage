import React from "react";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Package,
  Plane,
  ShieldCheck,
  ShoppingBag,
  Star,
} from "lucide-react";
import { PurchaseRequest, Trip, dateLabel } from "../../data/marketplace";
import { ActivePlatform } from "../../types/auth";
import { Avatar } from "./Avatar";

export const QUICK_CORRIDORS = [
  { label: "Paris → Alger", from: "Paris", to: "Alger" },
  { label: "Marseille → Oran", from: "Marseille", to: "Oran" },
  { label: "Lyon → Constantine", from: "Lyon", to: "Constantine" },
  { label: "Paris → Casablanca", from: "Paris", to: "Casablanca" },
] as const;

/**
 * Strips any regulatory/technical jargon (OACI, eIDAS, LTA, CMR, STEB) from public card labels.
 */
export function stripTechnicalJargon(text?: string): string {
  if (!text) return "";
  return text
    .replace(/\b(OACI|ICAO|eIDAS|LTA|CMR|STEB)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/[·•\-]\s*$/g, "")
    .trim();
}

export interface UnifiedListingCardProps {
  trip?: Trip;
  request?: PurchaseRequest;
  capacityUnit?: string;
  ctaLabel?: string;
  onSelect?: () => void;
}

/**
 * UnifiedListingCard shared across Explorer, BagAndGo, Voyageur, and ShopAndGo.
 * Strictly limited to 4 visible information blocks:
 * 1. Trajet + Date
 * 2. Prix/kg ou Gain net (in tabular-nums)
 * 3. Avatar + Note vérifiée
 * 4. Un seul badge de statut maximum
 */
export const UnifiedListingCard: React.FC<UnifiedListingCardProps> = ({
  trip,
  request,
  capacityUnit = "kg",
  ctaLabel,
  onSelect,
}) => {
  if (trip) {
    const cleanOrigin = stripTechnicalJargon(trip.origin);
    const cleanDestination = stripTechnicalJargon(trip.destination);
    const cleanName =
      stripTechnicalJargon(trip.travelerName || trip.title?.split("(")[0]) ||
      "Voyageur vérifié";
    const unitPrice = trip.startingPrice ?? trip.pricePerKg ?? 12;
    const ratingVal = (trip.rating ?? 4.9).toFixed(1);
    const singleBadge = trip.availableKg
      ? `${trip.availableKg} ${capacityUnit} disponibles`
      : "Trajet vérifié";

    return (
      <article
        onClick={onSelect}
        className="unified-listing-card group bg-[#FFFFFF] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:border-[#2563EB]/40 dark:hover:border-blue-500/40 hover:shadow-md cursor-pointer flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5"
      >
        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
          {/* 3. Avatar + Badge Vérifié */}
          <div className="relative shrink-0">
            <Avatar name={cleanName} src={trip.travelerAvatar} />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#059669] border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-2xs"
              aria-hidden="true"
            >
              <ShieldCheck size={9} className="text-white" />
            </span>
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            {/* Boarding-Pass Visual Route Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 m-0 text-sm sm:text-base tracking-tight">
                <span>{cleanOrigin}</span>
                <span className="inline-flex items-center gap-0.5 text-[#2563EB] shrink-0" aria-hidden="true">
                  <span className="w-2 h-[1.5px] bg-blue-300 dark:bg-blue-700 rounded-full" />
                  <Plane size={13} className="rotate-45" />
                  <span className="w-2 h-[1.5px] bg-blue-300 dark:bg-blue-700 rounded-full" />
                </span>
                <span>{cleanDestination}</span>
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 tabular-nums whitespace-nowrap">
                <Calendar size={11} className="text-slate-400 shrink-0" />
                <span>{dateLabel(trip.departureDate)}</span>
              </span>
            </div>

            {/* Meta Row: Traveler + Rating + Capacity */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                {cleanName}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                <Star
                  size={11}
                  className="text-amber-500 fill-amber-500 shrink-0"
                />
                <span className="text-slate-700 dark:text-slate-200">{ratingVal}</span>
                <span className="text-[#059669]">· Vérifié</span>
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400 border border-[#059669]/20 tabular-nums whitespace-nowrap">
                {singleBadge}
              </span>
            </div>
          </div>
        </div>

        {/* Price + Action */}
        <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <div className="text-left sm:text-right">
            <strong className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums whitespace-nowrap">
              {unitPrice} €
            </strong>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 ml-0.5">
              / {capacityUnit}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-2xs group-hover:shadow-sm whitespace-nowrap cursor-pointer"
          >
            <span>{ctaLabel || "Voir le trajet"}</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </article>
    );
  }

  if (request) {
    const isParcel = request.kind === "parcel";
    const cleanOrigin = stripTechnicalJargon(request.origin || "Paris");
    const cleanDestination = stripTechnicalJargon(
      request.destination || request.location || "Alger",
    );
    const cleanBuyer =
      stripTechnicalJargon(request.buyer) || "Membre vérifié";
    const cleanTitle = stripTechnicalJargon(request.title);
    const netGain = request.reward || 35;
    const singleBadge = isParcel
      ? request.weightKg
        ? `Colis · ${request.weightKg} kg`
        : "Colis vérifié"
      : "Shop & Go";
    const thumbSrc =
      request.image ||
      (isParcel ? "/images/scene-handover-people.jpg" : "/images/perfume.jpg");

    return (
      <article
        onClick={onSelect}
        className="unified-listing-card group bg-[#FFFFFF] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 transition-all duration-200 hover:border-[#2563EB]/40 dark:hover:border-blue-500/40 hover:shadow-md cursor-pointer flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5"
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          {/* Visual Product / Parcel Thumbnail */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shrink-0">
            <img
              src={thumbSrc}
              alt={cleanTitle || `${cleanOrigin} - ${cleanDestination}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-slate-950/75 backdrop-blur-xs text-[9px] font-bold text-white leading-none">
              {singleBadge}
            </span>
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            {cleanTitle && (
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-[15px] leading-snug truncate m-0 group-hover:text-[#2563EB] transition-colors">
                {cleanTitle}
              </h3>
            )}

            {/* Trajet + Date */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1">
                <span>{cleanOrigin}</span>
                <ArrowRight size={12} className="text-[#2563EB] shrink-0" />
                <span>{cleanDestination}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                <Calendar size={11} className="text-slate-400 shrink-0" />
                <span>{dateLabel(request.date)}</span>
              </span>
            </div>

            {/* Verified Member Row */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200 dark:ring-slate-700">
                <Avatar name={cleanBuyer} src={request.buyerAvatar} />
              </div>
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate">
                {cleanBuyer}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-500 tabular-nums shrink-0">
                <Star size={10} className="text-amber-500 fill-amber-500" />
                <span>4.9</span>
              </span>
            </div>
          </div>
        </div>

        {/* Gain Net + CTA */}
        <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/60 border border-[#059669]/25 text-xs sm:text-sm font-extrabold text-[#059669] dark:text-emerald-400 tabular-nums whitespace-nowrap">
            Gain : +{netGain} €
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <span>{ctaLabel || "Voir l'annonce"}</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </article>
    );
  }

  return null;
};

export interface ExploreUnifiedNavigationProps {
  activeSegment: ActivePlatform;
  onSelectSegment: (segment: ActivePlatform) => void;
  selectedCorridor?: string;
  onSelectCorridor: (corridor: { label: string; from: string; to: string }) => void;
}

/**
 * Compact, Mobile-First Segmented Mode Switcher (Colis | Trajets | Shopping)
 * + Single-Row Horizontal Scrollable Corridor Chips (Airbnb / Uber / BlaBlaCar ergonomics).
 */
export const ExploreUnifiedNavigation: React.FC<ExploreUnifiedNavigationProps> = ({
  activeSegment,
  onSelectSegment,
  selectedCorridor,
  onSelectCorridor,
}) => {
  const segments: {
    id: ActivePlatform;
    label: string;
    icon: typeof Package;
  }[] = [
    { id: "bagandgo", label: "Colis", icon: Package },
    { id: "voyageur", label: "Trajets", icon: Plane },
    { id: "shopandgo", label: "Shopping", icon: ShoppingBag },
  ];

  return (
    <div className="explore-unified-nav space-y-2.5">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        {/* Crisp Tactile 3-Mode Pill Switcher */}
        <div
          className="w-full lg:w-auto grid grid-cols-3 lg:inline-flex items-center p-1 rounded-2xl bg-slate-100/95 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shrink-0 shadow-2xs"
          role="radiogroup"
          aria-label="Choisir le mode d'exploration"
        >
          {segments.map((seg) => {
            const Icon = seg.icon;
            const isSelected = activeSegment === seg.id;
            return (
              <button
                key={seg.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectSegment(seg.id)}
                className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon size={15} className="shrink-0" />
                <span>{seg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Single-Line Horizontal Scrollable Corridor Rail (Zero Multi-Row Bloat on Mobile!) */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1"
          role="group"
          aria-label="Corridors rapides"
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-400 shrink-0">
            <MapPin size={12} />
          </span>
          {QUICK_CORRIDORS.map((corridor) => {
            const isActive = selectedCorridor === corridor.label;
            return (
              <button
                key={corridor.label}
                type="button"
                onClick={() => onSelectCorridor(corridor)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-2xs"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                {corridor.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
