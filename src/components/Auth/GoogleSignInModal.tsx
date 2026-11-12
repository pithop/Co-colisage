import { useState } from "react";
import { ShieldCheck, UserCheck, ArrowRight, X, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { saveUser, saveProfile } from "../../services/productionDb";
import type { User, UserProfile } from "../../types/auth";

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GoogleSignInModal({ isOpen, onClose, onSuccess }: GoogleSignInModalProps) {
  const { loginWithGoogle } = useAuth();
  const [customMode, setCustomMode] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [customCity, setCustomCity] = useState("Paris");
  const [roleSelection, setRoleSelection] = useState<"voyageur" | "expediteur" | "both">("both");
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleSelectAccount = async (account: {
    id: string;
    email: string;
    name: string;
    avatar: string;
    role: "voyageur" | "expediteur";
    city: string;
    country: string;
    phone: string;
    bio: string;
    iban: string;
    homeAirport: string;
  }) => {
    setBusy(true);
    try {
      const userRecord: User = {
        id: account.id,
        name: account.name,
        email: account.email,
        avatar: account.avatar,
        role: account.role,
        activePlatform: account.role === "voyageur" ? "shopandgo" : "bagandgo",
        profileSelection: "both",
        kycStatus: "verified",
        phone: account.phone,
        phoneVerified: true,
        emailVerified: true,
        city: account.city,
        country: account.country,
        homeAirport: account.homeAirport,
        iban: account.iban,
        bio: account.bio,
        rating: 4.9,
        reviewsCount: 24,
        stripeBalance: 150,
        pendingEscrow: 50,
        completedDeliveries: 18,
        activeTripsCount: 1,
        trustScore: 98,
        googleId: `google_oauth_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      const profileRecord: UserProfile = {
        id: account.id,
        userId: account.id,
        firstName: account.name.split(" ")[0] || account.name,
        lastName: account.name.split(" ").slice(1).join(" ") || "",
        email: account.email,
        phone: account.phone,
        city: account.city,
        country: account.country,
        bio: account.bio,
        homeAirport: account.homeAirport,
        preferredCorridors: [`${account.city} → Alger ALG`],
        iban: account.iban,
        phoneVerified: true,
        emailVerified: true,
        trustScore: 98,
        avatarUrl: account.avatar,
        googleSub: `sub_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveUser(userRecord);
      await saveProfile(profileRecord);

      loginWithGoogle(userRecord);
      onClose();
      onSuccess?.();
    } finally {
      setBusy(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customName) return;
    setBusy(true);
    try {
      const id = `user-google-${Date.now()}`;
      const userRecord: User = {
        id,
        name: customName,
        email: customEmail,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        role: roleSelection === "expediteur" ? "expediteur" : "voyageur",
        activePlatform: roleSelection === "expediteur" ? "bagandgo" : "shopandgo",
        profileSelection: roleSelection,
        kycStatus: "verified",
        phone: "+33 6 00 00 00 00",
        phoneVerified: true,
        emailVerified: true,
        city: customCity,
        country: "France",
        homeAirport: "CDG",
        rating: 5.0,
        reviewsCount: 1,
        stripeBalance: 0,
        pendingEscrow: 0,
        completedDeliveries: 0,
        activeTripsCount: 0,
        trustScore: 95,
        googleId: `google_oauth_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      const profileRecord: UserProfile = {
        id,
        userId: id,
        firstName: customName.split(" ")[0] || customName,
        lastName: customName.split(" ").slice(1).join(" ") || "",
        email: customEmail,
        phone: "+33 6 00 00 00 00",
        city: customCity,
        country: "France",
        bio: "Membre BagVoyage authentifié via Google.",
        homeAirport: "CDG",
        preferredCorridors: [`${customCity} → Alger ALG`],
        phoneVerified: true,
        emailVerified: true,
        trustScore: 95,
        avatarUrl: userRecord.avatar,
        googleSub: `sub_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveUser(userRecord);
      await saveProfile(profileRecord);

      loginWithGoogle(userRecord);
      onClose();
      onSuccess?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shadow-xs">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Connexion Google
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                BagVoyage Identity Service
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 p-3.5 flex items-start gap-3">
            <ShieldCheck size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              Sélectionnez un compte Google pré-configuré ou entrez vos identifiants pour tester l’application immédiatement avec persistance IndexedDB.
            </p>
          </div>

          {!customMode ? (
            <div className="space-y-2.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Comptes Google Disponibles
              </span>

              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  handleSelectAccount({
                    id: "user-demo-amine",
                    email: "amine.belkacem@gmail.com",
                    name: "Amine Belkacem",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
                    role: "voyageur",
                    city: "Paris",
                    country: "France",
                    phone: "+33 6 12 34 56 78",
                    bio: "Navette bi-hebdomadaire Paris CDG ✈️ Alger ALG.",
                    iban: "FR7630001007941234567890185",
                    homeAirport: "CDG",
                  })
                }
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                    alt="Amine Belkacem"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Amine Belkacem
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        Voyageur CDG
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      amine.belkacem@gmail.com
                    </span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  handleSelectAccount({
                    id: "user-demo-sarah",
                    email: "sarah.benali@gmail.com",
                    name: "Sarah Benali",
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                    role: "expediteur",
                    city: "Lyon",
                    country: "France",
                    phone: "+33 7 89 01 23 45",
                    bio: "Expéditrice et acheteuse Shop & Go Lyon → Oran.",
                    iban: "FR7610058000011234567890123",
                    homeAirport: "LYS",
                  })
                }
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Sarah Benali"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Sarah Benali
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                        Expéditrice LYS
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      sarah.benali@gmail.com
                    </span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => setCustomMode(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
                Utiliser une autre adresse Google personnalisée
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Adresse e-mail Google
                </label>
                <input
                  type="email"
                  required
                  placeholder="nom@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Nom et Prénom
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex. Karim Mansouri"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Ville principale
                </label>
                <input
                  type="text"
                  placeholder="Paris, Alger, Lyon, Marseille..."
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Profil d'usage initial
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "both" as const, label: "Les deux" },
                    { id: "voyageur" as const, label: "Voyageur" },
                    { id: "expediteur" as const, label: "Expéditeur" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRoleSelection(r.id)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        roleSelection === r.id
                          ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                          : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserCheck size={15} />
                  {busy ? "Connexion..." : "Créer et Connecter"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
