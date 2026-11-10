import { ArrowUpRight } from 'lucide-react';
import { Magnetic } from '@/components/ui/motion';
import { buttonStyles } from '@/components/ui/button';
import { navLinks } from '@/lib/content/landing';

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="vl-shell flex items-center justify-between gap-4 py-4">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="VELORA home">
          <span className="relative grid h-9 w-9 place-items-center rounded-2xl bg-[conic-gradient(from_140deg,#4B2BFF,#7C5CFF,#FF3D6E,#35E7D2,#4B2BFF)] p-[1.5px] transition-transform duration-500 ease-smooth group-hover:rotate-90">
            <span className="grid h-full w-full place-items-center rounded-[0.85rem] bg-ink">
              <span className="bg-gradient-to-br from-violet-soft via-fg to-aqua bg-clip-text font-display text-sm font-semibold text-transparent">
                V
              </span>
            </span>
          </span>
          <span className="font-display text-[15px] font-medium tracking-[0.2em] text-fg">VELORA</span>
        </a>

        <nav
          aria-label="Sections"
          className="hidden items-center gap-0.5 rounded-pill border border-white/8 bg-white/[0.035] px-1.5 py-1.5 backdrop-blur-xl lg:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-pill px-3.5 py-1.5 text-xs text-muted transition-colors duration-300 hover:bg-white/5 hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#studio"
            className="hidden rounded-pill px-3 py-2 text-xs text-muted transition-colors hover:text-fg sm:block"
          >
            Sign in
          </a>
          <Magnetic
            href="#waitlist"
            strength={0.18}
            className={buttonStyles({ tone: 'primary', size: 'sm' })}
          >
            Get early access
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
