import type { ReactNode } from 'react';
interface PromptSuggestion {
    /** What the chip says. */
    label: string;
    /** What it puts in the field, to be read and sent. */
    prompt: string;
}
interface PromptComposerProps {
    value: string;
    onValueChange: (value: string) => void;
    /** The text sent, without its spaces around. */
    onSubmit: (value: string) => void;
    /** While `busy`: the request under way stopped. Without it, nothing can be sent until it ends. */
    onStop?: () => void;
    busy?: boolean;
    disabled?: boolean;
    /** Why nothing can be sent: shown on the button's hint, on hover, focus and tap. */
    disabledReason?: ReactNode;
    /** The field's name, said to screen readers, and shown unless `hideLabel`. */
    label: string;
    hideLabel?: boolean;
    placeholder?: string;
    /** Requests to start from: a chip fills the field, which is then read and sent as typed. */
    suggestions?: PromptSuggestion[];
    /** Under the field: what a request costs, the model it goes to. */
    footer?: ReactNode;
    /** Under the field, before the footer and kept whole: what the request goes with (a model's menu, a meter). */
    controls?: ReactNode;
    maxLength?: number;
    minRows?: number;
    /** Longer, the field scrolls. */
    maxRows?: number;
    className?: string;
}
/**
 * A request typed to an assistant: a field that grows with its text, sent with Enter (a new line with
 * Shift+Enter; on a touch screen, Enter is a new line and the button sends), stopped while it is
 * answered, and requests to start from.
 */
export declare function PromptComposer({ value, onValueChange, onSubmit, onStop, busy, disabled, disabledReason, label, hideLabel, placeholder, suggestions, footer, controls, maxLength, minRows, maxRows, className, }: PromptComposerProps): import("react").JSX.Element;
export {};
