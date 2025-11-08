'use client';

import React from 'react';
import { scaleLinear } from 'd3-scale';
import { SurfaceCard } from '@sentinel-au/ui-kit';

const hours = Array.from({ length: 24 }, (_, idx) => idx);
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const demoMatrix = days.map((_, dayIndex) =>
  hours.map((hour) =>
    Math.max(0, Math.round(60 - Math.abs(12 - hour) * 5 - dayIndex * 2)) + (dayIndex >= 5 ? 10 : 0)
  )
);

const colorScale = scaleLinear<string>().domain([0, 60]).range(['#d8f0e8', '#2d846f']);

export function ActivityHeatmap() {
  return (
    <SurfaceCard>
      <h3 className="text-lg font-semibold text-brand-700">Weekly activity heatmap</h3>
      <p className="mt-1 text-xs text-brand-500">
        Synthetic telemetry illustrating how Sentinel AU visualises app and web events. Darker tones indicate more
        managed activity during that hour.
      </p>
      <div className="mt-4 grid grid-cols-[auto,repeat(24,minmax(0,1fr))] gap-1">
        <div />
        {hours.map((hour) => (
          <div key={hour} className="text-center text-[10px] text-brand-500">
            {hour}
          </div>
        ))}
        {demoMatrix.map((row, rowIndex) => (
          <React.Fragment key={days[rowIndex]}>
            <div className="pr-2 text-right text-xs text-brand-500">{days[rowIndex]}</div>
            {row.map((value, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="h-6 rounded"
                style={{
                  backgroundColor: colorScale(value),
                  opacity: value === 0 ? 0.1 : 1
                }}
                aria-label={`${value} minutes on ${days[rowIndex]} at ${colIndex}:00`}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </SurfaceCard>
  );
}
