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
    children?: React.ReactNode;
};
export declare function Badge({ variant, tone, dot, pulse, onRemove, className, children, ...props }: BadgeProps): React.JSX.Element;
