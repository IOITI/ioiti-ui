import type { Messages } from '../en.js'

export const format: Messages['format'] = {
  milliseconds: 'ms',
  seconds: 's',
  minutes: 'min',
  hours: 'h',
  days: 'j',
  future: (duration: string) => `dans ${duration}`,
  past: (duration: string) => `il y a ${duration}`,
  bytes: 'o',
  kilobytes: 'ko',
  megabytes: 'Mo',
  gigabytes: 'Go',
}
