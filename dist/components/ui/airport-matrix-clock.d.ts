import { type ReactNode } from 'react';
export interface AirportMatrixCity {
    id: string;
    name: string;
    timeZone: string;
}
export interface AirportMatrixClockProps {
    /** ioiti-ui: one to five cities, each with its IANA time zone. */
    cities: AirportMatrixCity[];
    /** 24-hour airport-board time by default. */
    format?: '12h' | '24h';
    /** Include seconds in each city time. */
    showSeconds?: boolean;
    /** Refresh cadence in milliseconds. Defaults to one second. */
    updateInterval?: number;
    /** ioiti-ui: the board's heading (EasyUI's "WORLD CLOCK"); null for none. */
    title?: string | null;
    /** ioiti-ui: the board's last line, in the caller's words (EasyUI's "N CITIES / IANA TIME ZONES"). */
    footer?: ReactNode;
    /** ioiti-ui: 'sm', a board for the side of a page's header (EasyUI's characters are up to 20 px wide). */
    size?: 'md' | 'sm';
    className?: string;
}
export declare function AirportMatrixClock({ cities, format, showSeconds, updateInterval, title, footer, size, className, }: AirportMatrixClockProps): import("react").JSX.Element;
