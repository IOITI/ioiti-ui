import type { Ref } from 'react';
/** Gives an element to a ref of either kind: a function, or an object to hold it. */
export declare function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void;
