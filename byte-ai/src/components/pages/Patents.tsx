import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  Building2,
  Calendar,
  Zap,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Sparkles
} from 'lucide-react';
import {
  MOCK_PATENTS_DATABASE,
  PatentRecord,
  selectPatentTools
} from '../../agent/patentTools';

export const Patents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('NVIDIA');
  const [selectedPatent, setSelectedPatent] = useState<PatentRecord>(MOCK_PATENTS_DATABASE[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending'>('all');
  const [toolRoutingOutput, setToolRoutingOutput] = useState<ReturnType<typeof selectPatentTools> | null>(null);

  const filteredPatents = MOCK_PATENTS_DATABASE.filter((patent) => {
    const matchesSearch =
      patent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patent.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patent.techArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patent.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'active') return matchesSearch && patent.status === 'Active';
    if (activeTab === 'pending') return matchesSearch && patent.status === 'Pending';
    return matchesSearch;
  });

  const handleTestRouting = () => {
    const routing = selectPatentTools(searchTerm);
    setToolRoutingOutput(routing);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-7 h-7 text-blue-400" />
            Patents & IP Intelligence Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time USPTO & EPO patent tracking with agent functions <code className="text-purple-300">competitorPatentFinder()</code> and <code className="text-emerald-300">patentStatusChecker()</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestRouting}
            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 rounded-xl text-blue-300 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Zap className="w-4 h-4 text-blue-400" />
            <span>Evaluate selectPatentTools("{searchTerm}")</span>
          </button>
        </div>
      </div>

      {toolRoutingOutput && (
        <div className="bg-slate-900/90 border border-blue-800/60 rounded-xl p-4 space-y-2 animate-fadeIn shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span>selectPatentTools("{searchTerm}") Decision Result:</span>
            </div>
            <span className="text-[10px] text-slate-400">Evaluated Instantaneously</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-300">Selected Tools:</span>
            {toolRoutingOutput.tools.map(t => (
              <span key={t} className="text-xs font-mono font-bold bg-blue-950 text-blue-300 border border-blue-700 px-2 py-0.5 rounded">
                {t}()
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400 italic">"{toolRoutingOutput.rationale}"</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0c1220] border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by company, ID or tech..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs w-full sm:w-auto justify-center">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'all' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Filings ({MOCK_PATENTS_DATABASE.length})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'active' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'pending' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredPatents.map((patent) => {
              const isSelected = selectedPatent.id === patent.id;
              return (
                <div
                  key={patent.id}
                  onClick={() => setSelectedPatent(patent)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#0f182d] border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-[#0a0f1d] hover:bg-[#0c1426] border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400 px-2 py-0.5 bg-blue-950 border border-blue-800 rounded">
                          {patent.id}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{patent.jurisdiction}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-blue-300">
                        {patent.title}
                      </h3>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        patent.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : patent.status === 'Pending'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {patent.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <strong className="text-slate-300">{patent.assignee}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Filing: {patent.filingDate}</span>
                      </span>
                    </div>
                    <span className="text-[11px] text-blue-400 font-medium">
                      {patent.claimsCount} Claims
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-20 bg-[#0b101c] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-blue-400 px-2.5 py-1 bg-blue-950 border border-blue-800 rounded">
                  {selectedPatent.id}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Status: {selectedPatent.status}
                </span>
              </div>

              <h2 className="text-base font-bold text-white mt-3 leading-snug">
                {selectedPatent.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">{selectedPatent.assignee} — {selectedPatent.jurisdiction}</p>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="text-xs">
                <div className="text-emerald-300 font-semibold flex items-center gap-1">
                  <span>patentStatusChecker({selectedPatent.id})</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-slate-400 text-[11px]">
                  Maintenance fees paid up to {selectedPatent.legalStatusDetails.nextFeeDue}. Expiration: {selectedPatent.legalStatusDetails.expirationDate}.
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                Patent Abstract & Technical Scope
              </h3>
              <p className="text-xs text-slate-300 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                {selectedPatent.abstract}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 text-[10px] block">Technical Domain</span>
                <span className="text-slate-200 font-medium">{selectedPatent.techArea}</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 text-[10px] block">Grant Date</span>
                <span className="text-slate-200 font-mono">{selectedPatent.grantDate}</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 text-[10px] block">Litigation Risk</span>
                <span className="text-emerald-400 font-semibold">{selectedPatent.legalStatusDetails.litigationRisk} Risk</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 text-[10px] block">Claims Count</span>
                <span className="text-blue-400 font-mono font-bold">{selectedPatent.claimsCount} Independent & Dependent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
