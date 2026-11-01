import React from 'react';
import { Search, Clock } from 'lucide-react';

export const Investigations: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Search className="w-7 h-7 text-blue-400" />
          Active Intelligence Dossiers & Investigations
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Deep-dive technical reports synthesized by autonomous agent pipelines.
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            title: 'NVIDIA Transformer Inference Hardware Claims Audit',
            date: 'Updated Today',
            status: 'Completed Dossier',
            findings: 'Discovered 3 key patents (US-2025-001, US-2025-004, US-2024-882) covering speculative decoding and quantized matrix multiplier units.'
          },
          {
            title: 'Edge NPU Power Efficiency Prior Art Survey',
            date: 'Updated Yesterday',
            status: 'In Progress',
            findings: 'Analyzing Qualcomm and Apple memory compaction claims against European patent publications.'
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-[#0b101c] border border-slate-800 p-5 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                {item.status}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {item.date}
              </span>
            </div>
            <h3 className="text-base font-bold text-white">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{item.findings}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
