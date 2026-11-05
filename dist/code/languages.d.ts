import type { Extension } from '@codemirror/state';
/** The languages the editors read. `text` is not coloured. */
export type CodeEditorLanguage = 'toml' | 'yaml' | 'json' | 'markdown' | 'text';
/**
 * A language's support, loaded when first asked for: each is a chunk of its own, so that an editor of
 * JSON never downloads the parser of Markdown (which brings HTML's). Resolves to no extension for `text`.
 */
export declare function loadLanguage(language: CodeEditorLanguage): Promise<Extension>;
