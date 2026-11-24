import type { Extension } from '@codemirror/state';
/** The design's look of an editor: its colours, its type, its marks. */
export declare const editorTheme: Extension;
/** An editor's height: at least `min`, at most `max` (it scrolls past). */
export declare function editorHeight(min?: number | string, max?: number | string): Extension;
