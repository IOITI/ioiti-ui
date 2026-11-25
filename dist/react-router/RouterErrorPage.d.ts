export interface RouterErrorPageProps {
    /**
     * Whether the error is told to IoitiProvider's `onError` (once): yes, unless the application reports the router's
     * errors itself (RouterProvider's `onError`).
     */
    report?: boolean;
    /**
     * Where a person signs in, for a 401 (a session that ended): a link, "Sign in" in the provider's language unless its
     * `label` says otherwise, in place of the way home. Without it, the way home.
     */
    signIn?: {
        href: string;
        label?: string;
    };
    /**
     * Its heading takes the focus as it appears, as a page's does: yes, but in a shell drawn in a part of a page (which
     * names no tab), and `false` where a router is drawn in a part of a page.
     */
    focusOnMount?: boolean;
}
/**
 * What a route shows when it fails (a route's `errorElement`): its loader threw, its page threw as it drew, or its
 * code failed to load. A response of 404 is the page not found; 401, a session to sign in again; 403, a page the person
 * may not see; anything else, an ErrorState whose Try again runs the route again (its loader, its page), the shell's
 * `pending` bar showing meanwhile. On a route under the shell's (`RouterAppShell`'s) that holds every page, the shell
 * stays around it; on the root, it stands alone, its links then loading their page.
 */
export declare function RouterErrorPage({ report, signIn, focusOnMount }: RouterErrorPageProps): import("react").JSX.Element;
