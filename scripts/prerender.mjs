import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

// Hash routes remain available in the app. These static documents give crawlers
// complete content and language-specific URLs without requiring JavaScript.
const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
});
try {
  const { AwwwardsLanding } = await server.ssrLoadModule(
    "/src/components/LandingPage/AwwwardsLanding.tsx",
  );
  const template = await readFile("dist/index.html", "utf8");
  for (const locale of ["fr", "en"]) {
    const pathname = locale === "fr" ? "/landing/" : "/en/landing/";
    const body = renderToString(
      createElement(AwwwardsLanding, { initialLanguage: locale }),
    );
    const title =
      locale === "fr"
        ? "BagVoyage | Colis et Shop & Go, France–Algérie"
        : "BagVoyage | Parcels and shopping with travellers, France–Algeria";
    const description =
      locale === "fr"
        ? "Envoyez un colis, commandez des articles ou partagez votre trajet. Découvrez BagVoyage, ses rôles et son simulateur France–Algérie."
        : "Send a parcel, order products or share a journey. Discover BagVoyage and estimate your France–Algeria trip.";
    const html = template
      .replace('lang="fr"', `lang="${locale}"`)
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(
        /<meta name="description" content="[^"]*"\s*\/>/,
        `<meta name="description" content="${description}" />`,
      )
      .replace(
        /<meta property="og:title" content="[^"]*"\s*\/>/,
        `<meta property="og:title" content="${title}" />`,
      )
      .replace(
        /<meta property="og:description" content="[^"]*"\s*\/>/,
        `<meta property="og:description" content="${description}" />`,
      )
      .replace(
        'content="fr_FR"',
        `content="${locale === "fr" ? "fr_FR" : "en_GB"}"`,
      )
      .replace(
        "</head>",
        '<link rel="alternate" hreflang="fr" href="/landing/" /><link rel="alternate" hreflang="en" href="/en/landing/" /><link rel="alternate" hreflang="x-default" href="/landing/" /></head>',
      )
      .replace(
        '<div id="root"></div>',
        `<div id="root"><div class="marketplace"><main class="main-container destination-container">${body}</main></div></div>`,
      );
    const directory = `dist${pathname}`;
    await mkdir(directory, { recursive: true });
    await writeFile(`${directory}index.html`, html);
    console.log(`Prerendered ${pathname} (${locale})`);
  }
} finally {
  await server.close();
}
