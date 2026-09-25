import React, { useState } from 'react';
import { 
  X, 
  Plane, 
  Package, 
  MapPin, 
  Calendar, 
  Weight, 
  Euro, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { PlatformMode } from '../../types';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: PlatformMode;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  mode: initialMode,
}) => {
  const [tab, setTab] = useState<'item' | 'travel'>(initialMode === 'shop' ? 'item' : 'travel');
  const [submitted, setSubmitted] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [origin, setOrigin] = useState('Paris CDG');
  const [destination, setDestination] = useState('Abidjan (ABJ)');
  const [price, setPrice] = useState('120');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              +
            </span>
            <h3 className="font-bold text-sm text-slate-900">Publier une nouvelle annonce</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex gap-2">
          <button
            onClick={() => setTab('item')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'item' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Demander un article (Acheteur)</span>
          </button>
          <button
            onClick={() => setTab('travel')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'travel' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Proposer de l'espace (Voyageur)</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {submitted ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Annonce publiée avec succès !</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Votre annonce est visible par tous les voyageurs vérifiés de la plateforme.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {tab === 'item' ? "Nom de l'article ou modèle exact" : "Intitulé de votre trajet"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={tab === 'item' ? "Ex: Nike Air Jordan 1 Low (Taille 42)" : "Ex: Vol Paris CDG vers Abidjan - 10 kg disponibles"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ville de départ
                  </label>
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date souhaitée
                  </label>
                  <input
                    type="date"
                    required
                    defaultValue="2026-10-24"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {tab === 'item' ? "Gain offert au voyageur (€)" : "Tarif au kilo (€/kg)"}
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Publier et sécuriser sur Stripe Connect</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
