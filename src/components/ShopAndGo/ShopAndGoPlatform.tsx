import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Euro,
  FileCheck2,
  Handshake,
  Image,
  Info,
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
  const { user } = useAuth();

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
      image: photoPreview || '/images/hero-luxury-shopping-arcade.jpg',
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
      {/* 1. Hero Photographic Banner */}
      <section className="relative overflow-hidden rounded-[28px] bg-[#072a4a] text-white shadow-xl border border-cyan-500/25">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: "url('/images/hero-luxury-shopping-arcade.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#072a4a]/95 via-[#072a4a]/85 to-[#072a4a]/40 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#072a4a]/90 via-transparent to-black/20" />

        <div className="relative p-5 sm:p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 backdrop-blur-md border border-cyan-400/40 text-cyan-200 text-xs font-semibold">
              <ShoppingCart size={13} className="text-cyan-300" />
              <span>Shop &amp; Go · Panier Multi-Articles &amp; Achat en Boutique</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
              Commandez en boutique &amp; Duty-Free dans le monde entier
            </h1>

            <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed font-medium max-w-lg drop-shadow-sm">
              Ajoutez vos articles au panier (duty-free, high-tech, parfumerie, pharmacie). Les voyageurs certifiés achètent avec ticket de caisse obligatoire sous séquestre Stripe.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-cyan-200">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Receipt size={14} className="text-cyan-300" />
                <span>Ticket de caisse obligatoire</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Lock size={14} className="text-cyan-300" />
                <span>Séquestre bancaire Stripe</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <ShieldCheck size={14} className="text-cyan-300" />
                <span>Remise en main propre</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center p-5 rounded-2xl bg-[#062c47]/80 backdrop-blur-md border border-cyan-400/30 text-center shadow-xl min-w-[200px]">
            <div className="w-16 h-16 rounded-full bg-cyan-400/20 flex items-center justify-center mb-2">
              <ShoppingBag size={32} className="text-cyan-300 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide uppercase">Boutiques &amp; Duty-Free</span>
            <span className="text-[10px] text-cyan-200 mt-0.5">Paris · Milan · Dubaï · Londres</span>
          </div>
        </div>
      </section>

      {/* Confirmation Toast */}
      {publishedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 size={18} strokeWidth={2.5} />
          <span>Votre commande d'achat groupée a été publiée et transmise aux voyageurs en partance !</span>
        </div>
      )}

      {/* Mandatory Proof of Purchase & Receipt Policy Notice Banner */}
      <section className="rounded-2xl border border-cyan-200/90 dark:border-cyan-800/80 bg-gradient-to-r from-cyan-50/80 via-white to-cyan-50/50 dark:from-cyan-950/40 dark:via-slate-900 dark:to-cyan-950/30 p-4 sm:p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-900/60 text-[#00838f] dark:text-cyan-300 flex items-center justify-center shrink-0">
            <FileCheck2 size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-xs sm:text-sm text-[#072a4a] dark:text-white flex items-center gap-2">
              <span>Garantie Transparence : Reçu &amp; Ticket de caisse officiel</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Contrôle Anti-Fraude
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Le voyageur avance le paiement en magasin certifié et photographie le ticket de caisse officiel dans l'application. Le montant réel déboursé est remboursé à l'euro près depuis votre séquestre Stripe, accompagné de sa commission de transport.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Shop Budget Visualizer Animation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#072a4a] dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#00bcd4]" />
            Simulation &amp; Ventilation du Séquestre Bancaire
          </span>
          <button
            type="button"
            onClick={() => setShowVisualizer(!showVisualizer)}
            className="text-xs font-bold text-[#00838f] dark:text-cyan-400 hover:underline"
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Block 1: Mon Panier d'Articles */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#00838f] via-[#0097a7] to-[#00bcd4] text-white flex items-center justify-between font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                <ShoppingCart size={14} />
              </span>
              <span>1. Mon Panier d'Articles ({basket.length})</span>
            </div>
            <span className="text-[11px] normal-case bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">
              Sous-total articles : {itemsSubtotal} €
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Basket Items List */}
            <div className="space-y-3">
              {basket.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 text-[#00838f] dark:text-cyan-300 font-black text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-semibold text-[#00838f] dark:text-cyan-400">
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
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      {item.price * item.quantity} €
                    </span>
                    {basket.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
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
                className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-cyan-400/60 dark:border-cyan-700/60 bg-cyan-50/30 dark:bg-cyan-950/20 hover:bg-cyan-50/60 text-[#00838f] dark:text-cyan-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Plus size={16} />
                <span>Ajouter un autre article au panier</span>
              </button>
            ) : (
              <div className="p-4 rounded-xl border border-cyan-300 dark:border-cyan-700 bg-cyan-50/30 dark:bg-cyan-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#072a4a] dark:text-white flex items-center gap-1.5">
                    <Plus size={14} className="text-[#00838f] dark:text-cyan-400" />
                    Nouvel article à faire acheter
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingItem(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Annuler
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Nom de l'article &amp; référence précise
                    </label>
                    <input
                      type="text"
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      placeholder="Ex : Coffret Chocolat Pierre Hermé 24 pièces, iPad Air 128Go..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Type d'enseigne / Boutique
                    </label>
                    <select
                      value={newItemStoreCat}
                      onChange={(e) => {
                        setNewItemStoreCat(e.target.value);
                        setNewItemStoreName(e.target.value);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {STORE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.label}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Nom du magasin spécifique (optionnel)
                    </label>
                    <input
                      type="text"
                      value={newItemStoreName}
                      onChange={(e) => setNewItemStoreName(e.target.value)}
                      placeholder="Ex : Sephora Champs-Élysées, Duty Free Orly 3..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Prix estimé (€)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Quantité
                    </label>
                    <select
                      value={newItemQuantity}
                      onChange={(e) => setNewItemQuantity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Lien du produit ou note pour le voyageur
                    </label>
                    <input
                      type="text"
                      value={newItemUrl}
                      onChange={(e) => setNewItemUrl(e.target.value)}
                      placeholder="Lien web direct ou précision de taille/couleur..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddItemToBasket}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00838f] to-[#00bcd4] text-white font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                >
                  Valider et ajouter au panier
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Block 2: Commission Voyageur & Ventilation Financière */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#00838f] via-[#0097a7] to-[#00bcd4] text-white flex items-center gap-2.5 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
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
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-black text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Recommandé pour ce panier : <strong>{Math.max(15, Math.round(itemsSubtotal * 0.18))} €</strong>
                </span>
              </div>

              {/* Financial Recap Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Prix d'achat réel en boutique :</span>
                  <span className="font-bold">{itemsSubtotal} €</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Commission nette voyageur :</span>
                  <span className="font-bold text-[#00838f] dark:text-cyan-400">{commNum} €</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>Frais séquestre Stripe &amp; assurance (3%) :</span>
                  <span>{stripeEscrowFee} €</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm text-[#072a4a] dark:text-white">
                  <span>Total bloqué sous séquestre :</span>
                  <span className="text-[#00838f] dark:text-cyan-400">{totalBudget} €</span>
                </div>
              </div>
            </div>

            {/* Negotiation Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Handshake size={18} className="text-[#00838f] dark:text-cyan-400" />
                <span className="font-bold text-xs sm:text-sm text-[#072a4a] dark:text-slate-200">
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
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00bcd4]" />
              </label>
            </div>
          </div>
        </div>

        {/* Block 3: Logistique & Remise en Main Propre */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#00838f] via-[#0097a7] to-[#00bcd4] text-white flex items-center gap-2.5 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
              <MapPin size={14} />
            </span>
            <span>3. Trajet, Date Limite &amp; Destinataire</span>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Ville d'achat souhaitée
              </label>
              <input
                type="text"
                value={departureLocation}
                onChange={(e) => setDepartureLocation(e.target.value)}
                placeholder="Ex : Paris, France / Milan, Italie..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Ville de livraison finale
              </label>
              <input
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="Ex : Alger, Oran, Constantine, Tunis..."
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Date limite de réception souhaitée
              </label>
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500"
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
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Big Oceanic Cyan Pill CTA Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#0077b6] hover:from-[#00a2c7] hover:to-[#00669e] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <Send size={18} strokeWidth={2.4} />
          <span>Publier ma commande d'achat ({basket.length} articles · {totalBudget} €)</span>
        </button>
      </form>

      {/* 3. Section "Mes commandes récentes" */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#072a4a] dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#00bcd4] rounded-full inline-block" />
            <span>Mes commandes d'achat récentes</span>
            {shoppingRequests.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-[#00838f] dark:text-cyan-300">
                {shoppingRequests.length}
              </span>
            )}
          </h2>

          {shoppingRequests.length > 0 && (
            <button
              type="button"
              className="text-xs font-bold text-[#00838f] dark:text-cyan-400 hover:underline flex items-center gap-1"
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
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200/60 dark:border-cyan-800/60 flex items-center justify-center shrink-0 overflow-hidden">
                    {req.image && req.image.startsWith('http') ? (
                      <img src={req.image} alt={req.title} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingCart size={24} className="text-[#00838f] dark:text-cyan-400" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-[#072a4a] dark:text-white">
                      {req.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/40 text-[#00838f] dark:text-cyan-300">
                        {req.specifications?.includes('Articles:')
                          ? 'Panier multi-articles'
                          : 'Achat boutique certifiée'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {req.location} • Sous 2-3 jours
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                      <span>Articles : {req.budget - req.reward} €</span>
                      <span className="text-slate-400 mx-1.5">|</span>
                      <span>Commission : {req.reward} €</span>
                      <span className="text-slate-400 mx-1.5">|</span>
                      <span className="text-[#00838f] dark:text-cyan-400 font-extrabold">Total séquestré : {req.budget} €</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60">
                    <Clock size={13} />
                    <span>En attente acheteur</span>
                  </span>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-[#00838f] dark:text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
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
    </div>
  );
};
