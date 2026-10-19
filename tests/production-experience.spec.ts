import { test, expect } from "@playwright/test";

test("visual transport, corridors, earnings and preview persist without the legacy cache", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Transports", exact: true }).click();
  await page.locator(".publish-dock button").click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Avion Cabine & soute" }).click();
  await expect(dialog.getByLabel("Véhicule", { exact: true })).toHaveValue(
    "avion",
  );
  await dialog
    .getByRole("button", { name: "Lyon LYS → Casablanca CMN" })
    .click();
  await expect(dialog.getByLabel("Départ", { exact: true })).toHaveValue(
    "Lyon",
  );
  await expect(dialog.getByLabel("Destination", { exact: true })).toHaveValue(
    "Casablanca",
  );
  await dialog.getByLabel("Modèle ou compagnie").fill("Royal Air Maroc");
  await dialog.getByLabel("Numéro de vol").fill("AT721");
  await dialog.getByLabel("Date de départ").fill("2027-12-20");
  await dialog.getByLabel("Heure de départ").fill("12:30");
  await dialog.getByLabel("Place disponible").fill("12");
  await dialog.getByLabel("Prix par kilo").fill("10");
  await expect(dialog.locator(".earnings-calculator output")).toContainText(
    "+120 €",
  );
  await expect(dialog.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  await expect(dialog.locator(".live-card-preview")).toContainText(
    "Casablanca",
  );
  await expect(dialog.locator(".live-card-preview")).toContainText(
    "12 kg disponibles",
  );
  await dialog
    .getByRole("checkbox", { name: "Documents", exact: true })
    .check();
  await page.evaluate(() => {
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...args: Parameters<typeof original>) {
      if (args[0] === "trips" && args[1] === "readwrite") {
        IDBDatabase.prototype.transaction = original;
        throw new DOMException("Storage temporarily unavailable", "QuotaExceededError");
      }
      return original.apply(this, args);
    };
  });
  await dialog.getByRole("button", { name: "Publier mon trajet" }).click();
  await expect(page.getByRole("alert")).toContainText("La sauvegarde a échoué");
  await page.getByRole("button", { name: "Réessayer la sauvegarde" }).click();
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const db = await new Promise<IDBDatabase>((resolve) => {
          const request = indexedDB.open("BagVoyageDB_v1");
          request.onsuccess = () => resolve(request.result);
        });
        const rows = await new Promise<any[]>((resolve) => {
          const req = db.transaction("trips").objectStore("trips").getAll();
          req.onsuccess = () => resolve(req.result);
        });
        db.close();
        return rows.some(
          (row) =>
            row.flightNumber === "AT721" &&
            row.acceptedCategories.includes("Documents"),
        );
      }),
    )
    .toBe(true);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "Transports", exact: true }).click();
  await expect(page.locator(".trip-card").first()).toContainText("Casablanca");
});

test("IndexedDB CRUD is atomic, idempotent and updates another open tab", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await expect(page.locator(".request-card")).toHaveCount(2);
  const other = await context.newPage();
  await other.goto("/");
  await expect(other.locator(".request-card")).toHaveCount(2);
  const result = await page.evaluate(async () => {
    const modulePath = "/src/services/productionDb.ts";
    const db = await import(/* @vite-ignore */ modulePath);
    const database: IDBDatabase = await db.initDB();
    const stores = [...database.objectStoreNames];
    const request = {
      ...(await db.getPurchaseRequests())[0],
      id: "cross-tab-request",
      title: "Objectif photo pour Montréal",
    };
    await db.savePurchaseRequest(request);
    const conversation = (await db.getConversations())[0];
    const messages = ["Message A", "Message B"].map((text, i) => ({
      id: `atomic-${i}`,
      text,
      mine: true,
      time: "12:00",
    }));
    await Promise.all(
      messages.map((message) => db.saveMessage(conversation.id, message)),
    );
    await db.saveMessage(conversation.id, messages[0]);
    const saved = await db.getRecord("conversations", conversation.id);
    await db.saveWalletTransaction({
      id: "persisted-transfer",
      title: "Virement",
      detail: "Compte masqué",
      at: new Date().toISOString(),
      cents: -2500,
      status: "Virement",
    });
    return {
      stores,
      messages: saved.messages.filter((message: { id: string }) =>
        message.id.startsWith("atomic-"),
      ).length,
      transfer: (await db.getWalletTransactions()).some(
        (tx: { id: string }) => tx.id === "persisted-transfer",
      ),
    };
  });
  expect(result.stores).toEqual([
    "admin_messages",
    "conversations",
    "kyc_records",
    "orders",
    "pro_applications",
    "purchase_requests",
    "trips",
    "users",
    "wallet_transactions",
  ]);
  expect(result.messages).toBe(2);
  expect(result.transfer).toBe(true);
  await expect(other.locator(".request-card")).toHaveCount(3);
  await expect(other.locator(".request-card")).toContainText([
    "Objectif photo pour Montréal",
    "Nike",
    "Dior",
  ]);
  await page.evaluate(async () => {
    const modulePath = "/src/services/productionDb.ts";
    const db = await import(/* @vite-ignore */ modulePath);
    await db.deleteRecord("purchase_requests", "cross-tab-request");
  });
  await expect(other.locator(".request-card")).toHaveCount(2);
});

test("quick withdrawal, IBAN surface and BIC validation respond to input", async ({
  page,
}) => {
  await page.goto("/#wallet");
  await page.getByRole("button", { name: /^Virer vers/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "50 €", exact: true }).click();
  await expect(dialog.getByLabel("Montant du virement")).toHaveValue("50.00");
  await dialog
    .getByLabel("IBAN du compte bancaire")
    .fill("FR76 3000 6000 0112 3456 7890 189");
  await expect(dialog.locator(".metallic-iban")).toContainText("FR76");
  await expect(dialog.locator(".metallic-virtual-card")).toContainText(
    "Format IBAN vérifié",
  );
  await dialog.getByLabel("Code BIC/SWIFT").fill("invalid");
  await dialog.getByRole("button", { name: "Vérifier le virement" }).click();
  await expect(dialog.getByRole("alert")).toContainText("BIC/SWIFT");
  await dialog.getByLabel("Code BIC/SWIFT").fill("AGRIFRPP");
  await dialog.getByRole("button", { name: "Solde total" }).click();
  await expect(dialog.getByLabel("Montant du virement")).toHaveValue("345.00");
  expect(
    await dialog.evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
});

test("password criteria and tactile PIN remain keyboard accessible", async ({
  page,
}) => {
  await page.goto("/#profile");
  await page
    .getByRole("button", { name: "Créer un compte", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Mot de passe").fill("a");
  await expect(dialog.locator(".password-strength strong")).toHaveText(
    "Faible",
  );
  await dialog.getByLabel("Mot de passe").fill("UnePhraseLongue42!");
  await expect(dialog.getByRole("meter")).toHaveAttribute("aria-valuenow", "4");
  await expect(dialog.locator(".password-strength li.passed")).toHaveCount(4);
  await page.keyboard.press("Escape");
  await page.goto("/#messages");
  await page.getByRole("button", { name: /Sarah.*Nike/ }).click();
  await page
    .getByRole("button", { name: "Enregistrer l’accord", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Valider la remise", exact: true })
    .click();
  const keypad = dialog.getByRole("group", {
    name: "Clavier numérique du code PIN",
  });
  for (const digit of ["1", "2", "3", "4", "5"])
    await keypad.getByRole("button", { name: digit, exact: true }).click();
  await expect(dialog.getByLabel("Code PIN ou contenu")).toHaveValue("1234");
  await expect(dialog.locator(".pin-digit.filled")).toHaveCount(4);
  await keypad
    .getByRole("button", { name: "Effacer le dernier chiffre" })
    .click();
  await expect(dialog.getByLabel("Code PIN ou contenu")).toHaveValue("123");
  await keypad
    .getByRole("button", { name: "Effacer le code", exact: true })
    .click();
  await expect(dialog.getByLabel("Code PIN ou contenu")).toBeEmpty();
});
