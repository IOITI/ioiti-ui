import type { ReactNode, Ref } from 'react';
import type { DataAttributes } from '../lib/data-attributes.js';
import type { MeterTone } from './meter-tones.js';
export interface SliderTick {
    value: number;
    label?: ReactNode;
}
export interface SliderLevel {
    from: number;
    to: number;
    tone: MeterTone;
}
interface SliderBase extends DataAttributes {
    /** What it sets, shown above it: "Risk per trade". Left out in a Field, whose label names it. */
    label?: ReactNode;
    /** Its name for a screen reader, where the label is not text. */
    'aria-label'?: string;
    /** The id of what names it, in place of its label: a heading. A Field's label names it without it. */
    'aria-labelledby'?: string;
    /** Read out with it: what a Field around it says under it (its description, its error). */
    'aria-describedby'?: string;
    /** Marked invalid, as a Field with an error marks it. */
    'aria-invalid'?: boolean | 'true' | 'false';
    min?: number;
    max?: number;
    step?: number;
    /** The value in words: "2.5%", "45 min". The provider's number by default, to the step's decimals. */
    format?: (value: number) => string;
    /** Marks under the track: at every step (`true`), at the values given, or with their labels. */
    ticks?: boolean | number[] | SliderTick[];
    /** Bands of the track in a tone: where a value is safe, to watch, too far. */
    levels?: SliderLevel[];
    disabled?: boolean;
    className?: string;
}
export interface SliderProps extends SliderBase {
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
    /** A field beside it, to type the value. */
    showInput?: boolean;
    /** Its range input's id, for a `<label htmlFor>`; in a FormItem, the item's. */
    id?: string;
    /** The name its value is sent under with a form (its range input's own): the number as code writes it ("2.5"). */
    name?: string;
    /** Its range input, to focus it. */
    ref?: Ref<HTMLInputElement>;
}
export interface RangeSliderProps extends SliderBase {
    value?: [number, number];
    defaultValue?: [number, number];
    onChange?: (value: [number, number]) => void;
    /** The id of its first thumb (the lower value's range input), for a `<label htmlFor>`; in a FormItem, the item's. */
    id?: string;
    /** The name its two values are sent under with a form, in order: the lower, then the upper (each thumb's own). */
    name?: string;
    /** Its first thumb (the lower value's range input), to focus it. */
    ref?: Ref<HTMLInputElement>;
}
/**
 * A value chosen along a scale: a risk, a share, a delay. The browser's own range input, its keyboard and
 * its screen reader's support with it (the arrows, Page Up and Down, Home and End), its value in words.
 * Its scale may show ticks and bands in a tone; a field beside it types the value.
 */
export declare function Slider({ label, 'aria-label': name, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, value, defaultValue, onChange, min, max, step, format: given, ticks, levels, showInput, disabled, className, id: givenId, name: formName, ref, ...rest }: SliderProps): import("react").JSX.Element;
/** Two values along a scale, a range between them: a price from and to, the hours a task may run. */
export declare function RangeSlider({ label, 'aria-label': givenName, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, value, defaultValue, onChange, min, max, step, format: given, ticks, levels, disabled, className, id: givenId, name: formName, ref, ...rest }: RangeSliderProps): import("react").JSX.Element;
export {};
