import type { MessageKit } from '../../lib/messages.js';
/** NotificationBell. */
export declare const notification: {
    /** "Notifications": the bell's name with nothing unread, its panel's name and heading, its list's while it scrolls. */
    notifications: string;
    /** "3 unread notifications": the bell's name while some are unread. */
    unread: (count: number, { plural }: MessageKit) => string;
    /** "99+": the bell's count past the most it shows. */
    overflow: (most: number, { number }: MessageKit) => string;
    /** "3 new": how many are unread, beside the panel's heading. */
    newCount: (count: number, { number }: MessageKit) => string;
    /** "Mark them all as read": the hint of the button that marks them so. */
    markAllRead: string;
    /** "Read all": that button. */
    readAll: string;
    /** "Close notifications": the button that closes the panel. */
    close: string;
    /** "Loading the notifications": the name of the lines drawn while they are read. */
    loading: string;
    /** "No notifications right now": what the panel says with none. */
    empty: string;
    /** "The notifications could not be read.": what went wrong, where the application says nothing. */
    readFailed: string;
    /** "Try again": the button that reads them again. */
    tryAgain: string;
    /** "Mark as read": the hint of an entry's button that marks it so. */
    markRead: string;
    /** "Mark notification as read": that button's name. */
    markNotificationRead: string;
};
