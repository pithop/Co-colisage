import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  Plane, 
  ArrowRight, 
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Loader2,
  Lock,
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="proof-title"
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-cyan-500/30 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Oceanic Brand Header */}
        <div className="relative bg-gradient-to-r from-[#072a4a] via-[#05375c] to-[#0276aa] px-6 py-5 text-white flex items-center justify-between border-b border-cyan-500/25">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
                Protocole Shop &amp; Go
              </span>
            </div>
            <h3 id="proof-title" className="font-black text-lg text-white">
              Validation Obligatoire du Shopper
            </h3>
            <p className="text-xs text-cyan-100/90 font-medium">
              Téléversement des deux preuves tangibles pour débloquer la remise
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
          {/* 3-Step Progress Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-2 p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">
                <CheckCircle2 size={12} />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold truncate">1. Commande</div>
                <div className="text-[9px] text-slate-400 truncate">Séquestre acté</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl border bg-cyan-50 dark:bg-cyan-950/40 border-[#00c2cb] text-[#072a4a] dark:text-cyan-200 ring-2 ring-cyan-400/20">
              <div className="w-5 h-5 rounded-full bg-[#00c2cb] text-[#072a4a] flex items-center justify-center text-[10px] font-black">
                2
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold truncate">2. Preuves</div>
                <div className="text-[9px] text-slate-400 truncate">Ticket &amp; Vol</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500">
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-black">
                3
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold truncate">3. Remise</div>
                <div className="text-[9px] text-slate-400 truncate">Code PIN</div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25">
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Pour éliminer toute fraude ou contrefaçon, vous devez prouver que vous avez acheté l'article vous-même en boutique officielle et que votre vol est confirmé.
            </p>
          </div>

          {/* Proof 1: Receipt / Store Invoice */}
          <div className="border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00838f] dark:text-cyan-400" />
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  1. Preuve d'achat officielle (Ticket / Facture)
                </span>
              </div>
              {receiptUploaded && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Vérifié
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Photo lisible du ticket de caisse à votre nom chez <strong>{product.originStore}</strong> d'un montant de <strong>{product.price.toFixed(2)} €</strong>.
            </p>

            {receiptUploaded ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">Ticket_Caisse_{product.brand}.pdf (1.2 MB) - Montant vérifié</span>
                </div>
                <button 
                  onClick={() => setReceiptUploaded(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[10px] ml-2 shrink-0"
                >
                  Remplacer
                </button>
              </div>
            ) : (
              <button
                onClick={handleSimulateReceipt}
                disabled={loadingReceipt}
                className="w-full py-5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#00bcd4] dark:hover:border-cyan-400 rounded-xl bg-white dark:bg-slate-800/80 flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#00838f] dark:hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {loadingReceipt ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#00bcd4]" />
                    <span className="text-xs font-semibold">Analyse OCR du ticket en cours...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                    <span className="text-xs font-bold">Cliquer pour téléverser le ticket de caisse</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">JPG, PNG ou PDF (max 10 Mo)</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Proof 2: Boarding Pass / Flight Ticket */}
          <div className="border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#00838f] dark:text-cyan-400 -rotate-45" />
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  2. Preuve de voyage (Billet d'avion / Carte d'embarquement)
                </span>
              </div>
              {ticketUploaded && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Vérifié
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Vol correspondant aux dates de l'annonce : <strong>{product.originCity} → {product.destination}</strong>.
            </p>

            {ticketUploaded ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">BoardingPass_AF702_{product.destinationCode}.pdf (Vol direct vérifié)</span>
                </div>
                <button 
                  onClick={() => setTicketUploaded(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[10px] ml-2 shrink-0"
                >
                  Remplacer
                </button>
              </div>
            ) : (
              <button
                onClick={handleSimulateTicket}
                disabled={loadingTicket}
                className="w-full py-5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#00bcd4] dark:hover:border-cyan-400 rounded-xl bg-white dark:bg-slate-800/80 flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#00838f] dark:hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {loadingTicket ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#00bcd4]" />
                    <span className="text-xs font-semibold">Vérification IATA du vol...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                    <span className="text-xs font-bold">Cliquer pour téléverser votre carte d'embarquement</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">PDF, image ou QR Code de vol</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* 3 Reassurance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-cyan-50/50 dark:bg-slate-800/60 border border-cyan-100 dark:border-slate-700">
              <ShieldCheck size={16} className="text-[#00c2cb] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">Séquestre Stripe</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Remboursement garanti sous séquestre.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-cyan-50/50 dark:bg-slate-800/60 border border-cyan-100 dark:border-slate-700">
              <Plane size={16} className="text-[#00c2cb] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">Vol IATA Confirmé</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Rapprochement PNR et carte d'embarquement.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-cyan-50/50 dark:bg-slate-800/60 border border-cyan-100 dark:border-slate-700">
              <Lock size={16} className="text-[#00c2cb] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">Facture Officielle</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Contrôle de ticket contre la contrefaçon.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldAlert className="w-4 h-4 text-[#00c2cb]" />
            <span>Preuves cryptées AES-256 de bout en bout</span>
          </div>

          <button
            onClick={onProceedToDelivery}
            disabled={!isAllValid}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
              isAllValid
                ? 'bg-[#00c2cb] hover:bg-cyan-400 text-[#072a4a] shadow-lg shadow-cyan-500/25 active:scale-95'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Passer à la livraison (Code PIN)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
