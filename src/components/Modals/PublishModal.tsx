import React, { useEffect, useState } from 'react';
import { 
  X, 
  Plane, 
  Car,
  Train,
  Ship,
  Truck,
  Package, 
  ShoppingBag, 
  MapPin, 
  Calendar, 
  Clock, 
  Weight, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Maximize2,
  Box,
  Receipt,
  FileCheck2,
  AlertTriangle,
  BatteryCharging
} from 'lucide-react';
import { MainPillar, FreightItem, SenderParcelRequest, ReceiverShoppingRequest, TransportType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { TicketScannerModal } from './TicketScannerModal';
import { CityAutocomplete } from '../common/CityAutocomplete';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: MainPillar;
  onTripCreated?: (trip: FreightItem) => void;
  onParcelCreated?: (parcel: SenderParcelRequest) => void;
  onShoppingCreated?: (shop: ReceiverShoppingRequest) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'voyageur',
  onTripCreated,
  onParcelCreated,
  onShoppingCreated
}) => {
  const { user } = useAuth();
  const [tab, setTab] = useState<MainPillar>(initialTab);
  const [submitted, setSubmitted] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    if (isOpen) setTab(initialTab);
    else setScannerOpen(false);
  }, [isOpen, initialTab]);

  // --- Voyageur multi-modal form state ---
  const [transportMode, setTransportMode] = useState<TransportType>('avion');
  const [travelOrigin, setTravelOrigin] = useState('Marseille (MRS)');
  const [travelDestination, setTravelDestination] = useState('Alger (ALG)');
  const [travelDate, setTravelDate] = useState('2026-12-15');
  const [travelTime, setTravelTime] = useState('08:30');
  const [travelKg, setTravelKg] = useState(15);
  const [travelVehicleModel, setTravelVehicleModel] = useState('');
  const [canCarryParcel, setCanCarryParcel] = useState(true);
  const [pricePerKg, setPricePerKg] = useState(10);
  const [canBuyProduct, setCanBuyProduct] = useState(true);
  const [shoppingCommission, setShoppingCommission] = useState(25);

  // --- Expéditeur form state ---
  const [parcelOrigin, setParcelOrigin] = useState('Marseille');
  const [parcelDestination, setParcelDestination] = useState('Alger');
  const [parcelDate, setParcelDate] = useState('Avant le 20 décembre 2026');
  const [parcelPreset, setParcelPreset] = useState<'standard' | 'enveloppe' | 'chaussures' | 'cabine' | 'custom'>('standard');
  const [lengthCm, setLengthCm] = useState(40);
  const [widthCm, setWidthCm] = useState(30);
  const [heightCm, setHeightCm] = useState(20);
  const [parcelWeight, setParcelWeight] = useState(3.5);
  const [parcelDesc, setParcelDesc] = useState('');
  const [parcelBudget, setParcelBudget] = useState(45);
  const [isFragile, setIsFragile] = useState(false);
  const [hasBattery, setHasBattery] = useState(false);

  // Computed volume and volumetric weight
  const volumeL = Number(((lengthCm * widthCm * heightCm) / 1000).toFixed(1));
  const volumetricWeightKg = Number(((lengthCm * widthCm * heightCm) / 5000).toFixed(1));

  // --- Destinataire form state ---
  const [productName, setProductName] = useState('');
  const [storeCategory, setStoreCategory] = useState('Duty Free Aérogare');
  const [storeName, setStoreName] = useState('Duty Free Paris CDG / Sephora');
  const [productPrice, setProductPrice] = useState(110);
  const [receiverCity, setReceiverCity] = useState('Alger');
  const [offeredComm, setOfferedComm] = useState(25);

  if (!isOpen) return null;

  // Change preset handler
  const handlePresetChange = (preset: 'standard' | 'enveloppe' | 'chaussures' | 'cabine' | 'custom') => {
    setParcelPreset(preset);
    if (preset === 'enveloppe') {
      setLengthCm(32); setWidthCm(23); setHeightCm(3); setParcelWeight(0.4); setParcelBudget(20);
    } else if (preset === 'chaussures') {
      setLengthCm(35); setWidthCm(25); setHeightCm(14); setParcelWeight(1.8); setParcelBudget(35);
    } else if (preset === 'standard') {
      setLengthCm(40); setWidthCm(30); setHeightCm(20); setParcelWeight(3.5); setParcelBudget(45);
    } else if (preset === 'cabine') {
      setLengthCm(55); setWidthCm(40); setHeightCm(23); setParcelWeight(8.0); setParcelBudget(85);
    }
  };

  const getTransportLabel = (mode: TransportType) => {
    switch (mode) {
      case 'voiture': return 'Voiture / Covoiturage';
      case 'train': return 'Train / TGV';
      case 'bateau': return 'Bateau / Ferry';
      case 'camion': return 'Utilitaire / Fret léger';
      default: return 'Avion / Vol commercial';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === 'voyageur') {
      const modeLabel = getTransportLabel(transportMode);
      const vehicleDesc = travelVehicleModel ? ` (${travelVehicleModel})` : '';
      const newTrip: FreightItem = {
        id: `trip-${Date.now()}`,
        title: `Trajet ${modeLabel}${vehicleDesc} : ${travelOrigin} → ${travelDestination}`,
        transportType: transportMode,
        transportLabel: `${modeLabel}${vehicleDesc}`,
        origin: travelOrigin,
        originCode: travelOrigin.includes('(') ? travelOrigin.split('(')[1].replace(')', '') : 'MRS',
        destination: travelDestination,
        destinationCode: travelDestination.includes('(') ? travelDestination.split('(')[1].replace(')', '') : 'ALG',
        pricePerKg: canCarryParcel ? pricePerKg : 0,
        availableKg: travelKg,
        departureDate: travelDate,
        departureTime: travelTime,
        canCarryParcel,
        canBuyProduct,
        shoppingCommission: canBuyProduct ? shoppingCommission : 0,
        travelerName: user?.name || 'Voyageur Certifié',
        travelerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 5.0,
        reviewsCount: 1,
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
        description: `Espace disponible : ${travelKg} ${transportMode === 'voiture' ? 'L' : transportMode === 'camion' ? 'm³' : 'kg'}. ` +
          (canCarryParcel ? `Transport colis (${pricePerKg}€/u). ` : '') +
          (canBuyProduct ? `Achats en boutique (commission : ${shoppingCommission}€).` : ''),
        remainingMinutes: 60
      };
      if (onTripCreated) onTripCreated(newTrip);
    } else if (tab === 'expediteur') {
      const tags = [isFragile ? 'Fragile' : null, hasBattery ? 'Lithium' : null].filter(Boolean).join(', ');
      const newParcel: SenderParcelRequest = {
        id: `parcel-${Date.now()}`,
        senderName: user?.name || 'Expéditeur vérifié',
        senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        origin: parcelOrigin,
        destination: parcelDestination,
        dateDesired: parcelDate,
        weightKg: parcelWeight,
        itemDescription: `Dimensions: ${lengthCm}×${widthCm}×${heightCm} cm (${volumeL}L) · Poids: ${parcelWeight} kg (IATA: ${volumetricWeightKg} kg)${tags ? ` · Tags: ${tags}` : ''}${parcelDesc ? ` · ${parcelDesc}` : ''}`,
        budgetOffer: parcelBudget,
        category: 'Colis Personnalisé',
        sizeFormat: lengthCm <= 35 ? 'S' : lengthCm <= 45 ? 'M' : lengthCm <= 55 ? 'L' : 'XL',
      };
      if (onParcelCreated) onParcelCreated(newParcel);
    } else if (tab === 'destinataire') {
      const newShop: ReceiverShoppingRequest = {
        id: `shop-${Date.now()}`,
        receiverName: user?.name || 'Acheteur vérifié',
        receiverAvatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        city: receiverCity,
        productName: productName || 'Article commandé',
        storeName: `${storeCategory} (${storeName})`,
        estimatedPrice: productPrice,
        offeredCommission: offeredComm,
        desiredDate: 'Dès que possible',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
      };
      if (onShoppingCreated) onShoppingCreated(newShop);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  if (scannerOpen) return (
    <TicketScannerModal
      isOpen={isOpen}
      onClose={() => setScannerOpen(false)}
      onTripCreated={onTripCreated ? trip => {
        onTripCreated(trip);
        setScannerOpen(false);
        onClose();
      } : undefined}
    />
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              +
            </span>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Publier une annonce</h3>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Main Tabs Selection */}
        <div className="p-2 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700 grid grid-cols-3 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('voyageur')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              tab === 'voyageur' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Plane className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Je Voyage</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('expediteur')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              tab === 'expediteur' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">J'Expédie</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('destinataire')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              tab === 'destinataire' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Je Reçois</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">Publication réussie !</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Votre annonce est immédiatement disponible et visible par la communauté certifiée.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* TAB 1 : VOYAGEUR MULTI-MODAL */}
              {tab === 'voyageur' && (
                <>
                  {/* Mode Switcher 5 Modes */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Mode de transport pour votre trajet
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[
                        { id: 'avion', label: 'Avion', icon: Plane },
                        { id: 'voiture', label: 'Voiture', icon: Car },
                        { id: 'train', label: 'Train', icon: Train },
                        { id: 'bateau', label: 'Bateau', icon: Ship },
                        { id: 'camion', label: 'Utilitaire', icon: Truck },
                      ].map((m) => {
                        const Icon = m.icon;
                        const isSel = transportMode === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setTransportMode(m.id as TransportType)}
                            className={`p-2 rounded-xl text-center flex flex-col items-center justify-center gap-1 border transition-all ${
                              isSel
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold ring-2 ring-blue-500/20'
                                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            <Icon size={16} />
                            <span className="text-[10px]">{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {transportMode === 'avion' && (
                    <button
                      type="button"
                      onClick={() => setScannerOpen(true)}
                      className="group relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border border-blue-500/20 bg-slate-900 p-4 text-left text-white shadow-md transition duration-200 hover:border-blue-500/40 hover:shadow-blue-950/20"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-blue-300"><Sparkles className="h-5 w-5" /></span>
                      <span className="relative min-w-0 flex-1">
                        <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-300">Scanner mon billet</span>
                        <span className="block text-sm font-semibold tracking-tight">Auto-remplissage IA depuis billet IATA</span>
                      </span>
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        {transportMode === 'avion' ? 'Aéroport de départ' : transportMode === 'train' ? 'Gare de départ' : transportMode === 'bateau' ? 'Port de départ' : 'Ville de départ'}
                      </label>
                      <CityAutocomplete
                        name="travelOrigin"
                        value={travelOrigin}
                        onChange={setTravelOrigin}
                        placeholder="Ex: Paris (CDG), Marseille..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        {transportMode === 'avion' ? "Aéroport d'arrivée" : transportMode === 'train' ? "Gare d'arrivée" : transportMode === 'bateau' ? "Port d'arrivée" : "Ville d'arrivée"}
                      </label>
                      <CityAutocomplete
                        name="travelDestination"
                        value={travelDestination}
                        onChange={setTravelDestination}
                        placeholder="Ex: Alger (ALG), Oran..."
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Date voyage</label>
                      <input
                        type="date"
                        required
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Horaire</label>
                      <input
                        type="time"
                        required
                        value={travelTime}
                        onChange={(e) => setTravelTime(e.target.value)}
                        className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        {transportMode === 'voiture' ? 'Litres coffre' : transportMode === 'camion' ? 'Volume m³' : 'Kilos dispo'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={transportMode === 'camion' ? 20 : transportMode === 'voiture' ? 500 : 50}
                        value={travelKg}
                        onChange={(e) => setTravelKg(parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {(transportMode === 'voiture' || transportMode === 'camion') && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Modèle de véhicule ou gabarit utilitaire
                      </label>
                      <input
                        type="text"
                        value={travelVehicleModel}
                        onChange={(e) => setTravelVehicleModel(e.target.value)}
                        placeholder="Ex : Peugeot 3008, Renault Master 14m³ avec hayon..."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  )}

                  {/* 2 Options Voyageur */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={canCarryParcel}
                        onChange={(e) => setCanCarryParcel(e.target.checked)}
                        className="accent-blue-600 w-4 h-4 rounded"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Prêt à transporter des colis</span>
                    </label>
                    {canCarryParcel && (
                      <div className="pl-6 flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">Tarif par unité :</span>
                        <input 
                          type="number" 
                          value={pricePerKg} 
                          onChange={(e) => setPricePerKg(parseInt(e.target.value) || 0)} 
                          className="w-16 px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 font-bold"
                        />
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          €/{transportMode === 'voiture' ? 'L' : transportMode === 'camion' ? 'm³' : 'kg'}
                        </span>
                      </div>
                    )}

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input 
                        type="checkbox"
                        checked={canBuyProduct}
                        onChange={(e) => setCanBuyProduct(e.target.checked)}
                        className="accent-emerald-600 w-4 h-4 rounded"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Prêt à faire des achats en boutique / Duty Free</span>
                    </label>
                    {canBuyProduct && (
                      <div className="pl-6 flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">Commission souhaitée :</span>
                        <input 
                          type="number" 
                          value={shoppingCommission} 
                          onChange={(e) => setShoppingCommission(parseInt(e.target.value) || 0)} 
                          className="w-16 px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 font-bold"
                        />
                        <span className="text-xs font-bold text-emerald-600">€</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* TAB 2 : EXPÉDITEUR AVEC GABARITS & DIMENSIONS */}
              {tab === 'expediteur' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Ville d'expédition</label>
                      <CityAutocomplete
                        name="parcelOrigin"
                        value={parcelOrigin}
                        onChange={setParcelOrigin}
                        placeholder="Ex: Paris, Lyon..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Ville de destination</label>
                      <CityAutocomplete
                        name="parcelDestination"
                        value={parcelDestination}
                        onChange={setParcelDestination}
                        placeholder="Ex: Alger, Constantine..."
                        required
                      />
                    </div>
                  </div>

                  {/* Preset Pills */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                      Gabarit du colis (Préréglages express)
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      {[
                        { id: 'enveloppe', label: 'Enveloppe' },
                        { id: 'chaussures', label: 'Boîte' },
                        { id: 'standard', label: 'Carton' },
                        { id: 'cabine', label: 'Valise' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handlePresetChange(p.id as any)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                            parcelPreset === p.id
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dimensions Inputs */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Dimensions (cm)</span>
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                        {volumeL} L · Poids volumétrique : {volumetricWeightKg} kg
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400">Longueur</label>
                        <input
                          type="number"
                          value={lengthCm}
                          onChange={(e) => {
                            setParcelPreset('custom');
                            setLengthCm(Number(e.target.value) || 10);
                          }}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400">Largeur</label>
                        <input
                          type="number"
                          value={widthCm}
                          onChange={(e) => {
                            setParcelPreset('custom');
                            setWidthCm(Number(e.target.value) || 10);
                          }}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400">Hauteur</label>
                        <input
                          type="number"
                          value={heightCm}
                          onChange={(e) => {
                            setParcelPreset('custom');
                            setHeightCm(Number(e.target.value) || 5);
                          }}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Poids réel (kg)</label>
                      <input
                        type="number"
                        min="0.2"
                        step="0.1"
                        required
                        value={parcelWeight}
                        onChange={(e) => setParcelWeight(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Rémunération voyageur (€)</label>
                      <input
                        type="number"
                        required
                        value={parcelBudget}
                        onChange={(e) => setParcelBudget(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* Safety tags */}
                  <div className="flex gap-4 pt-1 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFragile}
                        onChange={(e) => setIsFragile(e.target.checked)}
                        className="accent-amber-500 rounded"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Colis fragile</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasBattery}
                        onChange={(e) => setHasBattery(e.target.checked)}
                        className="accent-blue-600 rounded"
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Batterie Lithium</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Description du contenu</label>
                    <textarea
                      required
                      placeholder="Ex: Vêtements neufs, cosmétiques scellés, documents..."
                      value={parcelDesc}
                      onChange={(e) => setParcelDesc(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </>
              )}

              {/* TAB 3 : DESTINATAIRE / SHOP & GO */}
              {tab === 'destinataire' && (
                <>
                  <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <Receipt size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <span><strong>Ticket de caisse obligatoire :</strong> Le voyageur avance le paiement en magasin certifié et est remboursé sous séquestre Stripe.</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Article souhaité</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Parfum Dior Sauvage Eau de Parfum (100ml)"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Type d'enseigne</label>
                      <select
                        value={storeCategory}
                        onChange={(e) => setStoreCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        <option value="Duty Free Aérogare">Duty Free Aérogare</option>
                        <option value="Sephora / Parfumerie">Sephora / Parfumerie</option>
                        <option value="Apple Store / Fnac">Apple Store / Fnac</option>
                        <option value="Pharmacie & Soins">Pharmacie &amp; Soins</option>
                        <option value="Mode & Prêt-à-porter">Mode &amp; Prêt-à-porter</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Ville de réception</label>
                      <CityAutocomplete
                        name="receiverCity"
                        value={receiverCity}
                        onChange={setReceiverCity}
                        placeholder="Ex: Alger (ALG), Oran..."
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Prix magasin estimé (€)</label>
                      <input
                        type="number"
                        required
                        value={productPrice}
                        onChange={(e) => setProductPrice(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Commission offerte (€)</label>
                      <input
                        type="number"
                        required
                        value={offeredComm}
                        onChange={(e) => setOfferedComm(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#00a2c7] hover:to-[#00669e] text-white font-extrabold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>Publier mon annonce</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
