---
name: mobile-ui-ux-pro
description: >-
  Elite Mobile UI/UX design system guide and standards (Apple HIG, Linear Mobile, Stripe Terminal level).
  Use when designing mobile-first responsive web apps, PWAs, bottom navigation, touch targets,
  haptic-like feedback, bottom sheets, camera scanners, and offline-first interfaces.
---

# Mobile UI/UX Pro Design System (Apple HIG & Linear Standards)

## 1. Touch Targets & Ergonomie Thumb-Zone
- Cible Tactile Minimale : 44 x 44 px (strict minimum Apple HIG). Idéalement 48 x 48 px pour les boutons d'action critique.
- Zone du Pouce (Thumb Zone) :
  - Placer les actions récurrentes, onglets et boutons primaires dans le tiers inférieur de l'écran.
  - Réserver le quart supérieur aux informations d'état passives, titres et navigation contextuelle.
- Support des Safe Areas iOS & Android :
  padding-top: max(16px, env(safe-area-inset-top));
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));

## 2. Système de Grille & Espacements (8pt Grid)
- Utiliser rigoureusement l'échelle de 8pt : 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px.
- Densité mobile optimisée : marges extérieures d'écran de 16px sur mobile (20px sur tablettes).
- Espacement vertical entre cartes : 12px ou 16px maximum pour préserver la compacité.

## 3. Micro-Interactions & Physique Tactile
- Feedback Tactile Immédiat :
  transition: transform 150ms cubic-bezier(0.25, 1, 0.5, 1), opacity 150ms ease;
  active state: transform: scale(0.98); opacity: 0.88;
- Modales en Bottom Sheet :
  - Sur mobile (<= 768px), préférer les feuilles ancrées en bas avec poignée de glissement (drag handle de 36 x 4 px, arrondi complet, fond rgba(0,0,0,0.2)).
  - Transition : glissement vertical depuis le bas (translateY(100%) vers translateY(0)).
- Navigation en Pile (Stack Navigation) :
  - Défilement horizontal avec glissement de page inspiré de UINavigationController.
  - Bouton retour systématiquement aligné à gauche avec libellé clair ou flèche directionnelle.

## 4. Palette Visuelle & Tokens Institutionnels ($1B Unicorn)
- Fond d'application : Blanc pur #FFFFFF ou Slate très clair #F8FAFC.
- Cartes & Conteneurs : Fond blanc avec bordure subtile 1px solid rgba(226, 232, 240, 0.8) et ombre portée multicouche.
- Bleu Signature Institutionnel : #2563EB (Bleu Cobalt / Royal) pour les CTA primaires et états actifs.
- Noir Aéronautique : #0F172A / #0A1128 pour les passes numériques, en-têtes contrastés et badges haute sécurité.
- Vert Séquestre & Profits : #059669 / #10B981 pour les gains nets voyageurs et statuts séquestrés.
- Ambre Alerte & Hors-Ligne : #D97706 / #F59E0B pour les états d'attente de synchronisation et consignes.

## 5. Règle Stricte ZÉRO EMOJI
- Interdiction Formelle : Aucun caractère emoji ou dingbat Unicode dans le code source, les textes, les balises d'accessibilité ou les styles.
- Remplacement Exclusif : Utiliser uniquement des icônes vectorielles SVG (ex: lucide-react) avec cotes définies (size={16} à size={24}).

## 6. Conception Hors-Ligne (Offline-First) & Résilience
- Détection en direct des changements d'état réseau (navigator.onLine, événements online / offline).
- Notification d'état réseau non intrusive (pastille ou bandeau supérieur fin "Mode aéroport hors-ligne").
- Stockage local immédiat des actions utilisateur dans localStorage ou IndexedDB avec file de synchronisation asynchrone dès le retour de la connectivité.
