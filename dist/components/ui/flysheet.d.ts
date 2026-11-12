import * as React from "react";
export type FlysheetSide = "right" | "left" | "top" | "bottom";
/** ioiti-ui: a side sheet's width: 22, 26 (EasyUI's) or 40 rem, or pixels. */
export type FlysheetSize = "sm" | "md" | "lg" | number;
/** ioiti-ui: over the page, or beside it, the page pushed aside (a side sheet, from `pushMinWidth`). */
export type FlysheetType = "overlay" | "push";
/** ioiti-ui: the padding of a sheet's header, body and footer. */
export type FlysheetPadding = "none" | "sm" | "md" | "lg";
/** ioiti-ui: why a sheet closed, given to `onOpenChange` with `false`. */
export type FlysheetCloseReason = "close-button" | "escape" | "outside-click" | "drag" | "trigger" | "parent";
export interface FlysheetProps {
    open?: boolean;
    defaultOpen?: boolean;
    /** ioiti-ui: with why it closed (`details.reason`). */
    onOpenChange?: (open: boolean, details?: {
        reason: FlysheetCloseReason;
    }) => void;
    children: React.ReactNode;
}
export declare function Flysheet({ open, defaultOpen, onOpenChange, children }: FlysheetProps): React.JSX.Element;
/** Unstyled button, bring your own classes. ioiti-ui: it closes the sheet too (one that leaves it in reach). */
export declare function FlysheetTrigger({ onClick, ...props }: React.ComponentProps<"button">): React.JSX.Element;
export declare function FlysheetClose({ onClick, ...props }: React.ComponentProps<"button">): React.JSX.Element;
export interface FlysheetContentProps {
    /** The side it comes from. A child takes its parent's. */
    side?: FlysheetSide;
    /** ioiti-ui: a side sheet's width: `sm` (22 rem), `md` (26 rem, EasyUI's) or `lg` (40 rem), or pixels. */
    size?: FlysheetSize;
    /**
     * ioiti-ui: `push` pushes the page aside (the body's margin) instead of covering it: a side sheet, from a
     * window `pushMinWidth` wide; narrower, it is drawn over the page. Without a backdrop, it leaves the focus free.
     */
    type?: FlysheetType;
    /** ioiti-ui: the window's width from which a `push` sheet pushes the page (1024 px). */
    pushMinWidth?: number;
    /** ioiti-ui: a backdrop, and the focus held in the sheet (true); false leaves the page in use. A child takes its parent's. */
    modal?: boolean;
    /** ioiti-ui: a click outside closes the sheet: true when it is modal (on its backdrop), false otherwise. */
    closeOnOutsideClick?: boolean;
    /** ioiti-ui: a side sheet the reader may widen or narrow, by its inner edge or with the arrow keys on it. */
    resizable?: boolean;
    /** ioiti-ui: in pixels (280). */
    minWidth?: number;
    /** ioiti-ui: in pixels; 88% of the window at most in any case. */
    maxWidth?: number;
    /** ioiti-ui: the width the reader gave, in pixels. */
    onResize?: (width: number) => void;
    /** ioiti-ui: the padding of its header, body and footer (`md`, EasyUI's). */
    padding?: FlysheetPadding;
    showClose?: boolean;
    /** ioiti-ui: the close button inside the panel, or outside it, on the side facing the page. */
    closePosition?: "inside" | "outside";
    /** ioiti-ui: its name, for a sheet without a FlysheetTitle. */
    "aria-label"?: string;
    className?: string;
    children: React.ReactNode;
}
export declare function FlysheetContent({ side: sideProp, size, type, pushMinWidth, modal: modalProp, closeOnOutsideClick, resizable, minWidth, maxWidth, onResize, padding, showClose, closePosition, "aria-label": ariaLabel, className, children, }: FlysheetContentProps): React.JSX.Element | null;
export declare function FlysheetHeader({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
export declare function FlysheetTitle({ className, ...props }: React.ComponentProps<"h2">): React.JSX.Element;
export declare function FlysheetDescription({ className, ...props }: React.ComponentProps<"p">): React.JSX.Element;
export declare function FlysheetBody({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
export declare function FlysheetFooter({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
