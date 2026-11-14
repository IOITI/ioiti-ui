import { TextCursorInput } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const forms: CategoryInfo = {
  slug: 'forms',
  label: 'Forms',
  icon: TextCursorInput,
  summary: 'A label over each field, its hint under it, its error in the negative colour: fields that take text, numbers, codes and files, and the form they are sent in.',
  families: [
    {
      slug: 'field',
      name: 'Field',
      names: ['Field'],
      keywords: ['label', 'hint', 'description', 'error', 'form field'],
      examples: [
        { id: 'controls', title: 'A control under its label', description: 'The way the pages put a control under its label: an Input, a Select, a Textarea; a Combobox takes its label beside it (htmlFor), since a label around it would pass the clicks of its options on to it.' },
        { id: 'description-and-error', title: 'What it is for, what is wrong', description: 'What the value is for goes under it, read out with the field, which the label alone names. An error says how to put it right, and goes once it is right.' },
        { id: 'narrow', title: 'In a narrow column', description: 'A label or a description longer than its column wraps; the control keeps the column’s width (a phone, a side panel).' },
      ],
    },
    {
      slug: 'form',
      name: 'Form',
      names: ['Form', 'FormItem', 'FormLabel', 'FormControl', 'FormDescription', 'FormMessage'],
      keywords: ['submit', 'validation', 'required', 'sign in'],
      examples: [
        { id: 'validation', title: 'Checked on submit', description: 'Nothing is said while a field is first filled; on submit each wrong field says why, the first takes the focus, and each message goes as it is put right.' },
        { id: 'parts', title: 'Its parts', description: 'A labelled item, marked required; the description under its control; its message, which comes and goes in a fade, read as an alert.' },
        { id: 'refused', title: 'Busy, then refused', description: 'While it is sent, its button says so and cannot be pressed twice; what the server refused is said at its foot, the fields kept as they were.' },
      ],
    },
    {
      slug: 'input',
      name: 'Input',
      names: ['Input'],
      keywords: ['text field', 'prefix', 'suffix', 'unit', 'password', 'search'],
      examples: [
        { id: 'units', title: 'Units before and after', description: 'A unit goes in the field, not in its label: before the value (prefix) or after it (suffix). The text keeps clear of it, and a screen reader hears it with the field.' },
        { id: 'icons', title: 'With an icon', description: 'An icon before the value says what kind of value it is (a search, an address); one after it, a lock on a value that cannot be changed.' },
        { id: 'password', title: 'A password', description: 'showPasswordToggle shows what is typed, at a press of its eye. Two fields that must match say so under the second.' },
        { id: 'states', title: 'Disabled and wrong', description: 'Disabled, it is faded and its description says why; wrong, its border is in the negative colour and its Field says how to put it right.' },
      ],
    },
    {
      slug: 'textarea',
      name: 'Textarea',
      names: ['Textarea'],
      keywords: ['multiline', 'note', 'comment', 'message'],
      examples: [
        { id: 'note', title: 'A note', description: 'Several lines of text: its placeholder says what is wanted; rows sets its height, which the reader may stretch.' },
        { id: 'counted', title: 'Its length beside it', description: 'Its value held by the page, which counts it: past the limit, the field says by how much, and nothing is cut.' },
        { id: 'states', title: 'Disabled and wrong', description: 'Disabled, its text stays readable; wrong, its border is in the negative colour and its Field says what is missing.' },
      ],
    },
    {
      slug: 'select',
      name: 'Select',
      names: ['Select'],
      keywords: ['dropdown', 'native select', 'options'],
      examples: [
        { id: 'options', title: 'From a list', description: 'The browser’s own list: options given as data, one of them disabled; a first option that cannot be chosen asks for a choice.' },
        { id: 'groups', title: 'Groups, its value beside it', description: 'Options as children, in groups; its value held by the page and said beside it.' },
        { id: 'states', title: 'Disabled and wrong', description: 'Disabled, its value stays readable; wrong, its border is in the negative colour and its Field says what to choose.' },
      ],
    },
    {
      slug: 'combobox',
      name: 'Combobox',
      names: ['Combobox'],
      keywords: ['autocomplete', 'typeahead', 'search select'],
      examples: [
        { id: 'countries', title: 'Typed into, then chosen', description: 'One value from a list long enough to search: typing filters it, the arrows move, Enter chooses. Each option may have a second line.' },
        { id: 'keywords', title: 'Found by other words', description: 'An option with an icon, found by words it does not show (keywords): “dollar” finds the US dollar, “chf” the Swiss franc. Its search and its empty list in the page’s words.' },
        { id: 'states', title: 'Disabled and missing', description: 'Disabled, its value stays readable; a value missing is said by its Field, under it.' },
      ],
    },
    {
      slug: 'number-input',
      name: 'NumberInput',
      names: ['NumberInput'],
      keywords: ['number', 'stepper', 'quantity', 'spinner'],
      examples: [
        { id: 'units', title: 'Limits, quantities, delays', description: 'A number to type, or to change with the arrow keys (ten at a time with Shift) and the − and + buttons, its unit beside it. A comma or a point marks the decimals.' },
        { id: 'bounds', title: 'Bounds, steps, its value', description: 'What is typed stays until it leaves the field, then keeps to its bounds and its step; emptied, its value is none. Without its buttons for a value rarely nudged.' },
        { id: 'states', title: 'Wrong and disabled', description: 'Within its bounds and still wrong (more than there is in stock): the page says why under it. Disabled, its buttons are too.' },
      ],
    },
    {
      slug: 'otp-input',
      name: 'OTPInput',
      names: ['OTPInput'],
      keywords: ['one-time code', 'verification', '2fa', 'pin'],
      examples: [
        { id: 'complete', title: 'A code, then what it is', description: 'A one-time code: a password manager’s or a phone’s autofill fills every box, as a paste does. onComplete hears it once every box is filled.' },
        { id: 'refused', title: 'A wrong code', description: 'A code refused: its boxes bordered in the negative colour, why under them, and a way to ask for another.' },
        { id: 'checking', title: 'Disabled while checked', description: 'Once filled, the boxes are disabled while the code is checked, then the page says what came of it.' },
      ],
    },
    {
      slug: 'inline-edit',
      name: 'InlineEdit',
      names: ['InlineEdit'],
      keywords: ['rename', 'editable', 'click to edit'],
      examples: [
        { id: 'saving', title: 'Saved, or refused', description: 'A click or Enter turns it into a field, Enter saves and Escape gives up. A save that takes its time shows it; one refused says why and keeps the field (try “archive”).' },
        { id: 'details', title: 'In a record’s details', description: 'Values edited where they are listed; one that cannot be changed reads as text (readOnly), an empty one shows its placeholder.' },
      ],
    },
    {
      slug: 'animated-file-upload',
      name: 'AnimatedFileUpload',
      names: ['AnimatedFileUpload'],
      keywords: ['file', 'drop zone', 'drag and drop', 'import', 'attachment'],
      examples: [
        { id: 'sequential', title: 'One file after the other', description: 'A drop zone: the files are handled one after the other here, each answered with a link to what it became.' },
        { id: 'statuses', title: 'Each state of a file', description: 'A list as it stands midway, given as initialFiles, a file in each status: queued, uploading, processing, complete with its link, error with why and a way to try again.' },
        { id: 'limits', title: 'What it takes, and what not', description: 'The types the chooser offers (accept), a largest size and a number of files: a file too large is listed with why, the files past the number are left out.' },
        { id: 'compact', title: 'Compact, or disabled', description: 'compact for a form’s column; disabled, while what the files are for is not chosen yet.' },
      ],
    },
  ],
}

export default forms
