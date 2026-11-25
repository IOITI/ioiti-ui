import type { ComponentProps, ReactNode } from 'react';
import type { ButtonSize, ButtonVariant } from './ui/button.js';
/** The props of `ButtonLink`. */
export interface ButtonLinkProps extends Omit<ComponentProps<'a'>, 'href' | 'className'> {
    /** Where it leads. Nothing: a button that cannot be pressed, there being nowhere to go (no day before the first). */
    href: string | null | undefined;
    /**
     * Its page is loaded from the server: a plain `<a>`, not the application's link. For an address the server
     * answers, which the router would look for among the application's own pages and not find: a sign-in that
     * sends the browser on to an identity provider (`/api/v1/auth/oidc/gitea/login?next=/w/main`), a file, another
     * application on the same site. The address is followed as written, without the router's base path.
     */
    reloadDocument?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
    /**
     * On its way, as a `Button`'s: the browser sent on to where it leads (an identity provider). A spinner in place of
     * its icon, said busy, and a click does nothing meanwhile; it stays the link it is, which the browser follows.
     */
    pending?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    className?: string;
}
/**
 * What leads to another page, drawn as a button: a link, so that it can be opened in another tab
 * (a right click, a middle click, ⌘ or Ctrl and a click) as well as followed. Drawn by the
 * application's link (LinkProvider), or by a plain `<a>` for a page the server answers (`reloadDocument`).
 */
export declare function ButtonLink({ href, reloadDocument, variant, size, pending, leftIcon, rightIcon, className, children, onClick, ...props }: ButtonLinkProps): import("react").JSX.Element;
