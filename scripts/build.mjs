// Builds dist/: the TypeScript of src/ compiled file by file (tsc), the stylesheets and the
// pre-paint theme script copied as they are (they stay Tailwind's source, compiled by each
// application's own Tailwind). With --watch, keeps doing it as files change.
import { spawn, spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readdirSync, rmSync, watch } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc')
const watching = process.argv.includes('--watch')

function copyAssets() {
  mkdirSync(join(root, 'dist/styles'), { recursive: true })
  for (const name of readdirSync(join(root, 'src/styles'))) {
    if (name.endsWith('.css')) copyFileSync(join(root, 'src/styles', name), join(root, 'dist/styles', name))
  }
  copyFileSync(join(root, 'src/theme.js'), join(root, 'dist/theme.js'))
}

rmSync(join(root, 'dist'), { recursive: true, force: true })

if (watching) {
  copyAssets()
  for (const project of ['tsconfig.lib.json', 'tsconfig.vite.json']) {
    spawn(process.execPath, [tsc, '-p', project, '--watch', '--preserveWatchOutput'], { cwd: root, stdio: 'inherit' })
  }
  for (const folder of ['src/styles', 'src']) {
    watch(join(root, folder), (_event, name) => {
      if (name && (name.endsWith('.css') || name === 'theme.js')) copyAssets()
    })
  }
} else {
  for (const project of ['tsconfig.lib.json', 'tsconfig.vite.json']) {
    const result = spawnSync(process.execPath, [tsc, '-p', project], { cwd: root, stdio: 'inherit' })
    if (result.status !== 0) process.exit(result.status ?? 1)
  }
  copyAssets()
}
