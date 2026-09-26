import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, CheckCircle2, FileText, Loader2, Plane, ScanLine, ShieldCheck, Sparkles, UploadCloud, X } from 'lucide-react';
import type { FreightItem, TicketScanResult } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { demoTickets, maxBaggageOffer, readTicket } from '../../lib/ticketScanner';

interface TicketScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated?: (trip: FreightItem) => void;
}
const steps = ['Compagnie', 'N° Vol', 'PNR', 'Passager', 'Dates', 'Franchise bagage'];
const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4';
const dateLabel = (date: string) => new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));

export const TicketScannerModal: React.FC<TicketScannerModalProps> = ({ isOpen, onClose, onTripCreated }) => {
  const { user } = useAuth();
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const job = useRef<AbortController | null>(null);
  const published = useRef(false);
  const [ticket, setTicket] = useState<TicketScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [offer, setOffer] = useState(1);
  const [price, setPrice] = useState(10);
  const [commission, setCommission] = useState(25);

  useEffect(() => {
    if (!isOpen) return;
    setTicket(null); setError(''); setScanning(false); setProgress(0); setPrice(10); setCommission(25); published.current = false;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    return () => { job.current?.abort(); document.body.style.overflow = overflow; previous?.focus(); };
  }, [isOpen]);

  if (!isOpen) return null;
  const maximum = ticket ? maxBaggageOffer(ticket.baggageAllowanceKg) : 0;
  const close = () => { job.current?.abort(); onClose(); };
  const scan = async (source: File | TicketScanResult) => {
    job.current?.abort();
    const controller = new AbortController(); job.current = controller;
    const demo = !(source instanceof File);
    setIsDemo(demo); setTicket(null); setError(''); setScanning(true); setProgress(0);
    setFileName(demo ? `${source.airline} · billet de démonstration` : source.name);
    try {
      let result: TicketScanResult;
      if (source instanceof File) {
        if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(source.type) && !(source.type === '' && /\.(pdf|png|jpe?g|webp)$/i.test(source.name))) throw new Error('Choisissez un PDF, JPG, PNG ou WebP.');
        if (!source.size || source.size > 15 * 1024 * 1024) throw new Error('Le fichier doit être non vide et inférieur à 15 Mo.');
        result = await readTicket(source, controller.signal, value => setProgress(Math.min(5, Math.floor(value * 6))));
      } else {
        for (let step = 0; step < steps.length; step++) {
          await new Promise<void>(resolve => {
            const done = () => { clearTimeout(timer); controller.signal.removeEventListener('abort', done); resolve(); };
            const timer = window.setTimeout(done, 420);
            controller.signal.addEventListener('abort', done, { once: true });
          });
          if (controller.signal.aborted) return;
          setProgress(step + 1);
        }
        result = { ...source };
      }
      if (controller.signal.aborted) return;
      setTicket(result); setOffer(maxBaggageOffer(result.baggageAllowanceKg)); setProgress(6);
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'Lecture impossible. Veuillez réessayer.');
    } finally { if (!controller.signal.aborted) setScanning(false); }
  };

  const publish = () => {
    if (!ticket || published.current || !onTripCreated) return;
    const limit = maxBaggageOffer(ticket.baggageAllowanceKg);
    if (!Number.isFinite(offer) || offer < 1 || offer > limit || !Number.isInteger(offer)) { setError(`Vous pouvez proposer entre 1 et ${limit} kg maximum.`); return; }
    if (!Number.isFinite(price) || price < 1 || price > 50 || !Number.isFinite(commission) || commission < 0 || commission > 100) return;
    published.current = true;
    try {
      onTripCreated({
        id: `trip-${crypto.randomUUID()}`, title: `${isDemo ? '[Démo] ' : ''}Trajet ${ticket.origin} ➔ ${ticket.destination}`,
        transportType: 'avion', transportLabel: ticket.airline, origin: ticket.origin, originCode: ticket.originCode,
        destination: ticket.destination, destinationCode: ticket.destinationCode, departureDate: ticket.departureDate, departureTime: ticket.departureTime,
        availableKg: offer, pricePerKg: price, shoppingCommission: commission, canCarryParcel: true, canBuyProduct: true,
        travelerName: user?.name || ticket.passengerName, travelerAvatar: user?.avatar || '', rating: 0, reviewsCount: 0,
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
        description: `${isDemo ? 'Démonstration — billet fictif. ' : 'Données extraites par OCR, billet non authentifié. '}${offer} kg disponibles sur ${ticket.baggageAllowanceKg} kg en ${ticket.baggageType === 'cabin' ? 'cabine' : 'soute'}. ${ticket.baggageAllowanceKg - limit} kg réservés aux effets personnels.`,
        // Demo verification is visual only; it must not certify a real marketplace listing.
        isTicketVerified: false, ticketScan: { ...ticket, pnr: '', passengerName: '', ticketVerified: false, maxAllowedOfferKg: limit },
      });
      close();
    } catch { published.current = false; setError('La publication a échoué. Veuillez réessayer.'); }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-md sm:p-6" onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="ticket-scanner-title" onKeyDown={event => {
        if (event.key === 'Escape') { event.stopPropagation(); close(); }
        if (event.key === 'Tab') {
          const elements = dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), [tabindex="0"]');
          if (!elements?.length) return;
          const first = elements[0], last = elements[elements.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      }} className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-white/30 bg-slate-50 text-slate-900 shadow-[0_32px_100px_-24px_rgba(0,0,0,0.6)]">
        <header className="relative shrink-0 overflow-hidden bg-[#0A1128] px-6 pb-7 pt-6 text-white sm:px-8">
          <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200"><ScanLine className="h-4 w-4" /> Ticket intelligence <span className="rounded-full border border-white/20 px-2 py-0.5 tracking-widest">Bêta</span></div>
              <h2 id="ticket-scanner-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">Votre billet. Votre prochain trajet.</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300">Un scan pour renseigner votre vol et calculer les kilos que vous pouvez partager.</p>
            </div>
            <button ref={closeButton} type="button" onClick={close} aria-label="Fermer le scanner" className={`-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-300 hover:bg-white/10 hover:text-white ${focus}`}><X className="h-5 w-5" /></button>
          </div>
        </header>

        <div className="overflow-y-auto overscroll-contain p-5 sm:p-8">
          {!ticket && !scanning && <>
            <input ref={input} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="hidden" tabIndex={-1} onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void scan(file); }} />
            <button type="button" onClick={() => input.current?.click()} onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); if (event.dataTransfer.files.length !== 1) { setError('Déposez un seul billet à la fois.'); return; } void scan(event.dataTransfer.files[0]); }} className={`group flex w-full flex-col items-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-colors ${dragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/40'} ${focus}`}>
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-transform motion-safe:group-hover:-translate-y-1"><UploadCloud className="h-7 w-7" /></span>
              <span className="text-base font-semibold">Glissez votre billet ici</span><span className="mt-1 text-sm text-slate-500">ou <span className="font-medium text-blue-600">parcourir mes fichiers</span></span>
              <span className="mt-4 text-[11px] text-slate-500">PDF, JPG, PNG, WebP · 15 Mo maximum</span>
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500"><ShieldCheck className="h-3.5 w-3.5 shrink-0" /> Document traité dans votre navigateur, jamais envoyé au serveur.</p>
            <div className="mb-3 mt-7 flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">Essayez avec un billet démo</h3><span className="text-[10px] uppercase tracking-widest text-slate-500">Méditerranée</span></div>
            <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">{demoTickets.map((demo, index) => <button key={demo.airline} type="button" onClick={() => void scan(demo)} className={`group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-200 hover:border-blue-300 hover:shadow-md motion-safe:hover:-translate-y-0.5 ${focus}`}>
              <div className="flex items-center gap-2"><span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${['bg-red-50 text-red-700', 'bg-emerald-50 text-emerald-700', 'bg-blue-50 text-blue-800', 'bg-yellow-50 text-yellow-800'][index]}`}>{demo.flightNumber.slice(0, 2)}</span><span className="text-sm font-semibold">{demo.airline}</span><ArrowRight className="ml-auto h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600" /></div>
              <div className="mt-4 flex items-center gap-2 text-lg font-semibold tracking-tight">{demo.originCode}<span className="text-slate-400">➔</span>{demo.destinationCode}</div>
              <div className="mt-1 text-xs text-slate-500">{dateLabel(demo.departureDate)}</div>
              <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-600">{demo.baggageAllowanceKg} kg {demo.baggageType === 'cabin' ? 'cabine' : 'soute'} <span className="float-right font-semibold text-blue-700">Offre ≤ {demo.maxAllowedOfferKg} kg</span></div>
            </button>)}</div>
          </>}

          {scanning && <div role="status" aria-live="polite" className="py-2">
            <div className="relative mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><FileText className="h-8 w-8" /></div>
              <p className="text-base font-semibold">{isDemo ? 'Simulation du scan IA' : 'Lecture de votre billet'}</p><p className="mt-2 truncate text-xs text-slate-500">{fileName}</p>
              <div className="ticket-scan-laser pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-blue-400 shadow-[0_0_24px_8px_rgba(59,130,246,0.3)]" />
            </div>
            <div className="grid grid-cols-2 gap-3">{steps.map((step, i) => <div key={step} className={`flex items-center gap-2 rounded-xl border p-3 text-xs ${i < progress ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500'}`}>{i < progress ? <CheckCircle2 className="h-4 w-4" /> : i === progress ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" /> : <span className="h-4 w-4 rounded-full border border-slate-300" />}{step}</div>)}</div>
            <p className="mt-5 text-center text-xs text-slate-500">{isDemo ? 'Données fictives · aperçu du parcours certifié' : 'Premier scan : chargement du moteur OCR. Une connexion est nécessaire.'}</p>
          </div>}

          {ticket && <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-semibold text-emerald-800"><ShieldCheck className="h-4 w-4" />{isDemo ? "Billet d'avion authentifié" : 'Lecture OCR terminée'}</span><span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{isDemo ? 'Démo · billet fictif' : 'Authenticité non vérifiée'}</span></div>
            <article aria-label="Carte d’embarquement extraite" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between bg-slate-900 px-5 py-3 text-white"><span className="text-sm font-semibold">{ticket.airline}</span><span className="text-[10px] tracking-[0.15em] text-slate-300">BOARDING PASS</span></div>
              <div className="p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-3xl font-semibold tracking-tight">{ticket.originCode}</p><p className="mt-1 text-xs text-slate-500">{ticket.origin}</p></div><div className="flex flex-1 items-center gap-2 text-blue-500"><span className="flex-1 border-t border-dashed border-slate-300" /><Plane className="h-5 w-5" /><span className="flex-1 border-t border-dashed border-slate-300" /></div><div className="text-right"><p className="text-3xl font-semibold tracking-tight">{ticket.destinationCode}</p><p className="mt-1 text-xs text-slate-500">{ticket.destination}</p></div></div>
                <dl className="mt-6 grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">{[['Passager', ticket.passengerName], ['Vol / PNR', `${ticket.flightNumber} / ${ticket.pnr}`], ['Départ', `${dateLabel(ticket.departureDate)} · ${ticket.departureTime}`]].map(([label, value]) => <div key={label}><dt className="mb-1 text-[10px] uppercase tracking-wider text-slate-500">{label}</dt><dd className="break-words font-semibold">{value}</dd></div>)}</dl>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-slate-300 bg-slate-50 px-5 py-4 text-xs"><span className="text-slate-600">Franchise {ticket.baggageType === 'cabin' ? 'cabine' : 'soute'}</span><strong>{ticket.baggageAllowanceKg} kg inclus</strong></div>
            </article>
            <div role="note" className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" /><div><p className="text-sm font-semibold text-blue-950">{maximum} kg maximum à proposer</p><p id="baggage-explanation" className="mt-1 text-xs leading-relaxed text-blue-800">Sur vos {ticket.baggageAllowanceKg} kg, {ticket.baggageAllowanceKg - maximum} kg sont réservés à vos effets personnels. Nous réservons 10 % de la franchise, arrondis au kilo supérieur, avec un minimum de 1 kg. Ce plafond ne peut pas être dépassé.</p></div></div>
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
              <Slider id="ticket-offer" label="Kilos à partager" value={offer} min={1} max={maximum} unit="kg" description="baggage-explanation" onChange={value => setOffer(Math.min(maximum, Math.max(1, value)))} />
              <Slider id="ticket-price" label="Prix par kilo" value={price} min={1} max={50} unit="€/kg" onChange={setPrice} />
              <Slider id="ticket-commission" label="Commission shopping" value={commission} min={0} max={100} unit="€" onChange={setCommission} />
              <div className="flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-xs text-slate-500">Gain potentiel · colis + un achat</span><strong className="text-xl tracking-tight text-emerald-700">{offer * price + commission} €</strong></div>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">{isDemo ? 'Ce billet est fictif. La publication portera la mention Démo et ne sera pas certifiée dans les annonces.' : 'Vérifiez les informations extraites. La lecture OCR ne prouve pas l’authenticité du billet ; cette publication ne sera pas certifiée.'} Le PNR et le nom extrait ne sont pas joints aux données du billet publié.</p>
            <button type="button" onClick={publish} disabled={!onTripCreated} className={`flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${focus}`}><Check className="h-4 w-4 shrink-0" />{isDemo ? "Publier mon trajet certifié par Billet d'avion" : 'Publier mon trajet avec les données du billet'}</button>
            <button type="button" onClick={() => { setTicket(null); setError(''); }} className={`mx-auto block rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:text-blue-600 ${focus}`}>Scanner un autre billet</button>
          </div>}
          {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800">{error}</div>}
        </div>
      </div>
    </div>
  );
};

function Slider({ id, label, value, min, max, unit, description, onChange }: { id: string; label: string; value: number; min: number; max: number; unit: string; description?: string; onChange: (value: number) => void }) {
  return <div><div className="mb-3 flex items-center justify-between gap-2"><label htmlFor={id} className="text-xs font-medium text-slate-600">{label}</label><output htmlFor={id} className="text-sm font-semibold tabular-nums">{value} {unit}</output></div><input id={id} type="range" min={min} max={max} step={1} value={value} aria-describedby={description} aria-valuetext={`${value} ${unit}`} onChange={event => onChange(Number(event.target.value))} className={`h-5 w-full cursor-pointer accent-blue-600 ${focus}`} /><div className="mt-1 flex justify-between text-[10px] text-slate-400"><span>{min} {unit}</span><span>{max} {unit}</span></div></div>;
}
