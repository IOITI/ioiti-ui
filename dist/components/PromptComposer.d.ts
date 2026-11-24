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
    /**
     * Under the field, before the footer: what the request goes with (a model's menu, a meter). Each is kept
     * whole; where they do not all fit beside the send button (a phone), they wrap onto another line.
     */
    controls?: ReactNode;
    maxLength?: number;
    minRows?: number;
    /** Longer, the field scrolls. */
    maxRows?: number;
    /**
     * It floats over what scrolls under it, at a page's foot, with no band behind it: its frame lifted by a shadow,
     * blurred glass under the glass material.
     */
    floating?: boolean;
    /** Above the field, inside its frame: what the request goes with (`AttachmentChip`s). Each wraps whole. */
    attachments?: ReactNode;
    /**
     * Files dropped on its frame (shown while one is dragged over it) or pasted into its field (a screenshot):
     * given here, what to do with them the application's. A paste of text stays a paste. Not while `disabled`.
     */
    onFiles?: (files: File[]) => void;
    className?: string;
}
/**
 * A request typed to an assistant: a field that grows with its text, sent with Enter (a new line with
 * Shift+Enter; on a touch screen, Enter is a new line and the button sends), stopped while it is
 * answered, and requests to start from. What it goes with is shown above the field (`attachments`), and
 * files dropped on it or pasted into it are handed over (`onFiles`).
 */
export declare function PromptComposer({ value, onValueChange, onSubmit, onStop, busy, disabled, disabledReason, label, hideLabel, placeholder, suggestions, footer, controls, maxLength, minRows, maxRows, floating, attachments, onFiles, className, }: PromptComposerProps): import("react").JSX.Element;
export {};
