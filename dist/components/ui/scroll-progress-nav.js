'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, ChevronRight } from 'lucide-react';
import { isPlainClick } from '../../lib/links.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
const defaultSections = [
    { id: 'overview', index: '01', label: 'Overview' },
    { id: 'features', index: '02', label: 'Features' },
    { id: 'components', index: '03', label: 'Components' },
    { id: 'documentation', index: '04', label: 'Documentation' },
    { id: 'pricing', index: '05', label: 'Pricing' },
];
export const ScrollProgressNav = ({ sections = defaultSections, scrollThreshold = 150, activeId: controlledActiveId, mode = 'fixed', containerRef, onSectionClick, position = 'top-center', className, label = 'Table of contents', }) => {
    const uniqueId = React.useId();
    const reduceMotion = useReducedMotion();
    const rowRef = useRef(null);
    const [isFloating, setIsFloating] = useState(mode !== 'inline');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState(controlledActiveId || sections[0]?.id || '');
    const [isExpanded, setIsExpanded] = useState(false);
    useEffect(() => {
        if (controlledActiveId) {
            setActiveSection(controlledActiveId);
        }
    }, [controlledActiveId]);
    const handleScroll = useCallback(() => {
        let totalHeight = 0;
        let currentScroll = 0;
        if (containerRef && containerRef.current) {
            const el = containerRef.current;
            totalHeight = el.scrollHeight - el.clientHeight;
            currentScroll = el.scrollTop;
        }
        else if (mode === 'fixed') {
            totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            currentScroll = window.scrollY;
        }
        if (totalHeight > 0) {
            const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
            setScrollProgress(progress);
        }
        if (mode === 'fixed') {
            setIsFloating(currentScroll > scrollThreshold);
        }
        if (!controlledActiveId) {
            if (containerRef && containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                for (let i = sections.length - 1; i >= 0; i--) {
                    const el = containerRef.current.querySelector(`#${sections[i].id}`);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        if (rect.top - containerRect.top <= 120) {
                            setActiveSection(sections[i].id);
                            break;
                        }
                    }
                }
            }
            else if (mode === 'fixed') {
                for (let i = sections.length - 1; i >= 0; i--) {
                    const el = document.getElementById(sections[i].id);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        if (rect.top <= window.innerHeight * 0.4) {
                            setActiveSection(sections[i].id);
                            break;
                        }
                    }
                }
            }
        }
    }, [scrollThreshold, controlledActiveId, sections, containerRef, mode]);
    useEffect(() => {
        const target = containerRef?.current || (mode === 'fixed' ? window : null);
        if (!target)
            return;
        target.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => target.removeEventListener('scroll', handleScroll);
    }, [handleScroll, containerRef, mode]);
    const scrollToSection = (id) => {
        setActiveSection(id);
        onSectionClick?.(id);
        // ioiti-ui: brought into view in its container as on the page, so that its scroll-margin-top keeps it clear of
        // a sticky nav (20 px put the part's heading under it); at once when motion is reduced.
        document.getElementById(id)?.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        setIsExpanded(false);
    };
    // ioiti-ui: a part with an address is a link. A plain click scrolls to it here and puts it in the address, in place
    // (no step more to go back through); with ⌘, Ctrl, Shift or Alt the browser has it (another tab, at its place).
    const followSection = (event, section) => {
        if (!isPlainClick(event))
            return;
        event.preventDefault();
        scrollToSection(section.id);
        if (section.href)
            window.history.replaceState(window.history.state, '', section.href);
    };
    // ioiti-ui: from a tablet up the parts are a row that scrolls sideways when wider than the page: the current one kept in it.
    useEffect(() => {
        const row = rowRef.current;
        const current = row?.querySelector('[aria-current]');
        if (!row || !current)
            return;
        const box = row.getBoundingClientRect();
        const item = current.getBoundingClientRect();
        if (item.left < box.left)
            row.scrollLeft -= box.left - item.left + 8;
        else if (item.right > box.right)
            row.scrollLeft += item.right - box.right + 8;
    }, [activeSection]);
    const scrollToTop = () => {
        const behavior = reduceMotion ? 'auto' : 'smooth';
        if (containerRef && containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior });
        }
        else {
            window.scrollTo({ top: 0, behavior });
        }
    };
    const currentActiveItem = sections.find((s) => s.id === activeSection) || sections[0];
    const positionClasses = {
        'top-center': 'top-6 left-1/2 -translate-x-1/2',
        'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
        'top-right': 'top-6 right-6',
    };
    const wrapperClass = mode === 'fixed'
        ? cn('fixed z-40 max-w-[95vw]', positionClasses[position])
        : mode === 'sticky'
            ? 'sticky top-3 z-20 w-fit max-w-full mx-auto'
            : 'relative w-fit max-w-full mx-auto';
    return (_jsx("div", { className: cn('font-sans transition-all duration-300 select-none', wrapperClass, className), children: _jsxs(motion.nav, { layout: true, transition: motionTransitions.springMorph, className: cn(
            // ioiti-ui: glass under the glass material (glass-float). Not the phone's menu inside it: its blur would see
            // nothing but this pill.
            'relative max-w-full rounded-full border border-neutral-200 bg-white/95 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-1 flex items-center gap-1 dark:border-[#1F1F1F] dark:bg-[#0E0E0E]/95 dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] glass-float', isFloating ? 'ring-1 ring-black/5 dark:ring-white/5' : ''), role: "navigation", "aria-label": label, children: [_jsx("div", { className: "absolute inset-0 rounded-full overflow-hidden pointer-events-none", children: _jsx("div", { 
                        // ioiti-ui: the progress, the part shown and its pill in the accent, where the theme has one (accent:).
                        className: "h-[1.5px] bg-neutral-900 dark:bg-[#FAFAFA] accent:bg-brand absolute top-0 left-0 transition-all duration-150", style: { width: `${scrollProgress}%` } }) }), _jsxs("div", { className: "flex md:hidden items-center px-2 py-1 gap-2", children: [_jsx("span", { "aria-hidden": "true", className: "text-[10px] font-mono text-muted-foreground", children: currentActiveItem?.index }), _jsx("span", { className: "text-xs font-medium text-neutral-900 dark:text-[#FAFAFA]", children: currentActiveItem?.label }), _jsx("button", { type: "button", onClick: () => setIsExpanded(!isExpanded), className: "p-1 rounded-full text-muted-foreground hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer", "aria-label": "Toggle section menu", "aria-expanded": isExpanded, children: _jsx(ChevronRight, { className: cn('w-3.5 h-3.5 transition-transform', isExpanded && 'rotate-90') }) })] }), _jsx("div", { ref: rowRef, className: cn('hidden md:flex items-center gap-0.5 min-w-0 md:-mx-1 md:-my-1 md:px-1 md:py-1 md:overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', isExpanded ? '!flex flex-col md:flex-row absolute top-12 left-1/2 -translate-x-1/2 w-max max-w-[calc(100vw-2rem)] p-2 rounded-2xl bg-white border border-neutral-200 dark:bg-[#0E0E0E] dark:border-[#1F1F1F] md:relative md:top-auto md:left-auto md:translate-x-0 md:w-auto md:max-w-none md:p-0 md:bg-transparent md:dark:bg-transparent md:border-none' : ''), children: sections.map((section, idx) => {
                        const isActive = activeSection === section.id;
                        const indexStr = section.index || `0${idx + 1}`;
                        const Item = section.href !== undefined ? 'a' : 'button';
                        return (_jsxs(Item, { ...(section.href !== undefined
                                ? { href: section.href, onClick: (event) => followSection(event, section) }
                                : { type: 'button', onClick: () => scrollToSection(section.id) }), "aria-current": isActive ? 'location' : undefined, className: cn('relative shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus-ring inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer', isActive ? 'text-neutral-900 dark:text-[#FAFAFA] accent:text-brand-text' : 'text-muted-foreground hover:text-neutral-900 dark:hover:text-[#A1A1A1]'), children: [isActive && (_jsx(motion.div, { layoutId: `active-scroll-pill-${uniqueId}`, transition: motionTransitions.springMorph, className: "absolute inset-0 rounded-full bg-neutral-100 border border-neutral-200 z-0 shadow-xs dark:bg-[#141414] dark:border-[#1F1F1F] accent:bg-brand-soft accent:border-brand/30" })), _jsx("span", { "aria-hidden": "true", className: cn('text-[10px] font-mono relative z-10', isActive ? 'text-neutral-900/80 dark:text-[#FAFAFA]/80 accent:text-brand-text' : 'text-muted-foreground'), children: indexStr }), _jsx("span", { className: "relative z-10", children: section.label })] }, section.id));
                    }) }), isFloating && (_jsx("button", { type: "button", onClick: scrollToTop, className: "w-6 h-6 rounded-full bg-neutral-100 hover:bg-white border border-neutral-200 hover:border-neutral-400 flex items-center justify-center text-muted-foreground hover:text-neutral-900 transition-colors focus-ring shrink-0 ml-0.5 cursor-pointer dark:bg-[#141414] dark:hover:bg-[#0E0E0E] dark:border-[#1F1F1F] dark:hover:border-[#4A4A4A] dark:hover:text-[#FAFAFA]", title: "Scroll to top", "aria-label": "Scroll back to top", children: _jsx(ArrowUp, { className: "w-3 h-3" }) }))] }) }));
};
