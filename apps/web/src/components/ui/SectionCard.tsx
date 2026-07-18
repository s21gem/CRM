import * as React from 'react';
import { classNames } from '@fonebox/utils';

export const SectionCard = ({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={classNames('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>
      {(title || description) && (
        <div className="flex flex-col space-y-1.5 p-6 pb-4">
          {title && <h3 className="font-semibold leading-none tracking-tight">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className={classNames('p-6 pt-0', !title && !description && 'pt-6')}>
        {children}
      </div>
    </div>
  );
};
