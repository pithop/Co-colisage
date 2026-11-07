import type { ConversationData } from "../components/marketplace/Conversation";
import { createMessage } from "../components/marketplace/Conversation";
import { bundledVoiceTranscriptions } from "./voiceTranscriptions";

export function createCodes() {
  const codes = crypto.getRandomValues(new Uint32Array(2));
  const pickupCode = String(1000 + (codes[0] % 9000));
  let deliveryCode = String(1000 + (codes[1] % 9000));
  if (deliveryCode === pickupCode)
    deliveryCode = String(1000 + ((Number(deliveryCode) - 999) % 9000));
  return { pickupCode, deliveryCode };
}

export const initialConversations: ConversationData[] = [];


export function simulatedReply(
  conversation: ConversationData,
  message: string,
) {
  if (/merci|parfait/i.test(message))
    return "Avec plaisir ! Je reste disponible pour finaliser les détails de notre rendez-vous.";
  if (conversation.id === "nike-air-max")
    return "Merci pour votre message ! Pour les Nike Air Max noires en 42, Lyon Part-Dieu me convient. Confirmez-moi votre horaire et gardez le ticket de caisse. Nous pouvons tester l’accord dès que vous êtes prêt.";
  if (conversation.id === "karim-mrs")
    return "Merci ! J’ai bien noté votre message pour le vol Marseille-Alger. Envoyez-moi le poids et les dimensions du colis ; nous pourrons confirmer le rendez-vous à Marseille et à Alger.";
  if (conversation.id === "thomas")
    return "Merci pour ces précisions ! Pour Paris-Lille, je peux récupérer les cartons avant mon départ à 9 h. Confirmez-moi leurs dimensions et le point de rendez-vous.";
  return `Merci pour votre message concernant « ${conversation.subject} ». Je suis disponible pour convenir du rendez-vous et confirmer les modalités avec vous.`;
}
