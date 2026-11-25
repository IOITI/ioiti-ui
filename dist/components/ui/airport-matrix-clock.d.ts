import { type ReactNode } from 'react';
export interface WorldClockCity {
    id: string;
    name: string;
    timeZone: string;
}
export interface WorldClockProps {
    /** ioiti-ui: one to five cities, each with its IANA time zone. */
    cities: WorldClockCity[];
    /** ioiti-ui: 24 hours or 12; the provider's clock by default (IoitiProvider's: 24 hours in en-GB and fr-FR, 12 in en-US). */
    format?: '12h' | '24h';
    /** Include seconds in each city time. */
    showSeconds?: boolean;
    /** Refresh cadence in milliseconds. Defaults to one second. */
    updateInterval?: number;
    /** ioiti-ui: the board's heading ("World clock" by default, in the provider's words: `clock.title`); null for none. */
    title?: string | null;
    /** ioiti-ui: the board's last line, in the caller's words ("3 cities / IANA time zones" by default, in the provider's). */
    footer?: ReactNode;
    /** ioiti-ui: 'sm', a board for the side of a page's header (EasyUI's characters are up to 20 px wide). */
    size?: 'md' | 'sm';
    className?: string;
}
export declare function WorldClock({ cities, format, showSeconds, updateInterval, title, footer, size, className, }: WorldClockProps): import("react").JSX.Element;
