import type { MessageKit } from '../../lib/messages.js';
/** ProductTour. */
export declare const tour: {
    /** "1 of 3": the step shown, among how many. */
    position: ({ step, count }: {
        step: number;
        count: number;
    }, { number }: MessageKit) => string;
    /** "Skip": the button that ends the tour before its last step. */
    skip: string;
    /** "Go to step 3": a dot's button, to its step. */
    goToStep: (step: number, { number }: MessageKit) => string;
    /** "Back": the button to the step before. */
    back: string;
    /** "Next": the button to the step after. */
    next: string;
    /** "Done": that button on the last step, which ends the tour. */
    done: string;
};
