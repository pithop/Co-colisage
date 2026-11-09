import { useState } from 'react';
import {
  ShieldCheck,
  Smartphone,
  FileCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  Sparkles,
  BadgeCheck,
  Info,
  Check,
} from 'lucide-react';
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

  const currentStepNum = step === 'phone' || step === 'otp' ? 1 : step === 'id' ? 2 : 3;

  return (
    <Dialog title={t('Centre de Confiance & Sécurité')} onClose={onClose} wide>
      <div className="space-y-6 text-slate-800 dark:text-slate-100">
        {/* Top 3-Step Timeline */}
        <div className="grid grid-cols-3 gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          {[
            { num: 1, title: 'Téléphone & PIN', subtitle: 'SMS de sécurisation' },
            { num: 2, title: 'Pièce d’identité', subtitle: 'Passeport / CNI OACI' },
            { num: 3, title: 'Certification', subtitle: 'Niveau 3 Garanti' },
          ].map((s) => {
            const active = currentStepNum === s.num;
            const completed = currentStepNum > s.num;
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
                      ? 'bg-[#072a4a] text-white dark:bg-cyan-400 dark:text-[#072a4a]'
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

        {/* Intro Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/20 dark:border-cyan-500/30 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#072a4a] text-cyan-300 shrink-0 shadow-sm shadow-[#072a4a]/30">
            <ShieldCheck size={22} />
          </div>
          <div className="text-sm">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-800 dark:text-cyan-300">
                Identité &amp; Confiance Niveau 3
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Certification bancaire Stripe Identity &amp; protection des paiements sous séquestre sur l'ensemble des trajets transfrontaliers.
            </p>
          </div>
        </div>

        {/* STEP 1A: Phone Number Input */}
        {step === 'phone' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                1. Vérification du numéro de téléphone
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Ce numéro est indispensable pour recevoir le code PIN secret lors de la remise en main propre et déclencher le paiement immédiat.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Numéro de mobile (FR, DZ ou international)
              </label>
              <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
                <Smartphone size={20} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                <input
                  type="tel"
                  className="w-full bg-transparent text-sm font-bold text-slate-900 dark:text-white outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  required
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
              <Lock size={15} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Votre numéro reste strictement masqué aux tiers. Il sert uniquement à l'envoi des codes d'authentification bancaire et de remise.
              </p>
            </div>

            <button
              type="button"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#00a2c7] hover:to-[#00669e] text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-98 flex items-center justify-center gap-2"
              onClick={() => setStep('otp')}
            >
              <span>{t('Envoyer le code de validation SMS')}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 1B: OTP Code Input */}
        {step === 'otp' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Saisissez le code de confirmation SMS
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Un code à 6 chiffres a été envoyé par SMS sécurisé au <strong>{phone}</strong> :
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`h-14 w-11 sm:w-12 rounded-xl border-2 text-center text-xl font-black transition-all ${
                      digit
                        ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-400'
                    }`}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                  />
                ))}
              </div>

              <p className="text-[11px] text-slate-400">
                Vous n'avez pas reçu le SMS ? <button type="button" onClick={() => setStep('phone')} className="text-cyan-600 dark:text-cyan-400 font-bold underline">Modifier le numéro</button>
              </p>
            </div>

            <button
              type="button"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#00a2c7] hover:to-[#00669e] text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-98 flex items-center justify-center gap-2"
              onClick={() => setStep('id')}
            >
              <CheckCircle2 size={16} />
              <span>{t('Confirmer le code')}</span>
            </button>
          </div>
        )}

        {/* STEP 2: ID Biometric Scan */}
        {step === 'id' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                2. Vérification officielle de la pièce d'identité
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Contrôle optique conforme OACI Doc 9303 via Stripe Identity pour débloquer les montants supérieurs à 500 € et activer la garantie séquestre prioritaire.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                className={`p-4 rounded-2xl border text-left transition-all ${
                  idType === 'passport'
                    ? 'border-cyan-500 bg-cyan-50/60 dark:bg-cyan-950/40 text-cyan-950 dark:text-cyan-100 ring-2 ring-cyan-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
                onClick={() => setIdType('passport')}
              >
                <p className="font-bold text-sm">Passeport biométrique</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Recommandé pour les corridors aériens internationaux
                </p>
              </button>
              <button
                type="button"
                className={`p-4 rounded-2xl border text-left transition-all ${
                  idType === 'id_card'
                    ? 'border-cyan-500 bg-cyan-50/60 dark:bg-cyan-950/40 text-cyan-950 dark:text-cyan-100 ring-2 ring-cyan-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
                onClick={() => setIdType('id_card')}
              >
                <p className="font-bold text-sm">Carte Nationale d'Identité</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Format européen ou biométrique avec bande MRZ
                </p>
              </button>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-cyan-400/40 bg-cyan-50/20 dark:bg-cyan-950/10 p-8 text-center">
              {scanning ? (
                <div className="py-4 space-y-3">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Analyse optique des sécurités et filigranes en cours…
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Contrôle conformité OACI Doc 9303 &amp; eIDAS
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <FileCheck size={40} className="mx-auto text-cyan-600 dark:text-cyan-400" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Détection automatique des bordures et filigranes
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Placez votre document bien à plat avec un bon éclairage
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#00a2c7] hover:to-[#00669e] text-white font-bold text-sm shadow-md shadow-cyan-600/20 transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={scanning}
              onClick={simulateIdScan}
            >
              <ShieldCheck size={16} />
              <span>{scanning ? t('Vérification en cours…') : t('Lancer le contrôle cryptographique')}</span>
            </button>
          </div>
        )}

        {/* STEP 3: Success Certified State */}
        {step === 'success' && (
          <div className="text-center py-5 space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50 shadow-md">
              <CheckCircle2 size={44} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Identité Certifiée Niveau 3
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                Votre profil bénéficie désormais du badge officiel et de la garantie séquestre prioritaire Stripe Connect sur l'ensemble de vos transactions.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
              <Lock size={15} className="text-emerald-500" />
              <span>Chiffrement matériel certifié · Stripe Identity Partner</span>
            </div>

            <button
              type="button"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all active:scale-98"
              onClick={onClose}
            >
              Terminer et revenir à la plateforme
            </button>
          </div>
        )}
      </div>
    </Dialog>
  );
}

