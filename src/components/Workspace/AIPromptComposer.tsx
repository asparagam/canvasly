import React, { useState, useRef } from 'react';
import type { AIProgressStep } from '../../types';
import { 
  Sparkles, Mic, Paperclip, ChevronUp, StopCircle, 
  CheckCircle2, Loader2, Cpu, X, Volume2
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
  const [selectedModel, setSelectedModel] = useState<string>('Canvasly Flash 2.0');
  const [showModelMenu, setShowModelMenu] = useState<boolean>(false);
  const [imageAttachment, setImageAttachment] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [showActivityDrawer, setShowActivityDrawer] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestedChips = [
    'Create a mobile onboarding flow',
    'Try a warmer color palette',
    'Generate 3 navigation options',
    'Add dark mode toggle to dashboard',
    'Create checkout modal'
  ];

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

  const toggleVoiceRecording = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      setPromptText((prev) => prev + ' Generate a modern dark mode SaaS analytics dashboard with charts.');
    } else {
      setIsRecordingVoice(true);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-4 pointer-events-auto select-none">
      {/* Expandable Activity Drawer */}
      {(showActivityDrawer || isGenerating) && (
        <div className="mb-3 bg-[#11131f]/95 backdrop-blur-md border border-violet-500/40 rounded-2xl p-4 shadow-2xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              {isGenerating ? (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-xs font-bold text-white">
                {isGenerating ? 'Canvasly AI Generation Engine Active' : 'Generation Completed'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isGenerating && (
                <button
                  onClick={onCancelGeneration}
                  className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-semibold flex items-center gap-1 hover:bg-red-500/30"
                >
                  <StopCircle className="w-3.5 h-3.5" /> Stop
                </button>
              )}
              <button
                onClick={() => setShowActivityDrawer(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Log Steps */}
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {progressSteps.map((step) => (
              <div key={step.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {step.status === 'completed' && <span className="text-emerald-400 text-xs">✓</span>}
                  {step.status === 'active' && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>}
                  {step.status === 'pending' && <span className="w-2 h-2 rounded-full bg-slate-700"></span>}
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

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {suggestedChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setPromptText(chip)}
            className="px-3 py-1 rounded-full bg-[#121422]/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-medium whitespace-nowrap transition-colors shadow-sm shrink-0 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-violet-400" />
            {chip}
          </button>
        ))}
      </div>

      {/* Main Floating Prompt Composer Bar */}
      <form
        onSubmit={handleSubmit}
        className={`bg-[#10121d]/95 backdrop-blur-xl border rounded-2xl p-3 shadow-2xl transition-all ${
          isGenerating
            ? 'border-cyan-400/80 glow-cyan'
            : 'border-violet-500/40 hover:border-violet-500/70 focus-within:border-violet-500 glow-violet'
        }`}
      >
        {/* Selected Screen Revision Context Tag */}
        {selectedScreenTitle && (
          <div className="mb-2 flex items-center justify-between bg-violet-950/40 border border-violet-500/30 px-2.5 py-1 rounded-lg text-[11px]">
            <span className="text-violet-300 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Revising single screen: <strong>{selectedScreenTitle}</strong>
            </span>
            <span className="text-[10px] text-slate-400">Targeted prompt</span>
          </div>
        )}

        {/* Attachment preview chip */}
        {imageAttachment && (
          <div className="mb-2 inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-xs">
            <img src={imageAttachment} alt="Attach" className="w-5 h-5 rounded object-cover" />
            <span className="text-slate-300 text-[11px]">Wireframe reference attached</span>
            <button
              type="button"
              onClick={() => setImageAttachment(null)}
              className="text-slate-500 hover:text-white ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Simulated Voice Equalizer Bar */}
        {isRecordingVoice && (
          <div className="mb-2 flex items-center justify-between bg-violet-950/60 border border-violet-500/40 px-3 py-1.5 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-violet-300 font-semibold">
              <Volume2 className="w-4 h-4 text-cyan-400 animate-bounce" /> Listening to voice prompt...
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1 h-3 bg-violet-400 animate-pulse"></span>
              <span className="w-1 h-5 bg-cyan-400 animate-pulse delay-75"></span>
              <span className="w-1 h-2 bg-violet-400 animate-pulse delay-150"></span>
              <span className="w-1 h-4 bg-cyan-400 animate-pulse delay-100"></span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Paperclip Attachment */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Attach reference wireframe image"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Natural Language Prompt Input */}
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={
              selectedScreenTitle
                ? `Revise "${selectedScreenTitle}" screen...`
                : "What would you like to create or change?"
            }
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none px-1 font-sans"
          />

          {/* Microphone Voice Button */}
          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`p-2 rounded-xl transition-colors ${
              isRecordingVoice
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Voice prompt input"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Model Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowModelMenu((prev) => !prev)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-violet-400" />
              <span className="hidden sm:inline">{selectedModel}</span>
              <ChevronUp className={`w-3.5 h-3.5 transition-transform ${showModelMenu ? 'rotate-180' : ''}`} />
            </button>

            {showModelMenu && (
              <div className="absolute right-0 bottom-10 w-52 bg-[#121422] border border-slate-800 rounded-xl p-1.5 shadow-2xl z-50 text-xs space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase">AI Generation Model</div>
                {[
                  { name: 'Canvasly Flash 2.0', desc: 'Super fast responsive layout' },
                  { name: 'Canvasly Pro 3.5', desc: 'High fidelity component tokens' },
                  { name: 'Claude Vision Coder', desc: 'Sketch wireframe parsing' }
                ].map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => {
                      setSelectedModel(m.name);
                      setShowModelMenu(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      selectedModel === m.name
                        ? 'bg-violet-600/30 text-violet-300 font-semibold'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div>{m.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{m.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={!promptText.trim() || isGenerating}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center gap-1.5 shrink-0"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
