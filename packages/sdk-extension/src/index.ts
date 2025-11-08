import { SentinelWebClient } from '@sentinel-au/sdk-web';

export class SentinelExtensionClient {
  #client = new SentinelWebClient();

  async reportNavigation(url: string, title: string) {
    return this.#client.sendTelemetry({
      deviceId: 'extension',
      ts: new Date().toISOString(),
      kind: 'browser',
      payload: { url, title }
    });
  }
}
