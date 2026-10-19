import { test, expect } from "@playwright/test";

test("currency converts both ways, switches rates and restores keyboard focus", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "1 EUR = 242.50 DZD · Square Port-Saïd",
  });
  await trigger.click();
  const modal = page.getByRole("dialog");
  const eur = modal.getByLabel("Montant en EUR");
  const dzd = modal.getByLabel("Montant en DZD");
  await eur.fill("20,50");
  await expect(dzd).toHaveValue("4971.25");
  await dzd.fill("24250");
  await expect(eur).toHaveValue("100.00");
  await modal.getByRole("button", { name: "Inverser EUR et DZD" }).click();
  await expect(modal.locator(".currency-amount input").first()).toHaveAttribute(
    "aria-label",
    "Montant en DZD",
  );
  await modal.getByRole("button", { name: "250 EUR high-tech" }).click();
  await modal.getByLabel("Mode de conversion").selectOption("official");
  await expect(dzd).toHaveValue("36450.00");
  await expect(modal.locator(".currency-comparison")).toContainText("+66.3%");
  await eur.fill("");
  await expect(dzd).toBeEmpty();
  await eur.fill("0");
  await expect(dzd).toHaveValue("0.00");
  const close = modal.getByRole("button", { name: "Fermer le convertisseur" });
  await close.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(
    modal.getByRole("button", { name: "500 EUR smartphone" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(modal).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("shopping suggestions remain editable and update the basket total", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Publier une demande", exact: true })
    .click();
  const modal = page.getByRole("dialog");
  for (const [name, price] of [
    ["Dior Sauvage 100ml", "125"],
    ["AirPods Pro 2 USB-C", "279"],
    ["Caudalie Sérum Éclat", "38"],
    ["Chocolats Valrhona CDG", "32"],
  ]) {
    await modal
      .getByRole("button", { name: `${name} (${price} EUR)`, exact: true })
      .click();
    await expect(modal.getByLabel("Article recherché")).toHaveValue(name);
    await expect(modal.getByLabel("Budget article (€)")).toHaveValue(price);
    await expect(
      modal.getByLabel("Précisions", { exact: true }),
    ).not.toBeEmpty();
  }
  await modal.getByLabel("Article recherché").fill("Coffret personnalisé");
  await modal
    .getByLabel("Précisions", { exact: true })
    .fill("Chocolat noir, emballage cadeau");
  await modal.getByLabel("Budget article (€)").fill("45");
  await modal.getByLabel("Départ", { exact: true }).fill("Paris");
  await modal.getByLabel("Destination", { exact: true }).fill("Alger");
  await modal.getByLabel("Livraison souhaitée").fill("2027-10-20");
  await modal.getByLabel("Service (€)").fill("12");
  await modal.getByRole("button", { name: "Publier ma demande" }).click();
  const card = page
    .locator(".request-card")
    .filter({ hasText: "Coffret personnalisé" });
  await expect(card).toContainText("45");
  await page.reload();
  await expect(card).toContainText("Coffret personnalisé");
});

test("voice preview falls back on blocked audio, pauses, changes speed and finishes", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(new DOMException("Blocked", "NotAllowedError"));
  });
  await page.goto("/#messages");
  await page
    .getByRole("button", { name: /Karim Bouzid.*Vol Marseille/ })
    .click();
  const player = page.locator(".voice-player");
  await expect(player.locator("audio")).toHaveAttribute(
    "src",
    "/audio/voice-note-1.ogg",
  );
  await expect(player.locator(".voice-wave rect")).toHaveCount(24);
  await player.getByRole("button", { name: "Écouter la note vocale" }).click();
  await expect(player).toContainText("Aperçu simulé");
  await expect(player.locator(".voice-time")).not.toHaveText("0:00 / 0:14");
  await player.getByRole("button", { name: "Mettre en pause" }).click();
  const paused = await player.locator(".voice-time").innerText();
  await page.waitForTimeout(1100);
  await expect(player.locator(".voice-time")).toHaveText(paused);
  await player
    .getByRole("button", { name: "Vitesse de lecture : 1x", exact: true })
    .click();
  await player
    .getByRole("button", { name: "Vitesse de lecture : 1.5x", exact: true })
    .click();
  await player.getByRole("button", { name: "Écouter la note vocale" }).click();
  await expect(player.locator(".voice-time")).toHaveText("0:14 / 0:14", {
    timeout: 10000,
  });
  await expect(
    player.getByRole("button", { name: "Écouter la note vocale" }),
  ).toBeVisible();
  await player.getByRole("button", { name: "Écouter la note vocale" }).click();
  await expect(player.locator(".voice-time")).not.toHaveText("0:14 / 0:14");
});

test("voice capture cancels cleanly and persists a sent message without changing Sarah's seed", async ({
  page,
}) => {
  await page.goto("/#messages");
  await page.getByRole("button", { name: /Sarah.*Nike/ }).click();
  const messages = page.getByRole("log").locator(".message");
  await expect(messages).toHaveCount(4);
  const original = await messages.locator("p").allTextContents();
  await page
    .getByRole("button", { name: "Enregistrer une note vocale" })
    .click();
  const recorder = page.getByRole("region", {
    name: "Enregistrement de note vocale",
  });
  await expect(recorder.getByLabel("Durée de capture")).not.toHaveText("0:00");
  await recorder.getByRole("button", { name: "Annuler", exact: true }).click();
  await expect(recorder).toHaveCount(0);
  await expect(messages).toHaveCount(4);
  await page
    .getByRole("button", { name: "Enregistrer une note vocale" })
    .click();
  await recorder
    .getByRole("button", { name: "Envoyer la note vocale" })
    .click();
  await expect(messages).toHaveCount(5);
  await expect(messages.last()).toContainText("Note vocale (0:14)");
  expect((await messages.locator("p").allTextContents()).slice(0, 4)).toEqual(
    original,
  );
  await page.reload();
  await page.getByRole("button", { name: /Sarah.*Nike/ }).click();
  await expect(messages).toHaveCount(5);
  await expect(messages.last().locator("audio")).toHaveAttribute(
    "src",
    "/audio/voice-note-1.ogg",
  );
});

test("luggage compartment buttons and slider remain synchronized", async ({
  page,
}) => {
  await page.goto("/");
  const slider = page.getByRole("slider", {
    name: "Kilos disponibles dans vos bagages",
  });
  const cabin = page.getByRole("button", { name: "Format Cabine" });
  const hold = page.getByRole("button", { name: "Format Soute" });
  await expect(cabin).toHaveAttribute("aria-pressed", "true");
  await hold.click();
  await expect(slider).toHaveValue("11");
  await slider.fill("30");
  await expect(hold).toHaveAttribute("aria-pressed", "true");
  await cabin.click();
  await expect(slider).toHaveValue("10");
  await expect(
    page.getByRole("button", { name: "Filtrer les annonces pour 10 kg" }),
  ).toBeVisible();
});
