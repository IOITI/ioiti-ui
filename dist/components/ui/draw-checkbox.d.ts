import React from 'react';
export interface DrawCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: React.ReactNode;
    description?: string;
    /** Indeterminate visual state */
    indeterminate?: boolean;
}
/**
 * DrawCheckbox — The checkmark draws itself (path length animation) and
 * settles with a tiny overshoot. The box also springs from 0.9 -> 1.02 -> 1.0
 * for a tactile "snap" feel.
 */
export declare const DrawCheckbox: React.ForwardRefExoticComponent<DrawCheckboxProps & React.RefAttributes<HTMLInputElement>>;
