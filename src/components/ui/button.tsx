import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-[#003366] text-white shadow-sm hover:bg-[#002244] active:bg-[#001830]',
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800',
        outline: 'border border-slate-300 bg-white shadow-sm hover:bg-slate-50 text-slate-700 hover:text-slate-900',
        secondary: 'bg-slate-100 text-slate-800 border border-slate-200 shadow-sm hover:bg-slate-200 active:bg-slate-300',
        ghost: 'hover:bg-slate-100 hover:text-slate-900 text-slate-700',
        link: 'text-[#003366] underline-offset-4 hover:underline',
        emergency: 'bg-[#E65100] text-white shadow-sm hover:bg-[#BF360C] active:bg-[#992B08] font-bold tracking-wide transition-all',
        saffron: 'bg-[#FF9933] text-slate-950 shadow-sm hover:bg-[#F57C00] font-bold',
        success: 'bg-[#138808] text-white shadow-sm hover:bg-[#0E6B06]',
      },
      size: {
        default: 'h-9 px-4 py-2 text-sm',
        sm: 'h-8 rounded px-3 text-xs',
        lg: 'h-10 rounded-md px-5 font-semibold text-sm',
        xl: 'h-11 rounded-md px-6 text-base font-semibold',
        icon: 'h-9 w-9 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
