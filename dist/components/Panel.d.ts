import type { ReactNode } from 'react';
import type { Crumb } from '../shell/navigation.js';
interface PanelProps {
    /** An anchor a link can lead to (`#trades`). */
    id?: string;
    title?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    className?: string;
    bodyClassName?: string;
    /** Its body starts close under the header: for a list or a table whose first row is the content. */
    dense?: boolean;
    children: ReactNode;
}
/**
 * The card every section of a page sits in. Same surface as the EasyUI data table. Never wider than the
 * place it is given: in a grid's column or a row, what it holds (a line that does not wrap, a wide table)
 * is laid out in its width, cut short or scrolled in its own frame, rather than widening the column.
 */
export declare function Panel({ id, title, description, action, className, bodyClassName, dense, children }: PanelProps): import("react").JSX.Element;
interface PageHeaderProps {
    title: string;
    description?: ReactNode;
    actions?: ReactNode;
    /**
     * For the trail of the top bar, on a page deeper than the menu: the pages
     * between its entry of the menu and itself (the order a line of it
     * belongs to). The title is the page's own step.
     */
    parents?: Crumb[];
}
/**
 * The title of a page and what it does. On a page deeper than the menu, its
 * title also ends the trail of the top bar, which every page has.
 */
export declare function PageHeader({ title, description, actions, parents }: PageHeaderProps): import("react").JSX.Element;
export {};
