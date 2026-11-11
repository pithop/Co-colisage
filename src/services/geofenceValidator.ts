/**
 * BagVoyage Handover Geofencing & Location Validator
 * Standards $1B Unicorn / FinTech Anti-Fraud Security
 *
 * Verifies that the physical delivery/pickup location matches the declared
 * corridor/city/airport within a strict perimeter (max 25 km threshold).
 * If the user's location is non-compliant, requires mandatory fallback PIN validation.
 */

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// Master coordinates registry for key BagVoyage hubs
export const HUB_COORDINATES: Record<string, GeoCoordinates> = {
  // France
  CDG: { latitude: 49.0097, longitude: 2.5479 },
  ORY: { latitude: 48.7262, longitude: 2.3652 },
  PARIS: { latitude: 48.8566, longitude: 2.3522 },
  MRS: { latitude: 43.4367, longitude: 5.2150 },
  MARSEILLE: { latitude: 43.2965, longitude: 5.3698 },
  LYS: { latitude: 45.7256, longitude: 5.0811 },
  LYON: { latitude: 45.7640, longitude: 4.8357 },
  NCE: { latitude: 43.6584, longitude: 7.2159 },
  NICE: { latitude: 43.7102, longitude: 7.2620 },
  TLS: { latitude: 43.6291, longitude: 1.3638 },
  TOULOUSE: { latitude: 43.6047, longitude: 1.4442 },

  // Algérie
  ALG: { latitude: 36.6910, longitude: 3.2154 },
  ALGER: { latitude: 36.7538, longitude: 3.0588 },
  ORN: { latitude: 35.6239, longitude: -0.6212 },
  ORAN: { latitude: 35.6987, longitude: -0.6349 },
  CZL: { latitude: 36.2760, longitude: 6.6204 },
  CONSTANTINE: { latitude: 36.3650, longitude: 6.6147 },
  BJA: { latitude: 36.7119, longitude: 5.0700 },
  BEJAIA: { latitude: 36.7559, longitude: 5.0843 },

  // Maroc & Tunisie
  CMN: { latitude: 33.3675, longitude: -7.5899 },
  CASABLANCA: { latitude: 33.5731, longitude: -7.5898 },
  TUN: { latitude: 36.8510, longitude: 10.2272 },
  TUNIS: { latitude: 36.8065, longitude: 10.1815 },

  // International
  YUL: { latitude: 45.4657, longitude: -73.7455 },
  MONTREAL: { latitude: 45.5017, longitude: -73.5673 },
  DXB: { latitude: 25.2532, longitude: 55.3657 },
  DUBAI: { latitude: 25.2048, longitude: 55.2708 },
};

/**
 * Compute the Great Circle distance (in kilometers) between two coordinates using the Haversine formula.
 */
export function calculateHaversineDistance(
  coord1: GeoCoordinates,
  coord2: GeoCoordinates
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const lat1 = (coord1.latitude * Math.PI) / 180;
  const lat2 = (coord2.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface GeofenceCheckResult {
  isCompliant: boolean;
  distanceKm: number | null;
  hubDetected?: string;
  statusMessage: string;
  requiresPinFallback: boolean;
}

/**
 * Validate user coordinates against the declared city or airport hub.
 * Max tolerance: 25 kilometers (allows city center to airport transfers).
 */
export function validateGeofence(
  userCoords: GeoCoordinates,
  declaredLocationName: string,
  toleranceKm = 25
): GeofenceCheckResult {
  const cleanDeclared = declaredLocationName.toUpperCase().replace(/[^A-Z]/g, "");

  // Find best matching hub
  let matchedHubKey: string | null = null;
  for (const key of Object.keys(HUB_COORDINATES)) {
    if (cleanDeclared.includes(key) || key.includes(cleanDeclared)) {
      matchedHubKey = key;
      break;
    }
  }

  if (!matchedHubKey) {
    return {
      isCompliant: true,
      distanceKm: null,
      statusMessage: "Position GPS enregistrée sans référence de couloir connue.",
      requiresPinFallback: false,
    };
  }

  const hubCoords = HUB_COORDINATES[matchedHubKey];
  const distanceKm = Math.round(calculateHaversineDistance(userCoords, hubCoords) * 10) / 10;

  if (distanceKm <= toleranceKm) {
    return {
      isCompliant: true,
      distanceKm,
      hubDetected: matchedHubKey,
      statusMessage: `Remise certifiée à ${distanceKm} km du hub ${matchedHubKey} (conforme).`,
      requiresPinFallback: false,
    };
  }

  return {
    isCompliant: false,
    distanceKm,
    hubDetected: matchedHubKey,
    statusMessage: `Écart de position détecté (${distanceKm} km du hub ${matchedHubKey} prévu). Validation PIN obligatoire.`,
    requiresPinFallback: true,
  };
}
