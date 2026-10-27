import type { Transition } from "framer-motion";
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
export declare const motionTransitions: {
    springGentle: Transition;
    springSmooth: Transition;
    springSnappy: Transition;
    springMorph: Transition;
    springResponsive: Transition;
    springSoft: Transition;
    easeSoft: Transition;
    easeFast: Transition;
};
