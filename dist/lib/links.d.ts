import type { MouseEvent } from 'react';
/**
 * A click that follows a link in this tab. One the browser opens elsewhere (with ⌘, Ctrl, Shift or Alt:
 * another tab or window) is left to it, and leaves the page as it is.
 */
export declare function isPlainClick(event: MouseEvent): boolean;
