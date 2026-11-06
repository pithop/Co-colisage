import { useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  Coins,
  Compass,
  Download,
  Globe2,
  HelpCircle,
  Home,
  Package,
  Plane,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { ThemeToggle } from "../common/ThemeToggle";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language?: "fr" | "en";
  onLanguageChange?: (lang: "fr" | "en") => void;
  currentRoute?: string;
  navigate?: (route: string) => void;
}

export function LandingMobileMenu({
  isOpen,
  onClose,
  language = "fr",
  onLanguageChange,
  currentRoute = "landing",
  navigate,
}: Props) {
  const isFr = language === "fr";

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // Fallback
      }
    }
  };

  const handleLinkClick = (targetRoute: string, isAnchor = false) => {
    triggerHaptic();
    onClose();
    if (isAnchor) {
      if (currentRoute === "landing") {
        const el = document.getElementById(targetRoute);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
      window.location.hash = targetRoute;
      return;
    }

    if (navigate) {
      navigate(targetRoute);
    } else {
      window.location.hash = targetRoute;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navSections = [
    {
      title: isFr ? "Découverte & Informations" : "Discovery & Information",
      items: [
        {
          route: "landing",
          label: isFr ? "Accueil" : "Home",
          description: isFr
            ? "Plateforme & réseau de co-colisage"
            : "Platform & verified luggage network",
          icon: Home,
        },
        {
          route: "how-it-works",
          label: isFr ? "Comment ça marche" : "How it works",
          description: isFr
            ? "Expéditeur, Voyageur, Shop & Go"
            : "Sender, Traveler & Shop & Go guide",
          icon: BookOpen,
        },
        {
          route: "pricing",
          label: isFr ? "Tarifs & Simulateur" : "Pricing & Simulator",
          description: isFr
            ? "Prix au kilo clairs, économies -70%"
            : "Clear per-kg prices, save up to 70%",
          icon: Coins,
        },
        {
          route: "trust",
          label: isFr ? "Sécurité & Confiance" : "Security & Trust",
          description: isFr
            ? "Séquestre bancaire 100%, code PIN"
            : "100% bank escrow, verification PIN",
          icon: ShieldCheck,
        },
        {
          route: "faq",
          label: isFr ? "FAQ & Douanes" : "FAQ & Customs",
          description: isFr
            ? "Questions fréquentes, franchises légales"
            : "Frequently asked questions & limits",
          icon: HelpCircle,
        },
      ],
    },
    {
      title: isFr ? "Outils & Services en direct" : "Live Tools & Services",
      items: [
        {
          route: "radar",
          label: isFr ? "Radar Méditerranéen" : "Live Flight Radar",
          description: isFr
            ? "Carte live des vols et ferries"
            : "Interactive air & maritime traffic",
          icon: Globe2,
          badge: "Live",
        },
        {
          route: "tracking",
          label: isFr ? "Suivi des expéditions" : "Parcel Tracking",
          description: isFr
            ? "Traçabilité et statut de vos colis"
            : "Live GPS timeline & delivery codes",
          icon: Package,
        },
        {
          route: "arbitrage",
          label: isFr ? "Arbitrage de vols" : "Flight Arbitrage",
          description: isFr
            ? "Rentabilisez vos billets et bagages"
            : "Monetize unused luggage capacity",
          icon: Plane,
          badge: isFr ? "Gains" : "Rewards",
        },
        {
          route: "simulator",
          label: isFr ? "Simulateur d'économies" : "Savings Simulator",
          description: isFr
            ? "Calculateur de devis instantané"
            : "Instant quote & savings estimation",
          icon: Sparkles,
          isAnchor: true,
        },
      ],
    },
    {
      title: isFr ? "Mon Espace" : "My Account",
      items: [
        {
          route: "login",
          label: isFr ? "Connexion" : "Log in",
          description: isFr
            ? "Accédez à votre espace sécurisé"
            : "Sign in to your member account",
          icon: UserRound,
        },
        {
          route: "register",
          label: isFr ? "Créer un compte" : "Create account",
          description: isFr
            ? "Rejoindre le réseau en 2 minutes"
            : "Join verified travellers in 2 mins",
          icon: UserPlus,
          badge: isFr ? "Nouveau" : "New",
        },
        {
          route: "download",
          label: isFr ? "Application Mobile" : "Mobile App",
          description: isFr
            ? "Télécharger sur iOS & Android"
            : "Download on iOS & Android",
          icon: Download,
        },
      ],
    },
  ];

  return (
    <div
      className="landing-mobile-menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={isFr ? "Menu de navigation" : "Navigation menu"}
    >
      <div className="landing-mobile-menu-container">
        {/* Top bar with Brand and Close */}
        <div className="landing-mobile-menu-topbar">
          <a
            href="/#landing"
            className="landing-mobile-menu-brand"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick("landing");
            }}
          >
            BagVoyage<span>.</span>
          </a>

          <div className="landing-mobile-menu-top-actions">
            <ThemeToggle />

            {onLanguageChange && (
              <label className="landing-mobile-menu-lang">
                <Globe2 size={15} aria-hidden="true" />
                <select
                  aria-label={isFr ? "Changer la langue" : "Change language"}
                  value={language}
                  onChange={(e) => {
                    triggerHaptic();
                    onLanguageChange(e.target.value as "fr" | "en");
                  }}
                >
                  <option value="fr">FR</option>
                  <option value="en">EN</option>
                </select>
              </label>
            )}

            <button
              type="button"
              className="landing-mobile-menu-close"
              aria-label={isFr ? "Fermer le menu" : "Close menu"}
              onClick={() => {
                triggerHaptic();
                onClose();
              }}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Featured Primary Action: Switch to Application */}
        <div className="landing-mobile-menu-cta-card">
          <button
            type="button"
            className="landing-mobile-menu-app-launch"
            onClick={() => handleLinkClick("explore")}
          >
            <div className="app-launch-icon-wrap">
              <Compass size={22} aria-hidden="true" />
            </div>
            <div className="app-launch-text">
              <span className="app-launch-title">
                {isFr ? "Lancer l'Application" : "Open Application"}
              </span>
              <span className="app-launch-subtitle">
                {isFr
                  ? "Marketplace, trajets actifs & expéditions"
                  : "Explore marketplace, trips & parcels"}
              </span>
            </div>
            <ArrowRight size={18} className="app-launch-arrow" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="landing-mobile-menu-scrollable">
          {navSections.map((section) => (
            <div key={section.title} className="landing-mobile-menu-section">
              <span className="landing-mobile-menu-section-title">
                {section.title}
              </span>
              <ul className="landing-mobile-menu-list">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    !item.isAnchor && currentRoute === item.route;
                  return (
                    <li key={item.route}>
                      <button
                        type="button"
                        className={`landing-mobile-menu-item ${
                          isActive ? "active" : ""
                        }`}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() =>
                          handleLinkClick(item.route, item.isAnchor)
                        }
                      >
                        <span className="landing-mobile-menu-item-icon">
                          <Icon size={18} aria-hidden="true" />
                        </span>
                        <div className="landing-mobile-menu-item-info">
                          <span className="landing-mobile-menu-item-label">
                            {item.label}
                          </span>
                          <span className="landing-mobile-menu-item-desc">
                            {item.description}
                          </span>
                        </div>
                        {item.badge && (
                          <span className="landing-mobile-menu-badge">
                            {item.badge}
                          </span>
                        )}
                        <ArrowRight
                          size={14}
                          className="landing-mobile-menu-item-arrow"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Footer inside drawer */}
          <div className="landing-mobile-menu-footer">
            <p>
              {isFr
                ? "BagVoyage · Réseau international certifié de co-colisage"
                : "BagVoyage · Certified international peer-to-peer delivery"}
            </p>
            <span className="landing-mobile-menu-legal">
              {isFr
                ? "Séquestre Stripe Connect · Protection 100% garantie"
                : "Stripe Connect Escrow · 100% Protected"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
