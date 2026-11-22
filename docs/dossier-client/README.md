# Dossier Client — BagVoyage / Shop & Go / Bag & Go

Ce répertoire centralise l'ensemble des spécifications originales, croquis manuscrits, notes vocales et maquettes visuelles fournis par le client. Il constitue la **Source de Vérité Métier et Design** du projet.

---

## Contenu du dossier

### 1. Croquis Fonctionnels Manuscrits (`WhatsApp Image 2026-09-28*.jpeg`)
- `WhatsApp Image 2026-09-28 at 13.48.57 (1).jpeg` : Concept central Bag & Go reliant 3 acteurs (`Monsieur X` Expéditeur / `Voyageur` au centre / `Client Y` Receveur), notation 5 étoiles à **4 critères stricts** (*réactivité, ponctualité, échange clair, marchandise intacte*), statut **« Super Voyageur »**, option **« Acceptation automatique »**, et notification d'arbitrage sur billets d'avion (*« Voyager gratuitement et gagner de l'argent »*).
- `WhatsApp Image 2026-09-28 at 13.49.03.jpeg` : Inscription simple au téléchargement (username, nom, prénom, date de naissance, ville, email, téléphone) et **KYC progressif bloquant uniquement au passage à l'action** (selfie + documents) ; champs détaillés Expéditeur et Voyageur.
- `WhatsApp Image 2026-09-28 at 16.29.40.jpeg` : Disposition exacte en **3 volets** :
  - **À gauche** : `Bag & Go` (Expéditeur) — catégorie, poids/taille, fourchette temporelle, budget, lieu et volonté de déplacement.
  - **Au centre** : `Voyageur` (Convoyeur) — départ (toutes villes), arrivée, date, N° de vol, espace, catégories acceptées, achat pour tiers (budget max), mode de paiement (*sur l'application* et/ou *espèces*).
  - **À droite** : `Shop & Go` (Receveur / Acheteur) — produit exact avec photo, prix magasin, quantité, lieu de livraison, commission nette.

### 2. Transcriptions des Notes Vocales (`all_voice_notes.json` & `WhatsApp Ptt 2026-09-28*.ogg`)
- 6 messages vocaux détaillant la mécanique des 3 volets, la prise en compte du déplacement vers l'aéroport par l'expéditeur, la gestion du budget d'achat par le voyageur et le double paiement (app + espèces).

### 3. Maquettes Visuelles Haute Fidélité (`WhatsApp Image 2026-09-25*.jpeg`)
- `WhatsApp Image 2026-09-25 at 21.51.07.jpeg` : Mobile Shop & Go (hero lumineux, recherche rapide, catégories produits, grille e-commerce avec badge destination vert et pilule **`Gain : +25€`**).
- `WhatsApp Image 2026-09-25 at 21.51.07 (1).jpeg` : Landing Desktop complète (`Articles à acheter | Espace valise | Espace voiture | Espace camion | Duty Free`, grille produits, 4 étapes *Comment ça marche ?*, section *Confiance & Sécurité* Powered by Stripe).
- `WhatsApp Image 2026-09-25 at 21.51.08.jpeg` : Concept *« La boutique inversée »* (interface boutique en ligne, double preuve **ticket de caisse + billet d'avion**, KYC Particulier vs Pro SIRET/Kbis, workflow Stripe Connect Acheteur → Séquestre → Shopper → Déblocage).
- `WhatsApp Image 2026-09-25 at 22.04.04.jpeg` : Mobile Bag & Go (`Par avion | Par voiture | Par bateau`, recherche par corridor/date/poids, cartes offres avec badge transport, tarif `/kg`, note étoilée, et barre basse mobile à 5 onglets : `Accueil | Rechercher | (+) Publier une annonce | Messages | Profil`).

### 4. Documents de Spécification & Cahiers des Charges
- `DOSSIER_CLIENT.md` : Synthèse écrite complète du dossier client et des parcours utilisateurs.
- `BagVoyage_Dossier_Client.pdf` : Présentation et dossier fonctionnel complet du projet BagVoyage.
- `Cahier_des_Charges_Plateforme_Shopper.pdf` : Cahier des charges détaillé du volet Shop & Go (*La boutique inversée*).

---

## Règles Métier Clés à Préserver
1. **3 Volets ordonnés** : `Colis (Bag & Go)` à gauche · `Trajets (Voyageur)` au centre · `Shopping (Shop & Go)` à droite.
2. **Esthétique lumineuse & e-commerce** : Cartes produits/trajets visuelles, fond clair `#F8FAFC`/`#FFFFFF`, boutons Cobalt `#2563EB`, badges de gain et destination Émeraude `#059669`/`#10B981`.
3. **Action directe (`GO`) & Séquestre Stripe Connect** : Prise de contact rapide, preuve photo départ + code PIN/QR à l'arrivée.
4. **KYC Progressif** : Libre consultation et inscription rapide ; vérification d'identité exigée uniquement pour publier, transporter ou acheter.
