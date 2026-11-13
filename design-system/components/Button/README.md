# Button

An action: primary for the one thing a page or a dialog is for, outline and ghost for the others, destructive for what removes.

**You provide** the words as `children`, `onClick`; `variant` (`primary` · `secondary` · `outline` · `ghost` · `destructive` · `success` · `link`), `size` (`xs` 24px · `sm` 32px · `md` 40px · `lg` 48px · `icon`), `leftIcon` / `rightIcon` (a lucide icon, sized to the words), `isLoading` with `loadingText`, `disabled`, `fullWidth`.

```tsx
<Button leftIcon={<Plus />}>New order</Button>
<Button variant="outline" isLoading loadingText="Saving">Save</Button>
```

- One primary button per page or dialog. Its fill is `primary` (ink), the accent's `brand` where one is chosen, Bloom's gradient for Bloom.
- What leads somewhere is a link drawn as a button (`ButtonLink`, or `buttonClassName()` on a link), never a button that navigates.
- Its words say what it does ("Pause the imports"). An icon-only button is `size="icon"` with an `aria-label`, or an `IconButton`.
- `xs` sits on a line of text or a table's row; `sm` beside a section's heading; `md` on its own.
