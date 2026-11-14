import { AnimatedFileUpload } from 'ioiti-ui'
import type { UploadFileItem } from 'ioiti-ui'

const FILES: UploadFileItem[] = [
  { id: 'march', name: 'invoices-march.csv', size: 48_200, type: 'text/csv', progress: 0, status: 'queued' },
  { id: 'february', name: 'invoices-february.csv', size: 51_900, type: 'text/csv', progress: 45, status: 'uploading' },
  { id: 'statement', name: 'statement-2026-q1.pdf', size: 1_240_000, type: 'application/pdf', progress: 92, status: 'processing' },
  {
    id: 'january',
    name: 'invoices-january.csv',
    size: 46_700,
    type: 'text/csv',
    progress: 100,
    status: 'complete',
    link: { href: '/components/tables', label: 'Open its invoices' },
  },
  {
    id: 'december',
    name: 'invoices-december.csv',
    size: 52_400,
    type: 'text/csv',
    progress: 0,
    status: 'error',
    errorMessage: 'Line 14 has no amount: fix it in the file and try again.',
  },
]

export default function AnimatedFileUploadStatuses() {
  return <AnimatedFileUpload initialFiles={FILES} label="Invoice files" dropSubtitle="or choose files" />
}
