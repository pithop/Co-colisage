// Authentication and provider credentials belong on the server. No secret is shipped to Vite.
const apiBase = import.meta.env.VITE_OPERATIONS_API as string | undefined;
export const operationsAvailable = Boolean(apiBase);
export async function operationsRequest(path: string, options: RequestInit = {}): Promise<unknown> {
  if (!apiBase) throw new Error('Service en attente d’activation. Réessayez après son raccordement.');
  const url = new URL(apiBase, window.location.origin);
  if (url.origin !== window.location.origin) throw new Error('Le service doit utiliser une adresse du même domaine.');
  const response = await fetch(`${url.pathname.replace(/\/$/, '')}${path}`, {
    ...options, signal: options.signal ?? AbortSignal.timeout(15000), credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!response.ok) throw new Error(response.status === 429 ? 'Trop de tentatives. Réessayez dans quelques minutes.' : 'Le service est indisponible. Veuillez réessayer.');
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Réponse du service non reconnue.');
  return response.json();
}
export function isObject(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
export type TransportPhase = 'scheduled' | 'checkin' | 'transit' | 'arrived' | 'customs' | 'ready' | 'cancelled';
export interface LiveTransport {
  reference: string; date: string; phase: TransportPhase; source: string; observedAt: string;
  progress: number; altitudeM?: number; speedKmh?: number; terminal?: string;
}
export function parseLiveTransport(value: unknown, reference: string, date: string): LiveTransport {
  if (!isObject(value) || value.reference !== reference || value.date !== date ||
    !['scheduled','checkin','transit','arrived','customs','ready','cancelled'].includes(String(value.phase)) ||
    typeof value.source !== 'string' || !value.source.trim() || typeof value.observedAt !== 'string' ||
    !Number.isFinite(Date.parse(value.observedAt)) || Date.parse(value.observedAt) > Date.now() + 60000 ||
    typeof value.progress !== 'number' || !Number.isFinite(value.progress) || value.progress < 0 || value.progress > 100 ||
    ['altitudeM','speedKmh'].some(k => value[k] !== undefined && (typeof value[k] !== 'number' || !Number.isFinite(value[k]) || (value[k] as number) < 0)) ||
    (value.terminal !== undefined && typeof value.terminal !== 'string')) throw new Error('Données opérateur invalides.');
  return value as unknown as LiveTransport;
}
