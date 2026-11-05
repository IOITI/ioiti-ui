import React from 'react';
export type SplitButtonSize = 'sm' | 'md' | 'lg';
export interface SplitButtonOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    onSelect?: () => void;
    /** ioiti-ui: where it leads: the option is then a link (opened elsewhere with ⌘ or Ctrl, or from its context menu). */
    href?: string;
    /** ioiti-ui: a line under the label, in a smaller type: what the option does. */
    description?: string;
    /** ioiti-ui: an option that deletes, in the loss colour. */
    tone?: 'danger';
}
export interface SplitButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    /** Label for the primary (left) action. */
    label: string;
    /** Called when the primary action is pressed. */
    onClick?: () => void;
    /** ioiti-ui: where the primary action leads: it is then a link. */
    href?: string;
    /** ioiti-ui: what draws the links; the application's (LinkProvider) by default. */
    linkComponent?: React.ElementType;
    /** ioiti-ui: an icon before the primary label. */
    icon?: React.ReactNode;
    /** ioiti-ui: the name of the chevron and its menu (EasyUI's "More <label> options"). */
    menuLabel?: string;
    /** Dropdown options revealed by the chevron trigger. */
    options: SplitButtonOption[];
    size?: SplitButtonSize;
    /**
     * `primary` matches the light accent CTA.
     * `secondary` matches the raised control style.
     */
    variant?: 'primary' | 'secondary' | 'danger' | 'info';
    disabled?: boolean;
    className?: string;
}
/**
 * SplitButton
 *
 * A primary action fused with a secondary chevron trigger.
 *
 * Features:
 * - Primary + dropdown action split
 * - Keyboard accessible menu navigation
 * - Outside-click dismissal
 * - Escape-to-close
 * - Home / End navigation
 * - Viewport-aware dropdown placement
 * - Reduced-motion support
 * - Disabled options
 * - Framer Motion transitions
 */
export declare function SplitButton({ label, onClick, href, linkComponent, icon, menuLabel, options, size, variant, disabled, className, ...props }: SplitButtonProps): React.JSX.Element;
export default SplitButton;
