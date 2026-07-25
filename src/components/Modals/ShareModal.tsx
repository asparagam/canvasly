import React, { useState } from 'react';
import { X, Copy, Check, Share2, QrCode } from 'lucide-react';

interface ShareModalProps {
  projectName: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ projectName, onClose }) => {
  const shareUrl = `https://canvasly.app/share/${encodeURIComponent(projectName.toLowerCase().replace(/\s+/g, '-'))}`;
  const [copied, setCopied] = useState(false);
  const [accessRole, setAccessRole] = useState<'view' | 'comment' | 'edit'>('view');

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#11131e] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold text-base text-white">Share Project</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Shareable Link</label>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-xs text-slate-200 flex-1 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-violet-600 text-white font-semibold text-xs flex items-center gap-1 hover:bg-violet-500"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Access Permissions</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'view', label: 'Can View' },
                { id: 'comment', label: 'Can Comment' },
                { id: 'edit', label: 'Can Edit' }
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setAccessRole(role.id as any)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    accessRole === role.id
                      ? 'bg-violet-600/30 border-violet-500 text-violet-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* QR Code representation */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-4">
            <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
              <QrCode className="w-14 h-14 text-black" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Scan QR Code</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Open directly on mobile device to test mobile screen frames.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
