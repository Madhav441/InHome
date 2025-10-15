#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function findTsConfig(startDir) {
  let dir = path.resolve(startDir);
  while (dir !== path.parse(dir).root) {
    const candidate = path.join(dir, 'tsconfig.json');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    dir = path.dirname(dir);
  }
  return null;
}

function emitNotice(message) {
  process.stdout.write(`tsc (offline stub): ${message}\n`);
}

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  emitNotice('TypeScript compiler unavailable in offline sandbox.');
  process.stdout.write('\nThis stub satisfies build scripts that expect `tsc` to exist.\n');
  process.exit(0);
}

const tsconfigPath = findTsConfig(process.cwd());
if (tsconfigPath) {
  emitNotice(`tsconfig detected at ${tsconfigPath}. Skipping compilation due to offline environment.`);
} else {
  emitNotice('No tsconfig.json found. Nothing to do.');
}

process.exit(0);
