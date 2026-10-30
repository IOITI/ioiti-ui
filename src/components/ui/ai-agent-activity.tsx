'use client';

import React, { useState, createContext, useContext, useId } from 'react';
// ioiti-ui: useReducedMotionConfig for what MotionConfig does not reduce (a height, a caret's blink).
import { motion, AnimatePresence, useReducedMotion, useReducedMotionConfig } from 'framer-motion';
import {
  Check,
  RotateCw,
  AlertCircle,
  Pause,
  ChevronDown,
} from 'lucide-react';
import { useControllableState } from '../../lib/controllable.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { cn } from '../../lib/utils.js';

// =============================================================================
// DESIGN SYSTEM CONSTANTS & SPRING TOKENS
// =============================================================================

const SPRING_PHYSICS = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 32,
  mass: 0.6,
};

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export type ActivityType =
  | 'thinking'
  | 'searching'
  | 'reading'
  | 'writing'
  | 'tool_execution'
  | 'api_request'
  | 'database_query'
  | 'code_execution'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type ActivityStatus = 'pending' | 'running' | 'success' | 'error' | 'cancelled';

export interface AgentActivityItemData {
  id: string;
  /**
   * ioiti-ui: a note is the agent's words between its steps (what it thought, what it does next): drawn as text
   * under the steps before it, never as a step of the timeline. A step unless said.
   */
  kind?: 'step' | 'note';
  type: ActivityType;
  title: string;
  description?: string;
  status: ActivityStatus;
  /** ioiti-ui: the status in words, beside the time it took: never told by the icon's colour alone. */
  statusLabel?: string;
  duration?: string;
  /** ioiti-ui: shown before the duration (EasyUI's item had it and never showed it). */
  timestamp?: string;
  metadata?: Record<string, any>;
  details?: {
    input?: string | Record<string, any>;
    output?: string | Record<string, any>;
    codeSnippet?: string;
    language?: string;
  };
}

export interface AgentActivityContextValue {
  activities: AgentActivityItemData[];
  isRunning?: boolean;
  /** ioiti-ui: the names of an item's input and output (EasyUI's "Parameters" and "Output Result"). */
  inputLabel: string;
  outputLabel: string;
  /** ioiti-ui: in the header, in place of "N of M completed". */
  summary?: string;
  /** ioiti-ui: the name of a group of notes, said to screen readers. */
  notesLabel: string;
  /** ioiti-ui: whether its steps fold under its header, whether they are shown, and where. */
  collapsible: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  bodyId: string;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  accentColor?: string;
}

const AgentActivityContext = createContext<AgentActivityContextValue | null>(null);

export function useAgentActivity() {
  const ctx = useContext(AgentActivityContext);
  if (!ctx) {
    throw new Error('AgentActivity compound subcomponents must be used within <AgentActivity>');
  }
  return ctx;
}

// =============================================================================
// HELPER: TYPE & STATUS ICONS (MINIMALIST & REFINED)
// =============================================================================

export function getActivityIcon(_type: ActivityType, status: ActivityStatus): React.ReactNode {
  if (status === 'running') {
    return <RotateCw className="w-3 h-3 animate-spin text-foreground stroke-[2]" />;
  }
  if (status === 'error') {
    return <AlertCircle className="w-3.5 h-3.5 text-rose-500 stroke-[2]" />;
  }
  if (status === 'cancelled') {
    return <Pause className="w-3 h-3 text-muted-foreground stroke-[2]" />;
  }
  if (status === 'success') {
    return <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />;
  }

  // Pending / default: clean minimal point
  return <div className="w-1.5 h-1.5 rounded-full bg-border" />;
}

// =============================================================================
// SUB-COMPONENTS (MINIMALIST, SPATIOUS, GEIST TYPOGRAPHY)
// =============================================================================

export interface AgentActivityHeaderProps {
  title?: string;
  agentName?: string;
  showControls?: boolean;
  className?: string;
}

export const AgentActivityHeader: React.FC<AgentActivityHeaderProps> = ({
  title = 'Activity',
  agentName,
  showControls = true,
  className,
}) => {
  const { activities, isRunning, expandAll, collapseAll, summary, collapsible, open, setOpen, bodyId } = useAgentActivity();
  // ioiti-ui: the steps alone are counted: a note is no step.
  const steps = activities.filter((a) => (a.kind ?? 'step') === 'step');
  const completedCount = steps.filter((a) => a.status === 'success').length;
  const shown = !collapsible || open;
  // ioiti-ui: what folds is opened by its header (in its heading, as a disclosure is): spans, a button's content.
  const Title = collapsible ? 'span' : 'h3';

  const said = (
    <>
      <span className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <Title className="text-sm font-medium text-foreground tracking-tight truncate">
          {title}
        </Title>
        {agentName && (
          <span className="text-xs text-muted-foreground font-normal truncate">
            — {agentName}
          </span>
        )}
      </span>

      <span className="w-1 h-1 rounded-full bg-border shrink-0 hidden sm:inline-block" />

      <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
        {isRunning ? (
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Running
          </span>
        ) : (
          <span>
            {summary ?? `${completedCount} of ${steps.length} completed`}
          </span>
        )}
      </span>
    </>
  );
  const line = 'flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap sm:flex-nowrap';

  return (
    <div
      className={cn(
        'px-4 py-3.5 sm:px-8 sm:py-5 border-b border-border/60 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-4 select-none',
        // ioiti-ui: folded, nothing under it to set apart (the line kept, so that nothing moves).
        !shown && 'border-b-transparent',
        className
      )}
    >
      {collapsible ? (
        <h3 className="min-w-0">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls={open ? bodyId : undefined}
            className={cn(line, 'group/fold max-w-full rounded-md text-left cursor-pointer')}
          >
            <motion.span
              animate={{ rotate: open ? 0 : -90 }}
              transition={motionTransitions.springSnappy}
              className="shrink-0 text-muted-foreground/70 group-hover/fold:text-foreground transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.span>
            {said}
          </button>
        </h3>
      ) : (
        <div className={line}>{said}</div>
      )}

      {showControls && shown && (
        <div className="flex items-center gap-2.5 sm:gap-3 text-xs text-muted-foreground font-normal shrink-0 ml-auto sm:ml-0">
          <button
            type="button"
            onClick={expandAll}
            className="hover:text-foreground transition-colors cursor-pointer py-1"
          >
            Expand all
          </button>
          <span className="text-border/80">/</span>
          <button
            type="button"
            onClick={collapseAll}
            className="hover:text-foreground transition-colors cursor-pointer py-1"
          >
            Collapse all
          </button>
        </div>
      )}
    </div>
  );
};

export interface AgentActivityItemProps {
  activity: AgentActivityItemData;
  isLast?: boolean;
  className?: string;
}

export const AgentActivityItem: React.FC<AgentActivityItemProps> = ({
  activity,
  isLast = false,
  className,
}) => {
  const { expandedIds, toggleExpand, inputLabel, outputLabel } = useAgentActivity();
  const isExpanded = expandedIds.has(activity.id);
  const hasDetails = Boolean(activity.details || activity.metadata);
  const shouldReduceMotion = useReducedMotion();
  const detailsId = useId();
  // ioiti-ui: an item that opens is a button (EasyUI's was a div taking clicks alone): the keyboard opens it too.
  const Header = hasDetails ? 'button' : 'div';

  return (
    <div className={cn('relative flex items-start gap-3 sm:gap-4 group', className)}>
      {/* Subtle timeline connector line */}
      {!isLast && (
        <div className="absolute left-[9px] sm:left-[11px] top-6 bottom-[-20px] w-px bg-border/50 group-last:hidden" />
      )}

      {/* Minimal state indicator */}
      <div className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0 mt-0.5">
        <div
          className={cn(
            'w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-all',
            activity.status === 'running'
              ? 'bg-surface border border-border ring-2 ring-emerald-500/20'
              : activity.status === 'success'
              ? 'bg-emerald-500/10 dark:bg-emerald-500/15'
              : activity.status === 'error'
              ? 'bg-rose-500/10 dark:bg-rose-500/20'
              : 'bg-surface border border-border/80'
          )}
        >
          {getActivityIcon(activity.type, activity.status)}
        </div>
      </div>

      {/* Item Body */}
      <div className="flex-1 min-w-0 pb-4 sm:pb-5">
        <Header
          {...(hasDetails
            ? { type: 'button' as const, onClick: () => toggleExpand(activity.id), 'aria-expanded': isExpanded, 'aria-controls': detailsId }
            : {})}
          className={cn(
            'block w-full text-left select-none transition-colors',
            hasDetails && 'cursor-pointer group/row rounded-md'
          )}
        >
          {/* Title and metadata row */}
          <div className="flex items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={cn(
                  'text-xs sm:text-sm tracking-tight transition-colors truncate',
                  activity.status === 'running'
                    ? 'font-medium text-foreground'
                    : 'font-normal text-foreground/90 group-hover/row:text-foreground'
                )}
              >
                {activity.title}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground tabular-nums">
              {activity.timestamp && <span className="hidden sm:inline">{activity.timestamp}</span>}
              {activity.statusLabel && <span>{activity.statusLabel}</span>}
              {activity.duration && <span>{activity.duration}</span>}
              {hasDetails && (
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : SPRING_PHYSICS}
                  className="text-muted-foreground/60 group-hover/row:text-foreground transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Optional concise description */}
          {activity.description && (
            <p className="text-xs text-muted-foreground leading-relaxed mt-1 break-words">
              {activity.description}
            </p>
          )}
        </Header>

        {/* Expandable Details Drawer */}
        <AnimatePresence>
          {hasDetails && isExpanded && (
            <motion.div
              id={detailsId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : SPRING_PHYSICS}
              className="overflow-hidden mt-3 pt-3 pl-3 sm:pl-3.5 border-l border-border/60 space-y-3 font-sans text-xs"
            >
              {/* Input parameters */}
              {activity.details?.input && (
                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-muted-foreground">
                    {inputLabel}
                  </div>
                  {/* ioiti-ui: JSON as written, its lines kept. */}
                  <div className="p-2.5 sm:p-3 rounded-lg bg-surface-raised/50 dark:bg-surface-raised/20 border border-border/40 text-foreground text-xs leading-relaxed overflow-x-auto select-text font-mono whitespace-pre-wrap break-words">
                    {typeof activity.details.input === 'string'
                      ? activity.details.input
                      : JSON.stringify(activity.details.input, null, 2)}
                  </div>
                </div>
              )}

              {/* Code snippet */}
              {activity.details?.codeSnippet && (
                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-muted-foreground">
                    {activity.details.language || 'Code'}
                  </div>
                  <pre className="p-2.5 sm:p-3 rounded-lg bg-surface-raised/50 dark:bg-surface-raised/20 border border-border/40 text-foreground text-xs leading-relaxed overflow-x-auto select-text font-sans">
                    <code>{activity.details.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Output Result */}
              {activity.details?.output && (
                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-muted-foreground">
                    {outputLabel}
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-lg bg-surface-raised/50 dark:bg-surface-raised/20 border border-border/40 text-muted-foreground text-xs leading-relaxed overflow-x-auto select-text whitespace-pre-wrap break-words">
                    {typeof activity.details.output === 'string'
                      ? activity.details.output
                      : JSON.stringify(activity.details.output, null, 2)}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 text-xs text-muted-foreground">
                  {Object.entries(activity.metadata).map(([key, val]) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-raised/50 border border-border/40 text-[11px]"
                    >
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="text-foreground font-medium">{String(val)}</span>
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ioiti-ui: the caret at the end of a note still being written, still where motion is reduced (as AIResponse's).
function NoteCaret() {
  const reduce = useReducedMotionConfig();
  return (
    <motion.span
      aria-hidden
      data-caret=""
      className="ml-[3px] inline-block h-[1.05em] w-[2px] translate-y-[0.2em] rounded-full bg-current"
      animate={reduce ? { opacity: 0.7 } : { opacity: [1, 0.15, 1] }}
      transition={reduce ? undefined : { repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
    />
  );
}

export interface AgentActivityNotesProps {
  notes: AgentActivityItemData[];
  className?: string;
}

/**
 * ioiti-ui: notes in a row, drawn together as the agent's words between two stretches of its steps: whole, from
 * the timeline's edge, with no mark, state or line; the first one's time where a step's is; the one still being
 * written (`status: 'running'`) ending with a caret.
 */
export const AgentActivityNotes: React.FC<AgentActivityNotesProps> = ({ notes, className }) => {
  const { notesLabel } = useAgentActivity();
  const time = notes[0]?.timestamp;

  return (
    <div
      role="group"
      aria-label={notesLabel}
      aria-busy={notes.some((note) => note.status === 'running') || undefined}
      className={cn('flex items-start justify-between gap-2.5 sm:gap-3 pb-4 sm:pb-5', className)}
    >
      <div className="min-w-0 flex-1 space-y-2">
        {notes.map((note) => (
          <p
            key={note.id}
            className="text-xs sm:text-sm leading-relaxed tracking-tight text-muted-foreground whitespace-pre-line break-words"
          >
            {note.title}
            {note.status === 'running' && <NoteCaret />}
          </p>
        ))}
      </div>
      {time && (
        <span className="hidden sm:inline shrink-0 pt-px text-xs text-muted-foreground tabular-nums">{time}</span>
      )}
    </div>
  );
};

// ioiti-ui: the items in stretches of one kind, in their order: a timeline of steps, a group of notes.
function stretchesOf(activities: AgentActivityItemData[]) {
  const stretches: { kind: 'step' | 'note'; items: AgentActivityItemData[] }[] = [];
  for (const activity of activities) {
    const kind = activity.kind ?? 'step';
    const last = stretches[stretches.length - 1];
    if (last?.kind === kind) last.items.push(activity);
    else stretches.push({ kind, items: [activity] });
  }
  return stretches;
}

export interface AgentActivityTimelineProps {
  className?: string;
}

export const AgentActivityTimeline: React.FC<AgentActivityTimelineProps> = ({ className }) => {
  const { activities, collapsible, open, bodyId } = useAgentActivity();
  const reduce = useReducedMotionConfig();

  // ioiti-ui: each stretch of steps a timeline of its own, its line cut where notes come between them.
  const body =
    activities.length === 0 ? (
      <div className="py-12 text-center text-xs text-muted-foreground font-normal">
        No activity recorded
      </div>
    ) : (
      <div className={cn('px-4 sm:px-8 py-4 sm:py-7 space-y-2', className)}>
        {stretchesOf(activities).map((stretch) =>
          stretch.kind === 'note' ? (
            <AgentActivityNotes key={stretch.items[0].id} notes={stretch.items} />
          ) : (
            <div key={stretch.items[0].id} className="space-y-2">
              {stretch.items.map((activity, index) => (
                <AgentActivityItem
                  key={activity.id}
                  activity={activity}
                  isLast={index === stretch.items.length - 1}
                />
              ))}
            </div>
          )
        )}
      </div>
    );

  if (!collapsible) return body;
  // ioiti-ui: folded under its header; a height is not reduced by MotionConfig: reduced, it fades.
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="body"
          id={bodyId}
          initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
          exit={reduce ? { opacity: 0, transition: motionTransitions.easeExit } : { height: 0, opacity: 0, transition: motionTransitions.easeExit }}
          transition={motionTransitions.springGentle}
          className="overflow-hidden"
        >
          {body}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// =============================================================================
// ROOT COMPOUND COMPONENT & STANDALONE
// =============================================================================

export interface AIAgentActivityProps {
  activities: AgentActivityItemData[];
  isRunning?: boolean;
  /** ioiti-ui: see the context. */
  inputLabel?: string;
  outputLabel?: string;
  summary?: string;
  /** ioiti-ui: the name of a group of notes, said to screen readers ("Notes"). */
  notesLabel?: string;
  /**
   * ioiti-ui: its steps fold under its header, which opens them again: `open` held by the caller (told by
   * `onOpenChange`), or left to it from `defaultOpen` (open).
   */
  collapsible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  agentName?: string;
  accentColor?: string;
  defaultExpandedIds?: string[];
  className?: string;
  children?: React.ReactNode;
}

export const AIAgentActivity: React.FC<AIAgentActivityProps> = ({
  activities = [],
  isRunning = false,
  inputLabel = 'Parameters',
  outputLabel = 'Output Result',
  summary,
  notesLabel = 'Notes',
  collapsible = false,
  open: given,
  defaultOpen = true,
  onOpenChange,
  title,
  agentName,
  accentColor,
  defaultExpandedIds = [],
  className,
  children,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds));
  const [open, setOpen] = useControllableState(given, defaultOpen, onOpenChange);
  const bodyId = useId();

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(activities.map((a) => a.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const contextValue: AgentActivityContextValue = {
    activities,
    isRunning,
    inputLabel,
    outputLabel,
    summary,
    notesLabel,
    collapsible,
    open,
    setOpen,
    bodyId,
    expandedIds,
    toggleExpand,
    expandAll,
    collapseAll,
    accentColor,
  };

  return (
    <AgentActivityContext.Provider value={contextValue}>
      <div
        style={{
          fontFamily: "var(--font-sans, 'Geist', sans-serif)",
          ...(accentColor ? ({ '--accent-custom': accentColor } as React.CSSProperties) : {}),
        }}
        className={cn(
          // ioiti-ui: glass under the glass material, as a panel.
          'w-full font-sans rounded-2xl border border-border/70 bg-surface/50 dark:bg-surface/25 text-foreground overflow-hidden transition-colors glass-card',
          className
        )}
      >
        {children || (
          <>
            <AgentActivityHeader title={title} agentName={agentName} />
            <AgentActivityTimeline />
          </>
        )}
      </div>
    </AgentActivityContext.Provider>
  );
};
