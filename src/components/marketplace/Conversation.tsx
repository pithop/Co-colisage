import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  Check,
  CheckCheck,
  Info,
  LockKeyhole,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Star,
} from "lucide-react";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import { euro } from "../../data/marketplace";
import { Dialog } from "./Dialog";
import { Avatar } from "./Avatar";

export interface ChatMessage {
  id: string;
  text: string;
  mine: boolean;
  time: string;
  qr?: string;
}
export interface ConversationData {
  id: string;
  name: string;
  subject: string;
  amount: number;
  messages: ChatMessage[];
  stage: "discussion" | "secured" | "collected" | "delivered";
  pickupCode: string;
  deliveryCode: string;
  ratings?: number[];
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
export function QrImage({ value }: { value: string }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let current = true;
    QRCode.toDataURL(value, { width: 180, margin: 2 }).then((url) => {
      if (current) setSrc(url);
    });
    return () => {
      current = false;
    };
  }, [value]);
  return src ? (
    <img
      className="qr-image"
      src={src}
      alt="QR code de validation de la remise"
    />
  ) : (
    <span>Création du QR code…</span>
  );
}
const criteria = [
  "Réactivité",
  "Ponctualité",
  "Échange clair",
  "Marchandise intacte",
];
export function Delivery({
  conversation: c,
  onUpdate,
  onClose,
}: {
  conversation: ConversationData;
  onUpdate: (c: ConversationData) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [ratings, setRatings] = useState(c.ratings || [0, 0, 0, 0]);
  const pickup = c.stage === "secured";
  const payload = `entre-particuliers:${c.id}:${pickup ? "pickup" : "delivery"}:${pickup ? c.pickupCode : c.deliveryCode}`;
  const expected = pickup ? c.pickupCode : c.deliveryCode;
  const fileRef = useRef<HTMLInputElement>(null);
  const validate = (value: string) => {
    if (value.trim() !== expected && value.trim() !== payload) {
      setError(
        "Code incorrect. Vérifiez le code de cette étape avec votre interlocuteur.",
      );
      return;
    }
    if (c.stage !== "secured" && c.stage !== "collected") return;
    onUpdate({
      ...c,
      stage: pickup ? "collected" : "delivered",
      messages: [
        ...c.messages,
        createMessage(
          pickup
            ? "Premier QR validé : article pris en charge."
            : "Second QR validé : livraison confirmée. Fonds libérés en démonstration.",
          false,
        ),
      ],
    });
    setCode("");
    setError("");
  };
  const readQr = async (file: File) => {
    try {
      const { default: jsQR } = await import("jsqr");
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
      canvas.width = bitmap.width * scale;
      canvas.height = bitmap.height * scale;
      const context = canvas.getContext("2d");
      if (!context) throw new Error();
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const result = jsQR(pixels.data, pixels.width, pixels.height);
      if (!result) {
        setError(
          "QR code illisible. Essayez une photo nette ou saisissez le PIN.",
        );
        return;
      }
      validate(result.data);
    } catch {
      setError(
        "Cette image ne peut pas être lue. Utilisez une photo JPG ou PNG.",
      );
    }
  };
  return (
    <Dialog
      title={
        c.stage === "delivered"
          ? "Livraison confirmée"
          : "Validation par double QR code"
      }
      onClose={onClose}
    >
      <div className="delivery-steps" aria-label="Étapes de validation">
        <span
          aria-current={pickup ? "step" : undefined}
          className={c.stage !== "secured" ? "complete" : "current"}
        >
          1. Prise en charge
        </span>
        <span
          aria-current={c.stage === "collected" ? "step" : undefined}
          className={
            c.stage === "delivered"
              ? "complete"
              : c.stage === "collected"
                ? "current"
                : ""
          }
        >
          2. Livraison
        </span>
      </div>
      {c.stage !== "delivered" ? (
        <>
          <h3 className="delivery-title">
            {pickup ? "Confirmer la prise en charge" : "Confirmer la livraison"}
          </h3>
          <p className="muted">
            {pickup
              ? "Le premier code confirme que le voyageur a récupéré l’article."
              : "Le second code confirme la remise au destinataire et permet de libérer les fonds."}
          </p>
          <div className="demo-code">
            <QrImage value={payload} />
            <span>
              Code PIN de démonstration : <strong>{expected}</strong>
            </span>
          </div>
          <form
            className="publish-form"
            onSubmit={(e) => {
              e.preventDefault();
              validate(code);
            }}
          >
            <label>
              Code PIN ou contenu du QR code
              <input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                placeholder="Saisir le code de cette étape"
                autoComplete="off"
                required
              />
            </label>
            <button
              type="button"
              className="outline-button demo-fill-button"
              onClick={() => {
                setCode(expected);
                setError("");
              }}
            >
              Remplir le code (démo)
            </button>
            {error && (
              <p role="alert" className="error-message">
                {error}
              </p>
            )}
            <button className="primary-button" type="submit">
              {pickup ? "Valider la prise en charge" : "Valider la livraison"}
            </button>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileRef}
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void readQr(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              className="outline-button"
              onClick={() => fileRef.current?.click()}
            >
              <QrCode size={18} />
              Scanner ou importer un QR code
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="delivery-success">
            <ShieldCheck size={36} />
            <h3>Article remis, merci !</h3>
            <p>{euro(c.amount)} libérés en démonstration.</p>
          </div>
          {c.ratings ? (
            <p className="info-box">
              <Check size={18} />
              Votre avis a été enregistré. Merci !
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdate({ ...c, ratings });
              }}
            >
              <h3 className="delivery-title">
                Comment s’est passée la livraison ?
              </h3>
              <div className="rating-criteria">
                {criteria.map((criterion, index) => (
                  <fieldset key={criterion}>
                    <legend>{criterion}</legend>
                    <div>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <label key={value}>
                          <input
                            className="rating-input"
                            type="radio"
                            name={`rating-${index}`}
                            value={value}
                            checked={ratings[index] === value}
                            onChange={() =>
                              setRatings(
                                ratings.map((r, i) =>
                                  i === index ? value : r,
                                ),
                              )
                            }
                            aria-label={`${criterion} : ${value} sur 5`}
                          />
                          <Star
                            size={23}
                            fill={value <= ratings[index] ? "#e1a32c" : "none"}
                            color={
                              value <= ratings[index] ? "#b87c0f" : "#9aa2ad"
                            }
                          />
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
              <button
                className="primary-button"
                disabled={ratings.some((r) => r === 0)}
              >
                Envoyer mon avis
              </button>
            </form>
          )}
        </>
      )}
      <p className="demo-note">
        Parcours de démonstration : aucun paiement réel n’est effectué.
      </p>
    </Dialog>
  );
}
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
  const [draft, setDraft] = useState("");
  const [delivery, setDelivery] = useState(false);
  const c = conversations.find((c) => c.id === activeId);
  const feed = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setDraft("");
    setDelivery(false);
  }, [activeId]);
  useEffect(() => {
    feed.current?.scrollTo({ top: feed.current.scrollHeight });
  }, [c?.messages.length]);
  const send = (text: string, qr?: string) => {
    if (c && text.trim()) {
      onSend(c.id, text.trim(), qr);
      setDraft("");
    }
  };
  const stageText =
    c?.stage === "discussion"
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
              <small>Stripe · démonstration</small>
            </div>
            {c.stage === "discussion" ? (
              <button
                className="agreement-button"
                onClick={() => {
                  onUpdate({
                    ...c,
                    stage: "secured",
                    messages: [
                      ...c.messages,
                      createMessage(
                        "Accord simulé : les fonds sont placés sous séquestre de démonstration.",
                        false,
                      ),
                    ],
                  });
                  onNotice(
                    "Accord simulé : les fonds sont placés sous séquestre. Vous pouvez maintenant tester la remise.",
                  );
                  void confetti({
                    particleCount: 90,
                    spread: 65,
                    origin: { y: 0.7 },
                    colors: ["#2563eb", "#10b981", "#fbbf24"],
                    disableForReducedMotion: true,
                  });
                }}
              >
                Simuler l’accord
              </button>
            ) : (
              <button onClick={() => setDelivery(true)}>
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
                  {m.qr && <QrImage value={m.qr} />}
                  <p>{m.text}</p>
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
              <button
                disabled={c.stage === "discussion" || c.stage === "delivered"}
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
            <form
              className="message-composer"
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
            >
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
              Messages enregistrés sur cet appareil · réponses automatiques
              simulées.
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
      {delivery && c && (
        <Delivery
          conversation={c}
          onUpdate={onUpdate}
          onClose={() => setDelivery(false)}
        />
      )}
    </section>
  );
}
