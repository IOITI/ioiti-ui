import type { DevMessageId } from './dev-messages.js';
/** Says once, in development, what a component was given amiss; `detail` tells one case from another (a count, a name). */
export declare function devWarn(id: DevMessageId, detail?: string): void;
