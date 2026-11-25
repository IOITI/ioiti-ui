"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls, type PanInfo } from "framer-motion";
import { X } from "lucide-react";
// ioiti-ui: held by its caller or by itself, as every layer (useControllableState, which passes why it closed on):
// its own copy is gone.
import { useControllableState } from "../../lib/controllable.js";
// ioiti-ui: the focus kept as every layer keeps it (useFocusScope): its own trap and its list of the sheets open are gone.
import { useFocusScope } from "../../lib/focus-scope.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { CLOSE_MD, SCRIM } from "../../lib/recipes.js";
import { useScrollRegion } from "../../lib/scroll-region.js";
import { cn } from "../../lib/utils.js";
// ioiti-ui: its controls named in the provider's language, its width written in its locale.
import { useMessages } from "../locale-context.js";

/*
 * ioiti-ui: EasyUI's sheet, which this package named Flysheet until 0.31.0 (its parts are Sheet… again, the name of
 * their role; their former names, removed in 1.0), with what Elastic UI's flyout
 * (EuiFlyout) does, written here from its documentation: a side sheet's width (three sizes, or pixels, between a
 * minimum and a maximum), which the reader may change by its inner edge or with the arrow keys on it; the page pushed
 * aside rather than covered, from a window wide enough; no backdrop, the page still in use; a child
 * sheet beside its parent, or over it where there is no room; the padding of its parts; its close
 * button outside it; why it closed. Each change is marked.
 */

// ioiti-ui: the sheets' and the drawer's motion, the design's own (EasyUI's was 380/38/0.9).
const spring = motionTransitions.springSheet;
// ioiti-ui: a sheet let go past its place comes back as it slides, with springSheet's stiffness and damping (EasyUI's
// were 700 and 45).
const sheetSpring = motionTransitions.springSheet as Record<"stiffness" | "damping", number>;
const DRAG_RETURN = { bounceStiffness: sheetSpring.stiffness, bounceDamping: sheetSpring.damping };

export type SheetSide = "right" | "left" | "top" | "bottom";

// ioiti-ui: a side sheet's width is a style (SheetContent's `size`) instead of EasyUI's
// `w-[88vw] max-w-[26rem]`, which stays its default: `md`, and 88% of the window at most.
const SIDES = {
  right: {
    pos: "inset-y-0 right-0 h-full border-l",
    from: { x: "100%" },
    to: { x: 0 },
    axis: "x",
    elastic: { left: 0, right: 0.6 },
    dismiss: (i: PanInfo) => i.offset.x > 96 || i.velocity.x > 500,
  },
  left: {
    pos: "inset-y-0 left-0 h-full border-r",
    from: { x: "-100%" },
    to: { x: 0 },
    axis: "x",
    elastic: { left: 0.6, right: 0 },
    dismiss: (i: PanInfo) => i.offset.x < -96 || i.velocity.x < -500,
  },
  top: {
    pos: "inset-x-0 top-0 mx-auto max-h-[85dvh] w-full max-w-lg rounded-b-2xl border-x border-b",
    from: { y: "-100%" },
    to: { y: 0 },
    axis: "y",
    elastic: { top: 0.6, bottom: 0 },
    dismiss: (i: PanInfo) => i.offset.y < -96 || i.velocity.y < -500,
  },
  bottom: {
    pos: "inset-x-0 bottom-0 mx-auto max-h-[85dvh] w-full max-w-lg rounded-t-2xl border-x border-t",
    from: { y: "100%" },
    to: { y: 0 },
    axis: "y",
    elastic: { top: 0, bottom: 0.6 },
    dismiss: (i: PanInfo) => i.offset.y > 96 || i.velocity.y > 500,
  },
} as const;

/* ───────────── ioiti-ui: Elastic's flyout ───────────── */

/** ioiti-ui: a side sheet's width: 22, 26 (EasyUI's) or 40 rem, or pixels. */
export type SheetSize = "sm" | "md" | "lg" | number;
/** ioiti-ui: over the page, or beside it, the page pushed aside (a side sheet, from `pushMinWidth`). */
export type SheetType = "overlay" | "push";
/** ioiti-ui: the padding of a sheet's header, body and footer. */
export type SheetPadding = "none" | "sm" | "md" | "lg";
/** ioiti-ui: why a sheet closed, given to `onOpenChange` with `false`. */
export type SheetCloseReason = "close-button" | "escape" | "outside-click" | "drag" | "trigger" | "parent";

type Details = { reason: SheetCloseReason };

const SIZES = { sm: 22, md: 26, lg: 40 } as const;
const MIN_WIDTH = 280;
/** EasyUI's 88vw: a side sheet, or a sheet and its children, leave the rest of the window to see and tap. */
const ROOM = 0.88;
const STEP = 10;
const STEP_LARGE = 50;
/** Tailwind's `lg`: narrower, a pushed page would be too narrow to read. */
const PUSH_MIN_WIDTH = 1024;

const PADDINGS: Record<SheetPadding, { header: string; body: string; footer: string }> = {
  none: { header: "p-0", body: "p-0", footer: "p-0" },
  sm: { header: "px-4 pb-2 pt-4", body: "px-4 py-2", footer: "px-4 py-3" },
  md: { header: "px-5 pb-3 pt-5", body: "px-5 py-2", footer: "px-5 py-4" },
  lg: { header: "px-6 pb-4 pt-6", body: "px-6 py-3", footer: "px-6 py-5" },
};

/** The close button outside the panel, on the side facing the page. */
const OUTSIDE: Record<SheetSide, string> = {
  right: "right-full top-3 mr-3",
  left: "left-full top-3 ml-3",
  top: "right-3 top-full mt-3",
  bottom: "bottom-full right-3 mb-3",
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function toPixels(size: SheetSize) {
  if (typeof size === "number") return size;
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return SIZES[size] * (rem > 0 ? rem : 16);
}

/** The window's width, followed while `active`: read again before the first paint (it may have changed while closed). */
function useViewportWidth(active: boolean) {
  const [width, setWidth] = React.useState(() => (typeof window === "undefined" ? 0 : window.innerWidth));
  React.useLayoutEffect(() => {
    if (!active) return;
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active]);
  return width;
}

// What the sheets pushing the page take from each side: the body's margin there (the shell's row
// narrows with it), and a variable for what an application fixes to the window itself.
const pushes = { left: new Map<string, number>(), right: new Map<string, number>() };
let bodyMargins: { left: string; right: string } | null = null;

function setPush(id: string, side: "left" | "right", width: number | null) {
  if (width === null) pushes[side].delete(id);
  else pushes[side].set(id, width);
  const total = (each: "left" | "right") => [...pushes[each].values()].reduce((sum, value) => sum + value, 0);
  const body = document.body.style;
  for (const each of ["left", "right"] as const) {
    const taken = total(each);
    if (taken) {
      bodyMargins ??= { left: body.marginLeft, right: body.marginRight };
      body.setProperty(`margin-${each}`, `${taken}px`);
      document.documentElement.style.setProperty(`--flysheet-push-${each}`, `${taken}px`);
    } else {
      if (bodyMargins) body.setProperty(`margin-${each}`, bodyMargins[each]);
      document.documentElement.style.removeProperty(`--flysheet-push-${each}`);
    }
  }
  if (!total("left") && !total("right")) bodyMargins = null;
}

/**
 * ioiti-ui: an Escape meant for what is open in the sheet (a list, a menu, a picker), which closes first: one drawn by
 * useAnchoredLayer takes its own before the sheet hears it (useFocusScope listens after it), one drawn by the
 * application may not.
 */
function forPopup(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  const expanded =
    target.getAttribute("aria-expanded") === "true" &&
    !target.hasAttribute("data-flysheet-trigger") &&
    (target.hasAttribute("aria-haspopup") || target.getAttribute("role") === "combobox");
  return expanded || !!target.closest('[role="listbox"], [role="menu"], [role="dialog"]:not([data-flysheet])');
}

/* ───────────── root + context ───────────── */

interface SheetCtx {
  open: boolean;
  setOpen: (open: boolean, details?: Details) => void;
  titleId: string;
  descId: string;
  hasDesc: boolean;
  setHasDesc: (v: boolean) => void;
  // ioiti-ui: the id of what opens (its trigger's aria-controls), and whether it has a title to be named by.
  contentId: string;
  hasTitle: boolean;
  setHasTitle: (v: boolean) => void;
  // ioiti-ui: whether its content pushes the page aside (a region beside it, no dialog): its trigger opens no popup then.
  pushing: boolean;
  setPushing: (v: boolean) => void;
}
const SheetContext = React.createContext<SheetCtx | null>(null);
function useSheet() {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error("Sheet parts must be used inside <Sheet>");
  return ctx;
}

// ioiti-ui: what a sheet's content gives what it holds: its parts their padding, a child sheet where it
// is drawn (the same layer: one dialog, one backdrop) and from where.
type Placement = "alone" | "beside" | "stacked";
interface Layer {
  /** Where the sheet's children are drawn, in its layer. */
  slot: HTMLDivElement | null;
  panel: HTMLDivElement | null;
  side: SheetSide;
  /** From the window's edge to the panel's inner edge, where a child beside it starts. */
  edge: number;
  width: number;
  z: number;
  modal: boolean;
  padding: SheetPadding;
  setChild: (placement: Placement | null) => void;
}
const LayerContext = React.createContext<Layer | null>(null);
const usePadding = () => PADDINGS[React.useContext(LayerContext)?.padding ?? "md"];

export interface SheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  /** ioiti-ui: with why it closed (`details.reason`). */
  onOpenChange?: (open: boolean, details?: { reason: SheetCloseReason }) => void;
  children: React.ReactNode;
}

export function Sheet({ open, defaultOpen = false, onOpenChange, children }: SheetProps) {
  const [own, setOpen] = useControllableState<boolean, [details?: Details]>(open, defaultOpen, onOpenChange);
  // ioiti-ui: a sheet inside another closes with it, and says so (`parent`).
  const parent = React.useContext(SheetContext);
  const parentOpen = parent ? parent.open : true;
  React.useEffect(() => {
    if (own && !parentOpen) setOpen(false, { reason: "parent" });
  }, [own, parentOpen, setOpen]);
  const isOpen = own && parentOpen;
  const [hasDesc, setHasDesc] = React.useState(false);
  const [hasTitle, setHasTitle] = React.useState(false);
  const [pushing, setPushing] = React.useState(false);
  const titleId = React.useId();
  const descId = React.useId();
  const contentId = React.useId();
  const value = React.useMemo(
    () => ({ open: isOpen, setOpen, titleId, descId, hasDesc, setHasDesc, contentId, hasTitle, setHasTitle, pushing, setPushing }),
    [isOpen, setOpen, titleId, descId, hasDesc, contentId, hasTitle, pushing]
  );
  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

// ioiti-ui: its props named, as every component's (exported from src/index.ts).
/** The props of `SheetTrigger`: a `<button>`'s. */
export type SheetTriggerProps = React.ComponentProps<"button">;

/** Unstyled button, bring your own classes. ioiti-ui: it closes the sheet too (one that leaves it in reach). */
export function SheetTrigger({ onClick, ...props }: SheetTriggerProps) {
  const { open, setOpen, contentId, pushing } = useSheet();
  return (
    <button
      type="button"
      // ioiti-ui: a dialog it opens, over the page; none where the sheet pushes the page aside (a region beside it).
      aria-haspopup={pushing ? undefined : "dialog"}
      // ioiti-ui: says whether the sheet is open, and which it is.
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      data-flysheet-trigger=""
      {...props}
      onClick={(e) => {
        onClick?.(e);
        setOpen(!open, open ? { reason: "trigger" } : undefined);
      }}
    />
  );
}

// ioiti-ui: its props named, as every component's (exported from src/index.ts).
/** The props of `SheetClose`: a `<button>`'s. */
export type SheetCloseProps = React.ComponentProps<"button">;

export function SheetClose({ onClick, ...props }: SheetCloseProps) {
  const { setOpen } = useSheet();
  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false, { reason: "close-button" });
      }}
    />
  );
}

/* ───────────── content ───────────── */

export interface SheetContentProps {
  /** The side it comes from. A child takes its parent's. */
  side?: SheetSide;
  /** ioiti-ui: a side sheet's width: `sm` (22 rem), `md` (26 rem, EasyUI's) or `lg` (40 rem), or pixels. */
  size?: SheetSize;
  /**
   * ioiti-ui: `push` pushes the page aside (the body's margin) instead of covering it: a side sheet, from a
   * window `pushMinWidth` wide; narrower, it is drawn over the page. Without a backdrop, it leaves the focus free.
   */
  type?: SheetType;
  /** ioiti-ui: the window's width from which a `push` sheet pushes the page (1024 px). */
  pushMinWidth?: number;
  /** ioiti-ui: a backdrop, and the focus held in the sheet (true); false leaves the page in use. A child takes its parent's. */
  modal?: boolean;
  /** ioiti-ui: a click outside closes the sheet: true when it is modal (on its backdrop), false otherwise. */
  closeOnOutsideClick?: boolean;
  /** ioiti-ui: a side sheet the reader may widen or narrow, by its inner edge or with the arrow keys on it. */
  resizable?: boolean;
  /** ioiti-ui: in pixels (280). */
  minWidth?: number;
  /** ioiti-ui: in pixels; 88% of the window at most in any case. */
  maxWidth?: number;
  /** ioiti-ui: the width the reader gave, in pixels. */
  onResize?: (width: number) => void;
  /** ioiti-ui: the padding of its header, body and footer (`md`, EasyUI's). */
  padding?: SheetPadding;
  /** ioiti-ui: its close button (true), as every layer names it (`showCloseButton`). */
  showCloseButton?: boolean;
  /** ioiti-ui: the close button inside the panel, or outside it, on the side facing the page. */
  closePosition?: "inside" | "outside";
  /** ioiti-ui: its name, for a sheet without a SheetTitle. */
  "aria-label"?: string;
  className?: string;
  children: React.ReactNode;
}

export function SheetContent({
  side: sideProp = "right",
  size = "md",
  type = "overlay",
  pushMinWidth = PUSH_MIN_WIDTH,
  modal: modalProp = true,
  closeOnOutsideClick,
  resizable = false,
  minWidth = MIN_WIDTH,
  maxWidth,
  onResize,
  padding = "md",
  // ioiti-ui: `showCloseButton`, as every layer names it, where EasyUI's said `showClose`.
  showCloseButton = true,
  closePosition = "inside",
  "aria-label": ariaLabel,
  className,
  children,
}: SheetContentProps) {
  const { open, setOpen, titleId, descId, hasDesc, contentId, hasTitle } = useSheet();
  // ioiti-ui: the sheet this one is a child of, if any: it takes its side and its mode, and is drawn
  // in its layer, beside it while it fits there, over it otherwise.
  const parent = React.useContext(LayerContext);
  const isChild = parent !== null;
  const side = parent ? parent.side : sideProp;
  const cfg = SIDES[side];
  const horizontal = side === "left" || side === "right";
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [panel, setPanel] = React.useState<HTMLDivElement | null>(null);
  const [slot, setSlot] = React.useState<HTMLDivElement | null>(null);
  const attachPanel = React.useCallback((node: HTMLDivElement | null) => {
    panelRef.current = node;
    setPanel(node);
  }, []);
  const controls = useDragControls();
  const words = useMessages().dialog;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // ioiti-ui: the width (Elastic's sizes and limits), within EasyUI's 88% of the window: what the reader
  // chose, or the size. A child beside its parent has what the parent leaves of it; over it, it is at
  // least as wide, to leave nothing of it showing.
  const viewport = useViewportWidth(open);
  const [chosen, setChosen] = React.useState<number | null>(null);
  const base = React.useMemo(() => (mounted ? toPixels(size) : 0), [mounted, size]);
  const desired = chosen ?? base;
  const room = Math.floor(viewport * ROOM);
  const besideRoom = parent ? room - parent.edge : room;
  const wanted = Math.max(Math.min(desired, maxWidth ?? Infinity), minWidth);
  const placement: Placement = !parent ? "alone" : horizontal && wanted <= besideRoom ? "beside" : "stacked";
  const limit = Math.max(Math.min(maxWidth ?? Infinity, placement === "beside" ? besideRoom : room), 0);
  const floor = Math.min(minWidth, limit);
  const fitted = clamp(desired, floor, limit);
  const width = placement === "stacked" && parent ? Math.min(Math.max(fitted, parent.width), room) : fitted;
  const offset = placement === "beside" && parent ? parent.edge : 0;
  const z = !parent ? 10 : placement === "beside" ? parent.z - 1 : parent.z + 1;
  const pushing = type === "push" && horizontal && !isChild && viewport >= pushMinWidth;
  // ioiti-ui: said to the sheet, whose trigger then says it opens no dialog.
  const { setPushing } = useSheet();
  React.useLayoutEffect(() => {
    setPushing(pushing);
  }, [pushing, setPushing]);
  const modal = parent ? parent.modal : modalProp && !pushing;
  const closesOutside = closeOnOutsideClick ?? modal;
  // A pushed sheet is part of the page: it neither slides in nor is dragged away.
  const swipe = !pushing;
  const onResizeRef = React.useRef(onResize);
  React.useEffect(() => {
    onResizeRef.current = onResize;
  });

  // ioiti-ui: a parent knows where its child is: beside it, it keeps its close button inside.
  const [child, setChild] = React.useState<Placement | null>(null);
  const report = parent?.setChild;
  React.useEffect(() => {
    if (!open || !report) return;
    report(placement);
    return () => report(null);
  }, [open, report, placement]);

  // ioiti-ui: a child over its parent leaves nothing of it in reach, by the keyboard or a screen reader.
  // Before the focus goes back on closing (an effect's cleanups run in order): it goes back into the parent.
  const host = parent?.panel ?? null;
  React.useEffect(() => {
    if (!open || placement !== "stacked" || !host) return;
    host.setAttribute("inert", "");
    return () => host.removeAttribute("inert");
  }, [open, placement, host]);

  // focus in, and back out, and Esc (ioiti-ui: as every layer keeps the focus, useFocusScope, in place of the sheet's
  // own trap and its list of the sheets open; after the effect above, whose cleanup runs first). In on the sheet itself,
  // its dialog (a child's panel), not a control in it: Enter does nothing until the reader has chosen one. Back to what
  // opened it, while the focus is in the sheet, not when the reader went on in the page. A sheet that holds the page
  // (modal) keeps it, the latest opened keeping it (a child, then its parent: Tab goes round the child alone while it is
  // open), and Escape closes it wherever the focus is. One leaving the page in use (modal={false}, a pushed sheet) leaves
  // the focus free: it takes it when it opens, not when it opens with the page, and Escape closes it while the focus is
  // in it. An Escape meant for what is open in it is left to that.
  const [openWithPage, setOpenWithPage] = React.useState(open);
  if (openWithPage && !open) setOpenWithPage(false);
  const holderRef = isChild ? panelRef : rootRef;
  useFocusScope(holderRef, {
    // A child's panel is drawn once its parent's slot is: its scope starts then.
    active: open && mounted && (!isChild || panel !== null),
    contain: modal,
    autoFocus: modal || !openWithPage,
    initialFocus: () => holderRef.current,
    onEscape: (e) => {
      if (forPopup(e.target)) return;
      e.preventDefault();
      setOpen(false, { reason: "escape" });
    },
  });

  // scroll lock (ioiti-ui: while the sheet holds the page)
  React.useEffect(() => {
    if (!open || !mounted || isChild || !modal) return;
    const bar = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (bar > 0) document.body.style.paddingRight = `${bar}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open, mounted, isChild, modal]);

  // ioiti-ui: a click on the page closes a sheet that leaves it in use, when asked; not one on its own
  // trigger, which closes it itself.
  React.useEffect(() => {
    if (!open || !mounted || modal || !closesOutside) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const holder = isChild ? panelRef.current : rootRef.current;
      if (!target || holder?.contains(target)) return;
      if (target.closest("[aria-controls]")?.getAttribute("aria-controls") === contentId) return;
      setOpen(false, { reason: "outside-click" });
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, mounted, modal, closesOutside, isChild, contentId, setOpen]);

  // ioiti-ui: a pushed sheet takes its width from the page.
  React.useEffect(() => {
    if (!open || !mounted || !pushing) return;
    const edge = side === "left" ? "left" : "right";
    setPush(contentId, edge, width);
    return () => setPush(contentId, edge, null);
  }, [open, mounted, pushing, side, width, contentId]);

  // ioiti-ui: Elastic's resizable flyout: the inner edge dragged, or the arrow keys on it (Shift for
  // larger steps, Home and End for its narrowest and widest).
  const [resizing, setResizing] = React.useState(false);
  const resizeTo = (next: number) => {
    const value = clamp(Math.round(next), floor, limit);
    if (value === width) return;
    setChosen(value);
    onResizeRef.current?.(value);
  };
  const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const grip = e.currentTarget;
    const from = e.clientX;
    const start = width;
    const range = { floor, limit };
    let current = width;
    grip.setPointerCapture?.(e.pointerId);
    setResizing(true);
    const move = (ev: PointerEvent) => {
      const delta = side === "right" ? from - ev.clientX : ev.clientX - from;
      const next = clamp(Math.round(start + delta), range.floor, range.limit);
      if (next === current) return;
      current = next;
      setChosen(next);
      onResizeRef.current?.(next);
    };
    const end = () => {
      grip.removeEventListener("pointermove", move);
      grip.removeEventListener("pointerup", end);
      grip.removeEventListener("pointercancel", end);
      setResizing(false);
    };
    grip.addEventListener("pointermove", move);
    grip.addEventListener("pointerup", end);
    grip.addEventListener("pointercancel", end);
  };
  const resizeByKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? STEP_LARGE : STEP;
    const widen = side === "right" ? "ArrowLeft" : "ArrowRight";
    const narrow = side === "right" ? "ArrowRight" : "ArrowLeft";
    const next =
      e.key === widen ? width + step : e.key === narrow ? width - step : e.key === "Home" ? floor : e.key === "End" ? limit : null;
    if (next === null) return;
    e.preventDefault();
    resizeTo(next);
  };

  const layer = React.useMemo<Layer>(
    () => ({
      slot: parent ? parent.slot : slot,
      panel,
      side,
      edge: horizontal ? offset + width : 0,
      width,
      z,
      modal,
      padding,
      setChild,
    }),
    [parent, slot, panel, side, horizontal, offset, width, z, modal, padding]
  );

  if (!mounted) return null;

  const handle = (
    <div
      onPointerDown={(e) => controls.start(e)}
      className="flex h-7 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
    >
      <span className="h-1 w-9 rounded-full bg-border" />
    </div>
  );

  const resizeHandle =
    resizable && horizontal ? (
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={words.resize}
        aria-controls={contentId}
        aria-valuenow={width}
        aria-valuemin={floor}
        aria-valuemax={limit}
        aria-valuetext={words.width(width)}
        tabIndex={0}
        onPointerDown={startResize}
        onKeyDown={resizeByKey}
        className={cn(
          "group absolute inset-y-0 z-10 w-3 cursor-col-resize touch-none",
          side === "right" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
        )}
      >
        <span
          className={cn(
            "absolute left-1/2 top-1/2 h-10 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border-hover transition-colors group-hover:bg-text-subtle",
            resizing && "bg-muted-foreground"
          )}
        />
      </div>
    ) : null;

  // ioiti-ui: outside the panel when asked (Elastic's), but inside while a child is beside it, which it
  // would cover; the design's greys (EasyUI's neutral-400 was 2.5:1 on white) and its one focus ring.
  const outside = closePosition === "outside" && child !== "beside";
  const closeButton = showCloseButton ? (
    <button
      type="button"
      aria-label={words.close}
      onClick={() => setOpen(false, { reason: "close-button" })}
      className={cn(
        CLOSE_MD,
        "absolute z-10",
        // Outside, it floats beside the panel, on the scrim.
        outside ? cn("rounded-full bg-surface shadow-elevated", OUTSIDE[side]) : "right-3 top-3"
      )}
    >
      <X />
    </button>
  ) : null;

  const sheet = (
    <motion.div
      key="flysheet-panel"
      ref={attachPanel}
      id={contentId}
      // ioiti-ui: a child is a group of the dialog, named by its own title; the sheet alone is named on
      // its layer, the dialog, which holds its children too.
      role={isChild ? "group" : undefined}
      aria-labelledby={isChild && hasTitle ? titleId : undefined}
      aria-label={isChild && !hasTitle ? ariaLabel : undefined}
      aria-describedby={isChild && hasDesc ? descId : undefined}
      tabIndex={-1}
      className={cn(
        // ioiti-ui: the panel no longer clips (its contents do): the close button may be outside it.
        // ioiti-ui: a dialog's surface, line and shadow (DIALOG's), on the sides its place gives it (its border and radius).
        "pointer-events-auto absolute flex flex-col border-border bg-surface text-foreground shadow-elevated outline-none",
        cfg.pos,
        // ioiti-ui: glass under the glass material: floating over the page (glass-float), or a bar beside it.
        pushing ? "shadow-none glass-bar" : "glass-float",
        resizing && "select-none",
        className
      )}
      style={{
        ...(horizontal ? (side === "left" ? { width, left: offset } : { width, right: offset }) : null),
        zIndex: z,
        ...(horizontal && swipe ? { touchAction: "pan-y" } : null),
      }}
      initial={pushing ? false : cfg.from}
      animate={cfg.to}
      exit={pushing ? undefined : cfg.from}
      transition={spring}
      drag={swipe ? cfg.axis : false}
      dragControls={controls}
      dragListener={false}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={cfg.elastic}
      dragMomentum={false}
      dragTransition={DRAG_RETURN}
      onDragEnd={(_, info) => {
        if (cfg.dismiss(info)) setOpen(false, { reason: "drag" });
      }}
      // left/right: swipe anywhere on touch. top/bottom: grab the handle.
      // ioiti-ui: not from a child beside it, whose events React passes on through the portal.
      onPointerDown={
        horizontal && swipe
          ? (e) => {
              if (e.pointerType !== "mouse" && panelRef.current?.contains(e.target as Node)) controls.start(e);
            }
          : undefined
      }
    >
      {side === "bottom" && handle}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[inherit]">{children}</div>
      {side === "top" && handle}
      {resizeHandle}
      {closeButton}
    </motion.div>
  );

  // ioiti-ui: the dialog is the layer (as Dialog's), not the panel: a child drawn beside the panel
  // is in it too. A pushed sheet is no dialog: a region of the page.
  const content = isChild
    ? parent.slot && createPortal(<AnimatePresence>{open && sheet}</AnimatePresence>, parent.slot)
    : createPortal(
        <AnimatePresence>
          {open && (
            <div
              key="flysheet"
              ref={rootRef}
              data-flysheet=""
              role={pushing ? "region" : "dialog"}
              aria-modal={modal ? true : undefined}
              aria-labelledby={hasTitle ? titleId : undefined}
              aria-label={hasTitle ? undefined : ariaLabel}
              aria-describedby={hasDesc ? descId : undefined}
              tabIndex={-1}
              // ioiti-ui: kept above the page while a page changes, as every layer over it (over-page, motion.css).
              className={cn("fixed inset-0 outline-none over-page", pushing ? "z-40" : "z-50", !modal && "pointer-events-none")}
            >
              {modal && (
                <motion.div
                  aria-hidden
                  // ioiti-ui: lighter under the glass material, as the other dialogs' scrims.
                  className={cn("absolute inset-0", SCRIM)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  // ioiti-ui: the scrims' motion: easeFast arriving, easeExit leaving.
                  exit={{ opacity: 0, transition: motionTransitions.easeExit }}
                  transition={motionTransitions.easeFast}
                  onClick={() => closesOutside && setOpen(false, { reason: "outside-click" })}
                />
              )}
              {sheet}
              <div ref={setSlot} className="contents" />
            </div>
          )}
        </AnimatePresence>,
        document.body
      );

  return <LayerContext.Provider value={layer}>{content}</LayerContext.Provider>;
}

/* ───────────── layout parts ───────────── */

// ioiti-ui: its props named, as every component's (exported from src/index.ts).
/** The props of `SheetHeader`: a `<div>`'s. */
export type SheetHeaderProps = React.ComponentProps<"div">;

// ioiti-ui: their padding is the sheet's (`padding`).
export function SheetHeader({ className, ...props }: SheetHeaderProps) {
  const pad = usePadding();
  return <div className={cn("flex flex-col gap-1", pad.header, "pr-14", className)} {...props} />;
}

// ioiti-ui: its props named, as every component's (exported from src/index.ts).
/** The props of `SheetTitle`: an `<h2>`'s. */
export type SheetTitleProps = React.ComponentProps<"h2">;

export function SheetTitle({ className, ...props }: SheetTitleProps) {
  const { titleId, setHasTitle } = useSheet();
  // ioiti-ui: the sheet is named by its title when it has one (EasyUI pointed at an id that might be missing).
  React.useEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);
  // ioiti-ui: as large as a page's title (PageHeader), which a sheet's is, over the page.
  // ioiti-ui: its words are its children, in its props (which the linter cannot see).
  // oxlint-disable-next-line jsx-a11y/heading-has-content -- given by its caller
  return <h2 className={cn("text-2xl font-bold tracking-tight", className)} {...props} id={titleId} />;
}

// ioiti-ui: its props named, as every component's (exported from src/index.ts).
/** The props of `SheetDescription`: a `<p>`'s. */
export type SheetDescriptionProps = React.ComponentProps<"p">;

export function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  const { descId, setHasDesc } = useSheet();
  React.useEffect(() => {
    setHasDesc(true);
    return () => setHasDesc(false);
  }, [setHasDesc]);
  // ioiti-ui: the design's muted text, 4.5:1 on every surface, glass too (neutral-500 was not).
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} id={descId} />;
}

/** ioiti-ui: how tall the fade under the header grows, as the body scrolls (px). */
const BODY_FADE = 32;

// ioiti-ui: scrolled, the body fades out under the header, the fade as tall as it has scrolled up to BODY_FADE: what
// went under the header no longer stops at a hard line. A mask, so on any surface, glass too; none at rest, where
// nothing went under it (what a body holds that floats is drawn in the sheet's layer, out of the mask's reach).
function fadeUnderHeader(body: HTMLElement) {
  const fade = Math.min(Math.max(body.scrollTop, 0), BODY_FADE);
  if (fade > 0) {
    body.dataset.scrolled = "";
    body.style.setProperty("--flysheet-fade", `${fade}px`);
  } else {
    delete body.dataset.scrolled;
    body.style.removeProperty("--flysheet-fade");
  }
}

// ioiti-ui: its props named, as every component's (exported from src/index.ts).
/** The props of `SheetBody`: a `<div>`'s. */
export type SheetBodyProps = React.ComponentProps<"div">;

export function SheetBody({ className, onScroll, ref, ...props }: SheetBodyProps) {
  const pad = usePadding();
  const body = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => body.current as HTMLDivElement);
  // Opened already scrolled (a body kept between two openings): faded from the start.
  React.useLayoutEffect(() => {
    if (body.current) fadeUnderHeader(body.current);
  }, []);
  // ioiti-ui: taller than the sheet and holding no control (a record's details), a stop of the keyboard, which scrolls
  // it, named as the sheet is (src/lib/scroll-region.ts).
  const sheet = React.useContext(SheetContext);
  // ioiti-ui: without a title, named in the provider's language.
  const content = useMessages().dialog.content;
  const region = useScrollRegion(body, sheet?.hasTitle ? { labelledBy: sheet.titleId } : { label: content });
  return (
    <div
      ref={body}
      {...region}
      className={cn(
        "flex-1 overflow-y-auto",
        "data-[scrolled]:[mask-image:linear-gradient(to_bottom,transparent,#000_var(--flysheet-fade))]",
        pad.body,
        className
      )}
      onScroll={(event) => {
        fadeUnderHeader(event.currentTarget);
        onScroll?.(event);
      }}
      {...props}
    />
  );
}

// ioiti-ui: its props named, as every component's (exported from src/index.ts).
/** The props of `SheetFooter`: a `<div>`'s. */
export type SheetFooterProps = React.ComponentProps<"div">;

export function SheetFooter({ className, ...props }: SheetFooterProps) {
  const pad = usePadding();
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t border-border",
        pad.footer,
        className
      )}
      {...props}
    />
  );
}
