import type { CsvColumn } from '../lib/csv.js';
interface ExportButtonProps<T> {
    /** File name without date or extension, e.g. "orders": the day of the export is added ("orders-2026-10-26.csv"). */
    name: string;
    rows: readonly T[];
    columns: readonly CsvColumn<T>[];
}
/** Saves the rows currently loaded on the page as a CSV file. */
export declare function ExportButton<T>({ name, rows, columns }: ExportButtonProps<T>): import("react").JSX.Element;
export {};
