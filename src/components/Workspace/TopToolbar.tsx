import type { Project } from '../../types';
import { 
  Menu, Play, Share2, Download, Database, Cloud, Zap
} from 'lucide-react';
import React, { useState } from 'react';

interface TopToolbarProps {
  project: Project;
  onUpdateProjectTitle: (newTitle: string) => void;
  activeMode: 'design' | 'prototype' | 'tokens';
  onChangeMode: (mode: 'design' | 'prototype' | 'tokens') => void;
  onOpenShareModal: () => void;
  onOpenPrototypeModal: () => void;
  onOpenCodeModal: () => void;
  onOpenFigmaModal: () => void;
  onOpenPublishModal: () => void;
  onOpenNeonModal: () => void;
  onOpenGcsModal: () => void;
  onOpenPricingModal: () => void;
  onBackToDashboard: () => void;
  currentPlanName?: string;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  project,
  onUpdateProjectTitle,
  onOpenShareModal,
  onOpenPrototypeModal,
  onOpenCodeModal,
  onOpenFigmaModal: _onOpenFigmaModal,
  onOpenPublishModal: _onOpenPublishModal,
  onOpenNeonModal,
  onOpenGcsModal,
  onOpenPricingModal,
  onBackToDashboard,
  currentPlanName = 'Starter'
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.name);

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      onUpdateProjectTitle(titleInput.trim());
    } else {
      setTitleInput(project.name);
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-14 bg-[#0c0d12] border-b border-white/5 px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Menu & Project Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToDashboard}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title="Back to Dashboard Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {isEditingTitle ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            autoFocus
            className="bg-slate-900 border border-violet-500 rounded px-2 py-0.5 text-sm font-semibold text-white focus:outline-none"
          />
        ) : (
          <h1 
            onClick={() => setIsEditingTitle(true)}
            className="text-sm font-bold text-white tracking-tight cursor-pointer hover:text-slate-200"
            title="Click to rename"
          >
            {project.name}
          </h1>
        )}

        {/* Plan Badge */}
        <button
          onClick={onOpenPricingModal}
          className="hidden md:flex items-center gap-1 text-[10px] text-violet-300 bg-violet-950/60 border border-violet-500/30 px-2 py-0.5 rounded-full font-medium"
        >
          <Zap className="w-3 h-3 text-cyan-400" /> {currentPlanName}
        </button>

        {/* Database integrations */}
        <button
          onClick={onOpenGcsModal}
          className="hidden lg:flex items-center gap-1 text-[10px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full font-medium"
        >
          <Cloud className="w-3 h-3 text-cyan-400" /> Google Cloud
        </button>

        <button
          onClick={onOpenNeonModal}
          className="hidden xl:flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium"
        >
          <Database className="w-3 h-3 text-emerald-400" /> Neon DB
        </button>
      </div>

      {/* Right Controls (Stitch Layout: Play, Export, Share, Profile) */}
      <div className="flex items-center gap-2.5">
        {/* Play Prototype Button */}
        <button
          onClick={onOpenPrototypeModal}
          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title="Play Prototype"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
        </button>

        {/* Export Dropdown / Code */}
        <button
          onClick={onOpenCodeModal}
          className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Export
        </button>

        {/* Share Button */}
        <button
          onClick={onOpenShareModal}
          className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 cursor-pointer ml-1">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white">
            FD
          </div>
        </div>
      </div>
    </header>
  );
};
