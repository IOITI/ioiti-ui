/**
 * EasyUI Motion Design Tokens
 * Philosophy: Soft + physical + immediate + controlled
 *
 * Tuning philosophy (Apple HIG-inspired):
 *  - Critical-damping ratio around 0.85-1.0 for buttery, never-bouncy motion.
 *  - Stiffness chosen so the spring reaches ~95% of the target in 350-450ms.
 *  - Mass kept low (0.4-0.8) so motion feels light and immediate.
 *  - Stagger and duration for choreographed reveals.
 */
export const motionTransitions = {
    // Gentle fluid transitions (for tabs, smooth accordion, dialog fades)
    // ~400ms to settle, near-critical damping — no overshoot, no oscillation.
    springGentle: {
        type: "spring",
        stiffness: 170,
        damping: 26,
        mass: 0.9,
    },
    // Smooth standard motion
    // Slightly underdamped (~0.85) for the slightest organic feel on cards.
    springSmooth: {
        type: "spring",
        stiffness: 200,
        damping: 28,
        mass: 0.85,
    },
    // Snappy responsive feedback (for buttons, hover indicators, dock icons)
    // High stiffness, low mass — settles in ~200ms with a subtle settle.
    springSnappy: {
        type: "spring",
        stiffness: 380,
        damping: 30,
        mass: 0.5,
    },
    // Morphing shared layout (for layoutId dialogs, expanding search, tabs background)
    // Tuned to feel continuous — long settle, no overshoot, like a fluid surface.
    springMorph: {
        type: "spring",
        stiffness: 220,
        damping: 32,
        mass: 1.0,
    },
    // Responsive bounce physics (for magnetic pull return, toasts stack)
    // Slightly underdamped for that tiny satisfying overshoot.
    springResponsive: {
        type: "spring",
        stiffness: 320,
        damping: 24,
        mass: 0.7,
    },
    // Soft spring for natural-feeling follow / smoothing
    // (used as a default in useSpring when the caller didn't specify)
    springSoft: {
        type: "spring",
        stiffness: 150,
        damping: 22,
        mass: 0.9,
    },
    // Subtle ease for standard property transitions (color, opacity)
    // Custom cubic-bezier similar to Apple's "emphasized" curve.
    easeSoft: {
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
    },
    // Snappy ease for fast property transitions
    easeFast: {
        duration: 0.2,
        ease: [0.2, 0, 0, 1],
    },
    // ioiti-ui: a sheet or the sidebar's drawer sliding in and out, and the sidebar itself (its width,
    // its pill): near-critical (0.98 to 1.03 apart, flysheet's and the sidebar's own springs were),
    // settled in about 270 ms, no overshoot.
    springSheet: {
        type: "spring",
        stiffness: 400,
        damping: 38,
        mass: 0.85,
    },
    // ioiti-ui: what leaves (a dialog, a popover, a toast, a scrim): quicker than it arrived, and
    // accelerating away, as nothing holds the eye on what goes.
    easeExit: {
        duration: 0.15,
        ease: [0.4, 0, 1, 1],
    },
};
