import React from 'react';
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
export declare const SmartComparison: React.FC<SmartComparisonProps>;
