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

  return (
    <section id="hero" className="relative pt-2 pb-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Main Card with Immersive Gradient & Background */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 p-6 sm:p-10 text-white">
          
          {/* Subtle Background Ambience */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1600&q=80" 
              alt="Voyage et bagages"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-transparent" />
          </div>

          <div className="relative z-10">
            {/* Top Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Ligne Principale Active : <strong>Marseille (MRS) ➔ Alger (ALG)</strong></span>
              </div>

              <button
                onClick={onOpenHowItWorks}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span>Comment ça marche ?</span>
              </button>
            </div>

            {/* Dynamic Title based on Active Pillar */}
            <div className="max-w-3xl mb-6">
              {activePillar === 'voyageur' && (
                <>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Vous voyagez ? <br />
                    <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                      Rentabilisez votre valise en toute simplicité
                    </span>
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300">
                    Indiquez votre départ, votre arrivée, l'espace dans votre valise et choisissez si vous voulez transporter un colis, acheter une marchandise, ou les deux.
                  </p>
                </>
              )}

              {activePillar === 'expediteur' && (
                <>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Besoin d'expédier un colis ? <br />
                    <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent">
                      Confiez-le à un voyageur qui part bientôt
                    </span>
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300">
                    Trouvez un voyageur de confiance faisant le trajet Marseille ➔ Alger pour acheminer vos paquets, documents ou cadeaux rapidement et à prix réduit.
                  </p>
                </>
              )}

              {activePillar === 'destinataire' && (
                <>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Vous souhaitez recevoir une marchandise ? <br />
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent">
                      Faites-vous livrer des articles d'Europe
                    </span>
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300">
                    Parfums Sephora, Nike, produits Apple, Duty Free... Un voyageur achète pour vous en magasin et vous le rapporte en main propre.
                  </p>
                </>
              )}
            </div>

            {/* Notification de succès publication */}
            {publishSuccess && (
              <div className="mb-4 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 flex items-center gap-3 animate-in fade-in duration-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-white">Votre voyage a été publié avec succès !</p>
                  <p className="text-emerald-200/90">Les expéditeurs et personnes intéressées peuvent maintenant vous contacter.</p>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* PILLAR 1: LE FORMULAIRE VOYAGEUR EXPRESS                  */}
            {/* ========================================================= */}
            {activePillar === 'voyageur' && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-slate-900 shadow-xl border border-slate-100">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Plane className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                        Déclarez votre voyage en 30 secondes
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Choisissez votre trajet, votre horaire et vos 2 options de rentabilisation.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full border border-blue-200">
                    Profil Voyageur
                  </span>
                </div>

                <form onSubmit={handlePublishTripSubmit} className="space-y-4">
                  {/* Ligne 1 : Départ & Arrivée */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        Ville de Départ
                      </label>
                      <input 
                        type="text"
                        required
                        value={voyageOrigin}
                        onChange={(e) => setVoyageOrigin(e.target.value)}
                        placeholder="Ex: Marseille (MRS), Paris, Lyon..."
                        className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        Ville d'Arrivée
                      </label>
                      <input 
                        type="text"
                        required
                        value={voyageDestination}
                        onChange={(e) => setVoyageDestination(e.target.value)}
                        placeholder="Ex: Alger (ALG), Oran, Constantine..."
                        className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Ligne 2 : Date, Horaire et Kilos disponibles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Date Jour / Mois / Année */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1 text-cyan-700">
                          <Calendar className="w-3 h-3" />
                          Date de voyage
                        </span>
                        <span className="text-[9px] text-slate-400">Jour/Mois/Année</span>
                      </label>
                      <input 
                        type="date"
                        required
                        value={voyageDate}
                        onChange={(e) => setVoyageDate(e.target.value)}
                        className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                      />
                      <span className="block text-[11px] text-blue-600 font-extrabold mt-0.5">
                        📅 {formatFullDate(voyageDate)}
                      </span>
                    </div>

                    {/* Horaire de départ */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1 text-amber-700">
                        <Clock className="w-3 h-3" />
                        Horaire de Départ
                      </label>
                      <input 
                        type="time"
                        required
                        value={voyageTime}
                        onChange={(e) => setVoyageTime(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none cursor-pointer mt-1"
                      />
                      <span className="block text-[10px] text-slate-500 font-semibold mt-0.5">
                        Départ prévu à {voyageTime}
                      </span>
                    </div>

                    {/* Espace disponible dans la valise (Kilos) */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between mb-1 text-indigo-700">
                        <span className="flex items-center gap-1">
                          <Weight className="w-3 h-3" />
                          Espace dans la valise
                        </span>
                        <span className="text-xs font-black text-blue-600">{voyageKg} kg</span>
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <input 
                          type="range"
                          min="1"
                          max="35"
                          value={voyageKg}
                          onChange={(e) => setVoyageKg(parseInt(e.target.value))}
                          className="w-full accent-blue-600 cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
                        <span>1 kg</span>
                        <span>15 kg</span>
                        <span>35 kg</span>
                      </div>
                    </div>
                  </div>

                  {/* Ligne 3 : LES 2 OPTIONS CLÉS EXIGÉES PAR LE CLIENT */}
                  <div className="p-4 bg-slate-50/80 rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Que souhaitez-vous faire durant ce voyage ?
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">Cochez 1 ou les 2 options</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Option A : Transporter le colis d'un tiers */}
                      <div 
                        onClick={() => setCanCarryParcel(!canCarryParcel)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          canCarryParcel 
                            ? 'bg-blue-50/70 border-blue-600 shadow-xs' 
                            : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input 
                            type="checkbox"
                            checked={canCarryParcel}
                            onChange={(e) => setCanCarryParcel(e.target.checked)}
                            className="w-4 h-4 mt-0.5 accent-blue-600 rounded cursor-pointer"
                          />
                          <div className="flex-1">
                            <span className="font-extrabold text-xs text-slate-900 block">
                              📦 Transporter le colis d'un tiers
                            </span>
                            <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                              J'accepte de prendre des paquets ou documents dans ma valise.
                            </span>

                            {canCarryParcel && (
                              <div className="mt-2.5 pt-2 border-t border-blue-200/80 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                                <span className="text-[10px] font-bold text-slate-600">Mon tarif par kilo :</span>
                                <div className="flex items-center gap-1">
                                  <input 
                                    type="number"
                                    min="5"
                                    max="50"
                                    value={pricePerKg}
                                    onChange={(e) => setPricePerKg(Math.max(1, parseInt(e.target.value) || 0))}
                                    className="w-14 px-2 py-1 text-xs font-black text-center bg-white border border-blue-300 rounded-lg focus:outline-none"
                                  />
                                  <span className="text-xs font-extrabold text-blue-600">€ / kg</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Option B : Acheter une marchandise pour quelqu'un */}
                      <div 
                        onClick={() => setCanBuyProduct(!canBuyProduct)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          canBuyProduct 
                            ? 'bg-emerald-50/70 border-emerald-600 shadow-xs' 
                            : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input 
                            type="checkbox"
                            checked={canBuyProduct}
                            onChange={(e) => setCanBuyProduct(e.target.checked)}
                            className="w-4 h-4 mt-0.5 accent-emerald-600 rounded cursor-pointer"
                          />
                          <div className="flex-1">
                            <span className="font-extrabold text-xs text-slate-900 block">
                              🛍️ Acheter une marchandise pour quelqu'un
                            </span>
                            <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                              J'achète en magasin ou Duty Free et je livre à l'arrivée.
                            </span>

                            {canBuyProduct && (
                              <div className="mt-2.5 pt-2 border-t border-emerald-200/80 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                                <span className="text-[10px] font-bold text-slate-600">Ma commission souhaitée :</span>
                                <div className="flex items-center gap-1">
                                  <input 
                                    type="number"
                                    min="10"
                                    max="200"
                                    value={shoppingCommission}
                                    onChange={(e) => setShoppingCommission(Math.max(1, parseInt(e.target.value) || 0))}
                                    className="w-14 px-2 py-1 text-xs font-black text-center bg-white border border-emerald-300 rounded-lg focus:outline-none"
                                  />
                                  <span className="text-xs font-extrabold text-emerald-600">€</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bouton de Publication Unique */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Fonds garantis sous séquestre Stripe & remise sécurisée.</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Publier mon voyage en 30 secondes</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ========================================================= */}
            {/* PILLAR 2: RECHERCHE & DÉPÔT EXPÉDITEUR                     */}
            {/* ========================================================= */}
            {activePillar === 'expediteur' && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-slate-900 shadow-xl border border-slate-100 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                        Trouver un voyageur pour acheminer votre colis
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Voyageurs vérifiés partant de Marseille vers Alger, Oran et le Maghreb.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onOpenPublishParcel}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Déposer un colis</span>
                  </button>
                </div>

                <form onSubmit={handleSenderSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      Ville de Départ
                    </label>
                    <input 
                      type="text"
                      value={senderOrigin}
                      onChange={(e) => setSenderOrigin(e.target.value)}
                      placeholder="Marseille"
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      Ville d'Arrivée
                    </label>
                    <input 
                      type="text"
                      value={senderDestination}
                      onChange={(e) => setSenderDestination(e.target.value)}
                      placeholder="Alger"
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center">
                    <button
                      type="submit"
                      className="w-full h-full min-h-[50px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md"
                    >
                      <Search className="w-4 h-4 text-amber-400" />
                      <span>Trouver les voyageurs disponibles</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ========================================================= */}
            {/* PILLAR 3: RECHERCHE & DEMANDE RECEVEUR / ACHETEUR          */}
            {/* ========================================================= */}
            {activePillar === 'destinataire' && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 text-slate-900 shadow-xl border border-slate-100 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                        La Boutique Inversée & Achats d'Europe
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Commandez un article officiel et un voyageur vous l'achète et vous le rapporte.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onOpenPublishProduct}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Demander un article</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      Votre Ville de Réception
                    </label>
                    <input 
                      type="text"
                      value={receiverCity}
                      onChange={(e) => setReceiverCity(e.target.value)}
                      placeholder="Alger, Oran..."
                      className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                        <Search className="w-3 h-3 text-blue-600" />
                        Article recherché
                      </label>
                      <input 
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Parfums, iPhone, Sneakers Nike, Duty Free..."
                        className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const offres = document.getElementById('section-resultats');
                        if (offres) offres.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shrink-0"
                    >
                      Explorer le catalogue
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
