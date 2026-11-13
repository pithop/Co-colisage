import type { PurchaseRequest, Trip } from '../data/marketplace';

export interface TransportContext {
  id: string;
  subject: string;
  sender?: string;
  senderAddress?: string;
  recipientAddress?: string;
  carrier?: string;
  recipient?: string;
  origin?: string;
  destination?: string;
  reference?: string;
  date?: string;
  weight?: number;
  value?: number;
  currency?: 'EUR' | 'DZD';
}
export interface WaybillFields {
  sender: string; senderAddress: string; carrier: string; recipient: string;
  recipientAddress: string; origin: string; destination: string; reference: string;
  date: string; description: string; weight: number; value: number; currency: 'EUR' | 'DZD';
}
export interface CustomsFields {
  destination: 'DZ' | 'MA' | 'TN' | 'EU'; description: string;
  value: number; currency: 'EUR' | 'DZD'; rate: number;
  personal: boolean; certified: boolean; declarant: string;
}
export interface TransportDocument<T = WaybillFields | CustomsFields> {
  id: string; orderId: string; kind: 'waybill' | 'customs';
  issuedAt: string; revision: number; fields: T; digest: string;
}
export const requestTransportContext = (r: PurchaseRequest): TransportContext => ({
  id: r.id, subject: r.title, sender: r.buyer, recipient: r.recipientName,
  origin: r.origin, destination: r.destination, date: r.date, reference: r.transportReference,
  weight: r.weightKg, value: r.declaredValue ?? r.budget, currency: r.declaredCurrency ?? 'EUR',
});
export const tripTransportContext = (t: Trip): TransportContext => ({
  id: t.id, subject: t.title, carrier: t.travelerName, origin: t.origin,
  destination: t.destination, reference: t.flightNumber, date: t.departureDate,
});
function openDocumentDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BagVoyageDocuments', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('documents', { keyPath: 'id' }).createIndex('orderId', 'orderId');
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Fermez les autres onglets pour ouvrir les documents.'));
    request.onsuccess = () => resolve(request.result);
  });
}
export async function getDocuments(orderId: string): Promise<TransportDocument[]> {
  const db = await openDocumentDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('documents', 'readonly');
    const request = tx.objectStore('documents').index('orderId').getAll(orderId);
    tx.oncomplete = () => { db.close(); resolve(request.result.sort((a: TransportDocument, b: TransportDocument) => b.issuedAt.localeCompare(a.issuedAt))); };
    tx.onabort = () => { db.close(); reject(tx.error); };
  });
}
export async function issueDocument<T extends WaybillFields | CustomsFields>(orderId: string, kind: TransportDocument['kind'], fields: T): Promise<TransportDocument<T>> {
  const previous = await getDocuments(orderId);
  const payload = {
    id: `BV-${new Date().getFullYear()}-${crypto.randomUUID().toUpperCase()}`,
    orderId, kind, issuedAt: new Date().toISOString(),
    revision: previous.filter(d => d.kind === kind).length + 1, fields,
  };
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(payload)));
  const doc = { ...payload, digest: Array.from(new Uint8Array(bytes), n => n.toString(16).padStart(2, '0')).join('') };
  const db = await openDocumentDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('documents', 'readwrite');
    tx.objectStore('documents').add(doc);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onabort = () => { db.close(); reject(tx.error); };
  });
  return doc;
}
export function customsThreshold(destination: string) {
  switch (destination) {
    case 'MA': return { currency: 'MAD', limit: 4000, label: '4 000 MAD (Art. 190 Code des Douanes)' };
    case 'TN': return { currency: 'TND', limit: 500, label: '500 TND (Franchise Voyageur)' };
    case 'EU': return { currency: 'EUR', limit: 430, label: '430 EUR (Seuil voyageur aérien UE)' };
    case 'DZ':
    default:
      return { currency: 'DZD', limit: 150000, label: '150 000 DZD (Article 106 LF 2021)' };
  }
}

export function customsEstimate(fields: CustomsFields) {
  const valid = Number.isFinite(fields.value) && fields.value >= 0 && Number.isFinite(fields.rate) && fields.rate > 0;
  const destination = fields.destination || 'DZ';
  const threshold = customsThreshold(destination);

  let localValue = 0;
  if (destination === 'DZ') {
    localValue = fields.currency === 'EUR' ? fields.value * fields.rate : fields.value;
  } else if (destination === 'MA') {
    localValue = fields.currency === 'EUR' ? fields.value * 11 : fields.value;
  } else if (destination === 'TN') {
    localValue = fields.currency === 'EUR' ? fields.value * 3.4 : fields.value;
  } else {
    localValue = fields.value;
  }

  const rounded = valid ? Math.round(localValue * 100) / 100 : null;
  const excess = rounded === null ? null : Math.max(0, rounded - threshold.limit);

  return {
    localValue: rounded,
    dzd: destination === 'DZ' ? rounded : null,
    excess,
    eligible: fields.personal && (excess === 0),
    threshold,
  };
}
