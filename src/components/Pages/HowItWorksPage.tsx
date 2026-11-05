import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Package,
  Plane,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { BrandMark } from "../BrandMark";
import { ThemeToggle } from "../common/ThemeToggle";

export function HowItWorksPage({
  language = "fr",
  navigate,
}: {
  language?: "fr" | "en";
  navigate: (route: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"sender" | "traveler" | "shop">("sender");

  const isFr = language === "fr";

  const stepsSender = isFr
    ? [
        {
          num: "01",
          title: "Publiez votre besoin d'expédition",
          desc: "Indiquez la ville de départ, la destination, le poids estimé et la date souhaitée. Ajoutez une photo du colis et une description précise.",
          icon: Package,
        },
        {
          num: "02",
          title: "Connectez-vous avec un voyageur vérifié",
          desc: "Recevez des propositions de voyageurs effectuant exactement votre trajet. Discutez via notre messagerie chiffrée.",
          icon: UserCheck,
        },
        {
          num: "03",
          title: "Paiement sécurisé par séquestre bancaire",
          desc: "Votre argent est consigné sur un compte séquestre certifié. Le voyageur n'est payé qu'une fois le colis livré.",
          icon: Lock,
        },
        {
          num: "04",
          title: "Remise sécurisée avec code PIN & QR",
          desc: "À la réception, le destinataire transmet le code secret à usage unique au voyageur pour débloquer instantanément les fonds.",
          icon: QrCode,
        },
      ]
    : [
        {
          num: "01",
          title: "Post your parcel shipment",
          desc: "Specify departure, destination, estimated weight, and date. Add clear parcel photos and an accurate description.",
          icon: Package,
        },
        {
          num: "02",
          title: "Match with a verified traveller",
          desc: "Receive proposals from travellers flying your exact route. Chat securely via our encrypted messenger.",
          icon: UserCheck,
        },
        {
          num: "03",
          title: "Escrow-protected payment",
          desc: "Funds remain safely locked in escrow. The traveller is only paid after successful delivery.",
          icon: Lock,
        },
        {
          num: "04",
          title: "Secure delivery via PIN & QR",
          desc: "Upon delivery, the recipient provides a single-use secret verification code to release funds.",
          icon: QrCode,
        },
      ];

  const stepsTraveler = isFr
    ? [
        {
          num: "01",
          title: "Enregistrez votre vol ou traversée",
          desc: "Renseignez vos dates, aéroports ou ports, et le nombre de kilos disponibles dans vos valises (ex. 10 kg à 8 € / kg).",
          icon: Plane,
        },
        {
          num: "02",
          title: "Sélectionnez les colis compatibles",
          desc: "Consultez les demandes des expéditeurs sur votre itinéraire. Acceptez les colis dont vous pouvez vérifier le contenu.",
          icon: CheckCircle2,
        },
        {
          num: "03",
          title: "Contrôle visuel au départ",
          desc: "Inspectez le colis en main propre avant le départ pour vous assurer du respect strict des règles de sûreté aérienne.",
          icon: ShieldCheck,
        },
        {
          num: "04",
          title: "Recevez votre virement garanti",
          desc: "À l'atterrissage, saisissez le code PIN remis par le destinataire pour recevoir immédiatement votre rémunération sur votre compte.",
          icon: Sparkles,
        },
      ]
    : [
        {
          num: "01",
          title: "Register your flight or sea crossing",
          desc: "Enter your travel dates, route, and spare luggage allowance (e.g. 10 kg at 8 EUR / kg).",
          icon: Plane,
        },
        {
          num: "02",
          title: "Select compatible packages",
          desc: "Browse verified sender requests along your flight path. Accept items that meet airline baggage standards.",
          icon: CheckCircle2,
        },
        {
          num: "03",
          title: "Physical inspection at handoff",
          desc: "Inspect the parcel in person before boarding to ensure complete compliance with aviation security rules.",
          icon: ShieldCheck,
        },
        {
          num: "04",
          title: "Receive guaranteed payout",
          desc: "Upon handover, input the recipient's one-time PIN to receive your earnings instantly in your wallet.",
          icon: Sparkles,
        },
      ];

  const stepsShop = isFr
    ? [
        {
          num: "01",
          title: "Listez les articles souhaités",
          desc: "Indiquez les boutiques, liens et descriptions exactes des produits introuvables localement que vous désirez acquérir.",
          icon: ShoppingBag,
        },
        {
          num: "02",
          title: "Un voyageur effectue l'achat pour vous",
          desc: "Le voyageur achète le produit en magasin avec avance sécurisée par séquestre et conserve le ticket de caisse certifié.",
          icon: CheckCircle2,
        },
        {
          num: "03",
          title: "Transport et dédouanement régulier",
          desc: "L'article est transporté en conformité avec les franchises douanières personnelles en vigueur.",
          icon: Plane,
        },
        {
          num: "04",
          title: "Remise en mains propres",
          desc: "Vérifiez l'article et le ticket lors de la remise, puis transmettez le code secret pour rembourser l'achat et la prime du voyageur.",
          icon: QrCode,
        },
      ]
    : [
        {
          num: "01",
          title: "List requested products",
          desc: "Provide store links, brands, and clear descriptions of hard-to-find international items you wish to purchase.",
          icon: ShoppingBag,
        },
        {
          num: "02",
          title: "A traveller purchases your items",
          desc: "The traveller buys the item in-store, protected by escrow advance, keeping original receipts.",
          icon: CheckCircle2,
        },
        {
          num: "03",
          title: "Transport under customs limits",
          desc: "Your product travels safely within official personal duty-free customs allowances.",
          icon: Plane,
        },
        {
          num: "04",
          title: "Handover and final settlement",
          desc: "Inspect your items and receipt upon meeting, then provide your secret verification code.",
          icon: QrCode,
        },
      ];

  const currentSteps =
    activeTab === "sender"
      ? stepsSender
      : activeTab === "traveler"
      ? stepsTraveler
      : stepsShop;

  return (
    <div className="seo-page how-it-works-page">
      <header className="seo-page-header">
        <div className="seo-header-inner">
          <div className="seo-brand" onClick={() => navigate("explore")}>
            <BrandMark />
          </div>
          <nav className="seo-nav-links">
            <button type="button" onClick={() => navigate("landing")}>
              {isFr ? "Accueil" : "Home"}
            </button>
            <button type="button" className="active" onClick={() => navigate("how-it-works")}>
              {isFr ? "Comment ça marche" : "How it works"}
            </button>
            <button type="button" onClick={() => navigate("pricing")}>
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
          </div>
        </div>
      </header>

      <main className="seo-main-content">
        <div className="seo-hero-banner">
          <span className="seo-kicker">
            {isFr ? "FONCTIONNEMENT SIMPLE & SÉCURISÉ" : "SIMPLE & SECURE WORKFLOW"}
          </span>
          <h1>
            {isFr
              ? "Comment fonctionne le co-bagage BagVoyage ?"
              : "How does BagVoyage crowdshipping work?"}
          </h1>
          <p className="seo-hero-sub">
            {isFr
              ? "Mettez en relation des expéditeurs exigeants et des voyageurs de confiance pour acheminer vos colis et achats à prix transparent, garanti par séquestre bancaire."
              : "Connect senders with verified international travellers to move parcels and shopping orders with transparent escrow protection."}
          </p>
        </div>

        <div className="role-selector-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "sender"}
            className={`role-tab ${activeTab === "sender" ? "active" : ""}`}
            onClick={() => setActiveTab("sender")}
          >
            <Package size={18} />
            <span>{isFr ? "J'envoie un colis" : "I send a parcel"}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "traveler"}
            className={`role-tab ${activeTab === "traveler" ? "active" : ""}`}
            onClick={() => setActiveTab("traveler")}
          >
            <Plane size={18} />
            <span>{isFr ? "Je voyage et transporte" : "I am travelling"}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "shop"}
            className={`role-tab ${activeTab === "shop" ? "active" : ""}`}
            onClick={() => setActiveTab("shop")}
          >
            <ShoppingBag size={18} />
            <span>{isFr ? "Shop & Go sur commande" : "Shop & Go on demand"}</span>
          </button>
        </div>

        <div className="steps-timeline-grid">
          {currentSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="step-card">
                <div className="step-card-header">
                  <span className="step-number">{step.num}</span>
                  <div className="step-icon-bubble">
                    <Icon size={20} />
                  </div>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="seo-highlight-box">
          <div className="highlight-content">
            <ShieldCheck size={32} className="highlight-icon" />
            <div>
              <h3>{isFr ? "Protection intégrale à chaque étape" : "Full protection on every delivery"}</h3>
              <p>
                {isFr
                  ? "Chaque transaction est protégée par un séquestre bancaire indépendant, une vérification d'identité préalable et une validation par code secret à 6 chiffres unique."
                  : "Every transaction is backed by independent bank escrow, prior identity verification, and single-use 6-digit PIN confirmation."}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="highlight-action-btn"
            onClick={() => navigate("trust")}
          >
            {isFr ? "En savoir plus sur la sécurité" : "Learn about trust & safety"}
            <ArrowRight size={15} />
          </button>
        </div>
      </main>
    </div>
  );
}
