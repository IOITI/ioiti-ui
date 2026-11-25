import React from 'react';
import { type DataAttributes } from '../../lib/data-attributes.js';
export interface OTPInputProps extends DataAttributes {
    length?: number;
    value?: string;
    /** ioiti-ui: the code it starts with, the boxes holding it then (`value` held by the page instead). */
    defaultValue?: string;
    onChange?: (value: string) => void;
    onComplete?: (value: string) => void;
    autoFocus?: boolean;
    disabled?: boolean;
    /** ioiti-ui: the code is wrong or incomplete: every box's border in the error's colour, and said (`aria-invalid`). */
    error?: boolean;
    className?: string;
    boxClassName?: string;
    /** ioiti-ui: the group's name; a Field's label, else the provider's language's by default ("One-time passcode"). */
    'aria-label'?: string;
    /** ioiti-ui: the id of what names the group: a heading. A Field's label names it without it. */
    'aria-labelledby'?: string;
    /** ioiti-ui: read out with it: what a Field around it says under it (its description, its error). */
    'aria-describedby'?: string;
    /** ioiti-ui: marked invalid, as a Field with an error marks it: drawn as `error`. */
    'aria-invalid'?: boolean | 'true' | 'false';
    /** ioiti-ui: the id of the first box, so that a `<label htmlFor>` leads to it; in a FormItem, the item's. */
    id?: string;
    /** ioiti-ui: the name its code is sent under with a form (a hidden input): its digits, as `onChange` gives them. */
    name?: string;
    /** ioiti-ui: its first box, where the code is typed, to focus it. */
    ref?: React.Ref<HTMLInputElement>;
}
export declare const OTPInput: React.FC<OTPInputProps>;
