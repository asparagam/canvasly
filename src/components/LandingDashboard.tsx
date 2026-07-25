import React, { useState, useRef } from 'react';
import type { Project, DeviceType } from '../types';
import { SAMPLE_PROMPTS } from '../data/seededData';
import { 
  Sparkles, Monitor, Smartphone, 
  Paperclip, Trash2, Copy, ChevronLeft, ChevronRight,
  ChevronDown, Sparkle
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
  const [promptText, setPromptText] = useState<string>('');
  const [deviceType, setDeviceType] = useState<DeviceType>('responsive');
  const [imageAttachment, setImageAttachment] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

  const faqItems = [
    {
      q: 'What is Canvasly AI?',
      a: 'Canvasly is an AI-powered interface design platform inspired by natural language prompt generation. It transforms text descriptions, sketches, or reference wireframes into editable UI screens, design tokens, interactive prototypes, and production React + Tailwind CSS code.'
    },
    {
      q: 'Is Canvasly free to try?',
      a: 'Yes! The Starter plan gives you 3 complete project files to try out with basic design, prototyping, and collaboration features. You can upgrade anytime for unlimited files and advanced AI credits.'
    },
    {
      q: 'Can I export my designs to Figma?',
      a: 'Absolutely. Canvasly includes a 1-click Figma JSON schema exporter so you can copy and paste vector frames directly into Figma.'
    },
    {
      q: 'How do I export React and Tailwind code?',
      a: 'Select any screen on the infinite canvas or click the "Code" button in the top toolbar to view and copy production-ready TypeScript (TSX) component trees styled with Tailwind CSS.'
    },
    {
      q: 'Can I store data on Neon Postgres and Google Cloud Storage?',
      a: 'Yes! Canvasly features native integrations for Neon Serverless Postgres (http://neon.com/) for live SQL querying and database sync, as well as Google Cloud Storage for snapshot backups.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden relative">
      {/* Ambient Top Glow Nebula */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-violet-700/25 via-indigo-600/15 to-transparent blur-[120px] pointer-events-none -z-0"></div>

      {/* Top Navbar */}
      <nav className="h-16 border-b border-white/5 px-6 md:px-12 flex items-center justify-between z-20 bg-[#050608]/80 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-white tracking-tight">Canvasly</span>
            <span className="text-[10px] font-mono bg-white/10 text-slate-300 border border-white/15 px-2 py-0.5 rounded-full">
              AI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleLaunchNewProject()}
            className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-slate-200 transition-colors shadow-md"
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-12 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Design at the speed of AI
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-normal">
            Transform text into UI design for web and mobile app interfaces.
          </p>
        </div>

        {/* Stitch-Style Prompt Card */}
        <div className="max-w-2xl mx-auto bg-[#12131a]/90 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-2xl space-y-4 relative text-left">
          {imageAttachment && (
            <div className="flex items-center gap-2 bg-slate-900 border border-white/10 p-2 rounded-xl text-xs w-fit">
              <img src={imageAttachment} alt="Attach" className="w-6 h-6 rounded object-cover" />
              <span className="text-slate-300">Reference sketch attached</span>
              <button type="button" onClick={() => setImageAttachment(null)} className="text-slate-500 hover:text-white ml-2">✕</button>
            </div>
          )}

          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="What website or mobile app would you like to design?"
            className="w-full bg-transparent text-base md:text-lg text-white placeholder-slate-500 focus:outline-none font-sans px-1"
          />

          {/* Options Bar */}
          <div className="flex justify-between items-center border-t border-white/10 pt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Attach Sketch"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

              <div className="flex items-center gap-1 bg-slate-900/80 border border-white/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDeviceType('web')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    deviceType === 'web' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5 inline mr-1" /> Web
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceType('mobile')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    deviceType === 'mobile' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 inline mr-1" /> Mobile
                </button>
              </div>
            </div>

            <button
              onClick={() => handleLaunchNewProject()}
              className="py-2.5 px-6 rounded-full bg-white text-black font-bold text-xs hover:bg-slate-200 transition-all shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-violet-600" /> Generate
            </button>
          </div>
        </div>

        {/* Suggested Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPromptText(prompt.prompt);
                onCreateProjectFromPrompt(prompt.prompt, prompt.badge.toLowerCase() as DeviceType);
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" /> {prompt.title}
            </button>
          ))}
        </div>
      </section>

      {/* Hero Visual Card / Live Canvas Preview Banner */}
      <section className="max-w-5xl mx-auto px-6 mb-20 w-full">
        <div className="bg-[#0b0c12] border border-white/10 rounded-3xl p-8 relative overflow-hidden bg-canvas-dots shadow-2xl min-h-[320px] flex flex-col justify-center items-center text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="bg-[#121422]/90 backdrop-blur-xl border border-violet-500/40 p-4 rounded-2xl max-w-sm w-full shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              Generating new ideas...
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl text-xs font-mono text-slate-300 border border-white/5 flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-violet-400 animate-spin" />
              Reticulating Splines & Layout Tokens
            </div>
          </div>
        </div>
      </section>

      {/* Recent Canvas Projects */}
      <section className="max-w-5xl mx-auto px-6 mb-20 w-full space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Your Canvas Projects ({projects.length})</h2>
          <button
            onClick={() => handleLaunchNewProject()}
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            + Create New Canvas
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onOpenProject(proj.id)}
              className="group bg-[#0d0e15] border border-white/10 hover:border-violet-500/60 rounded-2xl overflow-hidden cursor-pointer transition-all hover:bg-[#121420] shadow-xl flex flex-col justify-between"
            >
              <div className="h-40 bg-[#06070a] relative overflow-hidden flex items-center justify-center border-b border-white/5">
                {proj.thumbnail ? (
                  <img src={proj.thumbnail} alt={proj.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full bg-canvas-dots flex items-center justify-center">
                    <div className="p-3 rounded-2xl bg-violet-600/20 border border-violet-500/40 text-violet-300 font-bold text-xl">
                      C
                    </div>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-black/80 border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-slate-300 uppercase">
                  {proj.deviceType}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-violet-300 transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{proj.description}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/5 text-xs text-slate-500">
                  <span>{proj.screens.length} screens</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateProject(proj.id);
                      }}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(proj.id);
                      }}
                      className="p-1 rounded hover:bg-slate-800 text-red-400 hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Get started with templates */}
      <section className="max-w-5xl mx-auto px-6 mb-20 w-full space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Get started with templates</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={() => handleLaunchNewProject()}
            className="group bg-[#0d0e16] border border-white/10 rounded-3xl p-6 cursor-pointer hover:border-violet-500/50 transition-all space-y-6"
          >
            <div className="h-56 bg-slate-900 rounded-2xl overflow-hidden border border-white/5 relative">
              <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Web App</span>
              <h3 className="text-lg font-bold text-white mt-1">Fashion & Editorial Showcase</h3>
            </div>
          </div>

          <div 
            onClick={() => handleLaunchNewProject()}
            className="group bg-[#0d0e16] border border-white/10 rounded-3xl p-6 cursor-pointer hover:border-violet-500/50 transition-all space-y-6"
          >
            <div className="h-56 bg-slate-900 rounded-2xl overflow-hidden border border-white/5 relative">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Dashboard</span>
              <h3 className="text-lg font-bold text-white mt-1">SaaS Analytics & Telemetry</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="max-w-5xl mx-auto px-6 mb-20 w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Easy edits */}
          <div className="bg-[#0b0c12] border border-white/10 rounded-3xl p-8 space-y-4">
            <h3 className="text-xl font-bold text-white">Easy edits</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tweak layout, color scheme, or text on the fly. Refine single screens or whole projects until it's just right.
            </p>
          </div>

          {/* Card 2: Export code */}
          <div className="bg-[#0b0c12] border border-white/10 rounded-3xl p-8 space-y-4">
            <h3 className="text-xl font-bold text-white">Export code</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Export HTML, React, or Tailwind CSS code directly, or copy Figma JSON vector frames into your workflow.
            </p>
          </div>

          {/* Card 3: Build with AI */}
          <div className="bg-[#0b0c12] border border-white/10 rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/40 text-violet-400 flex items-center justify-center mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Build with AI</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Leverage state-of-the-art multi-modal AI generation for intelligent layout synthesis.
            </p>
          </div>

          {/* Card 4: Own your design */}
          <div className="bg-[#0b0c12] border border-white/10 rounded-3xl p-8 space-y-4">
            <h3 className="text-xl font-bold text-white">Own your design</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              All generated UI screens are yours. Export designs to Figma or edit further in any IDE or code editor.
            </p>
          </div>
        </div>
      </section>

      {/* Vibe design CTA Banner */}
      <section className="max-w-5xl mx-auto px-6 mb-20 w-full">
        <div className="bg-gradient-to-b from-[#121422] to-[#07080d] border border-white/10 rounded-3xl p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-cyan-500/10 blur-3xl pointer-events-none"></div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Vibe design is here
          </h2>

          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Transform your thoughts directly into UI screens in seconds with Canvasly AI.
          </p>

          <button
            onClick={() => handleLaunchNewProject()}
            className="py-3 px-8 rounded-full bg-white text-black font-bold text-xs hover:bg-slate-200 transition-all shadow-xl"
          >
            Start designing
          </button>
        </div>
      </section>

      {/* Questions Accordion */}
      <section className="max-w-3xl mx-auto px-6 mb-20 w-full space-y-6">
        <h2 className="text-3xl font-bold text-white text-center">Questions?</h2>

        <div className="space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="bg-[#0b0c12] border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-semibold text-sm text-white flex justify-between items-center hover:bg-white/5 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-slate-400 leading-relaxed border-t border-white/5">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 md:px-12 bg-[#030406] text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span>Canvasly AI Platform</span>
        </div>
        <div className="flex gap-6">
          <a href="#privacy" className="hover:text-slate-300">Privacy policy</a>
          <a href="#terms" className="hover:text-slate-300">Terms of Service</a>
          <a href="#docs" className="hover:text-slate-300">Documentation</a>
        </div>
      </footer>
    </div>
  );
};
