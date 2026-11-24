import type { DependencyList, RefObject } from 'react';
/**
 * The room a field keeps for what sits inside it at either end (a unit, its buttons): the width of each, measured,
 * and measured again whenever it changes. A field's text is 16px on a phone and 14px from 640px, its units with it,
 * so a unit is wider on one side of that width than on the other; and a web font that arrives after the first
 * measure widens it too. Measured once, the text ran under the unit.
 */
export declare function useUnitPadding(before: RefObject<HTMLElement | null>, after: RefObject<HTMLElement | null>, deps: DependencyList): {
    left: number;
    right: number;
};
