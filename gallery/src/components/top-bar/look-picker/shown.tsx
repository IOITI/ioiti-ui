import { accentName, Button, DescriptionList, LookPicker, materialName, TextLink, useMessages, useTheme } from 'ioiti-ui'

export default function LookPickerShown() {
  // What it sets, held by IoitiProvider: the accent and the material shown.
  const { accent, material } = useTheme()
  // The look's names in the application's language.
  const { look } = useMessages()
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <LookPicker />
        <Button size="sm">Save</Button>
        <TextLink href="/foundations/themes" className="text-sm">
          The looks, side by side
        </TextLink>
      </div>
      <DescriptionList
        className="max-w-sm"
        compressed
        items={[
          { term: 'Accent', details: accentName(accent, look) },
          { term: 'Material', details: materialName(material, look) },
        ]}
      />
    </div>
  )
}
