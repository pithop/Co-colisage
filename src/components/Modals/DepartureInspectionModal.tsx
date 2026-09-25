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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm">Contrôle Physique & Vidéo de 15s au RDV (UC11)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Location info */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 border border-blue-200/80 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-semibold">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>RDV : Dépose-minute Gare Saint-Charles (Marseille)</span>
            </div>
            <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
              Aujourd'hui 14h00
            </span>
          </div>

          {/* Stepper Tabs */}
          <div className="flex border-b border-slate-200 pb-2">
            <button
              onClick={() => setStep(1)}
              className={`flex-1 text-xs font-bold pb-2 border-b-2 text-center transition-colors ${
                step === 1 ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'
              }`}
            >
              1. Vérif. Identité
            </button>
            <button
              onClick={() => setStep(2)}
              className={`flex-1 text-xs font-bold pb-2 border-b-2 text-center transition-colors ${
                step === 2 ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'
              }`}
            >
              2. Vidéo 15s & Scellé
            </button>
            <button
              onClick={() => setStep(3)}
              className={`flex-1 text-xs font-bold pb-2 border-b-2 text-center transition-colors ${
                step === 3 ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'
              }`}
            >
              3. Décharge Légale
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
                    <Video className="w-10 h-10 text-cyan-400 mx-auto" />
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
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${
                  signed ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Finaliser la prise en charge du colis
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
