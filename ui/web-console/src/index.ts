import { Command, Device, Policy } from '@inhome/core';

export interface DeviceRow {
  id: string;
  platform: Device['platform'];
  owner: string;
  status: Device['status'];
  lastCheckIn?: string;
}

export interface PolicyRow {
  id: string;
  name: string;
  version: number;
  targets: string[];
}

export interface CommandRow {
  id: string;
  deviceId: string;
  name: string;
  status: Command['status'];
}

export interface DashboardViewModel {
  devices: DeviceRow[];
  policies: PolicyRow[];
  commands: CommandRow[];
}

export const toDashboardViewModel = (
  devices: Device[],
  policies: Policy[],
  commands: Command[]
): DashboardViewModel => ({
  devices: devices.map((device: Device) => ({
    id: device.id,
    platform: device.platform,
    owner: device.owner.displayName ?? device.owner.tenantId,
    status: device.status,
    lastCheckIn: device.lastCheckIn,
  })),
  policies: policies.map((policy: Policy) => ({
    id: policy.id,
    name: policy.name,
    version: policy.version,
    targets: policy.targets.map(
      (target: Policy['targets'][number]) => `${target.type}:${target.id}`
    ),
  })),
  commands: commands.map((command: Command) => ({
    id: command.id,
    deviceId: command.deviceId,
    name: command.name,
    status: command.status,
  })),
});
