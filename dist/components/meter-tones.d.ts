/**
 * A meter's tone: neutral, success, warning, danger. `positive` and `negative` are their former names for success and
 * danger: read as them, said once in development; removed in 1.0.
 */
export type MeterTone = 'neutral' | 'success' | 'warning' | 'danger' | 'positive' | 'negative';
/** A meter's tone as it is drawn: today's names. */
export type DrawnMeterTone = 'neutral' | 'success' | 'warning' | 'danger';
/** The tone a meter draws: a former name read as today's, said once in development (`where`: the component given it). */
export declare function meterTone(tone: MeterTone, where: string): DrawnMeterTone;
export declare const METER_FILL: Record<DrawnMeterTone, string>;
export declare const METER_TRACK: Record<DrawnMeterTone, string>;
/** The tone's colour for a line or a mark of a chart (a reference line, a band). */
export declare const METER_COLOUR: Record<DrawnMeterTone, string>;
