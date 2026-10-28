import type { ComponentProps, ReactNode } from 'react';
import type { ButtonSize, ButtonVariant } from './ui/button.js';
interface ButtonLinkProps extends Omit<ComponentProps<'a'>, 'href' | 'className'> {
    /** Where it leads. Nothing: a button that cannot be pressed, there being nowhere to go (no day before the first). */
    to: string | null | undefined;
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    className?: string;
}
/**
 * What leads to another page, drawn as a button: a link, so that it can be opened in another tab
 * (a right click, a middle click, ⌘ or Ctrl and a click) as well as followed. Drawn by the
 * application's link (LinkProvider).
 */
export declare function ButtonLink({ to, variant, size, leftIcon, rightIcon, className, children, ...props }: ButtonLinkProps): import("react").JSX.Element;
export {};
