# API Stubs and Shapes (Draft)

Use these endpoint shapes to guide implementation. All endpoints are tenant-scoped.

## Apple
- Implementation scaffolding lives in `packages/api/src/apple.ts`. Each handler currently returns stubbed data and documents the expected request/response contracts.
- POST /api/apple/mdm/enrollment-profile
  - body: { displayName, topic, ttl }
  - returns: { profilePlistBase64, downloadUrl }
- POST /api/apple/mdm/push
  - body: { deviceId, payload }
  - returns: { accepted: boolean, apnsId }
- POST /api/apple/mdm/checkin (device)
- POST /api/apple/mdm/connect (device)

## Android (AMA)
- GET /api/android/enterprise/signupUrl
- POST /api/android/enterprise/complete
  - body: { code }
- POST /api/android/enrollment-token
  - body: { policy, duration }
  - returns: { qrSvg, afwCode, token }

## Windows (Agent)
- POST /api/windows/agent/enroll
  - body: { deviceFacts, nonce }
- GET /api/windows/agent/commands?deviceId=...
- POST /api/windows/agent/ack
  - body: { commandId, status, occurredAt }

## Common
- GET /api/devices/:id
- POST /api/commands
- POST /api/policies
- GET /api/policies/render?platform=apple|android|windows&id=...
