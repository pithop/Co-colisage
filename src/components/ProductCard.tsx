import React, { useState } from 'react';
import { Heart, MapPin, Sparkles, Store, ShieldCheck } from 'lucide-react';
import { ProductItem } from '../types';

interface ProductCardProps {
  product: ProductItem;
  onSelect: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div 
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Image area */}
      <div className="relative w-full h-52 sm:h-56 bg-slate-100 overflow-hidden">
        <img 
          src={product.image} 
          alt={`${product.brand} - ${product.name}`} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Favorite Heart Button */}
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
            isLiked 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 hover:bg-white text-slate-700'
          }`}
          aria-label="Ajouter aux favoris"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Destination Badge floating on bottom of image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-cyan-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md">
          <MapPin className="w-3 h-3" />
          <span>{product.destination}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Store info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider text-slate-400">
              {product.brand}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 truncate max-w-[130px]">
              <Store className="w-3 h-3 text-slate-400 shrink-0" />
              {product.originCity}
            </span>
          </div>

          {/* Product Name */}
          <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h4>
        </div>

        {/* Price & Gain Pill */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Official store price */}
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Prix boutique</p>
            <p className="text-base font-extrabold text-slate-900">
              {product.price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </p>
          </div>

          {/* Shopper Gain Badge (Emerald pill) */}
          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200/80 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gain : +{product.gain.toFixed(0)}€</span>
          </div>
        </div>
      </div>
    </div>
  );
};
