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
  ShieldCheck,
  Ship,
  TrendingUp,
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
import { corridorLabels, type Corridor } from "../../data/international";

const time = (value: number) =>
  new Date(value).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

const price = (value: number) =>
  value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

function computeArbitrageMetrics(m: RadarMovement) {
  const grossFreight = Math.round(m.availableKg * m.pricePerKg);
  const estimatedTicketCost =
    m.kind === "flight"
      ? Math.min(140, Math.max(55, Math.round(grossFreight * 0.32)))
      : Math.min(180, Math.max(75, Math.round(grossFreight * 0.28)));
  const netGain = Math.max(
    45,
    grossFreight - estimatedTicketCost,
  );
  return {
    grossFreight,
    estimatedTicketCost,
    netGain,
  };
}

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
  const { grossFreight, estimatedTicketCost, netGain } =
    computeArbitrageMetrics(m);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className="w-full max-w-md h-full overflow-y-auto p-6 sm:p-8 backdrop-blur-md bg-slate-900/80 border-l border-white/10 text-white shadow-2xl space-y-6 tabular-nums"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bv-telemetry-title"
      >
        <header className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-300">
            <Radio size={14} className="text-[#059669]" />
            TÉLÉMÉTRIE OPÉRATIONNELLE
          </span>
          <button
            type="button"
            className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fermer la télémétrie"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
            {m.kind === "flight" ? <Plane size={28} /> : <Ship size={28} />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {m.operator}
            </p>
            <h2
              id="bv-telemetry-title"
              className="text-2xl font-extrabold tracking-tight text-white"
            >
              {m.kind === "flight" ? m.reference : m.vehicle}
            </h2>
            <p className="text-xs text-slate-400">
              {m.kind === "flight" ? m.vehicle : m.reference} · Simulation temps réel
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
          <div>
            <strong className="text-xl font-black text-white block">
              {m.origin.code.replace("-PORT", "")}
            </strong>
            <span className="text-xs text-slate-400">{m.origin.name}</span>
          </div>
          <ArrowRight size={20} className="text-slate-400 shrink-0" />
          <div className="text-right">
            <strong className="text-xl font-black text-white block">
              {m.destination.code.replace("-PORT", "")}
            </strong>
            <span className="text-xs text-slate-400">{m.destination.name}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-slate-200 font-bold">
              {radarStatusLabels[m.status]}
            </span>
            <span className="text-slate-300 font-bold tabular-nums">
              {Math.round(m.progress * 100)} % du trajet
            </span>
          </div>
          <progress
            className="bv-progress w-full"
            value={m.progress}
            max={1}
            aria-label="Progression du trajet"
          />
        </div>

        {/* Carte d'opportunité d'arbitrage dans le tiroir */}
        <section className="p-5 rounded-2xl bg-[#059669]/15 border border-[#059669]/30 space-y-3 tabular-nums">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <TrendingUp size={15} className="text-[#059669]" />
              Opportunité d&apos;arbitrage
            </span>
            <span className="text-xs font-bold text-slate-200 tabular-nums">
              {price(m.pricePerKg)} / kg
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs text-slate-300">Gain net estimé</span>
            <strong className="text-2xl font-black text-[#059669] tabular-nums">
              +{price(netGain)}
            </strong>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block">Fret disponible</span>
              <strong className="text-white tabular-nums">
                {m.availableKg.toLocaleString("fr-FR")} kg /{" "}
                {m.capacityKg.toLocaleString("fr-FR")} kg
              </strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Revenu fret potentiel</span>
              <strong className="text-[#059669] tabular-nums">
                +{price(grossFreight)} (billet ~{price(estimatedTicketCost)})
              </strong>
            </div>
          </div>
        </section>

        <dl className="grid grid-cols-2 gap-3 text-xs">
          {[
            ["Départ UTC", time(m.departureAt)],
            ["Arrivée UTC", time(m.arrivalAt)],
            ["Altitude", `${m.altitudeM.toLocaleString("fr-FR")} m`],
            ["Vitesse sol", `${m.groundSpeedKmh} km/h`],
            ["Cap", `${Math.round(m.heading)}°`],
            ["Distance restante", `${Math.round(m.remainingKm)} km`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <dt className="text-slate-400 mb-1">{label}</dt>
              <dd className="font-bold text-white text-sm tabular-nums m-0">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <section className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs">
          <h3 className="font-bold text-slate-200 flex items-center gap-2">
            {m.kind === "ferry" ? <Waves size={16} /> : <Wind size={16} />}
            Conditions météo
          </h3>
          <p className="text-slate-300">
            {m.weather.description} · {m.weather.temperatureC} °C · Vent{" "}
            {m.weather.windKmh} km/h
            {m.weather.waveHeightM !== null
              ? ` · Houle ${m.weather.waveHeightM.toLocaleString("fr-FR")} m`
              : ""}
          </p>
        </section>

        <button
          type="button"
          className="w-full py-3.5 px-5 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
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
  const [corridor, setCorridor] = useState<"all" | Corridor>("all");
  const [page, setPage] = useState(0);
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
            (corridor === "all" || m.corridor === corridor) &&
            `${m.reference} ${m.operator} ${m.vehicle} ${m.origin.code} ${m.origin.name} ${m.destination.code} ${m.destination.name}`
              .toLocaleLowerCase("fr")
              .includes(query.trim().toLocaleLowerCase("fr")),
        )
        .sort((a, b) => (a[sort] - b[sort]) * (ascending ? 1 : -1)),
    [snapshot, filter, query, sort, ascending, corridor],
  );

  useEffect(() => setPage(0), [filter, query, sort, ascending, corridor]);

  const pageCount = Math.max(1, Math.ceil(movements.length / 9));
  const visibleMovements = movements.slice(
    Math.min(page, pageCount - 1) * 9,
    (Math.min(page, pageCount - 1) + 1) * 9,
  );
  const selected = snapshot.movements.find((m) => m.id === selectedId);
  const available = snapshot.movements
    .filter((m) => m.status === "scheduled" || m.status === "boarding")
    .reduce((sum, m) => sum + m.availableKg, 0);

  // Liaison mise en avant dans la carte d'opportunité d'arbitrage latérale
  const featuredArbitrage = useMemo(() => {
    if (selected) return selected;
    const bookable = movements.filter(
      (m) =>
        (m.status === "scheduled" || m.status === "boarding") &&
        m.availableKg > 0,
    );
    if (bookable.length > 0) {
      return [...bookable].sort(
        (a, b) =>
          computeArbitrageMetrics(b).netGain -
          computeArbitrageMetrics(a).netGain,
      )[0];
    }
    return movements[0] ?? snapshot.movements[0];
  }, [selected, movements, snapshot.movements]);

  const arbitrageMetrics = featuredArbitrage
    ? computeArbitrageMetrics(featuredArbitrage)
    : { grossFreight: 0, estimatedTicketCost: 0, netGain: 0 };

  return (
    <div className="bv-expansion bv-radar-page bg-[#0F172A] text-white rounded-2xl p-4 sm:p-6 lg:p-8 space-y-6 tabular-nums">
      {/* En-tête Radar Thème Sombre #0F172A */}
      <header className="backdrop-blur-md bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-extrabold uppercase tracking-widest text-slate-300">
            <Radio size={14} className="text-[#059669]" />
            RADAR MULTIMODAL &amp; ARBITRAGE CORRIDORS
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Le réseau mondial en direct
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Suivez les vols et traversées maritimes en temps réel et identifiez les meilleures opportunités d&apos;arbitrage bagage.
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-1.5 tabular-nums">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#059669]/20 border border-[#059669]/40 text-xs font-bold text-[#059669] w-fit">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            Télémétrie active
          </span>
          <time
            dateTime={new Date(snapshot.updatedAt).toISOString()}
            className="text-2xl sm:text-3xl font-black text-white tabular-nums"
          >
            {time(snapshot.updatedAt)}{" "}
            <small className="text-xs font-semibold text-slate-400">UTC</small>
          </time>
          <span className="text-xs text-slate-400">
            Actualisation chaque seconde
          </span>
        </div>
      </header>

      {/* Grille KPI Glassmorphism */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
        {[
          {
            label: "Vols en route",
            value: snapshot.movements.filter(
              (m) => m.kind === "flight" && m.status === "moving",
            ).length,
            Icon: Plane,
            detail: "Corridors aériens actifs",
            accent: false,
          },
          {
            label: "Ferries en mer",
            value: snapshot.movements.filter(
              (m) => m.kind === "ferry" && m.status === "moving",
            ).length,
            Icon: Ship,
            detail: "Liaisons maritimes",
            accent: false,
          },
          {
            label: "Fret à réserver",
            value: `${available.toLocaleString("fr-FR")} kg`,
            Icon: Package,
            detail: "Capacité disponible",
            accent: true,
          },
          {
            label: "Gain net max estimé",
            value: `+${price(arbitrageMetrics.netGain)}`,
            Icon: TrendingUp,
            detail: "Meilleur arbitrage actif",
            accent: true,
          },
        ].map(({ label, value, Icon, detail, accent }) => (
          <section
            key={label}
            className="backdrop-blur-md bg-slate-900/80 border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-400">
              <span>{label}</span>
              <Icon
                size={16}
                className={accent ? "text-[#059669]" : "text-slate-300"}
              />
            </div>
            <strong
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${
                accent ? "text-[#059669]" : "text-white"
              }`}
            >
              {value}
            </strong>
            <p className="text-xs text-slate-400">{detail}</p>
          </section>
        ))}
      </div>

      {/* Espace principal : Carte + Panneaux latéraux Glassmorphism */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Colonne Carte & Filtres (8 cols sur desktop) */}
        <section
          className="xl:col-span-8 backdrop-blur-md bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden"
          aria-label="Explorateur des liaisons"
        >
          <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                className="inline-flex p-1 rounded-xl bg-slate-950/80 border border-white/10 gap-1"
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
                    type="button"
                    aria-pressed={filter === id}
                    onClick={() => setFilter(id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer tabular-nums ${
                      filter === id
                        ? "bg-[#2563EB] text-white"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                    <span className="opacity-80">
                      (
                      {
                        snapshot.movements.filter(
                          (m) => id === "all" || m.kind === id,
                        ).length
                      }
                      )
                    </span>
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-300 min-w-[220px]">
                <Search size={15} className="text-slate-400" />
                <input
                  aria-label="Rechercher une liaison"
                  placeholder="Vol, navire, ville…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent border-0 outline-none text-white placeholder:text-slate-500 w-full text-xs"
                />
              </label>
            </div>

            <div
              className="flex flex-wrap gap-1.5"
              role="radiogroup"
              aria-label="Filtrer par corridor"
            >
              <button
                type="button"
                role="radio"
                aria-checked={corridor === "all"}
                onClick={() => setCorridor("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  corridor === "all"
                    ? "bg-white text-slate-900 border-white"
                    : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                }`}
              >
                Tous les corridors
              </button>
              {Object.entries(corridorLabels).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={corridor === key}
                  onClick={() => setCorridor(key as Corridor)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    corridor === key
                      ? "bg-white text-slate-900 border-white"
                      : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <InteractiveMediterraneanMap
            movements={movements}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>

        {/* Panneaux latéraux Glassmorphism épurés (4 cols sur desktop) */}
        <aside
          className="xl:col-span-4 space-y-6"
          aria-label="Opportunité d'arbitrage et télémétrie"
        >
          {/* Carte d'opportunité d'arbitrage ultra-lisible mettant en avant le gain net en #059669 */}
          {featuredArbitrage && (
            <section
              className="backdrop-blur-md bg-slate-900/80 border border-white/10 rounded-2xl p-6 space-y-5 tabular-nums"
              aria-label="Carte d'opportunité d'arbitrage"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#059669]/20 border border-[#059669]/40 text-xs font-extrabold text-[#059669]">
                  <TrendingUp size={13} />
                  Opportunité d&apos;Arbitrage
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {featuredArbitrage.reference}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-xl font-black text-white">
                    {featuredArbitrage.origin.name} →{" "}
                    {featuredArbitrage.destination.name}
                  </strong>
                </div>
                <p className="text-xs text-slate-400">
                  {featuredArbitrage.operator} ·{" "}
                  {featuredArbitrage.origin.code.replace("-PORT", "")} →{" "}
                  {featuredArbitrage.destination.code.replace("-PORT", "")} ·{" "}
                  Départ {time(featuredArbitrage.departureAt)} UTC
                </p>
              </div>

              {/* Mise en avant ultra-lisible du Gain Net en #059669 */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-[#059669]/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-300">
                    Gain net voyageur
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#059669] font-bold">
                    <ShieldCheck size={14} /> Billet amorti
                  </span>
                </div>
                <strong
                  className="block text-3xl sm:text-4xl font-black text-[#059669] tracking-tight tabular-nums"
                  data-testid="radar-arbitrage-net-gain"
                >
                  +{price(arbitrageMetrics.netGain)}
                </strong>
                <p className="text-xs text-slate-400">
                  Basé sur {featuredArbitrage.availableKg} kg disponibles à{" "}
                  {price(featuredArbitrage.pricePerKg)} / kg.
                </p>
              </div>

              {/* Détail mathématique de l'arbitrage */}
              <dl className="space-y-2.5 text-xs border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-400">
                    Commissions fret ({featuredArbitrage.availableKg} kg)
                  </dt>
                  <dd className="font-bold text-[#059669] tabular-nums">
                    +{price(arbitrageMetrics.grossFreight)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-400">
                    Coût billet indicatif ({featuredArbitrage.kind === "flight" ? "Vol" : "Traversée"})
                  </dt>
                  <dd className="font-semibold text-slate-300 tabular-nums">
                    −{price(arbitrageMetrics.estimatedTicketCost)}
                  </dd>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <dt className="font-bold text-white">Bénéfice net estimé</dt>
                  <dd className="font-extrabold text-[#059669] text-sm tabular-nums">
                    +{price(arbitrageMetrics.netGain)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => onShip(featuredArbitrage)}
                disabled={
                  featuredArbitrage.status === "moving" ||
                  featuredArbitrage.status === "arrived" ||
                  featuredArbitrage.availableKg <= 0
                }
                className="w-full py-3.5 px-5 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Réserver ce créneau de fret</span>
                <ArrowUpRight size={18} />
              </button>
            </section>
          )}

          {/* Panneau latéral Glassmorphism : Liaison sélectionnée / Télémétrie */}
          {featuredArbitrage && (
            <section
              className="backdrop-blur-md bg-slate-900/80 border border-white/10 rounded-2xl p-6 space-y-4 tabular-nums"
              aria-label="Paramètres de vol en direct"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Compass size={16} className="text-blue-400" />
                  Télémétrie liaison
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedId(featuredArbitrage.id)}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Ouvrir fiche complète
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block">Vitesse sol</span>
                  <strong className="text-sm font-bold text-white tabular-nums">
                    {featuredArbitrage.groundSpeedKmh} km/h
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block">Distance restante</span>
                  <strong className="text-sm font-bold text-white tabular-nums">
                    {Math.round(featuredArbitrage.remainingKm)} km
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block">Capacité libre</span>
                  <strong className="text-sm font-bold text-[#059669] tabular-nums">
                    {featuredArbitrage.availableKg} kg
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block">Tarif / kg</span>
                  <strong className="text-sm font-bold text-[#059669] tabular-nums">
                    {price(featuredArbitrage.pricePerKg)}
                  </strong>
                </div>
              </div>
            </section>
          )}
        </aside>
      </div>

      {/* Manifeste du jour en Glassmorphism sombre */}
      <section
        className="backdrop-blur-md bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden"
        aria-label="Manifeste des liaisons"
      >
        <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              LE RÉSEAU BAGVOYAGE
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2.5 mt-1">
              Manifeste du jour
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-200 tabular-nums">
                {movements.length}
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Cliquez sur une liaison pour inspecter sa télémétrie et son gain net d&apos;arbitrage.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap text-xs tabular-nums">
            <caption className="sr-only">
              Liaisons régulières et vols charters directs. Sélectionnez une liaison
              pour sa télémétrie.
            </caption>
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 uppercase text-[11px]">
                <th scope="col" className="py-3.5 pl-6 pr-4 font-bold">
                  Liaison / Opérateur
                </th>
                <th scope="col" className="py-3.5 px-4 font-bold">
                  Itinéraire
                </th>
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
                    className="py-3.5 px-4 font-bold"
                    aria-sort={
                      sort === key
                        ? ascending
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer"
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
                <th scope="col" className="py-3.5 px-4 font-bold">
                  Gain net arbitrage
                </th>
                <th scope="col" className="py-3.5 px-4 font-bold">
                  Statut
                </th>
                <th scope="col" className="py-3.5 pl-4 pr-6">
                  <span className="sr-only">Détails</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {visibleMovements.map((m) => {
                const { netGain } = computeArbitrageMetrics(m);
                return (
                  <tr
                    key={m.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3.5 pl-6 pr-4">
                      <button
                        type="button"
                        className="flex items-center gap-3 text-left text-white cursor-pointer"
                        onClick={() => setSelectedId(m.id)}
                      >
                        <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                          {m.kind === "flight" ? (
                            <Plane size={17} />
                          ) : (
                            <Ship size={17} />
                          )}
                        </span>
                        <span>
                          <strong className="block text-sm font-bold text-white">
                            {m.kind === "flight" ? m.reference : m.vehicle}
                          </strong>
                          <small className="block text-xs text-slate-400">
                            {m.operator}
                          </small>
                        </span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-2 font-bold text-slate-200">
                        {m.origin.code.replace("-PORT", "")}
                        <ArrowRight size={13} className="text-slate-500" />
                        {m.destination.code.replace("-PORT", "")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="block text-white">
                        {time(m.departureAt)}
                      </strong>
                      <small className="text-slate-400">
                        {new Date(m.departureAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          timeZone: "UTC",
                        })}
                      </small>
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="block text-white">
                        {m.availableKg.toLocaleString("fr-FR")} kg
                      </strong>
                      <meter
                        value={m.availableKg}
                        min={0}
                        max={m.capacityKg}
                        aria-label={`Capacité disponible ${m.reference}`}
                      />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      {price(m.pricePerKg)}
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="text-[#059669] font-extrabold tabular-nums">
                        +{price(netGain)}
                      </strong>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`bv-status-pill ${m.status}`}>
                        {radarStatusLabels[m.status]}
                      </span>
                    </td>
                    <td className="py-3.5 pl-4 pr-6 text-right">
                      <button
                        type="button"
                        className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 inline-flex items-center justify-center cursor-pointer"
                        aria-label={`Détails ${m.reference}`}
                        onClick={() => setSelectedId(m.id)}
                      >
                        <ArrowUpRight size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <nav
            className="p-4 border-t border-white/10 flex items-center justify-between gap-4 text-xs text-slate-300"
            aria-label="Pages du manifeste"
          >
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((value) => value - 1)}
              className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 font-bold cursor-pointer"
            >
              Précédent
            </button>
            <span>
              Page {page + 1} sur {pageCount} · {movements.length} liaisons
            </span>
            <button
              type="button"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((value) => value + 1)}
              className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 font-bold cursor-pointer"
            >
              Suivant
            </button>
          </nav>
        )}

        {!movements.length && (
          <div className="p-12 text-center space-y-3 text-slate-300">
            <Search size={28} className="mx-auto text-slate-400" />
            <h3 className="text-base font-bold text-white">
              Aucune liaison trouvée
            </h3>
            <p className="text-xs text-slate-400">
              Essayez une autre ville ou un autre mode de transport.
            </p>
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold cursor-pointer"
              onClick={() => {
                setQuery("");
                setFilter("all");
                setCorridor("all");
              }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        <footer className="p-4 border-t border-white/10 flex items-center gap-2.5 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-[#059669]" />
          <p>
            Positions géodésiques calculées. Horaires, affectations, météo et
            capacités simulés pour l&apos;arbitrage inter-corridors.
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
