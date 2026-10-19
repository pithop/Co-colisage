import { useState } from "react";
import { useDatabaseQuery } from "../../hooks/useDatabaseQuery";
import {
  Check,
  Wallet,
  ChevronRight,
  Info,
  Package,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Award,
  Clock3,
  MessageCircle,
  Zap,
} from "lucide-react";
export type Intention = "request" | "shop" | "carry" | "send" | "receive";
export function Profile({
  actorId,
  userEmail,
  onPublishRole,
  onPro,
  onMessages,
  onWallet,
  walletBalance,
  selected,
  onSelect,
  onContinue,
  onLogin,
  onApple,
  onRegister,
  userName,
  kycStatus,
  onLogout,
  autoAccept,
  onAutoAcceptChange,
  onTrust,
}: {
  actorId: string;
  userEmail?: string;
  onPublishRole: (kind: "requests" | "trips" | "parcel") => void;
  onPro: () => void;
  onMessages: () => void;
  onWallet: () => void;
  walletBalance: string;
  selected: Intention[];
  onSelect: (roles: Intention[]) => void;
  onContinue: () => void;
  onLogin: () => void;
  onApple: () => void;
  onRegister: () => void;
  userName?: string;
  kycStatus?: "verified" | "pending" | "unverified";
  onLogout: () => void;
  autoAccept: boolean;
  onAutoAcceptChange: (enabled: boolean) => void;
  onTrust?: () => void;
}) {
  const [activeRole, setActiveRole] = useState<
    "carry" | "send" | "request" | "receive"
  >("request");
  const { rows: trips } = useDatabaseQuery("trips");
  const { rows: requests } = useDatabaseQuery("purchase_requests");
  const { rows: applications } = useDatabaseQuery("pro_applications");
  const application =
    applications.find(
      (row) => row.userId === actorId && row.status !== "rejected",
    ) || applications.find((row) => row.userId === actorId);
  const activities =
    activeRole === "carry"
      ? trips
          .filter((row) => row.ownerId === actorId)
          .map((row) => ({
            id: row.id,
            title: `${row.origin} → ${row.destination}`,
            detail: row.departureDate,
            href: `/#trip/${row.id}`,
          }))
      : requests
          .filter((row) =>
            activeRole === "receive"
              ? !!userEmail &&
                row.recipientEmail?.toLowerCase() === userEmail.toLowerCase()
              : row.ownerId === actorId &&
                (activeRole === "send"
                  ? row.kind === "parcel"
                  : row.kind !== "parcel"),
          )
          .map((row) => ({
            id: row.id,
            title: row.title,
            detail: row.date,
            href: `/#request/${row.id}`,
          }));
  const roleTitles = {
    carry: "Mes trajets",
    send: "Mes envois",
    request: "Mes achats Shop & Go",
    receive: "Mes livraisons à recevoir",
  };
  return (
    <section className="profile-page">
      <span className="eyebrow">VOTRE PROFIL, VOS ENVIES</span>
      <h1>Que souhaitez-vous faire ?</h1>
      <p className="profile-subtitle">Un compte, plusieurs possibilités.</p>
      <button className="profile-wallet" onClick={onWallet}>
        <span className="finance-icon">
          <Wallet size={22} />
        </span>
        <span>
          <strong>Mon portefeuille</strong>
          <small>Solde disponible · {walletBalance}</small>
        </span>
        <ChevronRight size={20} />
      </button>
      <section className="role-workspace" aria-label="Mes quatre rôles">
        <div className="role-tabs" aria-label="Choisir une activité">
          {(
            [
              { id: "carry", label: "Transporteur", Icon: Truck },
              { id: "send", label: "Envoyeur", Icon: Package },
              { id: "request", label: "Acheteur", Icon: ShoppingBag },
              { id: "receive", label: "Receveur", Icon: ShieldCheck },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              aria-pressed={activeRole === id}
              onClick={() => setActiveRole(id)}
            >
              <Icon size={22} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>
        <div className="role-content">
          <h2>{roleTitles[activeRole]}</h2>
          <p>
            {activeRole === "receive"
              ? "Retrouvez les colis adressés à votre compte. Validez la remise par QR code ou PIN dans la conversation."
              : "Toutes vos activités restent accessibles avec le même compte."}
          </p>
          <label className="check-row">
            <input
              type="checkbox"
              checked={selected.includes(activeRole)}
              onChange={() =>
                onSelect(
                  selected.includes(activeRole)
                    ? selected.filter((role) => role !== activeRole)
                    : [...selected, activeRole],
                )
              }
            />
            Activer ce rôle dans mes préférences
          </label>
          {activities.length ? (
            <ul>
              {activities.map((activity) => (
                <li key={activity.id}>
                  <a href={activity.href}>
                    <span>{activity.title}</span>
                    <small>{activity.detail}</small>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune activité pour ce rôle pour le moment.</p>
          )}
          <button
            className="primary-button"
            onClick={() =>
              activeRole === "receive"
                ? onMessages()
                : onPublishRole(
                    activeRole === "carry"
                      ? "trips"
                      : activeRole === "send"
                        ? "parcel"
                        : "requests",
                  )
            }
          >
            {activeRole === "receive"
              ? "Valider une livraison"
              : activeRole === "carry"
                ? "Proposer un trajet"
                : activeRole === "send"
                  ? "Envoyer un colis"
                  : "Créer une liste d’achats"}
            <ChevronRight size={17} />
          </button>
        </div>
      </section>
      <div className="pro-entry">
        <ShieldCheck size={24} />
        <div>
          <strong>
            {application?.status === "approved"
              ? "Transporteur Professionnel Vérifié"
              : "Votre espace professionnel"}
          </strong>
          <p>
            {application?.status === "pending"
              ? "Dossier en cours d’examen."
              : application?.status === "rejected"
                ? `Dossier rejeté : ${application.reason}`
                : application?.status === "approved"
                  ? application.companyName
                  : "Entreprise, documents et flotte en un seul dossier."}
            </p>
          </div>
          {(!application || application.status === "rejected") && (
            <button onClick={onPro}>Devenir transporteur pro</button>
          )}
        </div>
      <div className="trust-hub-card">
        <ShieldCheck size={24} />
        <div>
          <strong>Centre de Confiance & Vérification</strong>
          <p>
            Vérification mobile SMS, pièce d'identité et certification Stripe Identity pour sécuriser vos remises.
          </p>
        </div>
        {onTrust && (
          <button type="button" onClick={onTrust}>Vérifier mon profil</button>
        )}
      </div>
      <div className="profile-preferences-header">
        <h3>Préférences de recherche dans Explorer</h3>
        <p>Sélectionnez les catégories d’annonces à afficher en priorité lors de votre navigation.</p>
      </div>
      <div className="intention-list">
        {[
          {
            id: "request" as const,
            Icon: ShoppingBag,
            title: "Je souhaite un article",
            description: "Je précise mon besoin et mon lieu de livraison.",
          },
          {
            id: "shop" as const,
            Icon: Package,
            title: "J’achète et je livre",
            description: "J’achète l’article demandé et je le ramène.",
          },
          {
            id: "carry" as const,
            Icon: Truck,
            title: "Je transporte",
            description: "Je propose la place disponible sur mon trajet.",
          },
        ].map(({ id, Icon, title, description }) => (
          <label
            className={`intention-card ${selected.includes(id) ? "is-selected" : ""}`}
            key={id}
          >
            <span className="intention-icon">
              <Icon size={25} strokeWidth={1.5} />
            </span>
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <input
              type="checkbox"
              aria-label={title}
              checked={selected.includes(id)}
              onChange={() =>
                onSelect(
                  selected.includes(id)
                    ? selected.filter((r) => r !== id)
                    : [...selected, id],
                )
              }
            />
            <span className="checkbox-drawing" aria-hidden="true">
              {selected.includes(id) && <Check size={15} />}
            </span>
          </label>
        ))}
      </div>
      <p className="profile-reassurance">
        <Info size={17} />
        Vous pourrez changer de rôle à tout moment.
      </p>
      <section
        className="verification-panel"
        aria-labelledby="verification-title"
      >
        <div className="verification-heading">
          <h2 id="verification-title">Statut & Vérification</h2>
          <span>Votre identité BagVoyage</span>
        </div>
        <div className="kyc-status">
          <span className="verification-icon">
            <ShieldCheck size={24} />
          </span>
          <div>
            <strong>
              {kycStatus === "pending"
                ? "Identité en attente de vérification"
                : kycStatus !== "verified"
                  ? "Identité non vérifiée"
                  : "Identité vérifiée"}
            </strong>
            <p>
              {kycStatus === "pending"
                ? "Dossier en attente de contrôle d’identité"
                : kycStatus !== "verified"
                  ? "Selfie et pièce d’identité à fournir"
                  : "Selfie et pièce d’identité validés"}
            </p>
          </div>
          {kycStatus === "pending" ? <Clock3 size={18} /> : <Check size={18} />}
        </div>
        <div className="traveler-status">
          <div className="traveler-status-heading">
            <Award size={24} />
            <div>
              <h3>Statut Super Voyageur</h3>
              <p>La confiance se construit à chaque trajet.</p>
            </div>
          </div>
          <ul className="trust-criteria">
            {[
              {
                Icon: Zap,
                label: "Réactivité de réponse",
                value: 98,
                max: 100,
                display: "98%",
                detail: "Réponse en moins de 15 min pour 98% des échanges.",
              },
              {
                Icon: Clock3,
                label: "Ponctualité",
                value: 99,
                max: 100,
                display: "99%",
                detail: "99% des rendez-vous honorés à l’heure convenue.",
              },
              {
                Icon: MessageCircle,
                label: "Échange clair",
                value: 4.9,
                max: 5,
                display: "4.9 / 5",
                detail:
                  "Une note de 4.9 sur 5 pour la clarté des échanges et des instructions.",
              },
              {
                Icon: Package,
                label: "Marchandise intacte",
                value: 100,
                max: 100,
                display: "100%",
                detail: "100% des marchandises remises en bon état.",
              },
            ].map(({ Icon, label, value, max, display, detail }, index) => (
              <li key={label}>
                <details className="reputation-criterion">
                  <summary>
                    <span>
                      <Icon size={16} />
                      <span>{label}</span>
                      <strong>{display}</strong>
                      <ChevronRight size={14} />
                    </span>
                    <span
                      className="reputation-track"
                      role="progressbar"
                      aria-label={label}
                      aria-valuemin={0}
                      aria-valuemax={max}
                      aria-valuenow={value}
                      aria-valuetext={display}
                      aria-describedby={`reputation-detail-${index}`}
                    >
                      <span style={{ width: `${(value / max) * 100}%` }} />
                    </span>
                  </summary>
                  <p id={`reputation-detail-${index}`}>{detail}</p>
                </details>
              </li>
            ))}
          </ul>
          <p className="reputation-note">
            Sélectionnez un critère pour découvrir son détail.
          </p>
        </div>
      </section>
      <div className="instant-preference">
        <span className="instant-preference-icon">
          <Zap size={20} />
        </span>
        <div>
          <label htmlFor="profile-auto-accept">
            Acceptation automatique instantanée
          </label>
          <p id="auto-accept-hint">
            Profils vérifiés uniquement. Réglage par défaut de vos nouveaux
            trajets.
          </p>
        </div>
        <input
          id="profile-auto-accept"
          className="preference-switch"
          type="checkbox"
          role="switch"
          checked={autoAccept}
          onChange={(event) => onAutoAcceptChange(event.target.checked)}
          aria-describedby="auto-accept-hint"
        />
      </div>
      <button
        className="primary-button"
        disabled={!selected.length}
        onClick={onContinue}
      >
        Continuer
        <ChevronRight size={18} />
      </button>
      <button className="outline-button apple-button" onClick={onApple}>
        <svg
          width="18"
          height="21"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.05 12.54c.03 3.19 2.8 4.25 2.83 4.27-.02.08-.44 1.52-1.46 3.01-.88 1.28-1.79 2.56-3.22 2.59-1.41.03-1.86-.83-3.47-.83-1.6 0-2.1.81-3.44.86-1.38.05-2.43-1.38-3.31-2.65-1.8-2.6-3.17-7.36-1.32-10.58a5.14 5.14 0 0 1 4.36-2.64c1.36-.02 2.65.92 3.47.92.83 0 2.38-1.14 4.02-.97.69.03 2.61.28 3.84 2.08-.1.06-2.29 1.34-2.27 3.94M14.4 4.8c.73-.88 1.22-2.1 1.09-3.31-1.05.04-2.33.7-3.09 1.58-.68.78-1.28 2.02-1.12 3.21 1.17.09 2.38-.6 3.12-1.48" />
        </svg>
        Continuer avec Apple
      </button>
      {userName ? (
        <p className="profile-login">
          Connecté : {userName}.{" "}
          <button onClick={onLogout}>Se déconnecter</button>
        </p>
      ) : (
        <p className="profile-login">
          Déjà inscrit ? <button onClick={onLogin}>Se connecter</button>
          <span className="profile-register">
            Nouveau ici ? <button onClick={onRegister}>Créer un compte</button>
          </span>
        </p>
      )}
    </section>
  );
}
