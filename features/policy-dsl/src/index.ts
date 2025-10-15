import { ISODate, Platform, Policy, PolicyRule, PolicyTarget } from '@inhome/core';

export type ConditionOperator = 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';

export interface Condition {
  fact: string;
  operator: ConditionOperator;
  value: unknown;
}

export type ActionType =
  | { type: 'configuration_profile'; identifier: string; payload: Record<string, unknown>; }
  | { type: 'registry_write'; path: string; value: unknown; }
  | { type: 'android_dpm'; policy: string; arguments?: Record<string, unknown>; };

export interface PolicyRuleDefinition {
  id: string;
  description?: string;
  platforms: (Platform | 'any')[];
  conditions?: Condition[];
  actions: ActionType[];
}

export interface PolicyDefinition {
  id: string;
  name: string;
  version: number;
  targets: PolicyTarget[];
  rules: PolicyRuleDefinition[];
}

export const toPolicy = (definition: PolicyDefinition): Policy => {
  const timestamp = ISODate(new Date());
  const rules: PolicyRule[] = definition.rules.map((rule) => ({
    id: rule.id,
    description: rule.description,
    platform: rule.platforms.length === 1 ? rule.platforms[0] : 'any',
    definition: {
      conditions: rule.conditions ?? [],
      actions: rule.actions,
    },
  }));

  return {
    id: definition.id,
    name: definition.name,
    version: definition.version,
    targets: definition.targets,
    rules,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export interface PlatformProjection<TOutput> {
  platform: Platform;
  project(rule: PolicyRuleDefinition): TOutput | undefined;
}

export const projectRules = <TOutput>(
  definition: PolicyDefinition,
  projections: PlatformProjection<TOutput>[]
): Record<Platform, TOutput[]> => {
  return projections.reduce<Record<Platform, TOutput[]>>((acc, projection) => {
    acc[projection.platform] = definition.rules
      .map((rule) => projection.project(rule))
      .filter((value): value is TOutput => Boolean(value));
    return acc;
  }, {} as Record<Platform, TOutput[]>);
};
