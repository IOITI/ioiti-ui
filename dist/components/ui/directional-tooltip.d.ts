import React from 'react';
export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
export type TooltipAlign = 'start' | 'center' | 'end';
export interface TooltipProps {
    /** Trigger element(s) */
    children: React.ReactElement;
    /** Tooltip content */
    content: React.ReactNode;
    /** Preferred side; may be flipped if there's no space (auto by default) */
    side?: TooltipSide;
    /** Alignment along the side */
    align?: TooltipAlign;
    /** Delay before showing, in ms */
    delayDuration?: number;
    /** Whether to show an arrow */
    showArrow?: boolean;
    /** Offset from the trigger in px */
    offset?: number;
    className?: string;
    /** ioiti-ui: the classes of the span around the trigger (a full-width field keeps its width). */
    wrapperClassName?: string;
    /** Force the tooltip to always be visible (for design previews) */
    forceOpen?: boolean;
}
/**
 * Tooltip — Appears from the direction it originates.
 * The tooltip starts a small distance outside the trigger in its preferred
 * direction and springs inward, so the user perceives it as materializing
 * from the trigger toward the content.
 *
 * ioiti-ui: EasyUI's DirectionalTooltip, named after its role.
 */
export declare const Tooltip: React.FC<TooltipProps>;
/** @deprecated Use `Tooltip`. Removed in 1.0. */
export declare const DirectionalTooltip: React.FC<TooltipProps>;
/** @deprecated Use `TooltipProps`. Removed in 1.0. */
export type DirectionalTooltipProps = TooltipProps;
