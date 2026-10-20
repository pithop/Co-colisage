# Catalogue international et arbitrage

Le catalogue contient 44 itinéraires directionnels et leurs demandes de démonstration. La sélection initiale conserve les annonces historiques ; « Monde entier » et la recherche donnent accès à l’ensemble des destinations. Les noms et avis sont fictifs, les portraits sont des photographies d’illustration locales. Ils ne constituent pas des avis clients vérifiés.

`src/services/flightArbitrageApi.ts` apparie les demandes dans le bon sens, par aéroport ou ville, dates de disponibilité et limite de livraison. Il exclut les demandes indisponibles, sans poids exploitable et déjà engagées. Un calcul en grammes choisit la combinaison de commissions la plus élevée dans la franchise disponible. Les montants sont additionnés en centimes ; le ROI est le gain après coûts divisé par les coûts de voyage.

Les budgets d’achat ne sont pas des commissions. Le calcul déduit le billet, les bagages et les frais communiqués. Les autres dépenses restent exclues et sont annoncées dans l’interface.

L’action « Réserver et sécuriser le deal » prépare une discussion par demande et les relie au même groupe. Une transaction IndexedDB relit les demandes et les accords, vérifie le tarif et écrit toutes les discussions ensemble. Les appels répétés réutilisent les mêmes discussions. Aucune réservation aérienne ni aucun séquestre bancaire ne sont effectués par cette action.

## Fournisseur de billets

Sans fournisseur configuré, l’interface présente des estimations et reste explicitement en démonstration. Les montants demandés comme exemples ne sont pas des offres réservables : les pages publiques de [Transavia Paris–Alger](https://www.transavia.com/aeroports/fr-fr/aeroport-de-paris-orly/paris-alger) et [Paris–Casablanca](https://www.transavia.com/aeroports/fr-fr/aeroport-de-paris-orly/paris-casablanca) affichent des tarifs variables.

Définir `VITE_FLIGHT_ARBITRAGE_URL` avec l’URL du serveur d’offres pour utiliser des prix fournisseur. Le navigateur actualise ce flux toutes les 60 secondes, avec annulation au démontage, délai maximal et indication des échecs. Les clés du fournisseur doivent rester sur le serveur.

Le serveur doit répondre avec `{"offers": [...]}`. Chaque offre respecte `FlightOffer` :

```json
{
  "id": "supplier-offer-id",
  "routeId": "par-alg",
  "origin": "Paris",
  "originCode": "ORY",
  "destination": "Alger",
  "destinationCode": "ALG",
  "airline": "Transavia",
  "flightNumber": "reference-fournisseur",
  "departureAt": "2030-10-22T10:00:00Z",
  "arrivalAt": "2030-10-22T12:30:00Z",
  "fetchedAt": "2030-10-20T12:00:00Z",
  "expiresAt": "2030-10-20T12:05:00Z",
  "currency": "EUR",
  "flightPrice": 49,
  "availableKg": 8,
  "baggageCost": 25,
  "fees": 0
}
```

Cet exemple décrit le format, pas un billet réel. Les offres périmées, dupliquées, les devises non EUR, les coûts manquants et les horaires incohérents sont rejetés. Le serveur doit fournir un tarif confirmé et sa franchise, ainsi qu’une échéance courte. La réservation nécessitera une reconfirmation du prix et une opération serveur distincte, conformément au [parcours fournisseur Amadeus](https://admin.developers.amadeus.com/self-service/apis-docs/guides/developer-guides/faq/).

## Radar

Le flux de l’interface contient 17 liaisons, paginées par neuf, avec les filtres Maghreb, Afrique de l’Ouest, Transatlantique et Moyen-Orient. `createRadarRoutes(epoch)` et `getRadarSnapshot(now, epoch)` conservent le manifeste régional de neuf lignes pour leurs consommateurs existants. Leur troisième/deuxième argument `worldwide` active le catalogue complet ; `flightFerryRadarApi` l’utilise par défaut.

Horaires, affectations, capacités et télémétrie sont simulés. Le fond cartographique Natural Earth est local et dans le domaine public. Les crédits des portraits et du fond sont dans `public/images/CREDITS.md`.
