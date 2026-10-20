import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Package,
  Plane,
  Radio,
  Search,
  Ship,
  Waves,
  Wind,
  X,
} from "lucide-react";
import {
  flightFerryRadarApi,
  radarStatusLabels,
  type RadarKind,
  type RadarMovement,
} from "../../services/flightFerryRadarApi";
import { useModalFocus } from "../../hooks/useModalFocus";
import { InteractiveMediterraneanMap } from "./InteractiveMediterraneanMap";
const time = (value: number) =>
  new Date(value).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
const price = (value: number) =>
  value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
function TelemetryDrawer({
  movement: m,
  onClose,
  onShip,
}: {
  movement: RadarMovement;
  onClose: () => void;
  onShip: (movement: RadarMovement) => void;
}) {
  const ref = useModalFocus(true, onClose);
  return (
    <div
      className="bv-telemetry-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className="bv-telemetry"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bv-telemetry-title"
      >
        <header>
          <span className="bv-eyebrow">TÉLÉMÉTRIE OPÉRATIONNELLE</span>
          <button
            className="bv-icon-button"
            aria-label="Fermer la télémétrie"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>
        <div className="bv-vehicle-emblem">
          {m.kind === "flight" ? <Plane size={36} /> : <Ship size={36} />}
        </div>
        <p className="bv-eyebrow">{m.operator}</p>
        <h2 id="bv-telemetry-title">
          {m.kind === "flight" ? m.reference : m.vehicle}
        </h2>
        <p className="bv-muted">
          {m.kind === "flight" ? m.vehicle : m.reference} · Données simulées
        </p>
        <div className="bv-route-pair">
          <div>
            <strong>{m.origin.code.replace("-PORT", "")}</strong>
            <span>{m.origin.name}</span>
          </div>
          <ArrowRight size={24} />
          <div>
            <strong>{m.destination.code.replace("-PORT", "")}</strong>
            <span>{m.destination.name}</span>
          </div>
        </div>
        <div className="bv-inline-between">
          <span className="bv-status-pill">{radarStatusLabels[m.status]}</span>
          <span>{Math.round(m.progress * 100)} % du trajet</span>
        </div>
        <progress
          className="bv-progress"
          value={m.progress}
          max={1}
          aria-label="Progression du trajet"
        />
        <dl className="bv-telemetry-grid">
          {[
            ["Départ UTC", time(m.departureAt)],
            ["Arrivée UTC", time(m.arrivalAt)],
            ["Altitude", `${m.altitudeM.toLocaleString("fr-FR")} m`],
            ["Vitesse sol", `${m.groundSpeedKmh} km/h`],
            ["Cap", `${Math.round(m.heading)}°`],
            ["Distance restante", `${Math.round(m.remainingKm)} km`],
            ["Latitude", `${m.position.latitude.toFixed(4)}°`],
            ["Longitude", `${m.position.longitude.toFixed(4)}°`],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <section className="bv-weather">
          <h3>
            {m.kind === "ferry" ? <Waves size={18} /> : <Wind size={18} />}{" "}
            Conditions simulées
          </h3>
          <p>
            {m.weather.description} · {m.weather.temperatureC} °C
          </p>
          <p>
            Vent {m.weather.windKmh} km/h à {m.weather.windDirection}°
            {m.weather.waveHeightM !== null
              ? ` · Houle ${m.weather.waveHeightM.toLocaleString("fr-FR")} m`
              : ""}
          </p>
        </section>
        <section className="bv-cargo">
          <div className="bv-inline-between">
            <h3>Capacité BagVoyage</h3>
            <Package size={19} />
          </div>
          <p>
            <strong>{m.availableKg.toLocaleString("fr-FR")} kg</strong>{" "}
            disponibles sur {m.capacityKg.toLocaleString("fr-FR")} kg
          </p>
          <meter
            min={0}
            max={m.capacityKg}
            value={m.availableKg}
            aria-label="Fret disponible"
          />
          <div className="bv-inline-between">
            <span>Tarif indicatif</span>
            <strong>{price(m.pricePerKg)} / kg</strong>
          </div>
        </section>
        <button
          className="bv-primary"
          disabled={
            m.status === "moving" ||
            m.status === "arrived" ||
            m.availableKg <= 0
          }
          onClick={() => onShip(m)}
        >
          {m.kind === "flight"
            ? "Expédier un colis sur ce vol"
            : "Expédier sur cette traversée"}
          <ArrowUpRight size={18} />
        </button>
        <p className="bv-fine-print">
          {m.status === "moving" || m.status === "arrived"
            ? "Ce départ ne prend plus de nouveaux colis. Choisissez un trajet à venir."
            : "Préparez une demande. La disponibilité sera à confirmer avec le transporteur."}
        </p>
      </div>
    </div>
  );
}
export function InteractiveRadarPage({
  onShip,
  initialReference,
}: {
  initialReference?: string;
  onShip: (movement: RadarMovement) => void;
}) {
  const [snapshot, setSnapshot] = useState(flightFerryRadarApi.getSnapshot);
  const [filter, setFilter] = useState<"all" | RadarKind>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<
    "departureAt" | "availableKg" | "pricePerKg"
  >("departureAt");
  const [ascending, setAscending] = useState(true);
  const [selectedId, setSelectedId] = useState<string>();
  useEffect(() => {
    if (initialReference)
      setSelectedId(
        flightFerryRadarApi
          .getSnapshot()
          .movements.find(
            (m) => encodeURIComponent(m.reference) === initialReference,
          )?.id,
      );
  }, [initialReference]);
  useEffect(() => flightFerryRadarApi.subscribe(setSnapshot), []);
  const movements = useMemo(
    () =>
      snapshot.movements
        .filter(
          (m) =>
            (filter === "all" || m.kind === filter) &&
            `${m.reference} ${m.operator} ${m.vehicle} ${m.origin.code} ${m.origin.name} ${m.destination.code} ${m.destination.name}`
              .toLocaleLowerCase("fr")
              .includes(query.trim().toLocaleLowerCase("fr")),
        )
        .sort((a, b) => (a[sort] - b[sort]) * (ascending ? 1 : -1)),
    [snapshot, filter, query, sort, ascending],
  );
  const selected = snapshot.movements.find((m) => m.id === selectedId);
  const available = snapshot.movements
    .filter((m) => m.status === "scheduled" || m.status === "boarding")
    .reduce((sum, m) => sum + m.availableKg, 0);
  return (
    <div className="bv-expansion bv-radar-page">
      <header className="bv-page-heading">
        <div>
          <span className="bv-eyebrow">
            <Radio size={14} /> LE PONT ENTRE DEUX RIVES
          </span>
          <h1>
            La Méditerranée,
            <br />
            <em>en mouvement.</em>
          </h1>
          <p>Chaque trajet ouvre une nouvelle possibilité.</p>
        </div>
        <div className="bv-radar-clock">
          <span className="bv-status-pill">
            <span className="bv-live-dot" /> Simulation active
          </span>
          <time dateTime={new Date(snapshot.updatedAt).toISOString()}>
            {time(snapshot.updatedAt)} <small>UTC</small>
          </time>
          <span>Actualisation chaque seconde</span>
        </div>
      </header>
      <div className="bv-kpis">
        {[
          {
            label: "Vols en route",
            value: snapshot.movements.filter(
              (m) => m.kind === "flight" && m.status === "moving",
            ).length,
            Icon: Plane,
            detail: "Corridors aériens",
          },
          {
            label: "Ferries en mer",
            value: snapshot.movements.filter(
              (m) => m.kind === "ferry" && m.status === "moving",
            ).length,
            Icon: Ship,
            detail: "Liaisons maritimes",
          },
          {
            label: "Fret à réserver",
            value: `${available.toLocaleString("fr-FR")} kg`,
            Icon: Package,
            detail: "Sur les prochains départs",
          },
          {
            label: "Deux rives, un réseau",
            value: "FR / DZ",
            Icon: Compass,
            detail: "France et Algérie",
          },
        ].map(({ label, value, Icon, detail }) => (
          <section key={label}>
            <div>
              <span>{label}</span>
              <Icon size={18} />
            </div>
            <strong>{value}</strong>
            <p>{detail}</p>
          </section>
        ))}
      </div>
      <section
        className="bv-radar-workspace"
        aria-label="Explorateur des liaisons"
      >
        <div className="bv-radar-toolbar">
          <div
            className="bv-segmented"
            role="group"
            aria-label="Type de transport"
          >
            {(
              [
                { id: "all", label: "Tous", Icon: Radio },
                { id: "flight", label: "Vols", Icon: Plane },
                { id: "ferry", label: "Ferries", Icon: Ship },
              ] as const
            ).map(({ id, label, Icon }) => (
              <button
                key={id}
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
              >
                <Icon size={16} />
                {label}
                <span>
                  {
                    snapshot.movements.filter(
                      (m) => id === "all" || m.kind === id,
                    ).length
                  }
                </span>
              </button>
            ))}
          </div>
          <span className="bv-toolbar-note">
            France <ArrowRight size={14} /> Algérie <span> / </span> Aller et
            retour
          </span>
        </div>
        <InteractiveMediterraneanMap
          movements={movements}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <div className="bv-manifest-heading">
          <div>
            <span className="bv-eyebrow">LE RÉSEAU BAGVOYAGE</span>
            <h2>
              Manifeste du jour <span>{movements.length}</span>
            </h2>
          </div>
          <label className="bv-search">
            <Search size={17} />
            <input
              aria-label="Rechercher une liaison"
              placeholder="Vol, navire, ville…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        <div className="bv-table-scroll">
          <table className="bv-manifest">
            <caption className="sr-only">
              Liaisons de démonstration, horaires UTC. Sélectionnez une liaison
              pour sa télémétrie.
            </caption>
            <thead>
              <tr>
                <th scope="col">Liaison / Opérateur</th>
                <th scope="col">Itinéraire</th>
                {(
                  [
                    { key: "departureAt", label: "Départ UTC" },
                    { key: "availableKg", label: "Fret libre" },
                    { key: "pricePerKg", label: "Tarif / kg" },
                  ] as const
                ).map(({ key, label }) => (
                  <th
                    key={key}
                    scope="col"
                    aria-sort={
                      sort === key
                        ? ascending
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <button
                      onClick={() => {
                        setSort(key);
                        setAscending(sort === key ? !ascending : true);
                      }}
                    >
                      {label}
                      <ArrowDownUp size={13} />
                    </button>
                  </th>
                ))}
                <th scope="col">Statut</th>
                <th scope="col">
                  <span className="sr-only">Détails</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id}>
                  <td>
                    <button
                      className="bv-manifest-identity"
                      onClick={() => setSelectedId(m.id)}
                    >
                      <span>
                        {m.kind === "flight" ? (
                          <Plane size={19} />
                        ) : (
                          <Ship size={19} />
                        )}
                      </span>
                      <span>
                        <strong>
                          {m.kind === "flight" ? m.reference : m.vehicle}
                        </strong>
                        <small>{m.operator}</small>
                      </span>
                    </button>
                  </td>
                  <td>
                    <span className="bv-table-route">
                      {m.origin.code.replace("-PORT", "")}
                      <ArrowRight size={13} />
                      {m.destination.code.replace("-PORT", "")}
                    </span>
                  </td>
                  <td>
                    <strong>{time(m.departureAt)}</strong>
                    <small>
                      {new Date(m.departureAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        timeZone: "UTC",
                      })}
                    </small>
                  </td>
                  <td>
                    <strong>{m.availableKg.toLocaleString("fr-FR")} kg</strong>
                    <meter
                      value={m.availableKg}
                      min={0}
                      max={m.capacityKg}
                      aria-label={`Capacité disponible ${m.reference}`}
                    />
                  </td>
                  <td>{price(m.pricePerKg)}</td>
                  <td>
                    <span className={`bv-status-pill ${m.status}`}>
                      {radarStatusLabels[m.status]}
                    </span>
                  </td>
                  <td>
                    <button
                      className="bv-icon-button"
                      aria-label={`Détails ${m.reference}`}
                      onClick={() => setSelectedId(m.id)}
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!movements.length && (
          <div className="bv-empty">
            <Search size={30} />
            <h3>Aucune liaison trouvée</h3>
            <p>Essayez une autre ville ou un autre transport.</p>
            <button
              className="bv-secondary"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
        <footer className="bv-manifest-footer">
          <span className="bv-live-dot" />
          <p>
            Positions géodésiques calculées. Horaires, affectations, météo et
            capacités simulés, sans connexion ADS-B ou AIS.
          </p>
        </footer>
      </section>
      {selected && (
        <TelemetryDrawer
          movement={selected}
          onClose={() => setSelectedId(undefined)}
          onShip={(m) => {
            setSelectedId(undefined);
            onShip(m);
          }}
        />
      )}
    </div>
  );
}
