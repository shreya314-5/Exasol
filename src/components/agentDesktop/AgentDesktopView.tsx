import React, { useState } from 'react';
import { useCallContext } from '../../context/CallContext';
import { 
  ShieldAlert, 
  Smartphone, 
  Mail, 
  Bell, 
  CheckCircle, 
  XCircle, 
  PhoneCall, 
  Lock, 
  AlertTriangle, 
  User, 
  CreditCard 
} from 'lucide-react';

export const AgentDesktopView: React.FC = () => {
  const { 
    selectedCall, 
    handleTriggerMFA, 
    handleRequestCallback, 
    handleHoldTransaction,
    handleMarkFraud,
    addToast
  } = useCallContext();

  const [activeAlertTab, setActiveAlertTab] = useState<'sms' | 'email' | 'push'>('sms');
  const [transferApproved, setTransferApproved] = useState(false);

  const isCritical = selectedCall.currentRiskScore >= 80;
  const isHigh = selectedCall.currentRiskScore >= 60 && selectedCall.currentRiskScore < 80;
  const isMed = selectedCall.currentRiskScore >= 30 && selectedCall.currentRiskScore < 60;
  const isLow = selectedCall.currentRiskScore < 30;

  // Traffic light state
  const trafficLightColor = isCritical || isHigh ? 'red' : isMed ? 'yellow' : 'green';

  const handleApprove = () => {
    if (isCritical || isHigh) {
      const confirm = window.confirm(
        `WARNING: Risk is ${selectedCall.currentRiskScore}/100 (${selectedCall.riskBand}). Overriding this warning requires supervisor authorization. Proceed anyway?`
      );
      if (!confirm) return;
    }
    setTransferApproved(true);
    addToast({
      title: 'Transfer Approved by Agent',
      description: 'Transaction authorization submitted to core banking settlement gateway.',
      type: 'warning',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-6">
      
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-console-900 p-4 rounded-2xl border border-console-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
              AGENT SIDE-PANEL WIDGET
            </span>
            <h2 className="text-base font-bold text-white">Bank CRM / Contact Centre Agent Terminal</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulates the lightweight real-time voice integrity widget embedded directly within an agent’s Genesys, Avaya, or Salesforce console.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-console-950 px-3 py-1.5 rounded-xl border border-slate-800">
          Agent: <strong className="text-white">Rajiv Mehta (Desk #4)</strong> • Branch: Mumbai HQ
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Minimal Bank Agent Widget (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          <div className="bg-console-900 rounded-2xl border-2 border-console-800 shadow-2xl p-5 relative overflow-hidden">
            {/* Widget Header */}
            <div className="flex items-center justify-between border-b border-console-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-sm tracking-wide text-white">
                  VoiceShield Sidecar
                </span>
              </div>
              <div className="text-[11px] font-mono px-2 py-0.5 rounded bg-console-950 text-slate-300 border border-slate-800">
                Live Intercept
              </div>
            </div>

            {/* Traffic Light Indicator */}
            <div className="bg-console-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* 3-light bezel */}
                <div className="flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-full border border-slate-700 shadow-inner">
                  {/* Red Light */}
                  <span
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                      trafficLightColor === 'red'
                        ? 'bg-rose-500 shadow-[0_0_12px_#EF4444] animate-pulse ring-2 ring-rose-400'
                        : 'bg-rose-950/40 opacity-30'
                    }`}
                  />
                  {/* Yellow Light */}
                  <span
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                      trafficLightColor === 'yellow'
                        ? 'bg-amber-400 shadow-[0_0_12px_#F59E0B] animate-pulse ring-2 ring-amber-300'
                        : 'bg-amber-950/40 opacity-30'
                    }`}
                  />
                  {/* Green Light */}
                  <span
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                      trafficLightColor === 'green'
                        ? 'bg-emerald-400 shadow-[0_0_12px_#10B981] ring-2 ring-emerald-300'
                        : 'bg-emerald-950/40 opacity-30'
                    }`}
                  />
                </div>

                <div>
                  <div className="text-xs font-bold font-mono text-white">
                    {trafficLightColor === 'red'
                      ? 'DANGER: CLONE DETECTED'
                      : trafficLightColor === 'yellow'
                      ? 'CAUTION: ELEVATED RISK'
                      : 'VOICE VERIFIED (AUTHENTIC)'}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Voice Risk: <strong className="text-white">{selectedCall.currentRiskScore}</strong>/100
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full border bg-console-900 text-cyan-300 border-cyan-800">
                  {selectedCall.riskBand}
                </span>
              </div>
            </div>

            {/* High Risk Pop-up Warning Banner */}
            {(isCritical || isHigh) && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border-2 border-rose-500/80 mb-4 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-200 uppercase tracking-wide">
                      Security Alert: Voice Risk High
                    </h4>
                    <p className="text-xs text-rose-300 mt-1 font-medium leading-relaxed">
                      "Voice risk high. Verify by call-back or MFA before approving this transfer."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Caller & Pending Transaction Summary */}
            <div className="space-y-2 text-xs bg-console-950 p-3.5 rounded-xl border border-slate-800 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Caller:</span>
                </span>
                <span className="font-semibold text-white">{selectedCall.callerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Phone / Channel:</span>
                <span className="font-mono text-slate-200">{selectedCall.callerNumber} ({selectedCall.channel})</span>
              </div>
              {selectedCall.contextData.transaction.hasPendingTransaction && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pending Wire:</span>
                  </span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    ₹{selectedCall.contextData.transaction.amount?.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Agent Action Buttons */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleRequestCallback}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-semibold transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                  <span>Verify by Call-Back</span>
                </button>
                <button
                  onClick={handleTriggerMFA}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-800 text-blue-300 text-xs font-semibold transition-all"
                >
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span>Trigger MFA</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    handleHoldTransaction();
                    handleMarkFraud(true);
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-200 text-xs font-bold transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Decline Transfer</span>
                </button>

                <button
                  onClick={handleApprove}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    transferApproved
                      ? 'bg-emerald-900 text-emerald-200 border-emerald-500'
                      : isCritical || isHigh
                      ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border-emerald-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{transferApproved ? 'Approved' : 'Approve Transfer'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right: Simulated Multi-Channel Alert Previews (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-console-900 rounded-2xl border border-console-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase">
                  Simulated Multi-Channel Alert Previews
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated security alerts dispatched when voice risk or policy triggers trip.
                </p>
              </div>

              {/* Alert Channel Tabs */}
              <div className="flex items-center gap-1 bg-console-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setActiveAlertTab('sms')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                    activeAlertTab === 'sms'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Customer SMS</span>
                </button>
                <button
                  onClick={() => setActiveAlertTab('email')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                    activeAlertTab === 'email'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Officer Email</span>
                </button>
                <button
                  onClick={() => setActiveAlertTab('push')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                    activeAlertTab === 'push'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>App Push</span>
                </button>
              </div>
            </div>

            {/* SMS Preview */}
            {activeAlertTab === 'sms' && (
              <div className="max-w-md mx-auto bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 shadow-2xl text-slate-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                  <span className="font-mono">SMS • HDFC-SECURE</span>
                  <span>Now</span>
                </div>
                <div className="mt-4 p-4 rounded-2xl bg-cyan-950/60 border border-cyan-800 text-xs leading-relaxed space-y-2">
                  <p className="font-bold text-cyan-300">
                    [URGENT SECURITY ALERT]
                  </p>
                  <p>
                    A high-risk call claiming to represent you requested an RTGS wire transfer of ₹{selectedCall.contextData.transaction.amount?.toLocaleString('en-IN') || '2,40,00,000'}.
                  </p>
                  <p className="text-amber-300">
                    VoiceShield AI flagged an acoustic synthetic voice-clone signature (Risk: {selectedCall.currentRiskScore}/100).
                  </p>
                  <p className="font-mono text-[11px] text-slate-400">
                    If this was NOT you, reply 'BLOCK' or call 1800-VOICE-SHIELD immediately.
                  </p>
                </div>
              </div>
            )}

            {/* Email Preview */}
            {activeAlertTab === 'email' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-xs text-slate-200 space-y-3">
                <div className="pb-3 border-b border-slate-800 space-y-1 text-[11px] font-mono text-slate-400">
                  <div><strong>From:</strong> fraud-ops@voiceshield.enterprise.bank</div>
                  <div><strong>To:</strong> chief-risk-officer@enterprise.bank, branch-manager@hq.bank</div>
                  <div><strong>Subject:</strong> [CRITICAL FRAUD INCIDENT #{selectedCall.id}] Impersonation Wire Transfer Intercepted</div>
                </div>

                <div className="space-y-2 leading-relaxed">
                  <p className="font-bold text-rose-400 text-sm">
                    High-Risk Voice Clone Incident Intercepted in Live PSTN Session
                  </p>
                  <p>
                    An active call session involving caller ID <strong>{selectedCall.callerNumber}</strong> impersonating <strong>{selectedCall.callerName}</strong> has triggered Rule #RULE-001 (Executive Impersonation Circuit Breaker).
                  </p>
                  <div className="p-3 bg-console-900 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1">
                    <div>• Risk Index: <span className="text-rose-400 font-bold">{selectedCall.currentRiskScore}/100 ({selectedCall.riskBand})</span></div>
                    <div>• Wire Value: <span className="text-amber-400 font-bold">₹{selectedCall.contextData.transaction.amount?.toLocaleString('en-IN')}</span></div>
                    <div>• Primary Reason: {selectedCall.topReasons[0]}</div>
                    <div>• Status: HELD pending physical biometric / video KYC verification</div>
                  </div>
                </div>
              </div>
            )}

            {/* In-App Push Preview */}
            {activeAlertTab === 'push' && (
              <div className="max-w-md mx-auto bg-slate-950 border-2 border-slate-800 rounded-3xl p-4 shadow-2xl">
                <div className="p-4 rounded-2xl bg-console-900 border border-cyan-800/80 shadow-lg space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      <ShieldAlert className="w-4 h-4 text-cyan-400" />
                      <span>Mobile Banking Security Prompt</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">1m ago</span>
                  </div>

                  <p className="text-xs text-slate-200">
                    Are you currently on a call with Bank Support authorizing a ₹{selectedCall.contextData.transaction.amount?.toLocaleString('en-IN') || '2,40,00,000'} wire?
                  </p>

                  <div className="text-[11px] font-mono p-2 rounded bg-rose-950/60 border border-rose-800 text-rose-300">
                    AI Voice Cloner Detected on incoming call stream.
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleMarkFraud(true)}
                      className="py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                    >
                      NO, IT'S FRAUD!
                    </button>
                    <button
                      onClick={() => addToast({ title: 'User Confirmed', description: 'User verified via biometric push', type: 'info' })}
                      className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                    >
                      Yes, it was me
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
