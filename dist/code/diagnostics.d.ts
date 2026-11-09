import type { Diagnostic } from '@codemirror/lint';
import type { Text } from '@codemirror/state';
/**
 * A problem the server found in the code (a parse error): on a line, from 1, and at a column of it, from 1.
 * Without a column the whole line is marked; with one, from it to the line's end.
 */
export interface CodeDiagnostic {
    line: number;
    column?: number;
    message: string;
    severity?: 'error' | 'warning';
}
/** The problems placed in the document: a line past its end is its last line. */
export declare function placeDiagnostics(doc: Text, diagnostics: readonly CodeDiagnostic[]): Diagnostic[];
