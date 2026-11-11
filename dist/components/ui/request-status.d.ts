import React from 'react';
export type RequestLifecycleStatus = 'processing' | 'verifying' | 'success' | 'failed' | 'unknown';
/** ioiti-ui: one figure of the outcome, in place of the receipt's items. */
export interface RequestStatusFigure {
    label: string;
    value: React.ReactNode;
}
export interface RequestStatusProps {
    /** Where the request stands. */
    status?: RequestLifecycleStatus;
    /** ioiti-ui: the step's heading, in the caller's words (EasyUI's were a payment's). */
    title: string;
    /** ioiti-ui: what the step means, in the caller's words. */
    description?: React.ReactNode;
    /** ioiti-ui: what it is about, in the pill (EasyUI's amount). */
    subject?: React.ReactNode;
    /** ioiti-ui: the outcome's figures, once known (EasyUI's transaction details and receipt). */
    figures?: RequestStatusFigure[];
    /** ioiti-ui: a reference to copy (an order, a request), with its name. */
    reference?: {
        label: string;
        value: string;
    };
    /** ioiti-ui: where it is read further. */
    link?: {
        href: string;
        label: string;
    };
    /** ioiti-ui: what draws the link; the application's (LinkProvider) by default. */
    linkComponent?: React.ElementType;
    /** ioiti-ui: the card is put away. It watched, and acted on nothing. */
    onDismiss?: () => void;
    /** Custom class name */
    className?: string;
}
export declare const RequestStatus: React.FC<RequestStatusProps>;
