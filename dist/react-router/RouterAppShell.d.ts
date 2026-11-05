import type { ReactNode } from 'react';
import type { AppShellProps } from '../shell/AppShell.js';
type RouterAppShellProps<S extends string> = Omit<AppShellProps<S>, 'pathname' | 'children'> & {
    /** The page; the router's child routes (`<Outlet />`) by default. */
    children?: ReactNode;
};
/** AppShell, for the layout route of an application on React Router: the address is the router's. */
export declare function RouterAppShell<S extends string = string>({ children, ...props }: RouterAppShellProps<S>): import("react").JSX.Element;
export {};
