import type { Project } from '../../types';
import { 
  ArrowLeft, Share2, Play, Code, Download, Globe, 
  Layers, GitFork, Sliders, Database, Cloud, Zap
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
  activeMode,
  onChangeMode,
  onOpenShareModal,
  onOpenPrototypeModal,
  onOpenCodeModal,
  onOpenFigmaModal,
  onOpenPublishModal,
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
    <header className="h-14 bg-[#0e1017] border-b border-slate-800/80 px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Back & Project Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToDashboard}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
          title="Back to Projects Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-800"></div>

        {/* Canvasly Logo icon */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-violet-600/30">
            <div className="w-full h-full bg-[#0a0b10] rounded-[6px] flex items-center justify-center font-bold text-white text-xs">
              C
            </div>
          </div>

          {/* Editable Title */}
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
            <div 
              onClick={() => setIsEditingTitle(true)}
              className="group flex items-center gap-2 cursor-pointer py-1 px-1.5 rounded hover:bg-slate-900"
              title="Click to rename project"
            >
              <h1 className="text-sm font-semibold text-white tracking-tight">{project.name}</h1>
              <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                ✏️
              </span>
            </div>
          )}
        </div>

        {/* Current Plan Badge Trigger */}
        <button
          onClick={onOpenPricingModal}
          className="hidden md:flex items-center gap-1.5 text-[11px] text-violet-300 bg-violet-950/60 border border-violet-500/40 px-2.5 py-1 rounded-full font-medium hover:border-violet-400 transition-all shadow-sm"
          title="View Pricing Plans"
        >
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>{currentPlanName} Plan</span>
        </button>

        {/* Google Cloud Storage Save Badge */}
        <button
          onClick={onOpenGcsModal}
          className="hidden lg:flex items-center gap-1.5 text-[11px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 px-2.5 py-1 rounded-full font-medium hover:border-cyan-400 transition-all shadow-sm"
          title="Google Cloud Storage Save & Backup"
        >
          <Cloud className="w-3.5 h-3.5 text-cyan-400" />
          <span>Google Cloud</span>
        </button>

        {/* Neon Database Status Button */}
        <button
          onClick={onOpenNeonModal}
          className="hidden xl:flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-full font-medium hover:border-emerald-400 transition-all shadow-sm"
          title="Neon Serverless Postgres Connected"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Neon DB</span>
        </button>
      </div>

      {/* Center: Mode Switcher */}
      <div className="bg-slate-900/90 border border-slate-800/80 p-1 rounded-xl flex items-center gap-1">
        <button
          onClick={() => onChangeMode('design')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            activeMode === 'design'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Design Canvas
        </button>

        <button
          onClick={() => onChangeMode('prototype')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            activeMode === 'prototype'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" /> Prototype Flow
        </button>

        <button
          onClick={() => onChangeMode('tokens')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            activeMode === 'tokens'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" /> Design System
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Share Button */}
        <button
          onClick={onOpenShareModal}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Play Prototype Button */}
        <button
          onClick={onOpenPrototypeModal}
          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Play Prototype</span>
        </button>

        {/* View Code Button */}
        <button
          onClick={onOpenCodeModal}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-violet-400 hover:border-violet-500/40 hover:bg-violet-950/20 transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          <Code className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Code</span>
        </button>

        {/* Figma Export */}
        <button
          onClick={onOpenFigmaModal}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-xs font-medium"
          title="Export to Figma"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* Publish Button */}
        <button
          onClick={onOpenPublishModal}
          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-violet-600/20 transition-all flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Publish</span>
        </button>
      </div>
    </header>
  );
};
