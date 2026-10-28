import type { ComponentProps, ReactNode } from 'react';
interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children' | 'aria-label'> {
    /** What it does, in words: an icon alone says nothing to a screen reader. */
    label: string;
    /** An icon of lucide-react, as an element: `<Search />`. */
    icon: ReactNode;
    /** Shown on hover, keyboard focus and a tap (a Hint, under it). */
    hint?: ReactNode;
}
/** A button that is an icon alone, as the top bar's: square, quiet until hovered. */
export declare function IconButton({ label, icon, hint, className, type, ...props }: IconButtonProps): import("react").JSX.Element;
export {};
