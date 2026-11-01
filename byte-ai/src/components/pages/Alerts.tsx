import React from 'react';
import { Bell } from 'lucide-react';

export const Alerts: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bell className="w-7 h-7 text-blue-400" />
          Real-Time Filing & Legal Alerts
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Notifications triggered by automated patentStatusChecker() legal fee and publication checks.
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            type: 'New Patent Published',
            title: 'NVIDIA published US-2025-004: Distributed Speculative Decoding',
            time: '10 mins ago',
            severity: 'High Priority'
          },
          {
            type: 'Legal Status Update',
            title: 'patentStatusChecker() confirmed US-2025-001 fee maintenance active till 2028',
            time: '1 hour ago',
            severity: 'Verified'
          },
          {
            type: 'Competitor Filing Flag',
            title: 'Qualcomm NPU Spatial Dataflow patent granted by USPTO',
            time: '4 hours ago',
            severity: 'Notice'
          }
        ].map((a, idx) => (
          <div key={idx} className="bg-[#0b101c] border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">{a.type}</span>
                <h3 className="text-xs font-bold text-white mt-0.5">{a.title}</h3>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 block mb-1">
                {a.severity}
              </span>
              <span className="text-[10px] text-slate-500">{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
