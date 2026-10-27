// Writes the grains of the bloom accent, src/styles/grain-white.png and grain-black.png:
//
//   node scripts/grains.mjs
//
// Each is a tile of noise, one speck per pixel, each pixel either clear or a speck of one colour at
// the grain's strength, half of them each: the stochastic screen of a print. accents.css draws the
// tile at 2x (image-set), a speck to a pixel of a retina screen; a browser scales it to any other
// screen and zoom, as an image, where an SVG filter's noise falls on its own lattice at some of them
// and vanishes or turns to moiré. Seeded: the same files every time. Files, never data: URIs: an
// application inlines nothing of the package (img-src stays at self). gallery/src/tokens.ts reads
// each as its speck (GRAINS), and its test holds them to these files.
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { crc32, deflateSync } from 'node:zlib'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SIZE = 256

// The speck's grey and its alpha, of 255: white lightens the light theme's surfaces and black darkens
// the dark one's, away from the text on them. Black reads stronger on the light fill it also lies on.
const GRAINS = [
  { file: 'grain-white.png', grey: 255, alpha: 13, seed: 1 },
  { file: 'grain-black.png', grey: 0, alpha: 10, seed: 2 },
]

/** mulberry32: a small seeded generator, from 0 to 1. */
function random(seed) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function chunk(type, data) {
  const name = Buffer.from(type, 'latin1')
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const check = Buffer.alloc(4)
  check.writeUInt32BE(crc32(Buffer.concat([name, data])))
  return Buffer.concat([length, name, data, check])
}

/** A PNG of grey and alpha, 8 bits each, every row unfiltered: what the tests read back. */
function png({ grey, alpha, seed }) {
  const next = random(seed)
  const header = Buffer.alloc(13)
  header.writeUInt32BE(SIZE, 0)
  header.writeUInt32BE(SIZE, 4)
  header[8] = 8
  header[9] = 4
  const rows = Buffer.alloc(SIZE * (1 + 2 * SIZE))
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const at = y * (1 + 2 * SIZE) + 1 + 2 * x
      rows[at] = grey
      rows[at + 1] = next() < 0.5 ? alpha : 0
    }
  }
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([signature, chunk('IHDR', header), chunk('IDAT', deflateSync(rows, { level: 9 })), chunk('IEND', Buffer.alloc(0))])
}

for (const grain of GRAINS) {
  writeFileSync(join(root, 'src/styles', grain.file), png(grain))
  console.log(`src/styles/${grain.file}`)
}
