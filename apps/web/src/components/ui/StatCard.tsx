import * as React from 'react';
import { classNames } from '@fonebox/utils';

export const StatCard = ({
  title,
  value,
  description,
  icon,
  trend,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
}) => {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/80">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-semibold text-muted-foreground">{title}</h3>
        {icon && <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex flex-col">
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            {trend && (
              <span className={classNames(trend.isPositive ? 'text-success' : 'text-destructive', 'font-medium')}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
