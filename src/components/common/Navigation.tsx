import React from 'react';
import { 
  Radio, 
  UserCheck, 
  Sliders, 
  FileAudio, 
  Fingerprint, 
  ShieldCheck, 
  Network, 
  BarChart3 
} from 'lucide-react';

export type ActiveTab = 
  | 'live_monitor'
  | 'agent_desktop'
  | 'policy_builder'
  | 'file_analyzer'
  | 'enrollment'
  | 'privacy_compliance'
  | 'integrations'
  | 'analytics';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'live_monitor' as ActiveTab,
      label: 'Live Call Monitor',
      icon: Radio,
      badge: 'HERO',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    {
      id: 'agent_desktop' as ActiveTab,
      label: 'Agent Desktop View',
      icon: UserCheck,
      badge: 'CRM',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    {
      id: 'policy_builder' as ActiveTab,
      label: 'Policy & Workflows',
      icon: Sliders,
      badge: 'NO-CODE',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
    {
      id: 'file_analyzer' as ActiveTab,
      label: 'File / Batch Analyzer',
      icon: FileAudio,
      badge: 'G.711 / AMR',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      id: 'enrollment' as ActiveTab,
      label: 'Enrolment & Consent',
      icon: Fingerprint,
      badge: '512-D VECTOR',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      id: 'privacy_compliance' as ActiveTab,
      label: 'Privacy & DPDP Act',
      icon: ShieldCheck,
      badge: 'AUDIT',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    {
      id: 'integrations' as ActiveTab,
      label: 'Integrations & API',
      icon: Network,
      badge: '/ws/analyze',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Analytics Dashboard',
      icon: BarChart3,
      badge: 'KPIs',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    },
  ];

  return (
    <nav className="bg-console-900/80 border-b border-console-800/80 px-4 backdrop-blur-sm overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 min-w-max">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all relative ${
                isActive
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/80 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-console-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${tab.badgeColor}`}
                >
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
