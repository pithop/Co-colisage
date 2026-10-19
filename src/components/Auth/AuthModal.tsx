import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  Check,
  FileCheck,
  ShieldCheck,
  UserRound,
  Upload,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { demoUsers, UserRole } from "../../types/auth";
import { readAttachment } from "../../services/uploads";
import { Registration } from "../../lib/localAuth";
import { Dialog } from "../marketplace/Dialog";

const emptyProfile: Registration = {
  username: "",
  firstName: "",
  lastName: "",
  birthDate: "",
  city: "",
  phone: "",
  email: "",
  password: "",
  role: "voyageur",
};
const roles: { role: UserRole; label: string }[] = [
  { role: "voyageur", label: "Karim (Voyageur)" },
  { role: "transporteur_pro", label: "TransMed (Pro)" },
  { role: "expediteur", label: "Mohamed (Client)" },
];

function IdentityUpload({
  label,
  selfie,
  file,
  onChange,
}: {
  label: string;
  selfie?: boolean;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return (
    <div className="identity-upload">
      <label>
        <span>
          {selfie ? <Camera size={20} /> : <FileCheck size={20} />}
          {label}
        </span>
        <span className="identity-file-action" aria-hidden="true">
          <Upload size={16} /> Choisir un fichier
        </span>
        <input
          className="identity-file-input"
          aria-label={label}
          type="file"
          accept={
            selfie
              ? "image/jpeg,image/png,image/webp"
              : "image/jpeg,image/png,image/webp,application/pdf"
          }
          capture={selfie ? "user" : undefined}
          onChange={(event) => {
            const next = event.target.files?.[0];
            if (!next) return;
            const allowed = [
              "image/jpeg",
              "image/png",
              "image/webp",
              ...(!selfie ? ["application/pdf"] : []),
            ];
            if (
              !allowed.includes(next.type) ||
              next.size > 4 * 1024 * 1024 ||
              next.size === 0
            ) {
              setError(
                "Choisissez un fichier JPG, PNG ou WebP" +
                  (!selfie ? " ou PDF" : "") +
                  " de 4 Mo maximum.",
              );
              onChange(null);
              event.target.value = "";
              return;
            }
            setError("");
            onChange(next);
          }}
        />
      </label>
      <div
        className={`identity-viewfinder ${selfie ? "selfie-viewfinder" : "document-viewfinder"}`}
      >
        <button
          type="button"
          className="scanner-capture"
          aria-label={
            selfie ? "Cadrer mon selfie" : "Cadrer ma pièce d’identité"
          }
          onClick={(event) =>
            event.currentTarget
              .closest(".identity-upload")
              ?.querySelector("input")
              ?.click()
          }
        >
          {preview ? (
            <img src={preview} alt={`Aperçu : ${label}`} />
          ) : selfie ? (
            <UserRound size={68} strokeWidth={1} />
          ) : (
            <FileCheck size={56} strokeWidth={1} />
          )}
          <span
            className={
              selfie ? "biometric-oval-scanner" : "document-corner-scanner"
            }
            aria-hidden="true"
          >
            <i />
            <i />
            <i />
            <i />
            <span className="identity-laser" />
          </span>
          <span className="scanner-guidance">
            {file
              ? "Capture reçue · contrôle en attente"
              : selfie
                ? "Placez votre visage au centre"
                : "Alignez les quatre coins du document"}
          </span>
        </button>
      </div>
      {file && (
        <p className="upload-status">
          <Check size={16} />
          {file.name}
        </p>
      )}
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
    </div>
  );
}

export function AuthModal({
  initialTab = "login",
  apple = false,
  onClose,
  onSuccess,
}: {
  initialTab?: "login" | "register";
  apple?: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}) {
  const { login, signIn, register } = useAuth();
  const [tab, setTab] = useState(initialTab);
  const [step, setStep] = useState<"profile" | "identity">("profile");
  const [profile, setProfile] = useState(emptyProfile);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [identity, setIdentity] = useState<File | null>(null);
  const [identityDeferred, setIdentityDeferred] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const mounted = useRef(true);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (step === "identity") stepHeading.current?.focus();
  }, [step]);
  const passwordCriteria = [
    { label: "8+ caractères", passed: profile.password.length >= 8 },
    { label: "Majuscule", passed: /[A-ZÀ-ÖØ-Þ]/.test(profile.password) },
    { label: "Chiffre", passed: /[0-9]/.test(profile.password) },
    { label: "Symbole", passed: /[^\p{L}\p{N}\s]/u.test(profile.password) },
  ];
  const passwordScore = passwordCriteria.filter(
    (criterion) => criterion.passed,
  ).length;
  const passwordLabel = ["Faible", "Faible", "Moyen", "Fort", "Impénétrable"][
    passwordScore
  ];
  const change = (field: keyof Registration, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setError("");
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError("");
    if (tab === "register" && step === "profile") {
      setStep("identity");
      return;
    }
    if (tab === "register" && !identityDeferred && (!selfie || !identity)) {
      setError("Ajoutez un selfie et une pièce d’identité pour continuer.");
      return;
    }
    setBusy(true);
    try {
      if (tab === "login") await signIn(profile.email, profile.password);
      else
        await register({
          ...profile,
          identityDocuments:
            !identityDeferred && identity && selfie
              ? await Promise.all([
                  readAttachment(identity, true),
                  readAttachment(selfie),
                ])
              : undefined,
        });
      if (mounted.current)
        onSuccess(
          tab === "login"
            ? "Vous êtes connecté à votre compte local."
            : "Votre compte a été créé. Votre identité reste en attente de vérification.",
        );
    } catch (cause) {
      if (mounted.current)
        setError(
          cause instanceof Error
            ? cause.message
            : "Connexion indisponible. Réessayez.",
        );
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  return (
    <Dialog
      title={
        apple
          ? "Continuer avec Apple"
          : tab === "login"
            ? "Se connecter"
            : "Créer un compte"
      }
      onClose={onClose}
    >
      {apple && (
        <p className="info-box">
          <ShieldCheck size={18} />
          La connexion Apple sera disponible lorsque le service
          d’authentification sera connecté. Vous pouvez explorer le parcours
          avec un profil enregistré sur cet appareil.
        </p>
      )}
      <div className="segment auth-tabs" aria-label="Authentification">
        <button
          aria-pressed={tab === "login"}
          disabled={busy}
          onClick={() => {
            setTab("login");
            setError("");
          }}
        >
          Connexion
        </button>
        <button
          aria-pressed={tab === "register"}
          disabled={busy}
          onClick={() => {
            setTab("register");
            setError("");
          }}
        >
          Inscription
        </button>
      </div>
      <p className="demo-note">
        Espace BagVoyage · Vos informations sont enregistrées sur cet appareil.
      </p>
      {tab === "login" && (
        <section className="demo-accounts" aria-label="Profils disponibles">
          <h3>Choisir un profil</h3>
          {roles.map(({ role, label }) => (
            <button
              key={role}
              className="outline-button"
              disabled={busy}
              onClick={() => {
                login(demoUsers[role].email, role);
                onSuccess(
                  `Vous êtes connecté au profil de ${demoUsers[role].name}.`,
                );
              }}
            >
              {label}
              <ArrowRight size={17} />
            </button>
          ))}
          <button
            className="text-button"
            disabled={busy}
            onClick={() => {
              login(demoUsers.voyageur.email, "voyageur");
              onSuccess("Vous êtes connecté au profil voyageur.");
            }}
          >
            Continuer avec le profil voyageur
          </button>
        </section>
      )}
      <form className="publish-form auth-form" onSubmit={submit}>
        {tab === "register" && (
          <ol className="auth-steps" aria-label="Étapes de l’inscription">
            <li aria-current={step === "profile" ? "step" : undefined}>
              1. Votre profil
            </li>
            <li aria-current={step === "identity" ? "step" : undefined}>
              2. Vérification d’identité
            </li>
          </ol>
        )}
        {tab === "login" || step === "profile" ? (
          <>
            {tab === "register" && (
              <>
                <label>
                  Nom d’utilisateur
                  <input
                    required
                    minLength={3}
                    maxLength={40}
                    autoComplete="username"
                    value={profile.username}
                    onChange={(e) => change("username", e.target.value)}
                  />
                </label>
                <div className="form-grid">
                  <label>
                    Prénom
                    <input
                      required
                      maxLength={80}
                      autoComplete="given-name"
                      value={profile.firstName}
                      onChange={(e) => change("firstName", e.target.value)}
                    />
                  </label>
                  <label>
                    Nom
                    <input
                      required
                      maxLength={80}
                      autoComplete="family-name"
                      value={profile.lastName}
                      onChange={(e) => change("lastName", e.target.value)}
                    />
                  </label>
                  <label>
                    Date de naissance
                    <input
                      required
                      type="date"
                      autoComplete="bday"
                      max={new Date().toLocaleDateString("en-CA")}
                      value={profile.birthDate}
                      onChange={(e) => change("birthDate", e.target.value)}
                    />
                  </label>
                  <label>
                    Ville
                    <input
                      required
                      maxLength={100}
                      autoComplete="address-level2"
                      value={profile.city}
                      onChange={(e) => change("city", e.target.value)}
                    />
                  </label>
                </div>
                <label>
                  Téléphone
                  <input
                    required
                    type="tel"
                    autoComplete="tel"
                    minLength={6}
                    maxLength={25}
                    value={profile.phone}
                    onChange={(e) => change("phone", e.target.value)}
                  />
                </label>
              </>
            )}
            <label>
              Adresse e-mail
              <input
                required
                name="email"
                placeholder="vous@exemple.fr"
                type="email"
                autoComplete="email"
                value={profile.email}
                onChange={(e) => change("email", e.target.value)}
              />
            </label>
            <label>
              Mot de passe
              <input
                required
                type="password"
                minLength={tab === "register" ? 8 : undefined}
                autoComplete={
                  tab === "register" ? "new-password" : "current-password"
                }
                value={profile.password}
                onChange={(e) => change("password", e.target.value)}
              />
              {tab === "register" && <small>Au moins 8 caractères.</small>}
            </label>
            {tab === "register" && (
              <section
                className="password-strength"
                aria-label="Robustesse de votre secret"
              >
                <div>
                  <span>Force du mot de passe</span>
                  <strong aria-live="polite">{passwordLabel}</strong>
                </div>
                <div
                  className="password-bars"
                  role="meter"
                  aria-label="Critères de composition"
                  aria-valuemin={0}
                  aria-valuemax={4}
                  aria-valuenow={passwordScore}
                  aria-valuetext={passwordLabel}
                >
                  {passwordCriteria.map((_, index) => (
                    <span
                      key={index}
                      className={
                        index < passwordScore
                          ? `filled strength-${passwordScore}`
                          : ""
                      }
                    />
                  ))}
                </div>
                <ul>
                  {passwordCriteria.map(({ label, passed }) => (
                    <li key={label} className={passed ? "passed" : ""}>
                      <Check size={14} aria-hidden="true" />
                      {label}
                    </li>
                  ))}
                </ul>
                <small>
                  Indication des critères de composition ; privilégiez une
                  phrase longue et unique.
                </small>
              </section>
            )}
            {tab === "register" && (
              <label className="native-control-bridge">
                Je souhaite m’inscrire comme
                <select
                  value={profile.role}
                  onChange={(e) => change("role", e.target.value)}
                >
                  <option value="voyageur">Voyageur</option>
                  <option value="expediteur">Expéditeur</option>
                  <option value="transporteur_pro">
                    Transporteur professionnel
                  </option>
                </select>
              </label>
            )}
            {tab === "register" && (
              <div
                className="auth-role-picker"
                role="group"
                aria-label="Votre activité"
              >
                {(
                  [
                    { role: "voyageur", label: "Voyageur" },
                    { role: "expediteur", label: "Expéditeur" },
                    { role: "transporteur_pro", label: "Professionnel" },
                  ] as const
                ).map(({ role, label }) => (
                  <button
                    type="button"
                    key={role}
                    aria-pressed={profile.role === role}
                    onClick={() => change("role", role)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h3 ref={stepHeading} tabIndex={-1}>
              Vérification d’identité KYC
            </h3>
            <p className="muted">
              Ajoutez un selfie et une pièce d’identité. Utilisez les repères de
              cadrage pour préparer une image nette. Les fichiers restent en
              mémoire pendant cette étape et sont effacés à sa fermeture.
            </p>
            <IdentityUpload
              label="Selfie"
              selfie
              file={selfie}
              onChange={(file) => {
                setSelfie(file);
                setIdentityDeferred(false);
              }}
            />
            <IdentityUpload
              label="Pièce d’identité"
              file={identity}
              onChange={(file) => {
                setIdentity(file);
                setIdentityDeferred(false);
              }}
            />
            <button
              type="button"
              className="outline-button"
              onClick={() => {
                setIdentityDeferred(true);
                setError("");
              }}
            >
              Fournir mes justificatifs plus tard
            </button>
            {identityDeferred && (
              <p role="status" className="info-box">
                <Check size={18} />
                Vous pourrez compléter vos justificatifs ultérieurement. Votre
                identité reste en attente.
              </p>
            )}
            <p className="demo-note">
              Votre identité reste en attente jusqu’au contrôle des
              justificatifs par un service de vérification connecté.
            </p>
          </>
        )}
        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}
        <button
          className="primary-button"
          type="submit"
          disabled={
            busy ||
            (tab === "register" &&
              step === "identity" &&
              !identityDeferred &&
              (!selfie || !identity))
          }
        >
          {busy
            ? "Veuillez patienter…"
            : tab === "login"
              ? "Se connecter"
              : step === "profile"
                ? "Continuer vers la vérification"
                : "Valider mon inscription"}
          <ArrowRight size={18} />
        </button>
        {tab === "register" && step === "identity" && (
          <button
            type="button"
            className="text-button"
            disabled={busy}
            onClick={() => {
              setStep("profile");
              setError("");
            }}
          >
            Retour au profil
          </button>
        )}
      </form>
    </Dialog>
  );
}
