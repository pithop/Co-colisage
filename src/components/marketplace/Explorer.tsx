import { useState } from "react";
import { flightRoutes, demoCommission } from "../../data/flightSimulation";
import { LuggageVisualizer } from "./LuggageVisualizer";
import {
  ArrowRight,
  ChevronDown,
  Globe2,
  Package,
  Plane,
  Search,
  ScanLine,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import {
  PurchaseRequest,
  Trip,
  euro,
  normalize,
  vehicleLabel,
} from "../../data/marketplace";
import { CityAutocomplete } from "../common/CityAutocomplete";
import {
  QUICK_CORRIDORS,
  UnifiedListingCard,
} from "./UnifiedListingCard";

type ExploreUniverse = "colis" | "trajets" | "shopping";

export function Explorer({
  mode,
  onMode,
  requests,
  trips,
  onRequest,
  onTrip,
  onArbitrage,
  onScan,
}: {
  mode: "requests" | "trips";
  onMode: (mode: "requests" | "trips") => void;
  requests: PurchaseRequest[];
  trips: Trip[];
  onRequest: (request: PurchaseRequest) => void;
  onTrip: (trip: Trip) => void;
  onArbitrage: (routeId?: string) => void;
  onScan: () => void;
}) {
  const [universe, setUniverse] = useState<ExploreUniverse>(
    mode === "trips" ? "trajets" : "colis",
  );
  const [flightRouteId, setFlightRouteId] = useState(flightRoutes[0].id);
  const flightRoute =
    flightRoutes.find((item) => item.id === flightRouteId) ?? flightRoutes[0];
  const flightPrice = Math.min(...flightRoute.prices);
  const [query, setQuery] = useState("");
  const [worldwide, setWorldwide] = useState(false);
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [size, setSize] = useState("");
  const [filter, setFilter] = useState("");
  const [capacity, setCapacity] = useState<number | null>(null);

  const isRequests = universe !== "trajets";

  const handleSelectUniverse = (next: ExploreUniverse) => {
    setUniverse(next);
    onMode(next === "trajets" ? "trips" : "requests");
  };

  const reset = () => {
    setWorldwide(false);
    setQuery("");
    setDestination("");
    setDate("");
    setBudget("");
    setVehicle("");
    setSize("");
    setFilter("");
    setCapacity(null);
  };

  const words = normalize(query)
    .split(/[\s→\->–—\/:|]+/)
    .filter(Boolean);
  const matches = (text: string) =>
    words.every((word) => normalize(text).includes(word));

  const visibleRequests = requests.filter(
    (r) =>
      (universe === "colis" ? r.kind === "parcel" : r.kind !== "parcel") &&
      (worldwide || !r.market) &&
      (!r.status || r.status === "available") &&
      matches(`${r.title} ${r.origin} ${r.destination}`) &&
      (!destination ||
        normalize(r.destination).includes(normalize(destination))) &&
      (!date || r.date <= date) &&
      (!budget || r.budget <= Number(budget)) &&
      (capacity === null ||
        (r.weightKg !== undefined && r.weightKg <= capacity)),
  );

  const visibleTrips = trips.filter(
    (t) =>
      (worldwide || !t.market) &&
      matches(
        `${t.travelerName} ${t.origin} ${t.destination} ${t.transportLabel}`,
      ) &&
      (!destination ||
        normalize(t.destination).includes(normalize(destination))) &&
      (!date || t.departureDate >= date) &&
      (!vehicle || vehicleLabel(t) === vehicle) &&
      (capacity === null || t.availableKg >= capacity) &&
      (!size ||
        (size === "small"
          ? t.availableKg >= 5
          : !!t.dimensions || t.transportType === "camion")),
  );

  const count = isRequests ? visibleRequests.length : visibleTrips.length;
  const filters = isRequests
    ? [
        { label: "Destination", value: destination },
        { label: "Avant le", value: date },
        { label: "Budget max", value: budget ? `${budget} €` : "" },
      ]
    : [
        { label: "Destination", value: destination },
        { label: "À partir du", value: date },
        { label: "Véhicule", value: vehicle },
        { label: "Dimensions", value: size },
      ];

  return (
    <div className="explorer-page bg-[#F8FAFC] dark:bg-slate-950">
      <section className="explore-heading">
        <div className="eyebrow">
          <span /> LES BONS TRAJETS FONT LES BONNES RENCONTRES
        </div>
        <h1>
          {universe === "colis" ? (
            <>
              Un colis à expédier
              <br className="mobile-break" /> en toute confiance ?
            </>
          ) : universe === "shopping" ? (
            <>
              Un article à vous
              <br className="mobile-break" /> faire ramener ?
            </>
          ) : (
            <>
              Une place sur
              <br className="mobile-break" /> votre trajet.
            </>
          )}
        </h1>
        <p>
          {isRequests
            ? "Consultez les demandes vérifiées ou publiez la vôtre."
            : "Consultez les trajets certifiés ou proposez le vôtre."}
        </p>
      </section>

      <div className="explore-layout">
        <section className="listing-column" aria-label="Explorer les annonces">
          {/* Unified Segmented Control (Colis | Trajets | Shopping) + Quick Corridors */}
          <div className="bg-[#FFFFFF] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-5 mb-4 space-y-4">
            <div
              className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700"
              role="radiogroup"
              aria-label="Type d’annonces"
            >
              <button
                type="button"
                role="radio"
                aria-checked={universe === "colis"}
                onClick={() => handleSelectUniverse("colis")}
                className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  universe === "colis"
                    ? "bg-[#2563EB] text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Package size={15} className="shrink-0" />
                <span>Colis</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={universe === "trajets"}
                onClick={() => handleSelectUniverse("trajets")}
                className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  universe === "trajets"
                    ? "bg-[#2563EB] text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Plane size={15} className="shrink-0" />
                <span>Trajets</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={universe === "shopping"}
                onClick={() => handleSelectUniverse("shopping")}
                className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  universe === "shopping"
                    ? "bg-[#2563EB] text-white shadow-2xs"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <ShoppingBag size={15} className="shrink-0" />
                <span>Shopping</span>
              </button>
            </div>

            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Corridors rapides"
            >
              {QUICK_CORRIDORS.map((corridor) => (
                <button
                  key={corridor.label}
                  type="button"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
                    query === corridor.label
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : "bg-[#F8FAFC] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[#E2E8F0] dark:border-slate-700 hover:border-slate-300"
                  }`}
                  onClick={() => {
                    setWorldwide(true);
                    setQuery(query === corridor.label ? "" : corridor.label);
                  }}
                >
                  {corridor.label}
                </button>
              ))}
            </div>
          </div>

          <div className="catalogue-scope bg-[#FFFFFF] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-5 mb-4">
            <div>
              <strong>Des trajets au-delà des frontières.</strong>
              <p>Maghreb, Afrique de l’Ouest, Canada et Émirats.</p>
            </div>
            <div role="group" aria-label="Catalogue d’annonces">
              <button
                aria-pressed={!worldwide}
                onClick={() => {
                  setWorldwide(false);
                  reset();
                }}
              >
                Sélection
              </button>
              <button
                aria-pressed={worldwide}
                onClick={() => {
                  reset();
                  setWorldwide(true);
                }}
              >
                Monde entier
              </button>
            </div>
          </div>

          {worldwide && (
            <p className="network-indicator">
              <Globe2 size={14} aria-hidden="true" /> Réseau International
              Certifié · Départs réguliers France–Maghreb &amp; Transatlantique
            </p>
          )}

          <div className="search-field bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl">
            <Search size={20} />
            <input
              aria-label="Rechercher une annonce"
              placeholder={
                isRequests
                  ? "Article, ville ou destination"
                  : "Départ → Arrivée"
              }
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim()) setWorldwide(true);
              }}
            />
            {query && (
              <button
                aria-label="Effacer la recherche"
                onClick={() => setQuery("")}
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="filter-row">
            {capacity !== null && (
              <button
                className="filter-pill selected tabular-nums"
                aria-label="Retirer le filtre de capacité"
                onClick={() => setCapacity(null)}
              >
                {isRequests
                  ? `Colis jusqu’à ${capacity} kg`
                  : `Au moins ${capacity} kg`}{" "}
                <X size={14} />
              </button>
            )}
            {filters.map((f) => (
              <button
                key={f.label}
                className={`filter-pill ${f.value ? "selected" : ""}`}
                aria-expanded={filter === f.label}
                aria-controls={
                  filter === f.label ? "listing-filter-panel" : undefined
                }
                onClick={() => setFilter(filter === f.label ? "" : f.label)}
              >
                {f.label}
                {f.value && <span className="filter-dot" />}
                <ChevronDown size={14} />
              </button>
            ))}
            <SlidersHorizontal size={17} className="filter-decoration" />
          </div>

          {filter && (
            <div
              className="filter-panel bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5"
              id="listing-filter-panel"
            >
              <label htmlFor="filter-value">
                {filter === "Date"
                  ? isRequests
                    ? "Livraison au plus tard le"
                    : "Date de départ"
                  : filter === "Budget"
                    ? "Budget article maximum (€)"
                    : filter}
              </label>
              {filter === "Destination" && (
                <div className="filter-city-autocomplete-wrap">
                  <CityAutocomplete
                    id="filter-value"
                    name="destination"
                    value={destination}
                    onChange={(val) => {
                      setDestination(val);
                      if (val) setWorldwide(true);
                    }}
                    placeholder="Taper une ville (ex. Batna, Alger, Paris, Montréal...)"
                  />
                  {destination && (
                    <button
                      type="button"
                      className="filter-clear-city-btn"
                      onClick={() => setDestination("")}
                    >
                      Effacer la destination
                    </button>
                  )}
                </div>
              )}
              {filter === "Date" && (
                <input
                  id="filter-value"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              )}
              {filter === "Budget" && (
                <input
                  id="filter-value"
                  type="number"
                  min="0"
                  placeholder="120"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              )}
              {filter === "Véhicule" && (
                <div className="flex flex-wrap gap-1.5 py-1">
                  <button
                    type="button"
                    onClick={() => setVehicle("")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      vehicle === ""
                        ? "bg-[#2563EB] text-white"
                        : "bg-[#F8FAFC] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#E2E8F0]"
                    }`}
                  >
                    Tous
                  </button>
                  {[
                    "Voiture",
                    "Camionnette",
                    "Bagage",
                    "Avion",
                    "Bateau",
                    "Train & TGV",
                  ].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVehicle(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        vehicle === v
                          ? "bg-[#2563EB] text-white"
                          : "bg-[#F8FAFC] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#E2E8F0]"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}
              {filter === "Dimensions" && (
                <div className="flex flex-wrap gap-1.5 py-1">
                  {[
                    { id: "", label: "Tous les formats" },
                    { id: "small", label: "Bagage (≥ 5 kg)" },
                    { id: "large", label: "Cartons / volume" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSize(s.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        size === s.id
                          ? "bg-[#2563EB] text-white"
                          : "bg-[#F8FAFC] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#E2E8F0]"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
              <button className="text-button" onClick={() => setFilter("")}>
                Appliquer
              </button>
            </div>
          )}

          <div
            className="results-heading tabular-nums"
            id="capacity-results"
            tabIndex={-1}
          >
            <span aria-live="polite">
              {count}{" "}
              {universe === "colis"
                ? "colis à acheminer"
                : universe === "shopping"
                  ? "demandes d’achat"
                  : "trajets disponibles"}
            </span>
            {query ||
            destination ||
            date ||
            budget ||
            vehicle ||
            size ||
            capacity !== null ? (
              <button onClick={reset}>Tout effacer</button>
            ) : (
              <span>Entre vous, tout simplement.</span>
            )}
          </div>

          <div className="listing-stack space-y-3.5">
            {isRequests
              ? visibleRequests.map((r) => (
                  <UnifiedListingCard
                    key={r.id}
                    request={r}
                    onSelect={() => onRequest(r)}
                    ctaLabel="Voir la demande"
                  />
                ))
              : visibleTrips.map((t) => (
                  <UnifiedListingCard
                    key={t.id}
                    trip={t}
                    onSelect={() => onTrip(t)}
                    ctaLabel="Voir le trajet"
                  />
                ))}

            {!count && (
              <div className="empty-state bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6">
                <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 flex items-center justify-center text-[#2563EB] mx-auto mb-3">
                  <Search size={24} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Aucune annonce sur ce critère
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                  Élargissez vos critères ou explorez les départs fréquents sur
                  nos couloirs actifs :
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
                  {QUICK_CORRIDORS.map((crd) => (
                    <button
                      key={crd.label}
                      type="button"
                      onClick={() => {
                        reset();
                        setDestination(crd.to);
                        setWorldwide(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-blue-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-700 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Plane size={11} className="rotate-45" />
                      {crd.label}
                    </button>
                  ))}
                </div>
                <button className="outline-button" onClick={reset}>
                  Réinitialiser tous les filtres
                </button>
              </div>
            )}
          </div>
        </section>

        <aside className="discovery-column space-y-4">
          <button
            className="arbitrage-teaser bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5"
            onClick={() => onArbitrage()}
          >
            <span className="teaser-tag">
              <Sparkles size={14} /> L’INTELLIGENCE QUI VOUS RAPPROCHE
            </span>
            <h2>
              Votre prochain voyage
              <br />
              pourrait se financer
              <br />
              <em>tout seul.</em>
            </h2>
            <p>
              Voyager gratuit ou gagner de l’argent : trouvez les missions sur
              votre route.
            </p>
            <span className="teaser-link">
              Découvrir l’arbitrage IA <ArrowRight size={18} />
            </span>
            <div className="teaser-orbit" aria-hidden="true">
              <Plane size={52} strokeWidth={1} />
            </div>
          </button>

          <button
            className="scanner-teaser bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5"
            onClick={onScan}
          >
            <span className="scanner-icon">
              <Plane size={23} />
            </span>
            <div>
              <h3>Un billet, de la place ?</h3>
              <p className="tabular-nums">
                Scannez votre billet d’avion.
                <br />
                10 kg de franchise = 9 kg à partager.
              </p>
              <span>
                Scanner mon billet <ArrowRight size={14} />
              </span>
            </div>
          </button>

          <div className="trust-note bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5">
            <span>MOINS DE DISTANCE. PLUS DE LIEN.</span>
            <p>
              Un article trouvé ailleurs.
              <br />
              Un trajet déjà prévu.
              <br />
              Et quelqu’un pour vous rendre service.
            </p>
          </div>
        </aside>
      </div>

      <section
        className="express-arbitrage bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5"
        aria-labelledby="express-title"
      >
        <div className="express-heading">
          <span className="finance-icon">
            <Plane size={22} />
          </span>
          <div>
            <span className="eyebrow">ARBITRAGE EXPRESS</span>
            <h2 id="express-title">Calculateur de vol gratuit</h2>
            <p>Une destination. Des missions. Votre billet financé.</p>
          </div>
        </div>
        <div className="express-controls">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
            Votre destination
          </label>
          <div className="flex flex-wrap gap-2">
            {flightRoutes
              .filter((item) => item.id !== "par-alg")
              .map((item) => {
                const isSelected = item.id === flightRouteId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFlightRouteId(item.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-[#2563EB] text-white shadow-2xs"
                        : "bg-[#F8FAFC] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-700"
                    }`}
                  >
                    <span>{item.destination}</span>
                    <span className="text-[10px] opacity-75">
                      ({item.origin})
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
        <div
          className="express-result tabular-nums"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>Gain net estimé</span>
          <strong className="text-[#059669] tabular-nums">
            +{euro(demoCommission - flightPrice)}
          </strong>
          <small className="tabular-nums">
            {euro(demoCommission)} de commissions − {euro(flightPrice)} de vol
          </small>
        </div>
        <button
          className="primary-button bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl"
          onClick={() => onArbitrage(flightRouteId)}
        >
          Estimer ce voyage <ArrowRight size={17} />
        </button>
        <p className="express-disclaimer">
          Données tarifaires indicatives · Optimisation de capacité sur trajets
          vérifiés.
        </p>
      </section>

      <div className="discovery-bento">
        <LuggageVisualizer
          parcelWeights={requests
            .filter(
              (r) =>
                (worldwide || !r.market) &&
                (!r.status || r.status === "available"),
            )
            .flatMap((r) => (r.weightKg === undefined ? [] : [r.weightKg]))}
          onSelectCapacity={(kg) => {
            handleSelectUniverse("colis");
            reset();
            setWorldwide(worldwide);
            setCapacity(kg);
            document
              .getElementById("capacity-results")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
            document
              .getElementById("capacity-results")
              ?.focus({ preventScroll: true });
          }}
        />
        <section
          className="express-scan-card bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5"
          aria-labelledby="express-scan-title"
        >
          <span className="express-scan-icon">
            <ScanLine size={28} strokeWidth={1.5} />
          </span>
          <span className="eyebrow">VOTRE VOYAGE COMMENCE ICI</span>
          <h2 id="express-scan-title">Scanner mon billet d’avion express</h2>
          <p>
            Votre vol, votre franchise, votre prochaine mission. Retrouvez les
            informations de votre billet en un scan.
          </p>
          <button
            className="primary-button bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl"
            onClick={onScan}
          >
            Lancer le scan express <ArrowRight size={17} />
          </button>
        </section>
        <section
          className="market-guarantees bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5"
          aria-labelledby="market-guarantees-title"
        >
          <h2 id="market-guarantees-title">
            <ShieldCheck size={20} className="text-[#059669]" /> Votre réseau,
            en chiffres
          </h2>
          <dl className="tabular-nums">
            <div>
              <dt>Demandes d’achat</dt>
              <dd className="tabular-nums">{requests.length}</dd>
            </div>
            <div>
              <dt>Trajets proposés</dt>
              <dd className="tabular-nums">{trips.length}</dd>
            </div>
            <div>
              <dt>Modes de transport</dt>
              <dd className="tabular-nums">
                {new Set(trips.map((trip) => trip.transportType)).size}
              </dd>
            </div>
          </dl>
          <p>Estimez vos gains et convenez des modalités avant de réserver.</p>
        </section>
      </div>
    </div>
  );
}
