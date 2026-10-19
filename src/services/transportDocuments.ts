import type { PurchaseRequest, Trip } from '../data/marketplace';

export interface TransportContext {
  id: string;
  subject: string;
  sender?: string;
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
  origin: r.origin, destination: r.destination, date: r.date,
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
export function customsEstimate(fields: CustomsFields) {
  const valid = Number.isFinite(fields.value) && fields.value >= 0 && Number.isFinite(fields.rate) && fields.rate > 0;
  const dzd = valid ? Math.round(fields.value * (fields.currency === 'EUR' ? fields.rate : 1) * 100) / 100 : null;
  return { dzd, excess: dzd === null ? null : Math.max(0, dzd - 150000), eligible: fields.destination === 'DZ' && fields.personal };
}
