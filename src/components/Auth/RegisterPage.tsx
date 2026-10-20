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
  const { register, user } = useAuth();
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
                  <label>
                    Indicatif
                    <select
                      value={dialCode}
                      onChange={(e) => setDialCode(e.target.value)}
                      autoComplete="tel-country-code"
                    >
                      <option value="+33">France +33</option>
                      <option value="+213">Algérie +213</option>
                      <option value="+32">Belgique +32</option>
                      <option value="+41">Suisse +41</option>
                      <option value="+44">Royaume-Uni +44</option>
                      <option value="+49">Allemagne +49</option>
                      <option value="+1">Canada / USA +1</option>
                      <option value="+212">Maroc +212</option>
                      <option value="+216">Tunisie +216</option>
                    </select>
                  </label>
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
                  <input
                    type={visible ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                  />
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
                      ? "Démonstration terminée. Votre identité reste en attente de vérification."
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
                      conditions d’utilisation de la démonstration
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
          title="Conditions de la démonstration"
          onClose={() => setTerms(false)}
        >
          <p>
            Les comptes et les commandes de cette version sont conservés sur
            votre appareil. Aucun paiement ni transport réel n’est réservé par
            la création du compte.
          </p>
          <p>
            Les simulations biométriques ne vérifient pas votre identité.
            N’utilisez pas cette démonstration pour envoyer des documents
            sensibles. Vous restez responsable de l’exactitude des informations
            saisies et du contenu des colis.
          </p>
          <p>
            Les conditions contractuelles de transport, de paiement et de
            traitement des données devront être acceptées séparément lors de
            l’ouverture du service réel.
          </p>
        </Dialog>
      )}
    </AuthPageShell>
  );
}
