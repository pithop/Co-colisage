import { useId, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Download,
  Smartphone,
  X,
} from "lucide-react";
import { useModalFocus } from "../../hooks/useModalFocus";

export function MobileWaitlistForm({
  language = "fr",
}: {
  language?: "fr" | "en";
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  const [error, setError] = useState("");
  const text = (fr: string, en: string) => (language === "fr" ? fr : en);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const normalized = email.trim().toLowerCase();
    try {
      const stored: unknown = JSON.parse(
        localStorage.getItem("bv_mobile_waitlist") || "[]",
      );
      if (
        !Array.isArray(stored) ||
        !stored.every((entry: unknown) => typeof entry === "string")
      ) {
        throw new Error("Invalid waitlist data");
      }
      localStorage.setItem(
        "bv_mobile_waitlist",
        JSON.stringify([...new Set([...stored, normalized])]),
      );
      setSavedEmail(normalized);
    } catch {
      setError(
        text(
          "L’inscription n’a pas pu être enregistrée. Autorisez le stockage dans votre navigateur puis réessayez.",
          "Your registration could not be saved. Allow browser storage and try again.",
        ),
      );
    }
  }
  return (
    <form className="mobile-waitlist" onSubmit={submit}>
      <label htmlFor={id}>
        {text("Votre e-mail pour le lancement", "Your email for launch")}
      </label>
      <div className="mobile-waitlist-fields">
        <input
          id={id}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={254}
          placeholder="vous@exemple.fr"
          value={email}
          aria-describedby={`${id}-privacy`}
          aria-invalid={error ? true : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            setSavedEmail("");
            setError("");
          }}
        />
        <button type="submit">
          {text(
            "M’inscrire sur la liste prioritaire",
            "Join the priority list",
          )}
          <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </div>
      <p id={`${id}-privacy`} className="mobile-waitlist-note">
        {text(
          "Votre inscription est enregistrée sur cet appareil uniquement. Aucun e-mail automatique n’est envoyé pour le moment.",
          "Your registration is saved on this device only. No automatic email is sent yet.",
        )}
      </p>
      <div role="status" className="mobile-waitlist-success">
        {savedEmail && (
          <>
            <CheckCircle2 size={19} aria-hidden="true" />
            <span>
              {text("Inscription confirmée pour", "Registration confirmed for")}{" "}
              <strong>{savedEmail}</strong>.{" "}
              {text(
                "Votre place sur la liste prioritaire est enregistrée sur cet appareil.",
                "Your place on the priority list is saved on this device.",
              )}
            </span>
          </>
        )}
      </div>
      {error && (
        <p role="alert" className="mobile-waitlist-error">
          {error}
        </p>
      )}
    </form>
  );
}

export function MobileAppLaunchModal({
  onClose,
  language = "fr",
}: {
  onClose: () => void;
  language?: "fr" | "en";
}) {
  const ref = useModalFocus(true, onClose);
  const titleId = useId();
  const descriptionId = useId();
  const text = (fr: string, en: string) => (language === "fr" ? fr : en);
  return (
    <div
      className="mobile-launch-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="mobile-launch-modal"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        lang={language}
      >
        <div className="mobile-launch-handle" aria-hidden="true" />
        <button
          type="button"
          className="mobile-launch-close"
          onClick={onClose}
          aria-label={text("Fermer le lancement mobile", "Close mobile launch")}
        >
          <X size={22} />
        </button>
        <div className="mobile-launch-symbol">
          <Smartphone size={30} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <span className="mobile-launch-kicker">
          {text(
            "VOTRE PROCHAIN COMPAGNON DE VOYAGE",
            "YOUR NEXT TRAVEL COMPANION",
          )}
        </span>
        <h2 id={titleId}>
          {text(
            "BagVoyage sur iPhone & Android",
            "BagVoyage on iPhone & Android",
          )}
          <span>
            {text(
              "Bientôt disponible sur l’App Store et Google Play",
              "Coming soon to the App Store and Google Play",
            )}
          </span>
        </h2>
        <p id={descriptionId}>
          {text(
            "L’application native iOS et Android est en cours de finalisation et de validation auprès d’Apple et Google. En attendant la publication officielle sur les stores, nous développons la version Web Progressive (PWA) : ultra-rapide, responsive et accessible dès maintenant.",
            "The native iOS and Android app is being finalized and validated with Apple and Google. While we prepare the official store release, we are developing the Progressive Web App (PWA): fast, responsive and available now.",
          )}
        </p>
        <a className="mobile-web-cta" href="/#explore">
          {text("Ouvrir l’application Web maintenant", "Open the Web app now")}
          <ArrowUpRight size={20} aria-hidden="true" />
        </a>
        <section
          className="mobile-pwa-guide"
          aria-labelledby={`${titleId}-pwa`}
        >
          <Download size={22} aria-hidden="true" />
          <div>
            <h3 id={`${titleId}-pwa`}>
              {text(
                "Installer la PWA sur votre téléphone en 10 secondes",
                "Install the PWA on your phone in 10 seconds",
              )}
            </h3>
            <p>
              <strong>iPhone · Safari</strong>
              <span>
                {text(
                  "Partager > Sur l’écran d’accueil",
                  "Share > Add to Home Screen",
                )}
              </span>
            </p>
            <p>
              <strong>Android · Chrome</strong>
              <span>
                {text("Menu > Installer l’application", "Menu > Install app")}
              </span>
            </p>
          </div>
        </section>
        <div className="mobile-launch-waitlist">
          <h3>
            {text(
              "Les premiers informés. Les premiers à bord.",
              "First to know. First on board.",
            )}
          </h3>
          <MobileWaitlistForm language={language} />
        </div>
      </div>
    </div>
  );
}
