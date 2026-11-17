'use client';

import React, { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronDown, User, Clock, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { PRESSABLE, SECTION } from '../../lib/recipes.js';

export interface LedgerEntry {
  id: string;
  /** ioiti-ui: optional (a caller may say the date in `action`). */
  timestamp?: Date | string;
  action: string;
  description: string;
  author?: string;
  /** ioiti-ui: a name shown in the footer, as written (a file's). */
  reference?: string;
  details?: {
    diff?: string;
    preview?: string;
    metadata?: Record<string, any>;
    /** ioiti-ui: what the entry opens on, drawn as given (the changes a restore would make). */
    content?: React.ReactNode;
  };
  restorable?: boolean;
}

export interface RecoveryLedgerProps {
  /** Array of chronological version history or state recovery entries. */
  entries: LedgerEntry[];
  /** Currently active / restored state entry ID. */
  currentEntryId?: string;
  /** Revert / restore callback. ioiti-ui: the caller opens its confirmation there; the ledger restores nothing itself. */
  onRestore?: (id: string) => Promise<void> | void;
  /** Entry selection handler. */
  onSelect?: (id: string) => void;
  /** ioiti-ui: the entry opened, when the caller holds it (null: none). */
  expandedId?: string | null;
  /** ioiti-ui: called with the entry opened, or null once it is closed. */
  onExpandedChange?: (id: string | null) => void;
  /** ioiti-ui: the header's title. */
  title?: string;
  /** ioiti-ui: beside the title. */
  countLabel?: string;
  /** ioiti-ui: the text of the restore button. */
  restoreLabel?: string;
  /** ioiti-ui: the badge of the current entry. */
  currentLabel?: string;
  /** Visual presentation mode. Default is 'timeline'. */
  variant?: 'timeline' | 'compact';
  /** Custom CSS class names. */
  className?: string;
}

export const RecoveryLedger: React.FC<RecoveryLedgerProps> = ({
  entries,
  currentEntryId,
  onRestore,
  onSelect,
  expandedId: controlledExpandedId,
  onExpandedChange,
  title = 'Recovery ledger',
  countLabel,
  restoreLabel = 'Revert',
  currentLabel = 'Current head',
  variant = 'timeline',
  className,
}) => {
  const [internalExpandedId, setInternalExpandedId] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const baseId = useId();
  const expandedId = controlledExpandedId !== undefined ? controlledExpandedId : internalExpandedId;

  const toggleExpand = (id: string) => {
    const next = expandedId === id ? null : id;
    if (controlledExpandedId === undefined) setInternalExpandedId(next);
    onExpandedChange?.(next);
    if (onSelect) onSelect(id);
  };

  const handleRestore = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onRestore || restoringId) return;
    setRestoringId(id);
    try {
      await onRestore(id);
    } finally {
      setRestoringId(null);
    }
  };

  // ioiti-ui: each colour has a light value in front of EasyUI's own, kept behind `dark:`.
  return (
    <div
      className={cn(
        // ioiti-ui: glass under the glass material, as a card (glass-card); a section, as a Panel.
        SECTION, 'w-full overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/40 bg-surface-raised/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock aria-hidden="true" className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <span className="text-[11px] font-mono tabular-nums text-muted-foreground bg-surface px-2 py-0.5 rounded-full border border-border">
            {countLabel ?? `${entries.length} snapshots`}
          </span>
        </div>
      </div>

      {/* Ledger List */}
      <div className="relative p-4">
        {variant === 'timeline' && (
          // ioiti-ui: through the middle of the pips (16 px from the edge, 16 px wide); EasyUI's ran 5 px to their right.
          <div aria-hidden="true" className="absolute top-6 bottom-6 left-[23px] w-[2px] bg-border pointer-events-none" />
        )}

        {/* ioiti-ui: a list, in the order given. */}
        <ol aria-label={title} className="space-y-4">
          {entries.map((entry, idx) => {
            const isCurrent = entry.id === currentEntryId;
            const isExpanded = expandedId === entry.id;
            const isRestoring = restoringId === entry.id;
            const isRestorable = entry.restorable !== false;
            // ioiti-ui: only an entry with something to show opens (a real button: EasyUI's card took clicks alone).
            const canExpand = entry.details !== undefined;
            const detailsId = `${baseId}-${idx}-details`;

            const dateStr =
              entry.timestamp === undefined
                ? null
                : typeof entry.timestamp === 'string'
                ? entry.timestamp
                : entry.timestamp.toLocaleString();

            const summary = (
              <>
                <span className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-foreground">
                    {entry.action}
                  </span>
                  {isCurrent && (
                    <span className="px-1.5 py-0.5 rounded-sm text-[11px] font-mono bg-positive/5 text-positive border border-positive/30 dark:bg-positive/10">
                      {currentLabel}
                    </span>
                  )}
                </span>
                <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {entry.description}
                </span>

                {/* Metadata Footer */}
                {(dateStr || entry.author || entry.reference) && (
                  <span className="flex items-center gap-3 flex-wrap text-xs font-mono text-muted-foreground mt-2">
                    {dateStr && <span>{dateStr}</span>}
                    {entry.reference && <span className="break-all">{entry.reference}</span>}
                    {entry.author && (
                      <span className="flex items-center gap-1">
                        <User aria-hidden="true" className="size-3" />
                        {entry.author}
                      </span>
                    )}
                  </span>
                )}
              </>
            );

            return (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...motionTransitions.easeSoft, delay: idx * 0.05 }}
                className="relative pl-8"
              >
                {/* Timeline Indicator Pip */}
                <div
                  aria-hidden="true"
                  className={cn(
                    'absolute left-0 top-3 size-4 rounded-full border-2 flex items-center justify-center transition-colors bg-surface',
                    isCurrent
                      ? 'border-positive text-positive'
                      : isExpanded
                      ? 'border-border-hover'
                      : 'border-border'
                  )}
                >
                  {isCurrent && <div className="size-1.5 rounded-full bg-positive" />}
                </div>

                {/* Entry Card */}
                <div
                  className={cn(
                    'p-3 rounded-xl border transition-colors',
                    isCurrent
                      ? 'bg-surface-hover border-positive/30'
                      : isExpanded
                      ? 'bg-surface-hover border-border-hover'
                      : canExpand
                      ? 'bg-surface border-border/60 hover:border-border-hover hover:bg-surface-hover'
                      : 'bg-surface border-border/60'
                  )}
                >
                  {/* ioiti-ui: the button's ::after covers the header, so the whole of it opens the entry, as EasyUI's card did. */}
                  <div className="relative flex items-start justify-between gap-3">
                    {canExpand ? (
                      <button
                        type="button"
                        onClick={() => toggleExpand(entry.id)}
                        aria-expanded={isExpanded}
                        aria-controls={isExpanded ? detailsId : undefined}
                        className="group min-w-0 text-left rounded-md cursor-pointer after:absolute after:inset-0 after:content-['']"
                      >
                        {summary}
                      </button>
                    ) : (
                      <div className="min-w-0">{summary}</div>
                    )}

                    {/* Actions (Restore & Expand) */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isCurrent && isRestorable && onRestore && (
                        <button
                          type="button"
                          disabled={Boolean(restoringId)}
                          onClick={(e) => handleRestore(entry.id, e)}
                          className={cn(
                            'relative z-10 px-2.5 py-1 rounded-md text-xs font-medium bg-surface text-text-secondary border border-border hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-1',
                            PRESSABLE
                          )}
                          // ioiti-ui: named by the entry's action (its id is a file's name).
                          aria-label={`${restoreLabel}: ${entry.action}`}
                        >
                          {isRestoring ? (
                            <Loader2 aria-hidden="true" className="size-3 animate-spin" />
                          ) : (
                            <RotateCcw aria-hidden="true" className="size-3" />
                          )}
                          <span>{restoreLabel}</span>
                        </button>
                      )}

                      {canExpand && (
                        <div aria-hidden="true" className="p-1 text-muted-foreground pointer-events-none">
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={motionTransitions.springSnappy}
                          >
                            <ChevronDown className="size-4" />
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Diff / Details Panel */}
                  <AnimatePresence>
                    {isExpanded && entry.details && (
                      <motion.div
                        id={detailsId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={motionTransitions.springSmooth}
                        className="mt-3 pt-2.5 border-t border-border/40 overflow-hidden"
                      >
                        {entry.details.diff && (
                          <div className="p-2 rounded-lg bg-surface-raised border border-border/60 font-mono text-xs text-text-secondary leading-relaxed overflow-x-auto">
                            <pre>{entry.details.diff}</pre>
                          </div>
                        )}
                        {entry.details.preview && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {entry.details.preview}
                          </p>
                        )}
                        {entry.details.content}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};
