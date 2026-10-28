import type { ReactElement, ReactNode } from 'react';
import type { TooltipSide } from './ui/directional-tooltip.js';
interface HintProps {
    content: ReactNode;
    children: ReactElement;
    side?: TooltipSide;
    /**
     * For what takes no focus of its own: a disabled control (which takes no pointer either: the
     * wrapper gets its hover and its tap) or a plain text. The wrapper then takes the focus, so that a
     * keyboard reaches the hint too.
     */
    wrap?: boolean;
    /** The classes of the span around it: a full-width field keeps its width (`flex w-full`). */
    className?: string;
}
/**
 * What a `title` said, shown on hover, on keyboard focus and on a tap, and read by screen readers:
 * a title shows on none of a phone, a keyboard or a disabled control. EasyUI's tooltip.
 */
export declare function Hint({ content, children, side, wrap, className }: HintProps): import("react").JSX.Element;
export {};
