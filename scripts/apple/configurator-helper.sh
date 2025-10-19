#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: configurator-helper.sh --portal <portal_url> --output <path>

Fetch an auto-enroll profile and print Apple Configurator guidance for supervised home deployments.

Options:
  --portal   Base URL of the InHome portal (e.g. https://tenant.example.com)
  --output   Destination path for the downloaded .mobileconfig file
  --track    Enrollment track (manual|configurator). Defaults to configurator.
  --help     Show this message.
EOF
}

PORTAL=""
OUTPUT=""
TRACK="configurator"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --portal)
      PORTAL="$2"
      shift 2
      ;;
    --output)
      OUTPUT="$2"
      shift 2
      ;;
    --track)
      TRACK="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$PORTAL" || -z "$OUTPUT" ]]; then
  echo "portal and output are required." >&2
  usage
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT")"

PROFILE_URL="${PORTAL%/}/apple/enroll/profile.mobileconfig?track=${TRACK}"

echo "Fetching enrollment profile from: $PROFILE_URL"
if command -v curl >/dev/null 2>&1; then
  curl --fail --silent "$PROFILE_URL" -o "$OUTPUT" || {
    echo "Unable to download profile. Writing placeholder stub." >&2
    cat <<'STUB' > "$OUTPUT"
<?xml version="1.0" encoding="UTF-8"?>
<!-- TODO: replace with signed configuration profile -->
<plist version="1.0">
  <dict>
    <key>PayloadDisplayName</key>
    <string>InHome Configurator Helper</string>
    <key>PayloadDescription</key>
    <string>Placeholder profile. Connect to your portal to fetch the real artifact.</string>
  </dict>
</plist>
STUB
  }
else
  echo "curl is not available; writing placeholder profile." >&2
  cat <<'STUB' > "$OUTPUT"
<?xml version="1.0" encoding="UTF-8"?>
<!-- TODO: replace with signed configuration profile -->
<plist version="1.0">
  <dict>
    <key>PayloadDisplayName</key>
    <string>InHome Configurator Helper</string>
  </dict>
</plist>
STUB
fi

cat <<EOF

Configurator steps
------------------
1. Open Apple Configurator 2 on the Mac running this script.
2. Connect the child's device via USB.
3. Choose "Prepare" and select "Manual Configuration".
4. Check "Supervise devices" and "Allow devices to pair with other computers".
5. When prompted for profiles, add:
     $OUTPUT
6. Complete the wizard. The device will erase, reboot, and auto-enroll against:
     $PORTAL

Reminder: supervised prep requires a full device wipe. Confirm that the parent has an up-to-date backup before proceeding.
EOF
