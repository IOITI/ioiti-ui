/**
 * A value its caller may hold (`value` given, told of each change by `onChange`) or leave to the component
 * (`defaultValue` to start from): the two ways a control is used, and the one way a component holds a state
 * (docs/conventions.md). `onChange` is told of every change either way, with what goes with it (why a sheet closed:
 * `set(false, { reason })`).
 */
export declare function useControllableState<T, A extends unknown[] = []>(value: T | undefined, defaultValue: T, onChange?: (value: T, ...details: A) => void): [T, (next: T, ...details: A) => void];
