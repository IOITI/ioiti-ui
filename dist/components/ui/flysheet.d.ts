import * as React from "react";
export type SheetSide = "right" | "left" | "top" | "bottom";
/** ioiti-ui: a side sheet's width: 22, 26 (EasyUI's) or 40 rem, or pixels. */
export type SheetSize = "sm" | "md" | "lg" | number;
/** ioiti-ui: over the page, or beside it, the page pushed aside (a side sheet, from `pushMinWidth`). */
export type SheetType = "overlay" | "push";
/** ioiti-ui: the padding of a sheet's header, body and footer. */
export type SheetPadding = "none" | "sm" | "md" | "lg";
/** ioiti-ui: why a sheet closed, given to `onOpenChange` with `false`. */
export type SheetCloseReason = "close-button" | "escape" | "outside-click" | "drag" | "trigger" | "parent";
export interface SheetProps {
    open?: boolean;
    defaultOpen?: boolean;
    /** ioiti-ui: with why it closed (`details.reason`). */
    onOpenChange?: (open: boolean, details?: {
        reason: SheetCloseReason;
    }) => void;
    children: React.ReactNode;
}
export declare function Sheet({ open, defaultOpen, onOpenChange, children }: SheetProps): React.JSX.Element;
/** The props of `SheetTrigger`: a `<button>`'s. */
export type SheetTriggerProps = React.ComponentProps<"button">;
/** Unstyled button, bring your own classes. ioiti-ui: it closes the sheet too (one that leaves it in reach). */
export declare function SheetTrigger({ onClick, ...props }: SheetTriggerProps): React.JSX.Element;
/** The props of `SheetClose`: a `<button>`'s. */
export type SheetCloseProps = React.ComponentProps<"button">;
export declare function SheetClose({ onClick, ...props }: SheetCloseProps): React.JSX.Element;
export interface SheetContentProps {
    /** The side it comes from. A child takes its parent's. */
    side?: SheetSide;
    /** ioiti-ui: a side sheet's width: `sm` (22 rem), `md` (26 rem, EasyUI's) or `lg` (40 rem), or pixels. */
    size?: SheetSize;
    /**
     * ioiti-ui: `push` pushes the page aside (the body's margin) instead of covering it: a side sheet, from a
     * window `pushMinWidth` wide; narrower, it is drawn over the page. Without a backdrop, it leaves the focus free.
     */
    type?: SheetType;
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
    padding?: SheetPadding;
    /** ioiti-ui: its close button (true), as every layer names it (`showCloseButton`). */
    showCloseButton?: boolean;
    /** ioiti-ui: the close button inside the panel, or outside it, on the side facing the page. */
    closePosition?: "inside" | "outside";
    /** ioiti-ui: its name, for a sheet without a SheetTitle. */
    "aria-label"?: string;
    className?: string;
    children: React.ReactNode;
}
export declare function SheetContent({ side: sideProp, size, type, pushMinWidth, modal: modalProp, closeOnOutsideClick, resizable, minWidth, maxWidth, onResize, padding, showCloseButton, closePosition, "aria-label": ariaLabel, className, children, }: SheetContentProps): React.JSX.Element | null;
/** The props of `SheetHeader`: a `<div>`'s. */
export type SheetHeaderProps = React.ComponentProps<"div">;
export declare function SheetHeader({ className, ...props }: SheetHeaderProps): React.JSX.Element;
/** The props of `SheetTitle`: an `<h2>`'s. */
export type SheetTitleProps = React.ComponentProps<"h2">;
export declare function SheetTitle({ className, ...props }: SheetTitleProps): React.JSX.Element;
/** The props of `SheetDescription`: a `<p>`'s. */
export type SheetDescriptionProps = React.ComponentProps<"p">;
export declare function SheetDescription({ className, ...props }: SheetDescriptionProps): React.JSX.Element;
/** The props of `SheetBody`: a `<div>`'s. */
export type SheetBodyProps = React.ComponentProps<"div">;
export declare function SheetBody({ className, onScroll, ref, ...props }: SheetBodyProps): React.JSX.Element;
/** The props of `SheetFooter`: a `<div>`'s. */
export type SheetFooterProps = React.ComponentProps<"div">;
export declare function SheetFooter({ className, ...props }: SheetFooterProps): React.JSX.Element;
