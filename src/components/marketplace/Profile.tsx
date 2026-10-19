import {
  Check,
  Wallet,
  ChevronRight,
  Info,
  Package,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Award,
  Clock3,
  MessageCircle,
  Zap,
} from "lucide-react";
export type Intention = "request" | "shop" | "carry";
export function Profile({
  onWallet,
  walletBalance,
  selected,
  onSelect,
  onContinue,
  onLogin,
  onApple,
  onRegister,
  userName,
  kycStatus,
  onLogout,
}: {
  onWallet: () => void;
  walletBalance: string;
  selected: Intention[];
  onSelect: (roles: Intention[]) => void;
  onContinue: () => void;
  onLogin: () => void;
  onApple: () => void;
  onRegister: () => void;
  userName?: string;
  kycStatus?: "verified" | "pending" | "unverified";
  onLogout: () => void;
}) {
  return (
    <section className="profile-page">
      <span className="eyebrow">VOTRE PROFIL, VOS ENVIES</span>
      <h1>Que souhaitez-vous faire ?</h1>
      <p className="profile-subtitle">Un compte, plusieurs possibilités.</p>
      <button className="profile-wallet" onClick={onWallet}>
        <span className="finance-icon">
          <Wallet size={22} />
        </span>
        <span>
          <strong>Mon portefeuille</strong>
          <small>Solde disponible · {walletBalance}</small>
        </span>
        <ChevronRight size={20} />
      </button>
      <div className="intention-list">
        {[
          {
            id: "request" as const,
            Icon: ShoppingBag,
            title: "Je souhaite un article",
            description: "Je précise mon besoin et mon lieu de livraison.",
          },
          {
            id: "shop" as const,
            Icon: Package,
            title: "J’achète et je livre",
            description: "J’achète l’article demandé et je le ramène.",
          },
          {
            id: "carry" as const,
            Icon: Truck,
            title: "Je transporte",
            description: "Je propose la place disponible sur mon trajet.",
          },
        ].map(({ id, Icon, title, description }) => (
          <label
            className={`intention-card ${selected.includes(id) ? "is-selected" : ""}`}
            key={id}
          >
            <span className="intention-icon">
              <Icon size={25} strokeWidth={1.5} />
            </span>
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <input
              type="checkbox"
              aria-label={title}
              checked={selected.includes(id)}
              onChange={() =>
                onSelect(
                  selected.includes(id)
                    ? selected.filter((r) => r !== id)
                    : [...selected, id],
                )
              }
            />
            <span className="checkbox-drawing" aria-hidden="true">
              {selected.includes(id) && <Check size={15} />}
            </span>
          </label>
        ))}
      </div>
      <p className="profile-reassurance">
        <Info size={17} />
        Vous pourrez changer de rôle à tout moment.
      </p>
      <section
        className="verification-panel"
        aria-labelledby="verification-title"
      >
        <div className="verification-heading">
          <h2 id="verification-title">Statut & Vérification</h2>
          <span>Profil de démonstration</span>
        </div>
        <div className="kyc-status">
          <span className="verification-icon">
            <ShieldCheck size={24} />
          </span>
          <div>
            <strong>
              {kycStatus === "pending"
                ? "Identité en attente de vérification"
                : kycStatus === "unverified"
                  ? "Identité non vérifiée"
                  : "Identité vérifiée"}
            </strong>
            <p>
              {kycStatus === "pending"
                ? "Dossier KYC simulé · aucun contrôle réel effectué"
                : kycStatus === "unverified"
                  ? "Selfie et pièce d’identité à fournir"
                  : "Selfie et pièce d’identité validés"}
            </p>
          </div>
          {kycStatus === "pending" ? <Clock3 size={18} /> : <Check size={18} />}
        </div>
        <div className="traveler-status">
          <div className="traveler-status-heading">
            <Award size={24} />
            <div>
              <h3>Super Voyageur</h3>
              <p>La confiance se construit à chaque trajet.</p>
            </div>
          </div>
          <ul className="trust-criteria">
            {[
              { Icon: Zap, label: "Réactivité" },
              { Icon: Clock3, label: "Ponctualité" },
              { Icon: MessageCircle, label: "Échange clair" },
              { Icon: Package, label: "Marchandise intacte" },
            ].map(({ Icon, label }) => (
              <li key={label}>
                <Icon size={16} />
                <span>{label}</span>
                <Check size={14} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <button
        className="primary-button"
        disabled={!selected.length}
        onClick={onContinue}
      >
        Continuer
        <ChevronRight size={18} />
      </button>
      <button className="outline-button apple-button" onClick={onApple}>
        <svg
          width="18"
          height="21"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.05 12.54c.03 3.19 2.8 4.25 2.83 4.27-.02.08-.44 1.52-1.46 3.01-.88 1.28-1.79 2.56-3.22 2.59-1.41.03-1.86-.83-3.47-.83-1.6 0-2.1.81-3.44.86-1.38.05-2.43-1.38-3.31-2.65-1.8-2.6-3.17-7.36-1.32-10.58a5.14 5.14 0 0 1 4.36-2.64c1.36-.02 2.65.92 3.47.92.83 0 2.38-1.14 4.02-.97.69.03 2.61.28 3.84 2.08-.1.06-2.29 1.34-2.27 3.94M14.4 4.8c.73-.88 1.22-2.1 1.09-3.31-1.05.04-2.33.7-3.09 1.58-.68.78-1.28 2.02-1.12 3.21 1.17.09 2.38-.6 3.12-1.48" />
        </svg>
        Continuer avec Apple
      </button>
      {userName ? (
        <p className="profile-login">
          Connecté en mode démo : {userName}.{" "}
          <button onClick={onLogout}>Se déconnecter</button>
        </p>
      ) : (
        <p className="profile-login">
          Déjà inscrit ? <button onClick={onLogin}>Se connecter</button>
          <span className="profile-register">
            Nouveau ici ? <button onClick={onRegister}>Créer un compte</button>
          </span>
        </p>
      )}
    </section>
  );
}
