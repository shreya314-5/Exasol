import React, { useState } from 'react';
import { ANALYTICS_DATA } from '../../services/mockData';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldAlert, 
  DollarSign, 
  Zap, 
  Languages, 
  Phone, 
  Clock, 
  Layers, 
  Calendar 
} from 'lucide-react';

export const AnalyticsDashboardView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'ytd'>('30d');

  // Multiplier for time range
  const multiplier = timeRange === '24h' ? 0.05 : timeRange === '7d' ? 0.25 : timeRange === '30d' ? 1.0 : 4.2;

  const kpis = {
    callsMonitored: Math.round(1428920 * multiplier).toLocaleString(),
    attacksDetected: Math.round(1842 * multiplier).toLocaleString(),
    preventedUSD: `$${(14.25 * multiplier).toFixed(1)}M`,
    preventedINR: `₹${(118.8 * multiplier).toFixed(1)} Cr`,
    falseAlarmRate: '0.34%',
    latency: '138ms',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-6">
      
      {/* Header & Time Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-console-900 p-4 rounded-2xl border border-console-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-400 border border-indigo-800">
              TELEMETRY & INTELLIGENCE
            </span>
            <h2 className="text-base font-bold text-white">Enterprise Voice Integrity Analytics</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global attack landscape, prevented fraud loss calculations, channel risk distributions, and language attack models.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1 bg-console-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          {[
            { id: '24h', label: 'Last 24 Hours' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: 'ytd', label: 'Year-to-Date' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id as '24h' | '7d' | '30d' | 'ytd')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === t.id
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Calls Monitored */}
        <div className="bg-console-900 p-3.5 rounded-2xl border border-console-800 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Calls Intercepted</span>
          <div className="text-xl font-bold font-mono text-white mt-1">{kpis.callsMonitored}</div>
          <span className="text-[10px] font-mono text-emerald-400 mt-1">+14.2% MoM</span>
        </div>

        {/* Attacks Detected */}
        <div className="bg-console-900 p-3.5 rounded-2xl border border-rose-900/40 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Spoof Attacks</span>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">{kpis.attacksDetected}</div>
          <span className="text-[10px] font-mono text-rose-400/80 mt-1">Interventions Made</span>
        </div>

        {/* Prevented Loss (USD / INR) */}
        <div className="bg-console-900 p-3.5 rounded-2xl border border-amber-900/40 flex flex-col justify-between md:col-span-1 lg:col-span-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Prevented Loss Estimate</span>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {kpis.preventedINR}{' '}
            <span className="text-xs font-normal text-slate-400">({kpis.preventedUSD})</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 mt-1">Based on frozen wire tokens</span>
        </div>

        {/* False Alarm Rate */}
        <div className="bg-console-900 p-3.5 rounded-2xl border border-console-800 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase">False Alarm Rate</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{kpis.falseAlarmRate}</div>
          <span className="text-[10px] font-mono text-slate-400 mt-1">SLA Target &lt; 0.50%</span>
        </div>

        {/* Mean Latency */}
        <div className="bg-console-900 p-3.5 rounded-2xl border border-console-800 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Mean Latency</span>
          <div className="text-xl font-bold font-mono text-cyan-300 mt-1">{kpis.latency}</div>
          <span className="text-[10px] font-mono text-cyan-400/80 mt-1">Zero call lag</span>
        </div>

      </div>

      {/* Row 2: Risk by Language & Risk by Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk by Language (6 cols) */}
        <div className="lg:col-span-6 bg-console-900 rounded-2xl border border-console-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Languages className="w-4 h-4 text-cyan-400" />
              <span>Voice Spoof Risk by Dialect & Language</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Regional Models</span>
          </div>

          <div className="space-y-3">
            {ANALYTICS_DATA.riskByLanguage.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">{item.language}</span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-slate-400">
                      {Math.round(item.calls * multiplier).toLocaleString()} calls
                    </span>
                    <span className="text-rose-400 font-bold">
                      {Math.round(item.attackCount * multiplier)} attacks ({(item.riskRate * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="w-full bg-console-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-rose-500 rounded-full"
                    style={{ width: `${item.riskRate * 500}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk by Channel (6 cols) */}
        <div className="lg:col-span-6 bg-console-900 rounded-2xl border border-console-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Risk Distribution by Ingestion Channel</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Telephony Routes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ANALYTICS_DATA.riskByChannel.map((ch, idx) => (
              <div key={idx} className="bg-console-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{ch.channel}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-console-900 text-cyan-300 border border-slate-800">
                    {ch.share} Volume
                  </span>
                </div>

                <div className="space-y-1 font-mono text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Attack Share:</span>
                    <span className="text-rose-400 font-bold">{ch.attackPct}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Avg Risk Index:</span>
                    <span className="text-white font-bold">{ch.riskScoreAvg}/100</span>
                  </div>
                </div>

                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${ch.riskScoreAvg > 40 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${ch.riskScoreAvg}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Hourly Attack Distribution & Top Attack Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hourly Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-console-900 rounded-2xl border border-console-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Attack Volume by Hour of Day (Peak Attack Windows)</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400">Peak: 14:00 - 18:00</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-1.5 pt-6 px-1">
            {ANALYTICS_DATA.hourlyDistribution.map((h, i) => {
              const maxAttacks = 350;
              const heightPct = (h.attacks / maxAttacks) * 100;
              const isPeak = h.attacks > 250;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {h.attacks}
                  </span>
                  <div
                    className={`w-full rounded-t-md transition-all group-hover:scale-105 ${
                      isPeak
                        ? 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                        : 'bg-gradient-to-t from-cyan-900 to-cyan-500'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] font-mono text-slate-500">{h.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Attack Patterns (5 cols) */}
        <div className="lg:col-span-5 bg-console-900 rounded-2xl border border-console-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Top Attack Vectors Observed</span>
            </h3>
          </div>

          <div className="space-y-3">
            {ANALYTICS_DATA.topAttackPatterns.map((p, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-console-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{p.pattern}</span>
                  <span className="font-mono text-rose-400 font-bold">{p.pct}%</span>
                </div>
                <p className="text-[10px] text-slate-400">{p.description}</p>
                <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
