'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Minus, Search, Sparkles, Filter, ChevronDown, Info } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { fieldBorder } from '../../lib/field-border.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { PRESSABLE, SECTION } from '../../lib/recipes.js';
// ioiti-ui: EasyUI's name kept until 1.0, drawing this one (renamed).
import { renamed } from '../../lib/renamed.js';
import { Hint } from '../Hint.js';
import { useLinkComponent } from '../link-context.js';
// ioiti-ui: its words in the provider's language (`table`).
import { useMessages } from '../locale-context.js';
// ioiti-ui: each colour has a light value in front of EasyUI's own, kept behind `dark:`.
export const ComparisonTable = ({ plans = [], categories = [], defaultPlanId, enableSearch = true, enableDiffFilter = true, className, label: givenLabel, matrixTitle: givenMatrixTitle, countLabel: givenCountLabel, searchPlaceholder: givenSearchPlaceholder, diffLabel: givenDiffLabel, emptyText: givenEmptyText, linkComponent, 
// ioiti-ui: what names or describes it goes to the table, not to the frame around it.
'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, ...props }) => {
    // ioiti-ui: the application's link (LinkProvider) unless one is given.
    const LinkComponent = useLinkComponent(linkComponent);
    // ioiti-ui: its words in the provider's language, its own props given over them; its rows counted as the language
    // counts ("1 specification": EasyUI's said "1 specifications").
    const words = useMessages().table;
    const label = givenLabel ?? words.comparisonName;
    const matrixTitle = givenMatrixTitle ?? words.comparisonMatrix;
    const countLabel = givenCountLabel ?? words.comparisonCount;
    const searchPlaceholder = givenSearchPlaceholder ?? words.comparisonSearch;
    const diffLabel = givenDiffLabel ?? words.comparisonDifferences;
    const emptyText = givenEmptyText ?? words.comparisonEmpty;
    const [selectedPlanId, setSelectedPlanId] = useState(defaultPlanId || (plans.find((p) => p.featured)?.id || plans[0]?.id || ''));
    const [searchQuery, setSearchQuery] = useState('');
    const [diffOnly, setDiffOnly] = useState(false);
    const [collapsedCategories, setCollapsedCategories] = useState(new Set());
    const toggleCategory = (catId) => {
        setCollapsedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(catId))
                next.delete(catId);
            else
                next.add(catId);
            return next;
        });
    };
    // Filter categories and features
    const filteredCategories = useMemo(() => {
        const keyOf = (feat, planId) => feat.keys ? feat.keys[planId] : JSON.stringify(feat.values[planId]);
        const isFeatureDifferentiated = (feat) => {
            if (plans.length <= 1)
                return true;
            const firstVal = keyOf(feat, plans[0].id);
            for (let i = 1; i < plans.length; i++) {
                if (keyOf(feat, plans[i].id) !== firstVal) {
                    return true;
                }
            }
            return false;
        };
        return categories
            .map((cat) => {
            const matchingFeatures = cat.features.filter((feat) => {
                const matchSearch = !searchQuery.trim() ||
                    feat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (feat.description && feat.description.toLowerCase().includes(searchQuery.toLowerCase()));
                const matchDiff = !diffOnly || isFeatureDifferentiated(feat);
                return matchSearch && matchDiff;
            });
            return {
                ...cat,
                features: matchingFeatures,
            };
        })
            .filter((cat) => cat.features.length > 0);
    }, [categories, searchQuery, diffOnly, plans]);
    const renderValueCell = (value) => {
        if (typeof value === 'boolean') {
            return value ? (_jsx("span", { className: "inline-flex items-center justify-center size-5 rounded-full bg-positive/5 text-positive border border-positive/30 dark:bg-positive/10", children: _jsx(Check, { className: "size-3" }) })) : (_jsx("span", { className: "inline-flex items-center justify-center size-5 rounded-full bg-muted text-muted-foreground", children: _jsx(Minus, { className: "size-3" }) }));
        }
        if (typeof value === 'string') {
            return _jsx("span", { className: "text-sm font-mono text-foreground", children: value });
        }
        return value;
    };
    // ioiti-ui: one column for the rows' names and one per plan, whatever their number (EasyUI's grid had three plans).
    const columns = {
        '--plans': plans.length,
    };
    const grid = 'grid grid-cols-1 sm:grid-cols-[minmax(9rem,1.1fr)_repeat(var(--plans),minmax(0,1fr))]';
    return (_jsxs("div", { className: cn(
        // ioiti-ui: a section, as a Panel: its border, its surface, glass under the glass material (glass-card).
        SECTION, 'w-full p-4 sm:p-5 text-foreground overflow-hidden', className), style: columns, ...props, children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-border/40", children: [_jsxs("div", { className: "flex items-center gap-3", children: [enableSearch && (_jsxs("div", { className: "relative flex-1 sm:w-64", children: [_jsx(Search, { className: "size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: searchPlaceholder, "aria-label": searchPlaceholder, 
                                        // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                                        className: cn('w-full pl-9 pr-3.5 py-1.5 text-base sm:text-sm rounded-lg border bg-surface text-foreground placeholder:text-text-subtle transition-colors', fieldBorder(false)) })] })), enableDiffFilter && (_jsxs("button", { type: "button", onClick: () => setDiffOnly((prev) => !prev), "aria-pressed": diffOnly, className: cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors shrink-0', PRESSABLE, diffOnly
                                    ? // ioiti-ui: on, and the featured plan below, in the accent (accent:).
                                        'bg-primary text-primary-foreground border-primary accent:bg-brand accent:text-brand-foreground accent:border-brand'
                                    : 'bg-surface text-muted-foreground border-border hover:text-foreground hover:border-border-hover'), children: [_jsx(Filter, { className: "size-4" }), _jsx("span", { children: diffLabel })] }))] }), _jsx("div", { className: "sm:hidden flex items-center p-1 bg-surface-raised rounded-xl border border-border", children: plans.map((p) => {
                            const isSelected = selectedPlanId === p.id;
                            return (_jsxs("button", { type: "button", onClick: () => setSelectedPlanId(p.id), "aria-pressed": isSelected, className: cn('relative flex-1 py-1.5 px-2 text-sm font-medium text-center rounded-lg transition-colors cursor-pointer truncate', isSelected ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'), children: [isSelected && (_jsx(motion.div, { layoutId: "smartComparisonMobileTab", className: "absolute inset-0 bg-surface border border-border rounded-lg -z-10", transition: motionTransitions.springSnappy })), _jsx("span", { children: p.name })] }, p.id));
                        }) })] }), _jsxs("div", { role: "table", "aria-label": ariaLabel ?? label, "aria-labelledby": labelledBy, "aria-describedby": describedBy, children: [_jsxs("div", { role: "row", className: cn(grid, 'gap-4 pb-6 border-b border-border/40'), children: [_jsxs("div", { role: "columnheader", className: "hidden sm:flex flex-col justify-end", children: [_jsx("span", { className: "text-xs font-medium text-muted-foreground", children: matrixTitle }), _jsx("span", { className: "text-xs text-muted-foreground tabular-nums mt-0.5", children: countLabel(categories.reduce((acc, c) => acc + c.features.length, 0)) })] }), plans.map((plan) => {
                                const isMobileActive = selectedPlanId === plan.id;
                                return (_jsxs("div", { role: "columnheader", onClick: () => setSelectedPlanId(plan.id), className: cn('relative p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between min-w-0', isMobileActive ? 'block' : 'hidden sm:flex', 
                                    // ioiti-ui: the featured plan says it with its border, not a shadow: it does not float.
                                    plan.featured
                                        ? 'bg-gradient-to-b from-surface-hover to-surface border-foreground/30 accent:border-brand'
                                        : 'bg-surface border-border/60 hover:border-border-hover'), children: [plan.badge && (_jsx("span", { className: "absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary text-primary-foreground accent:bg-brand accent:text-brand-foreground", children: plan.badge })), _jsxs("div", { children: [_jsx("div", { className: "flex items-center justify-between gap-2 mb-1", children: _jsxs("h3", { className: "min-w-0 text-sm font-semibold text-foreground flex items-center gap-1.5", children: [plan.accent && (_jsx("span", { "aria-hidden": true, className: "h-0.5 w-4 shrink-0 rounded-full", style: { backgroundColor: plan.accent } })), plan.href !== undefined ? (_jsx(LinkComponent, { href: plan.href, onClick: (e) => e.stopPropagation(), className: "truncate underline-offset-4 hover:underline", children: plan.name })) : (_jsx("span", { className: "truncate", children: plan.name })), plan.featured && _jsx(Sparkles, { className: "size-4 shrink-0 text-foreground" })] }) }), _jsx("p", { className: "text-xs text-muted-foreground mb-3 leading-snug text-pretty", children: plan.tagline })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-baseline gap-1 mb-3", children: [_jsx("span", { className: "text-xl font-semibold font-mono text-foreground tracking-tight", children: plan.price }), plan.billingPeriod && (_jsxs("span", { className: "text-xs font-mono text-muted-foreground", children: ["/", plan.billingPeriod] }))] }), (plan.ctaText || plan.onCtaClick) && (_jsx("button", { type: "button", onClick: (e) => {
                                                        e.stopPropagation();
                                                        plan.onCtaClick?.();
                                                    }, className: cn(
                                                    // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                                                    'w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors', PRESSABLE, plan.featured
                                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 font-semibold accent:bg-brand accent:hover:bg-brand/90 accent:text-brand-foreground accent:bg-(image:--brand-fill) accent:text-brand-fill-foreground'
                                                        : 'bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground border border-border'), children: plan.ctaText || words.comparisonAction }))] })] }, plan.id));
                            })] }), _jsx("div", { className: "divide-y divide-border/40", children: filteredCategories.length === 0 ? (_jsx("div", { role: "row", children: _jsx("div", { role: "cell", className: "py-12 text-center text-xs text-muted-foreground", children: emptyText }) })) : (filteredCategories.map((category) => {
                            const isCollapsed = collapsedCategories.has(category.id);
                            return (_jsxs("div", { role: "rowgroup", "aria-label": category.title, className: "py-3", children: [_jsx("div", { role: "row", children: _jsx("div", { role: "rowheader", children: _jsxs("button", { type: "button", onClick: () => toggleCategory(category.id), "aria-expanded": !isCollapsed, 
                                                // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                                                className: "w-full flex items-center justify-between py-2 text-left group cursor-pointer", children: [_jsxs("span", { className: "text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-2", children: [_jsx("span", { className: "size-1.5 rounded-full bg-muted-foreground" }), category.title] }), _jsx(motion.div, { animate: { rotate: isCollapsed ? -90 : 0 }, transition: motionTransitions.easeFast, className: "text-muted-foreground group-hover:text-foreground", children: _jsx(ChevronDown, { className: "size-4" }) })] }) }) }), _jsx(AnimatePresence, { initial: false, children: !isCollapsed && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: motionTransitions.springGentle, className: "overflow-hidden space-y-1 pt-1", children: category.features.map((feat) => (_jsxs("div", { role: "row", className: cn(grid, 'gap-4 py-2.5 px-2 rounded-lg hover:bg-surface-hover transition-colors items-center text-sm'), children: [_jsxs("div", { role: "rowheader", className: "flex items-center gap-1.5 min-w-0 pr-2", children: [_jsx("span", { className: "text-sm text-foreground font-normal truncate", children: feat.name }), feat.description && (_jsx(Hint, { content: feat.description, children: _jsx("button", { type: "button", className: "text-muted-foreground hover:text-foreground cursor-pointer transition-colors", "aria-label": words.comparisonInfo(feat.name), children: _jsx(Info, { className: "size-4" }) }) }))] }), plans.map((plan) => {
                                                        const isMobileActive = selectedPlanId === plan.id;
                                                        return (_jsxs("div", { role: "cell", className: cn('sm:flex sm:justify-center items-center', isMobileActive ? 'flex justify-between py-1' : 'hidden sm:flex'), children: [_jsx("span", { className: "sm:hidden text-xs font-mono text-muted-foreground", children: words.comparisonPlan(plan.name) }), _jsx("div", { children: renderValueCell(feat.values[plan.id]) })] }, plan.id));
                                                    })] }, feat.id))) })) })] }, category.id));
                        })) })] })] }));
};
// ioiti-ui: EasyUI's names, until 1.0: the former name draws the comparison, and says once, in development, that it is
// deprecated (renamed).
/** @deprecated Use `ComparisonTable`. Removed in 1.0. */
export const SmartComparison = renamed(ComparisonTable, 'SmartComparison');
