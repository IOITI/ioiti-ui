import React from 'react';
export interface ComparisonPlan {
    id: string;
    name: string;
    tagline: string;
    price: string;
    billingPeriod?: string;
    badge?: string;
    featured?: boolean;
    /** ioiti-ui: its button's words; the provider's language's by default ("Get started"). */
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
export interface ComparisonTableProps extends React.HTMLAttributes<HTMLDivElement> {
    plans: ComparisonPlan[];
    categories: ComparisonCategory[];
    defaultPlanId?: string;
    enableSearch?: boolean;
    enableDiffFilter?: boolean;
    className?: string;
    /** ioiti-ui: what the matrix is called, for screen readers; the provider's language's by default ("Feature and plan comparison"). */
    label?: string;
    /** ioiti-ui: the head of the matrix's own column; the provider's language's by default ("Feature matrix"). */
    matrixTitle?: string;
    /** ioiti-ui: its count of rows, under that head; the provider's language's by default ("12 specifications", "1 specification"). */
    countLabel?: (count: number) => string;
    /** ioiti-ui: the search's placeholder and name; the provider's language's by default ("Filter capabilities…"). */
    searchPlaceholder?: string;
    /** ioiti-ui: the button that leaves out the rows alike; the provider's language's by default ("Differences only"). */
    diffLabel?: string;
    /**
     * ioiti-ui: what the matrix says when nothing is left; the provider's language's by default ("No features match your
     * current search or difference filters.").
     */
    emptyText?: string;
    /** ioiti-ui: what draws a plan's link; the application's (LinkProvider) by default. */
    linkComponent?: React.ElementType;
}
export declare const ComparisonTable: React.FC<ComparisonTableProps>;
