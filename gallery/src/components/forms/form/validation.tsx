import { Button, Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage, Input, Textarea } from 'ioiti-ui'
import type { ChangeEvent, FormEvent } from 'react'
import { useId, useRef, useState } from 'react'

interface Values {
  name: string
  email: string
  message: string
}

type Errors = Partial<Record<keyof Values, string>>

/** What is wrong with each field, in words that say how to put it right. */
function check(values: Values): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = 'Say who is writing.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'An address with its domain: ana@example.com'
  const length = values.message.trim().length
  if (length < 20) errors.message = `Twenty characters at least: ${length} so far.`
  return errors
}

export default function FormValidation() {
  const id = useId()
  const form = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<Values>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  // Said once it has been sent: nothing is wrong with a field being filled for the first time.
  const [submitted, setSubmitted] = useState(false)
  const [sent, setSent] = useState<string | null>(null)

  const change = (key: keyof Values) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [key]: event.target.value }
    setValues(next)
    if (submitted) setErrors(check(next))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = check(values)
    setSubmitted(true)
    setErrors(found)
    const first = (Object.keys(values) as (keyof Values)[]).find((key) => found[key])
    if (first) {
      setSent(null)
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setSent(`${values.name.trim()} <${values.email.trim()}>`)
  }

  /** A field's own attributes: its error, when it has one, describes it. */
  const wrong = (key: keyof Values) => ({
    name: key,
    id: `${id}-${key}`,
    value: values[key],
    onChange: change(key),
    error: Boolean(errors[key]),
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${id}-${key}-error` : undefined,
  })

  return (
    <div className="flex max-w-md flex-col gap-4">
      <Form ref={form} onSubmit={submit}>
        <FormItem>
          <FormLabel htmlFor={`${id}-name`} required>
            Name
          </FormLabel>
          <FormControl>
            <Input autoComplete="name" {...wrong('name')} />
          </FormControl>
          <FormMessage id={`${id}-name-error`} error={errors.name} />
        </FormItem>
        <FormItem>
          <FormLabel htmlFor={`${id}-email`} required>
            Email
          </FormLabel>
          <FormControl>
            <Input type="email" autoComplete="email" {...wrong('email')} />
          </FormControl>
          <FormMessage id={`${id}-email-error`} error={errors.email} />
        </FormItem>
        <FormItem>
          <FormLabel htmlFor={`${id}-message`} required>
            Message
          </FormLabel>
          <FormControl>
            <Textarea rows={3} placeholder="What the order needs" {...wrong('message')} />
          </FormControl>
          {errors.message ? (
            <FormMessage id={`${id}-message-error`} error={errors.message} />
          ) : (
            <FormDescription>Twenty characters at least.</FormDescription>
          )}
        </FormItem>
        <Button type="submit" fullWidth>
          Send
        </Button>
      </Form>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {sent ? `Sent, from ${sent}.` : 'Nothing sent yet.'}
      </p>
    </div>
  )
}
