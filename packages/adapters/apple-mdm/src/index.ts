import {
  Command,
  CommandOrchestrator,
  Device,
  DeviceToken,
  EnrollmentService,
  ISODate,
  Platform,
  Policy,
  PolicyRenderer,
  ProfileArtifact,
  ProfileService,
  ProfileSigningContext,
} from '@inhome/core';
import { toPolicy } from '@inhome/policy-dsl';
import crypto from 'crypto';

export interface ApnsMessage {
  deviceToken: string;
  payload: Record<string, unknown>;
}

export interface ApnsPushProvider {
  send(message: ApnsMessage): Promise<void>;
}

export interface AppleCheckInRequest {
  udid: string;
  topic: string;
  pushMagic: string;
  token: string;
  enrollmentId: string;
}

export interface AppleConnectRequest {
  udid: string;
  status: 'Idle' | 'Acknowledged' | 'Error';
  commandUUID?: string;
  errorChain?: unknown[];
  topic: string;
}

export interface AppleMDMContext {
  orchestrator: CommandOrchestrator;
  enrollmentService: EnrollmentService;
  profileService: ProfileService;
  pushProvider: ApnsPushProvider;
}

export class AppleMDMAdapter {
  constructor(private readonly context: AppleMDMContext) {}

  async handleCheckIn(request: AppleCheckInRequest): Promise<DeviceToken> {
    const device: Device = {
      id: request.udid,
      platform: 'apple',
      enrollmentChannel: 'mdm',
      owner: {
        type: 'user',
        tenantId: request.enrollmentId,
      },
      identity: {
        udid: request.udid,
      },
      status: 'enrolled',
      facts: {},
      tokens: [],
      createdAt: ISODate(new Date()),
      updatedAt: ISODate(new Date()),
    };

    await this.context.enrollmentService.completeSession(request.enrollmentId, device);

    const token: DeviceToken = {
      type: 'apns',
      value: request.token,
    };

    device.tokens.push(token);

    return token;
  }

  async handleConnect(request: AppleConnectRequest): Promise<Command | undefined> {
    const command = await this.context.orchestrator.next(request.udid);
    if (!command) {
      return undefined;
    }

    await this.context.pushProvider.send({
      deviceToken: request.udid,
      payload: {
        mdm: request.topic,
        commandUUID: command.id,
      },
    });

    return command;
  }

  async queuePolicy(policy: Policy, device: Device): Promise<void> {
    const command: Command = {
      id: crypto.randomUUID(),
      deviceId: device.id,
      platform: 'apple',
      name: 'InstallProfile',
      payload: {
        payloadIdentifier: `${policy.id}.${policy.version}`,
      },
      issuedBy: 'policy-engine',
      status: 'queued',
      retries: 0,
      maxRetries: 3,
      queuedAt: ISODate(new Date()),
      updatedAt: ISODate(new Date()),
    };

    await this.context.orchestrator.enqueue(command);
  }
}

export interface AppleProfileRendererOptions {
  signingContext: ProfileSigningContext;
  profileService: ProfileService;
}

export class AppleProfileRenderer implements PolicyRenderer<ProfileArtifact> {
  readonly platform: Platform = 'apple';
  constructor(private readonly options: AppleProfileRendererOptions) {}

  async render(policy: Policy): Promise<ProfileArtifact> {
    const payload = buildConfigurationProfile(policy);
    const device: Device = {
      id: 'policy-preview',
      platform: 'apple',
      enrollmentChannel: 'mdm',
      owner: {
        type: 'service',
        tenantId: 'preview',
      },
      identity: {},
      status: 'enrolled',
      facts: {},
      tokens: [],
      createdAt: ISODate(new Date()),
      updatedAt: ISODate(new Date()),
    };

    return this.options.profileService.signAndStoreProfile(
      policy,
      device,
      this.options.signingContext
    );
  }
}

export const buildConfigurationProfile = (policy: Policy): string => {
  const payloadContent = policy.rules
    .filter((rule) => rule.platform === 'apple' || rule.platform === 'any')
    .map((rule) => rule.definition.actions)
    .flat();

  const profile = {
    PayloadContent: payloadContent,
    PayloadIdentifier: `${policy.id}.${policy.version}`,
    PayloadUUID: crypto.randomUUID(),
    PayloadDisplayName: policy.name,
    PayloadType: 'Configuration',
    PayloadVersion: policy.version,
  };

  return plist(payload);
};

const plist = (input: Record<string, unknown>): string => {
  const lines: string[] = ['<?xml version="1.0" encoding="UTF-8"?>', '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">', '<plist version="1.0">'];
  lines.push(objectToPlist(input, 1));
  lines.push('</plist>');
  return lines.join('\n');
};

const objectToPlist = (input: Record<string, unknown>, depth: number): string => {
  const indent = '  '.repeat(depth);
  const entries = Object.entries(input)
    .map(([key, value]) => `${indent}<key>${key}</key>\n${serializeValue(value, depth)}`)
    .join('\n');
  return `${'  '.repeat(depth - 1)}<dict>\n${entries}\n${'  '.repeat(depth - 1)}</dict>`;
};

const serializeValue = (value: unknown, depth: number): string => {
  const indent = '  '.repeat(depth);
  if (value === null || value === undefined) {
    return `${indent}<string></string>`;
  }
  if (typeof value === 'string') {
    return `${indent}<string>${escapeXml(value)}</string>`;
  }
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? `${indent}<integer>${value}</integer>`
      : `${indent}<real>${value}</real>`;
  }
  if (typeof value === 'boolean') {
    return `${indent}<${value ? 'true' : 'false'}/>`;
  }
  if (Array.isArray(value)) {
    const items = value.map((item) => serializeValue(item, depth + 1)).join('\n');
    return `${indent}<array>\n${items}\n${indent}</array>`;
  }
  if (typeof value === 'object') {
    return objectToPlist(value as Record<string, unknown>, depth + 1);
  }
  return `${indent}<string>${escapeXml(String(value))}</string>`;
};

const escapeXml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const policyFromDefinition = (definition: Parameters<typeof toPolicy>[0]): Policy =>
  toPolicy(definition);

export interface InMemoryProfileStore {
  artifacts: Map<string, { profile: string; artifact: ProfileArtifact }>; 
}

export class InMemoryProfileService implements ProfileService {
  constructor(private readonly store: InMemoryProfileStore = { artifacts: new Map() }) {}

  async signAndStoreProfile(
    policy: Policy,
    device: Device,
    signingContext: ProfileSigningContext
  ): Promise<ProfileArtifact> {
    const profile = buildConfigurationProfile(policy);
    const digest = crypto.createHash('sha256').update(profile).digest('hex');
    const artifact: ProfileArtifact = {
      id: crypto.randomUUID(),
      deviceId: device.id,
      policyId: policy.id,
      location: `memory://${policy.id}`,
      checksum: digest,
      createdAt: ISODate(new Date()),
    };

    this.store.artifacts.set(artifact.id, { profile, artifact });
    return artifact;
  }
}
