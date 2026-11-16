import type { ReactNode } from 'react';
import type { ButtonVariant } from './ui/button.js';
/** A way to sign in through another service, an identity provider (single sign-on). */
export interface SignInProvider {
    /** Tells it from the others: what `pending` holds and `onPendingChange` gives. */
    id: string;
    /** What its button says: "Sign in with Gitea". */
    label: ReactNode;
    /**
     * The server's address that sends the browser on to the provider and takes it back
     * (`/api/v1/auth/oidc/gitea/login?next=/w/main`): its page is loaded from the server, never through the router.
     */
    href: string;
    /** Its mark, before the label: an icon, or the provider's logo (`alt=""`: the label names it). */
    icon?: ReactNode;
    /** It cannot be used now: `hint` says why. */
    disabled?: boolean;
    /** On hover, keyboard focus and a tap, and read by screen readers: what it signs in with, or why it cannot. */
    hint?: ReactNode;
}
interface SignInProvidersProps {
    /** A button the whole width for each, in this order. Without any, the form alone. */
    providers: SignInProvider[];
    /** The form of a password, beside the providers, a line between. */
    children?: ReactNode;
    /** Where the providers stand: before the form, or after it. */
    placement?: 'before' | 'after';
    /** The words on the line between the providers and the form; `''` for a line without words, `null` for none. */
    divider?: ReactNode;
    /**
     * The provider the browser is on its way to, by its id: its button busy, the others disabled. Any other id (the
     * form's own, while it is sent) leaves them all disabled; `null`, none. Left to the component when not given:
     * a plain click on one marks it (one with ⌘ or Ctrl, which opens another tab, does not).
     */
    pending?: string | null;
    /**
     * Told of the provider chosen (its id), so that the form can wait too; and of `null` when the page comes back
     * from the browser's history (Back, from the provider's page) with nothing on its way any more.
     */
    onPendingChange?: (id: string | null) => void;
    /** The providers' name for a screen reader. */
    label?: string;
    /** The look of their buttons. */
    variant?: ButtonVariant;
    className?: string;
}
/**
 * The ways to sign in through an identity provider (single sign-on), beside the form of a password: a button the
 * whole width for each, which leads to the server's address for it. Its page is loaded from the server, never
 * through the router: the server sends the browser on to the provider. Once one is chosen, its button is busy
 * and the others are disabled until the browser has left; back from the browser's history, they are as they were.
 */
export declare function SignInProviders({ providers, children, placement, divider, pending, onPendingChange, label, variant, className, }: SignInProvidersProps): import("react").JSX.Element;
export {};
