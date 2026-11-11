export interface CsvColumn<T> {
    header: string;
    value: (row: T) => string | number | null | undefined;
}
export declare function toCsv<T>(rows: readonly T[], columns: readonly CsvColumn<T>[]): string;
/** Hand `content` to the browser as a file to save. */
export declare function downloadCsv(filename: string, content: string): void;
