import React, { useState } from 'react';
import { 
  X, 
  Box, 
  HelpCircle, 
  AlertOctagon, 
  ShieldCheck, 
  Scale, 
  Maximize2, 
  Check, 
  ArrowRight 
} from 'lucide-react';

interface LuggageVisualHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFormat?: (format: string) => void;
}

export const LuggageVisualHelperModal: React.FC<LuggageVisualHelperModalProps> = ({
  isOpen,
  onClose,
  onSelectFormat,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'S' | 'M' | 'L' | 'XL'>('M');

  if (!isOpen) return null;

  const formats = [
    {
      id: 'S',
      title: 'Format S - Petit Colis',
      equivalent: 'Enveloppe, Smartphone, Documents ou Parfum',
      weight: 'Jusqu\'à 1 kg',
      dimensions: '20 x 15 x 5 cm (≈ 1,5 L)',
      badge: 'Cabine / Sacoche',
      ideal: 'Parfums Duty Free, téléphones scellés, courriers urgents'
    },
    {
      id: 'M',
      title: 'Format M - Moyen (Standard)',
      equivalent: 'Boîte à chaussures standard ou Vêtements pliés',
      weight: 'De 2 à 5 kg',
      dimensions: '35 x 25 x 15 cm (≈ 13 L)',
      badge: 'Valise Cabine',
      ideal: 'Sneakers, vêtements de marque, cosmétiques'
    },
    {
      id: 'L',
      title: 'Format L - Grand Colis',
      equivalent: 'Carton moyen, Petit électroménager ou 4 paires',
      weight: 'De 6 à 15 kg',
      dimensions: '50 x 40 x 30 cm (≈ 60 L)',
      badge: 'Soute Avion / Coffre',
      ideal: 'Colis familiaux, pièces détachées, matériel'
    },
    {
      id: 'XL',
      title: 'Format XL - Très Grand Volume',
      equivalent: 'Grande valise complète 23 kg ou Grand carton',
      weight: '16 à 25 kg',
      dimensions: '75 x 50 x 35 cm (≈ 130 L)',
      badge: 'Fret Ferry & Camion',
      ideal: 'Déménagements partiels, matériel professionnel'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="luggage-title"
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brand Header */}
        <div className="relative bg-slate-900 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400 block mb-0.5">
                Standardisation IATA &amp; Fret
              </span>
              <h3 id="luggage-title" className="font-black text-base text-white">
                Gabarits Visuels &amp; Équivalents Colis
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Fermer"
            className="p-1.5 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              <span>Évaluation Volumétrique Instantanée</span>
            </span>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mt-2">
              Choisissez le gabarit de votre colis
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Pour éviter toute contestation lors du rendez-vous, comparez votre objet aux équivalents usuels standardisés.
            </p>
          </div>

          {/* Formats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formats.map((f) => {
              const isSelected = selectedFormat === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFormat(f.id as any)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-blue-400/50 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{f.title}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isSelected 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {f.badge}
                      </span>
                    </div>

                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">
                      ≈ {f.equivalent}
                    </p>

                    <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>Poids : <strong className="text-slate-900 dark:text-white">{f.weight}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>Dimensions : <strong className="text-slate-900 dark:text-white">{f.dimensions}</strong></span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/60">
                    Idéal pour : {f.ideal}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Douane & Sanctions Légales Notice */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold">
              <AlertOctagon className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Conformité Douanière &amp; Sanctions Pénales (Loi n°79-07)</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Le voyageur endosse l'entière responsabilité légale du contenu vis-à-vis des douanes dès la prise en charge. Sont strictement interdits :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-700 dark:text-slate-200 font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                Devises non déclarées (&gt; 1 000€)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                Médicaments sans ordonnance valide
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                Tabac (&gt; 1 cartouche autorisée)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                Marchandises contrefaites ou interdites
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Fermer
          </button>

          <button
            onClick={() => {
              if (onSelectFormat) onSelectFormat(selectedFormat);
              onClose();
            }}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-2"
          >
            <span>Confirmer le Format ({selectedFormat})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
