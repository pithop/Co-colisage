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
        <span>Photo d’illustration</span>
      </div>
      <div className="detail-content">
        <span className="purchase-badge">À acheter et livrer</span>
        <h1>{r.title}</h1>
        <button className="buyer-row" onClick={() => onChat(false)}>
          <Avatar name={r.buyer} src={r.buyerAvatar} />
          <span>
            <strong>{r.buyer}</strong>
            <small>Demande publiée par</small>
          </span>
          {r.buyerAvatar && (
            <span className="verified-badge">
              <ShieldCheck size={14} /> Profil vérifié · démo
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
            <dt>Budget article</dt>
            <dd>{euro(r.budget)} maximum</dd>
          </div>
          <div>
            <Euro />
            <dt>Rémunération du service</dt>
            <dd>{euro(r.reward)}</dd>
          </div>
        </dl>
        <p className="info-box">
          <ShieldCheck size={20} />
          <span>
            <strong>Un échange en toute confiance</strong>
            <br />
            Confirmez la disponibilité avec {r.buyer} avant l’achat.
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
            Proposer d’acheter et livrer
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
