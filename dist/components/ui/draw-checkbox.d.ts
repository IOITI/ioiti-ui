import React from 'react';
export interface DrawCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: React.ReactNode;
    description?: string;
    /** Indeterminate visual state */
    indeterminate?: boolean;
    /** ioiti-ui: it must be ticked (terms to accept): an empty box's border in the error's colour, and said (`aria-invalid`). */
    error?: boolean;
}
/**
 * DrawCheckbox — The checkmark draws itself (path length animation) and
 * settles with a tiny overshoot. The box also springs from 0.9 -> 1.02 -> 1.0
 * for a tactile "snap" feel.
 *
 * ioiti-ui: both settle without overshoot, on the design's curves (motionTransitions): the box grows from 0.9 to 1,
 * the check from 0.6 to 1 as it draws itself.
 */
export declare const DrawCheckbox: React.ForwardRefExoticComponent<DrawCheckboxProps & React.RefAttributes<HTMLInputElement>>;
