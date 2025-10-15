import { Tenant } from '@inhome/core';

export interface AuthResult {
  tenant: Tenant;
  userId: string;
  roles: string[];
}

export interface AuthProvider {
  authenticate(token: string): Promise<AuthResult | undefined>;
}

export interface BillingPlan {
  id: string;
  name: string;
  maxDevices: number;
  pricePerMonth: number;
}

export interface BillingProvider {
  assignPlan(tenantId: string, plan: BillingPlan): Promise<void>;
  currentPlan(tenantId: string): Promise<BillingPlan | undefined>;
}

export class StaticAuthProvider implements AuthProvider {
  constructor(private readonly tokenMap: Map<string, AuthResult>) {}

  async authenticate(token: string): Promise<AuthResult | undefined> {
    return this.tokenMap.get(token);
  }
}

export class InMemoryBillingProvider implements BillingProvider {
  private readonly plans = new Map<string, BillingPlan>();

  async assignPlan(tenantId: string, plan: BillingPlan): Promise<void> {
    this.plans.set(tenantId, plan);
  }

  async currentPlan(tenantId: string): Promise<BillingPlan | undefined> {
    return this.plans.get(tenantId);
  }
}
