import React, { useState, useMemo } from 'react';
import { MainPillar, ProductItem, FreightItem, SenderParcelRequest, ReceiverShoppingRequest } from './types';
import { products, freightOffers, senderParcelRequests, receiverShoppingRequests, notifications } from './data/mockData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { ThreePillarsTabs } from './components/ThreePillarsTabs';
import { HeroSection } from './components/HeroSection';
import { CategoriesBar } from './components/CategoriesBar';
import { ProductCard } from './components/ProductCard';
import { FreightCard } from './components/FreightCard';
import { SenderParcelCard } from './components/SenderParcelCard';
import { ReceiverShoppingCard } from './components/ReceiverShoppingCard';
import { ShopperBanner } from './components/ShopperBanner';
import { HowItWorks } from './components/HowItWorks';
import { SecuritySection } from './components/SecuritySection';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PhoneSimulator } from './components/PhoneSimulator';

// Modals
import { ProductDetailModal } from './components/Modals/ProductDetailModal';
import { ProofUploadModal } from './components/Modals/ProofUploadModal';
import { PinDeliveryModal } from './components/Modals/PinDeliveryModal';
import { PublishModal } from './components/Modals/PublishModal';
import { HowItWorksModal } from './components/Modals/HowItWorksModal';
import { MessagingModal } from './components/Modals/MessagingModal';

// Auth & Dashboards
import { AuthModal } from './components/Auth/AuthModal';
import { VoyageurDashboard } from './components/Dashboards/VoyageurDashboard';
import { CarrierDashboard } from './components/Dashboards/CarrierDashboard';
import { ExpediteurDashboard } from './components/Dashboards/ExpediteurDashboard';

import { Plane, Package, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

function MainAppContent() {
  const { activeDashboard, setActiveDashboard } = useAuth();
  
  // Le pilier actif parmi les 3 piliers demandés par le client :
  const [activePillar, setActivePillar] = useState<MainPillar>('voyageur');

  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Dynamic datasets allowing real-time publishing
  const [tripsList, setTripsList] = useState<FreightItem[]>(freightOffers);
  const [parcelsList, setParcelsList] = useState<SenderParcelRequest[]>(senderParcelRequests);
  const [shoppingList, setShoppingList] = useState<ReceiverShoppingRequest[]>(receiverShoppingRequests);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedFreight, setSelectedFreight] = useState<FreightItem | null>(null);
  const [proofProduct, setProofProduct] = useState<ProductItem | null>(null);
  const [pinDeliveryProduct, setPinDeliveryProduct] = useState<ProductItem | null>(null);
  
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishModalTab, setPublishModalTab] = useState<MainPillar>('voyageur');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  // Mobile Bottom Tab
  const [mobileTab, setMobileTab] = useState('home');

  // Open publish modal with preset tab
  const handleOpenPublish = (tab: MainPillar = activePillar) => {
    setPublishModalTab(tab);
    setIsPublishModalOpen(true);
  };

  // Add new trip created by traveler
  const handleTripCreated = (newTrip: FreightItem) => {
    setTripsList([newTrip, ...tripsList]);
  };

  // Add new parcel created by sender
  const handleParcelCreated = (newParcel: SenderParcelRequest) => {
    setParcelsList([newParcel, ...parcelsList]);
  };

  // Add new shopping request created by receiver
  const handleShoppingCreated = (newShop: ReceiverShoppingRequest) => {
    setShoppingList([newShop, ...shoppingList]);
  };

  // Search filter for trips (Volet Expéditeur)
  const [filterOrigin, setFilterOrigin] = useState('');
  const [filterDest, setFilterDest] = useState('');

  const filteredTrips = useMemo(() => {
    return tripsList.filter((item) => {
      const matchSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.travelerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchOrigin = !filterOrigin || item.origin.toLowerCase().includes(filterOrigin.toLowerCase());
      const matchDest = !filterDest || item.destination.toLowerCase().includes(filterDest.toLowerCase());

      return matchSearch && matchOrigin && matchDest;
    });
  }, [tripsList, searchQuery, filterOrigin, filterDest]);

  // Filtered Products for Destinataire (Volet 3)
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchSearch = !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destination.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Handlers for Mission Accept flow
  const handleAcceptMission = (product: ProductItem) => {
    setSelectedProduct(null);
    setProofProduct(product);
  };

  const handleProceedToDelivery = () => {
    const currentProd = proofProduct;
    setProofProduct(null);
    setPinDeliveryProduct(currentProd);
  };

  const handleSuccessFinished = () => {
    setPinDeliveryProduct(null);
  };

  const mainLayout = (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-20 sm:pb-0">
      
      {/* Header avec Navigation principale */}
      <Header
        activePillar={activePillar}
        onSelectPillar={setActivePillar}
        isPhoneFrame={isPhoneFrame}
        onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        notifications={notifications}
        onOpenPublishModal={handleOpenPublish}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 3 Pillars Tabs Bar */}
      <ThreePillarsTabs
        activePillar={activePillar}
        onSelectPillar={setActivePillar}
      />

      <main className="flex-1">
        {/* Hero Section adaptatif */}
        <HeroSection
          activePillar={activePillar}
          onSelectPillar={setActivePillar}
          onPublishTrip={handleTripCreated}
          onSearchTrips={(orig, dest) => {
            setFilterOrigin(orig);
            setFilterDest(dest);
          }}
          onOpenPublishParcel={() => handleOpenPublish('expediteur')}
          onOpenPublishProduct={() => handleOpenPublish('destinataire')}
          onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        />

        {/* =================================================================== */}
        {/* VOLET 1 : CONTENU POUR LE VOYAGEUR                                  */}
        {/* =================================================================== */}
        {activePillar === 'voyageur' && (
          <section id="section-resultats" className="py-8 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto space-y-10">
              
              {/* Opportunité A : Colis en attente à transporter */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                        Colis en attente d'un voyageur (Marseille ➔ Alger)
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Ces expéditeurs sont prêts à payer pour que vous preniez leur colis dans votre valise.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenPublish('expediteur')}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 underline text-left"
                  >
                    + Déposer un colis à faire acheminer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {parcelsList.map((parcel) => (
                    <SenderParcelCard
                      key={parcel.id}
                      request={parcel}
                      onAccept={(req) => {
                        alert(`Vous avez accepté de transporter le colis de ${req.senderName} (${req.weightKg} kg) pour ${req.budgetOffer} €. Ouverture de la messagerie...`);
                        setIsMessagingOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Opportunité B : Achats demandés (Shopper Duty Free & Magasins) */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                        Demandes d'achats à rapporter (Commissions offertes)
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Achetez en boutique ou en Duty Free à Marseille/Paris et touchez une commission nette à la remise à Alger.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenPublish('destinataire')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline text-left"
                  >
                    + Faire une demande d'achat
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {shoppingList.map((shop) => (
                    <ReceiverShoppingCard
                      key={shop.id}
                      request={shop}
                      onAccept={(req) => {
                        alert(`Mission d'achat acceptée pour ${req.productName} ! Commission garantie : +${req.offeredCommission} €. Les fonds de l'acheteur sont sécurisés sous séquestre.`);
                        setIsMessagingOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Trajets déjà déclarés par la communauté */}
              <div>
                <div className="mb-4">
                  <h4 className="text-base font-extrabold text-slate-900">
                    Trajets déjà publiés sur la ligne Marseille ➔ Alger
                  </h4>
                  <p className="text-xs text-slate-500">
                    Vos annonces et celles des autres voyageurs certifiés.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTrips.slice(0, 3).map((item) => (
                    <FreightCard
                      key={item.id}
                      item={item}
                      onSelect={(fr) => {
                        setSelectedFreight(fr);
                        setIsMessagingOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* VOLET 2 : CONTENU POUR L'EXPÉDITEUR (QUI ENVOIE UN COLIS)           */}
        {/* =================================================================== */}
        {activePillar === 'expediteur' && (
          <section id="section-resultats" className="py-8 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Voyageurs disponibles pour transporter votre colis
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Ces voyageurs partent prochainement et ont coché l'option <strong>« Prêt à transporter le colis d'un tiers »</strong>.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenPublish('expediteur')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
                >
                  + Déposer une annonce de colis
                </button>
              </div>

              {/* Liste des voyageurs avec kilos disponibles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTrips
                  .filter(trip => trip.canCarryParcel)
                  .map((item) => (
                    <FreightCard
                      key={item.id}
                      item={item}
                      onSelect={(fr) => {
                        setSelectedFreight(fr);
                        setIsMessagingOpen(true);
                      }}
                    />
                  ))}
              </div>

              {/* Colis déjà déposés par la communauté */}
              <div className="pt-6 border-t border-slate-200">
                <h4 className="text-base font-extrabold text-slate-900 mb-3">
                  Autres colis déposés par des particuliers
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {parcelsList.map((parcel) => (
                    <SenderParcelCard
                      key={parcel.id}
                      request={parcel}
                      onAccept={(req) => {
                        setIsMessagingOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* VOLET 3 : CONTENU POUR LE DESTINATAIRE (QUI REÇOIT UN PRODUIT)      */}
        {/* =================================================================== */}
        {activePillar === 'destinataire' && (
          <section id="section-resultats" className="py-8 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      La Boutique Inversée (Marseille ➔ Alger)
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Sélectionnez un article officiel ci-dessous ou demandez à un voyageur de faire vos courses en magasin ou en Duty Free.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenPublish('destinataire')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
                >
                  + Demander un article sur-mesure
                </button>
              </div>

              {/* Catégories de shopping */}
              <CategoriesBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* Grille des articles du catalogue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>

              {/* Voyageurs qui achètent en magasin */}
              <div className="pt-6 border-t border-slate-200">
                <h4 className="text-base font-extrabold text-slate-900 mb-3">
                  Voyageurs prêts à acheter pour vous en magasin
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTrips
                    .filter(trip => trip.canBuyProduct)
                    .map((item) => (
                      <FreightCard
                        key={item.id}
                        item={item}
                        onSelect={(fr) => {
                          setSelectedFreight(fr);
                          setIsMessagingOpen(true);
                        }}
                      />
                    ))}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* Pedagogical Banner */}
        <ShopperBanner
          mode={activePillar === 'destinataire' ? 'shop' : 'bag'}
          onOpenPublishModal={() => handleOpenPublish(activePillar)}
        />

        {/* How It Works */}
        <HowItWorks
          mode={activePillar === 'destinataire' ? 'shop' : 'bag'}
          onOpenDetails={() => setIsHowItWorksOpen(true)}
        />

        {/* Sécurité simplifiée et claire */}
        <SecuritySection />
      </main>

      {/* Footer */}
      <Footer
        mode={activePillar === 'destinataire' ? 'shop' : 'bag'}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenPublishModal={() => handleOpenPublish(activePillar)}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        mode={activePillar === 'destinataire' ? 'shop' : 'bag'}
        activeTab={mobileTab}
        onTabChange={(tab) => {
          setMobileTab(tab);
          if (tab === 'messages') setIsMessagingOpen(true);
          if (tab === 'profile') setActiveDashboard('voyageur');
        }}
        onOpenPublishModal={() => handleOpenPublish(activePillar)}
      />

      {/* =================================================================== */}
      {/* MODALS INTERACTIVES                                                 */}
      {/* =================================================================== */}
      
      {/* Fiche Produit (Boutique Inversée) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAcceptMission={handleAcceptMission}
      />

      {/* Téléversement Preuve d'achat (pour le Shopper) */}
      <ProofUploadModal
        product={proofProduct}
        onClose={() => setProofProduct(null)}
        onProceedToDelivery={handleProceedToDelivery}
      />

      {/* Clôture par code PIN (remise en main propre) */}
      <PinDeliveryModal
        product={pinDeliveryProduct}
        onClose={() => setPinDeliveryProduct(null)}
        onSuccessFinished={handleSuccessFinished}
      />

      {/* Modal de Publication à 3 Onglets (Voyageur / Expéditeur / Destinataire) */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        initialTab={publishModalTab}
        onTripCreated={handleTripCreated}
        onParcelCreated={handleParcelCreated}
        onShoppingCreated={handleShoppingCreated}
      />

      {/* Comment ça marche */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        mode={activePillar === 'destinataire' ? 'shop' : 'bag'}
      />

      {/* Messagerie sécurisée */}
      <MessagingModal
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        onPayCommission={() => {
          alert("Paiement de la commission de mise en relation (5,00 €) via Stripe Checkout sécurisé. Discussion débloquée !");
          setIsMessagingOpen(false);
        }}
      />

      {/* Authentification & Dashboards */}
      <AuthModal />

      <VoyageurDashboard
        isOpen={activeDashboard === 'voyageur'}
        onClose={() => setActiveDashboard('none')}
        onOpenUploadProof={() => {
          setActiveDashboard('none');
          setProofProduct(products[0]);
        }}
        onOpenPinModal={() => {
          setActiveDashboard('none');
          setPinDeliveryProduct(products[0]);
        }}
        onOpenInspection={() => {
          setActiveDashboard('none');
        }}
        onOpenPublish={() => {
          setActiveDashboard('none');
          handleOpenPublish('voyageur');
        }}
      />

      <CarrierDashboard
        isOpen={activeDashboard === 'transporteur'}
        onClose={() => setActiveDashboard('none')}
        onOpenPublish={() => {
          setActiveDashboard('none');
          handleOpenPublish('voyageur');
        }}
      />

      <ExpediteurDashboard
        isOpen={activeDashboard === 'expediteur'}
        onClose={() => setActiveDashboard('none')}
        onOpenGps={() => {
          setActiveDashboard('none');
        }}
        onOpenMessaging={() => {
          setActiveDashboard('none');
          setIsMessagingOpen(true);
        }}
      />

    </div>
  );

  if (isPhoneFrame) {
    return (
      <PhoneSimulator onClose={() => setIsPhoneFrame(false)}>
        {mainLayout}
      </PhoneSimulator>
    );
  }

  return mainLayout;
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
