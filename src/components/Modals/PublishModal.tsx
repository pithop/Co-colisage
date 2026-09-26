import React, { useState } from 'react';
import { 
  X, 
  Plane, 
  Package, 
  ShoppingBag, 
  MapPin, 
  Calendar, 
  Clock, 
  Weight, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { MainPillar, FreightItem, SenderParcelRequest, ReceiverShoppingRequest } from '../../types';
import { useAuth } from '../../context/AuthContext';

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

  // --- Voyageur form state ---
  const [travelOrigin, setTravelOrigin] = useState('Marseille (MRS)');
  const [travelDestination, setTravelDestination] = useState('Alger (ALG)');
  const [travelDate, setTravelDate] = useState('2026-09-28');
  const [travelTime, setTravelTime] = useState('08:30');
  const [travelKg, setTravelKg] = useState(15);
  const [canCarryParcel, setCanCarryParcel] = useState(true);
  const [pricePerKg, setPricePerKg] = useState(10);
  const [canBuyProduct, setCanBuyProduct] = useState(true);
  const [shoppingCommission, setShoppingCommission] = useState(25);

  // --- Expéditeur form state ---
  const [parcelOrigin, setParcelOrigin] = useState('Marseille');
  const [parcelDestination, setParcelDestination] = useState('Alger');
  const [parcelDate, setParcelDate] = useState('Avant le 15 octobre 2026');
  const [parcelWeight, setParcelWeight] = useState(3);
  const [parcelDesc, setParcelDesc] = useState('');
  const [parcelBudget, setParcelBudget] = useState(30);

  // --- Destinataire form state ---
  const [productName, setProductName] = useState('');
  const [storeName, setStoreName] = useState('Duty Free / Sephora');
  const [productPrice, setProductPrice] = useState(120);
  const [receiverCity, setReceiverCity] = useState('Alger');
  const [offeredComm, setOfferedComm] = useState(25);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === 'voyageur') {
      const newTrip: FreightItem = {
        id: `trip-${Date.now()}`,
        title: `Trajet ${travelOrigin} ➔ ${travelDestination}`,
        transportType: 'avion',
        transportLabel: 'Vol / Traversée',
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
        travelerName: user?.name || 'Karim Bouzid',
        travelerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 5.0,
        reviewsCount: 1,
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
        description: `Espace valise : ${travelKg} kg. ` +
          (canCarryParcel ? `Transport de colis (${pricePerKg}€/kg). ` : '') +
          (canBuyProduct ? `Achats en magasin (commission : ${shoppingCommission}€).` : ''),
        remainingMinutes: 60
      };
      if (onTripCreated) onTripCreated(newTrip);
    } else if (tab === 'expediteur') {
      const newParcel: SenderParcelRequest = {
        id: `parcel-${Date.now()}`,
        senderName: user?.name || 'Expéditeur vérifié',
        senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        origin: parcelOrigin,
        destination: parcelDestination,
        dateDesired: parcelDate,
        weightKg: parcelWeight,
        itemDescription: parcelDesc || 'Colis personnel et vêtements sous emballage soigné',
        budgetOffer: parcelBudget,
        category: 'Colis Personnel'
      };
      if (onParcelCreated) onParcelCreated(newParcel);
    } else if (tab === 'destinataire') {
      const newShop: ReceiverShoppingRequest = {
        id: `shop-${Date.now()}`,
        receiverName: user?.name || 'Acheteur vérifié',
        receiverAvatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        city: receiverCity,
        productName: productName || 'Article commandé',
        storeName: storeName,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              +
            </span>
            <h3 className="font-extrabold text-sm text-slate-900">Publier une annonce</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Tabs Selection */}
        <div className="p-2 bg-slate-100/80 border-b border-slate-200/80 grid grid-cols-3 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('voyageur')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              tab === 'voyageur' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plane className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Je Voyage</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('expediteur')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              tab === 'expediteur' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">J'Expédie</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('destinataire')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              tab === 'destinataire' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
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
              <h4 className="text-xl font-black text-slate-900">Publication réussie !</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Votre annonce est immédiatement disponible et visible par la communauté.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* TAB 1 : VOYAGEUR */}
              {tab === 'voyageur' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Ville de départ</label>
                      <input
                        type="text"
                        required
                        value={travelOrigin}
                        onChange={(e) => setTravelOrigin(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Ville d'arrivée</label>
                      <input
                        type="text"
                        required
                        value={travelDestination}
                        onChange={(e) => setTravelDestination(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Date voyage</label>
                      <input
                        type="date"
                        required
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Horaire</label>
                      <input
                        type="time"
                        required
                        value={travelTime}
                        onChange={(e) => setTravelTime(e.target.value)}
                        className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Kilos valise</label>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        value={travelKg}
                        onChange={(e) => setTravelKg(parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* 2 Options Voyageur */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={canCarryParcel}
                        onChange={(e) => setCanCarryParcel(e.target.checked)}
                        className="accent-blue-600 w-4 h-4 rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">📦 Prêt à transporter le colis d'un tiers</span>
                    </label>
                    {canCarryParcel && (
                      <div className="pl-6 flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">Tarif au kilo :</span>
                        <input 
                          type="number" 
                          value={pricePerKg} 
                          onChange={(e) => setPricePerKg(parseInt(e.target.value) || 0)} 
                          className="w-16 px-2 py-1 text-xs border rounded bg-white font-bold"
                        />
                        <span className="text-xs font-bold text-blue-600">€/kg</span>
                      </div>
                    )}

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input 
                        type="checkbox"
                        checked={canBuyProduct}
                        onChange={(e) => setCanBuyProduct(e.target.checked)}
                        className="accent-emerald-600 w-4 h-4 rounded"
                      />
                      <span className="text-xs font-bold text-slate-800">🛍️ Prêt à acheter une marchandise</span>
                    </label>
                    {canBuyProduct && (
                      <div className="pl-6 flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">Commission souhaitée :</span>
                        <input 
                          type="number" 
                          value={shoppingCommission} 
                          onChange={(e) => setShoppingCommission(parseInt(e.target.value) || 0)} 
                          className="w-16 px-2 py-1 text-xs border rounded bg-white font-bold"
                        />
                        <span className="text-xs font-bold text-emerald-600">€</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* TAB 2 : EXPÉDITEUR */}
              {tab === 'expediteur' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Ville d'expédition</label>
                      <input
                        type="text"
                        required
                        value={parcelOrigin}
                        onChange={(e) => setParcelOrigin(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Ville de destination</label>
                      <input
                        type="text"
                        required
                        value={parcelDestination}
                        onChange={(e) => setParcelDestination(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Poids estimé (kg)</label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        required
                        value={parcelWeight}
                        onChange={(e) => setParcelWeight(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Gain proposé au voyageur (€)</label>
                      <input
                        type="number"
                        required
                        value={parcelBudget}
                        onChange={(e) => setParcelBudget(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Description du colis</label>
                    <textarea
                      required
                      placeholder="Ex: Vêtements neufs sous emballage, documents administratifs..."
                      value={parcelDesc}
                      onChange={(e) => setParcelDesc(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </>
              )}

              {/* TAB 3 : DESTINATAIRE */}
              {tab === 'destinataire' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Article souhaité</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dior Sauvage Eau de Parfum (100ml)"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Boutique / Enseigne</label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Ville de réception</label>
                      <input
                        type="text"
                        required
                        value={receiverCity}
                        onChange={(e) => setReceiverCity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Prix magasin estimé (€)</label>
                      <input
                        type="number"
                        required
                        value={productPrice}
                        onChange={(e) => setProductPrice(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Commission offerte (€)</label>
                      <input
                        type="number"
                        required
                        value={offeredComm}
                        onChange={(e) => setOfferedComm(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
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
