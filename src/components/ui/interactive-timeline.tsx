'use client';

import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, AlertCircle, AlertTriangle, Loader2, GitCommit, Copy, CheckCheck, ChevronDown } from 'lucide-react';
import { cn, copyToClipboard } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { PRESSABLE } from '../../lib/recipes.js';
import { Hint } from '../Hint.js';

// ioiti-ui: `warning`, a step that went on but not as it should (amber).
export type TimelineStatus = 'completed' | 'in-progress' | 'pending' | 'failed' | 'warning';

export interface TimelineMetric {
  label: string;
  value: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  timestamp: string;
  status: TimelineStatus;
  /** ioiti-ui: the words of the status badge. Without them there is no badge: the title says the step. */
  statusLabel?: string;
  description?: string;
  tag?: string;
  commitHash?: string;
  metrics?: TimelineMetric[];
  author?: {
    name: string;
    role?: string;
  };
}

export interface InteractiveTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
  defaultSelectedId?: string;
  /** ioiti-ui: the items open at first (EasyUI opens the selected one alone). */
  defaultExpandedIds?: string[];
  /** ioiti-ui: what the list of items is called (whose moments they are). */
  label?: string;
  onItemSelect?: (item: TimelineItem) => void;
  className?: string;
  collapsible?: boolean;
}

/** ioiti-ui: an item with nothing more than its title and time has no fold. */
function hasDetails(item: TimelineItem): boolean {
  return Boolean(item.description || item.metrics?.length || item.author || item.commitHash);
}

export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
  items = [],
  defaultSelectedId,
  defaultExpandedIds,
  label,
  onItemSelect,
  className,
  collapsible = true,
  ...props
}) => {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    defaultSelectedId || items[0]?.id
  );
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(defaultExpandedIds ?? (defaultSelectedId ? [defaultSelectedId] : items.length > 0 ? [items[0].id] : []))
  );
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const listId = useId();

  const handleToggleExpand = (item: TimelineItem) => {
    setSelectedId(item.id);
    onItemSelect?.(item);

    if (!collapsible || !hasDetails(item)) return;

    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });
  };

  const handleCopyHash = (e: React.MouseEvent, hash: string) => {
    e.stopPropagation();
    copyToClipboard(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // ioiti-ui: each colour has a light value in front of EasyUI's own, kept behind `dark:`. What is done and
  // under way is in the accent's colour, where the theme has one (accent:), in place of EasyUI's blue.
  const getStatusIcon = (status: TimelineStatus) => {
    switch (status) {
      case 'completed':
        return <Check className="size-3.5 text-accent-blue dark:text-foreground accent:text-brand-text" />;
      case 'in-progress':
        return <Loader2 className="size-3.5 text-accent-blue dark:text-foreground accent:text-brand-text animate-spin" />;
      case 'failed':
        return <AlertCircle className="size-3.5 text-negative" />;
      case 'warning':
        return <AlertTriangle className="size-3.5 text-warning" />;
      case 'pending':
      default:
        return <Clock className="size-3.5 text-muted-foreground" />;
    }
  };

  const getStatusBadgeStyle = (status: TimelineStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-muted text-text-secondary border-border';
      case 'in-progress':
        return 'bg-info/5 text-info border-info/30 dark:bg-info/10 accent:bg-brand-soft accent:text-brand-text accent:border-brand/30';
      case 'failed':
        return 'bg-negative/5 text-negative border-negative/30 dark:bg-negative/10';
      case 'warning':
        return 'bg-warning/5 text-warning border-warning/30 dark:bg-warning/10';
      case 'pending':
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusNodeStyle = (status: TimelineStatus, isSelected: boolean) => {
    switch (status) {
      case 'completed':
        return 'bg-surface border-accent-blue text-accent-blue ring-1 ring-accent-blue/20 accent:border-brand accent:text-brand-text accent:ring-brand/20';
      case 'in-progress':
        return 'bg-surface border-accent-blue text-accent-blue shadow-subtle ring-2 ring-accent-blue/30 accent:border-brand accent:text-brand-text accent:ring-brand/30';
      case 'failed':
        return 'bg-negative/5 border-negative text-negative ring-1 ring-negative/30 dark:bg-negative/10';
      case 'warning':
        return 'bg-warning/5 border-warning text-warning ring-1 ring-warning/30 dark:bg-warning/10';
      case 'pending':
      default:
        return isSelected
          ? 'bg-surface-hover border-border-hover text-muted-foreground'
          : 'bg-surface border-border text-muted-foreground';
    }
  };

  // Calculate completed count for progress line indicator
  const completedIndex = items.reduce((acc, curr, idx) => {
    return curr.status === 'completed' || curr.status === 'in-progress' ? idx : acc;
  }, -1);

  const progressPercent =
    items.length > 1 && completedIndex >= 0
      ? (completedIndex / (items.length - 1)) * 100
      : 0;

  // ioiti-ui: a plain block named by its list, not a landmark: a page may open several.
  return (
    <div
      className={cn(
        // ioiti-ui: a section, as a Panel: its border, its surface, glass under the glass material (glass-card).
        'w-full rounded-2xl border border-border/70 bg-surface/50 p-4 sm:p-5 text-foreground dark:bg-surface/25 glass-card',
        className
      )}
      {...props}
    >
      <div className="relative">
        {/* Continuous Background Track Line */}
        <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-border" />

        {/* Animated Progress Filled Line */}
        <motion.div
          // ioiti-ui: in the accent, where the theme has one (accent:).
          className="absolute left-[15px] top-6 w-[2px] bg-gradient-to-b from-accent-blue via-accent-blue/80 to-transparent accent:from-brand accent:via-brand/80 origin-top"
          initial={{ height: 0 }}
          animate={{ height: `${progressPercent}%` }}
          transition={motionTransitions.springGentle}
        />

        {/* Timeline Items List */}
        <div className="space-y-3 sm:space-y-4 relative" role="list" aria-label={label}>
          {items.map((item) => {
            const details = hasDetails(item);
            const isExpanded = details && expandedIds.has(item.id);
            const isSelected = selectedId === item.id;
            const itemId = `${listId}-item-${item.id}`;

            return (
              <div
                key={item.id}
                role="listitem"
                className="relative flex items-start gap-4 group"
              >
                {/* Status Indicator Node. ioiti-ui: named by its step and its state (aria-label), shown in a Hint on
                    hover, keyboard focus and a tap: its title was its only name, and showed on none of them. */}
                <Hint content={`${item.title}: ${item.statusLabel ?? item.status}`} side="right">
                <button
                  type="button"
                  aria-label={`${item.title}: ${item.statusLabel ?? item.status}`}
                  onClick={() => handleToggleExpand(item)}
                  aria-expanded={collapsible && details ? isExpanded : undefined}
                  aria-controls={collapsible && details ? itemId : undefined}
                  className={cn(
                    // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                    'relative z-10 size-8 rounded-full flex items-center justify-center border transition-[color,background-color,border-color,box-shadow] duration-200 shrink-0',
                    PRESSABLE,
                    getStatusNodeStyle(item.status, isSelected)
                  )}
                >
                  {getStatusIcon(item.status)}
                  {item.status === 'in-progress' && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-accent-blue/20 accent:bg-brand/20 -z-10" />
                  )}
                </button>
                </Hint>

                {/* Content Card */}
                <div
                  onClick={() => handleToggleExpand(item)}
                  className={cn(
                    'flex-1 min-w-0 rounded-xl border transition-colors duration-200 cursor-pointer overflow-hidden p-4',
                    isSelected
                      ? 'bg-surface-hover border-foreground/30'
                      : 'bg-surface border-border/60 hover:border-border-hover hover:bg-surface-hover'
                  )}
                >
                  {/* Item Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground truncate">
                          {item.title}
                        </span>
                        {item.tag && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-surface-raised border border-border text-muted-foreground">
                            {item.tag}
                          </span>
                        )}
                        {item.statusLabel && (
                          <span
                            className={cn(
                              'text-[11px] font-medium px-2 py-0.5 rounded-full border',
                              getStatusBadgeStyle(item.status)
                            )}
                          >
                            {item.statusLabel}
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-mono text-muted-foreground block">
                        {item.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {collapsible && details && (
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={motionTransitions.easeFast}
                          className="text-muted-foreground group-hover:text-foreground p-1"
                        >
                          <ChevronDown className="size-4" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Expandable Detail Section */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        id={itemId}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={motionTransitions.springGentle}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t border-border/40 space-y-3">
                          {item.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed [overflow-wrap:anywhere]">
                              {item.description}
                            </p>
                          )}

                          {/* Metrics Grid */}
                          {item.metrics && item.metrics.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                              {item.metrics.map((m, i) => (
                                <div
                                  key={i}
                                  className="p-2.5 rounded-lg bg-surface-raised border border-border/60"
                                >
                                  <span className="text-xs font-medium text-muted-foreground block">
                                    {m.label}
                                  </span>
                                  <span className="text-sm font-mono font-medium text-foreground">
                                    {m.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Footer Meta: Commit + Author */}
                          {(item.author || item.commitHash) && (
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs font-mono text-muted-foreground">
                              {item.author && (
                                <div className="flex items-center gap-1.5">
                                  <span className="size-1.5 rounded-full bg-muted-foreground" />
                                  <span className="text-muted-foreground">{item.author.name}</span>
                                  {item.author.role && (
                                    <span className="text-muted-foreground">({item.author.role})</span>
                                  )}
                                </div>
                              )}

                              {item.commitHash && (
                                // ioiti-ui: what it does in a Hint, not a title.
                                <Hint content={copiedHash === item.commitHash ? 'Copied' : 'Copy the commit hash'}>
                                <button
                                  type="button"
                                  aria-label={`Copy the commit hash ${item.commitHash.slice(0, 7)}`}
                                  onClick={(e) => handleCopyHash(e, item.commitHash!)}
                                  // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                                  className={cn(
                                    'inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:border-border-hover hover:bg-surface-hover hover:text-foreground',
                                    PRESSABLE
                                  )}
                                >
                                  <GitCommit className="size-3" />
                                  <span>{item.commitHash.slice(0, 7)}</span>
                                  {copiedHash === item.commitHash ? (
                                    <CheckCheck className="size-3 text-foreground" />
                                  ) : (
                                    <Copy className="size-3 text-muted-foreground" />
                                  )}
                                </button>
                                </Hint>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
