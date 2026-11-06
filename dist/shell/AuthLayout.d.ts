import type { ReactNode } from 'react';
interface AuthLayoutProps {
    /** The heading: the application's name. */
    title: string;
    /** What signing in asks for. */
    description?: ReactNode;
    /**
     * The application's mark, above the heading in place of the tile and its icon. The heading names the
     * application: a picture that says the name again says nothing more (`alt=""`).
     */
    logo?: ReactNode;
    /** In the tile above the heading: a lock by default. Not drawn with a `logo`. */
    icon?: ReactNode;
    /**
     * Above the form: what the last attempt came to, or what to do first, as an `Alert` ("This Gitea account is
     * not linked to an account here: sign in with your password, then link it from your profile").
     */
    notice?: ReactNode;
    /** Under the form, apart from it at the foot of the card: help, a way further ("Need an account? Ask an administrator."). */
    footer?: ReactNode;
    /** The theme can be chosen before signing in: this page is the first one seen. */
    themeToggle?: boolean;
    /** The tab's title; the heading by default. */
    tabTitle?: string;
    /** The form. */
    children: ReactNode;
}
/**
 * The page of a sign-in, outside the shell: one card in the middle of the screen. The application's mark (or a
 * lock) above its name, a notice above the form, help at the card's foot.
 */
export declare function AuthLayout({ title, description, logo, icon, notice, footer, themeToggle, tabTitle, children }: AuthLayoutProps): import("react").JSX.Element;
export {};
