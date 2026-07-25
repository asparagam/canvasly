import React, { useState } from 'react';
import type { Screen, FlowConnection } from '../../types';
import { ScreenRenderer } from '../Screens/ScreenRenderer';
import { X, Monitor, Smartphone, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface PrototypeModalProps {
  screens: Screen[];
  flowConnections: FlowConnection[];
  initialScreenId?: string;
  onClose: () => void;
}

export const PrototypeModal: React.FC<PrototypeModalProps> = ({
  screens,
  flowConnections: _flowConnections,
  initialScreenId,
  onClose
}) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState<number>(
    initialScreenId ? Math.max(0, screens.findIndex((s) => s.id === initialScreenId)) : 0
  );
  const [deviceFrame, setDeviceFrame] = useState<'desktop' | 'mobile' | 'raw'>('mobile');
  const [showHotspots, setShowHotspots] = useState<boolean>(true);

  const currentScreen = screens[currentScreenIndex] || screens[0];

  const handleNavigateByTargetType = (targetType?: string) => {
    if (!targetType) return;
    const foundIdx = screens.findIndex((s) => s.type === targetType || s.id === targetType);
    if (foundIdx !== -1) {
      setCurrentScreenIndex(foundIdx);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-between p-4 md:p-6 select-none animate-fadeIn">
      {/* Top Floating Control Bar */}
      <header className="flex justify-between items-center bg-[#121422]/90 border border-slate-800 p-3 rounded-2xl max-w-4xl mx-auto w-full shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold text-white">Interactive Prototype Player</span>
          <span className="text-[11px] text-slate-400 font-mono">Screen {currentScreenIndex + 1} of {screens.length}</span>
        </div>

        {/* Device Bezel Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setDeviceFrame('desktop')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              deviceFrame === 'desktop' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop
          </button>
          <button
            onClick={() => setDeviceFrame('mobile')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              deviceFrame === 'mobile' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile Bezel
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHotspots((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 ${
              showHotspots ? 'bg-violet-950/60 border-violet-500/40 text-violet-300' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> {showHotspots ? 'Hotspots Active' : 'Hotspots Off'}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Prototype Viewport */}
      <main className="flex-1 flex items-center justify-center py-6 overflow-hidden relative">
        {deviceFrame === 'mobile' ? (
          // Mobile iPhone Bezel
          <div className="w-[390px] h-[780px] bg-[#000000] rounded-[50px] border-[10px] border-slate-800 p-3 shadow-2xl shadow-violet-950/40 relative overflow-hidden flex flex-col justify-between">
            {/* Dynamic Island / Notch */}
            <div className="w-28 h-5 bg-black rounded-full mx-auto my-1 z-30 flex items-center justify-center border border-slate-800/40">
              <div className="w-3 h-3 rounded-full bg-slate-900"></div>
            </div>

            <div className="flex-1 rounded-[36px] overflow-hidden bg-[#0a0b10] relative">
              {currentScreen && (
                <ScreenRenderer
                  screen={currentScreen}
                  onButtonClick={(targetType) => handleNavigateByTargetType(targetType)}
                  interactive={true}
                />
              )}
            </div>
          </div>
        ) : (
          // Desktop Screen Frame
          <div className="w-full max-w-5xl h-[680px] bg-[#0c0e17] rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="h-8 bg-slate-900 border-b border-slate-800 px-4 flex items-center gap-2 text-xs text-slate-400">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="font-mono text-[11px] ml-4 bg-slate-950 px-3 py-0.5 rounded text-slate-300">
                https://canvasly-preview.app/{currentScreen?.title.toLowerCase().replace(/\s+/g, '-')}
              </span>
            </div>

            <div className="flex-1 overflow-auto">
              {currentScreen && (
                <ScreenRenderer
                  screen={currentScreen}
                  onButtonClick={(targetType) => handleNavigateByTargetType(targetType)}
                  interactive={true}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Navigation Footer */}
      <footer className="flex justify-between items-center max-w-2xl mx-auto w-full bg-[#121422]/90 border border-slate-800 p-2.5 rounded-2xl shadow-xl text-xs text-slate-300">
        <button
          onClick={() => setCurrentScreenIndex((prev) => (prev > 0 ? prev - 1 : screens.length - 1))}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:text-white flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Screen
        </button>

        <span className="font-semibold text-white truncate max-w-xs">{currentScreen?.title}</span>

        <button
          onClick={() => setCurrentScreenIndex((prev) => (prev < screens.length - 1 ? prev + 1 : 0))}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:text-white flex items-center gap-1"
        >
          Next Screen <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
