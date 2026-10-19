import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  Check,
  FileCheck,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { demoUsers, UserRole } from "../../types/auth";
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
        <input
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
              next.size > 10 * 1024 * 1024 ||
              next.size === 0
            ) {
              setError(
                "Choisissez un fichier JPG, PNG ou WebP" +
                  (!selfie ? " ou PDF" : "") +
                  " de moins de 10 Mo.",
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
      {preview && <img src={preview} alt={`Aperçu : ${label}`} />}
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
  const [demoIdentity, setDemoIdentity] = useState(false);
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
    if (tab === "register" && !demoIdentity && (!selfie || !identity)) {
      setError("Ajoutez un selfie et une pièce d’identité pour continuer.");
      return;
    }
    setBusy(true);
    try {
      if (tab === "login") await signIn(profile.email, profile.password);
      else await register(profile);
      if (mounted.current)
        onSuccess(
          tab === "login"
            ? "Vous êtes connecté à votre compte local."
            : "Votre compte local a été créé. Le contrôle d’identité reste en attente en mode démo.",
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
          avec un compte de démonstration.
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
        Démonstration locale : le compte est enregistré sur cet appareil. Aucun
        service d’authentification ou de vérification d’identité externe n’est
        connecté.
      </p>
      {tab === "login" && (
        <section
          className="demo-accounts"
          aria-label="Comptes de démonstration"
        >
          <h3>Tester en un clic</h3>
          {roles.map(({ role, label }) => (
            <button
              key={role}
              className="outline-button"
              disabled={busy}
              onClick={() => {
                login(demoUsers[role].email, role);
                onSuccess(
                  `Vous êtes connecté au compte de démonstration de ${demoUsers[role].name}.`,
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
              onSuccess("Vous êtes connecté au compte de démonstration.");
            }}
          >
            Continuer en démonstration
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
              <label>
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
          </>
        ) : (
          <>
            <h3 ref={stepHeading} tabIndex={-1}>
              Vérification d’identité KYC
            </h3>
            <p className="muted">
              Ajoutez un selfie et une pièce d’identité, ou utilisez les
              justificatifs de démonstration. Les fichiers restent en mémoire
              pendant cette étape ; ils ne sont ni transmis ni conservés après
              fermeture.
            </p>
            <IdentityUpload
              label="Selfie"
              selfie
              file={selfie}
              onChange={(file) => {
                setSelfie(file);
                setDemoIdentity(false);
              }}
            />
            <IdentityUpload
              label="Pièce d’identité"
              file={identity}
              onChange={(file) => {
                setIdentity(file);
                setDemoIdentity(false);
              }}
            />
            <button
              type="button"
              className="outline-button"
              onClick={() => {
                setDemoIdentity(true);
                setError("");
              }}
            >
              Utiliser des justificatifs de démonstration
            </button>
            {demoIdentity && (
              <p role="status" className="info-box">
                <Check size={18} />
                Selfie et pièce d’identité de démonstration sélectionnés.
              </p>
            )}
            <p className="demo-note">
              Le dépôt simule un dossier KYC. L’identité reste en attente de
              vérification ; aucune validation réelle n’est effectuée.
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
              !demoIdentity &&
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
