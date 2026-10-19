import { useEffect, useState } from "react";
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
} from "lucide-react";
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
    demo: "Scénario de présentation / chiffres fournis, non audités",
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
    demo: "Presentation scenario / supplied, unaudited figures",
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
      "Cette version utilise un registre local de démonstration. La conservation et le déblocage de fonds réels nécessitent une intégration de paiement activée et contrôlée côté serveur.",
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
      "This version uses a local demonstration ledger. Real funds require an activated payment integration with server-side controls.",
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
export function AwwwardsLanding({
  initialLanguage = "fr",
}: {
  initialLanguage?: "fr" | "en";
}) {
  const [language, setLanguage] = useState<"fr" | "en">(initialLanguage);
  const [origin, setOrigin] = useState("Paris");
  const [destination, setDestination] = useState("Alger");
  const [need, setNeed] = useState("parcel");
  const [weight, setWeight] = useState(5);
  const [competitor, setCompetitor] = useState("DHL");
  const [quote, setQuote] = useState(140);
  const c = copy[language];
  const routeRate =
    destination === "Montréal" || origin === "Montréal"
      ? 12
      : destination === "Paris" || origin === "Paris"
        ? 8
        : 7;
  const gross =
    origin === destination
      ? 0
      : weight * routeRate + (need === "shop" ? 20 : 0);
  const net = Math.round(gross * 85) / 100;
  const saving = origin === destination ? 0 : Math.max(0, quote - gross);
  const percent = quote > 0 ? Math.round((saving / quote) * 100) : 0;
  const text = (fr: string, en: string) => (language === "fr" ? fr : en);
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
      <div className="landing-masthead">
        <a href="/#landing" className="landing-wordmark">
          BagVoyage<span>.</span>
        </a>
        <span>PARIS / ALGER / EVERYWHERE</span>
        <label className="landing-language">
          <Globe2 size={16} />
          <select
            aria-label="Langue / Language"
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as typeof language)
            }
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        </label>
      </div>
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="eyebrow">{c.eyebrow}</span>
          <h1>
            {c.title}
            <br />
            <em>{c.accent}</em>
          </h1>
          <p>{c.intro}</p>
          <a className="landing-cta" href="/#explore">
            {c.cta}
            <ArrowUpRight size={21} />
          </a>
          <div className="landing-trust-chips">
            <span>
              <ScanLine size={16} />
              {text("Double remise vérifiée", "Verified handovers")}
            </span>
            <span>
              <Globe2 size={16} />
              {text(
                "Sans frontières dans l’esprit",
                "Connection across borders",
              )}
            </span>
          </div>
        </div>
        <div
          className="journey-art"
          aria-label={text(
            "Illustration du corridor Paris–Alger",
            "Illustration of the Paris–Algiers corridor",
          )}
          role="img"
        >
          <div className="journey-orbit orbit-one" />
          <div className="journey-orbit orbit-two" />
          <div className="journey-orbit orbit-three" />
          <svg
            className="journey-route"
            viewBox="0 0 440 480"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M108 116 C400 65 400 380 165 365"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="5 7"
            />
            <circle cx="108" cy="116" r="6" fill="currentColor" />
            <circle cx="165" cy="365" r="6" fill="currentColor" />
          </svg>
          <span className="journey-city city-paris">
            48°51′ N<br />
            <strong>Paris</strong>
          </span>
          <span className="journey-city city-alger">
            36°45′ N<br />
            <strong>Alger</strong>
          </span>
          <div className="journey-pass">
            <span>BAGVOYAGE / BOARDING TOGETHER</span>
            <div>
              <strong>CDG</strong>
              <Plane size={32} strokeWidth={1.3} />
              <strong>ALG</strong>
            </div>
            <p>
              {text("Une place pour ce qui compte.", "Room for what matters.")}
            </p>
            <footer>
              <span>
                {text("VOTRE PROCHAIN DÉPART", "YOUR NEXT DEPARTURE")}
              </span>
              <span>01 / ∞</span>
            </footer>
          </div>
          <div className="journey-stamp">
            <Package size={24} strokeWidth={1.4} />
            <span>
              HANDLE
              <br />
              WITH CARE
            </span>
          </div>
        </div>
      </section>
      <section className="landing-simulator" aria-labelledby="simulator-title">
        <div>
          <span className="eyebrow">
            01 / {text("FAITES LE CALCUL", "DO THE MATH")}
          </span>
          <h2 id="simulator-title">{c.simulate}</h2>
          <p>{c.estimated}</p>
        </div>
        <div className="simulator-controls">
          <div className="simulator-route">
            <label>
              {c.from}
              <select
                aria-label={c.from}
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
              >
                {["Paris", "Marseille", "Alger", "Oran", "Montréal"].map(
                  (city) => (
                    <option key={city}>{city}</option>
                  ),
                )}
              </select>
            </label>
            <button
              aria-label={text("Inverser le trajet", "Reverse route")}
              onClick={() => {
                setOrigin(destination);
                setDestination(origin);
              }}
            >
              <ArrowLeftRight size={19} />
            </button>
            <label>
              {c.to}
              <select
                aria-label={c.to}
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
              >
                {["Alger", "Oran", "Paris", "Marseille", "Montréal"].map(
                  (city) => (
                    <option key={city}>{city}</option>
                  ),
                )}
              </select>
            </label>
          </div>
          <fieldset>
            <legend>{c.need}</legend>
            <div className="simulator-segment">
              <button
                aria-pressed={need === "parcel"}
                onClick={() => setNeed("parcel")}
              >
                <Package size={17} />
                {c.parcel}
              </button>
              <button
                aria-pressed={need === "shop"}
                onClick={() => setNeed("shop")}
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
              type="range"
              min="1"
              max="30"
              value={weight}
              onChange={(event) => setWeight(Number(event.target.value))}
            />
          </label>
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
      </section>
      <section
        className="landing-metrics"
        aria-label={text("Indicateurs de présentation", "Presentation metrics")}
      >
        <p>{c.demo}</p>
        <div>
          {["+180 000 €", "14 250 kg", "36 h", "99.8 %"].map((value, index) => (
            <article key={value}>
              <strong>{value}</strong>
              <span>{c.metricLabels[index]}</span>
            </article>
          ))}
        </div>
      </section>
      <section className="landing-universes">
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
                "Envoyer un peu de chez soi.",
                "Send a little piece of home.",
              ),
              copy: text(
                "Photographiez, décrivez, confiez. Votre colis prend le chemin d’un voyage déjà prévu.",
                "Photograph, describe, hand over. Your parcel joins a journey already planned.",
              ),
              action: text("Je veux envoyer", "Send a parcel"),
              kind: "parcel",
            },
            {
              Icon: ShoppingBag,
              number: "02",
              title: text(
                "Trouver ce qui vous ressemble.",
                "Find what speaks to you.",
              ),
              copy: text(
                "Un lien, une taille, une envie. Un voyageur fait vos achats et vous les rapporte.",
                "A link, a size, a wish. A traveller shops for you and brings your finds home.",
              ),
              action: text("Découvrir Shop & Go", "Discover Shop & Go"),
              kind: "requests",
            },
            {
              Icon: Plane,
              number: "03",
              title: text(
                "Donner du sens au départ.",
                "Make your journey matter.",
              ),
              copy: text(
                "Vos kilos disponibles deviennent un service. Particulier ou professionnel, voyagez utile.",
                "Your available space becomes a service. Travel with purpose, privately or professionally.",
              ),
              action: text("Je prends la route", "Share a journey"),
              kind: "trips",
            },
          ].map(({ Icon, number, title, copy: description, action, kind }) => (
            <article key={number} className={`universe universe-${number}`}>
              <header>
                <Icon size={38} strokeWidth={1.2} />
                <span>{number}</span>
              </header>
              <h3>{title}</h3>
              <p>{description}</p>
              <a href={`/#publish/${kind}`}>
                {action}
                <ArrowUpRight size={19} />
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="landing-comparison">
        <div>
          <span className="eyebrow">
            03 / {text("UNE AUTRE FAÇON D’ACHEMINER", "ANOTHER WAY TO DELIVER")}
          </span>
          <h2>{c.compare}</h2>
          <p>{c.compareText}</p>
          <div className="savings-number">
            <strong>{percent}%</strong>
            <span>{c.saving}</span>
          </div>
          <p>
            {text(
              "Exemple : 42 € face à un devis de 140 € = 70 % d’économie.",
              "Example: €42 compared with a €140 quote = 70% savings.",
            )}
          </p>
        </div>
        <div className="comparison-panel">
          <label>
            {c.competitor}
            <select
              value={competitor}
              onChange={(event) => setCompetitor(event.target.value)}
            >
              {[
                "DHL",
                "FedEx",
                text("Fret aérien classique", "Air freight"),
              ].map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <label>
            {c.quote}
            <input
              type="number"
              min="0"
              max="100000"
              step="0.01"
              value={quote || ""}
              onChange={(event) =>
                setQuote(Math.max(0, Number(event.target.value)))
              }
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
      </section>
      <section className="landing-assurance">
        <span className="eyebrow">
          04 / {text("LE VOYAGE COMMENCE PAR LA CONFIANCE", "START WITH TRUST")}
        </span>
        <h2>{c.trust}</h2>
        <div>
          {[
            [
              ShieldCheck,
              "Stripe Connect",
              text(
                "Paiement prévu avec Stripe Connect. Aucun fonds réel n’est conservé tant que ce service n’est pas activé.",
                "Payments are planned with Stripe Connect. No real funds are held until this service is activated.",
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
                "Documentez la remise et l’état du colis. La valeur probatoire dépend du contexte et du droit applicable.",
                "Document the handover and parcel condition. Evidentiary value depends on context and applicable law.",
              ),
            ],
            [
              Globe2,
              text("Repères douaniers", "Customs guidance"),
              text(
                "France–Algérie : contenu, valeur et justificatifs. Les règles se vérifient avant chaque départ.",
                "France–Algeria: contents, value and documents. Check the rules before every departure.",
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
      </section>
      <section className="landing-faq">
        <div>
          <span className="eyebrow">
            05 / {text("LES RÉPONSES", "YOUR QUESTIONS")}
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
        <div>
          <strong>BagVoyage</strong>
          <span>FRANCE / ALGÉRIE / INTERNATIONAL</span>
          <span>© {new Date().getFullYear()} BagVoyage</span>
        </div>
      </footer>
    </div>
  );
}
