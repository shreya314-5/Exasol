import React from 'react';
import { useCallContext } from '../../context/CallContext';
import { AlertTriangle, ShieldCheck, Layers, HelpCircle, ArrowRight } from 'lucide-react';

export const WhyFlaggedPanel: React.FC = () => {
  const { selectedCall } = useCallContext();

  const layers = [
    {
      name: 'Acoustic / Spectral Layer',
      score: selectedCall.layerScores.acousticSpectral,
      desc: 'Synthetic vocoder artifacts, glissando, 7.6kHz cutoff',
      color: selectedCall.layerScores.acousticSpectral >= 75 ? 'bg-rose-500' : selectedCall.layerScores.acousticSpectral >= 50 ? 'bg-amber-500' : 'bg-emerald-500',
    },
    {
      name: 'Prosody / Behaviour Layer',
      score: selectedCall.layerScores.prosodyBehaviour,
      desc: 'Rhythm regularity, pitch contour flattening, breathing cadence',
      color: selectedCall.layerScores.prosodyBehaviour >= 75 ? 'bg-rose-500' : selectedCall.layerScores.prosodyBehaviour >= 50 ? 'bg-amber-500' : 'bg-emerald-500',
    },
    {
      name: 'Speaker Consistency Layer',
      score: selectedCall.layerScores.speakerConsistency,
      desc: 'Voiceprint drift from enrolled baseline / intra-call RVC shift',
      color: selectedCall.layerScores.speakerConsistency >= 75 ? 'bg-rose-500' : selectedCall.layerScores.speakerConsistency >= 50 ? 'bg-amber-500' : 'bg-emerald-500',
    },
    {
      name: 'Context & Telecom Risk',
      score: selectedCall.layerScores.contextRisk,
      desc: 'Wire transfer value, spoofed SIP gateway, urgency linguistics',
      color: selectedCall.layerScores.contextRisk >= 75 ? 'bg-rose-500' : selectedCall.layerScores.contextRisk >= 50 ? 'bg-amber-500' : 'bg-emerald-500',
    },
  ];

  return (
    <div className="bg-console-900 rounded-2xl border border-console-800 p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Why Flagged (Multi-Layer Inference)
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-console-950 text-slate-400 border border-slate-800">
          4 Deep Layers
        </span>
      </div>

      {/* Per-Layer Progress Bars */}
      <div className="space-y-3">
        {layers.map((layer, idx) => (
          <div key={idx} className="bg-console-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-200">{layer.name}</span>
              <span className="font-mono font-bold text-white">{layer.score}<span className="text-slate-500 font-normal">/100</span></span>
            </div>
            
            {/* Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${layer.color}`}
                style={{ width: `${Math.min(100, Math.max(0, layer.score))}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 truncate">
              {layer.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Top Reasons in Plain English */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-amber-400 mb-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Top Reasons Detected (Plain English)</span>
        </div>

        <ul className="space-y-2">
          {selectedCall.topReasons.map((reason, idx) => (
            <li
              key={idx}
              className="text-xs text-slate-300 bg-console-950 p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5 leading-relaxed"
            >
              <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Action Box */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 via-console-950 to-console-900 border border-cyan-800/60 text-xs">
        <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1 flex items-center gap-1.5">
          <ArrowRight className="w-3.5 h-3.5" />
          <span>Recommended Enterprise Action:</span>
        </div>
        <p className="text-slate-200 font-medium leading-relaxed">
          {selectedCall.recommendedAction}
        </p>
      </div>
    </div>
  );
};
