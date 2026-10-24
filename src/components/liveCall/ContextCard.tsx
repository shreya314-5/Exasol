import React from 'react';
import { useCallContext } from '../../context/CallContext';
import { 
  Compass, 
  UserCheck, 
  UserX, 
  CreditCard, 
  AlertOctagon, 
  MapPin, 
  Server, 
  Zap, 
  Clock 
} from 'lucide-react';

export const ContextCard: React.FC = () => {
  const { selectedCall } = useCallContext();
  const { contextData } = selectedCall;

  return (
    <div className="bg-console-900 rounded-2xl border border-console-800 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-console-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Contextual Metadata & Identity Correlation
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Call ID: <strong className="text-slate-200">{selectedCall.id}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* 1. Call Origin & Telephony */}
        <div className="bg-console-950 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Call Origin & Telecom</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
            <div>
              <span className="text-slate-500">Location:</span> {contextData.callOrigin.city}, {contextData.callOrigin.country}
            </div>
            <div>
              <span className="text-slate-500">Carrier:</span> {contextData.callOrigin.carrier}
            </div>
            <div>
              <span className="text-slate-500">Gateway IP:</span> {contextData.callOrigin.ipAddress}
            </div>
            <div>
              <span className="text-slate-500">SIP User-Agent:</span> {contextData.callOrigin.sipUserAgent}
            </div>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-slate-500">CLI Spoof Likelihood:</span>
              <span
                className={`font-bold ${
                  contextData.callOrigin.spoofingProbability > 0.5 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {(contextData.callOrigin.spoofingProbability * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* 2. Known-Contact Voiceprint Match */}
        <div className="bg-console-950 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-2">
            {contextData.knownContactMatch.similarityScore > 75 ? (
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <UserX className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>Known Voiceprint Match</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
            <div>
              <span className="text-slate-500">Target User:</span>{' '}
              <strong className="text-white">
                {contextData.knownContactMatch.enrolledName || 'No Verified Match'}
              </strong>
            </div>
            {contextData.knownContactMatch.role && (
              <div>
                <span className="text-slate-500">Enrolled Role:</span> {contextData.knownContactMatch.role}
              </div>
            )}
            <div>
              <span className="text-slate-500">Embedding Sim:</span>{' '}
              <span
                className={`font-bold ${
                  contextData.knownContactMatch.similarityScore > 75 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {contextData.knownContactMatch.similarityScore}%
              </span>{' '}
              <span className="text-slate-500 text-[10px]">
                {contextData.knownContactMatch.similarityScore > 75 ? '(Legitimate)' : '(Mismatch / Impersonation)'}
              </span>
            </div>
            {contextData.knownContactMatch.enrolledEmbeddingId && (
              <div className="text-[10px] text-slate-400 truncate">
                Ref ID: {contextData.knownContactMatch.enrolledEmbeddingId}
              </div>
            )}
          </div>
        </div>

        {/* 3. Transaction Details & Amount */}
        <div className="bg-console-950 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-2">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>Pending Financial Exposure</span>
          </div>

          {contextData.transaction.hasPendingTransaction ? (
            <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
              <div>
                <span className="text-slate-500">Amount:</span>{' '}
                <span className="text-amber-400 font-bold text-sm">
                  ₹{contextData.transaction.amount?.toLocaleString('en-IN')}{' '}
                  <span className="text-[10px] text-slate-400">
                    (${Math.round(contextData.transaction.amount! / 83.5).toLocaleString('en-US')})
                  </span>
                </span>
              </div>
              <div className="truncate">
                <span className="text-slate-500">Type:</span> {contextData.transaction.type}
              </div>
              <div className="truncate">
                <span className="text-slate-500">Beneficiary:</span> {contextData.transaction.beneficiary}
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-slate-500">Urgency:</span>
                <span className="text-rose-400 font-bold uppercase">
                  {contextData.transaction.urgencyLevel}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-[11px] italic py-3 text-center">
              No financial transaction attached to this session.
            </div>
          )}
        </div>

      </div>

      {/* Past Fraud Indicators */}
      {contextData.pastFraudIndicators.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-900/60 p-2.5 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 text-rose-400 font-mono font-bold text-[11px] uppercase mb-1.5">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Telecom & Historical Security Signals</span>
          </div>
          <div className="space-y-1">
            {contextData.pastFraudIndicators.map((ind, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>{ind.flag}</span>
                </span>
                <span className="text-slate-500 font-mono">{ind.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
