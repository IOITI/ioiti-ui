"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
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
import { DropdownMenu, type DropdownMenuItem } from "../DropdownMenu.js";
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

// ioiti-ui: `href` makes an entry a link, which can be opened in another tab as well as followed.
// `badgeTone`: a badge that says a state ("Degraded", "2 open") in its tone, with a dot; a count stays neutral.
/** A badge's tone: `neutral` (a count), `warning` or `danger`, a status's words (StatusTone). */
export type SidebarBadgeTone = "neutral" | "warning" | "danger";
export type SidebarChild = { id: string; label: string; badge?: string | number; badgeTone?: SidebarBadgeTone; href?: string };
export type SidebarItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  badgeTone?: SidebarBadgeTone;
  children?: SidebarChild[];
  href?: string;
};
// ioiti-ui: `foldable`, a section the reader folds under its heading (folded until then, or until the page shown is
// in it): each reader's choice is kept by the browser, by the section's `id` (else its title). `place: "footer"`, a
// section drawn at the foot of the sidebar, above Collapse, without a heading.
export type SidebarSection = { id?: string; title?: string; foldable?: boolean; place?: "footer"; items: SidebarItem[] };

// ioiti-ui: the sections each reader folded (true) or unfolded (false), by key. The browser may refuse to keep them
// (a private window, blocked storage): the sidebar then forgets them, and works the same.
const FOLDS_KEY = "ioiti-ui.sidebar.folded";

function readFolds(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(FOLDS_KEY);
    const value: unknown = raw ? JSON.parse(raw) : {};
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function keepFold(key: string, folded: boolean) {
  try {
    window.localStorage.setItem(FOLDS_KEY, JSON.stringify({ ...readFolds(), [key]: folded }));
  } catch {
    // Not kept: the choice lasts as long as the page.
  }
}

const sectionKey = (section: SidebarSection, index: number) => section.id ?? section.title ?? String(index);

/** The foldable sections shown unfolded: the reader's choice, else folded; the one holding the page shown, unfolded. */
function unfoldedOf(sections: SidebarSection[], activeId: string, folds: Record<string, boolean>, previous?: Set<string>) {
  const unfolded = new Set<string>();
  sections.forEach((section, index) => {
    if (!section.foldable) return;
    const key = sectionKey(section, index);
    const holdsPage = section.items.some((item) => item.id === activeId || item.children?.some((c) => c.id === activeId));
    if (holdsPage || (previous ? previous.has(key) : folds[key] === false)) unfolded.add(key);
  });
  return unfolded;
}

/** ioiti-ui: the entries open on their children: the reader's, and the one that is, or holds, the page shown. */
function openOf(sections: SidebarSection[], activeId: string, chosen: Set<string>) {
  const open = new Set(chosen);
  for (const item of sections.flatMap((section) => section.items)) {
    if (item.children?.length && (item.id === activeId || item.children.some((c) => c.id === activeId))) open.add(item.id);
  }
  return open;
}

// ioiti-ui: a state's badge, in the tone's text colour (4.5:1 on every surface of every look), its dot beside it.
const BADGE_TONE: Record<Exclude<SidebarBadgeTone, "neutral">, string> = {
  warning: "text-warning",
  danger: "text-negative",
};

/**
 * ioiti-ui: what badges say while they are out of sight (an entry closed, a section folded, the rail): nothing, a
 * count (neutral), or the gravest state among them.
 */
function gravestBadge(entries: { badge?: string | number; badgeTone?: SidebarBadgeTone }[]): SidebarBadgeTone | null {
  const badged = entries.filter((c) => c.badge !== undefined);
  if (!badged.length) return null;
  if (badged.some((c) => c.badgeTone === "danger")) return "danger";
  if (badged.some((c) => c.badgeTone === "warning")) return "warning";
  return "neutral";
}

const childrenBadge = (item: SidebarItem) => gravestBadge(item.children ?? []);

/**
 * ioiti-ui: what a screen reader hears of badges out of sight, after the name of what holds them ("Orders, with a
 * warning"), and the rail's tip says after it: in the provider's language.
 */
function useUnseenWords(): Record<SidebarBadgeTone, string> {
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
  return (
    <>
      <span className="sr-only">,</span>{" "}
    </>
  );
}

/** ioiti-ui: the dot that says badges are out of sight, in the gravest tone among them; a count's in grey. */
function UnseenDot({ tone, className }: { tone: SidebarBadgeTone; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-1.5 shrink-0 rounded-full",
        tone === "neutral" ? "bg-muted-foreground accent:bg-brand" : cn("bg-current", BADGE_TONE[tone]),
        className
      )}
    />
  );
}

// ioiti-ui: the rail kept or not, by the key an application gives (`collapsedStorageKey`); the browser may refuse to
// keep it, and the sidebar then opens as `defaultCollapsed` says.
function readCollapsed(key: string | undefined): boolean | undefined {
  if (!key) return undefined;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === "true" ? true : raw === "false" ? false : undefined;
  } catch {
    return undefined;
  }
}

function keepCollapsed(key: string | undefined, collapsed: boolean) {
  if (!key) return;
  try {
    window.localStorage.setItem(key, String(collapsed));
  } catch {
    // Not kept: the choice lasts as long as the page.
  }
}

const SidebarContext = React.createContext({ collapsed: false });
/** Use inside `header` / `footer` to adapt to the icon-only state. */
export const useSidebar = () => React.useContext(SidebarContext);

export interface SidebarProps {
  sections: SidebarSection[];
  activeId: string;
  /** ioiti-ui: optional; an entry with an `href` leads there by itself. */
  onActiveChange?: (id: string) => void;
  /**
   * ioiti-ui: what draws an entry that has an `href` (the router's link, given `href`); the
   * application's link (LinkProvider) by default, else `a`.
   */
  linkComponent?: React.ElementType;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * ioiti-ui: where the browser keeps the reader's choice of the rail (`localStorage`), so that the sidebar opens as
   * it was left; `defaultCollapsed` until a choice is kept. Not kept without it, nor while `collapsed` is given.
   */
  collapsedStorageKey?: string;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  /**
   * ioiti-ui: the id of the drawer a phone shows, for the control that opens it to name (`aria-controls`, as AppShell's
   * does).
   */
  drawerId?: string;
  className?: string;
}

export function Sidebar({
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  collapsedStorageKey,
  mobileOpen: mobileProp,
  onMobileOpenChange,
  drawerId,
  className,
  ...content
}: SidebarProps) {
  // ioiti-ui: the reader's choice kept, read once, as the sidebar is first drawn; then held as every state is
  // (useControllableState), each choice kept while the sidebar holds it.
  const [kept] = React.useState(() => readCollapsed(collapsedStorageKey));
  const [collapsed, setShown] = useControllableState(collapsedProp, kept ?? defaultCollapsed, onCollapsedChange);
  const setCollapsed = (next: boolean) => {
    if (collapsedProp === undefined) keepCollapsed(collapsedStorageKey, next);
    setShown(next);
  };
  const [mobileOpen, setMobileOpen] = useControllableState(mobileProp, false, onMobileOpenChange);
  // ioiti-ui: its words, and its shortcut's, in the provider's language.
  const { shell: words, shortcuts } = useMessages();

  // ioiti-ui: ⌘B on an Apple computer, Ctrl B elsewhere (useShortcut), listed by ShortcutsDialog.
  useShortcut(
    TOGGLE_KEYS,
    () => {
      if (isWide()) setCollapsed(!collapsed);
      else setMobileOpen(!mobileOpen);
    },
    { description: shortcuts.toggleSidebar, group: shortcuts.navigation }
  );

  // drawer: scroll lock
  React.useEffect(() => {
    if (!mobileOpen || isWide()) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // ioiti-ui: the drawer is a dialog (aria-modal), and keeps the focus as one does (useFocusScope): moved in, on the
  // page shown (where the reader is), kept in by Tab, given back to what opened it; Escape closes it. It had none of
  // it: the focus stayed behind it, on the page its scrim covers.
  const drawerRef = React.useRef<HTMLElement>(null);
  useFocusScope(drawerRef, {
    active: mobileOpen && !isWide(),
    initialFocus: () => drawerRef.current?.querySelector<HTMLElement>('[aria-current="page"]'),
    onEscape: () => setMobileOpen(false),
  });

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? COLLAPSED : EXPANDED }}
        transition={spring}
        className={cn(
          // ioiti-ui: glass under the glass material (glass-bar), as the drawer below (glass-float), its scrim lighter.
          // In dark, the page's own ground (background), as the design's: on the dark surface, a row's hover and the
          // pill of the page shown (surface-hover) would hardly show.
          "hidden h-full shrink-0 overflow-hidden border-r border-border bg-surface md:block dark:bg-background glass-bar",
          className
        )}
      >
        <Panel {...content} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </motion.aside>

      {/* ioiti-ui: in document.body, as every dialog (one at a time, over the whole page). */}
      {createPortal(
      <AnimatePresence>
        {mobileOpen && (
          // ioiti-ui: kept above the page while a page changes, as every layer over it (over-page,
          // motion.css): a page chosen in the drawer arrives as the drawer leaves.
          <div key="drawer" className="fixed inset-0 z-50 md:hidden over-page">
            <motion.div
              aria-hidden
              className={cn("absolute inset-0", SCRIM)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // ioiti-ui: the scrims' motion: easeFast arriving, easeExit leaving.
              exit={{ opacity: 0, transition: motionTransitions.easeExit }}
              transition={motionTransitions.easeFast}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              ref={drawerRef}
              id={drawerId}
              role="dialog"
              aria-modal="true"
              // ioiti-ui: named in the provider's language.
              aria-label={words.navigation}
              className="absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] overflow-hidden border-r border-border bg-surface shadow-elevated dark:bg-background glass-float"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={spring}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0.5, right: 0 }}
              dragMomentum={false}
              onDragEnd={(_, info: PanInfo) => {
                if (info.offset.x < -80 || info.velocity.x < -400) setMobileOpen(false);
              }}
            >
              {/* ioiti-ui: a way to close it on a phone, where there is no Escape, read first by a screen reader. */}
              <button
                type="button"
                // ioiti-ui: named in the provider's language.
                aria-label={words.closeNavigation}
                onClick={() => setMobileOpen(false)}
                className={cn(CLOSE_MD, "focus-ring absolute right-3 top-3 z-10")}
              >
                <X />
              </button>
              <Panel {...content} collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
}

// ioiti-ui: its props named, as every component's (exported from src/index.ts).
/** The props of `SidebarTrigger`: a `<button>`'s. */
export type SidebarTriggerProps = React.ComponentProps<"button">;

/** Put anywhere (e.g. your top bar). Only visible below md. ioiti-ui: named in the provider's language ("Open navigation"). */
export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const words = useMessages().shell;
  return (
    <button
      type="button"
      aria-label={words.openNavigation}
      className={cn(
        // ioiti-ui: pressed, it gives, as the top bar's other buttons do (motion-safe:).
        "grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-surface-hover hover:text-foreground md:hidden",
        PRESSABLE,
        className
      )}
      {...props}
    >
      <PanelLeft className="size-[18px]" />
    </button>
  );
}

/* ───────────────────────── internals ───────────────────────── */

/** ioiti-ui: what a rail's tip says after an entry's name: its badge, in its tone. */
type TipNote = { text: string; tone: SidebarBadgeTone };

type PanelProps = Pick<SidebarProps, "sections" | "activeId" | "onActiveChange" | "header" | "footer" | "linkComponent"> & {
  collapsed: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
};

function Panel({
  sections,
  activeId,
  onActiveChange,
  linkComponent,
  header,
  footer,
  collapsed,
  onToggle,
  onNavigate,
}: PanelProps) {
  const LinkComponent = useLinkComponent(linkComponent);
  // ioiti-ui: its words and its keys' in the provider's language.
  const { shell: words, keys: keyWords } = useMessages();
  const unseenWords = useUnseenWords();
  const uid = React.useId();
  const [hoverBox, setHoverBox] = React.useState<{ y: number; h: number } | null>(null);
  const [hovering, setHovering] = React.useState(false);
  const [tip, setTip] = React.useState<{ label: string; keys?: string; note?: TipNote; x: number; y: number } | null>(null);
  // ioiti-ui: the entries open on their children: those the reader opened, and the one that is or holds the page
  // shown, again at each page (EasyUI's opened it at the first page only).
  const [chosen, setChosen] = React.useState<Set<string>>(() => new Set());
  const [open, setOpen] = React.useState<Set<string>>(() => openOf(sections, activeId, chosen));
  const [openFor, setOpenFor] = React.useState(activeId);
  if (openFor !== activeId) {
    setOpenFor(activeId);
    setOpen(openOf(sections, activeId, chosen));
  }
  const toggleOpen = (id: string, opening = !open.has(id)) => {
    const change = (current: Set<string>) => {
      const next = new Set(current);
      if (opening) next.add(id);
      else next.delete(id);
      return next;
    };
    setChosen(change);
    setOpen(change);
  };
  // ioiti-ui: the foldable sections unfolded; another page shown unfolds the one it is in (for this visit: the
  // reader's own choice stays as it was kept).
  const [unfolded, setUnfolded] = React.useState<Set<string>>(() => unfoldedOf(sections, activeId, readFolds()));
  const [unfoldedFor, setUnfoldedFor] = React.useState(activeId);
  if (unfoldedFor !== activeId) {
    setUnfoldedFor(activeId);
    setUnfolded(unfoldedOf(sections, activeId, {}, unfolded));
  }
  const toggleSection = (key: string) => {
    const folding = unfolded.has(key);
    keepFold(key, folding);
    setUnfolded((current) => {
      const next = new Set(current);
      if (folding) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // ioiti-ui: the entry of the rail whose pages are shown beside it (its flyout), if one is.
  const [flyout, setFlyout] = React.useState<string | null>(null);
  // ioiti-ui: the flyout's links are the sidebar's (`linkComponent`), the application's way to navigate kept.
  const links = React.useContext(LinkContext);
  const flyoutLinks = React.useMemo(() => ({ ...links, component: LinkComponent }), [links, LinkComponent]);

  // ioiti-ui: the rail's tip, beside an entry; none while a flyout shows its pages.
  const tipAt = (e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>, label: string, note?: TipNote) => {
    if (!collapsed || flyout !== null) {
      setTip(null);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ label, note, x: r.right + 10, y: r.top + r.height / 2 });
  };

  const enter = (e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>, label: string, note?: TipNote) => {
    const el = e.currentTarget;
    setHoverBox({ y: el.offsetTop, h: el.offsetHeight });
    setHovering(true);
    tipAt(e, label, note);
  };

  /** ioiti-ui: the pages of an entry, in its flyout: its own first (unless one of its children's), then theirs. */
  const flyoutItems = (item: SidebarItem): DropdownMenuItem[] => {
    const children = item.children ?? [];
    const own = item.href !== undefined && !children.some((c) => c.href === item.href);
    // Its badge, as the sidebar says it: a count quiet, a state in its tone.
    const named = (label: string, badge?: string | number, tone?: SidebarBadgeTone): React.ReactNode =>
      badge === undefined ? (
        label
      ) : (
        <span className="flex items-center gap-2">
          <span className="truncate">{label}</span>
          <BadgeSeparator />
          <span className={cn("text-[11px] tabular-nums", tone && tone !== "neutral" ? cn("font-medium", BADGE_TONE[tone]) : "text-muted-foreground")}>
            {badge}
          </span>
        </span>
      );
    // The page shown, a dot before it, as the sidebar marks it under its entry (and a radio item its choice).
    const mark = (current: boolean) => (
      <span aria-hidden className="grid size-4 place-items-center">
        {current && <span className="size-1.5 rounded-full bg-current" />}
      </span>
    );
    return [
      ...(own
        ? [
            { type: "link" as const, label: item.label, icon: mark(activeId === item.id), href: item.href!, current: activeId === item.id },
            { type: "separator" as const },
          ]
        : []),
      ...children.map((c): DropdownMenuItem => {
        const label = named(c.label, c.badge, c.badgeTone);
        return c.href !== undefined
          ? { type: "link", label, icon: mark(c.id === activeId), textValue: c.label, href: c.href, current: c.id === activeId }
          : { label, icon: mark(c.id === activeId), textValue: c.label, onSelect: () => onActiveChange?.(c.id) };
      }),
    ];
  };

  // ioiti-ui: the entries of the sections at the foot of the sidebar, above Collapse.
  const footItems = sections.filter((section) => section.place === "footer").flatMap((section) => section.items);

  const renderItem = (item: SidebarItem, place: "list" | "footer" = "list") => {
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
    const Entry: React.ElementType = linked ? LinkComponent : "button";
    // ioiti-ui: in the rail, the entry that holds the page shown has the pill: its pages are out of sight.
    const pilled = isActive || (collapsed && childActive);
    // ioiti-ui: closed, an entry says that a page under it has a badge to read, in the gravest tone among them.
    const unseen = hasChildren && !isOpen && !collapsed && item.badge === undefined ? childrenBadge(item) : null;
    // ioiti-ui: in the rail, its badge is a dot on its icon, in its tone (or its pages' gravest), and its words in its
    // tip and its name.
    const railTone = !collapsed ? null : item.badge !== undefined ? (item.badgeTone ?? "neutral") : childrenBadge(item);
    const railNote: TipNote | undefined =
      railTone === null ? undefined : { text: item.badge !== undefined ? String(item.badge) : unseenWords[railTone], tone: railTone };
    const railName = !collapsed ? undefined : railNote === undefined ? item.label : words.entryWithBadge({ entry: item.label, badge: railNote.text });
    // ioiti-ui: the hover box is measured in the list; at the foot, an entry is lit by its own hover.
    const point = (e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) =>
      place === "footer" ? tipAt(e, item.label, railNote) : enter(e, item.label, railNote);

    const onClick = (e: React.MouseEvent) => {
      // In the rail, the flyout's (DropdownMenu's own click, after this one).
      if (flies) return;
      if (linked && !isPlainClick(e)) return;
      if (!hasChildren || linked) {
        onActiveChange?.(item.id);
        onNavigate?.();
      } else {
        toggleOpen(item.id);
      }
    };

    const entry = (
          <Entry
            {...(linked ? { href: item.href } : { type: "button" })}
            onClick={onClick}
            onMouseEnter={point}
            onFocus={point}
            aria-label={railName}
            aria-expanded={hasChildren && !linked && !flies ? isOpen : undefined}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
              "relative flex h-9 w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 text-sm outline-none transition-colors",
              chevron && "pr-9",
              place === "footer" && !pilled && "hover:bg-surface-hover",
              pilled || childActive
                ? // ioiti-ui: the page shown, in the accent when the theme has one (accent:), as its pill below.
                  "text-foreground accent:text-brand-text"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {pilled && (
              <motion.span
                layoutId={`${uid}-active`}
                transition={spring}
                className="absolute inset-0 rounded-lg bg-surface-hover accent:bg-brand-soft"
              />
            )}
            <span className="relative grid size-5 shrink-0 place-items-center [&>svg]:size-[18px]">
              {item.icon}
              {railTone && <UnseenDot tone={railTone} className="absolute -right-1 -top-0.5" />}
            </span>
            <motion.span
              initial={false}
              animate={{ opacity: collapsed ? 0 : 1 }}
              transition={motionTransitions.easeFast}
              className="relative flex-1 truncate whitespace-nowrap text-left"
            >
              {item.label}
            </motion.span>
            {!collapsed && item.badge !== undefined && <BadgeSeparator />}
            {!collapsed && item.badge !== undefined && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={
                  item.badgeTone && item.badgeTone !== "neutral"
                    ? cn("relative inline-flex items-center gap-1 text-[11px] font-medium", BADGE_TONE[item.badgeTone])
                    : "relative rounded-md bg-muted px-1.5 text-[11px] tabular-nums text-text-secondary"
                }
              >
                {item.badgeTone && item.badgeTone !== "neutral" && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
                {item.badge}
              </motion.span>
            )}
            {unseen && (
              <>
                <UnseenDot tone={unseen} className="relative" />
                {/* ioiti-ui: a comma, then the words, as a badge is said ("Orders, with a warning"). */}
                <BadgeSeparator />
                <span className="sr-only">{unseenWords[unseen]}</span>
              </>
            )}
            {!collapsed && hasChildren && !linked && (
              <ChevronRight
                className={cn(
                  "relative size-3.5 shrink-0 text-muted-foreground motion-safe:transition-transform duration-200 ease-fast",
                  isOpen && "rotate-90"
                )}
              />
            )}
          </Entry>
    );

    return (
      <div key={item.id}>
        <div className="flex items-center">
          {flies ? (
            <LinkContext.Provider value={flyoutLinks}>
              <DropdownMenu
                trigger={entry}
                items={flyoutItems(item)}
                label={item.label}
                side="right"
                align="start"
                open={flyout === item.id}
                onOpenChange={(opening) => {
                  setFlyout(opening ? item.id : null);
                  if (opening) setTip(null);
                }}
              />
            </LinkContext.Provider>
          ) : (
            entry
          )}
          {chevron && (
            <button
              type="button"
              onClick={() => toggleOpen(item.id)}
              onMouseEnter={(e) => enter(e, item.label)}
              onFocus={(e) => enter(e, item.label)}
              // ioiti-ui: named in the provider's language ("The pages under Orders").
              aria-label={words.pagesUnder(item.label)}
              aria-expanded={isOpen}
              aria-controls={isOpen ? childrenId : undefined}
              className="relative -ml-8 grid h-9 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:text-foreground"
            >
              <ChevronRight aria-hidden className={cn("size-3.5 motion-safe:transition-transform duration-200 ease-fast", isOpen && "rotate-90")} />
            </button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={childrenId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0, transition: motionTransitions.easeExit }}
              transition={motionTransitions.easeSoft}
              className="overflow-hidden"
            >
              <div className="ml-[19px] mt-0.5 space-y-0.5 border-l border-border py-0.5 pl-3">
                {item.children!.map((c) => {
                  const active = c.id === activeId;
                  const Child: React.ElementType = c.href !== undefined ? LinkComponent : "button";
                  return (
                    <Child
                      key={c.id}
                      {...(c.href !== undefined ? { href: c.href } : { type: "button" })}
                      onClick={(e: React.MouseEvent) => {
                        if (c.href !== undefined && !isPlainClick(e)) return;
                        onActiveChange?.(c.id);
                        onNavigate?.();
                      }}
                      onMouseEnter={() => {
                        setHovering(false);
                        setTip(null);
                      }}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                        "relative flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg px-2 text-sm outline-none transition-colors",
                        active
                          ? // ioiti-ui: the page shown, and its dot, in the accent (accent:).
                            "text-foreground accent:text-brand-text"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId={`${uid}-dot`}
                          transition={spring}
                          className="absolute -left-[15.5px] top-[13px] size-1.5 rounded-full bg-foreground accent:bg-brand"
                        />
                      )}
                      <span className="flex-1 truncate text-left">{c.label}</span>
                      {c.badge !== undefined && <BadgeSeparator />}
                      {c.badge !== undefined && (
                        <span
                          className={cn(
                            "text-[11px] tabular-nums",
                            c.badgeTone && c.badgeTone !== "neutral" ? cn("font-medium", BADGE_TONE[c.badgeTone]) : "text-muted-foreground"
                          )}
                        >
                          {c.badge}
                        </span>
                      )}
                    </Child>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <div className="flex h-full flex-col">
        {header && (
          <div
            className={cn(
              "flex h-14 shrink-0 items-center overflow-hidden px-4 transition-[padding,width]",
              collapsed && "w-14 justify-center px-0 [&>div>*:not(:first-child)]:hidden [&>div]:gap-0 [&>*:not(:first-child)]:hidden"
            )}
          >
            {header}
          </div>
        )}

        <nav
          // ioiti-ui: named in the provider's language.
          aria-label={words.mainNavigation}
          onMouseLeave={() => {
            setHovering(false);
            setTip(null);
          }}
          className="relative flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {hoverBox && (
            <motion.span
              aria-hidden
              initial={false}
              animate={{ y: hoverBox.y, height: hoverBox.h, opacity: hovering ? 1 : 0 }}
              transition={{ y: spring, height: spring, opacity: motionTransitions.easeFast }}
              className="pointer-events-none absolute inset-x-2 top-0 rounded-lg bg-surface-hover"
            />
          )}

          {sections.map((section, i) => {
            // ioiti-ui: a section at the foot is drawn there, above Collapse.
            if (section.place === "footer") return null;
            const key = sectionKey(section, i);
            // ioiti-ui: the rail shows every icon; folding is for the open sidebar.
            const foldable = !!section.foldable && !collapsed;
            const folded = foldable && !unfolded.has(key);
            // ioiti-ui: the badges folded under it, its entries' and their pages', said by the gravest.
            const counted = gravestBadge(section.items.flatMap((item) => [item, ...(item.children ?? [])]));
            const listId = `${uid}-section-${i}`;
            return (
              <div key={key} className="space-y-0.5">
                {section.title &&
                  (collapsed ? (
                    <div className="mx-2.5 my-2 h-px bg-border" />
                  ) : foldable ? (
                    <button
                      type="button"
                      onClick={() => toggleSection(key)}
                      aria-expanded={!folded}
                      aria-controls={folded ? undefined : listId}
                      // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                      className="flex w-full cursor-pointer items-center gap-1.5 rounded-md px-2.5 pb-1 pt-4 text-left text-xs text-muted-foreground outline-none transition-colors hover:text-foreground"
                    >
                      <span className="truncate">{section.title}</span>
                      <ChevronRight
                        aria-hidden
                        className={cn("size-3 shrink-0 motion-safe:transition-transform duration-200 ease-fast", !folded && "rotate-90")}
                      />
                      {/* ioiti-ui: folded, it says that an entry under it has a badge to read, in the gravest tone. */}
                      {folded && counted && (
                        <>
                          <UnseenDot tone={counted} />
                          <BadgeSeparator />
                          <span className="sr-only">{unseenWords[counted]}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <p className="truncate px-2.5 pb-1 pt-4 text-xs text-muted-foreground">
                      {section.title}
                    </p>
                  ))}
                {foldable ? (
                  <AnimatePresence initial={false}>
                    {!folded && (
                      <motion.div
                        id={listId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0, transition: motionTransitions.easeExit }}
                        transition={motionTransitions.easeSoft}
                        className="space-y-0.5 overflow-hidden"
                      >
                        {section.items.map((item) => renderItem(item))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  section.items.map((item) => renderItem(item))
                )}
              </div>
            );
          })}
        </nav>

        {(footer || onToggle || footItems.length > 0) && (
          <div
            onMouseLeave={() => setTip(null)}
            className="shrink-0 space-y-1 border-t border-border p-2"
          >
            {/* ioiti-ui: the entries of the sections at the foot (place: "footer"), then the application's own. */}
            {footItems.map((item) => renderItem(item, "footer"))}
            {footer}
            {onToggle && (
              <button
                type="button"
                onClick={onToggle}
                onMouseEnter={(e) => {
                  if (!collapsed) return;
                  const r = e.currentTarget.getBoundingClientRect();
                  // ioiti-ui: its words and its keys in the provider's language.
                  setTip({ label: words.expand, keys: keysText(TOGGLE_KEYS, undefined, keyWords), x: r.right + 10, y: r.top + r.height / 2 });
                }}
                onMouseLeave={() => setTip(null)}
                // ioiti-ui: open, named by the word it shows and what it folds ("Collapse sidebar"), its keys drawn for the eye
                // and heard as its shortcut (WCAG 2.5.3, label in name: a name given over the words shown left out its keys);
                // folded, by what it does, its words hidden.
                aria-label={collapsed ? words.expandSidebar : undefined}
                aria-keyshortcuts={ariaKeyShortcuts(TOGGLE_KEYS)}
                // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                className="flex h-9 w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 text-sm text-muted-foreground outline-none transition-colors hover:bg-surface-hover hover:text-foreground"
              >
                <span className="grid size-5 shrink-0 place-items-center">
                  <PanelLeft className="size-[18px]" />
                </span>
                <motion.span
                  initial={false}
                  animate={{ opacity: collapsed ? 0 : 1 }}
                  transition={motionTransitions.easeFast}
                  className="flex-1 whitespace-nowrap text-left"
                >
                  {/* ioiti-ui: in the provider's language. */}
                  {words.collapse} <span className="sr-only">{words.collapseTarget}</span>
                </motion.span>
                {/* ioiti-ui: the keys as this computer writes them (⌘B, Ctrl B), drawn for the eye: a screen reader hears
                    them as its shortcut (aria-keyshortcuts), not in its name. */}
                {!collapsed && (
                  <span aria-hidden className="shrink-0">
                    <Kbd keys={TOGGLE_KEYS} />
                  </span>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ioiti-ui: in document.body, as every layer: a sidebar that took a blur, a filter or a transform would be the
          tip's containing block, and its overflow cut the tip at its edge. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {collapsed && tip && (
              <div
                key="tip"
                // ioiti-ui: kept above the page while a page changes (over-page, motion.css), its entry clicked.
                className="pointer-events-none fixed z-[60] -translate-y-1/2 over-page"
                style={{ left: tip.x, top: tip.y }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  // ioiti-ui: the motion of everything that floats: springSnappy arriving, easeExit leaving.
                  exit={{ opacity: 0, transition: motionTransitions.easeExit }}
                  transition={motionTransitions.springSnappy}
                  className={cn("whitespace-nowrap px-2 py-1 text-xs font-medium", TOOLTIP)}
                >
                  {tip.label}
                  {tip.note && (
                    <span className={cn("ml-1.5", tip.note.tone === "neutral" ? "text-muted-foreground" : BADGE_TONE[tip.note.tone])}>
                      {tip.note.text}
                    </span>
                  )}
                  {tip.keys && <span className="ml-1.5 text-muted-foreground">{tip.keys}</span>}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </SidebarContext.Provider>
  );
}
