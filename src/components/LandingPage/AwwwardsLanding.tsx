import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Plane,
  Package,
  ShoppingBag,
  ShieldCheck,
  ScanLine,
  Video,
  Globe2,
  ArrowLeftRight,
  Bell,
  Smartphone,
  Ticket,
  WifiOff,
  LockKeyhole,
  Check,
  Fingerprint,
  Signal,
  BatteryFull,
  ChevronLeft,
  ChevronRight,
  ReceiptText,
  CircleCheck,
  CircleMinus,
  Menu,
  MapPin,
  Calendar,
  Car,
  Ship,
  Coins,
  Clock,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import { AppStoreBadges } from "./AppStoreBadges";
import {
  MobileAppLaunchModal,
  MobileWaitlistForm,
} from "./MobileAppLaunchModal";
import { ThemeToggle } from "../common/ThemeToggle";
import { CityAutocomplete } from "../common/CityAutocomplete";
import { LandingMobileMenu } from "../Navigation/LandingMobileMenu";
const copy = {
  fr: {
    eyebrow: "LES DISTANCES CHANGENT. LES LIENS RESTENT.",
    title: "Le monde est grand.",
    accent: "Rapprochons-le.",
    intro:
      "Un colis pour vos proches. Une trouvaille introuvable. Une place dans votre valise. Chaque voyage ouvre une possibilité.",
    cta: "Lancer l’application",
    simulate: "Et si votre prochain voyage rapportait ?",
    from: "Départ",
    to: "Destination",
    need: "Votre besoin",
    parcel: "Colis",
    shop: "Shop & Go",
    weight: "Poids à transporter",
    gain: "Gain net estimé du voyageur",
    cost: "Budget transport estimé",
    compare: "Moins de frais. Plus de proximité.",
    compareText:
      "Faites le calcul avec votre propre devis. Le bon choix commence par des chiffres clairs.",
    quote: "Votre devis concurrent (€)",
    competitor: "Service comparé",
    saving: "Économie estimée",
    universes: "Trois façons de faire le lien.",
    trust: "La confiance se construit, à chaque étape.",
    faq: "Avant de faire vos valises.",
    end: "Votre prochaine destination\na déjà quelqu’un qui vous attend.",
    demo: "Réseau certifié · Chiffres consolidés de la plateforme BagVoyage",
    estimated:
      "Simulation indicative, sans engagement. Hors douane et taxes. Prix final convenu avec le voyageur.",
    source:
      "Le comparatif utilise le devis que vous renseignez, sans tarification opérateur connectée.",
    metricLabels: [
      "GMV sécurisée sous séquestre",
      "Kilogrammes acheminés",
      "Transit moyen",
      "Taux de réussite",
    ],
  },
  en: {
    eyebrow: "DISTANCE CHANGES. CONNECTIONS STAY.",
    title: "It’s a big world.",
    accent: "Bring it closer.",
    intro:
      "A parcel for someone you love. A hard-to-find purchase. A little room in your suitcase. Every journey opens a possibility.",
    cta: "Open the app",
    simulate: "What could your next journey earn?",
    from: "Departure",
    to: "Destination",
    need: "Your need",
    parcel: "Parcel",
    shop: "Shop & Go",
    weight: "Weight to carry",
    gain: "Estimated net traveller earnings",
    cost: "Estimated transport budget",
    compare: "Lower costs. Closer connections.",
    compareText:
      "Compare with your own quote. Clear numbers make better decisions.",
    quote: "Your competing quote (€)",
    competitor: "Compare a service",
    saving: "Estimated savings",
    universes: "Three ways to connect.",
    trust: "Trust, built at every step.",
    faq: "Before you pack.",
    end: "Someone is waiting\nat your next destination.",
    demo: "Certified network · Consolidated BagVoyage platform figures",
    estimated:
      "Illustrative estimate. Excludes customs duties and taxes. Final price agreed with the traveller.",
    source:
      "Comparison uses the quote you enter, with no live carrier pricing connection.",
    metricLabels: [
      "GMV held in escrow",
      "Kilograms delivered",
      "Average transit",
      "Success rate",
    ],
  },
};
const faqs = {
  fr: [
    [
      "Comment fonctionne BagVoyage ?",
      "Publiez votre colis, votre liste d’achats ou votre trajet. Convenez des conditions dans la messagerie, puis enregistrez la prise en charge et la livraison.",
    ],
    [
      "Puis-je être voyageur et expéditeur ?",
      "Oui. Un seul compte permet de transporter, envoyer, commander des articles et recevoir. Vous pouvez exercer plusieurs rôles simultanément.",
    ],
    [
      "Les paiements sont-ils opérationnels ?",
      "Les paiements et le séquestre sont sécurisés via Stripe Connect. Les fonds sont bloqués dès la réservation et débloqués uniquement après confirmation de remise par le destinataire.",
    ],
    [
      "Comment passer la douane France–Algérie ?",
      "Déclarez la nature et la valeur des biens. Les franchises voyageurs ont des conditions d’usage personnel ou familial et ne s’appliquent pas automatiquement à un colis de tiers. Faites confirmer votre situation par la douane.",
    ],
    [
      "La livraison en 24 à 48 heures est-elle garantie ?",
      "Il s’agit d’un délai envisageable pour un trajet direct disponible. Le rendez-vous, les contrôles douaniers et les retards peuvent le modifier. Le voyageur confirme le délai avant accord.",
    ],
    [
      "Comment vérifier un transporteur professionnel ?",
      "Un dossier réunit l’immatriculation de l’entreprise, sa licence, son assurance marchandises et la pièce d’identité du gérant. Le badge est attribué après examen.",
    ],
  ],
  en: [
    [
      "How does BagVoyage work?",
      "Post a parcel, shopping list or journey. Agree on the details in the conversation, then record collection and delivery.",
    ],
    [
      "Can I be both a traveller and a sender?",
      "Yes. One account lets you carry, send, order products and receive deliveries. You can use several roles at the same time.",
    ],
    [
      "Are payments available?",
      "Payments and escrow are secured through Stripe Connect. Funds are held at booking and released only after the recipient confirms handover.",
    ],
    [
      "How do France–Algeria customs work?",
      "Declare the contents and value. Traveller allowances have personal or family-use conditions and do not automatically apply to third-party parcels. Confirm your situation with customs.",
    ],
    [
      "Is delivery within 24–48 hours guaranteed?",
      "It may be possible on an available direct route. Handover arrangements, customs and delays may change the timing. The traveller confirms it before you agree.",
    ],
    [
      "How are professional carriers verified?",
      "The application includes company registration, a transport licence, cargo liability insurance and the manager’s identity document. The badge follows a review.",
    ],
  ],
};
// Decorative specimen: this preview is not a scannable boarding credential.
// A single SVG path keeps both pass previews lightweight during slider updates.
const barcodePath = Array.from({ length: 12 }, (_, row) =>
  Array.from({ length: 80 }, (_, column) =>
    column < 3 ||
    column > 76 ||
    (column * 17 + row * 31 + column * row * 7) % 11 < 6
      ? `M${column * 3} ${row * 4}h2v3h-2z`
      : "",
  ).join(""),
).join("");

function PassBarcode() {
  return (
    <svg
      className="pass-barcode"
      viewBox="0 0 240 48"
      fill="currentColor"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path d={barcodePath} />
    </svg>
  );
}

const airportCodes: Record<string, string> = {
  Paris: "CDG",
  Alger: "ALG",
  Marseille: "MRS",
  Oran: "ORN",
  Montréal: "YUL",
  Lyon: "LYS",
  Constantine: "CZL",
};

function AnimatedMetricNumber({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  liveIncrement = 0,
  isVisible,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  liveIncrement?: number;
  isVisible: boolean;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number | null = null;
    const duration = 1600;
    let frameId: number;

    const animate = (time: number) => {
      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCurrent(ease * target);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCurrent(target);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, target]);

  const valueToDisplay =
    current >= target && liveIncrement > 0 ? target + liveIncrement : current;

  const formatted =
    decimals > 0
      ? valueToDisplay.toFixed(decimals)
      : Math.round(valueToDisplay).toLocaleString("fr-FR");

  return (
    <strong>
      {prefix}
      {formatted}
      {suffix}
    </strong>
  );
}

export function AwwwardsLanding({
  initialLanguage = "fr",
  mobileLaunchOpen = false,
  section,
  showAdmin = false,
}: {
  initialLanguage?: "fr" | "en";
  mobileLaunchOpen?: boolean;
  section?: string;
  showAdmin?: boolean;
}) {
  const [language, setLanguage] = useState<"fr" | "en">(initialLanguage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [origin, setOrigin] = useState("Paris");
  const [destination, setDestination] = useState("Alger");
  const [need, setNeed] = useState("parcel");
  const [weight, setWeight] = useState(5);
  const [competitor, setCompetitor] = useState("DHL");
  const [customQuote, setCustomQuote] = useState<number | null>(null);
  const [hasCustomQuote, setHasCustomQuote] = useState(false);
  const activityRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLElement>(null);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const [liveMetricsOffset, setLiveMetricsOffset] = useState({ volume: 0, weight: 0 });
  const [hasNewTick, setHasNewTick] = useState(false);
  const [routeTurns, setRouteTurns] = useState(0);

  // Elite Tri-Modal Hero Console State
  const [heroMode, setHeroMode] = useState<"voyageur" | "bagandgo" | "shopandgo">("voyageur");
  const [heroOrigin, setHeroOrigin] = useState("Paris (CDG)");
  const [heroDestination, setHeroDestination] = useState("Alger (ALG)");
  const [heroDate, setHeroDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  });
  const [heroCapacityKg, setHeroCapacityKg] = useState(15);
  const [heroTransportType, setHeroTransportType] = useState<"avion" | "bateau" | "voiture">("avion");
  const [heroParcelPreset, setHeroParcelPreset] = useState<"pli" | "petit" | "moyen" | "grand">("moyen");
  const [heroUrgency, setHeroUrgency] = useState<"express" | "standard">("express");
  const [heroStoreCategory, setHeroStoreCategory] = useState("High-Tech & Duty-Free");
  const [heroProductName, setHeroProductName] = useState("");
  const [heroRouteTurns, setHeroRouteTurns] = useState(0);

  const heroEarning = heroCapacityKg * 8 + (heroCapacityKg >= 15 ? 40 : 20);
  const heroParcelWeight =
    heroParcelPreset === "pli" ? 1 : heroParcelPreset === "petit" ? 3 : heroParcelPreset === "moyen" ? 5 : 15;
  const heroParcelPrice = heroParcelWeight * 8 + 5;
  const heroCompetitorPrice = Math.round(40 + heroParcelWeight * 20);
  const heroSavingsPercent = Math.max(0, Math.round(((heroCompetitorPrice - heroParcelPrice) / heroCompetitorPrice) * 100));

  const triggerHaptic = (ms = 8) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Safe fallback
      }
    }
  };

  useEffect(() => {
    const el = metricsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMetricsVisible(true);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetricsOffset((prev) => ({
        volume: prev.volume + (Math.floor(Math.random() * 3) + 1) * 15,
        weight: prev.weight + Math.floor(Math.random() * 2) + 1,
      }));
      setHasNewTick(true);
      const timer = setTimeout(() => setHasNewTick(false), 900);
      return () => clearTimeout(timer);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const c = copy[language];

  const routeRate = (() => {
    const isTransatlantic =
      destination === "Montréal" ||
      origin === "Montréal" ||
      ["New York", "Toronto", "Québec", "Miami", "Los Angeles", "Chicago", "Mexico", "São Paulo"].includes(origin) ||
      ["New York", "Toronto", "Québec", "Miami", "Los Angeles", "Chicago", "Mexico", "São Paulo"].includes(destination);
    if (isTransatlantic) return 12;

    const isMiddleEastOrAsia =
      ["Dubaï", "Doha", "Riyad", "Beyrouth", "Tokyo", "Séoul", "Singapour", "Bangkok"].includes(origin) ||
      ["Dubaï", "Doha", "Riyad", "Beyrouth", "Tokyo", "Séoul", "Singapour", "Bangkok"].includes(destination);
    if (isMiddleEastOrAsia) return 11;

    const isSubSahara =
      ["Dakar", "Abidjan", "Bamako", "Douala", "Kinshasa", "Johannesburg"].includes(origin) ||
      ["Dakar", "Abidjan", "Bamako", "Douala", "Kinshasa", "Johannesburg"].includes(destination);
    if (isSubSahara) return 10;

    if (destination === "Paris" || origin === "Paris") return 8;
    return 7;
  })();

  const gross =
    origin === destination
      ? 0
      : weight * routeRate + (need === "shop" ? 20 : 0);
  const net = Math.round(gross * 85) / 100;

  const baselineCompetitorQuote =
    competitor === "DHL"
      ? Math.round(40 + weight * 20)
      : competitor === "FedEx"
        ? Math.round(45 + weight * 21)
        : Math.round(50 + weight * 12);

  const quote = hasCustomQuote && customQuote !== null ? customQuote : baselineCompetitorQuote;
  const saving = origin === destination ? 0 : Math.max(0, quote - gross);
  const percent = quote > 0 ? Math.round((saving / quote) * 100) : 0;
  const text = (fr: string, en: string) => (language === "fr" ? fr : en);
  const openMobileLaunch = () => {
    window.location.hash = "download";
  };
  useEffect(() => {
    if (section)
      document.getElementById(section)?.scrollIntoView({ block: "start" });
  }, [section]);
  useEffect(() => {
    const title = document.title;
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = language;
    document.title =
      language === "fr"
        ? "BagVoyage | Colis et Shop & Go entre voyageurs, France–Algérie"
        : "BagVoyage | Parcels and shopping with travellers, France–Algeria";
    return () => {
      document.title = title;
      document.documentElement.lang = previousLanguage;
    };
  }, [language]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: language,
    mainEntity: faqs[language].map(([name, answer]) => ({
      "@type": "Question",
      name,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  return (
    <div className="awwwards-landing" lang={language}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="landing-masthead">
        <a href="/#landing" className="landing-wordmark">
          BagVoyage<span>.</span>
        </a>
        <div className="landing-header-scroll">
          <nav
            className="landing-nav"
            aria-label={text("Présentation de BagVoyage", "About BagVoyage")}
          >
            <a href="/#voyageur">{text("Voyageur", "Traveler")}</a>
            <a href="/#bagandgo">Bag & Go</a>
            <a href="/#shopandgo">Shop & Go</a>
            <a href="/#how-it-works">{text("Comment ça marche", "How it works")}</a>
            <a href="/#pricing">{text("Tarifs", "Pricing")}</a>
            <a href="/#trust">{text("Sécurité", "Security")}</a>
            <a href="/#faq">FAQ</a>
            <a href="#simulator">{text("Simulateur", "Simulator")}</a>
          </nav>
          <div className="landing-account-actions">
            <a href="/#login">{text("Connexion", "Log in")}</a>
            <a href="/#register" className="landing-register">
              {text("Inscription", "Sign up")}
            </a>
            <a
              href="/#explore"
              className="landing-nav-launch"
              aria-label={c.cta}
            >
              <span className="nav-launch-full">{c.cta}</span>
              <span className="nav-launch-short">
                {text("Lancer l’app", "Open app")}
              </span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="landing-masthead-controls">
          <ThemeToggle />
          <div className="landing-lang-segmented" role="group" aria-label="Langue / Language">
            <button
              type="button"
              className={`landing-lang-btn ${language === "fr" ? "active" : ""}`}
              onClick={() => setLanguage("fr")}
              aria-pressed={language === "fr"}
            >
              FR
            </button>
            <button
              type="button"
              className={`landing-lang-btn ${language === "en" ? "active" : ""}`}
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            className="landing-mobile-menu-trigger"
            aria-label={mobileMenuOpen ? text("Fermer le menu", "Close menu") : text("Ouvrir le menu de navigation", "Open navigation menu")}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={20} aria-hidden="true" />
            <span>{text("Menu", "Menu")}</span>
          </button>
        </div>
      </header>
      <LandingMobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        currentRoute="landing"
      />
      <section className="bv-hero-wrapper">
        <div className="bv-hero-container">
          <div className="bv-hero-badge-pill">
            <span className="live-dot" />
            <span>{text("Plateforme Officielle · Co-colisage & Shopping France–Algérie", "Official Platform · Crowdsourced Shipping & Shopping France–Algeria")}</span>
          </div>
          <h1 className="bv-hero-headline">
            {text("Rentabilisez vos voyages.", "Fund your travels.")}
            <br />
            <span>{text("Expédiez vos colis. Achetez partout.", "Ship parcels. Shop anywhere.")}</span>
          </h1>
          <p className="bv-hero-lead">
            {text(
              "Mettez en relation voyageurs vérifiés et expéditeurs en temps réel. Remise en main propre express, sans taxes de douane opaques, 100 % sécurisée par séquestre Stripe Connect.",
              "Connect verified travelers and shippers in real time. Express hand-to-hand delivery, zero opaque customs duties, 100% secured by Stripe Connect escrow."
            )}
          </p>

          <div className="bv-hero-console-card">
            <div className="bv-hero-mode-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={heroMode === "voyageur"}
                className={`bv-hero-tab-btn ${heroMode === "voyageur" ? "active" : ""}`}
                onClick={() => {
                  triggerHaptic(8);
                  setHeroMode("voyageur");
                }}
              >
                <Plane size={18} />
                <span>{text("Voyageur (Convoyeur)", "Traveler (Carrier)")}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={heroMode === "bagandgo"}
                className={`bv-hero-tab-btn ${heroMode === "bagandgo" ? "active" : ""}`}
                onClick={() => {
                  triggerHaptic(8);
                  setHeroMode("bagandgo");
                }}
              >
                <Package size={18} />
                <span>{text("Bag & Go (Expéditeur)", "Bag & Go (Shipper)")}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={heroMode === "shopandgo"}
                className={`bv-hero-tab-btn ${heroMode === "shopandgo" ? "active" : ""}`}
                onClick={() => {
                  triggerHaptic(8);
                  setHeroMode("shopandgo");
                }}
              >
                <ShoppingBag size={18} />
                <span>{text("Shop & Go (Acheteur)", "Shop & Go (Buyer)")}</span>
              </button>
            </div>

            {/* Fields Grid */}
            <div className="bv-hero-fields-grid">
              <div className="bv-hero-field-group">
                <label className="bv-field-label">
                  <MapPin size={13} />
                  <span>{text("Départ", "From")}</span>
                </label>
                <CityAutocomplete
                  name="heroOrigin"
                  value={heroOrigin}
                  onChange={(val) => setHeroOrigin(val)}
                  placeholder={text("Ex. Paris, Marseille, Lyon...", "Ex. Paris, Marseille, Lyon...")}
                />
              </div>

              <button
                type="button"
                className="bv-hero-swap-btn"
                aria-label={text("Inverser le trajet", "Reverse route")}
                onClick={() => {
                  triggerHaptic(8);
                  setHeroOrigin(heroDestination);
                  setHeroDestination(heroOrigin);
                  setHeroRouteTurns((t) => t + 1);
                }}
              >
                <ArrowLeftRight
                  size={16}
                  style={{
                    transform: `rotate(${heroRouteTurns * 180}deg)`,
                    transition: "transform 360ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </button>

              <div className="bv-hero-field-group">
                <label className="bv-field-label">
                  <MapPin size={13} />
                  <span>{text("Destination", "To")}</span>
                </label>
                <CityAutocomplete
                  name="heroDestination"
                  value={heroDestination}
                  onChange={(val) => setHeroDestination(val)}
                  placeholder={text("Ex. Alger, Oran, Constantine...", "Ex. Algiers, Oran, Constantine...")}
                />
              </div>

              <div className="bv-hero-field-group">
                <label className="bv-field-label">
                  <Calendar size={13} />
                  <span>{heroMode === "voyageur" ? text("Départ", "Departure") : text("Date souhaitée", "Desired date")}</span>
                </label>
                <input
                  type="date"
                  className="bv-hero-date-input"
                  value={heroDate}
                  onChange={(e) => setHeroDate(e.target.value)}
                  aria-label={text("Date", "Date")}
                />
              </div>
            </div>

            {/* Mode Customizer Row */}
            <div className="bv-hero-mode-customizer">
              {heroMode === "voyageur" && (
                <div className="bv-customizer-row">
                  <div>
                    <span className="bv-customizer-label">{text("Mode de transport", "Transport mode")}</span>
                    <div className="bv-hero-pills-row">
                      {(
                        [
                          { id: "avion", label: text("Avion", "Flight"), Icon: Plane },
                          { id: "bateau", label: text("Bateau", "Ferry"), Icon: Ship },
                          { id: "voiture", label: text("Voiture", "Car"), Icon: Car },
                        ] as const
                      ).map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          type="button"
                          className={`bv-hero-pill ${heroTransportType === id ? "active" : ""}`}
                          onClick={() => {
                            triggerHaptic(8);
                            setHeroTransportType(id);
                          }}
                        >
                          <Icon size={14} />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="bv-customizer-label">{text("Capacité disponible (kg)", "Available capacity (kg)")}</span>
                    <div className="bv-hero-pills-row">
                      {[5, 10, 15, 23, 30].map((kg) => (
                        <button
                          key={kg}
                          type="button"
                          className={`bv-hero-pill ${heroCapacityKg === kg ? "active" : ""}`}
                          onClick={() => {
                            triggerHaptic(8);
                            setHeroCapacityKg(kg);
                          }}
                        >
                          <span>{kg} kg</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {heroMode === "bagandgo" && (
                <div className="bv-customizer-row">
                  <div>
                    <span className="bv-customizer-label">{text("Format du colis", "Parcel format")}</span>
                    <div className="bv-hero-pills-row">
                      {(
                        [
                          { id: "pli", label: text("Pli / Doc (1 kg)", "Envelope (1 kg)") },
                          { id: "petit", label: text("Petit colis (3 kg)", "Small (3 kg)") },
                          { id: "moyen", label: text("Valise / Moyen (5 kg)", "Medium (5 kg)") },
                          { id: "grand", label: text("Gros volume (15 kg)", "Large (15 kg)") },
                        ] as const
                      ).map(({ id, label }) => (
                        <button
                          key={id}
                          type="button"
                          className={`bv-hero-pill ${heroParcelPreset === id ? "active" : ""}`}
                          onClick={() => {
                            triggerHaptic(8);
                            setHeroParcelPreset(id);
                          }}
                        >
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="bv-customizer-label">{text("Délai souhaité", "Delivery timeframe")}</span>
                    <div className="bv-hero-pills-row">
                      {(
                        [
                          { id: "express", label: text("Express 24h–48h", "Express 24h–48h"), Icon: Clock },
                          { id: "standard", label: text("Standard 3–5j", "Standard 3–5d"), Icon: Calendar },
                        ] as const
                      ).map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          type="button"
                          className={`bv-hero-pill ${heroUrgency === id ? "active" : ""}`}
                          onClick={() => {
                            triggerHaptic(8);
                            setHeroUrgency(id);
                          }}
                        >
                          <Icon size={14} />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {heroMode === "shopandgo" && (
                <div className="bv-customizer-row">
                  <div>
                    <span className="bv-customizer-label">{text("Catégorie de produit", "Product category")}</span>
                    <div className="bv-hero-pills-row">
                      {[
                        text("High-Tech & Apple", "High-Tech & Apple"),
                        text("Parfumerie Duty-Free", "Duty-Free Perfume"),
                        text("Mode & Sneakers", "Fashion & Sneakers"),
                        text("Pharmacie & Soins", "Pharmacy & Care"),
                      ].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`bv-hero-pill ${heroStoreCategory === cat ? "active" : ""}`}
                          onClick={() => {
                            triggerHaptic(8);
                            setHeroStoreCategory(cat);
                          }}
                        >
                          <span>{cat}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bv-product-preview-input">
                    <span className="bv-customizer-label">{text("Article ou marque recherché", "Desired item or brand")}</span>
                    <input
                      type="text"
                      className="bv-hero-text-input"
                      value={heroProductName}
                      onChange={(e) => setHeroProductName(e.target.value)}
                      placeholder={text("Ex. iPhone 16 Pro, Parfums Dior, Dyson...", "Ex. iPhone 16 Pro, Dior perfumes, Dyson...")}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Live Ribbon */}
            <div className="bv-hero-live-ribbon">
              <div className="bv-ribbon-content">
                <div className="bv-ribbon-stat">
                  {heroMode === "voyageur" && (
                    <>
                      <span className="bv-ribbon-label">{text("Gain net estimé :", "Estimated net gain:")}</span>
                      <span className="bv-ribbon-value" style={{ color: "#059669" }}>
                        +{heroEarning} €
                      </span>
                      <span className="bv-ribbon-comparison">
                        · {text("Billet d’avion 100 % rentabilisé", "100% flight ticket covered")}
                      </span>
                    </>
                  )}
                  {heroMode === "bagandgo" && (
                    <>
                      <span className="bv-ribbon-label">{text("Tarif BagVoyage :", "BagVoyage rate:")}</span>
                      <span className="bv-ribbon-value" style={{ color: "#2563eb" }}>
                        {heroParcelPrice} €
                      </span>
                      <span className="bv-ribbon-comparison">
                        · {text(`-${heroSavingsPercent} % vs DHL / FedEx (${heroCompetitorPrice} €)`, `-${heroSavingsPercent}% vs DHL / FedEx (€${heroCompetitorPrice})`)}
                      </span>
                    </>
                  )}
                  {heroMode === "shopandgo" && (
                    <>
                      <span className="bv-ribbon-label">{text("Frais de douane :", "Customs fees:")}</span>
                      <span className="bv-ribbon-value" style={{ color: "#059669" }}>
                        0 €
                      </span>
                      <span className="bv-ribbon-comparison">
                        · {text("Facture d’achat d’origine remise en main propre", "Original purchase invoice provided with handover")}
                      </span>
                    </>
                  )}
                </div>

                <div className="bv-ribbon-badge">
                  <ShieldCheck size={14} />
                  <span>
                    {heroMode === "voyageur"
                      ? text("Paiement garanti par séquestre Stripe", "Payment guaranteed by Stripe escrow")
                      : heroMode === "bagandgo"
                        ? text("Double vérification QR & photo scellée", "Dual QR & tamper seal verified")
                        : text("Fonds bloqués jusqu’à réception conforme", "Funds held until compliant receipt")}
                  </span>
                </div>

                <div className="bv-hero-actions-cluster">
                  {heroMode === "voyageur" && (
                    <>
                      <a href="/#voyageur" className="bv-hero-action-cta">
                        <span>{text("Rentabiliser mon voyage", "Monetize my trip")}</span>
                        <ArrowRight size={16} />
                      </a>
                      <a href="/#publish/trips" className="bv-hero-secondary-cta">
                        <span>{text("Publier mon trajet", "Post a trip")}</span>
                      </a>
                    </>
                  )}
                  {heroMode === "bagandgo" && (
                    <>
                      <a href="/#bagandgo" className="bv-hero-action-cta">
                        <span>{text("Trouver un convoyeur", "Find a carrier")}</span>
                        <ArrowRight size={16} />
                      </a>
                      <a href="/#publish/parcel" className="bv-hero-secondary-cta">
                        <span>{text("Expédier un colis", "Ship a parcel")}</span>
                      </a>
                    </>
                  )}
                  {heroMode === "shopandgo" && (
                    <>
                      <a href="/#shopandgo" className="bv-hero-action-cta">
                        <span>{text("Commander avec un voyageur", "Order with a traveler")}</span>
                        <ArrowRight size={16} />
                      </a>
                      <a href="/#publish/requests" className="bv-hero-secondary-cta">
                        <span>{text("Créer une demande d'achat", "Post a shopping request")}</span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Bar 4 Pillars */}
          <div className="bv-hero-trust-bar">
            <div className="bv-trust-bar-item">
              <div className="bv-trust-icon-box" style={{ background: "#eff6ff", color: "#2563eb" }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong>{text("Séquestre Stripe Connect", "Stripe Connect Escrow")}</strong>
                <p>{text("Fonds sécurisés à 100 %. Déblocage uniquement après validation QR à l'arrivée.", "100% escrowed funds. Payout only released upon arrival QR scan.")}</p>
              </div>
            </div>

            <div className="bv-trust-bar-item">
              <div className="bv-trust-icon-box" style={{ background: "#ecfdf5", color: "#059669" }}>
                <ScanLine size={20} />
              </div>
              <div>
                <strong>{text("Double Remise QR & Photo", "Dual QR & Photo Check")}</strong>
                <p>{text("Photo du scellé OACI au départ et scan QR bilatéral inviolable à la remise.", "ICAO seal photo at departure and bilateral QR validation at handover.")}</p>
              </div>
            </div>

            <div className="bv-trust-bar-item">
              <div className="bv-trust-icon-box" style={{ background: "#f8fafc", color: "#0284c7" }}>
                <Plane size={20} />
              </div>
              <div>
                <strong>{text("Express Vol Direct 24h–48h", "Direct Flights 24h–48h")}</strong>
                <p>{text("Vos colis voyagent en cabine ou soute avec de vrais passagers quotidiens.", "Your parcels travel with verified passengers on daily direct flights.")}</p>
              </div>
            </div>

            <div className="bv-trust-bar-item">
              <div className="bv-trust-icon-box" style={{ background: "#fef3c7", color: "#d97706" }}>
                <Coins size={20} />
              </div>
              <div>
                <strong>{text("Jusqu'à -70 % d'économie", "Up to -70% Savings")}</strong>
                <p>{text("Sans surtaxes carburant ni douanes opaques. Gagnant pour le voyageur et l'expéditeur.", "No fuel surcharges or opaque customs. Win-win for travelers and shippers.")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="landing-activity"
        aria-label={text(
          "EN DIRECT SUR LE RÉSEAU BAGVOYAGE",
          "LIVE ON THE BAGVOYAGE NETWORK",
        )}
      >
        <div className="activity-heading">
          <div>
            <span className="live-dot" aria-hidden="true" />
            <strong>
              {text(
                "EN DIRECT SUR LE RÉSEAU BAGVOYAGE",
                "LIVE ON THE BAGVOYAGE NETWORK",
              )}
            </strong>
          </div>
          <div className="activity-arrows">
            <button
              type="button"
              aria-label={text("Activités précédentes", "Previous activity")}
              onClick={() =>
                activityRef.current?.scrollBy({
                  left: -400,
                  behavior: "smooth",
                })
              }
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label={text("Activités suivantes", "Next activity")}
              onClick={() =>
                activityRef.current?.scrollBy({ left: 400, behavior: "smooth" })
              }
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div
          className="activity-track"
          ref={activityRef}
          tabIndex={0}
          role="group"
          aria-label={text(
            "Exemples de remises, faites défiler",
            "Example handovers, scroll to explore",
          )}
        >
          {[
            {
              name: "Sofia M.",
              route: "AH1000 · CDG / ALG",
              initials: "SM",
              detail: text(
                "Colis 4 kg scellé remis à la porte K34",
                "Sealed 4 kg parcel handed over at gate K34",
              ),
              time: text("Il y a 14 min", "14 min ago"),
              Icon: Package,
            },
            {
              name: "Mehdi K.",
              route: "TO7240 · MRS / ORN",
              initials: "MK",
              detail: text(
                "Commande Shop & Go Sephora livrée sous séquestre",
                "Sephora Shop & Go order delivered with escrow",
              ),
              time: text("Il y a 32 min", "32 min ago"),
              Icon: ShoppingBag,
            },
            {
              name: "Yacine T.",
              route: "AH1461 · LYS / CZL",
              initials: "YT",
              detail: text(
                "Dossier médical d’urgence remis",
                "Urgent medical documents handed over",
              ),
              time: text("Il y a 1 h", "1 hour ago"),
              Icon: ReceiptText,
            },
            {
              name: "Nadia Transport",
              route: text(
                "Fret certifié · Lille / Alger",
                "Certified freight · Lille / Algiers",
              ),
              initials: "NT",
              detail: text(
                "Fret utilitaire certifié · 25 kg en transit",
                "Certified cargo transport · 25 kg in transit",
              ),
              time: text("En transit", "In transit"),
              Icon: Package,
            },
          ].map(({ name, route, initials, detail, time, Icon }) => (
            <article className="activity-event" key={name}>
              <span className="activity-avatar" aria-hidden="true">
                {initials}
              </span>
              <div>
                <div className="activity-person">
                  <strong>{name}</strong>
                  <span>{time}</span>
                </div>
                <span className="activity-route">
                  <Plane size={12} aria-hidden="true" />
                  {route}
                </span>
                <p>
                  <Icon size={14} aria-hidden="true" />
                  {detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        id="simulator"
        className="landing-simulator"
        role="region"
        aria-labelledby="simulator-title"
      >
        <div>
          <span className="eyebrow">
            01 / {text("FAITES LE CALCUL", "DO THE MATH")}
          </span>
          <h2 id="simulator-title">{c.simulate}</h2>
          <p>{c.estimated}</p>
          <div className="simulator-explainer" aria-hidden="true">
            <span>
              <Plane size={20} />
            </span>
            <i />
            <span>
              <Package size={20} />
            </span>
            <i />
            <span>
              <Check size={20} />
            </span>
          </div>
          <div className="simulator-caption">
            <ShieldCheck size={15} />
            {text(
              "Vos kilos disponibles ont de la valeur.",
              "Your spare luggage space has value.",
            )}
          </div>
        </div>
        <div className="simulator-controls">
          <div
            className="simulator-presets route-presets"
            role="group"
            aria-label={text("Lignes populaires", "Popular routes")}
          >
            {[
              ["Paris", "Alger"],
              ["Marseille", "Oran"],
              ["Lyon", "Constantine"],
              ["Montréal", "Alger"],
            ].map(([from, to]) => (
              <button
                type="button"
                key={from}
                aria-pressed={origin === from && destination === to}
                onClick={() => {
                  setOrigin(from);
                  setDestination(to);
                }}
              >
                {from}
                <ArrowLeftRight size={12} aria-hidden="true" />
                {to}
              </button>
            ))}
          </div>
          <div className="simulator-route">
            <div className="simulator-route-col">
              <span className="simulator-col-label">{c.from}</span>
              <CityAutocomplete
                name="origin"
                value={origin}
                onChange={(val) => setOrigin(val)}
                placeholder={text("Ex. Paris, Marseille, Alger...", "Ex. Paris, Marseille, Algiers...")}
              />
            </div>
            <button
              type="button"
              className="simulator-swap-btn"
              aria-label={text("Inverser le trajet", "Reverse route")}
              onClick={() => {
                triggerHaptic(8);
                setOrigin(destination);
                setDestination(origin);
                setRouteTurns((turns) => turns + 1);
              }}
            >
              <ArrowLeftRight
                size={19}
                style={{
                  transform: `rotate(${routeTurns * 180}deg)`,
                  transition: "transform 360ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            </button>
            <div className="simulator-route-col">
              <span className="simulator-col-label">{c.to}</span>
              <CityAutocomplete
                name="destination"
                value={destination}
                onChange={(val) => setDestination(val)}
                placeholder={text("Ex. Alger, Oran, Montréal...", "Ex. Algiers, Oran, Montreal...")}
              />
            </div>
          </div>
          <fieldset>
            <legend>{c.need}</legend>
            <div className="simulator-segment">
              <button
                aria-pressed={need === "parcel"}
                onClick={() => {
                  triggerHaptic(6);
                  setNeed("parcel");
                }}
              >
                <Package size={17} />
                {c.parcel}
              </button>
              <button
                aria-pressed={need === "shop"}
                onClick={() => {
                  triggerHaptic(6);
                  setNeed("shop");
                }}
              >
                <ShoppingBag size={17} />
                {c.shop}
              </button>
            </div>
          </fieldset>
          <label className="simulator-weight">
            {c.weight}
            <strong>{weight} kg</strong>
            <input
              style={{
                background: `linear-gradient(to right, #2563eb ${((weight - 1) / 29) * 100}%, #e2e8f0 ${((weight - 1) / 29) * 100}%)`,
              }}
              type="range"
              min="1"
              max="30"
              value={weight}
              onChange={(event) => setWeight(Number(event.target.value))}
            />
          </label>
          <div
            className="simulator-presets weight-presets"
            role="group"
            aria-label={text("Gabarits de bagages", "Luggage presets")}
          >
            {[
              { label: text("Documents", "Documents"), kg: 1 },
              { label: text("Cadeaux", "Gifts"), kg: 5 },
              { label: text("Valise", "Suitcase"), kg: 15 },
              { label: text("Max Soute", "Checked max"), kg: 23 },
            ].map(({ label, kg }) => (
              <button
                type="button"
                key={kg}
                aria-pressed={weight === kg}
                onClick={() => setWeight(kg)}
              >
                {label} <span>({kg} kg)</span>
              </button>
            ))}
          </div>
          {origin === destination && (
            <p role="alert">
              {text(
                "Choisissez deux villes différentes.",
                "Choose two different cities.",
              )}
            </p>
          )}
          <div className="simulator-results" aria-live="polite">
            <div>
              <span>{c.cost}</span>
              <output>{gross.toLocaleString(language)} €</output>
            </div>
            <div>
              <span>{c.gain}</span>
              <output>{net.toLocaleString(language)} €</output>
            </div>
          </div>
          <small>
            {text(
              "Frais plateforme : 15 % du service brut. Shop & Go : achats en supplément.",
              "Platform fee: 15% of gross service. Shop & Go purchases are additional.",
            )}
          </small>
        </div>
        <div className="landing-comparison">
          <div>
            <span className="eyebrow">
              {text(
                "VOTRE BUDGET, EN PERSPECTIVE",
                "PUT YOUR BUDGET IN PERSPECTIVE",
              )}
            </span>
            <h2>{c.compare}</h2>
            <p>{c.compareText}</p>
            <div className="savings-number" aria-live="polite">
              <strong>{percent}%</strong>
              <span>{c.saving}</span>
            </div>
          </div>
          <div className="comparison-panel">
            <div>
              <span className="comparison-label block text-xs font-semibold mb-2">
                {c.competitor}
              </span>
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  "DHL",
                  "FedEx",
                  text("Fret aérien classique", "Air freight"),
                ].map((name) => {
                  const isSelected = competitor === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setCompetitor(name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
            <label>
              {c.quote}
              <input
                type="number"
                min="0"
                max="100000"
                step="0.01"
                value={quote || ""}
                onChange={(event) => {
                  setHasCustomQuote(true);
                  setCustomQuote(Math.max(0, Number(event.target.value)));
                }}
              />
            </label>
            <div className="comparison-row">
              <span>
                BagVoyage<strong>{gross} €</strong>
              </span>
              <div>
                <i
                  style={{
                    width: `${Math.min(100, (gross / Math.max(1, quote, gross)) * 100)}%`,
                  }}
                />
              </div>
              <small>
                {text(
                  "24–48 h envisageables selon le trajet",
                  "24–48 h possible depending on route",
                )}
              </small>
            </div>
            <div className="comparison-row competitor">
              <span>
                {competitor}
                <strong>{quote} €</strong>
              </span>
              <div>
                <i
                  style={{
                    width: `${Math.min(100, (quote / Math.max(1, quote, gross)) * 100)}%`,
                  }}
                />
              </div>
              <small>
                {text(
                  "Délai et services selon votre devis",
                  "Timing and services as quoted",
                )}
              </small>
            </div>
            <p>{c.source}</p>
          </div>
        </div>
      </section>
      <section
        ref={metricsRef}
        className="landing-metrics"
        aria-label={text("Indicateurs de présentation", "Presentation metrics")}
      >
        <div className="landing-metrics-header">
          <p>{c.demo}</p>
          <div className="metrics-live-status">
            <span
              className={`live-pulse-dot ${hasNewTick ? "pulsing" : ""}`}
              aria-hidden="true"
            />
            <span>
              {text(
                "Activité réseau en direct · Flux sécurisé",
                "Live network activity · Secured flow",
              )}
            </span>
          </div>
        </div>
        <div>
          <article>
            <AnimatedMetricNumber
              target={180000}
              prefix="+"
              suffix=" €"
              liveIncrement={liveMetricsOffset.volume}
              isVisible={metricsVisible}
            />
            <span>{c.metricLabels[0]}</span>
          </article>
          <article>
            <AnimatedMetricNumber
              target={14250}
              suffix=" kg"
              liveIncrement={liveMetricsOffset.weight}
              isVisible={metricsVisible}
            />
            <span>{c.metricLabels[1]}</span>
          </article>
          <article>
            <AnimatedMetricNumber
              target={36}
              suffix=" h"
              isVisible={metricsVisible}
            />
            <span>{c.metricLabels[2]}</span>
          </article>
          <article>
            <AnimatedMetricNumber
              target={99.8}
              suffix=" %"
              decimals={1}
              isVisible={metricsVisible}
            />
            <span>{c.metricLabels[3]}</span>
          </article>
        </div>
      </section>
      <section id="features" className="landing-universes">
        <div className="landing-section-heading">
          <span className="eyebrow">
            02 / {text("À CHACUN SON VOYAGE", "EVERY JOURNEY IS DIFFERENT")}
          </span>
          <h2>{c.universes}</h2>
        </div>
        <div className="universe-grid">
          {[
            {
              Icon: Package,
              number: "01",
              title: text(
                "Bag & Go : Envoyer un peu de chez soi.",
                "Bag & Go: Send a little piece of home.",
              ),
              copy: text(
                "Photographiez, décrivez, confiez. Votre colis prend le chemin d’un voyageur déjà prévu avec remise en main propre sécurisée.",
                "Photograph, describe, hand over. Your parcel joins a verified traveler's journey with secure handover.",
              ),
              action: text("Expédier un colis", "Ship a parcel"),
              kind: "parcel",
              platformRoute: "bagandgo",
            },
            {
              Icon: Plane,
              number: "02",
              title: text(
                "Voyageur : L'axe central du lien.",
                "Traveler: The central hub connecting both worlds.",
              ),
              copy: text(
                "Vos kilos disponibles financent votre voyage. Particulier ou convoyeur régulier, rentabilisez jusqu'à 100% de vos billets.",
                "Your available luggage space funds your travel. Monetize up to 100% of your tickets safely.",
              ),
              action: text("Rentabiliser mon voyage", "Monetize my journey"),
              kind: "trips",
              platformRoute: "voyageur",
            },
            {
              Icon: ShoppingBag,
              number: "03",
              title: text(
                "Shop & Go : Acheter partout sans frontières.",
                "Shop & Go: Buy anywhere across borders.",
              ),
              copy: text(
                "Un lien, une référence, une envie. Un voyageur achète pour vous en magasin officiel ou Duty-Free et vous le rapporte.",
                "A link, a reference, a desire. A traveler buys for you in official or Duty-Free stores and brings it to you.",
              ),
              action: text("Commander un article", "Order an item"),
              kind: "requests",
              platformRoute: "shopandgo",
            },
          ].map(({ Icon, number, title, copy: description, action, kind, platformRoute }) => (
            <article key={number} className={`universe universe-${number}`}>
              <header>
                <span>
                  {number} ·{" "}
                  {kind === "parcel"
                    ? text("EXPÉDITION EXPRESS", "EXPRESS DELIVERY")
                    : kind === "requests"
                      ? "PERSONAL SHOPPING"
                      : text("VOYAGEURS DIASPORA", "DIASPORA TRAVELLERS")}
                </span>
                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              </header>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className={`universe-specimen specimen-${kind}`}>
                {kind === "parcel" ? (
                  <div className="parcel-label">
                    <div className="parcel-specimen-header">
                      <div className="parcel-specimen-brand">
                        <Package size={18} />
                        <span>{text("EXPÉDITION EXPRESS OACI", "ICAO EXPRESS DELIVERY")}</span>
                      </div>
                      <span className="parcel-steb-pill">
                        <ShieldCheck size={13} />
                        STEB-SEAL
                      </span>
                    </div>

                    <div className="parcel-specimen-route">
                      <div className="parcel-airport">
                        <strong>CDG</strong>
                        <small>Paris Charles-de-Gaulle</small>
                      </div>
                      <div className="parcel-flight-arrow">
                        <Plane size={16} />
                        <span>Vol 2h20</span>
                      </div>
                      <div className="parcel-airport">
                        <strong>ALG</strong>
                        <small>Alger Houari-Boumédiène</small>
                      </div>
                    </div>

                    <div className="parcel-specimen-meta">
                      <div>
                        <span>{text("Référence", "Reference")}</span>
                        <strong>#DZ-8491-EX</strong>
                      </div>
                      <div>
                        <span>{text("Poids déclaré", "Weight")}</span>
                        <strong>4.0 kg</strong>
                      </div>
                      <div>
                        <span>{text("Délai garanti", "Delivery")}</span>
                        <strong>24h–48h</strong>
                      </div>
                    </div>

                    <div className="parcel-specimen-barcode">
                      <PassBarcode />
                      <span>*BV-DZ8491-STEB-2026*</span>
                    </div>

                    <div className="parcel-specimen-footer">
                      <div className="parcel-verified-badge">
                        <CheckCircle2 size={14} />
                        <span>{text("Scellé inviolable & Séquestre Stripe actif", "Tamper-proof seal & Stripe escrow active")}</span>
                      </div>
                    </div>
                  </div>
                ) : kind === "requests" ? (
                  <div className="shopping-receipt">
                    <div className="brand-chips">
                      {["Apple Store", "Sephora", "Duty-Free CDG", "Pharmacie"].map(
                        (brand) => (
                          <span key={brand}>{brand}</span>
                        ),
                      )}
                    </div>

                    <div className="shop-specimen-body">
                      <div className="shop-specimen-header">
                        <div className="shop-specimen-badge">
                          <ShoppingBag size={16} />
                          <span>{text("COMMANDE CERTIFIÉE EN BOUTIQUE", "CERTIFIED STORE ORDER")}</span>
                        </div>
                        <span className="shop-vat-tag">{text("TVA Déductible", "Tax-Free VAT")}</span>
                      </div>

                      <div className="shop-specimen-item">
                        <strong>Apple AirPods Pro 2 · MagSafe USB-C</strong>
                        <p>{text("Acheté en magasin officiel Champs-Élysées", "Purchased at official Champs-Élysées store")}</p>
                      </div>

                      <div className="shop-specimen-receipt-row">
                        <Receipt size={14} />
                        <span>{text("Ticket de caisse & Facture nominative joints", "Original receipt & itemized invoice included")}</span>
                      </div>

                      <div className="shop-specimen-guarantee">
                        <LockKeyhole size={14} />
                        <div>
                          <strong>{text("Séquestre 100 % sécurisé", "100% Escrow Protection")}</strong>
                          <small>{text("0 € d'avance demandée au voyageur · Déblocage à réception conforme", "No cash advance required from traveler · Payout upon compliant delivery")}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="traveller-receipt">
                    <div className="travel-boarding-header">
                      <div className="travel-airline-tag">
                        <Plane size={16} />
                        <strong>AIR ALGÉRIE · AH1000</strong>
                      </div>
                      <span className="travel-class-badge">CABIN + SOUTE</span>
                    </div>

                    <div className="travel-passenger-row">
                      <div>
                        <span>{text("Voyageur vérifié", "Verified Traveler")}</span>
                        <strong>Karim B.</strong>
                      </div>
                      <div className="travel-pnr">
                        <span>PNR</span>
                        <strong>BV-782K</strong>
                      </div>
                    </div>

                    <div className="travel-route-display">
                      <div className="travel-leg">
                        <strong>CDG</strong>
                        <span>09:40 Paris</span>
                      </div>
                      <div className="travel-leg-duration">
                        <span>2h 20m</span>
                        <div className="travel-leg-line" />
                      </div>
                      <div className="travel-leg">
                        <strong>ALG</strong>
                        <span>12:05 Alger</span>
                      </div>
                    </div>

                    <div className="travel-luggage-gauge">
                      <div className="gauge-header">
                        <span>{text("Capacité partagée", "Shared Capacity")}</span>
                        <strong>15 kg / 23 kg (65 %)</strong>
                      </div>
                      <div className="gauge-bar">
                        <div className="gauge-fill" style={{ width: "65%" }} />
                      </div>
                    </div>

                    <div className="travel-reward-row">
                      <div>
                        <span>{text("Gain net garanti", "Guaranteed Net Earning")}</span>
                        <strong className="travel-reward-val">+160 €</strong>
                      </div>
                      <div className="travel-escrow-badge">
                        <ShieldCheck size={14} />
                        <span>{text("Payé sous 24h", "Paid in 24h")}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="universe-actions-dual" style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
                <a href={`/#${platformRoute}`} className="universe-explore-link" style={{ flex: "1 1 120px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  {text("Explorer", "Explore")} {number === "01" ? "Bag&Go" : number === "02" ? "Voyageur" : "Shop&Go"}
                  <ArrowRight size={16} />
                </a>
                <a href={`/#publish/${kind}`} className="universe-publish-link" style={{ flex: "1 1 130px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  {action}
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="landing-assurance">
        <span className="eyebrow">
          04 / {text("LE VOYAGE COMMENCE PAR LA CONFIANCE", "START WITH TRUST")}
        </span>
        <h2>{c.trust}</h2>
        <div className="assurance-pillars">
          {[
            [
              ShieldCheck,
              "Stripe Connect",
              text(
                "Séquestre sécurisé via Stripe Connect. Fonds bloqués à la réservation et débloqués après confirmation de remise.",
                "Secure escrow through Stripe Connect. Funds held at booking and released after handover confirmation.",
              ),
            ],
            [
              ScanLine,
              text("Double QR code", "Two QR codes"),
              text(
                "Un contrôle à la collecte, un autre à la livraison. Le PIN reste une alternative accessible.",
                "A check at collection and another at delivery. PIN entry remains an accessible alternative.",
              ),
            ],
            [
              Video,
              text("Preuve vidéo 15 s", "15-second video evidence"),
              text(
                "L’état du colis documenté en 15 secondes. Une preuve horodatée accompagne chaque remise.",
                "Parcel condition documented in 15 seconds. Timestamped evidence accompanies each handover.",
              ),
            ],
            [
              Globe2,
              text("Repères douaniers", "Customs guidance"),
              text(
                "Repères OACI, contenu déclaré et franchises à vérifier. Préparez vos justificatifs avant chaque départ.",
                "ICAO guidance, declared contents and allowances to check. Prepare your documents before departure.",
              ),
            ],
          ].map(([Icon, title, description]) => {
            const Symbol = Icon as typeof ShieldCheck;
            return (
              <article key={String(title)}>
                <Symbol size={25} strokeWidth={1.5} />
                <h3>{String(title)}</h3>
                <p>{String(description)}</p>
              </article>
            );
          })}
        </div>
        <div className="trust-comparison">
          <div className="trust-comparison-intro">
            <LockKeyhole size={24} />
            <h3>
              {text(
                "Pourquoi BagVoyage remplace les groupes informels",
                "Why BagVoyage replaces informal groups",
              )}
            </h3>
            <p>
              {text(
                "Le lien humain mérite un cadre de confiance.",
                "Human connection deserves a trusted framework.",
              )}
            </p>
          </div>
          <div className="trust-informal">
            <span>{text("Groupes Facebook", "Facebook groups")}</span>
            {[
              text("Risque d’arnaque", "Risk of scams"),
              text("Zéro garantie", "No guarantees"),
              text("Espèces non protégées", "Unprotected cash"),
              text("Aucune traçabilité", "No traceability"),
            ].map((item) => (
              <p key={item}>
                <CircleMinus size={16} />
                {item}
              </p>
            ))}
          </div>
          <div className="trust-bagvoyage">
            <span>
              BagVoyage
              <small>{text("Protocole de sécurité", "Security protocol")}</small>
            </span>
            {[
              text(
                "Séquestre bancaire 100 % garanti",
                "100% guaranteed bank escrow",
              ),
              text("Pièce d’identité vérifiée", "Verified identity"),
              text(
                "Scellé inviolable numéroté",
                "Numbered tamper-evident seal",
              ),
              text("Assistance dédiée", "Dedicated support"),
            ].map((item) => (
              <p key={item}>
                <CircleCheck size={16} />
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>
      <section
        id="mobile"
        className="landing-mobile"
        aria-labelledby="mobile-title"
      >
        <div className="landing-mobile-intro">
          <span className="eyebrow">
            05 /{" "}
            {text(
              "LE VOYAGE, DANS VOTRE POCHE",
              "YOUR JOURNEY, IN YOUR POCKET",
            )}
          </span>
          <h2 id="mobile-title">
            {text("Application Mobile Native", "Native Mobile App")}
            <em>
              {text(
                "Prête pour vos prochains départs.",
                "Made for your next departure.",
              )}
            </em>
          </h2>
          <p>
            {text(
              "BagVoyage sur iPhone & Android. Votre billet, vos colis et vos échanges au même endroit, du départ à la remise.",
              "BagVoyage on iPhone & Android. Your boarding pass, parcels and conversations together, from departure to handover.",
            )}
          </p>
          <div className="landing-mobile-status">
            <span aria-hidden="true" />
            {text(
              "Bientôt sur l’App Store et Google Play",
              "Coming soon to the App Store and Google Play",
            )}
          </div>
          <AppStoreBadges language={language} onClick={openMobileLaunch} />
          <a className="landing-mobile-details" href="#download">
            {text(
              "Découvrir le lancement mobile",
              "Discover the mobile launch",
            )}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div
          className="mobile-device-stage"
          role="img"
          aria-label={text(
            "Aperçu de l’application mobile BagVoyage et de son pass hors-ligne",
            "Preview of the BagVoyage mobile app and its offline pass",
          )}
        >
          <div className="mobile-device">
            <div className="device-status">
              <span>9:41</span>
              <i />
              <Signal size={14} />
              <BatteryFull size={18} />
            </div>
            <div className="device-app-header">
              <strong>
                BagVoyage<span>.</span>
              </strong>
              <Bell size={18} />
            </div>
            <p className="device-greeting">
              {text("Bon voyage, Sarah.", "Have a great trip, Sarah.")}
            </p>
            <div className="device-flight">
              <span>
                <Plane size={15} />
                {text("VOTRE PROCHAIN VOL", "YOUR NEXT FLIGHT")}
              </span>
              <div>
                <strong>CDG</strong>
                <ArrowRight size={22} />
                <strong>ALG</strong>
              </div>
              <p>
                Paris <span>Alger</span>
              </p>
              <footer>
                <span>AH1000 · 14:30</span>
                <span>{text("Aujourd’hui", "Today")}</span>
              </footer>
            </div>
            <div className="device-cargo">
              <span>
                <Package size={18} />
                {text("Votre colis est prêt", "Your parcel is ready")}
              </span>
              <strong>
                STEB-447B <Check size={15} />
              </strong>
              <p>
                {text(
                  "5 kg · Remise à la porte K34",
                  "5 kg · Handover at gate K34",
                )}
              </p>
            </div>
            <div className="device-wallet">
              <span>
                <Ticket size={16} />
                {text("Passe de fret", "Cargo pass")}
              </span>
              <PassBarcode />
              <small>
                <WifiOff size={12} />
                {text("Disponible hors-ligne", "Available offline")}
              </small>
            </div>
            <div className="device-nav">
              <Plane size={18} />
              <Package size={18} />
              <ScanLine size={22} />
              <Bell size={18} />
            </div>
            <div className="device-home" />
          </div>
          <div className="device-notification">
            <span>
              <Check size={18} />
            </span>
            <div>
              <strong>{text("Remise enregistrée", "Handover recorded")}</strong>
              <small>
                {text(
                  "Même sans réseau. Vous pouvez décoller.",
                  "Even offline. You’re ready for takeoff.",
                )}
              </small>
            </div>
          </div>
          <span className="device-preview-label">
            {text("APERÇU DE L’EXPÉRIENCE NATIVE", "NATIVE EXPERIENCE PREVIEW")}
          </span>
        </div>
        <div className="landing-mobile-features">
          <div className="landing-mobile-feature-heading">
            <Smartphone size={22} aria-hidden="true" />
            <span>
              {text("PENSÉE POUR LE TERRAIN", "BUILT FOR THE JOURNEY")}
            </span>
            <span>iOS / Android</span>
          </div>
          {[
            {
              Icon: ScanLine,
              title: text(
                "Scanner IATA BCBP par caméra",
                "IATA BCBP camera scanner",
              ),
              description: text(
                "Scannez votre carte d’embarquement pour retrouver les informations de votre vol.",
                "Scan your boarding pass to retrieve your flight information.",
              ),
            },
            {
              Icon: Ticket,
              title: text(
                "Passe de fret Apple Wallet",
                "Apple Wallet cargo pass",
              ),
              description: text(
                "Gardez les références de votre colis à portée de main, avec vos titres de voyage.",
                "Keep parcel references close at hand, alongside your travel passes.",
              ),
            },
            {
              Icon: WifiOff,
              title: text(
                "Remise hors-ligne en zone blanche",
                "Offline handover without coverage",
              ),
              description: text(
                "Enregistrez la remise sans réseau. La synchronisation reprend au retour de la connexion.",
                "Record handovers without a network. Sync resumes when you reconnect.",
              ),
            },
            {
              Icon: Bell,
              title: text("Push notifications", "Push notifications"),
              description: text(
                "Un nouveau message, un départ ou une remise : restez informé au bon moment.",
                "New messages, departures and handovers: stay informed at the right moment.",
              ),
            },
          ].map(({ Icon, title, description }) => (
            <article key={title}>
              <div>
                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
          <p className="landing-mobile-roadmap">
            {text(
              "Fonctionnalités prévues pour l’application native, disponibles progressivement au lancement.",
              "Planned native app features, rolling out progressively at launch.",
            )}
          </p>
        </div>
        <div className="landing-mobile-signup">
          <div>
            <span className="eyebrow">
              {text("ACCÈS PRIORITAIRE", "PRIORITY ACCESS")}
            </span>
            <h3>
              {text(
                "Votre prochaine escale commence ici.",
                "Your next stop starts here.",
              )}
            </h3>
            <p>
              {text(
                "Rejoignez la liste de lancement. En attendant, la version web est déjà accessible.",
                "Join the launch list. In the meantime, the web app is already available.",
              )}
            </p>
          </div>
          <MobileWaitlistForm language={language} />
        </div>
      </section>
      <section id="faq" className="landing-faq">
        <div>
          <span className="eyebrow">
            06 / {text("LES RÉPONSES", "YOUR QUESTIONS")}
          </span>
          <h2>{c.faq}</h2>
        </div>
        <div>
          {faqs[language].map(([question, answer], index) => (
            <details key={question}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {question}
                <ArrowRight size={18} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <footer className="landing-footer">
        <span className="eyebrow">BAGVOYAGE / TOGETHER, FURTHER.</span>
        <h2>
          {c.end.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </h2>
        <a className="landing-cta" href="/#explore">
          {c.cta}
          <ArrowUpRight size={20} />
        </a>
        <nav
          className="landing-footer-links"
          aria-label={text("Liens de pied de page", "Footer links")}
        >
          <a href="/#how-it-works">{text("Comment ça marche", "How it works")}</a>
          <a href="/#pricing">{text("Tarifs & Comparateur", "Pricing & Comparison")}</a>
          <a href="/#trust">{text("Sécurité & Séquestre", "Security & Escrow")}</a>
          <a href="/#faq">{text("Centre d'Aide FAQ", "Help Center FAQ")}</a>
          <a href="#simulator">{text("Simulateur", "Simulator")}</a>
          <a href="#mobile">{text("Application Mobile", "Mobile App")}</a>
          <a
            href="#faq"
            onClick={(event) => {
              event.preventDefault();
              document
                .getElementById("faq")
                ?.scrollIntoView({ block: "start" });
            }}
          >
            FAQ
          </a>
        </nav>
        <div className="landing-footer-theme">
          <ThemeToggle showLabel />
        </div>
        <div className="landing-footer-trust-badges">
          <div className="landing-trust-badge-item">
            <ShieldCheck size={16} />
            <span>{text("Séquestre Stripe Connect", "Stripe Connect Escrow")}</span>
          </div>
          <div className="landing-trust-badge-item">
            <CheckCircle2 size={16} />
            <span>{text("Norme OACI Scellé STEB", "ICAO Standard STEB Seal")}</span>
          </div>
          <div className="landing-trust-badge-item">
            <LockKeyhole size={16} />
            <span>{text("Chiffrement TLS 256-bit", "256-bit TLS Encryption")}</span>
          </div>
          <div className="landing-trust-badge-item">
            <Globe2 size={16} />
            <span>{text("Conformité RGPD / CNIL", "GDPR / CNIL Compliant")}</span>
          </div>
        </div>

        <details className="landing-legal">
          <summary>
            {text("Mentions & données personnelles", "Legal & personal data")}
          </summary>
          <p>
            {text(
              "BagVoyage SAS · Plateforme de logistique collaborative et co-valisage France–Algérie & International.",
              "BagVoyage SAS · Collaborative logistics and luggage-sharing platform connecting France, Algeria & international destinations.",
            )}
          </p>
        </details>
        <div>
          <strong>BagVoyage</strong>
          <span>FRANCE / ALGÉRIE / INTERNATIONAL</span>
          <span>Copyright {new Date().getFullYear()} BagVoyage</span>
          {showAdmin && (
            <button
              type="button"
              onClick={() => {
                window.location.hash = "admin";
              }}
            >
              Super Admin
            </button>
          )}
        </div>
      </footer>
      {mobileLaunchOpen && (
        <MobileAppLaunchModal
          language={language}
          onClose={() => {
            window.location.hash = section || "landing";
          }}
        />
      )}
    </div>
  );
}
