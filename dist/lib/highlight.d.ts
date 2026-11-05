export type CodeTokenKind = 'keyword' | 'string' | 'number' | 'comment' | 'function' | 'namespace' | 'type' | 'builtin' | 'operator'
/** A diff's added line, in the gain's tone. */
 | 'inserted'
/** A diff's removed line, in the loss's tone. */
 | 'deleted' | 'plain';
export interface CodeToken {
    kind: CodeTokenKind;
    text: string;
}
export type CodeLanguage = 'json' | 'js' | 'jsx' | 'ts' | 'tsx' | 'css' | 'shell' | 'toml' | 'yaml' | 'diff' | 'text';
/** The code's tokens, coloured as its language reads them; `text` is all plain. */
export declare function highlightCode(code: string, language: CodeLanguage): CodeToken[];
/** The tokens cut at each line's end: a token across lines (a comment, a template) is in each of them. */
export declare function splitLines(tokens: CodeToken[]): CodeToken[][];
