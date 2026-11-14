import { Button, Field, Hint, Input } from 'ioiti-ui'
import { GitCompare } from 'lucide-react'

export default function HintDisabled() {
  return (
    <div className="flex max-w-sm flex-col items-start gap-5">
      {/* A disabled control takes no pointer and no focus: wrap gives the hint something to hang on. */}
      <Hint content="Choose two to four runs to compare them" wrap>
        <Button size="sm" leftIcon={<GitCompare />} disabled>
          Compare
        </Button>
      </Hint>
      <Field label="Currency" className="w-full">
        <Hint content="Set by the customer’s contract" wrap className="flex w-full">
          <Input defaultValue="EUR" disabled />
        </Hint>
      </Field>
    </div>
  )
}
