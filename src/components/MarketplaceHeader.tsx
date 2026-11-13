import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  CirclePlus,
  HelpCircle,
  LogOut,
  MessageCircle,
  Package,
  Plane,
  Radio,
  RefreshCw,
  Scan,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  UserRound,
  Wallet,
  Wifi,
  WifiOff,
} from "lucide-react";
import { BrandMark } from "./BrandMark";
import { CurrencyRatePill } from "./CurrencyConverter/CurrencyConverterModal";
import { LanguageSelector } from "../context/LanguageContext";
import { ThemeToggle } from "./common/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { ActivePlatform } from "../types/auth";
import { subscribeToSyncReport, getSyncReport, type SyncReport } from "../services/apiSync";

interface Props {
  route: string;
  balance: string;
  unreadCount: number;
  notificationsOpen: boolean;
  userName?: string;
  showAdmin: boolean;
  canShare: boolean;
  isOnline?: boolean;
  navigate: (route: string) => void;
  onPublish: () => void;
  onCurrency: () => void;
  onRadar: () => void;
  onNotifications: () => void;
  onLogin: () => void;
  onPreview: () => void;
  onShare: () => void;
  onScanBoardingPass?: () => void;
  onCargoPass?: () => void;
  onOfflineHandover?: () => void;
}

export function MarketplaceHeader(props: Props) {
  const { route, navigate, isOnline = true } = props;
  const {
    user,
    logout,
    activePlatform,
    setActivePlatform,
    isKycVerified,
    openKycModal,
  } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [syncReport, setSyncReport] = useState<SyncReport>(getSyncReport());

  useEffect(() => {
    return subscribeToSyncReport((report) => setSyncReport(report));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const handleSelectPlatform = (platform: ActivePlatform) => {
    setActivePlatform(platform);
    if (
      route !== "explore" &&
      route !== "voyageur" &&
      route !== "shopandgo" &&
      route !== "bagandgo"
    ) {
      navigate("explore");
    }
  };

  return (
    <header className="site-header unified-header relative z-40 bg-[#FFFFFF]/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-[#E2E8F0] dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Back Button */}
        <div className="flex items-center gap-2 shrink-0">
          {route !== "explore" && !route.startsWith("publish/") && (
            <button
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-colors"
              aria-label="Retour à Explorer"
              onClick={() => navigate("explore")}
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <button
            className="flex items-center gap-2 cursor-pointer transition-transform active:scale-95 text-left"
            onClick={() => navigate("explore")}
            aria-label="BagVoyage, accueil"
          >
            <BrandMark platform={activePlatform} />
          </button>
        </div>

        {/* Center: Clean Segmented Control (Colis | Trajets | Shopping) */}
        <div
          className="hidden md:inline-flex items-center p-1 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700"
          role="radiogroup"
          aria-label="Choisir la plateforme"
        >
          <button
            type="button"
            role="radio"
            aria-checked={activePlatform === "bagandgo"}
            onClick={() => handleSelectPlatform("bagandgo")}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activePlatform === "bagandgo"
                ? "bg-[#FFFFFF] dark:bg-slate-900 text-slate-900 dark:text-white border border-[#E2E8F0] dark:border-slate-700 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Package
              size={14}
              className={activePlatform === "bagandgo" ? "text-[#2563EB]" : "text-slate-400"}
            />
            <span>Colis</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={activePlatform === "voyageur"}
            onClick={() => handleSelectPlatform("voyageur")}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activePlatform === "voyageur"
                ? "bg-[#FFFFFF] dark:bg-slate-900 text-slate-900 dark:text-white border border-[#E2E8F0] dark:border-slate-700 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Plane
              size={14}
              className={activePlatform === "voyageur" ? "text-[#2563EB]" : "text-slate-400"}
            />
            <span>Trajets</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={activePlatform === "shopandgo"}
            onClick={() => handleSelectPlatform("shopandgo")}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activePlatform === "shopandgo"
                ? "bg-[#FFFFFF] dark:bg-slate-900 text-slate-900 dark:text-white border border-[#E2E8F0] dark:border-slate-700 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ShoppingBag
              size={14}
              className={activePlatform === "shopandgo" ? "text-[#2563EB]" : "text-slate-400"}
            />
            <span>Shopping</span>
          </button>
        </div>

        {/* Right: Primary Action Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1. Primary Call-To-Action "+ Publier" (#2563EB strictly reserved for primary CTA) */}
          <button
            type="button"
            onClick={props.onPublish}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
            aria-label="Publier une annonce"
          >
            <CirclePlus size={16} strokeWidth={2.4} />
            <span className="hidden sm:inline">Publier</span>
          </button>

          {/* 2. Messages Icon with Live Badge */}
          <button
            type="button"
            onClick={() => navigate("messages")}
            className={`relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-colors cursor-pointer ${
              route === "messages"
                ? "bg-[#F8FAFC] dark:bg-slate-800 text-[#2563EB]"
                : ""
            }`}
            aria-label="Messagerie sécurisée"
            title="Messagerie sécurisée"
          >
            <MessageCircle size={19} />
            {props.unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Live Sync / Offline Pill */}
          {(!isOnline || syncReport.status === "offline") && (
            <span
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold"
              title="Vos données sont enregistrées en local"
            >
              <WifiOff size={13} className="text-amber-500 shrink-0" />
              <span>Hors-ligne</span>
            </span>
          )}

          {syncReport.status === "syncing" && (
            <span
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[#2563EB] text-xs font-bold"
              title="Synchronisation en cours"
            >
              <RefreshCw size={12} className="text-[#2563EB] animate-spin shrink-0" />
              <span>Synchronisation…</span>
            </span>
          )}

          {/* 3. Wallet Pill (Portefeuille avec solde en tabular-nums) */}
          <button
            type="button"
            onClick={() => navigate("wallet")}
            className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border font-bold text-xs tabular-nums transition-all cursor-pointer ${
              route === "wallet"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent"
                : "border-[#E2E8F0] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300"
            }`}
            aria-label={`Mon portefeuille, solde disponible ${props.balance}`}
            title="Mon Portefeuille"
          >
            <div className="w-2 h-2 rounded-full bg-[#059669]" />
            <Wallet size={14} className="text-slate-600 dark:text-slate-300" />
            <span className="tabular-nums">{props.balance}</span>
          </button>

          {/* 4. Dropdown Menu Trigger */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 p-1 sm:pl-2 sm:pr-2.5 sm:py-1.5 rounded-2xl border border-[#E2E8F0] dark:border-slate-700 hover:border-slate-300 bg-[#FFFFFF] dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              aria-label="Menu du compte et outils"
              aria-expanded={menuOpen}
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                {props.userName ? (
                  props.userName.slice(0, 2).toUpperCase()
                ) : (
                  <UserRound size={14} />
                )}
              </div>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 hidden sm:block ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 max-h-[calc(100dvh-90px)] overflow-y-auto rounded-2xl bg-[#FFFFFF] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-xl p-5 z-50 text-slate-800 dark:text-slate-200">
                {/* User Info Header */}
                <div className="pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        {props.userName || "Invité"}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {user?.email || "Connectez-vous pour synchroniser vos trajets"}
                      </p>
                    </div>
                    {isKycVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400 border border-emerald-200/80 text-[10px] font-bold whitespace-nowrap">
                        <ShieldCheck size={11} />
                        Vérifié
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          openKycModal();
                        }}
                        className="text-[10px] font-bold text-[#059669] hover:underline cursor-pointer whitespace-nowrap"
                      >
                        Vérifier mon profil
                      </button>
                    )}
                  </div>
                </div>

                {/* Section 1: Navigation Rapide */}
                <div className="py-2 border-b border-[#E2E8F0] dark:border-slate-800 text-xs space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("tracking");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#F8FAFC] dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    <Package size={15} className="text-slate-500" />
                    <span>Mes expéditions &amp; commandes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("wallet");
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#F8FAFC] dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Wallet size={15} className="text-slate-500" />
                      <span>Mon Portefeuille</span>
                    </div>
                    <span className="font-bold text-[#059669] tabular-nums">
                      {props.balance}
                    </span>
                  </button>
                </div>

                {/* Section 2: Outils Logistiques */}
                <div className="py-2 border-b border-[#E2E8F0] dark:border-slate-800 text-xs space-y-1">
                  <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Outils Logistiques
                  </span>

                  {props.onScanBoardingPass && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        props.onScanBoardingPass?.();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#F8FAFC] dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                    >
                      <Scan size={15} className="text-slate-500" />
                      <span>Scanner mon billet</span>
                    </button>
                  )}

                  {props.onCargoPass && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        props.onCargoPass?.();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#F8FAFC] dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                    >
                      <Ticket size={15} className="text-slate-500" />
                      <span>Passe fret numérique</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      props.onRadar();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#F8FAFC] dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    <Radio size={15} className="text-slate-500" />
                    <span>Radar mondial vols &amp; ferries</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("arbitrage");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#F8FAFC] dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    <Plane size={15} className="text-slate-500" />
                    <span>Arbitrage de vols &amp; rentabilité</span>
                  </button>

                  <div className="px-3 py-1 flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Convertisseur</span>
                    <CurrencyRatePill
                      compact
                      onClick={() => {
                        setMenuOpen(false);
                        props.onCurrency();
                      }}
                    />
                  </div>
                </div>

                {/* Section 3: Préférences & Assistance */}
                <div className="py-2 border-b border-[#E2E8F0] dark:border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Apparence
                    </span>
                    <ThemeToggle showLabel />
                  </div>

                  <div className="flex items-center justify-between px-3 py-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Langue
                    </span>
                    <LanguageSelector location="header" />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      window.dispatchEvent(new CustomEvent("bv:open-how-it-works"));
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#F8FAFC] dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    <HelpCircle size={15} className="text-slate-400" />
                    <span>Comment ça marche</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      props.onOfflineHandover?.();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#F8FAFC] dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    {isOnline ? (
                      <Wifi size={15} className="text-[#059669]" />
                    ) : (
                      <WifiOff size={15} className="text-amber-500" />
                    )}
                    <span>
                      {isOnline ? "Connexion active" : "Remise hors-ligne (Aéroport)"}
                    </span>
                  </button>

                  {props.showAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("admin");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-700 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                    >
                      <ShieldCheck size={15} className="text-[#059669]" />
                      <span>Console Super Admin</span>
                    </button>
                  )}
                </div>

                {/* Section 4: Auth CTA */}
                <div className="pt-2">
                  {props.userName ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold transition-colors text-xs cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Se déconnecter</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        props.onLogin();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold transition-all text-xs cursor-pointer"
                    >
                      <span>Se connecter / Créer un compte</span>
                      <ArrowUpRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
