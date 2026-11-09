import React, { useState } from 'react';
import {
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Clock,
  Euro,
  Handshake,
  Image,
  Info,
  Link as LinkIcon,
  MapPin,
  Plus,
  Search,
  Send,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  Tag,
  User,
} from 'lucide-react';
import { PurchaseRequest, Trip } from '../../data/marketplace';
import { useAuth } from '../../context/AuthContext';
import { ShopBudgetVisualizer } from '../marketplace/ShopBudgetVisualizer';

export interface ShopAndGoPlatformProps {
  requests: PurchaseRequest[];
  trips: Trip[];
  onRequest?: (request: PurchaseRequest) => void;
  onTrip?: (trip: Trip) => void;
  onPublishTrip?: () => void;
  onScanBoardingPass?: () => void;
  onArbitrage?: (routeId?: string) => void;
  onAddRequest?: (request: PurchaseRequest) => void;
}

export const ShopAndGoPlatform: React.FC<ShopAndGoPlatformProps> = ({
  requests,
  trips: _trips,
  onRequest,
  onTrip: _onTrip,
  onPublishTrip: _onPublishTrip,
  onScanBoardingPass: _onScanBoardingPass,
  onArbitrage: _onArbitrage,
  onAddRequest,
}) => {
  const { user } = useAuth();

  // Form states matching Client Mockup 3
  const [productTitle, setProductTitle] = useState('Parfum Dior Sauvage – 100 ml');
  const [category, setCategory] = useState('Beauté & Parfum');
  const [quantity, setQuantity] = useState('1');
  const [productPrice, setProductPrice] = useState('100');
  const [commission, setCommission] = useState('20');
  const [productUrl, setProductUrl] = useState('');
  const [storeName, setStoreName] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('2026-12-15');
  const [deliveryLocation, setDeliveryLocation] = useState('Paris, France');
  const [departureLocation, setDepartureLocation] = useState('Alger');
  const [recipient, setRecipient] = useState('');
  const [acceptNegotiation, setAcceptNegotiation] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showVisualizer, setShowVisualizer] = useState(true);

  // Success notification
  const [publishedNotice, setPublishedNotice] = useState(false);

  // Dynamic live calculations
  const priceNum = parseFloat(productPrice) || 0;
  const commNum = parseFloat(commission) || 0;
  const totalBudget = priceNum + commNum;

  // Filter shopping requests
  const shoppingRequests = requests.filter((r) => r.kind !== 'parcel');

  // Handle image upload simulation
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

  // Handle direct publication
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest: PurchaseRequest = {
      id: `req-shop-${Date.now()}`,
      title: productTitle || 'Commande Shop & Go',
      origin: departureLocation,
      destination: deliveryLocation || 'Paris, France',
      date: deadlineDate || new Date().toISOString().slice(0, 10),
      budget: totalBudget,
      reward: commNum,
      image: photoPreview || '/images/perfume.jpg',
      buyer: user?.name || recipient || 'Acheteur vérifié',
      specifications: `Catégorie: ${category} · Qté: ${quantity} · Prix produit: ${priceNum} € · Commission: ${commNum} € · Magasin: ${storeName || 'Tout magasin'} · Négociable: ${acceptNegotiation ? 'Oui' : 'Non'}`,
      location: deliveryLocation || 'Paris, France',
      kind: 'shopping',
      status: 'available',
      flexibility: 'deadline',
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
    setTimeout(() => setPublishedNotice(false), 4000);
  };

  return (
    <div className="shopandgo-platform-container max-w-5xl mx-auto px-4 py-4 space-y-6 pb-36 text-left">
      {/* 1. Hero Banner matching Client Mockup 3 */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80 text-xs font-semibold">
              <ShoppingCart size={13} className="text-blue-600 dark:text-blue-400" />
              <span>Shop &amp; Go · Espace Achat &amp; Commande Boutique</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Commandez ce que vous voulez, on s'occupe du reste !
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Faites acheter vos articles dans les boutiques et duty-free du monde entier et faites-les livrer en main propre par un voyageur certifié.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <ShieldCheck size={14} className="text-blue-600 dark:text-blue-400" />
                <span>Paiement sous séquestre Stripe</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
                <span>Livraison en main propre</span>
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto flex justify-center shrink-0">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50/60 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700/60 flex items-center justify-center p-4 shadow-sm">
              <ShoppingCart size={82} className="text-blue-600 dark:text-blue-400 drop-shadow-sm animate-pulse" />
              <div className="absolute bottom-3 left-3 right-3 text-center bg-slate-900/90 backdrop-blur-md rounded-xl py-1 px-2 border border-white/10 shadow-sm">
                <span className="text-[10px] text-white font-bold tracking-wider uppercase">
                  Boutiques &amp; Duty-Free
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Toast */}
      {publishedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300">
          <Check size={18} strokeWidth={3} />
          <span>Votre commande d'achat a été publiée avec succès et transmise aux voyageurs !</span>
        </div>
      )}

      {/* Interactive Shop Budget Visualizer Animation (Requested by Client) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
            Animation &amp; Séquestre du Budget
          </span>
          <button
            type="button"
            onClick={() => setShowVisualizer(!showVisualizer)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showVisualizer ? "Masquer le simulateur" : "Afficher le simulateur"}
          </button>
        </div>
        {showVisualizer && (
          <ShopBudgetVisualizer
            productPrice={priceNum}
            commission={commNum}
            onPriceChange={(p) => setProductPrice(String(p))}
            onCommissionChange={(c) => setCommission(String(c))}
          />
        )}
      </div>

      {/* 2. Interactive Form "Votre commande" matching Client Mockup 3 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
            <ShoppingCart size={16} className="text-blue-600 dark:text-blue-400" />
            <span>Votre commande</span>
          </div>

          <div className="p-5 space-y-4">
            {/* Description search bar */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Description de l'article
              </label>
              <div className="relative flex items-center">
                <Search size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  placeholder="Décrivez le produit (ex : iPhone, parfum, chocolat...)"
                  required
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Photo upload + Category + Quantity + Product Price */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Photo Box */}
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Photo de l'article
                </label>
                <label className="relative flex flex-col items-center justify-center p-4 h-36 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 cursor-pointer transition-all overflow-hidden group">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Prévisualisation"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                        <Camera size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Ajouter une photo
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        PNG, JPG jusqu'à 5 Mo
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                  />
                </label>
              </div>

              {/* Category, Quantity, Product Price */}
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Catégorie
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Beauté & Parfum">Beauté &amp; Parfum</option>
                    <option value="High-Tech & Apple">High-Tech &amp; Apple</option>
                    <option value="Mode & Luxe">Mode &amp; Luxe</option>
                    <option value="Alimentation fine">Alimentation fine &amp; Terroir</option>
                    <option value="Pharmacie & Soins">Pharmacie &amp; Soins</option>
                    <option value="Autre">Autre catégorie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Quantité
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Prix du produit (ex : 100 €)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400 font-bold text-sm">€</span>
                    <input
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="100 €"
                      min="1"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Commission & Budget Calculator Banner */}
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/60 border border-blue-200/60 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Ma commission (pour le voyageur)
                </span>
                <span title="Rémunération nette versée au voyageur à la remise">
                  <Info size={14} className="text-blue-600 dark:text-blue-400 cursor-help" />
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-24">
                  <span className="absolute left-2.5 top-2.5 text-slate-400 font-bold text-xs">€</span>
                  <input
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    min="5"
                    className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-extrabold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 text-center"
                  />
                </div>

                {/* Total Budget Pill Badge */}
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow-sm border border-slate-800 whitespace-nowrap">
                  = Budget total estimé : {totalBudget} €
                </div>
              </div>
            </div>

            {/* Optional Links and Stores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Lien du produit (optionnel)
                </label>
                <div className="relative flex items-center">
                  <LinkIcon size={15} className="absolute left-3 text-slate-400" />
                  <input
                    type="url"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="Colle ici le lien du produit (Amazon, Zara...)"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Magasin d'achat (optionnel)
                </label>
                <div className="relative flex items-center">
                  <Store size={15} className="absolute left-3 text-slate-400" />
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Ex : Sephora, Fnac, Duty-Free..."
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Date limite souhaitée
                </label>
                <div className="relative flex items-center">
                  <Calendar size={15} className="absolute left-3 text-slate-400" />
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Lieu de livraison
                </label>
                <div className="relative flex items-center">
                  <MapPin size={15} className="absolute left-3 text-slate-400" />
                  <input
                    type="text"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="Ville ou adresse de livraison"
                    required
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Ville d'achat souhaitée
                </label>
                <div className="relative flex items-center">
                  <MapPin size={15} className="absolute left-3 text-slate-400" />
                  <input
                    type="text"
                    value={departureLocation}
                    onChange={(e) => setDepartureLocation(e.target.value)}
                    placeholder="Ex : Alger, Paris..."
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Destinataire (optionnel)
                </label>
                <div className="relative flex items-center">
                  <User size={15} className="absolute left-3 text-slate-400" />
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Nom ou numéro"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Negotiation Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Handshake size={18} className="text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  Accepter une négociation
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptNegotiation}
                  onChange={(e) => setAcceptNegotiation(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          </div>
        </div>

        {/* Big Pill CTA Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          <Send size={18} strokeWidth={2.4} />
          <span>Publier ma demande</span>
        </button>
      </form>

      {/* 3. Section "Mes demandes récentes" */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block" />
            <span>Mes demandes récentes</span>
            {shoppingRequests.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {shoppingRequests.length}
              </span>
            )}
          </h2>

          {shoppingRequests.length > 0 && (
            <button
              type="button"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {shoppingRequests.length > 0 ? (
          <div className="grid grid-cols-1 gap-3.5">
            {shoppingRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => onRequest?.(req)}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-blue-300 dark:hover:border-blue-800 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center shrink-0 overflow-hidden">
                    {req.image && req.image.startsWith('http') ? (
                      <img src={req.image} alt={req.title} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingCart size={24} className="text-blue-600 dark:text-blue-400" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {req.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                        {req.specifications?.includes('Catégorie:')
                          ? req.specifications.split('Catégorie:')[1]?.split('·')[0]?.trim()
                          : 'Achat boutique'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {req.location} • Sous 2-3 jours
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                      <span>Produit : {req.budget - req.reward} €</span>
                      <span className="text-slate-400 mx-1.5">|</span>
                      <span>Commission : {req.reward} €</span>
                      <span className="text-slate-400 mx-1.5">|</span>
                      <span className="text-blue-600 dark:text-blue-400 font-extrabold">Total : {req.budget} €</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60">
                    <Clock size={13} />
                    <span>En attente</span>
                  </span>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Virgin Clean State */
          <div className="p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm">
              <ShoppingCart size={26} />
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Aucune commande d'achat pour le moment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Remplissez les informations ci-dessus et cliquez sur « Publier ma demande » pour trouver un voyageur qui fera vos achats.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
