import React from 'react';
export type DragConfirmActionType = 'delete' | 'archive' | 'confirm' | 'submit' | 'unlock' | 'continue';
export type DragConfirmVariant = 'default' | 'danger' | 'warning' | 'info' | 'success';
export type DragConfirmSize = 'sm' | 'md' | 'lg';
export interface DragToConfirmProps {
    /** Label shown along track */
    label?: string;
    /** Label shown upon completion */
    confirmedLabel?: string;
    /** Action archetype */
    actionType?: DragConfirmActionType;
    /** Visual variant tone override */
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
