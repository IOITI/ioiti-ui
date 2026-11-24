export type Politeness = 'polite' | 'assertive';
/** Makes both live regions now, before anything is said: a screen reader hears the first words said in them. */
export declare function prepareLiveRegions(): void;
/** Says a short message to screen readers: politely (after what they are reading) unless asked to say it at once. */
export declare function announce(message: string, politeness?: Politeness): void;
