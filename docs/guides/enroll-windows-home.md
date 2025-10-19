# Enroll your first Windows device (agent)

This uses the native InHome agent, no Microsoft tenant required.

## Prereqs
- Access to your InHome tenant or appliance portal.

## Step 1: Download agent
- Portal → Devices → Add device → Windows → Download agent.

## Step 2: Install and enroll
1. Run the installer (or unzip binary) as Administrator.
2. Paste the enrollment URL/token from the portal.
3. The agent registers, pulls initial policy, and starts reporting facts.

## Verify
- Portal → Devices shows your Windows PC.
- Send a command (e.g., collect facts) and confirm ack.

## Notes
- This path uses an agent, not the Windows MDM CSP channel. We’ll add CSP-based features over time or offer a hybrid model.
