import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="space-y-4">
          {icon && (
            <div className="flex justify-center">
              {icon}
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-600 max-w-sm mx-auto">{description}</p>
          </div>

          {(action || secondaryAction) && (
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {action && (
                <Button onClick={action.onClick}>
                  {action.label}
                </Button>
              )}
              {secondaryAction && (
                <Button variant="outline" onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
