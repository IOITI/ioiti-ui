import React from 'react';
import type { StatusTone } from '../../lib/tones.js';
export type DragConfirmActionType = 'delete' | 'archive' | 'confirm' | 'submit' | 'unlock' | 'continue';
/**
 * @deprecated Use `StatusTone`, which `tone` takes. Removed in 1.0. ioiti-ui: the values of the former `variant`, read as
 * a tone's (`default` as `neutral`).
 */
export type DragConfirmVariant = 'default' | 'danger' | 'warning' | 'info' | 'success';
export type DragConfirmSize = 'sm' | 'md' | 'lg';
export interface DragToConfirmProps {
    /** Label shown along track. ioiti-ui: "Slide to confirm" in the provider's language by default. */
    label?: string;
    /** Label shown upon completion. ioiti-ui: "Confirmed ✓" in the provider's language by default. */
    confirmedLabel?: string;
    /** Action archetype */
    actionType?: DragConfirmActionType;
    /**
     * ioiti-ui: its tone, a StatusTone: `neutral`, `info`, `success`, `warning`, `danger`; without one, its `actionType`'s
     * (`danger` to delete, `warning` to unlock, `info` to submit, `neutral` otherwise).
     */
    tone?: StatusTone;
    /** @deprecated Use `tone`. Removed in 1.0. Its values read as a tone's: `default` as `neutral`. */
    variant?: DragConfirmVariant;
    /** Size variant */
    size?: DragConfirmSize;
    /** Custom idle icon */
    icon?: React.ReactNode;
    /** Custom confirmed icon */
    confirmedIcon?: React.ReactNode;
    /** Controlled confirmed state */
    isConfirmed?: boolean;
    /** Callback fired on confirmation reach */
    onConfirm?: () => void;
    /** Callback fired when reset back to start */
    onReset?: () => void;
    /** Reset to start automatically after completion delay (ms). Pass 0 to disable. */
    autoResetDelay?: number;
    /** Disabled state */
    disabled?: boolean;
    /** Enable haptic vibration feedback on confirmation */
    haptic?: boolean;
    /** Custom track class name */
    className?: string;
}
export declare const DragToConfirm: React.FC<DragToConfirmProps>;
