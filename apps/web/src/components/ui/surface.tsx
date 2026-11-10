import type { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* ---------------------------------------------------------------- surfaces */

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Adds the floating shadow + hover lift used by cards. */
  float?: boolean;
  clip?: boolean;
}

export function GlassPanel({ children, className, float = true, clip = true, ...rest }: GlassPanelProps) {
  return (
    <div
      className={cn(
        'vl-glass relative',
        clip && 'overflow-hidden',
        float ? 'rounded-4xl shadow-float' : 'rounded-3xl',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ badges */

const badgeStyles = cva(
  'inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-[11px] font-medium leading-none tracking-[0.01em] whitespace-nowrap',
  {
    variants: {
      tone: {
        glass: 'border-white/12 bg-white/[0.06] text-fg/75 backdrop-blur-md',
        violet: 'border-violet/35 bg-violet/15 text-violet-soft',
        coral: 'border-coral/35 bg-coral/15 text-coral',
        aqua: 'border-aqua/35 bg-aqua/15 text-aqua',
        amber: 'border-amber/35 bg-amber/15 text-amber',
        solid: 'border-transparent bg-fg text-bg',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-3 py-1.5 text-[11px]',
      },
    },
    defaultVariants: { tone: 'glass', size: 'md' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeStyles> {
  dot?: boolean;
}

export function Badge({ className, tone, size, dot = false, children, ...rest }: BadgeProps) {
  return (
    <span className={cn(badgeStyles({ tone, size }), className)} {...rest}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" aria-hidden />}
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- headings */

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  id,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-5',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <span className="vl-eyebrow">
        <span className="h-px w-6 bg-current opacity-50" aria-hidden />
        {eyebrow}
      </span>
      <h2
        id={id}
        className={cn(
          'max-w-4xl font-display text-display-sm text-balance text-fg sm:text-display-md',
          align === 'center' && 'mx-auto',
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn('max-w-prose text-pretty text-base leading-relaxed text-muted', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      )}
    </header>
  );
}

/* ----------------------------------------------------------------- accents */

/** Thin gradient rule used to separate editorial blocks. */
export function Hairline({ className }: { className?: string }) {
  return <div className={cn('vl-hairline h-px w-full', className)} aria-hidden />;
}
