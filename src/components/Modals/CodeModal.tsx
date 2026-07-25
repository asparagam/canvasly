import React, { useState } from 'react';
import type { Screen, Project } from '../../types';
import { X, Copy, Download, Check, Code } from 'lucide-react';

interface CodeModalProps {
  project: Project;
  selectedScreen?: Screen | null;
  onClose: () => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({ project, selectedScreen, onClose }) => {
  const activeScreen = selectedScreen || project.screens[0];
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'screen' | 'bundle'>('screen');

  const codeText = activeTab === 'screen' ? (activeScreen?.code || '// No code generated') : `// Canvasly Project Code Bundle
// Generated React + Tailwind CSS TSX Component Tree
import React from 'react';

${project.screens.map((s, idx) => `
// Screen ${idx + 1}: ${s.title}
export function Screen_${idx + 1}() {
  return (
    <div className="w-full min-h-screen bg-[#0a0b10] text-white">
      {/* ${s.title} UI tree */}
    </div>
  );
}
`).join('\n')}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codeText], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeScreen?.title.toLowerCase().replace(/\s+/g, '-') || 'component'}.tsx`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#10121d] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#141724]">
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-violet-400" />
            <div>
              <h3 className="font-bold text-base text-white">Export React + Tailwind TSX</h3>
              <p className="text-xs text-slate-400">Production-ready TypeScript code</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('screen')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  activeTab === 'screen' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Selected Screen ({activeScreen?.title})
              </button>
              <button
                onClick={() => setActiveTab('bundle')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  activeTab === 'bundle' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Full Bundle TSX
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-[#090a10] font-mono text-xs text-slate-200">
          <pre className="whitespace-pre-wrap leading-relaxed">{codeText}</pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#141724] flex justify-between items-center">
          <span className="text-xs text-slate-400 font-mono">Component: {activeScreen?.title}.tsx</span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Download .tsx
            </button>

            <button
              onClick={handleCopy}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy React TSX
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
