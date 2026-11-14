import { AnimatedFileUpload } from 'ioiti-ui'

/** An upload made up for the gallery: it counts to 100 and answers with a link. */
async function pretendUpload(_file: unknown, onProgress: (progress: number) => void) {
  for (let progress = 10; progress <= 100; progress += 15) {
    await new Promise((resolve) => window.setTimeout(resolve, 120))
    onProgress(Math.min(progress, 100))
  }
  return { href: '/components/tables', label: 'Open' }
}

export default function AnimatedFileUploadSequential() {
  return (
    <AnimatedFileUpload
      multiple
      sequential
      uploadHandler={pretendUpload}
      label="Invoice files"
      dropSubtitle="or choose files (made up: nothing leaves the page)"
    />
  )
}
