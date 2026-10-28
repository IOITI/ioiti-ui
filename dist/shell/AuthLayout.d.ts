import type { ReactNode } from 'react';
interface AuthLayoutProps {
    /** The heading: the application's name. */
    title: string;
    /** What signing in asks for. */
    description?: ReactNode;
    /** In the tile above the heading: a lock by default. */
    icon?: ReactNode;
    /** The theme can be chosen before signing in: this page is the first one seen. */
    themeToggle?: boolean;
    /** The tab's title; the heading by default. */
    tabTitle?: string;
    /** The form. */
    children: ReactNode;
}
/** The page of a sign-in, outside the shell: one card in the middle of the screen. */
export declare function AuthLayout({ title, description, icon, themeToggle, tabTitle, children }: AuthLayoutProps): import("react").JSX.Element;
export {};
