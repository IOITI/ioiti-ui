import { Loader } from 'ioiti-ui'

export default function LoaderColours() {
  return (
    <div className="flex flex-wrap items-center gap-10">
      {/* A token, which has its value in both themes. */}
      <Loader color="var(--muted-foreground)" label="Loading the history" />
      <Loader variant="dots" color="var(--positive)" label="Confirming the payment" />
      <Loader variant="rings" color="var(--info)" label="Waiting for the carrier" />
      {/* Still: it only fades, whatever the system asks. */}
      <Loader reduceMotion label="Loading, without movement" />
    </div>
  )
}
