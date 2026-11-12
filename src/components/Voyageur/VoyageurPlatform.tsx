import { useState } from "react";
import {
  Anchor,
  ArrowLeftRight,
  ArrowRight,
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
import { PurchaseRequest, Trip } from "../../data/marketplace";
import { LuggageVisualizer, VisualizerTransportMode } from "../marketplace/LuggageVisualizer";
import { CityAutocomplete } from "../common/CityAutocomplete";

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

const MODE_DEFAULT_IMAGES: Record<TransportMode, string> = {
  avion: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
  voiture: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
  train: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
  bateau: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80",
  camion: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
};

const MODE_DEFAULT_AVATARS: string[] = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
];

// Helper to instantiate realistic FreightItem trips conforming to Trip interface
function makeSampleTrip(base: Partial<Trip> & Pick<Trip, "id" | "title" | "origin" | "destination" | "originCode" | "destinationCode" | "departureDate" | "pricePerKg" | "availableKg" | "transportType" | "transportLabel">): Trip {
  const mode = (base.transportType || "avion") as TransportMode;
  const avatarIndex = Math.abs(base.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % MODE_DEFAULT_AVATARS.length;
  return {
    travelerName: base.title.split("(")[0].trim(),
    travelerAvatar: base.travelerAvatar || MODE_DEFAULT_AVATARS[avatarIndex],
    rating: 4.95,
    reviewsCount: 38,
    image: base.image || MODE_DEFAULT_IMAGES[mode] || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
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
  requests?: PurchaseRequest[];
  onSelectTrip?: (trip: Trip) => void;
  onContactTraveler?: (trip: Trip) => void;
  onRequest?: (request: PurchaseRequest) => void;
  onPublishTrip?: () => void;
  onScanBoardingPass?: () => void;
}

export function VoyageurPlatform({
  trips,
  requests = [],
  onSelectTrip,
  onContactTraveler,
  onRequest,
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

  // Filter available requests (parcels & shopping) based on search query
  const filteredRequests = requests.filter((r) => {
    if (!hasSearched) return true;
    const matchOrigin =
      !departureLocation ||
      r.origin.toLowerCase().includes(departureLocation.toLowerCase().split("(")[0].trim());
    const matchDest =
      !arrivalLocation ||
      r.destination.toLowerCase().includes(arrivalLocation.toLowerCase().split("(")[0].trim());
    return matchOrigin && matchDest;
  });

  return (
    <div className="voyageur-platform-container max-w-5xl mx-auto px-4 py-3 space-y-6 pb-36 text-left">
      {/* 1. Multi-Modal Transport Mode Selector Bar (5 Transport Modes) */}
      <nav
        aria-label="Modes de transport pour voyageurs"
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-1.5 shadow-xs"
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
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 dark:bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="truncate">{config.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 2. Hero Photographic Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0F172A] dark:bg-[#0B0F19] text-white shadow-xs border border-slate-800 p-6 sm:p-8 md:p-10">
        <div className="relative z-10 space-y-3.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 text-xs font-semibold">
            <Sparkles size={14} className="text-blue-400 shrink-0" />
            <span>Espace Voyageur Multi-Modal · {currentConfig.label}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {currentConfig.heroHeadline}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {currentConfig.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onPublishTrip && (
              <button
                type="button"
                onClick={onPublishTrip}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Proposer un trajet {currentConfig.shortLabel}</span>
              </button>
            )}
            {selectedMode === "avion" && onScanBoardingPass && (
              <button
                type="button"
                onClick={onScanBoardingPass}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white backdrop-blur-md border border-white/15 font-semibold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
              >
                <Scan size={16} className="text-slate-300" />
                <span>Scanner billet IATA</span>
              </button>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center gap-4 pt-3 text-[11px] text-slate-400 font-medium border-t border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Séquestre Stripe garanti</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-400" />
              <span>Identité &amp; Billets vérifiés</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-400" />
              <span>Code PIN secret de livraison</span>
            </span>
          </div>
        </div>
      </section>

      {/* 3. Floating Modern Search Bar with Free-Text City Autocomplete (Airbnb style) */}
      <section className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Search size={16} className="text-blue-600 dark:text-blue-400" />
            <span>Rechercher sur tous les corridors ({currentConfig.label})</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Toutes villes mondiales autorisées
          </span>
        </div>

        {/* Unified Search Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Departure Field (Free text + Suggestions) */}
          <div className="md:col-span-5 relative">
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              {currentConfig.departureLabel}
            </label>
            <CityAutocomplete
              name="voyageurDeparture"
              value={departureLocation}
              onChange={(val) => {
                setDepartureLocation(val);
                setHasSearched(true);
              }}
              placeholder="Tapez n'importe quelle ville de départ (ex: Paris, Alger, Lyon...)"
              className="w-full"
            />
          </div>

          {/* Quick Invert Button */}
          <div className="md:col-span-1 flex items-center justify-center pt-3 md:pt-4">
            <button
              type="button"
              onClick={() => {
                const temp = departureLocation;
                setDepartureLocation(arrivalLocation);
                setArrivalLocation(temp);
                setHasSearched(true);
              }}
              title="Inverser départ et arrivée"
              aria-label="Inverser départ et arrivée"
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <ArrowLeftRight size={16} />
            </button>
          </div>

          {/* Arrival Field (Free text + Suggestions) */}
          <div className="md:col-span-6 relative">
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              {currentConfig.arrivalLabel}
            </label>
            <CityAutocomplete
              name="voyageurArrival"
              value={arrivalLocation}
              onChange={(val) => {
                setArrivalLocation(val);
                setHasSearched(true);
              }}
              placeholder="Tapez n'importe quelle destination (ex: Oran, Marseille, Constantine...)"
              className="w-full"
            />
          </div>
        </div>

        {/* Secondary Row: Date, Reference & Submit Button */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Travel Date */}
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 focus-within:border-blue-600 transition-all">
            <Calendar size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {currentConfig.dateLabel}
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => {
                  setTravelDate(e.target.value);
                  setHasSearched(true);
                }}
                className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-900 dark:text-white outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Mode Identifier (Flight #, Vehicle model, Train #, etc.) */}
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 focus-within:border-blue-600 transition-all">
            <ModeIcon size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {currentConfig.identifierLabel} (optionnel)
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder={currentConfig.identifierPlaceholder}
                className="w-full bg-transparent font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* CTA Search Button */}
          <button
            type="button"
            onClick={() => setHasSearched(true)}
            className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Search size={18} strokeWidth={2.4} />
            <span>Lancer la recherche</span>
          </button>
        </div>

        {/* Popular Recommended Corridors Chips */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Trajets fréquents :
          </span>
          {[
            { from: "Paris", to: "Alger" },
            { from: "Marseille", to: "Oran" },
            { from: "Lyon", to: "Constantine" },
            { from: "Toulouse", to: "Casablanca" },
            { from: "Paris", to: "Tunis" },
            { from: "Nice", to: "Alger" },
            { from: "Marseille", to: "Alger" }
          ].map((corridor, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setDepartureLocation(corridor.from);
                setArrivalLocation(corridor.to);
                setHasSearched(true);
              }}
              className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-slate-200/80 dark:border-slate-700 cursor-pointer"
            >
              {corridor.from} → {corridor.to}
            </button>
          ))}
          {(departureLocation || arrivalLocation) && (
            <button
              type="button"
              onClick={() => {
                setDepartureLocation("");
                setArrivalLocation("");
                setHasSearched(false);
              }}
              className="text-[11px] font-semibold text-rose-500 hover:underline ml-auto cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* Dual Intent Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setSelectedIntent("send_parcel")}
            className={`p-4 rounded-2xl text-left transition-all relative flex flex-col justify-between cursor-pointer ${
              selectedIntent === "send_parcel"
                ? "border-2 border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-600/10 shadow-xs"
                : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300"
            }`}
          >
            {selectedIntent === "send_parcel" && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
              <Package size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                J'envoie un colis
              </h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                Transporter un paquet ou du volume ({currentConfig.shortLabel})
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedIntent("find_luggage")}
            className={`p-4 rounded-2xl text-left transition-all relative flex flex-col justify-between cursor-pointer ${
              selectedIntent === "find_luggage"
                ? "border-2 border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-600/10 shadow-xs"
                : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300"
            }`}
          >
            {selectedIntent === "find_luggage" && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-2">
              <Luggage size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Je cherche de l'espace disponible
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Capacité disponible en {currentConfig.capacityUnit} (dès 8 € / {currentConfig.capacityUnit})
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* 4. Interactive Capacity & Earnings Simulator (Mode-Aware) */}
      <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs">
        <div
          className="flex items-center justify-between p-4 px-5 cursor-pointer bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/70 dark:border-slate-800"
          onClick={() => setShowLuggageSimulator(!showLuggageSimulator)}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 flex items-center justify-center">
              <ModeIcon size={18} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Simulateur dynamique de capacité &amp; gains ({currentConfig.shortLabel})</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-bold border border-blue-200/60 dark:border-blue-800/60">
                  Animation Interactive
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
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

      {/* 5. Section "Voyageurs disponibles" ou "Colis à transporter" according to selectedIntent */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block" />
            <span>
              {selectedIntent === "send_parcel" && filteredRequests.length > 0
                ? `Colis & missions à transporter (${currentConfig.shortLabel})`
                : `Voyageurs disponibles (${currentConfig.shortLabel})`}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {selectedIntent === "send_parcel" && filteredRequests.length > 0
                ? filteredRequests.length
                : filteredTrips.length}
            </span>
          </h2>

          {hasSearched && (
            <button
              type="button"
              onClick={() => setHasSearched(false)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Voir tout</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Requests List when selectedIntent is send_parcel and requests exist */}
        {selectedIntent === "send_parcel" && filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    {req.image ? (
                      <img
                        src={req.image}
                        alt={req.title}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50">
                        <Package size={24} />
                      </div>
                    )}
                    {req.buyerAvatar && (
                      <img
                        src={req.buyerAvatar}
                        alt={req.buyer}
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-sm"
                        title={`Expéditeur certifié : ${req.buyer}`}
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {req.title}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
                        Gain net : +{req.reward || 35} €
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                      <span>{req.origin}</span>
                      <span className="text-slate-400">→</span>
                      <span>{req.destination}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {req.specifications || "Colis scellé à acheminer en direct"}
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    +{req.reward || 35} € net
                  </span>
                  <button
                    type="button"
                    onClick={() => (onRequest ? onRequest(req) : onSelectTrip?.(filteredTrips[0]))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Prendre en charge</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 shadow-xs hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="relative shrink-0">
                    {trip.travelerAvatar ? (
                      <img
                        src={trip.travelerAvatar}
                        alt={trip.travelerName || trip.title}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md ring-2 ring-blue-500/20"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {trip.title ? trip.title.slice(0, 2).toUpperCase() : "VO"}
                      </div>
                    )}
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-xs"
                      title="Profil vérifié eIDAS"
                    >
                      <Check size={9} className="text-white" strokeWidth={3} />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {trip.title || "Voyageur Certifié"}
                      </h3>
                      <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                        {trip.transportLabel || currentConfig.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                      <span className="text-slate-900 dark:text-white">{trip.origin}</span>
                      <ArrowRight size={14} className="text-slate-400 shrink-0" />
                      <span className="text-slate-900 dark:text-white">{trip.destination}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                      {trip.flightNumber && (
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          <ModeIcon size={13} className="text-slate-500 dark:text-slate-400" />
                          <span>{trip.flightNumber}</span>
                        </span>
                      )}
                      <span>Départ : <strong>{trip.departureDate}</strong></span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-500/20">
                        {trip.availableKg ? `${trip.availableKg} ${currentConfig.capacityUnit} disponibles` : "Espace garanti"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold pt-0.5">
                      <Star size={13} fill="currentColor" />
                      <span className="text-slate-900 dark:text-white">4.9</span>
                      <span className="text-slate-400 dark:text-slate-500 font-normal">(98 avis certifiés Stripe)</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left md:text-right">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tarif transport</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      Dès {trip.startingPrice || trip.pricePerKg || 12} € / {currentConfig.capacityUnit}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => (onContactTraveler ? onContactTraveler(trip) : onSelectTrip?.(trip))}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageCircle size={15} />
                    <span>Contacter &amp; Réserver</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Virgin State */
          <div className="p-8 sm:p-12 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mx-auto shadow-xs">
              <ModeIcon size={26} />
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
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
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
