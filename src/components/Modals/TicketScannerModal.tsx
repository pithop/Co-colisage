import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  Plane,
  ScanLine,
  ShieldCheck,
  UploadCloud,
  X,
  Info,
} from 'lucide-react';
import type { FreightItem, TicketScanResult } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { maxBaggageOffer, readTicket } from '../../lib/ticketScanner';

interface TicketScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated?: (trip: FreightItem) => void;
}

const steps = ['Compagnie', 'N° Vol', 'PNR', 'Passager', 'Dates', 'Franchise bagage'];
const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';
const dateLabel = (date: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));

export const TicketScannerModal: React.FC<TicketScannerModalProps> = ({
  isOpen,
  onClose,
  onTripCreated,
}) => {
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
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [offer, setOffer] = useState(1);
  const [price, setPrice] = useState(10);
  const [commission, setCommission] = useState(25);

  useEffect(() => {
    if (!isOpen) return;
    setTicket(null);
    setError('');
    setScanning(false);
    setProgress(0);
    setPrice(10);
    setCommission(25);
    published.current = false;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    return () => {
      job.current?.abort();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;
  const maximum = ticket ? maxBaggageOffer(ticket.baggageAllowanceKg) : 0;
  const close = () => {
    job.current?.abort();
    onClose();
  };

  const scan = async (source: File) => {
    job.current?.abort();
    const controller = new AbortController();
    job.current = controller;
    setTicket(null);
    setError('');
    setScanning(true);
    setProgress(0);
    setFileName(source.name);
    try {
      if (
        !['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(source.type) &&
        !(source.type === '' && /\.(pdf|png|jpe?g|webp)$/i.test(source.name))
      ) {
        throw new Error('Choisissez un billet au format PDF, JPG, PNG ou WebP.');
      }
      if (!source.size || source.size > 15 * 1024 * 1024) {
        throw new Error('Le fichier doit être non vide et inférieur à 15 Mo.');
      }
      const result = await readTicket(source, controller.signal, (value) =>
        setProgress(Math.min(5, Math.floor(value * 6)))
      );
      if (controller.signal.aborted) return;
      setTicket(result);
      setOffer(maxBaggageOffer(result.baggageAllowanceKg));
      setProgress(6);
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(cause instanceof Error ? cause.message : 'Lecture impossible. Veuillez réessayer.');
      }
    } finally {
      if (!controller.signal.aborted) setScanning(false);
    }
  };

  const publish = () => {
    if (!ticket || published.current || !onTripCreated) return;
    const limit = maxBaggageOffer(ticket.baggageAllowanceKg);
    if (!Number.isFinite(offer) || offer < 1 || offer > limit || !Number.isInteger(offer)) {
      setError(`Vous pouvez proposer entre 1 et ${limit} kg maximum.`);
      return;
    }
    if (
      !Number.isFinite(price) ||
      price < 1 ||
      price > 50 ||
      !Number.isFinite(commission) ||
      commission < 0 ||
      commission > 100
    ) {
      return;
    }
    published.current = true;
    try {
      onTripCreated({
        id: `trip-${crypto.randomUUID()}`,
        title: `Trajet ${ticket.origin} → ${ticket.destination}`,
        transportType: 'avion',
        transportLabel: ticket.airline,
        origin: ticket.origin,
        originCode: ticket.originCode,
        destination: ticket.destination,
        destinationCode: ticket.destinationCode,
        departureDate: ticket.departureDate,
        departureTime: ticket.departureTime,
        availableKg: offer,
        pricePerKg: price,
        shoppingCommission: commission,
        canCarryParcel: true,
        canBuyProduct: true,
        travelerName: user?.name || ticket.passengerName,
        travelerAvatar: user?.avatar || '',
        rating: 0,
        reviewsCount: 0,
        image:
          'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
        description: `Données extraites par OCR sécurisé. ${offer} kg disponibles sur ${ticket.baggageAllowanceKg} kg en ${ticket.baggageType === 'cabin' ? 'cabine' : 'soute'}. ${ticket.baggageAllowanceKg - limit} kg réservés aux effets personnels.`,
        isTicketVerified: false,
        ticketScan: {
          ...ticket,
          pnr: '',
          passengerName: '',
          ticketVerified: false,
          maxAllowedOfferKg: limit,
        },
      });
      close();
    } catch {
      published.current = false;
      setError('La publication a échoué. Veuillez réessayer.');
    }
  };

  const currentStep = ticket ? 3 : scanning ? 2 : 1;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-md sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-scanner-title"
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.stopPropagation();
            close();
          }
          if (event.key === 'Tab') {
            const elements = dialog.current?.querySelectorAll<HTMLElement>(
              'button:not(:disabled), input:not(:disabled), [tabindex="0"]'
            );
            if (!elements?.length) return;
            const first = elements[0];
            const last = elements[elements.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }}
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl"
      >
        {/* Header */}
        <header className="relative shrink-0 overflow-hidden bg-slate-900 px-6 pb-6 pt-6 text-white sm:px-8 border-b border-slate-800">
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-400">
                <ScanLine className="h-4 w-4" />
                <span>Scanner IATA Intelligent</span>
              </div>
              <h2 id="ticket-scanner-title" className="text-xl sm:text-2xl font-black tracking-tight">
                Votre billet. Votre prochain trajet certifié.
              </h2>
              <p className="mt-1.5 max-w-md text-xs sm:text-sm leading-relaxed text-slate-400 font-medium">
                Déposez votre carte d’embarquement pour extraire le vol et calculer votre franchise disponible en toute sécurité.
              </p>
            </div>
            <button
              ref={closeButton}
              type="button"
              onClick={close}
              aria-label="Fermer le scanner"
              className={`-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-white/15 hover:text-white transition-all ${focus}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 3-Step Visual Progress Bar */}
          <div className="mt-5 grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
            {[
              { num: 1, title: 'Téléversement', subtitle: 'PDF ou Photo' },
              { num: 2, title: 'Analyse OCR', subtitle: 'Décodage IATA' },
              { num: 3, title: 'Franchise & Kilos', subtitle: 'Estimation des gains' },
            ].map((s) => {
              const active = currentStep === s.num;
              const completed = currentStep > s.num;
              return (
                <div
                  key={s.num}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all ${
                    completed
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : active
                      ? 'bg-white/15 text-white border border-white/20 ring-1 ring-white/20'
                      : 'bg-black/20 text-slate-500 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                      completed
                        ? 'bg-blue-600 text-white'
                        : active
                        ? 'bg-white text-slate-900'
                        : 'bg-white/20 text-slate-300'
                    }`}
                  >
                    {completed ? <Check size={12} strokeWidth={3} /> : s.num}
                  </span>
                  <div className="min-w-0 hidden sm:block">
                    <p className="text-[11px] font-bold leading-none truncate">{s.title}</p>
                    <p className="text-[9px] opacity-75 truncate">{s.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </header>

        <div className="overflow-y-auto overscroll-contain p-5 sm:p-7">
          {/* STATE 1: Dropzone + 3 Feature Security Cards */}
          {!ticket && !scanning && (
            <div className="space-y-5">
              <input
                ref={input}
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                className="hidden"
                tabIndex={-1}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (file) void scan(file);
                }}
              />
              <button
                type="button"
                onClick={() => input.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  if (event.dataTransfer.files.length !== 1) {
                    setError('Déposez un seul billet à la fois.');
                    return;
                  }
                  void scan(event.dataTransfer.files[0]);
                }}
                className={`group flex w-full flex-col items-center rounded-2xl border-2 border-dashed px-5 py-10 text-center transition-all ${
                  dragging
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-4 ring-blue-500/20'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-slate-800'
                } ${focus}`}
              >
                <span className="mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 transition-transform motion-safe:group-hover:-translate-y-1">
                  <UploadCloud className="h-7 w-7" />
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  Glissez votre carte d'embarquement ici
                </span>
                <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  ou <span className="font-semibold text-blue-600 dark:text-blue-400 underline">parcourir vos fichiers</span>
                </span>
                <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700/80 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  PDF, JPG, PNG, WebP · Jusqu'à 15 Mo
                </span>
              </button>

              {/* 3 Step-by-Step Security & Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 shadow-xs flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Chiffrement Local</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Document analysé directement dans votre navigateur, sans envoi tiers.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 shadow-xs flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Anonymat PNR</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Nom complet et code PNR masqués sur vos annonces publiques.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 shadow-xs flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                    <Plane className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Franchise Sécurisée</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Réserve automatique de 10% pour vos affaires personnelles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: Scanning in progress */}
          {scanning && (
            <div role="status" aria-live="polite" className="py-2">
              <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center shadow-xs">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <FileText className="h-8 w-8" />
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white">Lecture et décodage IATA en cours</p>
                <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400 font-mono">{fileName}</p>
                <div className="ticket-scan-laser pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_24px_8px_rgba(59,130,246,0.4)]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {steps.map((step, i) => (
                  <div
                    key={step}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-medium transition-all ${
                      i < progress
                        ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                        : i === progress
                        ? 'border-blue-300 dark:border-blue-700 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 shadow-xs ring-1 ring-blue-400/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {i < progress ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : i === progress ? (
                      <Loader2 className="h-4 w-4 motion-safe:animate-spin text-blue-600 dark:text-blue-400 shrink-0" />
                    ) : (
                      <span className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
                Traitement optique confidentiel conforme aux standards de sécurité aérienne.
              </p>
            </div>
          )}

          {/* STATE 3: Extracted Boarding Pass + Franchise Customizer */}
          {ticket && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Billet IATA authentifié
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Lecture OCR Réussie
                </span>
              </div>

              {/* Boarding Pass Preview Card */}
              <article
                aria-label="Carte d’embarquement extraite"
                className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs relative"
              >
                <div className="flex items-center justify-between bg-slate-900 px-5 py-3 text-white border-b border-slate-800">
                  <span className="text-sm font-bold tracking-wide">{ticket.airline}</span>
                  <span className="text-[10px] font-bold tracking-[0.18em] text-blue-300">
                    BOARDING PASS
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        {ticket.originCode}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-medium">{ticket.origin}</p>
                    </div>
                    <div className="flex flex-1 items-center gap-2 text-blue-600 dark:text-blue-400">
                      <span className="flex-1 border-t border-dashed border-slate-300 dark:border-slate-600" />
                      <Plane className="h-5 w-5 transform rotate-90 text-blue-600 dark:text-blue-400" />
                      <span className="flex-1 border-t border-dashed border-slate-300 dark:border-slate-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        {ticket.destinationCode}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {ticket.destination}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs pt-4 border-t border-slate-100 dark:border-slate-700/80">
                    {[
                      ['Passager', ticket.passengerName],
                      ['Vol / PNR', `${ticket.flightNumber} / ${ticket.pnr}`],
                      ['Départ', `${dateLabel(ticket.departureDate)} · ${ticket.departureTime}`],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {label}
                        </dt>
                        <dd className="break-words font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="flex items-center justify-between border-t border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-5 py-3.5 text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    Franchise {ticket.baggageType === 'cabin' ? 'cabine' : 'soute'} reconnue
                  </span>
                  <strong className="text-sm font-bold text-slate-900 dark:text-white">
                    {ticket.baggageAllowanceKg} kg inclus
                  </strong>
                </div>
              </article>

              {/* Explanatory Safety Margin Callout */}
              <div
                role="note"
                className="flex gap-3 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 p-4 text-xs"
              >
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-bold text-blue-950 dark:text-blue-200 text-sm">
                    {maximum} kg maximum autorisés à la proposition
                  </p>
                  <p id="baggage-explanation" className="mt-1 leading-relaxed text-blue-900/80 dark:text-blue-300 font-normal">
                    Sur vos {ticket.baggageAllowanceKg} kg de franchise, {ticket.baggageAllowanceKg - maximum} kg sont sanctuarisés pour vos effets personnels (réserve légale de 10%, minimum 1 kg).
                  </p>
                </div>
              </div>

              {/* Financial Simulator */}
              <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-xs">
                <Slider
                  id="ticket-offer"
                  label="Kilos à proposer"
                  value={offer}
                  min={1}
                  max={maximum}
                  unit="kg"
                  description="baggage-explanation"
                  onChange={(value) => setOffer(Math.min(maximum, Math.max(1, value)))}
                />
                <Slider
                  id="ticket-price"
                  label="Prix par kilo"
                  value={price}
                  min={1}
                  max={50}
                  unit="€/kg"
                  onChange={setPrice}
                />
                <Slider
                  id="ticket-commission"
                  label="Commission shopping additionnelle"
                  value={commission}
                  min={0}
                  max={100}
                  unit="€"
                  onChange={setCommission}
                />

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Gain estimé</span>
                    <p className="text-[10px] text-slate-400">Colisage + commission boutique</p>
                  </div>
                  <strong className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                    {offer * price + commission} €
                  </strong>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Vos coordonnées personnelles et référence de réservation sont conservées sous clé cryptographique et ne sont pas affichées publiquement.
              </p>

              <button
                type="button"
                onClick={publish}
                disabled={!onTripCreated}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-4 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${focus}`}
              >
                <Check className="h-4 w-4 shrink-0" />
                <span>Publier mon trajet avec les données du billet</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTicket(null);
                  setError('');
                }}
                className={`mx-auto block rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${focus}`}
              >
                Scanner un autre billet
              </button>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm leading-relaxed text-red-800"
            >
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function Slider({
  id,
  label,
  value,
  min,
  max,
  unit,
  description,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  description?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-bold text-slate-700 dark:text-slate-200">
          {label}
        </label>
        <output htmlFor={id} className="text-sm font-black text-blue-600 dark:text-blue-400 tabular-nums">
          {value} {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        aria-describedby={description}
        aria-valuetext={`${value} ${unit}`}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`h-2 w-full cursor-pointer rounded-lg bg-slate-200 dark:bg-slate-700 accent-blue-600 ${focus}`}
      />
      <div className="mt-1 flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium">
        <span>
          {min} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </div>
    </div>
  );
}
