import React, { useState } from 'react';
import { X, Globe, ExternalLink, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PublishModalProps {
  projectName: string;
  onClose: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({ projectName, onClose }) => {
  const [published, setPublished] = useState(false);
  const liveUrl = `https://canvasly-preview.site/p/${encodeURIComponent(projectName.toLowerCase().replace(/\s+/g, '-'))}`;

  const handlePublishNow = () => {
    setPublished(true);
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#11131e] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 text-center">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Publish Project to Web</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!published ? (
          <div className="space-y-4 py-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 mx-auto shadow-xl flex items-center justify-center">
              <div className="w-full h-full bg-[#0a0b10] rounded-[14px] flex items-center justify-center">
                <Globe className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            <h4 className="font-bold text-lg text-white">Ready to deploy "{projectName}"?</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your project will be deployed to a high-speed global CDN with live interactive screens.
            </p>

            <button
              onClick={handlePublishNow}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-xs text-white shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 hover:opacity-95"
            >
              <Sparkles className="w-4 h-4" /> Publish to Live Preview
            </button>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <h4 className="font-bold text-lg text-white">Project Deployed!</h4>
            <p className="text-xs text-slate-400">Your interactive preview link is live:</p>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 break-all">
              {liveUrl}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.open(liveUrl, '_blank')}
                className="flex-1 py-2.5 rounded-xl bg-violet-600 font-semibold text-xs text-white flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Live Site
              </button>
              <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
