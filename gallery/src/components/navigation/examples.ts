import { collect } from '../../catalogue/collect'

export default collect(
  import.meta.glob('./*/*.tsx', { eager: true }),
  import.meta.glob('./*/*.tsx', { eager: true, query: '?raw', import: 'default' }),
)
