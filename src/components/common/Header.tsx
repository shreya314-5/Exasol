import React, { useState, useEffect } from 'react';
import { useCallContext } from '../../context/CallContext';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Activity, 
  Radio, 
  Lock
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    calls,
    isEngineRunning,
    setIsEngineRunning,
    audioMuted,
    toggleAudioMute,
    isMicActive,
    toggleMic,
  } = useCallContext();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const criticalCallsCount = calls.filter(c => c.riskBand === 'CRITICAL').length;

  return (
    <header className="bg-console-900 border-b border-console-800 text-slate-100 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 shadow-lg shadow-cyan-500/20 text-white">
            <ShieldAlert className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent font-sans">
                VoiceShield AI
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <span>Deepfake Voice-Cloning & Impersonation Defense</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> DPDP Compliant
              </span>
            </p>
          </div>
        </div>

        {/* Live Operational Metrics */}
        <div className="hidden lg:flex items-center gap-5 text-xs font-mono">
          <div className="flex items-center gap-2 bg-console-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-400">Stream Status:</span>
            <span className="text-emerald-400 font-semibold">INTERCEPTING</span>
          </div>

          <div className="flex items-center gap-2 bg-console-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Calls Active:</span>
            <span className="text-white font-bold">{calls.length}</span>
            {criticalCallsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-950 text-rose-400 font-bold border border-rose-800">
                {criticalCallsCount} CRITICAL
              </span>
            )}
          </div>

          <div className="bg-console-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
            Latency: <span className="text-cyan-400 font-semibold">138ms</span>
          </div>

          <div className="bg-console-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 font-bold">
            {currentTime} <span className="text-slate-500 font-normal">IST</span>
          </div>
        </div>

        {/* Console Interactive Controls */}
        <div className="flex items-center gap-2">
          
          {/* Audio Synthesizer Test Tone Toggle */}
          <button
            onClick={toggleAudioMute}
            title={audioMuted ? "Unmute Synthetic Audio Stream" : "Mute Synthetic Audio Stream"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              !audioMuted
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-console-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {!audioMuted ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{!audioMuted ? 'Sound On' : 'Muted'}</span>
          </button>

          {/* Live Microphone Test Toggle */}
          <button
            onClick={toggleMic}
            title={isMicActive ? "Stop Microphone Live Test" : "Test Live Voice via Microphone"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              isMicActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-console-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {isMicActive ? <Mic className="w-4 h-4 text-rose-400 animate-pulse" /> : <MicOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{isMicActive ? 'Mic Active' : 'Test Mic'}</span>
          </button>

          {/* Engine Pause / Resume */}
          <button
            onClick={() => setIsEngineRunning(!isEngineRunning)}
            title={isEngineRunning ? "Pause Simulation Engine" : "Resume Simulation Engine"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              isEngineRunning
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700 hover:bg-emerald-900/60'
                : 'bg-amber-950/60 text-amber-300 border-amber-700 hover:bg-amber-900/60'
            }`}
          >
            {isEngineRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{isEngineRunning ? 'Live' : 'Paused'}</span>
          </button>

        </div>

      </div>
    </header>
  );
};
