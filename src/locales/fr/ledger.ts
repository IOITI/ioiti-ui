import type { MessageKit } from '../../lib/messages.js'
import type { Messages } from '../en.js'

export const ledger: Messages['ledger'] = {
  title: 'Points de restauration',
  count: (count: number, { plural }: MessageKit) => plural(count, { one: '# instantané', other: '# instantanés' }),
  restore: 'Restaurer',
  restoreEntry: ({ restore, action }: { restore: string; action: string }) => `${restore} : ${action}`,
  current: 'Version actuelle',
  changes: 'Modifications',
}
