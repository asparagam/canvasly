import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PricingPlanModalProps {
  onClose: () => void;
  onUpgradePlan: (planName: string) => void;
  currentPlan?: 'starter' | 'professional' | 'organization';
  limitNotice?: string;
}

export const PricingPlanModal: React.FC<PricingPlanModalProps> = ({
  onClose,
  onUpgradePlan,
  currentPlan = 'starter',
  limitNotice
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handleSelectPlan = (plan: string) => {
    onUpgradePlan(plan);
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    } catch (e) {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6 select-none overflow-y-auto">
      <div className="bg-[#1e1e1e] text-white border border-slate-800 rounded-2xl w-full max-w-5xl p-6 md:p-8 shadow-2xl space-y-6 relative my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Which plan and seats would you like?
          </h2>
          {limitNotice && (
            <div className="mt-2 text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/40 p-2.5 rounded-xl">
              ⚠️ {limitNotice} Upgrade to Professional for unlimited files and advanced AI credits!
            </div>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {/* STARTER PLAN */}
          <div className={`bg-[#2c2c2c] border rounded-2xl p-6 flex flex-col justify-between space-y-6 ${
            currentPlan === 'starter' ? 'border-slate-600' : 'border-slate-700/60'
          }`}>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Starter</h3>
                <p className="text-xs text-slate-400 mt-1">Best for anyone who wants to sample Canvasly</p>
              </div>

              <div className="pt-8">
                <div className="text-sm font-semibold text-slate-300 mb-4">Free, but limited features</div>
                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-[#3d3d3d] text-slate-400 font-semibold text-xs cursor-default"
                >
                  Current plan
                </button>
              </div>

              <div className="border-t border-slate-700/80 pt-4 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span><strong>3 files</strong> to try out</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Basic design, prototyping, and collaboration</span>
                </div>
              </div>
            </div>
          </div>

          {/* PROFESSIONAL PLAN (MOST POPULAR) */}
          <div className="bg-[#2c2c2c] border border-violet-500/80 rounded-2xl p-6 flex flex-col justify-between space-y-6 relative shadow-2xl glow-violet">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Professional</h3>
                  <span className="text-[11px] font-semibold bg-violet-600/30 text-violet-300 border border-violet-500/40 px-2.5 py-0.5 rounded-full">
                    Most popular
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Best for small teams to create and collaborate</p>
              </div>

              {/* Monthly vs Annual Toggle */}
              <div className="bg-[#1e1e1e] p-1 rounded-xl flex items-center gap-1 w-fit text-xs font-medium">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1 rounded-lg ${billingCycle === 'monthly' ? 'bg-[#3d3d3d] text-white' : 'text-slate-400'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-3 py-1 rounded-lg ${billingCycle === 'annual' ? 'bg-[#3d3d3d] text-white' : 'text-slate-400'}`}
                >
                  Annual (Save 20%)
                </button>
              </div>

              {/* Seats breakdown */}
              <div className="space-y-2 text-xs pt-1 border-t border-slate-700/80">
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Full</span>
                    <span className="text-[10px] text-slate-400">🎨 💻 💬</span>
                  </div>
                  <span className="font-bold text-white text-base">${billingCycle === 'annual' ? '16' : '18'}<span className="text-xs text-slate-400 font-normal">/mo</span></span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Dev</span>
                    <span className="text-[10px] text-slate-400">💻 💬</span>
                  </div>
                  <span className="font-bold text-white text-base">${billingCycle === 'annual' ? '12' : '14'}<span className="text-xs text-slate-400 font-normal">/mo</span></span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Collab</span>
                    <span className="text-[10px] text-slate-400">💬</span>
                  </div>
                  <span className="font-bold text-white text-base">${billingCycle === 'annual' ? '3' : '5'}<span className="text-xs text-slate-400 font-normal">/mo</span></span>
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan('Professional')}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-slate-200 transition-colors shadow-lg"
              >
                Upgrade and choose seats
              </button>

              <div className="border-t border-slate-700/80 pt-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Unlimited files and folders</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Advanced prototyping</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>A team-wide design library for components, variables, and modes</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>File handoff tools like annotation, statuses, and advanced inspection</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>3000 AI credits/month for Full seats</span>
                </div>
              </div>
            </div>
          </div>

          {/* ORGANIZATION PLAN */}
          <div className="bg-[#2c2c2c] border border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">Organization</h3>
                <p className="text-xs text-slate-400 mt-1">Best for teams who need org-wide libraries and easy admin control</p>
              </div>

              <div className="text-xs text-slate-400 pt-1 font-medium">Billed annually</div>

              {/* Seats breakdown */}
              <div className="space-y-2 text-xs pt-1 border-t border-slate-700/80">
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Full</span>
                    <span className="text-[10px] text-slate-400">🎨 💻 💬</span>
                  </div>
                  <span className="font-bold text-white text-base">$55<span className="text-xs text-slate-400 font-normal">/mo</span></span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Dev</span>
                    <span className="text-[10px] text-slate-400">💻 💬</span>
                  </div>
                  <span className="font-bold text-white text-base">$25<span className="text-xs text-slate-400 font-normal">/mo</span></span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Collab</span>
                    <span className="text-[10px] text-slate-400">💬</span>
                  </div>
                  <span className="font-bold text-white text-base">$5<span className="text-xs text-slate-400 font-normal">/mo</span></span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleSelectPlan('Organization')}
                  className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-slate-200 transition-colors shadow-lg"
                >
                  Upgrade and choose seats
                </button>
                <div className="text-center">
                  <a href="#contact" className="text-xs text-slate-400 underline hover:text-white">Or, contact sales</a>
                </div>
              </div>

              <div className="border-t border-slate-700/80 pt-4 space-y-2.5 text-xs text-slate-300">
                <div className="font-semibold text-white text-xs mb-1">Everything on Professional, plus:</div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>A centralized admin hub</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Org-wide design libraries</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>SCIM provisioning</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>File features like branching and merging</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Code Connect and private plugins</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>3500 AI credits/month for Full seats</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
