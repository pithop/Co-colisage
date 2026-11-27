import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Car,
  CheckCircle2,
  CircleCheck,
  CircleMinus,
  Coins,
  FileText,
  LockKeyhole,
  MapPin,
  Menu,
  Package,
  Plane,
  ScanLine,
  ShieldCheck,
  Ship,
  ShoppingBag,
  Smartphone,
  Ticket,
  WifiOff,
  X,
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
import { TransportBackdrop } from "./TransportBackdrop";

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
  const [showMobileRouteEditor, setShowMobileRouteEditor] = useState(false);
  const [legalDoc, setLegalDoc] = useState<"cgu" | "privacy" | "mentions" | null>(null);

  useEffect(() => {
    if (!legalDoc) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLegalDoc(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [legalDoc]);

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
      image: "/images/dest-algiers.jpg",
    },
    {
      badge: text("EXPRESS MÉDITERRANÉE", "MEDITERRANEAN EXPRESS"),
      from: "Marseille",
      to: "Oran",
      code: "MRS → ORN",
      price: "7 € / kg",
      delay: "24h",
      carrier: text("Vol & Ferry", "Flight & Ferry"),
      image: "/images/scene-med-ferry.jpg",
    },
    {
      badge: text("FORTE DEMANDE", "HIGH DEMAND"),
      from: "Lyon",
      to: "Constantine",
      code: "LYS → CZL",
      price: "8 € / kg",
      delay: "24h – 48h",
      carrier: text("Vol direct", "Direct flight"),
      image: "/images/dest-paris.jpg",
    },
    {
      badge: text("TRANSATLANTIQUE", "TRANSATLANTIC"),
      from: "Paris",
      to: "Montréal",
      code: "CDG → YUL",
      price: "12 € / kg",
      delay: "24h – 48h",
      carrier: text("Long-courrier", "Long-haul"),
      image: "/images/dest-montreal.jpg",
    },
  ];

  const visualCategories = [
    {
      id: "parfums",
      label: text("Parfums & Beauté", "Fragrance & Beauty"),
      sub: text("Duty-Free & Sephora", "Duty-Free & Sephora"),
      image: "/images/perfume.jpg",
      href: "/#shopandgo",
    },
    {
      id: "hightech",
      label: text("High-Tech", "High-Tech"),
      sub: text("Audio & Smartphones", "Audio & Smartphones"),
      image: "/images/cat-headphones-tech.jpg",
      href: "/#shopandgo",
    },
    {
      id: "luxe",
      label: text("Sacs & Mode", "Bags & Fashion"),
      sub: text("Boutiques Paris", "Paris Boutiques"),
      image: "/images/cat-luxury-bag.jpg",
      href: "/#shopandgo",
    },
    {
      id: "chaussures",
      label: text("Sneakers", "Sneakers"),
      sub: text("Éditions limitées", "Limited editions"),
      image: "/images/nike.jpg",
      href: "/#shopandgo",
    },
    {
      id: "colis",
      label: text("Colis Express", "Express Parcels"),
      sub: text("Remise main propre", "Hand-to-hand"),
      image: "/images/scene-handover-people.jpg",
      href: "/#bagandgo",
    },
    {
      id: "ferry",
      label: text("Ferry & Route", "Ferry & Road"),
      sub: text("Gros volumes", "Large volumes"),
      image: "/images/scene-med-ferry.jpg",
      href: "/#voyageur",
    },
  ];

  const popularCommunityOffers = [
    {
      id: "offer-dior",
      title: "Dior Sauvage Eau de Parfum (100 ml)",
      route: "Paris → Alger",
      destination: "Alger",
      price: "110 €",
      gain: "+25 €",
      traveler: "Inès B.",
      avatar: "/images/portraits/photo-1534528741775-53994a69daeb.jpg",
      image: "/images/perfume.jpg",
      href: "/#shopandgo",
    },
    {
      id: "offer-tech",
      title: text("Casque Studio & Accessoires", "Studio Headphones & Gear"),
      route: "Paris → Oran",
      destination: "Oran",
      price: "320 €",
      gain: "+40 €",
      traveler: "Karim M.",
      avatar: "/images/portraits/photo-1507003211169-0a1dd7228f2d.jpg",
      image: "/images/cat-headphones-tech.jpg",
      href: "/#shopandgo",
    },
    {
      id: "offer-bag",
      title: text("Maroquinerie & Lunettes Paris", "Paris Leather Bag & Shades"),
      route: "Paris → Dakar",
      destination: "Dakar",
      price: "280 €",
      gain: "+35 €",
      traveler: "Sarah L.",
      avatar: "/images/portraits/photo-1544005313-94ddf0286df2.jpg",
      image: "/images/cat-luxury-bag.jpg",
      href: "/#shopandgo",
    },
    {
      id: "offer-nike",
      title: "Nike Air Max Limited (42 EU)",
      route: "Marseille → Alger",
      destination: "Alger",
      price: "145 €",
      gain: "+28 €",
      traveler: "Yanis D.",
      avatar: "/images/portraits/photo-1500648767791-00dcc994a43e.jpg",
      image: "/images/nike.jpg",
      href: "/#shopandgo",
    },
  ];

  const heroBackdropImage =
    heroMode === "bagandgo"
      ? "/images/scene-handover-people.jpg"
      : heroMode === "shopandgo"
        ? "/images/scene-boutique-paris.jpg"
        : heroTransportType === "bateau"
          ? "/images/scene-med-ferry.jpg"
          : heroTransportType === "voiture"
            ? "/images/scene-roadtrip-trunk.jpg"
            : "/images/hero-airport-traveler.jpg";

  return (
    <div className="bv-landing-v2 min-h-screen bg-[#F8FAFC] text-slate-900 antialiased" lang={language}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Sticky Header — Minimaliste 2027 */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/85 backdrop-blur-xl border-b border-[#E2E8F0]/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <a
            href="/#landing"
            className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 shrink-0 no-underline"
          >
            BagVoyage<span className="text-[#2563EB]">.</span>
          </a>

          <nav
            className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-slate-600"
            aria-label={text("Présentation de BagVoyage", "About BagVoyage")}
          >
            <a href="/#voyageur" className="hover:text-slate-900 transition-colors no-underline">
              {text("Explorer", "Explore")}
            </a>
            <a href="#simulator" className="hover:text-slate-900 transition-colors no-underline">
              {text("Tarifs", "Pricing")}
            </a>
            <a href="#features" className="hover:text-slate-900 transition-colors no-underline">
              {text("3 Modes", "3 Modes")}
            </a>
            <a href="#mobile" className="hover:text-slate-900 transition-colors no-underline">
              {text("Sécurité", "Security")}
            </a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
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
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold transition-colors no-underline whitespace-nowrap shadow-xs"
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

      {/* Hero Photographique Humain + Trajectoires Avion / Bateau / Voiture */}
      <section className="relative overflow-hidden bg-[#071024] pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6">
        {/* Full-bleed editorial background photo reacting live to mode & transport */}
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <img
            key={heroBackdropImage}
            src={heroBackdropImage}
            alt=""
            className="bv-hero-photo-kenburns w-full h-full object-cover object-center transition-opacity duration-700"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(7,16,36,0.90) 0%, rgba(10,22,51,0.76) 52%, rgba(7,16,36,0.50) 100%)",
            }}
          />
        </div>

        <TransportBackdrop
          activeMode={heroMode}
          activeTransport={heroTransportType}
          variant="photo"
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 items-center pb-8 sm:pb-14">
            {/* Left Column: Instant Human Clarity + Streamlined Console */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="text-center lg:text-left space-y-2.5 sm:space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase text-sky-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{text("Communauté de voyageurs · France · Maghreb · Monde", "Traveler community · France · Maghreb · Global")}</span>
                </div>

                <h1 className="bv-hero-headline text-[26px] sm:text-5xl xl:text-[52px] font-extrabold tracking-[-0.035em] text-white leading-[1.08] drop-shadow-xs">
                  {text("Rentabilisez vos voyages.", "Fund your travels.")}{" "}
                  <span className="text-sky-300 block sm:inline">
                    {text("Expédiez vos colis en 24h.", "Ship parcels in 24h.")}
                  </span>
                </h1>

                <p className="bv-hero-lead text-xs sm:text-[17px] text-slate-100 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {text(
                    "Des voyageurs vérifiés transportent vos colis ou achètent en boutique sur leur trajet. Paiement bloqué sur Stripe et libéré par code PIN.",
                    "Verified travelers carry parcels or shop retail along their trip. Payment escrowed on Stripe and released via PIN.",
                  )}
                </p>

                {/* Human community social proof strip */}
                <div className="hidden sm:flex items-center gap-3 pt-0.5 justify-center lg:justify-start">
                  <div className="flex -space-x-2">
                    {[
                      "/images/portraits/photo-1507003211169-0a1dd7228f2d.jpg",
                      "/images/portraits/photo-1534528741775-53994a69daeb.jpg",
                      "/images/portraits/photo-1500648767791-00dcc994a43e.jpg",
                      "/images/portraits/photo-1544005313-94ddf0286df2.jpg",
                    ].map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-[#071024]"
                      />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    {text("Voyageurs & expéditeurs vérifiés · Remise main propre", "Verified travelers & senders · Hand-to-hand delivery")}
                  </p>
                </div>
              </div>

              {/* Streamlined Tri-Modal Console */}
              <div className="bg-white border border-white/80 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/30 overflow-hidden text-slate-900">
                {/* 3 Sleek Tabs */}
                <div
                  className="bv-hero-mode-tabs grid grid-cols-3 border-b border-[#E2E8F0] bg-[#F8FAFC]/80"
                  role="tablist"
                >
                  {(
                    [
                      {
                        id: "voyageur",
                        Icon: Plane,
                        label: text("Voyageur (Convoyeur)", "Traveler (Carrier)"),
                      },
                      {
                        id: "bagandgo",
                        Icon: Package,
                        label: text("Bag & Go (Expéditeur)", "Bag & Go (Shipper)"),
                      },
                      {
                        id: "shopandgo",
                        Icon: ShoppingBag,
                        label: text("Shop & Go (Acheteur)", "Shop & Go (Buyer)"),
                      },
                    ] as const
                  ).map(({ id, Icon, label }) => {
                    const isSelected = heroMode === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => {
                          triggerHaptic(8);
                          setHeroMode(id);
                        }}
                        className={`min-h-[44px] px-1.5 py-2 sm:px-4 sm:py-3.5 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold transition-colors cursor-pointer text-center ${
                          isSelected
                            ? "bg-[#FFFFFF] text-[#2563EB]"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                        }`}
                      >
                        <Icon size={14} className="shrink-0 hidden sm:block" aria-hidden="true" />
                        <span className="leading-tight">{label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Compact Route Strip (Collapsible summary pill on Mobile < sm, Inline row on Desktop sm+) */}
                <div className="p-3 sm:p-6 space-y-2.5 sm:space-y-4">
                  <div className="flex sm:hidden items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 truncate">
                      <MapPin size={13} className="text-[#2563EB] shrink-0" />
                      <span className="truncate">{heroOrigin} → {heroDestination}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMobileRouteEditor(!showMobileRouteEditor)}
                      className="text-[11px] font-bold text-[#2563EB] bg-transparent border-0 p-0 cursor-pointer shrink-0 whitespace-nowrap"
                    >
                      {showMobileRouteEditor
                        ? text("Fermer", "Done")
                        : text("Modifier", "Edit")}
                    </button>
                  </div>

                  <div
                    className={`${
                      showMobileRouteEditor ? "grid" : "hidden sm:grid"
                    } grid-cols-1 sm:grid-cols-12 gap-2.5 items-end`}
                  >
                    <div className="sm:col-span-8 grid grid-cols-[1fr_auto_1fr] gap-1.5 sm:gap-2 items-end">
                      <div className="space-y-1 min-w-0">
                        <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          <span>{text("Départ", "From")}</span>
                        </label>
                        <CityAutocomplete
                          id="hero-origin-input"
                          name="heroOrigin"
                          value={heroOrigin}
                          onChange={setHeroOrigin}
                          placeholder="Paris (CDG)"
                        />
                      </div>

                      <button
                        type="button"
                        aria-label={text("Inverser les villes", "Swap cities")}
                        onClick={() => {
                          const prev = heroOrigin;
                          setHeroOrigin(heroDestination);
                          setHeroDestination(prev);
                        }}
                        className="w-10 h-11 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      >
                        <ArrowLeftRight size={14} />
                      </button>

                      <div className="space-y-1 min-w-0">
                        <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          <span>{text("Arrivée", "To")}</span>
                        </label>
                        <CityAutocomplete
                          id="hero-destination-input"
                          name="heroDestination"
                          value={heroDestination}
                          onChange={setHeroDestination}
                          placeholder="Alger (ALG)"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4 space-y-1">
                      <label
                        htmlFor="hero-date-input"
                        className="text-[11px] font-bold text-slate-500 flex items-center gap-1"
                      >
                        <Calendar size={12} className="text-slate-400 shrink-0" />
                        <span>{text("Date prévue", "Target date")}</span>
                      </label>
                      <input
                        id="hero-date-input"
                        type="date"
                        value={heroDate}
                        onChange={(e) => setHeroDate(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-[#2563EB] tabular-nums"
                      />
                    </div>
                  </div>

                  {/* Wrapped Mobile-Safe Mode Options Strip */}
                  {heroMode === "voyageur" && (
                    <div className="pt-2 sm:pt-3 sm:border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
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
                            onClick={() => setHeroTransportType(id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                              heroTransportType === id
                                ? "bg-[#0F172A] text-white border-[#0F172A]"
                                : "bg-[#F8FAFC] text-slate-700 border-[#E2E8F0] hover:bg-slate-100"
                            }`}
                          >
                            <Icon size={12} />
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1">
                        {[5, 10, 15, 23].map((kg) => (
                          <button
                            key={kg}
                            type="button"
                            onClick={() => setHeroCapacityKg(kg)}
                            className={`px-2 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border transition-colors cursor-pointer tabular-nums shrink-0 ${
                              heroCapacityKg === kg
                                ? "bg-[#2563EB] text-white border-[#2563EB]"
                                : "bg-[#F8FAFC] text-slate-700 border-[#E2E8F0] hover:bg-slate-100"
                            }`}
                          >
                            {kg}kg
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {heroMode === "bagandgo" && (
                    <div className="pt-2 sm:pt-3 sm:border-t border-[#E2E8F0] space-y-2">
                      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                        <span className="text-[11px] font-bold text-slate-500 shrink-0 whitespace-nowrap">
                          {text("Format du colis", "Parcel size")}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {(
                            [
                              { id: "pli", label: "Pli 1kg" },
                              { id: "petit", label: "Petit 3kg" },
                              { id: "moyen", label: "Moyen 5kg" },
                              { id: "grand", label: "Valise 15kg" },
                            ] as const
                          ).map(({ id, label }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setHeroParcelPreset(id)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-bold border transition-colors cursor-pointer tabular-nums whitespace-nowrap shrink-0 ${
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
                      <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                              heroUrgency === id
                                ? "bg-[#2563EB] text-white border-[#2563EB]"
                                : "bg-[#F8FAFC] text-slate-700 border-[#E2E8F0] hover:bg-slate-100"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {heroMode === "shopandgo" && (
                    <div className="pt-2 sm:pt-3 sm:border-t border-[#E2E8F0] space-y-2">
                      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                        <span className="text-[11px] font-bold text-slate-500 shrink-0 whitespace-nowrap">
                          {text("Catégorie de produit", "Product category")}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
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
                              className={`px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
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
                      <input
                        id="hero-product-name"
                        type="text"
                        aria-label={text("Article recherché (facultatif)", "Desired item (optional)")}
                        value={heroProductName}
                        onChange={(e) => setHeroProductName(e.target.value)}
                        placeholder={text("Article souhaité : Ex. AirPods Pro, Dior Sauvage…", "Desired item: e.g. AirPods Pro, Dior Sauvage…")}
                        className="hidden sm:block w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs sm:text-sm text-slate-900 outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  )}
                </div>

                {/* Crisp Result + CTA Bar */}
                <div className="bg-[#F8FAFC]/90 border-t border-[#E2E8F0] px-3.5 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                  <div className="flex items-center justify-between sm:block">
                    <div className="flex items-baseline gap-1.5">
                      {heroMode === "voyageur" && (
                        <>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                            {text("Gain estimé :", "Est. gain:")}
                          </span>
                          <strong className="text-lg sm:text-2xl font-black text-[#059669] tabular-nums">
                            +{heroEarning} €
                          </strong>
                        </>
                      )}
                      {heroMode === "bagandgo" && (
                        <>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            {text("Tarif :", "Rate:")}
                          </span>
                          <strong className="text-lg sm:text-2xl font-black text-[#059669] tabular-nums">
                            {heroParcelPrice} €
                          </strong>
                        </>
                      )}
                      {heroMode === "shopandgo" && (
                        <>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            {text("Dès", "From")}
                          </span>
                          <strong className="text-lg sm:text-2xl font-black text-[#059669] tabular-nums">
                            20 €
                          </strong>
                        </>
                      )}
                    </div>
                    <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 sm:mt-0.5">
                      <ShieldCheck size={13} className="text-[#059669] shrink-0" />
                      <span className="sm:hidden">{text("Séquestre Stripe", "Stripe Escrow")}</span>
                      <span className="hidden sm:inline">
                        {heroMode === "voyageur"
                          ? text("Paiement garanti par séquestre Stripe", "Guaranteed by Stripe escrow")
                          : heroMode === "bagandgo"
                            ? text("Double vérification QR & photo scellée", "Dual QR & tamper seal verified")
                            : text("Fonds bloqués jusqu’à réception conforme", "Funds held until receipt")}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    {heroMode === "voyageur" && (
                      <>
                        <a
                          href="/#voyageur"
                          className="bv-hero-action-cta flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold transition-colors no-underline whitespace-nowrap"
                        >
                          <span>{text("Rentabiliser mon voyage", "Monetize my trip")}</span>
                          <ArrowRight size={14} />
                        </a>
                        <a
                          href="/#publish/trips"
                          className="bv-hero-secondary-cta inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors no-underline whitespace-nowrap"
                        >
                          <span>{text("Publier", "Publish")}</span>
                        </a>
                      </>
                    )}
                    {heroMode === "bagandgo" && (
                      <>
                        <a
                          href="/#bagandgo"
                          className="bv-hero-action-cta flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold transition-colors no-underline whitespace-nowrap"
                        >
                          <span>{text("Trouver un convoyeur", "Find a carrier")}</span>
                          <ArrowRight size={14} />
                        </a>
                        <a
                          href="/#publish/parcel"
                          className="bv-hero-secondary-cta inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors no-underline whitespace-nowrap"
                        >
                          <span>{text("Publier", "Publish")}</span>
                        </a>
                      </>
                    )}
                    {heroMode === "shopandgo" && (
                      <>
                        <a
                          href="/#shopandgo"
                          className="bv-hero-action-cta flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold transition-colors no-underline whitespace-nowrap"
                        >
                          <span>{text("Commander avec un voyageur", "Order with a traveler")}</span>
                          <ArrowRight size={14} />
                        </a>
                        <a
                          href="/#publish/requests"
                          className="bv-hero-secondary-cta inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors no-underline whitespace-nowrap"
                        >
                          <span>{text("Demander", "Request")}</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column / Mobile Showcase Above-the-Fold (clear horizon corridor gap on mobile) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center pt-10 lg:pt-2">
              <BagVoyageLiveShowcase
                activeScenario={heroMode}
                onScenarioChange={setHeroMode}
                transportType={heroTransportType}
                originLabel={heroOrigin}
                destinationLabel={heroDestination}
                language={language}
              />
            </div>
          </div>

          {/* Architectural Trust Strip Floating on Photographic Hero */}
          <div className="mt-8 sm:mt-10 bg-[#FFFFFF]/95 backdrop-blur-xl border border-white/60 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0] overflow-hidden shadow-2xl shadow-black/20">
            {[
              {
                Icon: ShieldCheck,
                title: text("Séquestre Stripe Connect", "Stripe Connect Escrow"),
                desc: text("Déblocage uniquement à la remise.", "Released only upon handover."),
                green: false,
              },
              {
                Icon: ScanLine,
                title: text("Double Remise QR & Photo", "Dual QR & Photo Check"),
                desc: text("Photo au départ + scan QR à l'arrivée.", "Departure photo + arrival QR."),
                green: true,
              },
              {
                Icon: Plane,
                title: text("Express Vol Direct 24h–48h", "Direct Flights 24h–48h"),
                desc: text("Passagers vérifiés sur trajets directs.", "Verified travelers on direct routes."),
                green: false,
              },
              {
                Icon: Coins,
                title: text("Jusqu'à -70 % d'économie", "Up to -70% Savings"),
                desc: text("Sans surtaxes ni frais cachés.", "No surcharges or hidden fees."),
                green: true,
              },
            ].map(({ Icon, title, desc, green }) => (
              <div
                key={title}
                className="bv-trust-bar-item px-5 py-4 flex items-center gap-3"
              >
                <Icon
                  size={18}
                  className={green ? "text-[#059669] shrink-0" : "text-[#2563EB] shrink-0"}
                />
                <div className="min-w-0">
                  <strong className="block text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                    {title}
                  </strong>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catégories Visuelles & Demandes Populaires de la Communauté */}
      <section className="bv-reveal-section bg-[#F8FAFC] py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Strip Catégories Photos */}
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2563EB]">
                  {text("Explorer par univers", "Browse by category")}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
                  {text("Ce que les voyageurs rapportent chaque jour", "What travelers bring back every day")}
                </h2>
              </div>
              <a
                href="/#shopandgo"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:underline no-underline shrink-0"
              >
                <span>{text("Tout explorer", "Explore all")}</span>
                <ArrowRight size={15} />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {visualCategories.map((cat) => (
                <a
                  key={cat.id}
                  href={cat.href}
                  className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] sm:aspect-[5/4] shadow-sm border border-[#E2E8F0] no-underline block"
                >
                  <img
                    src={cat.image}
                    alt={cat.label}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <strong className="block text-xs sm:text-sm font-extrabold text-white leading-tight">
                      {cat.label}
                    </strong>
                    <span className="block text-[10px] sm:text-[11px] text-slate-200/90 mt-0.5 truncate">
                      {cat.sub}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Demandes & Colis Populaires (Style Dossier Client) */}
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#059669]">
                  {text("Communauté active", "Active community")}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
                  {text("Demandes populaires à rentabiliser", "Popular requests to fulfill")}
                </h2>
              </div>
              <a
                href="/#explore"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#2563EB] hover:underline no-underline shrink-0"
              >
                <span>{text("Voir tout", "See all")}</span>
                <ArrowRight size={14} />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularCommunityOffers.map((offer) => (
                <a
                  key={offer.id}
                  href={offer.href}
                  className="group bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between no-underline"
                >
                  <div>
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                        <MapPin size={11} className="text-emerald-400" />
                        {offer.destination}
                      </span>
                      <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#059669] text-white text-xs font-extrabold shadow-sm tabular-nums">
                        {text("Gain :", "Earn:")} {offer.gain}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 block">
                        {offer.route}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                        {offer.title}
                      </h3>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={offer.avatar}
                        alt={offer.traveler}
                        loading="lazy"
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <span className="text-xs font-semibold text-slate-600 truncate">
                        {offer.traveler}
                      </span>
                    </div>
                    <strong className="text-sm font-black text-slate-900 tabular-nums shrink-0">
                      {offer.price}
                    </strong>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Corridors Actifs + Comparateur Direct */}
      <section
        id="simulator"
        className="bv-reveal-section bg-[#FFFFFF] border-y border-[#E2E8F0] py-12 sm:py-16 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                {text("Corridors & Tarifs", "Corridors & Pricing")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
                {c.compare}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">{c.compareText}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Clickable Photographic Corridors List */}
            <div className="lg:col-span-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl divide-y divide-[#E2E8F0] overflow-hidden">
              {corridors.map((item) => {
                const isActive = origin === item.from && destination === item.to;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setOrigin(item.from);
                      setDestination(item.to);
                      setHasCustomQuote(false);
                    }}
                    className={`w-full px-4 py-3.5 flex items-center justify-between gap-3.5 text-left transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#FFFFFF] ring-1 ring-inset ring-[#2563EB]/30"
                        : "hover:bg-[#FFFFFF]/70"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={item.image}
                        alt={`${item.from} - ${item.to}`}
                        loading="lazy"
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#E2E8F0]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-sm sm:text-base font-extrabold text-slate-900">
                            {item.from} → {item.to}
                          </strong>
                          <span className="px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[10px] font-bold text-slate-600 tabular-nums">
                            {item.code}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          {item.carrier} · {item.delay}
                        </span>
                      </div>
                    </div>
                    <strong className="text-base sm:text-lg font-black text-[#059669] tabular-nums shrink-0">
                      {item.price}
                    </strong>
                  </button>
                );
              })}
            </div>

            {/* Streamlined Benchmark Comparator */}
            <div className="lg:col-span-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 space-y-5 tabular-nums">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {origin} → {destination}
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setNeed("parcel")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                      need === "parcel"
                        ? "bg-[#0F172A] text-white border-[#0F172A]"
                        : "bg-[#FFFFFF] text-slate-700 border-[#E2E8F0]"
                    }`}
                  >
                    {text("Colis", "Parcel")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNeed("shop")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                      need === "shop"
                        ? "bg-[#0F172A] text-white border-[#0F172A]"
                        : "bg-[#FFFFFF] text-slate-700 border-[#E2E8F0]"
                    }`}
                  >
                    Shop &amp; Go
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>{text("Poids du colis", "Parcel weight")}</span>
                  <strong className="text-sm font-black text-slate-900">{weight} kg</strong>
                </div>
                <input
                  type="range"
                  min={1}
                  max={23}
                  aria-label={text("Poids (kg)", "Weight (kg)")}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-[#2563EB]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-1.5">
                  {(["DHL", "FedEx", "Chronopost"] as const).map((comp) => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => {
                        setCompetitor(comp);
                        setHasCustomQuote(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        competitor === comp
                          ? "bg-[#0F172A] text-white border-[#0F172A]"
                          : "bg-[#FFFFFF] text-slate-700 border-[#E2E8F0]"
                      }`}
                    >
                      {comp}
                    </button>
                  ))}
                </div>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span>{c.quote}</span>
                  <input
                    type="number"
                    min={1}
                    value={quote}
                    onChange={(e) => {
                      setHasCustomQuote(true);
                      setCustomQuote(Math.max(1, Number(e.target.value) || 0));
                    }}
                    className="w-20 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] text-slate-900 font-bold"
                  />
                </label>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500">
                    {competitor} ({weight} kg)
                  </span>
                  <strong className="line-through text-slate-400 font-bold">
                    {quote} €
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">BagVoyage</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-2xl font-black text-[#059669]">{gross} €</strong>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-xs font-black">
                      −{percent} %
                    </span>
                  </div>
                </div>
              </div>

              <a
                href="/#explore"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold transition-colors no-underline"
              >
                <span>{text("Voir les voyageurs disponibles", "Browse available travelers")}</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Univers Humains & Photographiques */}
      <section id="features" className="bv-reveal-section py-12 sm:py-16 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2563EB]">
              {text("Trois modes intégrés", "Three integrated modes")}
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
                image: "/images/hero-airport-traveler.jpg",
                stat: text("Jusqu'à +180 € / trajet", "Up to +€180 / trip"),
                title: text("Rentabilisez vos kilos libres", "Monetize unused luggage"),
                desc: text(
                  "Avion, ferry, voiture ou utilitaire : publiez votre trajet ou scannez votre billet.",
                  "Flight, ferry, car or van: publish your trip or scan your boarding pass.",
                ),
                cta: text("Ouvrir mode Voyageur", "Open Traveler mode"),
              },
              {
                href: "/#bagandgo",
                Icon: Package,
                badge: "Bag & Go",
                image: "/images/scene-handover-people.jpg",
                stat: text("Livraison 24h–48h", "24h–48h delivery"),
                title: text("Expédiez vos colis en 24h–48h", "Ship parcels in 24h–48h"),
                desc: text(
                  "Confiez vos plis ou bagages à un passager vérifié avec suivi photo et code PIN.",
                  "Send parcels with verified travelers tracked via photo proof and PIN.",
                ),
                cta: text("Ouvrir Bag & Go", "Open Bag & Go"),
              },
              {
                href: "/#shopandgo",
                Icon: ShoppingBag,
                badge: "Shop & Go",
                image: "/images/scene-boutique-paris.jpg",
                stat: text("Ticket officiel garanti", "Official receipt guaranteed"),
                title: text("Achetez à l’étranger", "Shop across borders"),
                desc: text(
                  "Parfums, high-tech ou articles introuvables avec ticket de caisse officiel.",
                  "Fragrances, tech or local goods bought with an official store receipt.",
                ),
                cta: text("Ouvrir Shop & Go", "Open Shop & Go"),
              },
            ].map(({ href, Icon, badge, image, stat, title, desc, cta }) => (
              <article
                key={badge}
                className="group bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={image}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-extrabold text-[#2563EB] shadow-xs">
                      <Icon size={13} />
                      <span>{badge}</span>
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/75 backdrop-blur-md text-[11px] font-bold text-white">
                      {stat}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 space-y-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                  <a
                    href={href}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2563EB] hover:underline no-underline"
                  >
                    <span>{cta}</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Protocole Sécurité 4 Étapes, Photographie Confiance & App Mobile */}
      <section
        id="mobile"
        className="bv-reveal-section bg-[#FFFFFF] text-slate-900 py-12 sm:py-16 px-4 sm:px-6 border-t border-[#E2E8F0]"
        aria-labelledby="mobile-title"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#059669]">
                {text("Confiance & Sécurité", "Trust & Security")}
              </span>
              <h2
                id="mobile-title"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1"
              >
                {c.trust}
              </h2>
            </div>

            {/* 4-Step Compact Protocol Row */}
            <ol className="grid grid-cols-2 sm:grid-cols-4 gap-3 list-none p-0 m-0">
              {[
                { n: "01", title: "KYC Vérifié", sub: text("Identité contrôlée", "Verified ID") },
                { n: "02", title: "Séquestre Stripe", sub: text("Fonds cantonnés", "Escrow held") },
                { n: "03", title: "Photo & QR", sub: text("Preuve départ", "Departure check") },
                { n: "04", title: "Code PIN", sub: text("Déblocage net", "Instant payout") },
              ].map((step) => (
                <li
                  key={step.n}
                  className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1"
                >
                  <span className="text-[10px] font-extrabold text-[#059669] tabular-nums">
                    {step.n}
                  </span>
                  <strong className="block text-xs sm:text-sm font-bold text-slate-900">
                    {step.title}
                  </strong>
                  <span className="block text-[11px] text-slate-500">{step.sub}</span>
                </li>
              ))}
            </ol>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <AppStoreBadges language={language} onClick={openMobileLaunch} />
                <a
                  href="#download"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] no-underline"
                >
                  <Smartphone size={16} />
                  <span>{text("Découvrir l’app mobile", "Explore mobile app")}</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
              <MobileWaitlistForm language={language} />
            </div>
          </div>

          {/* Photographie Confiance Humaine + Passe Fret Hors-Ligne */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-xl aspect-[16/10] bg-slate-900">
              <img
                src="/images/scene-trust-passport.jpg"
                alt={text("Vérification identité et paiement sécurisé Stripe", "Identity verification and Stripe escrow handover")}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <div className="absolute top-3.5 right-3.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-extrabold shadow-sm inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#059669]" />
                <span>Powered by Stripe Connect</span>
              </div>
              <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    {text("TRAJET CERTIFIÉ · CDG → ALG", "CERTIFIED ROUTE · CDG → ALG")}
                  </span>
                  <strong className="block text-sm sm:text-base font-extrabold text-white">
                    {text("Remise validée par code PIN & photo scellée", "Handover verified via PIN & sealed photo")}
                  </strong>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#059669] text-white text-xs font-extrabold tabular-nums shrink-0">
                  15 kg · +140 €
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-slate-900 p-4 sm:p-5 space-y-2.5 shadow-xs tabular-nums">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="inline-flex items-center gap-1.5">
                  <Ticket size={15} className="text-[#2563EB]" />
                  {text("Passe hors-ligne aéroport", "Offline airport cargo pass")}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#059669] font-extrabold">BV-447B</span>
              </div>
              <PassBarcode />
              <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold pt-0.5">
                <span>Vol AH1021 · 5 kg · Porte K34</span>
                <span className="inline-flex items-center gap-1 text-slate-700">
                  <WifiOff size={12} /> {text("Mode aéroport", "Offline ready")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparatif Groupes Informels vs BagVoyage + FAQ (#F8FAFC) */}
      <section id="faq" className="bv-reveal-section bg-[#F8FAFC] border-t border-[#E2E8F0] py-12 sm:py-16 px-4 sm:px-6">
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
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                FAQ
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

      {/* Footer Lumineux #FFFFFF */}
      <footer className="bg-[#FFFFFF] text-slate-900 py-12 px-4 sm:px-6 border-t border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                BAGVOYAGE · FRANCE / ALGÉRIE / INTERNATIONAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {c.end.split("\n").map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </div>
            <a
              href="/#explore"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold transition-colors no-underline shrink-0 shadow-xs"
            >
              <span>{c.cta}</span>
              <ArrowUpRight size={18} />
            </a>
          </div>

          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600 pt-6 border-t border-[#E2E8F0]"
            aria-label={text("Liens de pied de page", "Footer links")}
          >
            <a href="/#how-it-works" className="hover:text-slate-900 no-underline">
              {text("Comment ça marche", "How it works")}
            </a>
            <a href="/#pricing" className="hover:text-slate-900 no-underline">
              {text("Tarifs & Comparateur", "Pricing & Comparison")}
            </a>
            <a href="/#trust" className="hover:text-slate-900 no-underline">
              {text("Sécurité & Séquestre", "Security & Escrow")}
            </a>
            <a href="/#faq" className="hover:text-slate-900 no-underline">
              {text("Centre d'Aide FAQ", "Help Center FAQ")}
            </a>
            <a href="#simulator" className="hover:text-slate-900 no-underline">
              {text("Simulateur", "Simulator")}
            </a>
            <a href="#mobile" className="hover:text-slate-900 no-underline">
              {text("Application Mobile", "Mobile App")}
            </a>
            <button
              type="button"
              onClick={() => setLegalDoc("cgu")}
              className="hover:text-slate-900 font-semibold cursor-pointer bg-transparent border-0 p-0 text-xs text-slate-600"
            >
              {text("CGU & CGV", "Terms & Conditions")}
            </button>
            <button
              type="button"
              onClick={() => setLegalDoc("privacy")}
              className="hover:text-slate-900 font-semibold cursor-pointer bg-transparent border-0 p-0 text-xs text-slate-600"
            >
              {text("Confidentialité RGPD", "Privacy & GDPR")}
            </button>
            <button
              type="button"
              onClick={() => setLegalDoc("mentions")}
              className="hover:text-slate-900 font-semibold cursor-pointer bg-transparent border-0 p-0 text-xs text-slate-600"
            >
              {text("Mentions légales", "Legal Notice")}
            </button>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-4 border-t border-[#E2E8F0]">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                <ShieldCheck size={14} className="text-[#059669]" />
                Stripe Connect Escrow
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                <CheckCircle2 size={14} className="text-[#059669]" />
                {text("Scellé STEB & QR", "STEB Seal & QR")}
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                <LockKeyhole size={14} className="text-slate-500" />
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
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 underline cursor-pointer"
                >
                  Super Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {legalDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          onClick={() => setLegalDoc(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xl p-6 space-y-5 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                  <FileText size={18} />
                </span>
                <div>
                  <h3 id="legal-modal-title" className="text-lg font-extrabold text-slate-900">
                    {legalDoc === "cgu"
                      ? text("Conditions Générales d'Utilisation & de Vente", "Terms of Service & Sale")
                      : legalDoc === "privacy"
                        ? text("Politique de Confidentialité (RGPD)", "Privacy Policy (GDPR)")
                        : text("Mentions Légales", "Legal Notice")}
                  </h3>
                  <p className="text-xs text-slate-500">BagVoyage · {text("Mise à jour novembre 2026", "Updated November 2026")}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLegalDoc(null)}
                aria-label={text("Fermer", "Close")}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-[#F8FAFC] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {legalDoc === "cgu" && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">1. {text("Objet de la plateforme", "Platform Purpose")}</h4>
                  <p>
                    {text(
                      "BagVoyage met en relation des voyageurs disposant de capacité bagage disponible avec des expéditeurs de colis et des acheteurs en boutique/Duty-Free (Voyageur, Bag & Go, Shop & Go).",
                      "BagVoyage connects travelers with spare luggage allowance to parcel senders and retail/Duty-Free shoppers (Voyageur, Bag & Go, Shop & Go).",
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">2. {text("Séquestre Stripe Connect & Libération des fonds", "Stripe Connect Escrow & Payout Release")}</h4>
                  <p>
                    {text(
                      "Les paiements sont cantonnés sous séquestre bancaire dès la validation de la réservation. Les fonds ne sont libérés au voyageur qu'après inspection du colis, remise en main propre et saisie du code PIN à 4 chiffres ou double validation QR.",
                      "Payments are held in escrow upon booking confirmation. Funds are released to the traveler only after physical handover verification via the 4-digit PIN code or dual QR validation.",
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">3. {text("Articles interdits & Douanes", "Prohibited Items & Customs")}</h4>
                  <p>
                    {text(
                      "Sont strictement interdits : produits stupéfiants, armes, contrefaçons, liquides inflammables, denrées périssables non déclarées et batteries lithium hors normes IATA. Chaque utilisateur s'engage à déclarer loyalement le contenu et à respecter la réglementation douanière du pays de destination.",
                      "Strictly prohibited: narcotics, weapons, counterfeits, flammable liquids, undeclared perishables, and non-IATA compliant lithium batteries. Users commit to accurate content declarations and customs compliance.",
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">4. {text("Annulations & Litiges", "Cancellations & Disputes")}</h4>
                  <p>
                    {text(
                      "En cas d'annulation avant prise en charge ou de non-remise avérée, l'intégralité du montant séquestré est remboursée. Tout litige doit être signalé sous 48h avec les preuves photo horodatées du scellé.",
                      "Cancellations prior to collection or verified non-delivery trigger a full escrow refund. Any dispute must be reported within 48 hours with timestamped seal photo evidence.",
                    )}
                  </p>
                </div>
              </div>
            )}

            {legalDoc === "privacy" && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">1. {text("Données collectées & Finalité", "Collected Data & Purpose")}</h4>
                  <p>
                    {text(
                      "BagVoyage traite uniquement les données nécessaires à la mise en relation, à la vérification d'identité (KYC) et à la sécurisation des transactions : nom, e-mail, téléphone, détails de trajet, justificatifs de voyage et preuves de remise.",
                      "BagVoyage processes only data required for matching, identity verification (KYC), and transaction security: name, email, phone, trip details, travel tickets, and handover proofs.",
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">2. {text("Conservation & Sécurité", "Retention & Security")}</h4>
                  <p>
                    {text(
                      "Les données de paiement bancaire sont traitées directement par Stripe (certifié PCI-DSS niveau 1) et ne transitent pas en clair sur nos serveurs applicatifs. Les communications sont chiffrées en TLS 256-bit.",
                      "Payment instrument details are handled directly by Stripe (PCI-DSS Level 1) and are never stored in plaintext on our application servers. All traffic is TLS 256-bit encrypted.",
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">3. {text("Vos droits RGPD", "Your GDPR Rights")}</h4>
                  <p>
                    {text(
                      "Conformément au Règlement (UE) 2016/679, vous disposez d'un droit d'accès, de rectification, de portabilité et d'effacement de vos données en écrivant à dpo@bagvoyage.com.",
                      "Under EU Regulation 2016/679 (GDPR), you have the right to access, rectify, port, and erase your personal data by contacting dpo@bagvoyage.com.",
                    )}
                  </p>
                </div>
              </div>
            )}

            {legalDoc === "mentions" && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{text("Éditeur de la plateforme", "Platform Publisher")}</h4>
                  <p>
                    {text(
                      "BagVoyage SAS — Plateforme numérique d'intermédiation collaborative pour le transport de bagages et l'achat assisté international (corridors Europe / Afrique du Nord / Monde).",
                      "BagVoyage SAS — Digital collaborative platform connecting international travelers, parcel senders, and personal shoppers.",
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{text("Prestataire de services de paiement", "Payment Service Provider")}</h4>
                  <p>
                    {text(
                      "Les services de paiement et le cantonnement des fonds sous séquestre sont opérés via Stripe Connect conformément aux directives européennes DSP2.",
                      "Payment processing and escrow fund custody are operated through Stripe Connect in accordance with European PSD2 regulations.",
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{text("Contact & Support", "Contact & Support")}</h4>
                  <p>support@bagvoyage.com · dpo@bagvoyage.com</p>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
              <button
                type="button"
                onClick={() => setLegalDoc(null)}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer"
              >
                {text("J'ai compris", "Got it")}
              </button>
            </div>
          </div>
        </div>
      )}

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
