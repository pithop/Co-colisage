import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { BrandMark } from "../BrandMark";
import { ThemeToggle } from "../common/ThemeToggle";

interface FaqItem {
  id: string;
  category: "all" | "payment" | "customs" | "senders" | "travelers" | "claims";
  questionFr: string;
  questionEn: string;
  answerFr: string;
  answerEn: string;
}

export function FaqPage({
  language = "fr",
  navigate,
}: {
  language?: "fr" | "en";
  navigate: (route: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "1": true,
    "2": true,
  });

  const isFr = language === "fr";

  const allFaqs: FaqItem[] = [
    {
      id: "1",
      category: "payment",
      questionFr: "Comment fonctionne le séquestre bancaire ?",
      questionEn: "How does bank escrow work?",
      answerFr:
        "Lorsque vous réservez un transport ou une commande Shop & Go, votre paiement est consigné sur un compte séquestre européen sécurisé. Les fonds ne sont débloqués en faveur du voyageur qu'au moment précis où le destinataire confirme la bonne remise du colis via son code secret à usage unique.",
      answerEn:
        "When you confirm an order, funds are safely held in an independent European escrow account. Money is only transferred to the traveller when the recipient verifies the delivery using their unique one-time secret PIN code.",
    },
    {
      id: "2",
      category: "customs",
      questionFr: "Quelles sont les règles douanières et articles autorisés ?",
      questionEn: "What are customs rules and allowed items?",
      answerFr:
        "Le voyageur transporte les articles dans le cadre strict de ses franchises de bagages personnelles. Sont formellement interdits : stupéfiants, armes, contrefaçons, denrées périssables non déclarées et tout produit dangereux interdit par l'OACI et les douanes.",
      answerEn:
        "Luggage travels strictly under personal duty-free customs allowances. Prohibited items include drugs, counterfeit goods, weapons, perishable uninspected foods, and hazardous civil aviation materials.",
    },
    {
      id: "3",
      category: "senders",
      questionFr: "Que se passe-t-il si mon colis est endommagé ou perdu ?",
      questionEn: "What happens if my package is lost or damaged?",
      answerFr:
        "En cas d'anomalie constatée lors de la remise, l'expéditeur ne transmet pas le code de confirmation. Les fonds restent séquestrés et notre service de médiation intervient. Les vols bénéficient en outre de la couverture internationale de la Convention de Montréal.",
      answerEn:
        "If an issue is found upon handover, do not provide the PIN. Escrow remains locked and our mediation team steps in. Flights are also governed by Montreal Convention carrier liability.",
    },
    {
      id: "4",
      category: "travelers",
      questionFr: "Puis-je être voyageur et expéditeur avec le même compte ?",
      questionEn: "Can I be both a traveller and sender with one account?",
      answerFr:
        "Oui, absolument. Votre profil BagVoyage vous permet d'endosser simultanément les rôles d'expéditeur, de voyageur ou d'acheteur Shop & Go selon vos trajets et vos besoins quotidiens.",
      answerEn:
        "Yes, absolutely. A single BagVoyage account allows you to act as a sender, verified traveller, or Shop & Go shopper depending on your upcoming trips and needs.",
    },
    {
      id: "5",
      category: "travelers",
      questionFr: "Comment et quand suis-je rémunéré en tant que voyageur ?",
      questionEn: "When and how are travellers paid?",
      answerFr:
        "Dès que vous saisissez le code PIN transmis par le destinataire lors de la remise en main propre, la transaction est instantanément validée. Le montant net convenu (85 % de la transaction) est crédité immédiatement sur votre solde portefeuille et virable vers votre compte bancaire.",
      answerEn:
        "The moment you enter the recipient's verification PIN during handover, payment is confirmed. Your net payout (85% of total amount) is instantly available in your wallet for bank transfer.",
    },
    {
      id: "6",
      category: "customs",
      questionFr: "Dois-je obligatoirement inspecter le colis avant de partir ?",
      questionEn: "Must I inspect the parcel contents before travelling?",
      answerFr:
        "Oui, l'inspection physique est une obligation absolue de sécurité. En tant que voyageur, vous êtes légalement responsable des objets placés dans vos bagages. Vous ne devez jamais accepter un paquet fermé sans en vérifier le contenu avec l'expéditeur.",
      answerEn:
        "Yes, visual in-person inspection is strictly mandatory. As a traveller, you are legally responsible for everything in your baggage. Never accept sealed boxes without seeing inside.",
    },
    {
      id: "7",
      category: "claims",
      questionFr: "Comment contacter le service client en cas de retard de vol ?",
      questionEn: "How do I contact customer support if a flight is delayed?",
      answerFr:
        "Notre support d'assistance opère 7j/7 depuis votre espace messagerie et par signalement direct de vol. En cas de vol retardé ou décalé, les deux parties sont prévenues automatiquement et les délais de remise sont ajustés sans pénalité.",
      answerEn:
        "Our support team operates 7 days a week via in-app messaging. If a flight is delayed or rescheduled, both parties are notified and delivery windows adjust automatically without penalties.",
    },
  ];

  const categories = [
    { key: "all", labelFr: "Toutes les questions", labelEn: "All questions" },
    { key: "payment", labelFr: "Paiement & Séquestre", labelEn: "Payments & Escrow" },
    { key: "customs", labelFr: "Bagages & Douanes", labelEn: "Luggage & Customs" },
    { key: "senders", labelFr: "Expéditeurs", labelEn: "Senders" },
    { key: "travelers", labelFr: "Voyageurs", labelEn: "Travellers" },
    { key: "claims", labelFr: "Litiges & Garanties", labelEn: "Claims & Protection" },
  ];

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter((faq) => {
      const matchCat = selectedCategory === "all" || faq.category === selectedCategory;
      if (!matchCat) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      const question = (isFr ? faq.questionFr : faq.questionEn).toLowerCase();
      const answer = (isFr ? faq.answerFr : faq.answerEn).toLowerCase();
      return question.includes(q) || answer.includes(q);
    });
  }, [allFaqs, selectedCategory, query, isFr]);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((faq) => ({
      "@type": "Question",
      name: isFr ? faq.questionFr : faq.questionEn,
      acceptedAnswer: {
        "@type": "Answer",
        text: isFr ? faq.answerFr : faq.answerEn,
      },
    })),
  };

  return (
    <div className="seo-page faq-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
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
            <button type="button" onClick={() => navigate("trust")}>
              {isFr ? "Sécurité" : "Trust"}
            </button>
            <button type="button" className="active" onClick={() => navigate("faq")}>
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
            {isFr ? "CENTRE D'AIDE & RÉPONSES" : "HELP CENTER & KNOWLEDGE BASE"}
          </span>
          <h1>
            {isFr ? "Foire Aux Questions BagVoyage" : "Frequently Asked Questions"}
          </h1>
          <p className="seo-hero-sub">
            {isFr
              ? "Toutes les réponses sur le fonctionnement du co-bagage, la protection de vos paiements et le respect des règles aériennes."
              : "Everything you need to know about peer-to-peer crowdshipping, escrow safety, and airline compliance."}
          </p>
        </div>

        <div className="faq-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isFr ? "Rechercher une question, douane, séquestre, kilos..." : "Search question, customs, escrow, weight..."}
            aria-label={isFr ? "Rechercher dans la FAQ" : "Search FAQ"}
          />
        </div>

        <div className="faq-category-pills">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`cat-pill ${selectedCategory === cat.key ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {isFr ? cat.labelFr : cat.labelEn}
            </button>
          ))}
        </div>

        <div className="faq-accordion-list">
          {filteredFaqs.length === 0 ? (
            <div className="faq-empty-state">
              <HelpCircle size={32} />
              <p>{isFr ? "Aucune question ne correspond à votre recherche." : "No questions matched your search criteria."}</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = !!openIds[faq.id];
              return (
                <div key={faq.id} className={`faq-item-card ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span>{isFr ? faq.questionFr : faq.questionEn}</span>
                    <ChevronDown size={18} className="accordion-chevron" />
                  </button>
                  {isOpen && (
                    <div className="faq-answer-pane">
                      <p>{isFr ? faq.answerFr : faq.answerEn}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
