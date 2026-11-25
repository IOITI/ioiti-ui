# DragToConfirm

The slide on its own: an action confirmed by dragging the thumb to the end of its track, or by Enter once it has the focus.

**You provide** `label` (`Slide to confirm` by default, in IoitiProvider's language), `confirmedLabel`, `onConfirm`; `tone` (a `StatusTone`: `neutral` · `info` · `success` · `warning` · `danger`), or `actionType` (`delete` · `archive` · `confirm` · `submit` · `unlock` · `continue`), which picks the thumb's icon and, without a `tone`, the tone; `size` (`sm` 40px · `md` 48px · `lg` 56px); `autoResetDelay` (2500 ms; `0` keeps it confirmed) with `onReset`, `isConfirmed`, `icon` / `confirmedIcon`, `disabled`, `haptic`.

```tsx
<DragToConfirm label="Slide to send" confirmedLabel="Sent" tone="info" autoResetDelay={2500} />
```

- In a dialog, use `ConfirmAction`, which puts it under what will happen. A plain, quick action is a `Button`.
- Let go before the end (85% of the track), the thumb goes back.
- Its tones are the design's (the recipes' `negative` for danger, `warning`, `info`, `positive` for success) over a neutral track; neutral is grey on its way, `positive` once confirmed. It is at most `max-w-sm` wide.

## Accessibility

Its thumb is a slider named by its `label`, that says how far it is dragged, then `confirmedLabel` once done; disabled, it is said so and is no stop of the keyboard. A button out of sight confirms too, for a screen reader's own way through the page.

| Key | What it does |
|---|---|
| Enter, Space | On the thumb: confirms, as the slide to the end does |
| ←, → | Nothing: on a slider they would mean a little further, never all the way |
