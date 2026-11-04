import * as React from "react";
export type AlertTone = "neutral" | "info" | "success" | "warning" | "danger";
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
export declare function AlertTitle({ className, ...props }: React.ComponentProps<"p">): React.JSX.Element;
export declare function AlertDescription({ className, ...props }: React.ComponentProps<"p">): React.JSX.Element;
