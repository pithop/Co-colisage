import { useState } from "react";
import type { RadarMovement } from "../../services/flightFerryRadarApi";
import { ArrowRight, Package, ShieldCheck } from "lucide-react";
import { PhotoGallery } from "./PhotoGallery";
import type { Attachment } from "../../services/uploads";
import type { PurchaseRequest } from "../../data/marketplace";
const dateAfter = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
export function ParcelComposer({
  name,
  ownerId,
  onPublish,
  initialRoute,
}: {
  initialRoute?: RadarMovement;
  name: string;
  ownerId: string;
  onPublish: (request: PurchaseRequest) => void;
}) {
  const [photos, setPhotos] = useState<Attachment[]>([]);
  const [flexibility, setFlexibility] = useState<
    "urgent" | "week" | "deadline"
  >("week");
  const [direction, setDirection] = useState<"FR-DZ" | "DZ-FR">(
    initialRoute?.origin.code.startsWith("ALG") ||
      initialRoute?.origin.code.startsWith("ORN") ||
      initialRoute?.origin.code === "CZL"
      ? "DZ-FR"
      : "FR-DZ",
  );
  const [transport, setTransport] = useState(
    initialRoute?.kind === "ferry" ? "sea" : "air",
  );
  const [value, setValue] = useState(0);
  const [personal, setPersonal] = useState(false);
  const [error, setError] = useState("");
  const threshold =
    direction === "FR-DZ" ? 150000 : transport === "air" ? 430 : 300;
  const currency = direction === "FR-DZ" ? "DZD" : "EUR";
  const excess = Math.max(0, value - threshold);
  return (
    <form
      className="publish-form premium-publish parcel-composer"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const str = (key: string) => String(form.get(key) || "").trim();
        const num = (key: string) => Number(form.get(key));
        if (!photos.length) {
          setError("Ajoutez au moins une photo du colis.");
          return;
        }
        if (!str("title") || !str("pickup") || !str("location")) {
          setError("Précisez le contenu et les adresses.");
          return;
        }
        onPublish({
          id: crypto.randomUUID(),
          ownerId,
          kind: "parcel",
          title: str("title"),
          buyer: name,
          origin: str("origin"),
          destination: str("destination"),
          pickupLocation: str("pickup"),
          location: str("location"),
          recipientName: str("recipientName"),
          recipientEmail: str("recipientEmail"),
          date:
            flexibility === "deadline"
              ? str("deadline")
              : dateAfter(
                  flexibility === "urgent" ? 2 : (7 - new Date().getDay()) % 7,
                ),
          flexibility,
          weightKg: num("weightKg"),
          dimensions: {
            length: num("length"),
            width: num("width"),
            height: num("height"),
          },
          budget: 0,
          reward: num("reward"),
          declaredValue: value,
          declaredCurrency: currency,
          customsDirection: direction,
          transportReference: initialRoute?.reference,
          image: photos[0].data,
          photos,
          specifications: [
            str("contents"),
            initialRoute
              ? `Liaison souhaitée : ${initialRoute.reference} (${initialRoute.origin.code} / ${initialRoute.destination.code}), simulation, disponibilité à confirmer.`
              : "",
          ]
            .filter(Boolean)
            .join("\n"),
        });
      }}
    >
      {initialRoute && (
        <p className="info-box">
          Liaison souhaitée : {initialRoute.reference} ·{" "}
          {initialRoute.origin.code} / {initialRoute.destination.code}.
          Simulation, aucune réservation effectuée.
        </p>
      )}
      <div className="composer-heading">
        <Package size={28} />
        <div>
          <h3>Un colis. Quelqu’un sur le chemin.</h3>
          <p>Décrivez ce que vous confiez, et où le retrouver.</p>
        </div>
      </div>
      <label>
        Nom du colis
        <input
          name="title"
          required
          maxLength={100}
          placeholder="Un livre, un cadeau, un peu de chez vous…"
        />
      </label>
      <label>
        Contenu du colis
        <textarea
          name="contents"
          required
          maxLength={1000}
          placeholder="Inventaire précis, état et précautions de transport"
        />
      </label>
      <PhotoGallery photos={photos} onChange={setPhotos} />
      <fieldset className="choice-field">
        <legend>Quand doit-il arriver ?</legend>
        <div className="choice-chips">
          {(
            [
              ["urgent", "Urgent (24h-48h)"],
              ["week", "Cette semaine"],
              ["deadline", "Date limite précise"],
            ] as const
          ).map(([id, label]) => (
            <button
              type="button"
              key={id}
              aria-pressed={flexibility === id}
              onClick={() => setFlexibility(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      {flexibility === "deadline" && (
        <label>
          Date limite de livraison
          <input name="deadline" required type="date" min={dateAfter(0)} />
        </label>
      )}
      <label>
        Poids du colis (kg)
        <input
          name="weightKg"
          required
          type="number"
          min="0.1"
          max="1000"
          step="0.1"
        />
      </label>
      <fieldset>
        <legend>Gabarit en centimètres</legend>
        <div className="dimension-grid">
          {[
            ["length", "Longueur"],
            ["width", "Largeur"],
            ["height", "Hauteur"],
          ].map(([id, label]) => (
            <label key={id}>
              {label} (cm)
              <input type="number" name={id} min="1" max="500" required />
            </label>
          ))}
        </div>
      </fieldset>
      <div className="form-grid">
        <label>
          Ville de départ
          <input
            name="origin"
            required
            maxLength={80}
            defaultValue={initialRoute?.origin.name}
          />
        </label>
        <label>
          Ville de destination
          <input
            name="destination"
            required
            maxLength={80}
            defaultValue={initialRoute?.destination.name}
          />
        </label>
      </div>
      <label>
        Lieu de prise en charge
        <input
          name="pickup"
          required
          maxLength={200}
          placeholder="Adresse ou point de rendez-vous"
        />
      </label>
      <label>
        Lieu de livraison souhaité
        <input name="location" required maxLength={200} />
      </label>
      <div className="form-grid">
        <label>
          Nom du destinataire
          <input name="recipientName" required maxLength={100} />
        </label>
        <label>
          E-mail du destinataire
          <input name="recipientEmail" type="email" required maxLength={200} />
        </label>
      </div>
      <section className="customs-calculator" aria-label="Calculateur douanier">
        <h3>
          <ShieldCheck size={19} /> Préparer le passage en douane
        </h3>
        <label>
          Sens du passage
          <select
            value={direction}
            onChange={(event) => {
              setDirection(event.target.value as typeof direction);
              setValue(0);
            }}
          >
            <option value="FR-DZ">France vers Algérie</option>
            <option value="DZ-FR">Algérie vers France</option>
          </select>
        </label>
        {direction === "DZ-FR" && (
          <label>
            Mode de passage
            <select
              value={transport}
              onChange={(event) => setTransport(event.target.value)}
            >
              <option value="air">Avion ou bateau</option>
              <option value="road">Voiture ou train</option>
            </select>
          </label>
        )}
        <label>
          Valeur marchande déclarée ({currency})
          <input
            type="number"
            min="0"
            max="100000000"
            step="0.01"
            required
            value={value || ""}
            onChange={(event) => setValue(Number(event.target.value))}
          />
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={personal}
            onChange={(event) => setPersonal(event.target.checked)}
          />
          Biens pour l’usage personnel ou familial du voyageur adulte
        </label>
        <output aria-live="polite">
          Seuil indicatif : {threshold.toLocaleString("fr-FR")} {currency}.{" "}
          {excess > 0
            ? `Dépassement de ${excess.toLocaleString("fr-FR")} ${currency} : déclaration et droits potentiels.`
            : `Marge indicative : ${(threshold - value).toLocaleString("fr-FR")} ${currency}.`}
        </output>
        {!personal && (
          <p role="status">
            Colis pour un tiers : franchise non présumée applicable. Faites
            confirmer le régime par la douane avant le départ.
          </p>
        )}
        <p>
          Ce repère ne calcule pas les taxes et ne vaut pas autorisation. Les
          biens commerciaux, interdits ou réglementés suivent des règles
          spécifiques.
        </p>
        <a
          href={
            direction === "FR-DZ"
              ? "https://www.joradp.dz/FTP/JO-francais/2020/F2020083.pdf"
              : "https://www.douane.gouv.fr/fiche/franchises-douanieres-et-fiscales-en-quantites-et-en-valeurs"
          }
          target="_blank"
          rel="noreferrer"
        >
          {direction === "FR-DZ"
            ? "Article 106 LF 2021 : référence historique, à confirmer avant voyage"
            : "Consulter les conditions des douanes françaises"}
        </a>
      </section>
      <label>
        Budget proposé au voyageur (€)
        <input
          name="reward"
          type="number"
          min="1"
          max="10000"
          step="0.01"
          required
        />
      </label>
      <label className="check-row">
        <input type="checkbox" required />
        Je déclare le contenu exact et vérifierai son admissibilité avant le
        transport.
      </label>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <button type="submit" className="primary-button">
        Publier mon colis
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
