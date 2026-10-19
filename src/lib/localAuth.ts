import { getRecord, saveRecord } from '../services/productionDb';
import type { Attachment } from '../services/uploads';
import { User, UserRole } from "../types/auth";

export interface Registration {
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  city: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  identityDocuments?: Attachment[];
}
interface LocalAccount {
  user: User;
  salt: string;
  passwordHash: string;
}
const accountKey = "ep-local-accounts-v1";
const normalizeEmail = (email: string) => email.trim().toLowerCase();
function accounts(): LocalAccount[] {
  const raw = localStorage.getItem(accountKey);
  return raw ? JSON.parse(raw) : [];
}
async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 210000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(bits), (n) =>
    n.toString(16).padStart(2, "0"),
  ).join("");
}
export async function registerLocalAccount(input: Registration): Promise<User> {
  const email = normalizeEmail(input.email);
  const username = input.username.trim();
  if (
    !username ||
    !input.firstName.trim() ||
    !input.lastName.trim() ||
    !input.city.trim()
  )
    throw new Error("Complétez tous les champs du profil.");
  if (!/^\S+@\S+\.\S+$/.test(email))
    throw new Error("Saisissez une adresse e-mail valide.");
  if (input.password.length < 8)
    throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
  if (!/^[+\d][\d\s().-]{5,24}$/.test(input.phone.trim()))
    throw new Error("Saisissez un numéro de téléphone valide.");
  const birth = new Date(`${input.birthDate}T00:00:00`);
  if (!Number.isFinite(birth.getTime()) || birth >= new Date())
    throw new Error("Saisissez une date de naissance valide dans le passé.");
  const salt = crypto.randomUUID();
  const passwordHash = await hashPassword(input.password, salt);
  const saved = accounts();
  if (saved.some((a) => a.user.email === email))
    throw new Error(
      "Cette adresse e-mail possède déjà un compte sur cet appareil.",
    );
  if (
    saved.some((a) => a.user.username?.toLowerCase() === username.toLowerCase())
  )
    throw new Error("Ce nom d’utilisateur est déjà utilisé sur cet appareil.");
  const user: User = {
    id: crypto.randomUUID(),
    username,
    email,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    name: `${input.firstName.trim()} ${input.lastName.trim()}`,
    birthDate: input.birthDate,
    city: input.city.trim(),
    phone: input.phone.trim(),
    role: input.role,
    avatar: "",
    kycStatus: "pending",
    rating: 0,
    reviewsCount: 0,
    stripeBalance: 0,
    pendingEscrow: 0,
    completedDeliveries: 0,
    activeTripsCount: 0,
  };
  // Files stay in IndexedDB; the password hash never leaves the local account store.
  await saveRecord('users', user);
  await saveRecord('kyc_records', { id: user.id, userId: user.id, status: 'pending', documents: input.identityDocuments, updatedAt: new Date().toISOString() });
  localStorage.setItem(
    accountKey,
    JSON.stringify([...saved, { user, salt, passwordHash }]),
  );
  return user;
}
export async function authenticateLocalAccount(
  email: string,
  password: string,
): Promise<User> {
  const account = accounts().find(
    (a) => a.user.email === normalizeEmail(email),
  );
  if (
    !account ||
    (await hashPassword(password, account.salt)) !== account.passwordHash
  )
    throw new Error("Adresse e-mail ou mot de passe incorrect.");
  return await getRecord('users', account.user.id) || account.user;
}
