import type { MessageKit } from '../../lib/messages.js'

/** Layout: ResizablePanels, ScrollProgressNav, DependencyTrace, InteractiveTimeline, PeekCard, Avatar. */
export const layout = {
  // ResizablePanels.
  /** "Panel": the name of a panel that scrolls, where it is given no `label`. */
  panel: 'Panel',
  /** "Resize": the name of a handle, where neither it nor the panel before it has one. */
  resize: 'Resize',
  /** "Resize the editor": the name of a handle, the panel before it named (its `label`, "the editor"). */
  resizePanel: (panel: string) => `Resize ${panel}`,

  // ScrollProgressNav.
  /** "Table of contents": the nav's name, where the application gives none (`label`). */
  contents: 'Table of contents',
  /** "Toggle section menu": the button that opens the list of parts on a phone. */
  sectionMenu: 'Toggle section menu',
  /** "Back to the top": the name and the hint of the button that scrolls back up. */
  backToTop: 'Back to the top',

  // DependencyTrace.
  /** "Dependency Relationship Graph": the graph's name, where the application gives none (`label`). */
  dependencyGraph: 'Dependency Relationship Graph',
  /** "Billing: Down": a node's name, its health given in words (`statusLabel`). */
  nodeStatus: ({ name, status }: { name: string; status: string }) => `${name}: ${status}`,
  /** ": Down": the health of the node traced, after its name in the status bar. */
  traceStatus: (status: string) => `: ${status}`,
  // English names the nodes with commas alone, as it always has: its list (`kit.list`) says "a, b and c".
  /** "calls Cache, Queue": what the node traced calls, in the status bar. */
  traceCalls: (names: readonly string[], _kit: MessageKit) => `calls ${names.join(', ')}`,
  /** "called by Gateway, Web": what calls it. */
  traceCalledBy: (names: readonly string[], _kit: MessageKit) => `called by ${names.join(', ')}`,
  /** "Hover or focus a node to trace what it calls and what calls it": the status bar while no node is traced. */
  traceHint: 'Hover or focus a node to trace what it calls and what calls it',
  /** "8 connections": how many links the graph draws. */
  connections: (count: number, { plural }: MessageKit) => plural(count, { one: '# connection', other: '# connections' }),

  // InteractiveTimeline.
  /** "Deploy: Done": the name and the hint of an item's node, its title and its state (`statusLabel`, or the next words). */
  timelineItem: ({ title, status }: { title: string; status: string }) => `${title}: ${status}`,
  /** "completed": an item's state, where it is given no `statusLabel`. */
  timelineCompleted: 'completed',
  /** "in-progress": an item's state under way. */
  timelineInProgress: 'in-progress',
  /** "pending": an item's state to come. */
  timelinePending: 'pending',
  /** "failed": an item's state that went wrong. */
  timelineFailed: 'failed',
  /** "warning": an item's state that went on, but not as it should. */
  timelineWarning: 'warning',
  /** "Copy the commit hash": the hint of the button that copies an item's commit. */
  copyCommit: 'Copy the commit hash',
  /** "Copy the commit hash 4f2a9c1": that button's name, the hash shown given. */
  copyCommitNamed: (hash: string) => `Copy the commit hash ${hash}`,
  /** "Copied": its hint once it is copied. */
  commitCopied: 'Copied',

  // PeekCard.
  /** "Open": the card's own link, where it is given no words (`hrefLabel`). */
  open: 'Open',

  // AvatarGroup.
  /** "People": the group's name, where the application gives none (`label`). */
  people: 'People',
  // English names the people with commas alone, as it always has: its list (`kit.list`) says "a, b and c".
  /** "Ana Ortiz, Bo Chen": the people "+2" stands for, in its hint. */
  peopleList: (names: readonly string[], _kit: MessageKit) => names.join(', '),
  /** "2 more: Ana Ortiz, Bo Chen": what "+2" is called. */
  morePeople: (names: readonly string[], { number }: MessageKit) => `${number(names.length)} more: ${names.join(', ')}`,
}
