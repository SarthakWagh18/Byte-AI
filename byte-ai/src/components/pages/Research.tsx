import React from 'react';
import { FileText, ExternalLink, BookOpen } from 'lucide-react';

export const Research: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-7 h-7 text-blue-400" />
          Academic & Technical Research Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          ArXiv, IEEE, and industry research papers paired with patent claims prior art.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'Speculative Decoding Acceleration in Multi-GPU Architectures',
            authors: 'NVIDIA Research Team (2025)',
            journal: 'ArXiv IEEE Micro',
            link: 'US-2025-004 Patent Connection'
          },
          {
            title: 'Sub-Byte Quantization for Matrix Multiply Units',
            authors: 'Stanford & AI Hardware Lab',
            journal: 'ISCA 2024',
            link: 'US-2025-001 Patent Connection'
          }
        ].map((paper, idx) => (
          <div key={idx} className="bg-[#0b101c] border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950 border border-purple-800 px-2 py-0.5 rounded font-bold">
                {paper.journal}
              </span>
              <BookOpen className="w-4 h-4 text-slate-500" />
            </div>
            <h3 className="text-sm font-bold text-white leading-snug">{paper.title}</h3>
            <p className="text-xs text-slate-400">{paper.authors}</p>
            <div className="pt-2 border-t border-slate-800 text-xs text-blue-400 flex items-center gap-1 font-medium">
              <span>{paper.link}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
