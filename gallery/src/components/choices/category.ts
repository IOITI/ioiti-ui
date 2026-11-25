import { ListChecks } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const choices: CategoryInfo = {
  slug: 'choices',
  label: 'Choices',
  icon: ListChecks,
  summary: 'What is chosen rather than typed: a box ticked, a setting turned, one of a few choices, several from a list, a value along a scale.',
  choose: {
    heading: 'Which one?',
    rows: [
      { family: 'checkbox', when: 'A box ticked, then saved or sent with its form.' },
      { family: 'switch', when: 'A setting that takes effect as it is turned.' },
      { family: 'radio-group', when: 'One of two to five choices shown at once, each with words of its own.' },
      { family: 'segmented-control', when: 'One of two to five short choices in a row: a period, a view of the same figures. Views of one thing, each a panel of its own, are [Tabs](/components/navigation/tabs).' },
      { family: 'select-menu', when: 'One value from a short list that opens under its button, an option with a second line. A list to search is a [Combobox](/components/forms/combobox); the system’s own list, a [Select](/components/forms/select).' },
      { family: 'multi-select', when: 'Several values from a list, typed to filter it, each a chip; a tag of one’s own.' },
      { family: 'slider', when: 'A value along a scale, or a range between two, where its place on the scale says more than its figure.' },
    ],
  },
  families: [
    {
      slug: 'checkbox',
      name: 'Checkbox',
      names: ['Checkbox'],
      keywords: ['tick', 'check', 'select all', 'indeterminate'],
      examples: [
        { id: 'select-all', title: 'Over a list of others', description: 'A box over others, indeterminate while some of them are ticked, as a table’s header is: a press ticks them all, or none.' },
        { id: 'descriptions', title: 'Described, or disabled', description: 'Its mark draws itself and the box settles with a small pop. A description under its label; disabled, it says why there.' },
        { id: 'required', title: 'Required, and not ticked', description: 'A box the form cannot be sent without: on submit, what is missing is said under it, in the negative colour.' },
      ],
    },
    {
      slug: 'switch',
      name: 'Switch',
      names: ['Switch'],
      keywords: ['toggle', 'on off', 'setting'],
      examples: [
        { id: 'settings', title: 'Settings that apply at once', description: 'A setting that takes effect when it is turned: its label says what is on, its description what it does. The page holds each value and says it.' },
        { id: 'disabled', title: 'Disabled', description: 'On or off, it cannot be turned: its description says why.' },
      ],
    },
    {
      slug: 'radio-group',
      name: 'RadioGroup',
      names: ['RadioGroup', 'RadioGroupItem'],
      keywords: ['radio', 'option', 'one of'],
      examples: [
        { id: 'described', title: 'Choices described', description: 'One of two to five choices that each need a sentence: options given as data, one of them disabled, the group named by its question (aria-labelledby); the page holds the value and says it.' },
        { id: 'items', title: 'Items laid out by hand', description: 'RadioGroupItem in a row, for short choices beside one another, the group named where no heading is (aria-label): the page says which one is checked.' },
      ],
    },
    {
      slug: 'segmented-control',
      name: 'SegmentedControl',
      names: ['SegmentedControl'],
      keywords: ['toggle group', 'button group', 'tabs', 'period'],
      examples: [
        { id: 'period', title: 'One of a few', description: 'Two to five choices shown at once, the chosen one filled as a primary button is, the fill sliding to the next. The arrow keys move and choose; Tab leaves.' },
        { id: 'sizes', title: 'Sizes and icons', description: 'md on its own, sm in a toolbar; an icon before each label; a choice not possible yet stays in the bar, faded.' },
        { id: 'full-width', title: 'As wide as its column', description: 'fullWidth shares the column between its segments: a phone’s form, a side panel.' },
        { id: 'tabs', title: 'As tabs, over a panel', description: 'role="tablist" switches the panel under it, each segment naming the panel it shows.' },
      ],
    },
    {
      slug: 'multi-select',
      name: 'MultiSelect',
      names: ['MultiSelect'],
      keywords: ['tags', 'chips', 'multiple', 'combo box'],
      examples: [
        { id: 'customers', title: 'Grouped, with a second line', description: 'Several values from a list, each a chip: typing filters the list, the arrows move, Enter ticks or unticks, Backspace in an empty field removes the last chip. Two chips shown, then “+N”.' },
        { id: 'tags', title: 'Tags typed as they come', description: 'What is typed and is not in the list becomes a value of its own, a tag.' },
        { id: 'many', title: 'A long list, three at most', description: 'Forty cities, found by typing; three at most (max): past it the others wait, and the list says why.' },
        { id: 'states', title: 'Disabled and wrong', description: 'Disabled, its chips stay readable and cannot be removed; wrong, its border is in the negative colour and its Field says why.' },
      ],
    },
    {
      slug: 'select-menu',
      name: 'SelectMenu',
      names: ['SelectMenu'],
      formerly: ['SpringSelect'],
      keywords: ['select', 'dropdown', 'listbox'],
      examples: [
        { id: 'plan', title: 'A short list, described', description: 'One value from a short list that springs open under its button, each option with a second line; one not possible stays in the list.' },
        { id: 'states', title: 'Empty, wrong, disabled', description: 'Its placeholder until a value is chosen; its error under it; disabled, its value stays readable.' },
      ],
    },
    {
      slug: 'slider',
      name: 'Slider',
      names: ['Slider', 'RangeSlider'],
      keywords: ['range', 'scale', 'track', 'min max'],
      examples: [
        { id: 'levels', title: 'Ticks and bands', description: 'A value along a scale, said in words (format): ticks with their labels, bands in a tone where a value is safe, to watch or too far.' },
        { id: 'input', title: 'With a field to type', description: 'showInput puts a field beside it, for a precise value; the page holds it and says it.' },
        { id: 'range', title: 'A range between two', description: 'RangeSlider: two thumbs that cannot cross, ticks at every step (ticks) or at the values given.' },
        { id: 'disabled', title: 'Disabled', description: 'Its value still said, its thumbs still; why, under it.' },
      ],
    },
  ],
}

export default choices
