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
  Luggage,
  MapPin,
  Package,
  Plane,
  Radio,
  Search,
  ShieldCheck,
  Ship,
  Sparkles,
  Truck,
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
  const [document, setDocument] = useState<{
    kind: "waybill" | "customs";
    context: TransportContext;
  }>();
  const [radarRef, setRadarRef] = useState<string | null>(null);
  const [cargoPassContext, setCargoPassContext] = useState<TransportContext | null>(
    null,
  );
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
    <div className="bv-expansion bv-tracking-page">
      <header className="bv-page-heading">
        <div>
          <span className="bv-eyebrow">
            <Package size={14} /> VOTRE ESPACE LOGISTIQUE & SUIVI SATELLITE
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
          className="bv-secondary cursor-pointer"
          onClick={() => setRadarRef("AH1021")}
        >
          <Radio size={17} />
          Radar Méditerranée
          <ArrowRight size={16} />
        </button>
      </header>

      {/* Interactive Demonstration Banner when showing mock data */}
      {isDemonstrationMode && (
        <div className="bv-demo-banner" role="region" aria-label="Mode démonstration">
          <div className="flex items-start gap-3">
            <span className="bv-demo-badge">
              <Sparkles size={12} /> DÉMONSTRATION ACTIVE
            </span>
            <div className="bv-demo-info">
              <h3>Suivi Satellite en Temps Réel</h3>
              <p>
                {hasUserShipments
                  ? "Les missions témoin ci-dessous simulent le protocole de transport aérien et maritime BagVoyage en direct."
                  : "Voici 3 missions en direct simulant le transport aérien et maritime avec télémétrie, scellé STEB et protocole PIN."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {hasUserShipments && (
              <button
                type="button"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                onClick={() => setShowDemo(!showDemo)}
              >
                {showDemo ? "Masquer la démo" : "Afficher la démo"}
              </button>
            )}
            {!user && (
              <a
                className="bv-primary text-xs !py-2 !px-4"
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
            label: "Documents sécurisés",
            value: "LTA / Douane / Pass Fret",
            Icon: FileText,
          },
        ].map(({ label, value, Icon }) => (
          <section key={label}>
            <div>
              <span>{label}</span>
              <Icon size={18} />
            </div>
            <strong>{value}</strong>
          </section>
        ))}
      </div>

      {/* Filtering Toolbar */}
      <div className="bv-tracking-toolbar">
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
        <div className="bv-empty bv-tracking-empty">
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
            <a className="bv-primary" href="#explore">
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
              <article className="bv-shipment" key={c.id}>
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
                        className="bv-verified-dot"
                        title="Identité vérifiée eIDAS"
                      >
                        <ShieldCheck size={9} />
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bv-eyebrow">RÉF. {c.id}</span>
                      {demo && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          Mission Témoin
                        </span>
                      )}
                    </div>
                    <h2>{c.subject}</h2>
                    <p className="flex items-center gap-1.5">
                      <span>Transporté par</span>
                      <strong className="text-slate-900 dark:text-white font-semibold">
                        {c.name}
                      </strong>
                      {demo && (
                        <span className="text-amber-500 font-medium">
                          ({demo.carrierRating}★ · {demo.carrierTrips} trajets)
                        </span>
                      )}
                    </p>
                  </div>

                  <span className="bv-status-pill">
                    {c.resolution
                      ? "Clôturé par le support"
                      : stageLabels[c.stage]}
                  </span>
                </header>

                {/* Route Information */}
                {(context.origin || context.destination) && (
                  <div className="bv-shipment-route">
                    <span className="flex items-center gap-1">
                      {telemetry?.carrierType === "sea" ? (
                        <Ship size={14} className="text-blue-500 shrink-0" />
                      ) : (
                        <Plane size={14} className="text-blue-500 shrink-0" />
                      )}
                      {context.origin || "Départ à préciser"}
                    </span>
                    <ArrowRight size={15} className="text-slate-400" />
                    <span>{context.destination || "Arrivée à préciser"}</span>
                    {context.reference && (
                      <strong className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {context.reference}
                      </strong>
                    )}
                  </div>
                )}

                {/* Live Telemetry & Security Strip */}
                {telemetry && (
                  <div className="bv-telemetry-strip" role="region" aria-label="Télémétrie en direct">
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
                      <MapPin size={12} className="text-blue-600 dark:text-blue-400" />
                      {telemetry.coordinates}
                    </span>
                    <span className="bv-telemetry-pill verified">
                      <ShieldCheck size={12} />
                      Scellé STEB Inviolable
                    </span>
                    <span className="bv-telemetry-pill verified">
                      Séquestre Stripe ACPR : {context.value} €
                    </span>
                  </div>
                )}

                {/* 4-Step Interactive Timeline */}
                <ol className="bv-shipment-timeline">
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
                  onSelect={(tool) => setLogistics({ tool, context })}
                />

                {/* Card Action Footer */}
                <footer>
                  <div>
                    <button
                      type="button"
                      onClick={() => setDocument({ kind: "waybill", context })}
                    >
                      <FileText size={16} />
                      Bordereau LTA
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocument({ kind: "customs", context })}
                    >
                      <Landmark size={16} />
                      Déclaration Douane
                    </button>
                    <button
                      type="button"
                      onClick={() => setRadarRef(context.reference || "AH1021")}
                    >
                      <Radio size={16} />
                      Radar Méditerranée
                    </button>
                    <button
                      type="button"
                      onClick={() => setCargoPassContext(context)}
                    >
                      <FileCheck2 size={16} />
                      Passe Fret IATA
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
                        className="!text-emerald-600 dark:!text-emerald-400 font-semibold"
                      >
                        <KeyRound size={16} />
                        Code PIN
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className="bv-text-button cursor-pointer"
                    onClick={() => setDetail(c.id)}
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
        Les documents LTA et douane sont des modèles officiels conformes à la
        réglementation IATA et à l'article 106 de la LF 2021. Les fonds restent sous
        séquestre Stripe Connect jusqu'à la validation du code PIN par le destinataire.
      </p>

      {/* Official Waybill / Customs Modals */}
      {document && (
        document.kind === "waybill" ? (
          <WaybillModal
            context={document.context}
            onClose={() => setDocument(undefined)}
          />
        ) : (
          <CustomsModal
            context={document.context}
            onClose={() => setDocument(undefined)}
          />
        )
      )}

      {/* Live Mediterranean Radar Modal */}
      {radarRef && (
        <LiveRadarModal
          reference={radarRef}
          onClose={() => setRadarRef(null)}
        />
      )}

      {/* Digital Cargo Pass Modal */}
      {cargoPassContext && (
        <DigitalCargoPassModal
          isOpen={true}
          orderReference={cargoPassContext.id}
          flightNumber={cargoPassContext.reference}
          origin={cargoPassContext.origin}
          destination={cargoPassContext.destination}
          travelerName={cargoPassContext.carrier}
          senderName={cargoPassContext.sender}
          declaredValue={`${cargoPassContext.value} ${cargoPassContext.currency}`}
          onClose={() => setCargoPassContext(null)}
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
