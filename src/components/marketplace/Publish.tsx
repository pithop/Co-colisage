import { useState } from "react";
import {
  ArrowRight,
  ScanLine,
  Plane,
  Car,
  Truck,
  Ship,
  Smartphone,
  Shirt,
  Sparkles,
  FileText,
  Coffee,
  Package,
  ArrowUpRight,
  Luggage,
} from "lucide-react";
import {
  acceptedCategories,
  PurchaseRequest,
  ShoppingItem,
  Trip,
} from "../../data/marketplace";
import { Dialog } from "./Dialog";
import { PhotoGallery } from "./PhotoGallery";
import { ParcelComposer } from "./ParcelComposer";
import { localActorId } from "../../services/uploads";
const transports = [
  { value: "avion", label: "Avion", detail: "Cabine & soute", Icon: Plane },
  {
    value: "voiture",
    label: "Voiture",
    detail: "Banquette & coffre",
    Icon: Car,
  },
  {
    value: "camion",
    label: "Camionnette",
    detail: "Grand volume",
    Icon: Truck,
  },
  { value: "bateau", label: "Bateau", detail: "Fret maritime", Icon: Ship },
] as const;
const corridors = [
  {
    origin: "Paris",
    destination: "Alger",
    from: "CDG",
    to: "ALG",
    label: "Paris CDG → Alger ALG",
  },
  {
    origin: "Marseille",
    destination: "Oran",
    from: "MRS",
    to: "ORN",
    label: "Marseille MRS → Oran ORN",
  },
  {
    origin: "Lyon",
    destination: "Casablanca",
    from: "LYS",
    to: "CMN",
    label: "Lyon LYS → Casablanca CMN",
  },
  {
    origin: "Paris",
    destination: "Tunis",
    from: "CDG",
    to: "TUN",
    label: "Paris → Tunis TUN",
  },
];
const categoryIcons = {
  Électronique: Smartphone,
  Mode: Shirt,
  Cosmétiques: Sparkles,
  Documents: FileText,
  Terroir: Coffee,
};
export function Publish({
  mode,
  name,
  onClose,
  onRequest,
  onTrip,
  onScan,
  defaultAutoAccept = false,
  ownerId = localActorId(),
  initialKind,
}: {
  mode: "requests" | "trips";
  name: string;
  onClose: () => void;
  onRequest: (r: PurchaseRequest) => void;
  onTrip: (t: Trip) => void;
  onScan: () => void;
  defaultAutoAccept?: boolean;
  ownerId?: string;
  initialKind?: "requests" | "trips" | "parcel";
}) {
  const [kind, setKind] = useState<"requests" | "trips" | "parcel">(
    initialKind || mode,
  );
  const [professional, setProfessional] = useState(false);
  const [items, setItems] = useState<ShoppingItem[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      url: "",
      specifications: "",
      price: 0,
    },
  ]);
  const changeItem = (id: string, change: Partial<ShoppingItem>) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...change } : item)),
    );
  const [vehicle, setVehicle] = useState<Trip["transportType"]>("voiture");
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [allowance, setAllowance] = useState(23);
  const [fare, setFare] = useState(120);
  const weight = Math.max(0, Number(draft.weight) || 0);
  const price = Math.max(0, Number(draft.price) || 0);
  const gain = weight * price;
  const corridor = corridors.find(
    (route) => route.origin === origin && route.destination === destination,
  );
  const TransportIcon =
    transports.find((item) => item.value === vehicle)?.Icon || Plane;
  const currency = (amount: number) =>
    new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(amount);
  const totalPurchase =
    (Number(draft.budget) || 0) +
    items
      .slice(1)
      .reduce((total, item) => total + Math.round(item.price * 100) / 100, 0);
  const submit = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const str = (key: string) => String(data.get(key) || "").trim();
    const num = (key: string) => Number(data.get(key));
    if (kind === "requests")
      onRequest({
        id: crypto.randomUUID(),
        ownerId,
        kind: "shopping",
        items: items.map((item, index) =>
          index
            ? item
            : {
                ...item,
                name: str("title"),
                specifications: str("specifications"),
                price: num("budget"),
              },
        ),
        title:
          str("title") +
          (items.length > 1
            ? ` + ${items.length - 1} article${items.length > 2 ? "s" : ""}`
            : ""),
        buyer: name,
        origin: str("origin"),
        destination: str("destination"),
        location: str("location") || str("destination"),
        specifications: str("specifications"),
        date: str("date"),
        budget: totalPurchase,
        reward: num("reward"),
        serviceGross: Math.round((num("reward") * 100) / 0.85) / 100,
        platformFee:
          Math.round((num("reward") * 100) / 0.85) / 100 - num("reward"),
        image: items[0].photo?.data || "/images/parcel.svg",
        weightKg: str("weightKg") ? num("weightKg") : undefined,
      });
    else
      onTrip({
        id: crypto.randomUUID(),
        title: `${str("origin")} → ${str("destination")}`,
        ownerId,
        professional: professional
          ? {
              companyName: str("companyName"),
              registration: str("registration"),
              volume: num("volume"),
            }
          : undefined,
        travelerName: name,
        travelerAvatar: "",
        rating: 0,
        reviewsCount: 0,
        origin: str("origin"),
        destination: str("destination"),
        originCode: corridor?.from || "",
        destinationCode: corridor?.to || "",
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
    <Dialog title="Publier une annonce" onClose={onClose} wide>
      <div className="publish-intro">
        <span className="eyebrow">
          {kind === "requests"
            ? "SHOPPING INVERSÉ SHOP & GO"
            : kind === "parcel"
              ? "EXPÉDITION DE COLIS SÉCURISÉE"
              : "VOYAGEUR & TRANSPORTEUR"}
        </span>
        <h3>
          {kind === "requests" ? (
            <>
              Faites-vous livrer
              <br />
              vos trouvailles.
            </>
          ) : kind === "parcel" ? (
            <>
              Envoyez votre colis
              <br />
              en toute sérénité.
            </>
          ) : (
            <>
              Votre prochain départ
              <br />
              a de la valeur.
            </>
          )}
        </h3>
        <p>
          {kind === "requests"
            ? "Renseignez vos articles et convenez d’une commission avec un voyageur."
            : kind === "parcel"
              ? "Un colis pour vos proches, confié en main propre à un voyageur vérifié."
              : "Un itinéraire. Un peu de place. De nouvelles possibilités."}
        </p>
      </div>
      <div className="segment publish-universes">
        <button
          aria-pressed={kind === "requests"}
          onClick={() => setKind("requests")}
        >
          Demande d’achat
        </button>
        <button
          aria-pressed={kind === "parcel"}
          onClick={() => setKind("parcel")}
        >
          Envoi de colis
        </button>
        <button
          aria-pressed={kind === "trips"}
          onClick={() => setKind("trips")}
        >
          Trajet
        </button>
      </div>
      {kind === "parcel" ? (
        <ParcelComposer
          name={name}
          ownerId={ownerId}
          onPublish={(request) => {
            onRequest(request);
            onClose();
          }}
        />
      ) : (
        <form
          key={kind}
          className="publish-form premium-publish"
          onChange={(event) => {
            const values = new FormData(event.currentTarget);
            setDraft(
              Object.fromEntries(
                [...values.entries()].filter(
                  (entry): entry is [string, string] =>
                    typeof entry[1] === "string",
                ),
              ),
            );
          }}
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
              <label>
                Lien URL de l’article
                <input
                  type="url"
                  placeholder="https://…"
                  value={items[0].url}
                  onChange={(event) =>
                    changeItem(items[0].id, { url: event.target.value })
                  }
                  pattern="https?://.+"
                  maxLength={2000}
                />
              </label>
              <PhotoGallery
                label="Photo de l’article 1"
                photos={items[0].photo ? [items[0].photo] : []}
                limit={1}
                onChange={(photos) =>
                  changeItem(items[0].id, { photo: photos[0] })
                }
              />
              {items.slice(1).map((item, index) => (
                <fieldset className="shopping-item" key={item.id}>
                  <legend>Article {index + 2}</legend>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() =>
                      setItems((current) =>
                        current.filter((row) => row.id !== item.id),
                      )
                    }
                  >
                    Retirer l’article {index + 2}
                  </button>
                  <label>
                    Nom de l’article {index + 2}
                    <input
                      required
                      maxLength={100}
                      value={item.name}
                      onChange={(event) =>
                        changeItem(item.id, { name: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Lien URL de l’article {index + 2}
                    <input
                      type="url"
                      pattern="https?://.+"
                      maxLength={2000}
                      value={item.url}
                      onChange={(event) =>
                        changeItem(item.id, { url: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Taille et spécifications de l’article {index + 2}
                    <input
                      required
                      maxLength={200}
                      value={item.specifications}
                      onChange={(event) =>
                        changeItem(item.id, {
                          specifications: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Prix magasin de l’article {index + 2} (€)
                    <input
                      required
                      type="number"
                      min="1"
                      max="10000"
                      step="0.01"
                      value={item.price || ""}
                      onChange={(event) =>
                        changeItem(item.id, {
                          price: Number(event.target.value),
                        })
                      }
                    />
                  </label>
                  <PhotoGallery
                    label={`Photo de l’article ${index + 2}`}
                    photos={item.photo ? [item.photo] : []}
                    limit={1}
                    onChange={(photos) =>
                      changeItem(item.id, { photo: photos[0] })
                    }
                  />
                </fieldset>
              ))}
              <button
                className="outline-button"
                type="button"
                disabled={items.length >= 20}
                onClick={() =>
                  setItems((current) => [
                    ...current,
                    {
                      id: crypto.randomUUID(),
                      name: "",
                      url: "",
                      specifications: "",
                      price: 0,
                    },
                  ])
                }
              >
                Ajouter un article
              </button>
            </>
          ) : (
            <>
              <label className="check-row pro-toggle">
                <input
                  type="checkbox"
                  checked={professional}
                  onChange={(event) => setProfessional(event.target.checked)}
                />
                Transporteur Professionnel
              </label>
              {professional && (
                <div className="pro-fields animated-field">
                  <label>
                    Entreprise
                    <input name="companyName" required maxLength={150} />
                  </label>
                  <label>
                    SIRET ou CNRC
                    <input
                      name="registration"
                      required
                      minLength={6}
                      maxLength={30}
                    />
                  </label>
                  <label>
                    Volume utilitaire (m³)
                    <input
                      name="volume"
                      required
                      type="number"
                      min="0.1"
                      max="200"
                      step="0.1"
                    />
                  </label>
                  <small>
                    Le badge professionnel est attribué après examen du dossier
                    depuis votre profil.
                  </small>
                </div>
              )}
              <button type="button" className="scan-publish" onClick={onScan}>
                <ScanLine size={21} />
                <span>
                  <strong>Scanner mon billet d’avion</strong>
                  <small>Franchise de 10 kg → 9 kg maximum</small>
                </span>
                <ArrowRight size={17} />
              </button>
              <fieldset className="transport-selector">
                <legend>Comment voyagez-vous ?</legend>
                <label className="native-control-bridge">
                  Véhicule
                  <select
                    name="vehicle"
                    aria-label="Véhicule"
                    value={vehicle}
                    onChange={(e) =>
                      setVehicle(e.target.value as Trip["transportType"])
                    }
                  >
                    {transports.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="transport-selector-grid">
                  {transports.map(({ value, label, detail, Icon }) => (
                    <button
                      type="button"
                      key={value}
                      className="transport-selector-card"
                      aria-pressed={vehicle === value}
                      onClick={() => setVehicle(value)}
                    >
                      <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
                      <strong>{label}</strong>
                      <small>{detail}</small>
                      <span
                        className="transport-selected-mark"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </fieldset>
              {vehicle === "avion" && (
                <section
                  className="flight-allowance animated-field"
                  aria-label="Franchise bagage"
                >
                  <div>
                    <Luggage size={20} />
                    <strong>Votre franchise bagage</strong>
                    <span>
                      {weight} / {allowance} kg
                    </span>
                  </div>
                  <div className="allowance-track">
                    <span
                      style={{
                        width: `${Math.min(100, (weight / allowance) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="allowance-options">
                    {[10, 23].map((kg) => (
                      <button
                        type="button"
                        key={kg}
                        aria-pressed={allowance === kg}
                        onClick={() => setAllowance(kg)}
                      >
                        {kg} kg
                      </button>
                    ))}
                    <small>Vérifiez la franchise sur votre billet.</small>
                  </div>
                  {weight > allowance && (
                    <p role="status">
                      La place proposée dépasse votre franchise sélectionnée.
                    </p>
                  )}
                </section>
              )}
              <label>
                Modèle ou compagnie
                <input
                  required
                  name="label"
                  placeholder={
                    vehicle === "avion" ? "Ex. Air France" : "Ex. Peugeot 208"
                  }
                />
              </label>
              {vehicle === "avion" && (
                <label className="animated-field">
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
          <div className="corridor-picker">
            <span className="field-caption">Les grands départs</span>
            <div>
              {corridors.map((route) => (
                <button
                  type="button"
                  key={route.to}
                  aria-pressed={corridor?.to === route.to}
                  onClick={() => {
                    setOrigin(route.origin);
                    setDestination(route.destination);
                  }}
                >
                  {route.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-grid">
            <label>
              Départ
              <input
                name="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
                maxLength={80}
                placeholder="Paris"
              />
            </label>
            <label>
              Destination
              <input
                name="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
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
                  Optionnel. Permet aux voyageurs de retrouver votre demande
                  selon la place disponible.
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
              <section
                className="earnings-calculator"
                aria-label="Calculateur de gains"
              >
                <div className="earnings-heading">
                  <span>
                    <ArrowUpRight size={18} /> Votre place vaut plus
                  </span>
                  <small>ESTIMATION</small>
                </div>
                <output aria-live="polite">
                  Gain estimé voyageur : <strong>+{currency(gain)} €</strong>
                </output>
                <div
                  className="earnings-track"
                  role="progressbar"
                  aria-label="Part estimée du billet financée"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={
                    fare > 0
                      ? Math.min(100, Math.round((gain / fare) * 100))
                      : 0
                  }
                >
                  <span
                    style={{
                      width: `${fare > 0 ? Math.min(100, (gain / fare) * 100) : 0}%`,
                    }}
                  />
                </div>
                <label>
                  Prix du billet (€)
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    value={fare || ""}
                    onChange={(e) => setFare(Number(e.target.value))}
                  />
                </label>
                <p>
                  {price > 0 && fare > 0
                    ? `Financement estimé du billet dès ${Math.ceil(fare / price)} kg réservés.`
                    : "Renseignez votre tarif pour estimer le financement du billet."}
                </p>
                <small>
                  Montant brut, sous réserve de réservations confirmées, avant
                  frais éventuels.
                </small>
              </section>
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
                  {acceptedCategories.map((category) => {
                    const Icon = categoryIcons[category];
                    return (
                      <label key={category} className="category-chip">
                        <input
                          type="checkbox"
                          name="categories"
                          value={category}
                        />
                        <Icon size={18} aria-hidden="true" />
                        <span>{category}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </>
          )}
          {kind === "requests" && (
            <section className="shopping-total" aria-label="Budget Shop & Go">
              <span>
                {items.length} article{items.length > 1 ? "s" : ""} dans votre
                panier
              </span>
              <div>
                <span>Achats estimés</span>
                <strong>{currency(totalPurchase)} €</strong>
              </div>
              <div>
                <span>Commission nette offerte au voyageur</span>
                <strong>{currency(Number(draft.reward) || 0)} €</strong>
              </div>
              <div>
                <span>Frais plateforme (15 % du service brut)</span>
                <strong>
                  {currency(
                    Math.round(((Number(draft.reward) || 0) * 100) / 0.85) /
                      100 -
                      (Number(draft.reward) || 0),
                  )}{" "}
                  €
                </strong>
              </div>
              <output aria-live="polite">
                Budget total estimé :{" "}
                <strong>
                  {currency(
                    totalPurchase +
                      Math.round(((Number(draft.reward) || 0) * 100) / 0.85) /
                        100,
                  )}{" "}
                  €
                </strong>
              </output>
              <small>
                Hors transport supplémentaire, droits et taxes douanières.
              </small>
            </section>
          )}
          <section
            className="live-card-preview"
            aria-label="Aperçu de votre annonce"
          >
            <div className="preview-caption">
              <span>Aperçu de votre annonce</span>
              <span>
                <i /> En direct
              </span>
            </div>
            <article>
              <div className="preview-author">
                <span className="preview-monogram">
                  {name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <strong>{name}</strong>
                  <small>
                    {kind === "trips"
                      ? "Votre prochain voyage"
                      : "Votre prochaine trouvaille"}
                  </small>
                </div>
                {kind === "trips" ? (
                  <TransportIcon size={26} />
                ) : (
                  <Package size={26} />
                )}
              </div>
              <div className="flight-route-indicator">
                <div>
                  <small>{corridor?.from || "DÉPART"}</small>
                  <strong>{origin || "Votre ville"}</strong>
                </div>
                <span>
                  <i />
                  <Plane size={20} />
                  <i />
                </span>
                <div>
                  <small>{corridor?.to || "ARRIVÉE"}</small>
                  <strong>{destination || "Votre destination"}</strong>
                </div>
              </div>
              {kind === "requests" && (
                <h4>{draft.title || "L’article que vous recherchez"}</h4>
              )}
              <p className="preview-description">
                {kind === "trips"
                  ? draft.description || "Chaque départ rapproche quelqu’un."
                  : draft.specifications ||
                    "Ajoutez les détails qui font la différence."}
              </p>
              <div className="preview-footer">
                <span>
                  {draft.date
                    ? new Date(`${draft.date}T12:00:00`).toLocaleDateString(
                        "fr-FR",
                        { day: "numeric", month: "long", year: "numeric" },
                      )
                    : "Date à préciser"}
                  {kind === "trips" && draft.time ? ` · ${draft.time}` : ""}
                  <small>
                    {kind === "trips"
                      ? `${weight} kg disponibles`
                      : `Budget article : ${currency(totalPurchase)} €`}
                  </small>
                </span>
                <strong>
                  {kind === "trips"
                    ? `${currency(price)} €`
                    : `+${currency(Number(draft.reward) || 0)} €`}
                  <small>{kind === "trips" ? "/ kilo" : "de service"}</small>
                </strong>
              </div>
            </article>
          </section>
          <button className="primary-button" type="submit">
            {kind === "requests" ? "Publier ma demande" : "Publier mon trajet"}
            <ArrowRight size={18} />
          </button>
        </form>
      )}
    </Dialog>
  );
}
