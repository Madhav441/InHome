export interface PolicySnapshot {
  deviceId: string;
  issuedAt: string;
  signature: string;
  policy: Record<string, unknown>;
}
