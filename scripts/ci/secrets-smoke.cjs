const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..', '..');
const secretsRoot = path.join(root, 'infra', 'secrets');

const specs = [
  {
    env: 'APNS_KEY_PEM',
    target: path.join(secretsRoot, 'apns', 'AuthKey_ci.p8'),
    description: 'Apple APNs signing key',
  },
  {
    env: 'FCM_SERVICE_ACCOUNT_JSON',
    target: path.join(secretsRoot, 'fcm', 'tenant-ci.json'),
    description: 'Android FCM service account',
  },
  {
    env: 'WINDOWS_CERT_PFX_BASE64',
    target: path.join(secretsRoot, 'windows', 'inhome-ci.pfx'),
    description: 'Windows agent certificate',
    transform: (value) => Buffer.from(value, 'base64'),
  },
];

const ensureSecret = async ({ env, target, description, transform }) => {
  const value = process.env[env];
  if (!value) {
    throw new Error(`Environment variable ${env} is required for ${description}.`);
  }

  const dir = path.dirname(target);
  await fs.mkdir(dir, { recursive: true });

  const data = transform ? transform(value) : value;
  await fs.writeFile(target, data, { mode: 0o600 });
};

const verifyReadable = async (target) => {
  const stat = await fs.stat(target);
  if (!stat.isFile() || stat.size === 0) {
    throw new Error(`Secret file ${target} is not a populated file.`);
  }
};

const main = async () => {
  await Promise.all(specs.map((spec) => ensureSecret(spec)));

  const password = process.env.WINDOWS_CERT_PASSWORD;
  if (!password) {
    throw new Error('Environment variable WINDOWS_CERT_PASSWORD must be provided for PFX usage.');
  }

  await Promise.all(specs.map((spec) => verifyReadable(spec.target)));

  // Summarise without leaking content.
  for (const spec of specs) {
    const stat = await fs.stat(spec.target);
    console.log(
      `[secrets-smoke] ${spec.description} materialised at ${path.relative(root, spec.target)} (${stat.size} bytes)`
    );
  }
};

main().catch((error) => {
  console.error('[secrets-smoke] failure:', error.message);
  process.exit(1);
});
