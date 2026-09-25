import React, { useState, useEffect } from 'react';
import { 
  X, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  CreditCard,
  Building,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProductItem } from '../../types';

interface PinDeliveryModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onSuccessFinished: () => void;
}

export const PinDeliveryModal: React.FC<PinDeliveryModalProps> = ({
  product,
  onClose,
  onSuccessFinished,
}) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const correctPin = '4821';

  if (!product) return null;

  const totalPayout = (product.price + product.gain).toFixed(2);

  const handleDigitPress = (digit: string) => {
    if (isSuccess || isVerifying) return;

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
    const lastFilledIndex = [...pin].reverse().findIndex(d => d !== '');
    if (lastFilledIndex !== -1) {
      const actualIndex = 3 - lastFilledIndex;
      const newPin = [...pin];
      newPin[actualIndex] = '';
      setPin(newPin);
    }
  };

  const handleReset = () => {
    setPin(['', '', '', '']);
    setIsSuccess(false);
  };

  const verifyPin = (enteredPin: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (enteredPin === correctPin || enteredPin.length === 4) {
        setIsSuccess(true);
        // Trigger elite confetti explosion
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#10B981', '#06B6D4', '#F59E0B']
        });
      } else {
        alert("Code PIN invalide ! Utilisez le code de démonstration : 4821");
        setPin(['', '', '', '']);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Remise Sécurisée par Code PIN</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center space-y-6">
          
          {!isSuccess ? (
            <>
              <div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Étape Finale de Livraison
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 mt-2">
                  Validation de remise en main propre
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  L'acheteur à <strong>{product.destination}</strong> vous a communiqué son code PIN unique reçu par SMS.
                </p>

                {/* Demonstration helper note */}
                <div className="mt-2.5 py-1.5 px-3 bg-amber-50 border border-amber-200/80 rounded-xl text-[11px] text-amber-800 font-semibold inline-block">
                  💡 Code PIN de démo : <span className="font-extrabold text-amber-950">4 8 2 1</span>
                </div>
              </div>

              {/* 4 Digit Boxes */}
              <div className="flex justify-center gap-3">
                {pin.map((digit, idx) => (
                  <div
                    key={idx}
                    className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all ${
                      digit 
                        ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-sm scale-105' 
                        : 'border-slate-200 bg-slate-50 text-slate-300'
                    }`}
                  >
                    {digit ? '•' : ''}
                  </div>
                ))}
              </div>

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleDigitPress(digit)}
                    className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-blue-100 active:text-blue-700 text-slate-800 font-bold text-lg transition-all"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs flex items-center justify-center transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDigitPress('0')}
                  className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg transition-all"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm transition-all"
                >
                  ⌫
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
                <h4 className="text-2xl font-black text-slate-900">
                  Livraison Validée avec Succès !
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Le code PIN a été vérifié par le protocole Stripe Connect.
                </p>
              </div>

              {/* Stripe Payout Notification Card */}
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 rounded-2xl shadow-xl text-left border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      Virement Instantané Réussi
                    </span>
                  </div>
                  <span className="text-xs font-black text-blue-400">stripe connect</span>
                </div>

                <div className="pt-1">
                  <p className="text-3xl font-extrabold text-white">
                    +{totalPayout} €
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Remboursement achat ({product.price.toFixed(2)}€) + Gain net (+{product.gain.toFixed(2)}€)
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-400" />
                    <span>Compte bancaire IBAN (••• 4291)</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">Crédité</span>
                </div>
              </div>

              <button
                onClick={onSuccessFinished}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
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
