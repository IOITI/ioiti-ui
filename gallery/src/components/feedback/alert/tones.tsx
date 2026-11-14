import { Alert, AlertDescription, AlertTitle } from 'ioiti-ui'

export default function AlertTones() {
  return (
    <div className="flex flex-col gap-3">
      <Alert>
        <AlertTitle>Maintenance on Sunday</AlertTitle>
        <AlertDescription>The application is read-only from 06:00 to 07:00.</AlertDescription>
      </Alert>
      <Alert tone="info">
        <AlertDescription>Prices are updated every night at 02:00.</AlertDescription>
      </Alert>
      <Alert tone="success">
        <AlertTitle>Import finished</AlertTitle>
        <AlertDescription>1,204 products, 12 new.</AlertDescription>
      </Alert>
      <Alert tone="warning">
        <AlertTitle>Three orders wait for a review</AlertTitle>
        <AlertDescription>They are held until someone looks at them.</AlertDescription>
      </Alert>
      <Alert tone="danger">
        <AlertTitle>Could not load</AlertTitle>
        <AlertDescription>The server answered 503. The page tries again in a minute.</AlertDescription>
      </Alert>
    </div>
  )
}
