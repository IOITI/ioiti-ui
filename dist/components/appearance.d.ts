import type { DropdownMenuItem } from './DropdownMenu.js';
/**
 * The look of the interface, as the items of a menu (`DropdownMenu`'s): the theme (follow the system,
 * light, dark), then a sub-menu of the accent and the material, each a choice with its swatch. Each
 * person's own, kept in this browser, as `ThemeToggle` and `LookPicker` keep them. `UserMenu`'s
 * `appearance` puts them in the menu of the account; a settings menu of its own takes them too.
 */
export declare function useAppearanceItems(): DropdownMenuItem[];
