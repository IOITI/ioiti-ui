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
    className?: string;
    /** Custom composition using the compound parts. Defaults to header + content + sources + actions */
    children?: React.ReactNode;
}
export declare const AIResponse: React.FC<AIResponseProps>;
