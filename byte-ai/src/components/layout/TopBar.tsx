import React from 'react';
import { Search, Bell, Activity } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 h-16 bg-[#070b12]/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between">
      <div className="relative w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search patents, assignees (e.g. NVIDIA, US-2025-001)..."
          className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
          <span>⌘K</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-800/50 text-xs">
          <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span className="text-slate-300 font-medium">Dynamic Tool Router:</span>
          <span className="text-blue-400 font-semibold">selectPatentTools()</span>
        </div>

        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white border border-indigo-400/40 shadow-sm">
            AI
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-slate-200">Senior Patent Intelligence Analyst</div>
            <div className="text-[10px] text-slate-400">Byte Autonomous Workspace</div>
          </div>
        </div>
      </div>
    </header>
  );
};
