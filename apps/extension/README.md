# Sentinel AU browser extension

Chromium MV3 extension enforcing SafeSearch and reporting URLs back to the Sentinel AU backend.

## Development

```bash
pnpm --filter @sentinel-au/extension build
```

Load the `apps/extension` directory as an unpacked extension in Chrome/Edge. Enable optional incognito monitoring within browser settings to comply with user consent requirements.

## Assets

Chrome Web Store packaging requires PNG icons. To avoid committing binary assets to the monorepo, add your own icon file during release builds (for example, generate `icon.png` in a build step or copy it from your design system) and update `manifest.json` accordingly.
