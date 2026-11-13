import { useState, useEffect } from "react";
import { useDatabaseQuery } from "../../hooks/useDatabaseQuery";
import { useAuth } from "../../context/AuthContext";
import { validBankDetails } from "../../data/wallet";
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
  UserCheck,
  AlertCircle,
  Sliders,
  Globe,
  Edit3,
  Save,
  CreditCard,
  Building,
  Plane,
} from "lucide-react";
import { saveRecord, saveProfile } from "../../services/productionDb";
import { ThemeToggle } from "../common/ThemeToggle";
import { LanguageSelector } from "../../context/LanguageContext";
export type Intention = "request" | "shop" | "carry" | "send" | "receive";
export function Profile({
  actorId,
  userEmail,
  onPublishRole,
  onPro,
  onMessages,
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
  autoAccept,
  onAutoAcceptChange,
  onTrust,
  onOpenVoyageurDashboard,
  onOpenExpediteurDashboard,
  onOpenCarrierDashboard,
}: {
  actorId: string;
  userEmail?: string;
  onPublishRole: (kind: "requests" | "trips" | "parcel") => void;
  onPro: () => void;
  onMessages: () => void;
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
  autoAccept: boolean;
  onAutoAcceptChange: (enabled: boolean) => void;
  onTrust?: () => void;
  onOpenVoyageurDashboard?: () => void;
  onOpenExpediteurDashboard?: () => void;
  onOpenCarrierDashboard?: () => void;
}) {
  const { user, profileSelection, setProfileSelection, isKycVerified, openKycModal, openGoogleModal } = useAuth();
  const [activeRole, setActiveRole] = useState<
    "carry" | "send" | "request" | "receive"
  >("request");

  const [editingProfile, setEditingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);
  const [ibanError, setIbanError] = useState("");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || userName || "Amine Belkacem",
    phone: user?.phone || "+33 6 12 34 56 78",
    city: user?.city || "Paris",
    homeAirport: user?.homeAirport || "CDG",
    bio: user?.bio || "Voyageur régulier entre la France et l'Algérie. Engagé pour des remises fiables et ponctuelles.",
    iban: user?.iban || "FR7630001007941234567890185",
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
        city: user.city || "Paris",
        homeAirport: user.homeAirport || "CDG",
        bio: user.bio || "",
        iban: user.iban || "",
      });
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIbanError("");

    if (profileForm.iban.trim() && !validBankDetails(profileForm.iban)) {
      setIbanError("IBAN ou RIB invalide. Saisissez un format SEPA valide ou un RIB à 20 chiffres.");
      return;
    }

    setSaveBusy(true);
    try {
      const updatedUser = {
        ...user,
        name: profileForm.name,
        phone: profileForm.phone,
        city: profileForm.city,
        homeAirport: profileForm.homeAirport,
        bio: profileForm.bio,
        iban: profileForm.iban,
      };
      await saveRecord("users", updatedUser);
      await saveProfile({
        id: user.id,
        userId: user.id,
        firstName: profileForm.name.split(" ")[0] || profileForm.name,
        lastName: profileForm.name.split(" ").slice(1).join(" ") || "",
        email: user.email,
        phone: profileForm.phone,
        city: profileForm.city,
        country: user.country || "France",
        bio: profileForm.bio,
        homeAirport: profileForm.homeAirport,
        preferredCorridors: [`${profileForm.city} → Alger ALG`],
        iban: profileForm.iban,
        phoneVerified: true,
        emailVerified: true,
        trustScore: user.trustScore || 98,
        avatarUrl: user.avatar,
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setEditingProfile(false);
    } finally {
      setSaveBusy(false);
    }
  };
  const { rows: trips } = useDatabaseQuery("trips");
  const { rows: requests } = useDatabaseQuery("purchase_requests");
  const { rows: applications } = useDatabaseQuery("pro_applications");
  const application =
    applications.find(
      (row) => row.userId === actorId && row.status !== "rejected",
    ) || applications.find((row) => row.userId === actorId);
  const activities =
    activeRole === "carry"
      ? trips
          .filter((row) => row.ownerId === actorId)
          .map((row) => ({
            id: row.id,
            title: `${row.origin} → ${row.destination}`,
            detail: row.departureDate,
            href: `/#trip/${row.id}`,
          }))
      : requests
          .filter((row) =>
            activeRole === "receive"
              ? !!userEmail &&
                row.recipientEmail?.toLowerCase() === userEmail.toLowerCase()
              : row.ownerId === actorId &&
                (activeRole === "send"
                  ? row.kind === "parcel"
                  : row.kind !== "parcel"),
          )
          .map((row) => ({
            id: row.id,
            title: row.title,
            detail: row.date,
            href: `/#request/${row.id}`,
          }));
  const roleTitles = {
    carry: "Mes trajets",
    send: "Mes envois",
    request: "Mes achats Shop & Go",
    receive: "Mes livraisons à recevoir",
  };
  return (
    <section className="profile-page">
      {/* Apple HIG Account Header */}
      <div className="account-hero-card">
        <div className="account-hero-identity">
          <div className="account-avatar-wrap">
            <div className="account-avatar-ring">
              <span className="account-avatar-initials">
                {userName ? userName.slice(0, 2).toUpperCase() : "BV"}
              </span>
            </div>
            <span className="account-status-dot" aria-hidden="true" />
          </div>
          <div className="account-info">
            <div className="account-name-row">
              <h2>{userName || "Membre Invité"}</h2>
              {isKycVerified ? (
                <span className="eidas-verified-pill">
                  <ShieldCheck size={13} aria-hidden="true" />
                  eIDAS v2.1 Vérifié
                </span>
              ) : (
                <button
                  type="button"
                  onClick={openKycModal}
                  className="kyc-pending-pill"
                >
                  <AlertCircle size={13} aria-hidden="true" />
                  Vérification Requise
                </button>
              )}
            </div>
            <p className="account-email">{userEmail || "Session locale sécurisée"}</p>
            <div className="account-meta-row">
              <span className="account-meta-item">
                <Award size={13} className="text-amber-500" />
                Score Confiance 98/100
              </span>
              <span className="account-meta-item">
                <Clock3 size={13} className="text-blue-500" />
                Membre certifié
              </span>
            </div>
          </div>
        </div>
        {userName ? (
          <button
            type="button"
            className="account-logout-btn"
            onClick={onLogout}
            title="Se déconnecter de la session"
          >
            Déconnexion
          </button>
        ) : (
          <div className="account-auth-actions">
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
              onClick={openGoogleModal}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button type="button" className="account-login-btn" onClick={onLogin}>
              Connexion
            </button>
            <button type="button" className="account-reg-btn" onClick={onRegister}>
              Inscription
            </button>
          </div>
        )}
      </div>

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

      {/* Profile Selection & Activation */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-4 my-2 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck size={18} className="text-blue-600 dark:text-blue-400" />
              Choix de vos profils applicatifs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sélectionnez si vous souhaitez utiliser l'application comme Voyageur (Shop &amp; Go), Expéditeur (Bag &amp; Go), ou les deux.
            </p>
          </div>
          {isKycVerified ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0 self-start sm:self-auto">
              <ShieldCheck size={13} />
              eIDAS Vérifié
            </span>
          ) : (
            <button
              type="button"
              onClick={openKycModal}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 transition-colors shrink-0 self-start sm:self-auto"
            >
              <AlertCircle size={13} />
              Déposer mes documents
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {[
            {
              id: "voyageur" as const,
              title: "Voyageur (Shop & Go)",
              desc: "Rentabiliser mes kilos et faire des achats",
              reqKyc: true,
            },
            {
              id: "expediteur" as const,
              title: "Expéditeur (Bag & Go)",
              desc: "Trouver un voyageur et expédier mes colis",
              reqKyc: false,
            },
            {
              id: "both" as const,
              title: "Les 2 Profils",
              desc: "Accès complet aux deux plateformes",
              reqKyc: true,
            },
          ].map((item) => {
            const active = (profileSelection || "both") === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  const res = setProfileSelection(item.id);
                  if (!res.success && res.requiresKyc) {
                    openKycModal();
                  }
                }}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  active
                    ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20 shadow-xs"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                {active && (
                  <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}
                <div className="font-semibold text-xs mb-1 flex items-center gap-1.5">
                  <span>{item.title}</span>
                  {item.reqKyc && !isKycVerified && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 font-normal">
                      KYC requis
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Informations Personnelles & Coordonnées Bancaires */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-4 my-2 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard size={18} className="text-blue-600 dark:text-blue-400" />
              Identité &amp; Coordonnées Bancaires
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Gérez votre profil public et vos coordonnées bancaires pour les virements instantanés.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 animate-in fade-in">
                <Check size={13} />
                Enregistré dans la base de données
              </span>
            )}
            {!editingProfile ? (
              <button
                type="button"
                onClick={() => setEditingProfile(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
              >
                <Edit3 size={14} />
                Modifier mon profil
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
              >
                Annuler
              </button>
            )}
          </div>
        </div>

        {editingProfile ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Nom et prénom
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Téléphone
                </label>
                <input
                  type="tel"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Ville de résidence
                </label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Aéroport de rattachement
                </label>
                <input
                  type="text"
                  placeholder="ex. CDG, ORY, LYS, MRS, ALG, ORN"
                  value={profileForm.homeAirport}
                  onChange={(e) => setProfileForm({ ...profileForm, homeAirport: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Biographie &amp; Engagement de confiance
              </label>
              <textarea
                rows={2}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                IBAN pour le virement de vos gains (Stripe Payout)
              </label>
              <input
                type="text"
                value={profileForm.iban}
                placeholder="Ex. FR76... ou RIB à 20 chiffres"
                onChange={(e) => {
                  setProfileForm({ ...profileForm, iban: e.target.value });
                  if (ibanError) setIbanError("");
                }}
                className={`w-full px-3 py-2 rounded-xl border ${
                  ibanError
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-slate-200 dark:border-slate-700"
                } bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {ibanError && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{ibanError}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                disabled={saveBusy}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5"
              >
                <Save size={14} />
                {saveBusy ? "Sauvegarde..." : "Sauvegarder dans la base"}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Contact</span>
              <strong className="text-xs text-slate-900 dark:text-white block">{profileForm.name}</strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{profileForm.phone}</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Localisation</span>
              <strong className="text-xs text-slate-900 dark:text-white block">{profileForm.city}</strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Hub aérien : {profileForm.homeAirport}</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 sm:col-span-2 lg:col-span-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Virement Bancaire (SEPA / Algérie)</span>
              <strong className="text-xs font-mono text-slate-900 dark:text-white block">
                {profileForm.iban ? `${profileForm.iban.slice(0, 4)} •••• •••• •••• ${profileForm.iban.slice(-4)}` : "Non renseigné"}
              </strong>
              {profileForm.iban && validBankDetails(profileForm.iban) ? (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                  <ShieldCheck size={12} />
                  Stripe Connect Actif · Prêt pour virement
                </span>
              ) : (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium inline-flex items-center gap-1">
                  <AlertCircle size={12} />
                  {profileForm.iban ? "Coordonnées à corriger" : "IBAN / RIB manquant"}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <section className="role-workspace" aria-label="Mes quatre rôles">
        <div className="role-tabs" aria-label="Choisir une activité">
          {(
            [
              { id: "carry", label: "Transporteur", Icon: Truck },
              { id: "send", label: "Envoyeur", Icon: Package },
              { id: "request", label: "Acheteur", Icon: ShoppingBag },
              { id: "receive", label: "Receveur", Icon: ShieldCheck },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              aria-pressed={activeRole === id}
              onClick={() => setActiveRole(id)}
            >
              <Icon size={22} strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>
        <div className="role-content">
          <h2>{roleTitles[activeRole]}</h2>
          <p>
            {activeRole === "receive"
              ? "Retrouvez les colis adressés à votre compte. Validez la remise par QR code ou PIN dans la conversation."
              : "Toutes vos activités restent accessibles avec le même compte."}
          </p>
          <label className="check-row">
            <input
              type="checkbox"
              checked={selected.includes(activeRole)}
              onChange={() =>
                onSelect(
                  selected.includes(activeRole)
                    ? selected.filter((role) => role !== activeRole)
                    : [...selected, activeRole],
                )
              }
            />
            Activer ce rôle dans mes préférences
          </label>
          {activities.length ? (
            <ul>
              {activities.map((activity) => (
                <li key={activity.id}>
                  <a href={activity.href}>
                    <span>{activity.title}</span>
                    <small>{activity.detail}</small>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune activité pour ce rôle pour le moment.</p>
          )}
          <div className="role-actions-group">
            <button
              className="primary-button"
              onClick={() =>
                activeRole === "receive"
                  ? onMessages()
                  : onPublishRole(
                      activeRole === "carry"
                        ? "trips"
                        : activeRole === "send"
                          ? "parcel"
                          : "requests",
                    )
              }
            >
              {activeRole === "receive"
                ? "Valider une livraison"
                : activeRole === "carry"
                  ? "Proposer un trajet"
                  : activeRole === "send"
                    ? "Envoyer un colis"
                    : "Créer une liste d’achats"}
              <ChevronRight size={17} />
            </button>
            {activeRole === "carry" && onOpenVoyageurDashboard && (
              <button
                type="button"
                className="role-dashboard-button"
                onClick={onOpenVoyageurDashboard}
              >
                Tableau de bord Voyageur
              </button>
            )}
            {activeRole === "send" && onOpenExpediteurDashboard && (
              <button
                type="button"
                className="role-dashboard-button"
                onClick={onOpenExpediteurDashboard}
              >
                Tableau de bord Expéditeur
              </button>
            )}
          </div>
        </div>
      </section>
      <div className="pro-entry">
        <ShieldCheck size={24} />
        <div>
          <strong>
            {application?.status === "approved"
              ? "Transporteur Professionnel Vérifié"
              : "Votre espace professionnel"}
          </strong>
          <p>
            {application?.status === "pending"
              ? "Dossier en cours d’examen."
              : application?.status === "rejected"
                ? `Dossier rejeté : ${application.reason}`
                : application?.status === "approved"
                  ? application.companyName
                  : "Entreprise, documents et flotte en un seul dossier."}
            </p>
          </div>
          {application?.status === "approved" && onOpenCarrierDashboard && (
            <button type="button" className="role-dashboard-button" onClick={onOpenCarrierDashboard}>
              Tableau de bord Pro
            </button>
          )}
          {(!application || application.status === "rejected") && (
            <button onClick={onPro}>Devenir transporteur pro</button>
          )}
        </div>
      <div className="trust-hub-card">
        <ShieldCheck size={24} />
        <div>
          <strong>Centre de Confiance & Vérification</strong>
          <p>
            Vérification mobile SMS, pièce d'identité et certification Stripe Identity pour sécuriser vos remises.
          </p>
        </div>
        {onTrust && (
          <button type="button" onClick={onTrust}>Vérifier mon profil</button>
        )}
      </div>
      <div className="profile-preferences-header">
        <h3>Préférences de recherche dans Explorer</h3>
        <p>Sélectionnez les catégories d’annonces à afficher en priorité lors de votre navigation.</p>
      </div>
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
          <span>Votre identité BagVoyage</span>
        </div>
        <div className="kyc-status">
          <span className="verification-icon">
            <ShieldCheck size={24} />
          </span>
          <div>
            <strong>
              {kycStatus === "pending"
                ? "Identité en attente de vérification"
                : kycStatus !== "verified"
                  ? "Identité non vérifiée"
                  : "Identité vérifiée"}
            </strong>
            <p>
              {kycStatus === "pending"
                ? "Dossier en attente de contrôle d’identité"
                : kycStatus !== "verified"
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
              <h3>Statut Super Voyageur</h3>
              <p>
                {(user?.completedDeliveries || 0) >= 5
                  ? "La confiance se construit à chaque trajet."
                  : "Complétez vos 5 premières missions pour débloquer le badge Super Voyageur."}
              </p>
            </div>
          </div>
          <ul className="trust-criteria">
            {[
              {
                Icon: Zap,
                label: "Réactivité de réponse",
                value: (user?.completedDeliveries || 0) >= 5 ? 98 : 0,
                max: 100,
                display: (user?.completedDeliveries || 0) >= 5 ? "98%" : "--",
                detail: (user?.completedDeliveries || 0) >= 5
                  ? "Réponse en moins de 15 min pour 98% des échanges."
                  : "Calculé automatiquement après vos premiers échanges en direct.",
              },
              {
                Icon: Clock3,
                label: "Ponctualité",
                value: (user?.completedDeliveries || 0) >= 5 ? 99 : 0,
                max: 100,
                display: (user?.completedDeliveries || 0) >= 5 ? "99%" : "--",
                detail: (user?.completedDeliveries || 0) >= 5
                  ? "99% des rendez-vous honorés à l’heure convenue."
                  : "Calculé après votre première remise de colis.",
              },
              {
                Icon: MessageCircle,
                label: "Échange clair",
                value: (user?.reviewsCount || 0) > 0 ? (user?.rating || 5) : 0,
                max: 5,
                display: (user?.reviewsCount || 0) > 0 ? `${(user?.rating || 5.0).toFixed(1)} / 5` : "--",
                detail: (user?.reviewsCount || 0) > 0
                  ? `Note moyenne basée sur ${user?.reviewsCount} avis client.`
                  : "Calculé à partir des avis reçus des expéditeurs.",
              },
              {
                Icon: Package,
                label: "Marchandise intacte",
                value: (user?.completedDeliveries || 0) >= 5 ? 100 : 0,
                max: 100,
                display: (user?.completedDeliveries || 0) >= 5 ? "100%" : "--",
                detail: (user?.completedDeliveries || 0) >= 5
                  ? "100% des marchandises remises en bon état."
                  : "Calculé à partir de vos livraisons validées par code PIN.",
              },
            ].map(({ Icon, label, value, max, display, detail }, index) => (
              <li key={label}>
                <details className="reputation-criterion">
                  <summary>
                    <span>
                      <Icon size={16} />
                      <span>{label}</span>
                      <strong>{display}</strong>
                      <ChevronRight size={14} />
                    </span>
                    <span
                      className="reputation-track"
                      role="progressbar"
                      aria-label={label}
                      aria-valuemin={0}
                      aria-valuemax={max}
                      aria-valuenow={value}
                      aria-valuetext={display}
                      aria-describedby={`reputation-detail-${index}`}
                    >
                      <span style={{ width: `${(value / max) * 100}%` }} />
                    </span>
                  </summary>
                  <p id={`reputation-detail-${index}`}>{detail}</p>
                </details>
              </li>
            ))}
          </ul>
          <p className="reputation-note">
            Sélectionnez un critère pour découvrir son détail.
          </p>
        </div>
      </section>
      <div className="instant-preference">
        <span className="instant-preference-icon">
          <Zap size={20} />
        </span>
        <div>
          <label htmlFor="profile-auto-accept">
            Acceptation automatique instantanée
          </label>
          <p id="auto-accept-hint">
            Profils vérifiés uniquement. Réglage par défaut de vos nouveaux
            trajets.
          </p>
        </div>
        <input
          id="profile-auto-accept"
          className="preference-switch"
          type="checkbox"
          role="switch"
          checked={autoAccept}
          onChange={(event) => onAutoAcceptChange(event.target.checked)}
          aria-describedby="auto-accept-hint"
        />
      </div>

      {/* Paramètres & Affichage (Langue & Thème) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-4 my-2 text-left">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders size={18} className="text-blue-600 dark:text-blue-400" />
            Paramètres &amp; Affichage
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Personnalisez votre langue d'affichage et le thème visuel de BagVoyage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Langue</span>
            </div>
            <LanguageSelector location="footer" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Mode sombre / clair</span>
            </div>
            <ThemeToggle showLabel className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium" />
          </div>
        </div>
      </div>

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
          Connecté : {userName}.{" "}
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
