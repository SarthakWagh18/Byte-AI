import React from 'react';
import { Building2 } from 'lucide-react';

export const Competitors: React.FC = () => {
  const competitorsList = [
    {
      name: 'NVIDIA Corporation',
      ticker: 'NVDA',
      techFocus: 'AI Inference Accelerators & LLM Chips',
      patentsCount: 412,
      activeStatus: 'Aggressive Filing Phase',
      riskLevel: 'High Threat'
    },
    {
      name: 'Qualcomm Technologies',
      ticker: 'QCOM',
      techFocus: 'Mobile NPU & Edge Neural Architectures',
      patentsCount: 320,
      activeStatus: 'Steady Filing Phase',
      riskLevel: 'Moderate Threat'
    },
    {
      name: 'Apple Inc.',
      ticker: 'AAPL',
      techFocus: 'On-Device AI Memory & Neural Engine',
      patentsCount: 289,
      activeStatus: 'Active Pending Filings',
      riskLevel: 'High Threat'
    },
    {
      name: 'Broadcom Inc.',
      ticker: 'AVGO',
      techFocus: 'Interconnect & Custom AI Accelerators',
      patentsCount: 195,
      activeStatus: 'Under Litigation Review',
      riskLevel: 'Elevated Legal Risk'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Building2 className="w-7 h-7 text-blue-400" />
          Competitor Tracking & Portfolio Analysis
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor competitor assignees, tech velocity, and automated patent portfolio audits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competitorsList.map((c) => (
          <div key={c.name} className="bg-[#0b101c] border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-950 border border-blue-800 px-2 py-0.5 rounded font-bold">
                  {c.ticker}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{c.name}</h3>
                <p className="text-xs text-slate-400">{c.techFocus}</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                {c.riskLevel}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
              <div>
                <span className="text-slate-400 text-[10px] block">Patents Discovered</span>
                <span className="font-bold text-white font-mono">{c.patentsCount} Filings</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Filing Cadence</span>
                <span className="font-semibold text-emerald-400">{c.activeStatus}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
