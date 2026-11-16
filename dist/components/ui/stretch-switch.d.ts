import React from 'react';
export interface StretchSwitchProps {
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    label?: React.ReactNode;
    description?: string;
    className?: string;
}
/**
 * StretchSwitch — Thumb stretches slightly while dragging/pressing,
 * then snaps naturally to its destination.
 *
 * Implementation: while pressing, the thumb is allowed to grow horizontally
 * (scaleX > 1) and slightly vertically (scaleY < 1) so it looks "stretched".
 * On release, the spring (springSnappy) handles the snap to the new x.
 *
 * ioiti-ui: the switch is named by its label and described by its description, so
 * that a screen reader says which setting it is and not only "switch, on".
 */
export declare const StretchSwitch: React.FC<StretchSwitchProps>;
