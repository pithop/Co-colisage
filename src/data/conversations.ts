import type { ConversationData } from "../components/marketplace/Conversation";
import { createMessage } from "../components/marketplace/Conversation";

export function createCodes() {
  const codes = crypto.getRandomValues(new Uint32Array(2));
  const pickupCode = String(1000 + (codes[0] % 9000));
  let deliveryCode = String(1000 + (codes[1] % 9000));
  if (deliveryCode === pickupCode)
    deliveryCode = String(1000 + ((Number(deliveryCode) - 999) % 9000));
  return { pickupCode, deliveryCode };
}

export const initialConversations: ConversationData[] = [
  {
    id: "nike-air-max",
    name: "Sarah",
    subject: "Nike Air Max · pointure 42",
    amount: 145,
    stage: "discussion",
    ...createCodes(),
    messages: [
      createMessage(
        "Bonjour ! Je cherche les Nike Air Max noires, neuves, en pointure 42. Le budget article est de 120 €, avec 25 € pour l’achat et la livraison.",
        false,
      ),
      createMessage(
        "Bonjour Sarah, je peux regarder en boutique à Paris. Où souhaitez-vous récupérer les chaussures ?",
      ),
      createMessage(
        "À Lyon Part-Dieu, en fin de journée si possible. Pourriez-vous garder la boîte et le ticket de caisse ?",
        false,
      ),
      createMessage(
        "Nous pourrons confirmer ensemble la disponibilité, puis enregistrer l’accord pour organiser la prise en charge et la livraison.",
        false,
      ),
    ],
  },
  {
    id: "karim-mrs",
    name: "Karim Bouzid",
    subject: "Vol Marseille-Alger · Air Algérie",
    amount: 81,
    stage: "discussion",
    ...createCodes(),
    messages: [
      createMessage(
        "Bonjour, votre vol Marseille-Alger m’intéresse. Avez-vous encore de la place pour un colis ?",
      ),
      createMessage(
        "Bonjour ! Oui, je partage 9 kg sur mon vol Air Algérie AH1021 au départ de Marseille à 8 h 30. Le tarif est de 9 € par kilo.",
        false,
      ),
      createMessage(
        "Le colis est un cadeau dans son emballage. Peut-on prévoir la remise à l’aéroport ?",
      ),
      {
        ...createMessage(
          "Bien sûr. Indiquez-moi son poids, ses dimensions et son contenu. Nous conviendrons du rendez-vous à Marseille et du destinataire à Alger avant l’accord.",
          false,
        ),
        audio: { url: "/audio/voice-note-1.ogg", duration: 14 },
      },
    ],
  },
  {
    id: "thomas",
    name: "Thomas",
    subject: "Paris-Lille · Peugeot 208",
    amount: 45,
    stage: "discussion",
    ...createCodes(),
    messages: [
      createMessage(
        "Bonjour Thomas, je souhaite faire transporter deux cartons de Paris à Lille.",
      ),
      createMessage(
        "Bonjour ! J’ai de la place dans ma Peugeot 208 : un espace de 80 × 60 × 40 cm. Je pars à 9 h de Paris.",
        false,
      ),
      createMessage(
        "Parfait, je vais mesurer les cartons. La remise peut-elle se faire près de Lille-Flandres ?",
      ),
      createMessage(
        "Oui, nous pouvons nous retrouver près de la gare. Confirmez-moi les dimensions et nous organiserons la prise en charge avec le premier code, puis la livraison avec le second.",
        false,
      ),
    ],
  },
];

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
