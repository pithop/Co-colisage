import { useState } from "react";
import { flightRoutes, demoCommission } from "../../data/flightSimulation";
import { Avatar } from "./Avatar";
import { LuggageVisualizer } from "./LuggageVisualizer";
import {
  ArrowRight,
  Award,
  CalendarDays,
  Car,
  ChevronDown,
  Globe2,
  MapPin,
  Package,
  Plane,
  Search,
  ScanLine,
  ShieldCheck,
  Ship,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  X,
  Zap,
} from "lucide-react";
import {
  PurchaseRequest,
  Trip,
  dateLabel,
  euro,
  normalize,
  timeLabel,
  vehicleLabel,
} from "../../data/marketplace";
import { CityAutocomplete } from "../common/CityAutocomplete";

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
  const isRequests = mode === "requests";
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
      (worldwide || !r.market) &&
      (!r.status || r.status === "available") &&
      matches(`${r.title} ${r.origin} ${r.destination}`) &&
      (!destination || normalize(r.destination).includes(normalize(destination))) &&
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
      (!destination || normalize(t.destination).includes(normalize(destination))) &&
      (!date || t.departureDate === date) &&
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
        { label: "Date", value: date },
        { label: "Budget", value: budget },
      ]
    : [
        { label: "Destination", value: destination },
        { label: "Date", value: date },
        { label: "Véhicule", value: vehicle },
        { label: "Dimensions", value: size },
      ];
  return (
    <div className="explorer-page">
      <section className="explore-heading">
        <div className="eyebrow">
          <span /> LES BONS TRAJETS FONT LES BONNES RENCONTRES
        </div>
        <h1>
          {isRequests ? (
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
            ? "Consultez les demandes ou publiez la vôtre."
            : "Consultez les offres ou proposez la vôtre."}
        </p>
      </section>
      <div className="explore-layout">
        <section className="listing-column" aria-label="Explorer les annonces">
          <div className="segment" aria-label="Type d’annonces">
            <button
              aria-pressed={isRequests}
              onClick={() => {
                onMode("requests");
                reset();
              }}
            >
              Demandes d’achat
            </button>
            <button
              aria-pressed={!isRequests}
              onClick={() => {
                onMode("trips");
                reset();
              }}
            >
              Transports
            </button>
          </div>
          <div className="catalogue-scope">
            <div><strong>Des trajets au-delà des frontières.</strong><p>Maghreb, Afrique de l’Ouest, Canada et Émirats.</p></div>
            <div role="group" aria-label="Catalogue d’annonces">
              <button aria-pressed={!worldwide} onClick={() => { setWorldwide(false); reset(); }}>Sélection</button>
              <button aria-pressed={worldwide} onClick={() => { reset(); setWorldwide(true); }}>Monde entier</button>
            </div>
          </div>
          {worldwide && <p className="network-indicator"><Globe2 size={14} aria-hidden="true" /> Réseau International Certifié · Départs réguliers France–Maghreb &amp; Transatlantique</p>}
          <div className="search-field">
            <Search size={20} />
            <input
              aria-label="Rechercher une annonce"
              placeholder={
                isRequests
                  ? "Article, ville ou destination"
                  : "Départ → Arrivée"
              }
              value={query}
              onChange={(e) => { setQuery(e.target.value); if (e.target.value.trim()) setWorldwide(true); }}
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
          <div
            className="quick-corridor-row"
            role="group"
            aria-label="Trajets populaires mondiaux"
          >
            {[
              "Paris → Alger",
              "Marseille → Oran",
              "Montréal → Alger",
              "Lyon → Constantine",
              "Paris → Casablanca",
              "Paris → Dubaï",
            ].map((route) => (
              <button
                key={route}
                type="button"
                className={`quick-corridor-chip ${query === route ? "active" : ""}`}
                onClick={() => {
                  setWorldwide(true);
                  setQuery(query === route ? "" : route);
                }}
              >
                {route}
              </button>
            ))}
          </div>
          <div className="filter-row">
            {capacity !== null && (
              <button
                className="filter-pill selected"
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
            <div className="filter-panel" id="listing-filter-panel">
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
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    Tous
                  </button>
                  {["Voiture", "Camionnette", "Bagage", "Avion", "Bateau"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVehicle(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        vehicle === v
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
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
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
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
          <div className="results-heading" id="capacity-results" tabIndex={-1}>
            <span aria-live="polite">
              {count}{" "}
              {isRequests ? "demandes à découvrir" : "trajets disponibles"}
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
          <div className="listing-stack">
            {isRequests
              ? visibleRequests.map((r) => (
                  <article
                    className="request-card"
                    key={r.id}
                    onClick={() => onRequest(r)}
                  >
                    <div className="request-top">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="product-thumb"
                      />
                      <div>
                        <span className="purchase-badge">
                          {r.kind === "parcel"
                            ? "Colis à transporter"
                            : "À acheter et livrer"}
                        </span>
                        <h2>{r.title}</h2>
                        <p className="route">
                          <MapPin size={15} />
                          {r.origin}
                          <ArrowRight size={15} />
                          {r.destination}
                        </p>
                      </div>
                    </div>
                    <div className="request-meta">
                      <span className="card-author">
                        <Avatar name={r.buyer} src={r.buyerAvatar} />
                        <span>
                          Demandé par <strong>{r.buyer}</strong>
                        </span>
                      </span>
                      <p className="card-date">
                        <CalendarDays size={15} /> Avant le {dateLabel(r.date)}
                      </p>
                    </div>
                    <div className="request-bottom">
                      <div>
                        <span>
                          {r.kind === "parcel" ? (
                            <>
                              Colis : <strong>{r.weightKg} kg</strong>
                            </>
                          ) : (
                            <>
                              Article : <strong>{euro(r.budget)} max</strong>
                            </>
                          )}
                        </span>
                        <span className="service-reward">
                          Service : <strong>{euro(r.reward)}</strong>
                        </span>
                      </div>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onRequest(r);
                        }}
                      >
                        Voir la demande <ArrowRight size={17} />
                      </button>
                      <button
                        className="go-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequest(r);
                        }}
                      >
                        Go ! <ArrowRight size={15} />
                      </button>
                    </div>
                  </article>
                ))
              : visibleTrips.map((t) => {
                  const Icon =
                    t.transportType === "voiture"
                      ? Car
                      : t.transportType === "camion"
                        ? Truck
                        : t.transportType === "bateau"
                          ? Ship
                          : Plane;
                  return (
                    <article
                      className="trip-card"
                      key={t.id}
                      onClick={() => onTrip(t)}
                    >
                      <div className="trip-person">
                        <Avatar name={t.travelerName} src={t.travelerAvatar} />
                        <div>
                          <h2>
                            {t.travelerName}
                            <span className="rating">
                              <Star size={13} fill="currentColor" />
                              {t.rating ? t.rating.toFixed(1) : "Nouveau"}
                            </span>
                          </h2>
                          <p>{t.transportLabel}</p>
                        </div>
                        {t.image ? (
                          <img
                            className="vehicle-illustration"
                            src={t.image}
                            alt={vehicleLabel(t)}
                          />
                        ) : (
                          <Icon
                            className="vehicle-illustration"
                            size={36}
                            strokeWidth={1.3}
                          />
                        )}
                      </div>
                      <div className="trip-status-badges">
                        {t.autoAccept && (
                          <span className="instant-badge">
                            <Zap size={13} /> Acceptation automatique
                          </span>
                        )}
                        {t.isSuperTraveler && (
                          <span className="super-traveler-badge">
                            <Award size={13} /> Super Voyageur
                          </span>
                        )}
                      </div>
                      <h3 className="trip-route">
                        {t.origin}
                        <ArrowRight size={19} />
                        {t.destination}
                      </h3>
                      <p className="card-date">
                        <CalendarDays size={15} />
                        {dateLabel(t.departureDate)} · Départ{" "}
                        {timeLabel(t.departureTime)}
                      </p>
                      <div className="trip-bottom">
                        <div>
                          <div className="trip-badges">
                            <span>
                              <Icon size={13} />
                              {vehicleLabel(t)}
                            </span>
                            <span>
                              <Package size={13} />
                              {t.capacity || `${t.availableKg} kg disponibles`}
                            </span>
                          </div>
                          {t.dimensions && <p>Espace : {t.dimensions}</p>}
                          {t.startingPrice && (
                            <p>
                              À partir de{" "}
                              <strong>{euro(t.startingPrice)}</strong>
                            </p>
                          )}
                        </div>
                        <button
                          className="outline-button small"
                          onClick={(event) => {
                            event.stopPropagation();
                            onTrip(t);
                          }}
                        >
                          Voir le trajet <ArrowRight size={14} />
                        </button>
                      </div>
                    </article>
                  );
                })}
            {!count && (
              <div className="empty-state">
                <Search size={30} />
                <h2>Aucune annonce pour le moment</h2>
                <p>Essayez une autre ville ou élargissez vos filtres.</p>
                <button className="outline-button" onClick={reset}>
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </section>
        <aside className="discovery-column">
          <button className="arbitrage-teaser" onClick={() => onArbitrage()}>
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
          <button className="scanner-teaser" onClick={onScan}>
            <span className="scanner-icon">
              <Plane size={23} />
            </span>
            <div>
              <h3>Un billet, de la place ?</h3>
              <p>
                Scannez votre billet d’avion.
                <br />
                10 kg de franchise = 9 kg à partager.
              </p>
              <span>
                Scanner mon billet <ArrowRight size={14} />
              </span>
            </div>
          </button>
          <div className="trust-note">
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
      <section className="express-arbitrage" aria-labelledby="express-title">
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
                        ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600 ring-offset-1"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{item.destination}</span>
                    <span className="text-[10px] opacity-75">({item.origin})</span>
                  </button>
                );
              })}
          </div>
        </div>
        <div
          className="express-result"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>Gain net estimé</span>
          <strong>+{euro(demoCommission - flightPrice)}</strong>
          <small>
            {euro(demoCommission)} de commissions − {euro(flightPrice)} de vol
          </small>
        </div>
        <button
          className="primary-button"
          onClick={() => onArbitrage(flightRouteId)}
        >
          Estimer ce voyage <ArrowRight size={17} />
        </button>
        <p className="express-disclaimer">
          Données tarifaires indicatives · Optimisation de fret avec références IATA.
        </p>
      </section>
      <div className="discovery-bento">
        <LuggageVisualizer
          parcelWeights={requests.filter(r => (worldwide || !r.market) && (!r.status || r.status === "available")).flatMap((r) =>
            r.weightKg === undefined ? [] : [r.weightKg],
          )}
          onSelectCapacity={(kg) => {
            onMode("requests");
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
          className="express-scan-card"
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
          <button className="primary-button" onClick={onScan}>
            Lancer le scan express <ArrowRight size={17} />
          </button>
        </section>
        <section
          className="market-guarantees"
          aria-labelledby="market-guarantees-title"
        >
          <h2 id="market-guarantees-title">
            <ShieldCheck size={20} /> Votre réseau, en chiffres
          </h2>
          <dl>
            <div>
              <dt>Demandes d’achat</dt>
              <dd>{requests.length}</dd>
            </div>
            <div>
              <dt>Trajets proposés</dt>
              <dd>{trips.length}</dd>
            </div>
            <div>
              <dt>Modes de transport</dt>
              <dd>{new Set(trips.map((trip) => trip.transportType)).size}</dd>
            </div>
          </dl>
          <p>Estimez vos gains et convenez des modalités avant de réserver.</p>
        </section>
      </div>
    </div>
  );
}
