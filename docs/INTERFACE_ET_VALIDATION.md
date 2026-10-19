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

## Extension BagVoyage : rôles, publication et administration

Le profil propose quatre espaces d’activité indépendants : transporteur, envoyeur, acheteur et receveur. Les annonces personnelles sont associées à l’identifiant du compte ou de la session locale. Les destinataires retrouvent les colis adressés à leur e-mail de compte ; le bouton de validation ouvre les conversations et leur parcours QR/PIN existant.

La publication comprend trois univers. Les colis enregistrent photos, suppression des aperçus, flexibilité, dimensions, poids, valeur déclarée, points de remise et destinataire. Shop & Go conserve une liste de produits avec URL, spécifications, photo et prix. Le budget additionne les achats et le service brut : pour une commission nette voyageur de 17 €, les frais plateforme de 15 % du service brut sont 3 €, soit un service brut de 20 €. Les trajets conservent les anciens labels et ajoutent les informations professionnelles.

Le dossier pro enregistre quatre justificatifs et une flotte. Les fichiers acceptés sont JPEG, PNG, WebP et PDF pour les documents, limités à 4 Mo chacun. Les photos de colis sont limitées à six ; les listes d’achats à vingt articles. Les pièces KYC fournies lors de l’inscription sont désormais conservées dans IndexedDB pour permettre l’examen. Ces données restent sur le navigateur et ne constituent pas un coffre documentaire de production.

### Persistance et revue

`BagVoyageDB_v1` passe à la version 2 et ajoute `pro_applications` et `admin_messages`. Une migration ne réinjecte jamais l’inventaire de démonstration dans une base existante. Les abonnements locaux et BroadcastChannel actualisent les interfaces entre onglets d’une même origine.

L’envoi officiel écrit le message et son enregistrement de support dans une seule transaction. L’approbation pro ou KYC met à jour le dossier et l’utilisateur ensemble. Une décision de séquestre est terminale, motivée et enregistrée avec le registre financier ; un remboursement n’augmente pas le solde voyageur. Les snapshots de conversations antérieurs ne peuvent pas effacer cette décision. Les montants bancaires sont simulés.

Le centre `/#admin` est disponible avec `npm run dev`. Il propose KPI calculés sur les enregistrements, trajets filtrables, lecture des chats, signaux de contournement, messages officiels, pièces KYC/pro et décisions de séquestre. Les signaux de modération sont indicatifs ; aucune sanction automatique n’est appliquée. Une vérification KYC est bloquée sans deux pièces, et une certification pro sans les quatre pièces et la flotte.

### Vitrine et indexation

`/#landing` affiche la vitrine française ou anglaise, avec simulateur, devis comparatif saisi par le visiteur, FAQ accessible et JSON-LD. `npm run build` pré-rend également `/landing/` et `/en/landing/`, avec contenu HTML complet, métadonnées et liens de langues. L’hébergement doit servir ces deux répertoires statiques avant son fallback SPA. Les liens `hreflang` sont relatifs ; ajouter les URL canoniques absolues une fois le domaine de production fixé.

Les métriques fournies dans le brief sont identifiées comme un scénario non audité. Les économies dépendent du devis saisi, et le délai 24–48 h est conditionnel. Le calculateur douanier distingue DZD et EUR sans taux de change inventé. Il cite l’article 106 LF 2021 (150 000 DZD, référence historique à confirmer) et les franchises françaises de 430 € par voie aérienne/maritime ou 300 € par voie terrestre pour un voyageur adulte. Aucune franchise n’est présumée applicable à un colis transporté pour un tiers.

Références : [Journal officiel algérien, LF 2021](https://www.joradp.dz/FTP/JO-francais/2020/F2020083.pdf), [Douanes françaises, franchises voyageurs](https://www.douane.gouv.fr/fiche/franchises-douanieres-et-fiscales-en-quantites-et-en-valeurs).

### Limites de mise en production

Le build de production désactive les actions administrateur locales et présente une page d’accès indisponible. Un rôle conservé dans le navigateur ne saurait autoriser la lecture des pièces privées ou la libération de fonds réels. Le dépôt n’a ni backend, ni secret de paiement, ni service d’identité distant : il faut encore une authentification et des autorisations serveur, un stockage documentaire protégé, une synchronisation multiutilisateur, une intégration Stripe Connect avec webhooks et un journal d’audit serveur. Aucune clé secrète n’est placée dans le frontend. Le badge pro du registre local atteste seulement de la décision locale de revue.

La suite `tests/admin-and-landing.spec.ts` exerce les nouvelles interfaces sur mobile et desktop, les notifications entre onglets, la validation d’un dossier, les pièces et photos, les calculs, les décisions terminales et la migration depuis la version 1. Le test existant qui vérifie la liste exacte des stores attend désormais les deux stores demandés, sans retrait de ses assertions CRUD.

### Résultat de la validation de cette extension

- `npx tsc --noEmit` : code de sortie 0, aucune erreur.
- `npm run build` : réussi, avec pré-rendu français et anglais.
- `npx playwright test --reporter=line` : 84 tests réussis sur 84, en 6,3 minutes ; 64 tests existants et 20 exécutions nouvelles (10 scénarios sur chacun des deux formats).
- Contrôle du build dans Chromium : pages FR/EN lisibles sans JavaScript, FAQ structurée, navigation vers l’application, administration locale inaccessible en production, aucune erreur navigateur dans ces parcours.
- Contrôle visuel des pages vitrine et administration sur desktop, et de la vitrine sur mobile ; aucun emoji ni dingbat détecté dans les sources.
