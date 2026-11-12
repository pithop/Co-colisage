import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
  Luggage,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { Registration } from "../../lib/localAuth";
import type { UserRole } from "../../types/auth";
import { AuthPageShell } from "./LoginPage";
import { Dialog } from "../marketplace/Dialog";
const roles = [
  {
    id: "traveler",
    role: "voyageur",
    label: "Voyageur Particulier",
    detail: "Valorisez les kilos libres de votre valise.",
    Icon: Luggage,
  },
  {
    id: "sender",
    role: "expediteur",
    label: "Expéditeur de Colis",
    detail: "Confiez vos colis à un voyageur de confiance.",
    Icon: Package,
  },
  {
    id: "buyer",
    role: "expediteur",
    label: "Acheteur Shop & Go",
    detail: "Faites acheter et livrer vos envies.",
    Icon: ShoppingBag,
  },
  {
    id: "professional",
    role: "transporteur_pro",
    label: "Transporteur Flotte Pro",
    detail: "Développez votre activité de transport.",
    Icon: Truck,
  },
] satisfies {
  id: string;
  role: UserRole;
  label: string;
  detail: string;
  Icon: typeof Luggage;
}[];
export const passwordCriteria = (password: string) => [
  { label: "Au moins 12 caractères", met: password.length >= 12 },
  {
    label: "Minuscules et majuscules",
    met: /[a-z]/.test(password) && /[A-Z]/.test(password),
  },
  { label: "Au moins un chiffre", met: /[0-9]/.test(password) },
  {
    label: "Au moins un caractère spécial",
    met: /[^\p{L}\p{N}\s]/u.test(password),
  },
];
export function RegisterPage() {
  const { register, user, openGoogleModal } = useAuth();
  const [step, setStep] = useState(0);
  const [roleId, setRoleId] = useState("traveler");
  const [input, setInput] = useState<Registration>({
    username: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    city: "",
    phone: "",
    email: "",
    password: "",
    role: "voyageur",
  });
  const [dialCode, setDialCode] = useState("+33");
  const [confirmation, setConfirmation] = useState("");
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [consent, setConsent] = useState(false);
  const [terms, setTerms] = useState(false);
  const [kyc, setKyc] = useState<"idle" | "scanning" | "simulated">("idle");
  const [deferred, setDeferred] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const criteria = passwordCriteria(input.password),
    strength = criteria.filter((c) => c.met).length;
  const set = (field: keyof Registration, value: string) =>
    setInput((current) => ({ ...current, [field]: value }));
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [step]);
  useEffect(() => {
    if (kyc !== "scanning") return;
    const timer = setTimeout(() => setKyc("simulated"), 1600);
    return () => clearTimeout(timer);
  }, [kyc]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setError("");
    if (step === 1) {
      if (!/^\d[\d\s().-]{5,18}$/.test(input.phone.trim())) {
        setError("Saisissez un numéro national valide, sans indicatif.");
        return;
      }
      if (
        !input.firstName.trim() ||
        !input.lastName.trim() ||
        !input.username.trim() ||
        !input.city.trim()
      ) {
        setError("Complétez tous les champs de votre identité.");
        return;
      }
      const birthday = new Date(`${input.birthDate}T00:00:00`);
      if (!Number.isFinite(birthday.getTime()) || birthday >= new Date()) {
        setError("Indiquez une date de naissance dans le passé.");
        return;
      }
    }
    if (step === 2 && (strength < 4 || input.password !== confirmation)) {
      setError(
        strength < 4
          ? "Respectez les quatre critères du mot de passe."
          : "Les mots de passe ne correspondent pas.",
      );
      return;
    }
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    if (!consent || kyc === "scanning") return;
    if (!deferred && kyc !== "simulated") {
      setError(
        "Lancez la simulation ou choisissez de vérifier votre identité plus tard.",
      );
      return;
    }
    setBusy(true);
    try {
      const selected = roles.find((r) => r.id === roleId) || roles[0];
      await register({
        ...input,
        role: selected.role,
        roles: [
          roleId === "buyer"
            ? "buyer"
            : roleId === "sender"
              ? "sender"
              : "carrier",
        ],
        phone: `${dialCode}${input.phone.replace(/^0/, "").replace(/[\s().-]/g, "")}`,
      });
      window.location.hash = "tracking";
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "La création du compte a échoué. Réessayez.",
      );
    } finally {
      setBusy(false);
    }
  };
  const labels = ["Votre rôle", "Votre identité", "Sécurité", "Vérification"];
  return (
    <AuthPageShell>
      <div className="bv-auth-topline">
        <span>Déjà membre ?</span>
        <a href="#login">
          Se connecter
          <ArrowRight size={15} />
        </a>
      </div>
      <div className="bv-auth-content bv-register-content">
        <ol
          className="bv-registration-steps"
          aria-label="Étapes de création du compte"
        >
          {labels.map((label, i) => (
            <li
              key={label}
              aria-current={step === i ? "step" : undefined}
              className={i <= step ? "active" : ""}
            >
              <span>{i < step ? <Check size={14} /> : i + 1}</span>
              <small>{label}</small>
            </li>
          ))}
        </ol>
        <span className="bv-eyebrow">ÉTAPE {step + 1} SUR 4</span>
        <h2 ref={heading} tabIndex={-1}>
          {
            [
              "Votre voyage\ncommence ici.",
              "Faisons\nconnaissance.",
              "La confiance\nse protège.",
              "Un dernier\npas ensemble.",
            ][step]
          }
        </h2>
        <p className="bv-muted">
          {
            [
              "Comment souhaitez-vous utiliser BagVoyage ?",
              "Les bonnes coordonnées pour les bonnes rencontres.",
              "Choisissez un mot de passe unique pour votre compte.",
              "Préparez votre vérification, à votre rythme.",
            ][step]
          }
        </p>
        {user ? (
          <div className="bv-session-card">
            <h3>Vous êtes déjà connecté, {user.name}.</h3>
            <a className="bv-primary" href="#tracking">
              Voir mes expéditions
              <ArrowRight size={18} />
            </a>
          </div>
        ) : (
          <form className="bv-form" onSubmit={submit}>
            {step === 0 && (
              <>
                <div className="bv-oauth-group mb-4">
                  <button
                    type="button"
                    className="bv-oauth-btn google"
                    onClick={() => openGoogleModal()}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    <span>Inscription instantanée avec Google</span>
                  </button>
                </div>
                <div className="bv-auth-divider mb-4">
                  <span>ou créez votre compte étape par étape</span>
                </div>
                <fieldset className="bv-role-options">
                  <legend className="sr-only">Choisissez votre rôle</legend>
                  {roles.map(({ id, label, detail, Icon }) => (
                    <label key={id} className={roleId === id ? "selected" : ""}>
                      <input
                        type="radio"
                        name="account-role"
                        value={id}
                        checked={roleId === id}
                        onChange={() => setRoleId(id)}
                      />
                      <Icon size={23} />
                      <span>
                        <strong>{label}</strong>
                        <small>{detail}</small>
                      </span>
                      <span className="bv-role-check">
                        {roleId === id && <Check size={14} />}
                      </span>
                    </label>
                  ))}
                </fieldset>
              </>
            )}
            {step === 1 && (
              <>
                <div className="bv-form-grid">
                  <label>
                    Prénom
                    <input
                      autoComplete="given-name"
                      required
                      maxLength={80}
                      value={input.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                    />
                  </label>
                  <label>
                    Nom
                    <input
                      autoComplete="family-name"
                      required
                      maxLength={80}
                      value={input.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                    />
                  </label>
                </div>
                <label>
                  Nom d’utilisateur
                  <input
                    autoComplete="username"
                    required
                    minLength={3}
                    maxLength={40}
                    value={input.username}
                    onChange={(e) => set("username", e.target.value)}
                  />
                </label>
                <label>
                  Adresse e-mail
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={input.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </label>
                <div className="bv-form-grid">
                  <label>
                    Date de naissance
                    <input
                      type="date"
                      autoComplete="bday"
                      max={new Date(Date.now() - 86400000)
                        .toISOString()
                        .slice(0, 10)}
                      required
                      value={input.birthDate}
                      onChange={(e) => set("birthDate", e.target.value)}
                    />
                  </label>
                  <label>
                    Ville
                    <input
                      autoComplete="address-level2"
                      required
                      maxLength={100}
                      value={input.city}
                      onChange={(e) => set("city", e.target.value)}
                    />
                  </label>
                </div>
                <div className="bv-phone-fields">
                  <div className="bv-dial-selector">
                    <span className="bv-dial-label">Indicatif</span>
                    <div className="bv-dial-chips" role="group" aria-label="Indicatif téléphonique">
                      {[
                        { code: "+33", label: "FR +33" },
                        { code: "+213", label: "DZ +213" },
                        { code: "+32", label: "BE +32" },
                        { code: "+212", label: "MA +212" },
                        { code: "+216", label: "TN +216" },
                        { code: "+1", label: "CA/US +1" },
                      ].map(({ code, label }) => (
                        <button
                          key={code}
                          type="button"
                          className={`bv-dial-chip ${dialCode === code ? "active" : ""}`}
                          onClick={() => setDialCode(code)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label>
                    Téléphone
                    <input
                      type="tel"
                      autoComplete="tel-national"
                      required
                      maxLength={20}
                      placeholder="6 12 34 56 78"
                      value={input.phone}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </label>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <label>
                  Mot de passe
                  <span className="bv-password-field">
                    <input
                      type={visible ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={input.password}
                      onChange={(e) => set("password", e.target.value)}
                      aria-describedby="bv-password-criteria"
                    />
                    <button
                      type="button"
                      aria-label={
                        visible
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                      aria-pressed={visible}
                      onClick={() => setVisible(!visible)}
                    >
                      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </span>
                </label>
                <div
                  className="bv-password-strength"
                  role="meter"
                  aria-label="Force du mot de passe"
                  aria-valuemin={0}
                  aria-valuemax={4}
                  aria-valuenow={strength}
                  aria-valuetext={`${strength} critères sur 4`}
                >
                  {criteria.map((c, i) => (
                    <span
                      key={c.label}
                      className={i < strength ? "filled" : ""}
                    />
                  ))}
                </div>
                <ul id="bv-password-criteria" className="bv-password-criteria">
                  {criteria.map((c) => (
                    <li key={c.label} className={c.met ? "met" : ""}>
                      <Check size={15} />
                      <span>{c.label}</span>
                      <span className="sr-only">
                        {c.met ? "Respecté" : "Non respecté"}
                      </span>
                    </li>
                  ))}
                </ul>
                <label>
                  Confirmer le mot de passe
                  <span className="bv-password-field">
                    <input
                      type={confirmVisible ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmation}
                      onChange={(e) => setConfirmation(e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label={
                        confirmVisible
                          ? "Masquer la confirmation du mot de passe"
                          : "Afficher la confirmation du mot de passe"
                      }
                      aria-pressed={confirmVisible}
                      onClick={() => setConfirmVisible(!confirmVisible)}
                    >
                      {confirmVisible ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </span>
                </label>
              </>
            )}
            {step === 3 && (
              <>
                <div
                  className={`bv-kyc-panel ${kyc === "scanning" ? "scanning" : ""}`}
                >
                  <Fingerprint size={56} />
                  <h3>Une identité, plus de confiance.</h3>
                  <p>
                    Découvrez le contrôle biométrique en simulation, ou préparez
                    votre dossier plus tard depuis votre profil.
                  </p>
                  <button
                    type="button"
                    className="bv-secondary"
                    disabled={kyc === "scanning"}
                    onClick={() => {
                      setDeferred(false);
                      setKyc("scanning");
                    }}
                  >
                    {kyc === "scanning"
                      ? "Simulation en cours…"
                      : "Simuler le contrôle biométrique"}
                  </button>
                  <p role="status">
                    {kyc === "simulated"
                      ? "Votre compte est créé et votre profil est actif. Votre identité reste en attente de vérification."
                      : "Aucune donnée biométrique collectée."}
                  </p>
                </div>
                <label className="bv-checkbox">
                  <input
                    type="checkbox"
                    checked={deferred}
                    onChange={(e) => setDeferred(e.target.checked)}
                    disabled={kyc === "scanning"}
                  />
                  Effectuer ma vérification plus tard
                </label>
                <label className="bv-checkbox">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>
                    J’accepte les{" "}
                    <button
                      type="button"
                      className="bv-text-button"
                      onClick={() => setTerms(true)}
                    >
                      conditions générales d’utilisation de BagVoyage
                    </button>
                    .
                  </span>
                </label>
                <p className="bv-fine-print">
                  <ShieldCheck size={15} />
                  Votre compte sera créé sur cet appareil avec un statut KYC en
                  attente.
                </p>
              </>
            )}
            {error && (
              <p className="bv-error" role="alert">
                {error}
              </p>
            )}
            <div className="bv-step-actions">
              {step > 0 && (
                <button
                  type="button"
                  className="bv-secondary"
                  disabled={busy}
                  onClick={() => {
                    setError("");
                    setStep(step - 1);
                  }}
                >
                  <ArrowLeft size={17} />
                  Retour
                </button>
              )}
              <button
                className="bv-primary"
                type="submit"
                disabled={busy || kyc === "scanning"}
              >
                {busy
                  ? "Création du compte…"
                  : step === 3
                    ? "Créer mon compte"
                    : "Continuer"}
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
      {terms && (
        <Dialog
          title="Conditions Générales d’Utilisation (CGU)"
          onClose={() => setTerms(false)}
        >
          <p>
            BagVoyage sécurise chaque mise en relation par séquestre bancaire et scellé inviolable OACI STEB. Déclarez fidèlement le contenu et la valeur marchande de vos biens. Respectez la réglementation douanière en vigueur.
          </p>
        </Dialog>
      )}
    </AuthPageShell>
  );
}
