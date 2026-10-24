import React, { useRef, useEffect, useState } from 'react';
import { useCallContext } from '../../context/CallContext';
import { globalAudioEngine } from '../../services/audioSynthesizer';
import { Activity, Waves, Volume2, ShieldAlert, Cpu } from 'lucide-react';

export const WaveformSpectrogram: React.FC = () => {
  const { selectedCall, isEngineRunning } = useCallContext();
  const [viewMode, setViewMode] = useState<'split' | 'waveform' | 'spectrogram'>('split');
  
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const spectrogramCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const freqArray = new Uint8Array(128);
    const timeArray = new Uint8Array(256);

    const render = () => {
      // 1. Render Waveform Canvas
      if (waveformCanvasRef.current && (viewMode === 'split' || viewMode === 'waveform')) {
        const canvas = waveformCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          globalAudioEngine.getByteTimeDomainData(timeArray);

          const width = canvas.width;
          const height = canvas.height;

          ctx.fillStyle = '#060B14';
          ctx.fillRect(0, 0, width, height);

          // Grid lines
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#14213B';
          ctx.beginPath();
          ctx.moveTo(0, height / 2);
          ctx.lineTo(width, height / 2);
          ctx.stroke();

          // Waveform line
          const isCritical = selectedCall.riskBand === 'CRITICAL';
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = isCritical ? '#EF4444' : selectedCall.riskBand === 'HIGH' ? '#F97316' : '#06B6D4';
          ctx.shadowBlur = 8;
          ctx.shadowColor = ctx.strokeStyle;

          ctx.beginPath();
          const sliceWidth = width / timeArray.length;
          let x = 0;

          for (let i = 0; i < timeArray.length; i++) {
            const v = timeArray[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
            x += sliceWidth;
          }
          ctx.lineTo(width, height / 2);
          ctx.stroke();
          ctx.shadowBlur = 0; // reset
        }
      }

      // 2. Render Spectrogram Canvas (Frequency Heatmap / Waterfall)
      if (spectrogramCanvasRef.current && (viewMode === 'split' || viewMode === 'spectrogram')) {
        const canvas = spectrogramCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          globalAudioEngine.getByteFrequencyData(freqArray);

          const width = canvas.width;
          const height = canvas.height;

          // Shift current image left by 2px for scrolling waterfall effect
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = width;
          tempCanvas.height = height;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.drawImage(canvas, 0, 0);
            ctx.fillStyle = '#060B14';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(tempCanvas, -3, 0);
          }

          // Draw new frequency column at the right edge
          const barHeight = height / freqArray.length;
          const isVocoderArtifact = selectedCall.scenarioType === 'ceo_fraud' || selectedCall.scenarioType === 'gov_tamil';

          for (let i = 0; i < freqArray.length; i++) {
            let val = freqArray[i];

            // If simulated synthetic clone, simulate unnatural high-frequency cutoff
            if (isVocoderArtifact && i > 85) {
              val = Math.floor(val * 0.15); // sharp vocoder lowpass artifact
            }

            const normalized = val / 255;
            let r = 0, g = 0, b = 0;

            if (normalized < 0.2) {
              r = 6; g = 11; b = 20; // Navy base
            } else if (normalized < 0.5) {
              r = 6; g = 182; b = 212; // Cyan/Teal
            } else if (normalized < 0.8) {
              r = 245; g = 158; b = 11; // Amber
            } else {
              r = 239; g = 68; b = 68; // Critical Crimson
            }

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(width - 3, height - (i + 1) * barHeight, 3, barHeight);
          }

          // Draw cutoff warning marker if vocoder cutoff active
          if (isVocoderArtifact) {
            ctx.strokeStyle = '#EF4444';
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1;
            ctx.beginPath();
            const cutoffY = height * 0.35;
            ctx.moveTo(width - 50, cutoffY);
            ctx.lineTo(width, cutoffY);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      if (isEngineRunning) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [viewMode, selectedCall.riskBand, selectedCall.scenarioType, isEngineRunning]);

  return (
    <div className="bg-console-900 rounded-2xl border border-console-800 p-4 flex flex-col gap-3">
      {/* Top Header & Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Real-Time Acoustic & Spectral Inspector
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-console-950 text-cyan-400 border border-cyan-900/50">
            16 kHz PCM • 128 FFT Bins
          </span>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-console-950 p-1 rounded-xl border border-slate-800 text-[10px] font-mono">
          <button
            onClick={() => setViewMode('split')}
            className={`px-2 py-0.5 rounded-lg transition-all ${
              viewMode === 'split' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode('waveform')}
            className={`px-2 py-0.5 rounded-lg transition-all ${
              viewMode === 'waveform' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Waveform
          </button>
          <button
            onClick={() => setViewMode('spectrogram')}
            className={`px-2 py-0.5 rounded-lg transition-all ${
              viewMode === 'spectrogram' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Spectrogram
          </button>
        </div>
      </div>

      {/* Canvas Visual Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(viewMode === 'split' || viewMode === 'waveform') && (
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-console-950">
            <div className="absolute top-2 left-3 z-10 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>Oscilloscope (Time-Domain PCM)</span>
            </div>
            <canvas
              ref={waveformCanvasRef}
              width={420}
              height={140}
              className="w-full h-[140px] block"
            />
          </div>
        )}

        {(viewMode === 'split' || viewMode === 'spectrogram') && (
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-console-950">
            <div className="absolute top-2 left-3 z-10 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
              <Cpu className="w-3 h-3 text-amber-400" />
              <span>Waterfall Spectrogram (0 - 8000 Hz)</span>
            </div>
            {selectedCall.scenarioType === 'ceo_fraud' && (
              <div className="absolute bottom-2 right-2 z-10 text-[9px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                ⚠ 7.6 kHz Vocoder Cutoff Anomaly
              </div>
            )}
            <canvas
              ref={spectrogramCanvasRef}
              width={420}
              height={140}
              className="w-full h-[140px] block"
            />
          </div>
        )}
      </div>

      {/* Live Telephony & Spectral Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
        <div className="bg-console-950 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-500 block">Fundamental F0:</span>
          <span className="text-cyan-300 font-bold">128 Hz (Stable)</span>
        </div>
        <div className="bg-console-950 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-500 block">Formants (F1/F2):</span>
          <span className="text-slate-200">540 Hz / 1,720 Hz</span>
        </div>
        <div className="bg-console-950 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-500 block">Jitter / Shimmer:</span>
          <span className={selectedCall.riskBand === 'CRITICAL' ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
            {selectedCall.riskBand === 'CRITICAL' ? '0.04% (Unnaturally Flat)' : '1.18% (Natural)'}
          </span>
        </div>
        <div className="bg-console-950 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-500 block">Estimated Codec:</span>
          <span className="text-amber-300 font-bold">G.711u / 64kbps</span>
        </div>
      </div>
    </div>
  );
};
