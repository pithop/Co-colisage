# PROPOSITION COMMERCIALE & DEVIS PROFESSIONNEL
**Réf : DEV-2026-BAGVOYAGE-001**  
**Date :** 1er Octobre 2026  
**Validité de l'offre :** 30 jours  

---

### **ENTRE LES SOUSSIGNÉS :**

**LE PRESTATAIRE :**  
**Idriss Chahraoui**  
*Lead Developer & Architecte Solutions Full-Stack*  
Spécialiste Applications Web & Mobiles Hautes Performances  
Email : *chahraouiidriss@gmail.com*  

**ET LE CLIENT :**  
**Direction du Projet BagVoyage / Shop & Go**  
Application Collaborative de Transport de Bagages & Achats Transméditerranéens  
Ligne Pilote : Marseille (France) ⇄ Alger / Oran (Algérie)  

---

## 1. OBJET DE LA PRESTATION

Conception, développement technique complet, intégration UI/UX de prestige (standards Apple / Stripe), mise en place de l'algorithme d'arbitrage IA, système de séquestre bancaire, double vérification QR Code & multimédia, et déploiement en production de l'application collaborative **BagVoyage / Shop & Go**.

---

## 2. PÉRIMÈTRE FONCTIONNEL & CAHIER DES CHARGES

Le projet intègre l'ensemble des spécifications opérationnelles transmises par le client :

### Volet 1 : Inscription Simplifiée & KYC Progressif
- **Inscription rapide au téléchargement** : Nom d'utilisateur, Nom, Prénom, Date de naissance, Ville, Email, Numéro de téléphone.
- **Passage à l'action (KYC sécurisé)** : Dès qu'un utilisateur souhaite publier un voyage, expédier un colis ou accepter une mission, obligation de vérification d'identité (Selfie de vérification en direct + envoi CNI / Passeport).

### Volet 2 : Les Trois Espaces Métier
1. **Espace Expéditeur (Envoi de colis)** :
   - Fiche produit détaillée : Nature de l'objet, catégorie, poids, dimensions.
   - Fourchette de temps souhaitée (*« pour quand il le voudrait »*).
   - Fourchette de prix / budget proposé au transporteur.
   - Modalité de déplacement : indication si l'expéditeur accepte de se déplacer + lieu de remise.
2. **Espace Destinataire / Acheteur (Boutique Inversée Shop & Go)** :
   - Fiche d'achat exacte : photo, marque, quantité, prix magasin estimé.
   - Lieu de livraison souhaité.
   - Commission nette offerte au voyageur pour faire la course.
3. **Espace Voyageur / Convoyeur** :
   - Itinéraire : Ville de départ, Ville d'arrivée, Date, Heure, Moyen de transport (Avion, Bateau, Voiture).
   - Numéro de vol / Import de billet d'avion avec lecture automatique (OCR).
   - Espace disponible dans la valise ou le véhicule.
   - Paramétrage précis des prestations acceptées :
     * Transport de colis d'un tiers (avec sélection des catégories autorisées : High-Tech, Parfums, Vêtements, Chocolats, Documents, etc.).
     * Achat de marchandise pour un tiers (avec budget max et distance max acceptés).
     * **Option « Profil Acceptation Automatique »** pour les voyageurs acceptant toutes les missions compatibles.
   - Modalités de règlement acceptées : Paiement sécurisé via l'application et/ou Paiement en espèces à la livraison.
   - Tarification au kilo ou commission forfaitaire renseignée par le voyageur.

### Volet 3 : Algorithme d'Arbitrage IA & Push Notifications
- Détection en temps réel des billets d'avion les moins chers (ex: Air Algérie / Transavia / Vueling sous 48h-72h).
- Rapprochement intelligent avec les commandes d'achats et colis en attente.
- Envoi automatique de notifications push ciblées : *« Voyagez gratuitement ou voyagez et gagnez de l'argent ! »* avec proposition de billet inférieur ou égal à la somme des commissions.

### Volet 4 : Prise de Contact & Bouton « GO »
- Prise de contact instantanée sur les annonces via un bouton d'action directe **« GO »**.
- Messagerie instantanée sécurisée intégrée.
- Protection anti-contournement (détection et masquage des coordonnées personnelles).
- Système de relance automatique par le bot de sécurité : invitation à *« Passer à la réservation »* en cas d'échange sans confirmation de paiement.

### Volet 5 : Paiement Sécurisé, Séquestre Stripe & Gestion des Espèces
- **Paiement via l'application** : Fonds bloqués sous séquestre bancaire sécurisé dès la réservation.
- **Prélèvement de la commission plateforme** : La commission du service est encaissée de façon transparente dès la réservation.
- **Paiement en espèces à la remise** : Mécanisme de séquestre de garantie / caution restitué au donneur d'ordre (déduction faite de la commission de la plateforme) dès confirmation de la remise par QR Code.

### Volet 6 : Double Preuve Photo / Vidéo & Double QR Code
- **Étape 1 (Départ : Expéditeur ➔ Voyageur)** :
  - Rencontre physique et vérification conjointe du colis.
  - Émission et scan du 1er **QR Code de prise en charge**.
  - Capture obligatoire d'une photo / vidéo de l'état du colis (ou du ticket de caisse lors d'un achat boutique).
  - Horodatage et enregistrement de la géolocalisation.
  - Fonctionnalité de signalement de retard de vol par le voyageur.
- **Étape 2 (Arrivée : Voyageur ➔ Destinataire final)** :
  - Rencontre et vérification de la marchandise.
  - Capture de la photo / vidéo finale de remise.
  - Validation du 2ème **QR Code de réception** déclenchant immédiatement la libération des fonds vers le voyageur.

### Volet 7 : Notation 4 Critères & Statut « Super Voyageur »
- Système d'évaluation sur 5 étoiles basé sur 4 critères stricts :
  1. **Réactivité de réponse**
  2. **Échange clair**
  3. **Ponctualité**
  4. **État de la marchandise intacte**
- Attribution automatique du badge de confiance **« Super Voyageur »** aux profils les mieux notés, éligibles aux transports à plus forte valeur.

### Volet 8 : Expérience Mobile de Prestige (« Design XXXXXXL »)
- Interface responsive pensée mobile-first (iOS / Android PWA).
- Dock de navigation flottant en verre dépoli (Frosted Glass).
- Micro-interactions fluides et boutons d'action rapide au pouce.

---

## 3. PLANNING DE RÉALISATION EN 8 SEMAINES & ENGAGEMENTS CLÉS

> [!IMPORTANT]
> ### LES DEUX ENGAGEMENTS MAJEURS DU PRESTATAIRE :
> 1. **DÈS LA SEMAINE 1 : DÉPLOIEMENT EN LIGNE DE LA PREMIÈRE VERSION OPÉRATIONNELLE (V1 MVP)**  
>    Dès les 7 premiers jours, le client dispose d'un accès en ligne actif sur serveur de prévisualisation pour tester la plateforme avec son équipe.
> 2. **UN RENDEZ-VOUS HEBDOMADAIRE SYSTÉMATIQUE (1 FOIS PAR SEMAINE)**  
>    Un point régulier chaque semaine (visio / démo) pour examiner les avancées concrètes, tester en direct les fonctionnalités ajoutées et ajuster les détails selon les retours du client.

| Semaine | Objectifs & Livrables Hebdomadaires | Validation / Rendez-vous |
| :--- | :--- | :--- |
| **Semaine 1** | **Mise en ligne de la V1 MVP** : Architecture socle, Inscription simple au téléchargement, mise en place des 3 volets (Voyageur, Expéditeur, Destinataire), déploiement sur URL accessible. | **RDV n°1 : Démo V1 en ligne & validation du socle** |
| **Semaine 2** | **Module Voyageur & Billetterie** : Intégration du formulaire voyageur complet (vol/voiture/bateau), lecture OCR du billet d'avion, respect strict de la franchise valise (ex: 10kg = 9kg max), sélection des catégories acceptées, option « Acceptation Automatique ». | **RDV n°2 : Test du scan billet & publication trajet** |
| **Semaine 3** | **Module Expéditeur & Acheteur** : Fiches colis (poids/taille, fourchette temps/prix, lieu), demandes d'achats Duty Free/Boutique (photo, prix), bouton d'action rapide « GO ». | **RDV n°3 : Test du dépôt d'annonces et matching** |
| **Semaine 4** | **Messagerie Instantanée Sécurisée** : Chat temps réel, filtre anti-contournement coordonnées, relance automatique du bot « Passer à la réservation », partage photo & géolocalisation. | **RDV n°4 : Test du chat interactif & filtres** *(Jalon 2)* |
| **Semaine 5** | **Système de Séquestre Stripe & Gestion des Espèces** : Blocage des fonds à la réservation, prélèvement de la commission plateforme, flux hybride application / espèces à la remise. | **RDV n°5 : Test des flux de paiement & séquestre** |
| **Semaine 6** | **Double QR Code & Vérification Multimédia** : Scan QR Code départ (remise expéditeur ➔ voyageur) + photo/vidéo conjointe, alerte retard vol, scan QR Code arrivée ➔ déblocage automatique des fonds. | **RDV n°6 : Test du parcours complet de livraison** |
| **Semaine 7** | **Arbitrage IA & Système de Confiance** : Notifications push automatiques « Voyager gratuit / Gagner de l'argent », notation 4 critères stricts, badge « Super Voyageur », profil public enrichi. | **RDV n°7 : Test de l'arbitrage IA & des avis** |
| **Semaine 8** | **Polissage Mobile XXXXXXL, Recette & Mise en Production Finale** : Tests de robustesse, optimisation des temps de chargement, configuration domaine final, formation à l'administration et livraison finale. | **RDV n°8 : Recette finale & Célébration de lancement** |

---

## 4. PROPOSITION FINANCIÈRE & ÉCHÉANCIER

### Récapitulatif Tarifaire Forfaitaire

| Désignation | Qté | Prix Unitaire | Total |
| :--- | :---: | :---: | :---: |
| **Développement complet Application BagVoyage / Shop & Go**<br>*(Inscription KYC, 3 volets métier, scanner billet IA, messagerie filtrée, séquestre Stripe & espèces, double QR Code & photos, arbitrage IA, avis 4 critères, design mobile XXXXXXL, déploiement & tests)* | 1 forfait | 3 500,00 € | **3 500,00 €** |
| **Déploiement V1 dès la Semaine 1 & 8 Rendez-vous hebdomadaires inclus** | Inclus | 0,00 € | **OFFERT** |
| **Garantie corrective & maintenance 30 jours post-lancement** | Inclus | 0,00 € | **OFFERT** |
| **TOTAL GÉNÉRAL NET / TTC** | | | **3 500,00 €** |

---

### Échéancier de Paiement

Le règlement s'effectue selon l'échéancier suivant, garantissant l'engagement mutuel et la sérénité des deux parties :

1. **Acompte de 50% à la signature du devis (Lancement du projet)** : **1 750,00 €**  
   *Conditionne le démarrage immédiat et la livraison de la V1 en Semaine 1.*
2. **Paiement intermédiaire de 25% en Semaine 4 (Mi-parcours)** : **875,00 €**  
   *Validé lors du RDV n°4 après démonstration de la messagerie et du module séquestre.*
3. **Solde final de 25% à la livraison définitive en Semaine 8** : **875,00 €**  
   *Après recette finale complète et mise en production.*

---

## 5. CONDITIONS GÉNÉRALES & ENGAGEMENTS

1. **Propriété Intellectuelle** : À complet paiement du prix convenu, l'intégralité du code source, des maquettes et des composants développés devient la propriété pleine et exclusive du Client.
2. **Confidentialité** : Le prestataire s'engage à une stricte confidentialité quant au modèle d'affaires, aux algorithmes et aux données échangées.
3. **Garantie Post-Livraison** : Une garantie de 30 jours calendaires couvre la correction sans surcoût de toute anomalie ou bug qui surviendrait suite à la mise en production.

---

### **BON POUR ACCORD ET COMMANDE**

*Fait à Marseille / Paris, le 1er Octobre 2026 en deux exemplaires originaux.*

**Pour le Prestataire :**  
*Signature précédée de la mention manuscrite « Bon pour accord »*  

Signature : _______________________________  

**Pour le Client (BagVoyage / Shop & Go) :**  
*Signature précédée de la mention manuscrite « Bon pour accord et commande »*  

Signature : _______________________________  
Nom du signataire : _______________________  
Date : ____________________________________  
