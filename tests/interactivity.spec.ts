import { test, expect, Page } from "@playwright/test";

const nav = (page: Page, name: string) =>
  page
    .getByRole("navigation", { name: /Navigation/ })
    .getByRole("button", { name, exact: true })
    .filter({ visible: true });

async function registerProfile(page: Page, email = "lea@example.test") {
  await page.goto("/#profile");
  await page
    .getByRole("button", { name: "Créer un compte", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Nom d’utilisateur", { exact: true })
    .fill("lea.martin");
  await dialog.getByLabel("Prénom", { exact: true }).fill("Léa");
  await dialog.getByLabel("Nom", { exact: true }).fill("Martin");
  await dialog.getByLabel("Date de naissance").fill("1995-06-15");
  await dialog.getByLabel("Ville", { exact: true }).fill("Lyon");
  await dialog.getByLabel("Téléphone").fill("+33 6 12 34 56 78");
  await dialog.getByLabel("Adresse e-mail").fill(email);
  await dialog.getByLabel("Mot de passe").fill("UnePhraseDeTest42");
  await dialog
    .getByRole("button", { name: "Continuer vers la vérification" })
    .click();
  return dialog;
}

test("local registration requires KYC inputs and supports sign out and password login", async ({
  page,
}) => {
  const dialog = await registerProfile(page);
  await expect(
    dialog.getByRole("button", { name: "Valider mon inscription" }),
  ).toBeDisabled();
  await dialog.getByLabel("Selfie", { exact: true }).setInputFiles({
    name: "invalid.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("invalid"),
  });
  await expect(dialog.getByRole("alert")).toContainText(
    "Choisissez un fichier",
  );
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN1sAAAAASUVORK5CYII=",
    "base64",
  );
  for (const label of ["Selfie", "Pièce d’identité"]) {
    await dialog
      .getByLabel(label, { exact: true })
      .setInputFiles({
        name: "fixture.png",
        mimeType: "image/png",
        buffer: png,
      });
    await expect(
      dialog.getByRole("img", { name: `Aperçu : ${label}`, exact: true }),
    ).toBeVisible();
  }
  await dialog.getByRole("button", { name: "Valider mon inscription" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".profile-login")).toContainText("Léa Martin");
  await expect(page.locator(".kyc-status")).toContainText(
    "Identité en attente de vérification",
  );
  await page.reload();
  await expect(page.locator(".profile-login")).toContainText("Léa Martin");
  const stored = await page.evaluate(() =>
    localStorage.getItem("ep-local-accounts-v1")!,
  );
  expect(stored).not.toContain("UnePhraseDeTest42");
  expect(stored).not.toContain("data:image");
  expect(JSON.parse(stored)[0].user).toMatchObject({
    username: "lea.martin",
    city: "Lyon",
    birthDate: "1995-06-15",
    kycStatus: "pending",
  });
  await page.getByRole("button", { name: "Se déconnecter" }).click();
  await page
    .locator(".profile-login")
    .getByRole("button", { name: "Se connecter", exact: true })
    .click();
  await dialog.getByLabel("Adresse e-mail").fill("lea@example.test");
  await dialog.getByLabel("Mot de passe").fill("mauvais-mot-de-passe");
  await dialog
    .getByRole("button", { name: "Se connecter", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toContainText("incorrect");
  await dialog.getByLabel("Mot de passe").fill("UnePhraseDeTest42");
  await dialog
    .getByRole("button", { name: "Se connecter", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".profile-login")).toContainText("Léa Martin");
});

test("demo documents and one-click accounts are usable", async ({ page }) => {
  const dialog = await registerProfile(page);
  await dialog
    .getByRole("button", {
      name: "Utiliser des justificatifs de démonstration",
    })
    .click();
  await dialog.getByRole("button", { name: "Valider mon inscription" }).click();
  await expect(dialog).toHaveCount(0);
  for (const [button, name] of [
    ["Karim (Voyageur)", "Karim Bouzid"],
    ["TransMed (Pro)", "TransMed Logistique SARL"],
    ["Mohamed (Client)", "Mohamed Touati"],
  ]) {
    await page.getByRole("button", { name: "Se déconnecter" }).click();
    await page
      .locator(".profile-login")
      .getByRole("button", { name: "Se connecter", exact: true })
      .click();
    await dialog.getByRole("button", { name: button, exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator(".profile-login")).toContainText(name);
  }
});

test("seeded chats reply after 800 ms and preserve agreements across navigation", async ({
  page,
}) => {
  await page.goto("/#messages");
  await expect(page.locator(".conversation-preview")).toHaveCount(3);
  await expect(page.locator(".conversation-list")).toContainText(
    "Karim Bouzid",
  );
  await expect(page.locator(".conversation-list")).toContainText(
    "Vol Marseille-Alger",
  );
  await expect(page.locator(".conversation-list")).toContainText("Paris-Lille");
  await page.getByRole("button", { name: /Sarah.*Nike/ }).click();
  await expect(page.locator(".message")).toHaveCount(4);
  await page.clock.install({ time: new Date("2026-10-19T12:00:00Z") });
  await page.clock.pauseAt(new Date("2026-10-19T12:00:01Z"));
  for (const text of ["Demain à 18 h ?", "Je garderai le ticket."]) {
    await page.getByRole("textbox", { name: "Message à Sarah" }).fill(text);
    await page.getByRole("button", { name: "Envoyer le message" }).click();
  }
  await expect(page.locator(".message")).toHaveCount(6);
  await page.getByRole("button", { name: "Simuler l’accord" }).click();
  await expect(page.locator(".toast")).toContainText("Accord simulé");
  await page.clock.runFor(799);
  await expect(page.locator(".message")).toHaveCount(7);
  await nav(page, "Explorer").click();
  await page.clock.runFor(1);
  await nav(page, "Messages").click();
  await expect(page.locator(".message")).toHaveCount(9);
  await expect(page.locator(".escrow-strip")).toContainText(
    "Fonds sous séquestre",
  );
  await page.reload();
  await page.getByRole("button", { name: /Sarah.*Nike/ }).click();
  await expect(page.locator(".message")).toHaveCount(9);
  await expect(page.locator(".escrow-strip")).toContainText(
    "Fonds sous séquestre",
  );
});

test("card surfaces open details and demo PIN helper follows both delivery stages", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".request-card")
    .first()
    .click({ position: { x: 10, y: 10 } });
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Nike Air Max",
  );
  await page
    .getByRole("button", { name: "Proposer d’acheter et livrer" })
    .click();
  await page.getByRole("button", { name: "Simuler l’accord" }).click();
  await page
    .getByRole("button", { name: "Valider la remise", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  const first = await dialog.locator(".demo-code strong").innerText();
  for (const action of ["Valider la prise en charge", "Valider la livraison"]) {
    const expected = await dialog.locator(".demo-code strong").innerText();
    if (action === "Valider la livraison") expect(expected).not.toBe(first);
    await dialog
      .getByRole("button", { name: "Remplir le code (démo)" })
      .click();
    await expect(dialog.getByLabel("Code PIN ou contenu")).toHaveValue(
      expected,
    );
    await dialog.getByRole("button", { name: action, exact: true }).click();
  }
  await expect(dialog.getByText("Article remis, merci !")).toBeVisible();
  await dialog.getByRole("button", { name: "Fermer", exact: true }).click();
  await nav(page, "Explorer").click();
  await page.getByRole("button", { name: "Transports", exact: true }).click();
  await page
    .locator(".trip-card")
    .first()
    .click({ position: { x: 10, y: 10 } });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Lille");
});
