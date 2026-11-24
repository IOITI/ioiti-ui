# Conventions

What a component's props are called, so that an application can guess them: one thing is said one way everywhere. A
name that breaks a convention is deprecated (`src/lib/deprecations.ts`) and keeps working until 1.0, which removes it.

## A value

- A control of the package holds its value as `value`, `defaultValue` and `onChange(value)`: held by the application
  when it gives `value`, its own otherwise (`defaultValue` the first), and `onChange` told of every change either way. A
  control of two states says `checked`, `defaultChecked` and `onChange(checked)`.
- A control built on a native element (`Input`, `Select`, `Textarea`, `Checkbox`) passes what the element passes:
  `onChange(event)`, as React does.
- A component holds a state through `useControllableState` (`src/lib/controllable.ts`), never by hand.

## Open and closed

- What opens (a dialog, a sheet, a menu, a popover, a palette, a panel): `open`, `defaultOpen` and `onOpenChange(open)`.
  A dialog's `onClose` is told too, when it closes.

## Busy

- `loading`: content that is not there yet (a table's rows, a palette's results); its place says so.
- `pending`: an action under way that the person started (a save, a send); the control that started it says so, and
  cannot be pressed again meanwhile.
- A query keeps its own word (`QueryState`'s `isPending`, as TanStack Query names it).

## Names

- `aria-*` as ARIA writes them: `aria-label`, never `ariaLabel`.
- What leads somewhere takes `href`, as a link does.
- A close button: `showCloseButton`.
- A denser layout: `density="compact"`.

## Heights

A control's `size`: `xs` 24 px, `sm` 32, `md` 40, `lg` 48, the same height wherever it is.

## Tones

Two vocabularies, drawn in the design's colours (`src/lib/recipes.ts`):

- `StatusTone`: `neutral`, `info`, `success`, `warning`, `danger`. A state, a status, the weight of a message or an
  action. A meter's tone is a status's, without `info`.
- `SignTone`: `positive`, `negative`, `neutral`. Which way a figure goes: a gain, a loss, neither.

Success and positive are drawn in the positive colours, danger and negative in the negative ones.

## Words

- A word the package says comes from its catalogue (`useMessages()`); a prop that gives a word (`label`, `title`,
  `placeholder`, a `…Label` or a `…Text`) wins over it, for that one use.
- A number, an amount, a percentage or a moment is written by the formats (`useFormat()`), in the application's locale.

## Deprecated

A name or a value that breaks a convention is deprecated: listed in `src/lib/deprecations.ts` with what replaces it,
typed `@deprecated` (the props tables mark it), said once in development when it is given (`deprecated(id)`), named in
the CHANGELOG's Deprecated section. It works until 1.0, which removes it.
