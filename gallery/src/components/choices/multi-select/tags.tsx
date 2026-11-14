import { Field, MultiSelect } from 'ioiti-ui'
import { useState } from 'react'

export default function MultiSelectTags() {
  const [options, setOptions] = useState([
    { value: 'urgent', label: 'urgent' },
    { value: 'gift', label: 'gift' },
    { value: 'fragile', label: 'fragile' },
  ])
  return (
    <div className="w-full max-w-md">
      <Field label="Tags" htmlFor="multi-tags">
        <MultiSelect
          id="multi-tags"
          options={options}
          defaultValue={['urgent']}
          placeholder="Add a tag"
          onCreateOption={(text) => {
            // What is typed becomes an option, and its value is ticked.
            const tag = text.trim().toLowerCase()
            setOptions((now) => [...now, { value: tag, label: tag }])
            return tag
          }}
        />
      </Field>
    </div>
  )
}
