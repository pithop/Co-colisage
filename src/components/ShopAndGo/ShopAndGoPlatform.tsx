import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Euro,
  FileCheck2,
  Handshake,
  Link as LinkIcon,
  Lock,
  MapPin,
  Package,
  Plus,
  Receipt,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Tag,
  Trash2,
  ArrowLeftRight,
  ArrowRight,
} from 'lucide-react';
import { PurchaseRequest, Trip } from '../../data/marketplace';
import { products } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { ShopBudgetVisualizer } from '../marketplace/ShopBudgetVisualizer';
import { CityAutocomplete } from '../common/CityAutocomplete';
import { ExploreUnifiedNavigation, UnifiedListingCard } from '../marketplace/UnifiedListingCard';

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

export interface BasketItem {
  id: string;
  name: string;
  storeCategory: string;
  storeName: string;
  price: number;
  quantity: number;
  url?: string;
  notes?: string;
}

const STORE_CATEGORIES = [
  { id: 'dutyfree', label: 'Duty Free Aérogare & Port', icon: Store, hint: 'Parfums, tabacs, confiserie, alcools détaxés' },
  { id: 'sephora', label: 'Grands Magasins & Parfumerie (Sephora, Marionnaud)', icon: ShoppingBag, hint: 'Cosmétiques, soins de luxe, coffrets beauté' },
  { id: 'hightech', label: 'Apple Store & High-Tech (Fnac, Darty)', icon: Building2, hint: 'Smartphones, tablettes, écouteurs, accessoires' },
  { id: 'pharmacie', label: 'Pharmacie & Parapharmacie', icon: Package, hint: 'Soins dermo-cosmétiques, compléments, laits infantiles' },
  { id: 'mode', label: 'Mode, Maroquinerie & Prêt-à-porter', icon: Tag, hint: 'Zara, Mango, Galeries Lafayette, maroquinerie' },
  { id: 'ecommerce', label: 'E-Commerce livré au voyageur avant départ', icon: LinkIcon, hint: 'Amazon, Cdiscount, expédié au domicile du voyageur' },
];

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
  const { user, activePlatform, setActivePlatform } = useAuth();
  const [selectedCorridor, setSelectedCorridor] = useState('');

  // Multi-item shopping basket state
  const [basket, setBasket] = useState<BasketItem[]>([
    {
      id: 'item-1',
      name: 'Parfum Dior Sauvage Eau de Parfum (100 ml)',
      storeCategory: 'Duty Free Aérogare & Port',
      storeName: 'Duty Free Paris CDG / Sephora',
      price: 110,
      quantity: 1,
      url: 'https://sephora.fr/p/sauvage-eau-de-parfum',
      notes: 'Format 100 ml scellé avec blister d’origine',
    },
  ]);

  // Current item being added
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemStoreCat, setNewItemStoreCat] = useState(STORE_CATEGORIES[0].label);
  const [newItemStoreName, setNewItemStoreName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('45');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  // General Order parameters
  const [commission, setCommission] = useState('25');
  const [deadlineDate, setDeadlineDate] = useState('2026-12-15');
  const [deliveryLocation, setDeliveryLocation] = useState('Alger, Algérie');
  const [departureLocation, setDepartureLocation] = useState('Paris, France');
  const [recipient, setRecipient] = useState('');
  const [acceptNegotiation, setAcceptNegotiation] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  // UI state
  const [activeView, setActiveView] = useState<'order' | 'browse'>('order');
  const [showVisualizer, setShowVisualizer] = useState(true);

  // Success notification
  const [publishedNotice, setPublishedNotice] = useState(false);

  // Dynamic calculations
  const itemsSubtotal = basket.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const commNum = parseFloat(commission) || 20;
  const stripeEscrowFee = Number((itemsSubtotal * 0.03).toFixed(2));
  const totalBudget = Math.round(itemsSubtotal + commNum + stripeEscrowFee);

  // Add item to basket
  const handleAddItemToBasket = () => {
    if (!newItemTitle.trim()) return;
    const price = parseFloat(newItemPrice) || 20;
    const qty = parseInt(newItemQuantity) || 1;
    const item: BasketItem = {
      id: `item-${Date.now()}`,
      name: newItemTitle.trim(),
      storeCategory: newItemStoreCat,
      storeName: newItemStoreName.trim() || newItemStoreCat,
      price,
      quantity: qty,
      url: newItemUrl.trim() || undefined,
      notes: newItemNotes.trim() || undefined,
    };
    setBasket([...basket, item]);
    setNewItemTitle('');
    setNewItemPrice('45');
    setNewItemQuantity('1');
    setNewItemUrl('');
    setNewItemNotes('');
    setIsAddingItem(false);
  };

  // Remove item from basket
  const handleRemoveItem = (id: string) => {
    if (basket.length <= 1) return; // Keep at least one item
    setBasket(basket.filter((it) => it.id !== id));
  };

  // Filter shopping requests & connect verified Duty-Free demo catalog
  const userShoppingRequests = requests.filter((r) => r.kind !== 'parcel');
  const demoShoppingRequests: PurchaseRequest[] = products.map((p) => ({
    id: p.id,
    title: p.name,
    origin: p.originCity || 'Paris (CDG)',
    destination: p.destination || 'Alger (ALG)',
    date: p.deliveryPeriod || new Date().toISOString().slice(0, 10),
    budget: Math.round(p.price + (p.gain || 25) + 10),
    reward: p.gain || 25,
    serviceGross: p.price,
    platformFee: 10,
    image: p.image,
    buyer: 'Client Boutique Vérifié',
    buyerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    specifications: `Articles: 1x ${p.name} · Boutique: ${p.originStore} · Franchise Duty-Free appliquée · Reçu fiscal garanti`,
    location: `${p.originCity || 'Paris'} → ${p.destination || 'Alger'}`,
    kind: 'shopping',
    status: 'available',
    flexibility: 'deadline',
    declaredValue: p.price,
    declaredCurrency: 'EUR',
  }));

  const shoppingRequests = [
    ...userShoppingRequests,
    ...demoShoppingRequests.filter((d) => !userShoppingRequests.some((u) => u.id === d.id)),
  ];
  const [browseSearch, setBrowseSearch] = useState('');
  const [browseCategory, setBrowseCategory] = useState('all');

  const filteredBrowseRequests = shoppingRequests.filter((req) => {
    const matchesSearch =
      !browseSearch ||
      req.title.toLowerCase().includes(browseSearch.toLowerCase()) ||
      req.location.toLowerCase().includes(browseSearch.toLowerCase());
    const matchesCat =
      browseCategory === 'all' ||
      (req.specifications && req.specifications.toLowerCase().includes(browseCategory.toLowerCase())) ||
      (req.title && req.title.toLowerCase().includes(browseCategory.toLowerCase()));
    return matchesSearch && matchesCat;
  });

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

    const itemsSummary = basket
      .map((it) => `${it.quantity}x ${it.name} (${it.price}€ @ ${it.storeName})`)
      .join(' + ');

    const newRequest: PurchaseRequest = {
      id: `req-shop-${Date.now()}`,
      title: basket.length === 1 ? basket[0].name : `Commande groupée (${basket.length} articles) : ${basket[0].name}...`,
      origin: departureLocation,
      destination: deliveryLocation || 'Alger, Algérie',
      date: deadlineDate || new Date().toISOString().slice(0, 10),
      budget: totalBudget,
      reward: commNum,
      image: photoPreview || '/images/hero-luxury-shopper.jpg',
      buyer: user?.name || recipient || 'Acheteur vérifié',
      specifications: `Articles: ${itemsSummary} · Sous-total: ${itemsSubtotal} € · Rémunération voyageur: ${commNum} € · Protection Stripe: ${stripeEscrowFee} € · Négociable: ${acceptNegotiation ? 'Oui' : 'Non'}`,
      location: deliveryLocation || 'Alger, Algérie',
      kind: 'shopping',
      status: 'available',
      flexibility: 'deadline',
      declaredValue: itemsSubtotal,
      declaredCurrency: 'EUR',
      recipientName: recipient || undefined,
    };

    if (onAddRequest) {
      onAddRequest(newRequest);
    } else if (onRequest) {
      onRequest(newRequest);
    }

    setPublishedNotice(true);
    setTimeout(() => setPublishedNotice(false), 4500);
  };

  return (
    <div className="shopandgo-platform-container max-w-5xl mx-auto px-4 py-3 space-y-6 pb-36 text-left">
      {/* 0. Unified Segmented Control (Colis | Trajets | Shopping) + Quick Corridors */}
      <ExploreUnifiedNavigation
        activeSegment={activePlatform}
        onSelectSegment={(seg) => setActivePlatform(seg)}
        selectedCorridor={selectedCorridor}
        onSelectCorridor={(corridor) => {
          if (!corridor) {
            setSelectedCorridor('');
            setBrowseSearch('');
          } else {
            setSelectedCorridor(corridor.label);
            setDepartureLocation(corridor.from);
            setDeliveryLocation(corridor.to);
            setBrowseSearch(corridor.to);
          }
        }}
      />

      {/* 1. Hero Photographic Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0F172A] text-white shadow-lg border border-slate-800/80">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105 opacity-40"
          style={{ backgroundImage: "url('/images/hero-luxury-shopper.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/50 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/20" />

        <div className="relative p-6 sm:p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 text-xs font-semibold">
              <ShoppingCart size={13} className="text-[#059669]" />
              <span>Shop &amp; Go · Panier Multi-Articles &amp; Achat en Boutique</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
              Commandez en boutique &amp; Duty-Free dans le monde entier
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-lg">
              Ajoutez vos articles au panier (duty-free, high-tech, parfumerie, pharmacie). Les voyageurs certifiés achètent avec ticket de caisse obligatoire sous séquestre Stripe.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Receipt size={14} className="text-[#059669]" />
                <span>Ticket de caisse obligatoire</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Lock size={14} className="text-[#059669]" />
                <span>Séquestre bancaire Stripe</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <ShieldCheck size={14} className="text-[#059669]" />
                <span>Remise en main propre</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-center shadow-xl min-w-[200px]">
            <div className="w-14 h-14 rounded-2xl bg-[#059669]/15 border border-[#059669]/30 flex items-center justify-center mb-2.5">
              <ShoppingBag size={28} className="text-[#059669]" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide uppercase">Boutiques &amp; Duty-Free</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Paris · Milan · Dubaï · Londres</span>
          </div>
        </div>
      </section>

      {/* Confirmation Toast */}
      {publishedNotice && (
        <div className="p-5 rounded-2xl bg-[#059669] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 size={18} strokeWidth={2.5} />
          <span>Votre commande d'achat groupée a été publiée et transmise aux voyageurs en partance !</span>
        </div>
      )}

      {/* Mandatory Proof of Purchase & Receipt Policy Notice Banner */}
      <section className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-850 p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
            <FileCheck2 size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>Garantie Transparence : Reçu &amp; Ticket de caisse officiel</span>
              <span className="text-[10px] bg-[#ECFDF5] text-[#059669] border border-[#059669]/20 px-2 py-0.5 rounded-full font-bold">
                Contrôle Anti-Fraude
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Le voyageur avance le paiement en magasin certifié et photographie le ticket de caisse officiel dans l'application. Le montant réel déboursé est remboursé à l'euro près depuis votre séquestre Stripe, accompagné de sa commission de transport.
            </p>
          </div>
        </div>
      </section>

      {/* 2-Segment Mode Switcher: Commander vs Demandes en cours */}
      <div className="flex items-center p-1.5 bg-[#F8FAFC] dark:bg-slate-800/80 rounded-2xl border border-[#E2E8F0] dark:border-slate-700 max-w-md mx-auto w-full shadow-xs">
        <button
          type="button"
          onClick={() => setActiveView('order')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeView === 'order'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShoppingCart size={16} />
          <span>Créer ma commande</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveView('browse')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer tabular-nums ${
            activeView === 'browse'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Search size={16} />
          <span>Demandes d'achat ({shoppingRequests.length})</span>
        </button>
      </div>

      {/* View: Browse Shopping Requests */}
      {activeView === 'browse' && (
        <section className="space-y-4">
          <div className="p-5 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/90 shadow-xs space-y-3.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un parfum, boutique, destination..."
                  value={browseSearch}
                  onChange={(e) => setBrowseSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:border-slate-400"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'Tous les achats' },
                  { id: 'duty', label: 'Duty Free' },
                  { id: 'parfum', label: 'Parfums' },
                  { id: 'apple', label: 'Apple / Tech' },
                  { id: 'soin', label: 'Pharmacie' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setBrowseCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      browseCategory === cat.id
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-[#F8FAFC] border border-[#E2E8F0] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredBrowseRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBrowseRequests.map((req) => (
                <UnifiedListingCard
                  key={req.id}
                  request={req}
                  onSelect={() => onRequest?.(req)}
                  ctaLabel="Acheter pour ce client"
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/80 text-center space-y-2">
              <ShoppingCart size={32} className="mx-auto text-slate-400" />
              <p className="text-sm font-bold text-slate-800 dark:text-white">Aucune demande d'achat ne correspond à votre filtre</p>
              <button
                type="button"
                onClick={() => {
                  setBrowseSearch('');
                  setBrowseCategory('all');
                }}
                className="text-xs font-bold text-slate-700 hover:underline cursor-pointer"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </section>
      )}

      {/* Interactive Shop Budget Visualizer Animation */}
      <div className={`space-y-2 ${activeView === 'browse' ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#059669]" />
            Simulation &amp; Ventilation du Séquestre Bancaire
          </span>
          <button
            type="button"
            onClick={() => setShowVisualizer(!showVisualizer)}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:underline cursor-pointer"
          >
            {showVisualizer ? 'Masquer le simulateur' : 'Afficher le simulateur'}
          </button>
        </div>
        {showVisualizer && (
          <ShopBudgetVisualizer
            productPrice={itemsSubtotal}
            commission={commNum}
            onPriceChange={() => {}}
            onCommissionChange={(c) => setCommission(String(c))}
          />
        )}
      </div>

      {/* 2. Multi-Item Shopping Basket & Form */}
      <form onSubmit={handleSubmit} className={`space-y-4 ${activeView === 'browse' ? 'hidden' : ''}`}>
        {/* Block 1: Mon Panier d'Articles */}
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/90 overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 bg-slate-900 dark:bg-slate-850 text-white flex items-center justify-between font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-[#059669]/20 flex items-center justify-center text-[#059669]">
                <ShoppingCart size={14} />
              </span>
              <span className="tabular-nums">1. Mon Panier d'Articles ({basket.length})</span>
            </div>
            <span className="text-[11px] normal-case bg-white/10 px-2.5 py-0.5 rounded-full font-semibold text-slate-200 tabular-nums">
              Sous-total articles : {itemsSubtotal} €
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Basket Items List */}
            <div className="space-y-3">
              {basket.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-slate-900 dark:text-slate-300 font-black text-xs flex items-center justify-center shrink-0 tabular-nums">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {item.storeName}
                        </span>
                        <span>•</span>
                        <span>Qté : {item.quantity}</span>
                        {item.notes && (
                          <>
                            <span>•</span>
                            <span className="italic">{item.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
                    <span className="font-black text-sm text-slate-900 dark:text-white tabular-nums">
                      {item.price * item.quantity} €
                    </span>
                    {basket.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                        title="Supprimer cet article"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Another Item Accordion / Form */}
            {!isAddingItem ? (
              <button
                type="button"
                onClick={() => setIsAddingItem(true)}
                className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800/20 hover:border-slate-400 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Ajouter un autre article au panier</span>
              </button>
            ) : (
              <div className="p-5 rounded-2xl border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Plus size={14} className="text-[#059669]" />
                    Nouvel article à faire acheter
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingItem(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Nom de l'article &amp; référence précise
                    </label>
                    <input
                      type="text"
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      placeholder="Ex : Coffret Chocolat Pierre Hermé 24 pièces, iPad Air 128Go..."
                      className="w-full p-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 font-semibold text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Type d'enseigne / Boutique
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {STORE_CATEGORIES.map((cat) => {
                        const isSelected = newItemStoreCat === cat.label;
                        const CatIcon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setNewItemStoreCat(cat.label);
                              setNewItemStoreName(cat.label);
                            }}
                            className={`p-2 rounded-xl text-left transition-all border flex items-center gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                                : 'bg-[#FFFFFF] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[#E2E8F0] dark:border-slate-700 hover:border-slate-400'
                            }`}
                          >
                            <CatIcon size={14} className={isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'} />
                            <span className="text-[11px] font-bold truncate">{cat.label.split('(')[0].trim()}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Nom du magasin spécifique (optionnel)
                    </label>
                    <input
                      type="text"
                      value={newItemStoreName}
                      onChange={(e) => setNewItemStoreName(e.target.value)}
                      placeholder="Ex : Sephora Champs-Élysées, Duty Free Orly 3..."
                      className="w-full p-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 font-semibold text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Prix estimé (€)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 font-bold text-xs text-slate-900 dark:text-white outline-none tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Quantité
                    </label>
                    <div className="flex items-center gap-1">
                      {['1', '2', '3', '4', '5'].map((q) => {
                        const isSelected = newItemQuantity === q;
                        return (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setNewItemQuantity(q)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border tabular-nums ${
                              isSelected
                                ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                                : 'bg-[#FFFFFF] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[#E2E8F0] dark:border-slate-700 hover:border-slate-300'
                            }`}
                          >
                            {q}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Lien du produit ou note pour le voyageur
                    </label>
                    <input
                      type="text"
                      value={newItemUrl}
                      onChange={(e) => setNewItemUrl(e.target.value)}
                      placeholder="Lien web direct ou précision de taille/couleur..."
                      className="w-full p-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 font-semibold text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddItemToBasket}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                >
                  Valider et ajouter au panier
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Block 2: Commission Voyageur & Ventilation Financière */}
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/90 overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 bg-slate-900 dark:bg-slate-850 text-white flex items-center gap-2.5 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xs">
            <span className="w-6 h-6 rounded-lg bg-[#059669]/20 flex items-center justify-center text-[#059669]">
              <Euro size={14} />
            </span>
            <span>2. Rémunération du Voyageur &amp; Séquestre Bancaire</span>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Commission proposée au voyageur (€)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400 font-bold text-sm">€</span>
                  <input
                    type="number"
                    min="10"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800/60 font-black text-sm text-slate-900 dark:text-white outline-none tabular-nums"
                  />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block tabular-nums">
                  Recommandé pour ce panier : <strong className="text-[#059669]">{Math.max(15, Math.round(itemsSubtotal * 0.18))} €</strong>
                </span>
              </div>

              {/* Financial Recap Card */}
              <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-[#E2E8F0] dark:border-slate-700 space-y-1.5 text-xs tabular-nums">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Prix d'achat réel en boutique :</span>
                  <span className="font-bold">{itemsSubtotal} €</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Commission nette voyageur :</span>
                  <span className="font-bold text-[#059669]">+{commNum} €</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>Frais séquestre Stripe &amp; assurance (3%) :</span>
                  <span>{stripeEscrowFee} €</span>
                </div>
                <div className="pt-1.5 border-t border-[#E2E8F0] dark:border-slate-700 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                  <span>Total bloqué sous séquestre :</span>
                  <span className="text-[#059669]">{totalBudget} €</span>
                </div>
              </div>
            </div>

            {/* Negotiation Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/40 border border-[#E2E8F0] dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Handshake size={18} className="text-[#059669]" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-200">
                  Accepter les contre-propositions de commission ?
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptNegotiation}
                  onChange={(e) => setAcceptNegotiation(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#059669]" />
              </label>
            </div>
          </div>
        </div>

        {/* Block 3: Logistique & Remise en Main Propre */}
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/90 overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 bg-slate-900 dark:bg-slate-850 text-white flex items-center justify-between font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-[#059669]/20 flex items-center justify-center text-[#059669]">
                <MapPin size={14} />
              </span>
              <span>3. Trajet, Date Limite &amp; Destinataire</span>
            </div>
            <span className="text-[10px] font-semibold bg-white/10 px-2.5 py-0.5 rounded-full text-slate-200">
              Saisie libre monde entier
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Quick Corridor Chips */}
            <div>
              <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Villes d'achat &amp; livraison fréquentes
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { from: "Paris", to: "Alger" },
                  { from: "Marseille", to: "Oran" },
                  { from: "Lyon", to: "Constantine" },
                  { from: "Paris", to: "Casablanca" },
                ].map((chip) => (
                  <button
                    key={`${chip.from}-${chip.to}`}
                    type="button"
                    onClick={() => {
                      setDepartureLocation(chip.from);
                      setDeliveryLocation(chip.to);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                      departureLocation === chip.from && deliveryLocation === chip.to
                        ? "border-[#059669] bg-[#ECFDF5] text-[#059669]"
                        : "border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    {chip.from} <ArrowRight size={11} className="text-slate-400 inline mx-0.5" /> {chip.to}
                  </button>
                ))}
              </div>
            </div>

            {/* Departure / Arrival with Swap Button */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-end">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Ville d'achat souhaitée
                </label>
                <CityAutocomplete
                  name="departureLocation"
                  value={departureLocation}
                  onChange={setDepartureLocation}
                  placeholder="Ex : Paris, Marseille, Milan, Dubaï..."
                />
              </div>

              <div className="flex justify-center pb-1">
                <button
                  type="button"
                  onClick={() => {
                    const temp = departureLocation;
                    setDepartureLocation(deliveryLocation);
                    setDeliveryLocation(temp);
                  }}
                  title="Inverser les villes"
                  aria-label="Inverser les villes"
                  className="w-10 h-10 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <ArrowLeftRight size={18} />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Ville de livraison finale
                </label>
                <CityAutocomplete
                  name="deliveryLocation"
                  value={deliveryLocation}
                  onChange={setDeliveryLocation}
                  placeholder="Ex : Alger, Oran, Constantine, Batna..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Date limite de réception souhaitée
                </label>
                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Destinataire (Nom &amp; Contact)
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Personne qui recevra la livraison"
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Big Oceanic Blue Pill CTA Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer tabular-nums"
        >
          <Send size={18} strokeWidth={2.4} />
          <span>Publier ma commande d'achat ({basket.length} articles · {totalBudget} €)</span>
        </button>
      </form>

      {/* 3. Section "Mes commandes récentes" */}
      <section className={`space-y-4 pt-2 ${activeView === 'browse' ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#059669] rounded-full inline-block" />
            <span>Mes commandes d'achat récentes</span>
            {shoppingRequests.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] dark:bg-slate-800 text-slate-700 dark:text-slate-300 tabular-nums">
                {shoppingRequests.length}
              </span>
            )}
          </h2>

          {shoppingRequests.length > 0 && (
            <button
              type="button"
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Voir tout</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {shoppingRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shoppingRequests.map((req) => (
              <UnifiedListingCard
                key={req.id}
                request={req}
                onSelect={() => onRequest?.(req)}
                ctaLabel="Voir la commande"
              />
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-10 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/60 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto shadow-xs">
              <ShoppingCart size={26} />
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Aucune commande d'achat pour le moment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Remplissez vos articles ci-dessus et cliquez sur « Publier ma commande » pour trouver un voyageur acheteur.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 5. Mobile Sticky Shopping Dock */}
      <div className="fixed bottom-[calc(var(--nav-height,64px)+env(safe-area-inset-bottom,0px))] inset-x-0 z-30 p-3 bg-[#FFFFFF]/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between gap-3 sm:hidden shadow-lg tabular-nums">
        <div className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {basket.length} article(s) · {itemsSubtotal} €
          </span>
          <span className="text-xs font-extrabold text-[#059669] truncate block">
            Gain voyageur : +{commNum} €
          </span>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={basket.length === 0}
          className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <ShoppingCart size={14} />
          <span>Commander ({totalBudget} €)</span>
        </button>
      </div>
    </div>
  );
};
