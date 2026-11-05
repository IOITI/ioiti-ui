import React from 'react';
export interface SpringSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    description?: string;
}
export interface SpringSelectProps {
    /** Option list */
    options: SpringSelectOption[];
    /** Currently selected value (controlled) */
    value?: string;
    /** Default selected value (uncontrolled) */
    defaultValue?: string;
    /** Placeholder when no value is selected */
    placeholder?: string;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Visible label */
    label?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Error message */
    error?: string;
    /** Custom class name for the root */
    className?: string;
}
/**
 * SpringSelect — The dropdown menu follows the trigger with a tiny spring.
 * On open, the menu slides down with a slight overshoot; the chevron rotates
 * a hair past 180° before settling. Closing is a smooth ease-back.
 */
export declare const SpringSelect: React.FC<SpringSelectProps>;
