import React from 'react';
export interface OTPInputProps {
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
    /** ioiti-ui: the group's name; the provider's language's by default ("One-time passcode"). */
    'aria-label'?: string;
    /** ioiti-ui: read out with it: what a Field around it says under it (its description, its error). */
    'aria-describedby'?: string;
    /** ioiti-ui: marked invalid, as a Field with an error marks it: drawn as `error`. */
    'aria-invalid'?: boolean | 'true' | 'false';
    /** ioiti-ui: the id of the first box, so that a `<label htmlFor>` leads to it. */
    id?: string;
}
export declare const OTPInput: React.FC<OTPInputProps>;
