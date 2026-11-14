import { MessageSquareText } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const feedback: CategoryInfo = {
  slug: 'feedback',
  label: 'Feedback',
  icon: MessageSquareText,
  summary: 'What the application says back: a message in the page, a state in a word, a toast for what was just done. Always a word with a colour.',
  families: [
    {
      slug: 'alert',
      name: 'Alert',
      names: ['Alert', 'AlertTitle', 'AlertDescription'],
      keywords: ['message', 'banner', 'notice', 'callout', 'warning', 'error'],
      examples: [
        { id: 'tones', title: 'Its tones', description: 'Neutral for what is only said, info for what helps, success for what went well; warning and danger, read out at once, for what needs looking at.' },
        { id: 'action', title: 'With an action', description: 'One small outline button at its end, for what the message asks: a review, another try.' },
        { id: 'dismissible', title: 'Dismissible', description: 'A message the reader may put away once read: it folds up, then onDismiss comes. What still matters is not dismissible.' },
        { id: 'in-a-panel', title: 'In a panel', description: 'Where what it is about would be: a feature switched off says so in its place. Its own icon, or none; a narrow column keeps it readable.' },
      ],
    },
    {
      slug: 'badge',
      name: 'Badge',
      names: ['Badge'],
      keywords: ['tag', 'chip', 'pill', 'label', 'state'],
      examples: [
        { id: 'variants', title: 'Variants and tones', description: 'Soft beside text, solid for what must stand out, outline for the quietest; a tone only where it means something.' },
        { id: 'dot', title: 'A dot, a pulse', description: 'A dot before the word for a state; a pulse on it for what is live, and only that.' },
        { id: 'removable', title: 'Removable chips', description: 'Given onRemove, a badge is a chip with its ×, named for a screen reader after what it removes: the filters of a list.' },
        { id: 'in-a-table', title: 'In a table', description: 'The state of each row, in its own column: the word carries it, the colour repeats it.' },
      ],
    },
    {
      slug: 'status-badge',
      name: 'StatusBadge',
      names: ['StatusBadge'],
      keywords: ['health', 'uptime', 'service', 'up', 'down', 'degraded'],
      examples: [
        { id: 'statuses', title: 'Every status', description: 'Up, Degraded, Down, Unknown, Disabled: always a word beside the colour; what is disabled has no dot.' },
        { id: 'services', title: 'A list of services', description: 'Each service with its state, said in other words where the page has better ones (label).' },
      ],
    },
    {
      slug: 'check-list',
      name: 'CheckList',
      names: ['CheckList', 'CheckIcon'],
      keywords: ['checks', 'checklist', 'tests', 'pass', 'fail'],
      examples: [
        { id: 'states', title: 'Passed, failed, open', description: 'Checks and what each found, told apart by an icon as well as by colour, and named for screen readers. Three across from a small screen.' },
        { id: 'links', title: 'Each leading to its page', description: 'hrefOf gives a check its address: its name becomes a link to what says more of it.' },
        { id: 'check-icon', title: 'CheckIcon on its own', description: 'Beside a figure, named; beside words that already say the outcome, named={false}.' },
      ],
    },
    {
      slug: 'request-status',
      name: 'RequestStatus',
      names: ['RequestStatus'],
      keywords: ['request', 'refund', 'payment', 'pending', 'lifecycle'],
      examples: [
        { id: 'stages', title: 'Each stage', description: 'Follows something asked to its outcome: asked, sent, done, refused, or no news. It watches, and acts on nothing.' },
        { id: 'dismissible', title: 'Put away', description: 'Given onDismiss, it has a Close: the card goes, what it watched goes on.' },
        { id: 'narrow', title: 'In a narrow column', description: 'Only the words of the step: no figures before they are known. A long subject wraps in its pill.' },
      ],
    },
    {
      slug: 'toast-provider',
      name: 'ToastProvider',
      names: ['ToastProvider'],
      keywords: ['toast', 'useToast', 'notification', 'snackbar'],
      examples: [
        { id: 'variants', title: 'Its variants', description: 'useToast() from inside the provider: one at a time, at the bottom centre, each for its whole time. An error stays 8 s.' },
        { id: 'action', title: 'With an action', description: 'One may lead on, by a link or a button (its action, which closes it): it stays 6 s, its time stopping under the pointer or while the keyboard is in it.' },
        { id: 'queued', title: 'Several at once', description: 'Shown one after the other, never one over another: when others wait, the one shown moves along faster.' },
        { id: 'provider', title: 'The provider', description: 'Once around the application; IoitiProvider and RouterRoot include it. wrapperClassName lifts its toasts above a bar fixed at the bottom.' },
      ],
    },
    {
      slug: 'velocity-toast',
      name: 'VelocityToast',
      names: ['VelocityToast'],
      keywords: ['toast', 'controlled', 'progress'],
      examples: [
        { id: 'controlled', title: 'Driven by the page', description: 'The toast under useToast(), for a page that shows and hides it itself: open and onDismiss, its bar running out.' },
        { id: 'positions', title: 'Positions', description: 'Bottom centre by default, where pages put no control; the corners and the top for a page whose bottom is taken.' },
        { id: 'action', title: 'Action, icon, no bar', description: 'A link or a button beside its words (using it closes the toast), its own icon, its own time; showProgress={false} hides the bar, not the time.' },
      ],
    },
    {
      slug: 'undo-toast',
      name: 'UndoToast',
      names: ['UndoToast'],
      keywords: ['undo', 'delete', 'remove', 'restore'],
      examples: [
        { id: 'remove', title: 'A removal to undo', description: 'An Undo instead of a question: nothing is sent before the time runs out. The time runs on under the pointer; it stops while the keyboard is in the toast, the time to reach Undo.' },
        { id: 'variants', title: 'Variants and words', description: 'Its tone follows what was done; its Undo and what it says once undone can be said in the page’s words.' },
        { id: 'positions', title: 'Positions and countdown', description: 'Bottom centre by default; the countdown bar can go, the time stays.' },
      ],
    },
    {
      slug: 'dynamic-island',
      name: 'DynamicIsland',
      names: ['DynamicIsland'],
      keywords: ['island', 'pill', 'live', 'top bar'],
      examples: [
        { id: 'top-bar', title: 'In a top bar', description: 'A pill that keeps its place in the top bar and grows into an island over the page: what is live, everywhere.' },
        { id: 'controlled', title: 'Opened by the page', description: 'Collapsed or expanded from outside (state and onStateChange): the island takes the focus as it opens and gives it back to the pill.' },
      ],
    },
  ],
}

export default feedback
