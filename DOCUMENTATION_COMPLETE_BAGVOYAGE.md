# BagVoyage — Documentation Technique & Fonctionnelle Complète de l’Application

Bienvenue dans la documentation officielle de référence de **BagVoyage**, la plateforme transméditerranéenne de co-valisage, d’acheminement sécurisé de colis et de shopping transfrontalier.

Ce document fournit une explication exhaustive, détaillée et structurée de l’ensemble de l’application : de la Landing Page jusqu’aux moindres pages internes, en passant par la messagerie, les notifications, l'écosystème logistique, le portefeuille FinTech et le studio d’administration.

---

## Sommaire Général

1. [Vue d’Ensemble & Vision du Produit](#1-vue-densemble--vision-du-produit)
2. [Architecture Technique & Stack Logotée](#2-architecture-technique--stack-logotée)
3. [Cartographie des Routes & Pages Publiques](#3-cartographie-des-routes--pages-publiques)
   - [3.1 Landing Page Awwwards & Simulateur](#31-landing-page-awwwards--simulateur)
   - [3.2 Comment ça marche (/comment-ca-marche)](#32-comment-ça-marche-comment-ca-marche)
   - [3.3 Tarifs & Rémunérations (/tarifs)](#33-tarifs--rémunérations-tarifs)
   - [3.4 Sécurité & Tiers de Confiance (/securite)](#34-sécurité--tiers-de-confiance-securite)
   - [3.5 FAQ & Support (/faq)](#35-faq--support-faq)
4. [Les Trois Modes Opérationnels Marketplace](#4-les-trois-modes-opérationnels-marketplace)
   - [4.1 Mode Bag & Go (Transport de Colis)](#41-mode-bag--go-transport-de-colis)
   - [4.2 Mode Voyageur (Co-valisage & Rentabilisation de Trajet)](#42-mode-voyageur-co-valisage--rentabilisation-de-trajet)
   - [4.3 Mode Shop & Go (Shopping Transfrontalier & Duty-Free)](#43-mode-shop--go-shopping-transfrontalier--duty-free)
5. [Radar Méditerranée & Arbitrage IA Intelligent (/radar)](#5-radar-méditerranée--arbitrage-ia-intelligent-radar)
6. [Explorer & Fiches Détails Riches](#6-explorer--fiches-détails-riches)
   - [6.1 Page Explorer (/explore) & Filtres Avancés](#61-page-explorer-explore--filtres-avancés)
   - [6.2 Fiche Détail Demande (RequestDetails)](#62-fiche-détail-demande-requestdetails)
   - [6.3 Fiche Détail Trajet (TripDetails)](#63-fiche-détail-trajet-tripdetails)
7. [Assistants de Publication & Scanner OCR](#7-assistants-de-publication--scanner-ocr)
   - [7.1 Assistant de Publication (Publish.tsx)](#71-assistant-de-publication-publishtsx)
   - [7.2 Compositeur de Colis (ParcelComposer.tsx)](#72-compositeur-de-colis-parcelcomposertsx)
   - [7.3 Scanner OCR de Billets (TicketScannerModal.tsx)](#73-scanner-ocr-de-billets-ticketscannermodaltsx)
8. [Messagerie Instantanée, Négociation & Voix](#8-messagerie-instantanée-négociation--voix)
   - [8.1 Clavardage & Stepper d'Étape de Contrat](#81-clavardage--stepper-détape-de-contrat)
   - [8.2 Lecteur Audio Interactif & Transcription](#82-lecteur-audio-interactif--transcription)
   - [8.3 Détection Anti-Fraude & Sécurité de Contact](#83-détection-anti-fraude--sécurité-de-contact)
9. [Système de Notifications & Alertes Temps Réel](#9-système-de-notifications--alertes-temps-réel)
   - [9.1 Tiroir Latéral de Notifications (NotificationsDrawer.tsx)](#91-tiroir-latéral-de-notifications-notificationsdrawertsx)
   - [9.2 Toasts d'Opportunités & Statut Réseau](#92-toasts-dopportunités--statut-réseau)
10. [Suivi Logistique & Écosystème des Modales](#10-suivi-logistique--écosystème-des-modales)
    - [10.1 Page de Suivi (/tracking)](#101-page-de-suivi-tracking)
    - [10.2 Lettre de Voiture / LTA (WaybillModal.tsx)](#102-lettre-de-voiture--lta-waybillmodaltsx)
    - [10.3 Calculateur & Franchises Douanières (CustomsModal.tsx)](#103-calculateur--franchises-douanières-customsmodaltsx)
    - [10.4 Passe Numérique de Fret (DigitalCargoPassModal.tsx)](#104-passe-numérique-de-fret-digitalcargopassmodaltsx)
    - [10.5 Modale de Remise & Double Code PIN (PinDeliveryModal.tsx)](#105-modale-de-remise--double-code-pin-pindeliverymodaltsx)
    - [10.6 Signalement de Retard de Vol (FlightDelayDialog)](#106-signalement-de-retard-de-vol-flightdelaydialog)
11. [FinTech, Portefeuille & Séquestre Stripe Connect](#11-fintech-portefeuille--séquestre-stripe-connect)
    - [11.1 Vue Portefeuille (/wallet)](#111-vue-portefeuille-wallet)
    - [11.2 Protocole de Séquestre à 2 Étapes](#112-protocole-de-séquestre-à-2-étapes)
    - [11.3 Support Bancaire Maghreb (RIB 20 Chiffres) & SEPA](#113-support-bancaire-maghreb-rib-20-chiffres--sepa)
12. [Authentification, Profil & Conformité KYC eIDAS](#12-authentification-profil--conformité-kyc-eidas)
    - [12.1 Connexion, Inscription & Session (AuthContext.tsx)](#121-connexion-inscription--session-authcontexttsx)
    - [12.2 Espace Profil (/profile)](#122-espace-profil-profile)
    - [12.3 Vérification d'Identité KYC](#123-vérification-didentité-kyc)
13. [Dashboards par Rôle & Espace Professionnel](#13-dashboards-par-rôle--espace-professionnel)
    - [13.1 Tableau de Bord Voyageur](#131-tableau-de-bord-voyageur)
    - [13.2 Tableau de Bord Expéditeur](#132-tableau-de-bord-expéditeur)
    - [13.3 Tableau de Bord Transporteur & Onboarding Pro](#133-tableau-de-bord-transporteur--onboarding-pro)
14. [Console d’Administration & Database Studio (/admin)](#14-console-dadministration--database-studio-admin)
    - [14.1 Supervision & Modération KYC](#141-supervision--modération-kyc)
    - [14.2 Arbitrage des Litiges et Décisions de Séquestre](#142-arbitrage-des-litiges-et-décisions-de-séquestre)
    - [14.3 Database Studio & Exportateur SQL Intégral](#143-database-studio--exportateur-sql-intégral)

---

## 1. Vue d’Ensemble & Vision du Produit

BagVoyage résout la problématique historique des flux logistiques entre l'Europe et le Maghreb (France, Espagne, Italie ↔ Algérie, Maroc, Tunisie). Alors que le fret classique via les transporteurs traditionnels est souvent onéreux, lent (plusieurs semaines) et opaque, des centaines de vols et de ferries traversent quotidiennement la Méditerranée avec des dizaines de tonnes de franchises de bagages inexploitées.

BagVoyage transforme cette capacité dormante en un **réseau logistique pair-à-pair ultra-rapide, sécurisé et certifié**, opéré en moins de 24 à 48 heures :
- **Pour l'expéditeur** : l'assurance d'un colis livré en main propre dès l'atterrissage, avec caution bloquée sous séquestre et scellé inviolable OACI STEB.
- **Pour le voyageur** : la possibilité de rentabiliser jusqu'à 100 % du coût de son billet d'avion ou de ferry en transportant des kilos légalement déclarés.
- **Pour l'acheteur (Shop & Go)** : l'accès à des produits européens indisponibles localement (parapharmacie, mode, pièces électroniques, duty-free) achetés en magasin par un voyageur vérifié.

---

## 2. Architecture Technique & Stack Logotée

L'application est bâtie sur une architecture web moderne, offline-first et haute performance :

| Composant | Technologie | Rôle & Spécificités |
| :--- | :--- | :--- |
| **Framework UI** | React 18 & TypeScript | Typage strict à 100 %, modularité composant, zéro avertissement console |
| **Styles & Design** | Tailwind CSS + CSS Modules | Palette certifiée (Bleu Royal `#2563eb`, Émeraude `#059669`, Nuit `#0f172a`), Dark Mode natif |
| **Iconographie** | Lucide React | 100 % vectoriel SVG, 0 émoji Unicode conformément aux chartes Apple & Stripe |
| **Base de Données Locale** | IndexedDB v2 (`productionDb.ts`) | 10 tables typées, persistance locale, outbox de mutations hors-ligne avec replay auto |
| **Paiements & FinTech** | Stripe Connect & Escrow API | Séquestre en 2 étapes (PaymentIntent `requires_capture`), libération sur code PIN |
| **Télémétrie & Radar** | OpenSky ADS-B / AIS Proxy | Données satellites réelles des vols commerciaux et ferries en Méditerranée |
| **Vision IA & OCR** | Tesseract.js & jsQR | Reconnaissance automatique de billets (PNR, dates, aéroports) et pass QR |
| **Build & Prerendering** | Vite SSG (scripts/prerender.mjs) | 10 routes statiques pré-rendues pour un SEO et un temps de chargement éclair (< 1s) |

---

## 3. Cartographie des Routes & Pages Publiques

### 3.1 Landing Page Awwwards & Simulateur
Accessible sur `/` et `/landing/`, cette page vitrine offre une expérience visuelle immersive récompensée par les standards Awwwards Site of the Year :
- **Hero Section Dynamique** : Slogan accrocheur, badges de confiance « Certifié OACI & Stripe Connect », et sélecteur de mode immédiat (Bag&Go, Voyageur, Shop&Go).
- **Simulateur de Gains Interactif** : Permet à un futur voyageur de sélectionner sa liaison (ex. *Paris CDG ➔ Alger ALG*), son mode de transport, ses kilos disponibles, et de calculer instantanément le gain net estimé (ex. `23 kg × 5 € = +115 €`).
- **Badges Mobiles** : Liens de téléchargement vers l'application PWA / iOS & Android avec modale de lancement dédiée (`MobileAppLaunchModal.tsx`).
- **Preuves Sociales & Avis Certifiés** : Carousel d'avis vérifiés basés sur des remises sous séquestre réelles.

### 3.2 Comment ça marche (`/comment-ca-marche`, `/how-it-works`)
Présentation didactique en 4 étapes clés :
1. **Dépôt ou Recherche d’Annonce** : Spécification des articles ou kilos disponibles.
2. **Accord & Séquestre Bancaire** : Le montant est bloqué par Stripe, l'expéditeur ne verse rien directement au voyageur.
3. **Prise en Charge & Scellé STEB** : Rencontre au départ ou dépôt sécurisé, photo de conformité.
4. **Remise Finale & Code PIN** : Le destinataire transmet son code secret à 4 chiffres ou son QR code ; la saisie débloque instantanément le virement sur le compte du voyageur.

### 3.3 Tarifs & Rémunérations (`/tarifs`, `/pricing`)
Modèle transparent sans frais cachés :
- **Commission Plateforme** : 15 % du service brut facturés à l'expéditeur pour financer l'assurance tous risques, le tiers de confiance et les contrôles KYC.
- **Rémunération Voyageur** : 100 % de la commission convenue reversée sans retenue.
- **Grille indicative au kilo** :
  - Aérien : 4,00 € à 7,00 € / kg.
  - Maritime (Ferry) : 2,50 € à 4,50 € / kg (idéal pour gros volumes et cartons).
  - Terrestre / Véhicule : 2,00 € à 3,50 € / kg.

### 3.4 Sécurité & Tiers de Confiance (`/securite`, `/trust`)
Détail des 4 garanties fondamentales :
- **Passeport Numérique & eIDAS** : 100 % des profils actifs vérifiés par scan d'identité officiel et selfie biométrique.
- **Scellé Inviolable OACI STEB** : Sacoche de sécurité numérotée à fermeture indétectable pour éviter toute altération en transit.
- **Séquestre Financier Européen** : Aucun échange d'espèces lors de la remise ; les fonds sont garantis par un compte séquestre certifié ACPR.
- **Traçabilité Satellite en Continu** : Intégration ADS-B permettant de suivre l'altitude, la vitesse et l'atterrissage effectif du vol associé.

### 3.5 FAQ & Support (`/faq`)
Base de connaissances catégorisée répondant aux questions essentielles :
- Quels sont les articles strictement prohibés (marchandises dangereuses, stupéfiants, contrefaçons) ?
- Que se passe-t-il en cas de retard ou d'annulation de vol ?
- Comment fonctionne la réclamation en cas de colis non conforme ?

---

## 4. Les Trois Modes Opérationnels Marketplace

L'application BagVoyage intègre un commutateur multi-plateformes ergonomique permettant de naviguer instantanément entre 3 expériences dédiées :

### 4.1 Mode Bag & Go (Transport de Colis)
*Fichier : `src/components/BagAndGo/BagAndGoPlatform.tsx`*
- Dédié aux particuliers et professionnels souhaitant faire acheminer un colis.
- **Presets de Colis Rapides** : Boutons de sélection en 1 clic pour les formats courants (Pli documentaire 0.5 kg, Clés/Documents 0.2 kg, Smartphone/High-Tech 1 kg, Vêtements 3 kg, Coffret Terroir 5 kg, Carton Standard 10 kg).
- **Calculateur de Gabarit & Poids Volumétrique IATA** : Vérification de la conformité cabine/soute selon la formule standard :
  $$\text{Poids Volumétrique (kg)} = \frac{\text{Longueur (cm)} \times \text{Largeur (cm)} \times \text{Hauteur (cm)}}{5000}$$
- **Cartes d’Annonces Dédiées** : Visualisation claire du lieu de collecte, lieu de livraison, rémunération proposée et urgence.

### 4.2 Mode Voyageur (Co-valisage & Rentabilisation de Trajet)
*Fichier : `src/components/Voyageur/VoyageurPlatform.tsx`*
- Dédié aux personnes ayant un déplacement planifié (avion, ferry, voiture, train).
- **Sélecteur de 5 Modes de Transport** : Adaptation dynamique des champs selon le véhicule (Numéro de vol et aéroports IATA pour l'avion, navire et port pour le ferry, marque et capacité coffre pour la voiture).
- **Bannière d'Autofinancement de Billet** : Calcule en temps réel le pourcentage du billet remboursé par les colis transportés.
- **Filtres de Catégories Acceptées** : Le voyageur peut restreindre les objets qu'il accepte de transporter (Électronique, Mode, Terroir, Documents, Cosmétiques).

### 4.3 Mode Shop & Go (Shopping Transfrontalier & Duty-Free)
*Fichier : `src/components/ShopAndGo/ShopAndGoPlatform.tsx`*
- Dédié aux commandes d’achats en magasin ou duty-free aéroportuaire.
- **Catalogue de Produits Tendance** : Présentation d'articles recherchés avec prix en magasin et gain offert au voyageur acheteur.
- **Panier Multi-Articles** : Possibilité d'associer plusieurs achats (ex. *Parfum Duty-Free + Crème pharmacie + Tablette*) dans une même mission.
- **Obligation de Preuve d'Achat** : Le voyageur doit téléverser une photo du ticket de caisse certifiant le prix réel payé avant d'être remboursé.

---

## 5. Radar Méditerranée & Arbitrage IA Intelligent (`/radar`)

*Fichiers : `src/components/Radar/InteractiveRadarPage.tsx`, `InteractiveMediterraneanMap.tsx`, `SmartFlightArbitrage.tsx`*

Le Radar Méditerranée est l'une des innovations majeures de BagVoyage :
- **Carte Vectorielle Interactive** : Affiche les couloirs maritimes et aériens en temps réel au-dessus de la mer Méditerranée.
- **Télémétrie en Direct** :
  - Avions : numéro de vol (ex. AH1021, AF1854, TO7250), altitude, vitesse, aéroports IATA départ/arrivée.
  - Ferries : navires (ex. Méditerranée, Badji Mokhtar III, Danielle Casanova), vitesse en nœuds, liaison portuaire.
- **Moteur d'Arbitrage IA de Vol Gratuit (`SmartFlightArbitrage.tsx`)** :
  - L'algorithme scanne simultanément les vols à bas prix et les demandes de shopping en attente sur la même liaison.
  - Lorsqu'une opportunité est détectée (ex. *Billet Marseille-Alger à 49 € face à 150 € de commandes en attente*), une alerte spéciale est générée :
  $$\text{Gain Net Voyageur} = 150\ € - 49\ € = +101\ €\ \text{(Vol financé à 100 \% + bénéfice)}$$
  - Un clic permet de réserver le package de missions d'arbitrage en une seule opération.

---

## 6. Explorer & Fiches Détails Riches

### 6.1 Page Explorer (`/explore`) & Filtres Avancés
*Fichier : `src/components/marketplace/Explorer.tsx`*
- **Recherche Multi-Critères** : Filtrage par ville de départ, ville d'arrivée, date souhaitée (`>= date`), mode de transport et budget.
- **Puces de Couloirs Fréquents** : Accès direct en un clic aux liaisons majeures :
  `[Paris ➔ Alger]` `[Marseille ➔ Oran]` `[Lyon ➔ Constantine]` `[Nice ➔ Tunis]` `[Paris ➔ Casablanca]`.
- **Ordre Visuel Conforme WCAG** : Affichage prioritaire des annonces directement sous les filtres sans rupture de lecture.

### 6.2 Fiche Détail Demande (`RequestDetails`)
*Fichier dans `src/components/marketplace/Details.tsx`*
- Affiche le détail complet d'un colis ou panier d'achat à transporter :
  - Photos grand angle avec zoom.
  - Coordonnées de prise en charge et de remise.
  - Poids exact et dimensions.
  - Décomposition financière : Valeur marchande déclarée, franchise douanière estimée, rémunération nette offerte au voyageur.
  - Profil de l'expéditeur (badge d'identité vérifiée, notation par étoiles, historique de missions réussies).

### 6.3 Fiche Détail Trajet (`TripDetails`)
*Fichier dans `src/components/marketplace/Details.tsx`*
- Affiche le détail d'un départ de voyageur :
  - Numéro de vol / transporteur officiel (Air Algérie, Transavia, Air France, Corsica Linea, etc.).
  - Date et heure précise de départ et d'arrivée.
  - Kilos disponibles restants dans les bagages et tarif proposé au kilo (`€ / kg`).
  - Avis clients détaillés avec avatars, dates formatées et étoiles dorées.

---

## 7. Assistants de Publication & Scanner OCR

### 7.1 Assistant de Publication (`Publish.tsx`)
*Fichier : `src/components/marketplace/Publish.tsx`*
- Formulaire interactif en accordéon gérant simultanément la publication de demandes d'achat et de trajets voyageurs.
- **Calculateur de Rentabilité en Direct** : Dès que l'utilisateur modifie ses kilos ou son tarif, le gain brut estimé est recalculé.
- **Dock Sticky Flottant Inférieur** : Affiche en permanence le total exact (frais plateforme 15 % inclus) et le bouton d'action principal au-dessus de la barre de navigation.

### 7.2 Compositeur de Colis (`ParcelComposer.tsx`)
*Fichier : `src/components/marketplace/ParcelComposer.tsx`*
- Dédié à la création de colis certifiés BagAndGo :
  - **Galerie Photo Sécurisée** : Jusqu'à 6 photos avec boutons de suppression tactiles larges (>= 44px conforme Apple HIG).
  - **Sélecteur de Flexibilité** : Urgent (24h-48h), Cette semaine, ou Date limite impérative.
  - **Calculateur Douanier Intégré** : Sens de transit (France ➔ Algérie ou inverse), identification du régime de franchise (150 000 DZD ou 430 EUR), et avertissement en cas d'excédent imposable.

### 7.3 Scanner OCR de Billets (`TicketScannerModal.tsx`)
*Fichier : `src/lib/ticketScanner.ts` & `src/components/Modals/TicketScannerModal.tsx`*
- Permet à un voyageur de scanner son billet électronique (PDF ou photo de carte d'embarquement).
- **Moteur OCR Haute Précision** :
  - Reconnaissance automatique du code PNR (6 caractères alphanumériques).
  - Détection de 18 aéroports euro-méditerranéens (CDG, ORY, MRS, LYS, NCE, TLS, BOD, NTE, ALG, ORN, CZL, BJA, TLM, BAA, BCN, MAD, TUN, CMN).
  - Détection de 8 compagnies aériennes partenaires (Air Algérie, Air France, Transavia, Vueling, Tassili Airlines, Nouvelair, Tunisair, Royal Air Maroc).
  - Extraction de la franchise bagage soute autorisée (ex. 23 kg, 30 kg ou 2×23 kg).
  - Pré-remplissage instantané du formulaire de trajet sans saisie manuelle.

---

## 8. Messagerie Instantanée, Négociation & Voix

*Fichiers : `src/components/marketplace/Conversation.tsx`, `AudioMessagePlayer.tsx`*

La messagerie de BagVoyage n'est pas un simple clavardage, c'est un **espace d'exécution contractuelle sécurisé** :

### 8.1 Clavardage & Stepper d'Étape de Contrat
En en-tête de chaque discussion, un stepper à 4 états matérialise l'état d'avancement de la mission :
```
[1. Échange & Négociation] ➔ [2. Fonds Séquestrés] ➔ [3. Prise en Charge] ➔ [4. Colis Livré]
```
- **Bouton d'Ajustement d'Offre** : En phase d'échange, permet de faire une contre-proposition financière sans quitter la discussion.
- **Accusés de Réception Réalistes** :
  - Simple coche (`Check`) : message transmis au serveur.
  - Double coche (`CheckCheck`) : message distribué et lu par l'interlocuteur.

### 8.2 Lecteur Audio Interactif & Transcription
- Envoi et lecture de notes vocales compressées pour faciliter les échanges rapides entre voyageurs en déplacement et expéditeurs.
- **Forme d'Onde Tactile & Seekable** : La barre d'onde SVG réagit au clic et au toucher (`role="slider"`) pour avancer ou reculer précisément dans l'audio.
- **Transcription Textuelle Automatique** : Sous chaque note vocale, affichage de la transcription écrite en français pour une consultation silencieuse ou en milieu bruyant (aéroports, gares).

### 8.3 Détection Anti-Fraude & Sécurité de Contact
Afin de protéger les utilisateurs des arnaques hors-plateforme, un analyseur heuristique et regex inspecte les messages en cours de rédaction :
- Détection des numéros de téléphone (06, 07, indicatifs internationaux `+33`, `+213`, `+212`, `+216`).
- Détection des mots-clés de contournement (WhatsApp, Telegram, virement direct, cash en main propre).
- Affichage d'un avertissement de sécurité rappelant que les garanties d'assurance et de séquestre sont nulles en dehors de BagVoyage.

---

## 9. Système de Notifications & Alertes Temps Réel

*Fichiers : `src/components/marketplace/NotificationsDrawer.tsx`, `LiveArbitrageToast.tsx`*

### 9.1 Tiroir Latéral de Notifications (`NotificationsDrawer.tsx`)
Accessible via l'icône cloche de l'en-tête, ce panneau latéral s'ouvre avec un flou d'arrière-plan soigné. Il centralise 4 catégories critiques d'événements :
1. **Opportunités d'Arbitrage IA** : Alerte de billet d'avion finançable par des commandes shopping groupées.
2. **Suivi d'Expédition** : Notification dès que le voyageur valide la prise en charge d'un colis avec photo de conformité.
3. **Alertes Retard Transporteur** : Signalement instantané si un vol ou un ferry accuse un retard, permettant de recalculer l'horaire de rendez-vous.
4. **Identité & Sécurité KYC** : Confirmation officielle de la validation eIDAS des pièces d'identité déposées.

Le tiroir propose des filtres « Tout » et « Non lues », un bouton « Tout marquer comme lu », et chaque alerte redirige directement vers l'écran concerné (conversation, profil, arbitrage).

### 9.2 Toasts d'Opportunités & Statut Réseau
- **Toast Live Arbitrage** : Notification flottante non intrusive apparaissant lors de la détection d'un deal à forte marge.
- **Indicateur de Statut Réseau** : Dans `MarketplaceHeader.tsx`, une pastille dynamique prévient discrètement l'utilisateur s'il se trouve en mode hors-ligne ou si des données sont en cours de synchronisation avec le cloud.

---

## 10. Suivi Logistique & Écosystème des Modales

*Fichiers dans `src/components/logistics/` et `src/components/marketplace/TrackingPage.tsx`*

### 10.1 Page de Suivi (`/tracking`)
Tableau de bord centralisant toutes les expéditions de l'utilisateur :
- Tri par statut : En cours, Livrées, Toutes.
- Données d'expéditions simulées enrichies permettant de tester toutes les fonctionnalités même sans commande active.
- Horodatages précis, géolocalisation GPS des étapes et statut des scellés.

### 10.2 Lettre de Voiture / LTA (`WaybillModal.tsx`)
Document de transport contractuel officiel conforme aux normes CMR (route) et LTA IATA (air) :
- Identité complète de l'expéditeur, du transporteur certifié et du destinataire.
- Numéro de scellé STEB et description de la marchandise.
- Empreinte cryptographique horodatée garantissant l'intégrité du document en cas de contrôle douanier.
- Bouton de téléchargement au format officiel pour consultation hors-ligne.

### 10.3 Calculateur & Franchises Douanières (`CustomsModal.tsx`)
Outil d'assistance au dédouanement multi-destinations :
- **Algérie (Sens France ➔ Algérie)** : Franchise légale de 150 000 DZD pour effets personnels.
- **Maroc** : Seuil indicatif de 4 000 MAD.
- **Tunisie** : Seuil indicatif de 500 TND.
- **Union Européenne (Sens Maghreb ➔ France)** : Franchise de 430 € par voie aérienne ou maritime, 300 € par voie terrestre.
- Calcul automatique de l'excédent et conversion en devise locale.

### 10.4 Passe Numérique de Fret (`DigitalCargoPassModal.tsx`)
*Boarding pass* fret conçu au format Apple Wallet et Google Wallet :
- Extraction dynamique des stations de départ et d'arrivée (ex. `CDG Paris` ➔ `ALG Alger`).
- Carte graphique perforée avec encoches d'embarquement réalistes.
- **Vrai QR Code Cryptographique (`QrImage`)** scannable par les agents de contrôle aéroportuaire ou les douanes.
- Bouton d'exportation vers Apple / Google Wallet et téléchargement du récépissé sécurisé.

### 10.5 Modale de Remise & Double Code PIN (`PinDeliveryModal.tsx`)
L'étape de clôture irréversible de la mission :
- Le voyageur présente son interface de validation au destinataire.
- Saisie sur pavé numérique tactile d'un **code PIN secret à 4 chiffres** détenu exclusivement par le destinataire (ou scan QR réciproque).
- **Conséquence Immédiate** :
  1. Déclenchement d'une animation festive de confettis.
  2. Mutation instantanée de la commande au statut `delivered`.
  3. Déblocage automatique de l'ordre de virement Stripe Connect Escrow vers le compte bancaire du voyageur.

### 10.6 Signalement de Retard de Vol (`FlightDelayDialog`)
Permet au voyageur en cas de retard officiel de déclarer le nouvel horaire estimé :
- Mise à jour automatique de l'ETA (Estimated Time of Arrival) sur le tracking partagé.
- Envoi automatique d'un message d'information dans la conversation de l'expéditeur pour éviter toute inquiétude.

---

## 11. FinTech, Portefeuille & Séquestre Stripe Connect

*Fichiers : `src/components/marketplace/WalletView.tsx`, `src/services/stripeConnectService.ts`, `src/data/wallet.ts`*

### 11.1 Vue Portefeuille (`/wallet`)
Espace financier complet conforme aux régulations bancaires ACPR / européennes :
- **Carte Virtuelle BagVoyage Métallique** : Rendu visuel haut de gamme affichant le numéro de carte masqué (`•••• 4291`), la puce NFC et le nom de l'utilisateur.
- **Trois Compteurs Financiers Distincts** :
  - **Solde Disponible** : Fonds retirables immédiatement vers un compte bancaire.
  - **Fonds sous Séquestre** : Montants garantis en cours de mission, libérés dès confirmation de livraison.
  - **Gains Totaux Réalisés** : Cumul historique de toutes les missions réussies.
- **Bouton « Transférer vers mon compte »** : Ouvre la boîte de dialogue de virement avec vérification instantanée des coordonnées bancaires.

### 11.2 Protocole de Séquestre à 2 Étapes
Le service `stripeConnectService.ts` opère un mécanisme de séquestre bancaire inviolable :
1. **Création du Séquestre (`createEscrowHold`)** : Lors de la confirmation d'une commande, un `PaymentIntent` est créé en statut `requires_capture`. L'argent de l'expéditeur est bloqué sur un compte de cantonnement sécurisé.
2. **Libération Finale (`releaseEscrowToCarrier`)** : Dès que le PIN ou le QR code de livraison est validé, la capture manuelle est exécutée et un transfert direct Stripe Connect est émis vers le compte du voyageur.
3. **Remboursement Intégral (`refundEscrowToSender`)** : En cas d'annulation légitime ou de litige tranché en faveur de l'expéditeur, les fonds sont recrédités sans pénalité.
4. **Garantie COD (Cash-On-Delivery)** : En cas de remise avec paiement en espèces sur place pour des articles Shop&Go, une retenue de garantie est bloquée temporairement pour protéger les deux parties contre les impayés.

### 11.3 Support Bancaire Maghreb (RIB 20 Chiffres) & SEPA
BagVoyage est l'une des rares plateformes à prendre en charge nativement les coordonnées bancaires nord-africaines :
- **IBAN Européen & SEPA** : Validation par longueur et algorithme Modulo 97 (France, Espagne, Italie, etc.).
- **RIB Bancaire Algérien (20 Chiffres)** : Validation algorithmique stricte :
  - Code Banque (3 chiffres : BNA `001`, BEA `002`, CPA `003`, BDL `004`, BADR `005`, etc.).
  - Code Agence (5 chiffres).
  - Numéro de Compte (10 chiffres).
  - Clé de Contrôle (2 chiffres vérifiés par $\text{Clé} = 97 - (\text{Reste Modulo 97})$).
- **Comptes Marocains (24/28 car.) et Tunisiens (24 car.)** également reconnus et validés.

---

## 12. Authentification, Profil & Conformité KYC eIDAS

*Fichiers : `src/context/AuthContext.tsx`, `src/components/marketplace/Profile.tsx`, `src/components/Auth/`*

### 12.1 Connexion, Inscription & Session (`AuthContext.tsx`)
- Gestion d'authentification robuste avec persistance locale sécurisée.
- Support de la connexion Google en 1 clic (`GoogleSignInModal.tsx`) et authentification classique par e-mail/mot de passe.
- **Comptes de Démonstration Intégrés** : Permet de tester instantanément l'application sous différents profils types (Lina l'expéditrice, Karim le voyageur certifié, ou l'administrateur système).

### 12.2 Espace Profil (`/profile`)
- Personnalisation de l'avatar et du nom public.
- **Bascule d'Intention** : L'utilisateur déclare s'il souhaite principalement « Voyager », « Expédier » ou les deux.
- **Gestion des Coordonnées Bancaires** : Enregistrement et mise à jour de l'IBAN ou du RIB algérien pour recevoir les gains.
- **Historique des Évaluations** : Consultation des commentaires laissés par les tiers suite aux remises de colis.

### 12.3 Vérification d'Identité KYC
- Dépôt des pièces d'identité officielles (Passeport, Carte Nationale d'Identité ou Titre de Séjour).
- Prise de selfie biométrique avec détection du vivant.
- Enregistrement immédiat dans la table IndexedDB `kyc_records` avec horodatage eIDAS.
- Attribution du badge « Profil Vérifié » débloquant les limites de transport élevées et l'acceptation automatique des réservations.

---

## 13. Dashboards par Rôle & Espace Professionnel

*Fichiers dans `src/components/Dashboards/` et `src/components/Modals/ProOnboardingModal.tsx`*

### 13.1 Tableau de Bord Voyageur
- Vue synthétique des vols programmés et de l'espace restant en soute.
- Suivi des colis en cours d'acheminement et des rendez-vous de remise prévus à l'arrivée.
- Accès rapide aux outils de bord : scanner de carte d'embarquement, déclaration de retard, et bouton d'ouverture du passe numérique.

### 13.2 Tableau de Bord Expéditeur
- Suivi en temps réel de tous les colis confiés.
- Consultation de la preuve de prise en charge déposée par le voyageur au départ.
- Affichage du code PIN secret à transmettre au destinataire final.

### 13.3 Tableau de Bord Transporteur & Onboarding Pro
- Dédié aux sociétés de transport, chauffeurs réguliers d'utilitaires et navettes maritimes.
- **Processus d'Onboarding Pro (`ProOnboardingModal.tsx`)** :
  - Dépôt du numéro SIREN/Kbis ou registre du commerce étranger.
  - Déclaration des volumes de fret disponibles (en m³ ou camionnettes entières).
  - Accès aux fonctionnalités d'arbitrage de groupe et de gestion de flotte.

---

## 14. Console d’Administration & Database Studio (`/admin`)

*Fichiers : `src/components/Admin/AdminDashboard.tsx`, `src/services/productionDb.ts`*

Accessible aux administrateurs autorisés, ce panneau offre un contrôle total sur les opérations de la plateforme :

### 14.1 Supervision & Modération KYC
- Liste complète des dossiers d'identité en attente de vérification.
- Visualiseur des pièces justificatives déposées.
- Boutons d'approbation et de rejet avec saisie obligatoire d'un motif administratif eIDAS.

### 14.2 Arbitrage des Litiges et Décisions de Séquestre
- Suivi du montant total consigné sur les comptes de séquestre Stripe Connect.
- En cas de contestation (colis endommagé, retard critique, article manquant), l'administrateur peut trancher le litige :
  - Libération manuelle des fonds au voyageur.
  - Remboursement partiel ou total à l'expéditeur.

### 14.3 Database Studio & Exportateur SQL Intégral
Le Database Studio embarqué permet d'auditer et d'exporter l'intégralité des données locales :
- **Explorateur de 10 Tables** :
  `users`, `profiles`, `trips`, `purchase_requests`, `orders`, `wallet_transactions`, `conversations`, `admin_messages`, `kyc_records`, `pro_applications`.
- **Console de Requêtes SQL** : Permet d'exécuter des requêtes de filtrage et d'inspection directement sur les tables IndexedDB.
- **Générateur d'Export SQL Professionnel** :
  - Génère en un clic un fichier SQL complet (`.sql`) comprenant les déclarations de schéma DDL (`CREATE TABLE IF NOT EXISTS ...`) avec clés primaires et contraintes de types.
  - Génère l'ensemble des instructions `INSERT INTO [table] (...) VALUES (...)` avec échappement rigoureux des valeurs, des guillemets et des booléens.
  - Idéal pour les sauvegardes à chaud ou les migrations vers des bases PostgreSQL / MySQL distantes en production.

---

## Conclusion & Synthèse Opérationnelle

L’application **BagVoyage** combine l’élégance visuelle des meilleurs produits grand public mondiaux avec la rigueur d'une infrastructure FinTech et logistique hautement sécurisée. 

Tous les flux critiques — du simulateur de la landing page jusqu'au virement bancaire sur code PIN — sont interconnectés, testés de bout en bout et protégés par un séquestre financier européen certifié.
