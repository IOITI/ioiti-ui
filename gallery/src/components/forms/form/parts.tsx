import { Button, Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage, Input } from 'ioiti-ui'

export default function FormParts() {
  return (
    <Form onSubmit={(event) => event.preventDefault()} className="max-w-md">
      <FormItem>
        <FormLabel htmlFor="parts-email" required>
          Email
        </FormLabel>
        <FormControl>
          <Input id="parts-email" type="email" defaultValue="ana@example" error aria-invalid aria-describedby="parts-email-error" />
        </FormControl>
        <FormMessage id="parts-email-error" error="An address needs a domain: ana@example.com" />
      </FormItem>
      <FormItem>
        <FormLabel htmlFor="parts-password">Password</FormLabel>
        <FormControl>
          <Input id="parts-password" type="password" showPasswordToggle defaultValue="correct horse" aria-describedby="parts-password-description" />
        </FormControl>
        <FormDescription id="parts-password-description">Twelve characters at least.</FormDescription>
      </FormItem>
      <Button type="submit" fullWidth>
        Save
      </Button>
    </Form>
  )
}
