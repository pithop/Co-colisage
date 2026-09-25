import React, { useState } from 'react';
import { Plane, Car, Ship, Truck, MapPin, Star, Heart, CheckCircle2 } from 'lucide-react';
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
      <div className="relative w-full h-52 bg-slate-100 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Transport Tag top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-blue-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
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
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md text-cyan-300 px-3 py-1 rounded-full text-xs font-bold shadow-md">
          <MapPin className="w-3 h-3 text-cyan-400" />
          <span>{item.originCode} → {item.destinationCode}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {item.title}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {item.origin} • <span className="text-blue-600 font-semibold">{item.availableKg} kg dispo</span>
          </p>
        </div>

        {/* Rate per kg & Traveler rating avatar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Tarif au kilo</p>
            <p className="text-base font-extrabold text-blue-600">
              {item.pricePerKg}€/kg
            </p>
          </div>

          {/* Traveler info */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end text-xs font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{item.rating}</span>
                <span className="text-[10px] text-slate-400">({item.reviewsCount})</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[80px]">
                {item.travelerName}
              </p>
            </div>

            <div className="relative">
              <img 
                src={item.travelerAvatar} 
                alt={item.travelerName} 
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-white absolute -bottom-0.5 -right-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
