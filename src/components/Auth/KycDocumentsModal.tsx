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
  ChevronRight,
  Lock,
  Sparkles,
  Check,
  X,
  LucideIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { KycDocumentType, UserProfileSelection } from '../../types/auth';
import { Dialog } from '../marketplace/Dialog';

interface DocumentSlot {
  type: KycDocumentType;
  title: string;
  subtitle: string;
  required: boolean;
  icon: LucideIcon;
}

const DOCUMENT_SLOTS: DocumentSlot[] = [
  {
    type: 'passport',
    title: 'Passeport biométrique',
    subtitle: 'Page principale lisible avec photo et zone MRZ',
    required: true,
    icon: FileText,
  },
  {
    type: 'cni',
    title: "Carte Nationale d'Identité",
    subtitle: 'Recto / Verso en cours de validité',
    required: false,
    icon: CreditCard,
  },
  {
    type: 'selfie',
    title: 'Selfie de conformité faciale',
    subtitle: "Photo en direct tenant votre pièce d'identité",
    required: true,
    icon: Camera,
  },
  {
    type: 'proof_of_address',
    title: 'Justificatif de domicile',
    subtitle: 'Facture énergie, télécom ou avis de situation (< 3 mois)',
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
  const [selectedProfile, setSelectedProfile] = useState<UserProfileSelection>(profileSelection || 'voyageur');
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

  return (
    <Dialog title="Vérification d'Identité KYC" onClose={closeKycModal} wide>
      <div className="space-y-6 text-slate-800 dark:text-slate-100">
        {/* Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 dark:border-emerald-500/30 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500 text-white shrink-0 shadow-sm shadow-emerald-500/30">
            <ShieldCheck size={22} />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-slate-900 dark:text-white mb-0.5">
              Certification de conformité communautaire
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Pour garantir la sécurité des bagages et acheminements, l&apos;activation des profils
              Voyageur (Shop &amp; Go) ou Expéditeur requiert un justificatif officiel vérifié
              (chiffrement AES-256 certifié eIDAS).
            </p>
          </div>
        </div>

        {/* Success toast */}
        {successToast && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
              <span>{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-600 hover:text-emerald-800 dark:hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Profile Choice Segment */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Choix de vos profils actifs
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              {
                id: 'voyageur' as UserProfileSelection,
                title: 'Voyageur (Shop & Go)',
                desc: 'Monétiser mes kilos & acheter des articles',
              },
              {
                id: 'expediteur' as UserProfileSelection,
                title: 'Expéditeur (Bag & Go)',
                desc: 'Trouver un voyageur & envoyer des colis',
              },
              {
                id: 'both' as UserProfileSelection,
                title: 'Les 2 Profils',
                desc: 'Voyager et expédier alternativement',
              },
            ].map((option) => {
              const active = selectedProfile === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedProfile(option.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    active
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {active && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                  <p className="font-semibold text-sm mb-1">{option.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    {option.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Documents Grid */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pièces justificatives requises
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Lock size={12} /> Données chiffrées
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
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-slate-900 dark:text-white">
                          {slot.title}
                        </p>
                        {slot.required && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Requis
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {slot.subtitle}
                      </p>
                      {currentDoc && currentDoc.fileName && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-1">
                          Fichier : {currentDoc.fileName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 shrink-0">
                    {currentDoc?.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={14} /> Vérifié
                      </span>
                    ) : currentDoc?.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Clock size={14} /> En cours
                      </span>
                    ) : (
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 transition-colors shadow-sm">
                        <UploadCloud size={14} />
                        {isUploading ? 'Vérification...' : 'Téléverser'}
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

        {/* Footer actions */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            {hasPrimaryIdentity ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Votre identité est validée. Vous pouvez activer vos profils.
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
                <AlertCircle size={14} /> Veuillez fournir au minimum un Passeport ou une CNI.
              </span>
            )}
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={closeKycModal}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={handleConfirmAndActivate}
              disabled={!hasPrimaryIdentity}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all flex items-center justify-center gap-2 ${
                hasPrimaryIdentity
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-emerald-600/30'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles size={16} />
              Valider &amp; Activer
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
