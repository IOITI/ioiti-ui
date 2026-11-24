# Form

A form laid out by hand, from its parts: an item, its label, its control, what it is for and what is wrong.

**You provide** `FormItem` around each field, `FormLabel`, `FormControl` around its control, `FormDescription`, `FormMessage`. For `Form`: `onSubmit` (it does not validate: the page checks the values and says what is wrong). For `FormLabel`: `required` (a star after it), `htmlFor` for a control outside its item. For `FormMessage`: `error` (its words, `null` for none) or its words as children. For `FormItem`: `error`, which marks its control invalid as a message does. `FormItem`, `FormControl` and `FormDescription` take what a `div` or a `p` takes, an `id` among them.

```tsx
<Form onSubmit={submit}>
  <FormItem>
    <FormLabel required>Email</FormLabel>
    <FormControl>
      <Input type="email" />
    </FormControl>
    <FormDescription>Where the answer goes</FormDescription>
    <FormMessage error={errors.email} />
  </FormItem>
  <Button type="submit" fullWidth>Send</Button>
</Form>
```

- The item links its parts, without an id written: its label names its control, its description and its message are read out with it, and a message marks it invalid (`aria-invalid`), which the package's fields draw in `negative`. An id given to the control, the description or the message is kept, and used.
- One control per item. `FormControl` gives a control from elsewhere (a plain `<input>`, another library's) the item's id, its description and its message as props; the package's controls take them wherever they are in the item, a `Switch` too.
- A message is said on submit, not while a field is first filled; the first wrong field takes the focus, and each message goes as its field is put right.
- A message is an alert, in `negative` with its icon, coming and going in a fade.
- What the server refused is said at the form's foot, the fields kept as they were. A form of fields laid out alike is a column of `Field`s.
