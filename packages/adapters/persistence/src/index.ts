import { Command, Device, Policy, Tenant } from '@inhome/core';

export interface PersistenceContext {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export interface DeviceRepository {
  save(device: Device): Promise<void>;
  findById(id: string): Promise<Device | undefined>;
}

export interface CommandRepository {
  save(command: Command): Promise<void>;
  findPending(deviceId: string): Promise<Command[]>;
}

export interface PolicyRepository {
  save(policy: Policy): Promise<void>;
  list(): Promise<Policy[]>;
}

export interface TenantRepository {
  save(tenant: Tenant): Promise<void>;
  findById(id: string): Promise<Tenant | undefined>;
}

export interface PersistenceAdapter extends PersistenceContext {
  devices: DeviceRepository;
  commands: CommandRepository;
  policies: PolicyRepository;
  tenants: TenantRepository;
}

export class InMemoryPersistence implements PersistenceAdapter {
  private devicesStore = new Map<string, Device>();
  private commandsStore = new Map<string, Command[]>();
  private policiesStore = new Map<string, Policy>();
  private tenantsStore = new Map<string, Tenant>();

  devices: DeviceRepository = {
    save: async (device) => {
      this.devicesStore.set(device.id, device);
    },
    findById: async (id) => this.devicesStore.get(id),
  };

  commands: CommandRepository = {
    save: async (command) => {
      const queue = this.commandsStore.get(command.deviceId) ?? [];
      queue.push(command);
      this.commandsStore.set(command.deviceId, queue);
    },
    findPending: async (deviceId) => this.commandsStore.get(deviceId) ?? [],
  };

  policies: PolicyRepository = {
    save: async (policy) => {
      this.policiesStore.set(policy.id, policy);
    },
    list: async () => Array.from(this.policiesStore.values()),
  };

  tenants: TenantRepository = {
    save: async (tenant) => {
      this.tenantsStore.set(tenant.id, tenant);
    },
    findById: async (id) => this.tenantsStore.get(id),
  };

  async connect(): Promise<void> {
    // no-op for in-memory storage
  }

  async disconnect(): Promise<void> {
    this.devicesStore.clear();
    this.commandsStore.clear();
    this.policiesStore.clear();
    this.tenantsStore.clear();
  }
}
