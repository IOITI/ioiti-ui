import React from 'react';
export interface AnimatedNumberProps {
    /** Numeric value to animate to */
    value: number;
    /** Number of decimal places (default: 0) */
    decimals?: number;
    /** Prepend text or currency symbol (e.g. "$", "+") */
    prefix?: string;
    /** Append text (e.g. "%", " users", "ms") */
    suffix?: string;
    /** ioiti-ui: the value as written (the application's formats: sign, currency and %), in place of the formatting below: its
     * digits roll, the rest stays. */
    text?: string;
    /** Spring physics stiffness */
    stiffness?: number;
    /** Spring physics damping */
    damping?: number;
    /** Mass of spring */
    mass?: number;
    /** Format as locale string (e.g. "1,250") */
    useGrouping?: boolean;
    /** Compact notation (e.g. 1.2M, 45K) */
    compact?: boolean;
    /** Custom class name */
    className?: string;
}
export declare const AnimatedNumber: React.FC<AnimatedNumberProps>;
