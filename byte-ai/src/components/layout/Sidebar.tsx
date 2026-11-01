import React from 'react';
import { Page } from '../../App';
import {
  LayoutDashboard,
  Bot,
  Search,
  Building2,
  FileText,
  FileCheck2,
  TrendingUp,
  Bell,
  Bookmark,
  GitGraph,
  Settings as SettingsIcon,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const navItems: { id: Page; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'analyst', label: 'AI Analyst', icon: Bot, badge: 'Agent' },
    { id: 'patents', label: 'Patents Intelligence', icon: FileCheck2, badge: 'Tools' },
    { id: 'evidence', label: 'Evidence Graph', icon: GitGraph },
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'competitors', label: 'Competitors', icon: Building2 },
    { id: 'investigations', label: 'Investigations', icon: Search },
    { id: 'research', label: 'Research Papers', icon: FileText },
    { id: 'trends', label: 'Tech Trends', icon: TrendingUp },
    { id: 'alerts', label: 'Live Alerts', icon: Bell, badge: '3' },
    { id: 'watchlists', label: 'Watchlists', icon: Bookmark },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[250px] bg-[#090d16] border-r border-slate-800/80 flex flex-col z-30">
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-lg tracking-tight text-white">Byte AI</h1>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">v2.4</span>
          </div>
          <p className="text-xs text-slate-400">Competitive Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Agent Systems
        </div>
        {navItems.slice(0, 3).map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-4 h-4', isActive ? 'text-blue-400' : 'text-slate-400')} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                  isActive ? 'bg-blue-500/30 text-blue-300' : 'bg-slate-800 text-slate-400 border border-slate-700'
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Intelligence Hub
        </div>
        {navItems.slice(3).map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-4 h-4', isActive ? 'text-blue-400' : 'text-slate-400')} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                  isActive ? 'bg-blue-500/30 text-blue-300' : 'bg-slate-800 text-slate-400 border border-slate-700'
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 m-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center gap-3">
        <div className="relative">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <div className="text-xs flex-1">
          <div className="text-slate-200 font-medium">Patent Agent Active</div>
          <div className="text-slate-400 text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> 2 Tools Operational
          </div>
        </div>
      </div>
    </aside>
  );
};
