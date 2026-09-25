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
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm">Aide Visuelle & Gabarits de Taille (UC02/UC03)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Évaluation Volumétrique Instantanée
            </span>
            <h4 className="text-xl font-extrabold text-slate-900 mt-1">
              Choisissez le gabarit de votre colis
            </h4>
            <p className="text-xs text-slate-500 mt-1">
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
                      ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-900">{f.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {f.badge}
                      </span>
                    </div>

                    <p className="text-xs text-blue-700 font-semibold mb-2">
                      ≈ {f.equivalent}
                    </p>

                    <div className="space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-slate-400" />
                        <span>Poids : <strong>{f.weight}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Dimensions : <strong>{f.dimensions}</strong></span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                    Idéal pour : {f.ideal}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Douane & Sanctions Légales Notice (Algérie & International - UC14) */}
          <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>Conformité Douanière & Sanctions Pénales (Loi n°79-07)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Le voyageur endosse l'entière responsabilité légale du contenu vis-à-vis des douanes dès la prise en charge. Sont strictement interdits :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-700 font-medium">
              <span className="flex items-center gap-1">❌ Devises non déclarées (&gt; 1 000€)</span>
              <span className="flex items-center gap-1">❌ Médicaments sans ordonnance valide</span>
              <span className="flex items-center gap-1">❌ Tabac (&gt; 1 cartouche autorisée)</span>
              <span className="flex items-center gap-1">❌ Marchandises contrefaites ou interdites</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Fermer
          </button>

          <button
            onClick={() => {
              if (onSelectFormat) onSelectFormat(selectedFormat);
              onClose();
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Confirmer le Format ({selectedFormat})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
