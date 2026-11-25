import type { MessageKit } from '../../lib/messages.js'

/** NotificationBell. */
export const notification = {
  /** "Notifications": the bell's name with nothing unread, its panel's name and heading, its list's while it scrolls. */
  notifications: 'Notifications',
  /** "3 unread notifications": the bell's name while some are unread. */
  unread: (count: number, { plural }: MessageKit) => plural(count, { one: '# unread notification', other: '# unread notifications' }),
  /** "99+": the bell's count past the most it shows. */
  overflow: (most: number, { number }: MessageKit) => `${number(most)}+`,
  /** "3 new": how many are unread, beside the panel's heading. */
  newCount: (count: number, { number }: MessageKit) => `${number(count)} new`,
  /** "Mark them all as read": the hint of the button that marks them so. */
  markAllRead: 'Mark them all as read',
  /** "Read all": that button. */
  readAll: 'Read all',
  /** "Close notifications": the button that closes the panel. */
  close: 'Close notifications',
  /** "Loading the notifications": the name of the lines drawn while they are read. */
  loading: 'Loading the notifications',
  /** "No notifications right now": what the panel says with none. */
  empty: 'No notifications right now',
  /** "The notifications could not be read.": what went wrong, where the application says nothing. */
  readFailed: 'The notifications could not be read.',
  /** "Try again": the button that reads them again. */
  tryAgain: 'Try again',
  /** "Mark as read": the hint of an entry's button that marks it so. */
  markRead: 'Mark as read',
  /** "Mark notification as read": that button's name. */
  markNotificationRead: 'Mark notification as read',
}
