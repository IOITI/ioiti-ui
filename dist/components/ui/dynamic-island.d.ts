import React from 'react';
export type DynamicIslandState = 'collapsed' | 'expanded';
export interface DynamicIslandProps {
    /** ioiti-ui: what the pill shows, collapsed: the whole pill opens the island. */
    compact: React.ReactNode;
    /** ioiti-ui: what the island shows, opened. */
    children: React.ReactNode;
    /** ioiti-ui: the name of the pill and of the opened island, for screen readers. */
    label: string;
    defaultState?: DynamicIslandState;
    state?: DynamicIslandState;
    onStateChange?: (state: DynamicIslandState) => void;
    className?: string;
}
export declare const DynamicIsland: React.FC<DynamicIslandProps>;
