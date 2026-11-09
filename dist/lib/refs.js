/** Gives an element to a ref of either kind: a function, or an object to hold it. */
export function assignRef(ref, value) {
    if (typeof ref === 'function')
        ref(value);
    else if (ref)
        ref.current = value;
}
