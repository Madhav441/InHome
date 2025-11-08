import { Injectable } from '@nestjs/common';

const demoOrg = {
  id: 'org-demo',
  name: 'Sentinel AU Demo Family',
  timezone: 'Australia/Sydney'
};

const demoProfiles = [
  { id: 'profile-luca', name: 'Luca', type: 'child', timezone: 'Australia/Sydney' },
  { id: 'profile-maya', name: 'Maya', type: 'child', timezone: 'Australia/Perth' },
  { id: 'profile-kai', name: 'Kai', type: 'teen', timezone: 'Australia/Sydney' }
];

@Injectable()
export class OrgsService {
  findOrg() {
    return demoOrg;
  }

  listProfiles() {
    return demoProfiles;
  }
}
