import React from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  Building2,
  ShieldCheck,
  Zap,
  Activity,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const patentTrendData = [
  { month: 'Jan', nvidia: 12, qualcomm: 8, apple: 5 },
  { month: 'Feb', nvidia: 19, qualcomm: 10, apple: 7 },
  { month: 'Mar', nvidia: 24, qualcomm: 14, apple: 11 },
  { month: 'Apr', nvidia: 31, qualcomm: 18, apple: 14 },
  { month: 'May', nvidia: 45, qualcomm: 22, apple: 19 },
  { month: 'Jun', nvidia: 52, qualcomm: 28, apple: 23 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7 text-blue-400" />
            Executive Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time patent velocity, competitor landscape monitoring, and autonomous agent metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Agent Router Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0d1322] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Tracked Competitor Patents</span>
            <FileCheck2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">1,482</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% filings this quarter
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Agent Tool Executions</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">8,920</div>
          <div className="text-[11px] text-blue-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> selectPatentTools() 99.4% accuracy
          </div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Competitors</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">18 Companies</div>
          <div className="text-[11px] text-slate-400">NVIDIA, Qualcomm, Apple leading</div>
        </div>

        <div className="bg-[#0d1322] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Verified Legal Statuses</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">98.9% Valid</div>
          <div className="text-[11px] text-emerald-400">patentStatusChecker() synced</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#0b101c] border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">AI Inference Patent Filing Momentum</h2>
              <p className="text-xs text-slate-400">Monthly filings discovered by competitorPatentFinder()</p>
            </div>
            <span className="text-xs font-mono text-blue-400 bg-blue-950 border border-blue-800 px-2.5 py-1 rounded">2026 Trend</span>
          </div>

          <div className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patentTrendData}>
                <defs>
                  <linearGradient id="colorNvidia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorQualcomm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="nvidia" stroke="#3b82f6" fillOpacity={1} fill="url(#colorNvidia)" name="NVIDIA" />
                <Area type="monotone" dataKey="qualcomm" stroke="#a855f7" fillOpacity={1} fill="url(#colorQualcomm)" name="Qualcomm" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#0b101c] border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Recent Agent Tool Decisions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Live stream from selectPatentTools()</p>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-purple-400 font-semibold">competitorPatentFinder()</span>
                  <span className="text-[10px] text-slate-500">2 mins ago</span>
                </div>
                <p className="text-xs text-slate-300">Searched 42 NVIDIA filings for "Quantized Matrix Cores".</p>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-semibold">patentStatusChecker()</span>
                  <span className="text-[10px] text-slate-500">5 mins ago</span>
                </div>
                <p className="text-xs text-slate-300">Verified US-2025-001 active status & expiration in 2044.</p>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-blue-400 font-semibold">selectPatentTools()</span>
                  <span className="text-[10px] text-slate-500">12 mins ago</span>
                </div>
                <p className="text-xs text-slate-300">Routed query to dual-tool pipeline for full investigation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
