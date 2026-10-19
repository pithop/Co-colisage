import { test, expect } from "@playwright/test";

test("language selector switches language and toggles rtl direction for Arabic", async ({ page }) => {
  await page.goto("/");
  const selector = page.locator(".bv-language select").first();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");

  // Switch to English
  await selector.selectOption("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");

  // Switch to Arabic
  await selector.selectOption("ar");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

  // Switch back to French
  await selector.selectOption("fr");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});

test("radar modal displays flights, changes corridor and shows live status", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Radar Méditerranée" }).click();
  const modal = page.getByRole("dialog", { name: "Corridors Méditerranée" });
  await expect(modal).toContainText("RADAR OPÉRATIONNEL BAGVOYAGE");
  await expect(modal).toContainText("AH1021");
  await expect(modal).toContainText("Marseille Provence (MRS)");

  // Select Transavia flight
  await modal.getByRole("button", { name: /TO7240/ }).click();
  await expect(modal).toContainText("Transavia France");
  await expect(modal).toContainText("Paris Orly (ORY)");

  // Refresh data
  await modal.getByRole("button", { name: "Actualiser" }).click();
  await modal.getByRole("button", { name: "Fermer" }).click();
  await expect(modal).toHaveCount(0);
});

test("trust verification modal steps through phone OTP and ID verification", async ({ page }) => {
  await page.goto("/#profile");
  await page.getByRole("button", { name: "Vérifier mon profil" }).click();
  const modal = page.getByRole("dialog", { name: "Centre de confiance" });
  await expect(modal).toContainText("IDENTITÉ & CONFIANCE NIVEAU 3");

  // Phone step
  await modal.getByRole("button", { name: "Envoyer le code SMS" }).click();
  await expect(modal).toContainText("Code de sécurité reçu par SMS");

  // OTP step
  await modal.getByRole("button", { name: "Vérifier le code" }).click();
  await expect(modal).toContainText("Vérification officielle de la pièce d'identité");

  // ID step
  await modal.getByRole("button", { name: "Vérifier mon identité" }).click();
  await expect(modal).toContainText("Identité Certifiée Niveau 3", { timeout: 10000 });

  // Complete
  await modal.getByRole("button", { name: "Terminer" }).click();
  await expect(modal).toHaveCount(0);
});

test("order tracking opens waybill and customs declaration modals", async ({ page }) => {
  await page.goto("/#messages");
  await page.getByRole("button", { name: /Karim Bouzid/ }).click();
  await page.getByRole("button", { name: "Voir le suivi de la commande" }).click();

  const trackingModal = page.getByRole("dialog", { name: "Suivi de la commande" });
  await expect(trackingModal).toBeVisible();

  // Open Waybill
  await trackingModal.getByRole("button", { name: "Bordereau LTA officiel" }).click();
  const waybillModal = page.getByRole("dialog", { name: "Bordereau de transport" });
  await expect(waybillModal).toBeVisible();
  await expect(waybillModal).toContainText("01 / Parties et itinéraire");
  await expect(waybillModal).toContainText("Expéditeur");
  await expect(waybillModal).toContainText("Transporteur");

  // Certify and issue waybill
  await waybillModal.getByRole("checkbox").check();
  await waybillModal.getByRole("button", { name: "Enregistrer le bordereau" }).click();
  await expect(waybillModal).toContainText("01 / EXPÉDITEUR");
  await expect(waybillModal).toContainText("SHA-256");

  await waybillModal.getByRole("button", { name: "Fermer" }).click();
  await expect(waybillModal).toHaveCount(0);

  // Open Customs Modal
  await trackingModal.getByRole("button", { name: "Douane & Assurance" }).click();
  const customsModal = page.getByRole("dialog", { name: "Douane & assurance" });
  await expect(customsModal).toBeVisible();
  await expect(customsModal).toContainText("Article 106 LF 2021");
  await expect(customsModal).toContainText("Franchise Article 106");

  await customsModal.getByRole("button", { name: "Fermer" }).click();
  await expect(customsModal).toHaveCount(0);
});
