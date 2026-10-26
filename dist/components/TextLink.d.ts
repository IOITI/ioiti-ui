import type { ComponentProps } from 'react';
declare const LOOK: {
    /** In running text: underlined. */
    inline: string;
    /** In a list or a table, where every name is a link: underlined under the pointer. */
    hover: string;
    /** A panel's own way further ("View all"): small and quiet until hovered. */
    quiet: string;
};
interface TextLinkProps extends Omit<ComponentProps<'a'>, 'href'> {
    /** Where it leads. */
    to: string;
    variant?: keyof typeof LOOK;
}
/** A link made of words, drawn by the application's link (LinkProvider): opened in another tab with ⌘ or Ctrl. */
export declare function TextLink({ to, variant, className, ...props }: TextLinkProps): import("react").JSX.Element;
export {};
