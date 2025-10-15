import { InMemoryCommandBus } from '@inhome/command-bus';
import { InMemoryPersistence } from '@inhome/persistence-adapter';
import { WebRtcRemoteAccessProvider } from '@inhome/remote-access-adapter';
import { Command, Device } from '@inhome/core';

export interface HybridContext {
  persistence: InMemoryPersistence;
  commandBus: InMemoryCommandBus;
  remoteAccess: WebRtcRemoteAccessProvider;
}

export const bootstrapHybrid = async (relayUrl: string): Promise<HybridContext> => {
  const persistence = new InMemoryPersistence();
  const commandBus = new InMemoryCommandBus();
  const remoteAccess = new WebRtcRemoteAccessProvider(relayUrl);

  await persistence.connect();

  return { persistence, commandBus, remoteAccess };
};

export const dispatchCommand = async (
  context: HybridContext,
  command: Command
): Promise<void> => {
  await context.commandBus.enqueue(command);
  await context.persistence.commands.save(command);
};

export const openRemoteSession = async (
  context: HybridContext,
  device: Device
) => context.remoteAccess.createSession(device.id);
