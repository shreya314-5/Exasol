/**
 * Web Audio API synthesizer & Microphone analyzer for VoiceShield AI.
 * Produces real audio output (synthesized speech formant carrier / vocoder simulator)
 * and feeds real FFT frequency data to the Spectrogram & Waveform canvases.
 */

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private oscPrimary: OscillatorNode | null = null;
  private oscHarmonic: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private isSynthesizing = false;
  private isMuted = false;
  private usingMic = false;
  private animationTimer: number | null = null;

  constructor() {
    // AudioContext will be initialized on user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.analyser && this.ctx) {
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.8;
    }
  }

  public getAnalyser(): AnalyserNode | null {
    this.initContext();
    return this.analyser;
  }

  public getByteFrequencyData(array: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array as unknown as Uint8Array<ArrayBuffer>);
    } else {
      // Fallback synthetic wave generator if audio context is blocked
      const t = Date.now() / 150;
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(
          Math.sin(t + i * 0.1) * 60 +
          Math.cos(t * 0.5 + i * 0.2) * 40 +
          120
        );
      }
    }
  }

  public getByteTimeDomainData(array: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(array as unknown as Uint8Array<ArrayBuffer>);
    } else {
      const t = Date.now() / 200;
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(128 + Math.sin(t + i * 0.15) * 50);
      }
    }
  }

  /**
   * Starts a synthesized voice carrier tone simulating synthetic vs genuine acoustics
   */
  public startSyntheticStream(scenario: string) {
    this.initContext();
    if (!this.ctx || !this.analyser) return;

    this.stopSyntheticStream();

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx.currentTime);

    this.filter = this.ctx.createBiquadFilter();
    
    // Configure oscillators according to the attack scenario
    this.oscPrimary = this.ctx.createOscillator();
    this.oscHarmonic = this.ctx.createOscillator();

    if (scenario === 'ceo_fraud') {
      // Vocoder/robotics: Square/Sawtooth wave with high-frequency cutoff filter
      this.oscPrimary.type = 'sawtooth';
      this.oscPrimary.frequency.setValueAtTime(130, this.ctx.currentTime); // Fundamental pitch
      this.oscHarmonic.type = 'square';
      this.oscHarmonic.frequency.setValueAtTime(260, this.ctx.currentTime);
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(3200, this.ctx.currentTime); // Sharp cut-off
    } else if (scenario === 'gov_tamil') {
      // Stiff synthetic monotone
      this.oscPrimary.type = 'sawtooth';
      this.oscPrimary.frequency.setValueAtTime(145, this.ctx.currentTime);
      this.oscHarmonic.type = 'triangle';
      this.oscHarmonic.frequency.setValueAtTime(290, this.ctx.currentTime);
      this.filter.type = 'bandpass';
      this.filter.frequency.setValueAtTime(1800, this.ctx.currentTime);
    } else if (scenario === 'speaker_drift') {
      // Dynamic shift
      this.oscPrimary.type = 'triangle';
      this.oscPrimary.frequency.setValueAtTime(160, this.ctx.currentTime);
      this.oscHarmonic.type = 'sawtooth';
      this.oscHarmonic.frequency.setValueAtTime(320, this.ctx.currentTime);
      this.filter.type = 'peaking';
      this.filter.frequency.setValueAtTime(2200, this.ctx.currentTime);
    } else {
      // Genuine: Smooth organic triangle and sine waves with natural formant resonance
      this.oscPrimary.type = 'sine';
      this.oscPrimary.frequency.setValueAtTime(125, this.ctx.currentTime);
      this.oscHarmonic.type = 'triangle';
      this.oscHarmonic.frequency.setValueAtTime(250, this.ctx.currentTime);
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(5000, this.ctx.currentTime);
    }

    // Connect node graph: osc -> filter -> gain -> analyser -> ctx.destination
    this.oscPrimary.connect(this.filter);
    this.oscHarmonic.connect(this.filter);
    this.filter.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.oscPrimary.start();
    this.oscHarmonic.start();
    this.isSynthesizing = true;
  }

  public stopSyntheticStream() {
    try {
      if (this.oscPrimary) {
        this.oscPrimary.stop();
        this.oscPrimary.disconnect();
        this.oscPrimary = null;
      }
      if (this.oscHarmonic) {
        this.oscHarmonic.stop();
        this.oscHarmonic.disconnect();
        this.oscHarmonic = null;
      }
      if (this.filter) {
        this.filter.disconnect();
        this.filter = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
    } catch {
      // Silently handle any already disconnected nodes
    }
    this.isSynthesizing = false;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(muted ? 0 : 0.05, this.ctx.currentTime);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsSynthesizing(): boolean {
    return this.isSynthesizing;
  }

  /**
   * Toggles live microphone capture for real-time speech verification
   */
  public async toggleMicrophone(): Promise<boolean> {
    this.initContext();
    if (!this.ctx || !this.analyser) return false;

    if (this.usingMic) {
      this.stopMicrophone();
      return false;
    }

    try {
      this.stopSyntheticStream();
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.micSource = this.ctx.createMediaStreamSource(this.micStream);
      this.micSource.connect(this.analyser);
      // NOTE: Do not connect micSource to ctx.destination to prevent acoustic feedback loop!
      this.usingMic = true;
      return true;
    } catch (err) {
      console.warn("Microphone access denied or unavailable:", err);
      this.usingMic = false;
      return false;
    }
  }

  public stopMicrophone() {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
    this.usingMic = false;
  }

  public isUsingMic(): boolean {
    return this.usingMic;
  }
}

export const globalAudioEngine = new AudioEngine();
