import React from 'react';
/** ioiti-ui: a node's health, as a health check reports it. */
export type TraceStatus = 'ok' | 'warning' | 'down' | 'unknown' | 'disabled';
export interface TraceNode {
    id: string;
    label: string;
    type?: 'service' | 'database' | 'api' | 'client';
    x?: number;
    y?: number;
    /** ioiti-ui: its health; none for what reports none (outside services). */
    status?: TraceStatus;
    /** ioiti-ui: the health in words ("Up", "Down"...), and what was observed. */
    statusLabel?: string;
    detail?: string;
}
export interface TraceConnection {
    from: string;
    to: string;
    label?: string;
    type?: string;
}
export interface DependencyTraceProps {
    /** Nodes in the dependency graph. */
    nodes: TraceNode[];
    /** Connection links between nodes. */
    connections: TraceConnection[];
    /** Selected node handler. */
    onNodeSelect?: (id: string) => void;
    /** Hovered node handler. */
    onNodeHover?: (id: string | null) => void;
    /** Radius/size of the node badge in pixels. Default is 36. */
    nodeSize?: number;
    /** ioiti-ui: the canvas the nodes' x and y are on (EasyUI's was 400 × 280). */
    width?: number;
    height?: number;
    /** ioiti-ui: the graph's name, for screen readers. */
    label?: string;
    /** Custom CSS class names. */
    className?: string;
}
export declare const DependencyTrace: React.FC<DependencyTraceProps>;
