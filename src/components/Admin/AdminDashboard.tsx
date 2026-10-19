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
} from "lucide-react";
import { useDatabaseQuery } from "../../hooks/useDatabaseQuery";
import {
  localAdminEnabled,
  sendOfficialMessage,
  reviewProApplication,
  reviewKyc,
  resolveEscrow,
} from "../../services/adminOperations";
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
  const applications = useDatabaseQuery("pro_applications");
  const kyc = useDatabaseQuery("kyc_records");
  const ledger = useDatabaseQuery("wallet_transactions");
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
            <label>
              Statut du trajet
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="scheduled">Planifié</option>
                <option value="in_transit">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
                <option value="delayed">Retard signalé</option>
              </select>
            </label>
            <label>
              Compagnie ou véhicule
              <select
                value={airline}
                onChange={(event) => setAirline(event.target.value)}
              >
                <option value="all">Toutes les compagnies</option>
                {[...new Set(trips.rows.map((row) => row.transportLabel))].map(
                  (name) => (
                    <option key={name}>{name}</option>
                  ),
                )}
              </select>
            </label>
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
                <label>
                  Type de destinataire
                  <select
                    value={targetType}
                    onChange={(event) => setTargetType(event.target.value)}
                  >
                    <option value="conversation">Conversation affichée</option>
                    <option value="user">Utilisateur</option>
                  </select>
                </label>
                {targetType === "user" && (
                  <label>
                    Destinataire utilisateur
                    <select
                      required
                      value={userId}
                      onChange={(event) => setUserId(event.target.value)}
                    >
                      <option value="">Choisir un utilisateur</option>
                      {users.rows.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} / {user.email}
                        </option>
                      ))}
                    </select>
                  </label>
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
                    : "Non vérifié"}
              </p>
              {renderDocuments(record.documents || [])}
              {record.status === "pending" && (
                <>
                  {(record.documents?.length || 0) < 2 && (
                    <p>
                      Pièce d’identité et selfie manquants : approbation
                      indisponible.
                    </p>
                  )}
                  <label>
                    Motif KYC pour {record.userId}
                    <textarea
                      maxLength={1000}
                      value={reasons[record.id] || ""}
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
                      disabled={busy || (record.documents?.length || 0) < 2}
                      onClick={() =>
                        void run(
                          () =>
                            reviewKyc(
                              record.id,
                              true,
                              reasons[record.id] || "",
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
