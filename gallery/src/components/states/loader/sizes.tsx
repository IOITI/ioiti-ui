import { Loader } from 'ioiti-ui'

export default function LoaderSizes() {
  return (
    <div className="flex flex-col gap-6">
      {(['arc', 'dots'] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-8">
          {[16, 24, 32, 48].map((size) => (
            <figure key={size} className="flex flex-col items-center gap-2">
              <Loader variant={variant} size={size} label="Loading" />
              <figcaption className="font-mono text-xs text-muted-foreground">{size}</figcaption>
            </figure>
          ))}
        </div>
      ))}
    </div>
  )
}
