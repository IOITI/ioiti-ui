import React from 'react';
export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Size of the loader in pixels. Default is 32. */
    size?: number;
    /** Visual animation style variant. Default is 'arc'. */
    variant?: 'arc' | 'dots' | 'line' | 'rings';
    /** Optional accessible text label. */
    label?: string;
    /** Force reduced motion if true. */
    reduceMotion?: boolean;
    /** Custom stroke / fill color. Default inherits or neutral. */
    color?: string;
    /**
     * ioiti-ui: drawn only once this many milliseconds have passed (`300`, as a page's code or data loads): a wait shorter
     * than that shows nothing, where a spinner would flash. At once by default.
     */
    delay?: number;
}
export declare const Loader: React.FC<LoaderProps>;
