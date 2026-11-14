import { Loader } from 'ioiti-ui'

export default function LoaderVariants() {
  return (
    <div className="flex flex-wrap items-end gap-10">
      {(['arc', 'dots', 'line', 'rings'] as const).map((variant) => (
        <figure key={variant} className="flex flex-col items-center gap-3">
          <Loader variant={variant} label="Loading the orders" />
          <figcaption className="font-mono text-xs text-muted-foreground">{variant}</figcaption>
        </figure>
      ))}
    </div>
  )
}
