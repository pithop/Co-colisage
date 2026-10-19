import { useState } from "react";
import {
  ArrowRight,
  Bell,
  CheckCheck,
  Clock3,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useModalFocus } from "../../hooks/useModalFocus";

export type NotificationTarget = "arbitrage" | "sarah" | "karim" | "profile";
export const platformNotifications = [
  {
    id: "arbitrage",
    category: "Arbitrage IA",
    title:
      "Voyagez gratuit : Vol Marseille-Alger à 49 € pour 150 € de commandes (Gain net : +101 €)",
    detail:
      "Une mission de shopping peut financer votre billet. Comparez les départs et ajustez les commandes dans le simulateur.",
    action: "Simuler ce vol",
    target: "arbitrage",
    Icon: Sparkles,
    time: "Il y a 5 min",
    tone: "profit",
  },
  {
    id: "pickup",
    category: "Suivi de commande",
    title:
      "Sarah a validé la prise en charge de votre commande avec photo de conformité",
    detail:
      "Ouvrez la conversation avec Sarah pour consulter le suivi et les justificatifs disponibles. La caution reste bloquée jusqu’à la validation de la livraison.",
    action: "Ouvrir le suivi avec Sarah",
    target: "sarah",
    Icon: PackageCheck,
    time: "Il y a 24 min",
    tone: "tracking",
  },
  {
    id: "delay",
    category: "Alerte retard",
    title: "Karim a signalé un retard sur le vol AH1021",
    detail:
      "Le rendez-vous de remise peut être décalé. Contactez Karim pour convenir du nouvel horaire avant votre déplacement.",
    action: "Contacter Karim",
    target: "karim",
    Icon: Clock3,
    time: "Il y a 48 min",
    tone: "delay",
  },
  {
    id: "kyc",
    category: "Identité & sécurité",
    title: "Votre identité a été vérifiée par selfie et pièce d'identité",
    detail:
      "Consultez le statut de vérification de votre profil. Cette alerte illustre le parcours KYC et ne modifie pas le statut de votre compte.",
    action: "Voir mon profil",
    target: "profile",
    Icon: ShieldCheck,
    time: "Il y a 2 h",
    tone: "identity",
  },
] as const;

export function NotificationsDrawer({
  readIds,
  onRead,
  onReadAll,
  onNavigate,
  onClose,
}: {
  readIds: string[];
  onRead: (id: string) => void;
  onReadAll: () => void;
  onNavigate: (target: NotificationTarget) => void;
  onClose: () => void;
}) {
  const ref = useModalFocus(true, onClose);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const unread = platformNotifications.filter(
    (item) => !readIds.includes(item.id),
  );
  const visible = onlyUnread
    ? platformNotifications.filter(
        (item) => !readIds.includes(item.id) || item.id === expanded,
      )
    : platformNotifications;
  return (
    <div
      className="notifications-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="notifications-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-title"
        ref={ref}
        id="notifications-drawer"
      >
        <header>
          <div>
            <span className="eyebrow">VOTRE CENTRE D’ACTIVITÉ</span>
            <h2 id="notifications-title">
              Notifications <span>{unread.length}</span>
            </h2>
          </div>
          <button
            className="icon-button"
            aria-label="Fermer les notifications"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </header>
        <div className="notifications-toolbar">
          <div role="group" aria-label="Filtrer les notifications">
            <button
              aria-pressed={!onlyUnread}
              onClick={() => {
                setOnlyUnread(false);
                setExpanded(null);
              }}
            >
              Toutes
            </button>
            <button
              aria-pressed={onlyUnread}
              onClick={() => {
                setOnlyUnread(true);
                setExpanded(null);
              }}
            >
              Non lues
            </button>
          </div>
          <button
            className="read-all"
            disabled={!unread.length}
            onClick={() => {
              onReadAll();
              setExpanded(null);
            }}
          >
            <CheckCheck size={16} /> Tout lire
          </button>
        </div>
        <p className="notifications-demo">
          Exemples de démonstration · découvrez les parcours de la plateforme.
        </p>
        <div className="notifications-feed">
          {visible.map((item) => {
            const read = readIds.includes(item.id);
            const open = expanded === item.id;
            return (
              <article
                className={`notification-item ${read ? "is-read" : "is-unread"}`}
                key={item.id}
              >
                <button
                  className="notification-summary"
                  aria-expanded={open}
                  aria-controls={`notification-${item.id}`}
                  onClick={() => {
                    setExpanded(open ? null : item.id);
                    onRead(item.id);
                  }}
                >
                  <span className={`finance-icon ${item.tone}`}>
                    <item.Icon size={20} />
                  </span>
                  <span className="notification-copy">
                    <span className="notification-meta">
                      {item.category}
                      <small>{item.time}</small>
                    </span>
                    <strong>{item.title}</strong>
                    <span className="notification-read-label">
                      {read ? "Lue" : "Non lue"}
                    </span>
                  </span>
                  {!read && (
                    <span className="notification-dot" aria-hidden="true" />
                  )}
                </button>
                <div
                  id={`notification-${item.id}`}
                  hidden={!open}
                  className="notification-detail"
                >
                  <p>{item.detail}</p>
                  <button
                    onClick={() => {
                      onRead(item.id);
                      onNavigate(item.target);
                    }}
                  >
                    {item.action}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            );
          })}
          {!visible.length && (
            <div className="notifications-empty">
              <Bell size={32} />
              <h3>Vous êtes à jour</h3>
              <p>Toutes vos notifications ont été lues.</p>
              <button
                className="outline-button"
                onClick={() => {
                  setOnlyUnread(false);
                  setExpanded(null);
                }}
              >
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
        <footer>
          <ShieldCheck size={16} /> Vos alertes utiles, réunies ici.
        </footer>
      </section>
    </div>
  );
}
