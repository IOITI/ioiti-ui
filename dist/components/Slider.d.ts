import type { ReactNode } from 'react';
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
interface SliderBase {
    /** What it sets, shown above it: "Risk per trade". */
    label: ReactNode;
    /** Its name for a screen reader, where the label is not text. */
    ariaLabel?: string;
    min?: number;
    max?: number;
    step?: number;
    /** The value in words: "2.5%", "45 min". */
    format?: (value: number) => string;
    /** Marks under the track: at every step (`true`), at the values given, or with their labels. */
    ticks?: boolean | number[] | SliderTick[];
    /** Bands of the track in a tone: where a value is safe, to watch, too far. */
    levels?: SliderLevel[];
    disabled?: boolean;
    className?: string;
}
interface SliderProps extends SliderBase {
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
    /** A field beside it, to type the value. */
    showInput?: boolean;
}
interface RangeSliderProps extends SliderBase {
    value?: [number, number];
    defaultValue?: [number, number];
    onChange?: (value: [number, number]) => void;
}
/**
 * A value chosen along a scale: a risk, a share, a delay. The browser's own range input, its keyboard and
 * its screen reader's support with it (the arrows, Page Up and Down, Home and End), its value in words.
 * Its scale may show ticks and bands in a tone; a field beside it types the value.
 */
export declare function Slider({ label, ariaLabel, value, defaultValue, onChange, min, max, step, format, ticks, levels, showInput, disabled, className, }: SliderProps): import("react").JSX.Element;
/** Two values along a scale, a range between them: a price from and to, the hours a task may run. */
export declare function RangeSlider({ label, ariaLabel, value, defaultValue, onChange, min, max, step, format, ticks, levels, disabled, className, }: RangeSliderProps): import("react").JSX.Element;
export {};
