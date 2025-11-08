import { Injectable } from '@nestjs/common';

type TelemetryRecord = {
  deviceId: string;
  ts: string;
  kind: string;
  payload: Record<string, unknown>;
};

const buffer: TelemetryRecord[] = [];

@Injectable()
export class TelemetryService {
  ingest(record: TelemetryRecord) {
    buffer.push(record);
    if (buffer.length > 50) {
      buffer.shift();
    }
    return { status: 'queued' };
  }

  recent() {
    return buffer;
  }
}
