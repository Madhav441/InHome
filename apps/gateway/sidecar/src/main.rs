use reqwest::Client;
use serde::Deserialize;
use std::time::Duration;
use tokio::time::sleep;

#[derive(Deserialize, Debug)]
struct PolicyEnvelope {
    deviceId: String,
    policy: serde_json::Value,
}

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let client = Client::new();
    loop {
        let res = client
            .get("http://api:4000/v1/policy/gateway-demo")
            .send()
            .await?;
        let policy: PolicyEnvelope = res.json().await?;
        println!("Fetched policy for {}", policy.deviceId);
        // TODO: write AdGuard Home config via its REST API
        sleep(Duration::from_secs(60)).await;
    }
}
