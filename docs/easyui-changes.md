# Changes made to EasyUI's components

The components of `src/components/ui/` and `src/lib/{utils,motion-tokens,chart-primitives,dashboard-chart-utils}`
come from [EasyUI](https://github.com/Surajmaurya1/easyui) (MIT License, Copyright (c) 2026 Suraj Maurya), at
the commits that `THIRD-PARTY-NOTICES.md` lists. `src/styles/tokens.css` is EasyUI's tokens, unchanged.

They were changed first for the admin interface of WATA, then for this package. Every change is marked
in the code by a comment that starts with `ioiti-ui:`; this file says what each is for. The copies are
kept close to their source otherwise: the linter checks only the rules of hooks in them.

## Adding another EasyUI component

```bash
npx shadcn@latest add Surajmaurya1/easyui/<slug>     # or copy src/components/ui/<Name>.tsx from its repository
node scripts/fix-imports.mjs src/components/ui/<slug>.tsx
```

Then read it before using it: some carry demo behaviour or imports of EasyUI's own site, and none may load
anything from another origin. Give every colour a light value in front of the dark one, check small text at
4.5:1 in both themes, draw its links with `useLinkComponent` (the application's link), mark each change
`ioiti-ui:`, list it below, export it from `src/index.ts`, and give it a demo in the gallery (its test fails
otherwise).

## Changes for every component

- **Light values.** EasyUI's components were made for a dark page. Every literal colour has a light value in
  front of EasyUI's, which stays behind `dark:` (`form`, `smooth-accordion`, `loader` hard-coded `#141414`,
  `#FAFAFA`…). Where a light value was under 4.5:1 (`velocity-toast`'s icons, `spring-select`'s error text,
  `button`'s danger variant, `drag-to-confirm`'s label, `sidebar`, `calendar`, `date-picker`), it was given
  a darker step. Nothing dark was changed by this.
- **One focus ring.** The keyboard's focus is the global rule of `design.css`, outside any layer so that it
  wins over the components' `outline-none`. The components' own rings (white ones, made for a dark page)
  are gone where they hid it.
- **Links are links.** A component that leads somewhere draws a real link, which a ⌘-click, a middle click
  or a right click opens in another tab (`isPlainClick` leaves such a click to the browser). The link is
  drawn by a component the caller gives (`linkComponent`, `as` for the breadcrumb, `LinkComponent` for the
  404), and by the application's link (`LinkProvider`) when it gives none.
- **Imports end in `.js`**, so that Node's ESM loader, which an application's tests may run the package
  with, finds them.

- **Accents.** Under a theme with an accent (`data-accent` on `<html>`, src/styles/accents.css), what is
  chosen, current or primary is drawn in the accent's tokens through `accent:` classes, each after EasyUI's
  own, which stay as they were: with the neutral accent, nothing changes. A filled button and the split
  button's primary (the accent's fill and a soft glow of it), a link button; a checked box, a radio, a switch
  on, a field and an OTP box in focus, a picker open; the day picked, its range and today's dot; the option
  under the pointer and the one chosen (`combobox`, `spring-select`, `spotlight-search`); a step done, the
  current one and the line between them; the tab shown, the part shown and the scroll's progress; a filter on,
  the rows selected, the sorted column and the boxes of `advanced-data-table`; the solid neutral badge; the
  count and primary action of `selection-basket`; `smart-comparison`'s toggle and featured plan; the time
  left of both toasts, an upload's progress, the sending spinner of `request-status`; `loader`, unless its
  `color` is given; the page shown in the sidebar and its dot; the traced links of `dependency-trace` (a node's
  health ring keeps its colour), the progress and nodes of `interactive-timeline` (EasyUI's blue), the
  heatmap's active cell. The tones (success, warning, danger, info) keep their colours: gain and loss are said
  by them. One-series charts and funnels take the accent through their tokens. Where the accent has a
  gradient (bloom), `button`'s filled variants draw it over the fill, under its grain, with the text it takes
  (`accent:bg-(image:--brand-fill) accent:text-brand-fill-foreground`). The split button's primary keeps the
  fill, as each of its two halves would start the gradient again, and so do the primary actions of
  `selection-basket` and `smart-comparison`, whose hover is the fill's own colour.
- **Glass.** Under the glass material (`data-material="glass"` on `<html>`, src/styles/glass.css), a surface
  turns to glass through a utility that does nothing otherwise, after EasyUI's classes, which stay: `glass-bar`
  for the sidebar and a `flysheet` pushing the page; `glass-card` for `stat-card`, the frames of `advanced-data-table` and `ai-agent-activity`,
  `smooth-accordion`, `request-status`, `airport-matrix-clock` and `recovery-ledger`; `glass-float`, the only
  one blurred, for what floats: the sidebar's drawer, `settle-modal`, `flysheet` (its children are drawn beside
  its panel, not in it), `spotlight-search`, `directional-tooltip`,
  `peek-card`, the popovers of `date-picker`, `combobox` and `spring-select`, `notification-bell` (its header
  clear on it), the `split-button` menu, the column list of `advanced-data-table`, the chart tooltip of
  `chart-primitives`, both toasts, `selection-basket`, `scroll-progress-nav`'s pill (not the phone's menu
  inside it, whose blur would see nothing but the pill), `dynamic-island` and `dependency-trace`'s status bar.
  None of these holds a fixed child of its own, which a blur would hold. The dialogs' scrims are lighter
  (`--glass-scrim`), and a filled button has the glass's glow. With the flat material, nothing changes.
- **Motion.** What floats moves as one, on the design's tokens (`src/lib/motion-tokens.ts`) in place of
  EasyUI's own values: arriving with `springSnappy` (the popovers of `date-picker` and `combobox`, whose
  520/38/0.7 is gone, `spring-select`, the `split-button` menu and `selection-basket`, whose springs
  overshot, `notification-bell`'s panel, `spotlight-search`, `directional-tooltip`, `peek-card`, the
  sidebar's tip, both toasts), leaving with `easeExit` (150 ms, quicker than it came). A sheet and the
  drawer slide with `springSheet` (`flysheet`'s 380/38/0.9 and `sidebar`'s 420/36/0.8 were near it), the
  sidebar's width, pill and dot too. A scrim fades in with `easeFast` and out with `easeExit` (EasyUI's
  took 0.15 s, 0.2 s, 0.32 s or framer's default). The layers fixed over the page carry `over-page`
  (`src/styles/motion.css`: `settle-modal`, `flysheet` and `spotlight-search`'s layers, the sidebar's drawer
  and its tip), so that a change of page, drawn above the whole document, never covers them: named for view
  transitions while one plays, and only then, as a name at rest would make the layer the root of its glass's
  backdrop, which would then blur nothing of the page. The sidebar's trigger gives when pressed (`motion-safe:`). What a component does of
  its own (a box drawing its mark, a switch stretching, the island growing) keeps EasyUI's motion.

## Component by component

- `advanced-data-table`: `selectable` (default `true`), to hide the row boxes of a table with no bulk
  action; a column's `defaultHidden` (shown once picked in the column list); `emptyTitle` and
  `emptyDescription`, and "Clear filters" only while a search or a filter is active; cells padded 20 px
  instead of 24 (seven columns fit a 1440 px screen); `initialSearch` and `initialExpandedRowIds`, for a link
  that lands on one row found and opened (`?find=<id>`); `initialFilters`, for a link that opens the table
  filtered; a selection the page holds (`selectedRowIds`, `onSelectionChange`); `isRowSelectable` (a row that
  cannot be chosen has no box, and the header's box leaves it out, disabled when no row of the page can be
  chosen); `selectionBasket` (the bulk actions in `selection-basket`, after the table's frame and outside its
  `overflow-hidden`, its "All" every selectable row the search and filters leave, on every page; the table's
  own counter and bar not shown then), each row's box named after `rowLabel`; `expandOnRowClick` (a click
  anywhere on a row opens it, except on a link, a button, a field or the end of a selection of its text; the
  arrow stays for the keyboard), `singleExpand` (one row open at a time) and `rowLabel` (each arrow named
  "Open …" after its row, instead of all "Expand row details"); a search goes back to the first page, where
  what it found starts; its boxes (rows, cards, header, column list) are `draw-checkbox`, not the browser's, the
  header's partly checked state its bar. Its filters are Elastic UI's filter group (`EuiFilterGroup`,
  `EuiFilterButton`), written from its documentation (none of its code), where EasyUI showed every option of
  every column at once: one bar of buttons joined together; a column's options in a list that opens from its
  button, each ticked or not with the rows it would leave under the search and the other filters, a search of
  its own from eight options, the button saying how many options there are or how many are ticked (EUI's
  `numFilters` and `numActiveFilters`); a column of one or two options as buttons pressed one at a time, an
  on/off pair (`aria-pressed`); `filterDisplay` (`auto`, `list`, `toggle`) to choose; "Clear filters" after
  them. The list is drawn in `document.body` at fixed coordinates (the frame's `overflow-hidden` cut it),
  following its button when the page scrolls or the window changes size (a phone's keyboard does both: closing
  then closed it under the finger typing in its search); the focus goes in, on its first option when a finger
  opened it (not its search, whose keyboard would cover it), and Escape or a Tab past its ends gives it back to
  its button. The search's and the filters'
  rules are shared with those counts; `useDataTable` gives `setFilter` and `countOptions`.
- `breadcrumb`: its text in `text-muted-foreground` and `text-foreground` (`neutral-500` was 4.54:1 on the
  light background, a hair from the limit); `wrap={false}` keeps a trail on one line, each step cut short with
  an ellipsis, the last one first.
- `settle-modal`: drawn in `document.body` (a dialog opened from a table cell took the cell's alignment and
  wrapping); the focus moves into the dialog, stays in it and returns to what opened it; an `xl` size
  (`max-w-2xl`) and a `full` one (`max-w-[110rem]`, two versions of something side by side); a panel no
  taller than the screen, what does not fit scrolling inside it. One calm entrance: the panel grows from
  what opened it (its transform origin the middle of the control the focus was on), 0.96 to 1 and 6 px
  of travel with `springGentle`, without EasyUI's overshoot (0.94, 1.02, 1) and its content with it
  rather than a layer after it.
- `otp-input`: `id`, given to the first box for a `<label htmlFor>`. A box no longer keeps one character:
  several digits arriving in one box (a keyboard's suggestion) go on from it, a whole code (a password
  manager's or a phone's autofill) fills every box as a paste does, a digit typed beside the one a box holds
  replaces it, a letter is ignored. Its pop is a 0.25 s tween: framer-motion 13 animates a spring between two
  keyframes only, and EasyUI's `[1, 1.25, 1]` threw at each digit in development. Given a `value`, the
  component lays the digits out from the first box, so a box left empty moves them: leave it uncontrolled,
  and make it again to empty it.
- `sidebar`, `animated-tabs`: an entry or a tab with an `href` is a link (`linkComponent`); a plain click of
  a tab still goes through `onChange`, and a tab without `href` is `type="button"`. The sidebar's
  `onActiveChange` is optional.
- `button`: `buttonClassName`, the classes of a variant and size, for a link drawn as a button (`ButtonLink`).
- `drag-to-confirm`: the hidden fallback button is out of the Tab order (it was a stop nobody could see, on
  which Enter confirmed); ArrowRight no longer confirms, only Enter and Space.
- `velocity-toast`, `undo-toast`: `wrapperClassName`, to lift a toast above a bar fixed at the bottom.
  `velocity-toast`'s `onExitComplete`: once it has left, its exit played, `ToastProvider` shows the next
  one (it took the toast away in the render that began its exit, which never played).
- `motion-tokens`: `springSheet` (a sheet, the drawer, the sidebar) and `easeExit` (whatever leaves); the
  stylesheets have its curves too (`src/styles/motion.css`), a test holding them the same.
- `stretch-switch`: named by its label and described by its description (`aria-labelledby`,
  `aria-describedby`): a screen reader said only "switch, on".
- `form`, `animated-tabs`, `smooth-accordion`: the literal grey `#6B6B6B` (3.6:1 on the dark surface)
  replaced by `text-muted-foreground`; hints at 12 px instead of 11.
- `flysheet`: EasyUI's `sheet`, renamed, with what Elastic UI's flyout (`EuiFlyout`) does, written from its
  documentation (none of Elastic UI's code). A side sheet's `size` (`sm`, 22 rem; `md`, 26 rem, EasyUI's;
  `lg`, 40 rem; or pixels), `minWidth` (280 px) and `maxWidth`, within EasyUI's 88% of the window.
  `resizable`: its inner edge dragged, or the arrow keys on it (a focusable separator with its value; Shift
  for 50 px, Home and End for its narrowest and widest), `onResize`; the width chosen stays while the page is
  open. `type="push"`, from a window `pushMinWidth` wide (1024 px): the page pushed aside by the body's margin
  (the shell's row narrows with it), `--flysheet-push-left` and `--flysheet-push-right` set on `<html>` for
  what an application fixes to the window; a region of the page, not a dialog: no backdrop, the focus free,
  no slide in; narrower, it is drawn over the page. `modal={false}`: no backdrop, the page in use, Escape
  only while the focus is in the sheet. `closeOnOutsideClick` (its backdrop's click by default; a click on
  the page when asked, never one on its trigger). A child sheet, a `Flysheet` in another's content: drawn in
  its parent's layer (one dialog, one backdrop), beside it while the window has room for both, over it
  otherwise, at least as wide and the parent `inert`; it takes its parent's side and mode, is a group named
  by its title, and closes before it on Escape and with it (`reason: 'parent'`). `padding` of the header,
  body and footer; `closePosition="outside"` (inside while a child is beside it, which it would cover); why
  it closed, given to `onOpenChange` (`close-button`, `escape`, `outside-click`, `drag`, `trigger`,
  `parent`). The trigger says whether the sheet is open (`aria-expanded`, `aria-controls`) and closes it too.
  The dialog is the layer, not the panel, as `settle-modal`'s (a child beside the panel is in it), named by
  its title only when it has one (EasyUI pointed at an id that might be missing), by `aria-label` otherwise;
  the focus held from the document, as `settle-modal` holds it, and given back only while it is in the
  sheet; a sheet that leaves the page in use does not take it when the page opens with it. Escape closes
  the last sheet that holds the page or the focus, not what is open in it (a list, a menu or a picker,
  expanded, or another dialog). The close button in the design's greys (EasyUI's `neutral-400` was 2.5:1 on
  white), its own focus ring gone; the description in `text-muted-foreground`; the scrim lighter under glass.
- `draw-checkbox`: the package's `Checkbox` (`src/index.ts` exports it under that name, with its props as
  `CheckboxProps`); `form`'s own box is gone. The input lies over the box, transparent, and takes its clicks
  and the design's focus ring: EasyUI's was `sr-only`, which clipped the ring, and the box passed its clicks on
  through `document.getElementById`, which a table row took for a click on itself. The input is `indeterminate`
  when the box is (EasyUI drew the bar only), which screen readers say. Named by its label and described by its
  description (`aria-labelledby`, `aria-describedby`), as `stretch-switch`: the `<label>` holding both made one
  name of them. The colours are classes, EasyUI's tokens and the accent's after them (framer animated them as
  inline styles, which no class outranks), framer animating only the pop; the box is level with its label's
  first line only beside a label (alone in a table's cell, nothing above it); the description a hint of the
  form (12 px, `text-muted-foreground`); drawn at once, without the pop, where motion is reduced.
- `not-found` (EasyUI's 404): a `<section>` named by its heading, not a `<main>` (the shell has one), drawn in
  the page's area rather than filling the screen; no `<title>` or `<meta name="robots">` (the page names its
  tab as every page does); light values for the text, the heading's gradient, the address chip, the buttons
  and the suggestions; `ResizeObserver` and `matchMedia` used only where they exist (jsdom has neither).
- `scroll-progress-nav`: a part with an `href` is a link: a plain click scrolls to it and writes it in the
  address in place (`history.replaceState`, no step more to go back through); a part is scrolled into view in
  its container too, so that its `scroll-margin-top` keeps it clear of a sticky nav; at once when motion is
  reduced; from a tablet up the parts are a row that scrolls sideways when wider than the page, the current
  one kept in view, with room for the focus ring; the phone's menu centred under the pill and as wide as its
  longest part; `aria-current` on the current part, `aria-expanded` on the phone's toggle, the parts' numbers
  hidden from screen readers, and a `label` (default "Table of contents").
- `interactive-timeline`: a `warning` status (amber); the status badge only for an item with a `statusLabel`
  (EasyUI printed the raw status on every item); `defaultExpandedIds`; a `label` that names the list, and no
  landmark region (a page may open several); an item with nothing but its title and time has no fold; its
  note wraps.
- `selection-basket`: a `sticky` mode (at the bottom of the screen while its list is on it, resting under the
  list past it, so that it never covers what follows); an action with an `href` is a link; an action can be
  `disabled` with a `title` saying why, in a tooltip on a wrapper that takes the focus the disabled button
  cannot; `noun` ("2 files selected"); `allSelected` (EasyUI compared the counts, wrong once a search hides a
  selected row); the count's circle grows with three digits; the bar alone scrolls on a narrow screen (an
  inner scroll cut the focus ring).
- `notification-bell`: an entry's `detail` (a second line), `href` (a link: a plain click marks it read and
  closes the panel) and `tone` (its dot's colour; only `danger` pulses, EasyUI pulsed every unread one); a
  `footer` and a `triggerClassName`; Escape closes the panel and gives the bell the focus again; the panel is a
  dialog named "Notifications", across the screen under the top bar on a phone (centred on the bell, it went
  past the edge).
- `spotlight-search`: EasyUI's site imports and own entries removed; an entry's `href` makes it a link,
  followed with Enter too (`onNavigate`), and its `keywords` find it; every word typed must be in an entry;
  `onQueryChange`, `limit` (50 listed, the others found by typing, said under the list) and `label`; a
  combobox over a listbox with `aria-activedescendant`; the focus given back on closing; each entry shows what
  it is and its category.
- `combobox`: `id` on the trigger for a `<label htmlFor>` (a `<label>` around it passed the clicks on its
  options to the trigger, which opened again); named by its label, not by its placeholder; placeholder,
  description and empty text a darker grey in light.
- `directional-tooltip` (under `Hint`): its trigger's own ref read from its props, where React 19 keeps it (EasyUI
  read `element.ref`, which React 19 removed and which logged an error at every render); drawn in
  `document.body` at fixed coordinates beside its trigger (a
  table's overflow cut it), on the other side when there is no room, and inside the screen; shown on a tap
  too, hidden by Escape, a tap elsewhere or a scroll; its arrow points at the trigger's middle, also when the
  tooltip was moved to stay on the screen; its text always in the page for screen readers
  (`aria-describedby`), the drawn tooltip hidden from them; nothing drawn, said or added to its trigger when
  its content is empty, so that a field keeps its wrapper, and its focus, while a hint comes and goes;
  `wrapperClassName`; long text wraps within the screen.
- `recovery-ledger` (a configuration's previous versions): an entry opens from a button (`aria-expanded`)
  whose box covers its header (EasyUI's card took clicks only), and one without details does not open; the
  entry opened can be held by the page (`expandedId`, `onExpandedChange`); `details.content` (any node: the
  changes a restore would make), `reference` (a name in the footer, a file's), `timestamp` optional, `title`,
  `countLabel`, `restoreLabel`, `currentLabel`; Restore only calls `onRestore` (the page asks first); an
  ordered list; the timeline's line through the pips (it ran 5 px to their right).
- `smart-comparison` (things compared side by side): a table for screen readers (rows, column and row
  headers, a group per category) drawn as EasyUI's grid, one column per plan whatever their number (EasyUI's
  grid had three); a plan's `href` (its name a link) and `accent` (a colour before its name: its colour on a
  chart); a feature's `keys`, its values as text for "differences only" (React nodes cannot be compared);
  `label`, `matrixTitle`, `countLabel`, `searchPlaceholder`, `diffLabel`, `emptyText`; a plan's button only
  when it does something; `aria-pressed` and `aria-expanded` on the toggles.
- `activity-heatmap` (a calendar of results, a weekday × hour grid): `diverging`, signed values on two scales
  (`--chart-gain-*`, `--chart-loss-*`), the steps of size counted on gains and losses together, the best and
  the worst said above it, the legend from the largest loss to the largest gain; `format`, `summary`,
  `emptyText` (a cell with nothing is not a cell of zero), `legend`; a line under each cell's value
  (`HeatDay.detail`, `details`); in hours mode, `hours` (the columns), as many rows as `rowLabels`, cells 64 px
  wide at most; in calendar mode, `startDate` (no day before the period), and the first column's month gives
  way to the next one when that starts within three weeks; dates written in full ("Wed, 22 Oct 2026"); the
  best and the worst each on one line; the cell under the pointer found again (EasyUI took the labels' room
  off twice); the keyboard starts on the first cell there is; small text at 4.5:1 in both themes.
  `chart-primitives`: measured once where there is no `ResizeObserver` (jsdom).
- `animated-number` (`SignedValue`'s `animate`): `text`, the value as the application writes it (sign,
  currency and %), whose digits roll and the rest stays; read by screen readers as that text, the columns of
  digits hidden from them; plain text when motion is reduced; the tabular figures of the design's font
  (EasyUI's monospace digits were 0.58 em wide); every character in a box clipped by `clip-path`, which keeps
  the text's baseline (with `overflow: hidden`, digits stood higher than a sign beside them); colour
  inherited (EasyUI's was white).
- `request-status` (EasyUI's `payment-status`; the card that follows an action asked from a page): the steps
  of what was asked rather than of a payment (`processing` asked, `verifying` sent and waiting for its answer,
  `success`, `failed`, `unknown` for no news; `refunded` gone), each with the caller's `title` and
  `description`; `subject` (EasyUI's amount), `figures` (its receipt and transaction details), a copied
  `reference` and one `link`; `onDismiss` and its close button; no Retry, other payment method, receipt or
  download: the card acts on nothing; laid out in a row, the badge beside the words (docked at the edge of the
  screen, EasyUI's centred column took half a phone's height); read out as it changes (`role="status"`); its
  spinners still where motion is reduced. Renamed with its types (`RequestStatus`, `RequestLifecycleStatus`,
  `RequestStatusFigure`, `RequestStatusProps`).
- `live-line-chart` (a value as it arrives): `initialPoints`, values known with their own times (EasyUI spaced
  them `intervalMs` apart up to now); `formatTick` and `formatChange` (the change since the window's start in
  the caller's words: EasyUI gave a percentage of the first value ever pushed); a zero line while zero is in
  view; times in minutes from two of them ("−15 min"); a frame only when the line has moved half a pixel or
  something changed (EasyUI drew 60 frames a second); drawn without an `IntersectionObserver` where there is
  none; the status colours for the change (emerald-500 and rose-500 are under 4.5:1 on white).
- `funnel-chart`: the stages in `--chart-funnel-1..5`, one hue (EasyUI mixed indigo and teal); a stage's
  `dropLabel`, what was lost on the way to the next one; `summaryLabel`, `noun` (EasyUI's "Users") and
  `emptyText`; a stage that loses nothing says "0%" (EasyUI wrote "−0.0%"); the loss in the negative colour
  (rose-500 is 3.7:1 on white); muted text at 4.5:1 in both themes.
- `stat-card`: the look of the tiles it sits among (`KpiTile`: border, surface, padding, type sizes; EasyUI's
  card was white, ringed and shadowed); `toneOf`, the headline's colour by the value shown, the scrubbed one's
  too; the change pill only when the caller gives what it is from (`previous`, `delta`): EasyUI worked one out
  from the line's two ends, which means nothing for a value that changes sign; the pill in the status colours
  (emerald-600 on its pale pill was 3.6:1).
- `undo-toast`: the time left kept at each frame, so that a pause takes up where it stopped and the bar shows
  what is left of the whole (after a pause, EasyUI's went back to full); the caller's `onDismiss` through a
  ref (a new one at each render of the caller restarted the countdown); paused while the keyboard is in it, as
  under the pointer.
- `split-button`: the primary action and an option may have an `href` (a link; an option chosen from the
  keyboard is followed as a click would follow it); an option's `description` (a line under it) and
  `tone: 'danger'`; `icon` and `menuLabel` (EasyUI named the chevron "More <label> options"); the option the
  arrows are on announced (`aria-activedescendant`: the menu has the focus); a lighter shadow in light.
- `peek-card` (under `PeekLink`): reworked around EasyUI's card. EasyUI's wrapped the trigger in a second tab
  stop and opened on any click, which also followed the link inside: here the trigger keeps its own focus and
  click; the card opens on hover (with a moment to move into it), on keyboard focus (not on a click's) and on a
  first tap with a touch screen, whose link is then followed by a second tap or by the card's own (`href`); it
  is drawn in `document.body` at fixed coordinates, centred on the trigger and kept in the window (a table's
  overflow cut it), closed by Escape, a tap elsewhere or a scroll; what it shows is the caller's, read once it
  opens (EasyUI's payment card is gone); the trigger described by it (`aria-describedby`).
- `ai-agent-activity`: an item that opens is a button (`aria-expanded`; EasyUI's was a div taking clicks
  alone); its `statusLabel` in words and its `timestamp` (EasyUI's item had one and never showed it) beside its
  duration; the header's `summary`, and `inputLabel` / `outputLabel` (EasyUI's "Parameters" and "Output
  Result"); arguments as JSON with their lines kept.
- `dependency-trace` (a map of services): a node's health as a ring, an icon and a word, never colour alone
  (`status`, `statusLabel`, `detail`); its whole name under it (EasyUI cut names to seven letters inside the
  circle); an arrow from what calls to what is called, and each link's name while traced; nodes the keyboard
  reaches and traces, Enter or Space keeping a trace as a click does (`aria-pressed`); the status bar says what
  the traced node calls and what calls it; `width`, `height` and `label`.
- `airport-matrix-clock`: the caller's cities, each with its IANA zone (EasyUI's list of 32, its country and
  city selectors and its add and remove buttons are gone); `title` (null for none), `footer` and a `sm` size
  for the side of a page's header.
- `animated-file-upload`: `arrange`, the order the files are handled in, read before they are listed;
  `sequential`, one file after the other (EasyUI started them all at once); a handler may answer with a link to
  what the file became, shown once done; `workingLabel` and `doneLabel`; an error wrapped whole and announced;
  the drop zone named by its words, its colours by classes (a light value in front of EasyUI's, which framer
  animated as dark ones only).
- `dynamic-island` (a live pill in a top bar): reduced to its collapsed and expanded states with the caller's
  content in both (`compact`, `children`, `label`); its profile and share states, avatar, greeting and social
  links are gone. The pill is a button that keeps its place in the top bar, and the island grows from it
  (shared `layoutId`) over the page from the pill's left edge, across the screen under the top bar on a phone,
  so that the bar keeps its height; the keyboard follows it in and back out; a dialog over the page takes its
  own clicks and its Escape, which starts in it.

## ioiti-ui's own changes

What the package changed in the copies, beyond the original interface:

- **The application's link.** The thirteen components that draw a link (`sidebar`, `animated-tabs`,
  `selection-basket` and through it `advanced-data-table`, `notification-bell`, `split-button`,
  `request-status`, `smart-comparison`, `peek-card`, `spotlight-search`, `animated-file-upload`, `breadcrumb`,
  `not-found`) fall back to the link of `LinkProvider` when they are given none; their own props still win.
  `spotlight-search` follows an entry chosen with Enter through the application's router when it is given no
  `onNavigate`, and its placeholder is "Search…" (EasyUI's spoke of its own site).
- **jsdom.** The sidebar asks `matchMedia` only where it exists.
- **Defaults that were the original's usage.** `stat-card`, `live-line-chart` and `activity-heatmap` (one
  scale) draw in the series blue (`var(--chart-series)`) unless given a colour: the original pages always gave
  it, and EasyUI's indigo and emerald belong to no palette of the design.
- **`selection-basket` in `inline` mode** keeps to its container's width, its bar scrolling inside it on a
  phone, as the `sticky` mode does.
- **Gone:** `NotFoundDemo` (it led to EasyUI's site); `payment-status`'s name (above).
