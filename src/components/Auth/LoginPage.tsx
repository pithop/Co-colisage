import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Fingerprint,
  Globe2,
  LockKeyhole,
  Plane,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { BrandMark } from "../BrandMark";

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="bv-expansion bv-auth-shell">
      <aside className="bv-auth-brand">
        <a href="#explore" aria-label="BagVoyage, retour à l’accueil">
          <BrandMark />
        </a>
        <div className="bv-auth-brand-copy">
          <span className="bv-eyebrow">LA DISTANCE NOUS RAPPROCHE</span>
          <h1>
            Deux rives.
            <br />
            Des milliers
            <br />
            de liens.
          </h1>
          <p>
            Un voyage, une rencontre, un colis qui arrive. Votre prochain lien
            commence ici.
          </p>
        </div>
        <div className="bv-auth-orbit" aria-hidden="true">
          <div />
          <div />
          <span className="bv-orbit-city paris">PARIS</span>
          <span className="bv-orbit-city alger">ALGER</span>
          <Plane size={32} />
        </div>
        <div className="bv-brand-metrics">
          <div>
            <strong>18 400+</strong>
            <span>traversées sécurisées</span>
          </div>
          <div>
            <ShieldCheck size={20} />
            <span>
              Séquestre Stripe Connect
              <small>Intégration bancaire certifiée</small>
            </span>
          </div>
          <div>
            <LockKeyhole size={20} />
            <span>
              Chiffrement AES-256<small>Protection des échanges et des données</small>
            </span>
          </div>
        </div>
        <footer>
          <Globe2 size={15} /> France / Algérie{" "}
          <span>Chaque trajet compte.</span>
        </footer>
      </aside>
      <section className="bv-auth-form-panel">{children}</section>
    </div>
  );
}
export function LoginPage() {
  const { signIn, login, user, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const finish = () => {
    window.location.hash = "tracking";
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      await signIn(email, password, remember);
      finish();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "La connexion a échoué. Réessayez.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthPageShell>
      <div className="bv-auth-topline">
        <span>Pas encore de compte ?</span>
        <a href="#register">
          Rejoindre BagVoyage <ArrowUpRight size={15} />
        </a>
      </div>
      <div className="bv-auth-content">
        <span className="bv-eyebrow">HEUREUX DE VOUS RETROUVER</span>
        <h2>
          Reprenons
          <br />
          le voyage.
        </h2>
        <p className="bv-muted">
          Vos trajets, vos colis, vos possibilités. Au même endroit.
        </p>
        {user ? (
          <div className="bv-session-card">
            <ShieldCheck size={26} />
            <h3>Connecté en tant que {user.name}</h3>
            <a className="bv-primary" href="#tracking">
              Voir mes expéditions
              <ArrowRight size={18} />
            </a>
            <button className="bv-secondary" onClick={logout}>
              Se déconnecter
            </button>
          </div>
        ) : (
          <>
            <form className="bv-form" onSubmit={submit}>
              <label>
                Adresse e-mail
                <input
                  type="email"
                  autoComplete="username"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.fr"
                />
              </label>
              <label>
                Mot de passe
                <span className="bv-password-field">
                  <input
                    type={visible ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    {visible ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </span>
              </label>
              <label className="bv-checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Rester connecté sur cet appareil
              </label>
              {error && (
                <p className="bv-error" role="alert">
                  {error}
                </p>
              )}
              <button className="bv-primary" disabled={busy} type="submit">
                {busy ? "Connexion en cours…" : "Se connecter"}
                <ArrowRight size={18} />
              </button>
            </form>
            <p className="bv-fine-print">
              <LockKeyhole size={13} /> Authentification sécurisée BagVoyage. Données de session chiffrées localement.
            </p>
          </>
        )}
      </div>
      <footer className="bv-auth-footer">
        Un lien de confiance, d’une rive à l’autre.
        <a href="#explore">
          Explorer la plateforme
          <ArrowUpRight size={14} />
        </a>
      </footer>
    </AuthPageShell>
  );
}
