import { test, expect, type Page } from "@playwright/test";

const photo = {
  name: "colis.png",
  mimeType: "image/png",
  buffer: Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=",
    "base64",
  ),
};
const pdf = {
  name: "justificatif.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.from("%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF"),
};
async function signInLocal(page: Page) {
  await page.goto("/");
  await expect(page.locator(".request-card")).toHaveCount(2);
  await page.evaluate(async () => {
    const dbPath = "/src/services/productionDb.ts";
    const usersPath = "/src/types/auth.ts";
    const db = await import(/* @vite-ignore */ dbPath);
    const { demoUsers } = await import(/* @vite-ignore */ usersPath);
    const user = {
      ...demoUsers.voyageur,
      id: "pro-applicant",
      name: "Nadia Transport",
      proVerified: false,
      kycStatus: "pending",
    };
    await db.saveRecord("users", user);
    localStorage.setItem("bagvoyage_user", JSON.stringify(user));
  });
  await page.goto("/#profile");
  await page.reload();
}

test("landing simulator, quote comparison, FAQ schema and language are interactive", async ({
  page,
}) => {
  await page.goto("/#landing");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Le monde est grand",
  );
  const simulator = page.getByRole("region", {
    name: "Et si votre prochain voyage rapportait ?",
  });
  await expect(simulator.locator("output").first()).toHaveText("40 €");
  const weight = simulator.getByRole("slider");
  await weight.focus();
  await page.keyboard.press("Home");
  await expect(simulator.locator("output").first()).toHaveText("8 €");
  await simulator
    .getByRole("button", { name: "Shop & Go", exact: true })
    .click();
  await expect(simulator.locator("output").first()).toHaveText("28 €");
  await simulator
    .getByLabel("Destination", { exact: true })
    .selectOption("Montréal");
  await expect(simulator.locator("output").first()).toHaveText("32 €");
  await page.getByLabel("Votre devis concurrent").fill("100");
  await expect(page.locator(".savings-number strong")).toHaveText("68%");
  await page
    .locator(".landing-faq summary")
    .filter({ hasText: "Puis-je être voyageur et expéditeur ?" })
    .click();
  await expect(page.locator(".landing-faq details[open]")).toContainText(
    "simultanément",
  );
  const schema = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ||
      "{}",
  );
  expect(schema["@type"]).toBe("FAQPage");
  expect(schema.mainEntity).toHaveLength(6);
  await page.getByLabel("Langue / Language").selectOption("en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Bring it closer",
  );
  await page.getByRole("link", { name: "Open the app" }).first().click();
  await expect(page).toHaveURL(/#explore/);
});

test("admin KPI, moderation and official messages persist and reach another tab immediately", async ({
  page,
  context,
}) => {
  await page.goto("/#admin");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Chaque trajet compte.",
  );
  await expect(page.locator(".admin-kpis article")).toHaveCount(6);
  await expect(page.locator(".admin-kpis")).toContainText(
    "Commissions plateforme (15 %)",
  );
  const chatPage = await context.newPage();
  await chatPage.goto("/#messages");
  await chatPage.getByRole("button", { name: /Sarah.*Nike/ }).click();
  await chatPage
    .getByRole("textbox", { name: "Message à Sarah" })
    .fill("Contactez-moi au +33 6 12 34 56 78 ou achat@example.fr");
  await chatPage
    .getByRole("button", { name: "Envoyer le message", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Conversations", exact: true })
    .click();
  await page
    .locator(".admin-chat-list")
    .getByRole("button", { name: /Sarah/ })
    .click();
  const log = page.getByRole("log", { name: "Lecture administrateur" });
  await expect(log).toContainText("Téléphone");
  await expect(log).toContainText("E-mail");
  await page
    .getByLabel("Message officiel", { exact: true })
    .fill("Support : la livraison est confirmée pour demain.");
  await page
    .getByRole("button", { name: "Envoyer le message officiel" })
    .click();
  await expect(page.getByRole("status")).toHaveText("Message officiel envoyé.");
  await expect(chatPage.getByRole("log")).toContainText(
    "Support : la livraison est confirmée pour demain.",
  );
  await expect(chatPage.getByRole("log").locator(".official-badge")).toHaveText(
    "Support Officiel BagVoyage",
  );
  await chatPage.reload();
  await chatPage.getByRole("button", { name: /Sarah.*Nike/ }).click();
  await expect(chatPage.getByRole("log")).toContainText(
    "Support : la livraison est confirmée pour demain.",
  );
});

test("admin can address an individual user without an existing conversation", async ({
  page,
}) => {
  await signInLocal(page);
  await page.goto("/#admin");
  await page
    .getByRole("button", { name: "Conversations", exact: true })
    .click();
  await page.getByLabel("Type de destinataire").selectOption("user");
  await page
    .getByLabel("Destinataire utilisateur")
    .selectOption("pro-applicant");
  await page
    .getByLabel("Message officiel", { exact: true })
    .fill("Bienvenue dans votre espace professionnel.");
  await page
    .getByRole("button", { name: "Envoyer le message officiel" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Message officiel envoyé",
  );
  await page.goto("/#messages");
  await page.getByRole("button", { name: /Assistance BagVoyage/ }).click();
  await expect(page.getByRole("log")).toContainText(
    "Bienvenue dans votre espace professionnel.",
  );
  await expect(
    page.getByRole("button", { name: "Enregistrer l’accord", exact: true }),
  ).toHaveCount(0);
});

test("professional application uploads, fleet, review and badge survive reload", async ({
  page,
  context,
}) => {
  await signInLocal(page);
  await page.getByRole("button", { name: "Devenir transporteur pro" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Raison sociale").fill("Atlas Transport");
  await dialog.getByLabel("Numéro SIRET").fill("12345678901234");
  for (const name of [
    "Kbis ou extrait CNRC",
    "Licence de transport DREAL / Ministère des Transports",
    "Attestation RC Pro marchandises",
    "Pièce d’identité du gérant",
  ])
    await dialog.getByLabel(name, { exact: true }).setInputFiles(pdf);
  await dialog.getByRole("button", { name: "Ajouter un véhicule" }).click();
  await dialog
    .getByLabel("Véhicule 2", { exact: true })
    .selectOption("Poids lourd");
  await dialog.getByLabel("Charge utile 2").fill("18000");
  await dialog.getByLabel("Volume 2").fill("70");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Soumettre mon dossier" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".pro-entry")).toContainText("en cours d’examen");
  const admin = await context.newPage();
  await admin.goto("/#admin");
  await admin.getByRole("button", { name: /Dossiers KYC & Pro/ }).click();
  const application = admin
    .locator(".admin-application")
    .filter({ hasText: "Atlas Transport" });
  await expect(application).toContainText("18000 kg / 70 m³");
  await application
    .getByRole("button", { name: "justificatif.pdf", exact: true })
    .first()
    .click();
  await expect(
    admin
      .getByRole("dialog")
      .getByRole("link", { name: "Télécharger la pièce" }),
  ).toBeVisible();
  await admin.keyboard.press("Escape");
  await application.getByRole("button", { name: "Rejeter avec motif" }).click();
  await expect(admin.getByRole("alert")).toContainText(
    "motif de rejet est obligatoire",
  );
  await application
    .getByRole("button", { name: "Approuver et certifier" })
    .click();
  await expect(application).toContainText("Transporteur Professionnel Vérifié");
  await expect(page.locator(".pro-entry")).toContainText(
    "Transporteur Professionnel Vérifié",
  );
  await page.reload();
  await expect(page.locator(".pro-entry")).toContainText("Atlas Transport");
});

test("parcel photos, flexible dates, dimensions and customs warning persist", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Publier une demande", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "Envoi de colis", exact: true })
    .click();
  await dialog.getByLabel("Nom du colis").fill("Livres pour Alger");
  await dialog
    .getByLabel("Contenu du colis")
    .fill("Trois livres neufs, emballés");
  await dialog
    .getByLabel("Photos du colis", { exact: true })
    .setInputFiles([photo, { ...photo, name: "emballage.png" }]);
  await expect(dialog.locator(".photo-grid figure")).toHaveCount(2);
  await dialog.getByRole("button", { name: "Supprimer emballage.png" }).click();
  await expect(dialog.locator(".photo-grid figure")).toHaveCount(1);
  await dialog
    .getByRole("button", { name: "Date limite précise", exact: true })
    .click();
  await expect(dialog.getByLabel("Date limite de livraison")).toBeVisible();
  await dialog
    .getByRole("button", { name: "Cette semaine", exact: true })
    .click();
  await expect(dialog.getByLabel("Date limite de livraison")).toHaveCount(0);
  await dialog.getByLabel("Poids du colis").fill("3");
  for (const [label, value] of [
    ["Longueur", "30"],
    ["Largeur", "20"],
    ["Hauteur", "15"],
  ])
    await dialog.getByLabel(label).fill(value);
  await dialog.getByLabel("Ville de départ").fill("Paris");
  await dialog.getByLabel("Ville de destination").fill("Alger");
  await dialog.getByLabel("Lieu de prise en charge").fill("Terminal 2, CDG");
  await dialog.getByLabel("Lieu de livraison souhaité").fill("Aéroport Alger");
  await dialog.getByLabel("Nom du destinataire").fill("Amine");
  await dialog.getByLabel("E-mail du destinataire").fill("amine@example.com");
  await dialog.getByLabel("Valeur marchande déclarée").fill("160000");
  await expect(dialog.locator(".customs-calculator output")).toContainText(
    "Dépassement",
  );
  await expect(dialog.locator(".customs-calculator")).toContainText(
    "franchise non présumée applicable",
  );
  await dialog.getByLabel("Budget proposé au voyageur").fill("25");
  await dialog.getByRole("checkbox", { name: /Je déclare le contenu/ }).check();
  await dialog.getByRole("button", { name: "Publier mon colis" }).click();
  await expect(page.locator(".request-card").first()).toContainText(
    "Livres pour Alger",
  );
  await page.reload();
  await page
    .locator(".request-card")
    .first()
    .getByRole("button", { name: "Voir la demande" })
    .click();
  await expect(page.locator(".request-extra")).toContainText("Cette semaine");
  await expect(page.locator(".request-extra")).toContainText("30 × 20 × 15 cm");
  await expect(page.locator(".request-photos img")).toHaveCount(1);
});

test("Shop & Go multi-item basket calculates purchases, net reward and platform fee", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Publier une demande", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Article recherché", { exact: true })
    .fill("Chaussures");
  await dialog.getByLabel("Précisions", { exact: true }).fill("Pointure 42");
  await dialog
    .getByLabel("Lien URL de l’article", { exact: true })
    .fill("https://example.com/chaussures");
  await dialog
    .getByLabel("Photo de l’article 1", { exact: true })
    .setInputFiles(photo);
  await dialog.getByRole("button", { name: "Ajouter un article" }).click();
  await dialog.getByLabel("Nom de l’article 2", { exact: true }).fill("Veste");
  await dialog
    .getByLabel("Taille et spécifications de l’article 2")
    .fill("Taille M");
  await dialog.getByLabel("Prix magasin de l’article 2").fill("50");
  await dialog.getByLabel("Départ", { exact: true }).fill("Paris");
  await dialog.getByLabel("Destination", { exact: true }).fill("Alger");
  await dialog.getByLabel("Livraison souhaitée avant le").fill("2027-12-20");
  await dialog.getByLabel("Lieu de livraison").fill("Alger centre");
  await dialog.getByLabel("Budget article").fill("100");
  await dialog.getByLabel("Service (€)", { exact: true }).fill("17");
  await expect(dialog.locator(".shopping-total output")).toContainText("170 €");
  await expect(dialog.locator(".shopping-total")).toContainText("150 €");
  await dialog.getByRole("button", { name: "Ajouter un article" }).click();
  await dialog.getByRole("button", { name: "Retirer l’article 3" }).click();
  await dialog.getByRole("button", { name: "Publier ma demande" }).click();
  await expect(page.locator(".request-card").first()).toContainText(
    "Chaussures + 1 article",
  );
  await page.reload();
  await page
    .locator(".request-card")
    .first()
    .getByRole("button", { name: "Voir la demande" })
    .click();
  await expect(page.locator(".request-extra")).toContainText("Veste / 50");
  await expect(page.locator(".request-extra img")).toHaveCount(1);
});

test("all four roles remain selected independently and reject unsupported upload types", async ({
  page,
}) => {
  await page.goto("/#profile");
  const roles = page.getByRole("region", { name: "Mes quatre rôles" });
  for (const name of ["Transporteur", "Envoyeur", "Acheteur", "Receveur"]) {
    await roles.getByRole("button", { name, exact: true }).click();
    await roles.getByRole("checkbox").check();
  }
  await page.reload();
  for (const name of ["Transporteur", "Envoyeur", "Acheteur", "Receveur"]) {
    await roles.getByRole("button", { name, exact: true }).click();
    await expect(roles.getByRole("checkbox")).toBeChecked();
  }
  await roles.getByRole("button", { name: "Envoyeur", exact: true }).click();
  await roles.getByRole("button", { name: "Envoyer un colis" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Photos du colis", { exact: true }).setInputFiles({
    name: "unsafe.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from("<svg/>"),
  });
  await expect(dialog.getByRole("alert")).toContainText("Format accepté");
  await expect(dialog.locator(".photo-grid figure")).toHaveCount(0);
});

test("admin refund is atomic, final and does not credit the traveller", async ({
  page,
}) => {
  await page.goto("/#messages");
  await page.getByRole("button", { name: /Sarah.*Nike/ }).click();
  await page
    .getByRole("button", { name: "Enregistrer l’accord", exact: true })
    .click();
  await page.goto("/#admin");
  await page.getByRole("button", { name: "Litiges & Séquestre" }).click();
  await page
    .locator(".admin-application")
    .filter({ hasText: "Nike" })
    .getByRole("button", { name: "Rembourser l’expéditeur" })
    .click();
  await page
    .getByLabel("Motif de la décision")
    .fill("Annulation convenue, colis non remis.");
  await page
    .getByRole("button", { name: "Confirmer la décision locale" })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.locator(".admin-application").filter({ hasText: "Nike" }),
  ).toContainText("Expéditeur remboursé");
  const result = await page.evaluate(async () => {
    const dbPath = "/src/services/productionDb.ts";
    const adminPath = "/src/services/adminOperations.ts";
    const db = await import(/* @vite-ignore */ dbPath);
    const admin = await import(/* @vite-ignore */ adminPath);
    let rejected = false;
    try {
      await admin.resolveEscrow("nike-air-max", "release", "Second traitement");
    } catch {
      rejected = true;
    }
    const row = await db.getRecord(
      "wallet_transactions",
      "deposit-nike-air-max",
    );
    return { rejected, status: row.status };
  });
  expect(result).toEqual({ rejected: true, status: "Remboursé" });
  await page.goto("/#messages");
  await page.reload();
  await page.getByRole("button", { name: /Sarah.*Nike/ }).click();
  await expect(page.locator(".escrow-strip")).toContainText(
    "Expéditeur remboursé",
  );
  await expect(
    page.getByRole("button", { name: "Valider la remise", exact: true }),
  ).toHaveCount(0);
});

test("new destinations fit the viewport and keep navigation accessible", async ({
  page,
}) => {
  for (const route of ["landing", "admin", "profile"]) {
    await page.goto(`/#${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("button", { name: "Découvrir BagVoyage" }).click();
  await expect(page).toHaveURL(/#landing/);
  await page.getByRole("button", { name: "Super Admin", exact: true }).click();
  await expect(page).toHaveURL(/#admin/);
});

test("version one upgrades without reseeding changed records", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".request-card")).toHaveCount(2);
  await page.evaluate(async () => {
    const dbPath = "/src/services/productionDb.ts";
    const module = await import(/* @vite-ignore */ dbPath);
    const db = await module.initDB();
    db.close();
    await new Promise<void>((resolve, reject) => {
      const req = indexedDB.deleteDatabase("BagVoyageDB_v1");
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    await new Promise<void>((resolve, reject) => {
      const req = indexedDB.open("BagVoyageDB_v1", 1);
      req.onupgradeneeded = () => {
        for (const store of [
          "users",
          "trips",
          "purchase_requests",
          "orders",
          "conversations",
          "wallet_transactions",
          "kyc_records",
        ])
          req.result.createObjectStore(store, { keyPath: "id" });
        req.transaction!.objectStore("purchase_requests").put({
          id: "keep-me",
          title: "Données historiques préservées",
          buyer: "Amine",
          origin: "Paris",
          destination: "Alger",
          budget: 25,
          reward: 10,
          image: "/images/parcel.svg",
          specifications: "Livre",
          location: "Alger",
          date: "2027-12-20",
        });
      };
      req.onsuccess = () => {
        req.result.close();
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  });
  await page.reload();
  await expect(page.locator(".request-card")).toHaveCount(1);
  await expect(page.locator(".request-card")).toContainText(
    "Données historiques préservées",
  );
});
