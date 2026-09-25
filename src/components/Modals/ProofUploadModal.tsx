import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  Plane, 
  ArrowRight, 
  ShieldAlert,
  Sparkles,
  Loader2
} from 'lucide-react';
import { ProductItem } from '../../types';

interface ProofUploadModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onProceedToDelivery: () => void;
}

export const ProofUploadModal: React.FC<ProofUploadModalProps> = ({
  product,
  onClose,
  onProceedToDelivery,
}) => {
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [ticketUploaded, setTicketUploaded] = useState(false);
  const [loadingReceipt, setLoadingReceipt] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false);

  if (!product) return null;

  const handleSimulateReceipt = () => {
    setLoadingReceipt(true);
    setTimeout(() => {
      setLoadingReceipt(false);
      setReceiptUploaded(true);
    }, 1200);
  };

  const handleSimulateTicket = () => {
    setLoadingTicket(true);
    setTimeout(() => {
      setLoadingTicket(false);
      setTicketUploaded(true);
    }, 1200);
  };

  const isAllValid = receiptUploaded && ticketUploaded;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <h3 className="font-bold text-sm">Validation Obligatoire du Shopper</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Étape 2 du protocole de confiance
            </span>
            <h4 className="text-lg font-extrabold text-slate-900 mt-1">
              Téléversement des deux preuves tangibles
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Pour éliminer toute fraude ou transport illicite, le Shopper doit obligatoirement prouver qu'il a lui-même acheté l'article en boutique et qu'il possède un vol confirmé.
            </p>
          </div>

          {/* Proof 1: Receipt / Store Invoice */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs text-slate-900">
                  1. Preuve d'achat officielle (Ticket / Facture)
                </span>
              </div>
              {receiptUploaded && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Vérifié
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Photo lisible du ticket de caisse à votre nom chez <strong>{product.originStore}</strong> d'un montant de <strong>{product.price.toFixed(2)} €</strong>.
            </p>

            {receiptUploaded ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ticket_Caisse_{product.brand}.pdf (1.2 MB) - Montant vérifié</span>
                </div>
                <button 
                  onClick={() => setReceiptUploaded(false)}
                  className="text-slate-400 hover:text-slate-600 text-[10px]"
                >
                  Remplacer
                </button>
              </div>
            ) : (
              <button
                onClick={handleSimulateReceipt}
                disabled={loadingReceipt}
                className="w-full py-5 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl bg-white flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {loadingReceipt ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="text-xs font-semibold">Analyse OCR du ticket en cours...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-slate-400" />
                    <span className="text-xs font-bold">Cliquer pour téléverser le ticket de caisse</span>
                    <span className="text-[10px] text-slate-400">JPG, PNG ou PDF (max 10 Mo)</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Proof 2: Boarding Pass / Flight Ticket */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-cyan-600 -rotate-45" />
                <span className="font-bold text-xs text-slate-900">
                  2. Preuve de voyage (Billet d'avion / Carte d'embarquement)
                </span>
              </div>
              {ticketUploaded && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Vérifié
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Vol correspondant aux dates de l'annonce : <strong>{product.originCity} ➔ {product.destination}</strong>.
            </p>

            {ticketUploaded ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>BoardingPass_AF702_{product.destinationCode}.pdf (Vol direct vérifié)</span>
                </div>
                <button 
                  onClick={() => setTicketUploaded(false)}
                  className="text-slate-400 hover:text-slate-600 text-[10px]"
                >
                  Remplacer
                </button>
              </div>
            ) : (
              <button
                onClick={handleSimulateTicket}
                disabled={loadingTicket}
                className="w-full py-5 border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-xl bg-white flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-cyan-600 transition-colors cursor-pointer"
              >
                {loadingTicket ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-600" />
                    <span className="text-xs font-semibold">Vérification IATA du vol...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-slate-400" />
                    <span className="text-xs font-bold">Cliquer pour téléverser votre carte d'embarquement</span>
                    <span className="text-[10px] text-slate-400">PDF, image ou QR Code de vol</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <ShieldAlert className="w-4 h-4 text-blue-500" />
            <span>Preuves cryptées de bout en bout</span>
          </div>

          <button
            onClick={onProceedToDelivery}
            disabled={!isAllValid}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              isAllValid
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Passer à la simulation de livraison (Code PIN)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
