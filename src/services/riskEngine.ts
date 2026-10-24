import { RiskBand, LayerScores, CallItem, WebSocketRiskEvent } from '../types';

/**
 * VoiceShield AI Scripted Risk Engine
 * 
 * NOTE: SIMULATED MODEL
 * This engine simulates deep neural network inference for anti-spoofing and voice integrity.
 * 
 * =========================================================================
 * TODO: HOOKS FOR REAL PRODUCTION MODELS:
 * 1. Acoustic/Spectral Layer:
 *    - Connect to AASIST (Audio Anti-Spoofing using Integrated Spectro-Temporal Graph Attention)
 *      or RawNet3 ONNX runtime via WebSocket binary PCM16 stream:
 *      `await onnxSession.run({ 'speech_pcm': audioChunkTensor })`
 * 
 * 2. Prosody/Behavioural Layer:
 *    - WavLM-Large / Whisper-large-v3 feature encoder + BiLSTM for pitch/f0 contour continuity,
 *      glottal pulse regularity, and phoneme-duration distribution analysis.
 * 
 * 3. Speaker Consistency Layer:
 *    - ResNetSE34V2 / ECAPA-TDNN speaker embedding extractor:
 *      Compute cosine similarity: `similarity = cosine_similarity(current_chunk_emb, enrolled_cxo_emb)`
 * 
 * 4. Context & Telecom Signaling:
 *    - SIP trunk header verification (STIR/SHAKEN attestation level A/B/C),
 *      SS7/Diameter signaling spoof check, and NLP sentiment/urgency detector.
 * =========================================================================
 */

export const IS_SIMULATED_MODEL = true;
export const MODEL_VERSION = "VoiceShield-AntiSpoof-v3.2.0-simulated";

export function getRiskBand(score: number): RiskBand {
  if (score < 30) return 'LOW';
  if (score < 60) return 'MEDIUM';
  if (score < 80) return 'HIGH';
  return 'CRITICAL';
}

export function getBandColor(band: RiskBand): {
  bg: string;
  text: string;
  border: string;
  glow: string;
  hex: string;
} {
  switch (band) {
    case 'LOW':
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
        hex: '#10B981',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
        hex: '#F59E0B',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-950/40',
        text: 'text-orange-400',
        border: 'border-orange-500/40',
        glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]',
        hex: '#F97316',
      };
    case 'CRITICAL':
      return {
        bg: 'bg-rose-950/40',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        glow: 'shadow-[0_0_18px_rgba(244,63,94,0.4)]',
        hex: '#EF4444',
      };
  }
}

/**
 * Calculates updated risk values with slight realistic jitter or scenario trajectory
 */
export function simulateNextTick(
  call: CallItem,
  elapsedSeconds: number
): {
  riskScore: number;
  band: RiskBand;
  layerScores: LayerScores;
  confidence: number;
} {
  let targetScore = call.currentRiskScore;
  let layerAcoustic = call.layerScores.acousticSpectral;
  let layerProsody = call.layerScores.prosodyBehaviour;
  let layerSpeaker = call.layerScores.speakerConsistency;
  let layerContext = call.layerScores.contextRisk;

  // Handle specific scenario dynamics
  if (call.scenarioType === 'speaker_drift') {
    // If call duration is less than 35s, low score. If >= 35s, simulate mid-call RVC voice conversion!
    const cycle = elapsedSeconds % 60;
    if (cycle < 20) {
      targetScore = 20 + Math.sin(cycle) * 3;
      layerAcoustic = 18;
      layerProsody = 22;
      layerSpeaker = 19;
      layerContext = 25;
    } else if (cycle >= 20 && cycle < 28) {
      // Transition spike
      targetScore = 65 + (cycle - 20) * 3;
      layerAcoustic = 75;
      layerProsody = 68;
      layerSpeaker = 72;
      layerContext = 70;
    } else {
      // Full attack phase
      targetScore = 88 + Math.sin(cycle * 0.8) * 3;
      layerAcoustic = 91 + Math.sin(cycle) * 2;
      layerProsody = 84 + Math.cos(cycle) * 2;
      layerSpeaker = 96; // Huge speaker divergence
      layerContext = 86;
    }
  } else if (call.scenarioType === 'ceo_fraud') {
    // High critical with fluctuating micro-anomalies
    const jitter = Math.sin(elapsedSeconds * 0.9) * 2.5;
    targetScore = Math.min(98, Math.max(88, 92 + jitter));
    layerAcoustic = Math.min(99, Math.max(90, 94 + jitter));
    layerProsody = Math.min(95, Math.max(85, 89 - jitter * 0.5));
    layerSpeaker = Math.min(98, Math.max(91, 93 + jitter * 0.7));
    layerContext = 91;
  } else if (call.scenarioType === 'gov_tamil') {
    const jitter = Math.cos(elapsedSeconds * 0.7) * 2;
    targetScore = Math.min(92, Math.max(78, 84 + jitter));
    layerAcoustic = Math.min(90, Math.max(82, 86 + jitter));
    layerProsody = Math.min(94, Math.max(84, 88 - jitter));
    layerSpeaker = 81;
    layerContext = 83;
  } else if (call.scenarioType === 'genuine') {
    // Safe low score with natural micro-fluctuations
    const jitter = Math.sin(elapsedSeconds * 0.5) * 3;
    targetScore = Math.min(26, Math.max(10, 16 + jitter));
    layerAcoustic = Math.min(20, Math.max(8, 12 + jitter));
    layerProsody = Math.min(22, Math.max(10, 14 + jitter));
    layerSpeaker = Math.min(20, Math.max(10, 15 - jitter * 0.5));
    layerContext = 22;
  } else {
    // Medium / custom
    const jitter = Math.sin(elapsedSeconds * 0.6) * 3;
    targetScore = Math.min(65, Math.max(45, 54 + jitter));
  }

  const roundedScore = Math.round(targetScore);
  const band = getRiskBand(roundedScore);

  return {
    riskScore: roundedScore,
    band,
    layerScores: {
      acousticSpectral: Math.round(layerAcoustic),
      prosodyBehaviour: Math.round(layerProsody),
      speakerConsistency: Math.round(layerSpeaker),
      contextRisk: Math.round(layerContext),
    },
    confidence: call.scenarioType === 'genuine' ? 0.98 : 0.94,
  };
}

/**
 * Generates an event object matching the enterprise WebSocket schema
 */
export function generateRiskEvent(
  call: CallItem,
  seq: number
): WebSocketRiskEvent {
  return {
    call_id: call.id,
    timestamp: new Date().toISOString(),
    sequence_number: seq,
    risk_score: call.currentRiskScore,
    band: call.riskBand,
    confidence: call.confidence,
    reasons: call.topReasons,
    layer_scores: {
      acoustic_spectral: call.layerScores.acousticSpectral,
      prosody_behaviour: call.layerScores.prosodyBehaviour,
      speaker_consistency: call.layerScores.speakerConsistency,
      context_risk: call.layerScores.contextRisk,
    },
    recommended_action: call.recommendedAction,
    model_info: {
      pipeline: MODEL_VERSION,
      latency_ms: Math.floor(120 + Math.random() * 25),
      is_simulated: IS_SIMULATED_MODEL,
      todo_hook: "Connect real ONNX/TensorRT AASIST model at /ws/analyze binary stream",
    },
  };
}
