import { cn } from '@/lib/utils';

/**
 * Ambient light rig for a section: three soft gradient bodies, a fading grid and
 * film grain. All pure CSS (no blur filters) so it costs nothing at runtime.
 */
export function Atmosphere({
  className,
  variant = 'quiet',
}: {
  className?: string;
  variant?: 'quiet' | 'warm' | 'cool';
}) {
  const blobs: [string, string, string] =
    variant === 'warm'
      ? ['rgb(255 107 107 / 0.20)', 'rgb(255 196 110 / 0.14)', 'rgb(124 92 255 / 0.18)']
      : variant === 'cool'
        ? ['rgb(53 231 210 / 0.16)', 'rgb(124 92 255 / 0.22)', 'rgb(255 61 110 / 0.12)']
        : ['rgb(124 92 255 / 0.20)', 'rgb(53 231 210 / 0.13)', 'rgb(255 107 107 / 0.13)'];

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{ opacity: 'var(--vl-aurora-opacity)' }}
    >
      <div
        className="absolute -left-[18%] -top-[28%] h-[42rem] w-[42rem] rounded-full animate-breathe"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${blobs[0]} 0%, transparent 64%)`,
        }}
      />
      <div
        className="absolute -right-[16%] top-[6%] h-[34rem] w-[34rem] rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${blobs[1]} 0%, transparent 66%)`,
          animation: 'breathe 9s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute bottom-[-24%] left-[24%] h-[38rem] w-[38rem] rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${blobs[2]} 0%, transparent 68%)`,
          animation: 'breathe 12s ease-in-out infinite',
        }}
      />
      <div className="vl-grid-lines vl-mask-fade-b absolute inset-0 opacity-40" />
    </div>
  );
}
