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
  PolicyRule,
} from '@inhome/core';
import crypto from 'crypto';

export interface FcmMessage {
  token: string;
  data: Record<string, string>;
}

export interface FcmPushProvider {
  send(message: FcmMessage): Promise<void>;
}

export interface AndroidEnrollmentRequest {
  androidId: string;
  enrollmentId: string;
  tenantId: string;
  fcmToken?: string;
  imei?: string;
  serialNumber?: string;
}

export interface AndroidCommandAck {
  commandId: string;
  status: 'acked' | 'failed';
  detail?: string;
}

export interface AndroidMDMContext {
  orchestrator: CommandOrchestrator;
  enrollmentService: EnrollmentService;
  pushProvider?: FcmPushProvider;
}

export class AndroidMDMAdapter {
  constructor(private readonly context: AndroidMDMContext) {}

  async completeEnrollment(request: AndroidEnrollmentRequest): Promise<Device> {
    const now = new Date();
    const device: Device = {
      id: request.androidId,
      platform: 'android',
      enrollmentChannel: 'mdm',
      owner: {
        type: 'user',
        tenantId: request.tenantId,
      },
      identity: {
        platformId: request.androidId,
        imei: request.imei,
        serialNumber: request.serialNumber,
      },
      status: 'enrolled',
      facts: {},
      tokens: [],
      createdAt: ISODate(now),
      updatedAt: ISODate(now),
    };

    await this.context.enrollmentService.completeSession(request.enrollmentId, device);

    if (request.fcmToken) {
      device.tokens.push(this.registerFcmToken(request.fcmToken));
    }

    return device;
  }

  registerFcmToken(tokenValue: string): DeviceToken {
    return {
      type: 'fcm',
      value: tokenValue,
    };
  }

  async deliverNextCommand(device: Device): Promise<Command | undefined> {
    const command = await this.context.orchestrator.next(device.id);
    if (!command) {
      return undefined;
    }

    const fcmToken = device.tokens.find((token: DeviceToken) => token.type === 'fcm');
    if (fcmToken?.value && this.context.pushProvider) {
      await this.context.pushProvider.send({
        token: fcmToken.value,
        data: {
          commandId: command.id,
          commandName: command.name,
          payload: JSON.stringify(command.payload ?? {}),
        },
      });
    }

    return command;
  }

  async acknowledgeCommand(deviceId: string, ack: AndroidCommandAck): Promise<void> {
    await this.context.orchestrator.ack({
      commandId: ack.commandId,
      deviceId,
      status: ack.status,
      detail: ack.detail,
      occurredAt: ISODate(new Date()),
    });
  }

  async queuePolicyInstall(policy: Policy, device: Device): Promise<void> {
    const command: Command = {
      id: crypto.randomUUID(),
      deviceId: device.id,
      platform: 'android',
      name: 'APPLY_MANAGED_CONFIG',
      payload: {
        policyId: policy.id,
        version: policy.version,
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

export interface AndroidPolicyPayload {
  ruleId: string;
  policy: string;
  arguments: Record<string, unknown>;
}

const isAndroidAction = (
  action: unknown
): action is { type: 'android_dpm'; policy: string; arguments?: Record<string, unknown> } =>
  typeof action === 'object' &&
  action !== null &&
  'type' in action &&
  (action as { type: string }).type === 'android_dpm';

const extractAndroidActions = (rule: PolicyRule): AndroidPolicyPayload[] => {
  const definition = rule.definition as { actions?: unknown[] };
  const actions = Array.isArray(definition.actions) ? definition.actions : [];
  return actions
    .filter(isAndroidAction)
    .map((action) => ({
      ruleId: rule.id,
      policy: action.policy,
      arguments: action.arguments ?? {},
    }));
};

export class AndroidPolicyRenderer implements PolicyRenderer<AndroidPolicyPayload[]> {
  readonly platform: Platform = 'android';

  async render(policy: Policy): Promise<AndroidPolicyPayload[]> {
    return policy.rules
      .filter((rule: PolicyRule) => rule.platform === 'android' || rule.platform === 'any')
      .flatMap((rule: PolicyRule) => extractAndroidActions(rule));
  }
}
