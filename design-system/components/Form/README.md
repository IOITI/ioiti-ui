# Form

A form laid out by hand, from its parts: an item, its label, its control, what it is for and what is wrong.

**You provide** `FormItem` around each field, `FormLabel`, `FormControl` around its control, `FormDescription`, `FormMessage`. For `Form`: `onSubmit` (it does not validate: the page checks the values and says what is wrong). For `FormLabel`: `htmlFor`, `required` (a star after it). For `FormMessage`: `error` (its words, `null` for none) or its words as children. `FormItem`, `FormControl` and `FormDescription` take what a `div` or a `p` takes, an `id` among them.

```tsx
<Form onSubmit={submit}>
  <FormItem>
    <FormLabel htmlFor="email" required>Email</FormLabel>
    <FormControl>
      <Input id="email" type="email" error={Boolean(errors.email)} aria-describedby="email-error" />
    </FormControl>
    <FormMessage id="email-error" error={errors.email} />
  </FormItem>
  <Button type="submit" fullWidth>Send</Button>
</Form>
```

- A message is said on submit, not while a field is first filled; the first wrong field takes the focus, and each message goes as its field is put right.
- A message is an alert, in `negative` with its icon, coming and going in a fade: give it an `id` its control's `aria-describedby` names, and its control `error`.
- What the server refused is said at the form's foot, the fields kept as they were. A form of fields laid out alike is a column of `Field`s.
