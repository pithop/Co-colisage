export interface HandoverRecord {
  stage: "pickup" | "delivery";
  at: string;
  method: "camera" | "pin" | "import" | "simulation";
  photo?: string;
  photoAt?: string;
  place?: string;
  location?: { latitude: number; longitude: number; accuracy: number };
}
export interface FlightDelay {
  id: string;
  at: string;
  duration: "+1h" | "+3h" | "Vol reprogrammé";
  details: string;
}
export const formatHandoverTime = (at: string) =>
  new Date(at).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
export const handoverSummary = (record: HandoverRecord) =>
  `Remise validée ${record.place ? `à ${record.place} (lieu déclaré)` : record.location ? `à ${record.location.latitude.toFixed(5)}, ${record.location.longitude.toFixed(5)}` : "sans position GPS"} le ${formatHandoverTime(record.at)}.`;
