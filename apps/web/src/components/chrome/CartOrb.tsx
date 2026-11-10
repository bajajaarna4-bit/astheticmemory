'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Minus, Plus, ShoppingBag, Timer, X } from 'lucide-react';
import { ProductArt } from '@/components/art/ProductArt';
import { Button } from '@/components/ui/button';
import { quickItems } from '@/lib/content/landing';
import { formatPrice } from '@/lib/utils';

/**
 * The floating cart orb. It is the single persistent commerce affordance:
 * it carries the line-item count, expands into a drawer, and (Phase 5) doubles
 * as the live-delivery status puck once an order is in flight.
 */
export function CartOrb() {
  const [open, setOpen] = useState(false);
  const lines = quickItems.slice(0, 2);
  const subtotal = lines.reduce((sum, line) => sum + line.price, 0);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <div className="fixed bottom-24 right-4 z-[45] sm:bottom-8 sm:right-6">
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open cart, ${lines.length} items`}
          aria-expanded={open}
          aria-controls="cart-drawer"
          initial={{ scale: 0, rotate: -25, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ delay: 0.9, type: 'spring', stiffness: 220, damping: 18 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="group relative flex h-16 w-16 items-center justify-center rounded-full"
        >
          <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_140deg,#4B2BFF,#7C5CFF,#FF3D6E,#35E7D2,#4B2BFF)] opacity-90 blur-[2px] transition-opacity group-hover:opacity-100" />
          <span className="absolute inset-[2px] rounded-full bg-ink/85 backdrop-blur-xl" />
          <ShoppingBag className="relative z-10 h-6 w-6 text-fg" strokeWidth={1.6} aria-hidden />
          <span className="absolute -right-0.5 -top-0.5 z-10 flex h-6 min-w-6 items-center justify-center rounded-full bg-aqua px-1.5 text-[11px] font-semibold text-ink">
            {lines.length}
          </span>
          <span className="absolute inset-0 -z-10 rounded-full bg-violet/40 animate-pulse-ring" aria-hidden />
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60]">
            <motion.div
              className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              id="cart-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Your cart"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 32 }}
              className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink-soft/95 backdrop-blur-2xl"
            >
              <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Cart</p>
                  <h2 className="mt-1 font-display text-xl text-fg">Two things you loved</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close cart"
                  className="rounded-full p-2 text-muted transition-colors hover:bg-white/5 hover:text-fg"
                >
                  <X className="h-5 w-5" strokeWidth={1.6} aria-hidden />
                </button>
              </header>

              <div className="flex items-center gap-3 border-b border-white/10 bg-aqua/[0.07] px-6 py-3 text-aqua">
                <Timer className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                <p className="text-xs">
                  Both items sit in <span className="font-medium">Indiranagar dark store</span> · delivery in
                  9–11 min
                </p>
              </div>

              <ul className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
                {lines.map((line) => (
                  <li key={line.id} className="flex gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-3">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                      <ProductArt shape={line.shape} accent={line.accent} label={line.name} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <p className="truncate text-sm font-medium text-fg">{line.name}</p>
                        <p className="text-xs text-muted">{line.unit}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-pill border border-white/10 px-1">
                          <button
                            type="button"
                            aria-label={`Remove one ${line.name}`}
                            className="rounded-full p-1 text-muted hover:text-fg"
                          >
                            <Minus className="h-3 w-3" aria-hidden />
                          </button>
                          <span className="w-4 text-center text-xs tabular-nums text-fg">1</span>
                          <button
                            type="button"
                            aria-label={`Add one ${line.name}`}
                            className="rounded-full p-1 text-muted hover:text-fg"
                          >
                            <Plus className="h-3 w-3" aria-hidden />
                          </button>
                        </div>
                        <span className="text-sm text-fg">{formatPrice(line.price)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <footer className="space-y-4 border-t border-white/10 px-6 py-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="tabular-nums text-fg">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Delivery</span>
                  <span className="text-aqua">Free over {formatPrice(29900)}</span>
                </div>
                <Button tone="accent" size="lg" block disabled>
                  Checkout · Phase 4
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Button>
                <p className="text-center text-[11px] leading-relaxed text-muted">
                  Payments, addresses and order placement ship with the marketplace module.
                  This drawer is wired to the same cart contract Phase 4 will use.
                </p>
              </footer>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
