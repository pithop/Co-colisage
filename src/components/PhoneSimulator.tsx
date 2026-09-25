import React from 'react';
import { Wifi, Battery, Signal, X } from 'lucide-react';

interface PhoneSimulatorProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  children,
  onClose,
}) => {
  return (
    <div className="min-h-screen bg-slate-900 py-6 px-4 flex flex-col items-center justify-center relative">
      
      {/* Floating control bar */}
      <div className="mb-4 flex items-center gap-3 bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 shadow-lg text-xs text-white">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold">Simulateur iPhone 16 Pro (Émulation Native)</span>
        <button
          onClick={onClose}
          className="ml-3 p-1 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
          title="Fermer le simulateur mobile"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* iPhone Device Frame */}
      <div className="relative w-[390px] h-[844px] bg-black rounded-[52px] p-3.5 shadow-[0_25px_70px_rgba(0,0,0,0.8)] border-[6px] border-slate-700 flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-between px-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-950/60" />
        </div>

        {/* Simulated iOS Status Bar */}
        <div className="h-10 px-6 pt-1 flex items-center justify-between text-white text-[12px] font-semibold select-none z-40 bg-white/90 backdrop-blur-md text-slate-900">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Screen Scrollable Viewport */}
        <div className="flex-1 w-full bg-slate-50 overflow-y-auto no-scrollbar relative rounded-b-[40px]">
          {children}
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
};
