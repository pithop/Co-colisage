import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  ChevronDown,
  CirclePlus,
  Compass,
  FileText,
  HelpCircle,
  LogOut,
  MessageCircle,
  Package,
  Plane,
  Radio,
  Scan,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Ticket,
  UserRound,
  Wallet,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { BrandMark } from "./BrandMark";
import { CurrencyRatePill } from "./CurrencyConverter/CurrencyConverterModal";
import { LanguageSelector } from "../context/LanguageContext";
import { ThemeToggle } from "./common/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { ActivePlatform } from "../types/auth";

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

  // Close menu when clicking outside or pressing Escape
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
    <header className="site-header unified-header relative z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Back Button */}
        <div className="flex items-center gap-2 shrink-0">
          {route !== "explore" && !route.startsWith("publish/") && (
            <button
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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

        {/* Center: The 3 Core Universes Switcher (Desktop & Tablet) */}
        <div
          className="hidden md:flex items-center p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs"
          role="radiogroup"
          aria-label="Choisir la plateforme"
        >
          <button
            type="button"
            role="radio"
            aria-checked={activePlatform === "bagandgo"}
            onClick={() => handleSelectPlatform("bagandgo")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              activePlatform === "bagandgo"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs scale-[1.01]"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Package
              size={15}
              className={
                activePlatform === "bagandgo"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-400"
              }
            />
            <div className="flex flex-col text-left leading-none">
              <span className="font-bold">Bag&amp;Go</span>
              <span className="text-[9px] opacity-70 font-semibold">Expédier</span>
            </div>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={activePlatform === "voyageur"}
            onClick={() => handleSelectPlatform("voyageur")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              activePlatform === "voyageur"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs scale-[1.01]"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <UserRound
              size={15}
              className={
                activePlatform === "voyageur"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-400"
              }
            />
            <div className="flex flex-col text-left leading-none">
              <span className="font-bold">Voyageur</span>
              <span className="text-[9px] opacity-70 font-semibold">Rentabiliser</span>
            </div>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={activePlatform === "shopandgo"}
            onClick={() => handleSelectPlatform("shopandgo")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              activePlatform === "shopandgo"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs scale-[1.01]"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ShoppingCart
              size={15}
              className={
                activePlatform === "shopandgo"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-400"
              }
            />
            <div className="flex flex-col text-left leading-none">
              <span className="font-bold">Shop&amp;Go</span>
              <span className="text-[9px] opacity-70 font-semibold">Commander</span>
            </div>
          </button>
        </div>

        {/* Right: Primary High-Value Action Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1. Primary Call-To-Action "+ Publier" */}
          <button
            type="button"
            onClick={props.onPublish}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
            aria-label="Publier une annonce"
          >
            <CirclePlus size={16} strokeWidth={2.4} />
            <span className="hidden sm:inline">Publier</span>
          </button>

          {/* 2. Messages Icon with Live Badge */}
          <button
            type="button"
            onClick={() => navigate("messages")}
            className={`relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
              route === "messages" ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400" : ""
            }`}
            aria-label="Messagerie sécurisée"
            title="Messagerie sécurisée"
          >
            <MessageCircle size={19} />
            {props.unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* 3. Wallet Pill (Portefeuille avec solde) */}
          <button
            type="button"
            onClick={() => navigate("wallet")}
            className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-extrabold text-xs transition-all cursor-pointer ${
              route === "wallet"
                ? "bg-slate-950 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xs"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xs"
            }`}
            aria-label={`Mon portefeuille, solde disponible ${props.balance}`}
            title="Mon Portefeuille"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Wallet size={14} className="text-blue-600 dark:text-blue-400" />
            <span>{props.balance}</span>
          </button>

          {/* 4. Dropdown Menu Trigger (Profil, Outils & Préférences) */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 p-1 sm:pl-2 sm:pr-2.5 sm:py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              aria-label="Menu du compte et outils"
              aria-expanded={menuOpen}
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {props.userName ? props.userName.slice(0, 2).toUpperCase() : <UserRound size={14} />}
              </div>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 hidden sm:block ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Elite Dropdown Panel */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                {/* User Info Header */}
                <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {props.userName || "Invité"}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {user?.email || "Connectez-vous pour synchroniser vos trajets"}
                      </p>
                    </div>
                    {isKycVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
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
                        className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        Vérifier KYC
                      </button>
                    )}
                  </div>
                </div>

                {/* Section 1: Navigation Rapide */}
                <div className="py-1.5 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("tracking");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    <Package size={15} className="text-blue-600 dark:text-blue-400" />
                    <span>Mes expéditions &amp; commandes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("wallet");
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Wallet size={15} className="text-blue-600 dark:text-blue-400" />
                      <span>Mon Portefeuille</span>
                    </div>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{props.balance}</span>
                  </button>
                </div>

                {/* Section 2: Outils Professionnels */}
                <div className="py-1.5 border-b border-slate-100 dark:border-slate-800 text-xs">
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
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                    >
                      <Scan size={15} className="text-blue-500" />
                      <span>Scanner billet IATA</span>
                    </button>
                  )}

                  {props.onCargoPass && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        props.onCargoPass?.();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                    >
                      <Ticket size={15} className="text-blue-500" />
                      <span>Passe fret numérique</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      props.onRadar();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    <Radio size={15} className="text-blue-500" />
                    <span>Radar mondial vols &amp; ferries</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("arbitrage");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    <Plane size={15} className="text-blue-500" />
                    <span>Arbitrage de vols &amp; rentabilité</span>
                  </button>

                  <div className="px-3 py-1 flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Convertisseur</span>
                    <CurrencyRatePill compact onClick={() => { setMenuOpen(false); props.onCurrency(); }} />
                  </div>
                </div>

                {/* Section 3: Préférences & Assistance */}
                <div className="py-1.5 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Apparence</span>
                    <ThemeToggle showLabel />
                  </div>

                  <div className="flex items-center justify-between px-3 py-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Langue</span>
                    <LanguageSelector location="header" />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      window.dispatchEvent(new CustomEvent("bv:open-how-it-works"));
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    <HelpCircle size={15} className="text-slate-400" />
                    <span>Comment ça marche</span>
                  </button>

                  {/* Mode Hors-ligne / Aéroport */}
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      props.onOfflineHandover?.();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    {isOnline ? <Wifi size={15} className="text-emerald-500" /> : <WifiOff size={15} className="text-amber-500" />}
                    <span>{isOnline ? "Connexion active" : "Remise hors-ligne (Aéroport)"}</span>
                  </button>

                  {props.showAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("admin");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-semibold transition-colors cursor-pointer"
                    >
                      <ShieldCheck size={15} />
                      <span>Console Super Admin</span>
                    </button>
                  )}
                </div>

                {/* Section 4: Auth CTA */}
                <div className="pt-1.5">
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
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold transition-all text-xs shadow-xs cursor-pointer"
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

      {/* Mobile Platform Switcher Strip (Always Visible on Mobile) */}
      <div className="md:hidden flex items-center justify-center px-3 py-2 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800">
        <div
          className="flex items-center w-full max-w-sm p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 shadow-xs"
          role="radiogroup"
          aria-label="Choisir la plateforme mobile"
        >
          <button
            type="button"
            role="radio"
            aria-checked={activePlatform === "bagandgo"}
            onClick={() => handleSelectPlatform("bagandgo")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-xl text-xs font-bold transition-all min-h-[40px] cursor-pointer ${
              activePlatform === "bagandgo"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Package
              size={14}
              className={activePlatform === "bagandgo" ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}
            />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[11px] font-bold">Bag&amp;Go</span>
              <span className="text-[7.5px] opacity-80 font-medium">Expédier</span>
            </div>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={activePlatform === "voyageur"}
            onClick={() => handleSelectPlatform("voyageur")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-xl text-xs font-bold transition-all min-h-[40px] cursor-pointer ${
              activePlatform === "voyageur"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <UserRound
              size={14}
              className={activePlatform === "voyageur" ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}
            />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[11px] font-bold">Voyageur</span>
              <span className="text-[7.5px] opacity-80 font-medium">Rentabiliser</span>
            </div>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={activePlatform === "shopandgo"}
            onClick={() => handleSelectPlatform("shopandgo")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-xl text-xs font-bold transition-all min-h-[40px] cursor-pointer ${
              activePlatform === "shopandgo"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <ShoppingCart
              size={14}
              className={activePlatform === "shopandgo" ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}
            />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[11px] font-bold">Shop&amp;Go</span>
              <span className="text-[7.5px] opacity-80 font-medium">Commander</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

