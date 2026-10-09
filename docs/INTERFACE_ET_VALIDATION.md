# Entre particuliers

L’interface reprend les quatre écrans décrits dans la demande : exploration des demandes d’achat, transports, choix des intentions et détail d’une demande. L’image des quatre nouveaux écrans n’était pas présente dans le dépôt ; les images disponibles sont les anciennes maquettes et les croquis manuscrits. Le contrôle visuel porte donc sur les exigences textuelles.

## Parcours

- Les recherches par mots, villes et destinations se combinent avec les filtres. Les annonces publiées et les intentions sélectionnées sont conservées dans le stockage local du navigateur.
- Chaque demande et trajet a un lien propre (`#request/…`, `#trip/…`) et sa propre conversation. Le bouton d’offre amorce un message à l’acheteur ; le bouton de question ouvre l’échange direct.
- L’arbitrage existant est accessible depuis l’encart de découverte. Les commissions, le prix du billet et le solde sont calculés par le simulateur, et les missions sélectionnées sont reprises dans la conversation.
- Le scanner existant accepte les PDF et images. La franchise conserve sa réserve : 10 kg donnent 9 kg proposés au maximum. Les annonces issues de la démo restent identifiées dans leur description et ne sont pas certifiées.
- La conversation expose l’accord, le séquestre, la prise en charge et la livraison. Les QR codes sont générés par `qrcode` et décodés depuis une photo/import par `jsqr`. La prise en charge et la livraison ont des PIN distincts ; le QR contient également l’annonce et l’étape. Un code incorrect ou celui de l’étape précédente ne valide pas la livraison.
- L’avis ne devient accessible qu’après livraison. Ses quatre critères sont ceux des croquis : réactivité, ponctualité, échange clair et marchandise intacte.

## Périmètre du prototype

L’application reste un frontend sans serveur. Les messages et annonces sont locaux à l’appareil. Le séquestre Stripe, l’accord entre les parties et la libération des fonds sont des démonstrations explicites. Aucun appel Stripe ni authentification Apple n’est effectué. Le bouton Apple explique la disponibilité future et propose l’accès de démonstration. L’arbitrage utilise un inventaire illustratif ; il ne réserve pas de billet.

Pour un service de production, les comptes Apple, les échanges multiutilisateurs, les offres acceptées, les paiements Stripe et les validations de remise devront être gérés par un backend authentifié. Les PIN et QR de démonstration sont visibles pour permettre la revue du parcours.

## Vérification

```sh
npm run build
npm run test:e2e
```

Les tests Playwright couvrent mobile (390 × 844) et desktop (1440 × 1000) : recherche et filtres, trajets, profil multirôle, publication persistante, conversation liée à la demande, mauvais PIN, prise en charge, décodage du second QR, quatre notes, plafond du scanner, arbitrage et absence de débordement sur les quatre écrans. Ils produisent les captures des écrans dans `test-results/`.

Chrome système est utilisé si disponible ; `CHROME_PATH` permet de choisir un autre exécutable. Les crédits des photos produit sont dans `public/images/CREDITS.md`.
