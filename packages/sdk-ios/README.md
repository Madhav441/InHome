# Sentinel AU iOS SDK

Swift Package for fetching policies and telemetry endpoints from the Sentinel AU API.

```swift
import SentinelSDK

let client = SentinelClient(baseURL: URL(string: "http://localhost:4000")!)
let policyData = try await client.fetchPolicy(deviceId: "ios-demo")
```
