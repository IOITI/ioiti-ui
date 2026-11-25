import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { fr } from '../locales/fr.js'
import { Field } from './Field.js'
import { InlineEdit } from './InlineEdit.js'
import { IoitiProvider } from './IoitiProvider.js'
import { MultiSelect } from './MultiSelect.js'
import { NumberInput } from './NumberInput.js'
import { SegmentedControl } from './SegmentedControl.js'
import { RangeSlider, Slider } from './Slider.js'
import { TimeRangePicker } from './TimeRangePicker.js'
import { Combobox } from './ui/combobox.js'
import { DatePicker, DateRangePicker } from './ui/date-picker.js'
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage, RadioGroup, Switch } from './ui/form.js'
import { OTPInput } from './ui/otp-input.js'
import { SelectMenu } from './ui/spring-select.js'
import { StretchSwitch } from './ui/stretch-switch.js'

// Every control of the package wired by a Field as a native control is: named by its label, described by its
// description and its error, marked invalid by the error; and taking what a native control takes (an id, a ref, a
// name a form sends its value under, `data-*` attributes).

const DESCRIPTION = 'Asked by the carrier'
const ERROR = 'Choose one'
const COUNTRIES = [
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
]
const CITIES = [
  { value: 'lyon', label: 'Lyon' },
  { value: 'paris', label: 'Paris' },
  { value: 'rome', label: 'Rome' },
]
const PLANS = [
  { value: 'free', label: 'Free' },
  { value: 'team', label: 'Team' },
]
const PERIODS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
]
const NOV = new Date(2026, 10, 24)

/** A control in a Field with a label, a description and an error. */
function inField(label: string, control: ReactElement) {
  return render(
    <Field label={label} description={DESCRIPTION} error={ERROR}>
      {control}
    </Field>,
  )
}

/** What a form around a control sends: its values under a name. */
function sent(control: ReactElement, name: string) {
  render(<form aria-label="Sent">{control}</form>)
  return new FormData(screen.getByRole('form', { name: 'Sent' }) as HTMLFormElement).getAll(name)
}

describe('a control in a Field', () => {
  // Each control, what it is found as, and its focusable element (its role and name in a Field labelled so).
  const CASES: {
    what: string
    label: string
    control: ReactElement
    role: string
    name?: string | RegExp
    /** What is marked invalid, where it is not the element named: each box of a code. */
    marked?: (found: HTMLElement) => HTMLElement[]
  }[] = [
    { what: 'NumberInput', label: 'Seats', control: <NumberInput defaultValue={2} />, role: 'spinbutton' },
    { what: 'Combobox', label: 'Country', control: <Combobox options={COUNTRIES} />, role: 'combobox' },
    { what: 'MultiSelect', label: 'Cities', control: <MultiSelect options={CITIES} defaultValue={['lyon']} />, role: 'combobox' },
    { what: 'SelectMenu', label: 'Carrier', control: <SelectMenu options={COUNTRIES} />, role: 'combobox' },
    { what: 'Switch', label: 'Weekly summary', control: <Switch />, role: 'switch' },
    { what: 'RadioGroup', label: 'Plan', control: <RadioGroup name="plan" options={PLANS} />, role: 'radiogroup' },
    { what: 'Slider', label: 'Risk per trade', control: <Slider defaultValue={30} />, role: 'slider' },
    { what: 'RangeSlider', label: 'Price', control: <RangeSlider defaultValue={[20, 80]} />, role: 'slider', name: 'Price, from' },
    { what: 'SegmentedControl', label: 'Period', control: <SegmentedControl options={PERIODS} />, role: 'radiogroup' },
    { what: 'DatePicker', label: 'Delivery', control: <DatePicker defaultMonth={NOV} />, role: 'button' },
    { what: 'DateRangePicker', label: 'Holidays', control: <DateRangePicker defaultMonth={NOV} />, role: 'button' },
    { what: 'OTPInput', label: 'Code', control: <OTPInput />, role: 'group', marked: (found) => within(found).getAllByRole('textbox') },
    {
      what: 'InlineEdit',
      label: 'Name of the run',
      control: <InlineEdit value="Spring catalogue" onSave={() => {}} />,
      role: 'button',
      name: 'Spring catalogue, edit the name of the run',
    },
    { what: 'TimeRangePicker', label: 'Period of the logs', control: <TimeRangePicker />, role: 'group' },
  ]

  it.each(CASES)('names, describes and marks a $what', async ({ label, control, role, name, marked }) => {
    const { container } = inField(label, control)
    const found = await screen.findByRole(role, { name: name ?? label })
    expect(found).toHaveAccessibleDescription(`${DESCRIPTION} ${ERROR}`)
    for (const each of marked?.(found) ?? [found]) expect(each).toHaveAttribute('aria-invalid', 'true')
    await expectAccessible(container)
  })

  it('names the parts of a group as before, and passes none of them the clicks of the label', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Field label="Plan">
          <RadioGroup name="plan" options={PLANS} />
        </Field>
        <Field label="Period">
          <SegmentedControl options={PERIODS} defaultValue="week" />
        </Field>
        <Field label="Cities">
          <MultiSelect options={CITIES} defaultValue={['lyon', 'paris']} />
        </Field>
      </>,
    )

    // Its first radio, its first segment named by their own words alone.
    expect(screen.getByRole('radio', { name: 'Free' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Day' })).toBeInTheDocument()
    // The label points to the group, which no label can name, or to the field among the chips.
    expect(screen.getByText('Plan').closest('label')).toHaveAttribute('for', screen.getByRole('radiogroup', { name: 'Plan' }).id)
    expect(screen.getByText('Cities').closest('label')).toHaveAttribute('for', screen.getByRole('combobox', { name: 'Cities' }).id)

    await user.click(screen.getByText('Plan'))
    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked()
    await user.click(screen.getByText('Period'))
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked()
    // Its first chip stays: the label leads to the field typed into.
    await user.click(screen.getByText('Cities'))
    expect(screen.getByRole('button', { name: 'Remove Lyon' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Cities' })).toHaveFocus()
  })

  it('names the ends of a range, a group, after the words of its label, as they change', async () => {
    const { rerender } = render(
      <Field label="Price">
        <RangeSlider defaultValue={[20, 80]} />
      </Field>,
    )
    const price = screen.getByRole('group', { name: 'Price' })
    expect(within(price).getByRole('slider', { name: 'Price, from' })).toBeInTheDocument()
    expect(within(price).getByRole('slider', { name: 'Price, to' })).toBeInTheDocument()

    rerender(
      <Field label="Budget">
        <RangeSlider defaultValue={[20, 80]} />
      </Field>,
    )
    expect(await screen.findByRole('slider', { name: 'Budget, from' })).toBeInTheDocument()
  })

  it('names an InlineEdit’s field, once edited, by its label', async () => {
    const user = userEvent.setup()
    const { container } = inField('Name of the run', <InlineEdit value="Spring catalogue" onSave={() => {}} />)
    await user.click(screen.getByRole('button', { name: /Spring catalogue/ }))
    const field = screen.getByRole('textbox', { name: 'Name of the run' })
    expect(field).toHaveAccessibleDescription(`${DESCRIPTION} ${ERROR}`)
    expect(field).toHaveAttribute('aria-invalid', 'true')
    await expectAccessible(container)
  })

  it('names a Slider’s field beside it by its label, and gives it none of the slider’s id', async () => {
    const { container } = render(
      <FormItem>
        <FormLabel>Delay</FormLabel>
        <Slider defaultValue={30} max={120} showInput />
        <FormMessage error="Two minutes at most" />
      </FormItem>,
    )
    const slider = screen.getByRole('slider', { name: 'Delay' })
    const typed = screen.getByRole('spinbutton', { name: 'Delay' })
    expect(typed.id).not.toBe(slider.id)
    expect(slider).toHaveAccessibleDescription('Two minutes at most')
    expect(typed).toHaveAccessibleDescription('Two minutes at most')
    expect(typed).toHaveAttribute('aria-invalid', 'true')
    await expectAccessible(container)
  })

  it('keeps a name of its own over the label of its Field', () => {
    render(
      <Field label="Settings">
        <SegmentedControl aria-label="Period" options={PERIODS} />
      </Field>,
    )
    expect(screen.getByRole('radiogroup', { name: 'Period' })).toBeInTheDocument()
  })
})

describe('a control in a FormItem', () => {
  it('is named by its FormLabel, a group too, and described by its description and its message', async () => {
    const { container } = render(
      <>
        <FormItem>
          <FormLabel required>Plan</FormLabel>
          <FormControl>
            <RadioGroup name="plan" options={PLANS} />
          </FormControl>
          <FormDescription>Billed every month</FormDescription>
          <FormMessage error="Choose a plan" />
        </FormItem>
        <FormItem>
          <FormLabel>Period</FormLabel>
          <SegmentedControl options={PERIODS} />
          <FormDescription>Of the chart</FormDescription>
        </FormItem>
        <FormItem>
          <FormLabel>Code</FormLabel>
          <OTPInput />
        </FormItem>
      </>,
    )

    // Named without its star, drawn for the eye.
    const plan = screen.getByRole('radiogroup', { name: 'Plan' })
    expect(plan).toHaveAccessibleDescription('Billed every month Choose a plan')
    expect(plan).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Plan').closest('label')).toHaveAttribute('for', plan.id)
    expect(screen.getByRole('radiogroup', { name: 'Period' })).toHaveAccessibleDescription('Of the chart')
    // Its first box takes the item's id, which its label leads to.
    const code = screen.getByRole('group', { name: 'Code' })
    expect(screen.getByText('Code').closest('label')).toHaveAttribute('for', within(code).getAllByRole('textbox')[0].id)
    await expectAccessible(container)
  })
})

describe('a control’s id and ref', () => {
  it('lands on its focusable element: a field, a trigger, the first box or thumb, a group', async () => {
    const user = userEvent.setup()
    const refs = {
      number: createRef<HTMLInputElement>(),
      combobox: createRef<HTMLButtonElement>(),
      multi: createRef<HTMLInputElement>(),
      menu: createRef<HTMLButtonElement>(),
      radios: createRef<HTMLDivElement>(),
      slider: createRef<HTMLInputElement>(),
      range: createRef<HTMLInputElement>(),
      segments: createRef<HTMLDivElement>(),
      date: createRef<HTMLButtonElement>(),
      dates: createRef<HTMLButtonElement>(),
      code: createRef<HTMLInputElement>(),
      edit: createRef<HTMLElement>(),
      time: createRef<HTMLDivElement>(),
    }
    render(
      <>
        <NumberInput id="seats" label="Seats" ref={refs.number} />
        <Combobox id="country" aria-label="Country" options={COUNTRIES} ref={refs.combobox} />
        <MultiSelect id="cities" label="Cities" options={CITIES} ref={refs.multi} />
        <SelectMenu id="carrier" aria-label="Carrier" options={COUNTRIES} ref={refs.menu} />
        <RadioGroup id="plan" name="plan" aria-label="Plan" options={PLANS} ref={refs.radios} />
        <Slider id="risk" label="Risk" ref={refs.slider} />
        <RangeSlider id="price" label="Price" ref={refs.range} />
        <SegmentedControl id="period" label="Period" options={PERIODS} ref={refs.segments} />
        <DatePicker id="delivery" aria-label="Delivery" ref={refs.date} />
        <DateRangePicker id="holidays" aria-label="Holidays" ref={refs.dates} />
        <OTPInput id="code" ref={refs.code} />
        <InlineEdit id="run" label="Name of the run" value="Spring catalogue" onSave={() => {}} ref={refs.edit} />
        <TimeRangePicker id="logs" aria-label="Period of the logs" ref={refs.time} />
      </>,
    )

    const found: [HTMLElement | null, HTMLElement, string][] = [
      [refs.number.current, screen.getByRole('spinbutton', { name: 'Seats' }), 'seats'],
      [refs.combobox.current, screen.getByRole('combobox', { name: 'Country' }), 'country'],
      [refs.multi.current, screen.getByRole('combobox', { name: 'Cities' }), 'cities'],
      [refs.menu.current, screen.getByRole('combobox', { name: 'Carrier' }), 'carrier'],
      [refs.radios.current, screen.getByRole('radiogroup', { name: 'Plan' }), 'plan'],
      [refs.slider.current, screen.getByRole('slider', { name: 'Risk' }), 'risk'],
      [refs.range.current, screen.getByRole('slider', { name: 'Price, from' }), 'price'],
      [refs.segments.current, screen.getByRole('radiogroup', { name: 'Period' }), 'period'],
      [refs.date.current, screen.getByRole('button', { name: 'Delivery' }), 'delivery'],
      [refs.dates.current, screen.getByRole('button', { name: 'Holidays' }), 'holidays'],
      [refs.code.current, screen.getByRole('textbox', { name: 'Digit 1 of 6' }), 'code'],
      [refs.edit.current, screen.getByRole('button', { name: /Spring catalogue/ }), 'run'],
      [refs.time.current, screen.getByRole('group', { name: 'Period of the logs' }), 'logs'],
    ]
    for (const [ref, element, id] of found) {
      expect(ref).toBe(element)
      expect(element).toHaveAttribute('id', id)
    }

    // An InlineEdit's ref and id follow its control: the field, once edited.
    await user.click(screen.getByRole('button', { name: /Spring catalogue/ }))
    const field = screen.getByRole('textbox', { name: 'Name of the run' })
    expect(refs.edit.current).toBe(field)
    expect(field).toHaveAttribute('id', 'run')
  })
})

describe('a control in a form', () => {
  it('sends a number as code writes it, whatever the locale shows', () => {
    const values = sent(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <NumberInput label="Prix" name="price" defaultValue={1234.5} />
      </IoitiProvider>,
      'price',
    )
    expect(screen.getByRole('spinbutton', { name: 'Prix' })).toHaveValue('1234,5')
    expect(values).toEqual(['1234.5'])
  })

  it('sends the value chosen, empty while none is (a list of choices)', () => {
    expect(sent(<Combobox aria-label="Country" name="country" options={COUNTRIES} defaultValue="de" />, 'country')).toEqual(['de'])
  })

  it('sends a value for each chosen, none while nothing is', () => {
    expect(sent(<MultiSelect label="Cities" name="cities" options={CITIES} defaultValue={['rome', 'lyon']} />, 'cities')).toEqual([
      'rome',
      'lyon',
    ])
  })

  it('sends the radio chosen, as a radio does', () => {
    expect(sent(<RadioGroup aria-label="Plan" name="plan" options={PLANS} defaultValue="team" />, 'plan')).toEqual(['team'])
  })

  it('sends a slider’s value, and a range’s two in order', () => {
    expect(sent(<Slider label="Risk" name="risk" defaultValue={2.5} max={5} step={0.5} />, 'risk')).toEqual(['2.5'])
  })

  it('sends both ends of a range, the lower first', () => {
    expect(sent(<RangeSlider label="Price" name="price" defaultValue={[20, 80]} />, 'price')).toEqual(['20', '80'])
  })

  it('sends the segment chosen, nothing while none is', () => {
    expect(sent(<SegmentedControl label="Period" name="period" options={PERIODS} defaultValue="week" />, 'period')).toEqual(['week'])
  })

  it('sends nothing for a segment none chose', () => {
    expect(sent(<SegmentedControl label="Period" name="period" options={PERIODS} />, 'period')).toEqual([])
  })

  it('sends a day as a date field does, and a range’s first and last', () => {
    expect(sent(<DatePicker aria-label="Delivery" name="delivery" defaultValue={NOV} />, 'delivery')).toEqual(['2026-11-24'])
  })

  it('sends a range of days, its end empty while not chosen', () => {
    expect(
      sent(<DateRangePicker aria-label="Holidays" name="holidays" defaultValue={{ from: new Date(2026, 10, 2), to: null }} />, 'holidays'),
    ).toEqual(['2026-11-02', ''])
  })

  it('sends a code’s digits', () => {
    expect(sent(<OTPInput name="code" defaultValue="123456" />, 'code')).toEqual(['123456'])
  })

  it('sends the value saved of an InlineEdit', () => {
    expect(sent(<InlineEdit label="Name of the run" name="run" value="Spring catalogue" onSave={() => {}} />, 'run')).toEqual([
      'Spring catalogue',
    ])
  })

  it('sends a time range’s start, then its end, as written', () => {
    expect(sent(<TimeRangePicker aria-label="Period of the logs" name="logs" defaultValue={{ from: 'now-1h', to: 'now' }} />, 'logs')).toEqual([
      'now-1h',
      'now',
    ])
  })

  it('sends nothing of a control without a name', () => {
    render(
      <form aria-label="Sent">
        <NumberInput label="Seats" defaultValue={2} />
        <Combobox aria-label="Country" options={COUNTRIES} defaultValue="fr" />
        <MultiSelect label="Cities" options={CITIES} defaultValue={['lyon']} />
        <SegmentedControl label="Period" options={PERIODS} defaultValue="day" />
        <DatePicker aria-label="Delivery" defaultValue={NOV} />
        <OTPInput defaultValue="123456" />
        <InlineEdit label="Name of the run" value="Spring catalogue" onSave={() => {}} />
        <TimeRangePicker aria-label="Period of the logs" />
      </form>,
    )
    expect([...new FormData(screen.getByRole('form', { name: 'Sent' }) as HTMLFormElement).keys()]).toEqual([])
  })
})

describe('a control’s data attributes', () => {
  it('are drawn on its outermost element, with its class', () => {
    // StretchSwitch, deprecated, says so once: not this test's matter.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container } = render(
      <>
        <NumberInput label="Seats" data-testid="number" className="number" />
        <Combobox aria-label="Country" options={COUNTRIES} data-testid="combobox" className="combobox" />
        <MultiSelect label="Cities" options={CITIES} data-testid="multi" className="multi" />
        <SelectMenu aria-label="Carrier" options={COUNTRIES} data-testid="menu" className="menu" />
        <Switch aria-label="Weekly summary" data-testid="switch" className="switch" />
        <StretchSwitch aria-label="Notify the customer" data-testid="stretch" className="stretch" />
        <RadioGroup aria-label="Plan" name="plan" options={PLANS} data-testid="radios" className="radios" />
        <Slider label="Risk" data-testid="slider" className="slider" />
        <RangeSlider label="Price" data-testid="range" className="range" />
        <SegmentedControl label="Period" options={PERIODS} data-testid="segments" className="segments" />
        <DatePicker aria-label="Delivery" data-testid="date" className="date" />
        <DateRangePicker aria-label="Holidays" data-testid="dates" className="dates" />
        <OTPInput data-testid="code" className="code" />
        <InlineEdit label="Name of the run" value="Spring catalogue" onSave={() => {}} data-testid="edit" className="edit" />
        <TimeRangePicker aria-label="Period of the logs" data-testid="time" className="time" />
      </>,
    )
    warn.mockRestore()
    for (const name of ['number', 'combobox', 'multi', 'menu', 'switch', 'stretch', 'radios', 'slider', 'range', 'segments', 'date', 'dates', 'code', 'edit', 'time']) {
      const element = screen.getByTestId(name)
      expect(element).toHaveClass(name)
      expect(element.parentElement).toBe(container)
    }
  })
})
