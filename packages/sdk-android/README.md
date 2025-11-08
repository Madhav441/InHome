# Sentinel AU Android SDK

Lightweight OkHttp-based client for communicating with the Sentinel AU API from Android agents.

## Usage

```kotlin
val client = SentinelClient("http://10.0.2.2:4000")
client.sendHeartbeat("device-123")
```
