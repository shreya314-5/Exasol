import React, { useState } from 'react';
import { AlertCircle, Code, ChevronDown, ChevronUp, Cpu, Server, ShieldCheck, X } from 'lucide-react';

export const ModelDisclaimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="bg-console-900/90 border-b border-cyan-900/40 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            SIMULATED MODEL (v3.2)
          </span>
          <span className="hidden sm:inline text-slate-400">
            Real-time probabilistic voice cloning detector active with seeded neural spoof vectors.
          </span>
          <span className="text-amber-400/90 hidden md:inline font-mono">
            Scores are probabilistic anomalies.
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-[11px] transition-colors py-0.5 px-2 rounded hover:bg-console-800"
        >
          <Code className="w-3.5 h-3.5" />
          <span>{isOpen ? 'Hide Model Architecture & Hooks' : 'View Production TODO Hooks'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-cyan-900/30 bg-console-950 p-4 text-slate-300">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="p-3 rounded-lg bg-console-900 border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-2">
                <Cpu className="w-4 h-4" />
                <span>1. Acoustic / Spectral Layer</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Detects synthetic vocoder artifacts, phase discontinuities, and high-band frequency cutoffs (e.g., ElevenLabs, XTTS, Bark).
              </p>
              <div className="bg-black/60 p-2 rounded text-[10px] font-mono text-cyan-300 overflow-x-auto">
                <span className="text-slate-500">// TODO: Real model ONNX hook</span>
                <br />
                const session = await ort.InferenceSession.create('aasist_antispoof.onnx');
                <br />
                {"const score = await session.run({ 'audio_pcm': chunkTensor });"}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-console-900 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
                <Server className="w-4 h-4" />
                <span>2. Speaker Consistency & RVC Drift</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Evaluates intra-call speaker centroid divergence to defeat real-time Retrieval-based Voice Conversion (RVC) and voice changers.
              </p>
              <div className="bg-black/60 p-2 rounded text-[10px] font-mono text-amber-300 overflow-x-auto">
                <span className="text-slate-500">// TODO: ECAPA-TDNN embedding hook</span>
                <br />
                const emb = extract_embedding(audio_chunk);
                <br />
                const drift = cosine_similarity(emb, enrolled_cxo_vector);
              </div>
            </div>

            <div className="p-3 rounded-lg bg-console-900 border border-slate-800 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>3. Live Stream /ws/analyze Protocol</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                FastAPI backend WebSocket handles binary PCM16 at 16kHz with &lt;140ms response latency.
              </p>
              <div className="bg-black/60 p-2 rounded text-[10px] font-mono text-emerald-300 overflow-x-auto">
                <span className="text-slate-500">// WebSocket URI</span>
                <br />
                ws://localhost:8000/ws/analyze
                <br />
                <span className="text-slate-500">// Event: JSON risk payload per 200ms</span>
              </div>
            </div>

          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Legal Disclaimer: VoiceShield AI outputs are probabilistic indicators and should be integrated within a multi-tiered security posture.</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
