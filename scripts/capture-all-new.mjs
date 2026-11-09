import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const outputDir = path.join(projectRoot, "docs", "screenshots");

fs.mkdirSync(outputDir, { recursive: true });

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split("?")[0];
  let filePath = path.join(distDir, urlPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Server Error: ${err.code}`);
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

const PORT = 4192;

server.listen(PORT, async () => {
  console.log(`Capture server running at http://localhost:${PORT}`);
  const browser = await chromium.launch();

  try {
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });

    const mobileContext = await browser.newContext({
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
    });

    // 1. Voyageur Desktop
    const pageVoyDesk = await desktopContext.newPage();
    await pageVoyDesk.goto(`http://localhost:${PORT}/#voyageur`, { waitUntil: "networkidle" });
    await pageVoyDesk.waitForSelector("h1", { timeout: 15000 });
    await pageVoyDesk.waitForTimeout(1200);
    await pageVoyDesk.screenshot({
      path: path.join(outputDir, "26_voyageur_desktop.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    // Also update 09_marketplace_desktop.jpg
    await pageVoyDesk.screenshot({
      path: path.join(outputDir, "09_marketplace_desktop.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    console.log("Captured 26_voyageur_desktop.jpg and 09_marketplace_desktop.jpg");

    // 2. Voyageur Mobile
    const pageVoyMob = await mobileContext.newPage();
    await pageVoyMob.goto(`http://localhost:${PORT}/#voyageur`, { waitUntil: "networkidle" });
    await pageVoyMob.waitForSelector("h1", { timeout: 15000 });
    await pageVoyMob.waitForTimeout(1200);
    await pageVoyMob.screenshot({
      path: path.join(outputDir, "27_voyageur_mobile.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    // Also update 10_marketplace_mobile.jpg
    await pageVoyMob.screenshot({
      path: path.join(outputDir, "10_marketplace_mobile.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    console.log("Captured 27_voyageur_mobile.jpg and 10_marketplace_mobile.jpg");

    // 3. Shop & Go Desktop
    const pageShopDesk = await desktopContext.newPage();
    await pageShopDesk.goto(`http://localhost:${PORT}/#shopandgo`, { waitUntil: "networkidle" });
    await pageShopDesk.waitForSelector("h1", { timeout: 15000 });
    await pageShopDesk.waitForTimeout(1200);
    await pageShopDesk.screenshot({
      path: path.join(outputDir, "21_shopandgo_desktop.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    console.log("Captured 21_shopandgo_desktop.jpg");

    // 4. Shop & Go Mobile
    const pageShopMob = await mobileContext.newPage();
    await pageShopMob.goto(`http://localhost:${PORT}/#shopandgo`, { waitUntil: "networkidle" });
    await pageShopMob.waitForSelector("h1", { timeout: 15000 });
    await pageShopMob.waitForTimeout(1200);
    await pageShopMob.screenshot({
      path: path.join(outputDir, "22_shopandgo_mobile.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    console.log("Captured 22_shopandgo_mobile.jpg");

    // 5. Bag & Go Desktop
    const pageBagDesk = await desktopContext.newPage();
    await pageBagDesk.goto(`http://localhost:${PORT}/#bagandgo`, { waitUntil: "networkidle" });
    await pageBagDesk.waitForSelector("h1", { timeout: 15000 });
    await pageBagDesk.waitForTimeout(1200);
    await pageBagDesk.screenshot({
      path: path.join(outputDir, "23_bagandgo_desktop.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    console.log("Captured 23_bagandgo_desktop.jpg");

    // 6. Bag & Go Mobile
    const pageBagMob = await mobileContext.newPage();
    await pageBagMob.goto(`http://localhost:${PORT}/#bagandgo`, { waitUntil: "networkidle" });
    await pageBagMob.waitForSelector("h1", { timeout: 15000 });
    await pageBagMob.waitForTimeout(1200);
    await pageBagMob.screenshot({
      path: path.join(outputDir, "24_bagandgo_mobile.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    console.log("Captured 24_bagandgo_mobile.jpg");

    // 7. KYC Verification Modal Desktop
    const pageKyc = await desktopContext.newPage();
    await pageKyc.goto(`http://localhost:${PORT}/#voyageur`, { waitUntil: "networkidle" });
    await pageKyc.waitForTimeout(1000);
    // Find KYC trigger or click KYC button in header
    const kycBtn = pageKyc.locator("button[aria-label='Vérification KYC'], button:has-text('Vérification'), button:has-text('Identité'), button:has-text('KYC')").first();
    if (await kycBtn.isVisible().catch(() => false)) {
      await kycBtn.click();
    } else {
      await pageKyc.evaluate(() => {
        const btn = document.querySelector("button[aria-label='Vérification KYC']");
        if (btn) btn.click();
      });
    }
    await pageKyc.waitForTimeout(900);
    await pageKyc.screenshot({
      path: path.join(outputDir, "25_kyc_verification_modal.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    console.log("Captured 25_kyc_verification_modal.jpg");

    // 8. Ticket Scanner Modal
    const pageScan = await desktopContext.newPage();
    await pageScan.goto(`http://localhost:${PORT}/#voyageur`, { waitUntil: "networkidle" });
    await pageScan.waitForTimeout(1000);
    const scanBtn = pageScan.locator("button:has-text('Scanner billet IATA')").first();
    if (await scanBtn.isVisible().catch(() => false)) {
      await scanBtn.click();
      await pageScan.waitForTimeout(900);
      await pageScan.screenshot({
        path: path.join(outputDir, "17_ticket_scanner_modal.jpg"),
        type: "jpeg",
        quality: 90,
        fullPage: false,
      });
      console.log("Captured 17_ticket_scanner_modal.jpg");
    }

    // 9. How It Works Modal
    const pageHow = await desktopContext.newPage();
    await pageHow.goto(`http://localhost:${PORT}/#voyageur`, { waitUntil: "networkidle" });
    await pageHow.waitForTimeout(1000);
    await pageHow.evaluate(() => window.dispatchEvent(new CustomEvent("bv:open-how-it-works")));
    await pageHow.waitForTimeout(900);
    await pageHow.screenshot({
      path: path.join(outputDir, "28_how_it_works_modal.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    console.log("Captured 28_how_it_works_modal.jpg");

    console.log("All new platform screenshots successfully generated!");
  } finally {
    await browser.close();
    server.close();
  }
});
