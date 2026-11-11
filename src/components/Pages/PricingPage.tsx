import { useState } from "react";
import {
  ArrowRight,
  Check,
  Coins,
  Globe2,
  Percent,
  Scale,
  ShieldAlert,
  Zap,
  Menu,
} from "lucide-react";
import { BrandMark } from "../BrandMark";
import { ThemeToggle } from "../common/ThemeToggle";
import { LandingMobileMenu } from "../Navigation/LandingMobileMenu";

export function PricingPage({
  language = "fr",
  navigate,
}: {
  language?: "fr" | "en";
  navigate: (route: string) => void;
}) {
  const [weight, setWeight] = useState(5);
  const [corridor, setCorridor] = useState<"algeria" | "canada" | "middle_east" | "africa">("algeria");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isFr = language === "fr";

  const ratePerKg = {
    algeria: 8,
    canada: 12,
    middle_east: 11,
    africa: 10,
  }[corridor];

  const bagVoyagePrice = weight * ratePerKg;
  const dhlPrice = Math.round(55 + weight * 18);
  const savingsPct = Math.round(((dhlPrice - bagVoyagePrice) / dhlPrice) * 100);

  return (
    <div className="seo-page pricing-page">
      <header className="seo-page-header">
        <div className="seo-header-inner">
          <div className="seo-brand" onClick={() => navigate("explore")}>
            <BrandMark />
          </div>
          <nav className="seo-nav-links">
            <button type="button" onClick={() => navigate("landing")}>
              {isFr ? "Accueil" : "Home"}
            </button>
            <button type="button" onClick={() => navigate("how-it-works")}>
              {isFr ? "Comment ça marche" : "How it works"}
            </button>
            <button type="button" className="active" onClick={() => navigate("pricing")}>
              {isFr ? "Tarifs" : "Pricing"}
            </button>
            <button type="button" onClick={() => navigate("trust")}>
              {isFr ? "Sécurité" : "Trust"}
            </button>
            <button type="button" onClick={() => navigate("faq")}>
              FAQ
            </button>
          </nav>
          <div className="seo-header-actions">
            <ThemeToggle />
            <button
              type="button"
              className="seo-cta-button"
              onClick={() => navigate("explore")}
            >
              {isFr ? "Ouvrir l'application" : "Open App"}
              <ArrowRight size={15} />
            </button>
            <button
              type="button"
              className="seo-mobile-menu-trigger"
              aria-label={isFr ? "Ouvrir le menu de navigation" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <LandingMobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        language={isFr ? "fr" : "en"}
        currentRoute="pricing"
        navigate={navigate}
      />

      <main className="seo-main-content">
        <div className="seo-hero-banner">
          <span className="seo-kicker">
            {isFr ? "TARIFS CLAIRS & SANS SURPRISE" : "TRANSPARENT CORRIDOR PRICING"}
          </span>
          <h1>
            {isFr
              ? "Tarifs et comparateur BagVoyage"
              : "BagVoyage Rates & Cost Comparison"}
          </h1>
          <p className="seo-hero-sub">
            {isFr
              ? "Jusqu'à 70 % plus économique que les transporteurs express internationaux, livré en main propre en quelques heures le jour même du vol."
              : "Up to 70% cheaper than traditional express couriers, hand-delivered in hours upon flight arrival."}
          </p>
        </div>

        <div className="pricing-calculator-card">
          <div className="calculator-controls">
            <div className="calculator-field corridor-field">
              <span>{isFr ? "Couloir aérien" : "Travel Corridor"}</span>
              <div className="corridor-pills-grid" role="radiogroup" aria-label={isFr ? "Choisir le couloir" : "Choose corridor"}>
                {[
                  { id: "algeria", label: isFr ? "France / Europe – Algérie" : "France / Europe – Algeria", rate: "8 € / kg" },
                  { id: "canada", label: isFr ? "Europe – Transatlantique" : "Europe – Transatlantic", rate: "12 € / kg" },
                  { id: "middle_east", label: isFr ? "Europe – Moyen-Orient" : "Europe – Middle East", rate: "11 € / kg" },
                  { id: "africa", label: isFr ? "Europe – Afrique Subsaharienne" : "Europe – Sub-Saharan Africa", rate: "10 € / kg" },
                ].map((c) => {
                  const isSelected = corridor === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`corridor-pill-btn ${isSelected ? "active" : ""}`}
                      onClick={() => setCorridor(c.id as any)}
                    >
                      <span className="corridor-pill-title">{c.label}</span>
                      <span className="corridor-pill-rate">{c.rate}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="calculator-field">
              <div className="weight-header">
                <span>{isFr ? "Poids du colis" : "Parcel weight"}</span>
                <strong>{weight} kg</strong>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                aria-label={isFr ? "Sélectionner le poids" : "Select weight"}
              />
            </label>
          </div>

          <div className="calculator-results-grid">
            <div className="result-tile bagvoyage-tile">
              <span className="tile-label">BagVoyage</span>
              <div className="tile-price">
                <strong>{bagVoyagePrice} €</strong>
                <span>{isFr ? "tout inclus" : "all included"}</span>
              </div>
              <ul className="tile-perks">
                <li><Check size={14} /> {isFr ? "Livraison le jour même du vol" : "Same-day flight delivery"}</li>
                <li><Check size={14} /> {isFr ? "Séquestre bancaire sécurisé" : "Protected escrow payment"}</li>
                <li><Check size={14} /> {isFr ? "Vérification en main propre" : "Hand-to-hand verification"}</li>
              </ul>
            </div>

            <div className="result-tile competitor-tile">
              <span className="tile-label">{isFr ? "Express traditionnel (DHL / FedEx)" : "Traditional Courier (DHL / FedEx)"}</span>
              <div className="tile-price">
                <del>{dhlPrice} €</del>
                <span>{isFr ? "+ frais de dossier" : "+ customs handling"}</span>
              </div>
              <div className="savings-badge">
                <Percent size={15} />
                <span>{isFr ? `Économisez ${savingsPct} % avec BagVoyage` : `Save ${savingsPct}% with BagVoyage`}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pricing-breakdown-section">
          <h2>{isFr ? "Une répartition 100 % transparente" : "100% Transparent Fee Structure"}</h2>
          <div className="breakdown-cards-grid">
            <div className="breakdown-card">
              <div className="breakdown-icon"><Coins size={22} /></div>
              <h3>85 %</h3>
              <strong>{isFr ? "Pour le voyageur" : "For the traveller"}</strong>
              <p>{isFr ? "Rémunération directe pour rentabiliser les kilos disponibles dans ses valises." : "Direct earnings to monetize spare baggage allowance."}</p>
            </div>
            <div className="breakdown-card">
              <div className="breakdown-icon"><ShieldAlert size={22} /></div>
              <h3>15 %</h3>
              <strong>{isFr ? "Frais de plateforme" : "Platform fee"}</strong>
              <p>{isFr ? "Finance la protection séquestre, la vérification d'identité (KYC) et le support 7j/7." : "Covers bank escrow security, identity verification (KYC), and 24/7 support."}</p>
            </div>
            <div className="breakdown-card">
              <div className="breakdown-icon"><Zap size={22} /></div>
              <h3>0 €</h3>
              <strong>{isFr ? "Frais cachés" : "Hidden fees"}</strong>
              <p>{isFr ? "Aucune taxe surprise ni frais de dossier imprévu lors de la remise." : "No unexpected surcharges or surprise handling fees at delivery."}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
