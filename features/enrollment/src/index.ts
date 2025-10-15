import {
  Device,
  EnrollmentContext,
  EnrollmentService,
  EnrollmentSession,
  ISODate,
  TimeProvider,
} from '@inhome/core';
import { randomUUID } from 'crypto';

export interface InMemoryEnrollmentStore {
  sessions: Map<string, EnrollmentSession>;
}

export class InMemoryEnrollmentService implements EnrollmentService {
  private readonly store: InMemoryEnrollmentStore;
  private readonly timeProvider: TimeProvider;
  private readonly defaultTtlMs: number;

  constructor(options?: {
    store?: InMemoryEnrollmentStore;
    timeProvider?: TimeProvider;
    defaultTtlMs?: number;
  }) {
    this.store = options?.store ?? { sessions: new Map() };
    this.timeProvider = options?.timeProvider ?? ({ now: () => new Date() } as TimeProvider);
    this.defaultTtlMs = options?.defaultTtlMs ?? 5 * 60 * 1000;
  }

  async createSession(context: EnrollmentContext): Promise<EnrollmentSession> {
    const now = this.timeProvider.now();
    const session: EnrollmentSession = {
      id: randomUUID(),
      tenantId: context.tenantId,
      platform: context.platform,
      channel: context.channel,
      code: randomUUID(),
      expiresAt: ISODate(new Date(now.getTime() + this.defaultTtlMs)),
      createdAt: ISODate(now),
      metadata: context.metadata,
    };
    this.store.sessions.set(session.id, session);
    return session;
  }

  async completeSession(sessionId: string, device: Device): Promise<void> {
    const session = this.store.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Enrollment session ${sessionId} not found`);
    }
    const now = ISODate(this.timeProvider.now());
    this.store.sessions.set(sessionId, { ...session, completedAt: now });
    device.lastCheckIn = now;
  }

  get activeSessions(): EnrollmentSession[] {
    const now = this.timeProvider.now();
    return Array.from(this.store.sessions.values()).filter((session) => {
      const expires = new Date(session.expiresAt);
      return (!session.completedAt || new Date(session.completedAt) > now) && expires > now;
    });
  }
}
