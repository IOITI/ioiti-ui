/**
 * A value its caller may hold (`value` given, told of each change by `onChange`) or leave to the
 * component (`defaultValue` to start from): the two ways a control is used.
 */
export declare function useControllableState<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void): [T, (next: T) => void];
