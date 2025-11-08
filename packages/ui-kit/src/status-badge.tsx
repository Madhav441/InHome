import clsx from 'clsx';
import type { ReactNode } from 'react';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info';

const toneClasses: Record<StatusTone, string> = {
  success: 'bg-brand-100 text-brand-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-rose-100 text-rose-700',
  info: 'bg-blue-100 text-blue-700'
};

export interface StatusBadgeProps {
  tone?: StatusTone;
  children: ReactNode;
  className?: string;
}

export function StatusBadge({ tone = 'info', children, className }: StatusBadgeProps) {
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium', toneClasses[tone], className)}>
      {children}
    </span>
  );
}
