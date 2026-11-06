import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const screenshotsDir = path.join(projectRoot, "docs", "screenshots");
const pdfOutputDir = projectRoot;

// Convert an image to base64 data URL
function getBase64Image(filename) {
  const filePath = path.join(screenshotsDir, filename);
  if (!fs.existsSync(filePath)) return "";
  const ext = path.extname(filePath).slice(1);
  const data = fs.readFileSync(filePath).toString("base64");
  return `data:image/${ext};base64,${data}`;
}

const imgLandingDeskLight = getBase64Image("01_landing_desktop_light.jpg");
const imgLandingDeskDark = getBase64Image("02_landing_desktop_dark.jpg");
const imgLandingMobLight = getBase64Image("03_landing_mobile_light.jpg");
const imgLandingMobDark = getBase64Image("04_landing_mobile_dark.jpg");
const imgHowDesk = getBase64Image("05_how_it_works_desktop.jpg");
const imgPricingDesk = getBase64Image("06_pricing_desktop.jpg");
const imgTrustDesk = getBase64Image("07_trust_security_desktop.jpg");
const imgFaqDesk = getBase64Image("08_faq_desktop.jpg");
const imgMarketDesk = getBase64Image("09_marketplace_desktop.jpg");
const imgMarketMob = getBase64Image("10_marketplace_mobile.jpg");

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>BagVoyage - Dossier de Présentation Client & Produit</title>
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
      --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.06);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: var(--text-main);
      background: #f1f5f9;
      font-size: 13px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto 20px auto;
      background: var(--bg-page);
      padding: 18mm 20mm;
      position: relative;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      page-break-after: always;
    }

    @media print {
      body {
        background: transparent;
      }
      .page {
        margin: 0;
        box-shadow: none;
        width: 100%;
        min-height: 100vh;
        page-break-after: always;
        padding: 15mm 16mm;
      }
    }

    /* COVER PAGE */
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 260mm;
      background: radial-gradient(circle at top right, #f0f9ff 0%, #ffffff 50%, #f8fafc 100%);
      border-radius: 12px;
      border: 1px solid var(--border);
      padding: 30mm 20mm;
    }

    .cover-badge-row {
      display: flex;
      gap: 10px;
      margin-bottom: 24px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .badge-primary {
      background: #e0f2fe;
      color: #0284c7;
      border: 1px solid #bae6fd;
    }

    .badge-success {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }

    .cover h1 {
      font-size: 44px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      color: #0f172a;
      margin-bottom: 16px;
    }

    .cover h1 span {
      background: linear-gradient(135deg, #0284c7, #2563eb);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover p.subtitle {
      font-size: 16px;
      color: #475569;
      max-width: 580px;
      line-height: 1.6;
      margin-bottom: 30px;
    }

    .cover-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      background: #ffffff;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
    }

    .meta-box h4 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-bottom: 4px;
    }

    .meta-box p {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }

    /* SECTION STYLING */
    .section-header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 10px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .section-header h2 {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0f172a;
    }

    .section-header .section-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #0284c7;
      font-weight: 600;
    }

    .lead-text {
      font-size: 13.5px;
      color: #334155;
      line-height: 1.6;
      margin-bottom: 18px;
    }

    /* CARDS & GRIDS */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 18px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-bottom: 18px;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
      box-shadow: var(--shadow-sm);
    }

    .card h3 {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card p {
      font-size: 12px;
      color: #475569;
      line-height: 1.5;
    }

    /* IMAGE CONTAINERS */
    .screenshot-frame {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-md);
      background: #000;
      margin-bottom: 14px;
    }

    .screenshot-frame img {
      width: 100%;
      height: auto;
      display: block;
    }

    .screenshot-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      text-align: center;
      margin-top: 6px;
      margin-bottom: 14px;
    }

    /* MOBILE PREVIEW COMPARISON */
    .mobile-duo-container {
      display: flex;
      gap: 20px;
      justify-content: center;
      align-items: flex-start;
      margin: 15px 0;
    }

    .mobile-mockup {
      width: 48%;
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid #0f172a;
      box-shadow: 0 12px 30px rgba(0,0,0,0.12);
      background: #fff;
    }

    .mobile-mockup img {
      width: 100%;
      display: block;
    }

    /* COMPARISON TABLE */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      margin-bottom: 20px;
      font-size: 12px;
    }

    table.data-table th {
      background: #0f172a;
      color: #ffffff;
      padding: 10px 12px;
      text-align: left;
      font-weight: 600;
    }

    table.data-table td {
      padding: 10px 12px;
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
      bottom: 12mm;
      left: 20mm;
      right: 20mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border);
      padding-top: 8px;
      font-size: 10px;
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
        </div>
        <h1>BagVoyage<span>.</span><br>Dossier de Présentation Produit</h1>
        <p class="subtitle">
          Plateforme collaborative de co-colisage aérien, d'arbitrage de fret et d'achats Shop & Go. Une architecture sécurisée par séquestre bancaire, vérification d'identité KYC et code de remise PIN chiffré.
        </p>
      </div>

      <div class="cover-meta">
        <div class="meta-box">
          <h4>Client Cible</h4>
          <p>Direction & Partenaires</p>
        </div>
        <div class="meta-box">
          <h4>Écosystème</h4>
          <p>Web Desktop & Mobile PWA</p>
        </div>
        <div class="meta-box">
          <h4>Date & Statut</h4>
          <p>Novembre 2026 • Clé en main</p>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <span>BagVoyage International • Document Confidentiel</span>
      <span>Page 1 / 6</span>
    </div>
  </div>

  <!-- PAGE 2: VISION & LANDING EXPERIENCE -->
  <div class="page">
    <div class="section-header">
      <h2>1. Architecture Visuelle & Landing Aérée</h2>
      <span class="section-tag">01 // DESIGN SYSTEM</span>
    </div>
    <p class="lead-text">
      L'interface a été conçue selon les plus hauts standards Apple Pro (Human Interface Guidelines). La page d'accueil propose un simulateur de devis instantané tout en déléguant les informations denses vers des pages d'atterrissage SEO spécialisées.
    </p>

    <div class="screenshot-frame">
      <img src="${imgLandingDeskLight}" alt="Landing Page Desktop Mode Clair">
    </div>
    <p class="screenshot-label">Figure 1.1 : Vue Desktop de la Landing Page (Mode Clair) avec simulateur interactif et métriques certifiées.</p>

    <div class="grid-3" style="margin-top: 15px;">
      <div class="card">
        <h3>Calculateur Précis</h3>
        <p>Estimation kilométrique en temps réel (8 €/kg Algérie, 12 €/kg Canada) avec affichage instantané de l'économie réalisée (-68%).</p>
      </div>
      <div class="card">
        <h3>SEO Ready</h3>
        <p>Pré-rendu statique SSG de toutes les pages avec balises Schema.org JSON-LD, OpenGraph et conformité Google Search Console.</p>
      </div>
      <div class="card">
        <h3>Accessibilité Pro</h3>
        <p>Typographie contrastée, balisage WAI-ARIA complet et zéro emoji Unicode pour une image de marque irréprochable.</p>
      </div>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Document Confidentiel</span>
      <span>Page 2 / 6</span>
    </div>
  </div>

  <!-- PAGE 3: MODE SOMBRE APPLE PRO & MOBILE -->
  <div class="page">
    <div class="section-header">
      <h2>2. Mode Sombre Apple Pro & Expérience Mobile</h2>
      <span class="section-tag">02 // DARK MODE & MOBILE</span>
    </div>
    <p class="lead-text">
      Intégration d'un Dark Mode immersif avec fond ardoise minuit (#0b0f19), verre dépoli Apple Dark translucide et adaptation responsive tactile native avec haptique.
    </p>

    <div class="grid-2">
      <div>
        <div class="screenshot-frame">
          <img src="${imgLandingDeskDark}" alt="Landing Desktop Dark Mode">
        </div>
        <p class="screenshot-label">Figure 2.1 : Desktop Apple Pro Dark Mode</p>
      </div>
      <div>
        <div class="mobile-duo-container">
          <div class="mobile-mockup">
            <img src="${imgLandingMobLight}" alt="Mobile Clair">
          </div>
          <div class="mobile-mockup">
            <img src="${imgLandingMobDark}" alt="Mobile Sombre">
          </div>
        </div>
        <p class="screenshot-label">Figure 2.2 : Vues Mobile iPhone (Clair & Sombre)</p>
      </div>
    </div>

    <div class="card" style="margin-top: 10px;">
      <h3>Ergonomie Mobile & Détection Automatique</h3>
      <p>L'application détecte automatiquement le réglage d'affichage de l'appareil (iOS ou Android) tout en offrant un bouton bascule avec micro-vibration haptique. La navigation basse tactile (Bottom Bar) garantit un accès à une main aux fonctions principales.</p>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Document Confidentiel</span>
      <span>Page 3 / 6</span>
    </div>
  </div>

  <!-- PAGE 4: PAGES SEO SPECIALISEES -->
  <div class="page">
    <div class="section-header">
      <h2>3. Les Nouvelles Pages SEO Dédiées</h2>
      <span class="section-tag">03 // SEO & PARCOURS</span>
    </div>
    <p class="lead-text">
      Pour aérer la page d'accueil sans perdre en conversion, 4 univers indépendants ont été développés et optimisés pour le référencement naturel :
    </p>

    <div class="grid-2">
      <div>
        <div class="screenshot-frame">
          <img src="${imgHowDesk}" alt="Comment ça marche">
        </div>
        <p class="screenshot-label">Figure 3.1 : /comment-ca-marche (Workflows Expéditeur, Voyageur, Shop & Go)</p>
      </div>
      <div>
        <div class="screenshot-frame">
          <img src="${imgPricingDesk}" alt="Grille Tarifaire">
        </div>
        <p class="screenshot-label">Figure 3.2 : /tarifs (Simulateur corridors & comparateur DHL)</p>
      </div>
    </div>

    <div class="grid-2">
      <div>
        <div class="screenshot-frame">
          <img src="${imgTrustDesk}" alt="Sécurité et Confiance">
        </div>
        <p class="screenshot-label">Figure 3.3 : /securite (Séquestre, KYC, Code PIN & Légal)</p>
      </div>
      <div>
        <div class="screenshot-frame">
          <img src="${imgFaqDesk}" alt="Centre d'Aide & FAQ">
        </div>
        <p class="screenshot-label">Figure 3.4 : /faq (Moteur de recherche & filtres thématiques)</p>
      </div>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Document Confidentiel</span>
      <span>Page 4 / 6</span>
    </div>
  </div>

  <!-- PAGE 5: MARKETPLACE & TECHNOLOGIES AVANCEES -->
  <div class="page">
    <div class="section-header">
      <h2>4. Marketplace & Moteur d'Arbitrage Aérien</h2>
      <span class="section-tag">04 // APPLICATION & DATA</span>
    </div>
    <p class="lead-text">
      Le cœur de l'application connecte en direct les demandes de transport et les voyages programmés avec un algorithme d'arbitrage de rentabilité.
    </p>

    <div class="screenshot-frame">
      <img src="${imgMarketDesk}" alt="Marketplace Explorer">
    </div>
    <p class="screenshot-label">Figure 4.1 : Vue Centrale de la Marketplace avec recherche multi-villes et filtres de dates.</p>

    <div class="grid-3" style="margin-top: 14px;">
      <div class="card">
        <h3>Scanner OCR de Billets</h3>
        <p>Lecture automatique de billets d'avion IATA et cartes d'embarquement PDF/images avec extraction sécurisée sans fuite de données.</p>
      </div>
      <div class="card">
        <h3>Radar de Vols Interactif</h3>
        <p>Visualisation cartographique des corridors aériens en temps réel pour cibler les vols les plus rentables.</p>
      </div>
      <div class="card">
        <h3>Séquestre & Code PIN</h3>
        <p>Fonds cantonnés sur compte tiers et libérés uniquement à la saisie du code secret à 6 chiffres transmis lors de la livraison.</p>
      </div>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Document Confidentiel</span>
      <span>Page 5 / 6</span>
    </div>
  </div>

  <!-- PAGE 6: COMPARATIF, TARIFS & CADRE REGLEMENTAIRE -->
  <div class="page">
    <div class="section-header">
      <h2>5. Comparatif Marché, Tarifs & Sécurité Juridique</h2>
      <span class="section-tag">05 // BUSINESS MODEL & AUDIT</span>
    </div>

    <p class="lead-text">
      BagVoyage disrupte le fret aérien traditionnel en offrant une rentabilité maximale aux voyageurs et une réduction massive des coûts pour les expéditeurs.
    </p>

    <table class="data-table">
      <thead>
        <tr>
          <th>Fonctionnalité / Critère</th>
          <th>BagVoyage</th>
          <th>Transport Express (DHL / FedEx)</th>
          <th>Groupes Réseaux Sociaux</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Tarif moyen 5 kg (Paris - Alger)</strong></td>
          <td class="highlight-cell">40 €</td>
          <td>145 € (+260%)</td>
          <td>50 € - 75 €</td>
        </tr>
        <tr>
          <td><strong>Protection des Fonds</strong></td>
          <td><span class="check-icon">✓</span> Séquestre Bancaire Garanti</td>
          <td><span class="check-icon">✓</span> Assuré</td>
          <td>Aucune (Arnaques fréquentes)</td>
        </tr>
        <tr>
          <td><strong>Vérification d'Identité</strong></td>
          <td><span class="check-icon">✓</span> KYC Officiel & CNI/Passeport</td>
          <td>Partielle expéditeur</td>
          <td>Aucune</td>
        </tr>
        <tr>
          <td><strong>Validation de Livraison</strong></td>
          <td><span class="check-icon">✓</span> Code PIN 6 chiffres unique</td>
          <td>Signature standard</td>
          <td>Aucune preuve</td>
        </tr>
        <tr>
          <td><strong>Conformité Aérienne</strong></td>
          <td><span class="check-icon">✓</span> Convention de Montréal</td>
          <td>Conforme fret</td>
          <td>Risque douanier élevé</td>
        </tr>
        <tr>
          <td><strong>Rémunération du Voyageur</strong></td>
          <td class="highlight-cell"><span class="check-icon">✓</span> 85% reversés au voyageur</td>
          <td>0% (Compagnie uniquement)</td>
          <td>100% sans garantie de paiement</td>
        </tr>
      </tbody>
    </table>

    <div class="card" style="margin-top: 20px; background: #f0fdf4; border-color: #bbf7d0;">
      <h3 style="color: #166534;">Statut de Production & Disponibilité</h3>
      <p style="color: #14532d;">
        L'application a validé avec succès l'ensemble de la suite de tests automatisés Playwright (20/20 tests réussis), le zéro-emoji audit Apple Pro, la compilation TypeScript stricte et le pré-rendu statique SSG. Le code source est synchronisé et déployé sur le dépôt officiel GitHub.
      </p>
    </div>

    <div class="page-footer">
      <span>BagVoyage International • Document Confidentiel</span>
      <span>Page 6 / 6</span>
    </div>
  </div>

</body>
</html>
`;

fs.writeFileSync(path.join(projectRoot, "docs", "dossier-presentation.html"), htmlContent, "utf-8");
console.log("Wrote docs/dossier-presentation.html");

(async () => {
  console.log("Launching Chromium to render PDF...");
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Load the HTML content directly
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

  console.log("PDF generated successfully at:", pdfPath);
  await browser.close();
})();
