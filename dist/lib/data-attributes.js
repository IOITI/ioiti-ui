/** A component's other props split in two: the `data-*` attributes, for its outermost element, and the rest. */
export function splitDataAttributes(props) {
    const data = {};
    const rest = {};
    for (const [name, value] of Object.entries(props)) {
        if (name.startsWith('data-'))
            data[name] = value;
        else
            rest[name] = value;
    }
    return [data, rest];
}
/** The `data-*` attributes among a component's other props, for its outermost element: nothing else of them. */
export function dataAttributes(props) {
    return splitDataAttributes(props)[0];
}
