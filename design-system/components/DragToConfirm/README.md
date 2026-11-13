# DragToConfirm

The slide on its own: an action confirmed by dragging the thumb to the end of its track, or by Enter once it has the focus.

**You provide** `label` (`Slide to confirm` by default), `confirmedLabel`, `onConfirm`; `variant` (`default` · `danger` · `warning` · `info` · `success`), or `actionType` (`delete` · `archive` · `confirm` · `submit` · `unlock` · `continue`), which picks the thumb's icon and, without a `variant`, the tone; `size` (`sm` 40px · `md` 48px · `lg` 56px); `autoResetDelay` (2500 ms; `0` keeps it confirmed) with `onReset`, `isConfirmed`, `icon` / `confirmedIcon`, `disabled`, `haptic`.

```tsx
<DragToConfirm label="Slide to send" confirmedLabel="Sent" variant="info" autoResetDelay={2500} />
```

- In a dialog, use `ConfirmAction`, which puts it under what will happen. A plain, quick action is a `Button`.
- Enter or Space confirms once the thumb has the focus; the arrow keys do not. Let go before the end (85% of the track), the thumb goes back.
- Its tones are Tailwind's rose, amber, blue and emerald over a neutral track, not the design's tokens. It is at most `max-w-sm` wide.
