import { Field, Select } from 'ioiti-ui'
import { useState } from 'react'

const WAREHOUSES: Record<string, string> = {
  lyon: 'Lyon',
  lille: 'Lille',
  berlin: 'Berlin',
  hamburg: 'Hamburg',
  milan: 'Milan',
}

export default function SelectGroups() {
  const [warehouse, setWarehouse] = useState('lille')
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Field label="Warehouse">
        <Select value={warehouse} onChange={(event) => setWarehouse(event.target.value)}>
          <optgroup label="France">
            <option value="lyon">Lyon</option>
            <option value="lille">Lille</option>
          </optgroup>
          <optgroup label="Germany">
            <option value="berlin">Berlin</option>
            <option value="hamburg">Hamburg</option>
          </optgroup>
          <optgroup label="Italy">
            <option value="milan">Milan</option>
          </optgroup>
        </Select>
      </Field>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Shipped from {WAREHOUSES[warehouse]} ({warehouse}).
      </p>
    </div>
  )
}
