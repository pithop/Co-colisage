import React, { useState, useId } from 'react';
import {
  AlertTriangle,
  BatteryCharging,
  Box,
  Calendar,
  Camera,
  Car,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Euro,
  FileText,
  HelpCircle,
  Home,
  Info,
  MapPin,
  Maximize2,
  Package,
  Plane,
  Plus,
  Scale,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Upload,
  User,
  Zap,
  ArrowLeftRight,
  ArrowRight,
} from 'lucide-react';
import { Trip, PurchaseRequest } from '../../data/marketplace';
import { useAuth } from '../../context/AuthContext';
import { ParcelVisualizer } from '../marketplace/ParcelVisualizer';
import { CityAutocomplete } from '../common/CityAutocomplete';

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

interface PresetFormat {
  id: string;
  name: string;
  desc: string;
  length: number;
  width: number;
  height: number;
  defaultKg: number;
  recommendedPrice: number;
}

const PRESET_FORMATS: PresetFormat[] = [
  {
    id: 'enveloppe',
    name: 'Enveloppe A4',
    desc: 'Documents, passeports, plis urgents',
    length: 32,
    width: 23,
    height: 3,
    defaultKg: 0.4,
    recommendedPrice: 20,
  },
  {
    id: 'chaussures',
    name: 'Boîte à chaussures',
    desc: 'Sneakers, flacons, cosmétiques, high-tech',
    length: 35,
    width: 25,
    height: 14,
    defaultKg: 1.8,
    recommendedPrice: 35,
  },
  {
    id: 'standard',
    name: 'Carton standard',
    desc: 'Vêtements, coffrets, cadeaux, souvenirs',
    length: 40,
    width: 30,
    height: 20,
    defaultKg: 3.5,
    recommendedPrice: 50,
  },
  {
    id: 'cabine',
    name: 'Format Valise cabine',
    desc: 'Bagage cabine plein, textiles denses',
    length: 55,
    width: 40,
    height: 23,
    defaultKg: 8.0,
    recommendedPrice: 90,
  },
  {
    id: 'grand',
    name: 'Grand carton XL',
    desc: 'Gros volume, matériel ménager, artisanat',
    length: 60,
    width: 45,
    height: 35,
    defaultKg: 14.0,
    recommendedPrice: 140,
  },
];

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
  const id = useId();

  // Category
  const [category, setCategory] = useState('Pharmacie & Médical');

  // Format preset or custom
  const [selectedPreset, setSelectedPreset] = useState<string>('chaussures');
  const [isCustomDimensions, setIsCustomDimensions] = useState(false);

  // Exact dimensions (in cm)
  const [lengthCm, setLengthCm] = useState(35);
  const [widthCm, setWidthCm] = useState(25);
  const [heightCm, setHeightCm] = useState(14);

  // Weight (in kg)
  const [weightKg, setWeightKg] = useState(1.8);

  // Computed volume (L) and volumetric weight (IATA: L*W*H / 5000)
  const volumeLitres = Number(((lengthCm * widthCm * heightCm) / 1000).toFixed(1));
  const volumetricWeightKg = Number(((lengthCm * widthCm * heightCm) / 5000).toFixed(1));
  const billableWeightKg = Math.max(weightKg, volumetricWeightKg);

  // Logistics: Drop-off & Handover
  const [pickupOption, setPickupOption] = useState<'station_dropoff' | 'home_pickup'>('station_dropoff');
  const [deliveryOption, setDeliveryOption] = useState<'station_meetup' | 'home_delivery'>('station_meetup');

  // Special Handling Tags
  const [isFragile, setIsFragile] = useState(false);
  const [hasLithiumBattery, setHasLithiumBattery] = useState(false);
  const [isTamperSealed, setIsTamperSealed] = useState(true);
  const [hasInvoice, setHasInvoice] = useState(true);

  // Locations & routing
  const [departureCity, setDepartureCity] = useState('Alger');
  const [destination, setDestination] = useState('Paris, France');
  const [urgency, setUrgency] = useState('Normal');
  const [recipient, setRecipient] = useState('');
  const [proposedPrice, setProposedPrice] = useState('35');
  const [parcelNotes, setParcelNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // UI state
  const [activeView, setActiveView] = useState<'send' | 'browse'>('send');
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [publishedNotice, setPublishedNotice] = useState(false);
  const [carrierOrigin, setCarrierOrigin] = useState('');
  const [carrierDestination, setCarrierDestination] = useState('');

  // Filter existing requests
  const parcelRequests = requests.filter((r) => r.kind === 'parcel');

  // Update preset
  const handleSelectPreset = (preset: PresetFormat) => {
    setSelectedPreset(preset.id);
    setIsCustomDimensions(false);
    setLengthCm(preset.length);
    setWidthCm(preset.width);
    setHeightCm(preset.height);
    setWeightKg(preset.defaultKg);
    setProposedPrice(String(preset.recommendedPrice));
  };

  // Photo upload simulation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Price calculations
  const priceNum = parseFloat(proposedPrice) || 35;
  const pickupFee = pickupOption === 'home_pickup' ? 8 : 0;
  const deliveryFee = deliveryOption === 'home_delivery' ? 10 : 0;
  const totalShipperCost = priceNum + pickupFee + deliveryFee;
  const travelerNetReward = Math.round(priceNum * 0.85 + pickupFee * 0.75 + deliveryFee * 0.75);

  // Handle direct publication
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tagsList = [
      isFragile ? 'Fragile' : null,
      hasLithiumBattery ? 'Batterie Lithium' : null,
      isTamperSealed ? 'Scellé sécurisé' : null,
      hasInvoice ? 'Facture fournie' : null,
    ].filter(Boolean).join(', ');

    const newRequest: PurchaseRequest = {
      id: `req-parcel-${Date.now()}`,
      title: `Colis ${category} · ${lengthCm}×${widthCm}×${heightCm} cm (${weightKg} kg)`,
      origin: departureCity,
      destination: destination || 'Paris, France',
      date: new Date().toISOString().slice(0, 10),
      budget: totalShipperCost,
      reward: travelerNetReward,
      image: photoPreview || '/images/parcel.svg',
      buyer: user?.name || recipient || 'Expéditeur vérifié',
      specifications: `Dimensions: ${lengthCm}×${widthCm}×${heightCm} cm (${volumeLitres}L) · Poids réel: ${weightKg} kg · Facturé: ${billableWeightKg} kg · Prise en charge: ${pickupOption === 'home_pickup' ? 'Domicile (+8€)' : 'Rendez-vous'} · Livraison: ${deliveryOption === 'home_delivery' ? 'Domicile (+10€)' : 'Main propre'} · Tags: ${tagsList || 'Standard'} · Urgence: ${urgency}${parcelNotes ? ` · Note: ${parcelNotes}` : ''}`,
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
    setTimeout(() => setPublishedNotice(false), 4500);
  };

  return (
    <div className="bagandgo-platform-container max-w-5xl mx-auto px-4 py-3 space-y-6 pb-36 text-left">
      {/* 1. Hero Photographic Banner */}
      <section className="relative overflow-hidden rounded-[28px] bg-[#072a4a] text-white shadow-xl border border-cyan-500/25">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: "url('/images/hero-airport-traveler.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#072a4a]/95 via-[#072a4a]/85 to-[#072a4a]/40 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#072a4a]/90 via-transparent to-black/20" />

        <div className="relative p-5 sm:p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 text-cyan-200 text-xs font-semibold">
              <Package size={13} className="text-cyan-300" />
              <span>Bag &amp; Go · Expédition de Colis Précise &amp; Multi-Modal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
              Expédiez vos colis au millimètre près en toute confiance
            </h1>

            <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed font-medium max-w-lg drop-shadow-sm">
              Renseignez les dimensions précises, le poids exact et vos exigences de sécurité. Séquestre bancaire Stripe et validation par code PIN unique.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-cyan-200">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <ShieldCheck size={14} className="text-cyan-300" />
                <span>Séquestre Stripe sécurisé</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Sparkles size={14} className="text-cyan-300" />
                <span>Validation PIN &amp; QR</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Check size={14} className="text-cyan-300" />
                <span>Poids volumétrique IATA</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center p-5 rounded-2xl bg-[#062c47]/80 backdrop-blur-md border border-cyan-400/30 text-center shadow-xl min-w-[200px]">
            <div className="w-16 h-16 rounded-full bg-cyan-400/20 flex items-center justify-center mb-2">
              <Package size={32} className="text-cyan-300 animate-bounce" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide uppercase">Colisage Garanti</span>
            <span className="text-[10px] text-cyan-200 mt-0.5">Avion · Voiture · Train · Bateau</span>
          </div>
        </div>
      </section>

      {/* Confirmation Toast */}
      {publishedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 size={18} strokeWidth={2.5} />
          <span>Votre demande d'expédition a été enregistrée avec succès et transmise aux transporteurs !</span>
        </div>
      )}

      {/* 2-Segment Control: Expédier un colis vs Trouver un transporteur */}
      <div className="flex items-center justify-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 max-w-md mx-auto border border-slate-200 dark:border-slate-700 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveView('send')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            activeView === 'send'
              ? 'bg-white dark:bg-slate-900 text-[#00838f] dark:text-cyan-300 shadow-sm scale-[1.01]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Package size={16} />
          <span>Expédier mon colis</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('browse')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            activeView === 'browse'
              ? 'bg-white dark:bg-slate-900 text-[#00838f] dark:text-cyan-300 shadow-sm scale-[1.01]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Truck size={16} />
          <span>Transporteurs disponibles ({_trips.length})</span>
        </button>
      </div>

      {activeView === 'browse' && (() => {
        const filteredTrips = _trips.filter((trip) => {
          const matchOrigin = !carrierOrigin || trip.origin.toLowerCase().includes(carrierOrigin.toLowerCase());
          const matchDestination = !carrierDestination || trip.destination.toLowerCase().includes(carrierDestination.toLowerCase());
          return matchOrigin && matchDestination;
        });

        return (
          <section className="space-y-4 animate-in fade-in duration-200">
            {/* Search filter bar */}
            <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#072a4a] dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#00bcd4]" />
                  Filtrer les transporteurs par itinéraire
                </span>
                {(carrierOrigin || carrierDestination) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCarrierOrigin('');
                      setCarrierDestination('');
                    }}
                    className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-2.5 items-center">
                <div>
                  <CityAutocomplete
                    name="carrierOrigin"
                    value={carrierOrigin}
                    onChange={setCarrierOrigin}
                    placeholder="Ville de départ (ex. Paris, Marseille...)"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const temp = carrierOrigin;
                      setCarrierOrigin(carrierDestination);
                      setCarrierDestination(temp);
                    }}
                    title="Inverser les villes"
                    aria-label="Inverser les villes"
                    className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 hover:border-[#00bcd4] text-[#00838f] dark:text-cyan-400 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <ArrowLeftRight size={16} />
                  </button>
                </div>

                <div>
                  <CityAutocomplete
                    name="carrierDestination"
                    value={carrierDestination}
                    onChange={setCarrierDestination}
                    placeholder="Ville d'arrivée (ex. Alger, Oran, Batna...)"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#072a4a] dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#00bcd4] rounded-full inline-block" />
                <span>Trajets &amp; transporteurs acceptant des colis</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-[#00838f] dark:text-cyan-300">
                  {filteredTrips.length}
                </span>
              </h2>
            </div>

            {filteredTrips.length === 0 ? (
              <div className="p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Package size={24} />
                </div>
                <h3 className="font-bold text-sm text-[#072a4a] dark:text-white">
                  Aucun transporteur trouvé pour cet itinéraire précis
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Publiez votre demande de colis : les voyageurs certifiés qui empruntent ce corridor recevront une alerte immédiate.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveView('send')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#00bcd4] to-[#00838f] text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  <Package size={14} />
                  <span>Publier mon colis sur ce trajet</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00838f] to-[#00bcd4] text-white font-extrabold flex items-center justify-center text-sm shadow-sm shrink-0">
                        {trip.title ? trip.title.slice(0, 2).toUpperCase() : "TR"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-sm text-[#072a4a] dark:text-white">
                            {trip.title || "Transporteur vérifié"}
                          </h3>
                          <ShieldCheck size={15} className="text-[#00bcd4]" />
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/40 text-[#00838f] dark:text-cyan-300 border border-cyan-200/60">
                            {trip.transportLabel || "Trajet certifié"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                          <span>{trip.origin}</span>
                          <span className="text-slate-400">→</span>
                          <span>{trip.destination}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span>Départ : {trip.departureDate}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-[#00838f] dark:text-cyan-300">
                            {trip.availableKg ? `${trip.availableKg} kg disponibles` : "Espace disponible"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                      <span className="text-sm font-black text-[#00838f] dark:text-cyan-400">
                        Dès {trip.startingPrice || trip.pricePerKg || 12} € / kg
                      </span>
                      <button
                        type="button"
                        onClick={() => _onTrip?.(trip)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#00a2c7] hover:to-[#00669e] text-white text-xs font-bold shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <span>Réserver cet espace</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })()}

      {/* Interactive Parcel Visualizer Animation */}
      <div className={`space-y-2 ${activeView === 'browse' ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#072a4a] dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#00bcd4]" />
            Simulation Dynamique &amp; Gabarit 3D du Colis
          </span>
          <button
            type="button"
            onClick={() => setShowVisualizer(!showVisualizer)}
            className="text-xs font-bold text-[#00838f] dark:text-cyan-400 hover:underline cursor-pointer"
          >
            {showVisualizer ? 'Masquer le simulateur' : 'Afficher le simulateur'}
          </button>
        </div>
        {showVisualizer && (
          <ParcelVisualizer
            initialWeight={weightKg}
            initialCategory={category}
            onWeightChange={(newKg) => {
              setWeightKg(newKg);
              setProposedPrice(String(Math.round(18 + newKg * 11)));
            }}
          />
        )}
      </div>

      {/* 2. Detailed Granular Form with 5 Specialized Blocks */}
      <form onSubmit={handleSubmit} className={`space-y-4 ${activeView === 'browse' ? 'hidden' : ''}`}>
        {/* Block 1: Format & Dimensions Précises */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#00838f] via-[#0097a7] to-[#00bcd4] text-white flex items-center justify-between font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                <Box size={14} />
              </span>
              <span>1. Format &amp; Dimensions du Colis</span>
            </div>
            <span className="text-[11px] normal-case bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">
              Volume : {volumeLitres} L · Poids volumétrique : {volumetricWeightKg} kg
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Quick Presets Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Sélectionnez un format prédéfini ou personnalisez les dimensions
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {PRESET_FORMATS.map((preset) => {
                  const isSelected = selectedPreset === preset.id && !isCustomDimensions;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#00bcd4] bg-cyan-50/70 dark:bg-cyan-950/40 ring-2 ring-[#00bcd4]/30 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#00bcd4] text-white flex items-center justify-center shadow-xs">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                      <div>
                        <span className="font-extrabold text-xs text-[#072a4a] dark:text-white block">
                          {preset.name}
                        </span>
                        <span className="text-[10px] text-[#00838f] dark:text-cyan-400 font-semibold block mt-0.5">
                          {preset.length} × {preset.width} × {preset.height} cm
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {preset.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Dimensions Inputs (Length, Width, Height) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Maximize2 size={14} className="text-[#00838f] dark:text-cyan-400" />
                  Dimensions exactes (cm) &amp; Volume en litres
                </span>
                <button
                  type="button"
                  onClick={() => setIsCustomDimensions(true)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                    isCustomDimensions
                      ? 'bg-cyan-100 text-[#00838f] dark:bg-cyan-900/60 dark:text-cyan-300'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Mode dimensions sur-mesure
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Longueur (cm)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="150"
                    value={lengthCm}
                    onChange={(e) => {
                      setIsCustomDimensions(true);
                      setLengthCm(Number(e.target.value) || 10);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-bold text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Largeur (cm)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="150"
                    value={widthCm}
                    onChange={(e) => {
                      setIsCustomDimensions(true);
                      setWidthCm(Number(e.target.value) || 10);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-bold text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Hauteur (cm)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="150"
                    value={heightCm}
                    onChange={(e) => {
                      setIsCustomDimensions(true);
                      setHeightCm(Number(e.target.value) || 5);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-bold text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Weight & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Poids réel (kg)
                  </label>
                  <span className="text-xs font-black text-[#00838f] dark:text-cyan-400">
                    {weightKg} kg
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="35"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setWeightKg(val);
                    setProposedPrice(String(Math.round(18 + val * 11)));
                  }}
                  className="w-full accent-[#00bcd4] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-1">
                  <span>0.2 kg</span>
                  <span>Poids facturé IATA : <strong>{billableWeightKg} kg</strong></span>
                  <span>35 kg</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Catégorie de contenu
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none cursor-pointer focus:border-cyan-500"
                >
                  <option value="Pharmacie & Médical">Pharmacie &amp; Médical (médicaments scellés, ordonnances)</option>
                  <option value="High-Tech & Électronique">High-Tech &amp; Électronique (téléphones, PC, accessoires)</option>
                  <option value="Textile & Vêtements">Textile, Chaussures &amp; Prêt-à-porter</option>
                  <option value="Documents & Papiers">Documents officiels, Passeports &amp; Diplômes</option>
                  <option value="Cosmétiques & Parfums">Cosmétiques, Parfumerie &amp; Soins</option>
                  <option value="Alimentation & Terroir">Alimentation, Épicerie fine &amp; Produits du terroir</option>
                  <option value="Pièces auto & Outillage">Pièces détachées, Outillage &amp; Bricolage</option>
                  <option value="Autre">Autre marchandise licite</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Block 2: Logistique de Prise en Charge & Remise */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#00838f] via-[#0097a7] to-[#00bcd4] text-white flex items-center gap-2.5 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Truck size={14} />
            </span>
            <span>2. Logistique de Prise en Charge &amp; Remise</span>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Departure Handover */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Point de collecte (Départ)
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setPickupOption('station_dropoff')}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    pickupOption === 'station_dropoff'
                      ? 'border-[#00bcd4] bg-cyan-50/70 dark:bg-cyan-950/40 ring-1 ring-[#00bcd4]'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
                  }`}
                >
                  <MapPin size={18} className="text-[#00838f] dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-xs text-[#072a4a] dark:text-white block">
                      Dépôt au voyageur (Gratuit)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Vous déposez le colis au point de rendez-vous convenu (aéroport, gare, station).
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPickupOption('home_pickup')}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    pickupOption === 'home_pickup'
                      ? 'border-[#00bcd4] bg-cyan-50/70 dark:bg-cyan-950/40 ring-1 ring-[#00bcd4]'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
                  }`}
                >
                  <Home size={18} className="text-[#00838f] dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#072a4a] dark:text-white">
                        Enlèvement à domicile (+8 €)
                      </span>
                      <span className="text-[10px] font-extrabold text-[#00838f] dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/60 px-1.5 py-0.5 rounded">
                        +8 €
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Le transporteur ou un coursier partenaire vient récupérer le colis à votre adresse.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Arrival Handover */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Distribution finale (Arrivée)
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setDeliveryOption('station_meetup')}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    deliveryOption === 'station_meetup'
                      ? 'border-[#00bcd4] bg-cyan-50/70 dark:bg-cyan-950/40 ring-1 ring-[#00bcd4]'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
                  }`}
                >
                  <User size={18} className="text-[#00838f] dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-xs text-[#072a4a] dark:text-white block">
                      Remise en main propre (Inclus)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Le destinataire retrouve le voyageur au terminal ou au lieu convenu avec le code PIN.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryOption('home_delivery')}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    deliveryOption === 'home_delivery'
                      ? 'border-[#00bcd4] bg-cyan-50/70 dark:bg-cyan-950/40 ring-1 ring-[#00bcd4]'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
                  }`}
                >
                  <Home size={18} className="text-[#00838f] dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#072a4a] dark:text-white">
                        Livraison à domicile destinataire (+10 €)
                      </span>
                      <span className="text-[10px] font-extrabold text-[#00838f] dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/60 px-1.5 py-0.5 rounded">
                        +10 €
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Acheminement direct jusqu'à la porte ou l'entreprise du destinataire.
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Block 3: Sécurité, Normes & Exigences Spéciales */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#00838f] via-[#0097a7] to-[#00bcd4] text-white flex items-center gap-2.5 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ShieldCheck size={14} />
            </span>
            <span>3. Sécurité, Normes &amp; Scellé de Garantie</span>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Fragile */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer hover:border-cyan-400 transition-colors">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      Colis Fragile
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Verre, céramique, écrans, composants délicats
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isFragile}
                  onChange={(e) => setIsFragile(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-600 accent-[#00bcd4] cursor-pointer"
                />
              </label>

              {/* Lithium Battery */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer hover:border-cyan-400 transition-colors">
                <div className="flex items-center gap-2.5">
                  <BatteryCharging size={18} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      Batterie Lithium incluse
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Téléphone, PC portable, drone (norme IATA transport)
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasLithiumBattery}
                  onChange={(e) => setHasLithiumBattery(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-600 accent-[#00bcd4] cursor-pointer"
                />
              </label>

              {/* Tamper seal */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer hover:border-cyan-400 transition-colors">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      Scellé de sécurité numéroté
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Scellé avec numéro unique photographié avant départ
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isTamperSealed}
                  onChange={(e) => setIsTamperSealed(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-600 accent-[#00bcd4] cursor-pointer"
                />
              </label>

              {/* Invoice attached */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer hover:border-cyan-400 transition-colors">
                <div className="flex items-center gap-2.5">
                  <FileText size={18} className="text-[#00838f] dark:text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      Facture / Justificatif joint
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Facilite le passage en douane et l'assurance
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasInvoice}
                  onChange={(e) => setHasInvoice(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-600 accent-[#00bcd4] cursor-pointer"
                />
              </label>
            </div>

            {/* Photo preview upload */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Photo du colis préparé (recommandé pour vérification préalable)
              </label>
              <label className="relative flex flex-col items-center justify-center p-4 h-28 rounded-2xl border-2 border-dashed border-cyan-400/60 dark:border-cyan-700/60 bg-cyan-50/30 dark:bg-cyan-950/20 hover:bg-cyan-50/60 cursor-pointer transition-all overflow-hidden group">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Colis"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-100/80 dark:bg-cyan-900/50 text-[#00838f] dark:text-cyan-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Camera size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#072a4a] dark:text-slate-200 block">
                        Télécharger une photo de votre colis
                      </span>
                      <span className="text-[10px] text-slate-400">
                        PNG, JPG jusqu'à 5 Mo · Rassure les voyageurs certifiés
                      </span>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Block 4: Trajet & Destinataire */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#00838f] via-[#0097a7] to-[#00bcd4] text-white flex items-center justify-between font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                <MapPin size={14} />
              </span>
              <span>4. Trajet, Urgence &amp; Destinataire</span>
            </div>
            <span className="text-[10px] font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">
              Saisie libre monde entier
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Quick Corridor Chips */}
            <div>
              <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Lignes fréquentes en 1 clic
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { from: "Alger", to: "Paris" },
                  { from: "Paris", to: "Alger" },
                  { from: "Marseille", to: "Oran" },
                  { from: "Lyon", to: "Constantine" },
                  { from: "Montréal", to: "Alger" },
                  { from: "Casablanca", to: "Paris" },
                ].map((chip) => (
                  <button
                    key={`${chip.from}-${chip.to}`}
                    type="button"
                    onClick={() => {
                      setDepartureCity(chip.from);
                      setDestination(chip.to);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      departureCity === chip.from && destination === chip.to
                        ? "border-[#00bcd4] bg-cyan-50 dark:bg-cyan-950/60 text-[#00838f] dark:text-cyan-300 ring-1 ring-[#00bcd4]"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    {chip.from} <ArrowRight size={11} className="text-slate-400 inline mx-0.5" /> {chip.to}
                  </button>
                ))}
              </div>
            </div>

            {/* Departure / Arrival with Swap Button */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-end">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Ville / Pays de départ
                </label>
                <CityAutocomplete
                  name="departureCity"
                  value={departureCity}
                  onChange={setDepartureCity}
                  placeholder="Ex : Alger, Oran, Batna, Paris..."
                  required
                />
              </div>

              <div className="flex justify-center pb-1">
                <button
                  type="button"
                  onClick={() => {
                    const temp = departureCity;
                    setDepartureCity(destination);
                    setDestination(temp);
                  }}
                  title="Inverser le sens du trajet"
                  aria-label="Inverser le sens du trajet"
                  className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 hover:border-[#00bcd4] text-[#00838f] dark:text-cyan-400 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <ArrowLeftRight size={18} />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Ville / Pays de destination
                </label>
                <CityAutocomplete
                  name="destination"
                  value={destination}
                  onChange={setDestination}
                  placeholder="Ex : Paris, Marseille, Montréal, Lyon..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Délai souhaité
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none cursor-pointer focus:border-cyan-500"
                >
                  <option value="Normal">Normal (sous 3 à 5 jours)</option>
                  <option value="Urgent">Urgent (sous 48h)</option>
                  <option value="Très urgent">Très urgent (sous 24h)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Destinataire (Nom &amp; Téléphone)
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Nom du destinataire qui recevra le code PIN"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Instructions particulières ou description du contenu
                </label>
                <input
                  type="text"
                  value={parcelNotes}
                  onChange={(e) => setParcelNotes(e.target.value)}
                  placeholder="Ex : Médicaments thermosensibles à conserver en cabine, boîte scellée..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Block 5: Rémunération Proposée & Séquestre Stripe */}
        <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-[#072a4a] dark:text-white">
                Rémunération de transport proposée :
              </span>
              <span className="text-xs text-slate-500">
                (Hors options logistiques)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Total à payer sous séquestre : <strong>{totalShipperCost} €</strong> ({priceNum} € transport + {pickupFee} € collecte + {deliveryFee} € livraison)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-28">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">€</span>
              <input
                type="number"
                min="10"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                className="w-full pl-7 pr-2 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-black text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500 text-center"
              />
            </div>

            <div className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#00838f] to-[#00bcd4] text-white font-extrabold text-xs sm:text-sm shadow-sm whitespace-nowrap">
              Gain voyageur net : ~{travelerNetReward} €
            </div>
          </div>
        </div>

        {/* 3. Oceanic Cyan Gradient Pill CTA Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#00a2c7] hover:to-[#00669e] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <Send size={18} strokeWidth={2.4} />
          <span>Publier ma demande de colis ({billableWeightKg} kg facturés)</span>
        </button>
      </form>

      {/* 4. Section "Mes demandes récentes" */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#072a4a] dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#00bcd4] rounded-full inline-block" />
            <span>Mes demandes d'envoi récentes</span>
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
                    <span>En attente transporteur</span>
                  </span>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
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
