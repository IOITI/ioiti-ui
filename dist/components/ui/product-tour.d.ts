import { type ReactNode, type RefObject } from "react";
export type TourPlacement = "auto" | "top" | "bottom" | "left" | "right";
export type TourTarget = string | (() => HTMLElement | null) | RefObject<HTMLElement | null>;
export type TourStep = {
    target?: TourTarget;
    title: string;
    body: ReactNode;
    placement?: TourPlacement;
    /** Space between the element and the cutout edge (default 8) */
    padding?: number;
    /** Cutout corner radius. Defaults to the element's own radius + padding */
    radius?: number;
    /** Set false to never auto-scroll to this target */
    scroll?: boolean;
};
export type TourCloseReason = "done" | "skip" | "dismiss";
export interface ProductTourProps {
    steps: TourStep[];
    /** ioiti-ui: open, held by the page (told of each change by `onOpenChange`, of its end by `onClose`). */
    open?: boolean;
    /** ioiti-ui: open at first, the tour holding it then (it ends itself); closed by default. */
    defaultOpen?: boolean;
    /** ioiti-ui: told of every change, whoever holds it, with why it ended (`details.reason`), as `onClose` is. */
    onOpenChange?: (open: boolean, details?: {
        reason: TourCloseReason;
    }) => void;
    /** Told when it ends, and why: its last step done, skipped, or dismissed (Escape, a click beside it). */
    onClose?: (reason: TourCloseReason) => void;
    onStepChange?: (index: number) => void;
    startAt?: number;
    closeOnOverlayClick?: boolean;
}
export declare function ProductTour({ steps, open: openProp, defaultOpen, onOpenChange, onClose: onEnded, onStepChange, startAt, closeOnOverlayClick, }: ProductTourProps): import("react").ReactPortal | null;
