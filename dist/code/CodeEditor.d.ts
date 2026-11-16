import type { CodeDiagnostic } from './diagnostics.js';
import type { CodeEditorLanguage } from './languages.js';
export interface CodeEditorProps {
    /** The code. Each change the user makes is given to `onChange`; a new value given replaces the document. */
    value: string;
    onChange?: (value: string) => void;
    /** How it is coloured (and indented): `text` not at all. Loaded when first used. */
    language?: CodeEditorLanguage;
    /** Read, selected, searched and copied, not changed. */
    readOnly?: boolean;
    /** Long lines wrapped, rather than scrolled sideways. */
    wrap?: boolean;
    /** Problems found in the code (a server's parse errors), marked under the text and in the gutter. */
    diagnostics?: readonly CodeDiagnostic[];
    /** Called with the code on ⌘S / Ctrl+S, the browser's own save kept from the page. */
    onSave?: (value: string) => void;
    /** What the code is, for a screen reader: "Rule file". */
    label: string;
    /** The lines numbered in a gutter. */
    lineNumbers?: boolean;
    /** Shown while the document is empty. */
    placeholder?: string;
    /** At least this high (a number is pixels). */
    minHeight?: number | string;
    /** At most this high: taller code scrolls inside it. */
    maxHeight?: number | string;
    /** Takes the focus when it appears. */
    autoFocus?: boolean;
    className?: string;
}
/**
 * Code to edit: a configuration, a rule, a document (CodeMirror). In the design's code colours and surface,
 * its frame showing the focus as a field's does, ⌘S saving, ⌘F searching, a server's parse errors marked
 * where they are. Tab moves the focus on, as in any field: an editor never keeps it.
 */
export declare function CodeEditor({ value, onChange, language, readOnly, wrap, diagnostics, onSave, label, lineNumbers, placeholder, minHeight, maxHeight, autoFocus, className, }: CodeEditorProps): import("react").JSX.Element;
