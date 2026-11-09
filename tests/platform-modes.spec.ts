import { test, expect } from "@playwright/test";

test.describe("Tri-Modal Platforms & Interactive Visualizers", () => {
  test("loads Mode Voyageur with flight search and animated luggage simulator", async ({ page }) => {
    await page.goto("/#voyageur");
    await expect(page.locator("h1")).toContainText("Trouvez un voyageur");
    
    // Check 3-way switcher presence
    const switcher = page.locator("[role='radiogroup']:visible");
    await expect(switcher.first()).toBeVisible();

    // Check dual action cards matching client mockup
    await expect(page.locator("text=J'envoie un colis").first()).toBeVisible();
    await expect(page.locator("text=Je cherche des bagages").first()).toBeVisible();

    // Check bottom navigation on mobile or desktop
    const nav = page.locator("nav[aria-label='Navigation mobile']");
    if (await nav.isVisible()) {
      await expect(page.locator("text=Mes missions").first()).toBeVisible();
    }
  });

  test("switches to Mode Bag&Go with 4-block form and ParcelVisualizer", async ({ page }) => {
    await page.goto("/#bagandgo");
    await expect(page.locator("h1")).toContainText("Publiez votre demande d'envoi de colis");

    // Check 4-block form headers
    await expect(page.locator("text=Informations du colis").first()).toBeVisible();
    await expect(page.locator("text=Urgence & Délai").first()).toBeVisible();
    await expect(page.locator("text=Destination").first()).toBeVisible();
    await expect(page.locator("text=Option déplacement").first()).toBeVisible();

    // Check ParcelVisualizer
    await expect(page.locator("text=Simulateur de Colis Dynamique").first()).toBeVisible();
  });

  test("switches to Mode Shop&Go with interactive order form and ShopBudgetVisualizer", async ({ page }) => {
    await page.goto("/#shopandgo");
    await expect(page.locator("h1")).toContainText("Commandez ce que vous voulez");

    // Check ShopBudgetVisualizer
    await expect(page.locator("text=Simulateur de Panier & Séquestre").first()).toBeVisible();
    await expect(page.locator("text=Budget total estimé").first()).toBeVisible();

    // Check form fields
    await expect(page.locator("text=Votre commande").first()).toBeVisible();
    await expect(page.locator("button:has-text('Publier ma demande')").first()).toBeVisible();
  });

  test("verifies mobile 5-tab navigation and modals suite", async ({ page }) => {
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
});

