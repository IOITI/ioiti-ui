interface CopyButtonProps {
    /** What is copied, or a function giving it when the button is pressed. */
    value: string | (() => string);
    /** What it copies, in words: "Copy the key"; the provider's language's "Copy" by default. */
    label?: string;
    /** The label written beside the icon, not only in its hint. */
    showLabel?: boolean;
    size?: 'sm' | 'md';
    /** Told whether the copy was made. */
    onCopy?: (copied: boolean) => void;
    className?: string;
}
/**
 * Copies a value to the clipboard, and says it did: a check for two seconds, and the words for a screen reader, in the
 * provider's language.
 */
export declare function CopyButton({ value, label: givenLabel, showLabel, size, onCopy, className }: CopyButtonProps): import("react").JSX.Element;
export {};
