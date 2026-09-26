import React from 'react';
import { Package, MapPin, Calendar, Weight, ArrowRight, ShieldCheck } from 'lucide-react';
import { SenderParcelRequest } from '../types';

interface SenderParcelCardProps {
  request: SenderParcelRequest;
  onAccept: (request: SenderParcelRequest) => void;
}

export const SenderParcelCard: React.FC<SenderParcelCardProps> = ({ request, onAccept }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Badges & Budget */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Package className="w-3 h-3 text-amber-600" />
            {request.category}
          </span>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-semibold block">Gain offert :</span>
            <span className="text-base font-black text-amber-600">+{request.budgetOffer} €</span>
          </div>
        </div>

        {/* Sender Info */}
        <div className="flex items-center gap-2.5 mb-3">
          <img 
            src={request.senderAvatar} 
            alt={request.senderName} 
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div>
            <h4 className="text-xs font-bold text-slate-900">{request.senderName}</h4>
            <p className="text-[10px] text-slate-500">Expéditeur particulier vérifié</p>
          </div>
        </div>

        {/* Route */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
            <span className="flex items-center gap-1 text-blue-600">
              <MapPin className="w-3.5 h-3.5" />
              {request.origin}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="flex items-center gap-1 text-emerald-600">
              <MapPin className="w-3.5 h-3.5" />
              {request.destination}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-cyan-600" />
              {request.dateDesired}
            </span>
            <span className="flex items-center gap-1 font-bold text-slate-700">
              <Weight className="w-3 h-3 text-amber-600" />
              {request.weightKg} kg
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          « {request.itemDescription} »
        </p>
      </div>

      {/* Action CTA */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Séquestre garanti
        </span>
        <button
          onClick={() => onAccept(request)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Prendre ce colis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
