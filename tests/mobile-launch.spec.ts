import { expect, test } from "@playwright/test";

test("public landing and download remain available when the app database is blocked", async ({
  page,
}) => {
  await page.addInitScript(() => {
    indexedDB.open = () => {
      throw new DOMException("Database blocked", "SecurityError");
    };
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Le monde est grand",
  );
  await page.locator(".landing-hero .app-store-badge").first().click();
  await expect(page.getByRole("dialog")).toContainText(
    "BagVoyage sur iPhone & Android",
  );
});

test("public routes render the landing", async ({ page }) => {
  for (const route of ["/", "/landing", "/landing/", "/#landing"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Le monde est grand",
    );
    await expect(page.locator(".site-header")).toHaveCount(0);
    await expect(page.locator(".request-card")).toHaveCount(0);
  }
});

test("app entry aliases render the marketplace", async ({ page }) => {
  for (const route of ["/app", "/app/", "/#explore"]) {
    await page.goto(route);
    await expect(page.locator(".request-card")).toHaveCount(2);
  }
});

for (const route of [
  "/download",
  "/download/",
  "/#download",
  "/app#download",
]) {
  test(`download deep link ${route} survives reload and opens the web app`, async ({
    page,
  }) => {
    await page.goto(route);
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.reload();
    const modal = page.getByRole("dialog");
    await expect(modal).toContainText("BagVoyage sur iPhone & Android");
    await modal
      .getByRole("link", { name: "Ouvrir l’application Web maintenant" })
      .click();
    await expect(page.locator(".request-card")).toHaveCount(2);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
}

test("store badges open an accessible modal and restore keyboard focus", async ({
  page,
}) => {
  await page.goto("/");
  const badges = page.locator(".landing-hero .app-store-badge");
  await expect(badges).toHaveCount(2);
  for (const badge of await badges.all()) {
    await badge.click();
    const dialog = page.getByRole("dialog");
    const close = dialog.getByRole("button", {
      name: "Fermer le lancement mobile",
    });
    await expect(close).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(
      dialog.getByRole("button", {
        name: "M’inscrire sur la liste prioritaire",
      }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(badge).toBeFocused();
  }
  await badges.first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goForward();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("priority signup persists and avoids duplicates across the section and modal", async ({
  page,
}) => {
  await page.goto("/#mobile");
  const section = page.getByRole("region", {
    name: /Application Mobile Native/,
  });
  await section
    .getByLabel("Votre e-mail pour le lancement")
    .fill("Voyageur@exemple.fr");
  await section
    .getByRole("button", { name: "M’inscrire sur la liste prioritaire" })
    .click();
  await expect(section.getByRole("status")).toContainText(
    "Inscription confirmée pour voyageur@exemple.fr",
  );
  await section
    .getByRole("link", { name: "Découvrir le lancement mobile" })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Votre e-mail pour le lancement")
    .fill("voyageur@exemple.fr");
  await dialog
    .getByRole("button", { name: "M’inscrire sur la liste prioritaire" })
    .click();
  await expect(dialog.getByRole("status")).toContainText(
    "Inscription confirmée",
  );
  await page.reload();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("bv_mobile_waitlist") || "null"),
    ),
  ).toEqual(["voyageur@exemple.fr"]);
  await page
    .getByRole("dialog")
    .getByLabel("Votre e-mail pour le lancement")
    .fill("autre@exemple.fr");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "M’inscrire sur la liste prioritaire" })
    .click();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("bv_mobile_waitlist") || "null"),
    ),
  ).toEqual(["voyageur@exemple.fr", "autre@exemple.fr"]);
});

test("blocked storage reports failure without a false signup confirmation", async ({
  page,
}) => {
  await page.goto("/download");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage blocked", "QuotaExceededError");
    };
  });
  await dialog
    .getByLabel("Votre e-mail pour le lancement")
    .fill("test@exemple.fr");
  await dialog
    .getByRole("button", { name: "M’inscrire sur la liste prioritaire" })
    .click();
  await expect(dialog.getByRole("alert")).toContainText(
    "n’a pas pu être enregistrée",
  );
  await expect(dialog.getByRole("status")).toBeEmpty();
});

test("landing sections, auth links and mobile layout remain usable", async ({
  page,
}) => {
  await page.goto("/");
  for (const [name, hash, target] of [
    ["Fonctionnalités", "features", ".landing-universes"],
    ["Simulateur", "simulator", ".landing-simulator"],
    ["Application Mobile", "mobile", ".landing-mobile"],
  ]) {
    await page
      .getByRole("navigation", { name: "Présentation de BagVoyage" })
      .getByRole("link", { name, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`#${hash}$`));
    await expect(page.locator(target)).toBeInViewport();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Le monde est grand",
    );
  }
  for (const [name, hash] of [
    ["Connexion", "login"],
    ["Inscription", "register"],
  ]) {
    await page.goto("/");
    await page
      .locator(".landing-account-actions")
      .getByRole("link", { name, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`#${hash}$`));
    await expect(page.locator(".awwwards-landing")).toHaveCount(0);
  }
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator(".landing-hero .app-store-badge").first().click();
  const modal = page.getByRole("dialog");
  expect(
    await modal.evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
});
