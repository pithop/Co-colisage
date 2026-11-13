import { useState } from "react";
import {
  ShieldCheck,
  Activity,
  Plane,
  MessageSquare,
  FileCheck,
  Scale,
  ArrowUpRight,
  Search,
  Database,
  Download,
  Sparkles,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react";
import { useDatabaseQuery } from "../../hooks/useDatabaseQuery";
import {
  localAdminEnabled,
  sendOfficialMessage,
  reviewProApplication,
  reviewKyc,
  resolveEscrow,
} from "../../services/adminOperations";
import {
  exportDatabaseAsJson,
  exportDatabaseAsSql,
  seedDemoDatabase,
  deleteRecord,
  type StoreName,
} from "../../services/productionDb";
import { money, walletBalances } from "../../data/wallet";
import type { Attachment } from "../../services/uploads";
import { Dialog } from "../marketplace/Dialog";
import { proDocumentLabels } from "../Modals/ProOnboardingModal";

export function moderationSignals(text: string) {
  const signals: string[] = [];
  if (/(?:\+?\d[\s().-]*){9,15}/.test(text)) signals.push("Téléphone");
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text))
    signals.push("E-mail");
  if (
    /whats\s?app|paypal|hors appli|payer en direct|virement perso|\biban\b|\bliquide\b|telegram/i.test(
      text,
    )
  )
    signals.push("Paiement ou contact externe");
  return signals;
}
const sections = [
  ["overview", "Vue d’ensemble", Activity],
  ["trips", "Vols et trajets", Plane],
  ["chats", "Conversations", MessageSquare],
  ["kyc", "Dossiers KYC & Pro", FileCheck],
  ["escrow", "Litiges & Séquestre", Scale],
  ["database", "Studio Base de Données", Database],
] as const;
export function AdminDashboard() {
  if (!localAdminEnabled)
    return (
      <section className="admin-locked">
        <ShieldCheck size={40} />
        <h1>Administration sécurisée</h1>
        <p>
          Le service administrateur authentifié n’est pas configuré sur cette
          installation.
        </p>
        <p>
          Les conversations privées, les pièces et les actions financières
          nécessitent une autorisation serveur.
        </p>
        <a className="primary-button" href="/#explore">
          Retour à l’application
        </a>
      </section>
    );
  return <LocalAdminDashboard />;
}
function LocalAdminDashboard() {
  const trips = useDatabaseQuery("trips");
  const conversations = useDatabaseQuery("conversations");
  const users = useDatabaseQuery("users");
  const profiles = useDatabaseQuery("profiles");
  const requests = useDatabaseQuery("purchase_requests");
  const orders = useDatabaseQuery("orders");
  const applications = useDatabaseQuery("pro_applications");
  const kyc = useDatabaseQuery("kyc_records");
  const ledger = useDatabaseQuery("wallet_transactions");
  const adminMsgs = useDatabaseQuery("admin_messages");
  const [tab, setTab] = useState<(typeof sections)[number][0]>("overview");
  const [status, setStatus] = useState("all");
  const [airline, setAirline] = useState("all");
  const [search, setSearch] = useState("");
  const [chatId, setChatId] = useState("");
  const [targetType, setTargetType] = useState("conversation");
  const [userId, setUserId] = useState("");
  const [draft, setDraft] = useState("");
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [document, setDocument] = useState<Attachment | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [decision, setDecision] = useState<{
    id: string;
    outcome: "release" | "refund";
    subject: string;
    amount: number;
  } | null>(null);
  const [decisionReason, setDecisionReason] = useState("");

  // Database Studio State
  const [selectedTable, setSelectedTable] = useState<StoreName>("users");
  const [selectedRecord, setSelectedRecord] = useState<Record<string, unknown> | null>(null);
  const [dbSearch, setDbSearch] = useState("");
  const [dbNotice, setDbNotice] = useState("");
  const chat =
    conversations.rows.find((row) => row.id === chatId) ||
    conversations.rows[0];
  const balance = walletBalances(ledger.rows);
  const deposits = ledger.rows.filter((row) => row.id.startsWith("deposit-"));
  const gmv = deposits.reduce((total, row) => total + row.cents, 0);
  const released = conversations.rows.filter(
    (row) =>
      row.resolution?.outcome === "release" ||
      (!row.resolution && row.stage === "delivered"),
  );
  const commissions = released.reduce(
    (total, row) => total + Math.round((row.serviceAmount || 0) * 100 * 0.15),
    0,
  );
  const kg = trips.rows.reduce(
    (total, row) => total + (row.transportedKg || 0),
    0,
  );
  const pending =
    applications.rows.filter((row) => row.status === "pending").length +
    kyc.rows.filter((row) => row.status === "pending").length;
  const signals = conversations.rows.reduce(
    (total, row) =>
      total +
      row.messages.filter(
        (message) =>
          !message.official && moderationSignals(message.text).length,
      ).length,
    0,
  );
  const run = async (action: () => Promise<void>, success: string) => {
    if (busy) return false;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(success);
      return true;
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Action impossible. Réessayez.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  };
  const renderDocuments = (docs: Attachment[]) => (
    <div className="admin-documents">
      {docs.map((file) => (
        <button
          type="button"
          key={file.id}
          className="outline-button"
          onClick={() => setDocument(file)}
        >
          <FileCheck size={16} />
          {file.name}
        </button>
      ))}
    </div>
  );
  const dataError = [
    trips,
    conversations,
    users,
    applications,
    kyc,
    ledger,
  ].find((query) => query.error);
  return (
    <section className="admin-dashboard">
      <header className="admin-heading">
        <div>
          <span className="eyebrow">BAGVOYAGE / CONTROL ROOM</span>
          <h1>Chaque trajet compte.</h1>
          <p>Une vue claire. Des décisions traçables.</p>
        </div>
        <span className="admin-session">
          <ShieldCheck size={17} />
          Super Admin
        </span>
      </header>
      <p className="local-environment">
        Environnement local de développement. Données de cet appareil, paiements
        simulés. Cet accès est désactivé dans le build de production.
      </p>
      <nav className="admin-tabs" aria-label="Sections administrateur">
        {sections.map(([id, label, Icon]) => (
          <button
            key={id}
            aria-pressed={tab === id}
            onClick={() => {
              setTab(id);
              setNotice("");
              setError("");
            }}
          >
            <Icon size={18} />
            {label}
            {id === "kyc" && pending > 0 && <span>{pending}</span>}
          </button>
        ))}
      </nav>
      {dataError && (
        <p role="alert">
          {dataError.error}
          <button onClick={dataError.retry}>Réessayer</button>
        </p>
      )}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="admin-notice">
          {notice}
        </p>
      )}
      {tab === "overview" && (
        <>
          <div className="admin-section-title">
            <h2>L’activité, en direct du registre</h2>
            <span>EUR / données locales</span>
          </div>
          <div className="admin-kpis">
            {[
              ["GMV totale", money(gmv), "Valeur des cautions enregistrées"],
              [
                "GMV en séquestre",
                money(balance.escrow),
                "Fonds en attente de décision",
              ],
              [
                "Commissions plateforme (15 %)",
                money(commissions),
                "Sur les services bruts documentés et libérés",
              ],
              [
                "Panier moyen",
                money(deposits.length ? Math.round(gmv / deposits.length) : 0),
                `${deposits.length} opérations enregistrées`,
              ],
              [
                "Volume transporté",
                `${kg.toLocaleString("fr-FR")} kg`,
                "Uniquement les kilos confirmés",
              ],
              [
                "Solde disponible",
                money(balance.available),
                "Registre local, sans valeur bancaire",
              ],
            ].map(([label, value, detail]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <small>{detail}</small>
              </article>
            ))}
          </div>
          <div className="admin-queue">
            <div>
              <h2>À votre attention</h2>
              <p>Les points qui méritent une décision aujourd’hui.</p>
            </div>
            <button onClick={() => setTab("kyc")}>
              <FileCheck size={22} />
              <strong>{pending}</strong>
              <span>dossiers à examiner</span>
              <ArrowUpRight size={18} />
            </button>
            <button onClick={() => setTab("chats")}>
              <MessageSquare size={22} />
              <strong>{signals}</strong>
              <span>messages à relire</span>
              <ArrowUpRight size={18} />
            </button>
            <button onClick={() => setTab("escrow")}>
              <Scale size={22} />
              <strong>
                {
                  conversations.rows.filter(
                    (row) => row.dispute && !row.resolution,
                  ).length
                }
              </strong>
              <span>litiges ouverts</span>
              <ArrowUpRight size={18} />
            </button>
          </div>
        </>
      )}
      {tab === "trips" && (
        <section>
          <div className="admin-section-title">
            <h2>Supervision des vols et trajets</h2>
            <span>{trips.rows.length} trajets</span>
          </div>
          <div className="admin-filters">
            <div className="admin-status-pills-filter">
              <span className="admin-filter-label">Statut du trajet</span>
              <div className="admin-pills-group" role="group" aria-label="Filtre par statut">
                {[
                  { value: "all", label: "Tous" },
                  { value: "scheduled", label: "Planifié" },
                  { value: "in_transit", label: "En cours" },
                  { value: "completed", label: "Terminé" },
                  { value: "cancelled", label: "Annulé" },
                  { value: "delayed", label: "Retard" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`admin-pill-btn ${status === item.value ? "active" : ""}`}
                    onClick={() => setStatus(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="admin-status-pills-filter">
              <span className="admin-filter-label">Compagnie ou véhicule</span>
              <div className="admin-pills-group admin-pills-scroll" role="group" aria-label="Filtrer par compagnie">
                <button
                  type="button"
                  aria-pressed={airline === "all"}
                  className={`admin-pill-btn ${airline === "all" ? "active" : ""}`}
                  onClick={() => setAirline("all")}
                >
                  Toutes
                </button>
                {[...new Set(trips.rows.map((row) => row.transportLabel))].map(
                  (name) => (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={airline === name}
                      className={`admin-pill-btn ${airline === name ? "active" : ""}`}
                      onClick={() => setAirline(name)}
                    >
                      {name}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="admin-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Trajet</th>
                  <th>Transporteur</th>
                  <th>Compagnie / vol</th>
                  <th>Départ</th>
                  <th>Capacité</th>
                  <th>État</th>
                </tr>
              </thead>
              <tbody>
                {trips.rows
                  .filter(
                    (row) =>
                      (airline === "all" || row.transportLabel === airline) &&
                      (status === "all" ||
                        (status === "delayed"
                          ? (row.delayMinutes || 0) > 0
                          : (row.status || "scheduled") === status)),
                  )
                  .map((row) => (
                    <tr key={row.id}>
                      <td>
                        <a href={`/#trip/${row.id}`}>
                          {row.origin} → {row.destination}
                        </a>
                      </td>
                      <td>{row.travelerName}</td>
                      <td>
                        {row.transportLabel}
                        <small>
                          {row.flightNumber || "Sans référence de vol"}
                        </small>
                      </td>
                      <td>
                        {row.departureDate}
                        <small>{row.departureTime}</small>
                      </td>
                      <td>{row.availableKg} kg</td>
                      <td>
                        {row.delayMinutes ? (
                          <span className="risk-badge">
                            Retard : {row.delayMinutes} min
                          </span>
                        ) : (
                          {
                            scheduled: "Planifié",
                            in_transit: "En cours",
                            completed: "Terminé",
                            cancelled: "Annulé",
                          }[row.status || "scheduled"]
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="admin-footnote">
            Statuts déclarés dans le registre. Aucun suivi aérien externe n’est
            connecté.
          </p>
        </section>
      )}
      {tab === "chats" && (
        <section>
          <div className="admin-section-title">
            <h2>Modération des conversations</h2>
            <span>{signals} signaux à examiner</span>
          </div>
          <div className="admin-chat-grid">
            <aside>
              <label className="admin-search">
                <Search size={17} />
                <input
                  aria-label="Rechercher une conversation"
                  placeholder="Nom, annonce, message…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <div className="admin-chat-list">
                {conversations.rows
                  .filter((row) =>
                    `${row.name} ${row.subject} ${row.messages.map((message) => message.text).join(" ")}`
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase()),
                  )
                  .map((row) => (
                    <button
                      key={row.id}
                      aria-pressed={chat?.id === row.id}
                      onClick={() => setChatId(row.id)}
                    >
                      <strong>{row.name}</strong>
                      <span>{row.subject}</span>
                      <small>{row.messages.length} messages</small>
                    </button>
                  ))}
              </div>
            </aside>
            <div className="admin-chat-detail">
              {chat ? (
                <>
                  <h3>
                    {chat.name} / {chat.subject}
                  </h3>
                  <div
                    role="log"
                    aria-label="Lecture administrateur"
                    className="admin-chat-log"
                  >
                    {chat.messages.map((message) => (
                      <article
                        key={message.id}
                        className={message.official ? "official-message" : ""}
                      >
                        <small>
                          {message.official
                            ? "Support Officiel BagVoyage"
                            : message.mine
                              ? "Compte local"
                              : chat.name}{" "}
                          · {message.time}
                        </small>
                        <p>{message.text}</p>
                        {!message.official &&
                          moderationSignals(message.text).map((signal) => (
                            <span className="risk-badge" key={signal}>
                              {signal}
                            </span>
                          ))}
                      </article>
                    ))}
                  </div>
                </>
              ) : (
                <p>Aucune conversation.</p>
              )}
              <form
                className="admin-message-form"
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (
                    await run(
                      () =>
                        sendOfficialMessage(
                          targetType === "user"
                            ? { userId }
                            : { conversationId: chat?.id },
                          draft,
                        ),
                      "Message officiel envoyé.",
                    )
                  )
                    setDraft("");
                }}
              >
                <h3>Message direct du support</h3>
                <div className="admin-target-type-selector">
                  <span className="admin-filter-label">Type de destinataire</span>
                  <div className="admin-pills-group" role="group" aria-label="Type de destinataire">
                    <button
                      type="button"
                      className={`admin-pill-btn ${targetType === "conversation" ? "active" : ""}`}
                      onClick={() => setTargetType("conversation")}
                    >
                      Conversation affichée
                    </button>
                    <button
                      type="button"
                      className={`admin-pill-btn ${targetType === "user" ? "active" : ""}`}
                      onClick={() => setTargetType("user")}
                    >
                      Utilisateur
                    </button>
                  </div>
                </div>
                {targetType === "user" && (
                  <div className="admin-status-pills-filter">
                    <span className="admin-filter-label">Destinataire utilisateur</span>
                    <div className="admin-pills-group admin-user-select-grid" role="group" aria-label="Choisir un utilisateur">
                      {users.rows.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          aria-pressed={userId === user.id}
                          className={`admin-pill-btn ${userId === user.id ? "active" : ""}`}
                          onClick={() => setUserId(user.id)}
                        >
                          <span>{user.name}</span>
                          <span className="admin-pill-subtext">{user.email}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <label>
                  Message officiel
                  <textarea
                    value={draft}
                    required
                    maxLength={2000}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Votre message sera signé Support Officiel BagVoyage."
                  />
                </label>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={busy || (targetType === "conversation" && !chat)}
                >
                  Envoyer le message officiel
                </button>
              </form>
            </div>
          </div>
          <p className="admin-footnote">
            Les signaux sont des indices de relecture, pas des preuves de
            fraude.
          </p>
        </section>
      )}
      {tab === "kyc" && (
        <section>
          <div className="admin-section-title">
            <h2>Vérifier avant de certifier.</h2>
            <span>{pending} en attente</span>
          </div>
          <h3 className="admin-subtitle">
            Dossiers transporteurs professionnels
          </h3>
          {!applications.rows.length && (
            <p className="admin-empty">
              Aucun dossier professionnel reçu. Le dépôt se fait depuis le
              profil.
            </p>
          )}
          <div className="admin-application-grid">
            {applications.rows.map((application) => (
              <article className="admin-application" key={application.id}>
                <header>
                  <BuildingMark />
                  <div>
                    <h3>{application.companyName}</h3>
                    <small>
                      {application.country} / {application.registration}
                    </small>
                  </div>
                  <span className="status-badge">
                    {
                      {
                        pending: "À examiner",
                        approved: "Approuvé",
                        rejected: "Rejeté",
                      }[application.status]
                    }
                  </span>
                </header>
                <p>
                  {users.rows.find((user) => user.id === application.userId)
                    ?.name || application.userId}
                </p>
                {Object.entries(proDocumentLabels).map(([key, label]) => (
                  <div className="admin-document-row" key={key}>
                    <span>{label}</span>
                    {application.documents[
                      key as keyof typeof application.documents
                    ] ? (
                      renderDocuments([
                        application.documents[
                          key as keyof typeof application.documents
                        ],
                      ])
                    ) : (
                      <strong>Manquant</strong>
                    )}
                  </div>
                ))}
                <ul>
                  {application.fleet.map((vehicle) => (
                    <li key={vehicle.id}>
                      {vehicle.type} / {vehicle.payloadKg} kg / {vehicle.volume}{" "}
                      m³
                    </li>
                  ))}
                </ul>
                {application.status === "pending" ? (
                  <>
                    <label>
                      Motif de décision pour {application.companyName}
                      <textarea
                        maxLength={1000}
                        value={reasons[application.id] || ""}
                        onChange={(event) =>
                          setReasons((current) => ({
                            ...current,
                            [application.id]: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <div className="admin-actions">
                      <button
                        className="primary-button"
                        disabled={busy}
                        onClick={() =>
                          void run(
                            () =>
                              reviewProApplication(
                                application.id,
                                "approved",
                                reasons[application.id] || "",
                              ),
                            "Dossier approuvé. Badge professionnel attribué.",
                          )
                        }
                      >
                        Approuver et certifier
                      </button>
                      <button
                        className="outline-button"
                        disabled={busy}
                        onClick={() =>
                          void run(
                            () =>
                              reviewProApplication(
                                application.id,
                                "rejected",
                                reasons[application.id] || "",
                              ),
                            "Dossier rejeté avec motif.",
                          )
                        }
                      >
                        Rejeter avec motif
                      </button>
                    </div>
                  </>
                ) : (
                  <p>
                    {application.status === "approved"
                      ? "Transporteur Professionnel Vérifié"
                      : application.reason}
                  </p>
                )}
              </article>
            ))}
          </div>
          <h3 className="admin-subtitle">Identité des particuliers</h3>
          {!kyc.rows.length && (
            <p className="admin-empty">Aucun dossier d’identité.</p>
          )}
          {kyc.rows.map((record) => (
            <article className="admin-application" key={record.id}>
              <h3>
                {users.rows.find((user) => user.id === record.userId)?.name ||
                  record.userId}
              </h3>
              <p>
                Statut :{" "}
                {record.status === "verified"
                  ? "Vérifié"
                  : record.status === "pending"
                    ? "En attente"
                    : "Rejeté"}
              </p>
              {record.status === "pending" && (
                <>
                  <label>
                    Motif KYC pour {record.userId}
                    <textarea
                      maxLength={1000}
                      value={reasons[record.id] || ""}
                      placeholder="Motif de validation eIDAS ou note administrative..."
                      onChange={(event) =>
                        setReasons((current) => ({
                          ...current,
                          [record.id]: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <div className="admin-actions">
                    <button
                      className="primary-button"
                      disabled={busy}
                      onClick={() =>
                        void run(
                          () =>
                            reviewKyc(
                              record.id,
                              true,
                              reasons[record.id] || "Dossier vérifié et validé",
                            ),
                          "Identité approuvée.",
                        )
                      }
                    >
                      Approuver l’identité
                    </button>
                    <button
                      className="outline-button"
                      disabled={busy}
                      onClick={() =>
                        void run(
                          () =>
                            reviewKyc(
                              record.id,
                              false,
                              reasons[record.id] || "",
                            ),
                          "Identité rejetée avec motif.",
                        )
                      }
                    >
                      Rejeter l’identité
                    </button>
                  </div>
                </>
              )}
              {record.reason && <p>{record.reason}</p>}
            </article>
          ))}
        </section>
      )}
      {tab === "escrow" && (
        <section>
          <div className="admin-section-title">
            <h2>Litiges et décisions de séquestre</h2>
            <span>{money(balance.escrow)} en attente</span>
          </div>
          <p className="admin-footnote">
            Chaque décision clôt le séquestre du registre local une seule fois.
            Les virements réels nécessitent le prestataire de paiement.
          </p>
          {conversations.rows
            .filter((row) => row.stage !== "discussion")
            .map((row) => (
              <article className="admin-application" key={row.id}>
                <header>
                  <div>
                    <h3>{row.subject}</h3>
                    <p>
                      {row.name} / {money(Math.round(row.amount * 100))}
                    </p>
                  </div>
                  <span className="status-badge">
                    {row.resolution
                      ? "Décision enregistrée"
                      : row.stage === "delivered"
                        ? "Livré"
                        : "Séquestré"}
                  </span>
                </header>
                {row.dispute && (
                  <p className="risk-badge">Litige : {row.dispute.reason}</p>
                )}
                {row.resolution ? (
                  <p>
                    {row.resolution.outcome === "release"
                      ? "Fonds débloqués au voyageur"
                      : "Expéditeur remboursé"}{" "}
                    / {row.resolution.reason}
                  </p>
                ) : (
                  row.stage !== "delivered" && (
                    <div className="admin-actions">
                      <button
                        className="primary-button"
                        onClick={() => {
                          setDecision({
                            id: row.id,
                            subject: row.subject,
                            amount: row.amount,
                            outcome: "release",
                          });
                          setDecisionReason("");
                        }}
                      >
                        Débloquer au voyageur
                      </button>
                      <button
                        className="outline-button"
                        onClick={() => {
                          setDecision({
                            id: row.id,
                            subject: row.subject,
                            amount: row.amount,
                            outcome: "refund",
                          });
                          setDecisionReason("");
                        }}
                      >
                        Rembourser l’expéditeur
                      </button>
                    </div>
                  )
                )}
              </article>
            ))}
        </section>
      )}
      {tab === "database" && (
        <section className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Database size={22} className="text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Studio Base de Données
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                  IndexedDB v2
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explorez, inspectez, modifiez et exportez les tables de votre application BagVoyage en temps réel.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await seedDemoDatabase();
                    setDbNotice(`${res.createdCount} comptes & profils vérifiés ont été injectés dans la base.`);
                    setTimeout(() => setDbNotice(""), 4000);
                  } catch (err) {
                    setDbNotice("Erreur lors de l'initialisation.");
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Sparkles size={14} />
                Peupler données de test
              </button>

              <button
                type="button"
                onClick={async () => {
                  const data = await exportDatabaseAsJson();
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = window.document.createElement("a");
                  a.href = url;
                  a.download = `bagvoyage_database_${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
              >
                <Download size={14} />
                Export JSON
              </button>

              <button
                type="button"
                onClick={async () => {
                  const sql = await exportDatabaseAsSql();
                  const blob = new Blob([sql], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = window.document.createElement("a");
                  a.href = url;
                  a.download = `bagvoyage_schema_${new Date().toISOString().slice(0, 10)}.sql`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
              >
                <Download size={14} />
                Export SQL (Postgres)
              </button>
            </div>
          </div>

          {dbNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Sparkles size={16} />
              {dbNotice}
            </div>
          )}

          {/* Table Selector Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Tables du schéma
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "users" as const, label: "users", count: users.rows.length },
                { name: "profiles" as const, label: "profiles", count: profiles.rows.length },
                { name: "trips" as const, label: "trips", count: trips.rows.length },
                { name: "purchase_requests" as const, label: "purchase_requests", count: requests.rows.length },
                { name: "orders" as const, label: "orders", count: orders.rows.length },
                { name: "conversations" as const, label: "conversations", count: conversations.rows.length },
                { name: "wallet_transactions" as const, label: "wallet_transactions", count: ledger.rows.length },
                { name: "admin_messages" as const, label: "admin_messages", count: adminMsgs.rows.length },
                { name: "kyc_records" as const, label: "kyc_records", count: kyc.rows.length },
                { name: "pro_applications" as const, label: "pro_applications", count: applications.rows.length },
              ].map((tbl) => (
                <button
                  key={tbl.name}
                  type="button"
                  onClick={() => {
                    setSelectedTable(tbl.name);
                    setSelectedRecord(null);
                    setDbSearch("");
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedTable === tbl.name
                      ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <span>{tbl.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      selectedTable === tbl.name
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {tbl.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Data Viewer */}
          {(() => {
            let currentRows: Record<string, unknown>[] = [];
            if (selectedTable === "users") currentRows = users.rows as unknown as Record<string, unknown>[];
            else if (selectedTable === "profiles") currentRows = profiles.rows as unknown as Record<string, unknown>[];
            else if (selectedTable === "trips") currentRows = trips.rows as unknown as Record<string, unknown>[];
            else if (selectedTable === "purchase_requests") currentRows = requests.rows as unknown as Record<string, unknown>[];
            else if (selectedTable === "orders") currentRows = orders.rows as unknown as Record<string, unknown>[];
            else if (selectedTable === "conversations") currentRows = conversations.rows as unknown as Record<string, unknown>[];
            else if (selectedTable === "wallet_transactions") currentRows = ledger.rows as unknown as Record<string, unknown>[];
            else if (selectedTable === "admin_messages") currentRows = adminMsgs.rows as unknown as Record<string, unknown>[];
            else if (selectedTable === "kyc_records") currentRows = kyc.rows as unknown as Record<string, unknown>[];
            else if (selectedTable === "pro_applications") currentRows = applications.rows as unknown as Record<string, unknown>[];

            const filteredRows = currentRows.filter((row) => {
              if (!dbSearch) return true;
              const text = JSON.stringify(row).toLowerCase();
              return text.includes(dbSearch.toLowerCase());
            });

            return (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      Table : {selectedTable}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ({filteredRows.length} {filteredRows.length === 1 ? "ligne" : "lignes"})
                    </span>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filtrer les enregistrements..."
                      value={dbSearch}
                      onChange={(e) => setDbSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {filteredRows.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                    Aucun enregistrement trouvé dans la table <code className="font-mono">{selectedTable}</code>.
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[500px]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-3">ID Clé</th>
                          <th className="p-3">Attribut Principal</th>
                          <th className="p-3">Détail / Statut</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                        {filteredRows.map((row, idx) => {
                          const id = String(row.id || idx);
                          const mainAttr =
                            String(row.name || row.title || row.email || row.companyName || row.origin || "N/A");
                          const subAttr =
                            String(row.role || row.status || row.departureDate || row.type || row.updatedAt || "");

                          return (
                            <tr
                              key={id}
                              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              <td className="p-3 font-mono text-[11px] text-blue-600 dark:text-blue-400 max-w-[180px] truncate">
                                {id}
                              </td>
                              <td className="p-3 font-semibold text-slate-900 dark:text-white max-w-[240px] truncate">
                                {mainAttr}
                              </td>
                              <td className="p-3 text-slate-500 dark:text-slate-400">
                                {subAttr ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                                    {subAttr}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td className="p-3 text-right space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedRecord(row)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                                >
                                  <Eye size={12} />
                                  Inspecter
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (confirm(`Supprimer l'enregistrement ${id} de la table ${selectedTable} ?`)) {
                                      await deleteRecord(selectedTable, id);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px] font-semibold text-rose-600 dark:text-rose-400 transition-colors"
                                  title="Supprimer l'enregistrement"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Record JSON Inspector Dialog */}
          {selectedRecord && (
            <Dialog
              title={`Inspecteur : ${selectedTable} [${selectedRecord.id || "N/A"}]`}
              onClose={() => setSelectedRecord(null)}
              wide
            >
              <div className="space-y-4 text-left p-1">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Schéma : <code className="font-mono text-blue-600">{selectedTable}</code>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(selectedRecord, null, 2));
                      alert("JSON copié dans le presse-papier !");
                    }}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Copier le JSON
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-auto max-h-[380px] leading-relaxed border border-slate-800">
                  <pre>{JSON.stringify(selectedRecord, null, 2)}</pre>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRecord(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </Dialog>
          )}
        </section>
      )}
      {document && (
        <Dialog title={document.name} onClose={() => setDocument(null)} wide>
          <div className="document-preview">
            {document.type === "application/pdf" ? (
              <iframe title={`Aperçu ${document.name}`} src={document.data} />
            ) : (
              <img src={document.data} alt={document.name} />
            )}
            <a
              className="outline-button"
              href={document.data}
              download={document.name}
            >
              Télécharger la pièce
            </a>
          </div>
        </Dialog>
      )}
      {decision && (
        <Dialog title="Confirmer la décision" onClose={() => setDecision(null)}>
          <form
            className="publish-form"
            onSubmit={async (event) => {
              event.preventDefault();
              if (
                await run(
                  () =>
                    resolveEscrow(
                      decision.id,
                      decision.outcome,
                      decisionReason,
                    ),
                  "Décision enregistrée dans le registre local.",
                )
              )
                setDecision(null);
            }}
          >
            <p>
              {decision.subject} / {money(Math.round(decision.amount * 100))}
            </p>
            <p>
              {decision.outcome === "release"
                ? "Déblocage au voyageur"
                : "Remboursement à l’expéditeur"}
              . Cette décision clôt le séquestre local.
            </p>
            <label>
              Motif de la décision
              <textarea
                required
                maxLength={1000}
                value={decisionReason}
                onChange={(event) => setDecisionReason(event.target.value)}
              />
            </label>
            {error && <p role="alert">{error}</p>}
            <button className="primary-button" disabled={busy} type="submit">
              Confirmer la décision locale
            </button>
          </form>
        </Dialog>
      )}
    </section>
  );
}
function BuildingMark() {
  return (
    <span className="admin-building">
      <ShieldCheck size={24} />
    </span>
  );
}
