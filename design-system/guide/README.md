Ink on paper, for the admin interfaces of IOITI's applications: dense pages of figures, tables and states that are read every day and must never be misread. A neutral palette in two themes, one typeface for what is read and one for what is typed exactly, one radius, soft corners, a hairline around every section, and a shadow only on what floats. Colour is spent on meaning: a status, a gain or a loss, the one thing chosen. Everything else is grey.

Three choices combine into a **look**: a theme (`light` or `dark`), an accent (`neutral`, `violet`, `indigo`, `blue`, `bloom`, `lagoon`, `aurora`, `dusk` or `golden`) and a material (`flat` or `glass`). Neutral and flat are the design itself; the others only add. Every look keeps text at 4.5:1 on every surface.

## Content fundamentals

- **Plain, short, in sentence case.** A page title is a noun ("Orders", "Settings"); its description one sentence that says what is there and in what order: "Every order, newest first." A panel: "Open orders", "Placed today, not sent yet."
- **Buttons say what they do**, with a verb and its object when it is not obvious: "New order", "Refresh", "Pause the imports", "Delete the project". Busy, the button says it: "Saving". Never "OK", "Submit" or "Click here".
- **A state is a word beside its colour, never the colour alone**: `StatusBadge` says Up, Degraded, Down, Unknown, Disabled. A change carries its sign; the colour only repeats it.
- **Figures are written exactly**: a true minus (−3.5%, never a hyphen), a plus on a gain (+12.4%), two decimals for money (€12,480.00, as `formatMoney` writes it), an em dash (—) for a value that is missing. Use `formatMoney`, `formatPercent`, `formatNumber`, `formatRelative` ("2 min ago"): they write them so.
- **An empty state says what is not there, why, and what to do**: "No detection rule yet" / "Rules pushed to the repository appear here, with what they detect and where they run." One quiet line in a list: `EmptyText`.
- **An error says what went wrong with what was asked**, under the button that asked: `ErrorText`, in `negative`. A failed refresh keeps what is on screen and says so above it.
- **A toast is a past participle and, if needed, one sentence**: "Settings saved", "Project deleted", "Refreshed".
- **A confirmation names the consequence**: "The project, its 42 files and their history are removed for everyone." / "This cannot be undone."
- No emoji, no exclamation marks, no "Oops". The reader is "you" only when told what to do; the application never says "I" or "we".

## Colour

- **Name a token, never a colour.** Text is `foreground`; secondary text `muted-foreground`; the page `background`; fields, buttons and rows `surface`, under the pointer `surface-hover`; a box nested in a panel `surface-raised`; every line `border`, under the pointer `border-hover`. `check-source` refuses a hex, an `rgba()`, a palette's step (`neutral-500`, `rose-600`) or white and black in a component.
- **Three greys for text, by role**: `foreground` for what is read, `text-secondary` for a label (a field's, a group's heading in a control, a term), `muted-foreground` for what supports it (a caption, a description, a timestamp), and `text-subtle` for a placeholder or a disabled label only.
- **What is selected** is a faint step of the text's own colour, the accent's tint where the look has one; a scrollbar's track shows what is under it (`finish.css`), thin in Firefox.
- **Lines by depth**: rows of a list or a table `border` at 40%, a nested box at 60%, a section at 70%.
- **A tone by recipe** (`src/lib/recipes.ts`): its word (`text-negative`), on a faint ground of its colour (5% in light, 10% in dark, so that the word keeps 4.5:1 on a hovered row), with a line at 30%, or filled with the page's colour on it. Danger is `negative` everywhere, never a rose or a palette's red.
- **Two values for every colour.** Each colour token has a light and a dark value; a component names tokens, so it is right in both themes.
- **Text is 4.5:1** on the grounds its token's note names, in both themes and every accent and material; a mark (a fill that means something, the focus ring, an icon alone) 3:1. The design's one known pair under it: dark `text-subtle` on `surface-hover` (4.44:1). Use `text-subtle` for placeholders and disabled labels only.
- **Primary is ink.** In the neutral look `primary` is near-black on light and near-white on dark, with `primary-foreground` on it. One primary action per page or dialog.
- **The tones keep their colours in every look**: `positive` (a gain, a success), `negative` (a loss, a failure), `warning`, `info` as text; each 4.5:1 on every surface. No accent is green, red, amber, orange or teal, so that they never mean a tone.
- **Text and marks are apart.** A figure is `positive`; a bar of gain is `chart-positive`. Never fill a mark with a text token or write text in a chart token.

### Accents

An accent colours what is **chosen, current or primary**: a filled primary button, a checked box, a switch that is on, the day picked, the page in the menu, a progress, links, the focus ring and one-series charts. It writes `data-accent="<id>"` on `<html>`, which maps the preset's tokens onto `brand`, `brand-foreground`, `brand-soft`, `brand-text`, `brand-glow` and `brand-wash`, and sets `primary`, `focus-ring` and `chart-series` to them.

- `violet-brand`, `indigo-brand`, `blue-brand`, `bloom-brand`, `lagoon-brand`, `aurora-brand`, `dusk-brand` and `golden-brand` are the fills; white (`…-brand-foreground`) is on them in light, the dark page's ink in dark.
- `…-brand-soft` is the tint of a chosen row or range; `…-brand-text` is the accent as text, 4.5:1 on every surface and on its tint.
- **Bloom** is a printed flyer's colours: the orchid `bloom-brand` on all of the above, and on a filled primary button and the application's mark only, a 110° gradient (`bloom-gradient-1` lilac → `bloom-gradient-2` pink at 50% → `bloom-gradient-3` tangerine) under a fine grain (Textures), with `bloom-brand-fill-foreground` on it. Its tangerine and mustard (`bloom-brand-wash-2`, `bloom-brand-wash-3`) are the backdrop's only, never a mark's or a text's.
- **Lagoon**, **Aurora**, **Dusk** and **Golden hour** (`golden`) are made as Bloom is: `<id>-brand` on all of the above, and on a filled primary button and the mark only a 110° gradient (`<id>-gradient-1` → `-2` at 50% → `-3`) under the same grain, with `<id>-brand-fill-foreground` (the dark page's ink) on it. Lagoon is a sea: cerulean; periwinkle → sky → aqua; under glass sky, aqua and sand. Aurora is the northern lights: fuchsia; sky → violet → magenta; under glass magenta, cyan and violet. Dusk is the sky after sunset: a quiet slate violet; lavender → mauve → peach. Golden hour is the light before it: a dusky rose; gold → apricot → rose; under glass rose, apricot and gold. Their `-wash-2` and `-wash-3`, and the gradients' gold, apricot, aqua and peach, are never a mark's or a text's.
- In a component, keep the neutral classes and add the accent's **after** them: `bg-primary text-primary-foreground accent:bg-brand accent:text-brand-foreground`; on a filled primary control also `accent:bg-(image:--brand-fill) accent:text-brand-fill-foreground`. With the neutral accent nothing changes.

### Glass

`data-material="glass"` on `<html>` turns surfaces to glass **by role**, over a still backdrop of three washes (`glass-tint-1…3`, or the accent's) on `glass-base`, under a faint grain (Textures):

- `glass-bar`: the sidebar and the top bar (`glass-bar` colour), not blurred: they stand on the still backdrop. `glass-card`: a panel, a card (`glass-card`), not blurred, a panel's edge lit at its top (`glass-edge`), a box in it `glass-raised`. `glass-tile`: a figure's tile (`glass-frost`), blurred 24px; in light, lit from above, with a glow of the accent from a corner that changes from tile to tile (`<accent>-brand-tile-glow`). `glass-float`: what floats, popovers, menus, dialogs, toasts, tooltips (`glass-float`), blurred the most (20px, saturate 150%), nearly opaque and **without sheen**: its grey text holds 4.5:1 with black (light) or white (dark) right behind it.
- The light (`glass-shine`) and the reflection of panels and tiles are corners of a set size: a wide panel is lit as a narrow one.
- Fields, rows and buttons stay solid. A blurred surface never holds a fixed child of its own (what floats from it goes to `document.body`), and never takes white text on ink.
- Under glass, `text-subtle`, `muted-foreground` and `positive` are a step stronger (`glass-text-subtle`, `glass-muted-foreground`, `glass-positive`), and the shadows deeper (`glass-shadow-subtle`, `glass-shadow-elevated`). A dialog's scrim is `glass-scrim`.
- Asked for less transparency or more contrast, glass becomes opaque and the backdrop plain.

### Charts

- One series: `chart-series`. Things compared, up to four, in this order and never recycled: `chart-compare-1` blue, `-2` orange, `-3` teal, `-4` pink. A fifth is `chart-muted`.
- Gains and losses as marks: `chart-positive`, `chart-negative`. On a heatmap, by size: `chart-gain-1…4` (teal) and `chart-loss-1…4` (red); the small end recedes toward the card, and every cell says its figure in its tooltip.
- A funnel's stages: `chart-funnel-1…5`, one hue stepping in lightness; only the last may recede.
- Grid `chart-grid`, axes `chart-axis`. A chart has a table or a legend for what colour alone would say.

### Code

`code-keyword`, `code-string`, `code-number`, `code-comment`, `code-function`, `code-namespace`, `code-type`, `code-builtin`, `code-operator` on the editor's `surface`, each 4.5:1; `code-selection` behind a selection.

## Type

- **Geist** (`sans`) for everything read; **JetBrains Mono** (`mono`) for what is typed exactly: ids (IT-1042), keys, code, logs, without ligatures or tracking (`->` stays two characters). Both are variable fonts served with the application, nothing from another origin.
- A few sizes, each for a role, the same on every page: `page-title` once a page (PageHeader); `section-title` for a panel; `figure` for a tile's number.
- **What a user reads or acts on is `body` (14px)**: running text, a row's content, an option of a list or a menu, a tab, a button from `sm` up, a toast's or a notification's words. What is typed in a field is `field-value`: 16px on a phone (a smaller field zooms the page in when it takes the focus), 14px from 640px.
- `small` (12px, in `muted-foreground`) only for what supports it: a caption, a description under a title, a table's head, a tile's label, the help and the error under a field, a timestamp, an inline button (`xs`); `field-label` in `text-secondary`; `badge`; `code` for ids, `code-block` (13px) for code and logs. A screen of data may ask for `small` rows (a `compact` table, a `compressed` list); nothing else is small by default.
- **Nothing under 11px** (`micro`: a count, a key, a chart's tick, an avatar's initials). A size written by hand is 11px, 13px for code, or a display figure of 18px and more: `check-source` refuses any other.
- Headings are set tighter than the text: `tracking-tight-heading` on h1, `tracking-snug` on h3, `tracking-body` on everything else.
- Figures that line up or change share one width: `tabular-nums` in tables, columns, lists of amounts, a chart's readings, counts and timers. A tile's large figure keeps proportional digits.
- A title that may wrap is balanced (`text-balance`), its description `text-pretty`. A title is semibold; a message's title (a toast, an alert) medium; bold only for the page's title and the application's mark. No uppercase labels: sentence case, as the words are written.

## Space and layout

- Every padding and gap is a step of `spacing` (4px); inside a small control, a half step (2px) may align what the eye sees. A page is padded `page-padding` (16px) on a phone and `page-padding-wide` (24px) from 640px; its column stops at `page-max-width` (80rem) unless the page asks the shell to be wide.
- The shell puts `page-gap` (24px) between a page's blocks: a page returns its blocks side by side, with no margins of its own.
- **Every section sits in a `Panel`**: `radius-2xl` corners, a `border` at 70%, `surface` at 50% (25% in dark) over `background`, its body padded `panel-padding` (20px). What is inside a panel has no second card around it; a nested box is a `PanelInset`: `radius-xl`, a fainter border, `surface-raised` at 60% (`glass-raised` under glass).
- Rows of a list or a table are apart by `border` at 40%.
- The top bar is `topbar-height` (56px). Controls are `control-height` (40px) at size md, 32px at sm, 24px at xs (inline on a line of text or a row).

## Shape and depth

- **One radius**, `radius` (14px); every corner is a multiple of it, chosen by size: `radius-full` for a badge, a state, a count, a switch, an avatar; `radius-sm` for a key or a tag on a line; `radius-md` for a 24px control, a chip, inline code; `radius-lg` for a 32–48px control, a field, a row of a menu; `radius-xl` for what floats beside its trigger, a toast, a nested box; `radius-2xl` for a section, a card, a dialog. A chart's marks keep their own small corners.
- **One recipe per role** (`src/lib/recipes.ts`): a section and every card that stands as one (`SECTION`: Panel's frame), what floats beside its trigger, a tooltip, a dialog, a toast, a row of a menu, the scrim, the two close buttons (24px in a toast or a chip, 32px in a dialog, a sheet, an alert). A new component names them.
- **A shadow means it floats**: `shadow-elevated` on a dialog, a menu, a popover, a toast, a sheet, the drawer. What sits in the page has a border, no shadow (a chosen card says it with its border). `shadow-subtle` lifts a control a hair. The sign-in card, alone on its page, is the one card that floats.
- **What is above what**: the page's own layers 0–30, what floats in the document's body 50, toasts 55, hints 60, the skip link 70.

## Motion

Calm, the same everywhere, and only where it says what changed.

- An entrance settles in about 300ms without overshoot (easeSoft, `cubic-bezier(0.22, 1, 0.36, 1)`, 320ms); a quick property change takes easeFast (`cubic-bezier(0.2, 0, 0, 1)`, 200ms; every `transition-*` class, 150ms); **what leaves is quicker** (easeExit, `cubic-bezier(0.4, 0, 1, 1)`, 150ms). A distance is a few pixels.
- What floats arrives with springSnappy (stiffness 380, damping 30, mass 0.5) and leaves with easeExit; a dialog grows from what opened it; a sheet slides with springSheet (400 / 38 / 0.85). Never a spring or a curve written by hand: take them from `motionTransitions`, or `ease-soft`, `ease-fast`, `ease-exit` in classes.
- A change of page fades the old page out (150ms) as the new one fades in and rises 6px (240ms); the shell stays still and in use. A change of look is one cross-fade of the whole page (260ms).
- **Reduced when asked**: movement goes, fades stay, loops (spinners, pings) stop. A click is answered at once; an animation never delays what was asked.

## Focus and interaction

- **One focus ring**, `focus-ring`, 2px solid, 2px away, on everything that takes the keyboard's focus. No component draws its own. A field that takes text has none: its caret and its border, which darkens on focus (to `brand` with an accent), show it.
- **What leads somewhere is a link** (`ButtonLink`, `TextLink`, `href` on menu items and tabs), even when it looks like a button: it opens in another tab with ⌘ or Ctrl. Only actions are buttons.
- **A `Hint`, never a `title`**, says what a control means or why it is disabled: shown on hover, keyboard focus and tap, read by screen readers.
- Every control is named: an icon alone has its label (`IconButton`), a field its label (`Field`), a table its name.
- **One dialog at a time**, drawn in the document's body, keeping the focus and giving it back. A review step goes inside the dialog it reviews.
- **Pressed, a button gives a little** (to 97%, where motion is allowed); a row, an option or a tab never moves, it lights up. Everything that acts shows the pointer. Busy, a button spins and says what it does.
- **Disabled is half its strength** (50%), with a Hint that says why.

## Iconography

- **lucide-react**, line icons at their 2px stroke, in `currentColor`, so an icon takes its text's colour. No emoji, no filled or duotone sets, no icon fonts.
- An icon is as tall as the words beside it: 12px in an xs button, 14px in sm, 16px in md and in a row of a menu, 20px in lg (Button sizes it); the shell's own (the top bar, the menu) are 18px. The same glyph in the same role is one size everywhere. Alone, it sits in an `IconButton` with a label.
- An icon never carries meaning alone: a status has its word, a check its label for screen readers.
- The application's mark is a monogram in a `radius-lg` square, `foreground` with `background` letters, the accent's fill (or Bloom's gradient) where there is one (`AppBrand`). Logos holds the favicon drawn so.

## Using the components

The components are ioiti-ui's, live: `window.IoitiUI` (React 19.3, both in `components/lib`). Wrap an application in `IoitiProvider` (theme, reduced motion, the application's name in every tab's title) and give it a `LinkProvider` for its router; `ToastProvider` shows toasts. Pages are made of `PageHeader`, `Panel`, `KpiGrid` / `KpiTile` (a `KpiStrip` under them), `StatusHistory`, `Table`, `Field` and the rest; the shell is `AppShell`, with the application's menu. Read each component's card for what it takes.

The stylesheet is Tailwind CSS 4: the tokens are classes (`bg-surface`, `text-muted-foreground`, `border-border`, `text-positive`, `bg-brand`), with the `dark:`, `accent:` and `glass:` variants. The theme is `.dark` on `<html>` (here, `data-theme="dark"` sets it).

## Not synced

- Values the token format cannot hold stay in `components/bundle.css`: the glass blurs and composite shadows (`--glass-blur`, `--glass-tile-blur`, `--glass-card-shadow`, `--glass-edge-shadow`, `--glass-float-shadow`, `--glass-glow`, `--glass-sheen`, `--glass-reflection`, `--glass-tile-light`, `--glass-tile-glow`), the backdrop's layers (`--glass-backdrop`), its grain and its `--glass-grain-opacity`, the gradient accents' `--brand-fill` and grain, the motion curves (`--ease-soft`, `--ease-fast`, `--ease-exit`) and Tailwind's own colour scales (emerald, red, amber, sky…), which some components use with their dark values beside them.
- The radius scale is derived: the classes compute `rounded-*` from `radius`, so change `radius` to change them all; `radius-sm…4xl` record the results.
- Not in the bundle: the code editors (`ioiti-ui/code`, CodeMirror), the React Router adapter (`ioiti-ui/react-router`) and the Vite plugin. Components without a card are still in `window.IoitiUI`.
