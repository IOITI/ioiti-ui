import {
  ChangeList,
  DescriptionList,
  Disclosure,
  Field,
  formatMoney,
  InlineEdit,
  MultiSelect,
  NumberInput,
  PageHeader,
  Panel,
  SaveBar,
  SegmentedControl,
  Slider,
  Switch,
  useToast,
} from 'ioiti-ui'
import type { Change } from 'ioiti-ui'
import { RouterLeaveGuard } from 'ioiti-ui/react-router'
import { useState } from 'react'

interface Settings {
  name: string
  dailyLimit: number | null
  freeDeliveryFrom: number
  deliveryDays: 'weekdays' | 'every-day'
  countries: string[]
  weeklySummary: boolean
}

const SAVED: Settings = {
  name: 'Atelier Brun',
  dailyLimit: 500,
  freeDeliveryFrom: 60,
  deliveryDays: 'weekdays',
  countries: ['fr', 'be'],
  weeklySummary: true,
}

const COUNTRIES = [
  { value: 'fr', label: 'France', group: 'Europe' },
  { value: 'be', label: 'Belgium', group: 'Europe' },
  { value: 'de', label: 'Germany', group: 'Europe' },
  { value: 'it', label: 'Italy', group: 'Europe' },
  { value: 'es', label: 'Spain', group: 'Europe' },
  { value: 'ch', label: 'Switzerland', group: 'Europe' },
  { value: 'ca', label: 'Canada', group: 'Elsewhere' },
  { value: 'jp', label: 'Japan', group: 'Elsewhere' },
]

const DAYS = { weekdays: 'Weekdays', 'every-day': 'Every day' }
const countryNames = (values: string[]) => values.map((value) => COUNTRIES.find((country) => country.value === value)?.label ?? value).join(', ')

/** What differs between what is saved and what is shown, as a list of changes. */
function changesOf(saved: Settings, draft: Settings): Change[] {
  const changes: Change[] = []
  if (saved.name !== draft.name) changes.push({ label: 'Name', before: saved.name, after: draft.name })
  if (saved.dailyLimit !== draft.dailyLimit)
    changes.push({
      label: 'Daily limit',
      before: saved.dailyLimit === null ? 'None' : formatMoney(saved.dailyLimit),
      after: draft.dailyLimit === null ? 'None' : formatMoney(draft.dailyLimit),
    })
  if (saved.freeDeliveryFrom !== draft.freeDeliveryFrom)
    changes.push({ label: 'Free delivery from', before: formatMoney(saved.freeDeliveryFrom), after: formatMoney(draft.freeDeliveryFrom) })
  if (saved.deliveryDays !== draft.deliveryDays) changes.push({ label: 'Delivery days', before: DAYS[saved.deliveryDays], after: DAYS[draft.deliveryDays] })
  if (countryNames(saved.countries) !== countryNames(draft.countries))
    changes.push({ label: 'Countries', before: countryNames(saved.countries) || 'None', after: countryNames(draft.countries) || 'None' })
  if (saved.weeklySummary !== draft.weeklySummary)
    changes.push({ label: 'Weekly summary', before: saved.weeklySummary ? 'On' : 'Off', after: draft.weeklySummary ? 'On' : 'Off' })
  return changes
}

/**
 * A page of settings: changed where they are, reviewed before they are saved, the bar of unsaved changes at
 * the bottom of the page, and leaving it asks first.
 */
export function SettingsPattern() {
  const toast = useToast()
  const [saved, setSaved] = useState(SAVED)
  const [draft, setDraft] = useState(SAVED)
  const [saving, setSaving] = useState(false)
  const changes = changesOf(saved, draft)
  const dirty = changes.length > 0
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setDraft((now) => ({ ...now, [key]: value }))

  const save = () => {
    setSaving(true)
    window.setTimeout(() => {
      setSaved(draft)
      setSaving(false)
      toast({ title: 'Settings saved', variant: 'success' })
    }, 800)
  }

  return (
    <>
      <PageHeader title="Settings" description="Changed where they are, reviewed before they are saved; leaving the page with changes not saved asks first." />

      <Panel title="The shop">
        <div className="flex flex-col gap-4">
          <InlineEdit
            label="Name of the shop"
            variant="title"
            value={draft.name}
            validate={(value) => (value.trim() ? undefined : 'A shop needs a name.')}
            onSave={(value) => set('name', value)}
          />
          <DescriptionList
            layout="grid"
            columns={3}
            items={[
              { term: 'Plan', details: 'Team, 10 users' },
              { term: 'Opened', details: '12 Mar 2024' },
              { term: 'Orders this year', details: '4,812' },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Orders and delivery">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Daily limit" htmlFor="settings-limit">
            <NumberInput id="settings-limit" value={draft.dailyLimit} onChange={(value) => set('dailyLimit', value)} min={0} step={50} suffix="€" />
          </Field>
          <Slider
            label="Free delivery from"
            value={draft.freeDeliveryFrom}
            onChange={(value) => set('freeDeliveryFrom', value)}
            min={0}
            max={150}
            step={5}
            format={(value) => formatMoney(value)}
            ticks={[
              { value: 0, label: '0 €' },
              { value: 75, label: '75 €' },
              { value: 150, label: '150 €' },
            ]}
          />
          <div className="flex flex-col gap-1">
            <span id="settings-days" className="text-xs text-text-secondary">
              Delivery days
            </span>
            <SegmentedControl
              labelledBy="settings-days"
              value={draft.deliveryDays}
              onChange={(value) => set('deliveryDays', value)}
              options={[
                { value: 'weekdays', label: 'Weekdays' },
                { value: 'every-day', label: 'Every day' },
              ]}
            />
          </div>
          <Field label="Countries delivered" htmlFor="settings-countries">
            <MultiSelect id="settings-countries" options={COUNTRIES} value={draft.countries} onChange={(value) => set('countries', value)} maxChips={4} />
          </Field>
          <Switch label="Weekly summary" description="Every Monday, by email" checked={draft.weeklySummary} onChange={(checked) => set('weeklySummary', checked)} />
        </div>
      </Panel>

      {dirty && (
        <Disclosure variant="boxed" summary={`What changes (${changes.length})`} defaultOpen>
          <ChangeList label="Changes to save" changes={changes} />
        </Disclosure>
      )}

      <SaveBar
        open={dirty}
        message={`${changes.length} unsaved change${changes.length === 1 ? '' : 's'}`}
        saving={saving}
        onDiscard={() => setDraft(saved)}
        onSave={save}
      />
      <RouterLeaveGuard when={dirty} />
    </>
  )
}
