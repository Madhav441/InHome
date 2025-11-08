#!/usr/bin/env node
// Secret-backed smoke: ensure required env vars are present without printing them.
/* eslint-disable no-console */
const required = [
  'APNS_KEY_PEM',
  'FCM_SERVICE_ACCOUNT_JSON',
  'WINDOWS_CERT_PFX_BASE64',
  'WINDOWS_CERT_PASSWORD'
];

let ok = true;
for (const name of required) {
  if (!process.env[name]) {
    console.error(`Missing secret env var: ${name}`);
    ok = false;
  } else {
    console.log(`Present: ${name}`);
  }
}

if (!ok) {
  console.error('Secrets smoke failed');
  process.exit(1);
}
console.log('Secrets smoke passed');