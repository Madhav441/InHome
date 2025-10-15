import { InMemoryCommandBus } from '@inhome/command-bus';
import { InMemoryEnrollmentService } from '@inhome/enrollment';
import { InMemoryPersistence } from '@inhome/persistence-adapter';
import { PolicyDefinition, projectRules } from '@inhome/policy-dsl';
import { Command, Device, ISODate, Policy } from '@inhome/core';

export interface SelfHostContext {
  persistence: InMemoryPersistence;
  commandBus: InMemoryCommandBus;
  enrollment: InMemoryEnrollmentService;
}

export const bootstrap = async (): Promise<SelfHostContext> => {
  const persistence = new InMemoryPersistence();
  const commandBus = new InMemoryCommandBus();
  const enrollment = new InMemoryEnrollmentService();

  await persistence.connect();

  return { persistence, commandBus, enrollment };
};

export const enqueueCommand = async (context: SelfHostContext, command: Command) => {
  await context.commandBus.enqueue(command);
  await context.persistence.commands.save(command);
};

export const syncPolicy = async (context: SelfHostContext, policy: Policy) => {
  await context.persistence.policies.save(policy);
  const targets = projectRules(policyToDefinition(policy), []);
  return targets;
};

const policyToDefinition = (policy: Policy): PolicyDefinition => ({
  id: policy.id,
  name: policy.name,
  version: policy.version,
  targets: policy.targets,
  rules: policy.rules.map((rule) => ({
    id: rule.id,
    description: rule.description,
    platforms: [rule.platform],
    actions: rule.definition.actions ?? [],
  })),
});

export const registerDevice = async (
  context: SelfHostContext,
  device: Device
): Promise<void> => {
  await context.persistence.devices.save(device);
  await context.enrollment.createSession({
    tenantId: device.owner.tenantId,
    platform: device.platform,
    channel: device.enrollmentChannel,
  });
  device.updatedAt = ISODate(new Date());
};
