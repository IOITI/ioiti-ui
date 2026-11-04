export type LogLevel = 'error' | 'warning' | 'info';
/** How serious a line says it is, from the words logs use (ERROR, WARN, INFO, a traceback), or nothing. */
export declare function logLevel(line: string): LogLevel | null;
/** A text's lines; a last line break ends the last line rather than starting an empty one. */
export declare function splitLog(text: string): string[];
/** The lines a search finds, by their index: the text sought anywhere in them, whatever its case. */
export declare function findInLog(lines: readonly string[], query: string): number[];
/** A line cut where the search finds it: the parts, each said to match or not. */
export declare function matchParts(line: string, query: string): {
    text: string;
    match: boolean;
}[];
/** Lines per block: a block in sight is drawn whole, the others are space of their height. */
export declare const LOG_BLOCK = 100;
/**
 * The blocks to draw, and the space before and after them: the blocks seen between `top` and `top + view`
 * (plus one on each side), each `height(block)` high.
 */
export declare function blocksInSight(blocks: number, height: (block: number) => number, top: number, view: number): {
    first: number;
    last: number;
    before: number;
    after: number;
};
