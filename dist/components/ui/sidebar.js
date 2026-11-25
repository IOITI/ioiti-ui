"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, PanelLeft, X } from "lucide-react";
// ioiti-ui: held by its caller or by itself, as every control (useControllableState): its own copy is gone.
import { useControllableState } from "../../lib/controllable.js";
import { ariaKeyShortcuts, keysText } from "../../lib/keys.js";
import { isPlainClick } from "../../lib/links.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
// ioiti-ui: the drawer keeps the focus as every layer over the page does (focus-scope.ts), and has a close button.
import { useFocusScope } from "../../lib/focus-scope.js";
import { CLOSE_MD, PRESSABLE, SCRIM, TOOLTIP } from "../../lib/recipes.js";
import { cn } from "../../lib/utils.js";
import { DropdownMenu } from "../DropdownMenu.js";
import { Kbd } from "../Kbd.js";
import { LinkContext, useLinkComponent } from "../link-context.js";
// ioiti-ui: its words in the provider's language (the catalogue's `shell`, its shortcut's `shortcuts`, its keys' `keys`).
import { useMessages } from "../locale-context.js";
import { useShortcut } from "../shortcuts-context.js";
// ioiti-ui: the sheets' and the drawer's motion, the design's own (EasyUI's was 420/36/0.8): its width,
// its pill and its dot too.
const spring = motionTransitions.springSheet;
// ioiti-ui: the sidebar stays beside the page from md up; below, it is a drawer. Asked only where
// the browser can answer (jsdom has no matchMedia).
/** ioiti-ui: the keys that collapse and expand it, as useShortcut and Kbd take them. */
const TOGGLE_KEYS = "mod+b";
const isWide = () => typeof window.matchMedia === "function" && window.matchMedia("(min-width: 768px)").matches;
const EXPANDED = 248;
const COLLAPSED = 56;
// ioiti-ui: the sections each reader folded (true) or unfolded (false), by key. The browser may refuse to keep them
// (a private window, blocked storage): the sidebar then forgets them, and works the same.
const FOLDS_KEY = "ioiti-ui.sidebar.folded";
function readFolds() {
    try {
        const raw = window.localStorage.getItem(FOLDS_KEY);
        const value = raw ? JSON.parse(raw) : {};
        return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    }
    catch {
        return {};
    }
}
function keepFold(key, folded) {
    try {
        window.localStorage.setItem(FOLDS_KEY, JSON.stringify({ ...readFolds(), [key]: folded }));
    }
    catch {
        // Not kept: the choice lasts as long as the page.
    }
}
const sectionKey = (section, index) => section.id ?? section.title ?? String(index);
/** The foldable sections shown unfolded: the reader's choice, else folded; the one holding the page shown, unfolded. */
function unfoldedOf(sections, activeId, folds, previous) {
    const unfolded = new Set();
    sections.forEach((section, index) => {
        if (!section.foldable)
            return;
        const key = sectionKey(section, index);
        const holdsPage = section.items.some((item) => item.id === activeId || item.children?.some((c) => c.id === activeId));
        if (holdsPage || (previous ? previous.has(key) : folds[key] === false))
            unfolded.add(key);
    });
    return unfolded;
}
/** ioiti-ui: the entries open on their children: the reader's, and the one that is, or holds, the page shown. */
function openOf(sections, activeId, chosen) {
    const open = new Set(chosen);
    for (const item of sections.flatMap((section) => section.items)) {
        if (item.children?.length && (item.id === activeId || item.children.some((c) => c.id === activeId)))
            open.add(item.id);
    }
    return open;
}
// ioiti-ui: a state's badge, in the tone's text colour (4.5:1 on every surface of every look), its dot beside it.
const BADGE_TONE = {
    warning: "text-warning",
    danger: "text-negative",
};
/**
 * ioiti-ui: what badges say while they are out of sight (an entry closed, a section folded, the rail): nothing, a
 * count (neutral), or the gravest state among them.
 */
function gravestBadge(entries) {
    const badged = entries.filter((c) => c.badge !== undefined);
    if (!badged.length)
        return null;
    if (badged.some((c) => c.badgeTone === "danger"))
        return "danger";
    if (badged.some((c) => c.badgeTone === "warning"))
        return "warning";
    return "neutral";
}
const childrenBadge = (item) => gravestBadge(item.children ?? []);
/**
 * ioiti-ui: what a screen reader hears of badges out of sight, after the name of what holds them ("Orders, with a
 * warning"), and the rail's tip says after it: in the provider's language.
 */
function useUnseenWords() {
    const words = useMessages().shell;
    return { neutral: words.unseenCounts, warning: words.unseenWarning, danger: words.unseenWrong };
}
/**
 * ioiti-ui: between an entry's name and its badge, for a screen reader alone: "Orders, 38", not "Orders38" (the two
 * are drawn apart, nothing written between them).
 */
function BadgeSeparator() {
    // As UserMenu says its detail: the comma alone hidden, the space a text of its own (inside the hidden span, it was
    // trimmed away: "Orders,38").
    return (_jsxs(_Fragment, { children: [_jsx("span", { className: "sr-only", children: "," }), " "] }));
}
/** ioiti-ui: the dot that says badges are out of sight, in the gravest tone among them; a count's in grey. */
function UnseenDot({ tone, className }) {
    return (_jsx("span", { "aria-hidden": true, className: cn("size-1.5 shrink-0 rounded-full", tone === "neutral" ? "bg-muted-foreground accent:bg-brand" : cn("bg-current", BADGE_TONE[tone]), className) }));
}
// ioiti-ui: the rail kept or not, by the key an application gives (`collapsedStorageKey`); the browser may refuse to
// keep it, and the sidebar then opens as `defaultCollapsed` says.
function readCollapsed(key) {
    if (!key)
        return undefined;
    try {
        const raw = window.localStorage.getItem(key);
        return raw === "true" ? true : raw === "false" ? false : undefined;
    }
    catch {
        return undefined;
    }
}
function keepCollapsed(key, collapsed) {
    if (!key)
        return;
    try {
        window.localStorage.setItem(key, String(collapsed));
    }
    catch {
        // Not kept: the choice lasts as long as the page.
    }
}
const SidebarContext = React.createContext({ collapsed: false });
/** Use inside `header` / `footer` to adapt to the icon-only state. */
export const useSidebar = () => React.useContext(SidebarContext);
export function Sidebar({ collapsed: collapsedProp, defaultCollapsed = false, onCollapsedChange, collapsedStorageKey, mobileOpen: mobileProp, onMobileOpenChange, drawerId, className, ...content }) {
    // ioiti-ui: the reader's choice kept, read once, as the sidebar is first drawn; then held as every state is
    // (useControllableState), each choice kept while the sidebar holds it.
    const [kept] = React.useState(() => readCollapsed(collapsedStorageKey));
    const [collapsed, setShown] = useControllableState(collapsedProp, kept ?? defaultCollapsed, onCollapsedChange);
    const setCollapsed = (next) => {
        if (collapsedProp === undefined)
            keepCollapsed(collapsedStorageKey, next);
        setShown(next);
    };
    const [mobileOpen, setMobileOpen] = useControllableState(mobileProp, false, onMobileOpenChange);
    // ioiti-ui: its words, and its shortcut's, in the provider's language.
    const { shell: words, shortcuts } = useMessages();
    // ioiti-ui: ⌘B on an Apple computer, Ctrl B elsewhere (useShortcut), listed by ShortcutsDialog.
    useShortcut(TOGGLE_KEYS, () => {
        if (isWide())
            setCollapsed(!collapsed);
        else
            setMobileOpen(!mobileOpen);
    }, { description: shortcuts.toggleSidebar, group: shortcuts.navigation });
    // drawer: scroll lock
    React.useEffect(() => {
        if (!mobileOpen || isWide())
            return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [mobileOpen]);
    // ioiti-ui: the drawer is a dialog (aria-modal), and keeps the focus as one does (useFocusScope): moved in, on the
    // page shown (where the reader is), kept in by Tab, given back to what opened it; Escape closes it. It had none of
    // it: the focus stayed behind it, on the page its scrim covers.
    const drawerRef = React.useRef(null);
    useFocusScope(drawerRef, {
        active: mobileOpen && !isWide(),
        initialFocus: () => drawerRef.current?.querySelector('[aria-current="page"]'),
        onEscape: () => setMobileOpen(false),
    });
    return (_jsxs(_Fragment, { children: [_jsx(motion.aside, { initial: false, animate: { width: collapsed ? COLLAPSED : EXPANDED }, transition: spring, className: cn(
                // ioiti-ui: glass under the glass material (glass-bar), as the drawer below (glass-float), its scrim lighter.
                // In dark, the page's own ground (background), as the design's: on the dark surface, a row's hover and the
                // pill of the page shown (surface-hover) would hardly show.
                "hidden h-full shrink-0 overflow-hidden border-r border-border bg-surface md:block dark:bg-background glass-bar", className), children: _jsx(Panel, { ...content, collapsed: collapsed, onToggle: () => setCollapsed(!collapsed) }) }), createPortal(_jsx(AnimatePresence, { children: mobileOpen && (_jsxs("div", { className: "fixed inset-0 z-50 md:hidden over-page", children: [_jsx(motion.div, { "aria-hidden": true, className: cn("absolute inset-0", SCRIM), initial: { opacity: 0 }, animate: { opacity: 1 }, 
                            // ioiti-ui: the scrims' motion: easeFast arriving, easeExit leaving.
                            exit: { opacity: 0, transition: motionTransitions.easeExit }, transition: motionTransitions.easeFast, onClick: () => setMobileOpen(false) }), _jsxs(motion.aside, { ref: drawerRef, id: drawerId, role: "dialog", "aria-modal": "true", "aria-label": words.navigation, className: "absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] overflow-hidden border-r border-border bg-surface shadow-elevated dark:bg-background glass-float", initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" }, transition: spring, drag: "x", dragConstraints: { left: 0, right: 0 }, dragElastic: { left: 0.5, right: 0 }, dragMomentum: false, onDragEnd: (_, info) => {
                                if (info.offset.x < -80 || info.velocity.x < -400)
                                    setMobileOpen(false);
                            }, children: [_jsx("button", { type: "button", "aria-label": words.closeNavigation, onClick: () => setMobileOpen(false), className: cn(CLOSE_MD, "focus-ring absolute right-3 top-3 z-10"), children: _jsx(X, {}) }), _jsx(Panel, { ...content, collapsed: false, onNavigate: () => setMobileOpen(false) })] })] }, "drawer")) }), document.body)] }));
}
/** Put anywhere (e.g. your top bar). Only visible below md. ioiti-ui: named in the provider's language ("Open navigation"). */
export function SidebarTrigger({ className, ...props }) {
    const words = useMessages().shell;
    return (_jsx("button", { type: "button", "aria-label": words.openNavigation, className: cn(
        // ioiti-ui: pressed, it gives, as the top bar's other buttons do (motion-safe:).
        "grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-surface-hover hover:text-foreground md:hidden", PRESSABLE, className), ...props, children: _jsx(PanelLeft, { className: "size-[18px]" }) }));
}
function Panel({ sections, activeId, onActiveChange, linkComponent, header, footer, collapsed, onToggle, onNavigate, }) {
    const LinkComponent = useLinkComponent(linkComponent);
    // ioiti-ui: its words and its keys' in the provider's language.
    const { shell: words, keys: keyWords } = useMessages();
    const unseenWords = useUnseenWords();
    const uid = React.useId();
    const [hoverBox, setHoverBox] = React.useState(null);
    const [hovering, setHovering] = React.useState(false);
    const [tip, setTip] = React.useState(null);
    // ioiti-ui: the entries open on their children: those the reader opened, and the one that is or holds the page
    // shown, again at each page (EasyUI's opened it at the first page only).
    const [chosen, setChosen] = React.useState(() => new Set());
    const [open, setOpen] = React.useState(() => openOf(sections, activeId, chosen));
    const [openFor, setOpenFor] = React.useState(activeId);
    if (openFor !== activeId) {
        setOpenFor(activeId);
        setOpen(openOf(sections, activeId, chosen));
    }
    const toggleOpen = (id, opening = !open.has(id)) => {
        const change = (current) => {
            const next = new Set(current);
            if (opening)
                next.add(id);
            else
                next.delete(id);
            return next;
        };
        setChosen(change);
        setOpen(change);
    };
    // ioiti-ui: the foldable sections unfolded; another page shown unfolds the one it is in (for this visit: the
    // reader's own choice stays as it was kept).
    const [unfolded, setUnfolded] = React.useState(() => unfoldedOf(sections, activeId, readFolds()));
    const [unfoldedFor, setUnfoldedFor] = React.useState(activeId);
    if (unfoldedFor !== activeId) {
        setUnfoldedFor(activeId);
        setUnfolded(unfoldedOf(sections, activeId, {}, unfolded));
    }
    const toggleSection = (key) => {
        const folding = unfolded.has(key);
        keepFold(key, folding);
        setUnfolded((current) => {
            const next = new Set(current);
            if (folding)
                next.delete(key);
            else
                next.add(key);
            return next;
        });
    };
    // ioiti-ui: the entry of the rail whose pages are shown beside it (its flyout), if one is.
    const [flyout, setFlyout] = React.useState(null);
    // ioiti-ui: the flyout's links are the sidebar's (`linkComponent`), the application's way to navigate kept.
    const links = React.useContext(LinkContext);
    const flyoutLinks = React.useMemo(() => ({ ...links, component: LinkComponent }), [links, LinkComponent]);
    // ioiti-ui: the rail's tip, beside an entry; none while a flyout shows its pages.
    const tipAt = (e, label, note) => {
        if (!collapsed || flyout !== null) {
            setTip(null);
            return;
        }
        const r = e.currentTarget.getBoundingClientRect();
        setTip({ label, note, x: r.right + 10, y: r.top + r.height / 2 });
    };
    const enter = (e, label, note) => {
        const el = e.currentTarget;
        setHoverBox({ y: el.offsetTop, h: el.offsetHeight });
        setHovering(true);
        tipAt(e, label, note);
    };
    /** ioiti-ui: the pages of an entry, in its flyout: its own first (unless one of its children's), then theirs. */
    const flyoutItems = (item) => {
        const children = item.children ?? [];
        const own = item.href !== undefined && !children.some((c) => c.href === item.href);
        // Its badge, as the sidebar says it: a count quiet, a state in its tone.
        const named = (label, badge, tone) => badge === undefined ? (label) : (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx("span", { className: "truncate", children: label }), _jsx(BadgeSeparator, {}), _jsx("span", { className: cn("text-[11px] tabular-nums", tone && tone !== "neutral" ? cn("font-medium", BADGE_TONE[tone]) : "text-muted-foreground"), children: badge })] }));
        // The page shown, a dot before it, as the sidebar marks it under its entry (and a radio item its choice).
        const mark = (current) => (_jsx("span", { "aria-hidden": true, className: "grid size-4 place-items-center", children: current && _jsx("span", { className: "size-1.5 rounded-full bg-current" }) }));
        return [
            ...(own
                ? [
                    { type: "link", label: item.label, icon: mark(activeId === item.id), href: item.href, current: activeId === item.id },
                    { type: "separator" },
                ]
                : []),
            ...children.map((c) => {
                const label = named(c.label, c.badge, c.badgeTone);
                return c.href !== undefined
                    ? { type: "link", label, icon: mark(c.id === activeId), textValue: c.label, href: c.href, current: c.id === activeId }
                    : { label, icon: mark(c.id === activeId), textValue: c.label, onSelect: () => onActiveChange?.(c.id) };
            }),
        ];
    };
    // ioiti-ui: the entries of the sections at the foot of the sidebar, above Collapse.
    const footItems = sections.filter((section) => section.place === "footer").flatMap((section) => section.items);
    const renderItem = (item, place = "list") => {
        const hasChildren = !!item.children?.length;
        const isOpen = hasChildren && open.has(item.id) && !collapsed;
        const childActive = !!item.children?.some((c) => c.id === activeId);
        // ioiti-ui: an entry with children and an `href` is a page too, and a link (its chevron opens it apart); in the
        // rail, a button that shows its pages beside it (its flyout).
        const isActive = activeId === item.id && (!hasChildren || item.href !== undefined);
        const flies = hasChildren && collapsed;
        const linked = item.href !== undefined && !flies;
        const chevron = hasChildren && linked && !collapsed;
        const childrenId = `${uid}-children-${item.id}`;
        const Entry = linked ? LinkComponent : "button";
        // ioiti-ui: in the rail, the entry that holds the page shown has the pill: its pages are out of sight.
        const pilled = isActive || (collapsed && childActive);
        // ioiti-ui: closed, an entry says that a page under it has a badge to read, in the gravest tone among them.
        const unseen = hasChildren && !isOpen && !collapsed && item.badge === undefined ? childrenBadge(item) : null;
        // ioiti-ui: in the rail, its badge is a dot on its icon, in its tone (or its pages' gravest), and its words in its
        // tip and its name.
        const railTone = !collapsed ? null : item.badge !== undefined ? (item.badgeTone ?? "neutral") : childrenBadge(item);
        const railNote = railTone === null ? undefined : { text: item.badge !== undefined ? String(item.badge) : unseenWords[railTone], tone: railTone };
        const railName = !collapsed ? undefined : railNote === undefined ? item.label : words.entryWithBadge({ entry: item.label, badge: railNote.text });
        // ioiti-ui: the hover box is measured in the list; at the foot, an entry is lit by its own hover.
        const point = (e) => place === "footer" ? tipAt(e, item.label, railNote) : enter(e, item.label, railNote);
        const onClick = (e) => {
            // In the rail, the flyout's (DropdownMenu's own click, after this one).
            if (flies)
                return;
            if (linked && !isPlainClick(e))
                return;
            if (!hasChildren || linked) {
                onActiveChange?.(item.id);
                onNavigate?.();
            }
            else {
                toggleOpen(item.id);
            }
        };
        const entry = (_jsxs(Entry, { ...(linked ? { href: item.href } : { type: "button" }), onClick: onClick, onMouseEnter: point, onFocus: point, "aria-label": railName, "aria-expanded": hasChildren && !linked && !flies ? isOpen : undefined, "aria-current": isActive ? "page" : undefined, className: cn(
            // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
            "relative flex h-9 w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 text-sm outline-none transition-colors", chevron && "pr-9", place === "footer" && !pilled && "hover:bg-surface-hover", pilled || childActive
                ? // ioiti-ui: the page shown, in the accent when the theme has one (accent:), as its pill below.
                    "text-foreground accent:text-brand-text"
                : "text-muted-foreground hover:text-foreground"), children: [pilled && (_jsx(motion.span, { layoutId: `${uid}-active`, transition: spring, className: "absolute inset-0 rounded-lg bg-surface-hover accent:bg-brand-soft" })), _jsxs("span", { className: "relative grid size-5 shrink-0 place-items-center [&>svg]:size-[18px]", children: [item.icon, railTone && _jsx(UnseenDot, { tone: railTone, className: "absolute -right-1 -top-0.5" })] }), _jsx(motion.span, { initial: false, animate: { opacity: collapsed ? 0 : 1 }, transition: motionTransitions.easeFast, className: "relative flex-1 truncate whitespace-nowrap text-left", children: item.label }), !collapsed && item.badge !== undefined && _jsx(BadgeSeparator, {}), !collapsed && item.badge !== undefined && (_jsxs(motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: item.badgeTone && item.badgeTone !== "neutral"
                        ? cn("relative inline-flex items-center gap-1 text-[11px] font-medium", BADGE_TONE[item.badgeTone])
                        : "relative rounded-md bg-muted px-1.5 text-[11px] tabular-nums text-text-secondary", children: [item.badgeTone && item.badgeTone !== "neutral" && _jsx("span", { "aria-hidden": true, className: "size-1.5 rounded-full bg-current" }), item.badge] })), unseen && (_jsxs(_Fragment, { children: [_jsx(UnseenDot, { tone: unseen, className: "relative" }), _jsx(BadgeSeparator, {}), _jsx("span", { className: "sr-only", children: unseenWords[unseen] })] })), !collapsed && hasChildren && !linked && (_jsx(ChevronRight, { className: cn("relative size-3.5 shrink-0 text-muted-foreground motion-safe:transition-transform duration-200 ease-fast", isOpen && "rotate-90") }))] }));
        return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center", children: [flies ? (_jsx(LinkContext.Provider, { value: flyoutLinks, children: _jsx(DropdownMenu, { trigger: entry, items: flyoutItems(item), label: item.label, side: "right", align: "start", open: flyout === item.id, onOpenChange: (opening) => {
                                    setFlyout(opening ? item.id : null);
                                    if (opening)
                                        setTip(null);
                                } }) })) : (entry), chevron && (_jsx("button", { type: "button", onClick: () => toggleOpen(item.id), onMouseEnter: (e) => enter(e, item.label), onFocus: (e) => enter(e, item.label), "aria-label": words.pagesUnder(item.label), "aria-expanded": isOpen, "aria-controls": isOpen ? childrenId : undefined, className: "relative -ml-8 grid h-9 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:text-foreground", children: _jsx(ChevronRight, { "aria-hidden": true, className: cn("size-3.5 motion-safe:transition-transform duration-200 ease-fast", isOpen && "rotate-90") }) }))] }), _jsx(AnimatePresence, { initial: false, children: isOpen && (_jsx(motion.div, { id: childrenId, initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0, transition: motionTransitions.easeExit }, transition: motionTransitions.easeSoft, className: "overflow-hidden", children: _jsx("div", { className: "ml-[19px] mt-0.5 space-y-0.5 border-l border-border py-0.5 pl-3", children: item.children.map((c) => {
                                const active = c.id === activeId;
                                const Child = c.href !== undefined ? LinkComponent : "button";
                                return (_jsxs(Child, { ...(c.href !== undefined ? { href: c.href } : { type: "button" }), onClick: (e) => {
                                        if (c.href !== undefined && !isPlainClick(e))
                                            return;
                                        onActiveChange?.(c.id);
                                        onNavigate?.();
                                    }, onMouseEnter: () => {
                                        setHovering(false);
                                        setTip(null);
                                    }, "aria-current": active ? "page" : undefined, className: cn(
                                    // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                                    "relative flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg px-2 text-sm outline-none transition-colors", active
                                        ? // ioiti-ui: the page shown, and its dot, in the accent (accent:).
                                            "text-foreground accent:text-brand-text"
                                        : "text-muted-foreground hover:text-foreground"), children: [active && (_jsx(motion.span, { layoutId: `${uid}-dot`, transition: spring, className: "absolute -left-[15.5px] top-[13px] size-1.5 rounded-full bg-foreground accent:bg-brand" })), _jsx("span", { className: "flex-1 truncate text-left", children: c.label }), c.badge !== undefined && _jsx(BadgeSeparator, {}), c.badge !== undefined && (_jsx("span", { className: cn("text-[11px] tabular-nums", c.badgeTone && c.badgeTone !== "neutral" ? cn("font-medium", BADGE_TONE[c.badgeTone]) : "text-muted-foreground"), children: c.badge }))] }, c.id));
                            }) }) })) })] }, item.id));
    };
    return (_jsxs(SidebarContext.Provider, { value: { collapsed }, children: [_jsxs("div", { className: "flex h-full flex-col", children: [header && (_jsx("div", { className: cn("flex h-14 shrink-0 items-center overflow-hidden px-4 transition-[padding,width]", collapsed && "w-14 justify-center px-0 [&>div>*:not(:first-child)]:hidden [&>div]:gap-0 [&>*:not(:first-child)]:hidden"), children: header })), _jsxs("nav", { "aria-label": words.mainNavigation, onMouseLeave: () => {
                            setHovering(false);
                            setTip(null);
                        }, className: "relative flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: [hoverBox && (_jsx(motion.span, { "aria-hidden": true, initial: false, animate: { y: hoverBox.y, height: hoverBox.h, opacity: hovering ? 1 : 0 }, transition: { y: spring, height: spring, opacity: motionTransitions.easeFast }, className: "pointer-events-none absolute inset-x-2 top-0 rounded-lg bg-surface-hover" })), sections.map((section, i) => {
                                // ioiti-ui: a section at the foot is drawn there, above Collapse.
                                if (section.place === "footer")
                                    return null;
                                const key = sectionKey(section, i);
                                // ioiti-ui: the rail shows every icon; folding is for the open sidebar.
                                const foldable = !!section.foldable && !collapsed;
                                const folded = foldable && !unfolded.has(key);
                                // ioiti-ui: the badges folded under it, its entries' and their pages', said by the gravest.
                                const counted = gravestBadge(section.items.flatMap((item) => [item, ...(item.children ?? [])]));
                                const listId = `${uid}-section-${i}`;
                                return (_jsxs("div", { className: "space-y-0.5", children: [section.title &&
                                            (collapsed ? (_jsx("div", { className: "mx-2.5 my-2 h-px bg-border" })) : foldable ? (_jsxs("button", { type: "button", onClick: () => toggleSection(key), "aria-expanded": !folded, "aria-controls": folded ? undefined : listId, 
                                                // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                                                className: "flex w-full cursor-pointer items-center gap-1.5 rounded-md px-2.5 pb-1 pt-4 text-left text-xs text-muted-foreground outline-none transition-colors hover:text-foreground", children: [_jsx("span", { className: "truncate", children: section.title }), _jsx(ChevronRight, { "aria-hidden": true, className: cn("size-3 shrink-0 motion-safe:transition-transform duration-200 ease-fast", !folded && "rotate-90") }), folded && counted && (_jsxs(_Fragment, { children: [_jsx(UnseenDot, { tone: counted }), _jsx(BadgeSeparator, {}), _jsx("span", { className: "sr-only", children: unseenWords[counted] })] }))] })) : (_jsx("p", { className: "truncate px-2.5 pb-1 pt-4 text-xs text-muted-foreground", children: section.title }))), foldable ? (_jsx(AnimatePresence, { initial: false, children: !folded && (_jsx(motion.div, { id: listId, initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0, transition: motionTransitions.easeExit }, transition: motionTransitions.easeSoft, className: "space-y-0.5 overflow-hidden", children: section.items.map((item) => renderItem(item)) })) })) : (section.items.map((item) => renderItem(item)))] }, key));
                            })] }), (footer || onToggle || footItems.length > 0) && (_jsxs("div", { onMouseLeave: () => setTip(null), className: "shrink-0 space-y-1 border-t border-border p-2", children: [footItems.map((item) => renderItem(item, "footer")), footer, onToggle && (_jsxs("button", { type: "button", onClick: onToggle, onMouseEnter: (e) => {
                                    if (!collapsed)
                                        return;
                                    const r = e.currentTarget.getBoundingClientRect();
                                    // ioiti-ui: its words and its keys in the provider's language.
                                    setTip({ label: words.expand, keys: keysText(TOGGLE_KEYS, undefined, keyWords), x: r.right + 10, y: r.top + r.height / 2 });
                                }, onMouseLeave: () => setTip(null), "aria-label": collapsed ? words.expandSidebar : undefined, "aria-keyshortcuts": ariaKeyShortcuts(TOGGLE_KEYS), 
                                // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                                className: "flex h-9 w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 text-sm text-muted-foreground outline-none transition-colors hover:bg-surface-hover hover:text-foreground", children: [_jsx("span", { className: "grid size-5 shrink-0 place-items-center", children: _jsx(PanelLeft, { className: "size-[18px]" }) }), _jsxs(motion.span, { initial: false, animate: { opacity: collapsed ? 0 : 1 }, transition: motionTransitions.easeFast, className: "flex-1 whitespace-nowrap text-left", children: [words.collapse, " ", _jsx("span", { className: "sr-only", children: words.collapseTarget })] }), !collapsed && (_jsx("span", { "aria-hidden": true, className: "shrink-0", children: _jsx(Kbd, { keys: TOGGLE_KEYS }) }))] }))] }))] }), typeof document !== "undefined" &&
                createPortal(_jsx(AnimatePresence, { children: collapsed && tip && (_jsx("div", { 
                        // ioiti-ui: kept above the page while a page changes (over-page, motion.css), its entry clicked.
                        className: "pointer-events-none fixed z-[60] -translate-y-1/2 over-page", style: { left: tip.x, top: tip.y }, children: _jsxs(motion.div, { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 }, 
                            // ioiti-ui: the motion of everything that floats: springSnappy arriving, easeExit leaving.
                            exit: { opacity: 0, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, className: cn("whitespace-nowrap px-2 py-1 text-xs font-medium", TOOLTIP), children: [tip.label, tip.note && (_jsx("span", { className: cn("ml-1.5", tip.note.tone === "neutral" ? "text-muted-foreground" : BADGE_TONE[tip.note.tone]), children: tip.note.text })), tip.keys && _jsx("span", { className: "ml-1.5 text-muted-foreground", children: tip.keys })] }) }, "tip"
                    // ioiti-ui: kept above the page while a page changes (over-page, motion.css), its entry clicked.
                    )) }), document.body)] }));
}
