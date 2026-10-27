import {
  AnimatedFileUpload,
  AutoRefresh,
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
  InlineEdit,
  Input,
  lastDays,
  MultiSelect,
  NumberInput,
  OTPInput,
  PageHeader,
  RadioGroup,
  RadioGroupItem,
  RangeSlider,
  SegmentedControl,
  Select,
  Slider,
  SpringSelect,
  StretchSwitch,
  Switch,
  Textarea,
  TimeRangePicker,
  formatDateTime,
  resolveTimeRange,
  useToast,
} from 'ioiti-ui'
import type { DateRange, RefreshSettings, TimeRange } from 'ioiti-ui'
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

const CUSTOMERS = [
  { value: 'brun', label: 'Atelier Brun', description: 'Lyon', group: 'Regulars' },
  { value: 'acme', label: 'Acme', description: 'Paris', group: 'Regulars' },
  { value: 'nord', label: 'Nord Logistique', description: 'Lille', group: 'Regulars' },
  { value: 'vega', label: 'Vega Studio', description: 'Berlin', group: 'New this month' },
  { value: 'lumen', label: 'Lumen & Co', description: 'Rome', group: 'New this month' },
  { value: 'old', label: 'Maison Ancienne', description: 'Closed', group: 'New this month', disabled: true },
]

/** Tags typed as they come: what is not in the list becomes one. */
function Tags() {
  const [options, setOptions] = useState([
    { value: 'urgent', label: 'urgent' },
    { value: 'gift', label: 'gift' },
    { value: 'fragile', label: 'fragile' },
  ])
  return (
    <Field label="Tags" htmlFor="order-tags">
      <MultiSelect
        id="order-tags"
        options={options}
        defaultValue={['urgent']}
        placeholder="Add a tag"
        onCreateOption={(text) => {
          setOptions((now) => [...now, { value: text, label: text }])
          return text
        }}
      />
    </Field>
  )
}

/** A name and a note edited where they are shown; a name already taken is refused. */
function Editable() {
  const [name, setName] = useState('Spring catalogue print run')
  const [note, setNote] = useState('Proofs approved by the client on 21 Oct.')
  return (
    <div className="flex w-full flex-col gap-2">
      <InlineEdit
        label="Name of the project"
        variant="title"
        value={name}
        validate={(value) => (value.trim() ? undefined : 'A project needs a name.')}
        onSave={async (value) => {
          await new Promise((resolve) => window.setTimeout(resolve, 600))
          if (value.trim().toLowerCase() === 'archive') return 'That name is taken.'
          setName(value)
        }}
      />
      <InlineEdit label="Note" value={note} onSave={setNote} placeholder="Add a note" />
    </div>
  )
}

/** A time range and what it stands for now; refreshed on a press or on a timer. */
function Times() {
  const toast = useToast()
  const [range, setRange] = useState<TimeRange>({ from: 'now-24h', to: 'now' })
  const [refresh, setRefresh] = useState<RefreshSettings>({ interval: 30_000, paused: true })
  const [loading, setLoading] = useState(false)
  const [standalone, setStandalone] = useState<RefreshSettings>({ interval: 60_000, paused: true })
  const resolved = resolveTimeRange(range)
  const load = () => {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 700)
  }
  return (
    <div className="flex w-full flex-col gap-4">
      <TimeRangePicker value={range} onChange={setRange} onRefresh={load} isLoading={loading} refresh={refresh} onRefreshChange={setRefresh} />
      <p className="text-xs text-muted-foreground">
        Now: from {formatDateTime(resolved.from?.toISOString(), 'Europe/Paris', false)} to {formatDateTime(resolved.to?.toISOString(), 'Europe/Paris', false)} (Paris
        time).
      </p>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        Alone, beside a page's title: <AutoRefresh value={standalone} onChange={setStandalone} onRefresh={() => toast({ title: 'Refreshed' })} />
      </div>
    </div>
  )
}

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
        id="inline-edit"
        title="InlineEdit"
        description="A value edited where it is shown: it reads as text, a click or Enter turns it into a field, Enter saves and Escape gives up. A save that takes its time shows it; one refused says why and keeps the field (try “archive”)."
        names={['InlineEdit']}
        className="block w-full max-w-xl"
      >
        <Editable />
      </Demo>

      <Demo
        id="multi-select"
        title="MultiSelect"
        description="Several values from a list, each a chip: typing filters the list, the arrows move, Enter ticks or unticks, Backspace in an empty field removes the last chip. Options in groups, with a second line; what is typed may become a value of its own, a tag."
        names={['MultiSelect']}
        className="grid w-full gap-4 sm:grid-cols-2"
      >
        <Field label="Customers" htmlFor="customers">
          <MultiSelect id="customers" options={CUSTOMERS} defaultValue={['brun', 'acme', 'vega']} maxChips={2} placeholder="Choose customers" />
        </Field>
        <Tags />
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
        id="slider"
        title="Slider and RangeSlider"
        description="A value along a scale, or a range between two: the browser's own range input, its arrows, Page Up and Down, Home and End, its value said in words. Ticks with their labels, bands in a tone where a value is safe or too far, a field beside it to type the value."
        names={['Slider', 'RangeSlider']}
        className="grid w-full gap-8 sm:grid-cols-2"
      >
        <Slider
          label="Risk per order"
          defaultValue={1.5}
          min={0}
          max={5}
          step={0.5}
          format={(value) => `${value.toFixed(1)}%`}
          ticks={[
            { value: 0, label: '0%' },
            { value: 2.5, label: '2.5%' },
            { value: 5, label: '5%' },
          ]}
          levels={[
            { from: 0, to: 2, tone: 'positive' },
            { from: 2, to: 3.5, tone: 'warning' },
            { from: 3.5, to: 5, tone: 'negative' },
          ]}
        />
        <Slider label="Delay before retrying" defaultValue={30} min={0} max={120} step={5} format={(value) => `${value} s`} showInput />
        <RangeSlider
          label="Price"
          defaultValue={[20, 80]}
          min={0}
          max={150}
          step={5}
          format={(value) => `${value} €`}
          ticks={[
            { value: 0, label: '0 €' },
            { value: 75, label: '75 €' },
            { value: 150, label: '150 €' },
          ]}
        />
        <RangeSlider label="Opening hours" defaultValue={[9, 18]} min={0} max={24} format={(value) => `${String(value).padStart(2, '0')}:00`} ticks />
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

      <Demo
        id="time-range"
        title="TimeRangePicker and AutoRefresh"
        description="A range of time as people say it, which stays true as time goes by: chosen in two clicks (quick select, the ranges commonly used, those recently used) or its ends set one by one (a moment, a time from now, now) and applied with Update. Refreshed by a press or on a timer, which waits while the page's tab is hidden."
        names={['TimeRangePicker', 'AutoRefresh']}
        className="block w-full max-w-2xl"
      >
        <Times />
      </Demo>

      <Demo id="otp" title="OTPInput" description="A one-time code: a password manager's or a phone's autofill fills every box, as a paste does." names={['OTPInput']}>
        <OTPInput length={6} aria-label="One-time code" className="grid grid-cols-6 gap-2" />
      </Demo>

      <Demo
        id="dates"
        title="Dates"
        description="A day, or a range, from a field or a calendar: weeks start on Monday, days are written as en-GB writes them. DateRangeFilter puts the ranges people ask for first: its own, or the page's, ending on the last day there is data for."
        names={['DatePicker', 'DateRangePicker', 'Calendar', 'DateRangeFilter']}
        className="flex flex-col items-start gap-4"
      >
        <div className="flex flex-wrap gap-3">
          <DatePicker value={day} onChange={setDay} locale="en-GB" weekStartsOn={1} />
          <DateRangePicker value={range} onChange={setRange} locale="en-GB" weekStartsOn={1} />
        </div>
        <DateRangeFilter value={range} onChange={setRange} />
        <DateRangeFilter
          value={range}
          onChange={setRange}
          allTime={false}
          today={new Date(2026, 9, 23)}
          maxDate={new Date(2026, 9, 23)}
          presets={[
            { label: 'Last week of data', days: 7 },
            { label: 'Third quarter', range: { from: new Date(2026, 6, 1), to: new Date(2026, 8, 30) } },
          ]}
        />
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
