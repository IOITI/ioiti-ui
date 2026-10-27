import type { KeyboardEvent, MouseEvent, ReactElement, ReactNode, Ref } from 'react';
import type { AnchorAlign, AnchorSide } from '../lib/anchor.js';
interface ItemBase {
    label: ReactNode;
    /** An icon of lucide-react, before the label. */
    icon?: ReactNode;
    /** A second line, under the label. */
    description?: ReactNode;
    disabled?: boolean;
    /** The words type-ahead finds it by, where the label is not text. */
    textValue?: string;
}
/** Does something, and closes the menu: the focus is back on the menu's trigger before `onSelect` runs. */
export interface DropdownMenuAction extends ItemBase {
    type?: 'action';
    onSelect?: () => void;
    /** Its keys, shown beside it (`mod+d`): the menu does not listen for them. */
    shortcut?: string;
    /** What removes, in the negative colour. */
    tone?: 'danger';
}
/** Leads somewhere: a link, opened elsewhere with ⌘ or Ctrl. */
export interface DropdownMenuLink extends ItemBase {
    type: 'link';
    href: string;
    shortcut?: string;
}
/** On or off: the menu stays open. */
export interface DropdownMenuCheckbox extends ItemBase {
    type: 'checkbox';
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}
/** One of a few: choosing closes the menu. */
export interface DropdownMenuRadioGroup {
    type: 'radio';
    label?: ReactNode;
    value: string;
    onValueChange: (value: string) => void;
    options: {
        value: string;
        label: ReactNode;
        description?: ReactNode;
        disabled?: boolean;
        textValue?: string;
    }[];
}
export interface DropdownMenuSeparator {
    type: 'separator';
}
export interface DropdownMenuGroup {
    type: 'group';
    label: ReactNode;
    items: DropdownMenuItem[];
}
/** More items, in a panel of their own that takes the menu's place, a row at its top going back. */
export interface DropdownMenuSubmenu extends ItemBase {
    type: 'submenu';
    items: DropdownMenuItem[];
}
export type DropdownMenuItem = DropdownMenuAction | DropdownMenuLink | DropdownMenuCheckbox | DropdownMenuRadioGroup | DropdownMenuSeparator | DropdownMenuGroup | DropdownMenuSubmenu;
interface TriggerProps {
    ref?: Ref<HTMLElement>;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    hint?: ReactNode;
}
interface DropdownMenuProps {
    /** What opens it: a button that takes a ref (`Button`, `IconButton`), given the menu's props. */
    trigger: ReactElement<TriggerProps>;
    items: DropdownMenuItem[];
    /** The menu's name for a screen reader: "Actions on the order". */
    label: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    side?: AnchorSide;
    align?: AnchorAlign;
}
/**
 * The actions on a thing, behind a button: each does something, leads somewhere, or is ticked; more in a
 * sub-menu, which takes the menu's place (a row at its top goes back), on a phone as on a computer. The
 * arrow keys move, a letter jumps to the next item that starts with it, Escape closes, Tab leaves.
 * For one action and its variants, `SplitButton`.
 */
export declare function DropdownMenu({ trigger, items, label, open, onOpenChange, side, align }: DropdownMenuProps): import("react").JSX.Element;
interface ContextMenuProps {
    items: DropdownMenuItem[];
    /** The menu's name for a screen reader. */
    label: string;
    /** What it is the menu of: a right click, a long press, Shift+F10 or the menu key on it opens the menu. */
    children: ReactNode;
    disabled?: boolean;
    className?: string;
}
/**
 * The actions on what is under the pointer, at the pointer: a right click, a long press on a touch screen,
 * Shift+F10 or the menu key on what has the focus. The same menu as `DropdownMenu`; what it offers should
 * be reachable another way too, as a context menu is found by few.
 */
export declare function ContextMenu({ items, label, children, disabled, className }: ContextMenuProps): import("react").JSX.Element;
export {};
