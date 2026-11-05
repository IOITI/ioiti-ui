import * as React from "react";
export interface Step {
    title: string;
    description?: string;
}
export interface StepperProps {
    steps: Step[];
    /** Zero-based index of the active step. */
    current: number;
    /** Makes completed steps clickable (jump back). */
    onStepChange?: (index: number) => void;
    orientation?: "horizontal" | "vertical";
    className?: string;
}
export declare function Stepper({ steps, current, onStepChange, orientation, className }: StepperProps): React.JSX.Element;
export interface StepPanelsProps {
    current: number;
    /** One child per step, in order. */
    children: React.ReactNode;
    className?: string;
}
export declare function StepPanels({ current, children, className, }: StepPanelsProps): React.JSX.Element;
