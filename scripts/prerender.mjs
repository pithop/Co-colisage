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
  const { HowItWorksPage } = await server.ssrLoadModule(
    "/src/components/Pages/HowItWorksPage.tsx",
  );
  const { PricingPage } = await server.ssrLoadModule(
    "/src/components/Pages/PricingPage.tsx",
  );
  const { TrustPage } = await server.ssrLoadModule(
    "/src/components/Pages/TrustPage.tsx",
  );
  const { FaqPage } = await server.ssrLoadModule(
    "/src/components/Pages/FaqPage.tsx",
  );

  const template = await readFile("dist/index.html", "utf8");

  const pages = [
    {
      id: "landing",
      component: AwwwardsLanding,
      getProps: (locale) => ({ initialLanguage: locale }),
      wrapperClass: "marketplace public-landing",
      fr: {
        pathname: "/landing/",
        title: "BagVoyage | Colis et Shop & Go, France–Algérie",
        description:
          "Envoyez un colis, commandez des articles ou partagez votre trajet. Découvrez BagVoyage, ses rôles et son simulateur France–Algérie.",
      },
      en: {
        pathname: "/en/landing/",
        title: "BagVoyage | Parcels and shopping with travellers, France–Algeria",
        description:
          "Send a parcel, order products or share a journey. Discover BagVoyage and estimate your France–Algeria trip.",
      },
      isRootDefault: true,
    },
    {
      id: "how-it-works",
      component: HowItWorksPage,
      getProps: (locale) => ({ language: locale, navigate: () => {} }),
      wrapperClass: "marketplace",
      fr: {
        pathname: "/comment-ca-marche/",
        title: "Comment ça marche | BagVoyage - Co-colisage et Shop & Go",
        description:
          "Découvrez pas à pas comment envoyer un colis, voyager rémunéré ou commander à l'étranger en toute sécurité avec BagVoyage.",
      },
      en: {
        pathname: "/en/how-it-works/",
        title: "How it works | BagVoyage - Crowdsourced Delivery & Shopping",
        description:
          "Learn step by step how to send parcels, earn money traveling, or buy products abroad safely with BagVoyage.",
      },
    },
    {
      id: "pricing",
      component: PricingPage,
      getProps: (locale) => ({ language: locale, navigate: () => {} }),
      wrapperClass: "marketplace",
      fr: {
        pathname: "/tarifs/",
        title: "Tarifs et Simulateur | BagVoyage - Économisez jusqu'à 70%",
        description:
          "Consultez nos tarifs transparents par corridor : dès 8 €/kg pour l'Algérie, sans frais cachés. 85% reversés au voyageur.",
      },
      en: {
        pathname: "/en/pricing/",
        title: "Pricing & Calculator | BagVoyage - Save up to 70%",
        description:
          "Check our transparent corridor pricing: from €8/kg to Algeria, 0 hidden fees. 85% paid to the traveler.",
      },
    },
    {
      id: "trust",
      component: TrustPage,
      getProps: (locale) => ({ language: locale, navigate: () => {} }),
      wrapperClass: "marketplace",
      fr: {
        pathname: "/securite/",
        title: "Sécurité et Confiance | BagVoyage - Séquestre et Vérification KYC",
        description:
          "Séquestre bancaire certifié, vérification d'identité stricte, code secret PIN à 6 chiffres et cadre juridique conforme à la Convention de Montréal.",
      },
      en: {
        pathname: "/en/trust/",
        title: "Trust & Security | BagVoyage - Escrow & Identity Verification",
        description:
          "Certified escrow payment, strict identity verification, 6-digit PIN delivery code, and Montreal Convention legal compliance.",
      },
    },
    {
      id: "faq",
      component: FaqPage,
      getProps: (locale) => ({ language: locale, navigate: () => {} }),
      wrapperClass: "marketplace",
      fr: {
        pathname: "/faq/",
        title: "Centre d'Aide & FAQ | BagVoyage - Réponses à vos questions",
        description:
          "Toutes les réponses sur les expéditions, les paiements sécurisés, les douanes et la conformité aérienne sur BagVoyage.",
      },
      en: {
        pathname: "/en/faq/",
        title: "Help Center & FAQ | BagVoyage - All your questions answered",
        description:
          "All answers regarding parcel shipments, secure payments, customs regulations, and aviation safety on BagVoyage.",
      },
    },
  ];

  for (const page of pages) {
    for (const locale of ["fr", "en"]) {
      const meta = page[locale];
      const body = renderToString(
        createElement(page.component, page.getProps(locale)),
      );
      const html = template
        .replace('lang="fr"', `lang="${locale}"`)
        .replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`)
        .replace(
          /<meta name="description" content="[^"]*"\s*\/>/,
          `<meta name="description" content="${meta.description}" />`,
        )
        .replace(
          /<meta property="og:title" content="[^"]*"\s*\/>/,
          `<meta property="og:title" content="${meta.title}" />`,
        )
        .replace(
          /<meta property="og:description" content="[^"]*"\s*\/>/,
          `<meta property="og:description" content="${meta.description}" />`,
        )
        .replace(
          'content="fr_FR"',
          `content="${locale === "fr" ? "fr_FR" : "en_GB"}"`,
        )
        .replace(
          "</head>",
          `<link rel="alternate" hreflang="fr" href="${page.fr.pathname}" /><link rel="alternate" hreflang="en" href="${page.en.pathname}" /><link rel="alternate" hreflang="x-default" href="${page.fr.pathname}" /></head>`,
        )
        .replace(
          '<div id="root"></div>',
          `<div id="root"><div class="${page.wrapperClass}"><main class="main-container destination-container">${body}</main></div></div>`,
        );

      const directory = `dist${meta.pathname}`;
      await mkdir(directory, { recursive: true });
      await writeFile(`${directory}index.html`, html);
      if (page.isRootDefault && locale === "fr") {
        await writeFile("dist/index.html", html);
      }
      console.log(`Prerendered ${meta.pathname} (${locale})`);
    }
  }
} finally {
  await server.close();
}
