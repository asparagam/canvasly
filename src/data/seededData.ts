import type { Project, HistoryItem } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Canvasly Enterprise SaaS Design',
    description: 'Next-gen analytics dashboard and onboarding flow created from AI prompt.',
    deviceType: 'responsive',
    createdAt: '2026-07-25T10:00:00Z',
    updatedAt: 'Just now',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    screens: [
      {
        id: 'screen-saas-dashboard',
        title: 'SaaS Analytics Dashboard',
        type: 'saas-dashboard',
        device: 'web',
        x: 60,
        y: 60,
        width: 1100,
        height: 720,
        theme: 'dark',
        thumbnail: '',
        code: `import React from 'react';
import { TrendingUp, Users, DollarSign, Activity, Bell, Search } from 'lucide-react';

export default function SaaSMetricsDashboard() {
  return (
    <div className="flex h-full bg-[#0e1017] text-slate-100 rounded-xl overflow-hidden border border-slate-800 font-sans">
      {/* Sidebar Nav */}
      <aside className="w-60 bg-[#141722] border-r border-slate-800 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">
              C
            </div>
            <span className="font-semibold text-lg tracking-tight">Canvasly Cloud</span>
          </div>
          <nav className="space-y-1">
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-violet-600/20 text-violet-400 font-medium">
              <Activity className="w-4 h-4" /> Dashboard
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200">
              <Users className="w-4 h-4" /> Customers
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200">
              <DollarSign className="w-4 h-4" /> Revenue
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Performance Overview</h1>
            <p className="text-xs text-slate-400">Real-time metrics for Q3 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500" placeholder="Search analytics..." />
            </div>
            <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#141722] border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Monthly Recurring Revenue</span>
            <div className="text-2xl font-bold text-white mt-1">$48,290</div>
            <span className="text-xs text-emerald-400 flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" /> +14.2% from last month
            </span>
          </div>
          <div className="bg-[#141722] border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Active Subscribers</span>
            <div className="text-2xl font-bold text-white mt-1">3,420</div>
            <span className="text-xs text-emerald-400 flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" /> +8.6% new signups
            </span>
          </div>
          <div className="bg-[#141722] border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Avg Order Value</span>
            <div className="text-2xl font-bold text-white mt-1">$142.50</div>
            <span className="text-xs text-violet-400 flex items-center gap-1 mt-2">
              Steady growth
            </span>
          </div>
          <div className="bg-[#141722] border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">API Response Time</span>
            <div className="text-2xl font-bold text-white mt-1">42 ms</div>
            <span className="text-xs text-emerald-400 flex items-center gap-1 mt-2">
              99.99% Uptime
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}`
      },
      {
        id: 'screen-mobile-onboarding',
        title: 'Mobile Onboarding Flow',
        type: 'onboarding',
        device: 'mobile',
        x: 1220,
        y: 60,
        width: 380,
        height: 720,
        theme: 'violet',
        thumbnail: '',
        code: `import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function MobileOnboardingScreen() {
  return (
    <div className="w-full h-full bg-[#0b0c13] text-white flex flex-col justify-between p-6 rounded-[32px] border-4 border-slate-800 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl -z-0"></div>
      
      {/* Mobile Top Status Notch */}
      <div className="flex justify-between items-center text-xs text-slate-400 mb-6 px-2">
        <span>9:41</span>
        <div className="w-16 h-4 bg-slate-900 rounded-full border border-slate-800"></div>
        <span>100%</span>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center z-10">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 shadow-xl shadow-violet-500/20 mb-8 flex items-center justify-center">
          <div className="w-full h-full bg-[#0f111a] rounded-[22px] flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-cyan-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-3">
          Design at the speed of thought
        </h2>
        <p className="text-sm text-slate-400 px-4 mb-8">
          Transform text prompts and sketches into production-ready UI components in seconds.
        </p>

        <div className="w-full space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
            <Zap className="w-5 h-5 text-violet-400" />
            <div>
              <div className="text-xs font-semibold">Instant Code Export</div>
              <div className="text-[11px] text-slate-400">React + Tailwind TSX output</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-xs font-semibold">Design System Sync</div>
              <div className="text-[11px] text-slate-400">Tokens automatically configured</div>
            </div>
          </div>
        </div>
      </div>

      <div className="z-10 mt-6 space-y-3">
        <button id="cta-get-started" className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-sm text-white shadow-lg shadow-violet-600/30 hover:opacity-90 flex items-center justify-center gap-2">
          Get Started Now <ArrowRight className="w-4 h-4" />
        </button>
        <div className="flex justify-center gap-1.5 pt-2">
          <span className="w-6 h-1.5 rounded-full bg-violet-500"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
        </div>
      </div>
    </div>
  );
}`
      },
      {
        id: 'screen-mobile-profile',
        title: 'Mobile User Profile',
        type: 'mobile-profile',
        device: 'mobile',
        x: 1640,
        y: 60,
        width: 380,
        height: 720,
        theme: 'dark',
        thumbnail: '',
        code: `import React from 'react';
import { User, Shield, CreditCard, Bell, LogOut, ChevronRight } from 'lucide-react';

export default function MobileUserProfileScreen() {
  return (
    <div className="w-full h-full bg-[#0c0e16] text-white p-5 rounded-[32px] border-4 border-slate-800 shadow-2xl flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center text-xs text-slate-400 mb-6">
          <span>Profile</span>
          <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-medium">Pro Account</span>
        </div>

        <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-lg font-bold">
              FD
            </div>
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Fatma Dogan</h3>
            <p className="text-xs text-slate-400">Lead Design Architect</p>
            <span className="inline-block mt-1 text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
              fatma@canvasly.io
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 text-sm">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-violet-400" />
              <span>Personal Info</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 text-sm">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span>Billing & Plan</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 text-sm">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Security & 2FA</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 text-sm">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Notifications</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </div>

      <button className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/10 flex items-center justify-center gap-2">
        <LogOut className="w-3.5 h-3.5" /> Sign Out
      </button>
    </div>
  );
}`
      },
      {
        id: 'screen-ecommerce-checkout',
        title: 'Checkout & Order Summary',
        type: 'checkout',
        device: 'responsive',
        x: 60,
        y: 820,
        width: 650,
        height: 600,
        theme: 'dark',
        thumbnail: '',
        code: `import React from 'react';
import { CreditCard, CheckCircle2, Shield } from 'lucide-react';

export default function CheckoutModal() {
  return (
    <div className="w-full h-full bg-[#11131c] text-white p-6 rounded-2xl border border-slate-800 flex flex-col justify-between font-sans">
      <div>
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
          <h3 className="font-bold text-lg text-white">Complete Your Order</h3>
          <span className="text-xs text-slate-400">Step 2 of 2</span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400">Cardholder Name</label>
            <input className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none" defaultValue="Fatma Dogan" />

            <label className="block text-xs font-medium text-slate-400">Card Number</label>
            <div className="relative">
              <input className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-3 pr-10 py-2 text-xs text-white focus:border-violet-500 focus:outline-none" defaultValue="•••• •••• •••• 4242" />
              <CreditCard className="w-4 h-4 absolute right-3 top-2.5 text-slate-500" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-400">Expires</label>
                <input className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none" defaultValue="12/28" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400">CVC</label>
                <input className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none" defaultValue="888" />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-semibold text-slate-300">Order Summary</h4>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Canvasly Pro Annual</span>
              <span>$288.00</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>AI Token Bundle (50k)</span>
              <span>$24.00</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-400">
              <span>Promo Discount (20%)</span>
              <span>-$62.40</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold text-white">
              <span>Total Due</span>
              <span className="text-violet-400">$249.60</span>
            </div>
          </div>
        </div>
      </div>

      <button id="cta-pay-now" className="w-full mt-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-semibold text-sm rounded-xl text-white shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4" /> Pay $249.60 & Activate Plan
      </button>
    </div>
  );
}`
      }
    ],
    flowConnections: [
      {
        id: 'conn-1',
        sourceScreenId: 'screen-mobile-onboarding',
        targetScreenId: 'screen-saas-dashboard',
        sourceLabel: 'Get Started CTA',
        targetLabel: 'SaaS Analytics Dashboard',
        color: '#8b5cf6'
      },
      {
        id: 'conn-2',
        sourceScreenId: 'screen-saas-dashboard',
        targetScreenId: 'screen-mobile-profile',
        sourceLabel: 'Profile Icon',
        targetLabel: 'Mobile User Profile',
        color: '#38bdf8'
      },
      {
        id: 'conn-3',
        sourceScreenId: 'screen-saas-dashboard',
        targetScreenId: 'screen-ecommerce-checkout',
        sourceLabel: 'Upgrade Plan Button',
        targetLabel: 'Checkout Modal',
        color: '#ec4899'
      }
    ],
    comments: [
      {
        id: 'comm-1',
        screenId: 'screen-saas-dashboard',
        x: 420,
        y: 120,
        author: 'Sarah Chen (Lead UX)',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        text: 'The MRR stats card looks super crisp! Let’s add a sparkline graph right beside the percentage.',
        timestamp: '10 min ago',
        resolved: false
      }
    ]
  },
  {
    id: 'proj-2',
    name: 'Pulse Mobile Wallet & Fintech',
    description: 'Neomorphic dark mobile banking flow with card management & transaction history.',
    deviceType: 'mobile',
    createdAt: '2026-07-24T14:30:00Z',
    updatedAt: 'Yesterday',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    screens: [
      {
        id: 'screen-mobile-onboarding',
        title: 'Mobile Onboarding Flow',
        type: 'onboarding',
        device: 'mobile',
        x: 100,
        y: 100,
        width: 380,
        height: 720,
        theme: 'violet',
        thumbnail: '',
        code: `// Mobile onboarding code`
      }
    ],
    flowConnections: [],
    comments: []
  }
];

export const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: 'hist-1',
    timestamp: 'Just now',
    description: 'Connected Onboarding screen to SaaS Dashboard flow',
    screensCount: 4,
    actionType: 'edit'
  },
  {
    id: 'hist-2',
    timestamp: '15 mins ago',
    description: 'Generated E-Commerce Checkout Modal using Canvasly Flash 2.0',
    screensCount: 4,
    actionType: 'ai-generate'
  },
  {
    id: 'hist-3',
    timestamp: '1 hour ago',
    description: 'Updated dark violet color tokens across all frames',
    screensCount: 3,
    actionType: 'edit'
  },
  {
    id: 'hist-4',
    timestamp: '2 hours ago',
    description: 'Created Canvasly Enterprise SaaS Design project',
    screensCount: 3,
    actionType: 'create'
  }
];

export const SAMPLE_PROMPTS = [
  {
    title: 'Mobile Onboarding Flow',
    badge: 'Mobile',
    prompt: 'Create a 3-step dark mobile onboarding screen with glassmorphism cards, violet glow accents, and a prominent Get Started CTA button.',
    icon: 'Smartphone'
  },
  {
    title: 'SaaS Analytics Dashboard',
    badge: 'Web App',
    prompt: 'Generate a dark SaaS analytics dashboard with MRR metrics, subscriber growth chart, search header, and transaction data table.',
    icon: 'Layout'
  },
  {
    title: 'Warmer Color Palette Revamp',
    badge: 'Design System',
    prompt: 'Revise the active project color system to warm amber, obsidian graphite, and emerald status indicators.',
    icon: 'Palette'
  },
  {
    title: 'E-Commerce Checkout Modal',
    badge: 'Responsive',
    prompt: 'Design a sleek dark mode checkout modal with credit card inputs, order itemized summary, promo coupon field, and Pay Now button.',
    icon: 'ShoppingBag'
  }
];
