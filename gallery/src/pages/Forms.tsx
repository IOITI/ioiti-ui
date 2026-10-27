import {
  AnimatedFileUpload,
  Button,
  Calendar,
  Checkbox,
  Combobox,
  DatePicker,
  DateRangeFilter,
  DateRangePicker,
  Field,
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  lastDays,
  NumberInput,
  OTPInput,
  PageHeader,
  RadioGroup,
  RadioGroupItem,
  SegmentedControl,
  Select,
  SpringSelect,
  StretchSwitch,
  Switch,
  Textarea,
} from 'ioiti-ui'
import type { DateRange } from 'ioiti-ui'
import { ChartLine, LayoutGrid, Rows3, Search } from 'lucide-react'
import { useState } from 'react'

import { Demo } from '../parts'

const COUNTRIES = [
  { value: 'fr', label: 'France', description: 'Paris' },
  { value: 'de', label: 'Germany', description: 'Berlin' },
  { value: 'it', label: 'Italy', description: 'Rome' },
  { value: 'es', label: 'Spain', description: 'Madrid' },
  { value: 'pt', label: 'Portugal', description: 'Lisbon' },
]

/** An upload made up for the gallery: it counts to 100 and answers with a link. */
async function pretendUpload(_file: unknown, onProgress: (progress: number) => void) {
  for (let progress = 10; progress <= 100; progress += 15) {
    await new Promise((resolve) => window.setTimeout(resolve, 120))
    onProgress(Math.min(progress, 100))
  }
  return { href: '/components/data', label: 'Open' }
}

const TOPICS = ['Product updates', 'Newsletter', 'Beta features']

/** A box over a list of others: indeterminate while some of them are checked, as a table's header is. */
function CheckboxGroup() {
  const [chosen, setChosen] = useState<ReadonlySet<string>>(() => new Set(['Product updates']))
  const all = chosen.size === TOPICS.length
  const toggle = (topic: string) =>
    setChosen((prev) => {
      const next = new Set(prev)
      if (next.has(topic)) next.delete(topic)
      else next.add(topic)
      return next
    })
  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        label="Every email"
        checked={all}
        indeterminate={chosen.size > 0 && !all}
        onChange={() => setChosen(all ? new Set() : new Set(TOPICS))}
      />
      <div className="flex flex-col gap-3 pl-6.5">
        {TOPICS.map((topic) => (
          <Checkbox key={topic} label={topic} checked={chosen.has(topic)} onChange={() => toggle(topic)} />
        ))}
      </div>
    </div>
  )
}

export function Forms() {
  const [country, setCountry] = useState<string | null>('fr')
  const [range, setRange] = useState<DateRange>(lastDays(30))
  const [day, setDay] = useState<Date | null>(new Date())
  const [notify, setNotify] = useState(true)
  const [size, setSize] = useState('M')
  return (
    <>
      <PageHeader title="Forms" description="A label over each field, its hint under it, its error in the negative colour. Fields are 40 px high, their text 12 px, like the tables around them." />

      <Demo
        id="field"
        title="Field"
        description="The way the pages put a control under its label. A Combobox takes its label beside it (htmlFor): a label around it would pass the clicks of its options on to it."
        names={['Field', 'Input', 'Select', 'Textarea', 'Combobox']}
        className="grid w-full gap-4 sm:grid-cols-2"
      >
        <Field label="Customer">
          <Input placeholder="Name or email" leftIcon={<Search className="size-3.5" />} />
        </Field>
        <Field label="Quantity" error="A whole number, from 1 to 99">
          <Input type="number" defaultValue="0" error />
        </Field>
        <Field label="Status">
          <Select options={[{ value: 'open', label: 'Open' }, { value: 'done', label: 'Done' }]} defaultValue="open" />
        </Field>
        <Field label="Country" htmlFor="country">
          <Combobox id="country" options={COUNTRIES} value={country} onValueChange={setCountry} placeholder="Choose a country" className="w-full" />
        </Field>
        <Field label="Note" className="sm:col-span-2">
          <Textarea rows={3} placeholder="What the warehouse should know" />
        </Field>
      </Demo>

      <Demo
        id="form"
        title="Form"
        description="EasyUI's form parts: a labelled item, its description, its message; a check box, radio buttons, a switch."
        names={['Form', 'FormItem', 'FormLabel', 'FormControl', 'FormDescription', 'FormMessage', 'RadioGroup', 'RadioGroupItem', 'Switch']}
        className="block w-full max-w-md"
      >
        <Form onSubmit={(event) => event.preventDefault()}>
          <FormItem>
            <FormLabel htmlFor="email" required>
              Email
            </FormLabel>
            <FormControl>
              <Input id="email" type="email" defaultValue="ana@example" error />
            </FormControl>
            <FormMessage error="An address needs a domain: ana@example.com" />
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormControl>
              <Input id="password" type="password" showPasswordToggle defaultValue="correct horse" />
            </FormControl>
            <FormDescription>Twelve characters at least.</FormDescription>
          </FormItem>
          <Checkbox label="Keep me signed in" description="On this browser only" defaultChecked />
          <RadioGroup
            name="delivery"
            defaultValue="standard"
            options={[
              { value: 'standard', label: 'Standard', description: 'Three to five days' },
              { value: 'express', label: 'Express', description: 'Tomorrow' },
            ]}
          />
          <RadioGroup name="size" value={size} onChange={setSize} className="flex gap-4 space-y-0">
            {['S', 'M', 'L'].map((each) => (
              <RadioGroupItem key={each} name="size" value={each} checked={size === each} onChange={() => setSize(each)} label={`Size ${each}`} />
            ))}
          </RadioGroup>
          <Switch label="Weekly summary" description="Every Monday, by email" defaultChecked />
          <Button type="submit" fullWidth>
            Save
          </Button>
        </Form>
      </Demo>

      <Demo
        id="checkbox"
        title="Check box"
        description="EasyUI's draw-checkbox: its mark draws itself and the box settles with a small pop. Indeterminate while some of what it stands for is checked (a table's header); a description under its label; disabled. The boxes of the data table are the same."
        names={['Checkbox']}
        className="flex w-full flex-wrap gap-x-12 gap-y-6"
      >
        <CheckboxGroup />
        <div className="flex flex-col gap-3">
          <Checkbox label="Keep me signed in" description="On this browser only" defaultChecked />
          <Checkbox label="Share usage data" description="Turned off by the administrator" disabled />
          <Checkbox label="Archived" defaultChecked disabled />
        </div>
      </Demo>

      <Demo
        id="choices"
        title="Choices"
        description="A list that springs open, a switch that stretches as it moves."
        names={['SpringSelect', 'StretchSwitch']}
        className="grid w-full gap-6 sm:grid-cols-2"
      >
        <SpringSelect
          label="Plan"
          defaultValue="team"
          options={[
            { value: 'solo', label: 'Solo', description: 'One user' },
            { value: 'team', label: 'Team', description: 'Up to ten users' },
            { value: 'company', label: 'Company', description: 'Unlimited', disabled: true },
          ]}
        />
        <StretchSwitch checked={notify} onChange={setNotify} label="Notify the customer" description="An email when the order leaves" />
      </Demo>

      <Demo
        id="number"
        title="NumberInput"
        description="A number to type, or to change with the arrow keys (ten at a time with Shift) and the − and + buttons: a limit, a quantity, a delay with its unit. What is typed stays until it leaves the field; a comma or a point marks the decimals; it keeps to its bounds."
        names={['NumberInput']}
        className="grid w-full gap-4 sm:grid-cols-3"
      >
        <Field label="Daily limit" htmlFor="daily-limit">
          <NumberInput id="daily-limit" defaultValue={500} min={0} max={5000} step={50} suffix="€" />
        </Field>
        <Field label="Copies" htmlFor="copies">
          <NumberInput id="copies" defaultValue={2} min={1} max={20} integer />
        </Field>
        <Field label="Delay before retrying" htmlFor="retry-delay">
          <NumberInput id="retry-delay" defaultValue={1.5} min={0} step={0.5} precision={1} suffix="s" />
        </Field>
      </Demo>

      <Demo
        id="segmented"
        title="SegmentedControl"
        description="Two to five choices shown at once, the chosen one filled as a primary button is, the fill sliding to the next. The arrow keys move and choose; Tab leaves. As tabs, it switches panels."
        names={['SegmentedControl']}
        className="flex flex-col items-start gap-4"
      >
        <SegmentedControl
          label="Period"
          defaultValue="week"
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
        />
        <SegmentedControl
          label="View"
          size="sm"
          defaultValue="table"
          options={[
            { value: 'table', label: 'Table', icon: <Rows3 /> },
            { value: 'cards', label: 'Cards', icon: <LayoutGrid /> },
            { value: 'chart', label: 'Chart', icon: <ChartLine />, disabled: true },
          ]}
        />
        <SegmentedControl
          label="Channel"
          fullWidth
          defaultValue="all"
          className="max-w-sm"
          options={[
            { value: 'all', label: 'All' },
            { value: 'shop', label: 'Shop' },
            { value: 'phone', label: 'Phone' },
          ]}
        />
      </Demo>

      <Demo id="otp" title="OTPInput" description="A one-time code: a password manager's or a phone's autofill fills every box, as a paste does." names={['OTPInput']}>
        <OTPInput length={6} aria-label="One-time code" className="grid grid-cols-6 gap-2" />
      </Demo>

      <Demo
        id="dates"
        title="Dates"
        description="A day, or a range, from a field or a calendar: weeks start on Monday, days are written as en-GB writes them. DateRangeFilter puts the ranges people ask for first."
        names={['DatePicker', 'DateRangePicker', 'Calendar', 'DateRangeFilter']}
        className="flex flex-col items-start gap-4"
      >
        <div className="flex flex-wrap gap-3">
          <DatePicker value={day} onChange={setDay} locale="en-GB" weekStartsOn={1} />
          <DateRangePicker value={range} onChange={setRange} locale="en-GB" weekStartsOn={1} />
        </div>
        <DateRangeFilter value={range} onChange={setRange} />
        <Calendar mode="single" value={day} onChange={setDay} locale="en-GB" weekStartsOn={1} />
      </Demo>

      <Demo
        id="upload"
        title="AnimatedFileUpload"
        description="A drop zone: the files are handled one after the other here, each answered with a link to what it became."
        names={['AnimatedFileUpload']}
        className="block w-full"
      >
        <AnimatedFileUpload multiple sequential uploadHandler={pretendUpload} dropSubtitle="or choose files (made up: nothing leaves the page)" />
      </Demo>
    </>
  )
}
