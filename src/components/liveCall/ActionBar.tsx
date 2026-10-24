import React from 'react';
import { useCallContext } from '../../context/CallContext';
import { 
  AlertTriangle, 
  PhoneCall, 
  KeyRound, 
  UserPlus, 
  PauseCircle, 
  Ban, 
  CheckCircle2 
} from 'lucide-react';

export const ActionBar: React.FC = () => {
  const {
    selectedCall,
    handlePreTransactionWarning,
    handleRequestCallback,
    handleTriggerMFA,
    handleEscalateSupervisor,
    handleHoldTransaction,
    handleMarkFraud,
  } = useCallContext();

  return (
    <div className="bg-console-900 rounded-2xl border border-console-800 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Enterprise Action Bar (Incident Response Protocol)
        </h3>
        <span className="text-[10px] font-mono text-slate-400">
          State: <strong className="text-cyan-300 uppercase">{selectedCall.status}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {/* 1. Pre-transaction warning */}
        <button
          onClick={handlePreTransactionWarning}
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-amber-500/40 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40 hover:border-amber-500 transition-all text-center group"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold leading-tight">Pre-Tx Warning</span>
          <span className="text-[9px] text-amber-400/80 font-mono">Agent banner</span>
        </button>

        {/* 2. Request Call-Back */}
        <button
          onClick={handleRequestCallback}
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-500 transition-all text-center group"
        >
          <PhoneCall className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold leading-tight">Request Callback</span>
          <span className="text-[9px] text-cyan-400/80 font-mono">Out-of-band Telco</span>
        </button>

        {/* 3. Trigger MFA */}
        <button
          onClick={handleTriggerMFA}
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-blue-500/40 bg-blue-950/20 text-blue-300 hover:bg-blue-950/40 hover:border-blue-500 transition-all text-center group"
        >
          <KeyRound className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold leading-tight">Trigger MFA</span>
          <span className="text-[9px] text-blue-400/80 font-mono">FIDO2 / SMS Push</span>
        </button>

        {/* 4. Escalate to Supervisor */}
        <button
          onClick={handleEscalateSupervisor}
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-purple-500/40 bg-purple-950/20 text-purple-300 hover:bg-purple-950/40 hover:border-purple-500 transition-all text-center group"
        >
          <UserPlus className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold leading-tight">Escalate Desk</span>
          <span className="text-[9px] text-purple-400/80 font-mono">Tier-2 Fraud Team</span>
        </button>

        {/* 5. Hold Transaction */}
        <button
          onClick={handleHoldTransaction}
          className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border border-rose-500/50 bg-rose-950/30 text-rose-300 hover:bg-rose-950/50 hover:border-rose-500 transition-all text-center group shadow-[0_0_10px_rgba(239,68,68,0.2)]"
        >
          <PauseCircle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold leading-tight">Hold Transaction</span>
          <span className="text-[9px] text-rose-400/80 font-mono">Freeze 240 mins</span>
        </button>

        {/* 6. Mark as Fraud / False Alarm */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => handleMarkFraud(true)}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-red-600 bg-red-950/40 text-red-300 hover:bg-red-900/60 transition-all text-[11px] font-bold"
          >
            <Ban className="w-3.5 h-3.5 text-red-400" />
            <span>Mark Fraud</span>
          </button>
          <button
            onClick={() => handleMarkFraud(false)}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-emerald-600/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 transition-all text-[11px] font-bold"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>False Alarm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
