import type { ReactNode } from 'react';
export interface Change {
    /** What changes: a setting, a field. */
    label: ReactNode;
    /** Its value before; none for what is added. */
    before?: ReactNode;
    /** Its value after; none for what is removed. */
    after?: ReactNode;
    /** Why, or what it does. */
    note?: ReactNode;
}
export interface ChangeGroup {
    title: ReactNode;
    changes: Change[];
}
interface ChangeListProps {
    /** The changes, or `groups` of them under their titles. */
    changes?: Change[];
    groups?: ChangeGroup[];
    /** The list's name for a screen reader: "Changes to apply". */
    label?: string;
    /** The values as figures: digits of one width. */
    numeric?: boolean;
    className?: string;
}
/**
 * What changes, each from its value before to its value after: a configuration about to be applied, a
 * record edited, a run compared with the last. Screen readers hear "from … to …".
 */
export declare function ChangeList({ changes, groups, label, numeric, className }: ChangeListProps): import("react").JSX.Element;
export {};
