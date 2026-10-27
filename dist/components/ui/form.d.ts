import React from 'react';
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}
export declare const Form: React.ForwardRefExoticComponent<FormProps & React.RefAttributes<HTMLFormElement>>;
export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
    error?: string;
}
export declare const FormItem: React.ForwardRefExoticComponent<FormItemProps & React.RefAttributes<HTMLDivElement>>;
export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}
export declare const FormLabel: React.ForwardRefExoticComponent<FormLabelProps & React.RefAttributes<HTMLLabelElement>>;
export declare const FormControl: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
export declare const FormDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>>;
export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
    error?: string | null;
}
export declare const FormMessage: React.ForwardRefExoticComponent<FormMessageProps & React.RefAttributes<HTMLParagraphElement>>;
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Optional icon rendered at the start of input */
    leftIcon?: React.ReactNode;
    /** Optional icon rendered at the end of input */
    rightIcon?: React.ReactNode;
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
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: React.ReactNode;
    description?: string;
}
export declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
export interface RadioOption {
    value: string;
    label: React.ReactNode;
    description?: string;
    disabled?: boolean;
}
export interface RadioGroupProps {
    name: string;
    value?: string;
    defaultValue?: string;
    options?: RadioOption[];
    onChange?: (value: string) => void;
    className?: string;
    children?: React.ReactNode;
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
export interface SwitchProps {
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    label?: React.ReactNode;
    description?: string;
    className?: string;
}
export declare const Switch: React.FC<SwitchProps>;
