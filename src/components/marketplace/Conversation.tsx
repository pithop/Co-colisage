import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Camera,
  Check,
  CheckCheck,
  Copy,
  Info,
  KeyRound,
  LockKeyhole,
  MessageCircle,
  Mic,
  QrCode,
  ShieldCheck,
} from "lucide-react";

import { QrImage } from "./QrImage";
import { DeliveryModal } from "./DeliveryModal";
import { OrderTracking, FlightDelayDialog } from "./OrderTracking";
import type { HandoverRecord, FlightDelay } from "./handover";
import confetti from "canvas-confetti";
import { euro } from "../../data/marketplace";
import { Avatar } from "./Avatar";
import { AudioMessagePlayer, voiceTime, voiceWave } from "./AudioMessagePlayer";
import type { AudioTranscription } from "../../types/audio";
import { bundledVoiceTranscriptions } from "../../data/voiceTranscriptions";

export interface ChatMessage {
  id: string;
  text: string;
  mine: boolean;
  time: string;
  audio?: {
    url?: string;
    duration: number;
    transcription?: AudioTranscription;
    transcriptionStatus?: "pending" | "failed";
  };
  qr?: string;
  official?: boolean;
}
export interface ConversationData {
  arbitrage?: {
    groupId: string;
    flightId: string;
    requestIds: string[];
    source: "estimate" | "live";
  };
  id: string;
  name: string;
  subject: string;
  amount: number;
  serviceAmount?: number;
  messages: ChatMessage[];
  stage: "discussion" | "secured" | "collected" | "delivered";
  pickupCode: string;
  deliveryCode: string;
  ratings?: number[];
  handovers?: HandoverRecord[];
  delays?: FlightDelay[];
  securedAt?: string;
  participantIds?: string[];
  resolution?: { outcome: "release" | "refund"; reason: string; at: string };
  dispute?: { reason: string; at: string };
}
export const createMessage = (
  text: string,
  mine = true,
  qr?: string,
): ChatMessage => ({
  id: crypto.randomUUID(),
  text,
  mine,
  qr,
  time: new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }),
});
export function Conversation({
  conversations,
  activeId,
  onSelect,
  onUpdate,
  onSend,
  pendingReplies,
  onNotice,
}: {
  conversations: ConversationData[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (c: ConversationData) => void;
  onSend: (id: string, text: string, qr?: string) => void;
  pendingReplies: string[];
  onNotice: (message: string) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const microphone = useRef<HTMLButtonElement>(null);
  const [draft, setDraft] = useState("");
  const [delivery, setDelivery] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [delay, setDelay] = useState(false);
  const [copiedPin, setCopiedPin] = useState<string | null>(null);
  const [offerProposed, setOfferProposed] = useState(false);
  const c = conversations.find((c) => c.id === activeId);

  const feed = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setRecording(false);
    setRecordedSeconds(0);
    setDraft("");
    setDelivery(false);
    setTracking(false);
    setDelay(false);
    setOfferProposed(false);
  }, [activeId]);
  useEffect(() => {
    feed.current?.scrollTo({ top: feed.current.scrollHeight });
  }, [c?.messages.length]);
  useEffect(() => {
    if (!recording) return;
    const started = performance.now();
    const timer = window.setInterval(
      () =>
        setRecordedSeconds(Math.floor((performance.now() - started) / 1000)),
      250,
    );
    return () => window.clearInterval(timer);
  }, [recording]);
  const stopRecording = () => {
    setRecording(false);
    setRecordedSeconds(0);
    microphone.current?.focus();
  };
  const sendVoice = () => {
    if (!c || !recording) return;
    onUpdate({
      ...c,
      messages: [
        ...c.messages,
        {
          ...createMessage("Note vocale (0:14)"),
          audio: {
            url: "/audio/voice-note-1.ogg",
            duration: 14,
            transcription:
              bundledVoiceTranscriptions["/audio/voice-note-1.ogg"],
          },
        },
      ],
    });
    stopRecording();
  };
  const send = (text: string, qr?: string) => {
    if (c && text.trim()) {
      onSend(c.id, text.trim(), qr);
      setDraft("");
    }
  };
  const fraudRegex =
    /whatsapp|06[\s.-]?\d{2}|07[\s.-]?\d{2}|\+33|\+213|\+212|\+216|paypal|liquide|payer en direct|hors appli|virement perso|iban|telegram|signal/i;
  const lastIncomingMsg = c ? [...c.messages].reverse().find(m => !m.mine)?.text || "" : "";
  const hasOffPlatformRisk = fraudRegex.test(draft) || fraudRegex.test(lastIncomingMsg);

  const secureAgreement = () => {
    if (!c || c.resolution || c.id.startsWith("support-")) return;
    if (c.stage !== "discussion") {
      setTracking(true);
      return;
    }
    onUpdate({
      ...c,
      stage: "secured",
      securedAt: new Date().toISOString(),
      messages: [
        ...c.messages,
        createMessage(
          "Accord enregistré sous séquestre Stripe Connect. La remise peut maintenant être organisée.",
          false,
        ),
      ],
    });
    onNotice("Accord enregistré sous séquestre Stripe Connect.");
    void confetti({
      particleCount: 90,
      spread: 65,
      origin: { y: 0.7 },
      colors: ["#2563eb", "#10b981", "#fbbf24"],
      disableForReducedMotion: true,
    });
  };

  const handleAdjustOffer = () => {
    if (!c || c.stage !== "discussion") return;
    const input = window.prompt(
      "Proposer un montant pour cette mission (€) :",
      String(c.amount),
    );
    if (input === null) return;
    const newAmount = Number(input.replace(",", ".").trim() || c.amount);
    if (Number.isFinite(newAmount) && newAmount > 0) {
      setOfferProposed(true);
      onUpdate({
        ...c,
        amount: newAmount,
        serviceAmount: newAmount,
        messages: [
          ...c.messages,
          createMessage(
            `Nouvelle proposition de rémunération convenant aux deux parties : ${euro(newAmount)}.`,
            true,
          ),
        ],
      });
      onNotice(`Montant de l'offre fixé à ${euro(newAmount)}. Vous pouvez maintenant séquestrer les fonds.`);
    }
  };

  return (
    <section className={`messages-page bg-[#F8FAFC] ${c ? "has-conversation" : ""}`}>
      <aside className="conversation-list bg-[#FFFFFF] border-r border-[#E2E8F0]">
        <h1>Messages</h1>
        <p className="muted">Chaque rencontre commence ici.</p>
        {!conversations.length && (
          <div className="empty-state rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-5">
            <MessageCircle size={30} />
            <h2>La conversation est ouverte</h2>
            <p>
              Choisissez une demande ou un trajet pour contacter son auteur.
            </p>
          </div>
        )}
        {conversations.map((t) => (
          <button
            className={`conversation-preview rounded-2xl border transition-all ${
              t.id === activeId
                ? "selected border-[#2563EB] bg-[#F8FAFC]"
                : "border-[#E2E8F0] bg-[#FFFFFF]"
            }`}
            key={t.id}
            onClick={() => onSelect(t.id)}
          >
            <Avatar name={t.name} />
            <span>
              <strong>{t.name}</strong>
              <small>{t.subject}</small>
              <p>
                {t.messages[t.messages.length - 1]?.text ||
                  "Commencez la conversation"}
              </p>
            </span>
          </button>
        ))}
      </aside>
      {c ? (
        <div className="conversation-detail bg-[#F8FAFC]">
          <header className="bg-[#FFFFFF] border-b border-[#E2E8F0]">
            <button
              className="icon-button chat-back"
              aria-label="Retour aux conversations"
              onClick={() => onSelect(null)}
            >
              <ArrowLeft size={20} />
            </button>
            <Avatar name={c.name} />
            <div>
              <h2>{c.name}</h2>
              <p>{c.subject}</p>
              {c.arbitrage && (
                <small className="demo-label tabular-nums">
                  Groupe de {c.arbitrage.requestIds.length} missions · accords à
                  confirmer
                </small>
              )}
            </div>
          </header>

          {/* Barre d'action contextuelle unique : affiche uniquement l'action attendue à l'étape en cours */}
          {!c.id.startsWith("support-") && (
            <div
              role="region"
              aria-label="Action contextuelle de la mission"
              className="mx-3 mt-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 tabular-nums"
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#059669]/20 text-[#059669] flex items-center justify-center shrink-0">
                  {c.stage === "discussion" ? (
                    <LockKeyhole size={18} />
                  ) : c.stage === "secured" ? (
                    <Camera size={18} />
                  ) : c.stage === "collected" ? (
                    <KeyRound size={18} />
                  ) : (
                    <Check size={18} strokeWidth={2.5} />
                  )}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#059669]/20 whitespace-nowrap">
                      {c.resolution
                        ? c.resolution.outcome === "refund"
                          ? "Remboursé"
                          : "Fonds libérés"
                        : c.stage === "discussion" && !offerProposed
                          ? "Étape 1/4 · Offre"
                          : c.stage === "discussion" && offerProposed
                            ? "Étape 2/4 · Séquestre"
                            : c.stage === "secured"
                              ? "Étape 3/4 · Prise en charge"
                              : c.stage === "collected"
                                ? "Étape 4/4 · Code PIN"
                                : "Mission livrée"}
                    </span>
                    <strong className="text-sm sm:text-base font-black text-[#059669] tabular-nums whitespace-nowrap">
                      {euro(c.amount)}
                    </strong>
                  </div>
                  <p className="text-xs text-slate-600 font-medium truncate">
                    {c.resolution
                      ? c.resolution.reason
                      : c.stage === "discussion" && !offerProposed
                        ? "Proposez votre tarif ou séquestrez directement le montant convenu."
                        : c.stage === "discussion" && offerProposed
                          ? "Offre validée : bloquez les fonds sur le compte séquestre Stripe."
                          : c.stage === "secured"
                            ? "Fonds séquestrés : validez la remise du colis avec photo de conformité."
                            : c.stage === "collected"
                              ? "Colis en transit : saisissez le code PIN à 4 chiffres du destinataire."
                              : "Code PIN vérifié : les fonds ont été transférés au voyageur."}
                  </p>
                </div>
              </div>

              {!c.resolution && (
                <div className="w-full sm:w-auto flex flex-wrap items-center justify-end gap-2 shrink-0">
                  {c.stage === "discussion" && !offerProposed && (
                    <>
                      <button
                        type="button"
                        onClick={handleAdjustOffer}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
                      >
                        <span>Faire une offre</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={secureAgreement}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                      >
                        <LockKeyhole size={14} className="text-[#059669]" />
                        <span>Séquestrer les fonds</span>
                      </button>
                    </>
                  )}

                  {c.stage === "discussion" && offerProposed && (
                    <>
                      <button
                        type="button"
                        onClick={handleAdjustOffer}
                        className="px-3 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                      >
                        Modifier l’offre
                      </button>
                      <button
                        type="button"
                        onClick={secureAgreement}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
                      >
                        <LockKeyhole size={14} />
                        <span>Séquestrer les fonds</span>
                      </button>
                    </>
                  )}

                  {c.stage === "secured" && (
                    <button
                      type="button"
                      onClick={() => {
                        confetti.reset();
                        onNotice("");
                        setDelivery(true);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Camera size={14} />
                      <span>Valider prise en charge + photo</span>
                    </button>
                  )}

                  {c.stage === "collected" && (
                    <button
                      type="button"
                      onClick={() => {
                        confetti.reset();
                        onNotice("");
                        setDelivery(true);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      <KeyRound size={14} />
                      <span>Saisir le code PIN 4 chiffres</span>
                    </button>
                  )}

                  {c.stage === "delivered" && (
                    <button
                      type="button"
                      onClick={() => setTracking(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#059669]/30 bg-[#ECFDF5] text-[#059669] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Check size={14} strokeWidth={2.5} />
                      <span>Mission livrée · Voir preuves</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="chat-safety-note mx-3 mt-2 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] px-4 py-3">
            <ShieldCheck size={17} className="text-[#059669]" />
            <p>
              Gardez vos échanges et paiements ici. Ne partagez jamais votre
              code PIN 4 chiffres avant la remise effective.
            </p>
          </div>
          <div
            className="message-feed"
            ref={feed}
            role="log"
            aria-label={`Conversation avec ${c.name}`}
            aria-live="polite"
          >
            <p className="chat-date">Votre échange à propos de cette annonce</p>
            {c.messages.map((m, i) => (
                <div key={m.id} className={`message ${m.mine ? "mine" : ""}`}>
                  <div>
                    {m.audio && (
                      <AudioMessagePlayer
                        url={m.audio.url}
                        duration={m.audio.duration}
                        mine={m.mine}
                        transcription={
                          m.audio.transcription ??
                          (m.audio.duration === 14
                            ? bundledVoiceTranscriptions[m.audio.url ?? ""]
                            : undefined)
                        }
                        transcriptionStatus={m.audio.transcriptionStatus}
                      />
                    )}
                    {m.qr ? (
                      <div className="handover-pass-card rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-5">
                        <div className="handover-pass-header">
                          <ShieldCheck size={16} className="text-[#059669]" />
                          <span>Pass de Remise Certifié BagVoyage</span>
                        </div>
                        <div className="handover-qr-container">
                          <QrImage value={m.qr} />
                        </div>
                        {m.text.includes(":") ? (
                          <div className="handover-pin-display tabular-nums">
                            <span className="handover-pin-label">
                              Code PIN 4 chiffres à usage unique :
                            </span>
                            <div className="flex items-center justify-center gap-2 mt-1">
                              <code className="handover-pin-code tabular-nums text-[#059669]">
                                {m.text.split(":").pop()?.trim()}
                              </code>
                              <button
                                type="button"
                                onClick={() => {
                                  const pin = m.text.split(":").pop()?.trim() || "";
                                  if (navigator.clipboard) {
                                    navigator.clipboard.writeText(pin).then(() => {
                                      setCopiedPin(pin);
                                      setTimeout(() => setCopiedPin(null), 2000);
                                    });
                                  }
                                }}
                                className="p-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                                title="Copier le code PIN"
                                aria-label="Copier le code PIN"
                              >
                                {copiedPin === m.text.split(":").pop()?.trim() ? (
                                  <Check size={14} className="text-[#059669]" />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                            </div>
                            {copiedPin === m.text.split(":").pop()?.trim() && (
                              <span className="text-[10px] text-[#059669] font-semibold block mt-1">
                                Code copié dans le presse-papier !
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className="handover-note">{m.text}</p>
                        )}

                      </div>
                    ) : (
                      <p>
                        {m.official && (
                          <strong className="official-badge">
                            Support Officiel BagVoyage
                          </strong>
                        )}
                        {m.text}
                      </p>
                    )}
                  </div>
                  <small className="tabular-nums">
                    {m.time}
                    {m.mine && (
                      i === c.messages.length - 1 && !pendingReplies.includes(c.id) ? (
                        <span title="Transmis" className="inline-flex"><Check size={12} /></span>
                      ) : (
                        <span title="Reçu et lu" className="inline-flex"><CheckCheck size={13} /></span>
                      )
                    )}
                  </small>
                </div>
              ))}
            </div>
            <footer className="bg-[#FFFFFF] border-t border-[#E2E8F0]">
              {pendingReplies.includes(c.id) && (
                <p className="typing-indicator" role="status">
                  {c.name} écrit…
                </p>
              )}
              <div className="chat-tools">
                <button onClick={() => setTracking(true)}>
                  Voir le suivi de la commande
                </button>
                <button
                  disabled={
                    !!c.resolution ||
                    c.id.startsWith("support-") ||
                    c.stage === "delivered"
                  }
                  onClick={() => setDelay(true)}
                >
                  Signaler un retard de vol
                </button>
                <button
                  disabled={
                    !!c.resolution ||
                    c.stage === "discussion" ||
                    c.stage === "delivered"
                  }
                  onClick={() => setDelivery(true)}
                >
                  <QrCode size={16} />
                  Ouvrir le scanner / code PIN
                </button>
              </div>
            <div
              className="quick-replies"
              role="group"
              aria-label="Réponses rapides"
            >
              {[
                "Colis récupéré et conforme",
                "Vol à l’heure",
                "Je suis au point de rendez-vous",
                "Code PIN transmis",
              ].map((reply) => (
                <button type="button" key={reply} onClick={() => send(reply)}>
                  {reply}
                </button>
              ))}
            </div>
            {hasOffPlatformRisk && (
              <div className="antifraud-warning rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-4">
                <ShieldCheck size={20} className="text-[#059669]" aria-hidden="true" />
                <p role="alert" className="tabular-nums">
                  Bouclier Séquestre BagVoyage : Ne communiquez pas hors
                  plateforme afin de garantir le séquestre et l’assurance de 1
                  500 €.
                </p>
                <button
                  type="button"
                  onClick={secureAgreement}
                  className="!bg-[#2563EB] !text-white rounded-xl px-4 py-2 font-bold text-xs"
                >
                  Séquestrer les fonds
                </button>
              </div>
            )}
            {recording && (
              <div
                className="voice-recorder rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-5"
                role="region"
                aria-label="Enregistrement de note vocale"
              >
                <div className="voice-recording-status tabular-nums">
                  <span className="voice-recording-dot" aria-hidden="true" />
                  <strong>Note vocale</strong>
                  <time aria-label="Durée de capture">
                    {voiceTime(recordedSeconds)}
                  </time>
                </div>
                <svg
                  className="recording-wave"
                  viewBox="0 0 144 40"
                  aria-hidden="true"
                >
                  {voiceWave.map((height, index) => (
                    <rect
                      key={index}
                      x={index * 6}
                      y={(40 - height) / 2}
                      width="3"
                      height={height}
                      rx="1.5"
                      style={{ animationDelay: `${index * 45}ms` }}
                    />
                  ))}
                </svg>
                <p className="tabular-nums">
                  Enregistrement audio chiffré · Note vocale de 14 s prête à l'envoi.
                </p>
                <div className="voice-recorder-actions">
                  <button type="button" onClick={stopRecording}>
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={sendVoice}
                    className="!bg-[#2563EB] !text-white"
                  >
                    <ArrowUp size={16} aria-hidden="true" />
                    Envoyer la note vocale
                  </button>
                </div>
              </div>
            )}
            <form
              className="message-composer"
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
            >
              <button
                ref={microphone}
                type="button"
                className="voice-microphone"
                aria-label="Enregistrer une note vocale"
                aria-expanded={recording}
                onClick={() => {
                  setRecordedSeconds(0);
                  setRecording((current) => !current);
                }}
              >
                <Mic size={19} />
              </button>
              <input
                aria-label={`Message à ${c.name}`}
                placeholder="Votre message…"
                maxLength={2000}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Envoyer le message"
                disabled={!draft.trim()}
                className="!bg-[#2563EB] !text-white"
              >
                <ArrowUp size={19} />
              </button>
            </form>
            <p className="demo-note">
              <Info size={12} />
              Chiffrement de bout en bout AES-256 · Séquestre bancaire garanti
              par Stripe Connect.
            </p>
          </footer>
        </div>
      ) : (
        <div className="chat-placeholder bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl m-4 p-8">
          <MessageCircle size={40} />
          <h2>Vos échanges, au même endroit.</h2>
          <p>Sélectionnez une conversation pour la retrouver.</p>
        </div>
      )}
      {tracking && c && (
        <OrderTracking conversation={c} onClose={() => setTracking(false)} />
      )}
      {delay && c && (
        <FlightDelayDialog
          conversation={c}
          onUpdate={onUpdate}
          onClose={() => setDelay(false)}
        />
      )}
      {delivery && c && !c.resolution && (
        <DeliveryModal
          conversation={c}
          onUpdate={onUpdate}
          onClose={() => setDelivery(false)}
        />
      )}
    </section>
  );
}
