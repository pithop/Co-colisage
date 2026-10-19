import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  CheckCheck,
  Info,
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
import { Dialog } from "./Dialog";
import { Avatar } from "./Avatar";
import { AudioMessagePlayer, voiceTime, voiceWave } from "./AudioMessagePlayer";

export interface ChatMessage {
  id: string;
  text: string;
  mine: boolean;
  time: string;
  audio?: { url?: string; duration: number };
  qr?: string;
  official?: boolean;
}
export interface ConversationData {
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
  const c = conversations.find((c) => c.id === activeId);
  const feed = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setRecording(false);
    setRecordedSeconds(0);
    setDraft("");
    setDelivery(false);
    setTracking(false);
    setDelay(false);
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
          audio: { url: "/audio/voice-note-1.ogg", duration: 14 },
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
  const hasOffPlatformRisk =
    /whatsapp|06\d|paypal|liquide|payer en direct|hors appli|virement perso|iban/i.test(
      draft,
    );
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
          "Accord enregistré. La remise peut maintenant être organisée.",
          false,
        ),
      ],
    });
    onNotice("Accord enregistré. Vous pouvez maintenant organiser la remise.");
    void confetti({
      particleCount: 90,
      spread: 65,
      origin: { y: 0.7 },
      colors: ["#2563eb", "#10b981", "#fbbf24"],
      disableForReducedMotion: true,
    });
  };
  const stageText = c?.resolution
    ? c.resolution.outcome === "refund"
      ? "Expéditeur remboursé"
      : "Fonds débloqués au voyageur"
    : c?.stage === "discussion"
      ? "En attente d’accord"
      : c?.stage === "secured"
        ? "Fonds sous séquestre"
        : c?.stage === "collected"
          ? "Article pris en charge"
          : "Fonds libérés";
  return (
    <section className={`messages-page ${c ? "has-conversation" : ""}`}>
      <aside className="conversation-list">
        <h1>Messages</h1>
        <p className="muted">Chaque rencontre commence ici.</p>
        {!conversations.length && (
          <div className="empty-state">
            <MessageCircle size={30} />
            <h2>La conversation est ouverte</h2>
            <p>
              Choisissez une demande ou un trajet pour contacter son auteur.
            </p>
          </div>
        )}
        {conversations.map((t) => (
          <button
            className={`conversation-preview ${t.id === activeId ? "selected" : ""}`}
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
        <div className="conversation-detail">
          <header>
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
            </div>
          </header>
          <div className="escrow-strip">
            <LockKeyhole size={17} />
            <div>
              <strong>
                {stageText} · {euro(c.amount)}
              </strong>
              <small>Registre BagVoyage</small>
            </div>
            {c.resolution || c.id.startsWith("support-") ? null : c.stage ===
              "discussion" ? (
              <button
                className="agreement-button"
                onClick={() => {
                  secureAgreement();
                }}
              >
                Enregistrer l’accord
              </button>
            ) : (
              <button
                onClick={() => {
                  confetti.reset();
                  onNotice("");
                  setDelivery(true);
                }}
              >
                {c.stage === "delivered"
                  ? "Voir la remise"
                  : "Valider la remise"}
              </button>
            )}
          </div>
          <div className="chat-safety-note">
            <ShieldCheck size={17} />
            <p>
              Gardez vos échanges et paiements ici. Ne partagez jamais votre
              code avant la remise de l’article.
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
            {c.messages.map((m) => (
              <div key={m.id} className={`message ${m.mine ? "mine" : ""}`}>
                <div>
                  {m.audio && (
                    <AudioMessagePlayer
                      url={m.audio.url}
                      duration={m.audio.duration}
                      mine={m.mine}
                    />
                  )}
                  {m.qr && <QrImage value={m.qr} />}
                  <p>
                    {m.official && (
                      <strong className="official-badge">
                        Support Officiel BagVoyage
                      </strong>
                    )}
                    {m.text}
                  </p>
                </div>
                <small>
                  {m.time}
                  {m.mine && <CheckCheck size={13} />}
                </small>
              </div>
            ))}
          </div>
          <footer>
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
                onClick={() => {
                  const pickup = c.stage === "secured";
                  const code = pickup ? c.pickupCode : c.deliveryCode;
                  send(
                    `Code PIN ${pickup ? "de prise en charge" : "de livraison"} : ${code}`,
                    `entre-particuliers:${c.id}:${pickup ? "pickup" : "delivery"}:${code}`,
                  );
                }}
              >
                <QrCode size={16} />
                Envoyer le PIN / QR code
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
              <div className="antifraud-warning">
                <ShieldCheck size={20} aria-hidden="true" />
                <p role="alert">
                  Bouclier Séquestre BagVoyage : Ne communiquez pas hors
                  plateforme afin de garantir le séquestre et l’assurance de 1
                  500 €.
                </p>
                <button type="button" onClick={secureAgreement}>
                  Sécuriser l’accord
                </button>
              </div>
            )}
            {recording && (
              <div
                className="voice-recorder"
                role="region"
                aria-label="Enregistrement de note vocale"
              >
                <div className="voice-recording-status">
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
                <p>
                  Capture simulée · envoi d’une note de démonstration de 14 s.
                </p>
                <div className="voice-recorder-actions">
                  <button type="button" onClick={stopRecording}>
                    Annuler
                  </button>
                  <button type="button" onClick={sendVoice}>
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
              >
                <ArrowUp size={19} />
              </button>
            </form>
            <p className="demo-note">
              <Info size={12} />
              Chiffrement de bout en bout AES-256 · Séquestre bancaire garanti par Stripe Connect.
            </p>
          </footer>
        </div>
      ) : (
        <div className="chat-placeholder">
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
