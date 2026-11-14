'use client';

import React, { forwardRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { fieldBorder, invalidOf } from '../../lib/field-border.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';

/* ==========================================================================
   1. Form Root & Layout Items
   ========================================================================== */

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ className, onSubmit, ...props }, ref) => (
    <form
      ref={ref}
      onSubmit={onSubmit}
      className={cn('space-y-4 w-full', className)}
      noValidate
      {...props}
    />
  )
);
Form.displayName = 'Form';

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string;
}

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-1.5 w-full', className)} {...props} />
  )
);
FormItem.displayName = 'FormItem';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'block text-xs font-medium text-neutral-900 dark:text-[#FAFAFA] select-none tracking-tight',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-700 dark:text-[#FF7A7A] ml-1" aria-hidden="true">*</span>}
    </label>
  )
);
FormLabel.displayName = 'FormLabel';

export const FormControl = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative', className)} {...props} />
  )
);
FormControl.displayName = 'FormControl';

export const FormDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-xs text-muted-foreground leading-relaxed', className)}
      {...props}
    />
  )
);
FormDescription.displayName = 'FormDescription';

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string | null;
}

export const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, error, children, ...props }, ref) => {
    const message = error || children;
    return (
      <AnimatePresence>
        {message ? (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={motionTransitions.springSnappy}
            className="overflow-hidden"
          >
            <p
              ref={ref}
              role="alert"
              className={cn(
                'text-xs text-red-700 dark:text-[#FF7A7A] flex items-center gap-1.5 pt-0.5 font-medium',
                className
              )}
              {...props}
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{message}</span>
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }
);
FormMessage.displayName = 'FormMessage';

/* ==========================================================================
   2. Input Component
   ========================================================================== */

// ioiti-ui: `prefix` is a unit drawn in the field here, not the RDFa attribute of the same name.
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

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      leftIcon,
      rightIcon,
      error,
      showPasswordToggle = false,
      disabled,
      prefix,
      suffix,
      style,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    // ioiti-ui: in error by its own prop, or marked invalid (a Field around it).
    const invalid = invalidOf(error, props['aria-invalid']);
    const computedType = isPassword && showPassword ? 'text' : type;

    // ioiti-ui: the units inside the field, measured, the text keeping clear of them; each describes the field.
    const unitId = React.useId();
    const before = React.useRef<HTMLSpanElement>(null);
    const after = React.useRef<HTMLSpanElement>(null);
    const [pad, setPad] = React.useState({ left: 0, right: 0 });
    React.useLayoutEffect(() => {
      setPad({ left: before.current?.offsetWidth ?? 0, right: after.current?.offsetWidth ?? 0 });
    }, [prefix, suffix]);
    const describedBy =
      [props['aria-describedby'], prefix ? `${unitId}-prefix` : null, suffix ? `${unitId}-suffix` : null].filter(Boolean).join(' ') || undefined;

    return (
      <div className="relative w-full flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-neutral-500 dark:text-[#525252] pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        {prefix && (
          <span
            ref={before}
            id={`${unitId}-prefix`}
            // Not in a label's name around the field: its description (aria-describedby).
            aria-hidden
            className="absolute left-0 flex h-full items-center pl-3.5 pr-1.5 text-xs text-muted-foreground pointer-events-none"
          >
            {prefix}
          </span>
        )}

        <input
          ref={ref}
          type={computedType}
          disabled={disabled}
          className={cn(
            'w-full h-10 px-3.5 text-xs text-neutral-900 dark:text-[#FAFAFA] placeholder:text-muted-foreground bg-white dark:bg-[#141414] rounded-lg border transition-all duration-150',
            // ioiti-ui: its border, or the error's (never both: the error's lost to the dark ones); in focus, in
            // the accent under a theme that has one (accent:).
            fieldBorder(invalid),
            'focus:bg-white dark:focus:bg-[#141414] focus:outline-none focus-ring',
            leftIcon && 'pl-9',
            (rightIcon || (isPassword && showPasswordToggle)) && 'pr-9',
            disabled && 'opacity-30 cursor-not-allowed bg-neutral-100 dark:bg-[#0E0E0E]',
            className
          )}
          // ioiti-ui: an error is said, not only shown.
          {...props}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          style={{ ...(prefix && pad.left ? { paddingLeft: pad.left } : {}), ...(suffix && pad.right ? { paddingRight: pad.right } : {}), ...style }}
        />

        {suffix && (
          <span
            ref={after}
            id={`${unitId}-suffix`}
            aria-hidden
            className="absolute right-0 flex h-full items-center pl-1.5 pr-3.5 text-xs text-muted-foreground pointer-events-none"
          >
            {suffix}
          </span>
        )}

        {isPassword && showPasswordToggle ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 text-neutral-500 dark:text-[#525252] hover:text-neutral-900 dark:hover:text-[#FAFAFA] transition-colors focus-ring rounded cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </button>
        ) : (
          rightIcon && (
            <div className="absolute right-3 text-neutral-500 dark:text-[#525252] pointer-events-none flex items-center justify-center">
              {rightIcon}
            </div>
          )
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

/* ==========================================================================
   3. Textarea Component
   ========================================================================== */

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, ...props }, ref) => {
    const invalid = invalidOf(error, props['aria-invalid']);
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          'w-full min-h-[90px] p-3 text-xs text-neutral-900 dark:text-[#FAFAFA] placeholder:text-muted-foreground bg-white dark:bg-[#141414] rounded-lg border transition-all duration-150 resize-y',
          // ioiti-ui: its border, or the error's, as the Input's.
          fieldBorder(invalid),
          'focus:bg-white dark:focus:bg-[#141414] focus:outline-none focus-ring leading-relaxed',
          disabled && 'opacity-30 cursor-not-allowed bg-neutral-100 dark:bg-[#0E0E0E]',
          className
        )}
        {...props}
        aria-invalid={invalid || undefined}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

/* ==========================================================================
   4. Select Component
   ========================================================================== */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  error?: string | boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options = [], children, error, disabled, ...props }, ref) => {
    const invalid = invalidOf(error, props['aria-invalid']);
    return (
      <div className="relative w-full flex items-center">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full h-10 pl-3.5 pr-8 text-xs text-neutral-900 dark:text-[#FAFAFA] bg-white dark:bg-[#141414] rounded-lg border appearance-none transition-all duration-150 cursor-pointer',
            // ioiti-ui: its border, or the error's, as the Input's.
            fieldBorder(invalid),
            'focus:bg-white dark:focus:bg-[#141414] focus:outline-none focus-ring',
            disabled && 'opacity-30 cursor-not-allowed bg-neutral-100 dark:bg-[#0E0E0E]',
            className
          )}
          {...props}
          aria-invalid={invalid || undefined}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className="bg-white dark:bg-[#141414] text-neutral-900 dark:text-[#FAFAFA]"
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute right-3 text-neutral-500 dark:text-[#525252] pointer-events-none flex items-center justify-center">
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>
    );
  }
);
Select.displayName = 'Select';

/* ==========================================================================
   5. Checkbox Component
   ========================================================================== */

// ioiti-ui: the checkbox is EasyUI's draw-checkbox (draw-checkbox.tsx), which the package exports as
// `Checkbox`, with the same props and an `indeterminate` one.

/* ==========================================================================
   6. RadioGroup & RadioGroupItem
   ========================================================================== */

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
  /** ioiti-ui: the group's id, for a `<label htmlFor>`… or `aria-labelledby` elsewhere. */
  id?: string;
  /** ioiti-ui: its name, the question its choices answer, where no element names it (`aria-labelledby`). */
  'aria-label'?: string;
  /** ioiti-ui: the id of what names it: a heading, a Field's label. */
  'aria-labelledby'?: string;
  /** ioiti-ui: read out with it: what a Field around it says under it (its description, its error). */
  'aria-describedby'?: string;
  /** ioiti-ui: marked invalid, as a Field with an error marks it. */
  'aria-invalid'?: boolean | 'true' | 'false';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  defaultValue,
  options = [],
  onChange,
  className,
  children,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
}) => {
  const [selectedValue, setSelectedValue] = React.useState(defaultValue || '');
  const isControlled = value !== undefined;
  const current = isControlled ? value : selectedValue;

  const handleSelect = (val: string) => {
    if (!isControlled) {
      setSelectedValue(val);
    }
    if (onChange) {
      onChange(val);
    }
  };

  return (
    // ioiti-ui: named, as a group of choices must be (EasyUI's could not be): by its label, or by what it points to.
    <div
      role="radiogroup"
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalidOf(undefined, ariaInvalid) || undefined}
      className={cn('space-y-2', className)}
    >
      {options.length > 0
        ? options.map((opt) => (
            <RadioGroupItem
              key={opt.value}
              name={name}
              value={opt.value}
              checked={current === opt.value}
              disabled={opt.disabled}
              onChange={() => handleSelect(opt.value)}
              label={opt.label}
              description={opt.description}
            />
          ))
        : children}
    </div>
  );
};

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

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  name,
  value,
  checked = false,
  disabled = false,
  onChange,
  label,
  description,
  className,
}) => {
  const id = useId();

  return (
    <div className={cn('flex items-start gap-2.5 select-none', disabled && 'opacity-30 cursor-not-allowed', className)}>
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          // ioiti-ui: the input lies over the circle, transparent, and takes its clicks and the design's focus ring,
          // as the checkbox's: EasyUI's was `sr-only`, which hid the ring, so a keyboard saw no focus at all.
          className="peer absolute inset-0 m-0 appearance-none rounded-full bg-transparent cursor-pointer disabled:cursor-not-allowed"
        />
        <div
          aria-hidden
          className={cn(
            'w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-150 cursor-pointer pointer-events-none',
            checked
              ? 'border-neutral-900 dark:border-[#FAFAFA] bg-white dark:bg-[#141414] accent:border-brand'
              : 'border-neutral-300 dark:border-[#1F1F1F] bg-white dark:bg-[#141414] hover:border-neutral-500 dark:hover:border-[#4A4A4A]',
            disabled && 'cursor-not-allowed'
          )}
        >
          {checked && (
            <motion.div
              layoutId={`radio-dot-${name}`}
              className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-[#FAFAFA] accent:bg-brand"
              transition={motionTransitions.springSnappy}
            />
          )}
        </div>
      </div>

      {(label || description) && (
        <label htmlFor={id} className="cursor-pointer text-left">
          {label && (
            <div className="text-xs font-medium text-neutral-900 dark:text-[#FAFAFA] leading-tight">
              {label}
            </div>
          )}
          {description && (
            <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {description}
            </div>
          )}
        </label>
      )}
    </div>
  );
};

/* ==========================================================================
   7. Switch / Toggle Component
   ========================================================================== */

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  label,
  description,
  className,
}) => {
  const [isOn, setIsOn] = React.useState(defaultChecked);
  // ioiti-ui: named by its label and described by its description, as StretchSwitch: a screen reader said only
  // "switch, on".
  const id = useId();
  const isControlled = checked !== undefined;
  const current = isControlled ? checked : isOn;

  const handleToggle = () => {
    if (disabled) return;
    const next = !current;
    if (!isControlled) {
      setIsOn(next);
    }
    if (onChange) {
      onChange(next);
    }
  };

  return (
    <div className={cn('flex items-center justify-between gap-4 select-none', disabled && 'opacity-30 cursor-not-allowed', className)}>
      {(label || description) && (
        <div className="text-left cursor-pointer" onClick={handleToggle}>
          {label && (
            <div id={`${id}-label`} className="text-xs font-medium text-neutral-900 dark:text-[#FAFAFA] leading-tight">
              {label}
            </div>
          )}
          {description && (
            <div id={`${id}-description`} className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {description}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={current}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-describedby={description ? `${id}-description` : undefined}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus-ring',
          current
            ? 'bg-neutral-900 dark:bg-[#FAFAFA] border-neutral-900 dark:border-[#FAFAFA] accent:bg-brand accent:border-brand'
            : 'bg-white dark:bg-[#141414] border-neutral-300 dark:border-[#1F1F1F]',
          disabled && 'cursor-not-allowed'
        )}
      >
        <motion.span
          animate={{ x: current ? 16 : 2 }}
          transition={motionTransitions.springSnappy}
          className={cn(
            'pointer-events-none block h-3.5 w-3.5 my-auto top-0 bottom-0 rounded-full shadow-xs',
            current ? 'bg-white dark:bg-[#050505] accent:bg-brand-foreground' : 'bg-neutral-500 dark:bg-[#6B6B6B]'
          )}
        />
      </button>
    </div>
  );
};
