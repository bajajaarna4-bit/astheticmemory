import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonStyles = cva(
  [
    'group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden',
    'rounded-pill font-medium tracking-[-0.01em]',
    'transition-[transform,box-shadow,background-color,color] duration-300 ease-smooth',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua',
    'disabled:pointer-events-none disabled:opacity-45',
  ],
  {
    variants: {
      tone: {
        primary: 'bg-fg text-bg shadow-lift hover:shadow-glow-violet',
        accent:
          'text-white shadow-glow-violet bg-[linear-gradient(112deg,#4B2BFF_0%,#7C5CFF_45%,#FF3D6E_100%)] hover:shadow-[0_30px_80px_-20px_rgb(124_92_255/0.75)]',
        glass: 'vl-glass text-fg hover:bg-white/[0.07]',
        ghost: 'text-fg/75 hover:bg-white/[0.05] hover:text-fg',
      },
      size: {
        sm: 'h-9 px-4 text-[13px]',
        md: 'h-11 px-5 text-sm',
        lg: 'h-14 px-7 text-[15px]',
      },
      block: { true: 'w-full', false: '' },
    },
    defaultVariants: { tone: 'primary', size: 'md', block: false },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  children: ReactNode;
  /** Renders a moving sheen across the button on hover. */
  sheen?: boolean;
}

export function Button({ className, tone, size, block, sheen = true, children, ...rest }: ButtonProps) {
  return (
    <button className={cn(buttonStyles({ tone, size, block }), className)} {...rest}>
      {sheen && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-sheen opacity-0 transition-[transform,opacity] duration-700 ease-smooth group-hover:translate-x-full group-hover:opacity-100"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
