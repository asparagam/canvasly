import React from 'react';
import type { Screen } from '../../types';
import { 
  TrendingUp, Users, DollarSign, Activity, Search, 
  Sparkles, ArrowRight, ShieldCheck, Zap, 
  User, Shield, CreditCard, LogOut, ChevronRight, CheckCircle2,
  SlidersHorizontal, Filter
} from 'lucide-react';

interface ScreenRendererProps {
  screen: Screen;
  onButtonClick?: (targetScreenType?: string, buttonId?: string) => void;
  interactive?: boolean;
}

export const ScreenRenderer: React.FC<ScreenRendererProps> = ({ screen, onButtonClick, interactive = true }) => {
  const handleElementClick = (e: React.MouseEvent, id: string, targetType?: string) => {
    if (!interactive) return;
    e.stopPropagation();
    if (onButtonClick) {
      onButtonClick(targetType, id);
    }
  };

  switch (screen.type) {
    case 'saas-dashboard':
      return (
        <div className="w-full h-full bg-[#0c0e17] text-slate-100 flex flex-col font-sans select-none overflow-hidden rounded-xl border border-slate-800/80">
          {/* Top Bar */}
          <div className="h-14 border-b border-slate-800/80 bg-[#121422]/90 px-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md text-xs">
                C
              </div>
              <span className="font-semibold text-sm tracking-tight text-white">Canvasly Cloud</span>
              <span className="ml-3 text-[11px] bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full font-medium">
                v2.4 Live
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input 
                  readOnly
                  className="bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 w-52 placeholder-slate-500" 
                  placeholder="Search metrics..." 
                />
              </div>
              <button 
                onClick={(e) => handleElementClick(e, 'profile-btn', 'mobile-profile')}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-violet-500/50 transition-colors"
                title="View Profile (Connected Flow)"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white">
                  FD
                </div>
                <span className="text-xs text-slate-300 pr-1">Fatma</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-48 bg-[#10121e] border-r border-slate-800/80 p-3 space-y-1 text-xs">
              <a className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-violet-600/20 text-violet-300 font-medium border border-violet-500/30">
                <Activity className="w-4 h-4 text-violet-400" /> Overview
              </a>
              <a className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200">
                <Users className="w-4 h-4" /> Customers
              </a>
              <a className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200">
                <DollarSign className="w-4 h-4" /> Revenue
              </a>
              <a className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200">
                <SlidersHorizontal className="w-4 h-4" /> Settings
              </a>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-[#090a10]">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Executive Dashboard</h2>
                  <p className="text-xs text-slate-400">Real-time revenue telemetry & API analytics</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white">
                    <Filter className="w-3.5 h-3.5" /> Filter
                  </button>
                  <button 
                    onClick={(e) => handleElementClick(e, 'upgrade-plan-btn', 'checkout')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-xs text-white shadow-md shadow-violet-600/20 hover:opacity-95"
                  >
                    Upgrade Plan
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#121422] border border-slate-800/90 p-4 rounded-xl">
                  <div className="flex justify-between items-start text-xs text-slate-400 mb-1">
                    <span>Monthly Recurring</span>
                    <DollarSign className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="text-xl font-bold text-white">$48,290</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                    <TrendingUp className="w-3 h-3" /> +14.2% vs last month
                  </div>
                </div>

                <div className="bg-[#121422] border border-slate-800/90 p-4 rounded-xl">
                  <div className="flex justify-between items-start text-xs text-slate-400 mb-1">
                    <span>Active Subscribers</span>
                    <Users className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-xl font-bold text-white">3,420</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                    <TrendingUp className="w-3 h-3" /> +8.6% new signups
                  </div>
                </div>

                <div className="bg-[#121422] border border-slate-800/90 p-4 rounded-xl">
                  <div className="flex justify-between items-start text-xs text-slate-400 mb-1">
                    <span>Average Order</span>
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xl font-bold text-white">$142.50</div>
                  <div className="text-[11px] text-cyan-400 flex items-center gap-1 mt-1 font-medium">
                    Healthy expansion
                  </div>
                </div>

                <div className="bg-[#121422] border border-slate-800/90 p-4 rounded-xl">
                  <div className="flex justify-between items-start text-xs text-slate-400 mb-1">
                    <span>Latency Uptime</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-white">99.98%</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                    42ms avg response
                  </div>
                </div>
              </div>

              {/* Chart Visual */}
              <div className="bg-[#121422] border border-slate-800/90 p-5 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-semibold text-white">Revenue Growth & Projections</h3>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-violet-500"></span> Actual</span>
                    <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> AI Forecast</span>
                  </div>
                </div>
                {/* SVG Line Chart */}
                <div className="h-36 w-full relative flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120">
                    <defs>
                      <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,100 Q80,70 160,85 T320,30 T500,10 L500,120 L0,120 Z" fill="url(#gradient-area)" />
                    <path d="M0,100 Q80,70 160,85 T320,30 T500,10" fill="none" stroke="#8b5cf6" strokeWidth="3" />
                    <path d="M320,30 Q410,15 500,5" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'onboarding':
      return (
        <div className="w-full h-full bg-[#0b0c13] text-white flex flex-col justify-between p-6 rounded-[28px] border-4 border-slate-800/90 shadow-2xl relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl -z-0"></div>

          {/* Status bar */}
          <div className="flex justify-between items-center text-xs text-slate-400 mb-4 px-1">
            <span>9:41</span>
            <div className="w-16 h-3.5 bg-slate-900 rounded-full border border-slate-800"></div>
            <span>100%</span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center z-10 px-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-violet-500/25 mb-6 flex items-center justify-center">
              <div className="w-full h-full bg-[#0f111a] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <h2 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-2">
              Design at the speed of light
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Generate editable UI components and interactive prototypes from natural language.
            </p>

            <div className="w-full space-y-2.5">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                <Zap className="w-4 h-4 text-violet-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">Instant Code Output</div>
                  <div className="text-[10px] text-slate-400">React + Tailwind TSX exported</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">Design System Sync</div>
                  <div className="text-[10px] text-slate-400">Tokens synced automatically</div>
                </div>
              </div>
            </div>
          </div>

          <div className="z-10 mt-4 space-y-2.5">
            <button 
              onClick={(e) => handleElementClick(e, 'cta-get-started', 'saas-dashboard')}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-xs text-white shadow-lg shadow-violet-600/30 hover:opacity-90 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex justify-center gap-1.5 pt-1">
              <span className="w-5 h-1.5 rounded-full bg-violet-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            </div>
          </div>
        </div>
      );

    case 'mobile-profile':
      return (
        <div className="w-full h-full bg-[#0c0e16] text-white p-5 rounded-[28px] border-4 border-slate-800/90 shadow-2xl flex flex-col justify-between select-none">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-400 mb-5">
              <span>User Profile</span>
              <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-medium border border-violet-500/30">Pro Member</span>
            </div>

            <div className="flex items-center gap-3.5 mb-5 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-400 p-0.5 shrink-0">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-sm font-bold">
                  FD
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Fatma Dogan</h3>
                <p className="text-[11px] text-slate-400">Design Architect</p>
                <span className="inline-block mt-0.5 text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-1.5 py-0.2 rounded">
                  fatma@canvasly.io
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-violet-400" />
                  <span>Account Information</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </div>

              <div 
                onClick={(e) => handleElementClick(e, 'billing-btn', 'checkout')}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <span>Subscription & Billing</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Security & Passwords</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          </div>

          <button className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 flex items-center justify-center gap-2">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      );

    case 'checkout':
      return (
        <div className="w-full h-full bg-[#11131c] text-white p-6 rounded-2xl border border-slate-800/90 flex flex-col justify-between font-sans select-none overflow-y-auto">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-base text-white">Upgrade Subscription</h3>
              <span className="text-[11px] text-slate-400">Step 2 of 2</span>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Form */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Cardholder Name</label>
                  <input readOnly className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" defaultValue="Fatma Dogan" />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Card Details</label>
                  <div className="relative">
                    <input readOnly className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-3 pr-9 py-1.5 text-xs text-white" defaultValue="•••• •••• •••• 4242" />
                    <CreditCard className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Expires</label>
                    <input readOnly className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white" defaultValue="12/28" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">CVC</label>
                    <input readOnly className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white" defaultValue="888" />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl space-y-2.5 text-xs">
                <h4 className="font-semibold text-slate-300 text-[11px]">Order Summary</h4>
                <div className="flex justify-between text-slate-400">
                  <span>Canvasly Pro (Annual)</span>
                  <span>$288.00</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>50,000 AI Generation Tokens</span>
                  <span>$24.00</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount (20%)</span>
                  <span>-$62.40</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-white">
                  <span>Total</span>
                  <span className="text-violet-400">$249.60</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={(e) => handleElementClick(e, 'cta-pay-now', 'saas-dashboard')}
            className="w-full mt-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 font-semibold text-xs rounded-xl text-white shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Pay $249.60 & Complete Setup
          </button>
        </div>
      );

    default:
      return (
        <div className="w-full h-full bg-[#121420] text-slate-200 p-6 rounded-xl border border-slate-800 flex flex-col justify-center items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-white">{screen.title}</h3>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            Generated UI screen screen with responsive layout tokens.
          </p>
        </div>
      );
  }
};
