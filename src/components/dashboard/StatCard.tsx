import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';
  className?: string;
}

const colorMap = {
  red: 'text-rose-700 bg-rose-50 border-rose-200',
  orange: 'text-amber-700 bg-amber-50 border-amber-200',
  yellow: 'text-amber-800 bg-yellow-50 border-yellow-200',
  green: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  blue: 'text-[#003366] bg-blue-50 border-blue-200',
  purple: 'text-indigo-800 bg-indigo-50 border-indigo-200',
};

export function StatCard({ label, value, icon: Icon, trend, trendUp, color = 'blue', className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-md border border-slate-200 bg-white p-5 flex flex-col justify-between gap-3 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</p>
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md border', colorMap[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
        {trend && (
          <p className={cn('text-xs mt-1 font-semibold flex items-center gap-1', trendUp ? 'text-rose-600' : 'text-emerald-700')}>
            <span>{trend}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
