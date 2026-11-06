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

    // 1. Shop & Go Desktop
    const pageShopDesk = await desktopContext.newPage();
    await pageShopDesk.goto(`http://localhost:${PORT}/#shopandgo`, { waitUntil: "networkidle" });
    await pageShopDesk.waitForTimeout(1000);
    await pageShopDesk.screenshot({
      path: path.join(outputDir, "21_shopandgo_desktop.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    // Also update 09_marketplace_desktop.jpg
    await pageShopDesk.screenshot({
      path: path.join(outputDir, "09_marketplace_desktop.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    console.log("Captured 21_shopandgo_desktop.jpg and 09_marketplace_desktop.jpg");

    // 2. Shop & Go Mobile
    const pageShopMob = await mobileContext.newPage();
    await pageShopMob.goto(`http://localhost:${PORT}/#shopandgo`, { waitUntil: "networkidle" });
    await pageShopMob.waitForTimeout(1000);
    await pageShopMob.screenshot({
      path: path.join(outputDir, "22_shopandgo_mobile.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    // Also update 10_marketplace_mobile.jpg
    await pageShopMob.screenshot({
      path: path.join(outputDir, "10_marketplace_mobile.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    console.log("Captured 22_shopandgo_mobile.jpg and 10_marketplace_mobile.jpg");

    // 3. Bag & Go Desktop
    const pageBagDesk = await desktopContext.newPage();
    await pageBagDesk.goto(`http://localhost:${PORT}/#bagandgo`, { waitUntil: "networkidle" });
    await pageBagDesk.waitForTimeout(1000);
    await pageBagDesk.screenshot({
      path: path.join(outputDir, "23_bagandgo_desktop.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    console.log("Captured 23_bagandgo_desktop.jpg");

    // 4. Bag & Go Mobile
    const pageBagMob = await mobileContext.newPage();
    await pageBagMob.goto(`http://localhost:${PORT}/#bagandgo`, { waitUntil: "networkidle" });
    await pageBagMob.waitForTimeout(1000);
    await pageBagMob.screenshot({
      path: path.join(outputDir, "24_bagandgo_mobile.jpg"),
      type: "jpeg",
      quality: 90,
      fullPage: false,
    });
    console.log("Captured 24_bagandgo_mobile.jpg");

    // 5. KYC Verification Modal Desktop
    const pageKyc = await desktopContext.newPage();
    await pageKyc.goto(`http://localhost:${PORT}/#shopandgo`, { waitUntil: "networkidle" });
    await pageKyc.waitForTimeout(800);
    const kycBtn = pageKyc.locator("button:has-text('Vérification'), button:has-text('Identité'), button:has-text('Activer')").first();
    if (await kycBtn.isVisible().catch(() => false)) {
      await kycBtn.click();
      await pageKyc.waitForTimeout(800);
      await pageKyc.screenshot({
        path: path.join(outputDir, "25_kyc_verification_modal.jpg"),
        type: "jpeg",
        quality: 90,
        fullPage: false,
      });
      console.log("Captured 25_kyc_verification_modal.jpg");
    }

    console.log("All new platform screenshots successfully generated!");
  } finally {
    await browser.close();
    server.close();
  }
});
