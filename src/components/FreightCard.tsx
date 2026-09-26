import React, { useState } from 'react';
import { Plane, Car, Ship, Truck, MapPin, Star, Heart, CheckCircle2, Clock, Calendar, Package, ShoppingBag, ArrowRight } from 'lucide-react';
import { FreightItem } from '../types';

interface FreightCardProps {
  item: FreightItem;
  onSelect: (item: FreightItem) => void;
}

export const FreightCard: React.FC<FreightCardProps> = ({
  item,
  onSelect,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const getTransportIcon = () => {
    switch (item.transportType) {
      case 'voiture': return <Car className="w-3.5 h-3.5" />;
      case 'bateau': return <Ship className="w-3.5 h-3.5" />;
      case 'camion': return <Truck className="w-3.5 h-3.5" />;
      default: return <Plane className="w-3.5 h-3.5 -rotate-45" />;
    }
  };

  return (
    <div 
      onClick={() => onSelect(item)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Photo Area */}
      <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Transport Tag top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
          {getTransportIcon()}
          <span>{item.transportLabel}</span>
        </div>

        {/* Favorite Heart top right */}
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white/80 hover:bg-white text-slate-700'
          }`}
          aria-label="Ajouter aux favoris"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Route Badge floating bottom of image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-blue-600/95 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
          <MapPin className="w-3.5 h-3.5 text-cyan-200" />
          <span>{item.originCode} ➔ {item.destinationCode}</span>
        </div>

        {/* Available Kilos tag bottom right */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 px-2.5 py-1 rounded-full text-xs font-black shadow-md">
          {item.availableKg} kg dispos
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Departure Date & Time */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1 text-blue-600 font-bold">
              <Calendar className="w-3 h-3" />
              {item.departureDate}
            </span>
            {item.departureTime && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Clock className="w-3 h-3 text-amber-500" />
                  {item.departureTime}
                </span>
              </>
            )}
          </div>

          <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {item.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* The 2 Service Badges (Transporter Colis & Acheter Marchandise) */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.canCarryParcel && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Package className="w-3 h-3 text-amber-600" />
              Colis : {item.pricePerKg}€/kg
            </span>
          )}

          {item.canBuyProduct && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShoppingBag className="w-3 h-3 text-emerald-600" />
              Achats : +{item.shoppingCommission || 25}€
            </span>
          )}
        </div>

        {/* Traveler profile & Contact action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          {/* Traveler info */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <img 
                src={item.travelerAvatar} 
                alt={item.travelerName} 
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-white absolute -bottom-0.5 -right-0.5" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {item.travelerName}
              </p>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{item.rating}</span>
                <span className="text-[10px] text-slate-400 font-normal">({item.reviewsCount} avis)</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            className="px-3.5 py-1.5 bg-blue-600 group-hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-all"
          >
            <span>Réserver</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
