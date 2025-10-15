import { DeviceToken, EventPublisher } from '@inhome/core';

export type TransportType = DeviceToken['type'];

export interface TransportEnvelope {
  deviceId: string;
  token: DeviceToken;
  payload: Record<string, unknown>;
}

export interface TransportChannel {
  type: TransportType;
  send(envelope: TransportEnvelope): Promise<void>;
}

export interface TransportRouterOptions {
  publisher?: EventPublisher;
}

export class TransportRouter {
  private readonly channels = new Map<TransportType, TransportChannel>();

  constructor(private readonly options: TransportRouterOptions = {}) {}

  register(channel: TransportChannel): void {
    this.channels.set(channel.type, channel);
  }

  async dispatch(envelope: TransportEnvelope): Promise<void> {
    const channel = this.channels.get(envelope.token.type);
    if (!channel) {
      throw new Error(`No transport channel registered for ${envelope.token.type}`);
    }

    await channel.send(envelope);

    await this.options.publisher?.publish({
      id: `${envelope.deviceId}-${Date.now()}`,
      type: 'transport.sent',
      tenantId: envelope.token.value,
      occurredAt: new Date().toISOString(),
      payload: envelope,
    });
  }
}
