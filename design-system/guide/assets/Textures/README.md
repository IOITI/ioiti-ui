# Textures

Bloom's grain: a 256 × 256 tile of single-pixel specks, laid at 2x (one speck to a retina pixel) over Bloom's gradient and its glass backdrop. Faint: a tooth, not a texture.

- `grain-white.png`: white specks, for the light theme.
- `grain-black.png`: black specks, for the dark theme.

The specks are the page's own colour, so they pull the gradient toward the page and away from every text on it. `components/bundle.css` reads them as `--brand-grain` under `[data-accent="bloom"]`. Never use them elsewhere, never as a `data:` URI, never on a surface without Bloom's gradient.
