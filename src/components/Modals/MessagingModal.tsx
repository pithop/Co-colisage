import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  CheckCheck,
  ChevronRight,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Plane,
  ShieldCheck,
  X,
} from "lucide-react";
import { useModalFocus } from "../../hooks/useModalFocus";

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayCommission: () => void;
  onUnreadCountChange?: (count: number) => void;
}
type Message = {
  id: string;
  mine: boolean;
  text: string;
  time: string;
  kind?: "pin" | "location" | "photo";
  image?: string;
  read?: boolean;
};
const threads = [
  {
    id: "nadia",
    name: "Nadia Hamidi",
    initials: "NH",
    color: "bg-rose-100 text-rose-700",
    subject: "Colis Marseille ➔ Alger",
    detail: "4,5 kg · 45 €",
    amount: "45 €",
    status: "Réservation confirmée",
    preview: "Le colis est prêt, merci encore !",
    reply:
      "Parfait, merci ! Le colis est prêt. On se retrouve au hall des arrivées à Alger. Je vous confirme dès mon arrivée.",
    messages: [
      "Bonjour ! Mon colis de 4,5 kg est prêt pour Marseille → Alger. Tout est soigneusement emballé.",
      "Parfait Nadia, je vous confirme la prise en charge pour 45 €. À très vite !",
      "Le colis est prêt, merci encore !",
    ],
  },
  {
    id: "amel",
    name: "Amel Kaci",
    initials: "AK",
    color: "bg-violet-100 text-violet-700",
    subject: "2 Parfums Dior Sauvage",
    detail: "150 € · séquestre Stripe",
    amount: "150 €",
    status: "Achat en cours",
    preview: "Pouvez-vous garder le ticket de caisse ?",
    reply:
      "Merci beaucoup ! Je confirme les deux Dior Sauvage. Pensez à garder le ticket de caisse, on vérifiera ensemble à la remise. ✨",
    messages: [
      "Bonjour ! Je souhaite commander 2 parfums Dior Sauvage au Duty Free de Marseille.",
      "Bien reçu Amel. Les 150 € sont sous séquestre, je vous envoie une photo avant le départ.",
      "Pouvez-vous garder le ticket de caisse ?",
    ],
  },
  {
    id: "karim",
    name: "Karim Bouzid",
    initials: "KB",
    color: "bg-sky-100 text-sky-700",
    subject: "Vol Air Algérie AH1021",
    detail: "MRS → ALG · 9 kg dispos",
    amount: "0 €",
    status: "À réserver",
    preview: "Il me reste 9 kg sur mon vol.",
    reply:
      "Oui, il me reste 9 kg sur le vol AH1021. Dites-moi le poids et le contenu du colis pour que nous confirmions la réservation ici.",
    messages: [
      "Bonjour, je voyage sur le vol Air Algérie AH1021, Marseille → Alger.",
      "Bonjour Karim ! Avez-vous encore de la place pour un petit colis ?",
      "Il me reste 9 kg sur mon vol.",
    ],
  },
];
const now = () =>
  new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
const sensitive =
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+|00)\d[\d\s().-]{7,}\d|\b0[1-9](?:[\s().-]*\d){8,9}\b/gi;

export const MessagingModal: React.FC<MessagingModalProps> = ({
  isOpen,
  onClose,
  onPayCommission,
  onUnreadCountChange,
}) => {
  const [active, setActive] = useState("nadia");
  const [showList, setShowList] = useState(true);
  const [wide, setWide] = useState(
    () => window.matchMedia("(min-width: 768px)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const [history, setHistory] = useState<Record<string, Message[]>>(() =>
    Object.fromEntries(
      threads.map((t) => [
        t.id,
        t.messages.map((text, i) => ({
          id: `${t.id}-${i}`,
          mine: i === 1,
          text,
          time: `14:0${i + 2}`,
          read: true,
        })),
      ]),
    ),
  );
  const [unread, setUnread] = useState<Record<string, number>>({
    nadia: 1,
    amel: 1,
    karim: 1,
  });
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [typing, setTyping] = useState<Record<string, boolean>>({});
  const [notice, setNotice] = useState("");
  const [photoError, setPhotoError] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const view = useRef({ active, isOpen, showList });
  view.current = { active, isOpen, showList };
  const dialog = useModalFocus(isOpen, onClose);
  const feed = useRef<HTMLDivElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const attachmentThread = useRef(active);
  const thread = threads.find((t) => t.id === active)!;
  const messages = history[active];
  const visible = isOpen && (!showList || wide);
  useEffect(() => {
    onUnreadCountChange?.(Object.values(unread).reduce((a, b) => a + b, 0));
  }, [unread, onUnreadCountChange]);
  useEffect(() => {
    if (visible)
      setUnread((old) => (old[active] ? { ...old, [active]: 0 } : old));
  }, [visible, active]);
  useEffect(() => {
    feed.current?.scrollTo({
      top: feed.current.scrollHeight,
      behavior: "auto",
    });
  }, [messages, typing, isOpen, showList]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const send = (
    text: string,
    kind?: Message["kind"],
    image?: string,
    target = active,
  ) => {
    if (!text.trim() || typing[target]) return;
    const clean = text.trim().replace(sensitive, "[coordonnée protégée]");
    setNotice(
      clean !== text.trim()
        ? "Pour protéger votre réservation, gardons vos échanges ici. Vos coordonnées ont été masquées."
        : "",
    );
    const id = crypto.randomUUID();
    setHistory((old) => ({
      ...old,
      [target]: [
        ...old[target],
        { id, mine: true, text: clean, time: now(), kind, image, read: false },
      ],
    }));
    setDrafts((old) => ({ ...old, [target]: "" }));
    setTyping((old) => ({ ...old, [target]: true }));
    const timer = setTimeout(() => {
      const current = view.current;
      const seen =
        current.isOpen &&
        current.active === target &&
        (!current.showList || window.matchMedia("(min-width: 768px)").matches);
      const reply =
        kind === "pin"
          ? "Code bien reçu. Nous le vérifierons uniquement à la remise du colis. Merci !"
          : kind === "photo"
            ? "Photo bien reçue, tout est parfait. Merci pour le soin apporté !"
            : kind === "location"
              ? "C’est noté ! Rendez-vous au hall des arrivées de l’aéroport Houari Boumédiène."
              : threads.find((t) => t.id === target)!.reply;
      setHistory((old) => ({
        ...old,
        [target]: [
          ...old[target].map((m) => (m.id === id ? { ...m, read: true } : m)),
          { id: crypto.randomUUID(), mine: false, text: reply, time: now() },
        ],
      }));
      setTyping((old) => ({ ...old, [target]: false }));
      if (!seen) setUnread((old) => ({ ...old, [target]: old[target] + 1 }));
      timers.current = timers.current.filter((t) => t !== timer);
    }, 1200);
    timers.current.push(timer);
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-0 backdrop-blur-md sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="messaging-title"
        className="luxury-surface flex h-[100dvh] w-full max-w-6xl overflow-hidden bg-white text-slate-900 shadow-2xl sm:h-[min(800px,92dvh)] sm:rounded-[32px] sm:border sm:border-white/60"
      >
        <aside
          className={`${showList ? "flex" : "hidden"} w-full shrink-0 flex-col border-r border-slate-200/70 bg-[#f7f8fb] md:flex md:w-[310px]`}
        >
          <div className="px-6 pb-6 pt-7">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[.24em] text-blue-600">
                Votre espace privé
              </span>
              <button
                aria-label="Fermer la messagerie"
                onClick={onClose}
                className="luxury-icon md:hidden"
              >
                <X size={20} />
              </button>
            </div>
            <h2
              id="messaging-title"
              className="mt-3 text-3xl font-semibold tracking-tight"
            >
              Messages<span className="text-blue-600">.</span>
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              De belles rencontres. Des échanges sereins.
            </p>
          </div>
          <div className="mx-5 mb-4 flex items-center justify-between border-b border-slate-200 pb-3 text-xs font-semibold">
            <span>Toutes les conversations</span>
            <span className="rounded-full bg-white px-2 py-1 text-slate-500">
              03
            </span>
          </div>
          <div className="space-y-2 overflow-y-auto px-3">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActive(t.id);
                  setShowList(false);
                  setNotice("");
                  setPhotoError("");
                  setUnread((old) => ({ ...old, [t.id]: 0 }));
                }}
                aria-current={active === t.id ? "true" : undefined}
                className={`w-full rounded-2xl p-4 text-left transition ${active === t.id ? "bg-white shadow-[0_4px_24px_-8px_#cbd5e1] ring-1 ring-slate-200/70" : "hover:bg-white/70"}`}
              >
                <div className="flex gap-3">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${t.color}`}
                  >
                    {t.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-semibold">{t.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {history[t.id][history[t.id].length - 1]?.time}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[11px] font-medium text-slate-600">
                      {t.subject}
                    </p>
                    <p className="mt-1 text-[10px] text-blue-600">{t.detail}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <p className="flex-1 truncate text-xs text-slate-500">
                    {typing[t.id]
                      ? "Écrit un message…"
                      : history[t.id][history[t.id].length - 1]?.text}
                  </p>
                  {unread[t.id] > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                      {unread[t.id]}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-auto p-6">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <ShieldCheck size={16} className="text-blue-600" /> Vos
              réservations, au même endroit.
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
              Conversations de démonstration · réponses simulées.
            </p>
          </div>
        </aside>

        <section
          className={`${showList ? "hidden" : "flex"} min-w-0 flex-1 flex-col md:flex`}
          aria-label={`Conversation avec ${thread.name}`}
        >
          <header className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
            <button
              onClick={() => setShowList(true)}
              aria-label="Retour aux conversations"
              className="luxury-icon md:hidden"
            >
              <ArrowLeft size={20} />
            </button>
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${thread.color}`}
            >
              {thread.initials}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold">{thread.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {typing[active] ? "Écrit un message…" : "En ligne · démo"}
              </p>
            </div>
            <ShieldCheck size={19} className="text-slate-400" />
            <button
              onClick={onClose}
              aria-label="Fermer la messagerie"
              className="luxury-icon"
            >
              <X size={20} />
            </button>
          </header>
          <div className="shrink-0 px-4 py-3 sm:px-6">
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-slate-50 p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-xs font-semibold">
                  <Plane size={15} className="text-blue-600" /> Marseille{" "}
                  <span className="text-slate-400">→</span> Alger
                </span>
                <span className="rounded-full bg-white px-2 py-1 text-[9px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  {thread.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-blue-100/70 pt-3">
                <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <LockKeyhole size={12} /> Séquestre Stripe · démo
                </span>
                <strong className="text-sm">
                  {thread.amount}{" "}
                  <span className="text-[10px] font-normal text-slate-500">
                    {active === "karim" ? "bloqué" : "verrouillés"}
                  </span>
                </strong>
              </div>
              {active === "karim" && (
                <button
                  onClick={onPayCommission}
                  className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-700"
                >
                  Voir les voyages disponibles <ChevronRight size={13} />
                </button>
              )}
            </div>
          </div>
          <div
            ref={feed}
            role="log"
            aria-label="Messages"
            aria-live="polite"
            className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain bg-slate-50/60 px-4 py-4 sm:px-6"
          >
            <p className="text-center text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Aujourd’hui
            </p>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.mine ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-[22px] px-4 py-3 text-[13px] leading-relaxed sm:max-w-[80%] ${m.mine ? "rounded-br-md bg-[#eef3ff] text-slate-800" : "rounded-bl-md border border-slate-200/70 bg-white text-slate-700 shadow-sm"}`}
                >
                  {m.kind === "pin" ? (
                    <div className="min-w-[200px]">
                      <p className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                        <LockKeyhole size={15} /> PIN de livraison · démo
                      </p>
                      <div
                        className="my-4 flex gap-2"
                        aria-label="Code de démonstration 4829"
                      >
                        {"4829".split("").map((n, i) => (
                          <span
                            key={i}
                            className="flex h-11 w-10 items-center justify-center rounded-xl border border-blue-100 bg-white text-xl font-semibold"
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                      <p className="max-w-[230px] text-[11px] text-slate-500">
                        À transmettre uniquement après vérification du colis. Ce
                        code est fictif.
                      </p>
                    </div>
                  ) : m.kind === "location" ? (
                    <div>
                      <div className="mb-3 flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 via-slate-100 to-emerald-100">
                        <MapPin className="text-blue-600" size={28} />
                      </div>
                      <p className="font-semibold">
                        Aéroport Houari Boumédiène
                      </p>
                      <p className="text-xs text-slate-500">
                        Hall des arrivées · Alger
                      </p>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=A%C3%A9roport+Houari+Boum%C3%A9di%C3%A8ne"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center text-xs font-semibold text-blue-700"
                      >
                        Ouvrir l’itinéraire <ChevronRight size={14} />
                      </a>
                    </div>
                  ) : m.kind === "photo" ? (
                    <div>
                      <img
                        src={m.image}
                        alt="Photo du colis ou ticket de caisse partagé"
                        className="mb-2 max-h-56 rounded-xl object-contain"
                      />
                      <p>{m.text}</p>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                      {m.text}
                    </p>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-1 px-1 text-[10px] text-slate-400">
                  <span>{m.time}</span>
                  {m.mine && (
                    <CheckCheck
                      size={14}
                      aria-label={m.read ? "Lu" : "Envoyé"}
                      className={m.read ? "text-blue-500" : "text-slate-400"}
                    />
                  )}
                </div>
              </div>
            ))}
            {typing[active] && (
              <div
                role="status"
                className="flex w-fit items-center gap-1 rounded-2xl border border-slate-100 bg-white px-4 py-3"
              >
                <span className="sr-only">{thread.name} écrit un message</span>
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    className="h-1.5 w-1.5 rounded-full bg-slate-400 motion-safe:animate-pulse"
                    style={{ animationDelay: `${n * 180}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
          <footer className="shrink-0 border-t border-slate-100 bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 sm:px-6">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              <button
                disabled={typing[active] || active === "karim"}
                onClick={() => send("Code PIN de livraison", "pin")}
                className="luxury-chat-action"
              >
                Transmettre le code PIN de livraison 🔑
              </button>
              <button
                disabled={typing[active]}
                onClick={() => {
                  attachmentThread.current = active;
                  file.current?.click();
                }}
                className="luxury-chat-action"
              >
                Photo du colis / ticket de caisse 📸
              </button>
              <button
                disabled={typing[active]}
                onClick={() =>
                  send(
                    "Point de rencontre Aéroport Houari Boumédiène",
                    "location",
                  )
                }
                className="luxury-chat-action"
              >
                Point de rencontre Aéroport Houari Boumédiène 📍
              </button>
            </div>
            <input
              ref={file}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const photo = e.target.files?.[0];
                e.target.value = "";
                if (!photo) return;
                if (
                  !["image/jpeg", "image/png", "image/webp"].includes(
                    photo.type,
                  ) ||
                  photo.size > 5 * 1024 * 1024
                ) {
                  setPhotoError(
                    "Choisissez une photo JPG, PNG ou WebP de moins de 5 Mo.",
                  );
                  return;
                }
                setPhotoError("");
                const target = attachmentThread.current;
                const reader = new FileReader();
                reader.onload = () =>
                  send(
                    "Photo du colis / ticket de caisse",
                    "photo",
                    String(reader.result),
                    target,
                  );
                reader.onerror = () =>
                  setPhotoError("Lecture impossible. Essayez une autre photo.");
                reader.readAsDataURL(photo);
              }}
            />
            {notice && (
              <p
                role="status"
                className="mb-3 flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-[11px] leading-relaxed text-blue-800"
              >
                <ShieldCheck size={16} className="shrink-0" />
                {notice}
              </p>
            )}
            {photoError && (
              <p role="alert" className="mb-2 text-xs text-rose-700">
                {photoError}
              </p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(drafts[active] || "");
              }}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1.5 pl-4"
            >
              <MessageCircle size={18} className="shrink-0 text-slate-400" />
              <input
                aria-label={`Message à ${thread.name}`}
                maxLength={2000}
                value={drafts[active] || ""}
                onChange={(e) =>
                  setDrafts((old) => ({ ...old, [active]: e.target.value }))
                }
                placeholder="Votre message…"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={!drafts[active]?.trim() || typing[active]}
                aria-label="Envoyer le message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40"
              >
                <ArrowUp size={20} />
              </button>
            </form>
          </footer>
        </section>
      </div>
    </div>
  );
};
