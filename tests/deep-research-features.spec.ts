import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

async function openOrderTool(page: Page, name: string) {
  await page.goto("/#messages");
  await page.getByRole("button", { name: /Karim Bouzid/ }).click();
  await page
    .getByRole("button", { name: "Voir le suivi de la commande" })
    .click();
  await page
    .getByRole("dialog", { name: "Suivi de la commande", exact: true })
    .getByRole("button", { name, exact: true })
    .click();
  return page.getByRole("dialog", { name, exact: true });
}

test("STEB requires inspection and both signatures, simulates VOID and preserves the downloadable receipt", async ({
  page,
}) => {
  const modal = await openOrderTool(page, "Scellé OACI STEB");
  await expect(
    modal.getByRole("img", { name: "QR code de référence du document" }),
  ).toBeVisible();
  const confirm = modal.getByRole("button", { name: "Confirmer le scellage" });
  await expect(confirm).toBeDisabled();
  await modal
    .getByRole("button", { name: "Simuler une effraction VOID" })
    .click();
  await expect(modal.getByRole("status")).toContainText("Effraction simulée");
  await expect(modal.locator(".bv-seal-tape")).toContainText(
    "VOID / VOID / VOID",
  );
  await modal
    .getByLabel("Nom de l’expéditeur", { exact: true })
    .fill("Lina Martin");
  await modal
    .getByLabel("Nom du voyageur", { exact: true })
    .fill("Karim Bouzid");
  for (const checkbox of await modal.getByRole("checkbox").all())
    await checkbox.check();
  await expect(confirm).toBeDisabled();
  await modal.getByRole("button", { name: "Revenir à la vue intacte" }).click();
  await confirm.click();
  await expect(
    modal.getByRole("heading", { name: "Scellage confirmé" }),
  ).toBeVisible();
  const id = await modal.getByTestId("seal-id").innerText();
  expect(id).toMatch(/^STEB-\d{4}-VOID-[A-F0-9-]+$/);
  const downloadEvent = page.waitForEvent("download");
  await modal
    .getByRole("button", { name: "Télécharger le récépissé d’intégrité" })
    .click();
  const download = await downloadEvent;
  const text = await readFile((await download.path())!, "utf8");
  expect(text).toContain(id);
  expect(text).toContain("Lina Martin");
  expect(text).toContain("Karim Bouzid");
  expect(text).toContain("100 Wh");
  expect(text).toMatch(/SHA-256 du contenu : [a-f0-9]{64}/);
  await page.keyboard.press("Escape");
  const parent = page.getByRole("dialog", {
    name: "Suivi de la commande",
    exact: true,
  });
  await expect(parent).toBeVisible();
  await expect(
    parent.getByRole("button", { name: "Scellé OACI STEB", exact: true }),
  ).toBeFocused();
  await page.reload();
  const reopened = await openOrderTool(page, "Scellé OACI STEB");
  await expect(reopened.getByTestId("seal-id")).toHaveText(id);
  await expect(
    reopened.getByRole("heading", { name: "Scellage confirmé" }),
  ).toBeVisible();
});

test("volumetric calculator selects the greater weight, validates both baggage limits and handles invalid input", async ({
  page,
}) => {
  const modal = await openOrderTool(page, "Calculateur volumétrique");
  await modal.getByLabel("Longueur (cm)", { exact: true }).fill("60");
  await modal.getByLabel("Largeur (cm)", { exact: true }).fill("40");
  await modal.getByLabel("Hauteur (cm)", { exact: true }).fill("40");
  await modal.getByLabel("Poids réel (kg)", { exact: true }).fill("5");
  await expect(modal.getByTestId("volumetric-weight")).toHaveText("19,2 kg");
  await expect(modal.getByTestId("billable-weight")).toHaveText("19,2 kg");
  await expect(modal.locator(".bv-compliance").first()).toContainText(
    "Dépassement",
  );
  await modal.getByLabel("Poids réel (kg)", { exact: true }).fill("30");
  await expect(modal.getByTestId("billable-weight")).toHaveText("30 kg");
  await expect(modal.locator(".bv-compliance").last()).toContainText(
    "Dépassement",
  );
  await modal.getByLabel("Limite de poids en soute").selectOption("32");
  await expect(modal.locator(".bv-compliance").last()).toContainText(
    "Compatible",
  );
  await modal.getByRole("button", { name: "Exemple cabine" }).click();
  await expect(modal.locator(".bv-compliance").first()).toContainText(
    "Compatible",
  );
  await expect(modal.getByRole("table").locator("tbody tr")).toHaveCount(6);
  for (const company of [
    "Air France",
    "Transavia",
    "Air Algérie",
    "Royal Air Maroc",
    "Air Canada",
    "Emirates",
  ]) {
    await expect(
      modal
        .getByRole("table")
        .getByRole("link", { name: company, exact: true }),
    ).toHaveCount(1);
  }
  await modal.getByLabel("Barème volumétrique").selectOption("6000");
  await expect(modal.getByTestId("volumetric-weight")).toHaveText("8,02 kg");
  await modal.getByLabel("Longueur (cm)", { exact: true }).fill("");
  await expect(modal.getByRole("alert")).toContainText(
    "Saisissez des dimensions",
  );
  await expect(modal.getByTestId("billable-weight")).toHaveText("— kg");
  await expect(modal).not.toContainText("NaN");
});

test("airport directory selects a terminal and the six-digit demonstration OTP expires and is consumed once", async ({
  page,
}) => {
  await page.clock.install();
  const modal = await openOrderTool(page, "Consignes aéroport");
  await expect(modal).toContainText("Annuaire de démonstration");
  await expect(
    modal.getByLabel("Aéroport ou port").locator("option"),
  ).toHaveCount(8);
  await modal.getByLabel("Aéroport ou port").selectOption("CDG");
  await modal.getByLabel("Terminal ou point relais").selectOption("cdg-tgv");
  await expect(modal.getByRole("heading", { name: "Gare TGV" })).toBeVisible();
  await expect(modal.locator(".bv-locker-card")).toContainText("24/7");
  await modal.getByLabel("Aéroport ou port").selectOption("MRS");
  await modal.getByLabel("Terminal ou point relais").selectOption("mrs-fos");
  await expect(
    modal.getByRole("heading", { name: "Gare Maritime Fos" }),
  ).toBeVisible();
  await modal.getByRole("button", { name: "Simuler une consignation" }).click();
  const code = (
    await modal.getByLabel("Code OTP temporaire", { exact: true }).innerText()
  ).trim();
  expect(code).toMatch(/^\d{6}$/);
  await modal
    .getByLabel("Code de retrait à vérifier")
    .fill(code === "000000" ? "111111" : "000000");
  await modal
    .getByRole("button", { name: "Vérifier le code et simuler le retrait" })
    .click();
  await expect(modal.getByRole("alert")).toContainText("Code incorrect");
  await modal.getByLabel("Code de retrait à vérifier").fill(code);
  await modal
    .getByRole("button", { name: "Vérifier le code et simuler le retrait" })
    .click();
  await expect(
    modal.getByRole("status", { name: "État du code de retrait" }),
  ).toContainText("Ce code a été consommé");
  await expect(modal.getByLabel("Code de retrait à vérifier")).toHaveCount(0);
  await modal.getByRole("button", { name: "Générer un nouveau code" }).click();
  await page.clock.fastForward(601000);
  await expect(
    modal.getByRole("status", { name: "État du code de retrait" }),
  ).toContainText("Code expiré");
  await expect(modal.getByLabel("Code de retrait à vérifier")).toHaveCount(0);
  await modal.getByLabel("Aéroport ou port").selectOption("YUL");
  await expect(
    modal.getByLabel("Code OTP temporaire", { exact: true }),
  ).toHaveCount(0);
  await expect(
    modal.getByRole("heading", { name: "Zone Départs Internationaux" }),
  ).toBeVisible();
});

test("HS search computes allowance remaining and excess without silently granting a personal exemption", async ({
  page,
}) => {
  const modal = await openOrderTool(page, "Douane SH");
  await modal
    .getByRole("searchbox", { name: "Rechercher un article ou un code SH" })
    .fill("851713");
  await modal.getByRole("button", { name: /Smartphones SH 8517.13/ }).click();
  await expect(modal).toContainText("Classification proposée : SH 8517.13");
  await modal.getByLabel("Pays de destination").selectOption("DZ");
  await modal
    .getByLabel("Valeur déclarée (DZD)", { exact: true })
    .fill("100000");
  await expect(modal.getByTestId("customs-remaining")).toHaveText("0 DZD");
  const personal = modal.getByRole("checkbox", {
    name: /Je confirme remplir les conditions/,
  });
  await personal.check();
  await expect(modal.getByTestId("customs-remaining")).toHaveText(
    /50\s000 DZD/,
  );
  await expect(modal.getByTestId("customs-tax")).toHaveText("0 DZD");
  await modal
    .getByLabel("Valeur déclarée (DZD)", { exact: true })
    .fill("200000");
  await expect(modal.getByTestId("customs-remaining")).toHaveText("0 DZD");
  await expect(modal.getByTestId("customs-tax")).toHaveText(/60\s000 DZD/);
  await expect(modal.locator(".bv-customs-result")).toContainText(
    /Dépassement de franchise : 50\s000 DZD/,
  );
  await modal.getByLabel("Assiette du scénario à 30 %").selectOption("excess");
  await expect(modal.getByTestId("customs-tax")).toHaveText(/15\s000 DZD/);
  await modal.getByLabel("Pays de destination").selectOption("EU");
  await expect(
    modal.getByLabel("Valeur déclarée (EUR)", { exact: true }),
  ).toBeEmpty();
  await modal.getByLabel("Valeur déclarée (EUR)", { exact: true }).fill("500");
  await personal.check();
  await modal.getByLabel("Taux estimatif global (%)").fill("20");
  await expect(modal.getByTestId("customs-tax")).toHaveText("100 EUR");
  await expect(modal).toContainText("430 EUR");
  await modal.getByRole("searchbox").fill("introuvable");
  await expect(
    modal.getByText("Aucun article trouvé.", { exact: false }),
  ).toBeVisible();
  await modal.getByLabel("Valeur déclarée (EUR)", { exact: true }).fill("-1");
  await expect(modal.getByTestId("customs-tax")).toHaveText("À déterminer");
});

test("PIR kit generates and downloads a Montreal Convention claim with a conditional insurance request", async ({
  page,
}) => {
  const modal = await openOrderTool(page, "Dossier litige PIR");
  await modal.getByLabel("Nature de l’incident").selectOption("damage");
  await modal
    .getByLabel("Compagnie aérienne", { exact: true })
    .fill("Air Algérie");
  await modal.getByLabel("Numéro de vol", { exact: true }).fill("AH1021");
  await modal.getByLabel("Date du vol").fill("2026-10-30");
  await modal.getByLabel("Numéro d’étiquette bagage").fill("1234567890");
  await modal.getByLabel("Référence PIR de l’aéroport").fill("ALGAH12345");
  await modal
    .getByLabel("Nom du passager", { exact: true })
    .fill("Karim Bouzid");
  await modal.getByLabel("Coordonnées du passager").fill("karim@example.test");
  await modal.getByLabel("Valeur des biens confiés").fill("1200");
  await modal.getByLabel("Montant du préjudice justifié").fill("450");
  await modal
    .getByLabel("Circonstances et inventaire")
    .fill(
      "Valise et ordinateur endommagés à l’arrivée. Photos et devis de réparation joints.",
    );
  await modal
    .getByRole("checkbox", {
      name: /Préparer une demande d’indemnisation accélérée/,
    })
    .check();
  await modal
    .getByLabel("Référence du contrat ad valorem")
    .fill("BV-AV-2026-123");
  await modal
    .getByRole("checkbox", { name: /Je confirme les faits déclarés/ })
    .check();
  await modal
    .getByRole("button", { name: "Générer le kit contentieux PIR" })
    .click();
  const letter = modal.getByRole("article", {
    name: "Lettre de mise en demeure",
  });
  await expect(letter).toContainText("articles 17 et 22");
  await expect(letter).toContainText("1 519 DTS");
  await expect(letter).toContainText("7 jours suivant la réception");
  await expect(letter).toContainText("ALGAH12345");
  await expect(letter).toContainText("450 EUR");
  await expect(letter).toContainText("Toute subrogation dépend du contrat");
  const downloadEvent = page.waitForEvent("download");
  await modal.getByRole("button", { name: "Télécharger le kit PIR" }).click();
  const download = await downloadEvent;
  const content = await readFile((await download.path())!, "utf8");
  expect(content).toContain("Mise en demeure");
  expect(content).toContain("AH1021");
  expect(content).toContain("1234567890");
  expect(content).toContain("Convention de Montréal");
  expect(content).toContain("Aucun envoi ni dépôt de réclamation");
  await modal.getByRole("button", { name: "Modifier le dossier" }).click();
  await expect(modal.getByLabel("Référence PIR de l’aéroport")).toHaveValue(
    "ALGAH12345",
  );
  await expect(
    modal.getByRole("button", { name: "Générer le kit contentieux PIR" }),
  ).toBeDisabled();
});

test("Whisper transcript expands and collapses independently of audio playback", async ({
  page,
}) => {
  await page.goto("/#messages");
  await page.getByRole("button", { name: /Karim Bouzid/ }).click();
  const player = page.locator(".voice-player").first();
  await expect(
    player.getByRole("button", { name: "Afficher la transcription" }),
  ).toHaveAttribute("aria-expanded", "false");
  await player
    .getByRole("button", { name: "Afficher la transcription" })
    .click();
  await expect(player.locator(".voice-transcript p")).not.toBeEmpty();
  await expect(player).toContainText("Retranscription automatique Whisper");
  await expect(player).not.toContainText("Transcription indisponible");
  await player.getByRole("button", { name: "Vitesse de lecture : 1x" }).click();
  await expect(
    player.getByRole("button", { name: "Vitesse de lecture : 1.5x" }),
  ).toBeVisible();
  await player
    .getByRole("button", { name: "Masquer la transcription" })
    .click();
  await expect(
    player.getByText("Retranscription automatique Whisper"),
  ).toHaveCount(0);
  await expect(
    player.getByRole("button", { name: "Afficher la transcription" }),
  ).toHaveAttribute("aria-expanded", "false");
  await page.reload();
  await page.getByRole("button", { name: /Karim Bouzid/ }).click();
  await player
    .getByRole("button", { name: "Afficher la transcription" })
    .click();
  await expect(player).toContainText("Retranscription automatique Whisper");
});

test("each shipment exposes all five tools with keyboard closure and no viewport overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#login");
  await page.getByRole("button", { name: "KB Karim Voyageur" }).click();
  await page.goto("/#messages");
  await page.getByRole("button", { name: /Karim Bouzid/ }).click();
  await page
    .getByRole("button", { name: "Enregistrer l’accord", exact: true })
    .click();
  await page.goto("/#tracking");
  const shipment = page.locator(".bv-shipment").first();
  await expect(
    shipment.getByRole("button", { name: "Bordereau LTA / Waybill" }),
  ).toBeVisible();
  await expect(
    shipment.getByRole("button", {
      name: "Déclaration en douane · Article 106",
    }),
  ).toBeVisible();
  for (const name of [
    "Scellé OACI STEB",
    "Calculateur volumétrique",
    "Douane SH",
    "Consignes aéroport",
    "Dossier litige PIR",
  ]) {
    const trigger = shipment.getByRole("button", { name, exact: true });
    await trigger.click();
    const modal = page.getByRole("dialog", { name, exact: true });
    await expect(modal).toBeVisible();
    expect(
      await modal.evaluate(
        (element) => element.scrollWidth <= element.clientWidth + 1,
      ),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(modal).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
  expect(errors).toEqual([]);
});

test("audio without a transcript shows pending and unavailable states without inventing text", async ({
  page,
}) => {
  await page.goto("/#messages");
  await page.getByRole("button", { name: /Karim Bouzid/ }).click();
  const setStatus = async (status: "pending" | "failed") =>
    page.evaluate(async (nextStatus) => {
      const path = "/src/services/productionDb.ts";
      const { getRecord, saveRecords } = (await import(
        path
      )) as typeof import("../src/services/productionDb");
      const conversation = await getRecord("conversations", "karim-mrs");
      if (!conversation) throw new Error("Conversation not found");
      await saveRecords("conversations", [
        {
          ...conversation,
          messages: conversation.messages.map((message) =>
            message.audio
              ? {
                  ...message,
                  audio: {
                    url: "/audio/unavailable.ogg",
                    duration: 7,
                    transcriptionStatus: nextStatus,
                  },
                }
              : message,
          ),
        },
      ]);
    }, status);
  await setStatus("pending");
  const player = page.locator(".voice-player").first();
  await player
    .getByRole("button", { name: "Afficher la transcription" })
    .click();
  await expect(player.getByRole("status")).toContainText(
    "Transcription en cours",
  );
  await setStatus("failed");
  await expect(player.getByRole("status")).toContainText(
    "Transcription indisponible",
  );
  await expect(player).not.toContainText("Retranscription automatique Whisper");
});
