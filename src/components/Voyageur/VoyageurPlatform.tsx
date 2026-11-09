import { useState } from "react";
import {
  Calendar,
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
  Sparkles,
  Star,
} from "lucide-react";
import { Trip } from "../../data/marketplace";
import { LuggageVisualizer } from "../marketplace/LuggageVisualizer";

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
  // Search state
  const [departureCity, setDepartureCity] = useState("Alger");
  const [arrivalCity, setArrivalCity] = useState("Marseille");
  const [flightDate, setFlightDate] = useState("2026-12-08");
  const [flightNumber, setFlightNumber] = useState("AF1432");

  // Dual action intention: 'send_parcel' | 'find_luggage' (matches client mockup)
  const [selectedIntent, setSelectedIntent] = useState<"send_parcel" | "find_luggage">("send_parcel");

  // Filter query state
  const [hasSearched, setHasSearched] = useState(false);
  const [showLuggageSimulator, setShowLuggageSimulator] = useState(true);

  // Filter available trips based on search
  const filteredTrips = trips.filter((t) => {
    if (!hasSearched) return true;
    const matchOrigin =
      !departureCity ||
      t.origin.toLowerCase().includes(departureCity.toLowerCase());
    const matchDest =
      !arrivalCity ||
      t.destination.toLowerCase().includes(arrivalCity.toLowerCase());
    return matchOrigin && matchDest;
  });

  return (
    <div className="voyageur-platform-container max-w-5xl mx-auto px-4 py-3 space-y-6 pb-36 text-left">
      {/* 1. Hero Photographic Banner matching Client Mockup 1 */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-lg border border-cyan-500/20">
        {/* Background photo: Airport tarmac, sunny sky, ascending plane, stylish traveler with backpack */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
          style={{ backgroundImage: "url('/images/hero-airport-traveler.jpg')" }}
        />
        {/* Dark oceanic gradient overlay for perfect readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#072a4a]/95 via-[#072a4a]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#072a4a] via-transparent to-transparent opacity-90" />

        <div className="relative p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 text-cyan-200 text-xs font-semibold">
              <Sparkles size={13} className="text-cyan-300" />
              <span>Espace Voyageur &amp; Transporteur Certifié</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
              Trouvez un voyageur pour vos colis, achats ou bagages
            </h1>

            <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed font-medium max-w-lg drop-shadow-sm">
              Monétisez vos kilos disponibles sur vos vols ou confiez vos biens à des voyageurs vérifiés avec séquestre bancaire Stripe et remise sécurisée.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {onPublishTrip && (
                <button
                  type="button"
                  onClick={onPublishTrip}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#00a2c7] hover:to-[#00669e] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Plus size={15} />
                  <span>Proposer mes kilos</span>
                </button>
              )}
              {onScanBoardingPass && (
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

          {/* Badge & Flight icon */}
          <div className="hidden md:flex flex-col items-center justify-center p-5 rounded-2xl bg-[#062c47]/75 backdrop-blur-md border border-cyan-400/30 text-center shadow-xl">
            <div className="w-16 h-16 rounded-full bg-cyan-400/20 flex items-center justify-center mb-2">
              <Plane size={32} className="text-cyan-300 transform -rotate-12 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide uppercase">Vols Certifiés</span>
            <span className="text-[10px] text-cyan-200 mt-0.5">France · Algérie · Tunisie · Maroc</span>
          </div>
        </div>

        {/* Organic wave curve transition below hero */}
        <div className="relative w-full overflow-hidden leading-none">
          <svg
            className="w-full h-5 sm:h-7 text-white dark:text-slate-900 fill-current block"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C150,90 350,-40 500,45 C650,120 900,20 1200,60 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 2. Flight & Trip Search Form (2x2 Grid) matching Client Mockup 1 */}
      <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Departure */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <MapPin size={20} className="text-[#00bcd4] shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Ville de départ
              </label>
              <select
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                <option value="Alger">Alger (ALG)</option>
                <option value="Paris">Paris (CDG/ORY)</option>
                <option value="Marseille">Marseille (MRS)</option>
                <option value="Lyon">Lyon (LYS)</option>
                <option value="Oran">Oran (ORN)</option>
                <option value="Constantine">Constantine (CZL)</option>
                <option value="Tunis">Tunis (TUN)</option>
                <option value="Casablanca">Casablanca (CMN)</option>
              </select>
            </div>
          </div>

          {/* Arrival */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <MapPin size={20} className="text-[#00bcd4] shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Ville d'arrivée
              </label>
              <select
                value={arrivalCity}
                onChange={(e) => setArrivalCity(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                <option value="Marseille">Marseille (MRS)</option>
                <option value="Paris">Paris (CDG/ORY)</option>
                <option value="Alger">Alger (ALG)</option>
                <option value="Lyon">Lyon (LYS)</option>
                <option value="Oran">Oran (ORN)</option>
                <option value="Constantine">Constantine (CZL)</option>
                <option value="Tunis">Tunis (TUN)</option>
                <option value="Casablanca">Casablanca (CMN)</option>
              </select>
            </div>
          </div>

          {/* Date of flight */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <Calendar size={20} className="text-[#00bcd4] shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Date de vol
              </label>
              <input
                type="date"
                value={flightDate}
                onChange={(e) => setFlightDate(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Flight Number */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <Plane size={20} className="text-[#00bcd4] shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Numéro de vol
              </label>
              <input
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="Ex : AF1432, AH1021..."
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Dual Action Cards: "J'envoie un colis" vs "Je cherche des bagages" (Exact Client Mockup) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Card 1: J'envoie un colis (Transporter un paquet) */}
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
                Transporter un paquet
              </p>
            </div>
          </button>

          {/* Card 2: Je cherche des bagages (Espace disponible) */}
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
                Je cherche des bagages
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Espace disponible
              </p>
            </div>
          </button>
        </div>

        {/* 4. Large Oceanic Cyan Gradient Pill CTA Button matching Client Mockup */}
        <button
          type="button"
          onClick={() => setHasSearched(true)}
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#00a2c7] hover:to-[#00669e] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <Search size={18} strokeWidth={2.4} />
          <span>Rechercher un voyageur</span>
        </button>
      </section>

      {/* 5. Interactive Luggage Visualizer & Animation (Client Feature) */}
      <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm">
        <div
          className="flex items-center justify-between p-4 px-5 cursor-pointer bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/70 dark:border-slate-800"
          onClick={() => setShowLuggageSimulator(!showLuggageSimulator)}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-cyan-50 text-[#00838f] dark:bg-cyan-950/50 dark:text-cyan-400 flex items-center justify-center">
              <Luggage size={18} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Simulateur dynamique de valise &amp; gains</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 text-[#00838f] dark:bg-cyan-950/50 dark:text-cyan-300 font-bold border border-cyan-200/60 dark:border-cyan-800/60">
                  Animation Interactive
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualisez le remplissage de vos kilos disponibles et le gain estimé
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
            <LuggageVisualizer />
          </div>
        )}
      </section>

      {/* 6. Section "Voyageurs disponibles" with Vertical Cyan Indicator */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#072a4a] dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#00bcd4] rounded-full inline-block" />
            <span>Voyageurs disponibles</span>
            {filteredTrips.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-[#00838f] dark:text-cyan-300">
                {filteredTrips.length}
              </span>
            )}
          </h2>

          {filteredTrips.length > 0 && (
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

        {/* Real Trips List or Clean Virgin State */}
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
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                      <span>{trip.origin}</span>
                      <span className="text-slate-400">→</span>
                      <span>{trip.destination}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {trip.flightNumber && (
                        <span className="inline-flex items-center gap-1">
                          <Plane size={12} className="text-[#00838f] dark:text-cyan-400" />
                          <span>Vol {trip.flightNumber}</span>
                        </span>
                      )}
                      <span>{trip.departureDate}</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/40 text-[#00838f] dark:text-cyan-300 font-semibold text-[10px]">
                        Transport + Achat
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
                      <Star size={13} fill="currentColor" />
                      <span>4.8</span>
                      <span className="text-slate-400 font-normal">(124 avis)</span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <span className="text-sm font-black text-[#00838f] dark:text-cyan-400">
                    Dès {trip.startingPrice || 15} € / kg
                  </span>
                  <button
                    type="button"
                    onClick={() => onContactTraveler ? onContactTraveler(trip) : onSelectTrip?.(trip)}
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
          /* Virgin Clean State */
          <div className="p-8 sm:p-12 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-[#00838f] dark:text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
              <Plane size={30} className="transform -rotate-12" />
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Aucun voyageur disponible pour cette recherche
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Soyez le premier à proposer votre trajet sur cette ligne et monétisez vos kilos auprès des expéditeurs !
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
                  <span>Proposer un trajet</span>
                </button>
              )}
              {onScanBoardingPass && (
                <button
                  type="button"
                  onClick={onScanBoardingPass}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold active:scale-95 transition-all"
                >
                  <Scan size={15} className="text-[#00838f] dark:text-cyan-400" />
                  <span>Scanner ma carte d'embarquement</span>
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
