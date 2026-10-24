import React, { useState } from 'react';
import { useCallContext } from '../../context/CallContext';
import { RiskBadge } from '../common/RiskBadge';
import { ChannelType } from '../../types';
import { Phone, Globe, MessageSquare, Search, Filter, Clock } from 'lucide-react';

export const CallList: React.FC = () => {
  const { calls, selectedCallId, setSelectedCallId } = useCallContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<'ALL' | ChannelType>('ALL');

  const filteredCalls = calls.filter(call => {
    const matchesSearch =
      call.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.callerNumber.includes(searchTerm) ||
      call.language.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = channelFilter === 'ALL' || call.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  const getChannelIcon = (channel: ChannelType) => {
    switch (channel) {
      case 'PSTN':
        return <Phone className="w-3.5 h-3.5 text-amber-400" />;
      case 'VoIP':
        return <Globe className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Teams':
        return <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <Phone className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-console-900 rounded-2xl border border-console-800 p-4 flex flex-col h-full max-h-[860px]">
      {/* Header & Stats */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <h2 className="text-sm font-bold text-white tracking-wide font-mono uppercase">
            Active Calls Queue
          </h2>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-console-800 text-slate-300 border border-slate-700">
          {filteredCalls.length} / {calls.length} Active
        </span>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search caller, number, language..."
          className="w-full bg-console-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
        />
      </div>

      {/* Channel Filter Pills */}
      <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        {(['ALL', 'VoIP', 'PSTN', 'Teams'] as const).map((ch) => (
          <button
            key={ch}
            onClick={() => setChannelFilter(ch)}
            className={`px-2.5 py-1 rounded-lg font-mono transition-all ${
              channelFilter === ch
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                : 'bg-console-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* Calls Scroll List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredCalls.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No calls match criteria
          </div>
        ) : (
          filteredCalls.map((call) => {
            const isSelected = call.id === selectedCallId;

            return (
              <div
                key={call.id}
                onClick={() => setSelectedCallId(call.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-console-800/90 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/80'
                    : 'bg-console-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-console-900/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-white truncate">
                        {call.callerName}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      {call.callerNumber}
                    </div>
                  </div>
                  <RiskBadge band={call.riskBand} score={call.currentRiskScore} size="sm" />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      {getChannelIcon(call.channel)}
                      <span>{call.channel}</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 truncate max-w-[90px]">
                      {call.language}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{formatDuration(call.durationSeconds)}</span>
                  </div>
                </div>

                {call.status !== 'active' && (
                  <div className="mt-1.5 pt-1 flex items-center justify-between text-[10px] font-mono font-bold uppercase">
                    <span
                      className={`px-1.5 py-0.2 rounded border ${
                        call.status === 'held'
                          ? 'bg-rose-950 text-rose-400 border-rose-800'
                          : call.status === 'escalated'
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      }`}
                    >
                      Status: {call.status}
                    </span>
                    {call.contextData.transaction.hasPendingTransaction && (
                      <span className="text-amber-400">
                        ₹{(call.contextData.transaction.amount! / 100000).toFixed(1)}L Wire
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
