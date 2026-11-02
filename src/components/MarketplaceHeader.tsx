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
            <BrandMark />
          </button>
        </div>

        <div className="header-rail">
          {/* Navigation Desktop */}
          <nav className="desktop-nav" aria-label="Navigation principale">
            <button
              aria-current={route === "explore" ? "page" : undefined}
              onClick={() => navigate("explore")}
            >
              Explorer
            </button>
            <a
              href="#radar"
              aria-current={route.startsWith("radar") ? "page" : undefined}
            >
              Radar Mondial
            </a>
            <button
              aria-current={route.startsWith("arbitrage") ? "page" : undefined}
              onClick={() => navigate("arbitrage")}
            >
              Arbitrage Vols
            </button>
            <a
              href="#tracking"
              aria-current={route === "tracking" ? "page" : undefined}
            >
              Mes expéditions
            </a>
            <button
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

            <a
              className="header-tool mobile-header-link"
              href="#tracking"
              aria-label="Mes expéditions"
              title="Mes expéditions"
            >
              <Package size={18} />
                <span className="header-tool-label">Expéditions</span>
            </a>
            <a
              className="header-tool mobile-header-link"
              href="#radar"
              aria-label="Radar Mondial"
              title="Radar Mondial"
            >
              <Globe2 size={18} />
                <span className="header-tool-label">Radar</span>
            </a>
            <button
              className="header-tool mobile-header-link"
              aria-label="Arbitrage Vols"
              title="Arbitrage Vols"
              onClick={() => navigate("arbitrage")}
            >
              <Plane size={18} />
                <span className="header-tool-label">Arbitrage</span>
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
            className={`network-status-pill ${isOnline ? "status-online" : "status-offline"}`}
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
            className="header-tool header-profile"
            aria-label="Profil"
            title="Profil"
            aria-current={route === "profile" ? "page" : undefined}
            onClick={() => navigate("profile")}
          >
            <UserRound size={18} />
          </button>

        </nav>

      </div>
    </header>
  );
}
