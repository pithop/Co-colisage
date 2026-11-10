import { useState } from "react";
import {
  Anchor,
  Box,
  Calendar,
  Car,
  Check,
  ChevronRight,
  Luggage,
  MapPin,
  MessageCircle,
  Package,
  Plane,
  Plus,
  Scan,
  Search,
  ShieldCheck,
  Ship,
  Sparkles,
  Star,
  Train,
  Truck,
} from "lucide-react";
import { Trip } from "../../data/marketplace";
import { LuggageVisualizer, VisualizerTransportMode } from "../marketplace/LuggageVisualizer";

export type TransportMode = "avion" | "voiture" | "train" | "bateau" | "camion";

interface ModeConfig {
  id: TransportMode;
  label: string;
  shortLabel: string;
  icon: typeof Plane;
  badge: string;
  heroHeadline: string;
  heroSubtitle: string;
  departureLabel: string;
  arrivalLabel: string;
  dateLabel: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  capacityUnit: string;
  departurePresets: string[];
  arrivalPresets: string[];
}

const MODE_CONFIGS: Record<TransportMode, ModeConfig> = {
  avion: {
    id: "avion",
    label: "Avion & Vol commercial",
    shortLabel: "Avion",
    icon: Plane,
    badge: "Vols Certifiés · France · Algérie · Tunisie · Maroc",
    heroHeadline: "Monétisez vos bagages sur vos vols internationaux",
    heroSubtitle: "Rentabilisez vos kilos en cabine et en soute sur chaque vol ou confiez vos colis à des passagers aériens vérifiés avec séquestre Stripe.",
    departureLabel: "Aéroport de départ",
    arrivalLabel: "Aéroport d'arrivée",
    dateLabel: "Date de vol",
    identifierLabel: "Numéro de vol",
    identifierPlaceholder: "Ex : AF1432, AH1021, TO7240...",
    capacityUnit: "kg",
    departurePresets: ["Alger (ALG)", "Paris (CDG/ORY)", "Marseille (MRS)", "Lyon (LYS)", "Oran (ORN)", "Constantine (CZL)", "Tunis (TUN)", "Casablanca (CMN)"],
    arrivalPresets: ["Marseille (MRS)", "Paris (CDG/ORY)", "Alger (ALG)", "Lyon (LYS)", "Oran (ORN)", "Constantine (CZL)", "Tunis (TUN)", "Casablanca (CMN)"],
  },
  voiture: {
    id: "voiture",
    label: "Voiture & Covoiturage",
    shortLabel: "Voiture",
    icon: Car,
    badge: "Trajets Routiers · France · Espagne · Maghreb · Europe",
    heroHeadline: "Partagez votre coffre lors de vos trajets en voiture",
    heroSubtitle: "Amortissez vos frais d'essence et de péages en transportant des colis dans votre coffre ou banquette arrière en toute sécurité.",
    departureLabel: "Ville de départ",
    arrivalLabel: "Ville d'arrivée",
    dateLabel: "Date du trajet",
    identifierLabel: "Modèle de véhicule",
    identifierPlaceholder: "Ex : Peugeot 3008, Renault Clio, Berline SUV...",
    capacityUnit: "Litres",
    departurePresets: ["Paris, France", "Lyon, France", "Marseille, France", "Alger, Algérie", "Oran, Algérie", "Montpellier, France", "Toulouse, France", "Alicante, Espagne"],
    arrivalPresets: ["Marseille, France", "Lyon, France", "Paris, France", "Alger, Algérie", "Oran, Algérie", "Barcelone, Espagne", "Tanger, Maroc", "Tunis, Tunisie"],
  },
  train: {
    id: "train",
    label: "Train & Ligne TGV",
    shortLabel: "Train",
    icon: Train,
    badge: "Réseaux Ferroviaires · TGV InOui · Ouigo · Eurostar · SNTF",
    heroHeadline: "Rentabilisez vos trajets ferroviaires et TGV",
    heroSubtitle: "Profitez de vos franchises bagages illimitées en train pour transporter des plis urgents ou des valises d'une gare à une autre.",
    departureLabel: "Gare de départ",
    arrivalLabel: "Gare d'arrivée",
    dateLabel: "Date du train",
    identifierLabel: "Numéro de train / Ligne",
    identifierPlaceholder: "Ex : TGV InOui 6612, Ouigo 7841, Coradia SNTF...",
    capacityUnit: "kg",
    departurePresets: ["Paris Gare de Lyon", "Paris Montparnasse", "Marseille Saint-Charles", "Lyon Part-Dieu", "Lille Flandres", "Alger Agha", "Oran Gare", "Casablanca Voyageurs"],
    arrivalPresets: ["Marseille Saint-Charles", "Paris Gare de Lyon", "Lyon Part-Dieu", "Bordeaux Saint-Jean", "Alger Agha", "Constantine Gare", "Tunis Ville"],
  },
  bateau: {
    id: "bateau",
    label: "Bateau & Traversée maritime",
    shortLabel: "Bateau",
    icon: Ship,
    badge: "Ferries Méditerranée · Corsica Linea · Algérie Ferries · GNV · Balearia",
    heroHeadline: "Transportez du volume lors de vos traversées maritimes",
    heroSubtitle: "Rentabilisez l'espace de votre véhicule ou votre franchise cabine sur les ferries vers l'Algérie, la Tunisie, le Maroc et la Corse.",
    departureLabel: "Port d'embarquement",
    arrivalLabel: "Port de débarquement",
    dateLabel: "Date de traversée",
    identifierLabel: "Compagnie & Navire",
    identifierPlaceholder: "Ex : Corsica Linea (Méditerranée), Algérie Ferries (Badji Mokhtar III)...",
    capacityUnit: "kg / coffre",
    departurePresets: ["Port de Marseille", "Port de Toulon", "Port de Sète", "Port de Gênes", "Port de Barcelone", "Port d'Alger", "Port d'Oran", "Port de Tanger Med"],
    arrivalPresets: ["Port d'Alger", "Port d'Oran", "Port de Béjaïa", "Port de Skikda", "Port de Tunis (La Goulette)", "Port de Tanger Med", "Port de Marseille"],
  },
  camion: {
    id: "camion",
    label: "Utilitaire & Camion fret",
    shortLabel: "Utilitaire",
    icon: Truck,
    badge: "Fret Léger & Camionnettes · Déménagement & Pros · 1 à 20 m³",
    heroHeadline: "Remplissez vos utilitaires et évitez les retours à vide",
    heroSubtitle: "Artisans, transporteurs pros ou particuliers : monétisez vos mètres cubes disponibles sur vos fourgons, camionnettes et plateaux.",
    departureLabel: "Zone d'enlèvement",
    arrivalLabel: "Zone de livraison",
    dateLabel: "Date de départ",
    identifierLabel: "Gabarit utilitaire",
    identifierPlaceholder: "Ex : Renault Master 14m³ avec hayon, Iveco Daily 20m³...",
    capacityUnit: "m³",
    departurePresets: ["Île-de-France (Paris)", "Région Lyonnaise", "Marseille / PACA", "Grand Alger", "Région Oranaise", "Grand Tunis", "Nord-Pas-de-Calais", "Aquitaine"],
    arrivalPresets: ["Marseille / PACA", "Île-de-France (Paris)", "Grand Alger", "Région Oranaise", "Grand Tunis", "Casablanca / Rabat", "Lyon / Rhône-Alpes"],
  },
};

// Helper to instantiate realistic FreightItem trips conforming to Trip interface
function makeSampleTrip(base: Partial<Trip> & Pick<Trip, "id" | "title" | "origin" | "destination" | "originCode" | "destinationCode" | "departureDate" | "pricePerKg" | "availableKg" | "transportType" | "transportLabel">): Trip {
  return {
    travelerName: base.title.split("(")[0].trim(),
    travelerAvatar: "/images/carrier-fleet.jpg",
    rating: 4.9,
    reviewsCount: 112,
    image: "/images/hero-airport-traveler.jpg",
    description: `Trajet certifié en ${base.transportLabel} entre ${base.origin} et ${base.destination}.`,
    isIdentityVerified: true,
    isTicketVerified: true,
    startingPrice: base.pricePerKg,
    isSuperTraveler: true,
    ...base,
  };
}

// Rich multi-modal mock trips so each mode has realistic listings
const MULTI_MODAL_SAMPLE_TRIPS: Record<TransportMode, Trip[]> = {
  avion: [
    makeSampleTrip({
      id: "trip-air-1",
      title: "Karim B. (Air France)",
      origin: "Paris (CDG)",
      destination: "Alger (ALG)",
      originCode: "CDG",
      destinationCode: "ALG",
      departureDate: "2026-12-08",
      pricePerKg: 15,
      availableKg: 18,
      flightNumber: "AF1432",
      transportType: "avion",
      transportLabel: "Avion · Boeing 777",
    }),
    makeSampleTrip({
      id: "trip-air-2",
      title: "Yacine M. (Air Algérie)",
      origin: "Marseille (MRS)",
      destination: "Oran (ORN)",
      originCode: "MRS",
      destinationCode: "ORN",
      departureDate: "2026-12-10",
      pricePerKg: 12,
      availableKg: 23,
      flightNumber: "AH1021",
      transportType: "avion",
      transportLabel: "Avion · Airbus A330",
    }),
  ],
  voiture: [
    makeSampleTrip({
      id: "trip-car-1",
      title: "Sofiane D. (Peugeot 5008)",
      origin: "Paris, France",
      destination: "Marseille, France",
      originCode: "PAR",
      destinationCode: "MRS",
      departureDate: "2026-12-09",
      pricePerKg: 8,
      availableKg: 35,
      flightNumber: "Coffre 350L disponible",
      transportType: "voiture",
      transportLabel: "Voiture · Grand SUV 7 places",
    }),
    makeSampleTrip({
      id: "trip-car-2",
      title: "Mehdi L. (Renault Talisman)",
      origin: "Lyon, France",
      destination: "Alger, Algérie (via ferry)",
      originCode: "LYS",
      destinationCode: "ALG",
      departureDate: "2026-12-12",
      pricePerKg: 10,
      availableKg: 45,
      flightNumber: "Coffre berline + banquette",
      transportType: "voiture",
      transportLabel: "Voiture · Berline routière",
    }),
  ],
  train: [
    makeSampleTrip({
      id: "trip-train-1",
      title: "Amine S. (TGV InOui)",
      origin: "Paris Gare de Lyon",
      destination: "Marseille Saint-Charles",
      originCode: "PLN",
      destinationCode: "MSC",
      departureDate: "2026-12-07",
      pricePerKg: 9,
      availableKg: 25,
      flightNumber: "TGV 6612 (Voiture 4)",
      transportType: "train",
      transportLabel: "Train · TGV à grande vitesse",
    }),
    makeSampleTrip({
      id: "trip-train-2",
      title: "Leila H. (SNTF Coradia)",
      origin: "Alger Agha",
      destination: "Oran Gare",
      originCode: "AGA",
      destinationCode: "ORN",
      departureDate: "2026-12-11",
      pricePerKg: 6,
      availableKg: 20,
      flightNumber: "Train Coradia Express 101",
      transportType: "train",
      transportLabel: "Train · Ligne Intercités SNTF",
    }),
  ],
  bateau: [
    makeSampleTrip({
      id: "trip-boat-1",
      title: "Farid K. (Corsica Linea)",
      origin: "Port de Marseille",
      destination: "Port d'Alger",
      originCode: "MRS-PORT",
      destinationCode: "ALG-PORT",
      departureDate: "2026-12-14",
      pricePerKg: 7,
      availableKg: 60,
      flightNumber: "Ferry Méditerranée (Véhicule à bord)",
      transportType: "bateau",
      transportLabel: "Bateau · Car-ferry trans-Méditerranée",
    }),
    makeSampleTrip({
      id: "trip-boat-2",
      title: "Tariq B. (Algérie Ferries)",
      origin: "Port d'Alicante",
      destination: "Port d'Oran",
      originCode: "ALC-PORT",
      destinationCode: "ORN-PORT",
      departureDate: "2026-12-16",
      pricePerKg: 8,
      availableKg: 80,
      flightNumber: "Ferry Badji Mokhtar III",
      transportType: "bateau",
      transportLabel: "Bateau · Ferry grande capacité",
    }),
  ],
  camion: [
    makeSampleTrip({
      id: "trip-truck-1",
      title: "Rachid Transports (Fourgon 14m³)",
      origin: "Île-de-France (Paris)",
      destination: "Marseille / PACA",
      originCode: "IDF",
      destinationCode: "MRS",
      departureDate: "2026-12-10",
      pricePerKg: 5,
      availableKg: 250,
      flightNumber: "Renault Master avec Hayon élévateur",
      transportType: "camion",
      transportLabel: "Utilitaire · Fourgon grand volume 14m³",
    }),
    makeSampleTrip({
      id: "trip-truck-2",
      title: "Nabil Fret Express (Iveco Daily 20m³)",
      origin: "Marseille, France",
      destination: "Alger, Algérie",
      originCode: "MRS",
      destinationCode: "ALG",
      departureDate: "2026-12-15",
      pricePerKg: 6,
      availableKg: 500,
      flightNumber: "Iveco 20m³ (Transit douanier pro)",
      transportType: "camion",
      transportLabel: "Camion · Porteur 3.5T avec sangles",
    }),
  ],
};


interface VoyageurPlatformProps {
  trips: Trip[];
  onSelectTrip?: (trip: Trip) => void;
  onContactTraveler?: (trip: Trip) => void;
  onPublishTrip?: () => void;
  onScanBoardingPass?: () => void;
}

export function VoyageurPlatform({
  trips,
  onSelectTrip,
  onContactTraveler,
  onPublishTrip,
  onScanBoardingPass,
}: VoyageurPlatformProps) {
  // Multi-modal transport mode state
  const [selectedMode, setSelectedMode] = useState<TransportMode>("avion");

  // Mode configuration
  const currentConfig = MODE_CONFIGS[selectedMode];
  const ModeIcon = currentConfig.icon;

  // Search states initialized per mode
  const [departureLocation, setDepartureLocation] = useState(currentConfig.departurePresets[0]);
  const [arrivalLocation, setArrivalLocation] = useState(currentConfig.arrivalPresets[0]);
  const [travelDate, setTravelDate] = useState("2026-12-08");
  const [referenceNumber, setReferenceNumber] = useState(selectedMode === "avion" ? "AF1432" : "");

  // Dual action intention: 'send_parcel' | 'find_luggage'
  const [selectedIntent, setSelectedIntent] = useState<"send_parcel" | "find_luggage">("send_parcel");

  // Filter state
  const [hasSearched, setHasSearched] = useState(false);
  const [showLuggageSimulator, setShowLuggageSimulator] = useState(true);

  // Switch transport mode handler
  const handleModeChange = (mode: TransportMode) => {
    setSelectedMode(mode);
    const cfg = MODE_CONFIGS[mode];
    setDepartureLocation(cfg.departurePresets[0]);
    setArrivalLocation(cfg.arrivalPresets[0]);
    setReferenceNumber(mode === "avion" ? "AF1432" : "");
    setHasSearched(false);
  };

  // Combine real trips matching transportType with sample trips for the selected mode
  const modeTrips = [
    ...trips.filter((t) => t.transportType === selectedMode),
    ...(MULTI_MODAL_SAMPLE_TRIPS[selectedMode] || []),
  ];

  // Filter available trips based on search query
  const filteredTrips = modeTrips.filter((t) => {
    if (!hasSearched) return true;
    const matchOrigin =
      !departureLocation ||
      t.origin.toLowerCase().includes(departureLocation.toLowerCase().split("(")[0].trim());
    const matchDest =
      !arrivalLocation ||
      t.destination.toLowerCase().includes(arrivalLocation.toLowerCase().split("(")[0].trim());
    return matchOrigin && matchDest;
  });

  return (
    <div className="voyageur-platform-container max-w-5xl mx-auto px-4 py-3 space-y-6 pb-36 text-left">
      {/* 1. Multi-Modal Transport Mode Selector Bar (5 Transport Modes) */}
      <nav
        aria-label="Modes de transport pour voyageurs"
        className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 p-2 shadow-sm"
      >
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5" role="tablist">
          {(Object.keys(MODE_CONFIGS) as TransportMode[]).map((modeKey) => {
            const config = MODE_CONFIGS[modeKey];
            const Icon = config.icon;
            const isSelected = selectedMode === modeKey;
            return (
              <button
                key={modeKey}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleModeChange(modeKey)}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-[#00838f] to-[#00bcd4] text-white shadow-md shadow-cyan-500/20 scale-[1.02]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon size={17} strokeWidth={isSelected ? 2.5 : 2} className="shrink-0" />
                <span className="truncate">{config.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 2. Hero Photographic Banner contextualized to Selected Transport Mode */}
      <section className="relative overflow-hidden rounded-[28px] bg-[#072a4a] text-white shadow-xl border border-cyan-500/25">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: "url('/images/hero-airport-traveler.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#072a4a]/95 via-[#072a4a]/85 to-[#072a4a]/40 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#072a4a]/90 via-transparent to-black/20" />

        <div className="relative p-5 sm:p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 text-cyan-200 text-xs font-semibold">
              <Sparkles size={13} className="text-cyan-300" />
              <span>Espace Voyageur Multi-Modal · Mode {currentConfig.shortLabel}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
              {currentConfig.heroHeadline}
            </h1>

            <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed font-medium max-w-lg drop-shadow-sm">
              {currentConfig.heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1.5">
              {onPublishTrip && (
                <button
                  type="button"
                  onClick={onPublishTrip}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#00a2c7] hover:to-[#00669e] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Plus size={15} />
                  <span>Proposer un trajet {currentConfig.shortLabel}</span>
                </button>
              )}
              {selectedMode === "avion" && onScanBoardingPass && (
                <button
                  type="button"
                  onClick={onScanBoardingPass}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/25 text-xs sm:text-sm font-bold transition-all active:scale-95"
                >
                  <Scan size={15} className="text-cyan-300" />
                  <span>Scanner billet IATA</span>
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Transport Badge Icon */}
          <div className="hidden md:flex flex-col items-center justify-center p-5 rounded-2xl bg-[#062c47]/80 backdrop-blur-md border border-cyan-400/30 text-center shadow-xl min-w-[200px]">
            <div className="w-16 h-16 rounded-full bg-cyan-400/20 flex items-center justify-center mb-2">
              <ModeIcon size={32} className="text-cyan-300 transform -rotate-6 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide uppercase">{currentConfig.label}</span>
            <span className="text-[10px] text-cyan-200 mt-0.5">{currentConfig.badge}</span>
          </div>
        </div>
      </section>

      {/* 3. Search Form (2x2 Grid) Contextualized to Chosen Mode */}
      <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#072a4a] dark:text-white">
            <span className="w-2 h-2 rounded-full bg-[#00bcd4]" />
            <span>Paramètres de recherche · {currentConfig.label}</span>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Unité : {currentConfig.capacityUnit}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Departure */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <MapPin size={20} className="text-[#00bcd4] shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {currentConfig.departureLabel}
              </label>
              <select
                value={departureLocation}
                onChange={(e) => setDepartureLocation(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                {currentConfig.departurePresets.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Arrival */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <MapPin size={20} className="text-[#00bcd4] shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {currentConfig.arrivalLabel}
              </label>
              <select
                value={arrivalLocation}
                onChange={(e) => setArrivalLocation(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                {currentConfig.arrivalPresets.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Travel Date */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <Calendar size={20} className="text-[#00bcd4] shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {currentConfig.dateLabel}
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Mode Identifier (Flight #, Vehicle model, Train #, Ferry, Truck) */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <ModeIcon size={20} className="text-[#00bcd4] shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {currentConfig.identifierLabel}
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder={currentConfig.identifierPlaceholder}
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Dual Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setSelectedIntent("send_parcel")}
            className={`p-4 rounded-2xl text-left transition-all relative flex flex-col justify-between min-h-[110px] ${
              selectedIntent === "send_parcel"
                ? "border-2 border-[#00bcd4] bg-[#e6f9fa] dark:bg-cyan-950/40 ring-2 ring-[#00bcd4]/25 shadow-sm"
                : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300"
            }`}
          >
            {selectedIntent === "send_parcel" && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#00bcd4] text-white flex items-center justify-center shadow-sm">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
            <div className="w-10 h-10 rounded-xl bg-cyan-100/70 dark:bg-cyan-900/50 text-[#00838f] dark:text-cyan-300 flex items-center justify-center mb-2">
              <Package size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#072a4a] dark:text-white">
                J'envoie un colis
              </h3>
              <p className="text-xs text-[#00838f] dark:text-cyan-400 font-semibold mt-0.5">
                Transporter un paquet ou du volume ({currentConfig.shortLabel})
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedIntent("find_luggage")}
            className={`p-4 rounded-2xl text-left transition-all relative flex flex-col justify-between min-h-[110px] ${
              selectedIntent === "find_luggage"
                ? "border-2 border-[#00bcd4] bg-[#e6f9fa] dark:bg-cyan-950/40 ring-2 ring-[#00bcd4]/25 shadow-sm"
                : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300"
            }`}
          >
            {selectedIntent === "find_luggage" && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#00bcd4] text-white flex items-center justify-center shadow-sm">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-2">
              <Luggage size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#072a4a] dark:text-white">
                Je cherche de l'espace disponible
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Capacité disponible en {currentConfig.capacityUnit}
              </p>
            </div>
          </button>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => setHasSearched(true)}
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#00a2c7] hover:to-[#00669e] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <Search size={18} strokeWidth={2.4} />
          <span>Rechercher un voyageur ({currentConfig.shortLabel})</span>
        </button>
      </section>

      {/* 4. Interactive Capacity & Earnings Simulator (Mode-Aware) */}
      <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm">
        <div
          className="flex items-center justify-between p-4 px-5 cursor-pointer bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/70 dark:border-slate-800"
          onClick={() => setShowLuggageSimulator(!showLuggageSimulator)}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-cyan-50 text-[#00838f] dark:bg-cyan-950/50 dark:text-cyan-400 flex items-center justify-center">
              <ModeIcon size={18} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Simulateur dynamique de capacité &amp; gains ({currentConfig.shortLabel})</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 text-[#00838f] dark:bg-cyan-950/50 dark:text-cyan-300 font-bold border border-cyan-200/60 dark:border-cyan-800/60">
                  Animation Interactive
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualisez l'allocation de votre espace ({currentConfig.capacityUnit}) et l'estimation des gains nets
              </p>
            </div>
          </div>

          <ChevronRight
            size={18}
            className={`text-slate-400 transition-transform ${showLuggageSimulator ? "rotate-90" : ""}`}
          />
        </div>

        {showLuggageSimulator && (
          <div className="p-4 sm:p-6">
            <LuggageVisualizer transportMode={selectedMode as VisualizerTransportMode} />
          </div>
        )}
      </section>

      {/* 5. Section "Voyageurs disponibles" with Transport Badges */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#072a4a] dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#00bcd4] rounded-full inline-block" />
            <span>Voyageurs disponibles ({currentConfig.shortLabel})</span>
            {filteredTrips.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-[#00838f] dark:text-cyan-300">
                {filteredTrips.length}
              </span>
            )}
          </h2>

          {hasSearched && (
            <button
              type="button"
              onClick={() => setHasSearched(false)}
              className="text-xs font-bold text-[#00838f] dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Real Trips List */}
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00838f] to-[#00bcd4] text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                      {trip.title ? trip.title.slice(0, 2).toUpperCase() : "VO"}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-[#072a4a] dark:text-white">
                        {trip.title || "Voyageur Certifié"}
                      </h3>
                      <ShieldCheck size={15} className="text-[#00bcd4]" />
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/40 text-[#00838f] dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/50">
                        {trip.transportLabel || currentConfig.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                      <span>{trip.origin}</span>
                      <span className="text-slate-400">→</span>
                      <span>{trip.destination}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {trip.flightNumber && (
                        <span className="inline-flex items-center gap-1">
                          <ModeIcon size={12} className="text-[#00838f] dark:text-cyan-400" />
                          <span>{trip.flightNumber}</span>
                        </span>
                      )}
                      <span>{trip.departureDate}</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/40 text-[#00838f] dark:text-cyan-300 font-semibold text-[10px]">
                        {trip.availableKg ? `${trip.availableKg} ${currentConfig.capacityUnit} dispo` : "Espace garanti"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
                      <Star size={13} fill="currentColor" />
                      <span>4.9</span>
                      <span className="text-slate-400 font-normal">(98 avis certifiés)</span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <span className="text-sm font-black text-[#00838f] dark:text-cyan-400">
                    Dès {trip.startingPrice || trip.pricePerKg || 12} € / {currentConfig.capacityUnit}
                  </span>
                  <button
                    type="button"
                    onClick={() => (onContactTraveler ? onContactTraveler(trip) : onSelectTrip?.(trip))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#00a2c7] hover:to-[#00669e] text-white text-xs font-bold shadow-sm hover:shadow-md active:scale-95 transition-all"
                  >
                    <MessageCircle size={14} />
                    <span>Contacter</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Virgin State */
          <div className="p-8 sm:p-12 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-[#00838f] dark:text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
              <ModeIcon size={30} />
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Aucun voyageur {currentConfig.shortLabel} disponible pour cette recherche
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Soyez le premier à proposer votre trajet sur cette ligne et monétisez votre espace disponible auprès des expéditeurs !
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              {onPublishTrip && (
                <button
                  type="button"
                  onClick={onPublishTrip}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#00a2c7] hover:to-[#00669e] text-white text-xs font-bold shadow-sm hover:shadow-md active:scale-95 transition-all"
                >
                  <Plus size={15} />
                  <span>Proposer un trajet {currentConfig.shortLabel}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
