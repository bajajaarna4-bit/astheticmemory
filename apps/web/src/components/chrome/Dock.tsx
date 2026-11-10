'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, LineChart, Moon, Sparkles, Sun, Timer, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { id: 'loop', label: 'The loop', href: '#loop', icon: Sparkles },
  { id: 'discover', label: 'Discover', href: '#discover', icon: Compass },
  { id: 'quick', label: 'Ten min', href: '#quick', icon: Timer },
  { id: 'marketplace', label: 'Shop', href: '#marketplace', icon: ShoppingBag },
  { id: 'studio', label: 'Studio', href: '#studio', icon: LineChart },
];

const THEME_KEY = 'vl:theme';

/**
 * Floating pill dock - the app's primary navigation, present on every screen.
 * Theme preference lives here because the dock is always mounted.
 */
export function Dock() {
  const [active, setActive] = useState('loop');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (localStorage.getItem(THEME_KEY) === 'light') {
      setTheme('light');
      document.documentElement.dataset.theme = 'light';
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'light') {
      document.documentElement.dataset.theme = 'light';
    } else {
      delete document.documentElement.dataset.theme;
    }
    localStorage.setItem(THEME_KEY, next);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6">
      <nav
        aria-label="Primary"
        className="vl-glass pointer-events-auto flex items-center gap-0.5 rounded-pill p-1.5 shadow-float sm:gap-1 sm:p-2"
      >
        {items.map(({ id, label, href, icon: Icon }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={href}
              onClick={() => setActive(id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group relative flex items-center gap-2 rounded-pill px-3 py-2.5 text-[12px] font-medium transition-colors duration-300 sm:px-3.5',
                isActive ? 'text-fg' : 'text-muted hover:text-fg',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="dock-pill"
                  className="absolute inset-0 rounded-pill bg-white/10 ring-1 ring-inset ring-white/10"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon
                className="relative z-10 h-[18px] w-[18px]"
                strokeWidth={1.6}
                aria-hidden
              />
              <span className="relative z-10 hidden md:inline">{label}</span>
            </a>
          );
        })}

        <span className="mx-1 h-6 w-px bg-white/10" aria-hidden />

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="flex items-center rounded-pill p-2.5 text-muted transition-colors hover:text-fg"
        >
          {theme === 'dark' ? (
            <Sun className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
          ) : (
            <Moon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
          )}
        </button>
      </nav>
    </div>
  );
}
