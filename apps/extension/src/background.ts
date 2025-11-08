import { SentinelWebClient } from '@sentinel-au/sdk-web';

const client = new SentinelWebClient();

chrome.runtime.onInstalled.addListener(() => {
  console.log('Sentinel AU extension installed');
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  await chrome.storage.local.set({ lastUrl: tab.url, lastTitle: tab.title });
  if (tab.url.includes('google.')) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: [
        {
          id: 1,
          priority: 1,
          action: {
            type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
            requestHeaders: [{ header: 'X-Restrict-YouTube-Devices', operation: 'set', value: 'restrict' }]
          },
          condition: {
            urlFilter: 'youtube.com',
            resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME]
          }
        }
      ]
    });
  }
  try {
    await client.sendTelemetry({
      deviceId: 'extension-demo',
      ts: new Date().toISOString(),
      kind: 'browser',
      payload: { url: tab.url, title: tab.title }
    });
  } catch (error) {
    console.warn('Failed to send telemetry', error);
  }
});
