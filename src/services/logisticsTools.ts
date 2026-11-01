export const logisticsNumber = (value: number, digits = 2) =>
  value.toLocaleString("fr-FR", { maximumFractionDigits: digits });

export function downloadLogisticsText(filename: string, text: string) {
  const url = URL.createObjectURL(
    new Blob(["\uFEFF", text], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function contentDigest(value: unknown): Promise<string> {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(JSON.stringify(value)),
  );
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export interface SealReceipt {
  id: string;
  orderId: string;
  subject: string;
  sender: string;
  carrier: string;
  signedAt: string;
  attestations: string[];
  digest: string;
}

function isSealReceipt(value: unknown): value is SealReceipt {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    [
      "id",
      "orderId",
      "subject",
      "sender",
      "carrier",
      "signedAt",
      "digest",
    ].every((key) => typeof record[key] === "string" && Boolean(record[key])) &&
    Array.isArray(record.attestations) &&
    record.attestations.length === 3 &&
    record.attestations.every((item) => typeof item === "string") &&
    Number.isFinite(Date.parse(String(record.signedAt)))
  );
}

function openLogisticsDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BagVoyageLogistics", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("seals");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () =>
      reject(
        new Error("Registre occupé. Fermez les autres onglets et réessayez."),
      );
  });
}

// The local register is scoped to the signed-in account; it is not a trusted timestamp service.
export async function loadSeal(
  scope: string,
  orderId: string,
): Promise<SealReceipt | undefined> {
  const db = await openLogisticsDB();
  const saved = await new Promise<unknown>((resolve, reject) => {
    const tx = db.transaction("seals", "readonly");
    const request = tx.objectStore("seals").get([scope, orderId]);
    tx.oncomplete = () => {
      db.close();
      resolve(request.result);
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error);
    };
  });
  if (saved === undefined) return undefined;
  if (!isSealReceipt(saved) || saved.orderId !== orderId) {
    throw new Error("Récépissé de scellage invalide.");
  }
  const { digest, ...payload } = saved;
  if ((await contentDigest(payload)) !== digest) {
    throw new Error(
      "L’empreinte du récépissé ne correspond plus à son contenu.",
    );
  }
  return saved;
}

export async function saveSeal(
  scope: string,
  receipt: SealReceipt,
): Promise<void> {
  const db = await openLogisticsDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("seals", "readwrite");
    // add prevents two tabs from silently replacing an existing attestation.
    tx.objectStore("seals").add(receipt, [scope, receipt.orderId]);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export interface ParcelMeasurements {
  length: number;
  width: number;
  height: number;
  weight: number;
}
export function parcelCalculation(parcel: ParcelMeasurements, divisor = 5000) {
  const dimensions = [parcel.length, parcel.width, parcel.height];
  const valid =
    dimensions.every(
      (value) => Number.isFinite(value) && value > 0 && value <= 300,
    ) &&
    Number.isFinite(parcel.weight) &&
    parcel.weight > 0 &&
    parcel.weight <= 1000;
  if (!valid || (divisor !== 5000 && divisor !== 6000)) return null;
  const volumetric = (parcel.length * parcel.width * parcel.height) / divisor;
  return {
    volumetric,
    billable: Math.max(parcel.weight, volumetric),
    total: dimensions.reduce((a, b) => a + b, 0),
  };
}

export function cabinFits(
  parcel: ParcelMeasurements,
  limits: readonly number[],
  weightLimit: number | null,
) {
  const sorted = [parcel.length, parcel.width, parcel.height].sort(
    (a, b) => b - a,
  );
  const bounds = [...limits].sort((a, b) => b - a);
  return (
    Boolean(parcelCalculation(parcel)) &&
    sorted.every((value, i) => value <= bounds[i]) &&
    (weightLimit === null || parcel.weight <= weightLimit)
  );
}
