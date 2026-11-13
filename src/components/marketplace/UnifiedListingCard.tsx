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
        className="unified-listing-card group bg-[#FFFFFF] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-5 sm:p-6 transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
          {/* 3. Avatar + Note vérifiée */}
          <div className="relative shrink-0">
            <Avatar name={cleanName} src={trip.travelerAvatar} />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#059669] border-2 border-white dark:border-slate-900 flex items-center justify-center"
              aria-hidden="true"
            >
              <ShieldCheck size={9} className="text-white" />
            </span>
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {cleanName}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 tabular-nums whitespace-nowrap">
                <Star
                  size={12}
                  className="text-amber-500 fill-amber-500 shrink-0"
                />
                <span>{ratingVal}</span>
                <span className="text-[#059669] font-semibold">· Vérifié</span>
              </span>

              {/* 4. Un seul badge de statut maximum */}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F8FAFC] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-700 tabular-nums whitespace-nowrap">
                {singleBadge}
              </span>
            </div>

            {/* 1. Trajet + Date */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 m-0 text-sm sm:text-base">
                <span>{cleanOrigin}</span>
                <ArrowRight size={15} className="text-slate-400 shrink-0" />
                <span>{cleanDestination}</span>
              </h3>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                <Calendar size={13} className="text-slate-400 shrink-0" />
                <span>{dateLabel(trip.departureDate)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Prix/kg en tabular-nums + Action */}
        <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2E8F0] dark:border-slate-800">
          <strong className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tabular-nums whitespace-nowrap">
            {unitPrice} € / {capacityUnit}
          </strong>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>{ctaLabel || "Voir le trajet"}</span>
            <ArrowRight size={14} />
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
    const netGain = request.reward || 35;
    const singleBadge = isParcel
      ? request.weightKg
        ? `Colis · ${request.weightKg} kg`
        : "Colis vérifié"
      : "Achat vérifié";

    return (
      <article
        onClick={onSelect}
        className="unified-listing-card group bg-[#FFFFFF] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-5 sm:p-6 transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
          {/* 3. Avatar + Note vérifiée */}
          <div className="relative shrink-0">
            <Avatar name={cleanBuyer} src={request.buyerAvatar} />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#059669] border-2 border-white dark:border-slate-900 flex items-center justify-center"
              aria-hidden="true"
            >
              <ShieldCheck size={9} className="text-white" />
            </span>
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {cleanBuyer}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 tabular-nums whitespace-nowrap">
                <Star
                  size={12}
                  className="text-amber-500 fill-amber-500 shrink-0"
                />
                <span>4.9</span>
                <span className="text-[#059669] font-semibold">· Vérifié</span>
              </span>

              {/* 4. Un seul badge de statut maximum */}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F8FAFC] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-700 tabular-nums whitespace-nowrap">
                {singleBadge}
              </span>
            </div>

            {/* 1. Trajet + Date */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 m-0 text-sm sm:text-base">
                <span>{cleanOrigin}</span>
                <ArrowRight size={15} className="text-slate-400 shrink-0" />
                <span>{cleanDestination}</span>
              </h3>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                <Calendar size={13} className="text-slate-400 shrink-0" />
                <span>{dateLabel(request.date)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Gain net en tabular-nums (#059669) + Action */}
        <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2E8F0] dark:border-slate-800">
          <strong className="text-base sm:text-lg font-extrabold text-[#059669] dark:text-emerald-400 tabular-nums whitespace-nowrap">
            +{netGain} € net
          </strong>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>{ctaLabel || "Voir l'annonce"}</span>
            <ArrowRight size={14} />
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
 * Unified Segmented Control (Colis | Trajets | Shopping) + Quick Corridor Chips
 * displayed at the top of /explore and across the 3 modes.
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
    <div className="explore-unified-nav bg-[#FFFFFF] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Segmented Control (Colis | Trajets | Shopping) */}
        <div
          className="inline-flex items-center p-1 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700"
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
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-[#2563EB] text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon size={15} className="shrink-0" />
                <span>{seg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Corridor Chips */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none"
          role="group"
          aria-label="Corridors rapides"
        >
          <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap hidden lg:inline-flex items-center gap-1">
            <MapPin size={12} />
            Corridors :
          </span>
          {QUICK_CORRIDORS.map((corridor) => {
            const isActive = selectedCorridor === corridor.label;
            return (
              <button
                key={corridor.label}
                type="button"
                onClick={() => onSelectCorridor(corridor)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#2563EB] text-white border-[#2563EB]"
                    : "bg-[#F8FAFC] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[#E2E8F0] dark:border-slate-700 hover:border-slate-300"
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
