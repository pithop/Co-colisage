import { useState } from "react";
import { flightRoutes, demoCommission } from "../../data/flightSimulation";
import { Avatar } from "./Avatar";
import {
  ArrowRight,
  CalendarDays,
  Car,
  ChevronDown,
  MapPin,
  Package,
  Plane,
  Search,
  Ship,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  X,
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
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [size, setSize] = useState("");
  const [filter, setFilter] = useState("");
  const isRequests = mode === "requests";
  const reset = () => {
    setQuery("");
    setDestination("");
    setDate("");
    setBudget("");
    setVehicle("");
    setSize("");
    setFilter("");
  };
  const words = normalize(query)
    .split(/[\s→→]+/)
    .filter(Boolean);
  const matches = (text: string) =>
    words.every((word) => normalize(text).includes(word));
  const visibleRequests = requests.filter(
    (r) =>
      matches(`${r.title} ${r.origin} ${r.destination}`) &&
      (!destination || r.destination === destination) &&
      (!date || r.date <= date) &&
      (!budget || r.budget <= Number(budget)),
  );
  const visibleTrips = trips.filter(
    (t) =>
      matches(
        `${t.travelerName} ${t.origin} ${t.destination} ${t.transportLabel}`,
      ) &&
      (!date || t.departureDate === date) &&
      (!vehicle || vehicleLabel(t) === vehicle) &&
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
        { label: "Date", value: date },
        { label: "Véhicule", value: vehicle },
        { label: "Dimensions", value: size },
      ];
  return (
    <>
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
          <label htmlFor="express-destination">Votre destination</label>
          <select
            id="express-destination"
            value={flightRouteId}
            onChange={(e) => setFlightRouteId(e.target.value)}
          >
            {flightRoutes
              .filter((item) => item.id !== "par-alg")
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.destination} · depuis {item.origin}
                </option>
              ))}
          </select>
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
          Simuler ce voyage <ArrowRight size={17} />
        </button>
        <p className="express-disclaimer">
          Commandes en attente fictives · tarifs indicatifs · estimation hors
          achats, bagages et frais.
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
              onChange={(e) => setQuery(e.target.value)}
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
                <select
                  id="filter-value"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="">Toutes les destinations</option>
                  {[...new Set(requests.map((r) => r.destination))].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
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
                <select
                  id="filter-value"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                >
                  <option value="">Tous les véhicules</option>
                  {["Voiture", "Camionnette", "Bagage", "Avion", "Bateau"].map(
                    (v) => (
                      <option key={v}>{v}</option>
                    ),
                  )}
                </select>
              )}
              {filter === "Dimensions" && (
                <select
                  id="filter-value"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <option value="">Tous les formats</option>
                  <option value="small">Bagage · au moins 5 kg</option>
                  <option value="large">Cartons ou petit meuble</option>
                </select>
              )}
              <button className="text-button" onClick={() => setFilter("")}>
                Appliquer
              </button>
            </div>
          )}
          <div className="results-heading">
            <span aria-live="polite">
              {count}{" "}
              {isRequests ? "demandes à découvrir" : "trajets disponibles"}
            </span>
            {query || destination || date || budget || vehicle || size ? (
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
                          À acheter et livrer
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
                          Article : <strong>{euro(r.budget)} max</strong>
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
    </>
  );
}
