# VoiceShield AI | Enterprise Voice-Integrity & Anti-Spoofing Platform

[![License: Proprietary / Enterprise](https://img.shields.io/badge/License-Enterprise-06B6D4.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](#)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](#)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-Dark%20Console-14213B.svg)](#)
[![DPDP Act 2023](https://img.shields.io/badge/DPDP%20Act%202023-Aligned-10B981.svg)](#)

> **VoiceShield AI** is an enterprise voice-integrity defense platform engineered for banks, cloud contact centres, and telecom operators to intercept AI voice-cloning, synthetic TTS deepfakes, and real-time voice-conversion (RVC) impersonation attacks during live telephony sessions.

---

## 🛡️ Key Platform Capabilities

### 1. Live Call Monitor (Hero Console)
- **Active Calls Queue:** Filter and inspect incoming calls across PSTN, VoIP (SIPREC), and Microsoft Teams Direct Routing.
- **Real-Time Acoustic & Spectral Inspector:** Dual-canvas oscilloscope and scrolling waterfall spectrogram visualizer tracking frequency envelopes up to 8 kHz.
- **Dynamic Voice Risk Gauge (0-100):** Animated 240-degree circular SVG gauge updating every second with band coloring and confidence percentage.
- **Multi-Layer Inference Breakdown:**
  1. *Acoustic / Spectral Layer:* Detects neural vocoder phase discontinuities, robotic fricative tremors, and sharp high-frequency lowpass cutoffs (e.g. at 7.6 kHz in ElevenLabs/XTTS).
  2. *Prosody / Behaviour Layer:* Flags unnatural cadence invariance, unnatural lack of biological breathing/respiration pauses, and flat fundamental pitch ($F_0$) contours.
  3. *Speaker Consistency Layer:* Monitors cosine divergence between live audio embeddings and enrolled CXO baselines to catch intra-call voice-conversion drift.
  4. *Context & Telecom Risk:* Correlates SS7/STIR-SHAKEN signaling, unverified VoIP gateway IPs, transaction urgency keywords, and financial exposure.
- **Context Card:** Geolocation, carrier, spoofing likelihood, known-contact match score, and pending wire transfer exposure.
- **Enterprise Action Bar:** Immediate stateful triggers for *Pre-Transaction Warning*, *Request Call-back*, *Trigger MFA*, *Escalate to Supervisor*, *Hold Transaction*, and *Mark Fraud / False Alarm*.

### 2. Demo Scenarios (Interactive Real-Time Drivers)
1. **(a) Genuine Customer Call:** Low risk (~16/100). Biological vocal tract formant dynamics, verified voiceprint match (96%), routine payroll batch disbursement.
2. **(b) CEO-Fraud Wire Transfer Call (Hindi-accented English):** Critical risk (~92/100). Impersonating Group CFO Rajesh Malhotra demanding urgent ₹2.40 Cr wire to Dubai; synthetic vocoder artifacts detected.
3. **(c) Cloned Government Official in Tamil:** Critical risk (~84/100). Impersonating State Enforcement Commissioner Thiru S. Ramanathan demanding immediate penalty escrow deposit.
4. **(d) Voice-Conversion Attack with Speaker Drift:** Starts low (~22/100) with genuine caller, then spikes to ~89/100 mid-session as real-time RVC (Retrieval-based Voice Conversion) is injected during mandate amendment.

### 3. Agent Desktop View (Minimal CRM Sidecar)
- Designed as an embedded widget for bank branch operators and contact centre agents (Salesforce, Genesys Cloud, Avaya Aura).
- **Traffic-Light Indicator:** Glowing 3-bezel light (Green = Verified Authentic, Yellow = Caution, Red = Impersonation Clone).
- **Pop-Up Warning Banner:** *"Voice risk high. Verify by call-back or MFA before approving this transfer."*
- **Simulated Multi-Channel Alert Previews:**
  - *Customer SMS Preview*
  - *Compliance Officer Email Alert*
  - *Mobile Banking In-App Biometric Push Prompt*

### 4. Policy & Workflow Builder (No-Code Rule Engine)
- Visual condition and action editor:
  - **IF** *Risk Score $\ge X$*, *Transaction Amount $\ge Y$*, *Channel is VoIP/PSTN*, *Speaker Drift $> 35\%$*
  - **THEN** *Notify Fraud Ops*, *Require Step-Up MFA*, *Delay Settlement (60m–360m)*, *Log DPDP Forensics*, *Auto-Drop Call Leg*.
- Rule table with enable/disable switches, execution statistics, and deletion.
- **Interactive "Test Rule" Simulator:** Enter hypothetical parameters to preview which enterprise rules trip.

### 5. File / Batch Audio Analyzer
- Upload local `.wav`, `.mp3`, or `.m4a` recordings or inspect built-in enterprise case files.
- Visual duration timeline with timestamped anomaly markers (e.g. at 00:08 vocoder cutoff, at 00:19 phase glitch).
- **Simulated Codec Stress Testing:** Toggle between **G.711** ($\mu$-law 64kbps), **AMR-WB** (12.65kbps mobile), and **Opus** (16kbps VoIP) to observe how telephony compression affects anti-spoofing confidence.

### 6. Biometric Enrolment & Consent Portal
- Record consented voiceprints for CXOs and authorized wire signatories.
- **Zero Raw Audio Persistence:** Raw speech recordings are permanently purged immediately upon vector calculation. Only irreversible 512-dimensional float vectors (`float32[512]`) and SHA-256 commitments are persisted.
- 16-D feature vector heatmap visualizer.
- **DPDP Section 12 Right to Erasure:** One-click revocation with cryptographically signed deletion receipts.

### 7. Privacy & DPDP Act 2023 Compliance Center
- Toggles for *Edge / On-Device Inference*, *Feature-Only Logging*, *Zero-Knowledge Biometric Hashing*, and *Retention Period Slider* (0 to 365 days).
- **DPDP Act 2023 Checklist:** Verified compliance with Section 6 (Notice & Consent), Section 8 (Purpose Limitation), Section 9 (Minors Data), Section 12 (Erasure), and Section 13 (Grievance Redressal).
- **Immutable Audit Trail:** Search, filter, and export signed evidence logs to CSV.

### 8. Integrations & API Console
- Interactive WebSocket console connecting to `/ws/analyze`.
- Certified enterprise connector matrix:
  - *SBC / SIPREC:* AudioCodes Mediant, Cisco CUBE, Ribbon, Oracle Acme Packet.
  - *Cloud Contact Centres:* Genesys Cloud AudioHook, Amazon Connect KVS, NICE CXone, Twilio Flex, Avaya Aura.
  - *Core Banking:* Infosys Finacle, Temenos Transact, SAS Fraud, NICE Actimize.
  - *SIEM:* Splunk Enterprise Security HEC, Datadog, IBM QRadar, Microsoft Sentinel.
- **Interactive Webhook Tester:** Dispatch test payloads (`call.flagged_critical`, `mfa.triggered`) and inspect response times.

---

## 🧠 Model Architecture & "Simulated Model" Hooks

This demonstration platform utilizes a deterministic scripted probabilistic risk engine marked **"SIMULATED MODEL"** with production hooks ready for on-premise deep neural network pipelines:

```
                      LIVE TELEPHONY STREAM (16kHz PCM16)
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
   [ Acoustic / Spectral ]   [ Prosody / Rhythm ]    [ Speaker Consistency ]
     AASIST / RawNet3 ONNX     WavLM + BiLSTM F0       ECAPA-TDNN / ResNetSE
     (Vocoder & Artifacts)     (Prosody Cadence)      (Cosine Sim vs CXO Vector)
            │                         │                         │
            └─────────────────────────┼─────────────────────────┘
                                      │
                                      ▼
                       [ Context & Signaling Fusion ]
                       STIR/SHAKEN Level A Verification
                       High-Value Wire NLP Detection
                                      │
                                      ▼
                        VOICESHIELD RISK SCORE (0-100)
```

### Production ONNX / PyTorch Integration Hooks
Found in [`src/services/riskEngine.ts`](file:///c:/Users/shrey/Documents/antigravity/lucid-turing/src/services/riskEngine.ts) and [`src/backend/main.py`](file:///c:/Users/shrey/Documents/antigravity/lucid-turing/src/backend/main.py):

```typescript
// TODO: Hook to AASIST Anti-Spoofing ONNX Session
const session = await ort.InferenceSession.create('aasist_antispoof.onnx');
const feeds = { speech_input: audioChunkTensor };
const results = await session.run(feeds);
const spoofProbability = results.output.data[1];
```

---

## 🚀 Quickstart & Run Steps

### Prerequisites
- Node.js v18+ (tested with Node.js v24 LTS)
- npm v9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Frontend Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Build for Production
```bash
npm run build
npm run preview
```

### 4. Optional: Run the FastAPI WebSocket Backend
If you have Python 3.10+ installed with `fastapi`, `uvicorn`, and `websockets`:
```bash
cd src/backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
The frontend automatically detects whether the backend WebSocket is live or seamlessly operates with the internal browser-synthesized stream.

---

## 🎨 Theme & Accessibility
- **Dark Security-Console Palette:** Deep navy (`#060B14`, `#0B1220`, `#14213B`), cyber teal (`#00F2FE`, `#06B6D4`), safety amber (`#F59E0B`), and threat crimson (`#EF4444`).
- **Web Audio API Sound & Mic Test:** Toggle "Sound On" to hear synthesized acoustic carrier waves matching attack scenarios, or toggle "Test Mic" to feed your own live microphone into the real-time FFT analyzer!

---

## ⚖️ Legal & Probabilistic Disclaimer
*All risk scores produced by VoiceShield AI represent probabilistic anomalies and heuristic anti-spoofing likelihood indices. Enterprise risk mitigations should be paired with multi-factor authentication and defense-in-depth security policies.*
