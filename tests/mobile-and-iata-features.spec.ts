import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test.describe("Mobile & IATA Logistics Features", () => {
  test("BottomNavBar renders on mobile (390x844) with 5 tabs and active indicator, navigates between sections", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#explore");

    const bottomNav = page.locator(".mobile-bottom-nav");
    await expect(bottomNav).toBeVisible();

    const exploreTab = bottomNav.getByRole("button", { name: "Explorer" });
    const radarTab = bottomNav.getByRole("button", { name: "Radar" });
    const arbitrageTab = bottomNav.getByRole("button", { name: "Arbitrage" });
    const trackingTab = bottomNav.getByRole("button", { name: "Expéditions" });
    const messagesTab = bottomNav.getByRole("button", { name: "Messages" });

    await expect(exploreTab).toBeVisible();
    await expect(radarTab).toBeVisible();
    await expect(arbitrageTab).toBeVisible();
    await expect(trackingTab).toBeVisible();
    await expect(messagesTab).toBeVisible();

    // Verify initial active state on Explorer
    await expect(exploreTab).toHaveAttribute("aria-current", "page");

    // Navigate to Arbitrage
    await arbitrageTab.click();
    await expect(page).toHaveURL(/#arbitrage/);

    // Navigate to Messages
    await messagesTab.click();
    await expect(page).toHaveURL(/#messages/);

    // Navigate to Tracking
    await trackingTab.click();
    await expect(page).toHaveURL(/#tracking/);
  });

  test("BottomNavBar is hidden on desktop viewports (1440x900)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/#explore");
    const bottomNav = page.locator(".mobile-bottom-nav");
    await expect(bottomNav).not.toBeVisible();
  });

  test("IATA Resolution 792 Boarding Pass Scanner decodes airline passes and imports verified flight data", async ({
    page,
  }) => {
    await page.goto("/#explore");
    const trigger = page.getByRole("button", {
      name: "Scanner carte d’embarquement IATA",
    });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const modal = page.getByRole("dialog", {
      name: "Scanner de Carte d’Embarquement",
    });
    await expect(modal).toBeVisible();
    await expect(modal.locator(".bv-tool-tag")).toContainText(
      "IATA RESOLUTION 792 (BCBP)",
    );

    // Default is Air Algerie CDG -> ALG
    await expect(modal.locator(".iata-flight-number")).toContainText("AH1000");
    await expect(modal.locator(".iata-pnr-badge")).toContainText("ABC123");
    await expect(modal.locator(".detail-value").first()).toContainText(
      "MARTIN LINA",
    );

    // Switch to Air France
    await modal
      .getByRole("button", { name: /Air France · Paris CDG -> Oran/ })
      .click();
    await expect(modal.locator(".iata-flight-number")).toContainText("AF1154");
    await expect(modal.locator(".iata-pnr-badge")).toContainText("TRF890");
    await expect(modal.locator(".detail-value").first()).toContainText(
      "DUBOIS THOMAS",
    );

    // Switch to Royal Air Maroc (Business Class)
    await modal
      .getByRole("button", {
        name: /Royal Air Maroc · Paris ORY -> Casablanca/,
      })
      .click();
    await expect(modal.locator(".iata-flight-number")).toContainText("AT780");
    await expect(modal.locator(".detail-value").nth(2)).toContainText(
      "Classe Affaires (Business)",
    );
    await expect(modal.locator(".detail-value").nth(3)).toContainText(
      "2 x 32 kg inclus",
    );

    // Import flight
    const importBtn = modal.getByRole("button", {
      name: "Valider et importer le vol",
    });
    await importBtn.click();
    await expect(modal.getByRole("status")).toContainText(
      "Vol importé avec succès",
    );

    // Escape closes modal and returns focus
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("Digital Cargo Pass displays Apple Wallet style pass, barcodes and downloads passbook receipt", async ({
    page,
  }) => {
    await page.goto("/#explore");
    const trigger = page.getByRole("button", {
      name: "Passe de fret numérique",
    });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const modal = page.getByRole("dialog", {
      name: "Passe Numérique de Fret",
    });
    await expect(modal).toBeVisible();
    await expect(modal.locator(".pass-brand-badge")).toContainText(
      "BAGVOYAGE CARGO",
    );
    await expect(modal.locator(".station-code").first()).toContainText("CDG");
    await expect(modal.locator(".station-code").last()).toContainText("ALG");
    await expect(modal.locator(".pass-flight-number")).toContainText("AH1021");

    // Add to wallet
    const walletBtn = modal.getByRole("button", {
      name: "Ajouter à Apple / Google Wallet",
    });
    await walletBtn.click();
    await expect(modal.getByRole("status")).toContainText(
      "Passe synchronisé avec votre portefeuille sécurisé",
    );

    // Download pass file
    const downloadEvent = page.waitForEvent("download");
    await modal
      .getByRole("button", { name: "Télécharger le pass hors-ligne" })
      .click();
    const download = await downloadEvent;
    const text = await readFile((await download.path())!, "utf8");
    expect(text).toContain("BAGVOYAGE DIGITAL CARGO PASS");
    expect(text).toContain("AH1021");
    expect(text).toContain("Karim Bouzid");
    expect(text).toContain("STEB-2026-VOID-447B");

    // Close with Escape
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("Offline Airport Handover protocol simulates recipient signed QR code and traveler verification", async ({
    page,
  }) => {
    await page.goto("/#explore");
    const networkPill = page.locator(".network-status-pill");
    await expect(networkPill).toBeVisible();
    await networkPill.click();

    const modal = page.getByRole("dialog", {
      name: "Remise Hors-Ligne & Signature Cryptographique",
    });
    await expect(modal).toBeVisible();
    await expect(modal.locator(".bv-tool-tag")).toContainText("ZONE BLANCHE");

    // Recipient tab is active by default
    await expect(modal.locator(".qr-nonce")).toContainText("0x8F2A9C4B7E");
    await expect(modal.locator(".pin-digits")).toContainText("4829");

    // Switch to traveler tab
    await modal
      .getByRole("tab", { name: "Voyageur (Scanner et valider)" })
      .click();
    const submitBtn = modal.getByRole("button", {
      name: "Signer et valider la remise",
    });
    await expect(submitBtn).toBeDisabled();

    // Type valid PIN and check STEB seal checkbox
    await modal.getByLabel(/Saisir le code PIN oral à 4 chiffres/).fill("4829");
    await expect(submitBtn).toBeDisabled();

    await modal.getByRole("checkbox").check();
    await expect(submitBtn).toBeEnabled();

    // Submit handover
    await submitBtn.click();
    await expect(modal.getByRole("status")).toContainText(
      "Remise hors-ligne enregistrée avec succès",
    );

    // Close with Escape
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
  });
});
