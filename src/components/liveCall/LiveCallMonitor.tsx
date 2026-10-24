import React from 'react';
import { useCallContext } from '../../context/CallContext';
import { ScenarioBar } from './ScenarioBar';
import { CallList } from './CallList';
import { RiskGauge } from '../common/RiskGauge';
import { WaveformSpectrogram } from './WaveformSpectrogram';
import { RiskTimelineChart } from './RiskTimelineChart';
import { WhyFlaggedPanel } from './WhyFlaggedPanel';
import { ContextCard } from './ContextCard';
import { ActionBar } from './ActionBar';
import { ShieldAlert, Zap, Radio } from 'lucide-react';

export const LiveCallMonitor: React.FC = () => {
  const { selectedCall } = useCallContext();

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* 1. Demo Scenarios Bar */}
      <ScenarioBar />

      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-4">
        
        {/* Main 3-Column Enterprise Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Active Calls List (3 cols) */}
          <div className="lg:col-span-3">
            <CallList />
          </div>

          {/* Centre Column: Gauge, Waveform/Spectrogram & Risk Timeline (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Top Centre: Animated Risk Gauge Card */}
            <div className="bg-console-900 rounded-2xl border border-console-800 p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
              <div className="absolute top-3 left-4 flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Live Neural Detector</span>
              </div>
              <div className="absolute top-3 right-4 text-xs font-mono text-cyan-400">
                Session: <strong className="text-white">{selectedCall.id}</strong>
              </div>

              {/* Large Animated Circular SVG Gauge */}
              <div className="mt-2">
                <RiskGauge
                  score={selectedCall.currentRiskScore}
                  band={selectedCall.riskBand}
                  confidence={selectedCall.confidence}
                  size={240}
                />
              </div>

              {/* Sub-label banner */}
              <div className="mt-1 text-center">
                <div className="text-xs text-slate-300 font-medium">
                  {selectedCall.scenarioType === 'genuine' ? (
                    <span className="text-emerald-400">Voice characteristics match biological vocal tract physics.</span>
                  ) : selectedCall.scenarioType === 'speaker_drift' ? (
                    <span className="text-rose-400">CRITICAL: Acoustic centroid divergence detected mid-stream!</span>
                  ) : (
                    <span className="text-rose-400">HIGH PROBABILITY: Neural speech synthesis vocoder detected!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Centre Middle: Real-time Waveform + Spectrogram */}
            <WaveformSpectrogram />

            {/* Centre Bottom: Rolling Risk-Over-Time Line Chart */}
            <RiskTimelineChart />

          </div>

          {/* Right Column: Multi-Layer Scores & Context Details (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <WhyFlaggedPanel />
            <ContextCard />
          </div>

        </div>

        {/* Action Bar (Full Width across bottom) */}
        <ActionBar />

      </div>
    </div>
  );
};
