import { useCallback, useRef } from 'react';
/** Gives an element to a ref of either kind: a function, or an object to hold it. */
export function assignRef(ref, value) {
    if (typeof ref === 'function')
        ref(value);
    else if (ref)
        ref.current = value;
}
/**
 * A ref a component holds an element by, and the callback that gives the element to it and to its caller's ref too (a
 * control's `ref`): the component's own ref and the one it is given, one element.
 */
export function useForwardedRef(given) {
    const own = useRef(null);
    const set = useCallback((element) => {
        own.current = element;
        assignRef(given, element);
    }, [given]);
    return [own, set];
}
