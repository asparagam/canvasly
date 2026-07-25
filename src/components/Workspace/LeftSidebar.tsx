import React, { useState } from 'react';
import type { Project, HistoryItem } from '../../types';
import { 
  Plus, Monitor, Smartphone, Layers, Palette, Image as ImageIcon, 
  Clock, ChevronRight, Trash2, Copy, Eye, 
  Settings, LayoutGrid, Box, Shield
} from 'lucide-react';

interface LeftSidebarProps {
  project: Project;
  selectedScreenId: string | null;
  onSelectScreen: (screenId: string) => void;
  onFocusScreen: (screenId: string) => void;
  onAddBlankScreen: (device: 'web' | 'mobile') => void;
  onDuplicateScreen: (screenId: string) => void;
  onDeleteScreen: (screenId: string) => void;
  onNewProject: () => void;
  history: HistoryItem[];
  onRestoreHistory: (historyId: string) => void;
  onOpenSettings: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  project,
  selectedScreenId,
  onSelectScreen,
  onFocusScreen,
  onAddBlankScreen,
  onDuplicateScreen,
  onDeleteScreen,
  onNewProject,
  history,
  onRestoreHistory,
  onOpenSettings,
  collapsed,
  onToggleCollapse
}) => {
  const [activeTab, setActiveTab] = useState<'pages' | 'design-system' | 'assets' | 'history'>('pages');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  if (collapsed) {
    return (
      <aside className="w-14 bg-[#10121a] border-r border-slate-800/80 flex flex-col justify-between items-center py-4 z-20 shrink-0 select-none">
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={onToggleCollapse} 
            className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('pages')} 
            className={`p-2 rounded-lg ${activeTab === 'pages' ? 'bg-violet-600/30 text-violet-400' : 'text-slate-400 hover:text-slate-200'}`}
            title="Pages & Screens"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('design-system')} 
            className={`p-2 rounded-lg ${activeTab === 'design-system' ? 'bg-violet-600/30 text-violet-400' : 'text-slate-400 hover:text-slate-200'}`}
            title="Design System"
          >
            <Palette className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('assets')} 
            className={`p-2 rounded-lg ${activeTab === 'assets' ? 'bg-violet-600/30 text-violet-400' : 'text-slate-400 hover:text-slate-200'}`}
            title="Assets"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`p-2 rounded-lg ${activeTab === 'history' ? 'bg-violet-600/30 text-violet-400' : 'text-slate-400 hover:text-slate-200'}`}
            title="Version History"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
        <button onClick={onOpenSettings} className="p-2 text-slate-400 hover:text-white">
          <Settings className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-[#10121a] border-r border-slate-800/80 flex flex-col justify-between z-20 shrink-0 select-none overflow-hidden">
      {/* Top Header & New Project */}
      <div>
        <div className="p-4 border-b border-slate-800/80 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Workspace</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={onNewProject}
              className="px-2.5 py-1 rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 text-xs font-semibold flex items-center gap-1"
              title="Create New Project"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
            <button 
              onClick={onToggleCollapse} 
              className="p-1 rounded text-slate-400 hover:text-white" 
              title="Collapse sidebar"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-slate-800/80 bg-[#0d0e15] px-2 pt-2 gap-1">
          <button
            onClick={() => setActiveTab('pages')}
            className={`flex-1 py-2 px-1 text-center text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'pages'
                ? 'border-violet-500 text-violet-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Pages ({project.screens.length})
          </button>
          <button
            onClick={() => setActiveTab('design-system')}
            className={`flex-1 py-2 px-1 text-center text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'design-system'
                ? 'border-violet-500 text-violet-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> System
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex-1 py-2 px-1 text-center text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'assets'
                ? 'border-violet-500 text-violet-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Assets
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-1 text-center text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-violet-500 text-violet-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> History
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* PAGES TAB */}
        {activeTab === 'pages' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Canvas Screens</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => onAddBlankScreen('web')}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:text-white flex items-center gap-1"
                >
                  + Web
                </button>
                <button 
                  onClick={() => onAddBlankScreen('mobile')}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:text-white flex items-center gap-1"
                >
                  + Mobile
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              {project.screens.map((screen) => {
                const isSelected = selectedScreenId === screen.id;
                return (
                  <div
                    key={screen.id}
                    onClick={() => {
                      onSelectScreen(screen.id);
                      onFocusScreen(screen.id);
                    }}
                    className={`group relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-violet-950/40 border-violet-500/80 text-white shadow-md shadow-violet-950/50'
                        : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {screen.device === 'mobile' ? (
                        <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <Monitor className="w-4 h-4 text-violet-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <div className="text-xs font-semibold truncate">{screen.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {screen.width} × {screen.height} px
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFocusScreen(screen.id);
                        }}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                        title="Center screen on canvas"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateScreen(screen.id);
                        }}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                        title="Duplicate screen"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteScreen(screen.id);
                        }}
                        className="p-1 rounded hover:bg-slate-800 text-red-400 hover:text-red-300"
                        title="Delete screen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DESIGN SYSTEM TAB */}
        {activeTab === 'design-system' && (
          <div className="space-y-4">
            {/* Color Palette */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Color Palette Tokens</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Dark Surface', hex: '#0a0b10' },
                  { name: 'Card Obsidian', hex: '#121422' },
                  { name: 'Electric Violet', hex: '#8b5cf6' },
                  { name: 'Deep Indigo', hex: '#6366f1' },
                  { name: 'Cyan Highlight', hex: '#38bdf8' },
                  { name: 'Emerald Status', hex: '#10b981' }
                ].map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => copyToClipboard(color.hex)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-left transition-colors"
                  >
                    <span className="w-4 h-4 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: color.hex }}></span>
                    <div className="truncate">
                      <div className="text-[11px] font-semibold text-slate-200 truncate">{color.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{copiedColor === color.hex ? 'Copied!' : color.hex}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Tokens */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Typography Tokens</span>
              <div className="space-y-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                <div className="text-sm font-bold text-white">Display Headline (24px)</div>
                <div className="text-xs font-semibold text-slate-200">Section Header (16px)</div>
                <div className="text-[11px] text-slate-400">Body & Caption text (12px)</div>
              </div>
            </div>

            {/* Reusable UI Components */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Component Library</span>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <Box className="w-3.5 h-3.5 text-violet-400" /> Primary Gradient Button
                  </span>
                  <span className="px-2 py-0.5 bg-violet-600 text-white rounded text-[10px]">Button</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" /> Metric Telemetry Card
                  </span>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">Card</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ASSETS TAB */}
        {activeTab === 'assets' && (
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Uploaded References</span>
            <div className="p-4 border-2 border-dashed border-slate-800 rounded-xl text-center hover:border-violet-500/50 cursor-pointer transition-colors">
              <ImageIcon className="w-6 h-6 text-slate-500 mx-auto mb-1" />
              <p className="text-xs font-medium text-slate-300">Drop wireframes or sketches</p>
              <p className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, SVG up to 10MB</p>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs">
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80" className="w-8 h-8 rounded object-cover" />
                <div className="truncate">
                  <div className="font-semibold text-slate-200 truncate">wireframe_concept.png</div>
                  <div className="text-[10px] text-slate-400">Attached to AI Prompt</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Snapshot History</span>
            <div className="space-y-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onRestoreHistory(item.id)}
                  className="pl-7 relative group cursor-pointer"
                >
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-900 group-hover:bg-violet-500 transition-colors"></div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 group-hover:border-violet-500/40 transition-colors">
                    <div className="text-xs font-semibold text-slate-200">{item.description}</div>
                    <div className="text-[10px] text-slate-400 flex justify-between mt-1">
                      <span>{item.timestamp}</span>
                      <span className="text-violet-400 font-medium">Restore</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Profile & Settings Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0d0e15] flex items-center justify-between">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 shrink-0">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-xs text-white">
              FD
            </div>
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-white truncate">Fatma Dogan</div>
            <div className="text-[10px] text-cyan-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Pro Enterprise Plan
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Open Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
