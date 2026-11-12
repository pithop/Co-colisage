import { test, expect } from "@playwright/test";

test.describe("Tri-Modal Platforms & Multi-Modal Capabilities", () => {
  test("Mode Voyageur: 5-mode transport switcher & dynamic fields", async ({ page }) => {
    await page.goto("/#voyageur");
    await expect(page.locator("h1")).toContainText("bagages sur vos vols");

    // Check 3-way platform switcher presence
    const platformSwitcher = page.locator("[role='radiogroup']:visible");
    await expect(platformSwitcher.first()).toBeVisible();

    // Check 5 transport modes in Voyageur mode
    const modeTabs = page.locator("nav[aria-label='Modes de transport pour voyageurs'] [role='tab']");
    await expect(modeTabs).toHaveCount(5);

    // Switch to Voiture
    await page.click("button:has-text('Voiture')");
    await expect(page.locator("h1")).toContainText("votre coffre lors de vos trajets en voiture");
    await expect(page.locator("text=Modèle de véhicule")).toBeVisible();
    await expect(page.locator("text=Litres").first()).toBeVisible();

    // Switch to Train
    await page.click("button:has-text('Train')");
    await expect(page.locator("h1")).toContainText("trajets ferroviaires et TGV");
    await expect(page.locator("text=Gare de départ")).toBeVisible();

    // Switch to Bateau
    await page.click("button:has-text('Bateau')");
    await expect(page.locator("h1")).toContainText("traversées maritimes");
    await expect(page.locator("text=Port d'embarquement")).toBeVisible();

    // Switch to Utilitaire
    await page.click("button:has-text('Utilitaire')");
    await expect(page.locator("h1")).toContainText("Remplissez vos utilitaires");
    await expect(page.locator("text=Gabarit utilitaire")).toBeVisible();

    // Check dual action cards
    await expect(page.locator("text=J'envoie un colis").first()).toBeVisible();
    await expect(page.locator("text=Je cherche de l'espace disponible").first()).toBeVisible();
  });

  test("Mode Bag&Go: Granular parcel presets, custom dimensions & IATA volumetric weight", async ({ page }) => {
    await page.goto("/#bagandgo");
    await expect(page.locator("h1")).toContainText("Expédiez vos colis au millimètre près");

    // Check 5 preset cards
    await expect(page.locator("text=Enveloppe A4")).toBeVisible();
    await expect(page.locator("text=Boîte à chaussures")).toBeVisible();
    await expect(page.locator("text=Carton standard")).toBeVisible();
    await expect(page.locator("text=Format Valise cabine")).toBeVisible();
    await expect(page.locator("text=Grand carton XL")).toBeVisible();

    // Check custom dimensions inputs
    await expect(page.locator("text=Longueur (cm)")).toBeVisible();
    await expect(page.locator("text=Largeur (cm)")).toBeVisible();
    await expect(page.locator("text=Hauteur (cm)")).toBeVisible();

    // Check volume and volumetric weight badges
    await expect(page.locator("text=Poids volumétrique").first()).toBeVisible();

    // Check logistics options
    await expect(page.locator("text=Dépôt au voyageur")).toBeVisible();
    await expect(page.locator("text=Enlèvement à domicile")).toBeVisible();

    // Check security tags
    await expect(page.locator("text=Colis Fragile")).toBeVisible();
    await expect(page.locator("text=Batterie Lithium incluse")).toBeVisible();
    await expect(page.locator("text=Scellé de sécurité numéroté")).toBeVisible();

    // Check ParcelVisualizer
    await expect(page.locator("text=Simulateur de Colis Dynamique").first()).toBeVisible();
  });

  test("Mode Shop&Go: Multi-item basket, store selector & mandatory proof-of-purchase", async ({ page }) => {
    await page.goto("/#shopandgo");
    await expect(page.locator("h1")).toContainText("Commandez en boutique & Duty-Free");

    // Check mandatory proof-of-purchase policy banner
    await expect(page.locator("text=Garantie Transparence : Reçu & Ticket de caisse officiel")).toBeVisible();

    // Check basket list
    await expect(page.locator("text=Mon Panier d'Articles")).toBeVisible();
    await expect(page.locator("text=Dior Sauvage")).toBeVisible();

    // Check "Ajouter un autre article au panier"
    const addBtn = page.locator("button:has-text('Ajouter un autre article au panier')");
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await expect(page.locator("text=Nouvel article à faire acheter")).toBeVisible();

    // Check financial breakdown & escrow
    await expect(page.locator("text=Total bloqué sous séquestre")).toBeVisible();
    await expect(page.locator("button:has-text('Publier ma commande d')")).toBeVisible();
  });

  test("Mobile responsive layout: 5-tab Apple HIG navigation", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#voyageur");

    // Bottom nav should be visible on mobile viewport
    const bottomNav = page.locator("nav[aria-label='Navigation mobile principale']");
    await expect(bottomNav).toBeVisible();

    // Check all 5 tabs
    await expect(page.locator("button[aria-label='Accueil']")).toBeVisible();
    await expect(page.locator("button[aria-label='Mes missions']")).toBeVisible();
    await expect(page.locator("button[aria-label^='Messages']")).toBeVisible();
    await expect(page.locator("button[aria-label='Notifications']")).toBeVisible();
    await expect(page.locator("button[aria-label='Mon compte']")).toBeVisible();
  });

  test("PublishModal: 5-mode transport selection, parcel presets & shop options", async ({ page }) => {
    await page.goto("/#voyageur");
    
    // Open publish modal
    const publishBtn = page.locator("button:has-text('Proposer un trajet')").first();
    await publishBtn.click();
    await expect(page.locator("h2:has-text('Publier une annonce')")).toBeVisible();

    // Check 5 mode buttons inside modal
    await expect(page.locator(".transport-selector-card:has-text('Avion')")).toBeVisible();
    await expect(page.locator(".transport-selector-card:has-text('Voiture')")).toBeVisible();
    await expect(page.locator(".transport-selector-card:has-text('Train')")).toBeVisible();
    await expect(page.locator(".transport-selector-card:has-text('Bateau')")).toBeVisible();
    await expect(page.locator(".transport-selector-card:has-text('Camionnette')")).toBeVisible();

    // Switch to Voiture inside modal
    await page.locator(".transport-selector-card:has-text('Voiture')").click();
    await expect(page.locator("input[placeholder*='Peugeot']")).toBeVisible();

    // Switch to Train inside modal
    await page.locator(".transport-selector-card:has-text('Train')").click();
    await expect(page.locator(".transport-selector-card:has-text('Train')")).toHaveAttribute("aria-pressed", "true");
  });

  test("Landing Page: Tri-modal search & action console switches modes, computes earnings, and links to platforms", async ({ page }) => {
    await page.goto("/#landing");

    // Check new Apple/Stripe-grade hero presence and headline
    await expect(page.locator(".bv-hero-headline")).toContainText("Rentabilisez vos voyages", { timeout: 15000 });
    await expect(page.locator(".bv-hero-lead")).toBeVisible();

    // Check the 3 mode tabs
    const tabs = page.locator(".bv-hero-mode-tabs button");
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(0)).toContainText("Voyageur (Convoyeur)");
    await expect(tabs.nth(1)).toContainText("Bag & Go (Expéditeur)");
    await expect(tabs.nth(2)).toContainText("Shop & Go (Acheteur)");

    // Default Voyageur mode verification
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(".bv-hero-action-cta")).toHaveAttribute("href", "/#voyageur");
    await expect(page.locator(".bv-hero-action-cta")).toContainText("Rentabiliser mon voyage");
    await expect(page.locator(".bv-hero-secondary-cta")).toHaveAttribute("href", "/#publish/trips");

    // Switch to Bag & Go mode
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(".bv-hero-action-cta")).toHaveAttribute("href", "/#bagandgo");
    await expect(page.locator(".bv-hero-action-cta")).toContainText("Trouver un convoyeur");
    await expect(page.locator(".bv-hero-secondary-cta")).toHaveAttribute("href", "/#publish/parcel");
    await expect(page.locator("text=Format du colis")).toBeVisible();

    // Switch to Shop & Go mode
    await tabs.nth(2).click();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(".bv-hero-action-cta")).toHaveAttribute("href", "/#shopandgo");
    await expect(page.locator(".bv-hero-action-cta")).toContainText("Commander avec un voyageur");
    await expect(page.locator(".bv-hero-secondary-cta")).toHaveAttribute("href", "/#publish/requests");
    await expect(page.locator("text=Catégorie de produit")).toBeVisible();

    // Check the 4 Trust Bar pillars
    const trustItems = page.locator(".bv-trust-bar-item");
    await expect(trustItems).toHaveCount(4);
    await expect(trustItems.nth(0)).toContainText("Séquestre Stripe Connect");
    await expect(trustItems.nth(1)).toContainText("Double Remise QR & Photo");
    await expect(trustItems.nth(2)).toContainText("Express Vol Direct 24h–48h");
    await expect(trustItems.nth(3)).toContainText("Jusqu'à -70 % d'économie");
  });
});
