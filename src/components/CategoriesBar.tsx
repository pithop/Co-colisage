import React from 'react';
import { 
  Shirt, 
  Footprints, 
  ShoppingBag, 
  Sparkles, 
  Headphones, 
  Home, 
  Grid, 
  ChevronRight 
} from 'lucide-react';
import { categories } from '../data/mockData';

interface CategoriesBarProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
}

export const CategoriesBar: React.FC<CategoriesBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'mode': return <Shirt className="w-4 h-4" />;
      case 'chaussures': return <Footprints className="w-4 h-4" />;
      case 'accessoires': return <ShoppingBag className="w-4 h-4" />;
      case 'parfums': return <Sparkles className="w-4 h-4" />;
      case 'hightech': return <Headphones className="w-4 h-4" />;
      case 'maison': return <Home className="w-4 h-4" />;
      default: return <Grid className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Parcourir par catégories</h3>
            <p className="text-xs text-slate-500">Trouvez facilement les articles demandés par nos clients</p>
          </div>
          <button 
            onClick={() => onSelectCategory('all')}
            className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
              selectedCategory === 'all' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Toutes les catégories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Cards Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className={`group relative text-left rounded-2xl overflow-hidden p-3.5 transition-all duration-200 border ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Photo Preview inside category */}
                <div className="w-full h-24 rounded-xl overflow-hidden mb-3 bg-slate-100 relative">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
                    {getIcon(cat.id)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                    isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-400 group-hover:text-slate-700'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
