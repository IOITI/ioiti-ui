# OTPInput

A one-time code, one box per digit: a password manager's or a phone's autofill fills every box, as a paste does.

**You provide** `aria-label` ("One-time code"), `length` (6 by default), `value` / `onChange`, `onComplete` (the code, once every box is filled); `id` for a `<label htmlFor>`, `className` for the row (`grid grid-cols-6 gap-2`), `boxClassName`, `disabled`, `autoFocus`, `error` (every box's border in `negative`; a `Field` with an error gives it).

```tsx
<OTPInput length={6} aria-label="One-time code" className="grid grid-cols-6 gap-2" onComplete={verify} />
```

- Typing moves to the next box, Backspace to the one before, the arrows between them. The first box asks for `one-time-code`, so the code offered by the system fills them all.
- The boxes have the look of the form's `Input`, 48px high, the one in focus bordered in the accent's `brand`.
- `autoFocus` only where the code is the page's one question (a sign-in's second step).
