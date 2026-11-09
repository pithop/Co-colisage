import React, { useState } from 'react';
import {
  Calendar,
  Car,
  Check,
  ChevronRight,
  Clock,
  Euro,
  MapPin,
  Package,
  Plane,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Zap,
} from 'lucide-react';
import { Trip, PurchaseRequest } from '../../data/marketplace';
import { useAuth } from '../../context/AuthContext';
import { ParcelVisualizer } from '../marketplace/ParcelVisualizer';

export interface BagAndGoPlatformProps {
  trips: Trip[];
  requests: PurchaseRequest[];
  onTrip?: (trip: Trip) => void;
  onRequest?: (request: PurchaseRequest) => void;
  onPublishParcel?: () => void;
  onPublishRequest?: () => void;
  onTracking?: () => void;
  onAddRequest?: (request: PurchaseRequest) => void;
}

export const BagAndGoPlatform: React.FC<BagAndGoPlatformProps> = ({
  trips: _trips,
  requests,
  onTrip: _onTrip,
  onRequest,
  onPublishParcel: _onPublishParcel,
  onPublishRequest: _onPublishRequest,
  onTracking,
  onAddRequest,
}) => {
  const { user } = useAuth();

  // Form states matching Client Mockup 2
  const [category, setCategory] = useState('Pharmacie');
  const [dimensions, setDimensions] = useState('30 x 20 x 15');
  const [weightKg, setWeightKg] = useState('1.5');
  const [urgency, setUrgency] = useState('Normal');
  const [proposedPrice, setProposedPrice] = useState('50');
  const [destination, setDestination] = useState('Paris, France');
  const [departureCity, setDepartureCity] = useState('Alger');
  const [recipient, setRecipient] = useState('');
  const [canTravel, setCanTravel] = useState(true);
  const [showVisualizer, setShowVisualizer] = useState(true);

  // Success notification
  const [publishedNotice, setPublishedNotice] = useState(false);

  // Filter parcel requests
  const parcelRequests = requests.filter((r) => r.kind === 'parcel');

  // Handle direct publication
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(proposedPrice) || 50;
    const weightNum = parseFloat(weightKg) || 1.5;

    const newRequest: PurchaseRequest = {
      id: `req-parcel-${Date.now()}`,
      title: `Colis ${category} (${weightNum} kg)`,
      origin: departureCity,
      destination: destination || 'Paris, France',
      date: new Date().toISOString().slice(0, 10),
      budget: priceNum,
      reward: Math.round(priceNum * 0.7),
      image: '/images/parcel.svg',
      buyer: user?.name || recipient || 'Expéditeur vérifié',
      specifications: `Dimensions: ${dimensions} cm · Poids: ${weightNum} kg · Urgence: ${urgency} · Se déplace: ${canTravel ? 'Oui' : 'Non'}`,
      location: destination || 'Paris, France',
      kind: 'parcel',
      status: 'available',
      flexibility: urgency === 'Très urgent' ? 'urgent' : 'week',
      declaredValue: priceNum,
      declaredCurrency: 'EUR',
      recipientName: recipient || undefined,
    };

    if (onAddRequest) {
      onAddRequest(newRequest);
    } else if (onRequest) {
      onRequest(newRequest);
    }

    setPublishedNotice(true);
    setTimeout(() => setPublishedNotice(false), 4000);
  };

  return (
    <div className="bagandgo-platform-container max-w-5xl mx-auto px-4 py-3 space-y-6 pb-36 text-left">
      {/* 1. Hero Photographic Banner matching Client Mockup 2 */}
      <section className="relative overflow-hidden rounded-[28px] bg-[#072a4a] text-white shadow-xl border border-cyan-500/25">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: "url('/images/hero-airport-traveler.jpg')" }}
        />
        {/* Dark oceanic gradient overlay for high contrast and visible jet */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#072a4a]/95 via-[#072a4a]/85 to-[#072a4a]/40 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#072a4a]/90 via-transparent to-black/20" />

        <div className="relative p-5 sm:p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 text-cyan-200 text-xs font-semibold">
              <Package size={13} className="text-cyan-300" />
              <span>Bag &amp; Go · Espace Expéditeur de Colis</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
              Publiez votre demande d'envoi de colis
            </h1>

            <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed font-medium max-w-lg drop-shadow-sm">
              Trouvez un voyageur fiable pour transporter votre colis en toute sécurité. Remise par code PIN et séquestre bancaire Stripe.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-cyan-200">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <ShieldCheck size={14} className="text-cyan-300" />
                <span>Séquestre Stripe</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Sparkles size={14} className="text-cyan-300" />
                <span>PIN secret</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Check size={14} className="text-cyan-300" />
                <span>Profils certifiés</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center p-5 rounded-2xl bg-[#062c47]/80 backdrop-blur-md border border-cyan-400/30 text-center shadow-xl">
            <div className="w-16 h-16 rounded-full bg-cyan-400/20 flex items-center justify-center mb-2">
              <Package size={32} className="text-cyan-300 animate-bounce" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide uppercase">Colisage Sécurisé</span>
            <span className="text-[10px] text-cyan-200 mt-0.5">Envois transfrontaliers certifiés</span>
          </div>
        </div>
      </section>

      {/* Confirmation Toast */}
      {publishedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300">
          <Check size={18} strokeWidth={3} />
          <span>Votre demande de colis a été publiée avec succès et transmise aux voyageurs disponibles !</span>
        </div>
      )}

      {/* Interactive Parcel Visualizer Animation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#072a4a] dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#00bcd4]" />
            Animation &amp; Gabarit du Colis
          </span>
          <button
            type="button"
            onClick={() => setShowVisualizer(!showVisualizer)}
            className="text-xs font-bold text-[#00838f] dark:text-cyan-400 hover:underline"
          >
            {showVisualizer ? "Masquer le simulateur" : "Afficher le simulateur"}
          </button>
        </div>
        {showVisualizer && (
          <ParcelVisualizer
            initialWeight={parseFloat(weightKg) || 1.5}
            initialCategory={category}
            onWeightChange={(newKg) => {
              setWeightKg(String(newKg));
              setProposedPrice(String(Math.round(15 + newKg * 12)));
            }}
          />
        )}
      </div>

      {/* 2. Interactive Multi-Block Form matching Client Mockup 2 (4 Distinct Gradient-Header Blocks) */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Block 1: Informations du colis */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-sm">
          {/* Client signature Teal/Cyan Gradient Ribbon Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#00838f] via-[#0097a7] to-[#00bcd4] text-white flex items-center gap-2.5 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Package size={14} />
            </span>
            <span>Informations du colis</span>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none cursor-pointer focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="Pharmacie">Pharmacie &amp; Médical</option>
                <option value="High-Tech">High-Tech &amp; Électronique</option>
                <option value="Textile">Textile &amp; Vêtements</option>
                <option value="Documents">Documents &amp; Papiers</option>
                <option value="Cosmétiques">Cosmétiques &amp; Parfums</option>
                <option value="Alimentation">Alimentation &amp; Terroir</option>
                <option value="Autre">Autre marchandise</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Taille (cm)
              </label>
              <select
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none cursor-pointer focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="30 x 20 x 15">30 x 20 x 15 (Petit format)</option>
                <option value="40 x 30 x 20">40 x 30 x 20 (Moyen format)</option>
                <option value="55 x 40 x 23">55 x 40 x 23 (Format valise cabine)</option>
                <option value="Format enveloppe">Format enveloppe A4</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Poids (kg)
              </label>
              <select
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none cursor-pointer focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="0.5">0.5 kg</option>
                <option value="1.0">1.0 kg</option>
                <option value="1.5">1.5 kg</option>
                <option value="2.0">2.0 kg</option>
                <option value="3.0">3.0 kg</option>
                <option value="5.0">5.0 kg</option>
                <option value="10.0">10.0 kg</option>
              </select>
            </div>
          </div>
        </div>

        {/* Block 2: Urgence & Délai */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#00838f] via-[#0097a7] to-[#00bcd4] text-white flex items-center gap-2.5 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Zap size={14} />
            </span>
            <span>Urgence &amp; Délai</span>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Délai de livraison
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none cursor-pointer focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="Normal">Normal (sous 3 à 5 jours)</option>
                <option value="Urgent">Urgent (sous 48h)</option>
                <option value="Très urgent">Très urgent (sous 24h)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Prix proposé
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 font-bold text-sm">€</span>
                <input
                  type="number"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  placeholder="Ex : 50 €"
                  min="5"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Block 3: Destination */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#00838f] via-[#0097a7] to-[#00bcd4] text-white flex items-center gap-2.5 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
              <MapPin size={14} />
            </span>
            <span>Destination</span>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Ville de départ
              </label>
              <input
                type="text"
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                placeholder="Ex : Alger, Oran..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Lieu de destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ville ou adresse"
                required
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Destinataire (optionnel)
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Nom ou numéro de téléphone du destinataire"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          </div>
        </div>

        {/* Block 4: Option déplacement */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#00838f] via-[#0097a7] to-[#00bcd4] text-white flex items-center gap-2.5 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Car size={14} />
            </span>
            <span>Option déplacement</span>
          </div>

          <div className="p-5 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-sm text-[#072a4a] dark:text-white block">
                Accepter de se déplacer ?
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Vous pouvez convenir d'un point de rendez-vous avec le voyageur à proximité de l'aéroport ou du port.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
              <input
                type="checkbox"
                checked={canTravel}
                onChange={(e) => setCanTravel(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00bcd4]" />
            </label>
          </div>
        </div>

        {/* 3. Oceanic Cyan Gradient Pill CTA Button matching Client Mockup 2 */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#00a2c7] hover:to-[#00669e] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <Send size={18} strokeWidth={2.4} />
          <span>Publier ma demande</span>
        </button>
      </form>

      {/* 4. Section "Mes demandes récentes" with Vertical Cyan Indicator */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#072a4a] dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#00bcd4] rounded-full inline-block" />
            <span>Mes demandes récentes</span>
            {parcelRequests.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-[#00838f] dark:text-cyan-300">
                {parcelRequests.length}
              </span>
            )}
          </h2>

          {onTracking && (
            <button
              type="button"
              onClick={onTracking}
              className="text-xs font-bold text-[#00838f] dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {parcelRequests.length > 0 ? (
          <div className="grid grid-cols-1 gap-3.5">
            {parcelRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => onRequest?.(req)}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200/60 dark:border-cyan-800/60 text-[#00838f] dark:text-cyan-300 flex items-center justify-center shrink-0">
                    <Package size={22} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-[#00838f] dark:text-cyan-300 px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/40">
                        {req.title}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        • {req.flexibility === 'urgent' ? 'Urgent' : 'Normal'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      <span>{req.origin}</span>
                      <span className="text-slate-400">→</span>
                      <span>{req.destination}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-[#00838f] dark:text-cyan-400">{req.budget} €</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <User size={12} className="text-slate-400" />
                      <span>{req.buyer}</span>
                      <span>•</span>
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span>4.9 (87 avis)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60">
                    <Clock size={13} />
                    <span>En attente</span>
                  </span>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Virgin Clean State */
          <div className="p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-[#00838f] dark:text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
              <Package size={26} />
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Aucune demande d'envoi pour le moment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Remplissez les informations ci-dessus et cliquez sur « Publier ma demande » pour trouver un voyageur certifié.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
