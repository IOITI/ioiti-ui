import React from 'react';
export type ActivityType = 'thinking' | 'searching' | 'reading' | 'writing' | 'tool_execution' | 'api_request' | 'database_query' | 'code_execution' | 'completed' | 'failed' | 'cancelled';
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
export declare function useAgentActivity(): AgentActivityContextValue;
export declare function getActivityIcon(_type: ActivityType, status: ActivityStatus): React.ReactNode;
export interface AgentActivityHeaderProps {
    title?: string;
    agentName?: string;
    showControls?: boolean;
    className?: string;
}
export declare const AgentActivityHeader: React.FC<AgentActivityHeaderProps>;
export interface AgentActivityItemProps {
    activity: AgentActivityItemData;
    isLast?: boolean;
    className?: string;
}
export declare const AgentActivityItem: React.FC<AgentActivityItemProps>;
export interface AgentActivityNotesProps {
    notes: AgentActivityItemData[];
    className?: string;
}
/**
 * ioiti-ui: notes in a row, drawn together as the agent's words between two stretches of its steps: whole, from
 * the timeline's edge, with no mark, state or line; the first one's time where a step's is; the one still being
 * written (`status: 'running'`) ending with a caret.
 */
export declare const AgentActivityNotes: React.FC<AgentActivityNotesProps>;
export interface AgentActivityTimelineProps {
    className?: string;
}
export declare const AgentActivityTimeline: React.FC<AgentActivityTimelineProps>;
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
export declare const AIAgentActivity: React.FC<AIAgentActivityProps>;
