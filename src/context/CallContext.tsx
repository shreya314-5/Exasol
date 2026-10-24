import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CallItem, PolicyRule, AuditLogEntry, VoiceprintEnrollment, WebSocketRiskEvent } from '../types';
import { INITIAL_CALLS, INITIAL_POLICIES, INITIAL_AUDIT_LOGS, INITIAL_ENROLLMENTS } from '../services/mockData';
import { simulateNextTick, generateRiskEvent } from '../services/riskEngine';
import { globalAudioEngine } from '../services/audioSynthesizer';
import { globalWsService } from '../services/websocketService';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
}

interface CallContextType {
  calls: CallItem[];
  selectedCallId: string;
  selectedCall: CallItem;
  setSelectedCallId: (id: string) => void;
  isEngineRunning: boolean;
  setIsEngineRunning: (running: boolean) => void;
  audioMuted: boolean;
  toggleAudioMute: () => void;
  isMicActive: boolean;
  toggleMic: () => Promise<boolean>;
  selectScenario: (scenarioType: 'genuine' | 'ceo_fraud' | 'gov_tamil' | 'speaker_drift') => void;
  
  // Actions
  handlePreTransactionWarning: () => void;
  handleRequestCallback: () => void;
  handleTriggerMFA: () => void;
  handleEscalateSupervisor: () => void;
  handleHoldTransaction: () => void;
  handleMarkFraud: (isFraud: boolean) => void;

  // Policies & Rules
  policies: PolicyRule[];
  togglePolicy: (id: string) => void;
  addPolicy: (rule: Omit<PolicyRule, 'id' | 'triggerCount'>) => void;
  deletePolicy: (id: string) => void;

  // Audit Logs & Enrollments
  auditLogs: AuditLogEntry[];
  enrollments: VoiceprintEnrollment[];
  addEnrollment: (enrollment: Omit<VoiceprintEnrollment, 'id' | 'status' | 'dpdpCompliant'>) => void;
  deleteEnrollment: (id: string) => void;

  // Toasts
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;

  // Latest WS Event
  latestRiskEvent: WebSocketRiskEvent | null;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calls, setCalls] = useState<CallItem[]>(INITIAL_CALLS);
  const [selectedCallId, setSelectedCallId] = useState<string>(INITIAL_CALLS[0].id);
  const [isEngineRunning, setIsEngineRunning] = useState<boolean>(true);
  const [audioMuted, setAudioMuted] = useState<boolean>(true); // start muted by default for safety
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [policies, setPolicies] = useState<PolicyRule[]>(INITIAL_POLICIES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [enrollments, setEnrollments] = useState<VoiceprintEnrollment[]>(INITIAL_ENROLLMENTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [latestRiskEvent, setLatestRiskEvent] = useState<WebSocketRiskEvent | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);

  const selectedCall = calls.find(c => c.id === selectedCallId) || calls[0];

  const addToast = useCallback((toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = {
      ...toast,
      id,
      timestamp: new Date().toLocaleTimeString(),
    };
    setToasts(prev => [newToast, ...prev].slice(0, 5));

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addAuditLog = useCallback((log: Omit<AuditLogEntry, 'id' | 'timestamp' | 'evidenceHash'>) => {
    const id = `AUD-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomHash = 'sha256:' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newEntry: AuditLogEntry = {
      ...log,
      id,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      evidenceHash: randomHash,
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  }, []);

  // Audio muting handler
  const toggleAudioMute = useCallback(() => {
    const newMuted = !audioMuted;
    setAudioMuted(newMuted);
    globalAudioEngine.setMute(newMuted);
    if (!newMuted && !globalAudioEngine.getIsSynthesizing() && !isMicActive) {
      globalAudioEngine.startSyntheticStream(selectedCall.scenarioType);
    }
  }, [audioMuted, isMicActive, selectedCall.scenarioType]);

  // Mic toggle handler
  const toggleMic = useCallback(async () => {
    const active = await globalAudioEngine.toggleMicrophone();
    setIsMicActive(active);
    if (active) {
      addToast({
        title: 'Microphone Active',
        description: 'Analyzing live audio input directly from your microphone.',
        type: 'info',
      });
    } else {
      addToast({
        title: 'Microphone Deactivated',
        description: 'Reverted to synthetic call audio stream.',
        type: 'info',
      });
    }
    return active;
  }, [addToast]);

  // Main 1-second dynamic engine simulation loop
  useEffect(() => {
    if (!isEngineRunning) return;

    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);

      setCalls(prevCalls => {
        return prevCalls.map(call => {
          if (call.status === 'blocked' || call.status === 'held') {
            return call;
          }

          const updated = simulateNextTick(call, elapsed + call.durationSeconds);
          const newHistory = [
            ...call.history.slice(-25),
            { time: call.durationSeconds + 1, score: updated.riskScore }
          ];

          return {
            ...call,
            durationSeconds: call.durationSeconds + 1,
            currentRiskScore: updated.riskScore,
            riskBand: updated.band,
            layerScores: updated.layerScores,
            confidence: updated.confidence,
            history: newHistory,
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isEngineRunning, elapsed]);

  // Broadcast WebSocket events on selected call updates
  useEffect(() => {
    if (!selectedCall) return;
    const wsEvent = generateRiskEvent(selectedCall, elapsed);
    setLatestRiskEvent(wsEvent);
    globalWsService.emitSimulatedEvent(wsEvent);
  }, [selectedCall?.currentRiskScore, selectedCall?.id, elapsed]);

  // Scenario Switcher
  const selectScenario = useCallback((scenarioType: 'genuine' | 'ceo_fraud' | 'gov_tamil' | 'speaker_drift') => {
    const targetCall = calls.find(c => c.scenarioType === scenarioType);
    if (targetCall) {
      setSelectedCallId(targetCall.id);
      if (!audioMuted && !isMicActive) {
        globalAudioEngine.startSyntheticStream(scenarioType);
      }
      addToast({
        title: `Scenario Loaded: ${scenarioType.replace('_', ' ').toUpperCase()}`,
        description: `Monitoring live simulated call with ${scenarioType.replace('_', ' ')} parameters.`,
        type: scenarioType === 'genuine' ? 'success' : 'critical',
      });
    }
  }, [calls, audioMuted, isMicActive, addToast]);

  // Action handlers
  const handlePreTransactionWarning = useCallback(() => {
    addToast({
      title: 'Pre-Transaction Warning Dispatched',
      description: `Terminal alert triggered for Agent on ${selectedCall.callerName} (Risk: ${selectedCall.currentRiskScore}).`,
      type: 'warning',
    });
    addAuditLog({
      callId: selectedCall.id,
      eventType: 'RISK_SPIKE',
      severity: 'WARNING',
      actor: 'Agent Terminal / Security Desk',
      details: `Pre-transaction risk notice served to branch operator regarding pending transfer of ${selectedCall.contextData.transaction.amount?.toLocaleString('en-IN') || 'N/A'}.`,
    });
  }, [selectedCall, addToast, addAuditLog]);

  const handleRequestCallback = useCallback(() => {
    addToast({
      title: 'Out-of-Band Call-Back Initiated',
      description: `Dispatched verification prompt to verified corporate SIM for ${selectedCall.contextData.knownContactMatch.enrolledName || selectedCall.callerName}.`,
      type: 'info',
    });
    addAuditLog({
      callId: selectedCall.id,
      eventType: 'MFA_REQUESTED',
      severity: 'ALERT',
      actor: 'Fraud Ops Automated Gateway',
      details: `Secondary out-of-band telecom callback triggered to registered MSISDN ${selectedCall.callerNumber}.`,
    });
  }, [selectedCall, addToast, addAuditLog]);

  const handleTriggerMFA = useCallback(() => {
    addToast({
      title: 'Step-Up MFA Pushed',
      description: 'Biometric push challenge sent to user mobile banking app & SMS OTP generated.',
      type: 'warning',
    });
    addAuditLog({
      callId: selectedCall.id,
      eventType: 'MFA_REQUESTED',
      severity: 'ALERT',
      actor: 'Identity & Access Manager (FIDO2 / SMS)',
      details: `Enforced multi-factor step-up challenge for call #${selectedCall.id}.`,
    });
  }, [selectedCall, addToast, addAuditLog]);

  const handleEscalateSupervisor = useCallback(() => {
    setCalls(prev => prev.map(c => c.id === selectedCall.id ? { ...c, status: 'escalated' } : c));
    addToast({
      title: 'Escalated to Supervisor & Tier-2 Fraud Desk',
      description: 'Case ticket created with high-priority audio forensic snapshot.',
      type: 'critical',
    });
    addAuditLog({
      callId: selectedCall.id,
      eventType: 'SUPERVISOR_ESCALATED',
      severity: 'CRITICAL',
      actor: 'Agent (Rajiv Mehta - ID 4819)',
      details: `Incident escalated to Senior Financial Crimes Desk. Full spectral evidence package locked.`,
    });
  }, [selectedCall, addToast, addAuditLog]);

  const handleHoldTransaction = useCallback(() => {
    setCalls(prev => prev.map(c => c.id === selectedCall.id ? { ...c, status: 'held' } : c));
    addToast({
      title: 'Transaction Placed on Immediate Hold',
      description: `Frozen ₹${selectedCall.contextData.transaction.amount?.toLocaleString('en-IN') || '2,40,00,000'} RTGS transfer until physical verification.`,
      type: 'critical',
    });
    addAuditLog({
      callId: selectedCall.id,
      eventType: 'CALL_HELD',
      severity: 'CRITICAL',
      actor: 'VoiceShield Core Intercept Gateway',
      details: `Core banking transaction freeze placed on destination account ${selectedCall.contextData.transaction.destinationAccount || 'N/A'}. Settlement halted for 240 mins.`,
    });
  }, [selectedCall, addToast, addAuditLog]);

  const handleMarkFraud = useCallback((isFraud: boolean) => {
    setCalls(prev => prev.map(c => c.id === selectedCall.id ? {
      ...c,
      status: isFraud ? 'blocked' : 'cleared',
      currentRiskScore: isFraud ? 99 : 12,
      riskBand: isFraud ? 'CRITICAL' : 'LOW',
    } : c));

    addToast({
      title: isFraud ? 'Flagged as Verified Impersonation Fraud' : 'Marked as False Alarm / Cleared',
      description: isFraud
        ? 'Voiceprint signature added to fraudulent clone blacklist & SIP trunk reported.'
        : 'Model weights adjusted; caller cleared for standard processing.',
      type: isFraud ? 'critical' : 'success',
    });

    addAuditLog({
      callId: selectedCall.id,
      eventType: isFraud ? 'RISK_SPIKE' : 'RULE_TRIGGER',
      severity: isFraud ? 'CRITICAL' : 'INFO',
      actor: 'Chief Risk Officer Review',
      details: isFraud
        ? `Confirmed voice cloning attack. Sample quarantined for adversarial retraining.`
        : `Caller verified through auxiliary branch verification. Low risk override committed.`,
    });
  }, [selectedCall, addToast, addAuditLog]);

  // Policy management
  const togglePolicy = useCallback((id: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  }, []);

  const addPolicy = useCallback((rule: Omit<PolicyRule, 'id' | 'triggerCount'>) => {
    const id = `RULE-${Math.floor(100 + Math.random() * 900)}`;
    const newPolicy: PolicyRule = {
      ...rule,
      id,
      triggerCount: 0,
      lastTriggered: 'Never',
    };
    setPolicies(prev => [newPolicy, ...prev]);
    addToast({
      title: 'Policy Rule Created',
      description: `Rule "${newPolicy.name}" active and evaluated in live stream.`,
      type: 'success',
    });
  }, [addToast]);

  const deletePolicy = useCallback((id: string) => {
    setPolicies(prev => prev.filter(p => p.id !== id));
    addToast({
      title: 'Policy Deleted',
      description: 'The selected rule has been removed.',
      type: 'info',
    });
  }, [addToast]);

  // Enrollments
  const addEnrollment = useCallback((enrollment: Omit<VoiceprintEnrollment, 'id' | 'status' | 'dpdpCompliant'>) => {
    const id = `VP-EMB-${Date.now().toString().slice(-4)}`;
    const newEnr: VoiceprintEnrollment = {
      ...enrollment,
      id,
      status: 'active',
      dpdpCompliant: true,
    };
    setEnrollments(prev => [newEnr, ...prev]);
    addAuditLog({
      callId: 'SYSTEM',
      eventType: 'ENROLLMENT_COMPLETED',
      severity: 'INFO',
      actor: 'Biometric Consent Portal',
      details: `Enrolled voiceprint for ${newEnr.userName} (${newEnr.userRole}). Raw audio deleted. Vector committed.`,
    });
    addToast({
      title: 'Voiceprint Enrolled Successfully',
      description: `Raw audio permanently purged. Stored irreversible 512-dim vector for ${newEnr.userName}.`,
      type: 'success',
    });
  }, [addAuditLog, addToast]);

  const deleteEnrollment = useCallback((id: string) => {
    const enr = enrollments.find(e => e.id === id);
    setEnrollments(prev => prev.filter(e => e.id !== id));
    addAuditLog({
      callId: 'SYSTEM',
      eventType: 'VOICEPRINT_PURGED',
      severity: 'INFO',
      actor: 'User Erasure Request (Section 12 DPDP)',
      details: `Voiceprint embedding #${id} (${enr?.userName || 'User'}) permanently purged with cryptographic zeroing.`,
    });
    addToast({
      title: 'Biometric Data Purged',
      description: `Voiceprint vector #${id} erased under DPDP Act Right to Erasure.`,
      type: 'info',
    });
  }, [enrollments, addAuditLog, addToast]);

  return (
    <CallContext.Provider
      value={{
        calls,
        selectedCallId,
        selectedCall,
        setSelectedCallId,
        isEngineRunning,
        setIsEngineRunning,
        audioMuted,
        toggleAudioMute,
        isMicActive,
        toggleMic,
        selectScenario,
        handlePreTransactionWarning,
        handleRequestCallback,
        handleTriggerMFA,
        handleEscalateSupervisor,
        handleHoldTransaction,
        handleMarkFraud,
        policies,
        togglePolicy,
        addPolicy,
        deletePolicy,
        auditLogs,
        enrollments,
        addEnrollment,
        deleteEnrollment,
        toasts,
        dismissToast,
        addToast,
        latestRiskEvent,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCallContext must be used within a CallProvider');
  }
  return context;
};
