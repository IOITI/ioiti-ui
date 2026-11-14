import { Field, MultiSelect } from 'ioiti-ui'
import { useState } from 'react'

import { CITIES } from '../../../samples/choices'

const MOST = 3

export default function MultiSelectMany() {
  const [cities, setCities] = useState<string[]>(['lyon', 'milan'])
  const [refused, setRefused] = useState(false)
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <Field
        label="Cities delivered to"
        htmlFor="multi-cities"
        description={`${cities.length} of ${MOST} at most`}
        error={refused ? 'Three cities at most: remove one to add another' : undefined}
      >
        <MultiSelect
          id="multi-cities"
          options={CITIES}
          value={cities}
          onChange={(next) => {
            // The page keeps to three: a fourth is refused, and said.
            setRefused(next.length > MOST)
            if (next.length <= MOST) setCities(next)
          }}
          error={refused}
          placeholder="Find a city"
          emptyText="No city of that name"
        />
      </Field>
    </div>
  )
}
