import { StreamLanguage } from '@codemirror/language'
import type { Extension } from '@codemirror/state'

/** The languages the editors read. `text` is not coloured. */
export type CodeEditorLanguage = 'toml' | 'yaml' | 'json' | 'markdown' | 'text'

/**
 * A language's support, loaded when first asked for: each is a chunk of its own, so that an editor of
 * JSON never downloads the parser of Markdown (which brings HTML's). Resolves to no extension for `text`.
 */
export async function loadLanguage(language: CodeEditorLanguage): Promise<Extension> {
  switch (language) {
    case 'toml': {
      const { toml } = await import('@codemirror/legacy-modes/mode/toml')
      return StreamLanguage.define(toml)
    }
    case 'yaml': {
      const { yaml } = await import('@codemirror/lang-yaml')
      return yaml()
    }
    case 'json': {
      const { json } = await import('@codemirror/lang-json')
      return json()
    }
    case 'markdown': {
      const { markdown } = await import('@codemirror/lang-markdown')
      return markdown()
    }
    default:
      return []
  }
}
