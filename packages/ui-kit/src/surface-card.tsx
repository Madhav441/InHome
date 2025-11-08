import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

export type SurfaceCardProps = PropsWithChildren<{ className?: string; padded?: boolean }>;

export function SurfaceCard({ children, className, padded = true }: SurfaceCardProps) {
  return (
    <section
      className={clsx('rounded-lg border border-brand-100 bg-white shadow-sm', className, {
        'p-6': padded
      })}
    >
      {children}
    </section>
  );
}
