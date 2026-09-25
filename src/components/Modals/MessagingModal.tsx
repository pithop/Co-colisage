import React, { useState } from 'react';
import { 
  X, 
  Send, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  CreditCard, 
  AlertTriangle,
  Bot
} from 'lucide-react';

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayCommission: () => void;
}

interface Message {
  id: string;
  sender: 'expediteur' | 'voyageur' | 'system';
  text: string;
  time: string;
  warning?: boolean;
}

export const MessagingModal: React.FC<MessagingModalProps> = ({
  isOpen,
  onClose,
  onPayCommission,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'voyageur',
      text: 'Bonjour ! J\'ai bien vu votre demande de transport Marseille ➔ Alger. Mon départ est prévu ce vendredi.',
      time: '14:02'
    },
    {
      id: '2',
      sender: 'expediteur',
      text: 'Parfait ! Est-ce que vous pouvez prendre un colis de 3 kg de vêtements et parfums ?',
      time: '14:05'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Regex anti-bypass detecting phone numbers (FR 06/07, DZ 05/06/07, international +33, +213, whatsapp, emails)
  const phoneOrEmailRegex = /(\+?(33|213)[0-9\s.-]{8,})|((0[567])[0-9\s.-]{8,})|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(whatsapp|insta|snap|num[eé]ro|0[1-9]([\s.-]?[0-9]{2}){4})/i;

  const userMessagesCount = messages.filter(m => m.sender !== 'system').length;
  const isLocked = userMessagesCount >= 5;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLocked) return;

    let textToSend = inputText;
    let hasViolation = false;

    if (phoneOrEmailRegex.test(inputText)) {
      hasViolation = true;
      textToSend = inputText.replace(phoneOrEmailRegex, '[COORDONNÉE MASQUÉE POUR VOTRE SÉCURITÉ]');
      setWarningMessage("Règle RM-05 : L'échange de coordonnées directes est bloqué avant réservation sécurisée.");
    } else {
      setWarningMessage(null);
    }

    const newMessage: Message = {
      id: String(Date.now()),
      sender: 'expediteur',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      warning: hasViolation
    };

    const nextMessages = [...messages, newMessage];

    // If reaching lock threshold (5 user messages)
    if (nextMessages.filter(m => m.sender !== 'system').length >= 5) {
      nextMessages.push({
        id: String(Date.now() + 1),
        sender: 'system',
        text: '🔒 Sécurité BagVoyage (UC12) : Limite de 5 messages atteinte. Afin d\'éviter le contournement et protéger les fonds sous séquestre, veuillez confirmer votre réservation pour débloquer la discussion.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    setMessages(nextMessages);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[600px] max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
                alt="Karim B." 
                className="w-9 h-9 rounded-full object-cover border border-white/20"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 ring-2 ring-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">Karim Bouzid</h3>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 px-1.5 py-0.5 rounded font-semibold">
                  Marseille ➔ Alger
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Ferry Corsica Linea • Départ dans 2 jours
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter and Security Banner */}
        <div className="bg-slate-100/90 px-4 py-2 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">Anti-Contournement UC12</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Messages échangés :</span>
            <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
              isLocked 
                ? 'bg-red-100 text-red-700' 
                : userMessagesCount >= 4 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'bg-blue-100 text-blue-700'
            }`}>
              {userMessagesCount} / 5
            </span>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.map((m) => {
            if (m.sender === 'system') {
              return (
                <div key={m.id} className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-medium">{m.text}</p>
                  </div>
                  <button
                    onClick={onPayCommission}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Régler la commission fixe & débloquer</span>
                  </button>
                </div>
              );
            }

            const isMe = m.sender === 'expediteur';
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-br-xs' 
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                }`}>
                  <p>{m.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-400">
                  <span>{m.time}</span>
                  {m.warning && (
                    <span className="text-amber-500 font-bold">• Donnée sensible filtrée</span>
                  )}
                </div>
              </div>
            );
          })}

          {warningMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{warningMessage}</span>
            </div>
          )}
        </div>

        {/* Input Bar or Locked Overlay */}
        <div className="p-3 bg-white border-t border-slate-100">
          {isLocked ? (
            <div className="flex items-center justify-between gap-3 p-3 bg-slate-900 text-white rounded-2xl">
              <div className="flex items-center gap-2 text-xs">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">Discussion verrouillée après 5 échanges</span>
              </div>
              <button
                onClick={onPayCommission}
                className="px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all"
              >
                Débloquer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Écrivez un message (ex: testez un numéro 06 12 34 56 78)..."
                className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
              <button
                type="submit"
                className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
