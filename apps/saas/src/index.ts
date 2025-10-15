import { InMemoryCommandBus } from '@inhome/command-bus';
import { InMemoryEnrollmentService } from '@inhome/enrollment';
import { InMemoryPersistence } from '@inhome/persistence-adapter';
import { InMemoryBillingProvider, StaticAuthProvider } from '@inhome/auth-billing-adapter';
import { Command, Device, Tenant } from '@inhome/core';

export interface SaasContext {
  persistence: InMemoryPersistence;
  commandBus: InMemoryCommandBus;
  enrollment: InMemoryEnrollmentService;
  billing: InMemoryBillingProvider;
  auth: StaticAuthProvider;
}

export const bootstrapSaas = async (tenants: Tenant[]): Promise<SaasContext> => {
  const persistence = new InMemoryPersistence();
  const commandBus = new InMemoryCommandBus();
  const enrollment = new InMemoryEnrollmentService();
  const billing = new InMemoryBillingProvider();
  const auth = new StaticAuthProvider(
    new Map(
      tenants.map((tenant) => [
        `${tenant.id}-token`,
        {
          tenant,
          userId: `${tenant.id}-admin`,
          roles: ['admin'],
        },
      ])
    )
  );

  await persistence.connect();

  await Promise.all(tenants.map((tenant) => persistence.tenants.save(tenant)));

  return { persistence, commandBus, enrollment, billing, auth };
};

export const enqueueTenantCommand = async (
  context: SaasContext,
  tenant: Tenant,
  command: Command
) => {
  if (command.issuedBy !== tenant.id) {
    throw new Error('Command issuer must match tenant in SaaS mode');
  }
  await context.commandBus.enqueue(command);
  await context.persistence.commands.save(command);
};

export const registerTenantDevice = async (
  context: SaasContext,
  tenant: Tenant,
  device: Device
) => {
  if (device.owner.tenantId !== tenant.id) {
    throw new Error('Device tenant mismatch');
  }
  await context.persistence.devices.save(device);
};
