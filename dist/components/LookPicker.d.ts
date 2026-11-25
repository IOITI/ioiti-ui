/** The props of `LookPicker`. */
export interface LookPickerProps {
    className?: string;
}
/**
 * The accent and the material, each person's own (kept in this browser, as the theme is): a button
 * for beside the theme's, `topBarEnd={<><LookPicker /><ThemeToggle /></>}`. Until one is picked, the
 * page shows the application's (`ioiti({ accent, material })`). A choice shows at once. The choices are a
 * layer in `document.body`, under the button; the focus goes into them (the accent shown), and Escape, a
 * press elsewhere or a Tab past their ends close them and give the button the focus again. In the menu of
 * the account instead: `UserMenu`'s `appearance` (`useAppearanceItems`). Its words are the provider's language's.
 */
export declare function LookPicker({ className }: LookPickerProps): import("react").JSX.Element;
