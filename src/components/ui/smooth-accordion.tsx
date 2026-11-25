'use client';

import React, { useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
// ioiti-ui: held by its caller or by itself, as every control (useControllableState); a former name said once, in
// development (deprecated).
import { useControllableState } from '../../lib/controllable.js';
import { deprecated } from '../../lib/deprecated.js';
// ioiti-ui: EasyUI's name kept until 1.0, drawing this one (renamed).
import { renamed } from '../../lib/renamed.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';

export interface AccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

// ioiti-ui: named after its role, `Accordion` (EasyUI's `SmoothAccordion`, its former name: at the end of the file).
export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  /** ioiti-ui: the ids of the items open, held by the page (told of each change by `onChange`). */
  value?: string[];
  /** ioiti-ui: the ids of the items open at first, the accordion holding them then; none by default. */
  defaultValue?: string[];
  /** ioiti-ui: told of the ids of the items open, at each opening and closing. */
  onChange?: (value: string[]) => void;
  /** @deprecated Use `defaultValue`. Removed in 1.0. */
  defaultOpen?: string[];
  /**
   * ioiti-ui: each question in a heading of this level, which a screen reader lists with the page's own (none by
   * default); drawn as without it.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  value,
  defaultValue,
  onChange,
  defaultOpen,
  headingLevel,
  className,
}) => {
  // ioiti-ui: `value`, `defaultValue` and `onChange`, as every control; `defaultOpen`, the former name of
  // `defaultValue`, read where it alone is given.
  if (defaultOpen !== undefined) deprecated('smooth-accordion-default-open', 'Accordion');
  const [openIds, setOpenIds] = useControllableState<string[]>(value, defaultValue ?? defaultOpen ?? [], onChange);
  // ioiti-ui: the ids that tie each question to its answer (aria-controls, aria-labelledby).
  const baseId = useId();
  const Heading = headingLevel ? (`h${headingLevel}` as const) : null;

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds(openIds.includes(id) ? openIds.filter((item) => item !== id) : [...openIds, id]);
    } else {
      setOpenIds(openIds.includes(id) ? [] : [id]);
    }
  };

  return (
    // ioiti-ui: glass under the glass material, as a card (glass-card).
    <div className={cn('flex flex-col divide-y divide-border rounded-xl border border-border bg-surface overflow-hidden glass-card', className)}>
      {items.map((item, index) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = `${baseId}-${index}-question`;
        const panelId = `${baseId}-${index}-answer`;
        // ioiti-ui: a button that submits no form it is in; it says which answer it opens (aria-controls, while it is
        // there).
        const question = (
          <button
            type="button"
            id={buttonId}
            onClick={() => toggle(item.id)}
            className="flex w-full items-center justify-between p-4 text-left font-medium text-foreground hover:bg-surface-hover transition-colors focus-ring cursor-pointer"
            aria-expanded={isOpen}
            aria-controls={isOpen ? panelId : undefined}
          >
            <div>
              <div className="text-sm font-medium text-foreground">{item.title}</div>
              {item.subtitle && (
                <div className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</div>
              )}
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={motionTransitions.easeFast}
              className="text-muted-foreground ml-2 shrink-0"
            >
              <ChevronDown className="size-4" />
            </motion.div>
          </button>
        );
        return (
          <div key={item.id} className="transition-colors">
            {/* ioiti-ui: in a heading when one is asked for, its letter-spacing the page's (a heading's own is tighter). */}
            {Heading ? <Heading className="tracking-[inherit]">{question}</Heading> : question}

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  // ioiti-ui: the answer, a region named by its question.
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0, transition: motionTransitions.easeExit }}
                  transition={motionTransitions.springGentle}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

// ioiti-ui: EasyUI's names, until 1.0: the former name draws the accordion, and says once, in development, that it is
// deprecated (renamed).
/** @deprecated Use `Accordion`. Removed in 1.0. */
export const SmoothAccordion = renamed(Accordion, 'SmoothAccordion');
/** @deprecated Use `AccordionProps`. Removed in 1.0. */
export type SmoothAccordionProps = AccordionProps;
