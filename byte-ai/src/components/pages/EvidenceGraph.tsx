import React from 'react';
import { GitGraph } from 'lucide-react';
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: '🎯 Target Query: NVIDIA AI Inference' },
    position: { x: 250, y: 20 },
    style: { background: '#1e293b', color: '#38bdf8', border: '1px solid #0284c7', borderRadius: '12px', padding: '12px', fontWeight: 'bold', fontSize: '12px' }
  },
  {
    id: '2',
    data: { label: '⚡ Router: selectPatentTools()' },
    position: { x: 250, y: 120 },
    style: { background: '#1e1b4b', color: '#c084fc', border: '1px solid #6366f1', borderRadius: '12px', padding: '12px', fontWeight: 'bold', fontSize: '12px' }
  },
  {
    id: '3',
    data: { label: '🔍 Tool 1: competitorPatentFinder()' },
    position: { x: 80, y: 220 },
    style: { background: '#3b0764', color: '#e9d5ff', border: '1px solid #a855f7', borderRadius: '12px', padding: '10px', fontSize: '11px' }
  },
  {
    id: '4',
    data: { label: '🛡️ Tool 2: patentStatusChecker()' },
    position: { x: 420, y: 220 },
    style: { background: '#064e3b', color: '#a7f3d0', border: '1px solid #10b981', borderRadius: '12px', padding: '10px', fontSize: '11px' }
  },
  {
    id: '5',
    data: { label: '📄 US-2025-001 (NVIDIA Quantized Cores)' },
    position: { x: 40, y: 340 },
    style: { background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '10px', padding: '10px', fontSize: '11px' }
  },
  {
    id: '6',
    data: { label: '📄 US-2025-004 (Speculative Decoding)' },
    position: { x: 250, y: 340 },
    style: { background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: '10px', padding: '10px', fontSize: '11px' }
  },
  {
    id: '7',
    data: { label: '✅ Active Status Verified (Paid till 2028)' },
    position: { x: 450, y: 340 },
    style: { background: '#022c22', color: '#34d399', border: '1px solid #059669', borderRadius: '10px', padding: '10px', fontSize: '11px' }
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#38bdf8' } },
  { id: 'e2-3', source: '2', target: '3', label: 'Discovers Filings', style: { stroke: '#a855f7' } },
  { id: 'e2-4', source: '2', target: '4', label: 'Verifies Legal Status', style: { stroke: '#10b981' } },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e3-6', source: '3', target: '6' },
  { id: 'e4-7', source: '4', target: '7', animated: true, style: { stroke: '#34d399' } }
];

export const EvidenceGraph: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GitGraph className="w-7 h-7 text-blue-400" />
            Agent Evidence & Tool Pipeline Graph
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing dynamic agent decision paths, entity relationships, and patent status verification chains.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-950/80 border border-purple-800 text-purple-300 text-xs rounded-full font-mono">
            selectPatentTools Node Pipeline
          </span>
        </div>
      </div>

      <div className="h-[600px] bg-[#070d19] border border-slate-800 rounded-2xl overflow-hidden relative shadow-2xl">
        <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
          <Background color="#1e293b" gap={16} />
          <Controls className="bg-slate-900 border-slate-800 text-white fill-white" />
        </ReactFlow>

        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-xs space-y-1.5 z-10 shadow-lg">
          <div className="font-semibold text-slate-200">Execution Graph Legend</div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-3 h-3 rounded-full bg-blue-500" /> Analyst Query Node
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-3 h-3 rounded-full bg-purple-500" /> selectPatentTools() Router
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-3 h-3 rounded-full bg-emerald-500" /> Tool Status Verification
          </div>
        </div>
      </div>
    </div>
  );
};
