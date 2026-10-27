import { useCallback, useSyncExternalStore } from 'react';
const clocks = new Map();
function clockOf(interval) {
    let clock = clocks.get(interval);
    if (!clock) {
        clock = { now: Date.now(), timer: undefined, listeners: new Set() };
        clocks.set(interval, clock);
    }
    return clock;
}
function subscribe(interval, listener) {
    const clock = clockOf(interval);
    clock.listeners.add(listener);
    if (clock.timer === undefined) {
        clock.timer = setInterval(() => {
            clock.now = Date.now();
            for (const each of clock.listeners)
                each();
        }, interval);
    }
    return () => {
        clock.listeners.delete(listener);
        if (clock.listeners.size === 0) {
            clearInterval(clock.timer);
            clock.timer = undefined;
        }
    };
}
function snapshot(interval) {
    const clock = clockOf(interval);
    // Nothing has kept it going: the time it last read is old.
    if (clock.timer === undefined && Date.now() - clock.now >= interval)
        clock.now = Date.now();
    return clock.now;
}
/**
 * The time now (milliseconds since the epoch), read again every `interval` milliseconds: the components
 * asking for the same interval share one timer, which stops when none is left.
 */
export function useNow(interval = 1000) {
    // The same functions from one render to the next: React subscribes once, not at each render.
    const listen = useCallback((listener) => subscribe(interval, listener), [interval]);
    const read = useCallback(() => snapshot(interval), [interval]);
    return useSyncExternalStore(listen, read, read);
}
