# Third-party notices

ioiti-ui's own files are under the MIT licence (`LICENSE`). It contains code from EasyUI, which
keeps its licence, below, and depends on the packages listed after it, which keep theirs.

## EasyUI (MIT License)

https://github.com/Surajmaurya1/easyui

The components of `src/components/ui/`, and `src/lib/utils.ts`, `src/lib/motion-tokens.ts`,
`src/lib/chart-primitives.tsx`, `src/lib/dashboard-chart-utils.ts` and `src/styles/tokens.css`,
come from EasyUI. They were copied by hand from these commits of its repository:

- `4dbc8b18f4ce0f1173807e8ba22e586619d52b3e` (2026-10-11): advanced-data-table, alert,
  animated-tabs, badge, breadcrumb, button, calendar, date-picker, drag-to-confirm, form, loader,
  otp-input, settle-modal, sidebar, skeleton, smooth-accordion, spring-select, stepper,
  stretch-switch, velocity-toast; `utils.ts`, `motion-tokens.ts`, `tokens.css`.
- `50effaf67bb4cfcebac4dea7c4ba1fb40812a2cd` (2026-10-23): activity-heatmap, animated-number,
  combobox, directional-tooltip, interactive-timeline, not-found, notification-bell,
  recovery-ledger, scroll-progress-nav, selection-basket, smart-comparison, spotlight-search;
  `chart-primitives.tsx`.
- `7c106d4a195f9ce566ffbbc672fc48bed68d30bd` (2026-10-23): ai-agent-activity,
  airport-matrix-clock, animated-file-upload, dependency-trace, draw-checkbox, dynamic-island,
  funnel-chart, live-line-chart, payment-status (`request-status.tsx` here), peek-card, split-button,
  stat-card, undo-toast; `dashboard-chart-utils.ts`.

They were changed, first for WATA's admin interface, then for this package: `docs/easyui-changes.md`
lists every change. EasyUI's licence, the same at the three commits:

```text
MIT License

Copyright (c) 2026 Suraj Maurya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Packages ioiti-ui depends on

Installed with it; each keeps its licence, which its package carries.

| Package | Licence | |
|---|---|---|
| `@fontsource-variable/geist` (Geist) | SIL Open Font License 1.1 | Copyright 2024 The Geist Project Authors (https://github.com/vercel/geist-font) |
| `@fontsource-variable/jetbrains-mono` (JetBrains Mono) | SIL Open Font License 1.1 | Copyright 2020 The JetBrains Mono Project Authors (https://github.com/JetBrains/JetBrainsMono) |
| `lucide-react` | ISC | https://github.com/lucide-icons/lucide |
| `clsx` | MIT | https://github.com/lukeed/clsx |
| `tailwind-merge` | MIT | https://github.com/dcastil/tailwind-merge |
| `tw-animate-css` | MIT | https://github.com/Wombosvideo/tw-animate-css |

And the ones an application installs beside it (peer dependencies): `react` and `react-dom` (MIT),
`framer-motion` (MIT), `tailwindcss` (MIT), and, if it uses them, `react-router` (MIT) and `vite` (MIT).

The two fonts are files an application serves to its visitors: their licence goes with them. An
application that lists the software it ships should name them.
