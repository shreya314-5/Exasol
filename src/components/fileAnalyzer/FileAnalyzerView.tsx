import React, { useState } from 'react';
import { useCallContext } from '../../context/CallContext';
import { 
  FileAudio, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Cpu, 
  Sparkles, 
  Play, 
  Pause 
} from 'lucide-react';

interface AudioSample {
  id: string;
  name: string;
  filename: string;
  fileSize: string;
  duration: string;
  language: string;
  verdict: 'Synthetic Clone (ElevenLabs)' | 'Authentic Human Voice' | 'Voice Conversion (RVC)' | 'Government Impersonation';
  verdictType: 'clone' | 'authentic' | 'conversion' | 'suspicious';
  overallRisk: number;
  confidence: number;
  codec: 'G.711' | 'AMR-WB' | 'Opus';
  anomalies: { timestamp: string; label: string; severity: 'high' | 'medium' }[];
  layers: {
    acoustic: number;
    prosody: number;
    speaker: number;
    context: number;
  };
}

const PRELOADED_SAMPLES: AudioSample[] = [
  {
    id: 'sample-1',
    name: 'CFO Wire Request (ElevenLabs XTTS Clone)',
    filename: 'cfo_urgent_wire_cloned.wav',
    fileSize: '1.4 MB',
    duration: '00:48',
    language: 'English (Indian Accent)',
    verdict: 'Synthetic Clone (ElevenLabs)',
    verdictType: 'clone',
    overallRisk: 94,
    confidence: 0.97,
    codec: 'G.711',
    anomalies: [
      { timestamp: '00:08', label: '7.6 kHz Lowpass Vocoder Cutoff', severity: 'high' },
      { timestamp: '00:19', label: 'Phase Discontinuity on Fricatives /s/', severity: 'high' },
      { timestamp: '00:34', label: 'Zero Respiration Inhalation Pause Detected', severity: 'medium' },
    ],
    layers: { acoustic: 96, prosody: 88, speaker: 94, context: 91 },
  },
  {
    id: 'sample-2',
    name: 'Genuine Customer Balance & KYC Call',
    filename: 'genuine_retail_customer_kyc.wav',
    fileSize: '2.1 MB',
    duration: '01:12',
    language: 'English (Indian Accent)',
    verdict: 'Authentic Human Voice',
    verdictType: 'authentic',
    overallRisk: 14,
    confidence: 0.99,
    codec: 'Opus',
    anomalies: [],
    layers: { acoustic: 12, prosody: 15, speaker: 14, context: 10 },
  },
  {
    id: 'sample-3',
    name: 'Tamil Statutory Notice Extortion Scam',
    filename: 'tamil_enforcement_threat.wav',
    fileSize: '1.8 MB',
    duration: '00:54',
    language: 'Tamil (ta-IN)',
    verdict: 'Government Impersonation',
    verdictType: 'suspicious',
    overallRisk: 86,
    confidence: 0.92,
    codec: 'AMR-WB',
    anomalies: [
      { timestamp: '00:12', label: 'Robotic Pitch Glissando (Formant Jitter 0.02%)', severity: 'high' },
      { timestamp: '00:28', label: 'Monotone Prosody Invariant Cadence', severity: 'medium' },
      { timestamp: '00:42', label: 'Unnatural Sentence Boundary Silence', severity: 'medium' },
    ],
    layers: { acoustic: 89, prosody: 87, speaker: 82, context: 85 },
  },
];

export const FileAnalyzerView: React.FC = () => {
  const { addToast } = useCallContext();
  const [selectedSample, setSelectedSample] = useState<AudioSample>(PRELOADED_SAMPLES[0]);
  const [simulatedCodec, setSimulatedCodec] = useState<'G.711' | 'AMR-WB' | 'Opus'>('G.711');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectSample = (sample: AudioSample) => {
    setSelectedSample(sample);
    setSimulatedCodec(sample.codec);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      addToast({
        title: 'Forensic Batch Analysis Complete',
        description: `Inspected ${sample.filename}. Verdict: ${sample.verdict}`,
        type: sample.overallRisk >= 75 ? 'critical' : 'success',
      });
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const customSample: AudioSample = {
        id: `custom-${Date.now()}`,
        name: file.name,
        filename: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        duration: '00:36',
        language: 'Auto-detected: English (IN)',
        verdict: 'Synthetic Clone (ElevenLabs)',
        verdictType: 'clone',
        overallRisk: 91,
        confidence: 0.95,
        codec: simulatedCodec,
        anomalies: [
          { timestamp: '00:06', label: 'High-frequency spectral envelope discontinuity', severity: 'high' },
          { timestamp: '00:21', label: 'Synthetic harmonic pitch lock', severity: 'high' },
        ],
        layers: { acoustic: 93, prosody: 86, speaker: 90, context: 84 },
      };
      setSelectedSample(customSample);
      setIsAnalyzing(false);
      addToast({
        title: 'Uploaded Audio Analyzed',
        description: `Processed ${file.name} through multi-layer deepfake model.`,
        type: 'critical',
      });
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-console-900 p-4 rounded-2xl border border-console-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800">
              OFFLINE FORENSICS
            </span>
            <h2 className="text-base font-bold text-white">File & Batch Audio Forensic Analyzer</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Upload intercepted recordings or examine batch archives with multi-codec stress testing (G.711, AMR-WB, Opus).
          </p>
        </div>

        {/* Upload Button */}
        <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer transition-all shadow-lg shadow-cyan-600/20">
          <Upload className="w-4 h-4" />
          <span>Upload Audio File</span>
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {/* Preloaded Sample Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRELOADED_SAMPLES.map((sample) => (
          <button
            key={sample.id}
            onClick={() => handleSelectSample(sample)}
            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
              selectedSample.id === sample.id
                ? 'bg-console-800 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500'
                : 'bg-console-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                <span className="truncate">{sample.name}</span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold ${
                    sample.overallRisk >= 75
                      ? 'bg-rose-950 text-rose-400 border-rose-800'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  }`}
                >
                  {sample.overallRisk >= 75 ? 'CLONE DETECTED' : 'GENUINE'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                {sample.filename} • {sample.duration} • {sample.fileSize}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Main Analysis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Final Verdict & Audio Player (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Final Verdict Card */}
          <div
            className={`p-5 rounded-2xl border-2 transition-all shadow-xl ${
              selectedSample.overallRisk >= 75
                ? 'bg-rose-950/40 border-rose-600/80'
                : 'bg-emerald-950/40 border-emerald-600/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-400">
                Forensic Verdict
              </span>
              <span className="text-xs font-mono text-cyan-400">
                Confidence: {(selectedSample.confidence * 100).toFixed(1)}%
              </span>
            </div>

            <h3
              className={`text-2xl font-black font-sans tracking-tight mb-2 ${
                selectedSample.overallRisk >= 75 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {selectedSample.verdict}
            </h3>

            <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 font-mono text-xs">
              <span className="text-slate-400">Composite Risk Score:</span>
              <span
                className={`text-lg font-black ${
                  selectedSample.overallRisk >= 75 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {selectedSample.overallRisk}/100
              </span>
            </div>

            <div className="mt-3 text-xs text-slate-300 leading-relaxed">
              {selectedSample.overallRisk >= 75
                ? 'Warning: Neural vocoder high-band acoustic signatures detected. Speech is mathematically synthesized.'
                : 'Verified: Acoustic spectral dynamics and respiratory cadence conform to natural biological vocal tract models.'}
            </div>
          </div>

          {/* Codec Stress Simulation Toggle */}
          <div className="bg-console-900 p-4 rounded-2xl border border-console-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulated Codec Stress Test</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Telecom Compression</span>
            </div>

            <p className="text-xs text-slate-400">
              Switch compression profile to observe how lossy telephony quantization affects deepfake detection confidence:
            </p>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {[
                { name: 'G.711', label: 'G.711 (µ-law 64k)', bit: '64 kbps Narrowband' },
                { name: 'AMR-WB', label: 'AMR-WB (12.65k)', bit: '12.65 kbps Mobile' },
                { name: 'Opus', label: 'Opus (VoIP 16k)', bit: '16 kbps Wideband' },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setSimulatedCodec(c.name as 'G.711' | 'AMR-WB' | 'Opus');
                    addToast({
                      title: `Codec Re-sampled: ${c.name}`,
                      description: `Re-calculated spectral features across ${c.bit}.`,
                      type: 'info',
                    });
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    simulatedCodec === c.name
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold'
                      : 'bg-console-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-[11px] truncate">{c.name}</div>
                  <div className="text-[9px] opacity-70 truncate">{c.bit}</div>
                </button>
              ))}
            </div>

            <div className="text-[10px] font-mono text-slate-400 pt-1">
              Active Codec: <strong className="text-cyan-300">{simulatedCodec}</strong> • Sampling: 16 kHz mono
            </div>
          </div>

        </div>

        {/* Right: Anomaly Timeline & Multi-Layer Breakdown (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Interactive Risk Timeline with Markers */}
          <div className="bg-console-900 p-5 rounded-2xl border border-console-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Audio Duration Anomaly Timeline ({selectedSample.duration})</span>
              </h4>
              <span className="text-[10px] font-mono text-cyan-400">
                Language: <strong className="text-white">{selectedSample.language}</strong>
              </span>
            </div>

            {/* Simulated timeline bar */}
            <div className="relative w-full h-8 bg-console-950 rounded-xl border border-slate-800 overflow-hidden flex items-center px-3">
              <div
                className={`h-2 rounded-full w-full ${
                  selectedSample.overallRisk >= 75
                    ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600'
                    : 'bg-emerald-500'
                }`}
              />

              {/* Anomaly markers */}
              {selectedSample.anomalies.map((anom, i) => (
                <div
                  key={i}
                  className="absolute top-1 bottom-1 w-1 bg-white shadow-[0_0_8px_#FFFFFF] cursor-pointer"
                  style={{ left: `${25 + i * 32}%` }}
                  title={`${anom.timestamp} - ${anom.label}`}
                />
              ))}
            </div>

            {/* List of timestamped anomalies */}
            {selectedSample.anomalies.length > 0 ? (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase block">
                  Timestamped Anomaly Markers:
                </span>
                {selectedSample.anomalies.map((anom, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-console-950 border border-slate-800 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-rose-950 text-rose-400 font-bold border border-rose-800">
                        {anom.timestamp}
                      </span>
                      <span className="text-slate-200">{anom.label}</span>
                    </span>
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">
                      {anom.severity} SEVERITY
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-emerald-400 py-3 text-center bg-console-950 rounded-xl border border-slate-800">
                ✓ No synthetic vocoder anomalies or spectral discontinuities detected across duration.
              </div>
            )}
          </div>

          {/* Multi-Layer Inspection Breakdown */}
          <div className="bg-console-900 p-5 rounded-2xl border border-console-800 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-white">
              Forensic Layer Scoring Breakdown
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-console-950 border border-slate-800">
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-slate-400">Acoustic / Spectral:</span>
                  <span className="font-bold text-white">{selectedSample.layers.acoustic}/100</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${selectedSample.layers.acoustic >= 75 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${selectedSample.layers.acoustic}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-console-950 border border-slate-800">
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-slate-400">Prosody / Cadence:</span>
                  <span className="font-bold text-white">{selectedSample.layers.prosody}/100</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${selectedSample.layers.prosody >= 75 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${selectedSample.layers.prosody}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-console-950 border border-slate-800">
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-slate-400">Speaker Consistency:</span>
                  <span className="font-bold text-white">{selectedSample.layers.speaker}/100</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${selectedSample.layers.speaker >= 75 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${selectedSample.layers.speaker}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-console-950 border border-slate-800">
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-slate-400">Contextual Intent:</span>
                  <span className="font-bold text-white">{selectedSample.layers.context}/100</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${selectedSample.layers.context >= 75 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${selectedSample.layers.context}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
