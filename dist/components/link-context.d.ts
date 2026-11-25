import type { ElementType } from 'react';
/** Follows an address from code: a path, or a step in the history (-1: back). */
export type NavigateTo = (to: string | number) => void;
export interface LinkSettings {
    /** What draws a link, given `href` and the props of an `<a>`. */
    component: ElementType;
    navigate: NavigateTo;
}
export declare const LinkContext: import("react").Context<LinkSettings>;
/** The link a component draws: the one it was given, else the application's (LinkProvider), else `<a>`. */
export declare function useLinkComponent(given?: ElementType): ElementType;
/** Follows an address from code, through the application's router when it gave one (LinkProvider). */
export declare function useNavigateTo(): NavigateTo;
