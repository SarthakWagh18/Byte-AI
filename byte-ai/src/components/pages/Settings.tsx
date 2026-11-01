import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-blue-400" />
          Agent System Settings & Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage tool parameters for <code className="text-purple-300">competitorPatentFinder()</code> and <code className="text-emerald-300">patentStatusChecker()</code>.
        </p>
      </div>

      <div className="bg-[#0b101c] border border-slate-800 p-6 rounded-2xl space-y-6 shadow-xl">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            Dynamic Agent Routing (<code className="text-blue-400">selectPatentTools</code>)
          </h2>

          <div className="flex items-center justify-between p-4 bg-slate-900/80 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-200">Auto-tool selection threshold</div>
              <div className="text-[11px] text-slate-400">Automatically invoke status checking for explicit patent ID references</div>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 rounded" />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900/80 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-200">USPTO & EPO Live Database Mirror</div>
              <div className="text-[11px] text-slate-400">Synchronize maintenance fee schedules every 24 hours</div>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
              Synced & Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
