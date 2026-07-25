import React, { useState, useRef } from 'react';
import type { Project, DeviceType } from '../types';
import { SAMPLE_PROMPTS } from '../data/seededData';
import { 
  Sparkles, Monitor, Smartphone, Layout, ArrowRight, Plus, 
  Paperclip, Trash2, Copy, Edit2, Layers
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
  onRenameProject
}) => {
  const [promptText, setPromptText] = useState<string>('');
  const [deviceType, setDeviceType] = useState<DeviceType>('responsive');
  const [imageAttachment, setImageAttachment] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

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
    const finalPrompt = promptText.trim() || 'Create a modern dark mode SaaS interface with onboarding and analytics.';
    onCreateProjectFromPrompt(finalPrompt, deviceType, imageAttachment || undefined);
  };

  return (
    <div className="min-h-screen bg-[#0a0b10] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-slate-800/80 px-6 md:px-12 flex items-center justify-between z-20 bg-[#0c0e16]/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-violet-600/30">
            <div className="w-full h-full bg-[#0a0b10] rounded-[10px] flex items-center justify-center font-bold text-white text-sm">
              C
            </div>
          </div>
          <span className="font-bold text-lg text-white tracking-tight">Canvasly</span>
          <span className="text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full ml-1">
            AI Platform
          </span>
        </div>

        {/* Minimal Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <a href="#features" className="hover:text-slate-200 transition-colors">Pricing</a>
          <a href="#community" className="hover:text-slate-200 transition-colors">Community</a>
          <a href="#resources" className="hover:text-slate-200 transition-colors">Resources</a>
          <a href="#docs" className="hover:text-slate-200 transition-colors">Documentation</a>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg">
            Sign In
          </button>
          <button
            onClick={() => handleLaunchNewProject()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Open Workspace
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 md:py-16 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Next-Gen Interface Generation Workspace
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Turn ideas into <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">interfaces</span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Describe a website or mobile app in natural language. Canvasly generates editable UI screens, design tokens, and interactive prototype flows on an infinite canvas.
          </p>
        </div>

        {/* Hero Prompt Box */}
        <div className="max-w-2xl mx-auto bg-[#10121d] border border-violet-500/40 hover:border-violet-500/70 p-4 rounded-2xl shadow-2xl space-y-4 glow-violet transition-all">
          <form onSubmit={handleLaunchNewProject} className="space-y-3">
            {/* Attachment preview */}
            {imageAttachment && (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs w-fit">
                <img src={imageAttachment} alt="Attach" className="w-6 h-6 rounded object-cover" />
                <span className="text-slate-300">Reference sketch attached</span>
                <button type="button" onClick={() => setImageAttachment(null)} className="text-slate-500 hover:text-white ml-2">✕</button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Describe your design (e.g. Mobile onboarding flow with dark violet glassmorphism cards...)"
                className="flex-1 bg-transparent text-sm md:text-base text-white placeholder-slate-500 focus:outline-none font-sans"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Upload Wireframe / Sketch"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            {/* Target Output Selector & Launch Button */}
            <div className="flex justify-between items-center border-t border-slate-800/80 pt-3">
              <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDeviceType('web')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    deviceType === 'web' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" /> Web
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceType('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    deviceType === 'mobile' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceType('responsive')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    deviceType === 'responsive' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" /> Responsive
                </button>
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-2"
              >
                Generate Canvas <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Sample Prompts Gallery */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Example Templates & Prompts</h2>
            <span className="text-xs text-slate-500">Click card to launch workspace</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_PROMPTS.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setPromptText(item.prompt);
                  onCreateProjectFromPrompt(item.prompt, item.badge.toLowerCase() as DeviceType);
                }}
                className="group bg-[#11131e] border border-slate-800/80 hover:border-violet-500/60 p-4 rounded-2xl cursor-pointer transition-all hover:bg-[#151726] shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                    <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">{item.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.prompt}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-violet-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Create template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-400" /> Recent Canvas Projects ({projects.length})
            </h2>
            <button
              onClick={() => handleLaunchNewProject()}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              + Create New Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj.id)}
                className="group bg-[#11131e] border border-slate-800 hover:border-violet-500/70 rounded-2xl overflow-hidden cursor-pointer transition-all hover:bg-[#141624] shadow-xl flex flex-col justify-between"
              >
                {/* Thumbnail Header */}
                <div className="h-44 bg-[#0a0b10] relative overflow-hidden flex items-center justify-center border-b border-slate-800">
                  {proj.thumbnail ? (
                    <img src={proj.thumbnail} alt={proj.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
                  ) : (
                    <div className="w-full h-full bg-canvas-dots flex items-center justify-center">
                      <div className="p-3 rounded-2xl bg-violet-600/20 border border-violet-500/40 text-violet-300 font-bold text-xl">
                        C
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-[#0c0e16]/90 border border-slate-800 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-300 uppercase flex items-center gap-1">
                    {proj.deviceType === 'mobile' ? <Smartphone className="w-3 h-3 text-cyan-400" /> : <Monitor className="w-3 h-3 text-violet-400" />}
                    {proj.deviceType}
                  </div>

                  <div className="absolute top-3 right-3 bg-[#0c0e16]/90 border border-slate-800 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-400">
                    {proj.screens.length} screens
                  </div>
                </div>

                {/* Project Metadata */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {editingProjectId === proj.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={() => {
                          if (editingTitle.trim()) onRenameProject(proj.id, editingTitle.trim());
                          setEditingProjectId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (editingTitle.trim()) onRenameProject(proj.id, editingTitle.trim());
                            setEditingProjectId(null);
                          }
                        }}
                        autoFocus
                        className="bg-slate-900 border border-violet-500 text-sm font-bold text-white px-2 py-1 rounded w-full"
                      />
                    ) : (
                      <h3 className="font-bold text-base text-white group-hover:text-violet-300 transition-colors">
                        {proj.name}
                      </h3>
                    )}
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{proj.description}</p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-800/80 text-xs">
                    <span className="text-[11px] text-slate-500 font-mono">Edited {proj.updatedAt}</span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProjectId(proj.id);
                          setEditingTitle(proj.name);
                        }}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                        title="Rename Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateProject(proj.id);
                        }}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                        title="Duplicate Project"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(proj.id);
                        }}
                        className="p-1.5 rounded hover:bg-slate-800 text-red-400 hover:text-red-300"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
