import type { Ref } from 'react';
import type { DataAttributes } from '../lib/data-attributes.js';
/** What a save answered: nothing or `true` for done, `false` to stay in the field, words for what went wrong. */
type Saved = void | boolean | string;
export interface InlineEditProps extends DataAttributes {
    value: string;
    /** Saves the new value; may take its time (a Promise). */
    onSave: (value: string) => Saved | Promise<Saved>;
    /** What the value is, for a screen reader: "Name of the run". In a Field, its label's words without it. */
    label?: string;
    /** What an empty value says; the provider's language's by default ("Add a value"). */
    placeholder?: string;
    /** `text` in a sentence's size; `title` a heading's (`as` says which). */
    variant?: 'text' | 'title';
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    /** What is wrong with a value, before it is saved. */
    validate?: (value: string) => string | undefined;
    readOnly?: boolean;
    className?: string;
    /** The id of its control: the button that shows the value, then its field; in a FormItem, the item's. */
    id?: string;
    /** The name its value is sent under with a form (a hidden input): the value saved, not one being typed. */
    name?: string;
    /** What the value is, as `label`. */
    'aria-label'?: string;
    /** The id of what says what the value is: a heading, a label elsewhere. A Field's label does without it. */
    'aria-labelledby'?: string;
    /** Read out with it: what a Field around it says under it (its description, its error). */
    'aria-describedby'?: string;
    /** Marked invalid, as a Field with an error marks it. */
    'aria-invalid'?: boolean | 'true' | 'false';
    /** Its control: the button that shows the value, then its field while it is edited. */
    ref?: Ref<HTMLElement>;
}
/**
 * A value edited where it is shown: a name, a title. It reads as text; a click or Enter turns it into a
 * field, Enter saves and Escape gives up. A save that takes its time shows it; one that fails says why and
 * keeps the field. As Elastic UI's inline edit does. Its words are the provider's language's.
 */
export declare function InlineEdit({ value, onSave, label: givenLabel, placeholder: givenPlaceholder, variant, as: Tag, validate, readOnly, className, id, name, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, ref, ...rest }: InlineEditProps): import("react").JSX.Element;
export {};
