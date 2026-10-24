import React, { useState } from 'react';
import { useCallContext } from '../../context/CallContext';
import { PolicyRule, ChannelType } from '../../types';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  ArrowRight, 
  Layers 
} from 'lucide-react';

export const PolicyBuilderView: React.FC = () => {
  const { policies, togglePolicy, addPolicy, deletePolicy, addToast } = useCallContext();

  const [isCreating, setIsCreating] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [ruleDesc, setRuleDesc] = useState('');
  const [minRisk, setMinRisk] = useState<number>(75);
  const [minAmount, setMinAmount] = useState<number>(1000000);
  const [selectedChannel, setSelectedChannel] = useState<ChannelType | 'ALL'>('ALL');
  const [actionNotify, setActionNotify] = useState(true);
  const [actionMFA, setActionMFA] = useState(true);
  const [actionDelayMins, setActionDelayMins] = useState<number>(120);
  const [actionLogEvidence, setActionLogEvidence] = useState(true);
  const [actionDropCall, setActionDropCall] = useState(false);

  // Test Simulator State
  const [testRisk, setTestRisk] = useState<number>(82);
  const [testAmount, setTestAmount] = useState<number>(2500000);
  const [testChannel, setTestChannel] = useState<ChannelType>('VoIP');
  const [testResults, setTestResults] = useState<{
    triggeredRules: PolicyRule[];
    actionsToExecute: string[];
    simulatedAt: string;
  } | null>(null);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    addPolicy({
      name: ruleName,
      description: ruleDesc || 'Custom enterprise voice security rule.',
      enabled: true,
      priority: policies.length + 1,
      conditions: {
        minRiskScore: minRisk,
        minAmount: minAmount,
        channel: selectedChannel,
      },
      actions: {
        notifyFraudOps: actionNotify,
        requireMFA: actionMFA,
        delaySettlementMins: actionDelayMins,
        logEvidence: actionLogEvidence,
        dropCall: actionDropCall,
        preTransactionWarning: true,
      },
    });

    setIsCreating(false);
    setRuleName('');
    setRuleDesc('');
  };

  const runTestSimulation = () => {
    const triggered = policies.filter(p => {
      if (!p.enabled) return false;
      const riskMatch = p.conditions.minRiskScore ? testRisk >= p.conditions.minRiskScore : true;
      const amountMatch = p.conditions.minAmount ? testAmount >= p.conditions.minAmount : true;
      const channelMatch = p.conditions.channel === 'ALL' || !p.conditions.channel || p.conditions.channel === testChannel;
      return riskMatch && amountMatch && channelMatch;
    });

    const actions = new Set<string>();
    triggered.forEach(r => {
      if (r.actions.notifyFraudOps) actions.add('Notify Fraud Operations Center');
      if (r.actions.requireMFA) actions.add('Enforce Out-of-Band Step-Up MFA Challenge');
      if (r.actions.delaySettlementMins > 0) actions.add(`Delay Settlement by ${r.actions.delaySettlementMins} minutes`);
      if (r.actions.logEvidence) actions.add('Log Forensics to Immutable DPDP Audit Trail');
      if (r.actions.dropCall) actions.add('Instantly Terminate SIP Trunk Call Leg');
      if (r.actions.preTransactionWarning) actions.add('Render Warning Banner on Agent CRM Console');
    });

    setTestResults({
      triggeredRules: triggered,
      actionsToExecute: Array.from(actions),
      simulatedAt: new Date().toLocaleTimeString(),
    });

    addToast({
      title: 'Policy Simulation Completed',
      description: `${triggered.length} of ${policies.length} active rules tripped under test conditions.`,
      type: triggered.length > 0 ? 'warning' : 'success',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-console-900 p-4 rounded-2xl border border-console-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-400 border border-purple-800">
              POLICY AUTOMATION
            </span>
            <h2 className="text-base font-bold text-white">No-Code Policy & Workflow Builder</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Define automated circuit breakers and intervention workflows triggered by real-time voice-cloning scores and transaction attributes.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all shadow-lg shadow-cyan-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Cancel Creation' : 'Create New Rule'}</span>
        </button>
      </div>

      {/* Rule Creator Form */}
      {isCreating && (
        <form onSubmit={handleCreateRule} className="bg-console-900 border-2 border-cyan-800/80 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
          <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Configure Rule Specification</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-mono">Rule Title</label>
              <input
                type="text"
                required
                value={ruleName}
                onChange={e => setRuleName(e.target.value)}
                placeholder="e.g. VIP Transfer & Critical Voice Spoof Intercept"
                className="w-full bg-console-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-mono">Description / Business Rationale</label>
              <input
                type="text"
                value={ruleDesc}
                onChange={e => setRuleDesc(e.target.value)}
                placeholder="Brief explanation of policy trigger rationale"
                className="w-full bg-console-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Condition Builder */}
          <div className="p-3 bg-console-950 rounded-xl border border-slate-800">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400 block mb-2">
              IF Conditions (Trigger Thresholds)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1 font-mono">
                  Min Risk Score: <strong className="text-white">{minRisk}</strong>/100
                </label>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={minRisk}
                  onChange={e => setMinRisk(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1 font-mono">
                  Min Wire Exposure (INR): ₹{(minAmount / 100000).toFixed(0)} Lakhs
                </label>
                <input
                  type="number"
                  step="500000"
                  value={minAmount}
                  onChange={e => setMinAmount(Number(e.target.value))}
                  className="w-full bg-console-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1 font-mono">Channel Constraint</label>
                <select
                  value={selectedChannel}
                  onChange={e => setSelectedChannel(e.target.value as ChannelType | 'ALL')}
                  className="w-full bg-console-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                >
                  <option value="ALL">ALL Channels (VoIP, PSTN, Teams)</option>
                  <option value="VoIP">VoIP (SIP Trunking)</option>
                  <option value="PSTN">PSTN (Telco Mobile)</option>
                  <option value="Teams">MS Teams Direct</option>
                </select>
              </div>
            </div>
          </div>

          {/* THEN Actions */}
          <div className="p-3 bg-console-950 rounded-xl border border-slate-800">
            <span className="text-xs font-mono font-bold uppercase text-amber-400 block mb-2">
              THEN Actions (Automated Enforcement)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={actionNotify}
                  onChange={e => setActionNotify(e.target.checked)}
                  className="accent-cyan-400 rounded"
                />
                <span>Notify Fraud Desk</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={actionMFA}
                  onChange={e => setActionMFA(e.target.checked)}
                  className="accent-cyan-400 rounded"
                />
                <span>Enforce Out-of-Band MFA</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={actionLogEvidence}
                  onChange={e => setActionLogEvidence(e.target.checked)}
                  className="accent-cyan-400 rounded"
                />
                <span>Log Forensics to DPDP Audit</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-rose-300 font-bold">
                <input
                  type="checkbox"
                  checked={actionDropCall}
                  onChange={e => setActionDropCall(e.target.checked)}
                  className="accent-rose-500 rounded"
                />
                <span>Auto-Drop Call Leg</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
            >
              Save & Activate Rule
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Active Rules Table & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Rules List (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono uppercase">
              Active Enterprise Rules ({policies.length})
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Evaluated in real-time on live audio chunks
            </span>
          </div>

          <div className="space-y-3">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className={`p-4 rounded-xl border transition-all ${
                  policy.enabled
                    ? 'bg-console-900 border-slate-800 hover:border-slate-700'
                    : 'bg-console-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-console-950 text-cyan-400 border border-slate-800 font-bold">
                      {policy.id}
                    </span>
                    <h4 className="text-xs font-bold text-white">{policy.name}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePolicy(policy.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold transition-all border ${
                        policy.enabled
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {policy.enabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                    <button
                      onClick={() => deletePolicy(policy.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-3">{policy.description}</p>

                {/* Condition tags */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono mb-2">
                  <span className="px-2 py-0.5 rounded bg-console-950 text-cyan-300 border border-cyan-900/40">
                    IF Risk &ge; {policy.conditions.minRiskScore || 'N/A'}
                  </span>
                  {policy.conditions.minAmount && (
                    <span className="px-2 py-0.5 rounded bg-console-950 text-amber-300 border border-amber-900/40">
                      Amount &ge; ₹{(policy.conditions.minAmount / 100000).toFixed(0)}L
                    </span>
                  )}
                  {policy.conditions.channel && (
                    <span className="px-2 py-0.5 rounded bg-console-950 text-slate-300 border border-slate-800">
                      Channel: {policy.conditions.channel}
                    </span>
                  )}
                  <span className="text-slate-600 font-sans">→</span>
                  <span className="text-slate-300">THEN:</span>
                  {policy.actions.requireMFA && (
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900/40">
                      Require MFA
                    </span>
                  )}
                  {policy.actions.delaySettlementMins > 0 && (
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-900/40">
                      Delay {policy.actions.delaySettlementMins}m
                    </span>
                  )}
                  {policy.actions.dropCall && (
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-900/40 font-bold">
                      Drop Call
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>Triggers: <strong className="text-white">{policy.triggerCount}</strong></span>
                  <span>Last Trip: {policy.lastTriggered || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Rule Simulator (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-console-900 rounded-2xl border border-console-800 p-5 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Test Rule Simulator
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Sandbox</span>
            </div>

            <p className="text-xs text-slate-400">
              Input hypothetical call parameters to verify which automated policy workflows trigger before production deployment.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Simulated Voice Risk Score: <strong className="text-cyan-300">{testRisk}</strong>/100
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={testRisk}
                  onChange={e => setTestRisk(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Wire Transfer Amount (INR):
                </label>
                <input
                  type="number"
                  step="500000"
                  value={testAmount}
                  onChange={e => setTestAmount(Number(e.target.value))}
                  className="w-full bg-console-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Telephony Channel:
                </label>
                <select
                  value={testChannel}
                  onChange={e => setTestChannel(e.target.value as ChannelType)}
                  className="w-full bg-console-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                >
                  <option value="VoIP">VoIP (SIP Trunk)</option>
                  <option value="PSTN">PSTN (Mobile Switched)</option>
                  <option value="Teams">MS Teams Direct</option>
                </select>
              </div>

              <button
                onClick={runTestSimulation}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Evaluate Rules</span>
              </button>
            </div>

            {/* Simulation Results Output */}
            {testResults && (
              <div className="p-3 bg-console-950 rounded-xl border border-cyan-800/60 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 font-bold border-b border-slate-800 pb-1">
                  <span>Simulation Evaluation</span>
                  <span>{testResults.simulatedAt}</span>
                </div>

                <div className="text-slate-300">
                  Triggered: <strong className="text-amber-400">{testResults.triggeredRules.length} Rule(s)</strong>
                </div>

                {testResults.triggeredRules.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Actions Dispatched:</span>
                    {testResults.actionsToExecute.map((act, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-emerald-400 text-[11px] py-1">
                    ✓ All checks passed. Zero rules triggered under these parameters.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
