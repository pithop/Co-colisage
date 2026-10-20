import { test, expect } from "@playwright/test";

test("the single header and international catalogue keep every corridor reachable", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".request-card")).toHaveCount(2);
  expect((await page.locator(".site-header").boundingBox())!.height).toBe(68);
  await expect(page.locator(".header-destinations")).toHaveCount(0);
  for (const name of ["1 EUR = 242.50 DZD · Square Port-Saïd", "Radar Méditerranée", "Découvrir BagVoyage", "Super Admin"]) {
    await expect(page.getByRole("button", { name, exact: true })).toBeAttached();
  }
  await page.getByRole("button", { name: "Monde entier", exact: true }).click();
  for (const city of ["Casablanca", "Marrakech", "Tunis", "Djerba", "Dakar", "Abidjan", "Montréal", "Dubaï", "Alger", "Oran", "Constantine"]) {
    await page.getByLabel("Rechercher une annonce").fill(city);
    expect(await page.locator(".request-card").count()).toBeGreaterThan(0);
  }
  await page.getByRole("button", { name: "Transports", exact: true }).click();
  await page.getByLabel("Rechercher une annonce").fill("Yasmine");
  await page.getByRole("button", { name: "Voir le trajet" }).first().click();
  await expect(page.getByRole("region", { name: "Avis sur ce voyageur" })).toContainText("démonstration");
  expect(await page.locator(".buyer-row img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("matching respects direction, delivery dates, capacity, deduplication and cent arithmetic", async ({ page }) => {
  await page.goto("/#arbitrage");
  const result = await page.evaluate(async () => {
    const path = "/src/services/flightArbitrageApi.ts";
    const api = await import(path) as typeof import("../src/services/flightArbitrageApi");
    const now = Date.UTC(2030, 9, 20);
    const flight = { ...api.estimatedFlightOffers(new Date(now)).find(offer => offer.routeId === "par-alg")!, availableKg: 10, flightPrice: 49 };
    const base: import("../src/data/marketplace").PurchaseRequest = {
      id: "a", title: "Pièce auto", origin: "Paris", destination: "Alger",
      date: "2030-10-25", budget: 900, reward: 70, weightKg: 10,
      buyer: "Amine", image: "", specifications: "", location: "",
    };
    const requests = [
      base, { ...base, id: "b", weightKg: 6, reward: 50 },
      { ...base, id: "c", weightKg: 4, reward: 40 },
      { ...base, id: "c", weightKg: 4, reward: 40 },
      { ...base, id: "reverse", origin: "Alger", destination: "Paris", reward: 900 },
      { ...base, id: "expired", date: "2030-10-20", reward: 900 },
      { ...base, id: "late-pickup", availableFrom: "2030-10-24", reward: 900 },
      { ...base, id: "missing-weight", weightKg: undefined, reward: 900 },
      { ...base, id: "reserved", status: "reserved" as const, reward: 900 },
      { ...base, id: "wrong-airport", originCode: "CDG", reward: 900 },
      { ...base, id: "bad-date", date: "2030-02-31", reward: 900 },
    ];
    const match = api.matchFlight(flight, requests, [], now);
    const reserved = api.matchFlight(flight, requests, ["b", "c"], now);
    const stale = api.matchFlight({ ...flight, expiresAt: new Date(now - 1).toISOString() }, requests, [], now);
    const pennies = api.calculateProfit([0.1, 0.2], 0.2);
    const example = api.calculateProfit([60, 55, 45, 120], 49);
    const withFees = api.calculateProfit([60, 55, 45, 120], 49, 25, 6);
    const noCost = api.calculateProfit([10], 0);
    return { ids: match.requestIds, weight: match.totalWeightKg, net: match.netProfit, reserved: reserved.requestIds, stale: stale.ordersCount, pennies, example, withFees, noCost };
  });
  expect(result.ids).toEqual(["b", "c"]);
  expect(result.weight).toBe(10);
  expect(result.net).toBe(41);
  expect(result.reserved).toEqual(["a"]);
  expect(result.stale).toBe(0);
  expect(result.pennies.netProfit).toBe(0.1);
  expect(result.example.netProfit).toBe(231);
  expect(result.example.roi).toBe(471.4);
  expect(result.withFees.netProfit).toBe(200);
  expect(result.noCost.roi).toBeNull();
});

test("the scanner filters, calculates the bundle and opens persistent discussions only once", async ({ page }) => {
  await page.goto("/#arbitrage/par-alg");
  await expect(page.getByRole("status")).toContainText("+231");
  await page.getByLabel("Ville de départ", { exact: true }).selectOption("Paris");
  await page.getByLabel("Ville d’arrivée", { exact: true }).selectOption("Alger");
  await page.getByLabel("Gain net minimum (€)").fill("200");
  await page.getByLabel("Trier les vols").selectOption("roi");
  await expect(page.locator(".arbitrage-results > button")).toHaveCount(1);
  await page.getByLabel("Gain net minimum (€)").fill("1000");
  await expect(page.getByText("Aucun vol ne correspond à ces critères.")).toBeVisible();
  await page.getByLabel("Gain net minimum (€)").fill("200");
  await page.getByRole("button", { name: "Réserver et sécuriser le deal", exact: true }).click();
  await expect(page).toHaveURL(/#messages$/);
  await expect(page.locator(".conversation-detail")).toContainText("Groupe de 4 missions");
  await page.reload();
  const saved = await page.evaluate(async () => {
    const path = "/src/services/productionDb.ts";
    const db = await import(path) as typeof import("../src/services/productionDb");
    return (await db.getConversations()).filter(item => item.arbitrage).map(item => ({ id: item.id, stage: item.stage, messages: item.messages.length, group: item.arbitrage!.groupId }));
  });
  expect(saved).toHaveLength(4);
  expect(new Set(saved.map(item => item.group)).size).toBe(1);
  expect(saved.every(item => item.stage === "discussion" && item.messages === 1)).toBe(true);
  await page.goto("/#arbitrage/par-alg");
  await page.getByRole("button", { name: "Réserver et sécuriser le deal", exact: true }).click();
  await expect(page).toHaveURL(/#messages$/);
  const counts = await page.evaluate(async () => {
    const path = "/src/services/productionDb.ts";
    const db = await import(path) as typeof import("../src/services/productionDb");
    return (await db.getConversations()).filter(item => item.arbitrage).map(item => item.messages.length);
  });
  expect(counts).toEqual([1, 1, 1, 1]);
});

test("a stale bundle aborts every write and simultaneous preparations remain idempotent", async ({ page }) => {
  await page.goto("/#arbitrage/par-alg");
  await expect(page.getByRole("status")).toContainText("+231");
  const result = await page.evaluate(async () => {
    const apiPath = "/src/services/flightArbitrageApi.ts";
    const dbPath = "/src/services/productionDb.ts";
    const bookingPath = "/src/services/arbitrageBooking.ts";
    const db = await import(dbPath) as typeof import("../src/services/productionDb");
    const api = await import(apiPath) as typeof import("../src/services/flightArbitrageApi");
    const booking = await import(bookingPath) as typeof import("../src/services/arbitrageBooking");
    const requests = await db.getPurchaseRequests();
    const offer = api.estimatedFlightOffers().filter(offer => offer.routeId === "par-alg").sort((a, b) => a.flightPrice - b.flightPrice)[0];
    const deal = api.matchFlight(offer, requests);
    const first = requests.find(item => item.id === deal.requestIds[0])!;
    await db.savePurchaseRequest({ ...first, status: "reserved" });
    let rejected = false;
    try { await booking.prepareArbitrageDeal(deal, "test-actor"); } catch { rejected = true; }
    const partial = (await db.getConversations()).filter(item => item.arbitrage).length;
    await db.savePurchaseRequest(first);
    await Promise.all([booking.prepareArbitrageDeal(deal, "test-actor"), booking.prepareArbitrageDeal(deal, "test-actor")]);
    const conversations = (await db.getConversations()).filter(item => item.arbitrage);
    return { rejected, partial, count: conversations.length, messages: conversations.map(item => item.messages.length) };
  });
  expect(result).toEqual({ rejected: true, partial: 0, count: 4, messages: [1, 1, 1, 1] });
});

test("live offers are validated and a provider failure returns explicitly estimated fares", async ({ page }) => {
  await page.goto("/#arbitrage");
  await page.route("**/api/test-flight-offers", route => route.fulfill({ json: { offers: [] } }));
  const empty = await page.evaluate(async () => {
    const path = "/src/services/flightArbitrageApi.ts";
    const api = await import(path) as typeof import("../src/services/flightArbitrageApi");
    return api.flightArbitrageApi.scan([], [], undefined, { endpoint: "/api/test-flight-offers" });
  });
  expect(empty.source).toBe("live");
  expect(empty.offers).toEqual([]);
  await page.route("**/api/test-flight-offers", route => route.fulfill({ status: 503 }));
  const result = await page.evaluate(async () => {
    const path = "/src/services/flightArbitrageApi.ts";
    const api = await import(path) as typeof import("../src/services/flightArbitrageApi");
    const flight = api.estimatedFlightOffers()[0];
    const valid = api.parseLiveOffers({ offers: [flight] });
    const invalid = [
      { offers: [{ ...flight, currency: "USD" }] },
      { offers: [{ ...flight, fees: undefined }] },
      { offers: [{ ...flight, flightPrice: -1 }] },
      { offers: [{ ...flight, expiresAt: "2000-01-01T00:00:00Z" }] },
      { offers: [{ ...flight, arrivalAt: flight.departureAt }] },
      { offers: [flight, flight] },
    ];
    return { valid: valid[0].source, rejected: invalid.every(value => { try { api.parseLiveOffers(value); return false; } catch { return true; } }), fallback: await api.flightArbitrageApi.scan([], [], undefined, { endpoint: "/api/test-flight-offers" }) };
  });
  expect(result.valid).toBe("live");
  expect(result.rejected).toBe(true);
  expect(result.fallback.source).toBe("estimate");
  expect(result.fallback.error).toContain("indisponibles");
  expect(result.fallback.offers.length).toBeGreaterThan(0);
});

test("world radar filters and maps the international flight references", async ({ page }) => {
  await page.goto("/#radar");
  for (const [corridor, reference] of [["maghreb", "AT780"], ["maghreb", "TU720"], ["west-africa", "HC404"], ["transatlantic", "AC870"], ["middle-east", "EK074"]]) {
    await page.getByLabel("Corridor", { exact: true }).selectOption(corridor);
    await page.getByLabel("Rechercher une liaison").fill(reference);
    await expect(page.locator(".bv-manifest tbody tr")).toHaveCount(1);
    await expect(page.locator(".bv-manifest tbody tr")).toContainText(reference);
    await page.getByRole("button", { name: `Détails ${reference}`, exact: true }).click();
    await expect(page.getByRole("dialog", { name: reference, exact: true })).toContainText("Données simulées");
    await page.keyboard.press("Escape");
  }
  await page.getByRole("button", { name: "Détails EK074", exact: true }).click();
  await page.getByRole("button", { name: "Expédier un colis sur ce vol" }).click();
  await expect(page.getByRole("dialog").getByLabel("Ville de destination", { exact: true })).toHaveValue("Dubaï International");
  await expect(page.getByRole("dialog").getByLabel("Valeur marchande déclarée (EUR)")).toBeVisible();
  await expect(page.getByRole("dialog").getByLabel("Sens du passage")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
