/** What is kept under a key; null where nothing is, or the browser keeps nothing. */
export declare function readKept(key: string): string | null;
/** Keeps a value under a key, where the browser lets it. */
export declare function keep(key: string, value: string): void;
/** Forgets what is kept under a key. */
export declare function unkeep(key: string): void;
