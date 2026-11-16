import React from 'react';
export interface SpotlightSearchItem {
    id: string;
    /** ioiti-ui: what it is, found first by the words typed. */
    title: string;
    /** ioiti-ui: its heading where the entries are `grouped`, said beside it otherwise; found by the words typed too. */
    category: string;
    /** ioiti-ui: a second line under its title, found by the words typed after its title, its keywords, its category. */
    description?: string;
    icon?: React.ReactNode;
    /**
     * ioiti-ui: its keys, drawn beside it: `'g o'` as `Kbd` writes them on this computer (`mod` for ⌘ or Ctrl), or each
     * key as given (`['G', 'O']`). The palette does not listen for them.
     */
    shortcut?: string | string[];
    action?: () => void;
    /** ioiti-ui: where it leads: the entry is then a link (opened elsewhere with ⌘ or Ctrl), followed with Enter too. */
    href?: string;
    /** ioiti-ui: more words it is found by, after its title. */
    keywords?: string[];
    /**
     * ioiti-ui: a list of its own ("Orders ›"): chosen, the palette lists these, its title before the field, until
     * Backspace in the empty field, Escape or its title goes back. It leads nowhere itself (its `href` and `action`
     * are not followed). Filled as they are found: `onQueryChange` names the entry whose list is shown.
     */
    items?: SpotlightSearchItem[];
    /** ioiti-ui: the field's words while its `items` are listed. */
    placeholder?: string;
}
export interface SpotlightSearchProps {
    /** ioiti-ui: open, held by the caller with `onOpenChange`; left to the palette without it. */
    open?: boolean;
    /** ioiti-ui: told when it opens and when it closes. */
    onOpenChange?: (open: boolean) => void;
    /** ioiti-ui: told once each time it closes, after `onOpenChange(false)`. */
    onClose?: () => void;
    /** ioiti-ui: the entries, listed in this order while nothing is typed, and where they are worth the same. */
    items?: SpotlightSearchItem[];
    /** ioiti-ui: the field's words while nothing is typed. */
    placeholder?: string;
    /**
     * ioiti-ui: searches made before, offered while nothing is typed: one chosen is typed again.
     * @default []
     */
    recentSearches?: string[];
    /**
     * ioiti-ui: the name of a list of the entries chosen, kept in this browser under the application's key
     * (`<themeStorageKey()>.spotlight.<name>`): the five latest, offered first while nothing is typed; Shift+Delete
     * forgets the one chosen. They outlive a sign-out: where a browser is shared, name who is signed in.
     */
    remember?: string;
    /** ioiti-ui: told of each entry chosen; not of one opened elsewhere (⌘ or Ctrl and a click, ⌘↵). */
    onSelect?: (item: SpotlightSearchItem) => void;
    /**
     * ioiti-ui: ⌘K (Ctrl K elsewhere) opens it from any page, and closes it: a `useShortcut`, listed by `?` under
     * Navigation as its `label`, waiting while another dialog is open. For a palette that only leads somewhere.
     */
    enableGlobalShortcut?: boolean;
    /**
     * ioiti-ui: what follows an entry's `href` when Enter chooses it (the router's navigate); the
     * application's (LinkProvider) by default.
     */
    onNavigate?: (href: string) => void;
    /** ioiti-ui: what draws an entry with an `href`; the application's link (LinkProvider) by default. */
    linkComponent?: React.ElementType;
    /**
     * ioiti-ui: told of what is typed, as it is typed, and of `''` as it opens or as a list of an entry opens: for
     * entries made from it. `scope`: the entry whose `items` are listed, `undefined` at the top.
     */
    onQueryChange?: (query: string, scope?: SpotlightSearchItem) => void;
    /**
     * ioiti-ui: `false` lists the entries as given, neither filtered nor ranked, the words typed still marked in them:
     * what a server found for the query (`onQueryChange`).
     */
    filter?: boolean;
    /**
     * ioiti-ui: entries are being found: said in place of the list while there is none (never "No results", not known
     * yet), the entries shown kept until new ones come. Set it as the query changes (in `onQueryChange`), before a
     * request waits.
     */
    loading?: boolean;
    /**
     * ioiti-ui: they could not be found: what went wrong (`true`: "The search failed."), in place of the list while
     * there is none, above it otherwise (the last entries found).
     */
    error?: React.ReactNode;
    /** ioiti-ui: searches again: a "Try again" beside the error. */
    onRetry?: () => void;
    /** ioiti-ui: the most entries listed at once, the best first; the others are found by typing. */
    limit?: number;
    /** ioiti-ui: what the dialog is called. */
    label?: string;
    /**
     * ioiti-ui: the entries under a heading for each category, in the order the categories first come: while
     * something is typed, the category of the best entry first.
     */
    grouped?: boolean;
    /**
     * ioiti-ui: `false` keeps it open once an entry is chosen (one without an `href`), to choose another: several
     * things attached, added, ticked. Escape or a click outside closes it.
     */
    closeOnSelect?: boolean;
    /**
     * ioiti-ui: the ids of the entries chosen already, each marked with a tick (and `aria-checked`). Choosing one again
     * calls `onSelect` again: what that means (taking it back) is the application's.
     */
    picked?: string[];
    /** ioiti-ui: under the list: what was chosen, how to finish. */
    footer?: React.ReactNode;
    /** ioiti-ui: classes for the palette itself (its panel). */
    className?: string;
}
export declare const SpotlightSearch: React.FC<SpotlightSearchProps>;
