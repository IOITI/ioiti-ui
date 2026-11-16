import type { ReactNode } from 'react';
interface RouterRootProps {
    /** The pages; the router's child routes (`<Outlet />`) by default. */
    children?: ReactNode;
    /** Classes of the toasts' frame, to move them (above a bar fixed at the bottom of a page: `bottom-20`). */
    toastWrapperClassName?: string;
}
/**
 * The root route of an application on React Router: every link of ioiti-ui goes through the
 * router (opened in another tab with a modifier, as any link), and the toasts are shown.
 */
export declare function RouterRoot({ children, toastWrapperClassName }: RouterRootProps): import("react").JSX.Element;
export {};
