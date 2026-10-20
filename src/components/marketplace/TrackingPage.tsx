import { useState } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  FileText,
  Landmark,
  Package,
  Radio,
  Search,
  ShieldCheck,
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
import { OrderTracking } from "./OrderTracking";
const stageLabels: Record<ConversationData["stage"], string> = {
  discussion: "En discussion",
  secured: "Prise en charge à organiser",
  collected: "En acheminement",
  delivered: "Livré",
};
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
  const [filter, setFilter] = useState<"active" | "delivered" | "all">(
    "active",
  );
  const [query, setQuery] = useState("");
  const [document, setDocument] = useState<{
    kind: "waybill" | "customs";
    context: TransportContext;
  }>();
  const [detail, setDetail] = useState<string>();
  const mine = user
    ? conversations.filter(
        (c) => c.stage !== "discussion" && c.participantIds?.includes(user.id),
      )
    : [];
  const active = mine.filter((c) => c.stage !== "delivered" && !c.resolution);
  const complete = mine.filter((c) => c.stage === "delivered" || c.resolution);
  const visible = (
    filter === "active" ? active : filter === "delivered" ? complete : mine
  ).filter((c) =>
    `${c.subject} ${c.id} ${c.name}`
      .toLocaleLowerCase("fr")
      .includes(query.trim().toLocaleLowerCase("fr")),
  );
  const contextFor = (c: ConversationData): TransportContext => {
    const request = requests.find((r) => r.id === c.id),
      trip = trips.find((t) => t.id === c.id);
    const known: Partial<TransportContext> = request
      ? requestTransportContext(request)
      : trip
        ? tripTransportContext(trip)
        : {};
    return {
      id: c.id,
      subject: c.subject,
      sender: known.sender ?? "",
      senderAddress: request?.pickupLocation ?? "",
      carrier: known.carrier ?? "",
      recipient: known.recipient ?? "",
      recipientAddress: request?.location ?? "",
      origin: known.origin ?? "",
      destination: known.destination ?? "",
      reference: known.reference ?? "",
      date: known.date ?? "",
      weight: known.weight ?? 0,
      value: known.value ?? 0,
      currency: known.currency ?? "EUR",
    };
  };
  const selected = mine.find((c) => c.id === detail);
  return (
    <div className="bv-expansion bv-tracking-page">
      <header className="bv-page-heading">
        <div>
          <span className="bv-eyebrow">
            <Package size={14} /> VOTRE ESPACE LOGISTIQUE
          </span>
          <h1>
            Chaque colis.
            <br />
            <em>Une histoire à suivre.</em>
          </h1>
          <p>De la première remise au dernier kilomètre, gardez le lien.</p>
        </div>
        <a className="bv-secondary" href="#radar">
          <Radio size={17} />
          Ouvrir le radar
          <ArrowRight size={16} />
        </a>
      </header>
      {!user ? (
        <div className="bv-empty bv-tracking-empty">
          <ShieldCheck size={42} />
          <h2>Vos expéditions vous attendent.</h2>
          <p>
            Connectez-vous pour retrouver les colis associés à votre compte.
          </p>
          <a className="bv-primary" href="#login">
            Me connecter
            <ArrowRight size={18} />
          </a>
          <a href="#register">Créer un compte</a>
        </div>
      ) : (
        <>
          <div className="bv-kpis bv-tracking-kpis">
            {[
              {
                label: "Expéditions en cours",
                value: active.length,
                Icon: Truck,
              },
              {
                label: "Livraisons confirmées",
                value: mine.filter((c) => c.stage === "delivered").length,
                Icon: Check,
              },
              {
                label: "Documents accessibles",
                value: "LTA / Douane",
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
                  { id: "all", label: "Toutes", count: mine.length },
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
                placeholder="Colis, référence, partenaire…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
          {loading ? (
            <p className="bv-empty" role="status">
              Chargement de vos expéditions…
            </p>
          ) : !visible.length ? (
            <div className="bv-empty bv-tracking-empty">
              <Package size={42} />
              <h2>
                {query
                  ? "Aucun colis ne correspond."
                  : "Le prochain départ commence avec vous."}
              </h2>
              <p>
                {query
                  ? "Essayez un autre nom ou une autre référence."
                  : "Les accords confirmés associés à votre compte apparaîtront ici."}
              </p>
              {query ? (
                <button className="bv-secondary" onClick={() => setQuery("")}>
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
                const context = contextFor(c),
                  stage =
                    c.stage === "delivered"
                      ? 3
                      : c.stage === "collected"
                        ? 2
                        : 0;
                return (
                  <article className="bv-shipment" key={c.id}>
                    <header>
                      <div className="bv-shipment-icon">
                        <Package size={24} />
                      </div>
                      <div>
                        <span className="bv-eyebrow">RÉF. {c.id}</span>
                        <h2>{c.subject}</h2>
                        <p>Avec {c.name}</p>
                      </div>
                      <span className="bv-status-pill">
                        {c.resolution
                          ? "Clôturé par le support"
                          : stageLabels[c.stage]}
                      </span>
                    </header>
                    {(context.origin || context.destination) && (
                      <div className="bv-shipment-route">
                        <span>{context.origin || "Départ à préciser"}</span>
                        <ArrowRight size={16} />
                        <span>
                          {context.destination || "Arrivée à préciser"}
                        </span>
                        {context.reference && (
                          <strong>{context.reference}</strong>
                        )}
                      </div>
                    )}
                    <ol className="bv-shipment-timeline">
                      {[
                        "Accord confirmé",
                        "Prise en charge",
                        "Acheminement",
                        "Livraison",
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
                              ? c.handovers?.find((h) => h.stage === "pickup")
                                  ?.at
                              : i === 3
                                ? c.handovers?.find(
                                    (h) => h.stage === "delivery",
                                  )?.at
                                : undefined;
                        return (
                          <li
                            key={label}
                            className={
                              done ? "complete" : current ? "current" : ""
                            }
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
                    {!!c.delays?.length && (
                      <p className="bv-shipment-notice">
                        Retard signalé :{" "}
                        {c.delays[c.delays.length - 1].duration}
                      </p>
                    )}
                    {c.resolution && (
                      <p className="bv-shipment-notice">
                        {c.resolution.reason}
                      </p>
                    )}
                    <footer>
                      <div>
                        <button
                          onClick={() =>
                            setDocument({ kind: "waybill", context })
                          }
                        >
                          <FileText size={16} />
                          Bordereau LTA / Waybill
                        </button>
                        <button
                          onClick={() =>
                            setDocument({ kind: "customs", context })
                          }
                        >
                          <Landmark size={16} />
                          Déclaration en douane · Article 106
                        </button>
                        <a
                          href={
                            context.reference
                              ? `#radar/${encodeURIComponent(context.reference)}`
                              : "#radar"
                          }
                        >
                          <Radio size={16} />
                          Radar en direct
                        </a>
                      </div>
                      <button
                        className="bv-text-button"
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
            Les documents sont des modèles à compléter, sans émission par une
            compagnie ni validation douanière. Le radar propose une simulation.
          </p>
        </>
      )}
      {document &&
        user &&
        mine.some((c) => c.id === document.context.id) &&
        (document.kind === "waybill" ? (
          <WaybillModal
            context={document.context}
            onClose={() => setDocument(undefined)}
          />
        ) : (
          <CustomsModal
            context={document.context}
            onClose={() => setDocument(undefined)}
          />
        ))}
      {selected && (
        <OrderTracking
          transportContext={contextFor(selected)}
          conversation={selected}
          onClose={() => setDetail(undefined)}
        />
      )}
    </div>
  );
}
