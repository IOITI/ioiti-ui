// CHANGELOG.md as the scripts read and write it: its versions, the sections of their notes, the links at its foot.
// Used by release.mjs (which names what is not released yet), release-notes.mjs (a version's GitHub Release) and
// check-docs.mjs (npm run lint).
//
// From 0.24.0, a version's notes are in sections, in this order, each once and none empty:
//
//   ### Added · ### Changed · ### Deprecated · ### Removed · ### Fixed · ### Security · ### Upgrading
//
// Upgrading says what an application does about the rest; a version that changes, deprecates or removes anything
// has it. What is not released yet is under `## [Unreleased]`, which `npm run release` names and dates. The
// versions before 0.24.0 keep their one list, as they were written.

export const REPOSITORY = 'https://github.com/IOITI/ioiti-ui'
export const UNRELEASED = 'Unreleased'
export const SECTIONS = ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security', 'Upgrading']
export const SECTIONED_FROM = '0.24.0'
const NEEDS_UPGRADING = ['Changed', 'Deprecated', 'Removed']

const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/
const HEADING = /^## \[([^\]]+)\](?: - (\d{4}-\d{2}-\d{2}))?\s*$/
const SECTION = /^### (.+?)\s*$/
const LINK = /^\[[^\]]+\]: \S+\s*$/

export const isVersion = (text) => VERSION.test(text)

/** Two versions compared (`x.y.z`, a pre-release after a dash ranking below its release): <0, 0 or >0. */
export function compareVersions(a, b) {
  const [coreA, preA] = splitVersion(a)
  const [coreB, preB] = splitVersion(b)
  for (let index = 0; index < 3; index += 1) {
    if (coreA[index] !== coreB[index]) return coreA[index] - coreB[index]
  }
  if (!preA.length || !preB.length) return preB.length - preA.length
  for (let index = 0; index < Math.max(preA.length, preB.length); index += 1) {
    const [x, y] = [preA[index], preB[index]]
    if (x === undefined || y === undefined) return x === undefined ? -1 : 1
    if (x === y) continue
    const [nx, ny] = [/^\d+$/.test(x), /^\d+$/.test(y)]
    if (nx && ny) return Number(x) - Number(y)
    if (nx !== ny) return nx ? -1 : 1
    return x < y ? -1 : 1
  }
  return 0
}

function splitVersion(version) {
  const dash = version.indexOf('-')
  const core = (dash < 0 ? version : version.slice(0, dash)).split('.').map(Number)
  return [core, dash < 0 ? [] : version.slice(dash + 1).split('.')]
}

/**
 * The CHANGELOG cut in three: what comes before its first version (`head`), its versions newest first (each its
 * name, its date and the lines under its heading), and the link definitions at its foot, which are left out:
 * `formatChangelog` writes them again from the versions.
 */
export function parseChangelog(text) {
  const lines = text.split('\n')
  let end = lines.length
  while (end > 0 && (lines[end - 1].trim() === '' || LINK.test(lines[end - 1]))) end -= 1
  const body = lines.slice(0, end)
  const starts = body.flatMap((line, index) => (HEADING.test(line) ? [index] : []))
  return {
    head: body.slice(0, starts[0] ?? body.length),
    versions: starts.map((start, index) => {
      const [, name, date] = body[start].match(HEADING)
      return { name, date: date ?? null, lines: body.slice(start + 1, starts[index + 1] ?? body.length) }
    }),
  }
}

/** The CHANGELOG written back, with the link of every version at its foot. */
export function formatChangelog({ head, versions }) {
  const lines = [...head]
  for (const version of versions) {
    lines.push(version.name === UNRELEASED ? `## [${UNRELEASED}]` : `## [${version.name}] - ${version.date}`, ...version.lines)
  }
  while (lines.length && lines.at(-1).trim() === '') lines.pop()
  return [...lines, '', ...linksOf(versions), ''].join('\n')
}

/**
 * Where each heading leads: a version to its tag's page (its GitHub Release once CI has made it), what is not
 * released yet to the changes since the last one.
 */
export function linksOf(versions) {
  const released = versions.filter((version) => version.name !== UNRELEASED)
  const links = []
  if (released.length && versions.some((version) => version.name === UNRELEASED)) {
    links.push(`[${UNRELEASED}]: ${REPOSITORY}/compare/v${released[0].name}...main`)
  }
  for (const version of released) links.push(`[${version.name}]: ${REPOSITORY}/releases/tag/v${version.name}`)
  return links
}

/** A version's notes by section: what comes before the first one (`lead`), then each `### Section` and its lines. */
export function sectionsOf(version) {
  const lead = []
  const sections = []
  for (const line of version.lines) {
    const match = line.match(SECTION)
    if (match) sections.push({ name: match[1], lines: [] })
    else (sections.at(-1)?.lines ?? lead).push(line)
  }
  return { lead, sections }
}

export const hasNotes = (version) => version.lines.some((line) => line.trim() !== '')

/** A version's notes, without the blank lines around them: what its GitHub Release says. */
export function notesOf(version) {
  const lines = [...version.lines]
  while (lines.length && lines[0].trim() === '') lines.shift()
  while (lines.length && lines.at(-1).trim() === '') lines.pop()
  return lines.join('\n')
}

/** What is wrong with one version's notes: nothing before 0.24.0, which kept its one list. */
export function versionProblems(version) {
  if (version.name !== UNRELEASED && compareVersions(version.name, SECTIONED_FROM) < 0) return []
  const label = `[${version.name}]`
  const problems = []
  const { lead, sections } = sectionsOf(version)
  if (lead.some((line) => line.trim() !== '')) problems.push(`${label}: text before its first section (### ${SECTIONS[0]}, ### Fixed…)`)
  if (version.name !== UNRELEASED && !sections.length) problems.push(`${label}: no section`)
  const seen = new Set()
  let last = -1
  for (const section of sections) {
    const at = SECTIONS.indexOf(section.name)
    if (at < 0) {
      problems.push(`${label}: "### ${section.name}" is no section of a version (${SECTIONS.join(', ')})`)
      continue
    }
    if (seen.has(section.name)) problems.push(`${label}: "### ${section.name}" twice`)
    else if (at < last) problems.push(`${label}: "### ${section.name}" after "### ${SECTIONS[last]}" (in order: ${SECTIONS.join(', ')})`)
    seen.add(section.name)
    last = Math.max(last, at)
    if (!section.lines.some((line) => line.trim() !== '')) problems.push(`${label}: "### ${section.name}" is empty`)
  }
  const changing = NEEDS_UPGRADING.filter((name) => seen.has(name))
  if (changing.length && !seen.has('Upgrading')) {
    problems.push(`${label}: has ${changing.map((name) => `"### ${name}"`).join(' and ')}, and no "### Upgrading" saying what an application does`)
  }
  return problems
}

/** What is wrong with the CHANGELOG: its versions' order, names and dates, then each version's notes. */
export function changelogProblems(changelog) {
  const problems = []
  const names = changelog.versions.map((version) => version.name)
  if (names.indexOf(UNRELEASED) > 0) problems.push(`[${UNRELEASED}] is not the first version`)
  if (names.filter((name) => name === UNRELEASED).length > 1) problems.push(`[${UNRELEASED}] twice`)
  const released = changelog.versions.filter((version) => version.name !== UNRELEASED)
  released.forEach((version, index) => {
    if (!isVersion(version.name)) problems.push(`[${version.name}] is no version (x.y.z)`)
    else if (!version.date) problems.push(`[${version.name}] has no date ("## [${version.name}] - YYYY-MM-DD")`)
    const newer = released[index - 1]
    if (newer && isVersion(newer.name) && isVersion(version.name) && compareVersions(newer.name, version.name) <= 0) {
      problems.push(`[${version.name}] is under [${newer.name}]: the newest version comes first, each once`)
    }
  })
  for (const version of changelog.versions) problems.push(...versionProblems(version))
  return problems
}

/** What is under [Unreleased] named as the version, released on the day; an empty [Unreleased] opens above it. */
export function promote(changelog, version, date) {
  const at = changelog.versions.findIndex((entry) => entry.name === UNRELEASED)
  if (at < 0) throw new Error(`CHANGELOG.md has no "## [${UNRELEASED}]"`)
  const versions = [...changelog.versions]
  versions.splice(at, 1, { name: UNRELEASED, date: null, lines: [''] }, { name: version, date, lines: versions[at].lines })
  return { ...changelog, versions }
}

/** Today, as the CHANGELOG dates a version (YYYY-MM-DD, in the local time zone). */
export function today(now = new Date()) {
  const pad = (number) => String(number).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}
