package au.sentinel.sdk

import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

class SentinelClient(
    private val baseUrl: String = System.getenv("SENTINEL_API_BASE") ?: "https://api.sentinel.au"
) {
    private val client = OkHttpClient()

    fun sendHeartbeat(deviceId: String): Boolean {
        val json = JSONObject()
        json.put("deviceId", deviceId)
        json.put("ts", System.currentTimeMillis())
        json.put("kind", "heartbeat")
        val request = Request.Builder()
            .url("$baseUrl/v1/telemetry")
            .post(json.toString().toRequestBody("application/json".toMediaType()))
            .build()
        client.newCall(request).execute().use { response ->
            return response.isSuccessful
        }
    }
}
