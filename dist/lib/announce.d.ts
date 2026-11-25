export type Politeness = 'polite' | 'assertive';
/** Makes both live regions now, before anything is said: a screen reader hears the first words said in them. */
export declare function prepareLiveRegions(): void;
/** Says a short message to screen readers: politely (after what they are reading) unless asked to say it at once. */
export declare function announce(message: string, politeness?: Politeness): void;
/**
 * Says `message` once as `when` turns true, and again only once it has been false in between: what a list shows beside
 * a field that keeps the focus (a search that leaves it empty: "Nothing matches"), which a screen reader, reading the
 * field, would not hear. The words said are the latest given; a change of them alone says nothing.
 */
export declare function useAnnounceWhen(when: boolean, message: string, politeness?: Politeness): void;
