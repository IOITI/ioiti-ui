import type { ReactNode } from 'react';
import type { CodeEditorLanguage } from './languages.js';
export interface DiffEditorProps {
    /** The version compared against: never changed here. */
    original: string;
    /** The version shown changed: edited unless `readOnly`, each change given to `onChange`. */
    modified: string;
    onChange?: (value: string) => void;
    language?: CodeEditorLanguage;
    /** `split`: the two side by side, unchanged lines aligned. `unified`: one column, what was removed above what replaced it. */
    layout?: 'split' | 'unified';
    /** Long unchanged stretches folded, three lines kept around each change (or as given). */
    collapseUnchanged?: boolean | {
        margin?: number;
        minSize?: number;
    };
    /** The changed version read, not edited. */
    readOnly?: boolean;
    /** What is compared, for the header and a screen reader: "Rule file". */
    label: string;
    /** The names of the two versions, above them: "Saved" and "Yours". */
    originalLabel?: string;
    modifiedLabel?: string;
    /** Long lines wrapped, rather than scrolled sideways. */
    wrap?: boolean;
    /** At most this high: taller scrolls inside it. */
    maxHeight?: number | string;
    /** At the end of the header, after the buttons that move between changes: a toggle, an action. */
    actions?: ReactNode;
    className?: string;
}
/**
 * Two versions of a text and what changed between them (CodeMirror's merge view): removed in the loss's
 * tone, added in the gain's, long unchanged stretches folded, the buttons of the header moving from one
 * change to the next. The changed side can be edited.
 */
export declare function DiffEditor({ original, modified, onChange, language, layout, collapseUnchanged, readOnly, label, originalLabel, modifiedLabel, wrap, maxHeight, actions, className, }: DiffEditorProps): import("react").JSX.Element;
