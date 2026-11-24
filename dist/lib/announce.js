// One polite live region for what a control says once it has done something ("Copied", "3 unsaved changes"),
// made the first time something is said: nothing is added to the page by loading the package.
let region = null;
let pending;
function liveRegion() {
    if (region?.isConnected)
        return region;
    region = document.createElement('div');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.dataset.ioitiAnnouncer = '';
    // Visually hidden, as Tailwind's sr-only: out of sight, still read.
    Object.assign(region.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
    });
    document.body.append(region);
    return region;
}
/** Says a short message to screen readers, politely: after what they are reading. */
export function announce(message) {
    if (typeof document === 'undefined')
        return;
    const target = liveRegion();
    // Emptied first, then said a moment later: the same words said twice are heard twice.
    target.textContent = '';
    clearTimeout(pending);
    pending = setTimeout(() => {
        target.textContent = message;
    }, 50);
}
