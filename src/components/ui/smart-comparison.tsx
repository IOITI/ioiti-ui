'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Minus, Search, Sparkles, Filter, ChevronDown, Info } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { fieldBorder } from '../../lib/field-border.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { PRESSABLE, SECTION } from '../../lib/recipes.js';
import { Hint } from '../Hint.js';
import { useLinkComponent } from '../link-context.js';

export interface ComparisonPlan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  billingPeriod?: string;
  badge?: string;
  featured?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
  /** ioiti-ui: where its name leads (a link, drawn by `linkComponent`). */
  href?: string;
  /** ioiti-ui: a colour drawn before its name (the plan's colour elsewhere on the page, a chart's). */
  accent?: string;
}

export interface ComparisonFeature {
  id: string;
  name: string;
  description?: string;
  values: Record<string, string | boolean | React.ReactNode>;
  /** ioiti-ui: each plan's value as text, compared for "differences only" (React nodes cannot be). */
  keys?: Record<string, string>;
}

export interface ComparisonCategory {
  id: string;
  title: string;
  features: ComparisonFeature[];
}

export interface SmartComparisonProps extends React.HTMLAttributes<HTMLDivElement> {
  plans: ComparisonPlan[];
  categories: ComparisonCategory[];
  defaultPlanId?: string;
  enableSearch?: boolean;
  enableDiffFilter?: boolean;
  className?: string;
  /** ioiti-ui: what the matrix is called, for screen readers. */
  label?: string;
  /** ioiti-ui: the words of the matrix's own column, and of its count of rows. */
  matrixTitle?: string;
  countLabel?: (count: number) => string;
  searchPlaceholder?: string;
  diffLabel?: string;
  emptyText?: string;
  /** ioiti-ui: what draws a plan's link; the application's (LinkProvider) by default. */
  linkComponent?: React.ElementType;
}

// ioiti-ui: each colour has a light value in front of EasyUI's own, kept behind `dark:`.
export const SmartComparison: React.FC<SmartComparisonProps> = ({
  plans = [],
  categories = [],
  defaultPlanId,
  enableSearch = true,
  enableDiffFilter = true,
  className,
  label = 'Feature and plan comparison',
  matrixTitle = 'Feature matrix',
  countLabel = (count) => `${count} specifications`,
  searchPlaceholder = 'Filter capabilities…',
  diffLabel = 'Differences only',
  emptyText = 'No features match your current search or difference filters.',
  linkComponent,
  ...props
}) => {
  // ioiti-ui: the application's link (LinkProvider) unless one is given.
  const LinkComponent = useLinkComponent(linkComponent);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    defaultPlanId || (plans.find((p) => p.featured)?.id || plans[0]?.id || '')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [diffOnly, setDiffOnly] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  // Filter categories and features
  const filteredCategories = useMemo(() => {
    const keyOf = (feat: ComparisonFeature, planId: string) =>
      feat.keys ? feat.keys[planId] : JSON.stringify(feat.values[planId]);
    const isFeatureDifferentiated = (feat: ComparisonFeature) => {
      if (plans.length <= 1) return true;
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
          const matchSearch =
            !searchQuery.trim() ||
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

  const renderValueCell = (value: string | boolean | React.ReactNode) => {
    if (typeof value === 'boolean') {
      return value ? (
        <span className="inline-flex items-center justify-center size-5 rounded-full bg-positive/5 text-positive border border-positive/30 dark:bg-positive/10">
          <Check className="size-3" />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center size-5 rounded-full bg-muted text-muted-foreground">
          <Minus className="size-3" />
        </span>
      );
    }

    if (typeof value === 'string') {
      return <span className="text-sm font-mono text-foreground">{value}</span>;
    }

    return value;
  };

  // ioiti-ui: one column for the rows' names and one per plan, whatever their number (EasyUI's grid had three plans).
  const columns = {
    '--plans': plans.length,
  } as React.CSSProperties;
  const grid = 'grid grid-cols-1 sm:grid-cols-[minmax(9rem,1.1fr)_repeat(var(--plans),minmax(0,1fr))]';

  return (
    // ioiti-ui: a table for screen readers (rows, column and row headers), drawn as EasyUI's grid.
    <div
      role="table"
      aria-label={label}
      className={cn(
        // ioiti-ui: a section, as a Panel: its border, its surface, glass under the glass material (glass-card).
        SECTION, 'w-full p-4 sm:p-5 text-foreground overflow-hidden',
        className
      )}
      style={columns}
      {...props}
    >
      {/* Controls Bar: Search + Diff Filter Toggle + Mobile Plan Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          {enableSearch && (
            <div className="relative flex-1 sm:w-64">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              {/* ioiti-ui: its focus as the form's Input shows it, a field that takes text having no ring. */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                className={cn(
                  'w-full pl-9 pr-3.5 py-1.5 text-base sm:text-sm rounded-lg border bg-surface text-foreground placeholder:text-text-subtle transition-colors',
                  fieldBorder(false)
                )}
              />
            </div>
          )}

          {enableDiffFilter && (
            <button
              type="button"
              onClick={() => setDiffOnly((prev) => !prev)}
              aria-pressed={diffOnly}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors shrink-0',
                PRESSABLE,
                diffOnly
                  ? // ioiti-ui: on, and the featured plan below, in the accent (accent:).
                    'bg-primary text-primary-foreground border-primary accent:bg-brand accent:text-brand-foreground accent:border-brand'
                  : 'bg-surface text-muted-foreground border-border hover:text-foreground hover:border-border-hover'
              )}
            >
              <Filter className="size-4" />
              <span>{diffLabel}</span>
            </button>
          )}
        </div>

        {/* Mobile Plan Switcher Segment */}
        <div className="sm:hidden flex items-center p-1 bg-surface-raised rounded-xl border border-border">
          {plans.map((p) => {
            const isSelected = selectedPlanId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPlanId(p.id)}
                aria-pressed={isSelected}
                className={cn(
                  'relative flex-1 py-1.5 px-2 text-sm font-medium text-center rounded-lg transition-colors cursor-pointer truncate',
                  isSelected ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="smartComparisonMobileTab"
                    className="absolute inset-0 bg-surface border border-border rounded-lg -z-10"
                    transition={motionTransitions.springSnappy}
                  />
                )}
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Plans Header Row */}
      <div role="row" className={cn(grid, 'gap-4 pb-6 border-b border-border/40')}>
        {/* Left Column Label spacer */}
        <div role="columnheader" className="hidden sm:flex flex-col justify-end">
          <span className="text-xs font-medium text-muted-foreground">
            {matrixTitle}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums mt-0.5">
            {countLabel(categories.reduce((acc, c) => acc + c.features.length, 0))}
          </span>
        </div>

        {/* Plan Cards */}
        {plans.map((plan) => {
          const isMobileActive = selectedPlanId === plan.id;
          return (
            <div
              key={plan.id}
              role="columnheader"
              onClick={() => setSelectedPlanId(plan.id)}
              className={cn(
                'relative p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between min-w-0',
                isMobileActive ? 'block' : 'hidden sm:flex',
                // ioiti-ui: the featured plan says it with its border, not a shadow: it does not float.
                plan.featured
                  ? 'bg-gradient-to-b from-surface-hover to-surface border-foreground/30 accent:border-brand'
                  : 'bg-surface border-border/60 hover:border-border-hover'
              )}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary text-primary-foreground accent:bg-brand accent:text-brand-foreground">
                  {plan.badge}
                </span>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="min-w-0 text-sm font-semibold text-foreground flex items-center gap-1.5">
                    {plan.accent && (
                      <span aria-hidden className="h-0.5 w-4 shrink-0 rounded-full" style={{ backgroundColor: plan.accent }} />
                    )}
                    {plan.href !== undefined ? (
                      <LinkComponent href={plan.href} onClick={(e: React.MouseEvent) => e.stopPropagation()} className="truncate underline-offset-4 hover:underline">
                        {plan.name}
                      </LinkComponent>
                    ) : (
                      <span className="truncate">{plan.name}</span>
                    )}
                    {plan.featured && <Sparkles className="size-4 shrink-0 text-foreground" />}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-snug text-pretty">{plan.tagline}</p>
              </div>

              <div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-xl font-semibold font-mono text-foreground tracking-tight">
                    {plan.price}
                  </span>
                  {plan.billingPeriod && (
                    <span className="text-xs font-mono text-muted-foreground">
                      /{plan.billingPeriod}
                    </span>
                  )}
                </div>

                {/* ioiti-ui: a button only when it does something. */}
                {(plan.ctaText || plan.onCtaClick) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      plan.onCtaClick?.();
                    }}
                    className={cn(
                      // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                      'w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                      PRESSABLE,
                      plan.featured
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 font-semibold accent:bg-brand accent:hover:bg-brand/90 accent:text-brand-foreground accent:bg-(image:--brand-fill) accent:text-brand-fill-foreground'
                        : 'bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground border border-border'
                    )}
                  >
                    {plan.ctaText || 'Get started'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Rows Grouped by Category */}
      <div className="divide-y divide-border/40">
        {filteredCategories.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          filteredCategories.map((category) => {
            const isCollapsed = collapsedCategories.has(category.id);

            return (
              <div key={category.id} role="rowgroup" aria-label={category.title} className="py-3">
                {/* Category Header Accordion */}
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={!isCollapsed}
                  // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                  className="w-full flex items-center justify-between py-2 text-left group cursor-pointer"
                >
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-muted-foreground" />
                    {category.title}
                  </span>
                  <motion.div
                    animate={{ rotate: isCollapsed ? -90 : 0 }}
                    transition={motionTransitions.easeFast}
                    className="text-muted-foreground group-hover:text-foreground"
                  >
                    <ChevronDown className="size-4" />
                  </motion.div>
                </button>

                {/* Features in Category */}
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={motionTransitions.springGentle}
                      className="overflow-hidden space-y-1 pt-1"
                    >
                      {category.features.map((feat) => (
                        <div
                          key={feat.id}
                          role="row"
                          className={cn(grid, 'gap-4 py-2.5 px-2 rounded-lg hover:bg-surface-hover transition-colors items-center text-sm')}
                        >
                          {/* Feature Name & Info */}
                          <div role="rowheader" className="flex items-center gap-1.5 min-w-0 pr-2">
                            <span className="text-sm text-foreground font-normal truncate">
                              {feat.name}
                            </span>
                            {feat.description && (
                              // ioiti-ui: what a feature is, in a Hint: shown on hover, on the keyboard's focus and on a
                              // tap, drawn in document.body (it was in the card, cut by the table's frame), read with the
                              // button by a screen reader.
                              <Hint content={feat.description}>
                                <button
                                  type="button"
                                  className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                  aria-label={`Info about ${feat.name}`}
                                >
                                  <Info className="size-4" />
                                </button>
                              </Hint>
                            )}
                          </div>

                          {/* Plan Values */}
                          {plans.map((plan) => {
                            const isMobileActive = selectedPlanId === plan.id;
                            return (
                              <div
                                key={plan.id}
                                role="cell"
                                className={cn(
                                  'sm:flex sm:justify-center items-center',
                                  isMobileActive ? 'flex justify-between py-1' : 'hidden sm:flex'
                                )}
                              >
                                <span className="sm:hidden text-xs font-mono text-muted-foreground">
                                  {plan.name}:
                                </span>
                                <div>{renderValueCell(feat.values[plan.id])}</div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
