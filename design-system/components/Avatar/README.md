# Avatar

A person, as their picture or their initials, named for a screen reader; `AvatarGroup` overlaps several, each named in a hint and the rest said as +N.

**You provide** `name`, `src` (optional picture), `size` (`xs` · `sm` · `md` · `lg`), `hint`; for `AvatarGroup`, `label`, `people` (`[{ name, src? }]`), `max`.

```tsx
<AvatarGroup label="Who works on the order" max={3} people={team} />
```

- Initials sit on a quiet fill; their colour never codes anything.
