'use client';

import React, { forwardRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { fieldBorder, invalidOf } from '../../lib/field-border.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { DISABLED } from '../../lib/recipes.js';
// ioiti-ui: the units inside a field, measured as they change.
import { useUnitPadding } from '../../lib/unit-padding.js';
// ioiti-ui: what a FormItem (or a Field) tells the control in it: its id, what describes it, whether it is wrong.
import {
  besideId,
  FieldContext,
  joinIds,
  markControl,
  useFieldContext,
  useFieldControl,
  useFieldPart,
  useFieldPartId,
  useFormItemField,
} from '../field-context.js';
// ioiti-ui: the password toggle's words in the provider's language (`field`).
import { useMessages } from '../locale-context.js';

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
  /** ioiti-ui: what is wrong with its value: its control is marked invalid (`aria-invalid`), as a FormMessage under it marks it. */
  error?: string;
}

// ioiti-ui: the item links its parts, which EasyUI's left apart: its label names its control (one id for it, the id
// of a Field around it if any), its description and its message describe it, and a message under it (or its `error`)
// marks it invalid. Its `error` is no longer an attribute of the `div`.
export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, error, ...props }, ref) => {
    const field = useFormItemField(error);
    return (
      <FieldContext.Provider value={field}>
        <div ref={ref} className={cn('space-y-1.5 w-full', className)} {...props} />
      </FieldContext.Provider>
    );
  }
);
FormItem.displayName = 'FormItem';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, htmlFor, ...props }, ref) => {
    // ioiti-ui: it names its FormItem's control by the id the control is drawn with, its own or the item's, unless
    // given `htmlFor` (EasyUI's named nothing without it); no `for` while no control says it is there, so that a label
    // around a control of its own still names that one.
    const field = useFieldContext();
    return (
      <label
        ref={ref}
        htmlFor={htmlFor ?? field?.controlId}
        className={cn(
          'block text-xs font-semibold text-foreground select-none',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-negative ml-1" aria-hidden="true">*</span>}
      </label>
    );
  }
);
FormLabel.displayName = 'FormLabel';

export const FormControl = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    // ioiti-ui: its control, one from elsewhere too (which cannot read its FormItem), is given the item's id where it
    // has none, what describes it (`aria-describedby`) and `aria-invalid`; the package's read them from the item as
    // well, each id once. A `div` that only holds the control is given nothing: what it holds reads the item.
    const field = useFieldContext();
    useFieldPart('held', besideId(children, field));
    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        {markControl(children, field, { beside: true })}
      </div>
    );
  }
);
FormControl.displayName = 'FormControl';

export const FormDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, id, ...props }, ref) => {
    // ioiti-ui: its id (its own in a FormItem, unless given one) describes its FormItem's control.
    const ownId = useFieldPartId('description', id);
    return (
      <p
        ref={ref}
        id={ownId}
        className={cn('text-xs text-muted-foreground leading-relaxed', className)}
        {...props}
      />
    );
  }
);
FormDescription.displayName = 'FormDescription';

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string | null;
}

export const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, error, children, id, ...props }, ref) => {
    const message = error || children;
    // ioiti-ui: while it says something, its id (its own in a FormItem, unless given one) describes its FormItem's
    // control, which it marks invalid; once it is gone, neither.
    const ownId = useFieldPartId('message', id, Boolean(message));
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
              id={ownId}
              role="alert"
              className={cn(
                'text-xs text-negative flex items-center gap-1.5 pt-0.5 font-medium',
                className
              )}
              {...props}
            >
              <AlertCircle className="size-3 shrink-0" />
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
    // ioiti-ui: the toggle's name in the provider's language.
    const words = useMessages().field;
    // ioiti-ui: in error by its own prop, or marked invalid (a Field around it); its id, its description and its
    // error from a FormItem or a Field around it too.
    const control = useFieldControl({
      id: props.id,
      describedBy: props['aria-describedby'],
      invalid: invalidOf(error, props['aria-invalid']),
    });
    const invalid = control.invalid;
    const computedType = isPassword && showPassword ? 'text' : type;

    // ioiti-ui: the units inside the field, measured (again whenever their size changes: 16px on a phone, 14px from
    // 640px), the text keeping clear of them; each describes the field.
    const unitId = React.useId();
    const before = React.useRef<HTMLSpanElement>(null);
    const after = React.useRef<HTMLSpanElement>(null);
    const pad = useUnitPadding(before, after, [prefix, suffix]);
    const describedBy = joinIds(control.describedBy, prefix ? `${unitId}-prefix` : null, suffix ? `${unitId}-suffix` : null);

    return (
      <div className="relative w-full flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-muted-foreground pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        {prefix && (
          <span
            ref={before}
            id={`${unitId}-prefix`}
            // Not in a label's name around the field: its description (aria-describedby).
            aria-hidden
            className="absolute left-0 flex h-full items-center pl-3.5 pr-1.5 text-base sm:text-sm text-muted-foreground pointer-events-none"
          >
            {prefix}
          </span>
        )}

        <input
          ref={ref}
          type={computedType}
          disabled={disabled}
          className={cn(
            'w-full h-10 px-3.5 text-base sm:text-sm text-foreground placeholder:text-text-subtle bg-surface rounded-lg border transition-colors duration-150',
            // ioiti-ui: its border, or the error's (never both: the error's lost to the dark ones); in focus, in
            // the accent under a theme that has one (accent:).
            fieldBorder(invalid),
            'focus:outline-none focus-ring',
            leftIcon && 'pl-9',
            (rightIcon || (isPassword && showPasswordToggle)) && 'pr-9',
            DISABLED,
            className
          )}
          // ioiti-ui: an error is said, not only shown.
          {...props}
          id={control.id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          style={{ ...(prefix && pad.left ? { paddingLeft: pad.left } : {}), ...(suffix && pad.right ? { paddingRight: pad.right } : {}), ...style }}
        />

        {suffix && (
          <span
            ref={after}
            id={`${unitId}-suffix`}
            aria-hidden
            className="absolute right-0 flex h-full items-center pl-1.5 pr-3.5 text-base sm:text-sm text-muted-foreground pointer-events-none"
          >
            {suffix}
          </span>
        )}

        {isPassword && showPasswordToggle ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? words.hidePassword : words.showPassword}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-md cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        ) : (
          rightIcon && (
            <div className="absolute right-3 text-muted-foreground pointer-events-none flex items-center justify-center">
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
    // ioiti-ui: its id, its description and its error from a FormItem or a Field around it too, as the Input's.
    const control = useFieldControl({
      id: props.id,
      describedBy: props['aria-describedby'],
      invalid: invalidOf(error, props['aria-invalid']),
    });
    const invalid = control.invalid;
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          'w-full min-h-[90px] px-3.5 py-3 text-base sm:text-sm text-foreground placeholder:text-text-subtle bg-surface rounded-lg border transition-colors duration-150 resize-y',
          // ioiti-ui: its border, or the error's, as the Input's.
          fieldBorder(invalid),
          'focus:outline-none focus-ring leading-relaxed',
          DISABLED,
          className
        )}
        {...props}
        id={control.id}
        aria-invalid={invalid || undefined}
        aria-describedby={control.describedBy}
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
    // ioiti-ui: its id, its description and its error from a FormItem or a Field around it too, as the Input's.
    const control = useFieldControl({
      id: props.id,
      describedBy: props['aria-describedby'],
      invalid: invalidOf(error, props['aria-invalid']),
    });
    const invalid = control.invalid;
    return (
      <div className="relative w-full flex items-center">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full h-10 pl-3.5 pr-8 text-base sm:text-sm text-foreground bg-surface rounded-lg border appearance-none transition-colors duration-150 cursor-pointer',
            // ioiti-ui: its border, or the error's, as the Input's.
            fieldBorder(invalid),
            'focus:outline-none focus-ring',
            DISABLED,
            className
          )}
          {...props}
          id={control.id}
          aria-invalid={invalid || undefined}
          aria-describedby={control.describedBy}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className="bg-surface text-foreground"
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute right-3 text-muted-foreground pointer-events-none flex items-center justify-center">
          <ChevronDown className="size-4" />
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
    <div className={cn('flex items-start gap-2.5 select-none', disabled && 'opacity-50 cursor-not-allowed', className)}>
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
            'size-4 rounded-full border flex items-center justify-center transition-colors duration-150 cursor-pointer pointer-events-none',
            checked
              ? 'border-foreground bg-surface accent:border-brand'
              : 'border-border bg-surface hover:border-border-hover',
            disabled && 'cursor-not-allowed'
          )}
        >
          {checked && (
            <motion.div
              layoutId={`radio-dot-${name}`}
              className="size-2 rounded-full bg-foreground accent:bg-brand"
              transition={motionTransitions.springSnappy}
            />
          )}
        </div>
      </div>

      {(label || description) && (
        <label htmlFor={id} className="cursor-pointer text-left">
          {label && (
            <div className="text-sm font-medium text-foreground leading-tight">
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

export const Switch: React.FC<SwitchProps> = ({
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  label,
  description,
  className,
  id: givenId,
  name,
  value = 'on',
  required,
  'aria-label': ariaLabel,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ref,
}) => {
  const [isOn, setIsOn] = React.useState(defaultChecked);
  // ioiti-ui: named by its label and described by its description, as StretchSwitch: a screen reader said only
  // "switch, on".
  const id = useId();
  const isControlled = checked !== undefined;
  const current = isControlled ? checked : isOn;
  // ioiti-ui: named and described from outside too (`aria-*`, a Field or a FormItem around it), its id from a
  // FormItem, whose FormLabel then names it; it could take none of them.
  const control = useFieldControl({
    id: givenId,
    describedBy: joinIds(description ? `${id}-description` : null, describedBy),
    invalid: invalidOf(undefined, ariaInvalid),
  });

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
    // ioiti-ui: disabled, its label and its control at half strength, its description whole: it says why (it was 2:1).
    <div className={cn('flex items-center justify-between gap-4 select-none', disabled && 'cursor-not-allowed', className)}>
      {(label || description) && (
        <div
          className="text-left cursor-pointer"
          onClick={(event) => {
            // ioiti-ui: a label around the switch (a Field's) would pass this click on to it, turning it back.
            event.preventDefault();
            handleToggle();
          }}
        >
          {label && (
            <div id={`${id}-label`} className={cn('text-sm font-medium text-foreground leading-tight', disabled && 'opacity-50')}>
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
        ref={ref}
        id={control.id}
        type="button"
        role="switch"
        aria-checked={current}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy ?? (label && !ariaLabel ? `${id}-label` : undefined)}
        aria-describedby={control.describedBy}
        aria-invalid={control.invalid || undefined}
        aria-required={required || undefined}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus-ring',
          current
            ? 'bg-primary border-primary accent:bg-brand accent:border-brand'
            : 'bg-surface border-border',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <motion.span
          // ioiti-ui: 2 px from either end of the track's 34 px inside its border (it stopped 4 px short when on).
          animate={{ x: current ? 18 : 2 }}
          transition={motionTransitions.springSnappy}
          className={cn(
            'pointer-events-none block size-3.5 my-auto top-0 bottom-0 rounded-full shadow-subtle',
            current ? 'bg-primary-foreground accent:bg-brand-foreground' : 'bg-muted-foreground'
          )}
        />
      </button>
      {/* ioiti-ui: sent with its form while on, as a checkbox is: a hidden input, which a label around the switch (a
          Field's) cannot take for its control, as it would a checkbox. */}
      {name && current ? <input type="hidden" name={name} value={value} disabled={disabled} /> : null}
    </div>
  );
};
