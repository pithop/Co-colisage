import { useState } from 'react';
import { ShieldCheck, Smartphone, FileCheck, CheckCircle2, Lock, ArrowRight, X } from 'lucide-react';
import { Dialog } from '../marketplace/Dialog';
import { useLanguage } from '../../context/LanguageContext';

export function TrustVerificationModal({
  onClose,
  onVerified,
}: {
  onClose: () => void;
  onVerified?: () => void;
}) {
  const { t } = useLanguage();
  const [step, setStep] = useState<'phone' | 'otp' | 'id' | 'success'>('phone');
  const [phone, setPhone] = useState('+33 6 12 34 56 78');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [idType, setIdType] = useState<'passport' | 'id_card'>('passport');
  const [scanning, setScanning] = useState(false);

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[index] = val.slice(-1);
    setOtp(next);
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const simulateIdScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setStep('success');
      onVerified?.();
    }, 1800);
  };

  return (
    <Dialog title={t('Centre de confiance')} onClose={onClose}>
      <div className="bv-document-intro">
        <span className="bv-status">
          <ShieldCheck size={15} /> IDENTITÉ & CONFIANCE NIVEAU 3
        </span>
        <p>
          Certification bancaire Stripe Identity & protection contre les fraudes sur les corridors France-Algérie.
        </p>
      </div>

      <div className="trust-stepper">
        <div className={`trust-step-pill ${step === 'phone' || step === 'otp' ? 'active' : 'done'}`}>
          <Smartphone size={15} />
          <span>{t('Téléphone')}</span>
        </div>
        <div className={`trust-step-pill ${step === 'id' ? 'active' : step === 'success' ? 'done' : ''}`}>
          <FileCheck size={15} />
          <span>{t('Identité')}</span>
        </div>
        <div className={`trust-step-pill ${step === 'success' ? 'active done' : ''}`}>
          <ShieldCheck size={15} />
          <span>{t('Certifications')}</span>
        </div>
      </div>

      {step === 'phone' && (
        <div className="trust-body">
          <h3>Vérification du numéro de téléphone</h3>
          <p className="text-xs text-slate-500 mb-4">
            Un code SMS de validation à 6 chiffres vous sera envoyé pour sécuriser les remises par code PIN.
          </p>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Numéro de mobile (FR, DZ ou international)
            <input
              type="tel"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>
          <button
            type="button"
            className="primary-button w-full mt-4"
            onClick={() => setStep('otp')}
          >
            {t('Envoyer le code SMS')}
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div className="trust-body">
          <h3>Code de sécurité reçu par SMS</h3>
          <p className="text-xs text-slate-500 mb-4">
            Saisissez le code à 6 chiffres envoyé au <strong>{phone}</strong> :
          </p>
          <div className="flex justify-center gap-2 my-4">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="h-12 w-10 rounded-xl border border-slate-300 text-center text-lg font-bold"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
              />
            ))}
          </div>
          <button
            type="button"
            className="primary-button w-full mt-4"
            onClick={() => setStep('id')}
          >
            {t('Vérifier le code')}
          </button>
        </div>
      )}

      {step === 'id' && (
        <div className="trust-body">
          <h3>Vérification officielle de la pièce d'identité</h3>
          <p className="text-xs text-slate-500 mb-4">
            Contrôle cryptographique via Stripe Identity pour débloquer le badge Transporteur Certifié et les montants supérieurs à 500 €.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              className={`rounded-xl border p-3 text-left transition ${idType === 'passport' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200'}`}
              onClick={() => setIdType('passport')}
            >
              <strong>Passeport biométrique</strong>
              <p className="text-[11px] text-slate-500">Recommandé pour les vols internationaux</p>
            </button>
            <button
              type="button"
              className={`rounded-xl border p-3 text-left transition ${idType === 'id_card' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200'}`}
              onClick={() => setIdType('id_card')}
            >
              <strong>Carte Nationale d'Identité</strong>
              <p className="text-[11px] text-slate-500">Format européen ou biométrique</p>
            </button>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center">
            {scanning ? (
              <div className="py-6">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                <p className="mt-4 text-xs font-semibold text-slate-700">Analyse optique des sécurités et filigranes…</p>
              </div>
            ) : (
              <div>
                <FileCheck size={36} className="mx-auto text-blue-600 mb-2" />
                <p className="text-xs font-medium text-slate-700">Détection automatique des bordures active</p>
                <p className="text-[11px] text-slate-400 mt-1">Conforme normes OACI Doc 9303</p>
              </div>
            )}
          </div>

          <button
            type="button"
            className="primary-button w-full mt-4"
            disabled={scanning}
            onClick={simulateIdScan}
          >
            {scanning ? t('Vérification en cours') : t('Vérifier mon identité')}
          </button>
        </div>
      )}

      {step === 'success' && (
        <div className="trust-body text-center py-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Identité Certifiée Niveau 3</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            Votre profil bénéficie désormais du badge officiel et de la garantie séquestre prioritaire sur l'ensemble de vos transactions.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700">
            <Lock size={14} className="text-emerald-600" />
            <span>Chiffrement matériel sécurisé · Stripe Identity Partner</span>
          </div>
          <button
            type="button"
            className="primary-button w-full mt-6"
            onClick={onClose}
          >
            Terminer
          </button>
        </div>
      )}
    </Dialog>
  );
}
