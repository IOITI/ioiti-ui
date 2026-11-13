import { Skeleton, SkeletonAvatar, SkeletonText } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-wrap items-start gap-6 p-5">
    <Skeleton className="h-[7.5rem] w-full max-w-xs rounded-2xl" />
    <div className="flex w-72 items-start gap-3">
      <SkeletonAvatar />
      <div className="flex-1">
        <SkeletonText lines={3} />
      </div>
    </div>
  </div>,
)
