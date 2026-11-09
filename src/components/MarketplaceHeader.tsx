import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  CirclePlus,
  Compass,
  Globe2,
  MessageCircle,
  Package,
  Plane,
  Radio,
  Scan,
  Share2,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
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
    activePlatform,
    setActivePlatform,
    profileSelection,
    isKycVerified,
    openKycModal,
  } = useAuth();

  const handleSelectPlatform = (platform: ActivePlatform) => {
    setActivePlatform(platform);
    if (route !== 'explore' && route !== 'voyageur' && route !== 'shopandgo' && route !== 'bagandgo') {
      navigate('explore');
    }
  };

  return (
    <header className="site-header unified-header">
      <div className="header-inner">
        <div className="brand-wrap">
          {route !== "explore" && !route.startsWith("publish/") && (
            <button
              className="header-back icon-button"
              aria-label="Retour à Explorer"
              onClick={() => navigate("explore")}
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <button
            className="brand"
            onClick={() => navigate("explore")}
            aria-label="BagVoyage, accueil"
          >
            <BrandMark platform={activePlatform} />
          </button>

          {/* Platform Switcher Desktop - Apple HIG Segmented Control */}
          <div
            className="hidden lg:flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 ml-3 shadow-inner"
            role="radiogroup"
            aria-label="Choisir la plateforme"
          >
            <button
              type="button"
              role="radio"
              aria-checked={activePlatform === 'bagandgo'}
              onClick={() => handleSelectPlatform('bagandgo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activePlatform === 'bagandgo'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Package size={14} className={activePlatform === 'bagandgo' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
              <div className="flex flex-col text-left leading-none">
                <span className="font-bold">Bag&amp;Go</span>
                <span className="text-[8px] opacity-75 font-medium">Récupérer · Expédier</span>
              </div>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={activePlatform === 'voyageur'}
              onClick={() => handleSelectPlatform('voyageur')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activePlatform === 'voyageur'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserRound size={14} className={activePlatform === 'voyageur' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
              <span className="font-bold">Voyageur</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={activePlatform === 'shopandgo'}
              onClick={() => handleSelectPlatform('shopandgo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activePlatform === 'shopandgo'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShoppingCart size={14} className={activePlatform === 'shopandgo' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
              <div className="flex flex-col text-left leading-none">
                <span className="font-bold">Shop&amp;Go</span>
                <span className="text-[8px] opacity-75 font-medium">Acheter · Livrer</span>
              </div>
            </button>
          </div>
        </div>

        <div className="header-rail">
          {/* Navigation Desktop */}
          <nav className="desktop-nav" aria-label="Navigation principale">
            <button
              aria-current={
                route === "explore" || route === "shopandgo" || route === "bagandgo"
                  ? "page"
                  : undefined
              }
              onClick={() => navigate(activePlatform === "shopandgo" ? "shopandgo" : "bagandgo")}
            >
              {activePlatform === "shopandgo" ? "Shop & Go" : "Bag & Go"}
            </button>
            <button
              type="button"
              aria-current={route.startsWith("radar") ? "page" : undefined}
              onClick={() => navigate("radar")}
            >
              Radar Mondial
            </button>
            <button
              type="button"
              aria-current={route.startsWith("arbitrage") ? "page" : undefined}
              onClick={() => navigate("arbitrage")}
            >
              Arbitrage Vols
            </button>
            <button
              type="button"
              aria-current={route === "tracking" ? "page" : undefined}
              onClick={() => navigate("tracking")}
            >
              Mes expéditions
            </button>
            <button
              type="button"
              aria-current={route === "messages" ? "page" : undefined}
              onClick={() => navigate("messages")}
            >
              <MessageCircle size={15} />
              Messages
            </button>
          </nav>

          {/* Outils et services */}
          <nav className="header-utilities mobile-tools-scroll" aria-label="Navigation et services">
            {/* Outils logistiques IATA et Fret */}
            {props.onScanBoardingPass && (
              <button
                type="button"
                className="header-tool"
                aria-label="Scanner carte d’embarquement IATA"
                title="Scanner carte d’embarquement IATA"
                onClick={props.onScanBoardingPass}
              >
                <Scan size={18} />
                <span className="header-tool-label">Scanner</span>
              </button>
            )}

            {props.onCargoPass && (
              <button
                type="button"
                className="header-tool"
                aria-label="Passe de fret numérique"
                title="Passe de fret numérique"
                onClick={props.onCargoPass}
              >
                <Ticket size={18} />
                <span className="header-tool-label">Passe fret</span>
              </button>
            )}

            <button
              className="header-tool desktop-account"
              aria-label="Publier"
              title="Publier"
              onClick={props.onPublish}
            >
              <CirclePlus size={18} />
            </button>

            <CurrencyRatePill compact onClick={props.onCurrency} />
            <LanguageSelector location="header" />
            <ThemeToggle className="header-tool" />

            <button
              className="header-tool"
              aria-label="Radar Méditerranée"
              title="Radar Méditerranée"
              onClick={props.onRadar}
            >
              <Radio size={18} />
            </button>

            <button
              className="header-tool"
              aria-label="Découvrir BagVoyage"
              title="Découvrir BagVoyage"
              onClick={() => navigate("landing")}
            >
              <Compass size={18} />
            </button>

            {props.showAdmin && (
              <button
                className="header-tool"
                aria-label="Super Admin"
                title="Super Admin"
                onClick={() => navigate("admin")}
              >
                <ShieldCheck size={18} />
              </button>
            )}

            <button
              className={`wallet-pill ${route === "wallet" ? "active" : ""}`}
              aria-label={`Mon portefeuille, solde disponible ${props.balance}`}
              onClick={() => navigate("wallet")}
            >
              <Wallet size={17} />
              <span>{props.balance}</span>
            </button>

            {props.canShare ? (
              <button
                className="header-tool"
                aria-label="Partager l’annonce"
                title="Partager l’annonce"
                onClick={props.onShare}
              >
                <Share2 size={18} />
              </button>
            ) : (
              <button
                className="header-tool preview-toggle"
                aria-label="Aperçu mobile"
                title="Aperçu mobile"
                onClick={props.onPreview}
              >
                <Smartphone size={18} />
              </button>
            )}

            <button className="login-button" onClick={props.onLogin}>
              {props.userName ? "Mon profil" : "Se connecter"}
              <ArrowUpRight size={14} />
            </button>
          </nav>
        </div>
        <nav className="header-primary-actions" aria-label="Navigation du compte">
          {/* Indicateur de connectivité Réseau / Mode Aéroport Hors-ligne */}
          <button
            type="button"
            className={`network-status-pill hidden md:inline-flex ${isOnline ? "status-online" : "status-offline"}`}
            title={
              isOnline
                ? "Réseau actif · Mode connecté"
                : "Zone blanche · Mode aéroport hors-ligne actif (cliquez pour la remise hors-ligne)"
            }
            aria-label={isOnline ? "Connexion réseau active" : "Mode aéroport hors-ligne actif"}
            onClick={props.onOfflineHandover}
          >
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span className="network-status-label">
              {isOnline ? "En ligne" : "Aéroport"}
            </span>
          </button>

          <button
            className="header-tool notification-bell"
            aria-label={`Notifications, ${props.unreadCount} non lues`}
            aria-expanded={props.notificationsOpen}
            aria-haspopup="dialog"
            aria-controls={
              props.notificationsOpen ? "notifications-drawer" : undefined
            }
            onClick={props.onNotifications}
          >
            <Bell size={18} />
            {props.unreadCount > 0 && (
              <span className="notification-count" aria-hidden="true">
                {props.unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`header-tool hidden md:inline-flex ${isKycVerified ? "text-emerald-500" : "text-amber-500"}`}
            aria-label="Vérification KYC"
            title={isKycVerified ? "Identité KYC Vérifiée" : "Vérification d'identité requise"}
            onClick={openKycModal}
          >
            <ShieldCheck size={18} />
          </button>

          <button
            className="header-tool header-profile hidden md:inline-flex"
            aria-label="Profil"
            title="Profil"
            aria-current={route === "profile" ? "page" : undefined}
            onClick={() => navigate("profile")}
          >
            <UserRound size={18} />
          </button>
        </nav>
      </div>

      {/* Mobile Platform Switcher Strip - Only on Explore / Platform routes */}
      {(route === "explore" || route === "voyageur" || route === "shopandgo" || route === "bagandgo" || route === "") && (
        <div className="lg:hidden flex items-center justify-center px-3 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/70 dark:border-slate-800">
          <div
            className="flex items-center w-full max-w-sm p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-inner"
            role="radiogroup"
            aria-label="Choisir la plateforme mobile"
          >
            <button
              type="button"
              role="radio"
              aria-checked={activePlatform === 'bagandgo'}
              onClick={() => handleSelectPlatform('bagandgo')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
                activePlatform === 'bagandgo'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Package size={13} className={activePlatform === 'bagandgo' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[11px] font-bold">Bag&amp;Go</span>
                <span className="text-[7.5px] opacity-75 font-medium truncate max-w-[65px]">Expédier</span>
              </div>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={activePlatform === 'voyageur'}
              onClick={() => handleSelectPlatform('voyageur')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
                activePlatform === 'voyageur'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <UserRound size={13} className={activePlatform === 'voyageur' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
              <span className="text-[11px] font-bold">Voyageur</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={activePlatform === 'shopandgo'}
              onClick={() => handleSelectPlatform('shopandgo')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
                activePlatform === 'shopandgo'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <ShoppingCart size={13} className={activePlatform === 'shopandgo' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[11px] font-bold">Shop&amp;Go</span>
                <span className="text-[7.5px] opacity-75 font-medium truncate max-w-[65px]">Acheter</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
