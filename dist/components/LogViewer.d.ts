import type { ReactNode } from 'react';
interface LogViewerProps {
    /** The lines, oldest first; a job's output grows by lines appended. */
    lines?: readonly string[];
    /** Or the whole text, cut at its line breaks. */
    text?: string;
    /** What the log is: its header, and its name for a screen reader ("Build log"). */
    label: string;
    /** Keeps the newest line in sight as lines arrive; scrolling up stops it, and "Jump to the end" starts it again. */
    follow?: boolean;
    /** The most lines kept: the earlier ones are dropped, and said to be above the first. */
    maxLines?: number;
    /** Lines already dropped before these (a server that sent only the end): counted in the numbers. */
    droppedLines?: number;
    /** Long lines wrapped at first; the reader can change it. */
    defaultWrap?: boolean;
    /** The view's height; the log scrolls inside it. */
    height?: number | string;
    /** The name of the file "Download" saves. */
    downloadName?: string;
    /** Shown while nothing is logged. */
    emptyText?: ReactNode;
    className?: string;
}
/**
 * A process's output as it is written (a build, a deploy, a job): numbered lines, errors and warnings
 * in their tones and marked at their edge, the newest kept in sight, a search that goes from one line found
 * to the next, wrapping, copying and downloading. Only the lines in sight are drawn: a log of a hundred
 * thousand lines scrolls as one of a hundred. Not read aloud line by line: a screen reader reads it when
 * asked.
 */
export declare function LogViewer({ lines, text, label, follow, maxLines, droppedLines, defaultWrap, height, downloadName, emptyText, className, }: LogViewerProps): import("react").JSX.Element;
export {};
