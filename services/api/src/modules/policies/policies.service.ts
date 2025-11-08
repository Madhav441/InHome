import { Injectable } from '@nestjs/common';

const demoPolicy = {
  version: '2024-08-25T00:00:00Z',
  categories: {
    Adult: 'Block',
    Violence: 'Warn',
    Gambling: 'Block',
    Social: 'Managed',
    Education: 'Allow'
  },
  schedules: {
    bedtime: {
      startsAt: '20:30',
      endsAt: '06:30'
    }
  },
  overrides: []
};

@Injectable()
export class PoliciesService {
  getPolicy(deviceId: string) {
    return {
      deviceId,
      issuedAt: new Date().toISOString(),
      signature: 'demo-signature',
      policy: demoPolicy
    };
  }
}
