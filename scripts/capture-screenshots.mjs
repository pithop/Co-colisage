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

// Static server for dist
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

const PORT = 4179;

server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  const browser = await chromium.launch();

  try {
    // 1. Desktop context
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });

    // 2. Mobile context (iPhone 15 Pro specs)
    const mobileContext = await browser.newContext({
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
    });

    // Capture Desktop Landing Light
    const pageDeskLight = await desktopContext.newPage();
    await pageDeskLight.goto(`http://localhost:${PORT}/landing/`, { waitUntil: "networkidle" });
    await pageDeskLight.waitForTimeout(600);
    await pageDeskLight.screenshot({
      path: path.join(outputDir, "01_landing_desktop_light.png"),
      fullPage: false,
    });
    console.log("Captured 01_landing_desktop_light.png");

    // Capture Desktop Landing Dark
    const pageDeskDark = await desktopContext.newPage();
    await pageDeskDark.emulateMedia({ colorScheme: "dark" });
    await pageDeskDark.goto(`http://localhost:${PORT}/landing/`, { waitUntil: "networkidle" });
    await pageDeskDark.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    });
    await pageDeskDark.waitForTimeout(600);
    await pageDeskDark.screenshot({
      path: path.join(outputDir, "02_landing_desktop_dark.png"),
      fullPage: false,
    });
    console.log("Captured 02_landing_desktop_dark.png");

    // Capture Mobile Landing Light
    const pageMobLight = await mobileContext.newPage();
    await pageMobLight.goto(`http://localhost:${PORT}/landing/`, { waitUntil: "networkidle" });
    await pageMobLight.waitForTimeout(600);
    await pageMobLight.screenshot({
      path: path.join(outputDir, "03_landing_mobile_light.png"),
      fullPage: false,
    });
    console.log("Captured 03_landing_mobile_light.png");

    // Capture Mobile Landing Dark
    const pageMobDark = await mobileContext.newPage();
    await pageMobDark.emulateMedia({ colorScheme: "dark" });
    await pageMobDark.goto(`http://localhost:${PORT}/landing/`, { waitUntil: "networkidle" });
    await pageMobDark.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    });
    await pageMobDark.waitForTimeout(600);
    await pageMobDark.screenshot({
      path: path.join(outputDir, "04_landing_mobile_dark.png"),
      fullPage: false,
    });
    console.log("Captured 04_landing_mobile_dark.png");

    // Capture How It Works Desktop
    const pageHowDesk = await desktopContext.newPage();
    await pageHowDesk.goto(`http://localhost:${PORT}/comment-ca-marche/`, { waitUntil: "networkidle" });
    await pageHowDesk.waitForTimeout(600);
    await pageHowDesk.screenshot({
      path: path.join(outputDir, "05_how_it_works_desktop.png"),
      fullPage: false,
    });
    console.log("Captured 05_how_it_works_desktop.png");

    // Capture Pricing Desktop
    const pagePricingDesk = await desktopContext.newPage();
    await pagePricingDesk.goto(`http://localhost:${PORT}/tarifs/`, { waitUntil: "networkidle" });
    await pagePricingDesk.waitForTimeout(600);
    await pagePricingDesk.screenshot({
      path: path.join(outputDir, "06_pricing_desktop.png"),
      fullPage: false,
    });
    console.log("Captured 06_pricing_desktop.png");

    // Capture Trust & Security Desktop
    const pageTrustDesk = await desktopContext.newPage();
    await pageTrustDesk.goto(`http://localhost:${PORT}/securite/`, { waitUntil: "networkidle" });
    await pageTrustDesk.waitForTimeout(600);
    await pageTrustDesk.screenshot({
      path: path.join(outputDir, "07_trust_security_desktop.png"),
      fullPage: false,
    });
    console.log("Captured 07_trust_security_desktop.png");

    // Capture FAQ Desktop
    const pageFaqDesk = await desktopContext.newPage();
    await pageFaqDesk.goto(`http://localhost:${PORT}/faq/`, { waitUntil: "networkidle" });
    await pageFaqDesk.waitForTimeout(600);
    await pageFaqDesk.screenshot({
      path: path.join(outputDir, "08_faq_desktop.png"),
      fullPage: false,
    });
    console.log("Captured 08_faq_desktop.png");

    // Capture Marketplace / Explore Desktop
    const pageMarketDesk = await desktopContext.newPage();
    await pageMarketDesk.goto(`http://localhost:${PORT}/app`, { waitUntil: "networkidle" });
    await pageMarketDesk.waitForTimeout(800);
    await pageMarketDesk.screenshot({
      path: path.join(outputDir, "09_marketplace_desktop.png"),
      fullPage: false,
    });
    console.log("Captured 09_marketplace_desktop.png");

    // Capture Marketplace Mobile
    const pageMarketMob = await mobileContext.newPage();
    await pageMarketMob.goto(`http://localhost:${PORT}/app`, { waitUntil: "networkidle" });
    await pageMarketMob.waitForTimeout(800);
    await pageMarketMob.screenshot({
      path: path.join(outputDir, "10_marketplace_mobile.png"),
      fullPage: false,
    });
    console.log("Captured 10_marketplace_mobile.png");

    // Capture How It Works Mobile
    const pageHowMob = await mobileContext.newPage();
    await pageHowMob.goto(`http://localhost:${PORT}/comment-ca-marche/`, { waitUntil: "networkidle" });
    await pageHowMob.waitForTimeout(600);
    await pageHowMob.screenshot({
      path: path.join(outputDir, "11_how_it_works_mobile.png"),
      fullPage: false,
    });
    console.log("Captured 11_how_it_works_mobile.png");

    // Capture Pricing Mobile
    const pagePriceMob = await mobileContext.newPage();
    await pagePriceMob.goto(`http://localhost:${PORT}/tarifs/`, { waitUntil: "networkidle" });
    await pagePriceMob.waitForTimeout(600);
    await pagePriceMob.screenshot({
      path: path.join(outputDir, "12_pricing_mobile.png"),
      fullPage: false,
    });
    console.log("Captured 12_pricing_mobile.png");

    console.log("All screenshots successfully captured in:", outputDir);
  } finally {
    await browser.close();
    server.close();
  }
});
