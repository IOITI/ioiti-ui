import type { KeyboardEvent, MouseEvent, ReactElement, ReactNode, Ref } from 'react';
import type { AnchorAlign, AnchorSide } from '../lib/anchor.js';
interface TriggerProps {
    ref?: Ref<HTMLElement>;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    hint?: ReactNode;
}
interface PopoverProps {
    /** What opens it: a button that takes a ref (`Button`, `IconButton`), given the popover's props. */
    trigger: ReactElement<TriggerProps>;
    /** What it holds, or a function of `close`, for a control in it that closes it. */
    children: ReactNode | ((close: () => void) => ReactNode);
    /** Its name for a screen reader: "Filters". */
    label: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    side?: AnchorSide;
    align?: AnchorAlign;
    /** Its width: the trigger's, a number of pixels, or its content's (the default). */
    width?: 'trigger' | number | 'auto';
    className?: string;
}
/**
 * A panel that opens beside a button: filters, a few settings, a form of one field. In `document.body`, out
 * of every parent that would cut it, beside its button where the window has room; the focus goes into it,
 * and Escape, a Tab past its ends or a press elsewhere closes it and gives the focus back. Not modal: the
 * page stays in use. For a list of actions, `DropdownMenu`; for what asks for a decision, `SettleModal`.
 */
export declare function Popover({ trigger, children, label, open, defaultOpen, onOpenChange, side, align, width, className, }: PopoverProps): import("react").JSX.Element;
export {};
