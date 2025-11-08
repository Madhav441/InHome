import { z } from 'zod';

export type DecisionOutcome = 'allow' | 'block' | 'warn';

const policySchema = z.object({
  version: z.string(),
  categories: z.record(z.enum(['allow', 'block', 'warn', 'managed'])),
  schedules: z.record(
    z.object({
      startsAt: z.string(),
      endsAt: z.string()
    })
  ).optional()
});

export type PolicyBundle = z.infer<typeof policySchema>;

export interface DecisionContext {
  category: string;
  timestamp: Date;
  scheduleHint?: string;
}

export interface DecisionResult {
  outcome: DecisionOutcome;
  reason: string;
}

export function evaluatePolicy(bundle: PolicyBundle, ctx: DecisionContext): DecisionResult {
  const parsed = policySchema.parse(bundle);
  const categoryKey = Object.keys(parsed.categories).find((key) => key.toLowerCase() === ctx.category.toLowerCase());
  if (!categoryKey) {
    return { outcome: 'allow', reason: 'Category not configured' };
  }
  const state = parsed.categories[categoryKey];
  switch (state) {
    case 'block':
      return { outcome: 'block', reason: `Category ${categoryKey} blocked by guardian` };
    case 'warn':
    case 'managed':
      return { outcome: 'warn', reason: `Guardian review required for ${categoryKey}` };
    default:
      break;
  }

  if (parsed.schedules && ctx.scheduleHint && parsed.schedules[ctx.scheduleHint]) {
    const schedule = parsed.schedules[ctx.scheduleHint];
    const [startHour, startMinute] = schedule.startsAt.split(':').map(Number);
    const [endHour, endMinute] = schedule.endsAt.split(':').map(Number);
    const nowMinutes = ctx.timestamp.getHours() * 60 + ctx.timestamp.getMinutes();
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    if (nowMinutes < startMinutes || nowMinutes > endMinutes) {
      return { outcome: 'warn', reason: `Outside allowed schedule ${ctx.scheduleHint}` };
    }
  }

  return { outcome: 'allow', reason: `Category ${categoryKey} permitted` };
}

export function signBundle(bundle: PolicyBundle) {
  const payload = JSON.stringify(policySchema.parse(bundle));
  return {
    bundle: payload,
    signature: 'demo-signature'
  };
}
