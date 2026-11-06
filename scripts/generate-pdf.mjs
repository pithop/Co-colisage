import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const screenshotsDir = path.join(projectRoot, "docs", "screenshots");
const pdfOutputDir = projectRoot;

function getBase64Image(filename) {
  const filePath = path.join(screenshotsDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn("Missing image:", filename);
    return "";
  }
  const ext = path.extname(filePath).slice(1);
  const data = fs.readFileSync(filePath).toString("base64");
  return `data:image/${ext === "jpg" ? "jpeg" : ext};base64,${data}`;
}

const img01 = getBase64Image("01_landing_desktop_light.jpg");
const img02 = getBase64Image("02_landing_desktop_dark.jpg");
const img03 = getBase64Image("03_landing_mobile_light.jpg");
const img04 = getBase64Image("04_landing_mobile_dark.jpg");
const img05 = getBase64Image("05_how_it_works_desktop.jpg");
const img06 = getBase64Image("06_pricing_desktop.jpg");
const img07 = getBase64Image("07_trust_security_desktop.jpg");
const img08 = getBase64Image("08_faq_desktop.jpg");
const img09 = getBase64Image("09_marketplace_desktop.jpg");
const img10 = getBase64Image("10_marketplace_mobile.jpg");
const img11 = getBase64Image("11_how_it_works_mobile.jpg");
const img12 = getBase64Image("12_pricing_mobile.jpg");
const img13 = getBase64Image("13_radar_page.jpg");
const img14 = getBase64Image("14_tracking_page.jpg");
const img15 = getBase64Image("15_auth_login_page.jpg");
const img16 = getBase64Image("16_admin_dashboard.jpg");
const img17 = getBase64Image("17_ticket_scanner_modal.jpg");
const img18 = getBase64Image("18_currency_converter_modal.jpg");
const img19 = getBase64Image("19_publish_modal.jpg");
const img20 = getBase64Image("20_radar_mobile.jpg");
const img21 = getBase64Image("21_shopandgo_desktop.jpg");
const img22 = getBase64Image("22_shopandgo_mobile.jpg");
const img23 = getBase64Image("23_bagandgo_desktop.jpg");
const img24 = getBase64Image("24_bagandgo_mobile.jpg");
const img25 = getBase64Image("25_kyc_verification_modal.jpg");

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>BagVoyage - Dossier Complet de Présentation Produit</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

    :root {
      --primary: #0284c7;
      --primary-dark: #0369a1;
      --accent: #10b981;
      --text-main: #0f172a;
      --text-muted: #475569;
      --bg-page: #ffffff;
      --bg-card: #f8fafc;
      --border: #e2e8f0;
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
      --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.07);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--text-main);
      background: #f1f5f9;
      font-size: 12.5px;
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
    }

    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      margin: 0 auto 20px auto;
      background: var(--bg-page);
      padding: 16mm 18mm;
      position: relative;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      page-break-after: always;
      page-break-inside: avoid;
      overflow: hidden;
    }

    @media print {
      body {
        background: transparent;
      }
      .page {
        margin: 0;
        box-shadow: none;
        width: 210mm;
        height: 297mm;
        page-break-after: always;
        padding: 14mm 16mm;
      }
    }

    /* COVER PAGE */
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 265mm;
      background: radial-gradient(circle at top right, #f0f9ff 0%, #ffffff 50%, #f8fafc 100%);
      border-radius: 12px;
      border: 1px solid var(--border);
      padding: 24mm 18mm;
    }

    .cover-badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 11px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .badge-primary { background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; }
    .badge-success { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .badge-dark { background: #0f172a; color: #ffffff; }

    .cover h1 {
      font-size: 40px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      color: #0f172a;
      margin-bottom: 14px;
    }

    .cover h1 span {
      background: linear-gradient(135deg, #0284c7, #2563eb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover p.subtitle {
      font-size: 15px;
      color: #475569;
      max-width: 580px;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .cover-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      background: #ffffff;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
    }

    .meta-box h4 {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-bottom: 4px;
    }

    .meta-box p {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
    }

    /* SECTION STYLING */
    .section-header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .section-header h2 {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0f172a;
    }

    .section-header .section-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px;
      color: #0284c7;
      font-weight: 600;
    }

    .lead-text {
      font-size: 12px;
      color: #334155;
      line-height: 1.55;
      margin-bottom: 12px;
    }

    /* CARDS & GRIDS */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 12px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 12px;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 12px;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      box-shadow: var(--shadow-sm);
    }

    .card h3 {
      font-size: 12.5px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .card p {
      font-size: 11px;
      color: #475569;
      line-height: 1.45;
    }

    /* SCREENSHOTS */
    .screenshot-frame {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-md);
      background: #000;
      margin-bottom: 10px;
    }

    .screenshot-frame img {
      width: 100%;
      height: auto;
      display: block;
    }

    .screenshot-label {
      font-size: 10px;
      color: #64748b;
      font-weight: 600;
      text-align: center;
      margin-top: 4px;
      margin-bottom: 10px;
    }

    /* MOBILE PREVIEWS */
    .mobile-duo-container {
      display: flex;
      gap: 14px;
      justify-content: center;
      align-items: flex-start;
      margin: 10px 0;
    }

    .mobile-mockup {
      width: 48%;
      border-radius: 10px;
      overflow: hidden;
      border: 2px solid #0f172a;
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
      background: #fff;
    }

    .mobile-mockup img {
      width: 100%;
      display: block;
    }

    /* TABLES */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 11px;
    }

    table.data-table th {
      background: #0f172a;
      color: #ffffff;
      padding: 8px 10px;
      text-align: left;
      font-weight: 600;
    }

    table.data-table td {
      padding: 8px 10px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }

    table.data-table tr:nth-child(even) td {
      background: #f8fafc;
    }

    .highlight-cell {
      font-weight: 700;
      color: #0284c7;
    }

    .check-icon {
      color: #10b981;
      font-weight: bold;
    }

    /* FOOTER */
    .page-footer {
      position: absolute;
      bottom: 10mm;
      left: 18mm;
      right: 18mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border);
      padding-top: 6px;
      font-size: 9.5px;
      color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: COVER -->
  <div class="page">
    <div class="cover">
      <div>
        <div class="cover-badge-row">
          <span class="badge badge-primary">Version 2.4.0 Production</span>
          <span class="badge badge-success">Conforme Convention de Montréal</span>
          <span class="badge badge-dark">Design Apple Pro HIG</span>
        </div>
        <h1>BagVoyage<span>.</span><br>Dossier Complet de Présentation</h1>
        <p class="subtitle">
          Guide technique, ergonomique et commercial complet de l'écosystème BagVoyage : Co-colisage aérien international, Moteur d'arbitrage de rentabilité, Achats Shop & Go et Séquestre bancaire certifié.
        </p>
      </div>

      <div class="cover-meta">
        <div class="meta-box">
          <h4>Destinataire</h4>
          <p>Direction & Partenaires Stratégiques</p>
        </div>
        <div class="meta-box">
          <h4>Périmètre</h4>
          <p>Application Web, Mobile PWA & Back-office</p>
        </div>
        <div class="meta-box">
          <h4>État du Projet</h4>
          <p>Novembre 2026 • 100% Fonctionnel & Testé</p>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <span>BagVoyage International • Dossier de Présentation Officiel</span>
      <span>Page 1 / 12</span>
    </div>
  </div>

  <!-- PAGE 2: VISION & PROPOSITION DE VALEUR -->
  <div class="page">
    <div class="section-header">
      <h2>1. Problématique Marché & Solution BagVoyage</h2>
      <span class="section-tag">01 // EXECUTIVE SUMMARY</span>
    </div>

    <p class="lead-text">
      Le fret aérien express traditionnel (DHL, FedEx, UPS) impose des tarifs prohibitifs (jusqu'à 30 €/kg) et des délais de 3 à 5 jours ouvrés sur les liaisons majeures entre l'Europe, le Maghreb (France–Algérie), le Canada et l'Afrique. Parallèlement, des millions de passagers voyagent chaque jour avec des valises à moitié vides.
    </p>

    <div class="grid-3" style="margin-top: 8px;">
      <div class="card" style="border-left: 3px solid #0284c7;">
        <h3>1. L'Expéditeur</h3>
        <p>Envoie des colis volumineux ou urgents dès <strong>8 €/kg</strong>, réalisant jusqu'à <strong>70% d'économie</strong>, avec remise en mains propres en moins de 48h garantie.</p>
      </div>
      <div class="card" style="border-left: 3px solid #10b981;">
        <h3>2. Le Voyageur</h3>
        <p>Monétise ses franchises bagages inexploitées en percevant <strong>85% nets</strong> du montant de la transaction, finançant ainsi jusqu'à 100% de son billet d'avion.</p>
      </div>
      <div class="card" style="border-left: 3px solid #6366f1;">
        <h3>3. Acheteur Shop & Go</h3>
        <p>Commande des articles indisponibles localement (médicaments autorisés, high-tech, parfums) achetés en direct avec ticket de caisse certifié.</p>
      </div>
    </div>

    <div class="screenshot-frame" style="margin-top: 10px;">
      <img src="${img01}" alt="Présentation Générale">
    </div>
    <p class="screenshot-label">Figure 1.1 : Vue d'ensemble de la page d'accueil avec proposition de valeur claire et simulateur dynamique.</p>

    <div class="page-footer">
      <span>BagVoyage International • Dossier de Présentation Officiel</span>
      <span>Page 2 / 12</span>
    </div>
  </div>

  <!-- PAGE 3: LANDING PAGE & DESIGN SYSTEM -->
  <div class="page">
    <div class="section-header">
      <h2>2. Landing Page Aérée & Mode Sombre Apple Pro</h2>
      <span class="section-tag">02 // DESIGN SYSTEM</span>
    </div>

    <p class="lead-text">
      L'interface a été conçue pour éviter la surcharge cognitive : l'accueil est respirant et dynamique, et un bouton d'alternance permet de basculer instantanément en Mode Sombre Apple Pro (fond ardoise minuit #0b0f19 et verre dépoli).
    </p>

    <div class="grid-2">
      <div>
        <div class="screenshot-frame">
          <img src="${img01}" alt="Mode Clair">
        </div>
        <p class="screenshot-label">Figure 2.1 : Vue Desktop Mode Clair</p>
      </div>
      <div>
        <div class="screenshot-frame">
          <img src="${img02}" alt="Mode Sombre">
        </div>
        <p class="screenshot-label">Figure 2.2 : Vue Desktop Mode Sombre Apple Pro</p>
      </div>
    </div>

    <div class="grid-3" style="margin-top: 6px;">
      <div class="card">
        <h3>Simulateur de Devis</h3>
        <p>Calcul instantané par corridor (Algérie dès 8 €/kg, Canada dès 12 €/kg) avec comparateur de gain en direct.</p>
      </div>
      <div class="card">
        <h3>Zéro Emoji Unicode</h3>
        <p>Remplacement intégral par des icônes vectorielles SVG Lucide pour une identité institutionnelle haut de gamme.</p>
      </div>
      <div class="card">
        <h3>Performance & Fluidité</h3>
        <p>Rendu instantané à 60 fps, polices système SF Pro et contrastes certifiés W3C WCAG AAA.</p>
      </div>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Dossier de Présentation Officiel</span>
      <span>Page 3 / 12</span>
    </div>
  </div>

  <!-- PAGE 4: EXPERIENCE MOBILE PWA -->
  <div class="page">
    <div class="section-header">
      <h2>3. Expérience Mobile Native iPhone 15 Pro</h2>
      <span class="section-tag">03 // MOBILE-FIRST UI/UX</span>
    </div>

    <p class="lead-text">
      Conçue en Mobile-First, la plateforme offre les mêmes sensations qu'une application iOS/Android native : zone tactile accessible au pouce, barre basse translucide, retour haptique léger et gestion automatique du mode nuit système.
    </p>

    <div class="mobile-duo-container">
      <div class="mobile-mockup">
        <img src="${img03}" alt="Mobile Clair">
      </div>
      <div class="mobile-mockup">
        <img src="${img04}" alt="Mobile Sombre">
      </div>
    </div>
    <p class="screenshot-label">Figure 3.1 : Affichage responsive sur iPhone 15 Pro (Mode Jour à gauche, Mode Nuit à droite).</p>

    <div class="grid-2" style="margin-top: 8px;">
      <div class="card">
        <h3>Bottom Navigation Translucide</h3>
        <p>Accès d'une seule main aux sections principales (Explorer, Trajets, Colis, Profil) avec effet de flou d'arrière-plan Apple.</p>
      </div>
      <div class="card">
        <h3>Micro-vibrations Haptiques</h3>
        <p>Retour sensoriel subtil (vibration de 8ms via l'API Web Vibration) lors des interactions clés et de la bascule de thème.</p>
      </div>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Dossier de Présentation Officiel</span>
      <span>Page 4 / 12</span>
    </div>
  </div>

  <!-- PAGE 5: NOUVELLES PAGES SEO DÉDIÉES -->
  <div class="page">
    <div class="section-header">
      <h2>4. Les 4 Nouvelles Pages SEO Spécialisées</h2>
      <span class="section-tag">04 // SEO & DEEP PAGES</span>
    </div>

    <p class="lead-text">
      Afin d'aérer la page d'accueil sans perdre en précision, 4 univers dédiés ont été créés et pré-rendus statiquement (SSG) pour un référencement naturel optimal sur Googlebot :
    </p>

    <div class="grid-2">
      <div>
        <div class="screenshot-frame">
          <img src="${img05}" alt="Comment ça marche">
        </div>
        <p class="screenshot-label">Figure 4.1 : /comment-ca-marche (Workflows Expéditeur, Voyageur, Shop & Go)</p>
      </div>
      <div>
        <div class="screenshot-frame">
          <img src="${img06}" alt="Tarifs & Simulateur">
        </div>
        <p class="screenshot-label">Figure 4.2 : /tarifs (Simulateur corridors & comparateur DHL -70%)</p>
      </div>
    </div>

    <div class="grid-2">
      <div>
        <div class="screenshot-frame">
          <img src="${img07}" alt="Sécurité et Confiance">
        </div>
        <p class="screenshot-label">Figure 4.3 : /securite (Séquestre, KYC, Code PIN & Convention de Montréal)</p>
      </div>
      <div>
        <div class="screenshot-frame">
          <img src="${img08}" alt="Centre d'Aide & FAQ">
        </div>
        <p class="screenshot-label">Figure 4.4 : /faq (Moteur de recherche instantané & Schema.org FAQPage)</p>
      </div>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Dossier de Présentation Officiel</span>
      <span>Page 5 / 12</span>
    </div>
  </div>

  <!-- PAGE 6: SHOP & GO (VOYAGEUR) -->
  <div class="page">
    <div class="section-header">
      <h2>5. Plateforme Shop & Go &middot; Espace Voyageur</h2>
      <span class="section-tag">05 // SHOP & GO VOYAGEUR</span>
    </div>

    <p class="lead-text">
      Plateforme dédiée aux voyageurs souhaitant rentabiliser leur franchise bagages. Les voyageurs acceptent des missions de commande en boutiques européennes ou transportent des colis certifiés pour des clients locaux, avec paiement bloqué sous séquestre Stripe.
    </p>

    <div class="grid-2">
      <div>
        <div class="screenshot-frame">
          <img src="${img21}" alt="Shop & Go Desktop">
        </div>
        <p class="screenshot-label">Figure 5.1 : Plateforme Shop & Go Desktop (Filtres segments, corridors et solde séquestre)</p>
      </div>
      <div>
        <div class="mobile-mockup" style="width: 80%; margin: 0 auto;">
          <img src="${img22}" alt="Shop & Go Mobile">
        </div>
        <p class="screenshot-label">Figure 5.2 : Expérience mobile responsive Shop & Go</p>
      </div>
    </div>

    <div class="grid-3" style="margin-top: 6px;">
      <div class="card">
        <h3>Missions d'Achats & Colis</h3>
        <p>Bascule instantanée entre achats assistés en boutique (iPhone, parfums, mode) et simple transport de colis.</p>
      </div>
      <div class="card">
        <h3>Destinations Phares</h3>
        <p>Filtres instantanés en un clic sur les corridors à fort trafic : Alger, Oran, Constantine, Tunis, Casablanca.</p>
      </div>
      <div class="card">
        <h3>Arbitrage de Vols Rentables</h3>
        <p>Accès direct aux opportunités d'arbitrage de billets d'avion pour voyager gratuitement grâce à ses kilos.</p>
      </div>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Dossier de Présentation Officiel</span>
      <span>Page 6 / 12</span>
    </div>
  </div>

  <!-- PAGE 7: BAG & GO (EXPEDITEUR) -->
  <div class="page">
    <div class="section-header">
      <h2>6. Plateforme Bag & Go &middot; Espace Expéditeur</h2>
      <span class="section-tag">06 // BAG & GO EXPEDITEUR</span>
    </div>

    <p class="lead-text">
      Plateforme dédiée aux particuliers et commerçants ayant besoin d'expédier un colis rapidement et en toute sécurité. Les biens voyagent en cabine avec des voyageurs vérifiés eIDAS, avec déblocage sécurisé par code PIN secret à l'arrivée.
    </p>

    <div class="grid-2">
      <div>
        <div class="screenshot-frame">
          <img src="${img23}" alt="Bag & Go Desktop">
        </div>
        <p class="screenshot-label">Figure 6.1 : Plateforme Bag & Go Desktop (Sélection des trajets, transporteurs et garanties)</p>
      </div>
      <div>
        <div class="mobile-mockup" style="width: 80%; margin: 0 auto;">
          <img src="${img24}" alt="Bag & Go Mobile">
        </div>
        <p class="screenshot-label">Figure 6.2 : Vue Mobile de la plateforme Bag & Go</p>
      </div>
    </div>

    <div class="grid-3" style="margin-top: 6px;">
      <div class="card">
        <h3>Multi-Transports</h3>
        <p>Filtres sélectifs par vecteur de déplacement : Avion (rapide), Bateau / Fret maritime ou Voiture / Utilitaire.</p>
      </div>
      <div class="card">
        <h3>Code PIN de Clôture</h3>
        <p>Sécurité absolue : les fonds ne sont versés au transporteur qu'une fois le code PIN secret saisi par le destinataire.</p>
      </div>
      <div class="card">
        <h3>Suivi en Direct</h3>
        <p>Accès immédiat au suivi télémétrique des colis déposés avec notification à chaque étape du voyage.</p>
      </div>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Dossier de Présentation Officiel</span>
      <span>Page 7 / 12</span>
    </div>
  </div>

  <!-- PAGE 8: VERIFICATION KYC eIDAS & SCANNER IATA -->
  <div class="page">
    <div class="section-header">
      <h2>7. Vérification d'Identité KYC eIDAS & Scanner IATA OCR</h2>
      <span class="section-tag">07 // SECURITY & SMART TECH</span>
    </div>

    <p class="lead-text">
      Architecture vierge et sécurisée : chaque utilisateur certifie son identité avant d'activer son statut de voyageur ou d'expéditeur. L'application intègre un module KYC eIDAS avec chiffrement fort et un scanner OCR IATA en bordure de réseau.
    </p>

    <div class="grid-2">
      <div>
        <div class="screenshot-frame">
          <img src="${img25}" alt="Module KYC eIDAS">
        </div>
        <p class="screenshot-label">Figure 7.1 : Interface de téléversement et vérification eIDAS des pièces d'identité.</p>
      </div>
      <div>
        <div class="screenshot-frame">
          <img src="${img17}" alt="Scanner IATA OCR">
        </div>
        <p class="screenshot-label">Figure 7.2 : Scanner OCR embarqué pour billets d'avion et cartes d'embarquement.</p>
      </div>
    </div>

    <div class="grid-3" style="margin-top: 6px;">
      <div class="card">
        <h3>Passeport & CNI Certifiés</h3>
        <p>Vérification cryptographique des pièces d'identité et justificatifs de domicile avec conformité RGPD intégrale.</p>
      </div>
      <div class="card">
        <h3>Scanner OCR Local (Tesseract.js)</h3>
        <p>Extraction automatique des codes de vols et aéroports sans transmission des billets vers des serveurs tiers.</p>
      </div>
      <div class="card">
        <h3>Garantie Séquestre Stripe</h3>
        <p>Protection financière intégrale des transactions jusqu'à la remise physique et confirmation de conformité.</p>
      </div>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Dossier de Présentation Officiel</span>
      <span>Page 8 / 12</span>
    </div>
  </div>

  <!-- PAGE 9: RADAR AERIEN INTERACTIF -->
  <div class="page">
    <div class="section-header">
      <h2>8. Radar Aérien Interactif & Corridors de Vols</h2>
      <span class="section-tag">08 // RADAR & LIVE MAP</span>
    </div>

    <p class="lead-text">
      Une carte dynamique permet de visualiser en direct les flux d'expéditions et les liaisons aériennes en temps réel sur la Méditerranée et les axes internationaux.
    </p>

    <div class="grid-2">
      <div>
        <div class="screenshot-frame">
          <img src="${img13}" alt="Radar Desktop">
        </div>
        <p class="screenshot-label">Figure 8.1 : Radar Aérien Interactif (Desktop) avec corridors en temps réel.</p>
      </div>
      <div>
        <div class="mobile-mockup" style="width: 80%; margin: 0 auto;">
          <img src="${img20}" alt="Radar Mobile">
        </div>
        <p class="screenshot-label">Figure 8.2 : Radar Aérien optimisé sur Mobile.</p>
      </div>
    </div>

    <div class="grid-3" style="margin-top: 6px;">
      <div class="card">
        <h3>Corridors Clés</h3>
        <p>Suivi en direct des liaisons Paris-Orly / Marseille / Lyon vers Alger, Oran, Constantine, Montréal et Dakar.</p>
      </div>
      <div class="card">
        <h3>Réservation Directe</h3>
        <p>Possibilité d'initier une expédition ou d'enregistrer un trajet directement depuis un clic sur la trajectoire de vol.</p>
      </div>
      <div class="card">
        <h3>Indicateurs de Demande</h3>
        <p>Indication des corridors sous tension avec bonus tarifaire pour les voyageurs acceptant des colis prioritaires.</p>
      </div>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Dossier de Présentation Officiel</span>
      <span>Page 9 / 12</span>
    </div>
  </div>

  <!-- PAGE 10: SECURITE, SEQUESTRE & TRACKING -->
  <div class="page">
    <div class="section-header">
      <h2>9. Sécurité Bancaire, Protocole PIN & Suivi GPS</h2>
      <span class="section-tag">09 // SECURITY & ESCROW</span>
    </div>

    <p class="lead-text">
      La confiance est le pilier central de BagVoyage. Le système repose sur 4 couches de protection technique et financière inviolables :
    </p>

    <div class="grid-2">
      <div>
        <div class="screenshot-frame">
          <img src="${img14}" alt="Suivi GPS & Timeline">
        </div>
        <p class="screenshot-label">Figure 9.1 : Timeline de suivi en direct (De la consigne à la remise).</p>
      </div>
      <div>
        <div class="screenshot-frame">
          <img src="${img15}" alt="Authentification & KYC">
        </div>
        <p class="screenshot-label">Figure 9.2 : Espace d'authentification et vérification d'identité KYC.</p>
      </div>
    </div>

    <div class="grid-3" style="margin-top: 6px;">
      <div class="card">
        <h3>Séquestre Européen Certifié</h3>
        <p>L'argent reste consigné sur un compte tiers agréé jusqu'à validation finale. Le voyageur n'est payé qu'une fois le colis livré.</p>
      </div>
      <div class="card">
        <h3>Code PIN Secret à 6 Chiffres</h3>
        <p>Le destinataire transmet son code secret au voyageur lors de la rencontre. Ce code est la clé cryptographique unique libérant les fonds.</p>
      </div>
      <div class="card">
        <h3>Vérification d'Identité KYC</h3>
        <p>Passeport ou CNI contrôlé rigoureusement avant autorisation de transporter ou d'expédier.</p>
      </div>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Dossier de Présentation Officiel</span>
      <span>Page 10 / 12</span>
    </div>
  </div>

  <!-- PAGE 11: DASHBOARDS, ADMIN & MULTI-DEVISES -->
  <div class="page">
    <div class="section-header">
      <h2>10. Centre d'Administration, Flottes & Devises</h2>
      <span class="section-tag">10 // BACKOFFICE & LEDGER</span>
    </div>

    <p class="lead-text">
      L'application comprend un centre de contrôle d'administration complet pour la modération et la gestion des litiges, ainsi qu'un convertisseur multi-devises en temps réel.
    </p>

    <div class="grid-2">
      <div>
        <div class="screenshot-frame">
          <img src="${img16}" alt="Admin Dashboard">
        </div>
        <p class="screenshot-label">Figure 10.1 : Centre de Contrôle Administrateur (Modération, litiges et remboursements).</p>
      </div>
      <div>
        <div class="screenshot-frame">
          <img src="${img18}" alt="Convertisseur Devises">
        </div>
        <p class="screenshot-label">Figure 10.2 : Convertisseur de devises temps réel (EUR / DZD / CAD / USD).</p>
      </div>
    </div>

    <div class="grid-3" style="margin-top: 6px;">
      <div class="card">
        <h3>Remboursements Atomiques</h3>
        <p>En cas d'annulation ou de litige avéré, l'administrateur peut déclencher un remboursement immédiat et irréversible de l'expéditeur.</p>
      </div>
      <div class="card">
        <h3>Espace Transporteur Pro</h3>
        <p>Tableau de bord dédié aux transporteurs professionnels et flottes de véhicules avec gestion multi-arrêts.</p>
      </div>
      <div class="card">
        <h3>Double Taux de Change</h3>
        <p>Affichage des cours officiels et des cours interbancaires pour une transparence totale sur le Dinar Algérien (DZD).</p>
      </div>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Dossier de Présentation Officiel</span>
      <span>Page 11 / 12</span>
    </div>
  </div>

  <!-- PAGE 12: COMPARATIF, LEGAL & CONCLUSION -->
  <div class="page">
    <div class="section-header">
      <h2>11. Comparatif Marché, Cadre Légal & Fiche Technique</h2>
      <span class="section-tag">11 // SYNTHESIS & AUDIT</span>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>Critère Analysé</th>
          <th>BagVoyage</th>
          <th>Fret Express (DHL / FedEx)</th>
          <th>Groupes Informels Réseaux Sociaux</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Tarif 5 kg (Paris–Alger)</strong></td>
          <td class="highlight-cell">40 € (8 €/kg)</td>
          <td>145 € (+260%)</td>
          <td>50 € - 75 €</td>
        </tr>
        <tr>
          <td><strong>Délai d'acheminement</strong></td>
          <td><span class="check-icon">✓</span> 24h à 48h en direct</td>
          <td>3 à 5 jours ouvrés</td>
          <td>Aléatoire (1 à 3 semaines)</td>
        </tr>
        <tr>
          <td><strong>Sécurité des Fonds</strong></td>
          <td><span class="check-icon">✓</span> Séquestre Bancaire Garanti</td>
          <td>Assurance payante en option</td>
          <td>Aucune (Risque maximal d'escroquerie)</td>
        </tr>
        <tr>
          <td><strong>Preuve de Livraison</strong></td>
          <td><span class="check-icon">✓</span> Code PIN 6 chiffres unique</td>
          <td>Bordereau / Signature</td>
          <td>Aucune traçabilité</td>
        </tr>
        <tr>
          <td><strong>Rémunération Voyageur</strong></td>
          <td class="highlight-cell"><span class="check-icon">✓</span> 85% reversés</td>
          <td>0 €</td>
          <td>Sans garantie de paiement</td>
        </tr>
        <tr>
          <td><strong>Cadre Réglementaire</strong></td>
          <td><span class="check-icon">✓</span> Convention de Montréal</td>
          <td>Conforme fret cargo</td>
          <td>Infraction douanière / Risque de saisie</td>
        </tr>
      </tbody>
    </table>

    <div class="card" style="background: #f0fdf4; border-color: #bbf7d0; margin-top: 10px;">
      <h3 style="color: #166534;">Certification Qualité & Prêt au Déploiement</h3>
      <p style="color: #14532d; font-size: 11px;">
        L'ensemble du code source respecte une rigueur absolue : <strong>TypeScript strict (0 erreur de compilation)</strong>, <strong>Zéro emoji Unicode</strong> pour un rendu institutionnel parfait, <strong>20/20 tests E2E Playwright validés</strong> et <strong>pré-rendu statique SSG</strong> opérationnel sur le dépôt officiel GitHub.
      </p>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Dossier de Présentation Officiel</span>
      <span>Page 12 / 12</span>
    </div>
  </div>

</body>
</html>
`;

fs.writeFileSync(path.join(projectRoot, "docs", "dossier-presentation.html"), htmlContent, "utf-8");
console.log("Updated docs/dossier-presentation.html with all 12 pages and 20 screenshots");

(async () => {
  console.log("Launching Chromium to render complete 12-page PDF...");
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const pdfPath = path.join(pdfOutputDir, "BagVoyage_Dossier_Client.pdf");
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "0mm",
      bottom: "0mm",
      left: "0mm",
      right: "0mm",
    },
  });

  console.log("Complete 12-page PDF generated successfully at:", pdfPath);
  await browser.close();
})();
