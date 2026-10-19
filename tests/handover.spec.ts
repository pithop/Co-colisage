import { test, expect, Page } from "@playwright/test";

async function openHandover(page: Page) {
  await page.goto("/#messages");
  await page.getByRole("button", { name: /Sarah.*Nike/ }).click();
  await page
    .getByRole("button", { name: "Enregistrer l’accord", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Valider la remise", exact: true })
    .click();
  return page.getByRole("dialog");
}
const photo = {
  name: "article.png",
  mimeType: "image/png",
  buffer: Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAKklEQVR4nGPQCq2gKWIYtWDUglELRi0YtWDUglELRi0YtWDUglELhooFAPML3C64ZQwrAAAAAElFTkSuQmCC",
    "base64",
  ),
};

test("photos, timestamps, GPS and both handovers persist in the order timeline", async ({
  page,
}) => {
  await page.context().grantPermissions(["geolocation"]);
  await page
    .context()
    .setGeolocation({ latitude: 48.8449, longitude: 2.3735, accuracy: 15 });
  const dialog = await openHandover(page);
  for (const step of ["prise en charge", "livraison"]) {
    const chooser = page.waitForEvent("filechooser");
    await dialog
      .getByRole("button", { name: "Importer une photo", exact: true })
      .click();
    await (await chooser).setFiles(photo);
    await expect(
      dialog.getByRole("img", {
        name: `Photo de conformité à la ${step}`,
        exact: true,
      }),
    ).toBeVisible();
    await dialog.getByLabel("Lieu de remise").fill("Paris, Gare de Lyon");
    await dialog.getByRole("button", { name: "Localiser la remise" }).click();
    await expect(dialog.getByText(/Position enregistrée/)).toBeVisible();
    await dialog
      .getByRole("button", {
        name: "Confirmer avec le code affiché",
      })
      .click();
  }
  await expect(dialog.getByText("Article remis, merci !")).toBeVisible();
  await dialog.getByRole("button", { name: "Tout noter 5 étoiles" }).click();
  await dialog.getByRole("button", { name: "Envoyer mon avis" }).click();
  await expect(
    dialog.getByText("Votre avis a été enregistré. Merci !"),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Fermer", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: /Sarah.*Nike/ }).click();
  await page
    .getByRole("button", { name: "Voir le suivi de la commande" })
    .click();
  await expect(dialog.getByRole("img", { name: /Preuve photo/ })).toHaveCount(
    2,
  );
  await expect(
    dialog.getByText(/Remise validée à Paris, Gare de Lyon/),
  ).toHaveCount(2);
  await expect(dialog.getByText(/GPS : 48.84490, 2.37350/)).toHaveCount(2);
  await expect(dialog.getByRole("listitem").last()).toContainText("Confirmé");
});

test("flight delay sends one message and remains visible in tracking after reload", async ({
  page,
}) => {
  await page.goto("/#messages");
  await page.getByRole("button", { name: /Karim Bouzid/ }).click();
  await page.getByRole("button", { name: "Signaler un retard de vol" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("radio", { name: "+3h", exact: true }).check();
  await dialog
    .getByLabel("Précisions")
    .fill("Rendez-vous à 14 h au terminal 1.");
  await dialog.getByRole("button", { name: "Notifier le retard" }).click();
  await expect(page.getByRole("log")).toContainText(
    "Retard de vol signalé : +3h",
  );
  await page.reload();
  await page.getByRole("button", { name: /Karim Bouzid/ }).click();
  await page
    .getByRole("button", { name: "Voir le suivi de la commande" })
    .click();
  await expect(dialog).toContainText("Rendez-vous à 14 h au terminal 1.");
  await expect(dialog.getByRole("listitem").first()).toContainText("En cours");
});

test("live pixel scan rejects another stage, recognizes the QR, requires photo and stops camera", async ({
  page,
}) => {
  const dialog = await openHandover(page);
  await expect(dialog.locator(".qr-image")).toBeVisible();
  const src = await dialog.locator(".qr-image").getAttribute("src");
  await page.evaluate(async (url) => {
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 720;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "white";
    context.fillRect(0, 0, 720, 720);
    const picture = new Image();
    picture.src = url!;
    await picture.decode();
    const state = window as unknown as {
      scanStream: MediaStream;
      drawQR: () => void;
      vibrated: boolean;
    };
    let showQr = false;
    state.drawQR = () => {
      showQr = true;
    };
    navigator.mediaDevices.getUserMedia = async () => {
      const stream = canvas.captureStream(10);
      state.scanStream = stream;
      const frames = setInterval(() => {
        if (stream.getTracks().every((track) => track.readyState === "ended")) {
          clearInterval(frames);
          return;
        }
        context.fillRect(0, 0, 720, 720);
        if (showQr) context.drawImage(picture, 100, 100, 520, 520);
      }, 100);
      return stream;
    };
    navigator.vibrate = () => {
      state.vibrated = true;
      return true;
    };
  }, src);
  await dialog.getByRole("tab", { name: "Scanner la remise" }).click();
  await expect(dialog.getByText(/Caméra active/)).toBeVisible();
  await page.evaluate(() =>
    (window as unknown as { drawQR: () => void }).drawQR(),
  );
  await expect(
    dialog.getByText("QR code reconnu", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      (window as unknown as { scanStream: MediaStream }).scanStream
        .getTracks()
        .every((track) => track.readyState === "ended"),
    ),
  ).toBeTruthy();
  expect(
    await page.evaluate(
      () => (window as unknown as { vibrated: boolean }).vibrated,
    ),
  ).toBeTruthy();
  await dialog
    .getByRole("button", { name: "Valider la prise en charge", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toContainText("Ajoutez une photo");
  const chooser = page.waitForEvent("filechooser");
  await dialog
    .getByRole("button", { name: "Importer une photo", exact: true })
    .click();
  await (await chooser).setFiles(photo);
  await expect(
    dialog.getByRole("img", {
      name: "Photo de conformité à la prise en charge",
      exact: true,
    }),
  ).toBeVisible();
  await dialog
    .getByRole("button", { name: "Valider la prise en charge", exact: true })
    .click();
  await expect(
    dialog.getByText("Confirmer la livraison", { exact: true }),
  ).toBeVisible();
  await dialog.locator("input[type=file]").setInputFiles({
    name: "previous-step.png",
    mimeType: "image/png",
    buffer: Buffer.from(src!.split(",")[1], "base64"),
  });
  await expect(dialog.getByRole("alert")).toContainText("Code incorrect");
});

test("camera denied and invalid photos still allow the explicit demo path", async ({
  page,
}) => {
  const dialog = await openHandover(page);
  await page.evaluate(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      throw new DOMException("Denied", "NotAllowedError");
    };
  });
  await dialog.getByRole("tab", { name: "Scanner la remise" }).click();
  await expect(dialog.getByText(/Accès caméra refusé/)).toBeVisible();
  await dialog.locator("input[type=file]").setInputFiles({
    name: "invalid.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("invalid"),
  });
  await expect(dialog.getByRole("alert")).toContainText("Choisissez une image");
  await dialog
    .getByRole("button", {
      name: "Confirmer avec le code affiché",
    })
    .click();
  await expect(
    dialog.getByText("Confirmer la livraison", { exact: true }),
  ).toBeVisible();
  await dialog
    .getByRole("button", {
      name: "Confirmer avec le code affiché",
    })
    .click();
  await expect(dialog.getByText("Article remis, merci !")).toBeVisible();
});
