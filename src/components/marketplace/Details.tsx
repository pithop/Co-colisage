import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Euro,
  Info,
  MapPin,
  Package,
  ScanLine,
  ShieldCheck,
  Star,
  Wallet,
} from "lucide-react";
import {
  PurchaseRequest,
  Trip,
  dateLabel,
  euro,
  timeLabel,
  vehicleLabel,
} from "../../data/marketplace";
import { Avatar } from "./Avatar";

export function RequestDetails({
  request: r,
  onChat,
}: {
  request: PurchaseRequest;
  onChat: (offer: boolean) => void;
}) {
  return (
    <article className="request-detail">
      <div className="detail-photo">
        <img src={r.image} alt={r.title} />
        <span>
          {r.photos?.length || r.items?.[0]?.photo
            ? "Photo de l’annonce"
            : "Photo d’illustration"}
        </span>
      </div>
      <div className="detail-content">
        <span className="purchase-badge">
          {r.kind === "parcel" ? "Colis à transporter" : "À acheter et livrer"}
        </span>
        <h1>{r.title}</h1>
        {r.demo && <p className="demo-label">Annonce et profil de démonstration · photographie d’illustration.</p>}
        <button className="buyer-row" onClick={() => onChat(false)}>
          <Avatar name={r.buyer} src={r.buyerAvatar} />
          <span>
            <strong>{r.buyer}</strong>
            <small>Demande publiée par</small>
          </span>
          {r.buyerAvatar && (
            <span className="verified-badge">
              <ShieldCheck size={14} /> Profil BagVoyage
            </span>
          )}
          <ChevronRight size={19} />
        </button>
        <dl className="spec-list">
          <div>
            <Package />
            <dt>Article recherché</dt>
            <dd>{r.specifications}</dd>
          </div>
          <div>
            <MapPin />
            <dt>Livraison souhaitée</dt>
            <dd>
              {r.location}
              <small>Avant le {dateLabel(r.date, true)}</small>
            </dd>
          </div>
          <div>
            <Wallet />
            <dt>{r.kind === "parcel" ? "Poids du colis" : "Budget article"}</dt>
            <dd>
              {r.kind === "parcel"
                ? `${r.weightKg} kg`
                : `${euro(r.budget)} maximum`}
            </dd>
          </div>
          <div>
            <Euro />
            <dt>Rémunération du service</dt>
            <dd>{euro(r.reward)}</dd>
          </div>
        </dl>
        {r.kind === "parcel" && (
          <section className="request-extra">
            <h2>Détails de l’envoi</h2>
            <p>Prise en charge : {r.pickupLocation}</p>
            <p>
              {r.weightKg} kg / {r.dimensions?.length} × {r.dimensions?.width} ×{" "}
              {r.dimensions?.height} cm
            </p>
            <p>
              Flexibilité :{" "}
              {r.flexibility === "urgent"
                ? "Urgent (24h-48h)"
                : r.flexibility === "week"
                  ? "Cette semaine"
                  : "Date limite précise"}
            </p>
            <p>
              Valeur déclarée : {r.declaredValue?.toLocaleString("fr-FR")}{" "}
              {r.declaredCurrency}
            </p>
            <p>Destinataire : {r.recipientName}</p>
            <div className="request-photos">
              {r.photos?.map((photo) => (
                <img key={photo.id} src={photo.data} alt={photo.name} />
              ))}
            </div>
          </section>
        )}
        {!!r.items?.length && (
          <section className="request-extra">
            <h2>
              Liste d’achats / {r.items.length} article
              {r.items.length > 1 ? "s" : ""}
            </h2>
            {r.items.map((item) => (
              <article key={item.id}>
                <h3>
                  {item.name} / {euro(item.price)}
                </h3>
                <p>{item.specifications}</p>
                {item.photo && <img src={item.photo.data} alt={item.name} />}
                {/^https?:\/\//.test(item.url) && (
                  <a href={item.url} target="_blank" rel="noreferrer">
                    Voir l’article en boutique
                  </a>
                )}
              </article>
            ))}
          </section>
        )}
        <p className="info-box">
          <ShieldCheck size={20} />
          <span>
            <strong>Un échange en toute confiance</strong>
            <br />
            Confirmez les conditions avec {r.buyer} avant{" "}
            {r.kind === "parcel" ? "la prise en charge" : "l’achat"}.
          </span>
        </p>
      </div>
      <div className="detail-actions">
        <div className="action-reward">
          <span>Rémunération du service</span>
          <strong>{euro(r.reward)}</strong>
        </div>
        <div className="detail-action-buttons">
          <button className="primary-button" onClick={() => onChat(true)}>
            {r.kind === "parcel"
              ? "Proposer de transporter"
              : "Proposer d’acheter et livrer"}
            <ArrowRight size={18} />
          </button>
          <button className="outline-button" onClick={() => onChat(false)}>
            Poser une question
          </button>
        </div>
      </div>
    </article>
  );
}
export function TripDetails({
  trip: t,
  onChat,
  onScan,
}: {
  trip: Trip;
  onChat: () => void;
  onScan: () => void;
}) {
  return (
    <article className="trip-detail">
      <div className="trip-detail-banner">
        {t.image && (
          <img
            className="trip-hero-vehicle"
            src={t.image}
            alt={vehicleLabel(t)}
          />
        )}
        <span>
          {vehicleLabel(t)} · {t.transportLabel}
        </span>
        <h1>
          {t.origin} <ArrowRight /> {t.destination}
        </h1>
        <p>
          <CalendarDays size={18} />
          {dateLabel(t.departureDate, true)} · Départ{" "}
          {timeLabel(t.departureTime)}
        </p>
      </div>
      <div className="detail-content">
        <div className="buyer-row">
          <Avatar name={t.travelerName} src={t.travelerAvatar} />
          <strong>{t.travelerName}</strong>
          <span className="rating">
            <Star size={15} fill="currentColor" />
            {t.rating ? t.rating.toFixed(1) : "Nouveau"}
            {t.reviewsCount > 0 && <span> · {t.reviewsCount} avis</span>}
          </span>
        </div>
        <p className="trip-description">{t.description}</p>
        {t.demo && <p className="demo-label">Profil de démonstration · photographie d’illustration.</p>}
        {!!t.reviews?.length && <section className="traveler-reviews" aria-label="Avis sur ce voyageur">
          <h2>Retours sur les remises</h2>
          <p className="demo-label">Exemples d’avis de démonstration, sans certification de transaction.</p>
          {t.reviews.map(review => <article key={review.id}>
            <div><strong>{review.author}</strong><span className="rating"><Star size={14} />{review.rating}/5</span><time dateTime={review.date}>{dateLabel(review.date, true)}</time></div>
            <p>{review.comment}</p>
          </article>)}
        </section>}
        {(t.autoAccept ||
          t.canBuyProduct ||
          t.acceptedCategories?.length ||
          t.flightNumber) && (
          <dl className="trip-published-options">
            {t.flightNumber && (
              <div>
                <dt>Numéro de vol</dt>
                <dd>{t.flightNumber}</dd>
              </div>
            )}
            {t.autoAccept && (
              <div>
                <dt>Acceptation automatique</dt>
                <dd>Réservations des profils vérifiés</dd>
              </div>
            )}
            {t.canBuyProduct && (
              <div>
                <dt>Service d’achat en magasin</dt>
                <dd>Le voyageur peut acheter la marchandise sur place.</dd>
              </div>
            )}
            {!!t.acceptedCategories?.length && (
              <div>
                <dt>Catégories acceptées</dt>
                <dd>{t.acceptedCategories.join(", ")}</dd>
              </div>
            )}
          </dl>
        )}
        <dl className="spec-list">
          <div>
            <Info />
            <dt>Véhicule</dt>
            <dd>
              {vehicleLabel(t)} · {t.transportLabel}
            </dd>
          </div>
          <div>
            <Package />
            <dt>Place disponible</dt>
            <dd>
              {t.capacity || `${t.availableKg} kg disponibles`}
              {t.dimensions && <small>{t.dimensions}</small>}
            </dd>
          </div>
          <div>
            <Euro />
            <dt>Participation au trajet</dt>
            <dd>
              {t.startingPrice
                ? `À partir de ${euro(t.startingPrice)}`
                : `${euro(t.pricePerKg)} / kg`}
            </dd>
          </div>
          <div>
            <ShieldCheck />
            <dt>Billet</dt>
            <dd>
              {t.ticketScan
                ? "Données du billet extraites"
                : "À confirmer avec le voyageur"}
              <small>Confirmez le rendez-vous dans la messagerie.</small>
            </dd>
          </div>
        </dl>
        <button className="primary-button" onClick={onChat}>
          Contacter {t.travelerName}
          <ArrowRight size={18} />
        </button>
        {(t.transportType === "avion" || t.transportType === "bateau") && (
          <button className="outline-button scan-detail" onClick={onScan}>
            <ScanLine size={18} />
            Scanner mon billet d’avion et proposer un trajet
          </button>
        )}
      </div>
    </article>
  );
}
