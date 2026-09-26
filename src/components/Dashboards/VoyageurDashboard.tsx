import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  X,
  Plane,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  ScanLine,
  LockKeyhole,
  Star,
  Check,
  CheckCircle2,
  Camera,
  KeyRound,
  FileText,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useModalFocus } from "../../hooks/useModalFocus";
import type { FreightItem } from "../../types";

interface VoyageurDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUploadProof: () => void;
  onOpenPinModal: () => void;
  onOpenInspection: () => void;
  onOpenPublish: () => void;
  tickets?: FreightItem[];
}
const money = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    value,
  );

export const VoyageurDashboard: React.FC<VoyageurDashboardProps> = ({
  isOpen,
  onClose,
  onOpenUploadProof,
  onOpenPinModal,
  onOpenInspection,
  onOpenPublish,
  tickets = [],
}) => {
  const { user } = useAuth();
  const [paid, setPaid] = useState<Record<string, number>>({});
  const dialog = useModalFocus(isOpen && !!user, onClose);
  if (!isOpen || !user) return null;
  const payout = paid[user.id];
  const available = payout === undefined ? user.stripeBalance : 0;
  const verified = user.kycStatus === "verified";
  const scanned = tickets.filter(
    (t) => t.ticketScan && t.travelerName === user.name,
  );
  const boardingPasses = scanned.length
    ? scanned.map((t) => ({
        id: t.id,
        airline: t.ticketScan!.airline,
        flight: t.ticketScan!.flightNumber,
        origin: t.originCode,
        destination: t.destinationCode,
        allowance: t.ticketScan!.baggageAllowanceKg,
        offer: t.availableKg,
        date: t.departureDate,
        demo: t.title.startsWith("[Démo]"),
      }))
    : [
        {
          id: "demo",
          airline: "Air Algérie",
          flight: "AH1021",
          origin: "MRS",
          destination: "ALG",
          allowance: 10,
          offer: 9,
          date: "2026-10-02",
          demo: true,
        },
      ];
  const handlePayout = () => {
    if (available <= 0 || !verified) return;
    setPaid((old) => ({ ...old, [user.id]: available }));
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      void confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.65 },
        colors: ["#2563eb", "#93c5fd", "#ffffff", "#10b981"],
        zIndex: 100,
        disableForReducedMotion: true,
      });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/65 backdrop-blur-md sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        className="luxury-surface flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-hidden bg-[#f6f7fa] text-slate-900 shadow-2xl sm:max-h-[92dvh] sm:rounded-[32px] sm:border sm:border-white/40"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200/70 bg-white/80 px-5 py-4 sm:px-8">
          <span className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Plane size={15} />
            </span>{" "}
            BagVoyage{" "}
            <span className="ml-1 text-[9px] font-medium uppercase tracking-[.2em] text-slate-400">
              Travel club
            </span>
          </span>
          <button
            onClick={onClose}
            aria-label="Fermer le profil"
            className="luxury-icon"
          >
            <X size={20} />
          </button>
        </header>
        <div className="overflow-y-auto overscroll-contain px-5 pb-8 pt-6 sm:px-8 sm:pt-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover ring-4 ring-white"
                />
                {verified && (
                  <span className="absolute -bottom-1 -right-1 rounded-full bg-blue-600 p-1 text-white ring-2 ring-white">
                    <Check size={12} />
                  </span>
                )}
              </div>
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.2em] text-slate-500">
                  Votre espace voyageur
                </p>
                <h2
                  id="profile-title"
                  className="text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  {user.name}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Chaque voyage vous emmène plus loin.
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-500">
              <Sparkles size={12} /> Compte de démonstration
            </span>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr]">
            <section
              aria-label="Portefeuille Stripe Connect"
              className="relative overflow-hidden rounded-[26px] bg-[#0A1128] p-6 text-white shadow-xl shadow-slate-900/10 sm:p-7"
            >
              <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-[.2em] text-slate-300">
                    Votre portefeuille
                  </span>
                  <span className="text-xs font-semibold tracking-tight text-blue-200">
                    stripe{" "}
                    <span className="font-normal text-slate-400">Connect</span>
                  </span>
                </div>
                <p className="mt-7 text-xs text-slate-400">Disponible</p>
                <p className="mt-1 text-4xl font-medium tracking-tight sm:text-5xl">
                  {money(available)}
                </p>
                <div className="mb-6 mt-5 flex items-center gap-2 text-xs text-slate-300">
                  <LockKeyhole size={14} className="text-blue-300" /> Séquestre
                  en cours{" "}
                  <strong className="ml-auto font-medium text-white">
                    {money(user.pendingEscrow)}
                  </strong>
                </div>
                <button
                  disabled={available <= 0 || !verified}
                  onClick={handlePayout}
                  className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-semibold text-slate-900 transition hover:bg-blue-50 active:scale-[.99] disabled:cursor-default disabled:bg-white/10 disabled:text-slate-300"
                >
                  {payout !== undefined ? (
                    <>
                      <CheckCircle2 size={16} /> Virement simulé avec succès
                    </>
                  ) : (
                    <>
                      <ArrowUpRight size={16} /> Virement instantané{" "}
                      <span className="ml-auto text-slate-500">•• 4291</span>
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-[10px] text-slate-400">
                  {!verified
                    ? "Vérification d’identité requise pour les virements."
                    : "Mode démo · aucun mouvement de fonds réel"}
                </p>
              </div>
            </section>
            <section className="flex flex-col rounded-[26px] border border-slate-200/80 bg-white p-6 sm:p-7">
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <ShieldCheck size={25} strokeWidth={1.5} />
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${verified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                >
                  {verified
                    ? "Identité vérifiée"
                    : user.kycStatus === "pending"
                      ? "En cours"
                      : "À vérifier"}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                La confiance vous accompagne.
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Votre identité et vos livraisons réunies dans un profil de
                confiance.
              </p>
              <div className="mt-5 space-y-3">
                {["Pièce d’identité", "Vérification du visage"].map((label) => (
                  <div
                    key={label}
                    className="flex items-center justify-between text-xs text-slate-600"
                  >
                    <span>{label}</span>
                    {verified ? (
                      <CheckCircle2 size={15} className="text-emerald-600" />
                    ) : (
                      <span className="text-slate-400">En attente</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4 text-[10px] text-slate-400">
                <ShieldCheck size={13} /> Stripe Identity · KYC de démonstration
              </div>
            </section>
          </div>
          {payout !== undefined && (
            <div
              role="status"
              className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800"
            >
              <span className="text-xl">✦</span>
              <div>
                <strong className="font-semibold">
                  Bien arrivé, même votre argent.
                </strong>
                <p className="mt-1 text-xs">
                  Virement de {money(payout)} simulé vers votre compte •• 4291.
                </p>
              </div>
            </div>
          )}
          <div className="mb-4 mt-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold tracking-tight">
                Mes Billets d’Avion Enregistrés
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Votre prochain départ, déjà dans votre poche.
              </p>
            </div>
            <button
              onClick={onOpenPublish}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-blue-700 transition hover:border-blue-300"
            >
              <ScanLine size={15} /> Scanner un billet
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {boardingPasses.map((ticket) => (
              <article
                key={ticket.id}
                className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between bg-slate-900 px-5 py-3.5 text-white">
                  <span className="flex items-center gap-2 text-xs font-semibold">
                    <Plane size={16} className="text-slate-300" />
                    {ticket.airline}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-slate-300">
                    {ticket.demo ? "Billet démo" : "Scan OCR"}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-semibold tracking-tight">
                        {ticket.origin}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">Départ</p>
                    </div>
                    <div className="mx-5 flex flex-1 items-center gap-2 text-slate-300">
                      <span className="flex-1 border-t border-dashed" />
                      <Plane size={18} className="text-blue-500" />
                      <span className="flex-1 border-t border-dashed" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-semibold tracking-tight">
                        {ticket.destination}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">Arrivée</p>
                    </div>
                  </div>
                  <div className="mt-5 flex justify-between text-xs">
                    <span className="font-medium">{ticket.flight}</span>
                    <span className="text-slate-500">
                      {new Intl.DateTimeFormat("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        timeZone: "UTC",
                      }).format(new Date(`${ticket.date}T12:00:00Z`))}
                    </span>
                  </div>
                </div>
                <div className="relative flex items-center justify-between border-t border-dashed border-slate-200 bg-slate-50 px-5 py-4">
                  <span className="text-[11px] text-slate-500">
                    Franchise{" "}
                    <strong className="text-slate-700">
                      {ticket.allowance} kg
                    </strong>
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold text-blue-800">
                    {ticket.offer} kg offerts
                  </span>
                </div>
              </article>
            ))}
          </div>
          <section className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">Votre mission en cours</h3>
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700">
                Shopping · démo
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <FileText size={22} className="text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-medium">2 Parfums Dior Sauvage</p>
                <p className="mt-1 text-xs text-slate-500">
                  Amel Kaci · Duty Free MRS → Alger
                </p>
              </div>
              <span className="ml-auto text-sm font-semibold text-emerald-700">
                +25 €
              </span>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {[
                {
                  label: "Preuve d’achat",
                  icon: FileText,
                  action: onOpenUploadProof,
                },
                {
                  label: "Inspection du colis",
                  icon: Camera,
                  action: onOpenInspection,
                },
                {
                  label: "Valider le PIN",
                  icon: KeyRound,
                  action: onOpenPinModal,
                },
              ].map(({ label, icon: Icon, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-xs font-medium transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </section>
          <section className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                Une réputation qui voyage
              </h3>
              <span className="text-[10px] text-slate-400">
                Avis de démonstration
              </span>
            </div>
            <div className="mt-5 grid gap-6 sm:grid-cols-[.8fr_1.2fr]">
              <div>
                <div className="flex items-baseline gap-1">
                  <strong className="text-5xl font-medium tracking-tight">
                    4,98
                  </strong>
                  <span className="text-sm text-slate-400">/ 5</span>
                </div>
                <div
                  className="mt-3 flex gap-1 text-amber-500"
                  aria-label="5 étoiles"
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  42 avis · la confiance, à chaque livraison
                </p>
              </div>
              <div className="space-y-4">
                {[
                  ["Communication", "5,0", 100],
                  ["Soin des colis", "5,0", 100],
                  ["Ponctualité", "4,9", 98],
                ].map(([label, value, percent]) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <blockquote className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-sm leading-relaxed text-slate-600">
                « Tout était parfait, du premier message à la remise du colis.
                Une personne attentionnée et ponctuelle. »
              </p>
              <footer className="mt-3 text-xs font-medium text-slate-400">
                Nadia H. <span className="mx-1">·</span> Marseille → Alger
              </footer>
            </blockquote>
          </section>
        </div>
      </div>
    </div>
  );
};
