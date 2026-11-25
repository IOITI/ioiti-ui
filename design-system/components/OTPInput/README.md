# OTPInput

A one-time code, one box per digit: a password manager's or a phone's autofill fills every box, as a paste does.

**You provide** `aria-label` ("One-time code"; a `Field` or a `FormItem` around it names it), `length` (6 by default), `value` / `defaultValue`, `onChange`, `onComplete` (the code, once every box is filled); `id` for a `<label htmlFor>` (its first box's), `className` for the row (`grid grid-cols-6 gap-2`), `boxClassName`, `disabled`, `autoFocus`, `error` (every box's border in `negative`; a `Field` with an error gives it). In a form: `name`, its digits sent. `ref` (its first box), `aria-labelledby`, `aria-describedby`, `aria-invalid`, as a native control takes them.

```tsx
<OTPInput length={6} aria-label="One-time code" className="grid grid-cols-6 gap-2" onComplete={verify} />
```

- The first box asks for `one-time-code`, so the code offered by the system fills them all.
- The boxes have the look of the form's `Input`, 48px high, the one in focus bordered in the accent's `brand`.
- `autoFocus` only where the code is the page's one question (a sign-in's second step).

## Accessibility

A group named by its label ("One-time passcode" by default), each box a field of its own named by its place ("Digit 2 of 6"), all said invalid with `error`. Each box is a stop of the keyboard.

| Key | What it does |
|---|---|
| A digit | Fills the box, the focus going on to the next |
| Backspace | Empties the box; in an empty box, goes back to the one before and empties it |
| ←, → | The box before, the next |
| ⌘V (Ctrl+V) | A code pasted fills every box |
