import React from 'react';
import { ShoppingBag, Store, MapPin, Calendar, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { ReceiverShoppingRequest } from '../types';

interface ReceiverShoppingCardProps {
  request: ReceiverShoppingRequest;
  onAccept: (request: ReceiverShoppingRequest) => void;
}

export const ReceiverShoppingCard: React.FC<ReceiverShoppingCardProps> = ({ request, onAccept }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Badges & Commission */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Demande d'achat
          </span>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-semibold block">Commission :</span>
            <span className="text-base font-black text-emerald-600">+{request.offeredCommission} €</span>
          </div>
        </div>

        {/* Product image & title */}
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={request.image} 
            alt={request.productName} 
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div>
            <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
              {request.productName}
            </h4>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
              <Store className="w-3 h-3 text-blue-600" />
              {request.storeName}
            </p>
          </div>
        </div>

        {/* Receiver & Delivery location */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 mb-3 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Destinataire :</span>
            <span className="font-bold text-slate-900">{request.receiverName}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-500">Ville de livraison :</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {request.city}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-slate-200/50">
            <span className="text-slate-500">Prix magasin :</span>
            <span className="font-extrabold text-slate-900">{request.estimatedPrice.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Fonds bloqués
        </span>
        <button
          onClick={() => onAccept(request)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Acheter & rapporter</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
