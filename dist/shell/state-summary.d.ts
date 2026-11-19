import type { ReactNode } from 'react';
import type { Tone } from '../lib/recipes.js';
/**
 * What a state is, from the gravest: something to fix (`danger`), to watch (`warning`), good news not to miss
 * (`success`), something to know that asks nothing (`neutral`: a connection that fell back to a timer), and
 * all is well (`ok`). The first three stand out in the top bar; the last two are said only once it is opened.
 */
export type StateTone = 'danger' | 'warning' | 'success' | 'neutral' | 'ok';
/** A state, one row of StateSummary. */
export interface StateItem {
    id: string;
    tone: StateTone;
    /** A lucide icon, as an element (`<KeyRound />`): beside its words, and in the top bar while it is the gravest. */
    icon?: ReactNode;
    /** Its words: "Restart needed", "Polling". */
    label: string;
    /** What it means and what to do, under its words. */
    detail?: ReactNode;
    /** The page where it is dealt with: the row is then a link. */
    href?: string;
}
/** The design's tone of each (recipes.ts): all is well in the positive colour, a neutral state in grey. */
export declare const STATE_TONE: Record<StateTone, Tone>;
/** Whether a state stands out: it is counted, and the top bar says it without being opened. */
export declare function standsOut(tone: StateTone): boolean;
/** The gravest tone among states; `ok` for none. */
export declare function gravestTone(items: readonly {
    tone: StateTone;
}[]): StateTone;
/** States from the gravest, in their order otherwise. */
export declare function byGravity<T extends {
    tone: StateTone;
}>(items: readonly T[]): T[];
/**
 * What the top bar's summary says, for a screen reader and in its tip: the one state that stands out by its
 * words, several by how many of each tone ("1 to fix, 2 to watch"), none by the gravest quiet one's words, or
 * that all is well.
 */
export declare function stateSentence(items: readonly StateItem[], okLabel: string): string;
