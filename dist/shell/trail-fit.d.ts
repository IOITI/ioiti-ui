/** The least the page's own name is cut to before the whole trail gives way to its last two steps. */
export declare const PAGE_STEP_MIN_WIDTH = 128;
export interface TrailWidths {
    /** The width the top bar leaves the trail. */
    room: number;
    /** The steps before the page, as wide as they are: they are never cut short below their width. */
    before: number[];
    /** The space between two steps. */
    gap: number;
    /** The page's own step as wide as its whole name makes it. */
    page: number;
}
/**
 * Whether the whole trail fits the room the top bar leaves it: the steps before the page as they are, and the
 * page's own step, whose name may be cut short to PAGE_STEP_MIN_WIDTH, never further.
 */
export declare function wholeTrailFits({ room, before, gap, page }: TrailWidths): boolean;
