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
}

const DOCUMENT_SLOTS: DocumentSlot[] = [
  {
    type: 'passport',
    title: 'Passeport biométrique',
    subtitle: 'Page principale lisible avec photo et zone MRZ',
    tag: 'OACI Doc 9303',
    required: true,
    icon: FileText,
  },
  {
    type: 'cni',
    title: "Carte Nationale d'Identité",
    subtitle: 'Recto / Verso en cours de validité',
    tag: 'Format UE / Biométrique',
    required: false,
    icon: CreditCard,
  },
  {
    type: 'selfie',
    title: 'Selfie de conformité faciale',
    subtitle: "Contrôle biométrique 3D tenant votre pièce d'identité",
    tag: 'Anti-usurpation',
    required: true,
    icon: Camera,
  },
  {
    type: 'proof_of_address',
    title: 'Justificatif de domicile',
    subtitle: 'Facture énergie, télécom ou avis de situation (< 3 mois)',
    tag: 'Adresse certifiée',
    required: false,
    icon: Home,
  },
];

export const KycDocumentsModal: React.FC = () => {
  const {
    isKycModalOpen,
    closeKycModal,
    user,
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
    const found = kycDocuments.find((d) => d.type === type);
    return found || null;
  };

  const handleSimulatedUpload = async (slot: DocumentSlot, file: File | null) => {
    const fileName = file ? file.name : `${slot.type}_document_certifie.pdf`;
    setUploadingType(slot.type);

    // Simulate fast cryptographic verification & OCR
    setTimeout(async () => {
      await uploadKycDocument(slot.type, slot.title, fileName);
      setUploadingType(null);
      setSuccessToast(`Document "${slot.title}" validé avec succès.`);
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
    <Dialog title="Vérification d'Identité & Certification KYC" onClose={closeKycModal} wide>
      <div className="space-y-6 text-slate-800 dark:text-slate-100">
        {/* Top 3-Step Timeline */}
        <div className="grid grid-cols-3 gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          {[
            { num: 1, title: 'Profil actif', subtitle: 'Voyageur / Expéditeur' },
            { num: 2, title: 'Pièces d’identité', subtitle: 'Passeport / CNI / Selfie' },
            { num: 3, title: 'Certification eIDAS', subtitle: 'Séquestre débloqué' },
          ].map((s) => {
            const active = currentStep === s.num;
            const completed = currentStep > s.num;
            return (
              <div
                key={s.num}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                  completed
                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                    : active
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-600'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    completed
                      ? 'bg-emerald-500 text-white'
                      : active
                      ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}
                >
                  {completed ? <Check size={12} strokeWidth={3} /> : s.num}
                </span>
                <div className="min-w-0 hidden sm:block">
                  <p className="text-xs font-bold leading-tight truncate">{s.title}</p>
                  <p className="text-[10px] opacity-75 truncate">{s.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Trust Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500 text-white shrink-0 shadow-sm shadow-emerald-500/30">
            <ShieldCheck size={22} />
          </div>
          <div className="text-sm">
            <p className="font-bold text-slate-900 dark:text-white mb-0.5">
              Certification de conformité &amp; Séquestre bancaire garanti
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Pour garantir la sécurité absolue des bagages et acheminements, l'activation des profils
              Voyageur (Shop &amp; Go) ou Expéditeur requiert un justificatif officiel vérifié
              (chiffrement AES-256 certifié eIDAS et conformité bancaire Stripe Identity).
            </p>
          </div>
        </div>

        {/* Success toast */}
        {successToast && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-medium">{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-600 hover:text-emerald-800 dark:hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Step 1: Profile Choice Segment */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              1. Choix de votre activité principale
            </label>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
              Modifiable à tout moment
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              {
                id: 'voyageur' as UserProfileSelection,
                title: 'Voyageur (Shop & Go)',
                desc: 'Monétiser mes kilos & acheter des articles en duty-free',
              },
              {
                id: 'expediteur' as UserProfileSelection,
                title: 'Expéditeur (Bag & Go)',
                desc: 'Trouver un voyageur & envoyer des colis certifiés',
              },
              {
                id: 'both' as UserProfileSelection,
                title: 'Les 2 Profils Actifs',
                desc: 'Voyager et expédier selon mes trajets',
              },
            ].map((option) => {
              const active = selectedProfile === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedProfile(option.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                    active
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {active && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                  <p className="font-bold text-sm mb-1">{option.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    {option.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Documents Grid */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              2. Pièces officielles requises
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
              <Lock size={12} className="text-emerald-500" /> Chiffrement AES-256
            </span>
          </div>

          <div className="space-y-3">
            {DOCUMENT_SLOTS.map((slot) => {
              const currentDoc = getDocStatus(slot.type);
              const isUploading = uploadingType === slot.type;
              const Icon = slot.icon;

              return (
                <div
                  key={slot.type}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0">
                      <Icon size={22} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                          {slot.title}
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {slot.tag}
                        </span>
                        {slot.required && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Requis
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {slot.subtitle}
                      </p>
                      {currentDoc && currentDoc.fileName && (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1.5 flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Fichier chiffré : {currentDoc.fileName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 shrink-0 pt-2 sm:pt-0">
                    {currentDoc?.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <BadgeCheck size={15} /> Validé
                      </span>
                    ) : currentDoc?.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Clock size={15} /> En cours d'analyse
                      </span>
                    ) : (
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 transition-all shadow-xs active:scale-95">
                        <UploadCloud size={15} />
                        {isUploading ? 'Vérification...' : 'Téléverser le document'}
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
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            <strong className="text-slate-900 dark:text-slate-200 block mb-0.5">
              Pourquoi ces documents sont-ils indispensables ?
            </strong>
            La validation KYC débloque le séquestre bancaire Stripe jusqu'à 2 500 € par trajet et active le badge « Profil Certifié » indispensable pour recevoir des demandes de transport de colis ou d'achats en boutique.
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            {hasPrimaryIdentity ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Identité certifiée. Vos profils sont prêts à être activés.
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                <AlertCircle size={16} /> Veuillez téléverser au minimum un Passeport ou une CNI.
              </span>
            )}
          </p>

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
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 ${
                hasPrimaryIdentity
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 shadow-emerald-600/30'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
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

