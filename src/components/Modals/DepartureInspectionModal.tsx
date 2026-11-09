import React, { useState } from 'react';
import { 
  X, 
  Video, 
  ShieldCheck, 
  Camera, 
  CheckCircle2, 
  FileCheck, 
  MapPin, 
  UserCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface DepartureInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepartureInspectionModal: React.FC<DepartureInspectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [videoCaptured, setVideoCaptured] = useState(false);
  const [signed, setSigned] = useState(false);

  if (!isOpen) return null;

  const startVideoSimulation = () => {
    setIsRecording(true);
    setRecordingProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setRecordingProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsRecording(false);
        setVideoCaptured(true);
      }
    }, 200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="inspection-title"
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-cyan-500/30 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Oceanic Brand Header */}
        <div className="relative bg-gradient-to-r from-[#072a4a] via-[#05375c] to-[#0276aa] px-6 py-5 text-white flex items-center justify-between border-b border-cyan-500/25">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Camera className="w-4 h-4 text-cyan-300" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
                Protocole de Prise en Charge
              </span>
            </div>
            <h3 id="inspection-title" className="font-black text-lg text-white">
              Inspection Physique & Vidéo au RDV
            </h3>
            <p className="text-xs text-cyan-100/90 font-medium">
              Contrôle contradictoire de sécurité entre l'expéditeur et le voyageur
            </p>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Fermer" 
            className="p-1.5 rounded-full text-cyan-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Location info */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs">
            <div className="flex items-center gap-2 text-[#072a4a] dark:text-cyan-200 font-semibold">
              <MapPin className="w-4 h-4 text-[#00c2cb] shrink-0" />
              <span>RDV : Dépose-minute Gare Saint-Charles (Marseille)</span>
            </div>
            <span className="text-[10px] bg-[#00c2cb] text-[#072a4a] font-black px-2.5 py-0.5 rounded-full shadow-sm">
              Aujourd'hui 14h00
            </span>
          </div>

          {/* 3-Step Progress Bar */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                step === 1
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 border-[#00c2cb] text-[#072a4a] dark:text-cyan-200 ring-2 ring-cyan-400/20'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 1 ? 'bg-[#00c2cb] text-[#072a4a]' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                1
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold truncate">Identité</div>
                <div className="text-[9px] text-slate-400 truncate">Contrôle CNI</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                step === 2
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 border-[#00c2cb] text-[#072a4a] dark:text-cyan-200 ring-2 ring-cyan-400/20'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 2 ? 'bg-[#00c2cb] text-[#072a4a]' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                2
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold truncate">Vidéo 15s</div>
                <div className="text-[9px] text-slate-400 truncate">Scellé STEB</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                step === 3
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 border-[#00c2cb] text-[#072a4a] dark:text-cyan-200 ring-2 ring-cyan-400/20'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 3 ? 'bg-[#00c2cb] text-[#072a4a]' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                3
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold truncate">Décharge</div>
                <div className="text-[9px] text-slate-400 truncate">Signature</div>
              </div>
            </button>
          </div>

          {/* Step 1: ID Check */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-xs text-slate-900">Pièce d'identité originale de l'expéditeur</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    Vérifiée (Stripe KYC)
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  L'expéditeur Mohamed T. présente sa CNI française n° 230913... conforme à la demande.
                </p>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-xs"
              >
                Valider l'identité et passer à la vidéo
              </button>
            </div>
          )}

          {/* Step 2: 15s Video Simulation */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="relative w-full h-56 bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-white border-2 border-slate-700">
                {videoCaptured ? (
                  <div className="p-4 text-center space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <p className="font-bold text-sm text-white">Vidéo d'inspection enregistrée (15s)</p>
                    <p className="text-xs text-slate-300">
                      Scellé adhésif anti-effraction numéroté <strong>#DZ-8491</strong> visible. Hachage SHA-256 certifié.
                    </p>
                  </div>
                ) : isRecording ? (
                  <div className="p-4 text-center space-y-3">
                    <div className="w-8 h-8 rounded-full bg-red-600 animate-ping mx-auto" />
                    <p className="font-bold text-sm text-red-400">Enregistrement caméra en cours...</p>
                    <div className="w-48 bg-slate-700 h-2 rounded-full overflow-hidden mx-auto">
                      <div className="bg-red-500 h-full transition-all" style={{ width: `${recordingProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center space-y-2">
                    <Video className="w-10 h-10 text-blue-500 mx-auto" />
                    <p className="font-bold text-xs text-slate-200">
                      Filmez brièvement l'ouverture et la fermeture du colis avec le ruban de sécurité
                    </p>
                    <button
                      onClick={startVideoSimulation}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md"
                    >
                      Démarrer l'enregistrement (15s)
                    </button>
                  </div>
                )}
              </div>

              {videoCaptured && (
                <button
                  onClick={() => setStep(3)}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-xs"
                >
                  Continuer vers la signature de décharge
                </button>
              )}
            </div>
          )}

          {/* Step 3: Legal Liability Signature */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Transfert de responsabilité légale douanière</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  En validant cette prise en charge, vous confirmez avoir inspecté personnellement le colis. La vidéo archivée servira de preuve irréfutable en cas de contrôle aux douanes d'Alger.
                </p>
              </div>

              <div 
                onClick={() => setSigned(!signed)}
                className={`p-4 rounded-2xl border-2 border-dashed flex items-center justify-between cursor-pointer transition-colors ${
                  signed ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-300 hover:border-blue-500'
                }`}
              >
                <div>
                  <p className="font-bold text-xs">Signature électronique du voyageur</p>
                  <p className="text-[10px] text-slate-500">
                    {signed ? "Signé électroniquement (Karim Bouzid - Certifié)" : "Cliquer pour apposer votre signature"}
                  </p>
                </div>
                {signed && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              </div>

              <button
                disabled={!signed}
                onClick={onClose}
                className={`w-full py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                  signed 
                    ? 'bg-[#00c2cb] hover:bg-cyan-400 text-[#072a4a] shadow-lg shadow-cyan-500/25 active:scale-95' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 size={16} />
                <span>Finaliser la prise en charge du colis</span>
              </button>
            </div>
          )}

          {/* 3 Reassurance Guarantee Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-cyan-50/50 dark:bg-slate-800/60 border border-cyan-100 dark:border-slate-700">
              <ShieldCheck size={16} className="text-[#00c2cb] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">Horodatage SHA-256</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Empreinte cryptographique certifiée sur la vidéo.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-cyan-50/50 dark:bg-slate-800/60 border border-cyan-100 dark:border-slate-700">
              <FileCheck size={16} className="text-[#00c2cb] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">Scellé STEB Numéroté</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Adhésif inviolable anti-effraction visible.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-cyan-50/50 dark:bg-slate-800/60 border border-cyan-100 dark:border-slate-700">
              <UserCheck size={16} className="text-[#00c2cb] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">Décharge Douanière</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Protection juridique voyageur aux frontières.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
