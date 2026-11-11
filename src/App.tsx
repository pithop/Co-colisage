import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CirclePlus,
  MessageCircle,
  Plane,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import type { RadarMovement } from "./services/flightFerryRadarApi";
import {
  requests as initialRequests,
  trips as initialTrips,
  euro,
} from "./data/marketplace";
import { FreightItem } from "./types";
import { useProductionStore } from "./hooks/useProductionStore";
import { saveRecords, saveRecord, getRecord } from "./services/productionDb";
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
import { ShopAndGoPlatform } from "./components/ShopAndGo/ShopAndGoPlatform";
import { BagAndGoPlatform } from "./components/BagAndGo/BagAndGoPlatform";
import { VoyageurPlatform } from "./components/Voyageur/VoyageurPlatform";
import { RequestDetails, TripDetails } from "./components/marketplace/Details";
import { Profile, Intention } from "./components/marketplace/Profile";
import { Publish } from "./components/marketplace/Publish";
import {
  Conversation,
  ConversationData,
  createMessage,
} from "./components/marketplace/Conversation";
import {
  CurrencyConverterModal,
} from "./components/CurrencyConverter/CurrencyConverterModal";
import { Dialog } from "./components/marketplace/Dialog";
import { AuthModal } from "./components/Auth/AuthModal";
import { KycDocumentsModal } from "./components/Auth/KycDocumentsModal";
import { HowItWorksModal } from "./components/Modals/HowItWorksModal";
import {
  createCodes,
  initialConversations,
  simulatedReply,
} from "./data/conversations";
import "./marketplace.css";
import "./finance.css";
import "./expansion.css";
import "./world.css";
import { MarketplaceHeader } from "./components/MarketplaceHeader";
import { type MatchedOpportunity } from "./services/flightArbitrageApi";
import { prepareArbitrageDeal } from "./services/arbitrageBooking";
import { localActorId } from "./services/uploads";
import { localAdminEnabled } from "./services/adminOperations";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LiveRadarModal } from "./components/logistics/LiveRadarModal";
import { TrustVerificationModal } from "./components/Trust/TrustVerificationModal";
import { BottomNavBar } from "./components/Navigation/BottomNavBar";
import { BoardingPassScannerModal } from "./components/logistics/BoardingPassScannerModal";
import { DigitalCargoPassModal } from "./components/logistics/DigitalCargoPassModal";
import { OfflineHandoverModal } from "./components/logistics/OfflineHandoverModal";
import { VoyageurDashboard } from "./components/Dashboards/VoyageurDashboard";
import { ExpediteurDashboard } from "./components/Dashboards/ExpediteurDashboard";
import { CarrierDashboard } from "./components/Dashboards/CarrierDashboard";
import { DepartureInspectionModal } from "./components/Modals/DepartureInspectionModal";
import { ProofUploadModal } from "./components/Modals/ProofUploadModal";
import { GpsTrackingModal } from "./components/Modals/GpsTrackingModal";
import { PinDeliveryModal } from "./components/Modals/PinDeliveryModal";
import { products } from "./data/mockData";
const AwwwardsLanding = lazy(() =>
  import("./components/LandingPage/AwwwardsLanding").then((module) => ({
    default: module.AwwwardsLanding,
  })),
);
const HowItWorksPage = lazy(() =>
  import("./components/Pages/HowItWorksPage").then((m) => ({
    default: m.HowItWorksPage,
  })),
);
const PricingPage = lazy(() =>
  import("./components/Pages/PricingPage").then((m) => ({
    default: m.PricingPage,
  })),
);
const TrustPage = lazy(() =>
  import("./components/Pages/TrustPage").then((m) => ({
    default: m.TrustPage,
  })),
);
const FaqPage = lazy(() =>
  import("./components/Pages/FaqPage").then((m) => ({
    default: m.FaqPage,
  })),
);
const AdminDashboard = lazy(() =>
  import("./components/Admin/AdminDashboard").then((module) => ({
    default: module.AdminDashboard,
  })),
);
const ProOnboardingModal = lazy(() =>
  import("./components/Modals/ProOnboardingModal").then((module) => ({
    default: module.ProOnboardingModal,
  })),
);
const TicketScannerModal = lazy(() =>
  import("./components/Modals/TicketScannerModal").then((m) => ({
    default: m.TicketScannerModal,
  })),
);
const InteractiveRadarPage = lazy(() =>
  import("./components/Radar/InteractiveRadarPage").then((m) => ({
    default: m.InteractiveRadarPage,
  })),
);
const LoginPage = lazy(() =>
  import("./components/Auth/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("./components/Auth/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  })),
);
const TrackingPage = lazy(() =>
  import("./components/marketplace/TrackingPage").then((m) => ({
    default: m.TrackingPage,
  })),
);
const SmartFlightArbitrage = lazy(() =>
  import("./components/SmartFlightArbitrage").then((m) => ({
    default: m.SmartFlightArbitrage,
  })),
);

function routeFromLocation() {
  const hash = window.location.hash.slice(1);
  if (hash) {
    if (hash === "app") return "explore";
    if (hash === "voyageur") return "voyageur";
    if (hash === "shopandgo" || hash === "shop-and-go") return "shopandgo";
    if (hash === "bagandgo" || hash === "bag-and-go") return "bagandgo";
    if (hash === "how-it-works" || hash === "comment-ca-marche") return "how-it-works";
    if (hash === "pricing" || hash === "tarifs") return "pricing";
    if (hash === "trust" || hash === "securite") return "trust";
    if (hash === "faq") return "faq";
    return hash;
  }
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  if (pathname === "/app") return "explore";
  if (pathname === "/voyageur") return "voyageur";
  if (pathname === "/shopandgo" || pathname === "/shop-and-go") return "shopandgo";
  if (pathname === "/bagandgo" || pathname === "/bag-and-go") return "bagandgo";
  if (pathname === "/download") return "download";
  if (pathname.includes("/comment-ca-marche") || pathname.includes("/how-it-works")) return "how-it-works";
  if (pathname.includes("/tarifs") || pathname.includes("/pricing")) return "pricing";
  if (pathname.includes("/securite") || pathname.includes("/trust")) return "trust";
  if (pathname.includes("/faq")) return "faq";
  if (pathname === "/" || /\/landing$/.test(pathname)) return "landing";
  return "explore";
}

function Marketplace() {
  const { user, logout, activePlatform, setActivePlatform, isKycVerified } = useAuth();
  const [anonymousId] = useState(localActorId);
  const actorId = user?.id || anonymousId;
  const [proOnboarding, setProOnboarding] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [iataScannerOpen, setIataScannerOpen] = useState(false);
  const [cargoPassOpen, setCargoPassOpen] = useState(false);
  const [offlineHandoverOpen, setOfflineHandoverOpen] = useState(false);
  const [voyageurDashboardOpen, setVoyageurDashboardOpen] = useState(false);
  const [expediteurDashboardOpen, setExpediteurDashboardOpen] = useState(false);
  const [carrierDashboardOpen, setCarrierDashboardOpen] = useState(false);
  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [proofUploadOpen, setProofUploadOpen] = useState(false);
  const [gpsTrackingOpen, setGpsTrackingOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenHowItWorks = () => setHowItWorksModalOpen(true);
    window.addEventListener("bv:open-how-it-works", handleOpenHowItWorks);
    return () => window.removeEventListener("bv:open-how-it-works", handleOpenHowItWorks);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const [publishKind, setPublishKind] = useState<
    "requests" | "trips" | "parcel" | undefined
  >();
  const [route, setRoute] = useState(routeFromLocation);
  const previousRoute = useRef(route);
  const [mode, setMode] = useState<"requests" | "trips">("requests");
  const [requests, setRequests, requestsReady, requestsError, retryRequests] =
    useProductionStore("purchase_requests", "bv-requests-v2", initialRequests);
  const [trips, setTrips, tripsReady, tripsError, retryTrips] =
    useProductionStore("trips", "bv-trips-v2", initialTrips);
  const arbitrageRequests = useMemo(
    () => requests.filter(request => request.ownerId !== actorId),
    [requests, actorId],
  );
  const [autoAccept, setAutoAccept] = useStoredState(
    "bv-auto-accept-v2",
    false,
  );
  const [intentions, setIntentions] = useStoredState<Intention[]>(
    "bv-intentions-v2",
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
    "bv-conversations-v2",
    initialConversations,
  );
  const [ledger, setLedger, walletReady, walletError, retryWallet] =
    useProductionStore("wallet_transactions", "bv-wallet-ledger-v2", []);

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
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [radarOpen, setRadarOpen] = useState(false);
  const [trustOpen, setTrustOpen] = useState(false);
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
    void (async () => {
      if (!(await getRecord("users", user.id))) await saveRecord("users", user);
      if (!(await getRecord("kyc_records", user.id)))
        await saveRecord("kyc_records", {
          id: user.id,
          userId: user.id,
          status: user.kycStatus,
          updatedAt: new Date().toISOString(),
        });
    })().catch(() => setPersistenceError("La sauvegarde du profil a échoué."));
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
    if (qr || id.startsWith("support-")) return;
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
  const [radarBooking, setRadarBooking] = useState<RadarMovement>();
  const [scanner, setScanner] = useState(false);
  const [auth, setAuth] = useState<"email" | "apple" | "register" | null>(null);
  const [preview, setPreview] = useState(false);
  const [deal, setDeal] = useState<MatchedOpportunity | null>(null);
  const [dealError, setDealError] = useState("");
  const [dealPending, setDealPending] = useState(false);
  const [notice, setNotice] = useState("");
  const selectedRequest = route.startsWith("request/")
    ? requests.find((r) => r.id === route.slice(8))
    : undefined;
  const selectedTrip = route.startsWith("trip/")
    ? trips.find((t) => t.id === route.slice(5))
    : undefined;
  const radar = route === "radar" || route.startsWith("radar/");
  const loginPage = route === "login";
  const registerPage = route === "register";
  const tracking = route === "tracking";
  const expansionPage = radar || loginPage || registerPage || tracking;
  const landingSection = ["features", "simulator", "mobile"].includes(route)
    ? route
    : undefined;
  const landing = route === "landing" || route === "download" || !!landingSection;
  const howItWorks = route === "how-it-works";
  const pricing = route === "pricing";
  const trust = route === "trust";
  const faq = route === "faq";
  const isSeoPage = howItWorks || pricing || trust || faq;
  const admin = route === "admin";
  const wallet = route === "wallet";
  const profile = route === "profile";
  const messages = route === "messages";
  const arbitrage = route === "arbitrage" || route.startsWith("arbitrage/");
  const arbitrageRoute = route.split("/")[1];
  const exploring =
    route === "explore" ||
    route === "voyageur" ||
    route === "shopandgo" ||
    route === "bagandgo" ||
    route.startsWith("publish/");
  const navigate = (next: string) => {
    window.location.hash = next;
    setRoute(next);
  };
  useEffect(() => {
    if (route === "voyageur" && activePlatform !== "voyageur") {
      setActivePlatform("voyageur");
    } else if (route === "shopandgo" && activePlatform !== "shopandgo") {
      setActivePlatform("shopandgo");
    } else if (route === "bagandgo" && activePlatform !== "bagandgo") {
      setActivePlatform("bagandgo");
    }
  }, [route, activePlatform, setActivePlatform]);
  useEffect(() => {
    const update = () => setRoute(routeFromLocation());
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, []);
  useEffect(() => {
    if (route.startsWith("publish/")) {
      const kind = route.split("/")[1];
      if (kind === "parcel") {
        setActivePlatform("bagandgo");
        setPublishKind("parcel");
        setPublish(true);
      } else if (kind === "requests") {
        setActivePlatform("shopandgo");
        setPublishKind("requests");
        setPublish(true);
      } else if (kind === "trips") {
        setActivePlatform("voyageur");
        setPublishKind("trips");
        setPublish(true);
      }
    }
  }, [route, setActivePlatform]);
  useEffect(() => {
    const previous = previousRoute.current;
    previousRoute.current = route;
    if (
      landingSection ||
      route === "download" ||
      (previous === "download" && landing)
    ) return;
    window.scrollTo(0, 0);
    document.getElementById("main-content")?.scrollTo(0, 0);
  }, [route, landing, landingSection]);
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
              participantIds:
                conversation.participantIds ??
                c.participantIds ??
                (user &&
                c.stage === "discussion" &&
                conversation.stage === "secured"
                  ? [user.id]
                  : undefined),
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
    serviceAmount?: number,
    parcel = false,
    ownerId?: string,
  ) => {
    const offerText = parcel
      ? `Bonjour ${name}, je propose de transporter votre colis : ${subject}. Confirmons son contenu et les points de remise.`
      : `Bonjour ${name}, je propose d’acheter et livrer votre article : ${subject}. Pouvons-nous confirmer sa disponibilité et les modalités ?`;
    setConversations((current) => {
      const existing = current.find((c) => c.id === id);
      if (existing) {
        if (
          !offer ||
          existing.messages.some(
            (m) =>
              m.mine &&
              (m.text.includes("je propose d’acheter et livrer") ||
                m.text.includes("je propose de transporter")),
          )
        )
          return current;
        return current.map((c) =>
          c.id === id
            ? {
                ...c,
                messages: [...c.messages, createMessage(offerText)],
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
          serviceAmount,
          participantIds: [
            ...new Set([actorId, ...(ownerId ? [ownerId] : [])]),
          ],
          stage: "discussion",
          pickupCode,
          deliveryCode,
          messages: offer
            ? [createMessage(offerText)]
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
  const reserveArbitrage = async (selected: MatchedOpportunity) => {
    const prepared = await prepareArbitrageDeal(selected, actorId);
    setConversations(current => [
      ...current.filter(conversation => !prepared.some(item => item.id === conversation.id)),
      ...prepared,
    ]);
    setActiveChat(prepared[0].id);
    setDeal(null);
    navigate("messages");
    setNotice(`${prepared.length} discussion${prepared.length > 1 ? "s" : ""} préparée${prepared.length > 1 ? "s" : ""}. Confirmez chaque mission avant de réserver le billet.`);
  };
  const followNotification = (target: NotificationTarget) => {
    setNotificationsOpen(false);
    if (target === "arbitrage") openArbitrage("mrs-alg");
    else if (target === "profile") navigate("profile");
    else {
      setActiveChat(target === "sarah" ? "nike-air-max" : "karim-mrs");
      navigate("messages");
    }
  };
  if (!storageReady && !landing && !isSeoPage)
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
    <div className={`marketplace${landing || isSeoPage ? " public-landing" : ""}`}>
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
      {!landing && !isSeoPage && (
        <MarketplaceHeader
          route={route} balance={money(balance.available)} unreadCount={unreadCount}
          notificationsOpen={notificationsOpen} userName={user?.name}
          showAdmin={localAdminEnabled} canShare={!!(selectedRequest || selectedTrip)}
          isOnline={isOnline}
          navigate={navigate}
          onPublish={() => { setPublishKind(undefined); setPublish(true); }}
          onCurrency={() => setCurrencyOpen(true)} onRadar={() => setRadarOpen(true)}
          onNotifications={() => setNotificationsOpen(true)}
          onLogin={() => user ? navigate("profile") : setAuth("email")}
          onPreview={() => setPreview(true)} onShare={() => void share()}
          onScanBoardingPass={() => setIataScannerOpen(true)}
          onCargoPass={() => setCargoPassOpen(true)}
          onOfflineHandover={() => setOfflineHandoverOpen(true)}
        />
      )}
      <main
        id="main-content"
        tabIndex={-1}
        className={`main-container ${messages ? "messages-container" : ""} ${landing || isSeoPage || admin || loginPage || registerPage ? "destination-container" : ""}`}
      >
        {expansionPage && (
          <Suspense fallback={<p role="status">Chargement de votre espace…</p>}>
            {radar && (
              <InteractiveRadarPage
                initialReference={route.split("/")[1]}
                onShip={(movement) => {
                  setRadarBooking(movement);
                  setPublishKind("parcel");
                  setPublish(true);
                }}
              />
            )}
            {loginPage && <LoginPage />}
            {registerPage && <RegisterPage />}
            {tracking && (
              <TrackingPage
                conversations={conversations}
                requests={requests}
                trips={trips}
                loading={!storageReady}
              />
            )}
          </Suspense>
        )}
        {landing && (
          <Suspense fallback={<p role="status">Chargement de BagVoyage…</p>}>
            <AwwwardsLanding
              mobileLaunchOpen={route === "download"}
              section={landingSection}
              showAdmin={localAdminEnabled}
              initialLanguage={
                window.location.pathname.startsWith("/en/") ? "en" : "fr"
              }
            />
          </Suspense>
        )}
        {howItWorks && (
          <Suspense fallback={<p role="status">Chargement...</p>}>
            <HowItWorksPage
              language={window.location.pathname.startsWith("/en/") ? "en" : "fr"}
              navigate={navigate}
            />
          </Suspense>
        )}
        {pricing && (
          <Suspense fallback={<p role="status">Chargement...</p>}>
            <PricingPage
              language={window.location.pathname.startsWith("/en/") ? "en" : "fr"}
              navigate={navigate}
            />
          </Suspense>
        )}
        {trust && (
          <Suspense fallback={<p role="status">Chargement...</p>}>
            <TrustPage
              language={window.location.pathname.startsWith("/en/") ? "en" : "fr"}
              navigate={navigate}
            />
          </Suspense>
        )}
        {faq && (
          <Suspense fallback={<p role="status">Chargement...</p>}>
            <FaqPage
              language={window.location.pathname.startsWith("/en/") ? "en" : "fr"}
              navigate={navigate}
            />
          </Suspense>
        )}
        {admin && (
          <Suspense
            fallback={<p role="status">Chargement du centre de contrôle…</p>}
          >
            <AdminDashboard />
          </Suspense>
        )}
        {exploring && (
          activePlatform === "voyageur" ? (
            <VoyageurPlatform
              trips={trips}
              requests={requests}
              onRequest={(r) => navigate(`request/${r.id}`)}
              onSelectTrip={(t) => navigate(`trip/${t.id}`)}
              onContactTraveler={(t) => navigate(`trip/${t.id}`)}
              onPublishTrip={() => {
                setPublishKind("trips");
                setPublish(true);
              }}
              onScanBoardingPass={() => setScanner(true)}
            />
          ) : activePlatform === "shopandgo" ? (
            <ShopAndGoPlatform
              requests={requests}
              trips={trips}
              onRequest={(r) => navigate(`request/${r.id}`)}
              onTrip={(t) => navigate(`trip/${t.id}`)}
              onPublishTrip={() => {
                setPublishKind("trips");
                setPublish(true);
              }}
              onScanBoardingPass={() => setIataScannerOpen(true)}
              onArbitrage={openArbitrage}
              onAddRequest={(r) => {
                setRequests((curr) => [r, ...curr]);
                setNotice("Votre commande d'achat a été publiée.");
              }}
            />
          ) : (
            <BagAndGoPlatform
              trips={trips}
              requests={requests}
              onTrip={(t) => navigate(`trip/${t.id}`)}
              onRequest={(r) => navigate(`request/${r.id}`)}
              onPublishParcel={() => {
                setPublishKind("parcel");
                setPublish(true);
              }}
              onPublishRequest={() => {
                setPublishKind("requests");
                setPublish(true);
              }}
              onTracking={() => navigate("tracking")}
              onAddRequest={(r) => {
                setRequests((curr) => [r, ...curr]);
                setNotice("Votre demande de colis a été publiée.");
              }}
            />
          )
        )}
        {selectedRequest && (
          <RequestDetails
            request={selectedRequest}
            onChat={(offer) =>
              openChat(
                selectedRequest.id,
                selectedRequest.buyer,
                selectedRequest.title,
                selectedRequest.budget +
                  (selectedRequest.serviceGross ?? selectedRequest.reward),
                offer,
                selectedRequest.serviceGross ?? selectedRequest.reward,
                selectedRequest.kind === "parcel",
                selectedRequest.ownerId,
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
            actorId={actorId}
            userEmail={user?.email}
            onPublishRole={(kind) => {
              setPublishKind(kind);
              setPublish(true);
            }}
            onPro={() => (user ? setProOnboarding(true) : setAuth("register"))}
            onMessages={() => navigate("messages")}
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
            onTrust={() => setTrustOpen(true)}
            onOpenVoyageurDashboard={() => (user ? setVoyageurDashboardOpen(true) : setAuth("email"))}
            onOpenExpediteurDashboard={() => (user ? setExpediteurDashboardOpen(true) : setAuth("email"))}
            onOpenCarrierDashboard={() => (user ? setCarrierDashboardOpen(true) : setAuth("register"))}
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
                <Plane size={15} /> ARBITRAGE DE VOLS
              </span>
              <h1>
                Voyager gratuit ou
                <br />
                gagner de l’argent.
              </h1>
              <p>Vos commissions peuvent financer votre prochain départ.</p>
            </div>
            <Suspense
              fallback={<p role="status">Chargement du calculateur…</p>}
            >
              <SmartFlightArbitrage
                key={arbitrageRoute || "default"}
                initialRouteId={arbitrageRoute}
                requests={arbitrageRequests}
                reservedRequestIds={conversations.filter(c => c.stage !== "discussion").map(c => c.id)}
                onReserveDeal={reserveArbitrage}
                onSelectDeal={selected => { setDeal(selected); setDealError(""); }}
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
          !arbitrage &&
          !landing &&
          !isSeoPage &&
          !admin &&
          !expansionPage && (
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
      {exploring && activePlatform !== "shopandgo" && activePlatform !== "bagandgo" && activePlatform !== "voyageur" && (
        <div className="publish-dock">
          <div>
            <span>
              <ShieldCheck size={18} />
              Un besoin, un trajet, une rencontre.
            </span>
            <button
              className="primary-button"
              aria-label={mode === "requests" ? "Publier une demande" : "Proposer mon trajet"}
              onClick={() => {
                setPublishKind(undefined);
                setPublish(true);
              }}
            >
              <CirclePlus size={19} />
              <span className="publish-label-desktop">
                {mode === "requests" ? "Publier une demande" : "Proposer mon trajet"}
              </span>
              <span className="publish-label-mobile" aria-hidden="true">
                {mode === "requests" ? "Publier" : "Proposer"}
              </span>
            </button>
          </div>
        </div>
      )}
      {currencyOpen && (
        <CurrencyConverterModal onClose={() => setCurrencyOpen(false)} />
      )}
      {radarOpen && <LiveRadarModal onClose={() => setRadarOpen(false)} />}
      {trustOpen && (
        <TrustVerificationModal onClose={() => setTrustOpen(false)} />
      )}
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
      {proOnboarding && user && (
        <Suspense
          fallback={
            <p className="toast" role="status">
              Ouverture du dossier…
            </p>
          }
        >
          <ProOnboardingModal
            user={user}
            onClose={() => setProOnboarding(false)}
            onSubmitted={() => {
              setProOnboarding(false);
              setNotice(
                "Dossier professionnel enregistré, en attente d’examen.",
              );
            }}
          />
        </Suspense>
      )}
      {publish && (
        <Publish
          ownerId={actorId}
          initialRoute={radarBooking}
          initialKind={publishKind}
          defaultAutoAccept={autoAccept}
          mode={mode}
          name={user?.name || "Voyageur"}
          onClose={() => {
            setPublish(false);
            setRadarBooking(undefined);
          }}
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
      <KycDocumentsModal />
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
            {deal.additionalCosts > 0 && <div>
              <dt>Bagage et frais connus</dt>
              <dd>{euro(deal.additionalCosts)}</dd>
            </div>}
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
            Estimation avec les frais connus, hors budget d’achat et frais
            non communiqués. Confirmez les missions avant toute réservation.
          </p>
          {dealError && <p role="alert" className="form-error">{dealError}</p>}
          <button
            className="primary-button"
            disabled={dealPending}
            onClick={() => {
              setDealPending(true);
              void reserveArbitrage(deal)
                .catch(error => setDealError(error instanceof Error ? error.message : "La préparation des discussions a échoué."))
                .finally(() => setDealPending(false));
            }}
          >
            {dealPending ? "Préparation des discussions…" : "Discuter des missions"}
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
      {!landing && !isSeoPage && (
        <BottomNavBar
          route={route}
          unreadMessagesCount={unreadCount}
          navigate={navigate}
          onNotifications={() => setNotificationsOpen(true)}
        />
      )}
      <BoardingPassScannerModal
        isOpen={iataScannerOpen}
        onClose={() => setIataScannerOpen(false)}
        onFlightImported={(flight) => {
          const originCity = flight.fromAirport || "Paris";
          const destinationCity = flight.toAirport || "Alger";
          const newTrip: FreightItem = {
            id: crypto.randomUUID(),
            title: `${originCity} → ${destinationCity}`,
            travelerName: user?.name || flight.passengerName || "Voyageur Certifié",
            travelerAvatar: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
            rating: 5.0,
            reviewsCount: 1,
            origin: originCity,
            destination: destinationCity,
            originCode: flight.fromAirport || "CDG",
            destinationCode: flight.toAirport || "ALG",
            departureDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
            departureTime: "10:30",
            transportType: "avion",
            transportLabel: `${flight.carrier || "Vol IATA"} ${flight.flightNumber || ""}`.trim(),
            availableKg: 10,
            pricePerKg: 9,
            image: "",
            description: `Billet IATA certifié (PNR: ${flight.pnr || "VERIFIE"}). Siège ${flight.seat || "Réservé"}, classe ${flight.cabinClass || "Y"}.`,
            canCarryParcel: true,
            canBuyProduct: true,
            isTicketVerified: true,
            isIdentityVerified: isKycVerified,
            ticketScan: {
              airline: flight.carrier || "Compagnie Aérienne",
              flightNumber: flight.flightNumber || "IATA",
              pnr: flight.pnr || "CONFIRMED",
              passengerName: flight.passengerName || user?.name || "Passager",
              origin: originCity,
              originCode: flight.fromAirport || "CDG",
              destination: destinationCity,
              destinationCode: flight.toAirport || "ALG",
              departureDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
              departureTime: "10:30",
              baggageAllowanceKg: 23,
              baggageType: "cabin",
              maxAllowedOfferKg: 10,
              ticketVerified: true,
            },
          };
          addTrip(newTrip);
          setIataScannerOpen(false);
          setNotice(`Billet IATA ${flight.flightNumber || ""} validé ! Trajet créé avec 10 kg disponibles.`);
        }}
      />
      <DigitalCargoPassModal
        isOpen={cargoPassOpen}
        onClose={() => setCargoPassOpen(false)}
      />
      <OfflineHandoverModal
        isOpen={offlineHandoverOpen}
        onClose={() => setOfflineHandoverOpen(false)}
      />
      {voyageurDashboardOpen && (
        <VoyageurDashboard
          isOpen={voyageurDashboardOpen}
          onClose={() => setVoyageurDashboardOpen(false)}
          onOpenUploadProof={() => setProofUploadOpen(true)}
          onOpenPinModal={() => setPinModalOpen(true)}
          onOpenInspection={() => setInspectionOpen(true)}
          onOpenPublish={() => {
            setPublishKind("trips");
            setPublish(true);
          }}
          tickets={trips}
        />
      )}
      {expediteurDashboardOpen && (
        <ExpediteurDashboard
          isOpen={expediteurDashboardOpen}
          onClose={() => setExpediteurDashboardOpen(false)}
          onOpenGps={() => setGpsTrackingOpen(true)}
          onOpenMessaging={() => navigate("messages")}
          activeOrder={(() => {
            const active = conversations.find(
              (c) => c.stage === "secured" || c.stage === "collected",
            );
            if (!active) return null;
            return {
              id: active.id,
              subject: active.subject,
              carrierName: active.name,
              origin: "France",
              destination: "Algérie",
              amount: active.amount,
              pin: active.deliveryCode || "4821",
            };
          })()}
        />
      )}
      {carrierDashboardOpen && (
        <CarrierDashboard
          isOpen={carrierDashboardOpen}
          onClose={() => setCarrierDashboardOpen(false)}
          onOpenPublish={() => {
            setPublishKind("trips");
            setPublish(true);
          }}
        />
      )}
      {inspectionOpen && (
        <DepartureInspectionModal
          isOpen={inspectionOpen}
          onClose={() => setInspectionOpen(false)}
        />
      )}
      {proofUploadOpen && (
        <ProofUploadModal
          product={products[0] || null}
          onClose={() => setProofUploadOpen(false)}
          onProceedToDelivery={() => {
            setProofUploadOpen(false);
            navigate("messages");
          }}
        />
      )}
      {gpsTrackingOpen && (
        <GpsTrackingModal
          isOpen={gpsTrackingOpen}
          onClose={() => setGpsTrackingOpen(false)}
        />
      )}
      {pinModalOpen && (
        <PinDeliveryModal
          conversation={conversations.find((c) => c.stage === "secured" || c.stage === "collected") || conversations[0] || null}
          product={products[0] || null}
          onClose={() => setPinModalOpen(false)}
          onSuccessFinished={(releasedAmount) => {
            const activeOrder = conversations.find((c) => c.stage === "secured" || c.stage === "collected") || conversations[0];
            if (activeOrder) {
              updateConversation({
                ...activeOrder,
                stage: "delivered",
                messages: [
                  ...activeOrder.messages,
                  createMessage(
                    `Remise confirmée par code PIN. Montant de ${euro(releasedAmount)} libéré avec succès.`,
                    false,
                  ),
                ],
              });
            }
            if (user) {
              const updatedUser = {
                ...user,
                stripeBalance: (user.stripeBalance || 0) + releasedAmount,
                pendingEscrow: Math.max(0, (user.pendingEscrow || 0) - releasedAmount),
                completedDeliveries: (user.completedDeliveries || 0) + 1,
              };
              void saveRecord("users", updatedUser);
            }
            setPinModalOpen(false);
            setNotice(`Remise validée ! ${euro(releasedAmount)} crédités sur votre solde disponible.`);
          }}
        />
      )}
      <HowItWorksModal
        isOpen={howItWorksModalOpen}
        onClose={() => setHowItWorksModalOpen(false)}
      />
    </div>
  );
}
function InfoIcon() {
  return <ShieldCheck size={18} />;
}
export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Marketplace />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
