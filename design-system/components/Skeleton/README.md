# Skeleton

The shape of what is coming, as high as it will be, so nothing jumps when it arrives: `Skeleton`, `SkeletonText`, `SkeletonAvatar`, and `SkeletonReveal` to fade the content in.

**You provide** a `className` with the size and radius of what is coming (`h-[7.5rem] rounded-2xl` for a tile); `lines` for text; `size` for an avatar.

```tsx
<SkeletonReveal loading={isPending} skeleton={<SkeletonText lines={2} />}>…</SkeletonReveal>
```

- A page's loading state is `QueryState` with a skeleton of its blocks; never a spinner over a whole page.
