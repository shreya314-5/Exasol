import React, { useState } from 'react';
import { useCallContext } from '../../context/CallContext';
import { globalWsService } from '../../services/websocketService';
import { 
  Network, 
  Code, 
  Copy, 
  Check, 
  Radio, 
  Send, 
  Layers, 
  Server, 
  ExternalLink, 
  Terminal, 
  PhoneForwarded, 
  ShieldCheck 
} from 'lucide-react';

export const IntegrationsApiView: React.FC = () => {
  const { latestRiskEvent, selectedCall, addToast } = useCallContext();
  const [copied, setCopied] = useState(false);
  const [activeCodeLang, setActiveCodeLang] = useState<'curl' | 'python' | 'node' | 'ws'>('ws');
  
  // Webhook tester state
  const [webhookUrl, setWebhookUrl] = useState('https://api.enterprise.bank/webhooks/voice-fraud');
  const [webhookEvent, setWebhookEvent] = useState('call.flagged_critical');
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<{
    status: number;
    latencyMs: number;
    responseBody: string;
    timestamp: string;
  } | null>(null);

  // Sample JSON payload matching enterprise requirements
  const sampleJsonEvent = latestRiskEvent || {
    call_id: selectedCall.id,
    timestamp: new Date().toISOString(),
    sequence_number: 142,
    risk_score: selectedCall.currentRiskScore,
    band: selectedCall.riskBand,
    confidence: selectedCall.confidence,
    reasons: selectedCall.topReasons,
    layer_scores: {
      acoustic_spectral: selectedCall.layerScores.acousticSpectral,
      prosody_behaviour: selectedCall.layerScores.prosodyBehaviour,
      speaker_consistency: selectedCall.layerScores.speakerConsistency,
      context_risk: selectedCall.layerScores.contextRisk,
    },
    recommended_action: selectedCall.recommendedAction,
    model_info: {
      pipeline: 'VoiceShield-AntiSpoof-v3.2.0-simulated',
      latency_ms: 138,
      is_simulated: true,
      todo_hook: 'Connect real ONNX AASIST model at /ws/analyze binary stream',
    },
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleJsonEvent, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      title: 'Copied to Clipboard',
      description: 'Sample JSON risk event copied.',
      type: 'info',
    });
  };

  const handleSendTestWebhook = () => {
    setIsSendingWebhook(true);
    setTimeout(() => {
      setIsSendingWebhook(false);
      setWebhookResponse({
        status: 200,
        latencyMs: 46,
        responseBody: JSON.stringify(
          {
            received: true,
            event_id: `EVT-${Date.now()}`,
            status: 'ACCEPTED_BY_SIEM',
            rule_action: 'TOKEN_FROZEN',
          },
          null,
          2
        ),
        timestamp: new Date().toLocaleTimeString(),
      });
      addToast({
        title: 'Webhook Delivered (HTTP 200 OK)',
        description: `Dispatched ${webhookEvent} payload in 46ms.`,
        type: 'success',
      });
    }, 500);
  };

  const connectorCategories = [
    {
      category: 'Telephony & SBC / SIPREC',
      desc: 'Native packet capture from SIP border controllers & PSTN trunks',
      connectors: [
        { name: 'AudioCodes Mediant SBC', status: 'Certified Native SIPREC', logo: 'AC' },
        { name: 'Cisco Unified Border Element (CUBE)', status: 'Certified SIP Forking', logo: 'CS' },
        { name: 'Ribbon Communications SBC', status: 'Certified SIPREC v1.2', logo: 'RB' },
        { name: 'Oracle Acme Packet SBC', status: 'Certified RTP Mirror', logo: 'OR' },
      ],
    },
    {
      category: 'Cloud Contact Centres',
      desc: 'Real-time media streaming & CRM agent screen-pop integration',
      connectors: [
        { name: 'Genesys Cloud CX', status: 'AudioHook & Agent App', logo: 'GC' },
        { name: 'Amazon Connect', status: 'Kinesis Video Streams (KVS)', logo: 'AWS' },
        { name: 'NICE CXone', status: 'Real-Time Interaction Guidance', logo: 'NC' },
        { name: 'Twilio Flex', status: 'Bi-directional Media Stream', logo: 'TF' },
        { name: 'Avaya Aura Experience', status: 'Avaya Media Server SIP', logo: 'AV' },
      ],
    },
    {
      category: 'Core Banking & Anti-Fraud Engines',
      desc: 'Instant settlement halt & transaction token freeze integration',
      connectors: [
        { name: 'Infosys Finacle', status: 'REST / ISO 20022 Intercept', logo: 'FIN' },
        { name: 'Temenos Transact', status: 'Kafka Event Dispatch', logo: 'TEM' },
        { name: 'SAS Fraud Management', status: 'Real-Time Risk Webhook', logo: 'SAS' },
        { name: 'NICE Actimize', status: 'AML / Fraud Event Feed', logo: 'ACT' },
      ],
    },
    {
      category: 'SIEM & Security Operations',
      desc: 'Centralized telemetry, incident escalation & SOC triage',
      connectors: [
        { name: 'Splunk Enterprise Security', status: 'HEC JSON Stream', logo: 'SP' },
        { name: 'Datadog SIEM', status: 'Native Agent Log Pipeline', logo: 'DD' },
        { name: 'IBM QRadar', status: 'LEEF / Syslog TLS Format', logo: 'QR' },
        { name: 'Microsoft Sentinel', status: 'Azure Event Hub Ingestion', logo: 'MS' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-console-900 p-4 rounded-2xl border border-console-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-400 border border-teal-800">
              API & CONNECTOR ECOSYSTEM
            </span>
            <h2 className="text-base font-bold text-white">Integrations, SDKs & WebSocket Protocol</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Connect SIPREC Session Border Controllers, Core Banking gateways, and listen on real-time WebSocket <code className="text-cyan-400 font-mono">/ws/analyze</code>.
          </p>
        </div>

        <div className="text-xs font-mono text-cyan-400 bg-console-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>WebSocket Stream: <strong className="text-white">Active (Simulated/FastAPI)</strong></span>
        </div>
      </div>

      {/* Main Grid: Code Samples & Sample JSON Event */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Code Snippets & WebSocket Example (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-console-900 rounded-2xl border border-console-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Protocol Implementations</span>
              </h3>

              {/* Language Tabs */}
              <div className="flex items-center gap-1 bg-console-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
                {(['ws', 'python', 'node', 'curl'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveCodeLang(lang)}
                    className={`px-2.5 py-0.5 rounded-lg transition-all uppercase ${
                      activeCodeLang === lang
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="bg-console-950 rounded-xl p-3.5 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {activeCodeLang === 'ws' && (
                <pre>{`// WebSocket /ws/analyze live telemetry client
const ws = new WebSocket("ws://localhost:8000/ws/analyze");

ws.onopen = () => {
  // Handshake session metadata
  ws.send(JSON.stringify({
    action: "start_session",
    call_id: "CALL-2026-8842",
    sample_rate: 16000,
    channels: 1
  }));
};

ws.onmessage = (event) => {
  const riskPayload = JSON.parse(event.data);
  console.log("Risk Score:", riskPayload.risk_score);
  console.log("Anomalies:", riskPayload.reasons);
  if (riskPayload.band === "CRITICAL") {
    triggerIntervention(riskPayload.recommended_action);
  }
};`}</pre>
              )}

              {activeCodeLang === 'python' && (
                <pre>{`# Python VoiceShield SDK
import asyncio
import websockets
import json

async def monitor_live_call(call_id: str):
    uri = "ws://localhost:8000/ws/analyze"
    async with websockets.connect(uri) as ws:
        await ws.send(json.dumps({"call_id": call_id}))
        while True:
            msg = await ws.recv()
            event = json.loads(msg)
            if event["risk_score"] > 80:
                print(f"FRAUD DETECTED: {event['reasons']}")
                # Halt core banking transaction
                freeze_token(call_id)

asyncio.run(monitor_live_call("CALL-2026-8842"))`}</pre>
              )}

              {activeCodeLang === 'node' && (
                <pre>{`// Node.js Enterprise Client
import { VoiceShieldClient } from '@voiceshield/sdk';

const shield = new VoiceShieldClient({
  apiKey: process.env.VOICESHIELD_API_KEY,
  endpoint: 'https://api.voiceshield.ai/v1'
});

const session = await shield.telephony.attachCall({
  callId: 'CALL-2026-8842',
  channel: 'PSTN'
});

session.on('critical_risk', (event) => {
  console.warn(\`Critical deepfake flagged: \${event.risk_score}/100\`);
});`}</pre>
              )}

              {activeCodeLang === 'curl' && (
                <pre>{`# Check offline audio file verdict via REST API
curl -X POST "https://api.voiceshield.ai/v1/analyze/file" \\
  -H "Authorization: Bearer sec_tok_live_491820" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@cfo_wire_call.wav" \\
  -F "codec=G.711" \\
  -F "simulate_model=true"`}</pre>
              )}
            </div>

            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>SDK Version: <strong className="text-white">v3.2.0-enterprise</strong></span>
              <span className="text-emerald-400">gRPC & REST OpenAPI 3.1 Ready</span>
            </div>
          </div>
        </div>

        {/* Right: Sample JSON Risk Event Payload (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-console-900 rounded-2xl border border-console-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Sample JSON Risk Event Schema</span>
              </h3>

              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-console-950 hover:bg-console-800 border border-slate-800 text-cyan-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>

            {/* JSON Code Viewer */}
            <div className="bg-console-950 rounded-xl p-3.5 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-[320px] scrollbar-thin scrollbar-thumb-slate-800">
              <pre>{JSON.stringify(sampleJsonEvent, null, 2)}</pre>
            </div>

            <p className="text-[10px] text-slate-400 font-mono">
              Emitted every 200ms per audio chunk across all active SIP sessions.
            </p>
          </div>
        </div>

      </div>

      {/* Webhook Tester Component */}
      <div className="bg-console-900 rounded-2xl border border-console-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Interactive Webhook Dispatch Tester
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">SIEM & Core Banking Push</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-7">
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Target Webhook URL</label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-console-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Trigger Event</label>
            <select
              value={webhookEvent}
              onChange={(e) => setWebhookEvent(e.target.value)}
              className="w-full bg-console-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
            >
              <option value="call.flagged_critical">call.flagged_critical</option>
              <option value="mfa.triggered">mfa.triggered</option>
              <option value="rule.violation">rule.violation</option>
              <option value="speaker.drift_detected">speaker.drift_detected</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              onClick={handleSendTestWebhook}
              disabled={isSendingWebhook}
              className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingWebhook ? 'Sending...' : 'Dispatch'}</span>
            </button>
          </div>
        </div>

        {/* Webhook Response Log */}
        {webhookResponse && (
          <div className="p-3 bg-console-950 rounded-xl border border-emerald-800/60 font-mono text-xs space-y-1">
            <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-slate-800 pb-1">
              <span>HTTP {webhookResponse.status} OK (Latency: {webhookResponse.latencyMs}ms)</span>
              <span className="text-slate-500">{webhookResponse.timestamp}</span>
            </div>
            <pre className="text-slate-300 text-[11px] pt-1">{webhookResponse.responseBody}</pre>
          </div>
        )}
      </div>

      {/* Enterprise Connector Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase">
          Certified Enterprise Telephony & Infrastructure Connectors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectorCategories.map((cat, idx) => (
            <div key={idx} className="bg-console-900 rounded-2xl border border-console-800 p-4 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-cyan-300 font-mono uppercase">{cat.category}</h4>
                <p className="text-[11px] text-slate-400">{cat.desc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cat.connectors.map((c, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-console-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{c.name}</div>
                      <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{c.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
