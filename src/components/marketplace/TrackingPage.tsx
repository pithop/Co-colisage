import { useState } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  Compass,
  FileCheck2,
  FileText,
  KeyRound,
  Landmark,
  MapPin,
  Package,
  Plane,
  QrCode,
  Radio,
  Search,
  ShieldCheck,
  Ship,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { ConversationData } from "./Conversation";
import type { PurchaseRequest, Trip } from "../../data/marketplace";
import {
  requestTransportContext,
  tripTransportContext,
  type TransportContext,
} from "../../services/transportDocuments";
import { WaybillModal } from "../logistics/WaybillModal";
import { CustomsModal } from "../logistics/CustomsModal";
import { LiveRadarModal } from "../logistics/LiveRadarModal";
import { DigitalCargoPassModal } from "../logistics/DigitalCargoPassModal";
import { PinDeliveryModal } from "../Modals/PinDeliveryModal";
import { OrderTracking } from "./OrderTracking";
import {
  LogisticsActions,
  LogisticsToolModal,
  type LogisticsTool,
} from "../logistics/LogisticsTools";
import { releaseEscrowToCarrier } from "../../services/stripeConnectService";
import { saveRecord } from "../../services/productionDb";

const stageLabels: Record<ConversationData["stage"], string> = {
  discussion: "En discussion",
  secured: "Prise en charge à organiser",
  collected: "En acheminement",
  delivered: "Livré & Séquestre libéré",
};

interface DemoShipmentRecord {
  conversation: ConversationData;
  context: TransportContext;
  parcelImage: string;
  carrierAvatar: string;
  carrierRating: number;
  carrierTrips: number;
  telemetry: {
    flightNumber: string;
    altitudeM: number;
    speedKmh: number;
    eta: string;
    coordinates: string;
    carrierType: "air" | "sea";
  };
}

const DEMO_SHIPMENTS: DemoShipmentRecord[] = [
  {
    conversation: {
      id: "BV-2026-ALG-8842",
      name: "Karim Bouzid",
      subject: "iPhone 15 Pro Max (256 Go) Titane Naturel",
      amount: 1199,
      stage: "collected",
      securedAt: "2026-10-14T08:15:00Z",
      pickupCode: "1042",
      deliveryCode: "4821",
      handovers: [
        {
          stage: "pickup",
          at: "2026-10-14T08:15:00Z",
          place: "Aéroport Marseille Provence (MRS)",
          method: "camera",
          location: {
            latitude: 43.4367,
            longitude: 5.2158,
            accuracy: 4,
          },
          photo:
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
          photoAt: "2026-10-14T08:16:30Z",
        },
      ],
      messages: [],
    },
    context: {
      id: "BV-2026-ALG-8842",
      subject: "iPhone 15 Pro Max (256 Go) Titane Naturel",
      sender: "Lina Martin",
      senderAddress: "Aéroport Marseille Provence (MRS) Hall 1",
      carrier: "Karim Bouzid",
      recipient: "Yacine Benali",
      recipientAddress: "Aéroport Alger Houari Boumediene (ALG)",
      origin: "Marseille Provence (MRS)",
      destination: "Alger Houari Boumediene (ALG)",
      reference: "Air Algérie AH1021",
      date: "2026-10-14",
      weight: 0.5,
      value: 1199,
      currency: "EUR",
    },
    parcelImage:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    carrierAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    carrierRating: 4.95,
    carrierTrips: 38,
    telemetry: {
      flightNumber: "AH1021",
      altitudeM: 10600,
      speedKmh: 820,
      eta: "09:55",
      coordinates: "39.124°N, 4.312°E (Au-dessus des Baléares)",
      carrierType: "air",
    },
  },
  {
    conversation: {
      id: "BV-2026-ORN-4912",
      name: "Amine S.",
      subject: "Coffret Parfums & Cosmétiques de Provence",
      amount: 195,
      stage: "secured",
      securedAt: "2026-10-13T16:30:00Z",
      pickupCode: "2088",
      deliveryCode: "7193",
      handovers: [],
      messages: [],
    },
    context: {
      id: "BV-2026-ORN-4912",
      subject: "Coffret Parfums & Cosmétiques de Provence",
      sender: "Nadia K.",
      senderAddress: "Gare Maritime de Marseille",
      carrier: "Amine S.",
      recipient: "Sofiane M.",
      recipientAddress: "Port d'Oran (Gare Maritime)",
      origin: "Marseille Port (MRS-PORT)",
      destination: "Oran Port (ORN-PORT)",
      reference: "Corsica Linea 'A Nepita'",
      date: "2026-10-14",
      weight: 2.4,
      value: 195,
      currency: "EUR",
    },
    parcelImage:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    carrierAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    carrierRating: 4.9,
    carrierTrips: 24,
    telemetry: {
      flightNumber: "FERRY-MED-04",
      altitudeM: 0,
      speedKmh: 38,
      eta: "18:30",
      coordinates: "42.812°N, 5.120°E (Golfe du Lion)",
      carrierType: "sea",
    },
  },
  {
    conversation: {
      id: "BV-2026-CDG-1029",
      name: "Sarah L.",
      subject: "Sneakers Rares Nike Air Jordan 1 Retro",
      amount: 180,
      stage: "delivered",
      securedAt: "2026-10-12T10:00:00Z",
      pickupCode: "3099",
      deliveryCode: "3382",
      handovers: [
        {
          stage: "pickup",
          at: "2026-10-12T10:00:00Z",
          place: "Paris Orly (ORY)",
          method: "camera",
          location: { latitude: 48.7262, longitude: 2.3652, accuracy: 5 },
          photo:
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
          photoAt: "2026-10-12T10:02:00Z",
        },
        {
          stage: "delivery",
          at: "2026-10-12T13:45:00Z",
          place: "Alger Terminal Ouest (ALG)",
          method: "pin",
          location: { latitude: 36.691, longitude: 3.2154, accuracy: 3 },
          photo:
            "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
          photoAt: "2026-10-12T13:46:10Z",
        },
      ],
      messages: [],
    },
    context: {
      id: "BV-2026-CDG-1029",
      subject: "Sneakers Rares Nike Air Jordan 1 Retro",
      sender: "Rayan B.",
      senderAddress: "Paris Orly (ORY)",
      carrier: "Sarah L.",
      recipient: "Karim D.",
      recipientAddress: "Alger Terminal Ouest (ALG)",
      origin: "Paris Orly (ORY)",
      destination: "Alger Houari Boumediene (ALG)",
      reference: "Transavia TO7240",
      date: "2026-10-12",
      weight: 1.2,
      value: 180,
      currency: "EUR",
    },
    parcelImage:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    carrierAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    carrierRating: 5.0,
    carrierTrips: 52,
    telemetry: {
      flightNumber: "TO7240",
      altitudeM: 0,
      speedKmh: 0,
      eta: "Livré",
      coordinates: "Terminal Ouest Alger (ALG)",
      carrierType: "air",
    },
  },
];

export function TrackingPage({
  conversations,
  requests = [],
  trips = [],
  loading = false,
}: {
  conversations: ConversationData[];
  requests?: PurchaseRequest[];
  trips?: Trip[];
  loading?: boolean;
}) {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"active" | "delivered" | "all">("active");
  const [query, setQuery] = useState("");
  const [activeSheet, setActiveSheet] = useState<{
    tab: "cargopass" | "waybill" | "customs";
    context: TransportContext;
  } | null>(null);
  const [radarRef, setRadarRef] = useState<string | null>(null);
  const [pinModalContext, setPinModalContext] = useState<{
    conversation: ConversationData;
    amount: number;
  } | null>(null);
  const [detail, setDetail] = useState<string>();
  const [logistics, setLogistics] = useState<{
    tool: LogisticsTool;
    context: TransportContext;
  }>();
  const [showDemo, setShowDemo] = useState(true);

  // Real user shipments
  const userShipments = conversations.filter(
    (c) =>
      c.stage !== "discussion" &&
      (!user ||
        !c.participantIds ||
        c.participantIds.includes(user.id) ||
        c.participantIds.length === 0),
  );

  const contextFor = (c: ConversationData): TransportContext => {
    // Check if it's one of the demo records
    const demo = DEMO_SHIPMENTS.find((d) => d.conversation.id === c.id);
    if (demo) return demo.context;

    const request = requests.find((r) => r.id === c.id);
    const trip = trips.find((t) => t.id === c.id);
    const known: Partial<TransportContext> = request
      ? requestTransportContext(request)
      : trip
        ? tripTransportContext(trip)
        : {};

    return {
      id: c.id,
      subject: c.subject,
      sender: known.sender ?? "Expéditeur BagVoyage",
      senderAddress: request?.pickupLocation ?? "Point de retrait certifié",
      carrier: known.carrier ?? c.name,
      recipient: known.recipient ?? "Destinataire vérifié",
      recipientAddress: request?.location ?? "Point de livraison sécurisé",
      origin: known.origin ?? "Marseille (MRS)",
      destination: known.destination ?? "Alger (ALG)",
      reference: known.reference ?? "Air Algérie AH1021",
      date: known.date ?? new Date().toISOString().split("T")[0],
      weight: known.weight ?? 1.5,
      value: known.value ?? c.amount ?? 85,
      currency: known.currency ?? "EUR",
    };
  };

  // Determine active dataset
  const hasUserShipments = userShipments.length > 0;
  const isDemonstrationMode = !hasUserShipments || showDemo;

  const demoItems = DEMO_SHIPMENTS.map((d) => d.conversation);
  const allAvailable = hasUserShipments
    ? showDemo
      ? [...userShipments, ...demoItems]
      : userShipments
    : demoItems;

  const active = allAvailable.filter(
    (c) => c.stage !== "delivered" && !c.resolution,
  );
  const complete = allAvailable.filter(
    (c) => c.stage === "delivered" || c.resolution,
  );

  const visible = (
    filter === "active" ? active : filter === "delivered" ? complete : allAvailable
  ).filter((c) => {
    const ctx = contextFor(c);
    const searchable = `${c.subject} ${c.id} ${c.name} ${ctx.origin} ${ctx.destination} ${ctx.reference}`;
    return searchable.toLocaleLowerCase("fr").includes(query.trim().toLocaleLowerCase("fr"));
  });

  const selected = allAvailable.find((c) => c.id === detail);

  return (
    <div className="bv-expansion bv-tracking-page bg-[#F8FAFC] tabular-nums">
      <header className="bv-page-heading rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6">
        <div>
          <span className="bv-eyebrow text-[#059669]">
            <Package size={14} /> VOTRE ESPACE LOGISTIQUE &amp; SUIVI SATELLITE
          </span>
          <h1>
            Chaque colis.
            <br />
            <em>Une histoire à suivre en direct.</em>
          </h1>
          <p>
            De la pesée au départ jusqu'à la remise avec code PIN, suivez vos
            marchandises avec télémétrie certifiée.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          onClick={() => setRadarRef("AH1021")}
        >
          <Radio size={17} />
          Radar Méditerranée
          <ArrowRight size={16} />
        </button>
      </header>

      {/* Interactive Demonstration Banner when showing mock data */}
      {isDemonstrationMode && (
        <div
          className="bv-demo-banner rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-5"
          role="region"
          aria-label="Mode démonstration"
        >
          <div className="flex items-start gap-3">
            <span className="bv-demo-badge !bg-[#ECFDF5] !text-[#059669] !border-[#059669]/20">
              <Sparkles size={12} /> DÉMONSTRATION ACTIVE
            </span>
            <div className="bv-demo-info">
              <h3>Suivi Satellite en Temps Réel</h3>
              <p>
                {hasUserShipments
                  ? "Les missions témoin ci-dessous simulent le protocole de transport aérien et maritime BagVoyage en direct."
                  : "Voici 3 missions en direct simulant le transport aérien et maritime avec télémétrie et protocole PIN."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {hasUserShipments && (
              <button
                type="button"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-slate-700 hover:bg-slate-100 cursor-pointer"
                onClick={() => setShowDemo(!showDemo)}
              >
                {showDemo ? "Masquer la démo" : "Afficher la démo"}
              </button>
            )}
            {!user && (
              <a
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs"
                href="#login"
              >
                Me connecter pour mes colis
                <ArrowRight size={14} />
              </a>
            )}
          </div>
        </div>
      )}

      {/* KPI Status Tiles */}
      <div className="bv-kpis bv-tracking-kpis">
        {[
          {
            label: "Expéditions en cours",
            value: active.length,
            Icon: Truck,
          },
          {
            label: "Livraisons confirmées",
            value: complete.length,
            Icon: Check,
          },
          {
            label: "Tiroir Documents & Douane",
            value: "Passe Fret · Lettre · Douane",
            Icon: FileText,
          },
        ].map(({ label, value, Icon }) => (
          <section
            key={label}
            className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-5"
          >
            <div>
              <span>{label}</span>
              <Icon size={18} className="text-[#059669]" />
            </div>
            <strong className="tabular-nums">{value}</strong>
          </section>
        ))}
      </div>

      {/* Filtering Toolbar */}
      <div className="bv-tracking-toolbar rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-4">
        <div
          className="bv-segmented"
          role="group"
          aria-label="Statut des expéditions"
        >
          {(
            [
              { id: "active", label: "En cours", count: active.length },
              {
                id: "delivered",
                label: "Clôturées",
                count: complete.length,
              },
              { id: "all", label: "Toutes", count: allAvailable.length },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className="tabular-nums"
            >
              {f.label}
              <span>{f.count}</span>
            </button>
          ))}
        </div>
        <label className="bv-search">
          <Search size={17} />
          <input
            aria-label="Rechercher une expédition"
            placeholder="N° suivi (BV-...), vol, partenaire, ville…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      {loading ? (
        <p className="bv-empty" role="status">
          Chargement des expéditions en cours…
        </p>
      ) : !visible.length ? (
        <div className="bv-empty bv-tracking-empty rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-8">
          <Package size={42} />
          <h2>
            {query
              ? "Aucun colis ne correspond à votre recherche."
              : "Le prochain départ commence avec vous."}
          </h2>
          <p>
            {query
              ? `Aucun colis ne correspond à "${query}". Essayez avec "AH1021", "Alger" ou "BV-2026".`
              : "Les accords confirmés associés à votre compte apparaîtront ici avec télémétrie complète."}
          </p>
          {query ? (
            <button
              className="bv-secondary cursor-pointer"
              onClick={() => setQuery("")}
            >
              Effacer la recherche
            </button>
          ) : (
            <a className="bv-primary !bg-[#2563EB]" href="#explore">
              Trouver un voyageur
              <ArrowRight size={18} />
            </a>
          )}
        </div>
      ) : (
        <div className="bv-shipment-list">
          {visible.map((c) => {
            const context = contextFor(c);
            const demo = DEMO_SHIPMENTS.find((d) => d.conversation.id === c.id);
            const parcelImage =
              demo?.parcelImage ||
              "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80";
            const carrierAvatar =
              demo?.carrierAvatar ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80";
            const telemetry = demo?.telemetry;

            const stage =
              c.stage === "delivered"
                ? 3
                : c.stage === "collected"
                  ? 2
                  : 0;

            return (
              <article
                className="bv-shipment rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-5 sm:p-6"
                key={c.id}
              >
                {/* Header with High-Resolution Parcel Thumbnail and Verified Carrier Badge */}
                <header>
                  <div className="bv-shipment-photo-wrap">
                    <img
                      src={parcelImage}
                      alt={c.subject}
                      className="bv-shipment-photo"
                      loading="lazy"
                    />
                    <div className="bv-carrier-badge">
                      <img
                        src={carrierAvatar}
                        alt={c.name}
                        className="bv-carrier-avatar"
                        title={`Voyageur certifié : ${c.name}`}
                      />
                      <span
                        className="bv-verified-dot !bg-[#059669]"
                        title="Identité vérifiée"
                      >
                        <ShieldCheck size={9} />
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bv-eyebrow tabular-nums">RÉF. {c.id}</span>
                      {demo && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#059669]/20">
                          Mission Témoin
                        </span>
                      )}
                    </div>
                    <h2>{c.subject}</h2>
                    <p className="flex items-center gap-1.5 tabular-nums">
                      <span>Transporté par</span>
                      <strong className="text-slate-900 dark:text-white font-semibold">
                        {c.name}
                      </strong>
                      {demo && (
                        <span className="text-[#059669] font-bold">
                          ({demo.carrierRating}★ · {demo.carrierTrips} trajets)
                        </span>
                      )}
                    </p>
                  </div>

                  <span className="bv-status-pill !bg-[#ECFDF5] !text-[#059669] !border-[#059669]/20">
                    {c.resolution
                      ? "Clôturé par le support"
                      : stageLabels[c.stage]}
                  </span>
                </header>

                {/* Route Information */}
                {(context.origin || context.destination) && (
                  <div className="bv-shipment-route tabular-nums">
                    <span className="flex items-center gap-1">
                      {telemetry?.carrierType === "sea" ? (
                        <Ship size={14} className="text-[#059669] shrink-0" />
                      ) : (
                        <Plane size={14} className="text-[#059669] shrink-0" />
                      )}
                      {context.origin || "Départ à préciser"}
                    </span>
                    <ArrowRight size={15} className="text-slate-400" />
                    <span>{context.destination || "Arrivée à préciser"}</span>
                    {context.reference && (
                      <strong className="font-mono bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded text-[11px]">
                        {context.reference}
                      </strong>
                    )}
                  </div>
                )}

                {/* Live Telemetry & Security Strip */}
                {telemetry && (
                  <div
                    className="bv-telemetry-strip tabular-nums"
                    role="region"
                    aria-label="Télémétrie en direct"
                  >
                    {telemetry.altitudeM > 0 && (
                      <span className="bv-telemetry-pill live">
                        <Compass size={12} />
                        Altitude : {telemetry.altitudeM.toLocaleString("fr-FR")} m
                      </span>
                    )}
                    {telemetry.speedKmh > 0 && (
                      <span className="bv-telemetry-pill">
                        Vitesse : {telemetry.speedKmh} km/h
                      </span>
                    )}
                    <span className="bv-telemetry-pill">
                      <MapPin size={12} className="text-slate-600" />
                      {telemetry.coordinates}
                    </span>
                    <span className="bv-telemetry-pill verified !text-[#059669]">
                      <ShieldCheck size={12} />
                      Colis scellé vérifié
                    </span>
                    <span className="bv-telemetry-pill verified !text-[#059669] font-bold">
                      Séquestre Stripe : {context.value} €
                    </span>
                  </div>
                )}

                {/* 4-Step Interactive Timeline */}
                <ol className="bv-shipment-timeline tabular-nums">
                  {[
                    "Accord confirmé",
                    "Prise en charge",
                    "Acheminement",
                    "Livraison PIN",
                  ].map((label, i) => {
                    const done =
                      c.stage === "delivered" ||
                      (c.stage === "collected" ? i < 2 : i === 0);
                    const current =
                      !c.resolution &&
                      c.stage !== "delivered" &&
                      i === (stage === 0 ? 1 : stage);
                    const at =
                      i === 0
                        ? c.securedAt
                        : i === 1
                          ? c.handovers?.find((h) => h.stage === "pickup")?.at
                          : i === 3
                            ? c.handovers?.find((h) => h.stage === "delivery")?.at
                            : undefined;

                    return (
                      <li
                        key={label}
                        className={done ? "complete" : current ? "current" : ""}
                        aria-current={current ? "step" : undefined}
                      >
                        <span>
                          {done ? (
                            <Check size={17} />
                          ) : (
                            <Clock3 size={17} />
                          )}
                        </span>
                        <strong>{label}</strong>
                        <small>
                          {at
                            ? new Date(at).toLocaleString("fr-FR", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : done
                              ? "Confirmé"
                              : c.resolution
                                ? "Clôturé"
                                : current
                                  ? "En cours"
                                  : "À venir"}
                        </small>
                      </li>
                    );
                  })}
                </ol>

                {/* Delay and Arbitration notices */}
                {!!c.delays?.length && (
                  <p className="bv-shipment-notice">
                    Retard signalé : {c.delays[c.delays.length - 1].duration}
                  </p>
                )}
                {c.resolution && (
                  <p className="bv-shipment-notice">{c.resolution.reason}</p>
                )}

                {/* Logistics Preparation Tools Sub-Actions */}
                <LogisticsActions
                  onSelect={(tool) => {
                    setActiveSheet(null);
                    setLogistics({ tool, context });
                  }}
                />

                {/* Card Action Footer : Tiroirs coulissants (Sheet) regroupés */}
                <footer>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLogistics(undefined);
                        setDetail(undefined);
                        setActiveSheet({ tab: "cargopass", context });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs cursor-pointer"
                    >
                      <QrCode size={15} />
                      Passe Fret QR
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLogistics(undefined);
                        setDetail(undefined);
                        setActiveSheet({ tab: "waybill", context });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-slate-800 font-bold text-xs cursor-pointer"
                    >
                      <FileText size={15} />
                      Lettre de Voiture
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLogistics(undefined);
                        setDetail(undefined);
                        setActiveSheet({ tab: "customs", context });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-slate-800 font-bold text-xs cursor-pointer"
                    >
                      <Landmark size={15} />
                      Calculateur Douanier
                    </button>
                    <button
                      type="button"
                      onClick={() => setRadarRef(context.reference || "AH1021")}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
                    >
                      <Radio size={15} />
                      Radar Méditerranée
                    </button>
                    {c.stage !== "discussion" && (
                      <button
                        type="button"
                        onClick={() =>
                          setPinModalContext({
                            conversation: c,
                            amount: context.value || 85,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#059669]/30 bg-[#ECFDF5] !text-[#059669] font-bold text-xs cursor-pointer"
                      >
                        <KeyRound size={15} />
                        Code PIN
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className="bv-text-button cursor-pointer"
                    onClick={() => {
                      setActiveSheet(null);
                      setDetail(c.id);
                    }}
                  >
                    Preuves et détails
                    <ArrowRight size={16} />
                  </button>
                </footer>
              </article>
            );
          })}
        </div>
      )}

      <p className="bv-fine-print">
        Les documents de transport et douane sont des modèles officiels conformes à la
        réglementation internationale et à l'article 106 de la LF 2021. Les fonds restent sous
        séquestre Stripe Connect jusqu'à la validation du code PIN par le destinataire.
      </p>

      {/* Tiroir coulissant latéral / inférieur (Sheet) regroupant Passe Fret QR, Lettre de Voiture et Calculateur Douanier */}
      {activeSheet && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-xs flex justify-end items-end md:items-stretch"
          role="dialog"
          aria-modal="true"
          aria-label="Tiroir Documents Logistiques & Douane"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveSheet(null);
          }}
        >
          <aside className="w-full md:max-w-xl max-h-[90dvh] md:max-h-none md:h-full bg-[#FFFFFF] border-t md:border-t-0 md:border-l border-[#E2E8F0] rounded-t-2xl md:rounded-t-none md:rounded-l-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom md:slide-in-from-right duration-200">
            {/* Poignée mobile Apple HIG */}
            <div className="pt-2.5 pb-1 flex justify-center md:hidden" aria-hidden="true">
              <div className="w-10 h-1.5 rounded-full bg-slate-300" />
            </div>

            {/* En-tête du Sheet avec Segmented Control unifié */}
            <header className="p-5 bg-[#FFFFFF] border-b border-[#E2E8F0] space-y-4 shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#059669]/20">
                    DOSSIER LOGISTIQUE · {activeSheet.context.id}
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                    {activeSheet.context.subject}
                  </h2>
                  <p className="text-xs text-slate-500 tabular-nums">
                    {activeSheet.context.origin} → {activeSheet.context.destination} · Valeur :{" "}
                    <strong className="text-[#059669]">
                      {activeSheet.context.value} {activeSheet.context.currency}
                    </strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSheet(null)}
                  aria-label="Fermer le tiroir logistique"
                  className="w-9 h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Segmented Control (Passe Fret QR | Lettre de Voiture | Calculateur Douanier) */}
              <div
                role="tablist"
                aria-label="Outils documentaires et douaniers"
                className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSheet.tab === "cargopass"}
                  onClick={() =>
                    setActiveSheet({ ...activeSheet, tab: "cargopass" })
                  }
                  className={`py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeSheet.tab === "cargopass"
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <QrCode size={14} />
                  <span className="truncate">Passe Fret QR</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSheet.tab === "waybill"}
                  onClick={() =>
                    setActiveSheet({ ...activeSheet, tab: "waybill" })
                  }
                  className={`py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeSheet.tab === "waybill"
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileCheck2 size={14} />
                  <span className="truncate">Lettre de Voiture</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSheet.tab === "customs"}
                  onClick={() =>
                    setActiveSheet({ ...activeSheet, tab: "customs" })
                  }
                  className={`py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeSheet.tab === "customs"
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Landmark size={14} />
                  <span className="truncate">Douane</span>
                </button>
              </div>
            </header>

            {/* Contenu scrollable du Sheet */}
            <div className="flex-1 overflow-y-auto p-5 bg-[#F8FAFC]">
              {activeSheet.tab === "cargopass" && (
                <DigitalCargoPassModal
                  isOpen={true}
                  inline={true}
                  orderReference={activeSheet.context.id}
                  flightNumber={activeSheet.context.reference}
                  origin={activeSheet.context.origin}
                  destination={activeSheet.context.destination}
                  travelerName={activeSheet.context.carrier}
                  senderName={activeSheet.context.sender}
                  declaredValue={`${activeSheet.context.value} ${activeSheet.context.currency}`}
                  onClose={() => setActiveSheet(null)}
                />
              )}
              {activeSheet.tab === "waybill" && (
                <WaybillModal
                  inline={true}
                  context={activeSheet.context}
                  onClose={() => setActiveSheet(null)}
                />
              )}
              {activeSheet.tab === "customs" && (
                <CustomsModal
                  inline={true}
                  context={activeSheet.context}
                  onClose={() => setActiveSheet(null)}
                />
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Live Mediterranean Radar Modal */}
      {radarRef && (
        <LiveRadarModal
          reference={radarRef}
          onClose={() => setRadarRef(null)}
        />
      )}

      {/* PIN Delivery Verification Modal */}
      {pinModalContext && (
        <PinDeliveryModal
          conversation={pinModalContext.conversation}
          onClose={() => setPinModalContext(null)}
          onSuccessFinished={async () => {
            const cid = pinModalContext.conversation.id;
            try {
              await releaseEscrowToCarrier(cid);
              await saveRecord("orders", {
                id: `ord-${cid}`,
                conversationId: cid,
                status: "delivered",
                updatedAt: new Date().toISOString(),
              });
            } catch (err) {
              console.warn("Failed to update order state after PIN release:", err);
            }
            setPinModalContext(null);
          }}
        />
      )}

      {/* Order Tracking Evidence Modal */}
      {selected && (
        <OrderTracking
          transportContext={contextFor(selected)}
          conversation={selected}
          onClose={() => setDetail(undefined)}
        />
      )}

      {/* Logistics Deep Tools Modal */}
      {logistics && (
        <LogisticsToolModal
          key={`${logistics.context.id}-${logistics.tool}`}
          tool={logistics.tool}
          context={logistics.context}
          onClose={() => setLogistics(undefined)}
        />
      )}
    </div>
  );
}
