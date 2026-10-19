import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

const walletButton = (page: Page) =>
  page.getByRole("button", { name: /^Mon portefeuille, solde disponible/ });
const bell = (page: Page) =>
  page.getByRole("button", { name: /^Notifications, / });

test("wallet opens from header and profile with escrow, cash rule and filterable history", async ({
  page,
}) => {
  await page.goto("/");
  await walletButton(page).click();
  await expect(page).toHaveURL(/#wallet$/);
  await expect(
    page.getByRole("heading", { name: "Mon portefeuille", exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("available-balance")).toHaveText("345,00 €");
  await expect(page.getByTestId("escrow-balance")).toHaveText("145,00 €");
  await expect(
    page.getByRole("region", { name: "Fonds sous séquestre actifs" }),
  ).toContainText("Prestataire bancaire à connecter");
  await expect(page.locator(".wallet-cash")).toContainText("espèces");
  await expect(page.locator(".wallet-cash")).toContainText("QR code");
  await expect(page.locator(".transaction-row")).toHaveCount(5);
  await expect(page.locator(".transaction-row time").first()).toHaveAttribute(
    "datetime",
    /2026-/,
  );
  for (const [status, count] of [
    ["Séquestré", 1],
    ["Débloqué", 3],
    ["Virement", 1],
  ] as const) {
    await page.getByRole("button", { name: status, exact: true }).click();
    await expect(page.locator(".transaction-row")).toHaveCount(count);
  }
  await page.goto("/#profile");
  await page.locator(".profile-wallet").click();
  await expect(page).toHaveURL(/#wallet$/);
  await page.reload();
  await expect(page.getByTestId("available-balance")).toHaveText("345,00 €");
});

test("SEPA validates checksum and amount, confirms once, persists and masks bank data", async ({
  page,
}) => {
  await page.goto("/#wallet");
  await page.getByRole("button", { name: /^Virer vers/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("IBAN du compte bancaire")
    .fill("FR76 3000 6000 0112 3456 7890 180");
  await dialog.getByRole("button", { name: "Vérifier le virement" }).click();
  await expect(dialog.getByRole("alert")).toContainText("IBAN valide");
  await dialog
    .getByRole("button", { name: "Préremplir un exemple d’IBAN" })
    .click();
  for (const amount of ["0", "-1", "345.01", "12.123", "NaN"]) {
    await dialog.getByLabel("Montant du virement").fill(amount);
    await dialog.getByRole("button", { name: "Vérifier le virement" }).click();
    await expect(dialog.getByRole("alert")).toContainText("Le montant doit");
  }
  await dialog.getByLabel("Montant du virement").fill("100,25");
  await dialog.getByRole("button", { name: "Vérifier le virement" }).click();
  await expect(dialog).toContainText("244,75 €");
  await expect(page.getByTestId("available-balance")).toHaveText("345,00 €");
  await dialog
    .getByRole("button", { name: "Confirmer la demande de virement" })
    .click();
  await expect(dialog).toContainText("Demande de virement enregistrée");
  await expect(page.getByTestId("available-balance")).toHaveText("244,75 €");
  await expect(page.getByTestId("escrow-balance")).toHaveText("145,00 €");
  await dialog.getByRole("button", { name: "Terminer" }).click();
  await expect(walletButton(page)).toHaveAccessibleName(/244,75/);
  await expect(page.locator(".transaction-row")).toHaveCount(6);
  await page.reload();
  await expect(page.getByTestId("available-balance")).toHaveText("244,75 €");
  const stored = await page.evaluate(() =>
    localStorage.getItem("ep-wallet-transfers-v1"),
  );
  expect(stored).not.toContain("FR76");
  expect(stored).not.toContain("123456789");
  expect(JSON.parse(stored!)).toHaveLength(1);
});

test("cancel and edit never debit; transferring the remaining balance disables new withdrawals", async ({
  page,
}) => {
  await page.goto("/#wallet");
  const open = page.getByRole("button", { name: /^Virer vers/ });
  await open.click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "Préremplir un exemple d’IBAN" })
    .click();
  await dialog.getByRole("button", { name: "Vérifier le virement" }).click();
  await dialog.getByRole("button", { name: "Modifier", exact: true }).click();
  await expect(dialog.getByLabel("Montant du virement")).toHaveValue("345.00");
  await page.keyboard.press("Escape");
  await expect(open).toBeFocused();
  await expect(page.getByTestId("available-balance")).toHaveText("345,00 €");
  await open.click();
  await dialog
    .getByRole("button", { name: "Préremplir un exemple d’IBAN" })
    .click();
  await dialog.getByRole("button", { name: "Vérifier le virement" }).click();
  await dialog
    .getByRole("button", { name: "Confirmer la demande de virement" })
    .click();
  await dialog.getByRole("button", { name: "Terminer" }).click();
  await expect(open).toBeDisabled();
  await expect(page.getByTestId("available-balance")).toHaveText("0,00 €");
  await expect(page.getByTestId("escrow-balance")).toHaveText("145,00 €");
});

test("downloaded receipt contains transaction amount, date, status and demo disclaimer", async ({
  page,
}) => {
  await page.goto("/#wallet");
  const downloadEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: /Télécharger le reçu de Caution/ })
    .click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe(
    "recu-deposit-nike-air-max.txt",
  );
  const receipt = await readFile((await download.path())!, "utf8");
  expect(receipt).toContain("SANS VALEUR COMPTABLE");
  expect(receipt).toContain("145,00");
  expect(receipt).toContain("Séquestré");
  expect(receipt).toContain("19/10/2026");
  expect(receipt).toContain("Nike Air Max");
});

test("deposit only releases after final handover and never credits twice on reload", async ({
  page,
}) => {
  await page.goto("/#messages");
  await page.getByRole("button", { name: /Sarah.*Nike/ }).click();
  await page
    .getByRole("button", { name: "Enregistrer l’accord", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Valider la remise", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Utiliser le code affiché" }).click();
  await dialog
    .getByRole("button", { name: "Valider la prise en charge", exact: true })
    .click();
  await dialog.getByRole("button", { name: "Fermer", exact: true }).click();
  await walletButton(page).click();
  await expect(page.getByTestId("escrow-balance")).toHaveText("145,00 €");
  await expect(page.getByTestId("available-balance")).toHaveText("345,00 €");
  await page.goto("/#messages");
  await page
    .getByRole("button", { name: "Valider la remise", exact: true })
    .click();
  await dialog.getByRole("button", { name: "Utiliser le code affiché" }).click();
  await dialog
    .getByRole("button", { name: "Valider la livraison", exact: true })
    .click();
  await dialog.getByRole("button", { name: "Fermer", exact: true }).click();
  await walletButton(page).click();
  await expect(page.getByTestId("escrow-balance")).toHaveText("0,00 €");
  await expect(page.getByTestId("available-balance")).toHaveText("490,00 €");
  await page.reload();
  await expect(page.getByTestId("available-balance")).toHaveText("490,00 €");
  await expect(page.locator(".transaction-row")).toHaveCount(5);
});

test("notifications support reading, filtering, persistence, focus trapping and closing", async ({
  page,
}) => {
  await page.goto("/");
  await expect(bell(page)).toHaveAccessibleName("Notifications, 4 non lues");
  await bell(page).click();
  const drawer = page.getByRole("dialog", { name: /Notifications/ });
  await expect(drawer.locator(".notification-item")).toHaveCount(4);
  await expect(
    drawer.getByRole("button", { name: "Fermer les notifications" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(
    await drawer.evaluate((node) => node.contains(document.activeElement)),
  ).toBeTruthy();
  await drawer
    .getByRole("button", { name: /Arbitrage IA.*Voyagez gratuit/ })
    .click();
  await expect(
    drawer.getByRole("button", { name: "Estimer ce vol" }),
  ).toBeVisible();
  await expect(bell(page)).toHaveAccessibleName("Notifications, 3 non lues");
  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);
  await expect(bell(page)).toBeFocused();
  await page.reload();
  await expect(bell(page)).toHaveAccessibleName("Notifications, 3 non lues");
  await bell(page).click();
  await drawer.getByRole("button", { name: "Non lues", exact: true }).click();
  await expect(drawer.locator(".notification-item")).toHaveCount(3);
  await drawer
    .getByRole("button", { name: /Suivi de commande.*Sarah/ })
    .click();
  await expect(
    drawer.getByRole("button", { name: "Ouvrir le suivi avec Sarah" }),
  ).toBeVisible();
  await expect(bell(page)).toHaveAccessibleName("Notifications, 2 non lues");
  await drawer.getByRole("button", { name: "Tout lire", exact: true }).click();
  await expect(
    drawer.getByRole("heading", { name: "Vous êtes à jour" }),
  ).toBeVisible();
  await expect(page.locator(".notification-count")).toHaveCount(0);
  await drawer
    .getByRole("button", { name: "Voir toutes les notifications" })
    .click();
  await expect(drawer.locator(".notification-item")).toHaveCount(4);
  await page.reload();
  await expect(bell(page)).toHaveAccessibleName("Notifications, 0 non lues");
});

test("each alert navigates to its relevant simulation, conversation or profile", async ({
  page,
}) => {
  await page.goto("/");
  for (const [summary, action, destination] of [
    [/Arbitrage IA.*Voyagez gratuit/, "Estimer ce vol", "arbitrage/mrs-alg"],
    [/Suivi de commande.*Sarah/, "Ouvrir le suivi avec Sarah", "messages"],
    [/Alerte retard.*Karim/, "Contacter Karim", "messages"],
    [/Identité & sécurité.*Votre identité/, "Voir mon profil", "profile"],
  ] as const) {
    await bell(page).click();
    const drawer = page.getByRole("dialog");
    await drawer.getByRole("button", { name: summary }).click();
    await drawer.getByRole("button", { name: action, exact: true }).click();
    await expect(drawer).toHaveCount(0);
    await expect(page).toHaveURL(new RegExp(`#${destination}$`));
    if (action === "Estimer ce vol") {
      await expect(page.getByLabel("Itinéraire du vol")).toHaveValue("mrs-alg");
      await expect(page.getByRole("status")).toContainText("+101");
    } else if (action.includes("Sarah"))
      await expect(
        page.getByRole("textbox", { name: "Message à Sarah" }),
      ).toBeVisible();
    else if (action.includes("Karim"))
      await expect(
        page.getByRole("textbox", { name: "Message à Karim Bouzid" }),
      ).toBeVisible();
    else
      await expect(
        page.getByRole("heading", { name: "Statut & Vérification" }),
      ).toBeVisible();
  }
});

test("express calculator updates all destinations and preserves the chosen flight on reload", async ({
  page,
}) => {
  await page.goto("/");
  const widget = page.getByRole("region", {
    name: "Calculateur de vol gratuit",
  });
  for (const [route, profit, fare] of [
    ["mrs-alg", "101", "49"],
    ["lys-orn", "95", "55"],
    ["mrs-tun", "105", "45"],
    ["tls-cmn", "81", "69"],
  ]) {
    await widget.getByLabel("Votre destination").selectOption(route);
    await expect(widget.getByRole("status")).toContainText(`+${profit} €`);
    await expect(widget.getByRole("status")).toContainText(`${fare} € de vol`);
  }
  await widget.getByLabel("Votre destination").selectOption("lys-orn");
  await widget.getByRole("button", { name: "Estimer ce voyage" }).click();
  await expect(page.getByLabel("Itinéraire du vol")).toHaveValue("lys-orn");
  await expect(page.getByRole("status")).toContainText("+95");
  await page.reload();
  await expect(page.getByLabel("Itinéraire du vol")).toHaveValue("lys-orn");
  await page.getByRole("button", { name: "Choisir ce voyage" }).click();
  await expect(page.getByRole("dialog")).toContainText("Lyon → Oran");
  await expect(page.getByRole("dialog")).toContainText("55 €");
});

test("finance screens fit viewport and produce no runtime errors", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of ["explore", "wallet"]) {
    await page.goto(`/#${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: testInfo.outputPath(`${route}.png`),
      fullPage: true,
    });
  }
  await bell(page).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: testInfo.outputPath("notifications.png"),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
