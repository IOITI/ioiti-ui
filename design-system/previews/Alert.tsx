import { Alert, AlertDescription, AlertTitle, Button } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col items-stretch gap-3 p-5">
    <Alert tone="info">
      <AlertDescription>Prices are updated every night at 02:00.</AlertDescription>
    </Alert>
    <Alert tone="success">
      <AlertTitle>Import finished</AlertTitle>
      <AlertDescription>1,204 products, 12 new.</AlertDescription>
    </Alert>
    <Alert tone="warning" action={<Button size="sm" variant="outline">Review</Button>}>
      <AlertTitle>Three orders wait for a review</AlertTitle>
      <AlertDescription>They are held until someone looks at them.</AlertDescription>
    </Alert>
    <Alert tone="danger" dismissible>
      <AlertTitle>Could not load</AlertTitle>
      <AlertDescription>The server answered 503. The page tries again in a minute.</AlertDescription>
    </Alert>
  </div>,
)
