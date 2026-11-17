'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
// ioiti-ui: reduced motion as IoitiProvider says it too (useReducedMotionConfig), not the system's alone.
import { motion, useReducedMotionConfig } from 'framer-motion';
import { ArrowUp, ChevronRight } from 'lucide-react';
import { isPlainClick } from '../../lib/links.js';
import { Hint } from '../Hint.js';
import { PRESSABLE } from '../../lib/recipes.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';

export interface NavSectionItem {
  id: string;
  label: string;
  index?: string;
  /** ioiti-ui: its address (`#id`): the part is then a link, which can be opened in another tab at its place. */
  href?: string;
}

export interface ScrollProgressNavProps {
  /** Section navigation items */
  sections?: NavSectionItem[];
  /** Threshold in px to morph into floating pill */
  scrollThreshold?: number;
  /** Active section manual override or default */
  activeId?: string;
  /** Position mode: 'fixed' attaches to screen viewport, 'inline'/'sticky' stays within parent container */
  mode?: 'fixed' | 'inline' | 'sticky';
  /** Optional scroll container reference */
  containerRef?: React.RefObject<HTMLElement | null>;
  /** Callback fired when a section is clicked */
  onSectionClick?: (id: string) => void;
  /** Position alignment when mode is 'fixed': 'top-center' | 'bottom-center' | 'top-right' */
  position?: 'top-center' | 'bottom-center' | 'top-right';
  /** Custom class name */
  className?: string;
  /** ioiti-ui: what the nav is called (default 'Table of contents'). */
  label?: string;
}

// ioiti-ui: a part in its container, by its id whatever it is. `#id` is a selector: an id that starts with a digit
// (a heading's anchor, "1-install") or holds a dot threw on every scroll.
function partIn(container: HTMLElement, id: string): HTMLElement | null {
  return container.querySelector<HTMLElement>(`[id="${id.replace(/["\\]/g, '\\$&')}"]`);
}

const defaultSections: NavSectionItem[] = [
  { id: 'overview', index: '01', label: 'Overview' },
  { id: 'features', index: '02', label: 'Features' },
  { id: 'components', index: '03', label: 'Components' },
  { id: 'documentation', index: '04', label: 'Documentation' },
  { id: 'pricing', index: '05', label: 'Pricing' },
];

export const ScrollProgressNav: React.FC<ScrollProgressNavProps> = ({
  sections = defaultSections,
  scrollThreshold = 150,
  activeId: controlledActiveId,
  mode = 'fixed',
  containerRef,
  onSectionClick,
  position = 'top-center',
  className,
  label = 'Table of contents',
}) => {
  const uniqueId = React.useId();
  const reduceMotion = useReducedMotionConfig();
  const rowRef = useRef<HTMLDivElement>(null);
  const [isFloating, setIsFloating] = useState(mode !== 'inline');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>(
    controlledActiveId || sections[0]?.id || ''
  );
  const [isExpanded, setIsExpanded] = useState(false);
  // ioiti-ui: the part clicked, marked until the reader scrolls on their own: one the page can't bring to its top
  // (near its end) was otherwise unmarked as soon as the page moved, for the part above it.
  const clicked = useRef<string | null>(null);

  useEffect(() => {
    if (controlledActiveId) {
      setActiveSection(controlledActiveId);
    }
  }, [controlledActiveId]);

  const handleScroll = useCallback(() => {
    let totalHeight = 0;
    let currentScroll = 0;

    if (containerRef && containerRef.current) {
      const el = containerRef.current;
      totalHeight = el.scrollHeight - el.clientHeight;
      currentScroll = el.scrollTop;
    } else if (mode === 'fixed') {
      totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      currentScroll = window.scrollY;
    }

    if (totalHeight > 0) {
      const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      setScrollProgress(progress);
    }

    if (mode === 'fixed') {
      setIsFloating(currentScroll > scrollThreshold);
    }

    if (!controlledActiveId && clicked.current) {
      setActiveSection(clicked.current);
    } else if (!controlledActiveId) {
      // ioiti-ui: at the end of the page, the last part begun on the screen: the parts near the end never reach the
      // top, and the last one was never marked.
      const atEnd = totalHeight > 0 && currentScroll >= totalHeight - 2;
      if (containerRef && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = partIn(containerRef.current, sections[i].id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top - containerRect.top <= 120 || (atEnd && rect.top < containerRect.bottom)) {
              setActiveSection(sections[i].id);
              break;
            }
          }
        }
      } else if (mode === 'fixed') {
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i].id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.4 || (atEnd && rect.top < window.innerHeight)) {
              setActiveSection(sections[i].id);
              break;
            }
          }
        }
      }
    }
  }, [scrollThreshold, controlledActiveId, sections, containerRef, mode]);

  useEffect(() => {
    const target = containerRef?.current || (mode === 'fixed' ? window : null);
    if (!target) return;
    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    // ioiti-ui: the reader scrolling on their own (wheel, touch, keys, the scroll bar): the part clicked is no longer kept.
    const release = () => {
      clicked.current = null;
    };
    const own = ['wheel', 'touchmove', 'pointerdown'] as const;
    own.forEach((type) => target.addEventListener(type, release, { passive: true }));
    window.addEventListener('keydown', release);
    return () => {
      target.removeEventListener('scroll', handleScroll);
      own.forEach((type) => target.removeEventListener(type, release));
      window.removeEventListener('keydown', release);
    };
  }, [handleScroll, containerRef, mode]);

  const scrollToSection = (id: string) => {
    clicked.current = id;
    setActiveSection(id);
    onSectionClick?.(id);
    // ioiti-ui: brought into view, its scroll-margin-top keeping it clear of a sticky nav (20 px put the part's
    // heading under it); at once when motion is reduced. In its container, that alone scrolls: scrollIntoView moved
    // every box around it too, the page jumping under a nav drawn in a part of it.
    const behavior = reduceMotion ? 'auto' : 'smooth';
    const container = containerRef?.current;
    const part = container ? partIn(container, id) : document.getElementById(id);
    if (container && part) {
      const margin = parseFloat(getComputedStyle(part).scrollMarginTop) || 0;
      const top =
        container.scrollTop + part.getBoundingClientRect().top - container.getBoundingClientRect().top - container.clientTop - margin;
      container.scrollTo?.({ top, behavior });
    } else {
      part?.scrollIntoView?.({ behavior, block: 'start' });
    }
    setIsExpanded(false);
  };

  // ioiti-ui: a part with an address is a link. A plain click scrolls to it here and puts it in the address, in place
  // (no step more to go back through); with ⌘, Ctrl, Shift or Alt the browser has it (another tab, at its place).
  const followSection = (event: React.MouseEvent, section: NavSectionItem) => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    scrollToSection(section.id);
    if (section.href) window.history.replaceState(window.history.state, '', section.href);
  };

  // ioiti-ui: from a tablet up the parts are a row that scrolls sideways when wider than the page: the current one kept in it.
  useEffect(() => {
    const row = rowRef.current;
    const current = row?.querySelector<HTMLElement>('[aria-current]');
    if (!row || !current) return;
    const box = row.getBoundingClientRect();
    const item = current.getBoundingClientRect();
    if (item.left < box.left) row.scrollLeft -= box.left - item.left + 8;
    else if (item.right > box.right) row.scrollLeft += item.right - box.right + 8;
  }, [activeSection]);

  const scrollToTop = () => {
    clicked.current = null;
    const behavior = reduceMotion ? 'auto' : 'smooth';
    if (containerRef && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  };

  const currentActiveItem = sections.find((s) => s.id === activeSection) || sections[0];

  const positionClasses = {
    'top-center': 'top-6 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
    'top-right': 'top-6 right-6',
  };

  const wrapperClass =
    mode === 'fixed'
      ? cn('fixed z-40 max-w-[95vw]', positionClasses[position])
      : mode === 'sticky'
      ? 'sticky top-3 z-20 w-fit max-w-full mx-auto'
      : 'relative w-fit max-w-full mx-auto';

  return (
    <div
      className={cn(
        'font-sans select-none',
        wrapperClass,
        className
      )}
    >
      <motion.nav
        layout
        transition={motionTransitions.springMorph}
        className={cn(
          // ioiti-ui: glass under the glass material (glass-float). Not the phone's menu inside it: its blur would see
          // nothing but this pill.
          // ioiti-ui: what floats, its shadow the design's (shadow-elevated, its own hairline in it: the ring once
          // drawn while it floated said it again).
          'relative max-w-full rounded-full border border-border bg-surface/95 backdrop-blur-md shadow-elevated p-1 flex items-center gap-1 glass-float'
        )}
        role="navigation"
        aria-label={label}
      >
        {/* Ambient progress line */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div
            // ioiti-ui: the progress, the part shown and its pill in the accent, where the theme has one (accent:).
            className="h-[1.5px] bg-foreground accent:bg-brand absolute top-0 left-0 transition-[width] duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Floating compact indicator (mobile or compact state) */}
        <div className="flex md:hidden items-center px-2 py-1 gap-2">
          <span aria-hidden="true" className="text-[11px] font-mono text-muted-foreground">{currentActiveItem?.index}</span>
          <span className="text-sm font-medium text-foreground">{currentActiveItem?.label}</span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn('p-1 rounded-full text-muted-foreground hover:text-foreground transition', PRESSABLE)}
            aria-label="Toggle section menu"
            aria-expanded={isExpanded}
          >
            <ChevronRight className={cn('size-3.5 motion-safe:transition-transform duration-200 ease-fast', isExpanded && 'rotate-90')} />
          </button>
        </div>

        {/* Full navigation buttons (Desktop / Expanded) */}
        {/* ioiti-ui: from a tablet up, a row that scrolls sideways (room kept above and below for the focus ring);
            the phone's menu centred under the pill, as wide as its longest part. */}
        <div
          ref={rowRef}
          className={cn(
            'hidden md:flex items-center gap-0.5 min-w-0 md:-mx-1 md:-my-1 md:px-1 md:py-1 md:overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            isExpanded ? '!flex flex-col md:flex-row absolute top-12 left-1/2 -translate-x-1/2 w-max max-w-[calc(100vw-2rem)] p-2 rounded-xl bg-surface border border-border shadow-elevated md:relative md:top-auto md:left-auto md:translate-x-0 md:w-auto md:max-w-none md:p-0 md:bg-transparent md:border-none md:shadow-none' : ''
          )}
        >
          {sections.map((section, idx) => {
            const isActive = activeSection === section.id;
            const indexStr = section.index || `0${idx + 1}`;
            const Item: React.ElementType = section.href !== undefined ? 'a' : 'button';

            return (
              <Item
                key={section.id}
                {...(section.href !== undefined
                  ? { href: section.href, onClick: (event: React.MouseEvent) => followSection(event, section) }
                  : { type: 'button', onClick: () => scrollToSection(section.id) })}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'relative shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus-ring inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer',
                  isActive ? 'text-foreground accent:text-brand-text' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId={`active-scroll-pill-${uniqueId}`}
                    transition={motionTransitions.springMorph}
                    className="absolute inset-0 rounded-full bg-surface-hover border border-border z-0 shadow-subtle accent:bg-brand-soft accent:border-brand/30"
                  />
                )}
                {/* ioiti-ui: the number orders the parts for the eye; a screen reader says the part's name alone. */}
                <span aria-hidden="true" className={cn('text-[11px] font-mono relative z-10', isActive ? 'text-foreground/80 accent:text-brand-text' : 'text-muted-foreground')}>
                  {indexStr}
                </span>
                <span className="relative z-10">{section.label}</span>
              </Item>
            );
          })}
        </div>

        {/* Scroll To Top Action */}
        {/* ioiti-ui: what it does in a Hint, shown on hover, keyboard focus and a tap, where a title shows on none. */}
        {isFloating && (
          <Hint content="Back to the top">
            <button
              type="button"
              onClick={scrollToTop}
              className={cn(
                'size-6 rounded-full bg-surface-raised hover:bg-surface border border-border hover:border-border-hover flex items-center justify-center text-muted-foreground hover:text-foreground transition focus-ring shrink-0 ml-0.5',
                PRESSABLE
              )}
              aria-label="Back to the top"
            >
              <ArrowUp className="size-3" />
            </button>
          </Hint>
        )}
      </motion.nav>
    </div>
  );
};
