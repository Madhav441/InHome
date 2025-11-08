# Sentinel AU Android agent

Kotlin-based consumer deployable agent that uses a local VPN service for policy enforcement, alongside accessibility and usage stats listeners (TODO).

## Modules

- `SentinelVpnService` – establishes a local TUN interface ready for go-tun2socks integration.
- Pairing UI – Compose based home screen to start the service and surface device status.

## Build

```bash
./gradlew assembleDebug
```

## Compliance

- Operates without Device Owner privileges; optional provisioning scripts will be added.
- Collects notification titles only, never message bodies.
- Clearly notifies the user with a persistent VPN indicator.
