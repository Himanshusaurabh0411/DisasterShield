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
  red: 'text-rose-600 bg-rose-50 border-rose-100',
  orange: 'text-orange-600 bg-orange-50 border-orange-100',
  yellow: 'text-amber-600 bg-amber-50 border-amber-100',
  green: 'text-emerald-700 bg-emerald-50 border-emerald-100',
  blue: 'text-[#003366] bg-blue-50 border-blue-100',
  purple: 'text-purple-700 bg-purple-50 border-purple-100',
};

export function StatCard({ label, value, icon: Icon, trend, trendUp, color = 'blue', className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl border border-slate-200/90 bg-white p-5 flex flex-col justify-between gap-3 shadow-xs hover:shadow-md transition-all',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border', colorMap[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
        {trend && (
          <p className={cn('text-xs mt-1.5 font-semibold flex items-center gap-1', trendUp ? 'text-rose-600' : 'text-emerald-700')}>
            <span>{trend}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
