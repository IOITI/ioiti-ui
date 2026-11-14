import { Skeleton, SkeletonAvatar, SkeletonText } from 'ioiti-ui'

export default function SkeletonShapes() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <figure className="space-y-2">
        {/* A tile's size and radius: as high as the tile to come. */}
        <Skeleton className="h-[7.5rem] w-full rounded-2xl" />
        <figcaption className="text-xs text-muted-foreground">Skeleton, sized by its class</figcaption>
      </figure>
      <figure className="space-y-2">
        <SkeletonText />
        <SkeletonText lines={1} className="w-1/2" />
        <figcaption className="pt-1 text-xs text-muted-foreground">SkeletonText, 3 lines and 1</figcaption>
      </figure>
      <figure className="space-y-2">
        <div className="flex items-end gap-3">
          <SkeletonAvatar size={24} />
          <SkeletonAvatar />
          <SkeletonAvatar size={56} />
        </div>
        <figcaption className="text-xs text-muted-foreground">SkeletonAvatar, 24, 40 and 56 px</figcaption>
      </figure>
    </div>
  )
}
