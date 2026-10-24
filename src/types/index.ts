export type RiskBand = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ChannelType = 'PSTN' | 'VoIP' | 'Teams' | 'SIPREC' | 'Zoom Phone';

export type LanguageCode = 'en-US' | 'en-IN' | 'hi-IN' | 'ta-IN' | 'te-IN' | 'es-ES' | 'fr-FR';

export interface LayerScores {
  acousticSpectral: number;    // Synthetic artifacts, phase discontinuity, vocoder pitch glissando
  prosodyBehaviour: number;    // Unnatural cadence, flat pitch contour, respiration cadence
  speakerConsistency: number;  // Voiceprint drift, centroid divergence, similarity to enrolled profile
  contextRisk: number;         // Wire transfer amount, off-hours, anomalous keywords, unverified IP
}

export interface LayerDetails {
  name: string;
  score: number;
  weight: number;
  status: 'normal' | 'suspicious' | 'anomalous' | 'critical';
  indicators: string[];
  explanation: string;
}

export interface CallContextData {
  callerName: string;
  callerNumber: string;
  channel: ChannelType;
  language: string;
  callOrigin: {
    country: string;
    city: string;
    carrier: string;
    ipAddress: string;
    latencyMs: number;
    sipUserAgent: string;
    spoofingProbability: number;
  };
  knownContactMatch: {
    matched: boolean;
    enrolledName?: string;
    role?: string;
    similarityScore: number; // 0 - 100%
    confidence: number;
    enrolledEmbeddingId?: string;
  };
  transaction: {
    hasPendingTransaction: boolean;
    type?: string;
    amount?: number;
    currency?: string;
    beneficiary?: string;
    destinationAccount?: string;
    urgencyLevel?: 'standard' | 'high' | 'immediate';
  };
  pastFraudIndicators: {
    flag: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
  }[];
}

export interface CallItem {
  id: string;
  callerName: string;
  callerNumber: string;
  channel: ChannelType;
  language: string;
  startTime: string;
  durationSeconds: number;
  currentRiskScore: number;
  riskBand: RiskBand;
  confidence: number;
  scenarioType: 'genuine' | 'ceo_fraud' | 'gov_tamil' | 'speaker_drift' | 'custom';
  contextData: CallContextData;
  layerScores: LayerScores;
  topReasons: string[];
  recommendedAction: string;
  status: 'active' | 'held' | 'escalated' | 'cleared' | 'blocked';
  history: { time: number; score: number }[];
  audioPlaybackUrl?: string;
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  conditions: {
    minRiskScore?: number;
    channel?: ChannelType | 'ALL';
    minAmount?: number;
    languages?: string[];
    speakerDriftAbove?: number;
    transactionType?: string;
  };
  actions: {
    notifyFraudOps: boolean;
    requireMFA: boolean;
    delaySettlementMins: number;
    logEvidence: boolean;
    dropCall: boolean;
    preTransactionWarning: boolean;
  };
  triggerCount: number;
  lastTriggered?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  callId: string;
  eventType: 'RISK_SPIKE' | 'RULE_TRIGGER' | 'MFA_REQUESTED' | 'CALL_HELD' | 'SUPERVISOR_ESCALATED' | 'VOICEPRINT_PURGED' | 'ENROLLMENT_COMPLETED' | 'POLICY_MODIFIED';
  severity: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL';
  actor: string;
  details: string;
  evidenceHash: string;
}

export interface VoiceprintEnrollment {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  department: string;
  enrolledAt: string;
  vectorLength: number; // e.g. 512-dim embedding
  embeddingHash: string;
  sampleFeatures: number[]; // e.g. normalized 16 sample features for visual representation
  consentSignedAt: string;
  consentId: string;
  status: 'active' | 'revoked';
  dpdpCompliant: boolean;
}

export interface WebSocketRiskEvent {
  call_id: string;
  timestamp: string;
  sequence_number: number;
  risk_score: number;
  band: RiskBand;
  confidence: number;
  reasons: string[];
  layer_scores: {
    acoustic_spectral: number;
    prosody_behaviour: number;
    speaker_consistency: number;
    context_risk: number;
  };
  recommended_action: string;
  model_info: {
    pipeline: string;
    latency_ms: number;
    is_simulated: boolean;
    todo_hook: string;
  };
}
