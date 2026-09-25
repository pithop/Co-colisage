import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Users, 
  Globe2, 
  Plane, 
  Car, 
  Ship, 
  Truck, 
  Briefcase, 
  Sparkles,
  Search,
  Calendar,
  Weight,
  MapPin,
  ArrowRight,
  TrendingDown,
  CheckCircle,
  Box,
  Radio,
  MessageCircle,
  Camera,
  Plus,
  X
} from 'lucide-react';
import { PlatformMode, TransportType } from '../types';

interface HeroSectionProps {
  mode: PlatformMode;
  onSearch: (origin: string, destinations: string[], transport: TransportType | 'all') => void;
  onOpenHowItWorks: () => void;
  onOpenLuggageHelper: () => void;
  onOpenGpsTracking: () => void;
  onOpenMessaging: () => void;
  onOpenInspection: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  mode,
  onSearch,
  onOpenHowItWorks,
  onOpenLuggageHelper,
  onOpenGpsTracking,
  onOpenMessaging,
  onOpenInspection
}) => {
  const [selectedTransport, setSelectedTransport] = useState<string>('all');
  const [origin, setOrigin] = useState('Marseille (MRS)');
  // Multi-city selection for destinations: default contains Alger
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(['Alger']);
  const [customDestInput, setCustomDestInput] = useState('');
  const [date, setDate] = useState('Octobre 2026');
  const [weight, setWeight] = useState('Tous les formats');

  // Quick preset destinations
  const presetCities = [
    'Alger', 'Oran', 'Constantine', 'Béjaïa', 'Tunis', 'Casablanca', 'Abidjan', 'Dakar'
  ];

  const toggleDestination = (city: string) => {
    if (selectedDestinations.includes(city)) {
      if (selectedDestinations.length > 1) {
        setSelectedDestinations(selectedDestinations.filter(c => c !== city));
      }
    } else {
      setSelectedDestinations([...selectedDestinations, city]);
    }
  };

  const addCustomDestination = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customDestInput.trim()) {
      e.preventDefault();
      if (!selectedDestinations.includes(customDestInput.trim())) {
        setSelectedDestinations([...selectedDestinations, customDestInput.trim()]);
      }
      setCustomDestInput('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(origin, selectedDestinations, selectedTransport as any);
    const offresElem = document.getElementById('offres');
    if (offresElem) {
      offresElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-4 pb-10 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main Hero Card with Photo Background */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 min-h-[500px] lg:min-h-[540px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-white">
          
          {/* High-res Hero Image Overlay with Gradient */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85" 
              alt="Voyageuse observant les avions et ferries à l'aéroport" 
              className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          </div>

          {/* Top Tag & Handwritten Overlay */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {mode === 'shop' 
                ? 'Ligne phare : Marseille (MRS) ➔ Alger (ALG) & International' 
                : 'Fret Maritime & Aérien : Marseille ➔ Alger, Oran & Maghreb'}
            </div>

            {/* Handwritten overlay script */}
            <div className="font-handwritten text-2xl sm:text-3xl text-amber-200/90 font-bold -rotate-3 tracking-wide">
              {mode === 'shop' 
                ? 'Marseille ➔ Alger : un objet, une valise, un voyage. ✈' 
                : 'Traversée & Vols : partagez votre espace bagage ! 🚢'}
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div className="relative z-10 my-6 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              {mode === 'shop' ? (
                <>
                  Vos achats de Marseille à Alger <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    voyagent avec vous
                  </span>
                </>
              ) : (
                <>
                  Envoyez vos colis de Marseille <br />
                  <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                    vers Alger & le monde
                  </span>
                </>
              )}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
              Ferrys, vols directs et trajets réguliers depuis <strong>Marseille</strong>, <strong>Paris</strong> et <strong>Lyon</strong> vers <strong>Alger</strong>, <strong>Oran</strong>, <strong>Tunis</strong> et l'Afrique. Paiement sous séquestre Stripe et sécurité certifiée.
            </p>

            {/* Quick Feature Badges from Colis-Voiturage / BagVoyage */}
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={onOpenLuggageHelper}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-cyan-300 transition-colors cursor-pointer"
              >
                <Box className="w-3.5 h-3.5" />
                <span>Aide visuelle & Gabarits (S/M/L)</span>
              </button>

              <button
                type="button"
                onClick={onOpenGpsTracking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-emerald-300 transition-colors cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Suivi GPS en direct (MRS ➔ ALG)</span>
              </button>

              <button
                type="button"
                onClick={onOpenMessaging}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-blue-300 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat sécurisé (Anti-contournement)</span>
              </button>

              <button
                type="button"
                onClick={onOpenInspection}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-amber-300 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Contrôle vidéo 15s (RDV)</span>
              </button>
            </div>
          </div>

          {/* Interactive Search Card / Transport & Multi-City Selector */}
          <div className="relative z-10 bg-white text-slate-900 rounded-2xl shadow-xl p-4 sm:p-5 mt-2">
            {/* Transport Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedTransport('all')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedTransport === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Tous les modes
              </button>
              <button
                type="button"
                onClick={() => setSelectedTransport('bateau')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedTransport === 'bateau'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Ship className="w-3.5 h-3.5" />
                Ferry / Bateau 🚢
              </button>
              <button
                type="button"
                onClick={() => setSelectedTransport('avion')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedTransport === 'avion'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Plane className="w-3.5 h-3.5 -rotate-45" />
                Par avion ✈️
              </button>
              <button
                type="button"
                onClick={() => setSelectedTransport('voiture')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedTransport === 'voiture'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                Voiture / Coffre 🚗
              </button>
              <button
                type="button"
                onClick={() => setSelectedTransport('dutyfree')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedTransport === 'dutyfree'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Duty Free 🛍️
              </button>
            </div>

            {/* Filter Inputs Form */}
            <form onSubmit={handleSearchSubmit} className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
              
              {/* Departure */}
              <div className="flex flex-col bg-slate-50 hover:bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/70 transition-colors">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-500" />
                  Départ (Par défaut : Marseille)
                </span>
                <input 
                  type="text" 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none mt-0.5"
                  placeholder="Marseille (MRS), Paris, Lyon..."
                />
              </div>

              {/* Destinations Multi-Cities Selector */}
              <div className="flex flex-col bg-slate-50 hover:bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/70 transition-colors lg:col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <MapPin className="w-3 h-3" />
                    Destinations multiples (Alger par défaut)
                  </span>
                  <span className="text-[9px] text-slate-400 font-normal">
                    {selectedDestinations.length} ville(s) active(s)
                  </span>
                </span>

                <div className="flex flex-wrap items-center gap-1.5 mt-1.5 max-h-16 overflow-y-auto no-scrollbar">
                  {selectedDestinations.map(city => (
                    <span 
                      key={city}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold"
                    >
                      {city}
                      <button
                        type="button"
                        onClick={() => toggleDestination(city)}
                        className="text-emerald-700 hover:text-emerald-950"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={customDestInput}
                    onChange={(e) => setCustomDestInput(e.target.value)}
                    onKeyDown={addCustomDestination}
                    placeholder="+ Ajouter une ville..."
                    className="bg-transparent text-[11px] font-medium text-slate-700 focus:outline-none min-w-[100px] flex-1"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="flex flex-col bg-slate-50 hover:bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/70 transition-colors">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyan-500" />
                  Date(s) de voyage
                </span>
                <input 
                  type="text" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none mt-0.5"
                  placeholder="Période"
                />
              </div>

              {/* Action Button */}
              <button 
                type="submit"
                className="w-full h-full min-h-[46px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Filtrer les trajets</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Destination Chips */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 flex-wrap text-[11px]">
              <span className="text-slate-400 font-semibold mr-1">Villes suggérées :</span>
              {presetCities.map(city => {
                const isSelected = selectedDestinations.includes(city);
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => toggleDestination(city)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {city} {isSelected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* 4 Feature Points Bar below Hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 px-2">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Économique</p>
              <p className="text-[11px] text-slate-500">Marseille ➔ Alger dès 50€/kg</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Sécurisé</p>
              <p className="text-[11px] text-slate-500">Paiements séquestre Stripe</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Conforme</p>
              <p className="text-[11px] text-slate-500">Scellé anti-effraction & vidéo</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Télémétrie GPS</p>
              <p className="text-[11px] text-slate-500">Suivi direct en Méditerranée</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
