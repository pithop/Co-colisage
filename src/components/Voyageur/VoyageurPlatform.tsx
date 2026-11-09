import { useState } from "react";
import {
  Calendar,
  Check,
  ChevronRight,
  Flame,
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
  UserCheck,
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

  // Dual action intention: 'buy_deliver' | 'pickup_transport'
  const [selectedIntent, setSelectedIntent] = useState<"buy_deliver" | "pickup_transport">("buy_deliver");

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
    <div className="voyageur-platform-container max-w-5xl mx-auto px-4 py-4 space-y-6 pb-36 text-left">
      {/* 1. Hero Banner matching Client Mockup 1 */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-cyan-50/70 to-blue-100 dark:from-slate-900 dark:via-sky-950 dark:to-slate-900 text-slate-900 dark:text-white shadow-md border border-cyan-200/70 dark:border-cyan-500/20">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-800 dark:text-cyan-300 text-xs font-semibold">
              <Sparkles size={13} className="text-cyan-600 dark:text-cyan-400" />
              <span>Espace Voyageur &amp; Transporteur Certifié</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Trouvez un voyageur pour vos colis, achats ou bagages
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Monétisez vos kilos disponibles sur vos vols ou confiez vos biens à des voyageurs vérifiés eIDAS avec paiement sous séquestre Stripe.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {onPublishTrip && (
                <button
                  type="button"
                  onClick={onPublishTrip}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/25 transition-all active:scale-95"
                >
                  <Plus size={14} />
                  <span>Proposer mes kilos</span>
                </button>
              )}
              {onScanBoardingPass && (
                <button
                  type="button"
                  onClick={onScanBoardingPass}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/10 hover:bg-slate-900/15 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 text-xs font-bold transition-all active:scale-95"
                >
                  <Scan size={14} className="text-cyan-600 dark:text-cyan-400" />
                  <span>Scanner billet IATA</span>
                </button>
              )}
            </div>
          </div>

          {/* Visual Element / Plane Silhouette Graphic */}
          <div className="w-full md:w-auto flex justify-center shrink-0">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-sky-400/20 border border-cyan-400/30 flex items-center justify-center p-4 shadow-inner">
              <Plane size={88} className="text-cyan-600 dark:text-cyan-300 transform -rotate-12 drop-shadow-md animate-pulse" />
              <div className="absolute bottom-3 left-3 right-3 text-center bg-slate-950/70 backdrop-blur-md rounded-xl py-1 px-2 border border-white/10">
                <span className="text-[10px] text-cyan-300 font-bold tracking-wider uppercase">
                  Vols &amp; Ferries Vérifiés
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Flight & Trip Search Form (2x2 Grid) */}
      <section className="rounded-3xl border border-cyan-500/20 bg-white dark:bg-slate-900/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Departure */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 focus-within:border-cyan-500 transition-colors">
            <MapPin size={20} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
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
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 focus-within:border-cyan-500 transition-colors">
            <MapPin size={20} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
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
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 focus-within:border-cyan-500 transition-colors">
            <Calendar size={20} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
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
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 focus-within:border-cyan-500 transition-colors">
            <Plane size={20} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Numéro de vol
              </label>
              <input
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="Ex: AF1432, AH1021..."
                className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Dual Action Cards: "Acheter et livrer" vs "Récupérer et transporter" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Card 1: Acheter et livrer un colis */}
          <button
            type="button"
            onClick={() => setSelectedIntent("buy_deliver")}
            className={`p-4 rounded-2xl text-left border transition-all relative flex flex-col justify-between min-h-[110px] ${
              selectedIntent === "buy_deliver"
                ? "border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/40 ring-2 ring-cyan-500/20 shadow-sm"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300"
            }`}
          >
            {selectedIntent === "buy_deliver" && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-sm">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2">
              <Package size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Acheter et livrer un colis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Acheter un produit pour un tiers et le livrer
              </p>
            </div>
          </button>

          {/* Card 2: Récupérer et transporter */}
          <button
            type="button"
            onClick={() => setSelectedIntent("pickup_transport")}
            className={`p-4 rounded-2xl text-left border transition-all relative flex flex-col justify-between min-h-[110px] ${
              selectedIntent === "pickup_transport"
                ? "border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/40 ring-2 ring-cyan-500/20 shadow-sm"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300"
            }`}
          >
            {selectedIntent === "pickup_transport" && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-sm">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center mb-2">
              <Luggage size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Récupérer et transporter
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Récupérer un colis ou bagage et le livrer à un tiers
              </p>
            </div>
          </button>
        </div>

        {/* 4. Large Pill CTA Button */}
        <button
          type="button"
          onClick={() => setHasSearched(true)}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-[0.98]"
        >
          <Search size={18} strokeWidth={2.4} />
          <span>Rechercher un voyageur</span>
        </button>
      </section>

      {/* 5. Interactive Luggage Visualizer & Animation (Loved by Client) */}
      <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm">
        <div
          className="flex items-center justify-between p-4 px-5 cursor-pointer bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/70 dark:border-slate-800"
          onClick={() => setShowLuggageSimulator(!showLuggageSimulator)}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Luggage size={18} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Simulateur dynamique de valise &amp; gains</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-bold">
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

      {/* 6. Section "Voyageurs disponibles" */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-5 bg-gradient-to-b from-cyan-500 to-teal-500 rounded-full inline-block" />
            <span>Voyageurs disponibles</span>
            {filteredTrips.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {filteredTrips.length}
              </span>
            )}
          </h2>

          {filteredTrips.length > 0 && (
            <button
              type="button"
              onClick={() => setHasSearched(false)}
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
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
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-cyan-400/50 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-600 to-sky-400 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                      {trip.title ? trip.title.slice(0, 2).toUpperCase() : "VO"}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {trip.title || "Voyageur Certifié"}
                      </h3>
                      <ShieldCheck size={15} className="text-cyan-500" />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                      <span>{trip.origin}</span>
                      <span className="text-cyan-500">→</span>
                      <span>{trip.destination}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {trip.flightNumber && (
                        <span className="inline-flex items-center gap-1">
                          <Plane size={12} className="text-cyan-500" />
                          <span>Vol {trip.flightNumber}</span>
                        </span>
                      )}
                      <span>{trip.departureDate}</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-semibold text-[10px]">
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
                  <span className="text-sm font-black text-cyan-600 dark:text-cyan-400">
                    Dès {trip.startingPrice || 15} € / kg
                  </span>
                  <button
                    type="button"
                    onClick={() => onContactTraveler ? onContactTraveler(trip) : onSelectTrip?.(trip)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
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
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
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
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/25 active:scale-95 transition-all"
                >
                  <Plus size={15} />
                  <span>Proposer un trajet</span>
                </button>
              )}
              {onScanBoardingPass && (
                <button
                  type="button"
                  onClick={onScanBoardingPass}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold active:scale-95 transition-all"
                >
                  <Scan size={15} className="text-cyan-500" />
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
