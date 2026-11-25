import React from 'react';
export type StatusIslandState = 'collapsed' | 'expanded';
export interface StatusIslandProps {
    /** ioiti-ui: what the pill shows, collapsed: the whole pill opens the island. */
    compact: React.ReactNode;
    /** ioiti-ui: what the island shows, opened. */
    children: React.ReactNode;
    /** ioiti-ui: the name of the pill and of the opened island, for screen readers. */
    label: string;
    defaultState?: StatusIslandState;
    state?: StatusIslandState;
    onStateChange?: (state: StatusIslandState) => void;
    className?: string;
}
export declare const StatusIsland: React.FC<StatusIslandProps>;
