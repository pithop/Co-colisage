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
  const { signIn, login, user, logout, openGoogleModal } = useAuth();
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
            {/* OAuth Quick Connect */}
            <div className="bv-oauth-group">
              <button
                type="button"
                className="bv-oauth-btn apple"
                onClick={() => {
                  login("apple");
                  finish();
                }}
              >
                <svg width="18" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.05 12.54c.03 3.19 2.8 4.25 2.83 4.27-.02.08-.44 1.52-1.46 3.01-.88 1.28-1.79 2.56-3.22 2.59-1.41.03-1.86-.83-3.47-.83-1.6 0-2.1.81-3.44.86-1.38.05-2.43-1.38-3.31-2.65-1.8-2.6-3.17-7.36-1.32-10.58a5.14 5.14 0 0 1 4.36-2.64c1.36-.02 2.65.92 3.47.92.83 0 2.38-1.14 4.02-.97.69.03 2.61.28 3.84 2.08-.1.06-2.29 1.34-2.27 3.94M14.4 4.8c.73-.88 1.22-2.1 1.09-3.31-1.05.04-2.33.7-3.09 1.58-.68.78-1.28 2.02-1.12 3.21 1.17.09 2.38-.6 3.12-1.48" />
                </svg>
                <span>Continuer avec Apple</span>
              </button>
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
                <span>Continuer avec Google</span>
              </button>
            </div>
            <div className="bv-auth-divider">
              <span>ou avec votre adresse e-mail</span>
            </div>
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
                <div className="bv-label-row">
                  <span>Mot de passe</span>
                  <a
                    href="#reset-password"
                    className="bv-forgot-link"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Un lien de réinitialisation sécurisé a été envoyé à votre adresse e-mail.");
                    }}
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
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
