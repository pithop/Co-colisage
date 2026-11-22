# DOSSIER DE PRÉSENTATION CLIENT — BAGVOYAGE

**Plateforme Internationale de Co-colisage Aérien, Arbitrage de Fret & Shop & Go**  
*Document Commercial, Fonctionnel & Technique — Édition Complète (Novembre 2026)*

---

## 1. Résumé Exécutif

BagVoyage est une plateforme collaborative de nouvelle génération conçue pour répondre aux problématiques de coût et de délai du transport international de petits colis et de bagages, en particulier sur le corridor France–Algérie ainsi que les destinations internationales (Canada, Moyen-Orient, Afrique).

En exploitant les franchises bagages inutilisées des voyageurs aériens vérifiés, BagVoyage permet :
1. **Aux expéditeurs** de diviser leur facture par 3 par rapport aux leaders du fret express (DHL, FedEx, UPS).
2. **Aux voyageurs** de monétiser leurs kilos restants et de financer jusqu'à 100% de leur billet d'avion.
3. **Aux acheteurs Shop & Go** d'acquérir des produits à l'étranger introuvables chez eux, achetés en boutique par un voyageur avec facture originale.

Le système est entièrement sécurisé par un **séquestre bancaire certifié**, une vérification d'identité **KYC obligatoire** et un **code secret PIN à 6 chiffres** unique pour chaque transaction.

---

## 2. Galerie des Interfaces & Expérience Utilisateur (Design Apple Pro)

### A. Landing Page Principale
Une page d'atterrissage fluide, aérée et épurée, dotée d'un simulateur de devis instantané.

| Mode Clair (Light) | Mode Sombre (Apple Pro Dark) |
| :---: | :---: |
| ![Landing Desktop Clair](./docs/screenshots/01_landing_desktop_light.jpg) | ![Landing Desktop Sombre](./docs/screenshots/02_landing_desktop_dark.jpg) |

---

### B. Expérience Mobile (iPhone 15 Pro)
L'application s'adapte automatiquement à l'écran du smartphone avec une barre de navigation basse ergonomique et un thème sombre natif.

| Mobile Clair | Mobile Sombre |
| :---: | :---: |
| <img src="./docs/screenshots/03_landing_mobile_light.jpg" width="340" alt="Mobile Clair" /> | <img src="./docs/screenshots/04_landing_mobile_dark.jpg" width="340" alt="Mobile Sombre" /> |

---

### C. Les 4 Nouvelles Pages SEO Spécialisées

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

### D. Marketplace Centrale & Application
Tableau de bord interactif pour consulter les demandes, rechercher un trajet et filtrer par ville et date.

| Marketplace Desktop | Marketplace Mobile |
| :---: | :---: |
| ![Marketplace Desktop](./docs/screenshots/09_marketplace_desktop.jpg) | <img src="./docs/screenshots/10_marketplace_mobile.jpg" width="340" alt="Marketplace Mobile" /> |

---

### E. Moteurs Embarqués & Fonctionnalités Avancées

#### 1. Scanner de Billets IATA par Reconnaissance Optique (OCR)
Reconnaissance optique locale (Tesseract.js) : importation automatique des vols depuis un billet PDF ou papier sans fuite de données personnelles.

![Scanner IATA](./docs/screenshots/17_ticket_scanner_modal.jpg)

#### 2. Radar Aérien Interactif en Temps Réel
Cartographie dynamique des flux de vols sur la Méditerranée et les corridors transatlantiques.

| Radar Desktop | Radar Mobile |
| :---: | :---: |
| ![Radar Desktop](./docs/screenshots/13_radar_page.jpg) | <img src="./docs/screenshots/20_radar_mobile.jpg" width="340" alt="Radar Mobile" /> |

#### 3. Suivi GPS en Temps Réel & Timeline d'Expédition
Suivi pas à pas de chaque colis (Consigné -> Pris en charge -> Vol en cours -> Arrivé -> Livré).

![Suivi GPS](./docs/screenshots/14_tracking_page.jpg)

#### 4. Authentification & Contrôle d'Identité KYC
Espace sécurisé de connexion et vérification biométrique/documentaire des pièces d'identité officielles.

![Authentification & KYC](./docs/screenshots/15_auth_login_page.jpg)

#### 5. Centre de Contrôle Administrateur & Modération
Gestion complète des litiges, remboursements atomiques instantanés et surveillance de la plateforme.

![Admin Dashboard](./docs/screenshots/16_admin_dashboard.jpg)

#### 6. Convertisseur Multi-Devises (EUR / DZD / CAD / USD)
Calculateur en temps réel aux cours officiels et interbancaires.

![Convertisseur de Devises](./docs/screenshots/18_currency_converter_modal.jpg)

#### 7. Modale de Publication d'Annonces
Téléversement photo, curseur de poids interactif, dimensions et checklist douanière.

![Publication Annonce](./docs/screenshots/19_publish_modal.jpg)

---

## 3. Comparatif Économique & Marché

| Critère Analysé | BagVoyage | Fret Express Traditionnel (DHL / FedEx) | Groupes Informels Réseaux Sociaux |
| :--- | :---: | :---: | :---: |
| **Tarif 5 kg (Paris - Alger)** | **40 €** | 145 € (+260%) | 50 € - 75 € |
| **Délai moyen d'acheminement** | **24h à 48h** | 3 à 5 jours ouvrés | Incertain (1 à 3 semaines) |
| **Sécurité financière** | **Séquestre bancaire garanti** | Assurance avec franchise | **Nulle (Arnaques fréquentes)** |
| **Preuve de livraison** | **Code secret PIN 6 chiffres** | Signature simple | Aucune preuve |
| **Rémunération voyageur** | **85% reversés** | 0 € | Aléatoire |
| **Cadre réglementaire** | **Convention de Montréal** | Réglementation fret | **Risque douanier et saisie** |

---

## 4. Livrables Inclus dans la Version Finale

- **Dossier Client PDF Imprimable** : `BagVoyage_Dossier_Client.pdf` (12 pages A4 haute fidélité avec les 20 captures d'écran).
- **Page Web Autonome Hors-Ligne** : `docs/dossier-presentation.html` (consultable dans tout navigateur).
- **Banque de Captures Écran HD** : Située dans `docs/screenshots/` (format JPG optimisé pour un chargement instantané).
- **Code Source 100% Validé** : Zéro erreur TypeScript, Zéro emoji Unicode, 20/20 tests Playwright réussis, synchronisé sur GitHub.
