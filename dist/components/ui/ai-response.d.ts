import React from "react";
/**
 * Returns a safe href, or null if the URL must not become a link.
 * Uses the same URL parser the browser uses, so obfuscation tricks
 * (case, tabs/newlines, leading spaces, backslashes) can't slip through.
 */
export declare function safeHref(raw: string | null | undefined, allowed?: string[]): string | null;
export type AIResponseStatus = "idle" | "generating" | "streaming" | "complete" | "error" | "cancelled";
export interface AIResponseSource {
    id: string | number;
    title: string;
    url?: string;
    snippet?: string;
    sourceType?: "doc" | "github" | "web" | "api" | string;
}
export interface AIResponseContextValue {
    content: string;
    status: AIResponseStatus;
    modelName?: string;
    sources: AIResponseSource[];
    copied: boolean;
    copyContent: () => void;
    onRegenerate?: () => void;
    onFeedback?: (type: "like" | "dislike") => void;
    feedback?: "like" | "dislike" | null;
    /** ioiti-ui: what it is doing while nothing of its answer is written, said in place of a skeleton. */
    thinking?: AIResponseThinkingProps;
}
/** ioiti-ui: what an assistant is doing while nothing of its answer is written. */
export interface AIResponseThinkingProps {
    /** What it does now, under a shimmer ("Thinking", "Waiting for 3 runs"): the one part read out as it changes. */
    label: string;
    /** What it is about, shown one after the other under the label, round and round. */
    lines?: string[];
    /** When it began: the time it has taken is said beside the label. */
    since?: string | number | Date;
    /** Seconds each line is shown. */
    interval?: number;
    className?: string;
}
export declare function useAIResponseContext(): AIResponseContextValue;
export interface AIResponseHeaderProps {
    title?: string;
    modelBadge?: string;
    timestamp?: string;
    icon?: React.ReactNode;
    className?: string;
}
export declare const AIResponseHeader: React.FC<AIResponseHeaderProps>;
/**
 * What an assistant is doing while nothing of its answer is written: dots rising in turn, what it does now under
 * a shimmer, the time it has taken, and under them what it is about, a line at a time (held while the pointer is
 * on it). Only what it does is read out as it changes, never a line turning or a second passing.
 */
export declare const AIResponseThinking: React.FC<AIResponseThinkingProps>;
export interface AIResponseContentProps {
    className?: string;
}
export declare const AIResponseContent: React.FC<AIResponseContentProps>;
export interface AIResponseSourcesProps {
    sources?: AIResponseSource[];
    title?: string;
    defaultExpanded?: boolean;
    className?: string;
}
export declare const AIResponseSources: React.FC<AIResponseSourcesProps>;
export interface AIResponseToolsSummaryProps {
    toolCount: number;
    tools?: Array<{
        name: string;
        status?: "success" | "running" | "error";
        duration?: string;
    }>;
    onToggleDetails?: () => void;
    className?: string;
}
export declare const AIResponseToolsSummary: React.FC<AIResponseToolsSummaryProps>;
export interface AIResponseActionsProps {
    className?: string;
}
export declare const AIResponseActions: React.FC<AIResponseActionsProps>;
export interface AIResponseProps {
    /** Markdown text. Safe to stream into: unfinished code fences and lists render fine */
    content?: string;
    status?: AIResponseStatus;
    /** ioiti-ui: no default (EasyUI's "EasyAI 2.0"): without one, no badge. */
    modelName?: string;
    sources?: AIResponseSource[];
    onRegenerate?: () => void;
    onFeedback?: (type: "like" | "dislike") => void;
    /** ioiti-ui: the feedback given before (kept by the application), shown pressed. */
    feedback?: "like" | "dislike" | null;
    /** ioiti-ui: what it is doing while nothing of its answer is written (`AIResponseThinking`), in place of a skeleton. */
    thinking?: AIResponseThinkingProps;
    className?: string;
    /** Custom composition using the compound parts. Defaults to header + content + sources + actions */
    children?: React.ReactNode;
}
export declare const AIResponse: React.FC<AIResponseProps>;
