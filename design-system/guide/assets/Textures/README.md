# Textures

The grains: 256 × 256 tiles of single-pixel specks, laid at 2x (one speck to a retina pixel). Faint: a tooth, not a texture.

- `grain-white.png`: the gradient accents' white specks (Bloom, Lagoon, Aurora, Dusk, Golden hour), for the light theme.
- `grain-black.png`: their black specks, for the dark theme.
- `grain-overlay.png`: the glass backdrop's, for every accent: opaque, half its specks black, half white, blended as an overlay at 3% in light and 6% in dark (`--glass-grain-opacity`), so the steps of a dark gradient do not show.

Their specks are the page's own colour, so they pull the gradient toward the page and away from every text on it. `components/bundle.css` reads them as `--brand-grain` under `[data-accent="bloom"]` and each other gradient accent, and the backdrop's on the glass material's `body::after`, blended as an overlay over its copy of the backdrop as it is painted. Never use them elsewhere, never as a `data:` URI.
