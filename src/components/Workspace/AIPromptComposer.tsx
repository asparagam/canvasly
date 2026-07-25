import React, { useState, useRef } from 'react';
import type { AIProgressStep } from '../../types';
import { 
  Sparkles, Mic, Plus, ArrowUp, Image as ImageIcon, Palette, 
  ChevronUp, StopCircle, CheckCircle2, Loader2, X
} from 'lucide-react';

interface AIPromptComposerProps {
  onGenerate: (prompt: string, model: string, imageAttachment?: string) => void;
  isGenerating: boolean;
  onCancelGeneration: () => void;
  progressSteps: AIProgressStep[];
  selectedScreenTitle?: string;
}

export const AIPromptComposer: React.FC<AIPromptComposerProps> = ({
  onGenerate,
  isGenerating,
  onCancelGeneration,
  progressSteps,
  selectedScreenTitle
}) => {
  const [promptText, setPromptText] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('3 Flash');
  const [showModelMenu, setShowModelMenu] = useState<boolean>(false);
  const [imageAttachment, setImageAttachment] = useState<string | null>(null);
  const [showActivityDrawer, setShowActivityDrawer] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim() || isGenerating) return;
    setShowActivityDrawer(true);
    onGenerate(promptText.trim(), selectedModel, imageAttachment || undefined);
    setPromptText('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageAttachment(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-4 pointer-events-auto select-none">
      {/* Expandable Activity Drawer */}
      {(showActivityDrawer || isGenerating) && (
        <div className="mb-3 bg-[#121420]/95 backdrop-blur-md border border-violet-500/40 rounded-2xl p-4 shadow-2xl space-y-3">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              {isGenerating ? (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-xs font-bold text-white">
                {isGenerating ? 'Canvasly AI Engine Active' : 'Generation Complete'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isGenerating && (
                <button
                  onClick={onCancelGeneration}
                  className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-semibold flex items-center gap-1"
                >
                  <StopCircle className="w-3.5 h-3.5" /> Stop
                </button>
              )}
              <button onClick={() => setShowActivityDrawer(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {progressSteps.map((step) => (
              <div key={step.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {step.status === 'completed' && <span className="text-emerald-400 text-xs">✓</span>}
                  {step.status === 'active' && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>}
                  <span className={step.status === 'active' ? 'text-white font-medium' : 'text-slate-400'}>
                    {step.message}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{step.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Floating Stitch Composer Bar */}
      <form
        onSubmit={handleSubmit}
        className={`bg-[#161824]/95 backdrop-blur-2xl border rounded-3xl p-3.5 shadow-2xl transition-all ${
          isGenerating
            ? 'border-cyan-400/80 glow-cyan'
            : 'border-white/10 hover:border-violet-500/60 focus-within:border-violet-500 glow-violet'
        }`}
      >
        {selectedScreenTitle && (
          <div className="mb-2 flex items-center justify-between bg-violet-950/40 border border-violet-500/30 px-2.5 py-1 rounded-lg text-[11px]">
            <span className="text-violet-300 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Revising single screen: <strong>{selectedScreenTitle}</strong>
            </span>
          </div>
        )}

        {imageAttachment && (
          <div className="mb-2 flex items-center gap-2 bg-slate-900 border border-white/10 px-2.5 py-1 rounded-lg text-xs w-fit">
            <img src={imageAttachment} alt="Attach" className="w-5 h-5 rounded object-cover" />
            <span className="text-slate-300 text-[11px]">Wireframe reference attached</span>
            <button type="button" onClick={() => setImageAttachment(null)} className="text-slate-500 hover:text-white ml-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <input
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder={selectedScreenTitle ? `What would you like to change on "${selectedScreenTitle}"?` : "What would you like to change or create?"}
          className="w-full bg-transparent text-sm md:text-base text-white placeholder-slate-500 focus:outline-none px-2 font-sans mb-2"
        />

        {/* Bottom Controls inside Composer (Stitch Style) */}
        <div className="flex justify-between items-center border-t border-white/10 pt-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
              title="Add attachment"
            >
              <Plus className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
              title="Asset / Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
              title="Color Theme"
            >
              <Palette className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModelMenu((prev) => !prev)}
                className="px-2.5 py-1 rounded-full bg-[#0a0b10] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1"
              >
                <span>✨ {selectedModel}</span>
                <ChevronUp className={`w-3 h-3 transition-transform ${showModelMenu ? 'rotate-180' : ''}`} />
              </button>

              {showModelMenu && (
                <div className="absolute right-0 bottom-9 w-44 bg-[#121422] border border-white/10 rounded-xl p-1.5 shadow-2xl z-50 text-xs space-y-1">
                  {['3 Flash', 'Pro 3.5'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setSelectedModel(m);
                        setShowModelMenu(false);
                      }}
                      className={`w-full text-left p-1.5 rounded-lg transition-colors ${
                        selectedModel === m ? 'bg-violet-600/30 text-violet-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      ✨ {m}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="p-1.5 rounded-full text-slate-400 hover:text-white"
              title="Voice prompt"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={!promptText.trim() || isGenerating}
              className="w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center hover:bg-slate-200 disabled:opacity-40 transition-colors shadow-md"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
