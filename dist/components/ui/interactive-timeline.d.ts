import React from 'react';
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
export declare const InteractiveTimeline: React.FC<InteractiveTimelineProps>;
