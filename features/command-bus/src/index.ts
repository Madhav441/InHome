import {
  Command,
  CommandAcknowledgement,
  CommandOrchestrator,
  CommandStatus,
  ISODate,
  TimeProvider,
} from '@inhome/core';

type CommandQueue = Map<string, Command[]>;

export interface InMemoryCommandBusOptions {
  timeProvider?: TimeProvider;
  visibilityTimeoutMs?: number;
}

export class InMemoryCommandBus implements CommandOrchestrator {
  private readonly queue: CommandQueue = new Map();
  private readonly inflight: Map<string, Command> = new Map();
  private readonly timeProvider: TimeProvider;
  private readonly visibilityTimeoutMs: number;

  constructor(options: InMemoryCommandBusOptions = {}) {
    this.timeProvider =
      options.timeProvider ?? ({ now: () => new Date() } as TimeProvider);
    this.visibilityTimeoutMs = options.visibilityTimeoutMs ?? 60_000;
  }

  async enqueue(command: Command): Promise<void> {
    const deviceQueue = this.queue.get(command.deviceId) ?? [];
    const queued: Command = {
      ...command,
      status: 'queued',
      queuedAt: command.queuedAt ?? ISODate(this.timeProvider.now()),
      updatedAt: ISODate(this.timeProvider.now()),
    };
    deviceQueue.push(queued);
    this.queue.set(command.deviceId, deviceQueue);
  }

  async next(deviceId: string): Promise<Command | undefined> {
    const deviceQueue = this.queue.get(deviceId);
    if (!deviceQueue?.length) {
      return undefined;
    }

    const command = deviceQueue.shift();
    if (!command) {
      return undefined;
    }

    const now = this.timeProvider.now();
    const sent: Command = {
      ...command,
      status: 'sent',
      updatedAt: ISODate(now),
    };
    this.inflight.set(command.id, { ...sent, queuedAt: command.queuedAt });

    setTimeout(() => this.handleVisibilityTimeout(command.id), this.visibilityTimeoutMs);

    return sent;
  }

  async ack(ack: CommandAcknowledgement): Promise<void> {
    const command = this.inflight.get(ack.commandId);
    if (!command) {
      return;
    }

    const status: CommandStatus = ack.status === 'acked' ? 'acked' : 'failed';
    this.inflight.set(ack.commandId, {
      ...command,
      status,
      updatedAt: ISODate(this.timeProvider.now()),
    });
  }

  private handleVisibilityTimeout(commandId: string): void {
    const command = this.inflight.get(commandId);
    if (!command) {
      return;
    }

    if (command.status === 'sent') {
      if (command.retries >= command.maxRetries) {
        this.inflight.set(commandId, {
          ...command,
          status: 'expired',
          updatedAt: ISODate(this.timeProvider.now()),
        });
        return;
      }

      const updated: Command = {
        ...command,
        status: 'queued',
        retries: command.retries + 1,
        updatedAt: ISODate(this.timeProvider.now()),
      };
      const deviceQueue = this.queue.get(command.deviceId) ?? [];
      deviceQueue.push(updated);
      this.queue.set(command.deviceId, deviceQueue);
      this.inflight.delete(commandId);
    }
  }
}
