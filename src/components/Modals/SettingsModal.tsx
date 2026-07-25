import React, { useState } from 'react';
import { X, Sliders, Cpu, Grid, Key } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [gridSnapping, setGridSnapping] = useState(true);
  const [defaultModel, setDefaultModel] = useState('Canvasly Flash 2.0');
  const [apiKey, setApiKey] = useState('cns_live_9482938472910');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#11131e] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold text-base text-white">Platform Settings</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-violet-400" />
              <div>
                <div className="font-semibold text-white">Canvas Snap to Grid</div>
                <div className="text-[10px] text-slate-400">Align frames to 12px grid</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={gridSnapping}
              onChange={(e) => setGridSnapping(e.target.checked)}
              className="accent-violet-600 w-4 h-4"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Cpu className="w-4 h-4 text-cyan-400" /> AI Model Preferred Default
            </div>
            <select
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 focus:outline-none"
            >
              <option value="Canvasly Flash 2.0">Canvasly Flash 2.0 (Fast)</option>
              <option value="Canvasly Pro 3.5">Canvasly Pro 3.5 (High Detail)</option>
              <option value="Claude Vision Coder">Claude Vision Coder</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Key className="w-4 h-4 text-emerald-400" /> Canvasly API Token
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 font-mono text-[11px]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-violet-600 font-semibold text-xs text-white"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
