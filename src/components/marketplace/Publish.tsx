import { useState } from "react";
import { ArrowRight, ScanLine } from "lucide-react";
import {
  acceptedCategories,
  PurchaseRequest,
  Trip,
} from "../../data/marketplace";
import { Dialog } from "./Dialog";
export function Publish({
  mode,
  name,
  onClose,
  onRequest,
  onTrip,
  onScan,
  defaultAutoAccept = false,
}: {
  mode: "requests" | "trips";
  name: string;
  onClose: () => void;
  onRequest: (r: PurchaseRequest) => void;
  onTrip: (t: Trip) => void;
  onScan: () => void;
  defaultAutoAccept?: boolean;
}) {
  const [kind, setKind] = useState(mode);
  const [vehicle, setVehicle] = useState<Trip["transportType"]>("voiture");
  const submit = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const str = (key: string) => String(data.get(key) || "").trim();
    const num = (key: string) => Number(data.get(key));
    if (kind === "requests")
      onRequest({
        id: crypto.randomUUID(),
        title: str("title"),
        buyer: name,
        origin: str("origin"),
        destination: str("destination"),
        location: str("location") || str("destination"),
        specifications: str("specifications"),
        date: str("date"),
        budget: num("budget"),
        reward: num("reward"),
        image: "/images/parcel.svg",
        weightKg: str("weightKg") ? num("weightKg") : undefined,
      });
    else
      onTrip({
        id: crypto.randomUUID(),
        title: `${str("origin")} → ${str("destination")}`,
        travelerName: name,
        travelerAvatar: "",
        rating: 0,
        reviewsCount: 0,
        origin: str("origin"),
        destination: str("destination"),
        originCode: "",
        destinationCode: "",
        departureDate: str("date"),
        departureTime: str("time"),
        transportType: vehicle,
        transportLabel: str("label"),
        availableKg: num("weight"),
        pricePerKg: num("price"),
        image: "",
        description: str("description"),
        canCarryParcel: true,
        capacity: `${num("weight")} kg disponibles`,
        dimensions: str("dimensions"),
        flightNumber:
          vehicle === "avion" ? str("flightNumber").toUpperCase() : undefined,
        autoAccept: data.has("autoAccept"),
        canBuyProduct: data.has("canBuyProduct"),
        acceptedCategories: acceptedCategories.filter((category) =>
          data.getAll("categories").includes(category),
        ),
      });
    onClose();
  };
  return (
    <Dialog title="Publier une annonce" onClose={onClose}>
      <div className="segment">
        <button
          aria-pressed={kind === "requests"}
          onClick={() => setKind("requests")}
        >
          Demande d’achat
        </button>
        <button
          aria-pressed={kind === "trips"}
          onClick={() => setKind("trips")}
        >
          Trajet
        </button>
      </div>
      <form
        className="publish-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit(e.currentTarget);
        }}
      >
        {kind === "requests" ? (
          <>
            <label>
              Article recherché
              <input
                name="title"
                required
                maxLength={100}
                placeholder="Ex. Nike Air Max · pointure 42"
              />
            </label>
            <label>
              Précisions
              <input
                name="specifications"
                required
                maxLength={200}
                placeholder="État, couleur, taille…"
              />
            </label>
          </>
        ) : (
          <>
            <button type="button" className="scan-publish" onClick={onScan}>
              <ScanLine size={21} />
              <span>
                <strong>Scanner mon billet d’avion</strong>
                <small>Franchise de 10 kg → 9 kg maximum</small>
              </span>
              <ArrowRight size={17} />
            </button>
            <label>
              Véhicule
              <select
                value={vehicle}
                onChange={(e) =>
                  setVehicle(e.target.value as Trip["transportType"])
                }
              >
                <option value="voiture">Voiture</option>
                <option value="camion">Camionnette</option>
                <option value="avion">Avion</option>
                <option value="bateau">Bateau</option>
              </select>
            </label>
            <label>
              Modèle ou compagnie
              <input required name="label" placeholder="Ex. Peugeot 208" />
            </label>
            {vehicle === "avion" && (
              <label>
                Numéro de vol
                <input
                  name="flightNumber"
                  placeholder="Ex. AH1001, AF1384"
                  maxLength={10}
                  autoCapitalize="characters"
                  aria-describedby="flight-number-hint"
                />
                <small id="flight-number-hint">
                  Optionnel, recommandé pour retrouver votre vol.
                </small>
              </label>
            )}
          </>
        )}
        <div className="form-grid">
          <label>
            Départ
            <input name="origin" required maxLength={80} placeholder="Paris" />
          </label>
          <label>
            Destination
            <input
              name="destination"
              required
              maxLength={80}
              placeholder="Lyon"
            />
          </label>
        </div>
        <label>
          {kind === "requests"
            ? "Livraison souhaitée avant le"
            : "Date de départ"}
          <input
            name="date"
            required
            type="date"
            min={new Date().toLocaleDateString("en-CA")}
          />
        </label>
        {kind === "requests" ? (
          <>
            <label>
              Lieu de livraison
              <input
                name="location"
                placeholder="Ex. Lyon, Part-Dieu"
                maxLength={150}
              />
            </label>
            <label>
              Poids estimé du colis (kg)
              <input
                name="weightKg"
                type="number"
                min="0.1"
                max="1000"
                step="0.1"
                placeholder="Ex. 2"
              />
              <small>
                Optionnel. Permet aux voyageurs de retrouver votre demande selon
                la place disponible.
              </small>
            </label>
            <div className="form-grid">
              <label>
                Budget article (€)
                <input
                  name="budget"
                  type="number"
                  min="1"
                  max="10000"
                  step="0.01"
                  required
                />
              </label>
              <label>
                Service (€)
                <input
                  name="reward"
                  type="number"
                  min="1"
                  max="1000"
                  step="0.01"
                  required
                />
              </label>
            </div>
          </>
        ) : (
          <>
            <div className="form-grid">
              <label>
                Heure de départ
                <input name="time" type="time" required />
              </label>
              <label>
                Place disponible (kg)
                <input
                  name="weight"
                  type="number"
                  min="1"
                  max="1000"
                  required
                />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Prix par kilo (€)
                <input
                  name="price"
                  type="number"
                  min="1"
                  max="1000"
                  step="0.01"
                  required
                />
              </label>
              <label>
                Dimensions (cm)
                <input name="dimensions" placeholder="80 × 60 × 40" />
              </label>
            </div>
            <label>
              À propos du trajet
              <textarea
                name="description"
                maxLength={1000}
                placeholder="Point de rendez-vous, objets acceptés…"
              />
            </label>
            <fieldset className="trip-options">
              <legend>Un trajet à votre façon</legend>
              <label className="trip-option">
                <input
                  type="checkbox"
                  name="autoAccept"
                  defaultChecked={defaultAutoAccept}
                />
                <span>
                  <strong>Acceptation automatique des réservations</strong>
                  <small>
                    Accepter instantanément les réservations des profils
                    vérifiés
                  </small>
                </span>
              </label>
              <label className="trip-option">
                <input type="checkbox" name="canBuyProduct" />
                <span>
                  <strong>Service d’achat en magasin</strong>
                  <small>
                    J’accepte d’aller acheter la marchandise sur place
                  </small>
                </span>
              </label>
            </fieldset>
            <fieldset className="accepted-categories">
              <legend>Catégories acceptées</legend>
              <p>
                Choisissez une ou plusieurs catégories. Sans sélection : à
                convenir ensemble.
              </p>
              <div>
                {acceptedCategories.map((category) => (
                  <label key={category}>
                    <input type="checkbox" name="categories" value={category} />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}
        <button className="primary-button" type="submit">
          {kind === "requests" ? "Publier ma demande" : "Publier mon trajet"}
          <ArrowRight size={18} />
        </button>
      </form>
    </Dialog>
  );
}
