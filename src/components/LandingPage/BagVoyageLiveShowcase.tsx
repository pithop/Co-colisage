import { useEffect, useState } from "react";
import {
  ArrowRight,
  BatteryFull,
  Camera,
  Car,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Package,
  Pause,
  Plane,
  Play,
  QrCode,
  ShieldCheck,
  Ship,
  ShoppingBag,
  Signal,
  Sparkles,
  Wallet,
} from "lucide-react";

export type ShowcaseScenario = "voyageur" | "bagandgo" | "shopandgo";
export type ShowcaseTransport = "avion" | "bateau" | "voiture";

function toRouteCode(value?: string, fallback = "CDG"): string {
  if (!value || !value.trim()) return fallback;
  const iata = value.match(/\(([A-Z]{3})\)/);
  if (iata) return iata[1];
  const letters = value.replace(/[^a-zA-ZÀ-ÿ]/g, "").slice(0, 3).toUpperCase();
  return letters.length >= 2 ? letters : fallback;
}

interface BeatContent {
  stepTag: string;
  title: string;
  subtitle: string;
  islandLabel: string;
  badgeText: string;
  amountLabel: string;
  amountValue: string;
  routeFrom: string;
  routeTo: string;
  metaLeft: string;
  metaRight: string;
  pinDigits?: string[];
}

const SCENARIO_DATA: Record<
  ShowcaseScenario,
  {
    labelFr: string;
    labelEn: string;
    accentHex: string;
    icon: typeof Plane;
    beats: [BeatContent, BeatContent, BeatContent];
  }
> = {
  voyageur: {
    labelFr: "Voyageur",
    labelEn: "Traveler",
    accentHex: "#2563EB",
    icon: Plane,
    beats: [
      {
        stepTag: "01 · Scan & Match",
        title: "Billet IATA vérifié en 2 sec",
        subtitle: "Vol AH1021 détecté · 15 kg libres en soute",
        islandLabel: "Vol AH1021 · Vérifié",
        badgeText: "2 demandes compatibles",
        amountLabel: "Gain net estimé",
        amountValue: "+140 €",
        routeFrom: "CDG",
        routeTo: "ALG",
        metaLeft: "Karim B. · Note 4.95",
        metaRight: "Départ J-2",
      },
      {
        stepTag: "02 · Séquestre & Scellé",
        title: "Fonds bloqués · Scellé STEB",
        subtitle: "Photo de conformité validée avant embarquement",
        islandLabel: "Séquestre actif · 140 €",
        badgeText: "Scellé #STEB-447B",
        amountLabel: "Sous séquestre Stripe",
        amountValue: "140,00 €",
        routeFrom: "CDG",
        routeTo: "ALG",
        metaLeft: "Photo & QR départ OK",
        metaRight: "En transit · 820 km/h",
      },
      {
        stepTag: "03 · Code PIN & Virement",
        title: "Remise confirmée par code PIN",
        subtitle: "Déblocage instantané vers votre IBAN ou RIB",
        islandLabel: "Livraison validée",
        badgeText: "PIN Destinataire OK",
        amountLabel: "Versé sur portefeuille",
        amountValue: "+140,00 €",
        routeFrom: "CDG",
        routeTo: "ALG",
        metaLeft: "Virement SEPA instantané",
        metaRight: "Reçu horodaté",
        pinDigits: ["4", "8", "2", "1"],
      },
    ],
  },
  bagandgo: {
    labelFr: "Bag & Go",
    labelEn: "Bag & Go",
    accentHex: "#2563EB",
    icon: Package,
    beats: [
      {
        stepTag: "01 · Gabarit & Tarif",
        title: "Carton 3,5 kg · 35×25×14 cm",
        subtitle: "Voyageur vérifié trouvé sur Marseille → Oran",
        islandLabel: "Économie −76 % vs DHL",
        badgeText: "Vol direct 24h",
        amountLabel: "Tarif tout compris",
        amountValue: "33 €",
        routeFrom: "MRS",
        routeTo: "ORN",
        metaLeft: "DHL : 110 €",
        metaRight: "Yacine M. · 4.9★",
      },
      {
        stepTag: "02 · Prise en charge QR",
        title: "Colis scellé & assuré 1 500 €",
        subtitle: "Preuve photo & suivi d'étape jusqu'à Oran",
        islandLabel: "En acheminement",
        badgeText: "QR Départ Scanné",
        amountLabel: "Garantie séquestre",
        amountValue: "Protégé",
        routeFrom: "MRS",
        routeTo: "ORN",
        metaLeft: "Zone embarquement",
        metaRight: "ETA 16h40",
      },
      {
        stepTag: "03 · Remise main propre",
        title: "Colis remis au destinataire",
        subtitle: "Le destinataire confirme avec le code PIN à 4 chiffres",
        islandLabel: "Colis livré ✓",
        badgeText: "Code PIN vérifié",
        amountLabel: "Mission clôturée",
        amountValue: "24h chrono",
        routeFrom: "MRS",
        routeTo: "ORN",
        metaLeft: "Signature numérique",
        metaRight: "100 % conforme",
        pinDigits: ["7", "1", "9", "3"],
      },
    ],
  },
  shopandgo: {
    labelFr: "Shop & Go",
    labelEn: "Shop & Go",
    accentHex: "#059669",
    icon: ShoppingBag,
    beats: [
      {
        stepTag: "01 · Panier Boutique",
        title: "Parfum & High-Tech Duty-Free",
        subtitle: "Article Galeries Lafayette / Aéroport CDG",
        islandLabel: "Demande Shop & Go",
        badgeText: "Ticket fiscal requis",
        amountLabel: "Budget article",
        amountValue: "110 €",
        routeFrom: "PAR",
        routeTo: "ALG",
        metaLeft: "Boutique officielle",
        metaRight: "+25 € commission",
      },
      {
        stepTag: "02 · Achat & Justificatif",
        title: "Ticket de caisse scanné en caisse",
        subtitle: "Montant bloqué sous séquestre Stripe Connect",
        islandLabel: "Ticket validé · +25 €",
        badgeText: "Reçu conforme",
        amountLabel: "Séquestre bloqué",
        amountValue: "135,00 €",
        routeFrom: "PAR",
        routeTo: "ALG",
        metaLeft: "Photo ticket OK",
        metaRight: "En vol retour",
      },
      {
        stepTag: "03 · Remise & Remboursement",
        title: "Remboursé + commission libérée",
        subtitle: "Code PIN validé · avance remboursée à l'euro près",
        islandLabel: "Paiement libéré",
        badgeText: "Commission +25 €",
        amountLabel: "Crédité à Inès B.",
        amountValue: "+135,00 €",
        routeFrom: "PAR",
        routeTo: "ALG",
        metaLeft: "Zéro frais cachés",
        metaRight: "Note 5.0 / 5",
        pinDigits: ["9", "3", "0", "5"],
      },
    ],
  },
};

export function BagVoyageLiveShowcase({
  activeScenario,
  onScenarioChange,
  transportType = "avion",
  originLabel,
  destinationLabel,
  language = "fr",
}: {
  activeScenario: ShowcaseScenario;
  onScenarioChange?: (scenario: ShowcaseScenario) => void;
  transportType?: ShowcaseTransport;
  originLabel?: string;
  destinationLabel?: string;
  language?: "fr" | "en";
}) {
  const [beatIndex, setBeatIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return true;
  });
  const [isHovered, setIsHovered] = useState(false);

  // Reset beat smoothly when scenario changes
  useEffect(() => {
    setBeatIndex(0);
  }, [activeScenario]);

  // Autonomous cycling every 3.4s when active & not paused/hovered
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const timer = window.setInterval(() => {
      setBeatIndex((prev) => (prev + 1) % 3);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [isPlaying, isHovered, activeScenario]);

  const scenario = SCENARIO_DATA[activeScenario];
  const beat = scenario.beats[beatIndex];
  const ScenarioIcon =
    activeScenario === "voyageur"
      ? transportType === "bateau"
        ? Ship
        : transportType === "voiture"
          ? Car
          : Plane
      : scenario.icon;
  const CraftIcon =
    activeScenario === "voyageur"
      ? transportType === "bateau"
        ? Ship
        : transportType === "voiture"
          ? Car
          : Plane
      : activeScenario === "bagandgo"
        ? Package
        : Plane;
  const displayFrom = toRouteCode(originLabel, beat.routeFrom);
  const displayTo = toRouteCode(destinationLabel, beat.routeTo);
  const displayTitle =
    activeScenario === "voyageur" && beatIndex === 0 && transportType === "bateau"
      ? "Traversée ferry vérifiée en 2 sec"
      : activeScenario === "voyageur" && beatIndex === 0 && transportType === "voiture"
        ? "Trajet véhicule vérifié en 2 sec"
        : beat.title;
  const displaySubtitle =
    activeScenario === "voyageur" && beatIndex === 0 && transportType === "bateau"
      ? "Ferry Méditerranée · Espace cabine & soute disponible"
      : activeScenario === "voyageur" && beatIndex === 0 && transportType === "voiture"
        ? "Liaison express porte-à-porte · Coffre sécurisé"
        : beat.subtitle;
  const text = (fr: string, en: string) => (language === "fr" ? fr : en);

  const progressRatio = beatIndex === 0 ? 0.14 : beatIndex === 1 ? 0.58 : 1;

  return (
    <div
      className="relative flex flex-col items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={() => setIsHovered(false)}
      role="region"
      aria-label={text(
        "Démonstration interactive autonome de BagVoyage",
        "BagVoyage autonomous interactive demonstration",
      )}
    >
      {/* Scenario Switcher + Play/Pause Control (WCAG 2.2.2) */}
      <div className="flex items-center justify-center gap-2 mb-4 w-full max-w-[368px]">
        <div
          className="inline-flex items-center p-1 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex-1 min-w-0"
          role="group"
          aria-label={text("Scénarios de démonstration", "Demo scenarios")}
        >
          {(["voyageur", "bagandgo", "shopandgo"] as ShowcaseScenario[]).map((key) => {
            const item = SCENARIO_DATA[key];
            const Icon = item.icon;
            const active = activeScenario === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onScenarioChange?.(key)}
                className={`flex-1 min-h-[36px] inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-[#0F172A] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon size={12} aria-hidden="true" />
                <span>{language === "fr" ? item.labelFr : item.labelEn}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={
            isPlaying
              ? text("Mettre l'animation en pause", "Pause animation")
              : text("Relancer l'animation", "Play animation")
          }
          title={isPlaying ? text("Pause", "Pause") : text("Lecture", "Play")}
          className="w-10 h-10 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-xs cursor-pointer shrink-0"
        >
          {isPlaying ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
        </button>
      </div>

      {/* Tactile iPhone Device Shell */}
      <div className="relative w-full max-w-[344px] rounded-[42px] bg-[#0F172A] border-[6px] border-slate-800 p-3.5 shadow-2xl shadow-slate-950/25 overflow-hidden">
        {/* Status Bar + Dynamic Island */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 px-2 pb-2.5">
          <span className="tabular-nums">9:41</span>

          {/* Dynamic Island Live Activity Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black border border-white/10 text-[10px] font-bold text-white shadow-inner max-w-[170px]">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                beatIndex === 2
                  ? "bg-[#10B981]"
                  : beatIndex === 1
                    ? "bg-[#2563EB]"
                    : "bg-sky-400"
              }`}
              aria-hidden="true"
            />
            <span className="truncate">{beat.islandLabel}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-300">
            <Signal size={12} aria-hidden="true" />
            <BatteryFull size={14} aria-hidden="true" />
          </div>
        </div>

        {/* Interactive Phone Screen Canvas */}
        <div className="rounded-[28px] bg-[#F8FAFC] text-slate-900 p-3.5 space-y-3 border border-white/10 min-h-[348px] flex flex-col justify-between">
          {/* App Mini Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
                <ScenarioIcon size={14} aria-hidden="true" />
              </div>
              <div className="leading-tight">
                <span className="text-xs font-extrabold text-slate-900 block">
                  BagVoyage
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  {language === "fr" ? scenario.labelFr : scenario.labelEn} · Live
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] text-[10px] font-bold">
              <ShieldCheck size={11} aria-hidden="true" />
              Stripe
            </span>
          </div>

          {/* 3-Step Interactive Progress Pills with Autonomous Timer Sweep */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-200/70">
            {[
              { idx: 0, label: text("1. Match", "1. Match") },
              { idx: 1, label: text("2. Séquestre", "2. Escrow") },
              { idx: 2, label: text("3. Code PIN", "3. PIN") },
            ].map((step) => {
              const isActive = beatIndex === step.idx;
              const isDone = beatIndex > step.idx;
              return (
                <button
                  key={step.idx}
                  type="button"
                  onClick={() => setBeatIndex(step.idx)}
                  className={`relative overflow-hidden py-1.5 px-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#FFFFFF] text-[#2563EB] shadow-2xs"
                      : isDone
                        ? "text-[#059669]"
                        : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>{step.label}</span>
                  {isActive && (
                    <span
                      key={`timer-${activeScenario}-${beatIndex}-${isPlaying}`}
                      data-playing={isPlaying ? "true" : "false"}
                      data-paused={isHovered ? "true" : "false"}
                      className="bv-showcase-timer-fill absolute inset-x-1.5 bottom-0.5 h-[2px] rounded-full bg-[#2563EB]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Animated Morphing Card Scene (compositor-only transform & opacity) */}
          <div
            key={`${activeScenario}-${beatIndex}`}
            className="bv-showcase-stage rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-3.5 shadow-sm space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles size={10} aria-hidden="true" />
                {beat.stepTag}
              </span>
              <span className="text-[10px] font-bold text-[#059669] bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full whitespace-nowrap">
                {beat.badgeText}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                {displayTitle}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {displaySubtitle}
              </p>
            </div>

            {/* Live Corridor Arc & GPU-Composited Craft Tracker */}
            <div className="rounded-xl bg-[#0F172A] text-white p-3 space-y-2">
              <div className="flex items-center justify-between text-sm font-black tracking-tight tabular-nums">
                <span>{displayFrom}</span>
                <div className="relative flex-1 mx-3 h-5 flex items-center">
                  <div className="w-full h-[2px] rounded-full bg-white/15 overflow-hidden">
                    <div
                      className="h-full bg-[#10B981] bv-showcase-progress-bar origin-left"
                      style={{ transform: `scaleX(${progressRatio})` }}
                    />
                  </div>
                  <div
                    className="absolute left-0 bv-showcase-plane w-5 h-5 rounded-full bg-[#2563EB] border border-white/40 flex items-center justify-center shadow-md"
                    style={{
                      transform: `translateX(${Math.round(progressRatio * 108)}px)`,
                    }}
                    aria-hidden="true"
                  >
                    <CraftIcon size={10} className="text-white" />
                  </div>
                </div>
                <span>{displayTo}</span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium tabular-nums">
                <span>{beat.metaLeft}</span>
                <span className="text-emerald-400 font-bold">{beat.metaRight}</span>
              </div>
            </div>

            {/* Beat-Specific Visual Action Row */}
            {beatIndex === 0 && (
              <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {beat.amountLabel}
                  </span>
                  <strong className="text-lg font-black text-[#059669] tabular-nums">
                    {beat.amountValue}
                  </strong>
                </div>
                <a
                  href={`/#${activeScenario}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-bold no-underline transition-colors"
                >
                  <span>{text("GO · Accepter", "GO · Accept")}</span>
                  <ArrowRight size={12} aria-hidden="true" />
                </a>
              </div>
            )}

            {beatIndex === 1 && (
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E2E8F0]">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <LockKeyhole size={14} className="text-[#059669] shrink-0" aria-hidden="true" />
                  <div className="leading-tight min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">
                      {beat.amountLabel}
                    </span>
                    <strong className="text-xs font-extrabold text-slate-900 tabular-nums">
                      {beat.amountValue}
                    </strong>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <Camera size={14} className="text-[#2563EB] shrink-0" aria-hidden="true" />
                  <div className="leading-tight min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">
                      Preuve
                    </span>
                    <strong className="text-xs font-extrabold text-[#059669] inline-flex items-center gap-1">
                      <QrCode size={11} aria-hidden="true" /> Validée
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {beatIndex === 2 && (
              <div className="space-y-2 pt-1 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <KeyRound size={13} className="text-[#059669] mr-0.5 shrink-0" aria-hidden="true" />
                    {(beat.pinDigits || ["4", "8", "2", "1"]).map((digit, i) => (
                      <span
                        key={i}
                        style={{ animationDelay: `${i * 55}ms` }}
                        className="bv-pin-digit w-6 h-7 rounded-lg bg-[#ECFDF5] border border-[#059669]/30 text-[#059669] font-mono font-black text-xs flex items-center justify-center tabular-nums"
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                      {beat.amountLabel}
                    </span>
                    <strong className="text-sm font-black text-[#059669] inline-flex items-center gap-1 tabular-nums">
                      <Wallet size={12} aria-hidden="true" />
                      {beat.amountValue}
                    </strong>
                  </div>
                </div>
                <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-bold text-slate-700">
                  <span>{text("4 critères · Super Voyageur", "4 criteria · Super Traveler")}</span>
                  <span className="text-[#059669] tabular-nums">5.0 / 5</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Home Bar Footer inside Phone */}
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 px-1 pt-0.5">
            <a
              href={`/#${activeScenario}`}
              className="inline-flex items-center gap-1 text-[#059669] hover:underline font-bold no-underline"
            >
              <CheckCircle2 size={12} aria-hidden="true" />
              {text("Tester ce parcours en direct", "Try this flow live")}
            </a>
            <span className="tabular-nums">
              {beatIndex + 1} / 3
            </span>
          </div>
        </div>

        {/* iOS Home Indicator */}
        <div className="pt-2.5 flex justify-center" aria-hidden="true">
          <div className="w-24 h-1 rounded-full bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
