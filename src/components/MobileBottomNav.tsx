import React from "react";
import { Home, Plane, ScanLine, MessageCircle, UserRound } from "lucide-react";
import { PlatformMode } from "../types";

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
  unreadCount = 0,
}) => {
  const tabs = [
    { id: "home", label: "Accueil", icon: Home },
    { id: "explore", label: "Voyages", icon: Plane },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "profile", label: "Profil", icon: UserRound },
  ];
  const tab = (item: (typeof tabs)[number]) => (
    <button
      key={item.id}
      aria-current={activeTab === item.id ? "page" : undefined}
      aria-label={
        item.id === "messages" && unreadCount > 0
          ? `Messages, ${unreadCount} non lus`
          : item.label
      }
      onClick={() => {
        onTabChange(item.id);
        if (item.id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
        if (item.id === "explore")
          document
            .getElementById("section-resultats")
            ?.scrollIntoView({ behavior: "smooth" });
      }}
      className={`relative flex min-h-[56px] min-w-0 flex-col items-center justify-center gap-1.5 rounded-2xl transition duration-200 active:scale-95 ${activeTab === item.id ? "bg-blue-50/90 text-blue-700" : "text-slate-500 hover:bg-white/80 hover:text-slate-900"}`}
    >
      <span className="relative">
        <item.icon size={20} strokeWidth={activeTab === item.id ? 2.3 : 1.7} />
        {item.id === "messages" && unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-3 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white ring-2 ring-white"
            aria-live="polite"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </span>
      <span className="text-[9px] font-semibold">{item.label}</span>
    </button>
  );
  return (
    <nav
      aria-label="Navigation principale mobile"
      className="luxury-surface pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-5 sm:hidden"
    >
      <div className="pointer-events-auto mx-auto grid max-w-md grid-cols-[1fr_1fr_1.25fr_1fr_1fr] items-center gap-1 rounded-[30px] border border-white/90 bg-white/80 px-2 py-2 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.25),inset_0_1px_0_white] backdrop-blur-2xl">
        {tabs.slice(0, 2).map(tab)}
        <button
          onClick={onOpenPublishModal}
          aria-label="🎫 Scanner Billet"
          className="group -mt-7 flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-2xl"
        >
          <span className="rounded-full bg-gradient-to-tr from-blue-600 via-indigo-400 to-cyan-200 p-[3px] shadow-[0_4px_24px_rgba(59,130,246,0.4)] transition duration-200 group-hover:scale-105 group-active:scale-95">
            <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-slate-800 to-[#0A1128] text-white">
              <ScanLine size={24} strokeWidth={1.7} />
            </span>
          </span>
          <span className="whitespace-nowrap text-[9px] font-bold text-slate-800">
            Scanner Billet
          </span>
        </button>
        {tabs.slice(2).map(tab)}
      </div>
    </nav>
  );
};
