import type { GoodWhen } from '../lib/change.js';
interface KpiChangeProps {
    change: number;
    goodWhen?: GoodWhen;
    /** Writes the change, signed: a percentage to one decimal by default, as the provider's locale writes one. */
    format?: (change: number) => string;
    className?: string;
}
/**
 * A figure's change, signed, in the tone of what it means (good news, bad news), an arrow its way: seen as
 * "+2.5%", read as "up 2.5%" (in the provider's language). KpiTile's and KpiStrip's.
 */
export declare function KpiChange({ change, goodWhen, format, className }: KpiChangeProps): import("react").JSX.Element;
export {};
