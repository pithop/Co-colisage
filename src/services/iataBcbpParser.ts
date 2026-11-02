export interface ParsedBoardingPass {
  isValid: boolean;
  formatCode?: string;
  numberOfLegs?: number;
  passengerName?: string;
  pnr?: string;
  fromAirport?: string;
  toAirport?: string;
  carrier?: string;
  flightNumber?: string;
  seat?: string;
  cabinClass?: string;
  julianDate?: string;
  sequenceNumber?: string;
  passengerStatus?: string;
  routeLabel?: string;
  baggageAllowance?: string;
  raw: string;
  error?: string;
}

const AIRPORT_NAMES: Record<string, string> = {
  CDG: "Paris Charles de Gaulle (CDG)",
  ORY: "Paris Orly (ORY)",
  MRS: "Marseille Provence (MRS)",
  LYS: "Lyon Saint-Exupéry (LYS)",
  ALG: "Alger Houari Boumédiène (ALG)",
  ORN: "Oran Ahmed Ben Bella (ORN)",
  CZL: "Constantine Mohamed Boudiaf (CZL)",
  CMN: "Casablanca Mohammed V (CMN)",
  RAK: "Marrakech Menara (RAK)",
  TUN: "Tunis-Carthage (TUN)",
  DJE: "Djerba-Zarzis (DJE)",
  DSS: "Dakar Blaise Diagne (DSS)",
  ABJ: "Abidjan Félix Houphouët-Boigny (ABJ)",
  YUL: "Montréal-Trudeau (YUL)",
  DXB: "Dubaï International (DXB)",
  IST: "Istanbul (IST)",
};

const AIRLINE_NAMES: Record<string, string> = {
  AH: "Air Algérie",
  AF: "Air France",
  AT: "Royal Air Maroc",
  TU: "Tunisair",
  TO: "Transavia",
  AC: "Air Canada",
  EK: "Emirates",
  HC: "Air Sénégal",
  FR: "Ryanair",
  V7: "Volotea",
};

export const SAMPLE_BOARDING_PASSES: { label: string; carrier: string; raw: string }[] = [
  {
    label: "Air Algérie · Paris CDG -> Alger (AH1000, Siège 14A)",
    carrier: "Air Algérie",
    raw: "M1MARTIN/LINA         EABC123 CDGALGAH 1000 280Y014A0001 100",
  },
  {
    label: "Air France · Paris CDG -> Oran (AF1154, Siège 21B)",
    carrier: "Air France",
    raw: "M1DUBOIS/THOMAS       ETRF890 CDGORNAF 1154 290Y021B0042 100",
  },
  {
    label: "Royal Air Maroc · Paris ORY -> Casablanca (AT0780, Siège 03F)",
    carrier: "Royal Air Maroc",
    raw: "M1BENALI/YASMINE      EWKZ456 ORYCMNAT 0780 285J003F0012 100",
  },
  {
    label: "Tunisair · Marseille MRS -> Tunis (TU0720, Siège 18C)",
    carrier: "Tunisair",
    raw: "M1TRABELSI/MEHDI      EMRS789 MRSTUNTU 0720 282Y018C0028 100",
  },
  {
    label: "Air Canada · Montréal YUL -> Paris CDG (AC0870, Siège 32G)",
    carrier: "Air Canada",
    raw: "M1OUEDRAOGO/FATOU     ECAD321 YULCDGAC 0870 295Y032G0055 100",
  },
];

export function parseIataBcbp(rawInput: string): ParsedBoardingPass {
  const trimmed = rawInput.trim();

  if (!trimmed || trimmed.length < 40) {
    return {
      isValid: false,
      raw: trimmed,
      error: "Longueur de code-barres IATA insuffisante (minimum 40 caractères requis selon la Résolution 792).",
    };
  }

  const formatCode = trimmed.charAt(0);
  if (formatCode !== "M" && formatCode !== "S") {
    return {
      isValid: false,
      raw: trimmed,
      error: `Format de code non reconnu (${formatCode}). Le standard IATA débute par 'M' (Multi-legs) ou 'S' (Single-leg).`,
    };
  }

  try {
    const numberOfLegs = parseInt(trimmed.charAt(1), 10) || 1;
    const passengerName = trimmed.substring(2, 22).trim().replace("/", " ");
    const pnr = trimmed.substring(23, 30).trim();
    const fromAirport = trimmed.substring(30, 33).trim().toUpperCase();
    const toAirport = trimmed.substring(33, 36).trim().toUpperCase();
    const carrier = trimmed.substring(36, 39).trim().toUpperCase();
    const flightNumber = trimmed.substring(39, 44).trim();
    const julianDate = trimmed.substring(44, 47).trim();
    const cabinClass = trimmed.substring(47, 48).trim().toUpperCase();
    const seat = trimmed.substring(48, 52).trim();
    const sequenceNumber = trimmed.substring(52, 57).trim();
    const passengerStatus = trimmed.substring(57, 58).trim();

    const fromName = AIRPORT_NAMES[fromAirport] || fromAirport;
    const toName = AIRPORT_NAMES[toAirport] || toAirport;
    const carrierName = AIRLINE_NAMES[carrier] || carrier;

    const cabinLabel =
      cabinClass === "F"
        ? "Première Classe"
        : cabinClass === "J" || cabinClass === "C"
        ? "Classe Affaires (Business)"
        : cabinClass === "W"
        ? "Premium Economy"
        : "Classe Économique";

    const allowance =
      cabinClass === "J" || cabinClass === "F"
        ? "2 x 32 kg inclus + 2 bagages cabine"
        : "1 x 23 kg inclus + 1 bagage cabine (10 kg)";

    return {
      isValid: true,
      formatCode,
      numberOfLegs,
      passengerName,
      pnr,
      fromAirport,
      toAirport,
      carrier: carrierName,
      flightNumber: `${carrier}${flightNumber.replace(/^0+/, "")}`,
      seat: seat.replace(/^0+/, "") || "Attribué à l’embarquement",
      cabinClass: cabinLabel,
      julianDate,
      sequenceNumber,
      passengerStatus,
      routeLabel: `${fromName} -> ${toName}`,
      baggageAllowance: allowance,
      raw: trimmed,
    };
  } catch (err) {
    return {
      isValid: false,
      raw: trimmed,
      error: "Erreur lors du décodage des segments IATA Résolution 792.",
    };
  }
}
