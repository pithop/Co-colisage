import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  CreditCard,
  Camera,
  Home,
  CheckCircle2,
  Clock,
  AlertCircle,
  UploadCloud,
  Lock,
  Sparkles,
  Check,
  X,
  LucideIcon,
  BadgeCheck,
  Info,
  Plane,
  Package,
  Shield,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { KycDocumentType, UserProfileSelection } from '../../types/auth';
import { Dialog } from '../marketplace/Dialog';

interface DocumentSlot {
  type: KycDocumentType;
  title: string;
  subtitle: string;
  tag: string;
  required: boolean;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

const DOCUMENT_SLOTS: DocumentSlot[] = [
  {
    type: 'passport',
    title: 'Passeport biométrique',
    subtitle: 'Page principale lisible avec photo nette et zone de lecture optique MRZ',
    tag: 'OACI Doc 9303',
    required: true,
    icon: FileText,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200/60 dark:border-blue-800/60',
  },
  {
    type: 'cni',
    title: "Carte Nationale d'Identité",
    subtitle: 'Recto / Verso en cours de validité (UE ou Carte de séjour biométrique)',
    tag: 'Format UE / Biométrique',
    required: false,
    icon: CreditCard,
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/60 dark:border-indigo-800/60',
  },
  {
    type: 'selfie',
    title: 'Selfie de conformité faciale',
    subtitle: "Contrôle biométrique 3D temps réel tenant votre pièce d'identité",
    tag: 'Anti-usurpation 3D',
    required: true,
    icon: Camera,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200/60 dark:border-purple-800/60',
  },
  {
    type: 'proof_of_address',
    title: 'Justificatif de domicile',
    subtitle: 'Facture énergie, télécom ou quittance certifiée datant de moins de 3 mois',
    tag: 'Adresse certifiée',
    required: false,
    icon: Home,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60',
  },
];

export const KycDocumentsModal: React.FC = () => {
  const {
    isKycModalOpen,
    closeKycModal,
    kycDocuments,
    uploadKycDocument,
    profileSelection,
    setProfileSelection,
    setActivePlatform,
  } = useAuth();

  const [uploadingType, setUploadingType] = useState<KycDocumentType | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<UserProfileSelection>(
    profileSelection || 'voyageur'
  );
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isKycModalOpen) return null;

  const getDocStatus = (type: KycDocumentType) => {
    return kycDocuments.find((d) => d.type === type) || null;
  };

  const handleSimulatedUpload = async (slot: DocumentSlot, file: File | null) => {
    const fileName = file ? file.name : `${slot.type}_document_certifie.pdf`;
    setUploadingType(slot.type);

    // Simulate fast cryptographic verification & OCR
    setTimeout(async () => {
      await uploadKycDocument(slot.type, slot.title, fileName);
      setUploadingType(null);
      setSuccessToast(`Document "${slot.title}" validé et chiffré avec succès.`);
      setTimeout(() => setSuccessToast(null), 3500);
    }, 800);
  };

  const hasPrimaryIdentity = kycDocuments.some(
    (d) => (d.type === 'passport' || d.type === 'cni') && d.status === 'verified'
  );

  const handleConfirmAndActivate = () => {
    setProfileSelection(selectedProfile);
    if (selectedProfile === 'voyageur') {
      setActivePlatform('shopandgo');
    } else if (selectedProfile === 'expediteur') {
      setActivePlatform('bagandgo');
    }
    closeKycModal();
  };

  const completedDocsCount = kycDocuments.filter((d) => d.status === 'verified').length;
  const currentStep = hasPrimaryIdentity ? 3 : completedDocsCount > 0 ? 2 : 1;

  return (
    <Dialog title="Certification d'Identité KYC & Séquestre eIDAS" onClose={closeKycModal} wide>
      <div className="space-y-6 text-slate-800 dark:text-slate-100">
        {/* Stepper with connected sleek indicators */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: 1, title: 'Profil actif', subtitle: 'Voyageur / Expéditeur' },
              { num: 2, title: 'Documents d’identité', subtitle: 'Passeport / CNI / Selfie' },
              { num: 3, title: 'Séquestre eIDAS', subtitle: 'Plafond 2 500 € actif' },
            ].map((s) => {
              const active = currentStep === s.num;
              const completed = currentStep > s.num;
              return (
                <div
                  key={s.num}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all border ${
                    completed
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                      : active
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border-blue-500/40 dark:border-blue-500/50 ring-2 ring-blue-500/10'
                      : 'border-transparent text-slate-400 dark:text-slate-500 opacity-60'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 transition-transform ${
                      completed
                        ? 'bg-emerald-600 text-white'
                        : active
                        ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {completed ? <Check size={13} strokeWidth={3} /> : s.num}
                  </span>
                  <div className="min-w-0 hidden sm:block">
                    <p className="text-xs font-bold leading-tight truncate">{s.title}</p>
                    <p className="text-[10px] opacity-75 truncate">{s.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Trust Micro-Bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/5 via-indigo-900/5 to-emerald-900/5 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-emerald-950/40 border border-blue-200/60 dark:border-blue-800/40 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shrink-0 shadow-sm shadow-blue-500/20">
            <ShieldCheck size={22} />
          </div>
          <div className="text-sm flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-bold text-slate-900 dark:text-white">
                Garantie de Sécurité Maximale &amp; Séquestre Bancaire
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                <Shield size={10} /> eIDAS v2.1
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                <Lock size={10} /> AES-256
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Pour assurer l'intégrité absolue des acheminements et débloquer les paiements garantis jusqu'à 2 500 € par trajet, votre pièce officielle est chiffrée selon le standard bancaire européen Stripe Identity.
            </p>
          </div>
        </div>

        {/* Success toast notification */}
        {successToast && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold">{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white p-1 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Step 1: Profile Choice Segment */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              Choix de votre activité principale
            </label>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
              Interchangeable à tout moment
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'voyageur' as UserProfileSelection,
                title: 'Voyageur (Shop & Go)',
                desc: 'Monétisez vos kilos de bagages & achetez en duty-free',
                icon: Plane,
                badge: 'Gagnez jusqu’à 500 €/vol',
              },
              {
                id: 'expediteur' as UserProfileSelection,
                title: 'Expéditeur (Bag & Go)',
                desc: 'Confiez vos colis à un voyageur vérifié en main propre',
                icon: Package,
                badge: 'Livraison express < 24h',
              },
              {
                id: 'both' as UserProfileSelection,
                title: 'Double Profil Actif',
                desc: 'Voyagez et expédiez selon vos besoins sans restriction',
                icon: Zap,
                badge: 'Flexibilité Totale',
              },
            ].map((option) => {
              const active = selectedProfile === option.id;
              const OptionIcon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedProfile(option.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between group ${
                    active
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/30 text-slate-900 dark:text-white ring-2 ring-blue-600/20 shadow-md shadow-blue-500/10'
                      : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                          active
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 group-hover:border-blue-400'
                        }`}
                      >
                        <OptionIcon size={18} />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          active
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {active && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                    <p className="font-extrabold text-sm mb-1 text-slate-900 dark:text-white">
                      {option.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                      {option.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/80">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        active
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {option.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Documents Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              Pièces officielles à fournir
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
              <Lock size={12} className="text-emerald-500" /> Chiffrement eIDAS / AES-256
            </span>
          </div>

          <div className="space-y-3">
            {DOCUMENT_SLOTS.map((slot) => {
              const currentDoc = getDocStatus(slot.type);
              const isUploading = uploadingType === slot.type;
              const Icon = slot.icon;
              const isVerified = currentDoc?.status === 'verified';

              return (
                <div
                  key={slot.type}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isVerified
                      ? 'border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs'
                      : 'border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${slot.iconBg}`}
                    >
                      <Icon size={22} className={slot.iconColor} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {slot.title}
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {slot.tag}
                        </span>
                        {slot.required && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            Requis
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {slot.subtitle}
                      </p>
                      {currentDoc && currentDoc.fileName && (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1.5 flex items-center gap-1.5">
                          <CheckCircle2 size={13} />
                          Fichier chiffré : <span className="font-bold">{currentDoc.fileName}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 shrink-0 pt-2 sm:pt-0">
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs">
                        <BadgeCheck size={16} /> Certifié conforme
                      </span>
                    ) : currentDoc?.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        <Clock size={16} className="animate-spin" /> Analyse OCR...
                      </span>
                    ) : (
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-sm hover:shadow active:scale-95">
                        <UploadCloud size={15} />
                        {isUploading ? 'Vérification IA...' : 'Téléverser le document'}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            void handleSimulatedUpload(slot, file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Explanation Trust Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border-l-4 border-l-blue-600 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5 shadow-xs">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 shrink-0">
            <Info size={18} />
          </div>
          <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white block mb-0.5 text-sm font-bold">
              Pourquoi ces documents sont-ils indispensables ?
            </strong>
            La validation KYC active immédiatement le séquestre bancaire Stripe jusqu'à 2 500 € par trajet et attribue le badge officiel « Voyageur Certifié eIDAS », gage d'assurance indispensable pour être choisi par les expéditeurs.
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-semibold">
            {hasPrimaryIdentity ? (
              <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Identité certifiée. Vos profils sont prêts à être activés.
              </span>
            ) : (
              <span className="text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                Veuillez téléverser au minimum un Passeport ou une CNI.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={closeKycModal}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={handleConfirmAndActivate}
              disabled={!hasPrimaryIdentity}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 ${
                hasPrimaryIdentity
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 active:scale-95 shadow-md shadow-blue-500/25'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              <Sparkles size={16} />
              <span>Valider &amp; Activer mes profils</span>
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

