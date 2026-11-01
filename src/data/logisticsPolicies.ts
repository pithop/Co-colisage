export const logisticsSources = {
  iataVolume:
    "https://www.iata.org/en/publications/newsletters/iata-knowledge-hub/air-cargo-tariffs-and-rules-what-you-need-to-know",
  steb: "https://www.icao.int/aviation-security-policy-section/LAGS_STEBS",
  batteries: "https://www.iata.org/en/youandiata/travelers/batteries",
  montreal:
    "https://www.icao.int/news/international-air-travel-liability-limits-set-increase-enhancing-customer-compensation-0",
  claims: "https://www.service-public.gouv.fr/particuliers/vosdroits/F11370",
};

export interface AirlineBaggagePolicy {
  name: string;
  cabin: readonly [number, number, number];
  kg: number | null;
  hold: string;
  note: string;
  source: string;
}
// Economy reference allowances checked on 2026-11-01; the ticket and operating carrier prevail.
export const airlineBaggagePolicies: AirlineBaggagePolicy[] = [
  {
    name: "Air France",
    cabin: [55, 35, 25],
    kg: 12,
    hold: "158 cm · 23 kg ; 32 kg selon cabine",
    note: "12 kg avec le petit sac. Option selon tarif.",
    source: "https://wwws.airfrance.fr/information/bagages/bagage-cabine-soute",
  },
  {
    name: "Transavia",
    cabin: [55, 40, 25],
    kg: 10,
    hold: "Quota acheté · 32 kg maximum par pièce",
    note: "Cabine sur option ou tarif éligible. 10 kg avec le petit sac.",
    source:
      "https://www.transavia.com/aide/fr-fr/bagages/bagages-a-main/bagage-main-regles",
  },
  {
    name: "Air Algérie",
    cabin: [55, 35, 25],
    kg: 10,
    hold: "Pièces de 23 kg selon trajet et tarif",
    note: "Hors ATR : 40 × 30 × 20 cm et 5 kg sur ATR.",
    source: "https://airalgerie.dz/planifier-et-reserver/bagage/bagage-a-main/",
  },
  {
    name: "Royal Air Maroc",
    cabin: [55, 40, 25],
    kg: 10,
    hold: "Franchise à vérifier sur le billet",
    note: "Économique : 10 kg. Affaires : 12 kg.",
    source: "https://www.royalairmaroc.com/td-fr/bagage-a-main",
  },
  {
    name: "Air Canada",
    cabin: [55, 40, 23],
    kg: null,
    hold: "158 cm · 23 kg en standard",
    note: "Levage sans aide. Restrictions Basic selon trajet.",
    source:
      "https://www.aircanada.com/ca/en/aco/home/plan/baggage/carry-on.html",
  },
  {
    name: "Emirates",
    cabin: [55, 38, 22],
    kg: 7,
    hold: "Par pièce ou au poids selon trajet",
    note: "Économique : 7 kg, exceptions selon départ.",
    source:
      "https://www.emirates.com/us/english/before-you-fly/baggage/cabin-baggage-rules/",
  },
];

export const hsArticles = [
  {
    code: "8517.13",
    name: "Smartphones",
    keywords: "telephone téléphone portable iphone mobile",
    scope: "Téléphones intelligents. Batteries et homologation à vérifier.",
  },
  {
    code: "3303.00",
    name: "Parfums",
    keywords: "parfum cosmetiques cosmétiques eau toilette",
    scope:
      "Parfums et eaux de toilette. Les autres cosmétiques relèvent notamment du SH 3304.",
  },
  {
    code: "6204.42",
    name: "Vêtements neufs · robes en coton",
    keywords: "vetements vêtements robe coton textile",
    scope:
      "Robes en coton pour femmes ou fillettes, hors bonneterie. Le code des autres vêtements dépend de leur matière et confection.",
  },
  {
    code: "8708.29",
    name: "Pièces auto · carrosserie",
    keywords: "automobile voiture carrosserie pieces pièces",
    scope:
      "Autres parties et accessoires de carrosserie. Ne couvre pas toutes les pièces automobiles.",
  },
  {
    code: "8471.30",
    name: "Ordinateurs portables",
    keywords: "ordinateur laptop pc macbook informatique",
    scope:
      "Machines portatives de traitement de données de 10 kg ou moins, avec unité centrale, clavier et écran.",
  },
  {
    code: "9018.90",
    name: "Matériel médical · autres instruments",
    keywords: "medical médical instruments medecine médecine",
    scope:
      "Autres instruments et appareils de médecine. Autorisations et sous-position à confirmer selon le dispositif.",
  },
] as const;

export type CustomsDestination = "DZ" | "MA" | "TN" | "EU" | "CA";
export interface CustomsPolicy {
  name: string;
  currency: string;
  allowance: number;
  condition: string;
  cash: string;
  source: string;
}
export const customsPolicies: Record<CustomsDestination, CustomsPolicy> = {
  DZ: {
    name: "Algérie",
    currency: "DZD",
    allowance: 150000,
    condition:
      "Référence du rapport : article 106 LF 2021, usage personnel ou familial. Régime et assiette de la taxation forfaitaire de 30 % à confirmer auprès des douanes.",
    cash: "Seuil de déclaration des devises : 1 000 EUR ; vérifier les conditions applicables au voyageur.",
    source: "https://alces.douane.gov.dz/",
  },
  MA: {
    name: "Maroc",
    currency: "MAD",
    allowance: 2000,
    condition:
      "Seuil de travail du rapport : 2 000 MAD. Éligibilité et montant à confirmer auprès de l’ADII avant le voyage.",
    cash: "Seuil de déclaration des devises : 100 000 MAD de contre-valeur, à vérifier selon le régime.",
    source: "https://www.douane.gov.ma/",
  },
  TN: {
    name: "Tunisie",
    currency: "TND",
    allowance: 5000,
    condition:
      "Retour provisoire des Tunisiens résidant à l’étranger : plafond annuel de 5 000 TND selon le décret du 19 juin 2024, sous conditions de séjour. Le seuil de 2 000 TND du rapport est ancien.",
    cash: "Consulter les formalités de change, distinctes de la franchise marchandises.",
    source: "https://www.douane.gov.tn/retour-provisoire/",
  },
  EU: {
    name: "Union Européenne",
    currency: "EUR",
    allowance: 430,
    condition:
      "Arrivée aérienne ou maritime depuis un pays hors UE, usage personnel non commercial. 150 EUR pour les moins de 15 ans. La valeur d’un objet indivisible dépassant la franchise est intégralement taxable.",
    cash: "Déclaration d’argent liquide à partir de 10 000 EUR.",
    source:
      "https://www.douane.gouv.fr/fiche/achats-letranger-quelles-limitations-et-quelles-taxes-douanieres",
  },
  CA: {
    name: "Canada",
    currency: "CAD",
    allowance: 800,
    condition:
      "Résident revenant après au moins 48 h d’absence, biens personnels admissibles. Franchise non transférable à un tiers.",
    cash: "Déclaration des espèces et instruments monétaires à partir de 10 000 CAD.",
    source: "https://www.cbsa-asfc.gc.ca/travel-voyage/declare-eng.html",
  },
};

export interface AirportLocker {
  code: string;
  name: string;
  terminals: {
    id: string;
    name: string;
    available: number;
    dailyRate: number;
    currency: string;
    kind: "airport" | "port";
  }[];
}
// Demonstration inventory only: these locations are not asserted to be contracted operators.
export const airportLockers: AirportLocker[] = [
  {
    code: "CDG",
    name: "Paris-CDG",
    terminals: [
      {
        id: "cdg-2e",
        name: "Terminal 2E",
        available: 12,
        dailyRate: 8,
        currency: "EUR",
        kind: "airport",
      },
      {
        id: "cdg-tgv",
        name: "Gare TGV",
        available: 8,
        dailyRate: 7,
        currency: "EUR",
        kind: "airport",
      },
    ],
  },
  {
    code: "ORY",
    name: "Paris-Orly",
    terminals: [
      {
        id: "ory-4",
        name: "Terminal 4 - Départs Sud",
        available: 6,
        dailyRate: 7,
        currency: "EUR",
        kind: "airport",
      },
    ],
  },
  {
    code: "MRS",
    name: "Marseille-Provence",
    terminals: [
      {
        id: "mrs-1",
        name: "Terminal 1 Hall A",
        available: 9,
        dailyRate: 6,
        currency: "EUR",
        kind: "airport",
      },
      {
        id: "mrs-fos",
        name: "Gare Maritime Fos",
        available: 4,
        dailyRate: 5,
        currency: "EUR",
        kind: "port",
      },
    ],
  },
  {
    code: "LYS",
    name: "Lyon-Saint Exupéry",
    terminals: [
      {
        id: "lys-1",
        name: "Terminal 1",
        available: 7,
        dailyRate: 6,
        currency: "EUR",
        kind: "airport",
      },
    ],
  },
  {
    code: "ALG",
    name: "Alger Houari Boumédiène",
    terminals: [
      {
        id: "alg-ouest",
        name: "Terminal Ouest - Hall Arrivées",
        available: 10,
        dailyRate: 900,
        currency: "DZD",
        kind: "airport",
      },
    ],
  },
  {
    code: "CMN",
    name: "Casablanca Mohammed V",
    terminals: [
      {
        id: "cmn-1",
        name: "Terminal 1",
        available: 5,
        dailyRate: 60,
        currency: "MAD",
        kind: "airport",
      },
    ],
  },
  {
    code: "TUN",
    name: "Tunis-Carthage",
    terminals: [
      {
        id: "tun-central",
        name: "Hall Central",
        available: 8,
        dailyRate: 18,
        currency: "TND",
        kind: "airport",
      },
    ],
  },
  {
    code: "YUL",
    name: "Montréal-Trudeau",
    terminals: [
      {
        id: "yul-departures",
        name: "Zone Départs Internationaux",
        available: 11,
        dailyRate: 12,
        currency: "CAD",
        kind: "airport",
      },
    ],
  },
];
