/** ProductTour. */
export const tour = {
    /** "1 of 3": the step shown, among how many. */
    position: ({ step, count }, { number }) => `${number(step)} of ${number(count)}`,
    /** "Skip": the button that ends the tour before its last step. */
    skip: 'Skip',
    /** "Go to step 3": a dot's button, to its step. */
    goToStep: (step, { number }) => `Go to step ${number(step)}`,
    /** "Back": the button to the step before. */
    back: 'Back',
    /** "Next": the button to the step after. */
    next: 'Next',
    /** "Done": that button on the last step, which ends the tour. */
    done: 'Done',
};
