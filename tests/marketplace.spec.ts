import { test, expect, Page } from "@playwright/test";
const nav = (page: Page, name: string) =>
  page
    .getByRole("navigation", { name: /Navigation/ })
    .getByRole("button", { name, exact: true })
    .filter({ visible: true });
async function openRequest(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Voir la demande" }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Nike Air Max · pointure 42",
  );
}
test("search, combined filters, reset and empty state", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".request-card")).toHaveCount(2);
  await page
    .getByRole("textbox", { name: "Rechercher une annonce" })
    .fill("Nice Marseille");
  await expect(page.locator(".request-card")).toHaveCount(1);
  await expect(page.locator(".request-card")).toContainText("Dior");
  await page.getByRole("button", { name: "Tout effacer" }).click();
  await page.getByRole("button", { name: "Budget", exact: true }).click();
  await page.getByLabel("Budget article maximum").fill("105");
  await page.getByRole("button", { name: "Appliquer" }).click();
  await expect(page.locator(".request-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Destination", exact: true }).click();
  await page.getByLabel("Destination", { exact: true }).selectOption("Lyon");
  await expect(page.getByText("Aucune annonce pour le moment")).toBeVisible();
  await page.getByRole("button", { name: "Réinitialiser les filtres" }).click();
  await expect(page.locator(".request-card")).toHaveCount(2);
});
test("transport routes, vehicle filters and detail contact", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Transports", exact: true }).click();
  await expect(page.locator(".trip-card")).toHaveCount(9);
  await expect(page.locator(".trip-card").first()).toContainText(
    "80 × 60 × 40 cm",
  );
  await page.getByRole("button", { name: "Véhicule", exact: true }).click();
  await page
    .getByLabel("Véhicule", { exact: true })
    .selectOption("Camionnette");
  await page.getByRole("button", { name: "Appliquer" }).click();
  await expect(page.locator(".trip-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Voir le trajet" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Grenoble",
  );
  await page.getByRole("button", { name: "Contacter Lucas" }).click();
  await expect(
    page.getByRole("textbox", { name: "Message à Lucas" }),
  ).toBeVisible();
});
test("profile supports multiple intentions and preserves choices", async ({
  page,
}) => {
  await page.goto("/");
  await nav(page, "Profil").click();
  await page.getByLabel("Je transporte").check();
  await page.getByLabel("J’achète et je livre").check();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await nav(page, "Profil").click();
  await expect(page.getByLabel("Je transporte")).toBeChecked();
  await expect(page.getByLabel("J’achète et je livre")).toBeChecked();
  await page.reload();
  await expect(page.getByLabel("Je transporte")).toBeChecked();
  await page.getByRole("button", { name: "Continuer avec Apple" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "La connexion Apple sera disponible",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("publish a purchase request and persist its details", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Publier une demande", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Article recherché").fill("Livre de photographie");
  await dialog.getByLabel("Précisions").fill("Neuf · édition française");
  await dialog.getByLabel("Départ", { exact: true }).fill("Nantes");
  await dialog.getByLabel("Destination", { exact: true }).fill("Bordeaux");
  await dialog.getByLabel("Livraison souhaitée").fill("2027-10-20");
  await dialog.getByLabel("Lieu de livraison").fill("Bordeaux, gare");
  await dialog.getByLabel("Budget article").fill("40");
  await dialog.getByLabel("Service (€)").fill("12");
  await dialog.getByRole("button", { name: "Publier ma demande" }).click();
  await expect(page.locator(".request-card").first()).toContainText(
    "Livre de photographie",
  );
  await page.reload();
  await page.getByRole("button", { name: "Voir la demande" }).first().click();
  await expect(page.getByText("Bordeaux, gare")).toBeVisible();
});
test("request chat, PIN rejection, both QR stages and four ratings", async ({
  page,
}) => {
  await openRequest(page);
  await expect(page.getByText("Neuves · Noires · Pointure 42")).toBeVisible();
  await page
    .getByRole("button", { name: "Proposer d’acheter et livrer" })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Message à Sarah" }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Message à Sarah" })
    .fill("Je peux passer demain.");
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  await expect(page.getByRole("log")).toContainText("Je peux passer demain.");
  await page.getByRole("button", { name: "Enregistrer l’accord" }).click();
  await expect(page.locator(".escrow-strip")).toContainText(
    "Fonds sous séquestre · 145 €",
  );
  await page.getByRole("button", { name: "Envoyer le PIN / QR code" }).click();
  await expect(
    page
      .getByRole("log")
      .getByRole("img", { name: "QR code de validation de la remise" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Valider la remise" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Code PIN ou contenu").fill("0000");
  await dialog
    .getByRole("button", { name: "Valider la prise en charge" })
    .click();
  await expect(dialog.getByRole("alert")).toContainText("Code incorrect");
  const firstCode = await dialog.locator(".demo-code strong").innerText();
  await dialog.getByLabel("Code PIN ou contenu").fill(firstCode);
  await dialog
    .getByRole("button", { name: "Valider la prise en charge" })
    .click();
  await expect(
    dialog.getByText("Confirmer la livraison", { exact: true }),
  ).toBeVisible();
  await dialog.getByLabel("Code PIN ou contenu").fill(firstCode);
  await dialog
    .getByRole("button", { name: "Valider la livraison", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toBeVisible();
  // Decode the generated second QR via the same real image import offered to users.
  const dataUrl = await dialog.locator(".qr-image").getAttribute("src");
  await dialog.locator("input[type=file]").setInputFiles({
    name: "delivery.png",
    mimeType: "image/png",
    buffer: Buffer.from(dataUrl!.split(",")[1], "base64"),
  });
  await expect(dialog.getByText("Article remis, merci !")).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Envoyer mon avis" }),
  ).toBeDisabled();
  for (const criterion of [
    "Réactivité",
    "Ponctualité",
    "Échange clair",
    "Marchandise intacte",
  ])
    await dialog
      .getByRole("radio", { name: `${criterion} : 5 sur 5`, exact: true })
      .check();
  await dialog.getByRole("button", { name: "Envoyer mon avis" }).click();
  await expect(
    dialog.getByText("Votre avis a été enregistré. Merci !"),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Fermer", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: /Sarah.*Nike/ }).click();
  await expect(page.locator(".escrow-strip")).toContainText("Fonds libérés");
});
test("scanner enforces 10 kg allowance => 9 kg offer and publishes", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Un billet, de la place/ }).click();
  await page.getByRole("button", { name: /Air Algérie/ }).click();
  await expect(page.getByRole("dialog")).toContainText("9 kg", {
    timeout: 15000,
  });
  const weight = page.getByRole("slider", { name: "Kilos à partager" });
  await expect(weight).toHaveAttribute("max", "9");
  await weight.focus();
  await page.keyboard.press("End");
  await page.keyboard.press("ArrowRight");
  await expect(weight).toHaveValue("9");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /Publier/ })
    .click();
  await expect(page.locator(".trip-card").first()).toContainText(
    "9 kg disponibles",
  );
});
test("arbitrage remains available and starts the relevant conversation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Votre prochain voyage/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Voyager gratuit",
  );
  await page.getByRole("button", { name: "Choisir ce voyage" }).click();
  await expect(page.getByRole("dialog")).toContainText("Gain après le billet");
  await page.getByRole("button", { name: "Discuter des missions" }).click();
  await expect(page.locator(".conversation-detail")).toContainText(
    "Dior Sauvage",
  );
});
test("four screens fit viewport without runtime errors", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of ["", "#profile", "#request/nike-air-max"]) {
    await page.goto(`/${route}`);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: testInfo.outputPath(
        `${route.replace(/[^a-z]/g, "") || "requests"}.png`,
      ),
      fullPage: true,
    });
  }
  await page.goto("/");
  await page.getByRole("button", { name: "Transports", exact: true }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: testInfo.outputPath("transports.png"),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
