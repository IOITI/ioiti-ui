import React from 'react';
import { type DataAttributes } from '../../lib/data-attributes.js';
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}
export declare const Form: React.ForwardRefExoticComponent<FormProps & React.RefAttributes<HTMLFormElement>>;
export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
    /** ioiti-ui: what is wrong with its value: its control is marked invalid (`aria-invalid`), as a FormMessage under it marks it. */
    error?: string;
}
export declare const FormItem: React.ForwardRefExoticComponent<FormItemProps & React.RefAttributes<HTMLDivElement>>;
export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}
export declare const FormLabel: React.ForwardRefExoticComponent<FormLabelProps & React.RefAttributes<HTMLLabelElement>>;
/** The props of `FormControl`: a `<div>`'s. */
export type FormControlProps = React.HTMLAttributes<HTMLDivElement>;
export declare const FormControl: React.ForwardRefExoticComponent<FormControlProps & React.RefAttributes<HTMLDivElement>>;
/** The props of `FormDescription`: a `<p>`'s. */
export type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
export declare const FormDescription: React.ForwardRefExoticComponent<FormDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
    error?: string | null;
}
export declare const FormMessage: React.ForwardRefExoticComponent<FormMessageProps & React.RefAttributes<HTMLParagraphElement>>;
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
    /** Optional icon rendered at the start of input */
    leftIcon?: React.ReactNode;
    /** Optional icon rendered at the end of input */
    rightIcon?: React.ReactNode;
    /** ioiti-ui: a unit before the value, inside the field ("€", "https://"): the text keeps clear of it, and a screen reader hears it. */
    prefix?: React.ReactNode;
    /** ioiti-ui: a unit after the value, inside the field ("ms", "kg", "%"). */
    suffix?: React.ReactNode;
    /** Pass an error message or boolean to trigger danger styling */
    error?: string | boolean;
    /** For type="password", automatically provide a show/hide toggle icon */
    showPasswordToggle?: boolean;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string | boolean;
}
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options?: SelectOption[];
    error?: string | boolean;
}
export declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;
export interface RadioOption {
    value: string;
    label: React.ReactNode;
    description?: string;
    disabled?: boolean;
}
export interface RadioGroupProps extends DataAttributes {
    /** ioiti-ui: the name its radios are sent under with their form: the value of the one chosen, nothing while none is. */
    name: string;
    value?: string;
    defaultValue?: string;
    options?: RadioOption[];
    onChange?: (value: string) => void;
    className?: string;
    children?: React.ReactNode;
    /** ioiti-ui: the group's id, for a `<label htmlFor>`… or `aria-labelledby` elsewhere; in a FormItem, the item's. */
    id?: string;
    /** ioiti-ui: its name, the question its choices answer, where no element names it (`aria-labelledby`). */
    'aria-label'?: string;
    /** ioiti-ui: the id of what names it: a heading. A Field's label or a FormItem's FormLabel names it without it. */
    'aria-labelledby'?: string;
    /** ioiti-ui: read out with it: what a Field or a FormItem around it says under it (its description, its error). */
    'aria-describedby'?: string;
    /** ioiti-ui: marked invalid, as a Field or a FormItem in error marks it. */
    'aria-invalid'?: boolean | 'true' | 'false';
    /** ioiti-ui: the group (its `radiogroup` element), which holds its radios. */
    ref?: React.Ref<HTMLDivElement>;
}
export declare const RadioGroup: React.FC<RadioGroupProps>;
export interface RadioGroupItemProps {
    name: string;
    value: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?: () => void;
    label?: React.ReactNode;
    description?: string;
    className?: string;
}
export declare const RadioGroupItem: React.FC<RadioGroupItemProps>;
export interface SwitchProps extends DataAttributes {
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    label?: React.ReactNode;
    description?: string;
    className?: string;
    /** ioiti-ui: the switch's id, for a `<label htmlFor>` elsewhere; in a FormItem, the item's, which its FormLabel names. */
    id?: string;
    /** ioiti-ui: the name it is sent under with its form while on, as a checkbox is; nothing is sent while off. */
    name?: string;
    /** ioiti-ui: what it sends under its `name` while on. */
    value?: string;
    /** ioiti-ui: it must be on (`aria-required`): the page checks it, and says so. */
    required?: boolean;
    /** ioiti-ui: its name, where no label names it (its own, a Field's, a FormLabel). */
    'aria-label'?: string;
    /** ioiti-ui: the id of what names it: a heading, a label elsewhere. */
    'aria-labelledby'?: string;
    /** ioiti-ui: the ids of what is read out with it, after its description; a Field or a FormItem around it adds its own. */
    'aria-describedby'?: string;
    /** ioiti-ui: marked invalid, as a Field or a FormItem in error marks it. */
    'aria-invalid'?: boolean | 'true' | 'false';
    /** ioiti-ui: the switch itself (its button), to focus it. */
    ref?: React.Ref<HTMLButtonElement>;
}
export declare const Switch: React.FC<SwitchProps>;
