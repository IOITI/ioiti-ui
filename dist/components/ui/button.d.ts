import React from 'react';
import { type HTMLMotionProps } from 'framer-motion';
export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'link' | 'gradient';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';
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
/**
 * ioiti-ui: the classes of a button of this variant and size, for a link that looks like one
 * (`components/ButtonLink.tsx`): what leads to another page is a link.
 */
export declare function buttonClassName({ variant, size, fullWidth, className, }: Pick<ButtonProps, 'variant' | 'size' | 'fullWidth'> & {
    className?: string;
}): string;
export declare const Button: React.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
