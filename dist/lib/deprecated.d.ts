import type { DeprecationId } from './deprecations.js';
/** Says once, in development, that a deprecated name was given, and what replaces it. */
export declare function deprecated(id: DeprecationId, where?: string): void;
