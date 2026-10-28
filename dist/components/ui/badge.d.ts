import * as React from "react";
import { type HTMLMotionProps } from "framer-motion";
export type BadgeVariant = "soft" | "solid" | "outline";
export type BadgeTone = "neutral" | "success" | "warning" | "danger";
export type BadgeProps = Omit<HTMLMotionProps<"span">, "children"> & {
    variant?: BadgeVariant;
    tone?: BadgeTone;
    /** Leading status dot. */
    dot?: boolean;
    /** Soft ping on the dot, use for live status only. */
    pulse?: boolean;
    /** Shows an × button (chip). */
    onRemove?: () => void;
    /** ioiti-ui: the × button's name for a screen reader: "Remove Lyon", each chip's its own ("Remove" otherwise). */
    removeLabel?: string;
    /** ioiti-ui: whether the × button is a stop of the keyboard (a field of chips removes them with Backspace). */
    removeFocusable?: boolean;
    children?: React.ReactNode;
};
export declare function Badge({ variant, tone, dot, pulse, onRemove, removeLabel, removeFocusable, className, children, ...props }: BadgeProps): React.JSX.Element;
