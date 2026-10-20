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
import { demoUsers, type UserRole } from "../../types/auth";
import { BrandMark } from "../BrandMark";
import { Dialog } from "../marketplace/Dialog";

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
            <span>traversées · repère de démonstration</span>
          </div>
          <div>
            <ShieldCheck size={20} />
            <span>
              Séquestre Stripe Connect
              <small>Intégration à activer en production</small>
            </span>
          </div>
          <div>
            <LockKeyhole size={20} />
            <span>
              Chiffrement AES-256<small>Objectif de sécurité à valider</small>
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
  const [passkey, setPasskey] = useState(false);
  const finish = () => {
    window.location.hash = "tracking";
  };
  const demo = (role: UserRole) => {
    login(demoUsers[role].email, role, remember);
    finish();
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
            <div className="bv-divider">
              <span>ou explorer autrement</span>
            </div>
            <button
              className="bv-secondary bv-passkey"
              disabled={busy}
              onClick={() => setPasskey(true)}
            >
              <Fingerprint size={22} /> Passkey / Biométrie <span>Démo</span>
            </button>
            <fieldset className="bv-demo-profiles">
              <legend>Choisir un profil de démonstration</legend>
              {(
                [
                  {
                    role: "voyageur",
                    name: "Karim",
                    detail: "Voyageur",
                    initials: "KB",
                  },
                  {
                    role: "transporteur_pro",
                    name: "TransMed",
                    detail: "Flotte pro",
                    initials: "TM",
                  },
                  {
                    role: "expediteur",
                    name: "Mohamed",
                    detail: "Expéditeur",
                    initials: "MT",
                  },
                ] as const
              ).map((profile) => (
                <button
                  key={profile.role}
                  disabled={busy}
                  onClick={() => demo(profile.role)}
                >
                  <span>{profile.initials}</span>
                  <strong>{profile.name}</strong>
                  <small>{profile.detail}</small>
                </button>
              ))}
            </fieldset>
            <p className="bv-fine-print">
              <LockKeyhole size={13} /> Comptes stockés sur cet appareil. Les
              profils démo utilisent des données fictives.
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
      {passkey && (
        <Dialog
          title="Simulation Passkey / WebAuthn"
          onClose={() => setPasskey(false)}
        >
          <div className="bv-expansion bv-biometric-demo">
            <Fingerprint size={64} />
            <h3>Votre identité, en un geste.</h3>
            <p>
              Cette démonstration reproduit le parcours biométrique. Elle ne
              sollicite aucun capteur et ne crée aucune clé WebAuthn.
            </p>
            <button
              className="bv-primary"
              onClick={() => {
                setPasskey(false);
                demo("voyageur");
              }}
            >
              Simuler la connexion de Karim
              <ArrowRight size={18} />
            </button>
            <button className="bv-secondary" onClick={() => setPasskey(false)}>
              Annuler
            </button>
          </div>
        </Dialog>
      )}
    </AuthPageShell>
  );
}
