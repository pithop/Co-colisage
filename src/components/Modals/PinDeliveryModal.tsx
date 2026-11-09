import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Building,
  RotateCcw,
  ShieldCheck,
  PackageCheck,
  Check,
  Sparkles,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProductItem } from '../../types';
import type { ConversationData } from '../marketplace/Conversation';

interface PinDeliveryModalProps {
  conversation?: ConversationData | null;
  product?: ProductItem | null;
  onClose: () => void;
  onSuccessFinished?: (releasedAmount: number) => void;
}

export const PinDeliveryModal: React.FC<PinDeliveryModalProps> = ({
  conversation,
  product,
  onClose,
  onSuccessFinished,
}) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const verificationTimer = useRef<ReturnType<typeof setTimeout>>();

  // Dynamic PIN derived from real conversation or fallback
  const correctPin =
    conversation?.deliveryCode ||
    conversation?.pickupCode ||
    '4821';

  const payoutNumber =
    conversation?.amount ||
    (product ? product.price + product.gain : 75);
  const totalPayout = payoutNumber.toFixed(2);
  const subjectLabel = conversation?.subject || product?.name || 'Mission BagVoyage';
  const destinationLabel = conversation?.subject || product?.destination || 'Destination';

  useEffect(() => {
    setPin(['', '', '', '']);
    setIsSuccess(false);
    setIsVerifying(false);
    setError('');
    return () => clearTimeout(verificationTimer.current);
  }, [conversation?.id, product?.id]);

  if (!conversation && !product) return null;

  const handleDigitPress = (digit: string) => {
    if (isSuccess || isVerifying) return;
    setError('');

    const nextEmptyIndex = pin.findIndex(d => d === '');
    if (nextEmptyIndex !== -1) {
      const newPin = [...pin];
      newPin[nextEmptyIndex] = digit;
      setPin(newPin);

      // If completing 4 digits
      if (nextEmptyIndex === 3) {
        verifyPin(newPin.join(''));
      }
    }
  };

  const handleBackspace = () => {
    if (isSuccess || isVerifying) return;
    setError('');
    const lastFilledIndex = [...pin].reverse().findIndex(d => d !== '');
    if (lastFilledIndex !== -1) {
      const actualIndex = 3 - lastFilledIndex;
      const newPin = [...pin];
      newPin[actualIndex] = '';
      setPin(newPin);
    }
  };

  const handleReset = () => {
    if (isVerifying) return;
    setPin(['', '', '', '']);
    setIsSuccess(false);
    setError('');
  };

  const verifyPin = (enteredPin: string) => {
    setIsVerifying(true);
    setError('');
    verificationTimer.current = setTimeout(() => {
      setIsVerifying(false);
      if (enteredPin === correctPin) {
        setIsSuccess(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00bcd4', '#10B981', '#0077b6', '#F59E0B']
        });
      } else {
        setError('Code PIN invalide. Veuillez vérifier le code à 4 chiffres fourni par le destinataire.');
        setPin(['', '', '', '']);
      }
    }, 600);
  };

  const currentStep = isSuccess ? 3 : isVerifying ? 2 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-cyan-500/30 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pin-delivery-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Oceanic Brand */}
        <header className="relative bg-gradient-to-r from-[#072a4a] via-[#05375c] to-[#0276aa] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-400/20 text-cyan-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 id="pin-delivery-title" className="font-black text-base text-white">
                Remise Sécurisée par Code PIN
              </h3>
              <p className="text-[11px] text-cyan-200">
                Protocole de déblocage instantané Stripe Escrow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="p-1.5 rounded-full text-cyan-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* 3-Step Visual Progress Bar */}
        <div className="px-6 pt-4 pb-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: 1, title: 'Remise en main', subtitle: 'Inspection colis' },
              { num: 2, title: 'Validation PIN', subtitle: 'Code 4 chiffres' },
              { num: 3, title: 'Virement Stripe', subtitle: 'Paiement libéré' },
            ].map((s) => {
              const active = currentStep === s.num;
              const completed = currentStep > s.num;
              return (
                <div
                  key={s.num}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all ${
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
                    <p className="text-[11px] font-bold leading-tight truncate">{s.title}</p>
                    <p className="text-[9px] opacity-75 truncate">{s.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center space-y-5">
          {!isSuccess ? (
            <>
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-800">
                  <PackageCheck size={13} />
                  <span>Validation physique de livraison</span>
                </span>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                  Code PIN de confirmation
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  Le destinataire à <strong>{destinationLabel}</strong> vous communique son code secret après inspection du colis ou des achats.
                </p>
              </div>

              {/* Explanatory security callout */}
              <div className="p-3 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-800/60 flex items-start gap-2.5 text-left">
                <ShieldCheck size={16} className="text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-cyan-950 dark:text-cyan-200 leading-snug">
                  La validation du code PIN à 4 chiffres déclenche le virement automatique de <strong>+{totalPayout} €</strong> vers votre compte bancaire.
                </p>
              </div>

              {error && (
                <div role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-left text-xs text-red-800">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              {/* 4 Digit Boxes */}
              <div className="flex justify-center gap-3">
                {pin.map((digit, idx) => (
                  <div
                    key={idx}
                    className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-black transition-all ${
                      digit 
                        ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 shadow-sm scale-105' 
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {digit ? '•' : ''}
                  </div>
                ))}
              </div>

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    disabled={isVerifying}
                    onClick={() => handleDigitPress(digit)}
                    className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-cyan-100 active:text-cyan-800 text-slate-800 dark:text-slate-100 font-bold text-lg transition-all active:scale-95"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Réinitialiser le code PIN"
                  disabled={isVerifying}
                  className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-semibold text-xs flex items-center justify-center transition-all active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDigitPress('0')}
                  disabled={isVerifying}
                  className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-100 font-bold text-lg transition-all active:scale-95"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  aria-label="Effacer le dernier chiffre"
                  disabled={isVerifying}
                  className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-sm transition-all active:scale-95"
                >
                  DEL
                </button>
              </div>
            </>
          ) : (
            /* Celebration & Payout State */
            <div className="py-4 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                  Livraison Validée avec Succès !
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Le code PIN a été vérifié par le protocole Stripe Connect Escrow.
                </p>
              </div>

              {/* Stripe Payout Notification Card */}
              <div className="bg-gradient-to-br from-[#072a4a] via-[#05375c] to-[#0276aa] text-white p-5 rounded-2xl shadow-xl text-left border border-cyan-400/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                      Virement Instantané Réussi
                    </span>
                  </div>
                  <span className="text-xs font-black text-cyan-300 tracking-wider">STRIPE CONNECT</span>
                </div>

                <div className="pt-1">
                  <p className="text-3xl font-black text-white">
                    +{totalPayout} €
                  </p>
                  <p className="text-xs text-cyan-100 mt-0.5">
                    Rémunération pour la mission : {subjectLabel}
                  </p>
                </div>

                <div className="pt-3 border-t border-cyan-400/20 flex items-center justify-between text-[11px] text-cyan-200">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Compte bancaire IBAN (••• 4291)</span>
                  </div>
                  <span className="text-emerald-300 font-bold">Crédité</span>
                </div>
              </div>

              <button
                onClick={() => onSuccessFinished ? onSuccessFinished(payoutNumber) : onClose()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Terminer et retourner à l'accueil</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

