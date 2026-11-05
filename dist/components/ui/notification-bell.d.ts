import React from 'react';
/** ioiti-ui: what kind of news an entry is, for its dot. */
export type NotificationTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export interface Notification {
    id: string;
    message: string;
    /** ioiti-ui: a second line under the message. */
    detail?: string;
    timestamp: Date | string;
    read: boolean;
    action?: () => void;
    /** ioiti-ui: where it leads: the message is then a link (opened elsewhere with ⌘ or Ctrl). */
    href?: string;
    tone?: NotificationTone;
}
export interface NotificationBellProps {
    /** List of notifications. */
    notifications: Notification[];
    /** Handler when an item is marked as read. */
    onMarkAsRead: (id: string) => void;
    /** Optional handler to mark all as read. */
    onMarkAllAsRead?: () => void;
    /** Controlled open state of notification drawer/panel. */
    isOpen?: boolean;
    /** Open state change handler. */
    onOpenChange?: (isOpen: boolean) => void;
    /** Show numeric counter inside red badge. Default is true. */
    showCount?: boolean;
    /** ioiti-ui: what draws an entry's link; the application's (LinkProvider) by default. */
    linkComponent?: React.ElementType;
    /** ioiti-ui: under the list (a setting of the notifications). */
    footer?: React.ReactNode;
    /** ioiti-ui: the trigger's own look, to sit with the buttons around it. */
    triggerClassName?: string;
    /** Custom CSS class names. */
    className?: string;
}
export declare const NotificationBell: React.FC<NotificationBellProps>;
