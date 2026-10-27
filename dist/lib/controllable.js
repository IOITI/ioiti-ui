import { useCallback, useEffect, useRef, useState } from 'react';
/**
 * A value its caller may hold (`value` given, told of each change by `onChange`) or leave to the
 * component (`defaultValue` to start from): the two ways a control is used.
 */
export function useControllableState(value, defaultValue, onChange) {
    const [internal, setInternal] = useState(defaultValue);
    const controlled = value !== undefined;
    const current = controlled ? value : internal;
    // The latest onChange, without making a new setter each time the caller draws a new function.
    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    });
    const set = useCallback((next) => {
        if (!controlled)
            setInternal(next);
        onChangeRef.current?.(next);
    }, [controlled]);
    return [current, set];
}
