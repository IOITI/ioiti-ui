import type { MessageKit } from '../../lib/messages.js';
/** How many states of each tone stand out in StateSummary. */
type StateCounts = {
    danger: number;
    warning: number;
    success: number;
};
/** The shell: the sidebar, the skip link, the trail, the breadcrumb, the user menu, sign-in, StateSummary. */
export declare const shell: {
    /** "Skip to the page": the first stop of the keyboard, past the menu to the page (AppShell). */
    skipToPage: string;
    /** "Navigation": the name of the sidebar's drawer, on a phone. */
    navigation: string;
    /** "Open navigation": the top bar's button that opens the drawer (SidebarTrigger). */
    openNavigation: string;
    /** "Close navigation": the drawer's button that closes it. */
    closeNavigation: string;
    /** "Main": the name of the sidebar's list of pages (a navigation, which a screen reader says it is). */
    mainNavigation: string;
    /** "The pages under Orders": the chevron that opens an entry's pages, beside the entry, a page itself. */
    pagesUnder: (entry: string) => string;
    /** "Collapse": the button at the foot of the sidebar that folds it to its rail, as it shows. */
    collapse: string;
    /** "sidebar": what a screen reader hears after Collapse ("Collapse sidebar"), hidden from the eye. */
    collapseTarget: string;
    /** "Expand": the tip of that button once the sidebar is folded, beside its keys. */
    expand: string;
    /** "Expand sidebar": that button's name once the sidebar is folded. */
    expandSidebar: string;
    /** "with counts": badges out of sight (a section folded, an entry closed, the rail), counts all of them. */
    unseenCounts: string;
    /** "with a warning": badges out of sight, the gravest a warning. */
    unseenWarning: string;
    /** "with something wrong": badges out of sight, the gravest something wrong. */
    unseenWrong: string;
    /** "Orders, 38", "Orders, with a warning": an entry of the rail named with its badge, or what its pages' say. */
    entryWithBadge: ({ entry, badge }: {
        entry: string;
        badge: string;
    }) => string;
    /** "Breadcrumb": the name of the trail of where the page is (the top bar's, Breadcrumb's). */
    breadcrumb: string;
    /** "Show hidden pages": the button of a long trail that shows the steps folded into "…". */
    showHiddenPages: string;
    /** "Home": the first step of the top bar's trail, where AppShell is given no `home`. */
    home: string;
    /** "Page not found": the trail's step and the tab's name for an address that is no page of the menu. */
    pageNotFound: string;
    /** "Account": the name of UserMenu's menu. */
    account: string;
    /** "Sign out": UserMenu's last item. */
    signOut: string;
    /** "Single sign-on": the name of SignInProviders' list of providers. */
    singleSignOn: string;
    /** "or": the words on the line between the providers and the form of a password. */
    signInDivider: string;
    /** "State": StateSummary's name, its button's and its panel's. */
    state: string;
    /** "All good": what StateSummary says while nothing stands out and nothing is neutral. */
    allGood: string;
    /** "State: Payments down": StateSummary's button as a screen reader hears it, its name and what it says. */
    stateButton: ({ label, state }: {
        label: string;
        state: string;
    }) => string;
    /** "Payments down (1 to fix, 1 to watch)": the gravest state, then how many of each tone, where several stand out. */
    stateLead: ({ lead, counts }: {
        lead: string;
        counts: string;
    }) => string;
    /** "1 to fix, 2 to watch": how many states of each tone stand out, the tones without one left out. */
    stateCounts: ({ danger, warning, success }: StateCounts, { plural }: MessageKit) => string;
};
export {};
