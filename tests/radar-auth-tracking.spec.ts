import { test, expect } from "@playwright/test";

test("radar geodesics preserve endpoints, heading, time and telemetry invariants", async ({
  page,
}) => {
  await page.goto("/#radar");
  const result = await page.evaluate(async () => {
    const path = "/src/services/flightFerryRadarApi.ts";
    const api = (await import(
      path
    )) as typeof import("../src/services/flightFerryRadarApi");
    const epoch = Date.UTC(2026, 9, 20, 12);
    const routes = api.createRadarRoutes(epoch);
    return routes.map((route) => {
      const before = api
        .getRadarSnapshot(route.departureAt - 3600000, epoch)
        .movements.find((m) => m.id === route.id)!;
      const start = api.routePosition(route, 0);
      const end = api.routePosition(route, 1);
      const middle = api
        .getRadarSnapshot((route.departureAt + route.arrivalAt) / 2, epoch)
        .movements.find((m) => m.id === route.id)!;
      const after = api
        .getRadarSnapshot(route.arrivalAt + 60000, epoch)
        .movements.find((m) => m.id === route.id)!;
      return {
        startError: api.geodesicDistance(start.position, route.origin),
        endError: api.geodesicDistance(end.position, route.destination),
        before: before.status,
        after: after.status,
        speedBefore: before.groundSpeedKmh,
        speedAfter: after.groundSpeedKmh,
        progress: middle.progress,
        heading: middle.heading,
        speed: middle.groundSpeedKmh,
        sea: middle.kind === "ferry",
        altitude: middle.altitudeM,
        wave: middle.weather.waveHeightM,
      };
    });
  });
  expect(result).toHaveLength(9);
  for (const route of result) {
    expect(route.startError).toBeLessThan(0.001);
    expect(route.endError).toBeLessThan(0.001);
    expect(route.before).toBe("scheduled");
    expect(route.after).toBe("arrived");
    expect(route.speedBefore + route.speedAfter).toBe(0);
    expect(route.progress).toBe(0.5);
    expect(route.heading).toBeGreaterThanOrEqual(0);
    expect(route.heading).toBeLessThan(360);
    expect(route.speed).toBeGreaterThan(0);
    if (route.sea) {
      expect(route.altitude).toBe(0);
      expect(route.wave).not.toBeNull();
    } else expect(route.altitude).toBeGreaterThan(0);
  }
});

test("radar filters, sorts, selects with keyboard and prepares the selected route", async ({
  page,
}) => {
  await page.goto("/#radar");
  const table = page.getByRole("table");
  await expect(table.locator("tbody tr")).toHaveCount(9);
  await page.getByRole("button", { name: "Ferries 3", exact: true }).click();
  await expect(table.locator("tbody tr")).toHaveCount(3);
  await page.getByLabel("Rechercher une liaison").fill("introuvable");
  await expect(page.getByText("Aucune liaison trouvée")).toBeVisible();
  await page.getByRole("button", { name: "Réinitialiser les filtres" }).click();
  await table.getByRole("button", { name: "Tarif / kg" }).click();
  await expect(table.locator("tbody tr").first()).toContainText(
    "Badji Mokhtar III",
  );
  await table.getByRole("button", { name: "Tarif / kg" }).click();
  await expect(table.locator("tbody tr").first()).toContainText("AF1154");
  await page
    .getByRole("button", { name: "Détails AF1154", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  const drawer = page.getByRole("dialog", { name: "AF1154" });
  await expect(drawer).toBeVisible();
  await expect(drawer).toContainText("Données simulées");
  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Détails AF1154", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Détails AF1154", exact: true })
    .click();
  await drawer
    .getByRole("button", { name: "Expédier un colis sur ce vol" })
    .click();
  const composer = page.getByRole("dialog");
  await expect(
    composer.getByLabel("Ville de départ", { exact: true }),
  ).toHaveValue("Paris Charles de Gaulle");
  await expect(
    composer.getByLabel("Ville de destination", { exact: true }),
  ).toHaveValue("Alger Houari Boumediene");
  await expect(composer).toContainText("AF1154");
});

test("demo passkey is explicit and session choice persists through reload", async ({
  page,
}) => {
  await page.goto("/#login");
  await page
    .getByLabel("Adresse e-mail", { exact: true })
    .fill("unknown@example.test");
  await page.getByLabel("Mot de passe", { exact: true }).fill("incorrect");
  await page
    .locator(".bv-form")
    .getByRole("button", { name: "Se connecter", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("incorrect");
  await page.getByRole("button", { name: "Passkey / Biométrie Démo" }).click();
  const dialog = page.getByRole("dialog", {
    name: "Simulation Passkey / WebAuthn",
  });
  await expect(dialog).toContainText("ne crée aucune clé WebAuthn");
  await dialog
    .getByRole("button", { name: "Simuler la connexion de Karim" })
    .click();
  await expect(page).toHaveURL(/#tracking$/);
  await expect
    .poll(() =>
      page.evaluate(() => sessionStorage.getItem("bagvoyage_session_user")),
    )
    .not.toBeNull();
  expect(
    await page.evaluate(() => localStorage.getItem("bagvoyage_user")),
  ).toBeNull();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "En cours 0", exact: true }),
  ).toBeVisible();
  await page.goto("/#login");
  await page
    .getByRole("button", { name: "Se déconnecter", exact: true })
    .click();
  await page.getByLabel("Rester connecté sur cet appareil").check();
  await page.getByRole("button", { name: "TM TransMed Flotte pro" }).click();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("bagvoyage_user")))
    .toContain("TransMed");
  expect(
    await page.evaluate(() => sessionStorage.getItem("bagvoyage_session_user")),
  ).toBeNull();
});

test("four-step registration validates passwords and keeps simulated KYC pending", async ({
  page,
}) => {
  await page.goto("/#register");
  await page.getByRole("radio", { name: /Acheteur Shop & Go/ }).check();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await page.getByLabel("Prénom", { exact: true }).fill("Lina");
  await page.getByLabel("Nom", { exact: true }).fill("Test");
  await page.getByLabel("Nom d’utilisateur").fill("lina.radar");
  await page
    .getByLabel("Adresse e-mail", { exact: true })
    .fill("lina.radar@example.test");
  await page.getByLabel("Date de naissance").fill("1993-04-10");
  await page.getByLabel("Ville", { exact: true }).fill("Alger");
  await page.getByLabel("Indicatif").selectOption("+213");
  await page.getByLabel("Téléphone", { exact: true }).fill("0555123456");
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await page.getByLabel("Mot de passe", { exact: true }).fill("weak");
  await page.getByLabel("Confirmer le mot de passe").fill("weak");
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("quatre critères");
  await page.getByLabel("Mot de passe", { exact: true }).fill("BagVoyage2026!");
  await page.getByLabel("Confirmer le mot de passe").fill("BagVoyage2026!");
  await expect(page.getByRole("meter")).toHaveAttribute("aria-valuenow", "4");
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await page
    .getByRole("button", { name: "Simuler le contrôle biométrique" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "identité reste en attente",
  );
  await page.getByRole("checkbox", { name: /J’accepte/ }).check();
  await page
    .getByRole("button", { name: "Créer mon compte", exact: true })
    .click();
  await expect(page).toHaveURL(/#tracking$/);
  const stored = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("bagvoyage_user") || "{}") as {
        kycStatus: string;
        roles: string[];
        phone: string;
      },
  );
  expect(stored.kycStatus).toBe("pending");
  expect(stored.roles).toEqual(["buyer"]);
  expect(stored.phone).toBe("+213555123456");
  await page.goto("/#login");
  await page
    .getByRole("button", { name: "Se déconnecter", exact: true })
    .click();
  await page
    .getByLabel("Adresse e-mail", { exact: true })
    .fill("lina.radar@example.test");
  await page.getByLabel("Mot de passe", { exact: true }).fill("BagVoyage2026!");
  await page
    .locator(".bv-form")
    .getByRole("button", { name: "Se connecter", exact: true })
    .click();
  await expect(page).toHaveURL(/#tracking$/);
});

test("tracking isolates account shipments and opens documents with no invented route", async ({
  page,
}) => {
  await page.goto("/#login");
  await page.getByRole("button", { name: "KB Karim Voyageur" }).click();
  await page.evaluate(async () => {
    const path = "/src/services/productionDb.ts";
    const { saveRecords } = (await import(
      path
    )) as typeof import("../src/services/productionDb");
    const base = {
      name: "Lina",
      amount: 42,
      messages: [],
      pickupCode: "1234",
      deliveryCode: "5678",
    };
    await saveRecords("conversations", [
      {
        ...base,
        id: "tracking-own",
        subject: "Colis personnel",
        stage: "collected",
        participantIds: ["user-voyageur-1"],
      },
      {
        ...base,
        id: "tracking-done",
        subject: "Colis remis",
        stage: "delivered",
        participantIds: ["user-voyageur-1"],
      },
      {
        ...base,
        id: "tracking-other",
        subject: "Colis privé autre compte",
        stage: "collected",
        participantIds: ["other-user"],
      },
    ]);
  });
  await expect(page.locator(".bv-shipment")).toHaveCount(1);
  await expect(
    page.getByText("Colis personnel", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Colis privé autre compte", { exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Bordereau LTA / Waybill" }).click();
  const waybill = page.getByRole("dialog", { name: "Bordereau de transport" });
  await expect(waybill.getByLabel("Contenu détaillé")).toHaveValue(
    "Colis personnel",
  );
  await expect(
    waybill.getByLabel("Référence vol / bateau / trajet"),
  ).toHaveValue("");
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Déclaration en douane · Article 106" })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Douane & assurance" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Clôturées 1" }).click();
  await expect(page.locator(".bv-shipment")).toContainText("Colis remis");
  await page.reload();
  await expect(page.locator(".bv-shipment")).toContainText("Colis personnel");
});

test("new destinations fit the viewport and render without browser errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of ["radar", "login", "register", "tracking"]) {
    await page.goto(`/#${route}`);
    await expect(page.locator(".bv-expansion").first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("a signed-in member finds an agreement made from a legacy conversation in tracking", async ({
  page,
}) => {
  await page.goto("/#login");
  await page.getByRole("button", { name: "MT Mohamed Expéditeur" }).click();
  await page.goto("/#messages");
  await page.getByRole("button", { name: /Karim Bouzid/ }).click();
  await page.getByRole("button", { name: "Enregistrer l’accord", exact: true }).click();
  await page
    .getByRole("link", { name: "Mes expéditions", exact: true })
    .click();
  await expect(page.locator(".bv-shipment")).toHaveCount(1);
  await expect(page.locator(".bv-shipment")).toContainText(
    "Vol Marseille-Alger",
  );
  await page.reload();
  await expect(page.locator(".bv-shipment")).toHaveCount(1);
});
