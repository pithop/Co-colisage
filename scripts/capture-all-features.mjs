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

const PORT = 4181;

server.listen(PORT, async () => {
  console.log(`Feature capture server running at http://localhost:${PORT}`);
  const browser = await chromium.launch();

  try {
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });

    const mobileContext = await browser.newContext({
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });

    // 13. Radar Page
    const pageRadar = await desktopContext.newPage();
    await pageRadar.goto(`http://localhost:${PORT}/#radar`, { waitUntil: "networkidle" });
    await pageRadar.waitForTimeout(1000);
    await pageRadar.screenshot({
      path: path.join(outputDir, "13_radar_page.png"),
      fullPage: false,
    });
    console.log("Captured 13_radar_page.png");

    // 14. Tracking Page
    const pageTrack = await desktopContext.newPage();
    await pageTrack.goto(`http://localhost:${PORT}/#tracking`, { waitUntil: "networkidle" });
    await pageTrack.waitForTimeout(1000);
    await pageTrack.screenshot({
      path: path.join(outputDir, "14_tracking_page.png"),
      fullPage: false,
    });
    console.log("Captured 14_tracking_page.png");

    // 15. Auth Login Page
    const pageLogin = await desktopContext.newPage();
    await pageLogin.goto(`http://localhost:${PORT}/#login`, { waitUntil: "networkidle" });
    await pageLogin.waitForTimeout(800);
    await pageLogin.screenshot({
      path: path.join(outputDir, "15_auth_login_page.png"),
      fullPage: false,
    });
    console.log("Captured 15_auth_login_page.png");

    // 16. Admin Dashboard
    const pageAdmin = await desktopContext.newPage();
    await pageAdmin.goto(`http://localhost:${PORT}/#admin`, { waitUntil: "networkidle" });
    await pageAdmin.waitForTimeout(800);
    await pageAdmin.screenshot({
      path: path.join(outputDir, "16_admin_dashboard.png"),
      fullPage: false,
    });
    console.log("Captured 16_admin_dashboard.png");

    // 17. Modals: App page with Scanner & Currency
    const pageApp = await desktopContext.newPage();
    await pageApp.goto(`http://localhost:${PORT}/app`, { waitUntil: "networkidle" });
    await pageApp.waitForTimeout(800);

    // Try opening IATA Scanner modal
    const scanBtn = pageApp.locator("button:has-text('Billet'), button:has-text('Scanner'), button[aria-label*='scanner']").first();
    if (await scanBtn.isVisible().catch(() => false)) {
      await scanBtn.click();
      await pageApp.waitForTimeout(600);
      await pageApp.screenshot({
        path: path.join(outputDir, "17_ticket_scanner_modal.png"),
        fullPage: false,
      });
      console.log("Captured 17_ticket_scanner_modal.png");
      // Close modal
      await pageApp.keyboard.press("Escape");
      await pageApp.waitForTimeout(400);
    }

    // Try opening Currency modal
    const currBtn = pageApp.locator("button:has-text('Devise'), button:has-text('EUR'), button:has-text('DZD')").first();
    if (await currBtn.isVisible().catch(() => false)) {
      await currBtn.click();
      await pageApp.waitForTimeout(600);
      await pageApp.screenshot({
        path: path.join(outputDir, "18_currency_converter_modal.png"),
        fullPage: false,
      });
      console.log("Captured 18_currency_converter_modal.png");
      await pageApp.keyboard.press("Escape");
      await pageApp.waitForTimeout(400);
    }

    // Try opening Publish modal
    const pubBtn = pageApp.locator("button:has-text('Publier'), button:has-text('Créer une annonce')").first();
    if (await pubBtn.isVisible().catch(() => false)) {
      await pubBtn.click();
      await pageApp.waitForTimeout(600);
      await pageApp.screenshot({
        path: path.join(outputDir, "19_publish_modal.png"),
        fullPage: false,
      });
      console.log("Captured 19_publish_modal.png");
      await pageApp.keyboard.press("Escape");
      await pageApp.waitForTimeout(400);
    }

    // 20. Mobile Radar
    const pageMobRadar = await mobileContext.newPage();
    await pageMobRadar.goto(`http://localhost:${PORT}/#radar`, { waitUntil: "networkidle" });
    await pageMobRadar.waitForTimeout(1000);
    await pageMobRadar.screenshot({
      path: path.join(outputDir, "20_radar_mobile.png"),
      fullPage: false,
    });
    console.log("Captured 20_radar_mobile.png");

    console.log("All advanced feature screenshots captured!");
  } finally {
    await browser.close();
    server.close();
  }
});
