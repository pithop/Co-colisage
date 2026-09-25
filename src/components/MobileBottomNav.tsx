import React from 'react';
import { Home, Compass, Plus, MessageCircle, User } from 'lucide-react';
import { PlatformMode } from '../types';

interface MobileBottomNavProps {
  mode: PlatformMode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenPublishModal: () => void;
  unreadCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenPublishModal,
  unreadCount = 3,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-4 py-2 sm:hidden shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Accueil */}
        <button
          onClick={() => {
            onTabChange('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'home' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Accueil</span>
        </button>

        {/* Explorer */}
        <button
          onClick={() => {
            onTabChange('explore');
            const offres = document.getElementById('offres');
            if (offres) offres.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'explore' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Explorer</span>
        </button>

        {/* Central Floating Plus Button */}
        <div className="relative -top-4">
          <button
            onClick={onOpenPublishModal}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
            aria-label="Publier une annonce"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Messages */}
        <button
          onClick={() => onTabChange('messages')}
          className={`relative flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'messages' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <span>Messages</span>
        </button>

        {/* Profil */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profil</span>
        </button>

      </div>
    </div>
  );
};
