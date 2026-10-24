import React from 'react';
import { useCallContext } from '../../context/CallContext';
import { Sparkles, Shield, UserX, Landmark, Activity } from 'lucide-react';

export const ScenarioBar: React.FC = () => {
  const { selectScenario, selectedCall } = useCallContext();

  const scenarios = [
    {
      id: 'genuine' as const,
      title: '(a) Genuine Customer Call',
      subtitle: 'Natural prosody, authenticated voiceprint',
      badge: 'LOW RISK ~16',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      icon: Shield,
    },
    {
      id: 'ceo_fraud' as const,
      title: '(b) CEO-Fraud Wire Transfer',
      subtitle: 'Hindi-accented English, ₹2.4 Cr wire',
      badge: 'CRITICAL ~92',
      badgeColor: 'bg-rose-950 text-rose-400 border-rose-800',
      icon: UserX,
    },
    {
      id: 'gov_tamil' as const,
      title: '(c) Cloned Govt Official',
      subtitle: 'Tamil extortion & fake penalty claim',
      badge: 'CRITICAL ~84',
      badgeColor: 'bg-orange-950 text-orange-400 border-orange-800',
      icon: Landmark,
    },
    {
      id: 'speaker_drift' as const,
      title: '(d) Voice-Conversion Drift',
      subtitle: 'Starts genuine → spikes to RVC clone mid-call',
      badge: 'DRIFT ATTACK ~89',
      badgeColor: 'bg-purple-950 text-purple-400 border-purple-800',
      icon: Activity,
    },
  ];

  return (
    <div className="bg-console-900/90 border-b border-console-800/80 p-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              Demo Scenarios
            </span>
            <span className="hidden lg:inline text-[11px] text-slate-400 ml-2">
              Drive live data stream:
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
          {scenarios.map(sc => {
            const Icon = sc.icon;
            const isCurrent = selectedCall.scenarioType === sc.id;

            return (
              <button
                key={sc.id}
                onClick={() => selectScenario(sc.id)}
                className={`text-left p-2.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-console-800 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500'
                    : 'bg-console-950/70 border-slate-800 hover:border-slate-700 hover:bg-console-900'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      {sc.title}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold ${sc.badgeColor}`}>
                    {sc.badge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  {sc.subtitle}
                </p>
                {isCurrent && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
