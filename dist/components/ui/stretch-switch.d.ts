import React from 'react';
import type { SwitchProps } from './form.js';
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
 *
 * @deprecated Use `Switch`, the form's, which takes the same props and is drawn as the design's switch. Removed in 1.0.
 */
export declare const StretchSwitch: React.FC<SwitchProps>;
/** @deprecated Use `SwitchProps`. Removed in 1.0. */
export type StretchSwitchProps = SwitchProps;
