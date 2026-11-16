/** The least the page's own name is cut to before the whole trail gives way to its last two steps. */
export const PAGE_STEP_MIN_WIDTH = 128;
/**
 * Whether the whole trail fits the room the top bar leaves it: the steps before the page as they are, and the
 * page's own step, whose name may be cut short to PAGE_STEP_MIN_WIDTH, never further.
 */
export function wholeTrailFits({ room, before, gap, page }) {
    const needed = before.reduce((sum, width) => sum + width, 0) + gap * before.length + Math.min(page, PAGE_STEP_MIN_WIDTH);
    return needed <= room;
}
