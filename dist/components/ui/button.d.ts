import React from 'react';
import { type HTMLMotionProps } from 'framer-motion';
export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'link' | 'gradient';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon';
export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    /** Visual presentation style */
    variant?: ButtonVariant;
    /** Dimension scale */
    size?: ButtonSize;
    /** Loading state displaying an animated spinner */
    isLoading?: boolean;
    /** Text or element displayed during loading */
    loadingText?: string;
    /** Icon placed before the button children */
    leftIcon?: React.ReactNode;
    /** Icon placed after the button children */
    rightIcon?: React.ReactNode;
    /** Expand button to fill 100% of container width */
    fullWidth?: boolean;
    /** Button content */
    children?: React.ReactNode;
}
/** ioiti-ui: the box of a button's icon, before or after its words (Button, ButtonLink). */
export declare function buttonIconClassName(size?: ButtonSize): string;
/**
 * ioiti-ui: the box of a button's words: cut short with an ellipsis where the button is held narrower than them
 * (a `max-w-*`), its icons kept whole; they pushed the icon after them out of the button.
 */
export declare const BUTTON_LABEL_CLASS = "min-w-0 truncate";
/**
 * ioiti-ui: the classes of a button of this variant and size, for a link that looks like one
 * (`components/ButtonLink.tsx`): what leads to another page is a link.
 */
export declare function buttonClassName({ variant, size, fullWidth, className, }: Pick<ButtonProps, 'variant' | 'size' | 'fullWidth'> & {
    className?: string;
}): string;
export declare const Button: React.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
