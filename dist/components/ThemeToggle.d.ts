/** The props of `ThemeToggle`. */
export interface ThemeToggleProps {
    className?: string;
}
/**
 * One button for three states: follow the system, light, dark. Its icon is the
 * state it is in, and its label says both that and what a press does, since an
 * icon alone cannot ("Theme: follows the system (dark now). Press for always light."), in the provider's language.
 */
export declare function ThemeToggle({ className }: ThemeToggleProps): import("react").JSX.Element;
