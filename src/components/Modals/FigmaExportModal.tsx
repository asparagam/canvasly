import React, { useState } from 'react';
import { X, Copy, Check, Layers } from 'lucide-react';
import type { Project } from '../../types';

interface FigmaExportModalProps {
  project: Project;
  onClose: () => void;
}

export const FigmaExportModal: React.FC<FigmaExportModalProps> = ({ project, onClose }) => {
  const [copied, setCopied] = useState(false);

  const figmaJson = JSON.stringify({
    version: "2.0",
    generator: "Canvasly AI Design Engine",
    projectName: project.name,
    screensCount: project.screens.length,
    frames: project.screens.map(s => ({
      name: s.title,
      type: s.device,
      bounds: { width: s.width, height: s.height, x: s.x, y: s.y },
      fills: [{ type: "SOLID", color: { r: 0.05, g: 0.06, b: 0.09 } }]
    }))
  }, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(figmaJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#11131e] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Export to Figma</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Copy the Figma JSON schema below to paste into the Canvasly Figma Plugin or import as native vector frames.
        </p>

        <div className="bg-[#090a10] p-3 rounded-xl border border-slate-800 max-h-48 overflow-y-auto font-mono text-[11px] text-slate-300">
          <pre>{figmaJson}</pre>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            Close
          </button>
          <button
            onClick={handleCopy}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-xs text-white shadow-lg flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard' : 'Copy Figma JSON'}
          </button>
        </div>
      </div>
    </div>
  );
};
