import type { ReactElement, ReactNode } from 'react';
interface ResizablePanelProps {
    /** Its share of the room at first, in percent: the shares of all the panels make 100. */
    defaultSize: number;
    /** The least share it keeps, in percent (unless collapsed). */
    minSize?: number;
    maxSize?: number;
    /** Enter on a handle beside it folds it away, and back. */
    collapsible?: boolean;
    /** Its name, for the handle that resizes it. */
    label?: string;
    className?: string;
    children?: ReactNode;
}
/** A panel of `ResizablePanels`: its content scrolls inside it. */
export declare function ResizablePanel(props: ResizablePanelProps): ReactElement | null;
interface ResizableHandleProps {
    /** What it resizes, for a screen reader: "Resize the editor". */
    label?: string;
}
/** The handle between two panels: dragged, or moved with the arrow keys once it has the focus. */
export declare function ResizableHandle(props: ResizableHandleProps): ReactElement | null;
interface ResizablePanelsProps {
    /** Side by side (`horizontal`) or one over the other (`vertical`). */
    direction?: 'horizontal' | 'vertical';
    /** Every panel's share, in percent, once a handle has moved them. */
    onSizesChange?: (sizes: number[]) => void;
    /** Under this width (in pixels), the panels go one under the other and the handles go. */
    stackBelow?: number;
    className?: string;
    /** ResizablePanel, ResizableHandle, ResizablePanel… */
    children: ReactNode;
}
/**
 * Panels side by side, or one over the other, each sized by the handle between them: dragged, or with the
 * arrow keys once it has the focus (Shift for more, Home and End to the ends, Enter to fold a panel away,
 * a double click back to the first sizes). A separator with its value to a screen reader. As Elastic UI's
 * resizable container does.
 */
export declare function ResizablePanels({ direction, onSizesChange, stackBelow, className, children }: ResizablePanelsProps): import("react").JSX.Element;
export {};
