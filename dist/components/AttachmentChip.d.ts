import type { ElementType, ReactNode } from 'react';
interface AttachmentChipProps {
    /** What it is: a file's name, a record's title. */
    label: string;
    /** Beside it: its size, "Uploading…", why it could not be taken. */
    detail?: ReactNode;
    /** What kind of thing it is, unless a thumbnail shows it; a paperclip by default. */
    icon?: ReactNode;
    /** An image's address, shown small in place of the icon. */
    thumbnail?: string;
    /** Where it leads: its label is then a link. */
    href?: string;
    /** What draws that link: the application's (LinkProvider) by default; `'a'` for a file the browser opens itself. */
    linkComponent?: ElementType;
    /** It can be taken away: a button named "Remove <label>". */
    onRemove?: () => void;
    /** `danger`: it could not be taken, `detail` says why. */
    tone?: 'neutral' | 'danger';
    /** While it is made ready (an upload): a spinner in place of its icon, said to screen readers. */
    busy?: boolean;
    className?: string;
}
/**
 * Something attached to a request or a message: a file, a record. Its label is cut where room ends (a
 * phone), the whole of it said to screen readers; it may lead somewhere, and be taken away.
 */
export declare function AttachmentChip({ label, detail, icon, thumbnail, href, linkComponent, onRemove, tone, busy, className, }: AttachmentChipProps): import("react").JSX.Element;
export {};
