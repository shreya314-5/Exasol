import { WebSocketRiskEvent } from '../types';

type MessageListener = (event: WebSocketRiskEvent) => void;
type StatusListener = (status: 'connected' | 'simulated' | 'disconnected' | 'connecting') => void;

export class VoiceShieldWebSocketService {
  private ws: WebSocket | null = null;
  private url: string = 'ws://localhost:8000/ws/analyze';
  private messageListeners: Set<MessageListener> = new Set();
  private statusListeners: Set<StatusListener> = new Set();
  private status: 'connected' | 'simulated' | 'disconnected' | 'connecting' = 'simulated';
  private simulationInterval: number | null = null;
  private seqCounter: number = 1000;

  constructor() {
    // Default to simulated mode out of the box
  }

  public getStatus() {
    return this.status;
  }

  public getUrl() {
    return this.url;
  }

  public setUrl(url: string) {
    this.url = url;
  }

  public onMessage(listener: MessageListener) {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  public onStatusChange(listener: StatusListener) {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }

  private notifyStatus(status: 'connected' | 'simulated' | 'disconnected' | 'connecting') {
    this.status = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  public emitSimulatedEvent(event: WebSocketRiskEvent) {
    this.messageListeners.forEach(listener => listener(event));
  }

  /**
   * Attempts connection to real FastAPI WebSocket at /ws/analyze
   */
  public connectRealBackend(url?: string) {
    if (url) this.url = url;
    this.notifyStatus('connecting');

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.notifyStatus('connected');
        console.log(`[VoiceShield WS] Connected to ${this.url}`);
      };

      this.ws.onmessage = (e) => {
        try {
          const data: WebSocketRiskEvent = JSON.parse(e.data);
          this.messageListeners.forEach(listener => listener(data));
        } catch (err) {
          console.warn("[VoiceShield WS] Failed to parse message:", err);
        }
      };

      this.ws.onerror = () => {
        console.warn("[VoiceShield WS] Connection failed, falling back to simulated stream engine.");
        this.notifyStatus('simulated');
      };

      this.ws.onclose = () => {
        if (this.status === 'connected') {
          this.notifyStatus('disconnected');
        }
      };
    } catch {
      this.notifyStatus('simulated');
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.notifyStatus('simulated');
  }

  public send(data: unknown) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
      return true;
    }
    return false;
  }
}

export const globalWsService = new VoiceShieldWebSocketService();
