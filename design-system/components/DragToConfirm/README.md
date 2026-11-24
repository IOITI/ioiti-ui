# DragToConfirm

The slide on its own: an action confirmed by dragging the thumb to the end of its track, or by Enter once it has the focus.

**You provide** `label` (`Slide to confirm` by default, in IoitiProvider's language), `confirmedLabel`, `onConfirm`; `tone` (a `StatusTone`: `neutral` · `info` · `success` · `warning` · `danger`; formerly `variant`, whose `default` is `neutral`), or `actionType` (`delete` · `archive` · `confirm` · `submit` · `unlock` · `continue`), which picks the thumb's icon and, without a `tone`, the tone; `size` (`sm` 40px · `md` 48px · `lg` 56px); `autoResetDelay` (2500 ms; `0` keeps it confirmed) with `onReset`, `isConfirmed`, `icon` / `confirmedIcon`, `disabled`, `haptic`.

```tsx
<DragToConfirm label="Slide to send" confirmedLabel="Sent" tone="info" autoResetDelay={2500} />
```

- In a dialog, use `ConfirmAction`, which puts it under what will happen. A plain, quick action is a `Button`.
- Enter or Space confirms once the thumb has the focus; the arrow keys do not. Let go before the end (85% of the track), the thumb goes back.
- Its tones are the design's (the recipes' `negative` for danger, `warning`, `info`, `positive` for success) over a neutral track; neutral is grey on its way, `positive` once confirmed. It is at most `max-w-sm` wide.
