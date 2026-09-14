import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Loader2 } from 'lucide-react';
import { trackingStages, getStageIndex } from '@/services/mockReports';
import { cn } from '@/lib/utils';

interface Props {
  currentStatus: string;
}

export function ReportTimeline({ currentStatus }: Props) {
  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="relative">
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />
      <div className="space-y-6">
        {trackingStages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative flex items-start gap-4"
            >
              {/* Icon */}
              <div
                className={cn(
                  'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                  isCompleted && 'border-emerald-600 bg-emerald-50',
                  isCurrent && 'border-[#003366] bg-blue-50 ring-2 ring-blue-200',
                  isPending && 'border-slate-300 bg-white'
                )}
              >
                {isCompleted && <Check className="h-4 w-4 text-emerald-700 stroke-[2.5]" />}
                {isCurrent && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="h-4 w-4 text-[#003366]" />
                  </motion.div>
                )}
                {isPending && <Circle className="h-2.5 w-2.5 text-slate-400" />}
              </div>

              {/* Content */}
              <div className="pt-0.5">
                <p
                  className={cn(
                    'text-sm font-bold',
                    isCompleted ? 'text-emerald-900' : isCurrent ? 'text-[#003366]' : 'text-slate-500'
                  )}
                >
                  {stage.label}
                </p>
                <p
                  className={cn(
                    'text-xs mt-0.5 leading-relaxed',
                    isPending ? 'text-slate-400' : 'text-slate-600'
                  )}
                >
                  {stage.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
