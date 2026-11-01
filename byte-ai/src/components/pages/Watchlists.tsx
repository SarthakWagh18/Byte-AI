import React from 'react';
import { Bookmark } from 'lucide-react';

export const Watchlists: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bookmark className="w-7 h-7 text-blue-400" />
          Intellectual Property Watchlists
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Custom corporate assignees and key patent clusters under active surveillance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'NVIDIA AI Inference Portfolio', count: '14 Active Watch Items', updated: '2 mins ago' },
          { name: 'On-Device Mobile LLM Acceleration', count: '8 Active Watch Items', updated: '1 hour ago' }
        ].map((w, idx) => (
          <div key={idx} className="bg-[#0b101c] border border-slate-800 p-5 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">{w.name}</h3>
              <Bookmark className="w-4 h-4 text-blue-400 fill-blue-400/20" />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>{w.count}</span>
              <span className="text-slate-500">{w.updated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
