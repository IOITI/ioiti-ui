'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';

export interface AccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export interface SmoothAccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

export const SmoothAccordion: React.FC<SmoothAccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpen);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    // ioiti-ui: glass under the glass material, as a card (glass-card).
    <div className={cn('flex flex-col divide-y divide-border rounded-xl border border-border bg-surface overflow-hidden glass-card', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="transition-colors">
            <button
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between p-4 text-left font-medium text-foreground hover:bg-surface-hover transition-colors focus-ring cursor-pointer"
              aria-expanded={isOpen}
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

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
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
