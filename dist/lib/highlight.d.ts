export type CodeTokenKind = 'keyword' | 'string' | 'number' | 'comment' | 'function' | 'namespace' | 'type' | 'builtin' | 'operator' | 'plain';
export interface CodeToken {
    kind: CodeTokenKind;
    text: string;
}
export type CodeLanguage = 'json' | 'js' | 'jsx' | 'ts' | 'tsx' | 'css' | 'shell' | 'text';
/** The code's tokens, coloured as its language reads them; `text` is all plain. */
export declare function highlightCode(code: string, language: CodeLanguage): CodeToken[];
/** The tokens cut at each line's end: a token across lines (a comment, a template) is in each of them. */
export declare function splitLines(tokens: CodeToken[]): CodeToken[][];
