import type { Ref, RefCallback, RefObject } from 'react';
/** Gives an element to a ref of either kind: a function, or an object to hold it. */
export declare function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void;
/**
 * A ref a component holds an element by, and the callback that gives the element to it and to its caller's ref too (a
 * control's `ref`): the component's own ref and the one it is given, one element.
 */
export declare function useForwardedRef<T>(given: Ref<T> | undefined): [RefObject<T | null>, RefCallback<T>];
