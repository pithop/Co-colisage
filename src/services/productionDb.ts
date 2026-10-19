import {
  trips,
  requests,
  type Trip,
  type PurchaseRequest,
} from "../data/marketplace";
import { initialConversations } from "../data/conversations";
import { walletTransactions, type WalletTransaction } from "../data/wallet";
import type {
  ConversationData,
  ChatMessage,
} from "../components/marketplace/Conversation";
import type { User } from "../types/auth";

export type Conversation = ConversationData;
export type Message = ChatMessage;
export type { Trip, PurchaseRequest, WalletTransaction };
export interface Order {
  id: string;
  conversationId: string;
  status: Conversation["stage"];
  updatedAt: string;
}
export interface ProApplication {
  id: string;
  userId: string;
  companyName: string;
  country: "FR" | "DZ";
  registration: string;
  documents: Record<
    "registry" | "license" | "insurance" | "identity",
    import("./uploads").Attachment
  >;
  fleet: { id: string; type: string; payloadKg: number; volume: number }[];
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reason?: string;
}
export interface AdminMessage {
  id: string;
  conversationId: string;
  userId?: string;
  text: string;
  createdAt: string;
  author: "Support Officiel BagVoyage";
}
export interface KycRecord {
  id: string;
  userId: string;
  status: User["kycStatus"];
  documents?: import("./uploads").Attachment[];
  reason?: string;
  updatedAt: string;
}
export interface DatabaseSchema {
  pro_applications: ProApplication;
  admin_messages: AdminMessage;
  users: User;
  trips: Trip;
  purchase_requests: PurchaseRequest;
  orders: Order;
  conversations: Conversation;
  wallet_transactions: WalletTransaction;
  kyc_records: KycRecord;
}
export type StoreName = keyof DatabaseSchema;
const stores: StoreName[] = [
  "pro_applications",
  "admin_messages",
  "users",
  "trips",
  "purchase_requests",
  "orders",
  "conversations",
  "wallet_transactions",
  "kyc_records",
];
let opening: Promise<IDBDatabase> | undefined;
const channel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("BagVoyageDB_v1")
    : undefined;
const listeners = new Set<(store: StoreName) => void>();
channel?.addEventListener("message", ({ data }) => {
  if (stores.includes(data)) listeners.forEach((listener) => listener(data));
});
export function notifyStore(store: StoreName) {
  channel?.postMessage(store);
  listeners.forEach((listener) => listener(store));
}
export function subscribeToDatabase(listener: (store: StoreName) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function legacy<T extends { id: string }>(key: string, fallback: T[]): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(value) &&
      value.every((item) => item && typeof item.id === "string")
      ? value
      : fallback;
  } catch {
    return fallback;
  }
}
// Starter inventory is created once. Dates remain usable regardless of installation day.
const corridors = [
  ["Paris", "Alger", "CDG", "ALG", "Air Algérie"],
  ["Marseille", "Oran", "MRS", "ORN", "Air Algérie"],
  ["Lyon", "Casablanca", "LYS", "CMN", "Royal Air Maroc"],
  ["Paris", "Montréal", "CDG", "YUL", "Air France"],
] as const;
const internationalTrips: Trip[] = corridors.map(
  ([origin, destination, originCode, destinationCode, transportLabel], i) => {
    const date = new Date();
    date.setDate(date.getDate() + 7 + i * 3);
    return {
      ...trips[3],
      id: `international-${originCode}-${destinationCode}`,
      title: `${origin} → ${destination}`,
      origin,
      destination,
      originCode,
      destinationCode,
      transportLabel,
      departureDate: date.toISOString().slice(0, 10),
      departureTime: "10:30",
      flightNumber: undefined,
      travelerName: ["Amine", "Nadia", "Salma", "Julien"][i],
      travelerAvatar: "",
      rating: 0,
      reviewsCount: 0,
      isSuperTraveler: false,
      availableKg: 12 + i,
      pricePerKg: 8 + i,
      capacity: `${12 + i} kg disponibles`,
      description:
        "Remise au terminal de départ et rendez-vous à convenir à l’arrivée.",
    };
  },
);
export function initDB(): Promise<IDBDatabase> {
  if (opening) return opening;
  opening = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Le stockage IndexedDB est indisponible."));
      return;
    }
    const request = indexedDB.open("BagVoyageDB_v1", 2);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      for (const name of stores)
        if (!db.objectStoreNames.contains(name))
          db.createObjectStore(name, { keyPath: "id" });
      if (event.oldVersion > 0) return; // Upgrades must never overwrite existing records.
      const tx = request.transaction!;
      const seedConversations = legacy(
        "ep-conversations-v1",
        initialConversations,
      );
      const seedTrips = legacy("ep-trips-v1", trips);
      const seeds: Partial<{ [K in StoreName]: DatabaseSchema[K][] }> = {
        trips: [
          ...seedTrips,
          ...internationalTrips.filter(
            (trip) => !seedTrips.some((existing) => existing.id === trip.id),
          ),
        ],
        purchase_requests: legacy("ep-requests-v1", requests),
        conversations: seedConversations,
        wallet_transactions: walletTransactions(
          seedConversations,
          legacy<WalletTransaction>("ep-wallet-transfers-v1", []),
        ),
      };
      for (const name of stores)
        (seeds[name] || []).forEach((item, index) =>
          tx.objectStore(name).put({ ...item, _position: index }),
        );
    };
    request.onerror = () => {
      opening = undefined;
      reject(request.error);
    };
    request.onblocked = () => {
      opening = undefined;
      reject(
        new Error(
          "Fermez les autres onglets BagVoyage pour mettre à jour le stockage.",
        ),
      );
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
        opening = undefined;
      };
      db.onclose = () => {
        opening = undefined;
      };
      resolve(db);
    };
  });
  return opening;
}
export async function getAll<K extends StoreName>(
  store: K,
): Promise<DatabaseSchema[K][]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const request = tx.objectStore(store).getAll();
    tx.oncomplete = () =>
      resolve(
        request.result.sort(
          (a: { _position?: number }, b: { _position?: number }) =>
            (a._position ?? 0) - (b._position ?? 0),
        ),
      );
    tx.onabort = () => reject(tx.error || request.error);
    tx.onerror = () => reject(tx.error);
  });
}
export async function getRecord<K extends StoreName>(
  store: K,
  id: string,
): Promise<DatabaseSchema[K] | undefined> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const request = tx.objectStore(store).get(id);
    tx.oncomplete = () => resolve(request.result);
    tx.onabort = () => reject(tx.error || request.error);
  });
}
export async function saveRecords<K extends StoreName>(
  store: K,
  records: DatabaseSchema[K][],
  deletedIds: string[] = [],
): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    for (const record of records) {
      const target = tx.objectStore(store);
      const existing = target.get(record.id);
      existing.onsuccess = () => {
        let merged = record;
        if (store === "conversations" && existing.result) {
          const before = existing.result as Conversation;
          const after = record as Conversation;
          const stages: Conversation["stage"][] = [
            "discussion",
            "secured",
            "collected",
            "delivered",
          ];
          merged = {
            ...before,
            ...after,
            resolution: before.resolution || after.resolution,
            stage: before.resolution
              ? before.stage
              : stages[
                  Math.max(
                    stages.indexOf(before.stage),
                    stages.indexOf(after.stage),
                  )
                ],
            messages: [
              ...new Map(
                [...before.messages, ...after.messages].map((message) => [
                  message.id,
                  message,
                ]),
              ).values(),
            ],
            handovers: [
              ...new Map(
                [...(before.handovers || []), ...(after.handovers || [])].map(
                  (handover) => [handover.stage, handover],
                ),
              ).values(),
            ],
          } as DatabaseSchema[K];
        }
        target.put({
          ...merged,
          _position: existing.result?._position ?? -Date.now(),
        });
      };
    }
    for (const id of deletedIds) tx.objectStore(store).delete(id);
    tx.oncomplete = () => {
      notifyStore(store);
      resolve();
    };
    tx.onabort = () =>
      reject(tx.error || new Error("Enregistrement interrompu."));
    tx.onerror = () => reject(tx.error);
  });
}
export const saveRecord = <K extends StoreName>(
  store: K,
  record: DatabaseSchema[K],
) => saveRecords(store, [record]);
export const deleteRecord = (store: StoreName, id: string) =>
  saveRecords(store, [], [id]);
export const getTrips = () => getAll("trips");
export const saveTrip = (trip: Trip) => saveRecord("trips", trip);
export const getPurchaseRequests = () => getAll("purchase_requests");
export const savePurchaseRequest = (request: PurchaseRequest) =>
  saveRecord("purchase_requests", request);
export const getWalletTransactions = () => getAll("wallet_transactions");
export const saveWalletTransaction = (tx: WalletTransaction) =>
  saveRecord("wallet_transactions", tx);
export const getConversations = () => getAll("conversations");
export async function saveMessage(convId: string, msg: Message): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("conversations", "readwrite");
    const store = tx.objectStore("conversations");
    const request = store.get(convId);
    request.onsuccess = () => {
      const conversation: Conversation | undefined = request.result;
      if (!conversation) {
        tx.abort();
        return;
      }
      if (!conversation.messages.some((message) => message.id === msg.id))
        store.put({
          ...conversation,
          messages: [...conversation.messages, msg],
        });
    };
    tx.oncomplete = () => {
      notifyStore("conversations");
      resolve();
    };
    tx.onabort = () =>
      reject(tx.error || new Error("Conversation introuvable."));
    tx.onerror = () => reject(tx.error);
  });
}
