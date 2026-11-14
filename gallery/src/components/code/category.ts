import { SquareCode } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const code: CategoryInfo = {
  slug: 'code',
  label: 'Code',
  icon: SquareCode,
  summary: 'Code to read, compare and edit, the output of what runs, and the keys of a shortcut. The editors are an entry of their own (ioiti-ui/code): an application that never edits code never loads them.',
  families: [
    {
      slug: 'code-block',
      name: 'CodeBlock',
      names: ['CodeBlock', 'Code'],
      keywords: ['snippet', 'syntax', 'highlight', 'pre', 'json', 'inline code'],
      examples: [
        { id: 'payload', title: 'Numbered, a line marked', description: 'A payload to read and copy, in the design’s code colours, each 4.5:1 on its surface in every look: its lines numbered, the one that matters marked.' },
        { id: 'configuration', title: 'A configuration', description: 'TOML and YAML, each under the name of its file.' },
        { id: 'diff', title: 'What changed', description: 'A unified diff: what was removed in the loss’s tone, what was added in the gain’s, each line also marked at its edge.' },
        { id: 'long-file', title: 'A long file, or a part', description: 'Taller than maxHeight, it scrolls inside; a part of a file is numbered from where it starts, and its marked lines by those numbers.' },
        { id: 'commands', title: 'Commands, wrapped', description: 'A shell’s commands and a few lines of TypeScript. A long line scrolls sideways, or breaks where the line ends (wrap).' },
        { id: 'inline', title: 'In a sentence', description: 'Code is a word of code inside a sentence: a function, a value, a file’s name.' },
      ],
    },
    {
      slug: 'code-editor',
      name: 'CodeEditor',
      names: ['CodeEditor'],
      entry: 'ioiti-ui/code',
      keywords: ['editor', 'codemirror', 'textarea', 'syntax'],
      examples: [
        { id: 'diagnostics', title: 'Problems marked, saved with ⌘S', description: 'A server’s parse errors marked where they are, with their message on hover; ⌘S saves, ⌘F searches, Tab moves on. Its frame shows the focus as a field’s does.' },
        { id: 'languages', title: 'Its languages', description: 'TOML, YAML, JSON, Markdown, Python, or text: each coloured and indented, loaded when first used. The value is the page’s, said beside it.' },
        { id: 'read-only', title: 'Read only', description: 'Read, selected, searched and copied, not changed: an answer to look into, its long line wrapped.' },
        { id: 'empty', title: 'Empty, with a placeholder', description: 'A placeholder until the first word; no line numbers for prose, and a height that grows between its least and its most.' },
      ],
    },
    {
      slug: 'diff-editor',
      name: 'DiffEditor',
      names: ['DiffEditor'],
      entry: 'ioiti-ui/code',
      keywords: ['diff', 'compare', 'merge', 'review', 'versions'],
      examples: [
        { id: 'layouts', title: 'Side by side or unified', description: 'Two versions of a text: the header’s arrows go from one change to the next, the second version is editable, its problems marked as the editor marks them, ⌘S saving it.' },
        { id: 'review', title: 'A change to review', description: 'Read only, in one column, with what can be done with it at the end of its header.' },
        { id: 'folded', title: 'Unchanged lines folded', description: 'Long unchanged stretches are folded, a few lines kept around each change; a click unfolds one.' },
      ],
    },
    {
      slug: 'log-viewer',
      name: 'LogViewer',
      names: ['LogViewer'],
      keywords: ['log', 'output', 'console', 'terminal', 'stream'],
      examples: [
        { id: 'running', title: 'A job as it runs', description: 'Its output as it is written: the newest line in sight until the reader scrolls up, and “Jump to the end” to follow again. Search, wrap, copy and download in its header.' },
        { id: 'levels', title: 'Errors and warnings', description: 'A line’s level is read from its words: an error and its traceback in the loss’s tone, a warning in the warning’s, each marked at its edge.' },
        { id: 'long', title: 'A long log', description: 'Only the lines in sight are drawn: twenty thousand scroll as a hundred. The lines a server already left out are counted in the numbers.' },
        { id: 'empty', title: 'Before its first line', description: 'Until something is logged, it says what will show there.' },
      ],
    },
    {
      slug: 'kbd',
      name: 'Kbd',
      names: ['Kbd'],
      keywords: ['keyboard', 'shortcut', 'hotkey', 'keys'],
      examples: [
        { id: 'single-keys', title: 'One key', description: 'A key by its name (Esc), or in the shortcut’s notation, drawn as this computer writes it: ↵, the arrows.' },
        { id: 'combinations', title: 'Keys held together', description: 'The keys of a shortcut, as this computer writes them: ⌘ on an Apple computer, Ctrl elsewhere. Write mod, never ⌘ or Ctrl yourself.' },
        { id: 'sequences', title: 'One key, then the next', description: 'A sequence is one key, then the next; in a sentence, it sits on its line.' },
      ],
    },
    {
      slug: 'copy-chip',
      name: 'CopyChip',
      names: ['CopyChip'],
      keywords: ['copy', 'clipboard', 'id', 'reference', 'token'],
      examples: [
        { id: 'values', title: 'Short, or cut', description: 'A value to read and copy, in a chip with its button. A long one is cut in its middle (its ends tell it apart) or at its end; the whole of it in a hint and for a screen reader.' },
        { id: 'in-details', title: 'In a list of details', description: 'Beside the term it is the value of: how much of each end is kept is up to the page (keep).' },
      ],
    },
  ],
}

export default code
