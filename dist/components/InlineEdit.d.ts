/** What a save answered: nothing or `true` for done, `false` to stay in the field, words for what went wrong. */
type Saved = void | boolean | string;
interface InlineEditProps {
    value: string;
    /** Saves the new value; may take its time (a Promise). */
    onSave: (value: string) => Saved | Promise<Saved>;
    /** What the value is, for a screen reader: "Name of the run". */
    label: string;
    placeholder?: string;
    /** `text` in a sentence's size; `title` a heading's (`as` says which). */
    variant?: 'text' | 'title';
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    /** What is wrong with a value, before it is saved. */
    validate?: (value: string) => string | undefined;
    readOnly?: boolean;
    className?: string;
}
/**
 * A value edited where it is shown: a name, a title. It reads as text; a click or Enter turns it into a
 * field, Enter saves and Escape gives up. A save that takes its time shows it; one that fails says why and
 * keeps the field. As Elastic UI's inline edit does.
 */
export declare function InlineEdit({ value, onSave, label, placeholder, variant, as: Tag, validate, readOnly, className, }: InlineEditProps): import("react").JSX.Element;
export {};
