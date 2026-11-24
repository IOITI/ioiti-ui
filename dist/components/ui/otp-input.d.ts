import React from 'react';
export interface OTPInputProps {
    length?: number;
    value?: string;
    onChange?: (value: string) => void;
    onComplete?: (value: string) => void;
    autoFocus?: boolean;
    disabled?: boolean;
    className?: string;
    boxClassName?: string;
    'aria-label'?: string;
    /** ioiti-ui: the id of the first box, so that a `<label htmlFor>` leads to it. */
    id?: string;
}
export declare const OTPInput: React.FC<OTPInputProps>;
