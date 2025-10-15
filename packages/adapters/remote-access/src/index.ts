export interface RemoteAccessSession {
  id: string;
  deviceId: string;
  relayUrl: string;
  expiresAt: string;
}

export interface RemoteAccessProvider {
  createSession(deviceId: string): Promise<RemoteAccessSession>;
  closeSession(sessionId: string): Promise<void>;
}

export class WebRtcRemoteAccessProvider implements RemoteAccessProvider {
  constructor(private readonly baseUrl: string) {}

  async createSession(deviceId: string): Promise<RemoteAccessSession> {
    const session: RemoteAccessSession = {
      id: `${deviceId}-${Date.now()}`,
      deviceId,
      relayUrl: `${this.baseUrl}/webrtc/${deviceId}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
    return session;
  }

  async closeSession(sessionId: string): Promise<void> {
    // Placeholder for tear-down logic
    console.log(`Closing remote session ${sessionId}`);
  }
}
