import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Wallet,
  ArrowRight,
  CirclePlus,
  MessageCircle,
  Search,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRound,
} from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  requests as initialRequests,
  trips as initialTrips,
  euro,
} from "./data/marketplace";
import { arbitrageOpportunities } from "./data/mockData";
import { ArbitrageOpportunity, FreightItem } from "./types";
import { useProductionStore } from "./hooks/useProductionStore";
import { saveRecords, saveRecord } from "./services/productionDb";
import { useStoredState } from "./hooks/useStoredState";
import { WalletView } from "./components/marketplace/WalletView";
import {
  NotificationsDrawer,
  platformNotifications,
  type NotificationTarget,
} from "./components/marketplace/NotificationsDrawer";
import {
  money,
  walletBalances,
  walletTransactions,
  type WalletTransaction,
} from "./data/wallet";
import { Explorer } from "./components/marketplace/Explorer";
import { RequestDetails, TripDetails } from "./components/marketplace/Details";
import { Profile, Intention } from "./components/marketplace/Profile";
import { Publish } from "./components/marketplace/Publish";
import {
  Conversation,
  ConversationData,
  createMessage,
} from "./components/marketplace/Conversation";
import { Dialog } from "./components/marketplace/Dialog";
import { AuthModal } from "./components/Auth/AuthModal";
import {
  createCodes,
  initialConversations,
  simulatedReply,
} from "./data/conversations";
import "./marketplace.css";
import "./finance.css";
const TicketScannerModal = lazy(() =>
  import("./components/Modals/TicketScannerModal").then((m) => ({
    default: m.TicketScannerModal,
  })),
);
const SmartFlightArbitrage = lazy(() =>
  import("./components/SmartFlightArbitrage").then((m) => ({
    default: m.SmartFlightArbitrage,
  })),
);

function Marketplace() {
  const { user, logout } = useAuth();
  const [route, setRoute] = useState(
    () => window.location.hash.slice(1) || "explore",
  );
  const [mode, setMode] = useState<"requests" | "trips">("requests");
  const [requests, setRequests, requestsReady, requestsError, retryRequests] =
    useProductionStore("purchase_requests", "ep-requests-v1", initialRequests);
  const [trips, setTrips, tripsReady, tripsError, retryTrips] =
    useProductionStore("trips", "ep-trips-v1", initialTrips);
  const [autoAccept, setAutoAccept] = useStoredState(
    "ep-auto-accept-v1",
    false,
  );
  const [intentions, setIntentions] = useStoredState<Intention[]>(
    "ep-intentions-v1",
    ["request"],
  );
  const [
    conversations,
    setConversations,
    conversationsReady,
    conversationsError,
    retryConversations,
  ] = useProductionStore(
    "conversations",
    "ep-conversations-v1",
    initialConversations,
  );
  const [ledger, setLedger, walletReady, walletError, retryWallet] =
    useProductionStore("wallet_transactions", "ep-wallet-ledger-v1", []);
  const transfers = ledger.filter(
    (tx) => tx.status === "Virement" && !tx.id.startsWith("EP-"),
  );
  const setTransfers = (
    update: (current: WalletTransaction[]) => WalletTransaction[],
  ) => {
    setLedger((current) => [
      ...current.filter(
        (tx) => tx.status !== "Virement" || tx.id.startsWith("EP-"),
      ),
      ...update(
        current.filter(
          (tx) => tx.status === "Virement" && !tx.id.startsWith("EP-"),
        ),
      ),
    ]);
  };
  const [readNotifications, setReadNotifications] = useStoredState<string[]>(
    "ep-notifications-read-v1",
    [],
  );
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const transactions = [...ledger].sort((a, b) => b.at.localeCompare(a.at));
  const storageReady =
    requestsReady && tripsReady && conversationsReady && walletReady;
  const storageError =
    requestsError || tripsError || conversationsError || walletError;
  useEffect(() => {
    if (!storageReady) return;
    const derived = walletTransactions(conversations, []);
    setLedger((current) => {
      const changed = derived.some(
        (tx) =>
          !current.some(
            (stored) =>
              stored.id === tx.id &&
              stored.status === tx.status &&
              stored.cents === tx.cents &&
              stored.at === tx.at,
          ),
      );
      return changed
        ? [
            ...current.filter((tx) => !derived.some((row) => row.id === tx.id)),
            ...derived,
          ]
        : current;
    });
    void saveRecords(
      "orders",
      conversations
        .filter((c) => c.stage !== "discussion")
        .map((c) => ({
          id: c.id,
          conversationId: c.id,
          status: c.stage,
          updatedAt:
            c.handovers?.[c.handovers.length - 1]?.at ||
            c.securedAt ||
            new Date().toISOString(),
        })),
    ).catch(() => setPersistenceError("La sauvegarde des commandes a échoué."));
  }, [conversations, storageReady, setLedger]);
  useEffect(() => {
    if (!walletReady) return;
    try {
      localStorage.setItem("ep-wallet-transfers-v1", JSON.stringify(transfers));
    } catch {
      /* Compatibility cache only. */
    }
  }, [ledger, walletReady]);
  const [persistenceError, setPersistenceError] = useState("");
  useEffect(() => {
    if (!user) return;
    void saveRecord("users", user)
      .then(() =>
        saveRecord("kyc_records", {
          id: user.id,
          userId: user.id,
          status: user.kycStatus,
          updatedAt: new Date().toISOString(),
        }),
      )
      .catch(() => setPersistenceError("La sauvegarde du profil a échoué."));
  }, [user]);
  const balance = walletBalances(transactions);
  const unreadCount = platformNotifications.filter(
    (item) => !readNotifications.includes(item.id),
  ).length;
  const readNotification = (id: string) =>
    setReadNotifications((current) =>
      current.includes(id) ? current : [...current, id],
    );
  const replyTimers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const [pendingReplies, setPendingReplies] = useState<string[]>([]);
  useEffect(() => {
    const timers = replyTimers.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [setConversations]);
  const sendMessage = (id: string, text: string, qr?: string) => {
    if (!text.trim()) return;
    setConversations((current) =>
      current.map((c) =>
        c.id === id
          ? {
              ...c,
              messages: [...c.messages, createMessage(text.trim(), true, qr)],
            }
          : c,
      ),
    );
    if (qr) return;
    setPendingReplies((current) => [...current, id]);
    const timer = setTimeout(() => {
      setConversations((current) =>
        current.map((c) =>
          c.id === id
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  createMessage(simulatedReply(c, text), false),
                ],
              }
            : c,
        ),
      );
      setPendingReplies((current) => {
        const index = current.indexOf(id);
        return current.filter((_, i) => i !== index);
      });
      replyTimers.current.delete(timer);
    }, 800);
    replyTimers.current.add(timer);
  };
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [publish, setPublish] = useState(false);
  const [scanner, setScanner] = useState(false);
  const [auth, setAuth] = useState<"email" | "apple" | "register" | null>(null);
  const [preview, setPreview] = useState(false);
  const [deal, setDeal] = useState<ArbitrageOpportunity | null>(null);
  const [notice, setNotice] = useState("");
  const selectedRequest = route.startsWith("request/")
    ? requests.find((r) => r.id === route.slice(8))
    : undefined;
  const selectedTrip = route.startsWith("trip/")
    ? trips.find((t) => t.id === route.slice(5))
    : undefined;
  const wallet = route === "wallet";
  const profile = route === "profile";
  const messages = route === "messages";
  const arbitrage = route === "arbitrage" || route.startsWith("arbitrage/");
  const arbitrageRoute = route.split("/")[1];
  const exploring = route === "explore";
  const navigate = (next: string) => {
    window.location.hash = next;
    setRoute(next);
  };
  useEffect(() => {
    const update = () => setRoute(window.location.hash.slice(1) || "explore");
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("main-content")?.scrollTo(0, 0);
  }, [route]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  const updateConversation = (conversation: ConversationData) =>
    setConversations((current) =>
      current.map((c) =>
        c.id === conversation.id
          ? {
              ...conversation,
              messages: [
                ...c.messages,
                ...conversation.messages.filter(
                  (m) => !c.messages.some((existing) => existing.id === m.id),
                ),
              ],
            }
          : c,
      ),
    );
  const openChat = (
    id: string,
    name: string,
    subject: string,
    amount: number,
    offer = false,
  ) => {
    setConversations((current) => {
      const existing = current.find((c) => c.id === id);
      if (existing) {
        if (
          !offer ||
          existing.messages.some(
            (m) => m.mine && m.text.includes("je propose d’acheter et livrer"),
          )
        )
          return current;
        return current.map((c) =>
          c.id === id
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  createMessage(
                    `Bonjour ${name}, je propose d’acheter et livrer votre article : ${subject}. Pouvons-nous confirmer sa disponibilité et les modalités ?`,
                  ),
                ],
              }
            : c,
        );
      }
      const { pickupCode, deliveryCode } = createCodes();
      return [
        ...current,
        {
          id,
          name,
          subject,
          amount,
          stage: "discussion",
          pickupCode,
          deliveryCode,
          messages: offer
            ? [
                createMessage(
                  `Bonjour ${name}, je propose d’acheter et livrer votre article : ${subject}. Pouvons-nous confirmer sa disponibilité et les modalités ?`,
                ),
              ]
            : [
                createMessage(
                  `Bonjour ! Merci de votre intérêt pour « ${subject} ». Quels sont vos besoins et vos disponibilités ?`,
                  false,
                ),
              ],
        },
      ];
    });
    setActiveChat(id);
    navigate("messages");
  };
  const addTrip = (t: FreightItem) => {
    setTrips((current) => [t, ...current]);
    setMode("trips");
    navigate("explore");
    setNotice("Votre trajet a été publié.");
  };
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share)
        await navigator.share({
          title: selectedRequest?.title || selectedTrip?.title,
          url,
        });
      else {
        await navigator.clipboard.writeText(url);
        setNotice("Lien copié dans le presse-papiers.");
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        setNotice(
          "Le partage est indisponible. Vous pouvez copier l’adresse de cette page.",
        );
    }
  };
  const openArbitrage = (routeId?: string) =>
    navigate(routeId ? `arbitrage/${routeId}` : "arbitrage");
  const followNotification = (target: NotificationTarget) => {
    setNotificationsOpen(false);
    if (target === "arbitrage") openArbitrage("mrs-alg");
    else if (target === "profile") navigate("profile");
    else {
      setActiveChat(target === "sarah" ? "nike-air-max" : "karim-mrs");
      navigate("messages");
    }
  };
  const navItems = [
    { id: "explore", label: "Explorer", Icon: Search },
    { id: "publish", label: "Publier", Icon: CirclePlus },
    { id: "messages", label: "Messages", Icon: MessageCircle },
    { id: "profile", label: "Profil", Icon: UserRound },
  ];
  const activate = (id: string) =>
    id === "publish" ? setPublish(true) : navigate(id);
  if (!storageReady)
    return (
      <main className="storage-loading">
        <ShieldCheck size={32} />
        <h1>BagVoyage</h1>
        <p role={storageError ? "alert" : "status"}>
          {storageError || "Ouverture de votre espace…"}
        </p>
        {storageError && (
          <button
            className="primary-button"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        )}
      </main>
    );
  return (
    <div className="marketplace">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Aller au contenu
      </a>
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-wrap">
            {!exploring && (
              <button
                className="icon-button"
                aria-label="Retour à Explorer"
                onClick={() => navigate("explore")}
              >
                <ArrowLeft size={22} />
              </button>
            )}
            <button className="brand" onClick={() => navigate("explore")}>
              {selectedRequest
                ? "Demande d’achat"
                : selectedTrip
                  ? "Offre de transport"
                  : "Entre particuliers"}
              <span className="brand-dot">.</span>
            </button>
          </div>
          <nav className="desktop-nav" aria-label="Navigation principale">
            {navItems.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={route === id ? "active" : ""}
                onClick={() => activate(id)}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className={`wallet-pill ${wallet ? "active" : ""}`}
              aria-label={`Mon portefeuille, solde disponible ${money(balance.available)}`}
              aria-current={wallet ? "page" : undefined}
              onClick={() => navigate("wallet")}
            >
              <Wallet size={18} />
              <span>{money(balance.available)}</span>
            </button>
            <button
              className="icon-button notification-bell"
              aria-label={`Notifications, ${unreadCount} non lues`}
              aria-expanded={notificationsOpen}
              aria-haspopup="dialog"
              aria-controls={
                notificationsOpen ? "notifications-drawer" : undefined
              }
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notification-count" aria-hidden="true">
                  {unreadCount}
                </span>
              )}
            </button>
            {selectedRequest || selectedTrip ? (
              <button
                className="icon-button"
                aria-label="Partager l’annonce"
                onClick={() => void share()}
              >
                <Share2 size={20} />
              </button>
            ) : (
              <>
                <button
                  className="preview-toggle icon-button"
                  aria-label="Aperçu mobile"
                  onClick={() => setPreview(true)}
                >
                  <Smartphone size={19} />
                </button>
                <button
                  className="login-button"
                  onClick={() =>
                    user ? navigate("profile") : setAuth("email")
                  }
                >
                  {user ? (
                    <>
                      <span className="mini-avatar">{user.name[0]}</span>
                      <span>Mon profil</span>
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className={`main-container ${messages ? "messages-container" : ""}`}
      >
        {exploring && (
          <Explorer
            mode={mode}
            onMode={setMode}
            requests={requests}
            trips={trips}
            onRequest={(r) => navigate(`request/${r.id}`)}
            onTrip={(t) => navigate(`trip/${t.id}`)}
            onArbitrage={openArbitrage}
            onScan={() => setScanner(true)}
          />
        )}
        {selectedRequest && (
          <RequestDetails
            request={selectedRequest}
            onChat={(offer) =>
              openChat(
                selectedRequest.id,
                selectedRequest.buyer,
                selectedRequest.title,
                selectedRequest.budget + selectedRequest.reward,
                offer,
              )
            }
          />
        )}
        {selectedTrip && (
          <TripDetails
            trip={selectedTrip}
            onChat={() =>
              openChat(
                selectedTrip.id,
                selectedTrip.travelerName,
                selectedTrip.title,
                selectedTrip.startingPrice ||
                  selectedTrip.pricePerKg * selectedTrip.availableKg,
              )
            }
            onScan={() => setScanner(true)}
          />
        )}
        {wallet && (
          <WalletView
            transactions={transactions}
            onTransfer={(transaction) =>
              setTransfers((current) =>
                current.some((t) => t.id === transaction.id)
                  ? current
                  : [transaction, ...current],
              )
            }
          />
        )}
        {profile && (
          <Profile
            autoAccept={autoAccept}
            onAutoAcceptChange={setAutoAccept}
            onWallet={() => navigate("wallet")}
            walletBalance={money(balance.available)}
            selected={intentions}
            onSelect={setIntentions}
            onContinue={() => {
              setMode(
                intentions.includes("request") || intentions.includes("shop")
                  ? "requests"
                  : "trips",
              );
              navigate("explore");
              setNotice("Vos préférences ont été enregistrées.");
            }}
            onLogin={() => setAuth("email")}
            onApple={() => setAuth("apple")}
            onRegister={() => setAuth("register")}
            userName={user?.name}
            kycStatus={user?.kycStatus}
            onLogout={logout}
          />
        )}
        {messages && (
          <Conversation
            conversations={conversations}
            activeId={activeChat}
            onSelect={setActiveChat}
            onUpdate={updateConversation}
            onSend={sendMessage}
            pendingReplies={pendingReplies}
            onNotice={setNotice}
          />
        )}
        {arbitrage && (
          <div className="arbitrage-page">
            <div className="page-intro">
              <span className="eyebrow">
                <Sparkles size={15} /> ARBITRAGE IA
              </span>
              <h1>
                Voyager gratuit ou
                <br />
                gagner de l’argent.
              </h1>
              <p>Vos commissions peuvent financer votre prochain départ.</p>
            </div>
            <Suspense fallback={<p role="status">Chargement du calculateur…</p>}>
              <SmartFlightArbitrage
                key={arbitrageRoute || "default"}
                initialRouteId={arbitrageRoute}
                opportunities={arbitrageOpportunities}
                onSelectDeal={setDeal}
              />
            </Suspense>
          </div>
        )}
        {!exploring &&
          !selectedRequest &&
          !selectedTrip &&
          !wallet &&
          !profile &&
          !messages &&
          !arbitrage && (
            <div className="empty-state">
              <h1>Cette annonce n’est pas disponible</h1>
              <p>
                Les annonces publiées restent sur l’appareil qui les a créées.
              </p>
              <button
                className="primary-button"
                onClick={() => navigate("explore")}
              >
                Explorer les annonces
              </button>
            </div>
          )}
      </main>
      {exploring && (
        <div className="publish-dock">
          <div>
            <span>
              <ShieldCheck size={18} />
              Un besoin, un trajet, une rencontre.
            </span>
            <button className="primary-button" onClick={() => setPublish(true)}>
              <CirclePlus size={19} />
              {mode === "requests"
                ? "Publier une demande"
                : "Proposer mon trajet"}
            </button>
          </div>
        </div>
      )}
      <nav className="mobile-nav" aria-label="Navigation mobile">
        {navItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            aria-current={route === id ? "page" : undefined}
            className={route === id ? "active" : ""}
            onClick={() => activate(id)}
          >
            <Icon size={23} strokeWidth={route === id ? 2.3 : 1.7} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {notificationsOpen && (
        <NotificationsDrawer
          readIds={readNotifications}
          onRead={readNotification}
          onReadAll={() =>
            setReadNotifications(platformNotifications.map((item) => item.id))
          }
          onNavigate={followNotification}
          onClose={() => setNotificationsOpen(false)}
        />
      )}
      {(notice || storageError || persistenceError) && (
        <div
          className="toast"
          role={storageError || persistenceError ? "alert" : "status"}
        >
          {storageError || persistenceError || notice}
          {storageError && (
            <button
              className="outline-button"
              onClick={() => {
                retryRequests();
                retryTrips();
                retryConversations();
                retryWallet();
              }}
            >
              Réessayer la sauvegarde
            </button>
          )}
        </div>
      )}
      {publish && (
        <Publish
          defaultAutoAccept={autoAccept}
          mode={mode}
          name={user?.name || "Camille"}
          onClose={() => setPublish(false)}
          onRequest={(r) => {
            setRequests((current) => [r, ...current]);
            setMode("requests");
            navigate("explore");
            setNotice("Votre demande a été publiée.");
          }}
          onTrip={addTrip}
          onScan={() => {
            setPublish(false);
            setScanner(true);
          }}
        />
      )}
      {scanner && (
        <Suspense
          fallback={
            <div className="toast" role="status">
              Chargement du scanner…
            </div>
          }
        >
          <TicketScannerModal
            isOpen
            onClose={() => setScanner(false)}
            onTripCreated={addTrip}
          />
        </Suspense>
      )}
      {auth && (
        <AuthModal
          initialTab={auth === "register" ? "register" : "login"}
          apple={auth === "apple"}
          onClose={() => setAuth(null)}
          onSuccess={(message) => {
            setAuth(null);
            setNotice(message);
          }}
        />
      )}
      {deal && (
        <Dialog
          title="Votre voyage, vos possibilités"
          onClose={() => setDeal(null)}
        >
          <span className="purchase-badge">Estimation des gains</span>
          <h3 className="deal-title">
            {deal.flight.origin} → {deal.flight.destination}
          </h3>
          <dl className="deal-summary">
            <div>
              <dt>Billet estimé</dt>
              <dd>{euro(deal.flight.flightPrice)}</dd>
            </div>
            <div>
              <dt>Commissions des missions</dt>
              <dd>{euro(deal.totalOrderReward)}</dd>
            </div>
            <div>
              <dt>
                {deal.netProfit >= 0
                  ? "Gain après le billet"
                  : "Reste à financer"}
              </dt>
              <dd>{euro(Math.abs(deal.netProfit))}</dd>
            </div>
          </dl>
          <p className="muted">{deal.ordersDescription}</p>
          <p className="info-box">
            <InfoIcon />
            Estimation hors achats, bagages et frais éventuels. Confirmez les
            missions avant toute réservation.
          </p>
          <button
            className="primary-button"
            onClick={() => {
              openChat(
                deal.id,
                deal.clientName,
                deal.ordersDescription,
                deal.totalOrderReward,
                true,
              );
              setDeal(null);
            }}
          >
            Discuter des missions
            <ArrowRight size={18} />
          </button>
        </Dialog>
      )}
      {preview && (
        <Dialog
          title="Aperçu mobile · 390 px"
          onClose={() => setPreview(false)}
        >
          <iframe
            title="Application en format mobile"
            className="phone-preview"
            src={`${window.location.pathname}?preview=mobile#${route}`}
          />
        </Dialog>
      )}
    </div>
  );
}
function InfoIcon() {
  return <ShieldCheck size={18} />;
}
export default function App() {
  return (
    <AuthProvider>
      <Marketplace />
    </AuthProvider>
  );
}
