# DOSSIER DE PRÉSENTATION CLIENT — BAGVOYAGE

**Plateforme Internationale de Co-colisage Aérien, Arbitrage de Fret & Shop & Go**  
*Document Commercial & Technique — Édition Clé en Main (Novembre 2026)*

---

## 1. Résumé Exécutif

BagVoyage est une plateforme collaborative de nouvelle génération conçue pour répondre aux problématiques de coût et de délai du transport international de petits colis et de bagages, en particulier sur le corridor France–Algérie ainsi que les destinations internationales (Canada, Moyen-Orient, Afrique).

En exploitant les franchises bagages inutilisées des voyageurs aériens vérifiés, BagVoyage permet :
1. **Aux expéditeurs** de diviser leur facture par 3 par rapport aux leaders du fret express (DHL, FedEx, UPS).
2. **Aux voyageurs** de monétiser leurs kilos restants et de financer jusqu'à 100% de leur billet d'avion.
3. **Aux acheteurs Shop & Go** d'acquérir des produits à l'étranger introuvables chez eux, achetés en boutique par un voyageur.

Le système est entièrement sécurisé par un **séquestre bancaire certifié**, une vérification d'identité **KYC obligatoire** et un **code secret PIN à 6 chiffres** unique pour chaque transaction.

---

## 2. Galerie des Interfaces (Design Apple Pro)

### A. Landing Page Principale
Une page d'atterrissage élégante, fluide et aérée, dotée d'un simulateur de devis instantané.

| Mode Clair | Mode Sombre (Apple Pro Dark) |
| :---: | :---: |
| ![Landing Desktop Clair](./docs/screenshots/01_landing_desktop_light.jpg) | ![Landing Desktop Sombre](./docs/screenshots/02_landing_desktop_dark.jpg) |

---

### B. Expérience Mobile (iPhone 15 Pro)
L'application s'adapte automatiquement à l'écran du smartphone avec une barre de navigation basse ergonomique et un thème sombre natif.

| Mobile Clair | Mobile Sombre |
| :---: | :---: |
| <img src="./docs/screenshots/03_landing_mobile_light.jpg" width="340" alt="Mobile Clair" /> | <img src="./docs/screenshots/04_landing_mobile_dark.jpg" width="340" alt="Mobile Sombre" /> |

---

### C. Pages SEO Spécialisées

Pour préserver la légèreté de la page d'accueil sans sacrifier le référencement naturel, l'application dispose de 4 pages d'atterrissage complètes :

1. **Comment ça marche (`/comment-ca-marche`)** :  
   Explication étape par étape des workflows pour l'Expéditeur, le Voyageur et le Shop & Go.  
   ![Comment ça marche](./docs/screenshots/05_how_it_works_desktop.jpg)

2. **Tarifs & Simulateur (`/tarifs`)** :  
   Simulateur de prix par corridor (Algérie à partir de 8 €/kg) et comparateur direct DHL.  
   ![Tarifs](./docs/screenshots/06_pricing_desktop.jpg)

3. **Sécurité & Confiance (`/securite`)** :  
   Présentation détaillée du séquestre bancaire, du protocole PIN et de la Convention de Montréal.  
   ![Sécurité](./docs/screenshots/07_trust_security_desktop.jpg)

4. **Centre d'Aide & FAQ (`/faq`)** :  
   Moteur de recherche instantané et filtres de questions avec balisage Schema.org.  
   ![FAQ](./docs/screenshots/08_faq_desktop.jpg)

---

### D. Marketplace & Application Centrale
Tableau de bord interactif pour consulter les demandes, rechercher un trajet et filtrer par ville et date.

| Marketplace Desktop | Marketplace Mobile |
| :---: | :---: |
| ![Marketplace Desktop](./docs/screenshots/09_marketplace_desktop.jpg) | <img src="./docs/screenshots/10_marketplace_mobile.jpg" width="340" alt="Marketplace Mobile" /> |

---

## 3. Les Piliers Technologiques & Sécurité

1. **Séquestre Bancaire Automatisé** :  
   Les fonds payés par l'expéditeur ne sont jamais transférés au voyageur à l'avance. Ils restent consignés sur un compte séquestre européen sécurisé et ne sont débloqués qu'à la validation physique de la livraison.

2. **Code PIN Secret à 6 Chiffres** :  
   Lors de la confirmation de l'envoi, un code secret est généré et remis uniquement à l'expéditeur et son destinataire. Le voyageur doit saisir ce code lors de la remise en main propre pour déclencher son paiement.

3. **Scanner OCR de Billets IATA** :  
   Un moteur de reconnaissance optique embarqué (Tesseract OCR local) permet aux voyageurs de téléverser leur billet d'avion ou carte d'embarquement PDF/image. Les détails de vol sont analysés localement en toute confidentialité.

4. **Moteur d'Arbitrage Aérien** :  
   Analyse algorithmique des tarifs de vols et de la demande de fret sur les liaisons majeures afin de suggérer aux voyageurs les trajets les plus rentables.

5. **Vérification d'Identité KYC** :  
   Contrôle préalable des pièces d'identité officielles (Passeport / CNI) pour fiabiliser la communauté.

---

## 4. Comparatif Économique

| Indicateur | BagVoyage | Transporteurs Express Traditionnels | Groupes Informels (Réseaux Sociaux) |
| :--- | :---: | :---: | :---: |
| **Tarif 5 kg (Paris - Alger)** | **40 €** | 145 € | 50 € - 75 € |
| **Délai d'acheminement** | **24h à 48h** | 3 à 5 jours | Incertain |
| **Protection des fonds** | **Séquestre garanti** | Assurance avec franchise | **Nulle (Arnaques fréquentes)** |
| **Sécurisation de la remise** | **Code PIN 6 chiffres** | Signature standard | Aucune preuve |
| **Rémunération du voyageur** | **85% reversés** | 0% | Aléatoire |
| **Cadre juridique** | **Convention de Montréal** | Fret aérien classique | Non déclaré / Saisie douanière |

---

## 5. Livrables Inclus

- **Code Source Complet & Testé** : 100% TypeScript strict, zéro erreur, zéro emoji Unicode.
- **Dossier PDF Officiel** : `BagVoyage_Dossier_Client.pdf` (format A4 prêt pour impression ou envoi par e-mail).
- **Page Web de Présentation** : `docs/dossier-presentation.html` (consultable hors-ligne dans tout navigateur).
- **Banque de Captures Écran HD** : Située dans `docs/screenshots/` (vues desktop et mobile iPhone 15 Pro, clair et sombre).
