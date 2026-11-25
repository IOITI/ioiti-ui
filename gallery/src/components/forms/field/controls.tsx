import {
  Combobox,
  DatePicker,
  DateRangePicker,
  Field,
  InlineEdit,
  Input,
  MultiSelect,
  NumberInput,
  OTPInput,
  RadioGroup,
  RangeSlider,
  SegmentedControl,
  Select,
  SelectMenu,
  Slider,
  Switch,
  Textarea,
  TimeRangePicker,
} from 'ioiti-ui'
import { Search } from 'lucide-react'
import { useState } from 'react'

const COUNTRIES = [
  { value: 'fr', label: 'France', description: 'Paris' },
  { value: 'de', label: 'Germany', description: 'Berlin' },
  { value: 'it', label: 'Italy', description: 'Rome' },
  { value: 'es', label: 'Spain', description: 'Madrid' },
  { value: 'pt', label: 'Portugal', description: 'Lisbon' },
]

const CARRIERS = [
  { value: 'post', label: 'Post', description: 'Three to five days' },
  { value: 'courier', label: 'Courier', description: 'Tomorrow, before noon' },
]

const CITIES = [
  { value: 'lyon', label: 'Lyon' },
  { value: 'paris', label: 'Paris' },
  { value: 'lille', label: 'Lille' },
  { value: 'nantes', label: 'Nantes' },
]

const PLANS = [
  { value: 'solo', label: 'Solo', description: 'One user' },
  { value: 'team', label: 'Team', description: 'Up to ten users' },
]

const PERIODS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

export default function FieldControls() {
  const [country, setCountry] = useState<string | null>('fr')
  const [run, setRun] = useState('Spring catalogue')
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Field label="Customer">
        <Input placeholder="Name or email" leftIcon={<Search className="size-3.5" />} />
      </Field>
      <Field label="Status">
        <Select
          options={[
            { value: 'open', label: 'Open' },
            { value: 'done', label: 'Done' },
          ]}
          defaultValue="open"
        />
      </Field>
      {/* A Combobox takes its label beside it: htmlFor, and its own id. */}
      <Field label="Country" htmlFor="field-country">
        <Combobox id="field-country" options={COUNTRIES} value={country} onChange={setCountry} placeholder="Choose a country" className="w-full" />
      </Field>
      <Field label="Timeout" description="How long a request may take before it is given up">
        <Input inputMode="numeric" defaultValue="250" suffix="ms" />
      </Field>
      <Field label="Seats">
        <NumberInput defaultValue={2} min={1} max={99} integer />
      </Field>
      <Field label="Carrier">
        <SelectMenu options={CARRIERS} defaultValue="post" />
      </Field>
      <Field label="Cities" description="Where the offer is sold" className="sm:col-span-2">
        <MultiSelect options={CITIES} defaultValue={['lyon', 'paris']} />
      </Field>
      <Field label="Delivery">
        <DatePicker className="w-full" />
      </Field>
      <Field label="Closed for the holidays">
        <DateRangePicker className="w-full" />
      </Field>
      {/* A group is named by its Field's label, which no radio, no segment takes. */}
      <Field label="Plan">
        <RadioGroup name="field-plan" options={PLANS} defaultValue="team" />
      </Field>
      <Field label="Chart by">
        <SegmentedControl options={PERIODS} defaultValue="week" />
      </Field>
      <Field label="Weekly summary" description="Every Monday, by email">
        <Switch defaultChecked />
      </Field>
      <Field label="Code" error="The six digits of the text message">
        <OTPInput defaultValue="1234" />
      </Field>
      <Field label="Risk per order">
        <Slider defaultValue={1.5} min={0} max={5} step={0.5} />
      </Field>
      <Field label="Price">
        <RangeSlider defaultValue={[20, 80]} />
      </Field>
      <Field label="Name of the run">
        <InlineEdit value={run} onSave={setRun} />
      </Field>
      <Field label="Period of the logs" className="sm:col-span-2">
        <TimeRangePicker />
      </Field>
      <Field label="Note" className="sm:col-span-2">
        <Textarea rows={3} placeholder="What the warehouse should know" />
      </Field>
    </div>
  )
}
