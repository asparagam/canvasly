import React, { useState, useRef } from 'react';
import type { Project, DeviceType } from '../types';
import { SAMPLE_PROMPTS } from '../data/seededData';
import { 
  Sparkles, Monitor, Smartphone, Trash2, Copy, 
  ChevronLeft, ChevronRight, Search, Plus, ArrowUp, 
  BookOpen, ArrowRight
} from 'lucide-react';

interface LandingDashboardProps {
  projects: Project[];
  onOpenProject: (projectId: string) => void;
  onCreateProjectFromPrompt: (prompt: string, deviceType: DeviceType, imageAttachment?: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onRenameProject: (projectId: string, newName: string) => void;
}

export const LandingDashboard: React.FC<LandingDashboardProps> = ({
  projects,
  onOpenProject,
  onCreateProjectFromPrompt,
  onDuplicateProject,
  onDeleteProject,
  onRenameProject: _onRenameProject
}) => {
  const [activeTab, setActiveTab] = useState<'my' | 'shared'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [promptText, setPromptText] = useState('');
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile');
  const [selectedModel, setSelectedModel] = useState('3 Flash');
  const [imageAttachment, setImageAttachment] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleLaunchNewProject = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalPrompt = promptText.trim() || 'Create an Adventure Essentials collection flow with dark UI.';
    onCreateProjectFromPrompt(finalPrompt, deviceType, imageAttachment || undefined);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-screen bg-[#0e0f14] text-slate-100 flex font-sans select-none overflow-hidden">
      {/* Left Sidebar - Projects Navigation (Stitch Layout) */}
      <aside className="w-80 bg-[#12131b] border-r border-white/5 flex flex-col justify-between z-20 shrink-0 overflow-hidden">
        {/* Top Tabs */}
        <div className="p-4 border-b border-white/5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-0.5">
              <div className="w-full h-full bg-[#0e0f14] rounded-[6px] flex items-center justify-center font-bold text-white text-xs">
                C
              </div>
            </div>
            <span className="font-bold text-base text-white tracking-tight">Canvasly</span>
            <span className="text-[10px] font-mono bg-white/10 text-slate-300 border border-white/15 px-2 py-0.5 rounded-full">
              BETA
            </span>
          </div>

          <div className="bg-[#0b0c12] p-1 rounded-xl flex items-center gap-1 border border-white/5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('my')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                activeTab === 'my' ? 'bg-[#222433] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              My projects
            </button>
            <button
              onClick={() => setActiveTab('shared')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                activeTab === 'shared' ? 'bg-[#222433] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Shared with me
            </button>
          </div>

          {/* Search Projects */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects"
              className="w-full bg-[#0b0c12] border border-white/5 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
            />
          </div>
        </div>

        {/* Project List (Grouped Chronologically) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 font-sans text-xs">
          {/* Last 7 Days Section */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 px-2 uppercase tracking-wider">Last 7 days</div>
            {filteredProjects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj.id)}
                className="group p-2.5 rounded-xl hover:bg-[#1c1e2b] transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-[#181a26] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {proj.thumbnail ? (
                      <img src={proj.thumbnail} className="w-full h-full object-cover" />
                    ) : (
                      <Smartphone className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-white truncate text-xs group-hover:text-violet-300 transition-colors">
                      {proj.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Jul 25, 2026</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateProject(proj.id);
                    }}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProject(proj.id);
                    }}
                    className="p-1 rounded hover:bg-slate-800 text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Last 30 Days Section */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 px-2 uppercase tracking-wider">Last 30 days</div>
            {[
              { name: 'CollarPulse AI Pet Health Monitor', date: 'Jul 15, 2026', type: 'mobile' },
              { name: 'Canvasly Dashboard & Telemetry', date: 'Jul 02, 2026', type: 'web' }
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleLaunchNewProject()}
                className="group p-2.5 rounded-xl hover:bg-[#1c1e2b] transition-colors cursor-pointer flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-[#181a26] border border-white/10 flex items-center justify-center shrink-0">
                  {item.type === 'mobile' ? <Smartphone className="w-4 h-4 text-cyan-400" /> : <Monitor className="w-4 h-4 text-violet-400" />}
                </div>
                <div className="truncate">
                  <div className="font-semibold text-white truncate text-xs group-hover:text-violet-300 transition-colors">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.date}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Examples Section */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <div className="text-[11px] font-semibold text-slate-500 px-2 uppercase tracking-wider">Examples</div>
            {[
              'Adventure Essentials Collection Flow',
              'Home Lookbook & Catalog',
              'SaaS Analytics & Billing'
            ].map((name, idx) => (
              <div
                key={idx}
                onClick={() => handleLaunchNewProject()}
                className="p-2 px-2.5 rounded-xl hover:bg-[#1c1e2b] transition-colors cursor-pointer text-slate-300 hover:text-white flex items-center justify-between text-xs"
              >
                <span className="truncate">{name}</span>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">Shared</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Right Area - Stitch Welcome Screen */}
      <main className="flex-1 flex flex-col justify-between overflow-y-auto relative">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-violet-600/15 blur-[120px] pointer-events-none"></div>

        {/* Top Navbar Header */}
        <header className="h-16 px-8 flex items-center justify-between z-10 border-b border-white/5 bg-[#0e0f14]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Google I/O: 5 Major Upgrades
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Docs
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 cursor-pointer">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white">
                FD
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <div className="max-w-4xl w-full mx-auto px-8 py-12 space-y-8 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Welcome to Canvasly.
            </h1>
            <button
              onClick={() => handleLaunchNewProject()}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
            >
              Start with your design <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stitch Floating Prompt Card */}
          <form onSubmit={handleLaunchNewProject} className="bg-[#121420]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4 text-left glow-violet">
            {imageAttachment && (
              <div className="flex items-center gap-2 bg-slate-900 border border-white/10 p-2 rounded-xl text-xs w-fit">
                <img src={imageAttachment} alt="Attach" className="w-6 h-6 rounded object-cover" />
                <span className="text-slate-300">Reference sketch attached</span>
                <button type="button" onClick={() => setImageAttachment(null)} className="text-slate-500 hover:text-white ml-2">✕</button>
              </div>
            )}

            <textarea
              rows={2}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="What native mobile app shall we design?"
              className="w-full bg-transparent text-base md:text-lg text-white placeholder-slate-500 focus:outline-none font-sans resize-none"
            />

            {/* Bottom Controls Bar Inside Card */}
            <div className="flex justify-between items-center border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                  title="Attach wireframe"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                <div className="flex items-center gap-1 bg-[#090a10] border border-white/10 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDeviceType('mobile')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                      deviceType === 'mobile' ? 'bg-[#25283b] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> App
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceType('web')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                      deviceType === 'web' ? 'bg-[#25283b] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" /> Web
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-[#090a10] border border-white/10 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl focus:outline-none"
                >
                  <option value="3 Flash">✨ 3 Flash</option>
                  <option value="Pro 3.5">✨ Pro 3.5</option>
                </select>

                <button
                  type="submit"
                  disabled={!promptText.trim()}
                  className="w-9 h-9 rounded-full bg-white text-black font-bold flex items-center justify-center hover:bg-slate-200 disabled:opacity-40 transition-colors shadow-lg"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Suggested Prompt Chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            {SAMPLE_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPromptText(item.prompt);
                  onCreateProjectFromPrompt(item.prompt, item.badge.toLowerCase() as DeviceType);
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#151724] border border-white/10 hover:border-violet-500/50 text-slate-300 text-xs font-medium transition-colors"
              >
                {item.prompt.substring(0, 45)}...
              </button>
            ))}
          </div>

          {/* Need inspiration Carousel */}
          <div className="space-y-4 pt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white tracking-tight">Need inspiration?</h2>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'Adventure Essentials Collection Flow', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80' },
                { title: 'CollarPulse AI Pet Health Monitor', img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80' },
                { title: 'SaaS Telemetry & Billing Dashboard', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleLaunchNewProject()}
                  className="group bg-[#121422] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-violet-500/60 transition-all shadow-xl"
                >
                  <div className="h-40 bg-slate-900 relative">
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100" />
                  </div>
                  <div className="p-3.5 text-xs font-semibold text-white truncate">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 p-4 px-8 bg-[#0b0c10] text-xs text-slate-500 flex justify-between items-center">
          <span>Canvasly AI Platform</span>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-slate-300">Privacy</a>
            <a href="#terms" className="hover:text-slate-300">Terms</a>
            <a href="#docs" className="hover:text-slate-300">Docs</a>
          </div>
        </footer>
      </main>
    </div>
  );
};
