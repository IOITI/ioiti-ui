import type { ReactNode } from 'react';
import type { AppShellProps } from '../shell/AppShell.js';
/** The props of `RouterAppShell`. */
export type RouterAppShellProps<S extends string = string> = Omit<AppShellProps<S>, 'pathname' | 'hash' | 'search' | 'children'> & {
    /** The page; the router's child routes (`<Outlet />`) by default. */
    children?: ReactNode;
};
/** AppShell, for the layout route of an application on React Router: the address is the router's, its query and part too. */
export declare function RouterAppShell<S extends string = string>({ children, ...props }: RouterAppShellProps<S>): import("react").JSX.Element;
