export type Platform = 'apple' | 'android' | 'windows' | 'other';

export type EnrollmentChannel = 'mdm' | 'agent' | 'dep' | 'qr';

export interface DeviceToken {
  type: 'apns' | 'fcm' | 'wns' | 'websocket' | 'polling';
  value: string;
  expiresAt?: string;
}

export interface DeviceIdentity {
  serialNumber?: string;
  udid?: string;
  imei?: string;
  platformId?: string;
}

export interface DeviceOwner {
  type: 'user' | 'shared' | 'service';
  displayName?: string;
  email?: string;
  tenantId: string;
}

export interface Device {
  id: string;
  platform: Platform;
  enrollmentChannel: EnrollmentChannel;
  owner: DeviceOwner;
  identity: DeviceIdentity;
  status: 'new' | 'enrolled' | 'awaiting_ack' | 'inactive';
  facts: Record<string, unknown>;
  tokens: DeviceToken[];
  lastCheckIn?: string;
  createdAt: string;
  updatedAt: string;
}

export type CommandStatus = 'queued' | 'sent' | 'acked' | 'failed' | 'expired';

export interface Command {
  id: string;
  deviceId: string;
  platform: Platform;
  name: string;
  payload: Record<string, unknown>;
  correlationId?: string;
  issuedBy: string;
  status: CommandStatus;
  retries: number;
  maxRetries: number;
  queuedAt: string;
  updatedAt: string;
}

export interface PolicyTarget {
  type: 'group' | 'device' | 'dynamic';
  id: string;
}

export interface PolicyRule {
  id: string;
  description?: string;
  platform: Platform | 'any';
  definition: Record<string, unknown>;
}

export interface Policy {
  id: string;
  name: string;
  version: number;
  targets: PolicyTarget[];
  rules: PolicyRule[];
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  mode: 'self_host' | 'saas' | 'hybrid';
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  tenantId: string;
  actor: string;
  action: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  occurredAt: string;
}

export interface CommandAcknowledgement {
  commandId: string;
  deviceId: string;
  status: 'acked' | 'failed';
  detail?: string;
  occurredAt: string;
}

export interface EnrollmentContext {
  tenantId: string;
  platform: Platform;
  channel: EnrollmentChannel;
  metadata?: Record<string, unknown>;
}

export interface EnrollmentSession {
  id: string;
  tenantId: string;
  platform: Platform;
  channel: EnrollmentChannel;
  code: string;
  expiresAt: string;
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface EventEnvelope<TPayload> {
  id: string;
  type: string;
  tenantId: string;
  occurredAt: string;
  payload: TPayload;
}

export interface PolicyRenderer<TOutput> {
  platform: Platform;
  render(policy: Policy): Promise<TOutput>;
}

export interface ProfileArtifact {
  id: string;
  deviceId: string;
  policyId: string;
  location: string;
  checksum: string;
  createdAt: string;
}

export interface ProfileSigningContext {
  identifier: string;
  teamId: string;
  keyId: string;
  privateKeyPem: string;
}

export interface ProfileService {
  signAndStoreProfile(
    policy: Policy,
    device: Device,
    signingContext: ProfileSigningContext
  ): Promise<ProfileArtifact>;
}

export interface CommandOrchestrator {
  enqueue(command: Command): Promise<void>;
  next(deviceId: string): Promise<Command | undefined>;
  ack(ack: CommandAcknowledgement): Promise<void>;
}

export interface EnrollmentService {
  createSession(context: EnrollmentContext): Promise<EnrollmentSession>;
  completeSession(sessionId: string, device: Device): Promise<void>;
}

export interface InventoryCollector {
  upsertDevice(device: Device): Promise<void>;
  recordFacts(deviceId: string, facts: Record<string, unknown>): Promise<void>;
}

export interface EventPublisher {
  publish<T>(event: EventEnvelope<T>): Promise<void>;
}

export interface TenancyResolver {
  resolve(tenantId: string): Promise<Tenant>;
}

export interface TimeProvider {
  now(): Date;
}

export const ISODate = (date: Date): string => date.toISOString();

