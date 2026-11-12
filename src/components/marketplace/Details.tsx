import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Euro,
  ExternalLink,
  Info,
  MapPin,
  Package,
  Scale,
  ScanLine,
  ShieldCheck,
  Star,
  UserCheck,
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
        <div className="verified-status-pill"><ShieldCheck size={14} aria-hidden="true" /> <span>Annonce vérifiée · Membre certifié BagVoyage</span></div>
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
          <section className="request-extra" aria-label="Spécifications détaillées du colis">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Spécifications de l'envoi
            </h2>
            <div className="parcel-specs-grid">
              <div className="parcel-spec-card">
                <MapPin size={17} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <span className="spec-label">Prise en charge</span>
                  <strong className="spec-val">{r.pickupLocation}</strong>
                </div>
              </div>
              <div className="parcel-spec-card">
                <Scale size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="spec-label">Poids & Dimensions</span>
                  <strong className="spec-val">
                    {r.weightKg} kg · {r.dimensions?.length || 25}×{r.dimensions?.width || 20}×{r.dimensions?.height || 10} cm
                  </strong>
                </div>
              </div>
              <div className="parcel-spec-card">
                <Clock3 size={17} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <span className="spec-label">Flexibilité</span>
                  <strong className="spec-val">
                    {r.flexibility === "urgent" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20">
                        Urgent (24h-48h)
                      </span>
                    ) : r.flexibility === "week" ? (
                      "Cette semaine"
                    ) : (
                      "Date limite précise"
                    )}
                  </strong>
                </div>
              </div>
              <div className="parcel-spec-card">
                <ShieldCheck size={17} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <span className="spec-label">Valeur déclarée</span>
                  <strong className="spec-val">
                    {r.declaredValue?.toLocaleString("fr-FR")} {r.declaredCurrency || "EUR"}
                  </strong>
                </div>
              </div>
            </div>
            {r.recipientName && (
              <div className="recipient-trust-card">
                <UserCheck size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span>
                  Destinataire vérifié avant remise : <strong className="text-slate-900 dark:text-white">{r.recipientName}</strong>
                </span>
              </div>
            )}
            {!!r.photos?.length && (
              <div className="request-photos-box mt-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Photos officielles du colis ({r.photos.length})
                </span>
                <div className="request-photos">
                  {r.photos.map((photo) => (
                    <img key={photo.id} src={photo.data} alt={photo.name} className="request-photo-thumb" />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
        {!!r.items?.length && (
          <section className="request-extra" aria-label="Liste des articles à acheter">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Liste d’achats Duty-Free · {r.items.length} article{r.items.length > 1 ? "s" : ""}
            </h2>
            <div className="shopping-items-grid">
              {r.items.map((item) => (
                <article key={item.id} className="shopping-item-card">
                  {item.photo && <img src={item.photo.data} alt={item.name} className="shopping-item-img" />}
                  <div className="shopping-item-info">
                    <div className="shopping-item-header">
                      <h4>{item.name}</h4>
                      <span className="shopping-item-price">{euro(item.price)}</span>
                    </div>
                    <p className="shopping-item-spec">{item.specifications}</p>
                    {/^https?:\/\//.test(item.url) && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="shopping-item-link">
                        <span>Voir l’article en boutique</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
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
        <div className="trip-banner-content">
          <span className="trip-vehicle-pill">
            {vehicleLabel(t)} · {t.transportLabel}
          </span>
          <h1>
            {t.origin} <ArrowRight size={24} className="shrink-0 text-blue-300" aria-hidden="true" /> {t.destination}
          </h1>
          <p>
            <CalendarDays size={18} aria-hidden="true" />
            {dateLabel(t.departureDate, true)} · Départ{" "}
            {timeLabel(t.departureTime)}
          </p>
        </div>
        {t.image && (
          <img
            className="trip-hero-vehicle"
            src={t.image}
            alt={vehicleLabel(t)}
          />
        )}
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
        <div className="verified-status-pill"><ShieldCheck size={14} aria-hidden="true" /> <span>Profil vérifié · Pièce d’identité et vol confirmés</span></div>
        {!!t.reviews?.length && <section className="traveler-reviews" aria-label="Avis sur ce voyageur">
          <h2>Retours sur les remises</h2>
          <p className="verified-reviews-notice"><CheckCircle2 size={13} aria-hidden="true" /> Avis certifiés suite à livraison sous séquestre</p>
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
      </div>
      <div className="detail-actions">
        <div className="action-reward">
          <span>Participation demandée</span>
          <strong>
            {t.startingPrice
              ? `À partir de ${euro(t.startingPrice)}`
              : `${euro(t.pricePerKg)} / kg`}
          </strong>
        </div>
        <div className="detail-action-buttons">
          <button className="primary-button" onClick={onChat}>
            Contacter {t.travelerName}
            <ArrowRight size={18} />
          </button>
          {(t.transportType === "avion" || t.transportType === "bateau") && (
            <button className="outline-button scan-detail" onClick={onScan}>
              <ScanLine size={18} />
              Scanner mon billet
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
