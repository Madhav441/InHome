#!/usr/bin/env node
// Basic smoke test placeholder: verify core packages build artifacts presence or simple imports.
/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');

function checkFile(p) {
  const exists = fs.existsSync(p);
  console.log(`${exists ? 'OK ' : 'MISS'} ${p}`);
  return exists;
}

let ok = true;

// Example: ensure root tsconfig exists
ok &= checkFile(path.join(process.cwd(), 'tsconfig.json'));

// TODO: extend with real enrollment / policy in-memory validations
if (!ok) {
  console.error('Smoke failed');
  process.exit(1);
}
console.log('Smoke passed');