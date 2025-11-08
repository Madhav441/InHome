import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const demoUser = {
  id: 'user-demo',
  email: 'demo@example.com',
  passwordHash: bcrypt.hashSync('demo123', 10),
  orgId: 'org-demo'
};

@Injectable()
export class AuthService {
  async validateUser(email: string, password: string) {
    if (email !== demoUser.email) {
      return null;
    }
    const match = await bcrypt.compare(password, demoUser.passwordHash);
    if (!match) {
      return null;
    }
    return { id: demoUser.id, orgId: demoUser.orgId, email: demoUser.email };
  }

  issueToken(payload: { sub: string; orgId: string }) {
    const secret = process.env.JWT_SECRET ?? 'sentinel-au-dev-secret';
    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }
}
