import { test, expect } from "@playwright/test";

test("capacity updates estimates, filters requests and preserves direct actions", async ({
  page,
}) => {
  await page.goto("/");
  const visualizer = page.locator(".luggage-visualizer");
  const slider = page.getByRole("slider", {
    name: "Kilos disponibles dans vos bagages",
  });
  await expect(slider).toHaveValue("10");
  await expect(visualizer.locator(".luggage-gain")).toHaveText("+75 €");
  await slider.focus();
  await page.keyboard.press("End");
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveValue("30");
  await expect(visualizer.locator(".luggage-gain")).toHaveText("+225 €");
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowLeft");
  await expect(slider).toHaveValue("1");
  await expect(visualizer.locator(".luggage-flight")).toContainText(
    "Finance une grande partie",
  );
  await expect(visualizer.locator(".luggage-parcels")).toContainText("1 colis");
  await page
    .getByRole("button", { name: "Filtrer les annonces pour 1 kg" })
    .click();
  await expect(page.locator(".request-card")).toHaveCount(1);
  await expect(page.locator(".request-card")).toContainText("Dior");
  await page.getByRole("button", { name: "Tout effacer" }).click();
  await expect(page.locator(".request-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Go !", exact: true }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Nike Air Max",
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Lancer le scan express" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("off-platform warning reacts to draft and quick replies send immediately", async ({
  page,
}) => {
  await page.goto("/#messages");
  await page.getByRole("button", { name: /Sarah.*Nike/ }).click();
  const draft = page.getByRole("textbox", { name: "Message à Sarah" });
  const warning = page.locator(".antifraud-warning");
  for (const text of [
    "WhatsApp",
    "0612345678",
    "PAYPAL",
    "liquide",
    "payer en direct",
    "hors appli",
    "virement perso",
    "IBAN",
  ]) {
    await draft.fill(text);
    await expect(warning.getByRole("alert")).toContainText(
      "Bouclier Séquestre BagVoyage",
    );
  }
  await draft.fill("Rendez-vous à la gare");
  await expect(warning).toHaveCount(0);
  await draft.fill("On passe sur WhatsApp ?");
  await page.getByRole("button", { name: "Sécuriser l’accord" }).click();
  await expect(page.locator(".escrow-strip")).toContainText(
    "Fonds sous séquestre",
  );
  await expect(draft).toHaveValue("On passe sur WhatsApp ?");
  await page.getByRole("button", { name: "Sécuriser l’accord" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  for (const reply of [
    "Colis récupéré et conforme",
    "Vol à l’heure",
    "Je suis au point de rendez-vous",
    "Code PIN transmis",
  ]) {
    await page.getByRole("button", { name: reply, exact: true }).click();
    await expect(
      page.getByRole("log").locator(".message.mine").filter({ hasText: reply }),
    ).toHaveCount(1);
    await expect(draft).toBeEmpty();
  }
  await expect(warning).toHaveCount(0);
  // A status reply must not bypass the actual PIN handover workflow.
  await expect(page.locator(".escrow-strip")).toContainText(
    "Fonds sous séquestre",
  );
});

test("reputation details and saved preference flow into a published flight", async ({
  page,
}) => {
  await page.goto("/#profile");
  await expect(page.getByRole("progressbar")).toHaveCount(4);
  await expect(
    page.getByRole("progressbar", { name: "Échange clair" }),
  ).toHaveAttribute("aria-valuenow", "4.9");
  const criterion = page.locator(".reputation-criterion").first();
  await criterion.locator("summary").click();
  await expect(criterion.locator("p")).toContainText("moins de 15 min");
  const preference = page.getByRole("switch", {
    name: "Acceptation automatique instantanée",
  });
  await preference.check();
  await page.reload();
  await expect(preference).toBeChecked();
  await page.goto("/");
  await page.getByRole("button", { name: "Transports", exact: true }).click();
  await expect(
    page.locator(".trip-card").first().locator(".instant-badge"),
  ).toBeVisible();
  await expect(
    page.locator(".trip-card").first().locator(".super-traveler-badge"),
  ).toBeVisible();
  await page.locator(".publish-dock button").click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("combobox", { name: "Véhicule", exact: true })
    .selectOption("avion");
  await dialog.getByLabel("Modèle ou compagnie").fill("Air France");
  await dialog.getByLabel("Numéro de vol").fill("af1384");
  await dialog.getByLabel("Départ", { exact: true }).fill("Paris");
  await dialog.getByLabel("Destination", { exact: true }).fill("Alger");
  await dialog.getByLabel("Date de départ").fill("2027-10-20");
  await dialog.getByLabel("Heure de départ").fill("10:30");
  await dialog.getByLabel("Place disponible").fill("12");
  await dialog.getByLabel("Prix par kilo").fill("8");
  await expect(
    dialog.getByRole("checkbox", {
      name: /Acceptation automatique des réservations/,
    }),
  ).toBeChecked();
  await dialog
    .getByRole("checkbox", { name: /Service d’achat en magasin/ })
    .check();
  await dialog
    .getByRole("checkbox", { name: "Électronique", exact: true })
    .check();
  await dialog
    .getByRole("checkbox", { name: "Documents", exact: true })
    .check();
  await dialog.getByRole("button", { name: "Publier mon trajet" }).click();
  const published = page.locator(".trip-card").first();
  await expect(published).toContainText("Acceptation automatique");
  await expect(published.locator(".super-traveler-badge")).toHaveCount(0);
  await published.getByRole("button", { name: "Voir le trajet" }).click();
  await page.reload();
  const options = page.locator(".trip-published-options");
  await expect(options).toContainText("AF1384");
  await expect(options).toContainText("Service d’achat en magasin");
  await expect(options).toContainText("Électronique, Documents");
  await expect(options).toContainText("Réservations des profils vérifiés");
});
