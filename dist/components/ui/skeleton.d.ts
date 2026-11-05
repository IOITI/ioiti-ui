import * as React from "react";
export interface SkeletonProps extends React.ComponentProps<"div"> {
}
/** A quiet block with a slow light sweep. Size it with className. */
export declare function Skeleton({ className, ...props }: SkeletonProps): React.JSX.Element;
export interface SkeletonTextProps {
    lines?: number;
    className?: string;
}
export declare function SkeletonText({ lines, className, }: SkeletonTextProps): React.JSX.Element;
export interface SkeletonAvatarProps {
    size?: number;
    className?: string;
}
export declare function SkeletonAvatar({ size, className }: SkeletonAvatarProps): React.JSX.Element;
export interface SkeletonRevealProps {
    loading: boolean;
    skeleton: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}
/**
 * Swap a skeleton for real content. Content eases in (fade, rise, un-blur).
 * Make the skeleton roughly the same size as the content so nothing jumps.
 */
export declare function SkeletonReveal({ loading, skeleton, children, className, }: SkeletonRevealProps): React.JSX.Element;
