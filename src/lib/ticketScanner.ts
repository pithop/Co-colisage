import type { TicketScanResult } from '../types';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

/** Reserve at least 10%, rounded up, for the traveler's belongings. */
export const maxBaggageOffer = (allowance: number) =>
  Number.isFinite(allowance) && allowance > 1 ? Math.max(0, Math.floor(allowance - Math.max(1, Math.ceil(allowance * 0.1)))) : 0;

const airports: Record<string, string> = { MRS: 'Marseille', ORY: 'Paris Orly', CDG: 'Paris Charles de Gaulle', ALG: 'Alger', BCN: 'Barcelone' };
export const demoTickets: TicketScanResult[] = [
  { airline: 'Air Algérie', flightNumber: 'AH1021', originCode: 'MRS', destinationCode: 'ALG', departureDate: '2026-09-28', departureTime: '08:30', baggageAllowanceKg: 10, baggageType: 'cabin' },
  { airline: 'Transavia', flightNumber: 'TO7260', originCode: 'ORY', destinationCode: 'ALG', departureDate: '2026-09-29', departureTime: '10:15', baggageAllowanceKg: 20, baggageType: 'hold' },
  { airline: 'Air France', flightNumber: 'AF1854', originCode: 'CDG', destinationCode: 'ALG', departureDate: '2026-09-30', departureTime: '14:20', baggageAllowanceKg: 23, baggageType: 'hold' },
  { airline: 'Vueling', flightNumber: 'VY1509', originCode: 'MRS', destinationCode: 'BCN', departureDate: '2026-10-01', departureTime: '17:45', baggageAllowanceKg: 10, baggageType: 'cabin' },
].map((ticket, index) => ({ ...ticket, baggageType: ticket.baggageType as 'cabin' | 'hold', origin: airports[ticket.originCode], destination: airports[ticket.destinationCode], pnr: `DEMO0${index + 1}`, passengerName: 'Camille Martin', maxAllowedOfferKg: maxBaggageOffer(ticket.baggageAllowanceKg), ticketVerified: true }));

export function parseTicketText(raw: string): TicketScanResult {
  const text = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  const airline = [/AIR ALGERIE/, /TRANSAVIA/, /AIR FRANCE/, /VUELING/].findIndex(pattern => pattern.test(text));
  const route = [...text.matchAll(/\b(MRS|ORY|CDG|ALG|BCN)\b/g)].map(match => match[1]).filter((code, i, codes) => codes.indexOf(code) === i);
  const flight = text.match(/\b(AH|TO|AF|VY)\s?(\d{3,4})\b/);
  const pnr = text.match(/(?:PNR|BOOKING REFERENCE|RESERVATION|DOSSIER)\s*[:#-]?\s*([A-Z0-9]{6})\b/);
  const passenger = text.match(/(?:PASSENGER(?: NAME)?|PASSAGER|NOM)\s*[:#-]?\s*([A-Z][A-Z /'-]{2,60})(?:\n|$)/);
  const date = text.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/) || (() => {
    const d = text.match(/\b(\d{2})[/.](\d{2})[/.](20\d{2})\b/);
    return d ? [d[0], d[3], d[2], d[1]] : null;
  })();
  const time = text.match(/\b([01]\d|2[0-3]):([0-5]\d)\b/);
  // Ambiguous allowances (multiple bags/legs) must never silently produce a certified offer.
  const allowances = [...text.matchAll(/(?:BAGGAGE|BAGAGE|FRANCHISE|CABIN|CABINE|HOLD|SOUTE)[^\n\d]{0,35}(\d{1,2})\s*KG\b/g)];
  const cabin = /\b(CABIN|CABINE)\b/.test(text);
  const hold = /\b(HOLD|SOUTE|CHECKED)\b/.test(text);
  if (airline < 0 || route.length !== 2 || !flight || !pnr || !passenger || !date || !time || allowances.length !== 1 || cabin === hold) {
    throw new Error('Lecture incomplète ou ambiguë. Utilisez un billet à trajet unique indiquant les aéroports, la date numérique, le passager, le PNR et une franchise en kg (cabine ou soute), ou essayez une démo.');
  }
  const departureDate = `${date[1]}-${date[2]}-${date[3]}`;
  const parsedDate = new Date(`${departureDate}T12:00:00Z`);
  const baggageAllowanceKg = Number(allowances[0][1]);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== departureDate || baggageAllowanceKg > 40 || !maxBaggageOffer(baggageAllowanceKg)) throw new Error('Date ou franchise bagage invalide. Veuillez utiliser un autre document.');
  return { airline: demoTickets[airline].airline, flightNumber: `${flight[1]}${flight[2]}`, pnr: pnr[1], passengerName: passenger[1].trim(), originCode: route[0], origin: airports[route[0]], destinationCode: route[1], destination: airports[route[1]], departureDate, departureTime: time[0], baggageAllowanceKg, baggageType: cabin ? 'cabin' : 'hold', maxAllowedOfferKg: maxBaggageOffer(baggageAllowanceKg), ticketVerified: false };
}

export async function readTicket(file: File, signal: AbortSignal, progress: (value: number) => void): Promise<TicketScanResult> {
  const check = () => { if (signal.aborted) throw new DOMException('Lecture annulée', 'AbortError'); };
  const ocr = async (source: File | HTMLCanvasElement) => {
    const { createWorker } = await import('tesseract.js');
    check();
    const worker = await createWorker('fra+eng', 1, { logger: event => { if (!signal.aborted && event.status === 'recognizing text') progress(event.progress); } });
    const cancel = () => { void worker.terminate(); };
    signal.addEventListener('abort', cancel, { once: true });
    try { check(); return (await worker.recognize(source)).data.text; }
    finally { signal.removeEventListener('abort', cancel); await worker.terminate(); }
  };
  check();
  let text = '';
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
    check();
    const task = pdfjs.getDocument({ data: await file.arrayBuffer() });
    const cancel = () => { void task.destroy(); };
    signal.addEventListener('abort', cancel, { once: true });
    try {
      const pdf = await task.promise;
      if (pdf.numPages > 5) throw new Error('Limitez le document à 5 pages pour scanner votre billet.');
      for (let n = 1; n <= pdf.numPages; n++) {
        check();
        const page = await pdf.getPage(n);
        const content = await page.getTextContent();
        let pageText = content.items.map(item => 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join('');
        if (pageText.trim().length < 60) {
          const initialViewport = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: Math.min(2, 2400 / Math.max(initialViewport.width, initialViewport.height)) });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width; canvas.height = viewport.height;
          await page.render({ canvas, canvasContext: canvas.getContext('2d')!, viewport }).promise;
          pageText = await ocr(canvas);
          canvas.width = 0; canvas.height = 0;
        }
        text += pageText + '\n';
        progress(n / pdf.numPages);
      }
    } finally { signal.removeEventListener('abort', cancel); await task.destroy(); }
  } else { text = await ocr(file); }
  check();
  return parseTicketText(text);
}
