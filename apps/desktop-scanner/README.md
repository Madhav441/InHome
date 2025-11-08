# Sentinel AU desktop scanner

Electron shell that will orchestrate libimobiledevice to perform periodic on-LAN iOS backups and run local ML classifiers.

## Development

```bash
pnpm --filter @sentinel-au/desktop-scanner start
```

## Roadmap

- Integrate libimobiledevice for backup automation (documented in docs/ios-backup.md, TODO).
- Perform Whisper.cpp transcription on audio notes.
