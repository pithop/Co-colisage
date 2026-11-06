import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  FileText,
  KeyRound,
  Lock,
  Scale,
  ShieldCheck,
  UserCheck,
  Menu,
} from "lucide-react";
import { BrandMark } from "../BrandMark";
import { ThemeToggle } from "../common/ThemeToggle";
import { LandingMobileMenu } from "../Navigation/LandingMobileMenu";

export function TrustPage({
  language = "fr",
  navigate,
}: {
  language?: "fr" | "en";
  navigate: (route: string) => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isFr = language === "fr";

  const trustPillars = isFr
    ? [
        {
          icon: Lock,
          title: "Séquestre bancaire certifié",
          desc: "Votre règlement n'est jamais versé directement au voyageur à l'avance. Il reste consigné sur un compte séquestre européen sécurisé et n'est libéré qu'après confirmation physique de la réception.",
        },
        {
          icon: UserCheck,
          title: "Vérification d'identité rigoureuse",
          desc: "Tous les voyageurs et expéditeurs doivent valider leur identité avec un document officiel valide (passeport ou CNI) et une vérification de profil avant de pouvoir conclure un accord.",
        },
        {
          icon: KeyRound,
          title: "Code de remise PIN à usage unique",
          desc: "Un code confidentiel à 6 chiffres est généré pour l'expéditeur et son destinataire. La transaction ne peut être validée sans la saisie conforme de ce code lors de la remise en mains propres.",
        },
        {
          icon: Scale,
          title: "Conformité Convention de Montréal",
          desc: "Les bagages et colis enregistrés bénéficient du cadre juridique international de la Convention de Montréal régissant la responsabilité aérienne du transporteur jusqu'à 1 288 DTS.",
        },
      ]
    : [
        {
          icon: Lock,
          title: "Certified Bank Escrow",
          desc: "Your payment is never sent in advance to the traveller. It stays securely locked in a regulated European escrow account and is released only upon confirmed handover.",
        },
        {
          icon: UserCheck,
          title: "Identity & Passport Verification",
          desc: "Travellers and senders undergo strict identity checks with valid government IDs (passport or national ID card) before confirming any logistics agreement.",
        },
        {
          icon: KeyRound,
          title: "Single-Use 6-Digit Verification PIN",
          desc: "A confidential single-use code is issued to the sender and recipient. Payout cannot occur without in-person PIN input upon parcel inspection.",
        },
        {
          icon: Scale,
          title: "Montreal Convention Protection",
          desc: "Air luggage travels under the international legal framework of the Montreal Convention, governing carrier baggage liability up to 1,288 SDR.",
        },
      ];

  const safetyChecklist = isFr
    ? [
        "Inspection visuelle obligatoire du contenu avant acceptation",
        "Interdiction formelle de sceller un colis sans vérification préalable",
        "Respect strict des listes d'articles prohibés par l'aviation civile (OACI/IATA)",
        "Traçabilité intégrale des échanges dans la messagerie chiffrée BagVoyage",
        "Assistance prioritaire 7j/7 en cas de retard ou d'imprévu de vol",
      ]
    : [
        "Mandatory in-person visual inspection before luggage acceptance",
        "Strict prohibition of accepting sealed boxes without checking contents",
        "Full compliance with ICAO/IATA civil aviation dangerous goods regulations",
        "End-to-end audit trail in BagVoyage's secure in-app messaging",
        "Dedicated 7-day customer support in case of flight delays or schedule changes",
      ];

  return (
    <div className="seo-page trust-page">
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
            <button type="button" onClick={() => navigate("pricing")}>
              {isFr ? "Tarifs" : "Pricing"}
            </button>
            <button type="button" className="active" onClick={() => navigate("trust")}>
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
        currentRoute="trust"
        navigate={navigate}
      />

      <main className="seo-main-content">
        <div className="seo-hero-banner">
          <span className="seo-kicker">
            {isFr ? "CONFIANCE & INTÉGRITÉ" : "TRUST & SAFETY ARCHITECTURE"}
          </span>
          <h1>
            {isFr
              ? "Sécurité, Séquestre et Garanties BagVoyage"
              : "Security, Escrow & Guarantees at BagVoyage"}
          </h1>
          <p className="seo-hero-sub">
            {isFr
              ? "Chaque colis et chaque euro sont protégés par des protocoles bancaires et réglementaires aux plus hauts standards de l'aviation internationale."
              : "Every parcel and payment is protected by banking and aviation regulatory safeguards built for complete peace of mind."}
          </p>
        </div>

        <div className="trust-pillars-grid">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="trust-pillar-card">
                <div className="pillar-icon-wrap">
                  <Icon size={24} />
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="safety-checklist-section">
          <div className="checklist-card">
            <h2>{isFr ? "Charte de Sûreté Aérienne & Douanière" : "Aviation & Customs Safety Charter"}</h2>
            <ul className="checklist-items">
              {safetyChecklist.map((item, idx) => (
                <li key={idx}>
                  <CheckCircle size={18} className="check-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="legal-notice-card">
          <FileText size={28} className="legal-icon" />
          <div>
            <h3>{isFr ? "Engagement juridique et transparence" : "Legal Framework & Transparency"}</h3>
            <p>
              {isFr
                ? "BagVoyage agit en tant que tiers de confiance technologique et plateforme d'intermédiation neutre. Les utilisateurs s'engagent formellement à respecter les législations douanières locales de chaque pays de départ et d'arrivée."
                : "BagVoyage operates as a trusted neutral platform. All community members commit to complying with local import, export, and duty-free regulations."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
