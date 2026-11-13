import type { Trip, PurchaseRequest } from "../data/marketplace";
import type { WalletTransaction } from "../data/wallet";
import type {
  ConversationData,
  ChatMessage,
} from "../components/marketplace/Conversation";

import type { User, UserProfile } from "../types/auth";

export type Conversation = ConversationData;
export type Message = ChatMessage;
export type { Trip, PurchaseRequest, WalletTransaction, UserProfile };
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
  documentType?: string;
  documents?: import("./uploads").Attachment[];
  reason?: string;
  createdAt?: string;
  updatedAt: string;
}
export interface DatabaseSchema {
  pro_applications: ProApplication;
  admin_messages: AdminMessage;
  users: User;
  profiles: UserProfile;
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
  "profiles",
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
export function initDB(): Promise<IDBDatabase> {
  if (opening) return opening;
  opening = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Le stockage IndexedDB est indisponible."));
      return;
    }
    const request = indexedDB.open("BagVoyageDB_v2", 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const name of stores) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: "id" });
        }
      }
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
export const getUsers = () => getAll("users");
export const saveUser = (user: User) => saveRecord("users", user);
export const getUser = (id: string) => getRecord("users", id);

export const getProfiles = () => getAll("profiles");
export const saveProfile = (profile: UserProfile) => saveRecord("profiles", profile);
export const getProfile = (userId: string) => getRecord("profiles", userId);

export async function exportDatabaseAsJson(): Promise<Record<string, unknown[]>> {
  const result: Record<string, unknown[]> = {};
  for (const store of stores) {
    try {
      result[store] = await getAll(store);
    } catch {
      result[store] = [];
    }
  }
  return result;
}

export async function exportDatabaseAsSql(): Promise<string> {
  const data = await exportDatabaseAsJson();
  const sqlLines: string[] = [
    `-- ==========================================================`,
    `-- BagVoyage SQL Schema & Data Dump`,
    `-- Exported on: ${new Date().toISOString()}`,
    `-- Target Engine: PostgreSQL / SQLite 3`,
    `-- ==========================================================`,
    ``,
    `CREATE TABLE IF NOT EXISTS users (`,
    `  id VARCHAR(64) PRIMARY KEY,`,
    `  name VARCHAR(120) NOT NULL,`,
    `  email VARCHAR(255) NOT NULL UNIQUE,`,
    `  role VARCHAR(32) NOT NULL DEFAULT 'voyageur',`,
    `  kyc_status VARCHAR(32) DEFAULT 'unverified',`,
    `  phone VARCHAR(32),`,
    `  city VARCHAR(100),`,
    `  bio TEXT,`,
    `  home_airport VARCHAR(10),`,
    `  iban VARCHAR(40),`,
    `  rating NUMERIC(3,2) DEFAULT 5.0,`,
    `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
    `);`,
    ``,
    `CREATE TABLE IF NOT EXISTS profiles (`,
    `  id VARCHAR(64) PRIMARY KEY,`,
    `  user_id VARCHAR(64) NOT NULL REFERENCES users(id),`,
    `  first_name VARCHAR(80),`,
    `  last_name VARCHAR(80),`,
    `  email VARCHAR(255),`,
    `  phone VARCHAR(32),`,
    `  city VARCHAR(100),`,
    `  country VARCHAR(50),`,
    `  bio TEXT,`,
    `  home_airport VARCHAR(10),`,
    `  iban VARCHAR(40),`,
    `  phone_verified BOOLEAN DEFAULT FALSE,`,
    `  trust_score INT DEFAULT 80,`,
    `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
    `);`,
    ``,
    `CREATE TABLE IF NOT EXISTS trips (`,
    `  id VARCHAR(64) PRIMARY KEY,`,
    `  owner_id VARCHAR(64) NOT NULL,`,
    `  origin VARCHAR(100) NOT NULL,`,
    `  destination VARCHAR(100) NOT NULL,`,
    `  departure_date DATE NOT NULL,`,
    `  available_kg NUMERIC(6,2) NOT NULL,`,
    `  price_per_kg NUMERIC(6,2) NOT NULL,`,
    `  transport_type VARCHAR(32),`,
    `  transport_label VARCHAR(100),`,
    `  status VARCHAR(32) DEFAULT 'scheduled'`,
    `);`,
    ``,
    `CREATE TABLE IF NOT EXISTS purchase_requests (`,
    `  id VARCHAR(64) PRIMARY KEY,`,
    `  owner_id VARCHAR(64) NOT NULL,`,
    `  title VARCHAR(200) NOT NULL,`,
    `  category VARCHAR(64),`,
    `  kind VARCHAR(32) DEFAULT 'shop',`,
    `  origin VARCHAR(100) NOT NULL,`,
    `  destination VARCHAR(100) NOT NULL,`,
    `  item_price NUMERIC(10,2) NOT NULL,`,
    `  reward NUMERIC(10,2) NOT NULL,`,
    `  status VARCHAR(32) DEFAULT 'open'`,
    `);`,
    ``,
    `CREATE TABLE IF NOT EXISTS orders (`,
    `  id VARCHAR(64) PRIMARY KEY,`,
    `  conversation_id VARCHAR(64) NOT NULL,`,
    `  status VARCHAR(32) NOT NULL,`,
    `  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
    `);`,
    ``,
    `CREATE TABLE IF NOT EXISTS wallet_transactions (`,
    `  id VARCHAR(64) PRIMARY KEY,`,
    `  user_id VARCHAR(64),`,
    `  cents BIGINT NOT NULL,`,
    `  type VARCHAR(32) NOT NULL,`,
    `  label VARCHAR(255),`,
    `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
    `);`,
    ``,
    `CREATE TABLE IF NOT EXISTS conversations (`,
    `  id VARCHAR(64) PRIMARY KEY,`,
    `  name VARCHAR(120),`,
    `  subject VARCHAR(200),`,
    `  amount NUMERIC(10,2),`,
    `  service_amount NUMERIC(10,2),`,
    `  stage VARCHAR(32) NOT NULL DEFAULT 'discussion',`,
    `  pickup_code VARCHAR(10),`,
    `  delivery_code VARCHAR(10),`,
    `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
    `);`,
    ``,
    `CREATE TABLE IF NOT EXISTS admin_messages (`,
    `  id VARCHAR(64) PRIMARY KEY,`,
    `  sender_id VARCHAR(64),`,
    `  content TEXT NOT NULL,`,
    `  severity VARCHAR(32) DEFAULT 'info',`,
    `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
    `);`,
    ``,
    `CREATE TABLE IF NOT EXISTS kyc_records (`,
    `  id VARCHAR(64) PRIMARY KEY,`,
    `  user_id VARCHAR(64) NOT NULL,`,
    `  status VARCHAR(32) NOT NULL DEFAULT 'pending',`,
    `  document_type VARCHAR(64),`,
    `  documents_json JSONB,`,
    `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
    `);`,
    ``,
    `CREATE TABLE IF NOT EXISTS pro_applications (`,
    `  id VARCHAR(64) PRIMARY KEY,`,
    `  user_id VARCHAR(64) NOT NULL,`,
    `  company_name VARCHAR(120),`,
    `  siret VARCHAR(32),`,
    `  status VARCHAR(32) DEFAULT 'pending',`,
    `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
    `);`,
    ``,
  ];

  const sqlEscape = (val: unknown): string => {
    if (val === null || val === undefined) return "NULL";
    if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
    if (typeof val === "number") return Number.isFinite(val) ? String(val) : "NULL";
    if (typeof val === "object") {
      return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
    }
    return `'${String(val).replace(/'/g, "''")}'`;
  };

  for (const [storeName, rows] of Object.entries(data)) {
    if (!rows.length) continue;
    sqlLines.push(`-- ==========================================================`);
    sqlLines.push(`-- Table: ${storeName} (${rows.length} lignes)`);
    sqlLines.push(`-- ==========================================================`);
    for (const rawRow of rows) {
      const row = rawRow as Record<string, unknown>;
      const keys = Object.keys(row).filter((k) => row[k] !== undefined);
      if (!keys.length) continue;
      const values = keys.map((k) => sqlEscape(row[k]));
      sqlLines.push(
        `INSERT INTO ${storeName} (${keys.join(", ")}) VALUES (${values.join(", ")});`
      );
    }
    sqlLines.push(``);
  }

  return sqlLines.join("\n");
}

export async function seedDemoDatabase(): Promise<{ createdCount: number }> {
  let createdCount = 0;
  const existingUsers = await getAll("users");
  
  // Seed Amine Belkacem if not exists
  if (!existingUsers.some((u) => u.email === "amine.belkacem@gmail.com")) {
    const amineUser: User = {
      id: "user-demo-amine",
      name: "Amine Belkacem",
      email: "amine.belkacem@gmail.com",
      firstName: "Amine",
      lastName: "Belkacem",
      city: "Paris",
      country: "France",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      role: "voyageur",
      activePlatform: "shopandgo",
      profileSelection: "both",
      kycStatus: "verified",
      phone: "+33 6 12 34 56 78",
      phoneVerified: true,
      emailVerified: true,
      homeAirport: "CDG",
      iban: "FR7630001007941234567890185",
      trustScore: 98,
      rating: 4.95,
      reviewsCount: 38,
      stripeBalance: 320,
      pendingEscrow: 85,
      completedDeliveries: 42,
      activeTripsCount: 2,
      bio: "Navette bi-hebdomadaire Paris CDG ✈️ Alger ALG. Transport sécurisé d'achats scellés et électronique.",
      createdAt: new Date().toISOString(),
    };
    await saveUser(amineUser);
    await saveProfile({
      id: amineUser.id,
      userId: amineUser.id,
      firstName: "Amine",
      lastName: "Belkacem",
      email: amineUser.email,
      phone: "+33 6 12 34 56 78",
      city: "Paris",
      country: "France",
      bio: amineUser.bio,
      homeAirport: "CDG",
      preferredCorridors: ["Paris CDG → Alger ALG", "Paris ORY → Oran ORN"],
      iban: "FR7630001007941234567890185",
      bankName: "BNP Paribas",
      phoneVerified: true,
      emailVerified: true,
      trustScore: 98,
      avatarUrl: amineUser.avatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    createdCount++;
  }

  // Seed Sarah Benali if not exists
  if (!existingUsers.some((u) => u.email === "sarah.benali@gmail.com")) {
    const sarahUser: User = {
      id: "user-demo-sarah",
      name: "Sarah Benali",
      email: "sarah.benali@gmail.com",
      firstName: "Sarah",
      lastName: "Benali",
      city: "Lyon",
      country: "France",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "expediteur",
      activePlatform: "bagandgo",
      profileSelection: "expediteur",
      kycStatus: "verified",
      phone: "+33 7 89 01 23 45",
      phoneVerified: true,
      emailVerified: true,
      homeAirport: "LYS",
      iban: "FR7610058000011234567890123",
      trustScore: 96,
      rating: 5.0,
      reviewsCount: 19,
      stripeBalance: 0,
      pendingEscrow: 45,
      completedDeliveries: 15,
      activeTripsCount: 0,
      bio: "Expéditrice régulière Lyon - Oran pour colis familiaux et cosmétiques.",
      createdAt: new Date().toISOString(),
    };
    await saveUser(sarahUser);
    await saveProfile({
      id: sarahUser.id,
      userId: sarahUser.id,
      firstName: "Sarah",
      lastName: "Benali",
      email: sarahUser.email,
      phone: "+33 7 89 01 23 45",
      city: "Lyon",
      country: "France",
      bio: sarahUser.bio,
      homeAirport: "LYS",
      preferredCorridors: ["Lyon LYS → Oran ORN"],
      iban: "FR7610058000011234567890123",
      bankName: "Crédit Agricole",
      phoneVerified: true,
      emailVerified: true,
      trustScore: 96,
      avatarUrl: sarahUser.avatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    createdCount++;
  }

  return { createdCount };
}
