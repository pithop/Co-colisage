import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  CircleCheck,
  CircleMinus,
  Coins,
  Globe2,
  LockKeyhole,
  MapPin,
  Menu,
  Package,
  Plane,
  Receipt,
  ScanLine,
  ShieldCheck,
  Ship,
  ShoppingBag,
  Smartphone,
  Ticket,
  Video,
  WifiOff,
} from "lucide-react";
import { AppStoreBadges } from "./AppStoreBadges";
import {
  MobileAppLaunchModal,
  MobileWaitlistForm,
} from "./MobileAppLaunchModal";
import { ThemeToggle } from "../common/ThemeToggle";
import { CityAutocomplete } from "../common/CityAutocomplete";
import { LandingMobileMenu } from "../Navigation/LandingMobileMenu";
import { BagVoyageLiveShowcase } from "./BagVoyageLiveShowcase";

const copy = {
  fr: {
    cta: "Lancer l’application",
    compare: "Moins de frais. Plus de proximité.",
    compareText:
      "Faites le calcul avec votre propre devis. Le bon choix commence par des chiffres clairs.",
    quote: "Votre devis concurrent (€)",
    competitor: "Service comparé",
    saving: "Économie estimée",
    universes: "Trois façons de faire le lien.",
    trust: "La confiance se construit, à chaque étape.",
    faq: "Questions fréquentes.",
    end: "Votre prochaine destination\na déjà quelqu’un qui vous attend.",
  },
  en: {
    cta: "Open the app",
    compare: "Lower costs. Closer connections.",
    compareText:
      "Compare with your own quote. Clear numbers make better decisions.",
    quote: "Your competing quote (€)",
    competitor: "Compare a service",
    saving: "Estimated savings",
    universes: "Three ways to connect.",
    trust: "Trust, built at every step.",
    faq: "Frequently asked questions.",
    end: "Someone is waiting\nat your next destination.",
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
      className="w-full h-10 text-slate-900"
      viewBox="0 0 240 48"
      fill="currentColor"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path d={barcodePath} />
    </svg>
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

  // Comparateur & Corridors
  const [origin, setOrigin] = useState("Paris");
  const [destination, setDestination] = useState("Alger");
  const [need, setNeed] = useState<"parcel" | "shop">("parcel");
  const [weight, setWeight] = useState(5);
  const [competitor, setCompetitor] = useState("DHL");
  const [customQuote, setCustomQuote] = useState<number | null>(null);
  const [hasCustomQuote, setHasCustomQuote] = useState(false);

  // Tri-Modal Hero Console State
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

  const heroEarning = heroCapacityKg * 8 + (heroCapacityKg >= 15 ? 40 : 20);
  const heroParcelWeight =
    heroParcelPreset === "pli"
      ? 1
      : heroParcelPreset === "petit"
        ? 3
        : heroParcelPreset === "moyen"
          ? 5
          : 15;
  const heroParcelPrice = heroParcelWeight * 8 + 5;
  const heroCompetitorPrice = Math.round(40 + heroParcelWeight * 20);
  const heroSavingsPercent = Math.max(
    0,
    Math.round(((heroCompetitorPrice - heroParcelPrice) / heroCompetitorPrice) * 100),
  );

  const triggerHaptic = (ms = 8) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Safe fallback
      }
    }
  };

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

  const gross = origin === destination ? 0 : weight * routeRate + (need === "shop" ? 20 : 0);
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
    if (section) document.getElementById(section)?.scrollIntoView({ block: "start" });
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

  const corridors = [
    {
      badge: text("CORRIDOR POPULAIRE", "POPULAR CORRIDOR"),
      from: "Paris",
      to: "Alger",
      code: "CDG → ALG",
      price: "8 € / kg",
      delay: "24h – 48h",
      carrier: text("Vol direct quotidien", "Daily direct flight"),
    },
    {
      badge: text("EXPRESS MÉDITERRANÉE", "MEDITERRANEAN EXPRESS"),
      from: "Marseille",
      to: "Oran",
      code: "MRS → ORN",
      price: "7 € / kg",
      delay: "24h",
      carrier: text("Vol & Ferry", "Flight & Ferry"),
    },
    {
      badge: text("FORTE DEMANDE", "HIGH DEMAND"),
      from: "Lyon",
      to: "Constantine",
      code: "LYS → CZL",
      price: "8 € / kg",
      delay: "24h – 48h",
      carrier: text("Vol direct", "Direct flight"),
    },
    {
      badge: text("TRANSATLANTIQUE", "TRANSATLANTIC"),
      from: "Paris",
      to: "Montréal",
      code: "CDG → YUL",
      price: "12 € / kg",
      delay: "24h – 48h",
      carrier: text("Long-courrier", "Long-haul"),
    },
  ];

  return (
    <div className="bv-landing-v2 min-h-screen bg-[#F8FAFC] text-slate-900 antialiased" lang={language}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Sticky Header — 5 liens max + CTA principal */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a
            href="/#landing"
            className="text-xl font-extrabold tracking-tight text-slate-900 shrink-0 no-underline"
          >
            BagVoyage<span className="text-[#2563EB]">.</span>
          </a>

          <nav
            className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600"
            aria-label={text("Présentation de BagVoyage", "About BagVoyage")}
          >
            <a href="/#voyageur" className="hover:text-slate-900 transition-colors no-underline">
              {text("Voyageur", "Traveler")}
            </a>
            <a href="/#bagandgo" className="hover:text-slate-900 transition-colors no-underline">
              Bag &amp; Go
            </a>
            <a href="/#shopandgo" className="hover:text-slate-900 transition-colors no-underline">
              Shop &amp; Go
            </a>
            <a href="#simulator" className="hover:text-slate-900 transition-colors no-underline">
              {text("Tarifs", "Pricing")}
            </a>
            <a href="/#trust" className="hover:text-slate-900 transition-colors no-underline">
              {text("Sécurité", "Security")}
            </a>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <ThemeToggle />
            <div
              className="hidden sm:inline-flex p-0.5 rounded-xl bg-slate-100 border border-[#E2E8F0]"
              role="group"
              aria-label="Langue / Language"
            >
              <button
                type="button"
                onClick={() => setLanguage("fr")}
                aria-pressed={language === "fr"}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  language === "fr"
                    ? "bg-[#FFFFFF] text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  language === "en"
                    ? "bg-[#FFFFFF] text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                EN
              </button>
            </div>

            <a
              href="/#explore"
              aria-label={c.cta}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-colors no-underline whitespace-nowrap"
            >
              <span>{text("Lancer l’app", "Open app")}</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-slate-700"
              aria-label={
                mobileMenuOpen
                  ? text("Fermer le menu", "Close menu")
                  : text("Ouvrir le menu de navigation", "Open navigation menu")
              }
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <LandingMobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        currentRoute="landing"
      />

      {/* Hero + Simulateur Tri-Modal + Animation Interactive Autonome */}
      <section className="pt-8 pb-14 sm:pt-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Outcome Headline + Interactive Mode Simulator */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-center lg:text-left space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] text-xs font-bold text-slate-700 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#059669]" />
                  <span>
                    {text(
                      "Plateforme Officielle · Co-colisage & Shopping France–Algérie",
                      "Official Platform · Crowdsourced Shipping & Shopping France–Algeria",
                    )}
                  </span>
                </div>

                <h1 className="bv-hero-headline text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
                  {text("Rentabilisez vos voyages.", "Fund your travels.")}
                  <br />
                  <span className="text-[#2563EB]">
                    {text("Expédiez vos colis. Achetez partout.", "Ship parcels. Shop anywhere.")}
                  </span>
                </h1>

                <p className="bv-hero-lead text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {text(
                    "Mettez en relation voyageurs vérifiés et expéditeurs en temps réel. Remise en main propre express, 100 % sécurisée par séquestre Stripe Connect.",
                    "Connect verified travelers and shippers in real time. Express hand-to-hand delivery, 100% secured by Stripe Connect escrow.",
                  )}
                </p>
              </div>

              {/* Simulateur Hero intégré dans une carte #FFFFFF propre */}
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-lg shadow-slate-900/5 overflow-hidden">
            {/* 3 onglets avec icônes proprement intégrées à l'intérieur */}
            <div
              className="bv-hero-mode-tabs grid grid-cols-3 border-b border-[#E2E8F0] bg-[#F8FAFC]"
              role="tablist"
            >
              <button
                type="button"
                role="tab"
                aria-selected={heroMode === "voyageur"}
                onClick={() => {
                  triggerHaptic(8);
                  setHeroMode("voyageur");
                }}
                className={`p-3 sm:p-5 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer text-center ${
                  heroMode === "voyageur"
                    ? "bg-[#FFFFFF] text-slate-900 border-[#2563EB]"
                    : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <span
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    heroMode === "voyageur"
                      ? "bg-blue-50 text-[#2563EB]"
                      : "bg-slate-200/70 text-slate-600"
                  }`}
                  aria-hidden="true"
                >
                  <Plane size={17} />
                </span>
                <span>{text("Voyageur (Convoyeur)", "Traveler (Carrier)")}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={heroMode === "bagandgo"}
                onClick={() => {
                  triggerHaptic(8);
                  setHeroMode("bagandgo");
                }}
                className={`p-3 sm:p-5 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer text-center ${
                  heroMode === "bagandgo"
                    ? "bg-[#FFFFFF] text-slate-900 border-[#2563EB]"
                    : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <span
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    heroMode === "bagandgo"
                      ? "bg-blue-50 text-[#2563EB]"
                      : "bg-slate-200/70 text-slate-600"
                  }`}
                  aria-hidden="true"
                >
                  <Package size={17} />
                </span>
                <span>{text("Bag & Go (Expéditeur)", "Bag & Go (Shipper)")}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={heroMode === "shopandgo"}
                onClick={() => {
                  triggerHaptic(8);
                  setHeroMode("shopandgo");
                }}
                className={`p-3 sm:p-5 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer text-center ${
                  heroMode === "shopandgo"
                    ? "bg-[#FFFFFF] text-slate-900 border-[#2563EB]"
                    : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <span
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    heroMode === "shopandgo"
                      ? "bg-blue-50 text-[#2563EB]"
                      : "bg-slate-200/70 text-slate-600"
                  }`}
                  aria-hidden="true"
                >
                  <ShoppingBag size={17} />
                </span>
                <span>{text("Shop & Go (Acheteur)", "Shop & Go (Buyer)")}</span>
              </button>
            </div>

            {/* Champs Trajet & Date */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    {text("Départ", "Departure")}
                  </label>
                  <CityAutocomplete
                    id="hero-origin-input"
                    name="heroOrigin"
                    value={heroOrigin}
                    onChange={setHeroOrigin}
                    placeholder="Paris, Marseille, Lyon…"
                  />
                </div>

                <div className="md:col-span-1 flex justify-center">
                  <button
                    type="button"
                    aria-label={text("Inverser les villes", "Swap cities")}
                    onClick={() => {
                      const prev = heroOrigin;
                      setHeroOrigin(heroDestination);
                      setHeroDestination(prev);
                    }}
                    className="w-11 h-11 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ArrowLeftRight size={16} />
                  </button>
                </div>

                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    {text("Destination", "Destination")}
                  </label>
                  <CityAutocomplete
                    id="hero-destination-input"
                    name="heroDestination"
                    value={heroDestination}
                    onChange={setHeroDestination}
                    placeholder="Alger, Oran, Montréal…"
                  />
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label
                    htmlFor="hero-date-input"
                    className="text-xs font-bold text-slate-600 flex items-center gap-1.5"
                  >
                    <Calendar size={14} className="text-slate-400" />
                    {text("Date prévue", "Target date")}
                  </label>
                  <input
                    id="hero-date-input"
                    type="date"
                    value={heroDate}
                    onChange={(e) => setHeroDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm font-medium text-slate-900 outline-none focus:border-[#2563EB] tabular-nums"
                  />
                </div>
              </div>

              {/* Options spécifiques au mode */}
              {heroMode === "voyageur" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-[#E2E8F0]">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-600 block">
                      {text("Mode de transport", "Transport mode")}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { id: "avion", label: text("Avion", "Flight"), Icon: Plane },
                          { id: "bateau", label: text("Bateau / Ferry", "Ferry"), Icon: Ship },
                          { id: "voiture", label: text("Voiture / Van", "Car / Van"), Icon: Car },
                        ] as const
                      ).map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setHeroTransportType(id)}
                          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            heroTransportType === id
                              ? "bg-[#0F172A] text-white border-[#0F172A]"
                              : "bg-[#F8FAFC] text-slate-700 border-[#E2E8F0] hover:bg-slate-100"
                          }`}
                        >
                          <Icon size={14} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-600 block">
                      {text("Capacité disponible (kg)", "Available capacity (kg)")}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[5, 10, 15, 23].map((kg) => (
                        <button
                          key={kg}
                          type="button"
                          onClick={() => setHeroCapacityKg(kg)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer tabular-nums ${
                            heroCapacityKg === kg
                              ? "bg-[#0F172A] text-white border-[#0F172A]"
                              : "bg-[#F8FAFC] text-slate-700 border-[#E2E8F0] hover:bg-slate-100"
                          }`}
                        >
                          {kg} kg
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {heroMode === "bagandgo" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-[#E2E8F0]">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-600 block">
                      {text("Format du colis", "Parcel size")}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { id: "pli", label: "Pli / Docs (1 kg)" },
                          { id: "petit", label: "Petit (3 kg)" },
                          { id: "moyen", label: "Moyen (5 kg)" },
                          { id: "grand", label: "Valise (15 kg)" },
                        ] as const
                      ).map(({ id, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setHeroParcelPreset(id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer tabular-nums ${
                            heroParcelPreset === id
                              ? "bg-[#0F172A] text-white border-[#0F172A]"
                              : "bg-[#F8FAFC] text-slate-700 border-[#E2E8F0] hover:bg-slate-100"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-600 block">
                      {text("Délai souhaité", "Delivery speed")}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { id: "express", label: text("Express 24h–48h", "Express 24h–48h") },
                          { id: "standard", label: text("Flexible (3–7 j)", "Flexible (3–7 d)") },
                        ] as const
                      ).map(({ id, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setHeroUrgency(id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            heroUrgency === id
                              ? "bg-[#0F172A] text-white border-[#0F172A]"
                              : "bg-[#F8FAFC] text-slate-700 border-[#E2E8F0] hover:bg-slate-100"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {heroMode === "shopandgo" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-[#E2E8F0]">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-600 block">
                      {text("Catégorie de produit", "Product category")}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "High-Tech & Duty-Free",
                        "Parfums & Cosmétiques",
                        "Mode & Luxe",
                        "Parapharmacie",
                      ].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setHeroStoreCategory(cat)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            heroStoreCategory === cat
                              ? "bg-[#0F172A] text-white border-[#0F172A]"
                              : "bg-[#F8FAFC] text-slate-700 border-[#E2E8F0] hover:bg-slate-100"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="hero-product-name"
                      className="text-xs font-bold text-slate-600 block"
                    >
                      {text("Article recherché (facultatif)", "Desired item (optional)")}
                    </label>
                    <input
                      id="hero-product-name"
                      type="text"
                      value={heroProductName}
                      onChange={(e) => setHeroProductName(e.target.value)}
                      placeholder={text("Ex: AirPods Pro, Dior Sauvage…", "e.g. AirPods Pro, Dior Sauvage…")}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-slate-900 outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Live Result Ribbon */}
            <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] p-6 sm:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-baseline gap-2.5">
                  {heroMode === "voyageur" && (
                    <>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {text("Gain net estimé :", "Estimated net gain:")}
                      </span>
                      <strong className="text-2xl font-black text-[#059669] tabular-nums">
                        +{heroEarning} €
                      </strong>
                      <span className="text-xs text-slate-500">
                        ({heroCapacityKg} kg · {heroTransportType})
                      </span>
                    </>
                  )}
                  {heroMode === "bagandgo" && (
                    <>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {text("Tarif estimé :", "Estimated rate:")}
                      </span>
                      <strong className="text-2xl font-black text-[#059669] tabular-nums">
                        {heroParcelPrice} €
                      </strong>
                      <span className="text-xs font-bold text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded-full tabular-nums">
                        −{heroSavingsPercent} % vs DHL ({heroCompetitorPrice} €)
                      </span>
                    </>
                  )}
                  {heroMode === "shopandgo" && (
                    <>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {text("Commission voyageur dès", "Traveler fee from")}
                      </span>
                      <strong className="text-2xl font-black text-[#059669] tabular-nums">
                        20 €
                      </strong>
                      <span className="text-xs text-slate-500">
                        · {heroStoreCategory}
                      </span>
                    </>
                  )}
                </div>
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <ShieldCheck size={14} className="text-[#059669]" />
                  {heroMode === "voyageur"
                    ? text("Paiement garanti par séquestre Stripe", "Payment guaranteed by Stripe escrow")
                    : heroMode === "bagandgo"
                      ? text("Double vérification QR & photo scellée", "Dual QR & tamper seal verified")
                      : text("Fonds bloqués jusqu’à réception conforme", "Funds held until compliant receipt")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {heroMode === "voyageur" && (
                  <>
                    <a
                      href="/#voyageur"
                      className="bv-hero-action-cta inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold transition-colors no-underline"
                    >
                      <span>{text("Rentabiliser mon voyage", "Monetize my trip")}</span>
                      <ArrowRight size={16} />
                    </a>
                    <a
                      href="/#publish/trips"
                      className="bv-hero-secondary-cta inline-flex items-center px-4 py-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors no-underline"
                    >
                      <span>{text("Publier mon trajet", "Post a trip")}</span>
                    </a>
                  </>
                )}
                {heroMode === "bagandgo" && (
                  <>
                    <a
                      href="/#bagandgo"
                      className="bv-hero-action-cta inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold transition-colors no-underline"
                    >
                      <span>{text("Trouver un convoyeur", "Find a carrier")}</span>
                      <ArrowRight size={16} />
                    </a>
                    <a
                      href="/#publish/parcel"
                      className="bv-hero-secondary-cta inline-flex items-center px-4 py-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors no-underline"
                    >
                      <span>{text("Expédier un colis", "Ship a parcel")}</span>
                    </a>
                  </>
                )}
                {heroMode === "shopandgo" && (
                  <>
                    <a
                      href="/#shopandgo"
                      className="bv-hero-action-cta inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold transition-colors no-underline"
                    >
                      <span>{text("Commander avec un voyageur", "Order with a traveler")}</span>
                      <ArrowRight size={16} />
                    </a>
                    <a
                      href="/#publish/requests"
                      className="bv-hero-secondary-cta inline-flex items-center px-4 py-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors no-underline"
                    >
                      <span>{text("Créer une demande d'achat", "Post a shopping request")}</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
            </div>

            {/* Right Column: Bespoke Autonomous Live Mobile Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center lg:pt-2">
              <BagVoyageLiveShowcase
                activeScenario={heroMode}
                onScenarioChange={setHeroMode}
                language={language}
              />
            </div>
          </div>

          {/* Trust Bar 4 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              {
                Icon: ShieldCheck,
                title: text("Séquestre Stripe Connect", "Stripe Connect Escrow"),
                desc: text(
                  "Fonds sécurisés à 100 %. Déblocage uniquement après validation QR à l'arrivée.",
                  "100% escrowed funds. Payout only released upon arrival QR scan.",
                ),
                green: false,
              },
              {
                Icon: ScanLine,
                title: text("Double Remise QR & Photo", "Dual QR & Photo Check"),
                desc: text(
                  "Photo du scellé au départ et scan QR bilatéral inviolable à la remise.",
                  "Seal photo at departure and bilateral QR validation at handover.",
                ),
                green: true,
              },
              {
                Icon: Plane,
                title: text("Express Vol Direct 24h–48h", "Direct Flights 24h–48h"),
                desc: text(
                  "Vos colis voyagent avec de vrais passagers vérifiés sur des vols quotidiens.",
                  "Your parcels travel with verified passengers on daily direct flights.",
                ),
                green: false,
              },
              {
                Icon: Coins,
                title: text("Jusqu'à -70 % d'économie", "Up to -70% Savings"),
                desc: text(
                  "Sans surtaxes carburant ni douanes opaques. Gagnant pour chacun.",
                  "No fuel surcharges or opaque customs. Win-win for everyone.",
                ),
                green: true,
              },
            ].map(({ Icon, title, desc, green }) => (
              <div
                key={title}
                className="bv-trust-bar-item bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 flex items-start gap-3.5"
              >
                <span
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    green
                      ? "bg-[#059669]/10 text-[#059669]"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <div>
                  <strong className="block text-sm font-extrabold text-slate-900">
                    {title}
                  </strong>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Corridors + Comparateur DHL/FedEx (Fond #FFFFFF) */}
      <section
        id="simulator"
        className="bg-[#FFFFFF] border-y border-[#E2E8F0] py-14 sm:py-16 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                01 / {text("CORRIDORS & TARIFS", "CORRIDORS & PRICING")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
                {c.compare}
              </h2>
            </div>
            <p className="text-sm text-slate-600 max-w-md">{c.compareText}</p>
          </div>

          {/* 4 Cartes Corridors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {corridors.map((item) => (
              <article
                key={item.code}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] text-[11px] font-extrabold text-slate-700 whitespace-nowrap">
                    {item.badge}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {item.from} → {item.to}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {item.code} · {item.carrier}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2 tabular-nums">
                  <strong className="text-lg font-black text-[#059669] whitespace-nowrap">
                    {item.price}
                  </strong>
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                    {item.delay}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Comparateur Interactif BagVoyage vs DHL / FedEx (zéro vide blanc) */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">
                  {text("Origine", "Origin")}
                </label>
                <CityAutocomplete
                  id="sim-origin"
                  name="simOrigin"
                  value={origin}
                  onChange={setOrigin}
                  placeholder="Paris"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">
                  {text("Destination", "Destination")}
                </label>
                <CityAutocomplete
                  id="sim-dest"
                  name="simDestination"
                  value={destination}
                  onChange={setDestination}
                  placeholder="Alger"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">
                  {text("Poids (kg)", "Weight (kg)")} :{" "}
                  <strong className="text-slate-900 tabular-nums">{weight} kg</strong>
                </label>
                <input
                  type="range"
                  min={1}
                  max={23}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-[#2563EB]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">
                  {c.competitor}
                </label>
                <div className="flex gap-2">
                  {(["DHL", "FedEx", "Chronopost"] as const).map((comp) => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => {
                        setCompetitor(comp);
                        setHasCustomQuote(false);
                      }}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        competitor === comp
                          ? "bg-[#0F172A] text-white border-[#0F172A]"
                          : "bg-[#FFFFFF] text-slate-700 border-[#E2E8F0]"
                      }`}
                    >
                      {comp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNeed("parcel")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      need === "parcel"
                        ? "bg-[#0F172A] text-white border-[#0F172A]"
                        : "bg-[#FFFFFF] text-slate-700 border-[#E2E8F0]"
                    }`}
                  >
                    {text("Envoi de colis", "Parcel")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNeed("shop")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      need === "shop"
                        ? "bg-[#0F172A] text-white border-[#0F172A]"
                        : "bg-[#FFFFFF] text-slate-700 border-[#E2E8F0]"
                    }`}
                  >
                    Shop &amp; Go
                  </button>
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span>{c.quote} :</span>
                  <input
                    type="number"
                    min={1}
                    value={quote}
                    onChange={(e) => {
                      setHasCustomQuote(true);
                      setCustomQuote(Math.max(1, Number(e.target.value) || 0));
                    }}
                    className="w-24 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] text-slate-900 font-bold tabular-nums"
                  />
                </label>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4 tabular-nums">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  {competitor} ({weight} kg)
                </span>
                <strong className="line-through text-slate-400 font-bold">
                  {quote} €
                </strong>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">BagVoyage</span>
                <strong className="text-2xl font-black text-[#059669]">
                  {gross} €
                </strong>
              </div>
              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  {c.saving}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#059669]/10 text-[#059669] text-sm font-black">
                  −{saving} € ({percent} %)
                </span>
              </div>
              <a
                href="/#explore"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold transition-colors no-underline"
              >
                <span>{text("Voir les voyageurs disponibles", "Browse available travelers")}</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 Univers (#F8FAFC) */}
      <section id="features" className="py-14 sm:py-16 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              02 / {text("TROIS MODES INTÉGRÉS", "THREE INTEGRATED MODES")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
              {c.universes}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                href: "/#voyageur",
                Icon: Plane,
                badge: "Voyageur",
                title: text("Rentabilisez vos kilos libres", "Monetize unused luggage"),
                desc: text(
                  "Avion, voiture, train, ferry ou utilitaire : publiez votre trajet ou scannez votre billet pour amortir votre voyage.",
                  "Flight, car, train, ferry or van: post your trip or scan your ticket to offset travel costs.",
                ),
                cta: text("Ouvrir mode Voyageur", "Open Traveler mode"),
              },
              {
                href: "/#bagandgo",
                Icon: Package,
                badge: "Bag & Go",
                title: text("Expédiez vos colis en 24h–48h", "Ship parcels in 24h–48h"),
                desc: text(
                  "Choisissez un gabarit précis, confiez votre colis à un passager vérifié et suivez la remise avec scellé et code PIN.",
                  "Pick an exact parcel preset, hand off to a verified traveler and track delivery with seal and PIN.",
                ),
                cta: text("Ouvrir Bag & Go", "Open Bag & Go"),
              },
              {
                href: "/#shopandgo",
                Icon: ShoppingBag,
                badge: "Shop & Go",
                title: text("Achetez à l’étranger sans frontières", "Shop abroad without borders"),
                desc: text(
                  "Commandez parfums, high-tech ou articles introuvables avec ticket de caisse officiel remis en main propre.",
                  "Order fragrances, electronics or hard-to-find items with an official receipt delivered hand-to-hand.",
                ),
                cta: text("Ouvrir Shop & Go", "Open Shop & Go"),
              },
            ].map(({ href, Icon, badge, title, desc, cta }) => (
              <article
                key={badge}
                className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-11 h-11 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                      <Icon size={20} />
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-slate-700">
                      {badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
                <a
                  href={href}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:underline no-underline"
                >
                  <span>{cta}</span>
                  <ArrowRight size={15} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section Sombre #0F172A : Preuve Technologique & Application Mobile */}
      <section
        id="mobile"
        className="bg-[#0F172A] text-white py-16 px-4 sm:px-6"
        aria-labelledby="mobile-title"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                03 / {text("SÉCURITÉ & EXPÉRIENCE MOBILE", "SECURITY & MOBILE EXPERIENCE")}
              </span>
              <h2
                id="mobile-title"
                className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-1"
              >
                {c.trust}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl leading-relaxed">
                {text(
                  "Votre billet, vos preuves photo/vidéo et votre passe de fret hors-ligne réunis au même endroit, protégés de bout en bout.",
                  "Your boarding pass, photo/video proofs and offline cargo pass in one place, protected end-to-end.",
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  Icon: ShieldCheck,
                  title: "Stripe Connect",
                  desc: text(
                    "Séquestre bancaire : fonds bloqués puis libérés uniquement à la remise.",
                    "Escrow hold: funds locked and released only on delivery confirmation.",
                  ),
                },
                {
                  Icon: ScanLine,
                  title: text("Double QR & PIN", "Dual QR & PIN"),
                  desc: text(
                    "Contrôle à la prise en charge et code PIN à 4 chiffres à l'arrivée.",
                    "Collection verification and 4-digit PIN confirmation on arrival.",
                  ),
                },
                {
                  Icon: Video,
                  title: text("Preuve horodatée", "Timestamped proof"),
                  desc: text(
                    "État du colis documenté par photo et scellé numéroté.",
                    "Parcel condition documented by photo and numbered tamper seal.",
                  ),
                },
                {
                  Icon: WifiOff,
                  title: text("Passe hors-ligne", "Offline pass"),
                  desc: text(
                    "Enregistrez la remise même en zone blanche aéroportuaire.",
                    "Record handover even without mobile data at the terminal.",
                  ),
                },
              ].map(({ Icon, title, desc }) => (
                <article
                  key={title}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Icon size={16} className="text-[#059669]" />
                    <span>{title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>
                </article>
              ))}
            </div>

            <div className="pt-2 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <AppStoreBadges language={language} onClick={openMobileLaunch} />
                <a
                  href="#download"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-200 hover:text-white no-underline"
                >
                  <Smartphone size={16} />
                  <span>{text("Découvrir l’app mobile", "Explore mobile app")}</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
              <MobileWaitlistForm language={language} />
            </div>
          </div>

          {/* Carte Tactile Passe Fret Hors-Ligne & Protocole PIN */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[360px] space-y-4">
              <div className="rounded-3xl bg-slate-900 border border-white/15 p-5 space-y-3 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    <Plane size={13} className="text-[#2563EB]" />
                    {text("TRAJET CERTIFIÉ", "CERTIFIED ROUTE")}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#059669]/20 border border-[#059669]/40 text-emerald-300 text-[11px] font-bold">
                    {text("Séquestre actif", "Escrow active")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-2xl font-black text-white tabular-nums">
                  <span>CDG</span>
                  <ArrowRight size={20} className="text-slate-500" />
                  <span>ALG</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 tabular-nums pt-1 border-t border-white/10">
                  <span>Vol AH1021 · 14:30</span>
                  <span className="text-white font-bold">15 kg · +140 €</span>
                </div>
              </div>

              <div className="rounded-3xl bg-[#FFFFFF] text-slate-900 p-5 space-y-3 shadow-2xl tabular-nums">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="inline-flex items-center gap-1.5">
                    <Ticket size={15} className="text-[#2563EB]" />
                    {text("Passe de fret hors-ligne", "Offline cargo pass")}
                  </span>
                  <span className="text-[#059669] font-extrabold">STEB-447B</span>
                </div>
                <PassBarcode />
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                  <span>5 kg · Porte K34</span>
                  <span className="inline-flex items-center gap-1 text-slate-700">
                    <WifiOff size={12} /> {text("Mode aéroport", "Offline ready")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparatif Groupes Informels vs BagVoyage + FAQ (#FFFFFF) */}
      <section id="faq" className="bg-[#FFFFFF] py-14 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Comparatif Confiance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                {text("Groupes informels", "Informal groups")}
              </span>
              <ul className="space-y-2 text-sm text-slate-600 list-none p-0 m-0">
                {[
                  text("Risque d’arnaque et désistements", "Risk of scams and no-shows"),
                  text("Aucune garantie financière", "No financial guarantee"),
                  text("Espèces non protégées", "Unprotected cash"),
                  text("Aucune traçabilité de remise", "No handover traceability"),
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CircleMinus size={16} className="text-slate-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#F8FAFC] border border-[#059669]/40 rounded-2xl p-6 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#059669]">
                BagVoyage · {text("Protocole certifié", "Certified protocol")}
              </span>
              <ul className="space-y-2 text-sm font-medium text-slate-800 list-none p-0 m-0">
                {[
                  text("Séquestre bancaire Stripe Connect 100 % garanti", "100% guaranteed Stripe Connect escrow"),
                  text("Identité et justificatifs vérifiés", "Verified identity and documents"),
                  text("Scellé inviolable numéroté + Code PIN", "Numbered tamper-evident seal + PIN"),
                  text("Assistance dédiée en cas de litige", "Dedicated dispute support"),
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CircleCheck size={16} className="text-[#059669] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                04 / FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
                {c.faq}
              </h2>
            </div>

            <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-2xl bg-[#FFFFFF] overflow-hidden">
              {faqs[language].map(([question, answer], index) => (
                <details key={question} className="group p-5">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-sm sm:text-base text-slate-900">
                    <span className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-slate-400 tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {question}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-slate-400 group-open:rotate-90 transition-transform shrink-0"
                    />
                  </summary>
                  <p className="text-sm text-slate-600 leading-relaxed mt-3 pl-7">
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Sombre #0F172A */}
      <footer className="bg-[#0F172A] text-white py-12 px-4 sm:px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                BAGVOYAGE · FRANCE / ALGÉRIE / INTERNATIONAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {c.end.split("\n").map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </div>
            <a
              href="/#explore"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold transition-colors no-underline shrink-0"
            >
              <span>{c.cta}</span>
              <ArrowUpRight size={18} />
            </a>
          </div>

          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-300 pt-6 border-t border-white/10"
            aria-label={text("Liens de pied de page", "Footer links")}
          >
            <a href="/#how-it-works" className="hover:text-white no-underline">
              {text("Comment ça marche", "How it works")}
            </a>
            <a href="/#pricing" className="hover:text-white no-underline">
              {text("Tarifs & Comparateur", "Pricing & Comparison")}
            </a>
            <a href="/#trust" className="hover:text-white no-underline">
              {text("Sécurité & Séquestre", "Security & Escrow")}
            </a>
            <a href="/#faq" className="hover:text-white no-underline">
              {text("Centre d'Aide FAQ", "Help Center FAQ")}
            </a>
            <a href="#simulator" className="hover:text-white no-underline">
              {text("Simulateur", "Simulator")}
            </a>
            <a href="#mobile" className="hover:text-white no-underline">
              {text("Application Mobile", "Mobile App")}
            </a>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-4 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#059669]" />
                Stripe Connect Escrow
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#059669]" />
                {text("Scellé STEB & QR", "STEB Seal & QR")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <LockKeyhole size={14} className="text-slate-300" />
                TLS 256-bit
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle showLabel />
              <span>Copyright {new Date().getFullYear()} BagVoyage</span>
              {showAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = "admin";
                  }}
                  className="text-xs font-bold text-slate-300 hover:text-white underline cursor-pointer"
                >
                  Super Admin
                </button>
              )}
            </div>
          </div>
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
