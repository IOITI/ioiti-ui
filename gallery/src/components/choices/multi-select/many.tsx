import { Field, MultiSelect } from 'ioiti-ui'
import { useState } from 'react'

import { CITIES } from '../../../samples/choices'

const MOST = 3

export default function MultiSelectMany() {
  const [cities, setCities] = useState<string[]>(['lyon', 'milan'])
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <Field label="Cities delivered to" htmlFor="multi-cities" description={`${cities.length} of ${MOST} at most`}>
        {/* Past its maximum, the cities not chosen wait, and the list says why. */}
        <MultiSelect
          id="multi-cities"
          options={CITIES}
          value={cities}
          onChange={setCities}
          max={MOST}
          placeholder="Find a city"
          emptyText="No city of that name"
        />
      </Field>
    </div>
  )
}
