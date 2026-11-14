import { Avatar, Button, SkeletonAvatar, SkeletonReveal, SkeletonText } from 'ioiti-ui'
import { useState } from 'react'

export default function SkeletonLoaded() {
  const [loading, setLoading] = useState(true)
  return (
    <div className="max-w-sm space-y-3">
      <Button size="sm" variant="outline" onClick={() => setLoading((value) => !value)}>
        {loading ? 'Show what loaded' : 'Load again'}
      </Button>
      <SkeletonReveal
        loading={loading}
        skeleton={
          <div className="flex items-center gap-3">
            <SkeletonAvatar size={40} />
            <SkeletonText lines={2} className="flex-1" />
          </div>
        }
      >
        <div className="flex items-center gap-3">
          <Avatar name="Ana Martins" size="lg" />
          <div>
            <p className="text-sm font-medium">Ana Martins</p>
            <p className="text-xs text-muted-foreground">Ordered 3 items today</p>
          </div>
        </div>
      </SkeletonReveal>
    </div>
  )
}
