// The notes of a version's GitHub Release: its section of CHANGELOG.md, the line that installs it, and the commits
// since the version before it. CI writes them when a tag is pushed (.github/workflows/verify-release.yml).
//
//   node scripts/release-notes.mjs v0.24.0        (or 0.24.0)
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { notesOf, parseChangelog, REPOSITORY, UNRELEASED } from './changelog.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const asked = process.argv[2]?.replace(/^v/, '')
if (!asked) {
  console.error('release-notes: give the version: node scripts/release-notes.mjs v0.24.0')
  process.exit(1)
}

const released = parseChangelog(readFileSync(join(root, 'CHANGELOG.md'), 'utf8')).versions.filter((version) => version.name !== UNRELEASED)
const index = released.findIndex((version) => version.name === asked)
if (index < 0) {
  console.error(`release-notes: CHANGELOG.md has no section for ${asked}`)
  process.exit(1)
}

/**
 * The lines of each paragraph and list item joined: CHANGELOG.md wraps them at 120 characters, which a Release, like
 * a comment, would show as so many breaks. Code blocks are kept as they are.
 */
function unwrapped(text) {
  const lines = []
  let code = false
  for (const line of text.split('\n')) {
    const fence = /^\s*```/.test(line)
    const previous = lines.at(-1)
    const continues =
      !code &&
      !fence &&
      previous !== undefined &&
      previous.trim() !== '' &&
      line.trim() !== '' &&
      !/^\s*(?:[-*+]|\d+\.)\s|^\s*#{1,6}\s|^\s*\||^\s*---\s*$/.test(line) &&
      !/^\s*#{1,6}\s|^\s*\||^\s*```|^\s*---\s*$/.test(previous)
    if (continues) lines[lines.length - 1] = `${previous} ${line.trim()}`
    else lines.push(line)
    if (fence) code = !code
  }
  return lines.join('\n')
}

const tag = `v${asked}`
const before = released[index + 1]
const lines = [
  unwrapped(notesOf(released[index])),
  '',
  '---',
  '',
  `**Install**: \`npm install github:IOITI/ioiti-ui#${tag}\`, or the tag changed in the application's \`package.json\`; the template: \`npx degit IOITI/ioiti-ui/templates/app#${tag} my-app\`.`,
]
if (before) lines.push('', `**Commits** since v${before.name}: ${REPOSITORY}/compare/v${before.name}...${tag}`)
console.log(lines.join('\n'))
