"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, PanelLeft } from "lucide-react";
import { isPlainClick } from "../../lib/links.js";
import { cn } from "../../lib/utils.js";
import { useLinkComponent } from "../link-context.js";
function useControllableState(value, defaultValue, onChange) {
    const [internal, setInternal] = React.useState(defaultValue);
    const controlled = value !== undefined;
    const current = controlled ? value : internal;
    const onChangeRef = React.useRef(onChange);
    React.useEffect(() => {
        onChangeRef.current = onChange;
    });
    const set = React.useCallback((next) => {
        if (!controlled)
            setInternal(next);
        onChangeRef.current?.(next);
    }, [controlled]);
    return [current, set];
}
const spring = { type: "spring", stiffness: 420, damping: 36, mass: 0.8 };
// ioiti-ui: the sidebar stays beside the page from md up; below, it is a drawer. Asked only where
// the browser can answer (jsdom has no matchMedia).
const isWide = () => typeof window.matchMedia === "function" && window.matchMedia("(min-width: 768px)").matches;
const EXPANDED = 248;
const COLLAPSED = 56;
const SidebarContext = React.createContext({ collapsed: false });
/** Use inside `header` / `footer` to adapt to the icon-only state. */
export const useSidebar = () => React.useContext(SidebarContext);
export function Sidebar({ collapsed: collapsedProp, defaultCollapsed = false, onCollapsedChange, mobileOpen: mobileProp, onMobileOpenChange, className, ...content }) {
    const [collapsed, setCollapsed] = useControllableState(collapsedProp, defaultCollapsed, onCollapsedChange);
    const [mobileOpen, setMobileOpen] = useControllableState(mobileProp, false, onMobileOpenChange);
    // ⌘B / Ctrl+B
    React.useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
                e.preventDefault();
                if (isWide())
                    setCollapsed(!collapsed);
                else
                    setMobileOpen(!mobileOpen);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [collapsed, mobileOpen, setCollapsed, setMobileOpen]);
    // drawer: Esc to close + scroll lock
    React.useEffect(() => {
        if (!mobileOpen || isWide())
            return;
        const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [mobileOpen, setMobileOpen]);
    return (_jsxs(_Fragment, { children: [_jsx(motion.aside, { initial: false, animate: { width: collapsed ? COLLAPSED : EXPANDED }, transition: spring, className: cn(
                // ioiti-ui: glass under the glass material (glass-bar), as the drawer below (glass-float), its scrim lighter.
                "hidden h-full shrink-0 overflow-hidden border-r border-neutral-200 bg-white md:block dark:border-neutral-800 dark:bg-neutral-950 glass-bar", className), children: _jsx(Panel, { ...content, collapsed: collapsed, onToggle: () => setCollapsed(!collapsed) }) }), _jsx(AnimatePresence, { children: mobileOpen && (_jsxs("div", { className: "fixed inset-0 z-50 md:hidden", children: [_jsx(motion.div, { "aria-hidden": true, className: "absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] glass:bg-[var(--glass-scrim)]", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setMobileOpen(false) }), _jsx(motion.aside, { role: "dialog", "aria-modal": "true", "aria-label": "Navigation", className: "absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] overflow-hidden border-r border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950 glass-float", initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" }, transition: spring, drag: "x", dragConstraints: { left: 0, right: 0 }, dragElastic: { left: 0.5, right: 0 }, dragMomentum: false, onDragEnd: (_, info) => {
                                if (info.offset.x < -80 || info.velocity.x < -400)
                                    setMobileOpen(false);
                            }, children: _jsx(Panel, { ...content, collapsed: false, onNavigate: () => setMobileOpen(false) }) })] }, "drawer")) })] }));
}
/** Put anywhere (e.g. your top bar). Only visible below md. */
export function SidebarTrigger({ className, ...props }) {
    return (_jsx("button", { type: "button", "aria-label": "Open navigation", className: cn("grid size-9 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 md:hidden dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white", className), ...props, children: _jsx(PanelLeft, { className: "size-[18px]" }) }));
}
function Panel({ sections, activeId, onActiveChange, linkComponent, header, footer, collapsed, onToggle, onNavigate, }) {
    const LinkComponent = useLinkComponent(linkComponent);
    const uid = React.useId();
    const [hoverBox, setHoverBox] = React.useState(null);
    const [hovering, setHovering] = React.useState(false);
    const [tip, setTip] = React.useState(null);
    const [open, setOpen] = React.useState(() => new Set(sections
        .flatMap((s) => s.items)
        .filter((i) => i.children?.some((c) => c.id === activeId))
        .map((i) => i.id)));
    const enter = (e, label) => {
        const el = e.currentTarget;
        setHoverBox({ y: el.offsetTop, h: el.offsetHeight });
        setHovering(true);
        if (collapsed) {
            const r = el.getBoundingClientRect();
            setTip({ label, x: r.right + 10, y: r.top + r.height / 2 });
        }
        else
            setTip(null);
    };
    const renderItem = (item) => {
        const hasChildren = !!item.children?.length;
        const isOpen = hasChildren && open.has(item.id) && !collapsed;
        const childActive = !!item.children?.some((c) => c.id === activeId);
        const isActive = !hasChildren && activeId === item.id;
        const linked = !hasChildren && item.href !== undefined;
        const Entry = linked ? LinkComponent : "button";
        const onClick = (e) => {
            if (linked && !isPlainClick(e))
                return;
            if (!hasChildren) {
                onActiveChange?.(item.id);
                onNavigate?.();
            }
            else if (collapsed) {
                onToggle?.();
                setOpen((p) => new Set(p).add(item.id));
            }
            else {
                setOpen((p) => {
                    const n = new Set(p);
                    if (n.has(item.id))
                        n.delete(item.id);
                    else
                        n.add(item.id);
                    return n;
                });
            }
        };
        return (_jsxs("div", { children: [_jsxs(Entry, { ...(linked ? { href: item.href } : { type: "button" }), onClick: onClick, onMouseEnter: (e) => enter(e, item.label), onFocus: (e) => enter(e, item.label), "aria-label": collapsed ? item.label : undefined, "aria-expanded": hasChildren ? isOpen : undefined, "aria-current": isActive ? "page" : undefined, className: cn("relative flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400/50 dark:focus-visible:ring-neutral-600/60", isActive || childActive
                        ? // ioiti-ui: the page shown, in the accent when the theme has one (accent:), as its pill below.
                            "text-neutral-900 dark:text-white accent:text-brand-text"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"), children: [isActive && (_jsx(motion.span, { layoutId: `${uid}-active`, transition: spring, className: "absolute inset-0 rounded-lg bg-neutral-200/70 dark:bg-neutral-800 accent:bg-brand-soft" })), _jsx("span", { className: "relative grid size-5 shrink-0 place-items-center [&>svg]:size-[18px]", children: item.icon }), _jsx(motion.span, { initial: false, animate: { opacity: collapsed ? 0 : 1 }, transition: { duration: 0.15 }, className: "relative flex-1 truncate whitespace-nowrap text-left", children: item.label }), !collapsed && item.badge !== undefined && (_jsx(motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "relative rounded-md bg-neutral-200/70 px-1.5 text-[11px] tabular-nums text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300", children: item.badge })), !collapsed && hasChildren && (_jsx(ChevronRight, { className: cn("relative size-3.5 shrink-0 text-neutral-500 transition-transform duration-200 dark:text-neutral-400", isOpen && "rotate-90") }))] }), _jsx(AnimatePresence, { initial: false, children: isOpen && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] }, className: "overflow-hidden", children: _jsx("div", { className: "ml-[19px] mt-0.5 space-y-0.5 border-l border-neutral-200 py-0.5 pl-3 dark:border-neutral-800", children: item.children.map((c) => {
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
                                    }, "aria-current": active ? "page" : undefined, className: cn("relative flex h-8 w-full items-center gap-2 rounded-md px-2 text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400/50 dark:focus-visible:ring-neutral-600/60", active
                                        ? // ioiti-ui: the page shown, and its dot, in the accent (accent:).
                                            "text-neutral-900 dark:text-white accent:text-brand-text"
                                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"), children: [active && (_jsx(motion.span, { layoutId: `${uid}-dot`, transition: spring, className: "absolute -left-[15.5px] top-[13px] size-1.5 rounded-full bg-neutral-900 dark:bg-white accent:bg-brand" })), _jsx("span", { className: "flex-1 truncate text-left", children: c.label }), c.badge !== undefined && (_jsx("span", { className: "text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400", children: c.badge }))] }, c.id));
                            }) }) })) })] }, item.id));
    };
    return (_jsxs(SidebarContext.Provider, { value: { collapsed }, children: [_jsxs("div", { className: "flex h-full flex-col", children: [header && (_jsx("div", { className: cn("flex h-14 shrink-0 items-center overflow-hidden px-4 transition-all", collapsed && "w-14 justify-center px-0 [&>div>*:not(:first-child)]:hidden [&>div]:gap-0 [&>*:not(:first-child)]:hidden"), children: header })), _jsxs("nav", { "aria-label": "Main", onMouseLeave: () => {
                            setHovering(false);
                            setTip(null);
                        }, className: "relative flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: [hoverBox && (_jsx(motion.span, { "aria-hidden": true, initial: false, animate: { y: hoverBox.y, height: hoverBox.h, opacity: hovering ? 1 : 0 }, transition: { y: spring, height: spring, opacity: { duration: 0.15 } }, className: "pointer-events-none absolute inset-x-2 top-0 rounded-lg bg-neutral-100 dark:bg-neutral-900" })), sections.map((section, i) => (_jsxs("div", { className: "space-y-0.5", children: [section.title &&
                                        (collapsed ? (_jsx("div", { className: "mx-2.5 my-2 h-px bg-neutral-200 dark:bg-neutral-800" })) : (_jsx("p", { className: "truncate px-2.5 pb-1 pt-4 text-xs text-neutral-500", children: section.title }))), section.items.map(renderItem)] }, i)))] }), (footer || onToggle) && (_jsxs("div", { className: "shrink-0 space-y-1 border-t border-neutral-200 p-2 dark:border-neutral-800", children: [footer, onToggle && (_jsxs("button", { type: "button", onClick: onToggle, onMouseEnter: (e) => {
                                    if (!collapsed)
                                        return;
                                    const r = e.currentTarget.getBoundingClientRect();
                                    setTip({ label: "Expand", x: r.right + 10, y: r.top + r.height / 2 });
                                }, onMouseLeave: () => setTip(null), "aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar", className: "flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-sm text-neutral-500 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-400/50 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white dark:focus-visible:ring-neutral-600/60", children: [_jsx("span", { className: "grid size-5 shrink-0 place-items-center", children: _jsx(PanelLeft, { className: "size-[18px]" }) }), _jsx(motion.span, { initial: false, animate: { opacity: collapsed ? 0 : 1 }, transition: { duration: 0.15 }, className: "flex-1 whitespace-nowrap text-left", children: "Collapse" }), !collapsed && (_jsx("kbd", { className: "rounded border border-neutral-200 px-1 font-sans text-[10px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400", children: "\u2318B" }))] }))] }))] }), _jsx(AnimatePresence, { children: collapsed && tip && (_jsx("div", { className: "pointer-events-none fixed z-[60] -translate-y-1/2", style: { left: tip.x, top: tip.y }, children: _jsx(motion.div, { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0 }, transition: { duration: 0.12 }, className: "whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-neutral-900", children: tip.label }) }, "tip")) })] }));
}
