import type { MessageKit } from '../../lib/messages.js';
/** Layout: ResizablePanels, ScrollProgressNav, DependencyTrace, InteractiveTimeline, PeekCard, Avatar. */
export declare const layout: {
    /** "Panel": the name of a panel that scrolls, where it is given no `label`. */
    panel: string;
    /** "Resize": the name of a handle, where neither it nor the panel before it has one. */
    resize: string;
    /** "Resize the editor": the name of a handle, the panel before it named (its `label`, "the editor"). */
    resizePanel: (panel: string) => string;
    /** "Table of contents": the nav's name, where the application gives none (`label`). */
    contents: string;
    /** "Toggle section menu": the button that opens the list of parts on a phone. */
    sectionMenu: string;
    /** "Back to the top": the name and the hint of the button that scrolls back up. */
    backToTop: string;
    /** "Dependency Relationship Graph": the graph's name, where the application gives none (`label`). */
    dependencyGraph: string;
    /** "Billing: Down": a node's name, its health given in words (`statusLabel`). */
    nodeStatus: ({ name, status }: {
        name: string;
        status: string;
    }) => string;
    /** ": Down": the health of the node traced, after its name in the status bar. */
    traceStatus: (status: string) => string;
    /** "calls Cache, Queue": what the node traced calls, in the status bar. */
    traceCalls: (names: readonly string[], _kit: MessageKit) => string;
    /** "called by Gateway, Web": what calls it. */
    traceCalledBy: (names: readonly string[], _kit: MessageKit) => string;
    /** "Hover or focus a node to trace what it calls and what calls it": the status bar while no node is traced. */
    traceHint: string;
    /** "8 connections": how many links the graph draws. */
    connections: (count: number, { plural }: MessageKit) => string;
    /** "Deploy: Done": the name and the hint of an item's node, its title and its state (`statusLabel`, or the next words). */
    timelineItem: ({ title, status }: {
        title: string;
        status: string;
    }) => string;
    /** "completed": an item's state, where it is given no `statusLabel`. */
    timelineCompleted: string;
    /** "in-progress": an item's state under way. */
    timelineInProgress: string;
    /** "pending": an item's state to come. */
    timelinePending: string;
    /** "failed": an item's state that went wrong. */
    timelineFailed: string;
    /** "warning": an item's state that went on, but not as it should. */
    timelineWarning: string;
    /** "Copy the commit hash": the hint of the button that copies an item's commit. */
    copyCommit: string;
    /** "Copy the commit hash 4f2a9c1": that button's name, the hash shown given. */
    copyCommitNamed: (hash: string) => string;
    /** "Copied": its hint once it is copied. */
    commitCopied: string;
    /** "Open": the card's own link, where it is given no words (`hrefLabel`). */
    open: string;
    /** "People": the group's name, where the application gives none (`label`). */
    people: string;
    /** "Ana Ortiz, Bo Chen": the people "+2" stands for, in its hint. */
    peopleList: (names: readonly string[], _kit: MessageKit) => string;
    /** "2 more: Ana Ortiz, Bo Chen": what "+2" is called. */
    morePeople: (names: readonly string[], { number }: MessageKit) => string;
};
