import React from 'react';
import { PriorityLevel } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  priority: PriorityLevel;
  className?: string;
}

const variants: Record<PriorityLevel, 'critical' | 'high' | 'medium' | 'low'> = {
  critical: 'critical',
  high: 'high',
  medium: 'medium',
  low: 'low',
};

export function PriorityBadge({ priority, className }: Props) {
  return (
    <Badge variant={variants[priority]} className={cn('uppercase font-bold tracking-wider text-[10px]', className)}>
      {priority}
    </Badge>
  );
}
