import * as React from "react";
import type { StatusTone } from "../../lib/tones.js";
/** ioiti-ui: a StatusTone, the tones of a state (Badge's too): `neutral`, `info`, `success`, `warning`, `danger`. */
export type AlertTone = StatusTone;
export interface AlertProps extends Omit<React.ComponentProps<"div">, "title"> {
    tone?: AlertTone;
    /** Custom icon, or `false` for none. */
    icon?: React.ReactNode | false;
    dismissible?: boolean;
    /** Fires after the collapse animation finishes. */
    onDismiss?: () => void;
    /** Right-side slot, e.g. a button. */
    action?: React.ReactNode;
}
export declare function Alert({ tone, icon, dismissible, onDismiss, action, className, children, ...props }: AlertProps): React.JSX.Element;
/** The props of `AlertTitle`: a `<p>`'s. */
export type AlertTitleProps = React.ComponentProps<"p">;
export declare function AlertTitle({ className, ...props }: AlertTitleProps): React.JSX.Element;
/** The props of `AlertDescription`: a `<div>`'s. */
export type AlertDescriptionProps = React.ComponentProps<"div">;
export declare function AlertDescription({ className, ...props }: AlertDescriptionProps): React.JSX.Element;
