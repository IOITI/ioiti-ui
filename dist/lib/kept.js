// What the browser keeps for the application (localStorage), as far as it lets it: a private window, or storage
// refused, keeps nothing, and the interface works the same, forgetting.
/** What is kept under a key; null where nothing is, or the browser keeps nothing. */
export function readKept(key) {
    try {
        return window.localStorage.getItem(key);
    }
    catch {
        return null;
    }
}
/** Keeps a value under a key, where the browser lets it. */
export function keep(key, value) {
    try {
        window.localStorage.setItem(key, value);
    }
    catch {
        // A private window, storage refused: the choice holds until the page is closed.
    }
}
/** Forgets what is kept under a key. */
export function unkeep(key) {
    try {
        window.localStorage.removeItem(key);
    }
    catch {
        // Nothing could be kept there.
    }
}
