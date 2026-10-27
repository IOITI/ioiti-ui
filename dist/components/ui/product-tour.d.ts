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
    open: boolean;
    onClose: (reason: TourCloseReason) => void;
    onStepChange?: (index: number) => void;
    startAt?: number;
    closeOnOverlayClick?: boolean;
}
export declare function ProductTour({ steps, open, onClose, onStepChange, startAt, closeOnOverlayClick, }: ProductTourProps): import("react").ReactPortal | null;
