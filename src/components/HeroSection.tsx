import React, { useState } from 'react';
import { 
  Plane, 
  Package, 
  ShoppingBag, 
  MapPin, 
  Calendar, 
  Clock, 
  Weight, 
  Check, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Search,
  PlusCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { MainPillar, FreightItem } from '../types';
import { useAuth } from '../context/AuthContext';
import './HeroSection.css';

interface HeroSectionProps {
  activePillar: MainPillar;
  onSelectPillar: (pillar: MainPillar) => void;
  onPublishTrip: (trip: FreightItem) => void;
  onSearchTrips: (origin: string, destination: string) => void;
  onOpenPublishParcel: () => void;
  onOpenPublishProduct: () => void;
  onOpenHowItWorks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activePillar,
  onSelectPillar,
  onPublishTrip,
  onSearchTrips,
  onOpenPublishParcel,
  onOpenPublishProduct,
  onOpenHowItWorks
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // --- State for VOYAGEUR form (Spécifié mot pour mot par le client) ---
  const [voyageOrigin, setVoyageOrigin] = useState('Marseille (MRS)');
  const [voyageDestination, setVoyageDestination] = useState('Alger (ALG)');
  const [voyageDate, setVoyageDate] = useState('2026-09-28');
  const [voyageTime, setVoyageTime] = useState('08:30');
  const [voyageKg, setVoyageKg] = useState(15);
  
  // Les 2 options clés demandées par le client :
  const [canCarryParcel, setCanCarryParcel] = useState(true);
  const [pricePerKg, setPricePerKg] = useState(10); // Tarif au kilo
  const [canBuyProduct, setCanBuyProduct] = useState(true);
  const [shoppingCommission, setShoppingCommission] = useState(25); // Commission pour achat
  
  const [publishSuccess, setPublishSuccess] = useState(false);

  // --- State for EXPÉDITEUR search ---
  const [senderOrigin, setSenderOrigin] = useState('Marseille');
  const [senderDestination, setSenderDestination] = useState('Alger');

  // --- State for DESTINATAIRE search ---
  const [receiverCity, setReceiverCity] = useState('Alger');
  const [productSearch, setProductSearch] = useState('');

  // Date helper format
  const formatFullDate = (isoStr: string) => {
    if (!isoStr) return '';
    try {
      const [y, m, d] = isoStr.split('-');
      const dt = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      return dt.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  // Submit trip by traveler
  const handlePublishTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canCarryParcel && !canBuyProduct) {
      alert("Veuillez cocher au moins une des 2 options : transporter un colis ou acheter une marchandise.");
      return;
    }

    const newTrip: FreightItem = {
      id: `trip-${Date.now()}`,
      title: `Trajet ${voyageOrigin} ➔ ${voyageDestination}`,
      transportType: 'avion',
      transportLabel: 'Vol / Traversée',
      origin: voyageOrigin,
      originCode: voyageOrigin.includes('(') ? voyageOrigin.split('(')[1].replace(')', '') : 'MRS',
      destination: voyageDestination,
      destinationCode: voyageDestination.includes('(') ? voyageDestination.split('(')[1].replace(')', '') : 'ALG',
      pricePerKg: canCarryParcel ? pricePerKg : 0,
      availableKg: voyageKg,
      departureDate: formatFullDate(voyageDate),
      departureTime: voyageTime,
      canCarryParcel,
      canBuyProduct,
      shoppingCommission: canBuyProduct ? shoppingCommission : 0,
      travelerName: user?.name || 'Karim Bouzid',
      travelerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      reviewsCount: 1,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
      description: `Départ prévu le ${formatFullDate(voyageDate)} à ${voyageTime}. Espace valise : ${voyageKg} kg. ` +
        (canCarryParcel ? `Prêt pour transport colis (${pricePerKg}€/kg). ` : '') +
        (canBuyProduct ? `Prêt pour achats Duty Free / Magasins (comm: ${shoppingCommission}€).` : ''),
      remainingMinutes: 60
    };

    onPublishTrip(newTrip);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 5000);

    const offresSection = document.getElementById('section-resultats');
    if (offresSection) {
      offresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSenderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchTrips(senderOrigin, senderDestination);
    const offresSection = document.getElementById('section-resultats');
    if (offresSection) {
      offresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cities = [
    { name: 'Marseille', value: 'Marseille (MRS)' },
    { name: 'Alger', value: 'Alger (ALG)' },
    { name: 'Oran', value: 'Oran (ORN)' }
  ];

  return (
    <section id="hero" className="premium-hero" aria-label="Voyages et livraisons entre particuliers">
      <div className="hero-shell">
        <div className="hero-ambient" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-authority">
            <span><span className="hero-star">★</span> <strong>4.9/5</strong> sur +14 000 trajets</span>
            <span className="hero-featured"><span className="hero-live-dot" /> Ligne phare : Marseille (MRS) ➔ Alger (ALG)</span>
            <span><ShieldCheck size={14} /> Séquestre Stripe 100% Garanti</span>
          </div>

          <div className="hero-intro">
            <div>
              <div className="hero-eyebrow"><span /> PLUS PROCHE, MÊME À DES MILLIERS DE KILOMÈTRES</div>
              <h1>
                {activePillar === 'voyageur' && <>Votre voyage.<br /><span>Bien plus qu’un trajet.</span></>}
                {activePillar === 'expediteur' && <>Un colis à envoyer.<br /><span>Un lien à préserver.</span></>}
                {activePillar === 'destinataire' && <>Vos envies d’ailleurs.<br /><span>À portée de main.</span></>}
              </h1>
              <p className="hero-description">
                {activePillar === 'voyageur' && 'Rentabilisez votre valise. Transportez un colis, faites un achat pour quelqu’un, ou les deux. Vous choisissez.'}
                {activePillar === 'expediteur' && 'Documents, cadeaux, petites attentions. Confiez votre colis à un voyageur qui prend la même direction.'}
                {activePillar === 'destinataire' && 'Un parfum, une paire de sneakers, un article introuvable. Un voyageur l’achète en Europe et vous le remet en main propre.'}
              </p>
              <button type="button" className="hero-how" onClick={onOpenHowItWorks}><HelpCircle size={16} /> Comment ça marche ? <ArrowRight size={14} /></button>
            </div>
            <div className="hero-route" aria-hidden="true">
              <div className="hero-route-top"><span>LA MÉDITERRANÉE NOUS RELIE</span><Plane size={16} /></div>
              <div className="hero-route-cities"><div><strong>MRS</strong><span>Marseille</span></div><div className="hero-flight-line"><span /><Plane size={22} /><span /></div><div><strong>ALG</strong><span>Alger</span></div></div>
              <div className="hero-route-bottom"><span>Un voyage. Deux rives.</span><span><ShieldCheck size={13} /> En confiance</span></div>
            </div>
          </div>

          {publishSuccess && (
            <div className="hero-success" role="status"><CheckCircle2 size={22} /><div><strong>Votre voyage a été publié avec succès !</strong><p>Les expéditeurs et personnes intéressées peuvent maintenant vous contacter.</p></div></div>
          )}

          <div className="hero-glass">
            <div className="hero-form-card">
              <div className="hero-card-heading">
                <div className="hero-heading-group"><div className={`hero-heading-icon ${activePillar}`}>
                  {activePillar === 'voyageur' ? <Plane size={22} /> : activePillar === 'expediteur' ? <Package size={22} /> : <ShoppingBag size={22} />}
                </div><div><h2>{activePillar === 'voyageur' ? 'Votre prochain départ' : activePillar === 'expediteur' ? 'Votre colis prend le large' : 'L’Europe dans votre panier'}</h2><p>{activePillar === 'voyageur' ? 'Un peu de place. De belles possibilités.' : activePillar === 'expediteur' ? 'Trouvez le voyageur qui fait le bon trajet.' : 'Dites-nous ce qui vous ferait plaisir.'}</p></div></div>
                <span className="hero-time-badge"><Sparkles size={14} /> {activePillar === 'voyageur' ? 'FORMULAIRE EXPRESS · 30 S' : 'SIMPLE & SÉCURISÉ'}</span>
              </div>

              {activePillar === 'voyageur' && (
                <form onSubmit={handlePublishTripSubmit} className="hero-trip-form">
                  <div className="hero-section-label"><span>01</span> Votre itinéraire</div>
                  <div className="hero-city-grid">
                    <div className="hero-field"><label htmlFor="voyage-origin"><MapPin size={15} /> VILLE DE DÉPART</label><input id="voyage-origin" required value={voyageOrigin} onChange={e => setVoyageOrigin(e.target.value)} placeholder="Ville ou aéroport" /><div className="hero-suggestions">{cities.map(city => <button key={city.name} type="button" onClick={() => setVoyageOrigin(city.value)}>{city.name}</button>)}</div></div>
                    <button type="button" className="hero-swap" aria-label="Inverser les villes de départ et d’arrivée" onClick={() => { setVoyageOrigin(voyageDestination); setVoyageDestination(voyageOrigin); }}>⇄</button>
                    <div className="hero-field"><label htmlFor="voyage-destination"><MapPin size={15} /> VILLE D’ARRIVÉE</label><input id="voyage-destination" required value={voyageDestination} onChange={e => setVoyageDestination(e.target.value)} placeholder="Ville ou aéroport" /><div className="hero-suggestions">{cities.map(city => <button key={city.name} type="button" onClick={() => setVoyageDestination(city.value)}>{city.name}</button>)}</div></div>
                  </div>
                  <div className="hero-schedule-grid">
                    <div className="hero-field"><label htmlFor="voyage-date"><Calendar size={15} /> DATE DU VOYAGE</label><input id="voyage-date" type="date" required value={voyageDate} onChange={e => setVoyageDate(e.target.value)} /><span className="hero-field-note">{formatFullDate(voyageDate)}</span></div>
                    <div className="hero-field"><label htmlFor="voyage-time"><Clock size={15} /> HEURE DE DÉPART</label><input id="voyage-time" type="time" required value={voyageTime} onChange={e => setVoyageTime(e.target.value)} /><span className="hero-field-note">Départ prévu à {voyageTime}</span></div>
                    <div className="hero-field hero-capacity"><div className="hero-capacity-heading"><label htmlFor="voyage-kg"><Weight size={15} /> PLACE DISPONIBLE</label><output htmlFor="voyage-kg">{voyageKg}<small> kg</small></output></div><div className="hero-capacity-bars" aria-hidden="true">{Array.from({ length: 20 }, (_, index) => <span key={index} className={index < Math.ceil(voyageKg / 35 * 20) ? 'is-filled' : ''} />)}</div><input id="voyage-kg" type="range" min="1" max="35" value={voyageKg} aria-valuetext={`${voyageKg} kilos disponibles`} onChange={e => setVoyageKg(parseInt(e.target.value))} style={{ '--range-progress': `${(voyageKg - 1) / 34 * 100}%` } as React.CSSProperties} /><div className="hero-range-labels"><span>1 kg · Léger</span><span>35 kg · Généreux</span></div></div>
                  </div>
                  <div className="hero-section-label hero-service-label"><div><span>02</span> Rentabilisez votre voyage</div><small>Une option, ou les deux.</small></div>
                  <div className="hero-services">
                    <div className={`hero-service hero-service-blue ${canCarryParcel ? 'is-selected' : ''}`}>
                      <label className="hero-service-select"><span className="hero-service-icon"><Package size={22} /></span><span className="hero-service-copy"><strong>Transporter le colis d’un tiers</strong><span>Un peu de place pour un colis ou des documents.</span></span><input type="checkbox" checked={canCarryParcel} onChange={e => setCanCarryParcel(e.target.checked)} /><span className="hero-toggle" aria-hidden="true"><span>{canCarryParcel && <Check size={10} />}</span></span></label>
                      {canCarryParcel && <div className="hero-service-price"><label htmlFor="price-per-kg">Votre tarif au kilo</label><div><input id="price-per-kg" type="number" min="5" max="50" value={pricePerKg} onChange={e => setPricePerKg(Math.max(1, parseInt(e.target.value) || 0))} /><span>€ / kg</span></div></div>}
                    </div>
                    <div className={`hero-service hero-service-green ${canBuyProduct ? 'is-selected' : ''}`}>
                      <label className="hero-service-select"><span className="hero-service-icon"><ShoppingBag size={22} /></span><span className="hero-service-copy"><strong>Acheter une marchandise</strong><span>Un achat en magasin ou au Duty Free, livré à l’arrivée.</span></span><input type="checkbox" checked={canBuyProduct} onChange={e => setCanBuyProduct(e.target.checked)} /><span className="hero-toggle" aria-hidden="true"><span>{canBuyProduct && <Check size={10} />}</span></span></label>
                      {canBuyProduct && <div className="hero-service-price"><label htmlFor="shopping-commission">Votre commission par achat</label><div><input id="shopping-commission" type="number" min="10" max="200" value={shoppingCommission} onChange={e => setShoppingCommission(Math.max(1, parseInt(e.target.value) || 0))} /><span>€</span></div></div>}
                    </div>
                  </div>
                  <div className="hero-form-footer"><div className="hero-security"><ShieldCheck size={21} /><span><strong>Voyagez l’esprit tranquille</strong><span>Fonds sous séquestre Stripe & remise sécurisée.</span></span></div><button type="submit" className="hero-cta"><span>Publier mon voyage en 30 secondes</span><ArrowRight size={18} /></button></div>
                </form>
              )}

              {activePillar === 'expediteur' && (
                <div className="hero-secondary-panel">
                  <form onSubmit={handleSenderSearch} className="hero-search-grid">
                    <div className="hero-field"><label htmlFor="sender-origin"><MapPin size={15} /> VILLE DE DÉPART</label><input id="sender-origin" value={senderOrigin} onChange={e => setSenderOrigin(e.target.value)} placeholder="Marseille" /></div>
                    <div className="hero-field"><label htmlFor="sender-destination"><MapPin size={15} /> VILLE D’ARRIVÉE</label><input id="sender-destination" value={senderDestination} onChange={e => setSenderDestination(e.target.value)} placeholder="Alger" /></div>
                    <button type="submit" className="hero-cta"><Search size={18} /><span>Trouver les voyageurs disponibles</span></button>
                  </form>
                  <div className="hero-secondary-footer"><div className="hero-security"><ShieldCheck size={22} /><span><strong>Un trajet partagé, une remise en confiance.</strong><span>Marseille, Alger, Oran et le Maghreb.</span></span></div><button type="button" className="hero-outline-button" onClick={onOpenPublishParcel}><PlusCircle size={17} /> Déposer un colis <ArrowRight size={16} /></button></div>
                </div>
              )}

              {activePillar === 'destinataire' && (
                <div className="hero-secondary-panel">
                  <div className="hero-search-grid hero-receiver-grid">
                    <div className="hero-field"><label htmlFor="receiver-city"><MapPin size={15} /> VILLE DE RÉCEPTION</label><input id="receiver-city" value={receiverCity} onChange={e => setReceiverCity(e.target.value)} placeholder="Alger, Oran…" /></div>
                    <div className="hero-field"><label htmlFor="product-search"><ShoppingBag size={15} /> VOTRE PROCHAINE ENVIE</label><input id="product-search" value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Parfum, iPhone, sneakers…" /></div>
                    <button type="button" className="hero-cta hero-cta-green" onClick={() => { const offres = document.getElementById('section-resultats'); if (offres) offres.scrollIntoView({ behavior: 'smooth' }); }}><Search size={18} /><span>Explorer le catalogue</span></button>
                  </div>
                  <div className="hero-secondary-footer"><div className="hero-security"><ShoppingBag size={22} /><span><strong>La boutique inversée, pensée pour vous.</strong><span>Un voyageur achète votre article et vous le rapporte.</span></span></div><button type="button" className="hero-outline-button" onClick={onOpenPublishProduct}><PlusCircle size={17} /> Demander un article <ArrowRight size={16} /></button></div>
                </div>
              )}
            </div>
          </div>
          <div className="hero-bottom-note"><ShieldCheck size={13} /> Des kilomètres en commun. La confiance en plus.</div>
        </div>
      </div>
    </section>
  );
};
