import React, { useState, useMemo } from 'react';
import { PlatformMode, ProductItem, FreightItem, TransportType } from './types';
import { products, freightOffers, notifications } from './data/mockData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoriesBar } from './components/CategoriesBar';
import { ProductCard } from './components/ProductCard';
import { FreightCard } from './components/FreightCard';
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
import { LuggageVisualHelperModal } from './components/Modals/LuggageVisualHelperModal';
import { DepartureInspectionModal } from './components/Modals/DepartureInspectionModal';
import { GpsTrackingModal } from './components/Modals/GpsTrackingModal';

// Auth & Dashboards
import { AuthModal } from './components/Auth/AuthModal';
import { VoyageurDashboard } from './components/Dashboards/VoyageurDashboard';
import { CarrierDashboard } from './components/Dashboards/CarrierDashboard';
import { ExpediteurDashboard } from './components/Dashboards/ExpediteurDashboard';

function MainAppContent() {
  const { activeDashboard, setActiveDashboard } = useAuth();
  const [mode, setMode] = useState<PlatformMode>('shop');
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterTransport, setFilterTransport] = useState<TransportType | 'all'>('all');
  
  // Default destination array containing Alger by default!
  const [filterDestinations, setFilterDestinations] = useState<string[]>(['Alger']);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedFreight, setSelectedFreight] = useState<FreightItem | null>(null);
  const [proofProduct, setProofProduct] = useState<ProductItem | null>(null);
  const [pinDeliveryProduct, setPinDeliveryProduct] = useState<ProductItem | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  
  // New Modals from BagVoyage / Colis-Voiturage
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [isLuggageHelperOpen, setIsLuggageHelperOpen] = useState(false);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [isGpsTrackingOpen, setIsGpsTrackingOpen] = useState(false);

  // Mobile Bottom Tab
  const [mobileTab, setMobileTab] = useState('home');

  // Filtered Products for Shop & Go
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch = 
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.originStore.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategory === 'all' || item.category === selectedCategory;

      const matchesDestinations =
        filterDestinations.length === 0 ||
        filterDestinations.some(d => 
          item.destination.toLowerCase().includes(d.toLowerCase()) ||
          item.destinationCode.toLowerCase().includes(d.toLowerCase())
        );

      return matchesSearch && matchesCategory && matchesDestinations;
    });
  }, [searchQuery, selectedCategory, filterDestinations]);

  // Filtered Freight items for Bag & Go
  const filteredFreight = useMemo(() => {
    return freightOffers.filter((item) => {
      const matchesSearch = 
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.travelerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTransport = 
        filterTransport === 'all' || item.transportType === filterTransport;

      const matchesDestinations =
        filterDestinations.length === 0 ||
        filterDestinations.some(d => 
          item.destination.toLowerCase().includes(d.toLowerCase()) ||
          item.destinationCode.toLowerCase().includes(d.toLowerCase())
        );

      return matchesSearch && matchesTransport && matchesDestinations;
    });
  }, [searchQuery, filterTransport, filterDestinations]);

  // Handle Search from Hero
  const handleHeroSearch = (origin: string, destinations: string[], transport: TransportType | 'all') => {
    setFilterDestinations(destinations);
    setFilterTransport(transport);
  };

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
      
      {/* Header with Auth state & Dashboard navigation */}
      <Header
        mode={mode}
        onModeChange={(newMode) => {
          setMode(newMode);
          setSelectedCategory('all');
        }}
        isPhoneFrame={isPhoneFrame}
        onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        notifications={notifications}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {/* Hero Section with default Marseille ➔ Alger & Multi-Cities */}
        <HeroSection
          mode={mode}
          onSearch={handleHeroSearch}
          onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          onOpenLuggageHelper={() => setIsLuggageHelperOpen(true)}
          onOpenGpsTracking={() => setIsGpsTrackingOpen(true)}
          onOpenMessaging={() => setIsMessagingOpen(true)}
          onOpenInspection={() => setIsInspectionOpen(true)}
        />

        {/* Categories Carousel */}
        <CategoriesBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Main Feed Section ("Boutique Inversée" or "Fret & Bagages") */}
        <section id="offres" className="py-8 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {mode === 'shop' 
                      ? 'Nos articles disponibles (Marseille ➔ Alger & Monde)' 
                      : '🔥 Offres de Fret & Traversées (Marseille ➔ Alger & Maghreb)'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  {mode === 'shop'
                    ? 'Achetez en duty-free ou boutiques officielles et faites livrer par des voyageurs vérifiés.'
                    : 'Ferrys et vols au départ de Marseille, Paris et Lyon vers Alger, Oran et l\'international.'}
                </p>
              </div>

              {/* Reset filter badge if filtered */}
              {(selectedCategory !== 'all' || filterDestinations.length > 0 || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setFilterDestinations(['Alger']);
                    setSearchQuery('');
                    setFilterTransport('all');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold underline"
                >
                  Réinitialiser (Alger par défaut)
                </button>
              )}
            </div>

            {/* Grid display */}
            {mode === 'shop' ? (
              filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelect={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
                  <p className="text-slate-400 text-sm font-semibold">Aucun article ne correspond à votre filtre de villes.</p>
                  <button
                    onClick={() => { setSelectedCategory('all'); setFilterDestinations(['Alger', 'Abidjan', 'Dakar']); }}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
                  >
                    Afficher toutes les destinations
                  </button>
                </div>
              )
            ) : (
              filteredFreight.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                  {filteredFreight.map((item) => (
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
              ) : (
                <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
                  <p className="text-slate-400 text-sm font-semibold">Aucun trajet de fret trouvé pour ces critères.</p>
                  <button
                    onClick={() => { setFilterTransport('all'); setFilterDestinations(['Alger', 'Oran']); }}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
                  >
                    Voir les traversées Marseille ➔ Alger / Oran
                  </button>
                </div>
              )
            )}

          </div>
        </section>

        {/* Shopper Banner (Call-to-Action for travelers) */}
        <ShopperBanner
          mode={mode}
          onOpenPublishModal={() => setIsPublishModalOpen(true)}
        />

        {/* How It Works Pedagogical Section */}
        <HowItWorks
          mode={mode}
          onOpenDetails={() => setIsHowItWorksOpen(true)}
        />

        {/* Security & KYC Institutional Section */}
        <SecuritySection />
      </main>

      {/* Footer */}
      <Footer
        mode={mode}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        mode={mode}
        activeTab={mobileTab}
        onTabChange={(tab) => {
          setMobileTab(tab);
          if (tab === 'messages') setIsMessagingOpen(true);
          if (tab === 'profile') setActiveDashboard('voyageur');
        }}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
      />

      {/* MODALS */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAcceptMission={handleAcceptMission}
      />

      <ProofUploadModal
        product={proofProduct}
        onClose={() => setProofProduct(null)}
        onProceedToDelivery={handleProceedToDelivery}
      />

      <PinDeliveryModal
        product={pinDeliveryProduct}
        onClose={() => setPinDeliveryProduct(null)}
        onSuccessFinished={handleSuccessFinished}
      />

      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        mode={mode}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        mode={mode}
      />

      {/* New Specialized Modals from BagVoyage / Colis-Voiturage */}
      <MessagingModal
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        onPayCommission={() => {
          alert("Paiement de la commission fixe de mise en relation (5,00 €) via Stripe Checkout sécurisé. Discussion débloquée !");
          setIsMessagingOpen(false);
        }}
      />

      <LuggageVisualHelperModal
        isOpen={isLuggageHelperOpen}
        onClose={() => setIsLuggageHelperOpen(false)}
        onSelectFormat={(fmt) => {
          alert(`Format de colis ${fmt} sélectionné avec succès !`);
        }}
      />

      <DepartureInspectionModal
        isOpen={isInspectionOpen}
        onClose={() => setIsInspectionOpen(false)}
      />

      <GpsTrackingModal
        isOpen={isGpsTrackingOpen}
        onClose={() => setIsGpsTrackingOpen(false)}
      />

      {/* AUTH & DEDICATED DASHBOARDS */}
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
          setIsInspectionOpen(true);
        }}
        onOpenPublish={() => {
          setActiveDashboard('none');
          setIsPublishModalOpen(true);
        }}
      />

      <CarrierDashboard
        isOpen={activeDashboard === 'transporteur'}
        onClose={() => setActiveDashboard('none')}
        onOpenPublish={() => {
          setActiveDashboard('none');
          setIsPublishModalOpen(true);
        }}
      />

      <ExpediteurDashboard
        isOpen={activeDashboard === 'expediteur'}
        onClose={() => setActiveDashboard('none')}
        onOpenGps={() => {
          setActiveDashboard('none');
          setIsGpsTrackingOpen(true);
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
