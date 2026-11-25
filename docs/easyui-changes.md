# Changes made to EasyUI's components

The components of `src/components/ui/` and `src/lib/{utils,motion-tokens,chart-primitives,dashboard-chart-utils}`
come from [EasyUI](https://github.com/Surajmaurya1/easyui) (MIT License, Copyright (c) 2026 Suraj Maurya), at
the commits that `THIRD-PARTY-NOTICES.md` lists. `src/styles/tokens.css` is EasyUI's tokens, unchanged.

They were changed first for the admin interface of WATA, then for this package. Every change is marked
in the code by a comment that starts with `ioiti-ui:`; this file says what each is for. The copies are
kept close to their source otherwise: the linter checks only the rules of hooks in them, and what a screen reader
and a keyboard need (the `jsx-a11y` rules of `.oxlintrc.copies.json`, as the package's own code).

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
  are gone, and since 0.18.0 the grey ones too, which drew a second ring beside the design's (`sidebar`,
  `breadcrumb`, `calendar`, `date-picker`, `alert`, `stepper`, `drag-to-confirm`); `check-source` holds it. A
  field that takes text has none: its caret and its border show its focus. A control's `title`s are Hints
  (`interactive-timeline`, `advanced-data-table`, `notification-bell`, `scroll-progress-nav`, `selection-basket`,
  `not-found`), named by `aria-label` where the title was their only name.
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
  gradient (bloom, lagoon, aurora, dusk, golden), `button`'s filled variants draw it over the fill, under its grain, with the text it takes
  (`accent:bg-(image:--brand-fill) accent:text-brand-fill-foreground`). The split button's primary keeps the
  fill, as each of its two halves would start the gradient again, and so do the primary actions of
  `selection-basket` and `smart-comparison`, whose hover is the fill's own colour.
- **Glass.** Under the glass material (`data-material="glass"` on `<html>`, src/styles/glass.css), a surface
  turns to glass through a utility that does nothing otherwise, after EasyUI's classes, which stay: `glass-bar`,
  not blurred (it stands on the still backdrop), for the sidebar and a `flysheet` pushing the page (the sidebar's
  tip is drawn in `document.body`, and the sheet's children are drawn beside it); `glass-card` for `stat-card`, the frames of `advanced-data-table`, `ai-agent-activity` and `ai-response`,
  `smooth-accordion`, `request-status`, `airport-matrix-clock` and `recovery-ledger`; `glass-float`, blurred
  the most and without the sheen of the others, for what floats: the sidebar's drawer, `settle-modal`, `flysheet` (its children are drawn beside
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
  its own (a box drawing its mark, the island growing) keeps EasyUI's motion.
- **Text by its role** (0.22.0). Every size is one of the design's (`design-system/guide/README.md`, Type): what is
  read or acted on (an option, a row, a message, a label of a choice, a button from `sm`) is `text-sm`; what is typed
  in a field `text-base sm:text-sm`; what supports it (a caption, a description, a timestamp, a group's heading) is
  `text-xs`; a count, a key, a chart's tick or an index 11 px, never less. EasyUI's 9, 10, 10.5, 11.5, 12.5, 13, 13.5,
  14.5 and 15 px, and its `text-[12px]` and `text-[14px]` for Tailwind's own sizes, are gone; `ai-response`'s headings
  are `text-lg`, `text-base` and `text-sm` over a 14 px answer. `check-source` holds it.
- **Colour by role** (0.22.0). Every colour is one of the design's tokens, chosen by role (`design-system/guide/README.md`,
  Colour): EasyUI's 40 hex values (`#FAFAFA`, `#141414`, `#0E0E0E`, `#1F1F1F`, `#A1A1A1`…), its `neutral-*` steps and
  its `rgba()` are gone, so that a caption is the same grey, a field the same surface and a line the same line in every
  component, in both themes (the copies' dark cards and fields, `#141414` and `#0E0E0E`, are the design's `surface`).
  The tones are the design's (`src/lib/recipes.ts`): danger is `negative` everywhere (rose and palette reds are gone),
  success `positive`, warning `warning`, info `info`; EasyUI's blue indicator is `accent-blue`. `check-source` holds it.
- **One surface per role** (0.22.0). What floats beside its trigger, a tooltip, a dialog, a toast, a menu's row, the
  scrim and the close buttons take the recipes of `src/lib/recipes.ts`: one radius, one border, one shadow
  (`shadow-elevated`; `shadow-lg`, `shadow-2xl` and hand-written shadows and glows are gone), one scrim (`bg-black/50`
  with a 12 px blur, `/60`, `neutral-950/30`… were five). Nothing in the page has a shadow. Radii follow the size of what
  they round (bare `rounded`, 4 px, and `[8px]`, `[10px]`, `[20px]`, `[26px]` are gone). Disabled is 50 % (it was 25,
  30, 40, 50 or 60 %); everything that acts shows the pointer and a button gives a little when pressed (rows never
  move). Icons are `size-*`, one size per role, at lucide's stroke (`ai-response`'s own icons are lucide's).
- **Motion on the tokens** (0.22.0). No spring, curve or duration written by hand where a token says it
  (`motionTransitions`): the springs of `badge`, `breadcrumb`, `stepper`, `dynamic-island`, `advanced-data-table`,
  `ai-agent-activity`, `stat-card`, and the bounces of `chart-primitives` and `funnel-chart`, which overshot, are gone
  (`not-found`'s illustration keeps EasyUI's, as its colours and glows: it is drawn as it was, by choice); `transition-all` is the properties that change. Reduced motion follows IoitiProvider
  (`useReducedMotionConfig`), not the system alone, and `dependency-trace`'s pulse stops with it.
- **No blur but the design's** (0.22.0). Only `glass-tile` and `glass-float` blur what is behind them (and the scrim, a
  hair): `scroll-progress-nav`'s pill lost its `backdrop-blur-md` (opaque, glass under the glass material).
  `not-found`'s folder of frosted glass is EasyUI's drawing, kept as it was by choice. `check-source` refuses any other.
- **Type's finish** (0.22.0). No uppercase eyebrows (sentence case); a title semibold, a message's title medium; figures
  that change `tabular-nums`; "…" and ’ in what is shown; Badge, DataTable, AIAgentActivity and the code editors in the
  design's faces (they read `var(--font-sans)`, which `tokens.css` names after faces the package does not register).
- **Narrow screens** (0.4.3). Nothing of a copy is wider than its place, where on a phone the page scrolled
  sideways. The charts measured to their width (`bar-chart`, `donut-chart`, `funnel-chart`, `activity-heatmap`,
  `live-line-chart`, `stat-card`'s line) take it from their container alone (`contain-inline-size` on the box
  `chart-primitives`' `useElementWidth` measures), never from what they drew at the width measured before: drawn
  640 px wide at first, a chart in a grid's single column held the column open at that width and stayed so. A
  chart's table for screen readers (`bar-chart`, `donut-chart`, `funnel-chart`) is in a box of its own made 1 px
  wide (`sr-only`): a table is never narrower than its rows, and the table itself stood as wide as its text. What
  scrolls sideways holds what it scrolls (positioned), the words of its cells for screen readers included:
  `advanced-data-table`'s table and filters. `animated-tabs`' row is never wider than its container, scrolling in
  itself without a bar where its tabs do not all fit, each name on one line. `animated-number` keeps its text for
  screen readers with it (positioned).

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
  rules are shared with those counts; `useDataTable` gives `setFilter` and `countOptions`. A column whose value
  is an array (a rule's tags) is filtered by any of its values, each option counting the rows that have it
  (0.9.0). A sortable column's header says how it sorts (`aria-sort`). The search, the filters, the sort and
  the page can be held by the page (`state`, told of each change by `onStateChange`), for an address that
  keeps them (0.9.0). A table wider than its box shows a thin scrollbar (it had none: the columns past the edge
  could not be found), and the rows per page list the page's size when it is not one of their own (0.11.1).
- `breadcrumb`: its text in `text-muted-foreground` and `text-foreground` (`neutral-500` was 4.54:1 on the
  light background, a hair from the limit); `wrap={false}` keeps a trail on one line, each step cut short with
  an ellipsis, the last one first. Each step's name carries `data-crumb-name` (0.4.2), which the top bar's trail
  measures whole to know whether it fits.
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
- `animated-tabs`: the indicator slides when the tab changes, only (`layoutDependency`): a resize, of a sheet it
  is in, dragged, moved it after its tab with a spring, trailing behind (0.12.0).
- `sidebar`, `animated-tabs`: an entry or a tab with an `href` is a link (`linkComponent`); a plain click of
  a tab still goes through `onChange`, and a tab without `href` is `type="button"`. The sidebar's
  `onActiveChange` is optional.
- `sidebar`: an entry with children and an `href` is a link, as one without, and a chevron beside it (a button
  of its own, `aria-expanded`, `aria-controls`) opens it on its children; EasyUI's was a button that only opened.
  The entry that is, or holds, the page shown opens at each page shown (EasyUI's, at the first), those the reader
  opened staying open. In the rail, the entry is a button that shows its pages in a menu beside it (`DropdownMenu`,
  its own page first unless a child is at its address, the page shown `current`), and keeps the pill while it
  holds the page shown (0.20.0; 0.18.0 made it its link alone, EasyUI's unfolded the sidebar). Closed, it shows a
  dot when a child has a badge, in the gravest tone among them.
- `sidebar`: a section placed at the foot (`place: "footer"`) is drawn above Collapse, without a heading; its
  entries are lit by their own hover (the sliding hover box is measured in the list).
- `sidebar`: `badgeTone` on an entry and a child (`SidebarBadgeTone`: `neutral`, `warning`, `danger`): a badge
  that says a state ("Degraded", "2 open") is in its tone's text colour with a dot, without the count's grey
  pill. The tip naming an entry of the folded sidebar is drawn in `document.body`, as every layer: a sidebar
  that took a blur, a filter or a transform would be the tip's containing block, its overflow cutting the tip.
- `sidebar`: badges out of sight are said (0.23.0). In the rail, an entry's badge is a dot on its icon in its tone
  (its children's gravest for an entry with children), its words in its name ("Orders, 38") and in its tip, after
  the entry's name, in its tone; EasyUI's rail drew no badge. A folded section's dot takes the gravest tone among
  its entries' badges and their children's (it was grey, and only for its entries' own). A screen reader hears
  ", with counts", ", with a warning" or ", with something wrong" after what holds them.
- `sidebar`: `collapsedStorageKey` keeps the reader's choice of the rail in `localStorage` (0.23.0), read once as
  it is first drawn; `defaultCollapsed` until a choice is kept, nothing kept without it or while `collapsed` is
  given.
- `notification-bell`: its panel is a layer in `document.body`, placed under the bell by `useAnchoredLayer`
  (`src/lib/anchor.ts`), which gives it its keys: a press elsewhere, Escape and a Tab past its ends close it, and
  the focus goes into it and back to the bell (EasyUI's closed it at a mouse press only, and left the focus on
  the bell). Drawn in the top bar, it would be held by a blur, a filter or a transform the bar took, its own
  blur seeing nothing of the page; on a phone it spans the screen but its edges, as before.
- `button`: `buttonClassName`, the classes of a variant and size, for a link drawn as a button (`ButtonLink`).
  An `xs` size, for an action on a line of text or a row of a table; its icons as tall as its words at every
  size (12, 14, 16 and 20 px; an icon given its own `size-*` keeps it), where EasyUI left them at 24 px; its
  words cut short with an ellipsis where it is held narrower than them, its icons kept whole (0.13.0).
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
- `flysheet`: its title as large as a page's (`text-2xl`, bold) (0.13.0).
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
  `Date` timestamp said from now (`RelativeTime`, 0.10.0: EasyUI wrote its day only), a string as given; a
  `footer` and a `triggerClassName`; Escape closes the panel and gives the bell the focus again; the panel is a
  dialog named "Notifications", across the screen under the top bar on a phone (centred on the bell, it went
  past the edge).
- `spotlight-search`: EasyUI's site imports and own entries removed; an entry's `href` makes it a link,
  followed with Enter too (`onNavigate`), and its `keywords` find it; every word typed must be in an entry;
  `onQueryChange`, `limit` (50 listed, the others found by typing, said under the list) and `label`; a
  combobox over a listbox with `aria-activedescendant`; the focus given back on closing; each entry shows what
  it is and its category. Drawn in `document.body`, as every dialog: drawn where it was used (a top bar), it was
  held by what made that place a stacking context or the containing block of what is fixed (a blur), the page
  drawn over it, its scrim cut to the bar.
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
  when it does something; `aria-pressed` and `aria-expanded` on the toggles; its search's focus shown by its
  border, as `form`'s input shows it (only the ring showed it).
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
  ref (a new one at each render of the caller restarted the countdown); the time runs on under the pointer
  (EasyUI's stopped there), and stops only while the keyboard is in it; nothing stops it as it opens (a pause
  from its last time outlived it: its button pressed and gone with the focus, or the pointer still on it); the
  bar's width set at each frame with no transition (EasyUI's 50 ms one, started again at each frame, never left
  its start: the bar stood full).
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
  Result"); arguments as JSON with their lines kept. An item may be a note (`kind: 'note'`): the agent's words
  between its steps, drawn together by `AgentActivityNotes` as paragraphs, whole, with no mark, state or line,
  the one still written ending with a caret; the timeline is cut where notes come, each stretch of steps a
  timeline of its own, and only steps are counted. It folds when `collapsible` (`open`, `defaultOpen`,
  `onOpenChange`): the header's line a button in its heading, the body opening on the design's spring (fading
  where motion is reduced), "Expand all / Collapse all" only while open.
- `ai-response` (from `7c106d4`, taken by ioiti-ui itself): on the design's tokens (its surface, text, borders and
  washes; the tones for its dots and its error; the orb in the colours of things compared, the accent's under a
  look with one) in place of EasyUI's neutrals and `#0b0b0c`, so the light theme reads it; `accentColor` is gone,
  the look gives the accent; a fence drawn by the package's `CodeBlock`, so EasyUI's `CodeBlock`, which would have
  shadowed it among the exports, is gone; a same-site link (a run's address in an answer) drawn by the
  application's link, an outside one in a new tab as before, a blocked one in words (`safeHref` unchanged); its
  eight titles are hints (a blocked link's, a link's address, a source's, a blocked source's, Copy, Regenerate,
  Good, Poor), Regenerate's on its wrapper while it is disabled; feedback shown only with `onFeedback`, and
  `feedback` given back by the application kept pressed; no model's name unless given (EasyUI's said "EasyAI
  2.0"); copied with `copyToClipboard`; motion on the design's curves, reduced as IoitiProvider says
  (`useReducedMotionConfig`), a list that opened by its height only appearing then; its tables scroll in their
  own positioned frame, and nothing of it is wider than its place; its own focus rings gone. Its demo and its
  default export are gone, as `product-tour`'s. What it is doing (`thinking`, `AIResponseThinking`, ioiti-ui's
  own) is said in place of its skeleton while nothing is written, its header's "Thinking" then left out; its
  actions wait for its first word.
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
- `chart-primitives` (what the charts share): `muted` is `text-muted-foreground` (`neutral-500` was 3.6:1 on the
  dark card); `focus` draws no ring (the global one is the ring); the tooltip follows the pointer with
  `springSnappy` (its own spring was 520/42/0.6), fades in with `easeFast` and out with `easeExit`, and jumps to
  the pointer where motion is reduced (`useReducedMotionConfig`, which follows `IoitiProvider` too).
- `bar-chart` (from `7c106d4`): a value keeps its sign, a loss drawn below a zero line, on an axis that spans it
  (`niceDomain`, `src/lib/chart-scale.ts`, where EasyUI clamped at zero), each bar rounded at its far end by the
  same commands as any other (grouped and stacked still morph into each other), stacked by sign; `tone="sign"`,
  each bar in `--chart-positive` or `--chart-negative`; the series in the design's colours
  (`src/lib/chart-colours.ts`: one series in `--chart-series`, things compared in `--chart-compare-1…4`, never
  recycled, where EasyUI cycled six hex colours); the grid in `--chart-grid`, zero in `--chart-axis`, the text in
  the design's tokens; the package's `ChartLegend` in place of its chips; no ring of its own. Its motion: the bars
  grow in with `easeSoft`, one category a moment after the other (the stagger capped at 0.3 s), then move with
  `springGentle`, the hover band with `springSnappy` (EasyUI's own spring, curve and 1200 ms timer), and stay
  still where motion is reduced (`useReducedMotionConfig`).
  Since 0.4.0: a category's title (`formatTitle`) and details (`details`, `src/lib/chart-details.ts`) in the
  tooltip and the table; the categories the axis names (`tickAt`); whole numbers for counts (`integer`); one
  category set apart, the others in `--chart-muted` and a line through it named above the plot (`marked`, the
  plot's top margin 22 px where it is 8); a missing value (`null`, which `BarDatum` now takes) no bar and a dash.
- `donut-chart` (from `7c106d4`): its segments in the design's colours, four in `--chart-compare-1…4` and the
  fifth and those after them grouped as one segment, `otherLabel` ("Other"), in `--chart-muted`: new to it (EasyUI
  cycled six hex colours and grouped nothing); a screen-reader table of every segment, those grouped included
  (it had none); the text in the design's tokens, a hidden segment's words muted and struck through rather than
  faded under 4.5:1. Its motion: the arcs sweep in with `easeSoft`, their delays capped at 0.3 s, then move with
  `springGentle`, a segment thickens with `springSnappy`, the centre fades with `easeFast` and `easeExit` (its own
  springs and curves), and the arcs, the total and the thickness, which it animates by hand and MotionConfig does
  not reduce, are still where motion is reduced (`useReducedMotionConfig`); its count-up, `AnimatedNumber` there,
  is `CentreTotal`, the package's own `AnimatedNumber` being another.
- `badge`: `removeLabel`, the name of its × for a screen reader ("Remove Lyon", each chip its own, where every
  one was "Remove"), and `removeFocusable`, for a field of chips that removes them with Backspace; the × draws no
  ring of its own (the global one) and takes a press 24 px wide around its 16.
- `settle-modal` (0.3.0): its `description` named by `aria-describedby`, read with its title.
- `velocity-toast` (0.3.0): `wrapperStyle`, the style of its frame: `ToastProvider` lifts it above what sits at the
  bottom of the page (`SaveBar`), its margin sliding where motion is not reduced.
- `product-tour` (from `7c106d4`): its demo (`ProductTourDemo`, a page of its own) and its default export are gone;
  a step's `target` may be a ref too. Its layer is among the others over the page (`z-50`, where it was 9999: the
  hints from its card were under it) and kept above it while a page changes (`over-page`); its scrim is the
  design's (`fill-black/50`, `--glass-scrim` under glass), its card a dialog's surface, text and glass
  (`glass-float`) with the package's buttons, its current step in the accent. A dialog named by its step's title
  (`aria-labelledby`, where it was "Product tour"); Tab stays in its card, from wherever the focus is, by a
  listener on the window as SettleModal's (the page is not made inert: the toasts would go with it). Its motion:
  the cutout glides with `springSheet`, the card moves with `springSnappy`, what fades fades with `easeFast` and
  `easeExit` (its own springs and curve); a step's words come 8 px from the side the tour goes, without their
  blur, and only fade where motion is reduced, the cutout then jumping (`useReducedMotionConfig`). It measures
  once where there is no `ResizeObserver`, and scrolls where the browser can (jsdom cannot).
- `form` (0.3.0): `Input`'s `prefix` and `suffix`, a unit inside the field before or after the value, measured so
  that the text keeps clear of it, describing the field (`aria-describedby`) and hidden from a label's name around
  it; `prefix` is no longer the RDFa attribute of that name in `InputProps`.
- `spotlight-search` (0.3.0): it draws what its props declared and it never showed: an entry's `icon`, its `shortcut`
  (each key a `Kbd`), and the `recentSearches`, rows of the list while nothing is typed, typed again when chosen
  (the arrows reach them as they reach the entries); `grouped`, the entries under a heading for each category, in
  the order the categories first come, the category no longer repeated on each row.
- `animated-tabs` (0.3.0): where no tab leads to a page, a tablist (`role="tablist"`, `label` naming it): each tab
  a `tab`, `aria-selected`, controlling the panel, one stop of the keyboard (`tabIndex` 0 on the tab shown), the
  arrows, Home and End moving and choosing; the panel a `tabpanel` named by its tab, leaving with `easeExit`.
  Tabs that lead to pages stay links (`aria-current`). A badge of 0 is drawn as a badge (`0 && …` drew a bare
  "0"), with a space before it for the tab's name.
- `otp-input` (0.3.0): its boxes take the look of the form's `Input`, its border, its surface and its text in both
  themes, its border darker in focus (the accent's under an accent), where EasyUI's were grey with a violet focus.
- `notification-bell` (0.3.0): its button takes the look of the top bar's icon buttons (`IconButton`), square and
  quiet until hovered, giving a little when pressed (`motion-safe:active:scale-95`), held as pressed while its panel
  is open, where EasyUI's was a bordered box that grew under the pointer (`whileHover`, `whileTap`).
- `velocity-toast` (0.11.0): `action`, one thing to do from the toast beside its words: a link (`href`, the
  application's, LinkProvider, or `linkComponent`) or a button (`onClick`), `UndoToast`'s Undo in its tokens; using
  it closes the toast. Its time stops while the keyboard is in it, as under the pointer (EasyUI's), the time to
  reach its action.
- `notification-bell` (0.11.0): `loading`, rows to come in place of the list while there is none (named for screen
  readers), and `error` (`true` for its own words) with `onRetry`, a "Try again": in place of the list while there
  is none, above the last one read otherwise. EasyUI said "No notifications right now" before anything was read.
- `animated-file-upload` (0.11.0): `label`, the name of its file input (EasyUI's was "Upload files" on every one),
  and `onRemove`, a file taken off the list by its Remove.
- `alert` (0.13.1): `AlertDescription` is a `div`, so that it may hold a list, paragraphs or a `Disclosure` (in
  EasyUI's `p`, invalid HTML that React reported).
- `form` (0.14.1): `Switch` named by its label and described by its description (`aria-labelledby`,
  `aria-describedby`), as `stretch-switch`: a screen reader said only "switch, on".
- `velocity-toast`, `undo-toast` (0.14.1): their frame one layer above the others over the page (`z-[55]`, where it
  was `z-50`, theirs): a sheet or a dialog, put in `document.body` after the page the toast is in, covered it with
  its scrim, its action out of reach. Still under the hints (`z-[60]`).

- `form` (0.18.0): `Input`, `Textarea` and `Select` draw their own border or the error's, never both
  (`fieldBorder`, `src/lib/field-border.ts`): the error's `border-rose-500/50` added over the others lost to their
  `dark:` and `accent:` variants, and an error showed no red in dark. The error is `negative`, said
  (`aria-invalid`), and `aria-invalid` given by a `Field` reads as one. `RadioGroup` takes `id`, `aria-label`,
  `aria-labelledby`, `aria-describedby` and `aria-invalid` (it could not be named); its radio lies over its circle,
  transparent, as the checkbox's, so that the design's focus ring is seen (it was `sr-only`).
- `otp-input`, `draw-checkbox` (0.18.0): `error` (and `aria-invalid`, as a `Field` gives it): the boxes' border, or an
  empty box's, in `negative`; `otp-input` takes `aria-describedby` on its group.
- `date-picker`, `combobox` (0.18.0): their popup is a layer in `document.body`, placed by `useAnchoredLayer`, its
  keys its own, the focus in it (the day to choose, the search): EasyUI's was placed by hand inside the picker, cut
  by a parent that clips and held by a `Field`'s label around it, whose click on the calendar's empty space opened or
  closed it again. Both take `id`, `aria-label`, `aria-labelledby`, `aria-describedby` and `error`. Their own springs
  are `springSnappy`, as `calendar`'s.
- `directional-tooltip` (0.18.0): its description is `hidden` (aria-describedby reads it all the same), not
  `sr-only`: a label around the trigger took its words into the control's name ("Seats Decrease Increase").
- `not-found` (0.18.0): `focusOnMount` (`true`): one drawn in a part of a page leaves the focus where it is. The
  whole address in a `Hint`, not a `title`.
- `alert` (0.18.0): it leaves with `easeExit` (EasyUI's curve was written by hand).
- `scroll-progress-nav` (0.18.0): with a `containerRef`, a part is scrolled to in it alone (`scrollIntoView` moved
  the page around it too), less its `scroll-margin-top`; reduced motion is IoitiProvider's too
  (`useReducedMotionConfig`).
- `advanced-data-table` (0.18.0): its loading rows are `skeleton`s, said ("Loading the records"; `surface-raised` is
  darker than the frame in dark, and they were not seen); its paging says "Loading…" and waits.
- `animated-tabs` (0.18.0): no `backdrop-blur-xl` (it blurred nothing seen, and the design blurs a tile and what
  floats only); `glass` is `pill`, as EasyUI drew them.
- `ai-agent-activity` (0.18.0): `inputLabel` "Asked" and `outputLabel` "Answer" by default (EasyUI's "Parameters",
  "Output Result"); its header says "N of M done", or "Not started" with no step (it said "0 of 0 completed").
- `dependency-trace` (0.18.0): never wider than its canvas (`max-width`): on a wide page it grew, its words with it.
- `live-line-chart` (0.18.0): with a `domain`, its scale is written from the first frame (it waited for two readings).
- `spotlight-search` (0.16.0): `closeOnSelect={false}` keeps it open once an entry without an `href` is chosen, the
  field keeping what was typed and the focus; `picked` ticks the entries chosen already (`aria-checked`, the list
  `aria-multiselectable`), chosen again to take them back; `footer`, a line under the list; its Escape drawn as
  every key is (`Kbd`), a button that closes it (EasyUI's `<kbd>` only said it).
- `spotlight-search` (0.19.0): in two parts, the palette drawn anew at each opening under what holds `open`
  (`useControllableState`), ⌘K and the focus to give back. The focus stays in it (Tab goes round its controls; a
  press elsewhere than on a control leaves it in the field) and goes back to what opened it after the commit, while
  it is in the palette; an entry's `action` runs once it is closed. Its keys are its own (`stopPropagation`: a
  dialog under it hears neither its Escape nor its Tab), a composition's (an IME's) left to it; ⌘K is a
  `useShortcut` (`enableGlobalShortcut`: EasyUI's listened to the window, for Ctrl and ⌘ alike, and its Escape closed
  the palette a second time), closing it when pressed in it. Its highlight is measured (Combobox's, with
  `springSnappy`: EasyUI's `layoutId` and `springGentle` measured nothing where the list scrolled), the list scrolling
  itself to the entry the keys choose; the pointer chooses on `pointermove` (`mouseenter` fired where the list
  scrolled under it), the entry chosen kept by its key as the entries change. The listbox holds options alone, in
  groups named by their headings; a status in the dialog says how many are found; nothing is drawn under an empty
  field without entries. `onQueryChange` is told from the change, and of `''` as it opens. The page under it holds
  still, as under `settle-modal`. Every word typed is found whatever its case and accents (`src/lib/search.ts`),
  the best entries first (the title, then a keyword, the category, the description; EasyUI's kept the order given,
  `limit` cutting off the best), marked where found (`<mark>`); `filter={false}` lists the entries as given; an
  entry's `shortcut` may be keys for `Kbd`; its `category` is a `string` (EasyUI's type named its own site's).
  `loading`, `error` and `onRetry` say what is found as it is typed, as `notification-bell` says its own: never "No
  results" before it knows, the last entries kept under an error, a Try again.
  `remember` keeps the entries chosen last in the browser (`src/lib/spotlight.ts`, under the application's key) and
  offers them first, Shift+Delete forgetting one; ⌘↵ opens an entry that leads somewhere in another tab.
  An entry's `items` are a list of its own, opened in the palette (its title before the field; Backspace, Escape or
  the title going back), `onQueryChange` told which (`src/lib/spotlight.ts` finds it again at each render).
- `settle-modal` (0.25.0): the focus kept by `useFocusScope` (`src/lib/focus-scope.ts`), as every layer over the page
  keeps it: the latest opened keeps it, what floats beside a control in it keeps its own keys, Escape a field took
  no longer closes it. `aria-label` and `aria-labelledby`, for a dialog without a `title`; one with neither says so
  to its developer, in development only (`devWarn`).
- `sidebar` (0.25.0): the drawer of a phone, a dialog (`aria-modal`), keeps the focus as one does (`useFocusScope`):
  moved in on the page shown, kept in by Tab, given back to the button that opened it, Escape closing it; the focus
  stayed behind it, on the page its scrim covers. It is drawn in `document.body`, with a close button (no Escape on a
  phone), and `drawerId` names it for the button that opens it (`aria-controls`, `aria-expanded`: `AppShell`'s).
- `velocity-toast`, `undo-toast` (0.25.0): their frame is the live region (`status`, `alert` for an error), there a
  render before their words, which are said then; a region drawn with its words, as the toast was, is missed by some
  screen readers, and an error was said politely. In `ToastProvider`'s regions, there from the start, a toast is
  none of its own (`ToastRegionContext`).
- `spring-select` (0.25.0): a select-only combobox (WAI-ARIA APG). The focus stays on the trigger (`role="combobox"`),
  whose keys do everything: the arrows, Enter, Space and Alt+ArrowDown open the list on the value, Home and End on the
  first and the last; the arrows, Home, End, PageUp and PageDown move past the options that cannot be chosen, and
  letters typed within 500 ms go to the option they start, whatever their case and accents; Enter, Space and
  Alt+ArrowUp choose, Tab chooses and goes on, Escape closes without a change. The option the keys are on is its
  `aria-activedescendant`, marked as the pointer's and kept in sight. EasyUI's trigger only opened the list, whose own
  keys were out of reach: the focus never went into it. The list is a layer in `document.body`, placed by
  `useAnchoredLayer` (a panel's overflow cut it), as wide as the trigger; a press in it leaves the focus on the
  trigger. The listbox is named as the trigger is; the error describes the trigger and marks it; a click on the label
  gives the trigger the focus, as a select's does; `onChange` is told of a change only; `id`, `name` (a hidden
  input), `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid`.
- `form` (0.25.0): `FormItem` links its parts (`src/components/field-context.ts`): `FormLabel` names its control by the
  id the control is drawn with, `FormDescription` and `FormMessage` describe it (each its own id, or the one given),
  and a message under it, or the item's `error`, marks it invalid. EasyUI's linked nothing, and its `error` was an
  attribute of the `div`. `FormControl` gives its child, a control from elsewhere too, the item's id, what describes it
  and `aria-invalid`. `Input`, `Select` and `Textarea` read the item or a `Field` wherever they are in it, each id
  once. `Switch` takes `id`, `name`, `value`, `required`, `aria-label`, `aria-labelledby`, `aria-describedby`,
  `aria-invalid` and `ref`, reads a `Field` or `FormItem` around it, is sent with its form while on (a hidden input),
  and its words inside a label around it turn it once (the label passed their click on, turning it back).
- `stretch-switch` (0.25.0): as `form`'s `Switch`: `id`, `name`, `value`, `required`, `aria-label`, `aria-labelledby`,
  `aria-describedby`, `aria-invalid` and `ref`; a `Field` or a `FormItem` around it read; sent with its form while on;
  its words turning it once inside a label.
- `combobox` (0.25.0): its search and its list named as its trigger is, by its `aria-labelledby`, its `aria-label` or
  the words of its `<label>` (read once drawn and as it opens): they had a placeholder, and no name. Nothing found is
  said beside the list, which holds options alone (EasyUI's words were in it), where it was.
- `drag-to-confirm` (0.25.0): its slider's `aria-valuenow` follows the thumb in tenths, written on it as it moves
  (`useMotionValueEvent`, no render at every frame: EasyUI's was read at each render, and stood still through a drag),
  with `aria-valuetext` ("40%", then the confirmed words) and `aria-disabled`.
- `smooth-accordion` (0.25.0): a question is a `type="button"` (EasyUI's submitted a form around it) that names its
  answer (`aria-controls`, while it is open), the answer a `region` named by its question; `headingLevel` puts each
  question in a heading, at the page's letter-spacing.
- `airport-matrix-clock` (0.25.0): a row says its time and its city as text (`sr-only`), its characters hidden: EasyUI
  named its spans with `aria-label`, which a span without a role does not take. The region is named by its title
  ("World times" without one): its name listed every time, which the rows say themselves now.
- `directional-tooltip` (0.25.0): the pointer can reach it (WCAG 1.4.13): it waits 120 ms once the pointer has left its
  trigger or itself, stays while the pointer is over it, and a press on it leaves it (EasyUI's took no pointer,
  `pointer-events-none`, and closed as the pointer left the trigger). Escape and the focus as before.
- `donut-chart` (0.25.0): its segments `aria-hidden` (EasyUI named each path with `aria-label`, which a path without a
  role does not take): its figures are in its table for screen readers, the keyboard reads them in the legend.
- `smart-comparison` (0.25.0): the table holds rows alone: the search, the toggle and the plan switcher above it, out
  of it (it was the whole card), a category's toggle in the `rowheader` of a row of its own, the words for nothing
  found in a cell. The `aria-label`, `aria-labelledby` and `aria-describedby` given to it name the table.
- `flysheet` (0.25.0): its trigger says it opens a dialog (`aria-haspopup`) only while the sheet covers the page: one
  pushing the page aside is a region beside it, which it says nothing of; the content tells the trigger.
- `loader` (0.26.0): `delay`, the milliseconds before it is drawn (`300` while a page's code or data arrives): a wait
  shorter than that shows nothing, where a spinner would flash.
- `sidebar` (0.27.0): its Collapse button is named by the word it shows and what it folds ("Collapse sidebar", the second
  word for a screen reader only), its keys (⌘B) drawn for the eye and heard as its shortcut (`aria-keyshortcuts`);
  folded, "Expand sidebar". A name written over its words left out the keys it shows (WCAG 2.5.3, label in name).
- `animated-file-upload` (0.27.0): its drop zone is named by the words it shows, its size limit too ("Drop files here or
  browse from your device (up to 25 MB)"): a name written over them, its title and subtitle, left the limit out.
- `form`, `stretch-switch` (0.27.0): disabled, a switch's label and its control are at half strength, its description
  whole: it says why it is disabled, and was 2:1 dimmed with the rest.
- `flysheet`, `ai-response`, `ai-agent-activity`, `recovery-ledger` (0.27.0): what scrolls in them and holds no control
  (a sheet's body, an answer's table, a code snippet, an entry's diff) is a stop of the keyboard while it scrolls, its
  arrows scrolling it, a region named by what it holds (the sheet's title, or "Content"; "Table"; the snippet's
  language; "Changes"): nothing in it took the focus, and the keyboard could not scroll it (WCAG 2.1.1). What fits is no
  stop (`useScrollRegion`, `src/lib/scroll-region.ts`).
- `calendar` (0.28.0): in IoitiProvider's locale and words. Its weeks start on the provider's first day (any day,
  `WeekDay`; Monday in en-GB), where EasyUI's started on Sunday; its month, the days of the week and each day's name are
  in the provider's locale, where EasyUI's were the browser's; its buttons' names are the catalogue's
  (`date.previousMonth`, `date.nextMonth`). Its `locale` and `weekStartsOn` still win.
- `date-picker` (0.28.0): its day and its range are written in the provider's locale (EasyUI's, the browser's); its
  placeholders, its calendar's name ("Choose date") and its range ("14 Nov 2026 – …") are the catalogue's (`date.*`).
  `placeholder` and `locale` still win.
- `activity-heatmap` (0.28.0): in the provider's locale, clock and words. Dates, months and days of the week as the
  locale writes them (en-GB's, the days English written by hand); under 440 px the locale's narrow names (a first letter
  made French "lun." into "l"); an hour's cell in the locale's clock; its numbers the locale's, to a tenth with a true
  minus, no longer `chart-primitives`' `fullFmt` (en-US's, with a hyphen). Its weeks start on the provider's first day by
  default (Sunday in EasyUI); `weekStart` takes any day (`WeekDay`), Monday, Wednesday and Friday named on their rows from
  it. `unit` is by default a word that counts ("1 contribution"; EasyUI's "contributions" was always plural), and an
  application's unit is written as given; a summary of one week or month says so ("in the last week"). Its legend,
  summaries, best, worst and peak, its name and what a screen reader is told of a cell are the catalogue's
  (`heatmap.*`), each value kept in its own span wherever a language puts it.
- `recovery-ledger` (0.28.0): its words are the provider's language's (`ledger`: its title, its count, its restore button
  and the name it gives it, its current entry's badge, the name of its diff), its own props given over them; its entries
  counted ("1 snapshot", "12 snapshots": it said "1 snapshots"); a `Date` written in the provider's locale and on its
  clock (it was the browser's).
- `drag-to-confirm` (0.28.0): its `aria-valuetext` is the provider's locale's percentage ("40%"; "40 %" in French),
  where it wrote "40%" in every language.
- `ai-response` (0.28.0): the time `AIResponseThinking` has taken is written in the provider's locale and words
  (`useFormat()`'s `formatSpan`).
- `animated-file-upload` (0.28.0): sizes and a file's progress are written in the provider's locale ("2,0 ko", "42 %" in
  French), the progress with the decimals it is given ("—" for none, where it wrote "NaN%"); its words stay English until
  they come from the catalogue.
- `airport-matrix-clock` (0.28.0): in IoitiProvider's locale and words: its heading, its name without one, its last line
  ("1 city", counted) and a row as a screen reader reads it, from the catalogue (`clock`). A screen reader's line as the
  locale writes it (EasyUI's was fixed to en-GB for 24 hours and en-US for 12), the board's in what its characters draw:
  Latin digits, the period in capitals, AM or PM where the locale writes it in another script. `format` is the
  provider's clock by default. A letter with an accent is drawn on the board as its letter (Montréal, Zürich): the board
  has no accents, and drew a blank.
- `chart-primitives` (0.28.0): the charts' numbers in the interface's locale (`useChartFormat`, IoitiProvider's;
  `chartFormatFor(locale)` outside React): its separators, its compact units ("1.2k" in British English, "1,2 k" in
  French, where EasyUI wrote American English's "1.2K"), its percentages, a true minus where Intl writes a hyphen.
  `defaultFormat`, `defaultTick` and `fullFmt` stay, British English's.
- `dashboard-chart-utils` (0.28.0): `pctText` takes the locale (British English's by default) and writes Intl's
  percentage ("12 %" in French), a true minus, a loss the gain of its size with a minus; rounded by `Math.round` and
  `toFixed` as before, Intl writing the digits only (it rounds a value's shortest decimal, 6.35 up to 6.4); `shareText`, a
  share of a whole to the unit, and `withTrueMinus`, which the charts' formats share.
- `bar-chart`, `donut-chart`, `funnel-chart`, `stat-card`, `live-line-chart` (0.28.0): their numbers in the interface's
  locale where the application gives no format (`useChartFormat`), their percentages as it writes them (EasyUI wrote "%"
  after `Math.round` or `toFixed` by hand), their words from the catalogue (`useMessages().chart`; the units and "ago" of
  `format`): the names a screen reader hears, the tables' captions and heads, "No data", "Total", "Other", the funnel's
  summary, the tile's change, the live chart's button, axis and window. The props that named a word by default
  (`centerLabel`, `otherLabel`, `summaryLabel`, `noun`, `emptyText`, `period`) take the catalogue's; a count is said as
  the language counts it ("across 1 category", "Funnel with 1 stage", where EasyUI said "1 categories", "1 stages").
- `funnel-chart` (0.28.0): a loss is signed as the locale writes a negative share (its minus was written by hand before
  the share: a stage larger than the one before it read "−-5.0%"); the amount lost in the tooltip keeps a true minus
  before the application's own format, which may write none.
- `animated-number` (0.28.0): written in the interface's locale through Intl's `formatToParts` (EasyUI put a comma every
  three digits and a point), in Latin digits whatever the locale writes (only they roll), still rounded by `toFixed`;
  compact as the locale writes it ("2.2m", EasyUI's American "2.2M").
- `ai-response` (0.29.0): its words are the provider's language's (`ai`): its name and its header's title ("Assistant")
  and states, what it says while it works, when it fails and while it waits, a blocked link's hint, a mail address's
  "email", a table's name ("Table"), the label of code that names no language ("text"), its sources' button, its tools
  counted ("Used 1 tool"), a tool's state said to a screen reader, its buttons' hints and names; the sources' count and
  places in the provider's locale; the `title` of `AIResponseHeader` and `AIResponseSources` the catalogue's by default.
- `ai-agent-activity` (0.29.0): its words are the provider's language's (`ai`): "Running", its steps counted ("2 of 3
  done", in the locale's numbers), "Not started", "Expand all" and "Collapse all", "No activity recorded", a step's code
  that names no language ("Code"), a detail's key with its colon as the language writes it; `title`, `inputLabel`,
  `outputLabel` and `notesLabel` the catalogue's by default ("Activity", "Asked", "Answer", "Notes").
- `animated-file-upload` (0.29.0): its words are the provider's language's (`upload`): the drop zone's title, line and
  limit ("(up to 25.0 MB)"), its input's name, a file's states ("Uploading 42%", "Processing…", "Ready"), the list's
  heading counted in the locale's numbers ("Files (3)"), "Clear completed", a file too large, a failed upload with no
  message (said when drawn, no longer kept in the file's state), its Retry and Remove buttons' names; its props still win.
- `notification-bell` (0.29.0): its words are the provider's language's (`notification`): the bell's name, its unread ones
  counted ("1 unread notification", where it said "1 unread notifications"), its count in the locale's numbers and past 99
  ("99+"), the panel's name and heading, "3 new", its buttons' hints and names, what it says while it reads, with none,
  and when they could not be read (`error={true}`).
- `spotlight-search` (0.29.0): its words are the provider's language's (`search`): its name ("Spotlight Search") and
  placeholder ("Search…") by default, the heading ⌘K is listed under among the shortcuts ("Navigation"), its field's and
  buttons' names, its headings ("Recent", "Recent searches"), what a screen reader hears once typing pauses ("2 results,
  11 more"), "No results found for “…”", the entries past its limit, a failed search, "Opens its list"; Escape drawn as
  the key its language names (`Kbd keys="escape"`), where it was "Esc" in every language.
- `product-tour` (0.29.0): its words are the provider's language's (`tour`): the step among how many ("1 of 3", in the
  locale's numbers), Skip, Back, Next and Done, its dots' names ("Go to step 2").
- `undo-toast` (0.29.0): its words are the provider's language's (`toast`): its line, its Undo, what it says once undone,
  its close button's name; without a `title` it says "Done" (EasyUI's "Project archived" named one application's
  project) and tells its developer so, in development (`undo-toast-untitled`); its props still win.
- `velocity-toast`, `settle-modal` (0.29.0): their close button's name is the provider's language's (`toast.close`,
  `dialog.close`).
- `dynamic-island` (0.29.0): its name before what its pill shows ("Import:") and its close button's ("Close import") are
  the provider's language's (`toast`).
- `request-status` (0.29.0): its close button's name and its reference's copy button's ("Copy payment PY-55102") are the
  provider's language's (`toast`).
- `flysheet` (0.29.0): the names of its close button, its edge ("Resize") and a body without a title ("Content") are the
  provider's language's (`dialog`); its width is written in the provider's locale ("1,100 px"; "1 100 px" in French),
  where it was "1100 px".
- `drag-to-confirm` (0.29.0): `label` and `confirmedLabel` take the provider's language's by default ("Slide to confirm",
  "Confirmed ✓": `dialog`).
- `sidebar` (0.29.0): its words in the provider's language (the catalogue's `shell`: the drawer's and its buttons' names,
  "Main", "The pages under …", Collapse and Expand, what badges out of sight say; its shortcut's description and group,
  `shortcuts`; its tip's keys, `keys`), where EasyUI's were English. The words for badges out of sight follow a hidden comma
  of their own (`BadgeSeparator`), as a badge's words do; the comma is no longer written in them.
- `breadcrumb` (0.29.0): its name ("Breadcrumb") and its button's ("Show hidden pages") are the catalogue's
  (`shell.breadcrumb`, `shell.showHiddenPages`); an `aria-label` given still wins.
- `not-found` (0.29.0): its words are the catalogue's (`notFound.*`): the heading, the description, the badge ("Error
  404"), what a screen reader hears first, the ways home and back, the suggestions' name and heading, the drawing's
  description. `title`, `description`, `badgeLabel`, `actionLabel`/`homeLabel`, `backLabel`/`secondaryActionLabel` still
  win (`description={null}` stays none); its drawing is as it was.
- `advanced-data-table` (0.29.0): its words are the provider's language's (`table`): the toolbar's (its search's
  placeholder, the view and column buttons, the selection and its bulk actions), the filters' (a button's name and count,
  a list's name, search and rows, Clear), the rows' (none, none found, loading, failure, each box's and arrow's name) and
  the pages' (the count, Rows per page, the page buttons); `searchPlaceholder` and `emptyTitle` still win. Its counts are
  written in the provider's locale, each figure of "Showing 1–10 of 57 records" in its own span wherever a language puts
  it; a total of one record and a list of one option are said in the singular (EasyUI said "1 records", "1 options").
- `selection-basket` (0.29.0): its words are the provider's language's (`table`): the bar's name, the selection ("item
  selected" without `noun`; with it, the language's "selected" after the application's noun), "All (24)", "Select none",
  the clear button and the default actions; its count in the provider's locale.
- `smart-comparison` (0.29.0): its words are the provider's language's (`table`): its name, the matrix's head and count of
  rows ("1 specification": EasyUI said "1 specifications"), its search, "Differences only", what it says when nothing is
  left, a plan's default button, a feature's info button, a plan's name before its value on a phone; `label`,
  `matrixTitle`, `countLabel`, `searchPlaceholder`, `diffLabel`, `emptyText` and a plan's `ctaText` still win.
- `combobox`, `spring-select` (0.29.0): their placeholder, Combobox's search and what it says when its search finds
  nothing are the provider's language's (`select`); `placeholder`, `searchPlaceholder` and `emptyText` still win.
- `form` (0.29.0): the password toggle's names are the provider's language's (`field.showPassword`, `field.hidePassword`).
- `otp-input` (0.29.0): its name and its boxes' ("Digit 2 of 6") are the provider's language's (`field`); `aria-label`
  still wins.
- `badge`, `alert`, `skeleton`, `loader`, `stepper` (0.29.0): their words are the provider's language's (`status`): Badge's
  × button ("Remove"; `removeLabel` still wins), Alert's ("Dismiss"), SkeletonReveal's name while loading ("Loading"),
  Loader's ("Loading…"; `label` still wins), Stepper's list ("Progress") and a step done ("(completed)").
- `scroll-progress-nav` (0.29.0): its name ("Table of contents"; `label` still wins), the phone's menu button and Back to
  the top are the provider's language's (`layout`); EasyUI's demo parts, drawn where an application gives none, stay as
  they were (`i18n-exempt`).
- `dependency-trace` (0.29.0): its words are the provider's language's (`layout`): its name (`label` still wins), a node's
  name with its health, the status bar (what the node traced calls and what calls it, as the language lists them; its
  hint) and its count of links ("1 connection": EasyUI said "1 connections").
- `interactive-timeline` (0.29.0): an item's node is named in the provider's language (`layout`): its title and its
  `statusLabel`, or its status in words where it has none (EasyUI said the status's code); the commit's button and its
  hint too.
- `peek-card` (0.29.0): its link's words are the provider's language's ("Open"); `hrefLabel` still wins.
- `velocity-toast` (0.30.0): `tone`, a `StatusTone` (`neutral` by default, `info`, `success`, `warning`, `danger`), draws
  its icon and, for `danger`, makes its frame an `alert`, said at once. `variant`, EasyUI's, is deprecated: read as a tone
  (`default` as `neutral`, `error` as `danger`), said once in development (`toast-variant`); `VelocityToastVariant` goes
  with it. `tone` wins where both are given.
- `undo-toast` (0.30.0): the same `tone` (`neutral` by default: its bin), its `variant` deprecated as VelocityToast's
  (`toast-variant`), `UndoToastVariant` with it.
- `drag-to-confirm` (0.30.0): `tone`, a `StatusTone`; without one, its `actionType`'s as before (`danger` to delete,
  `warning` to unlock, `info` to submit, `neutral` otherwise). `variant`, EasyUI's, is deprecated: read as a tone
  (`default` as `neutral`), said once in development (`drag-to-confirm-variant`); `DragConfirmVariant` goes with it.
  `success` is drawn in the positive tone on its way too, its fill and its icon: EasyUI's drew it as the default until it
  was confirmed.
- `badge` (0.30.0): `BadgeTone` is `StatusTone`: an `info` tone, drawn as Alert draws it (the recipes' `info`: its faint
  ground, its fill, its line, its dot).
- `alert` (0.30.0): `AlertTone` is `StatusTone`, the same five values.
- `button` (0.30.0): `pending`, an action under way that the button started (its spinner and `loadingText`, pressed no
  more meanwhile), and the variant `danger`, the tones' word. `isLoading` and `destructive`, their former names, are
  read as them, each said once in development; removed in 1.0.
- `combobox`, `calendar`, `date-picker`, `sidebar`, `flysheet` (0.30.0): their own copy of `useControllableState` is
  gone; they hold a value as every component of the package does (`src/lib/controllable.ts`), which passes on what goes
  with a change (why a sheet closed).
- `animated-tabs`, `notification-bell`, `otp-input`, `dynamic-island`, `stretch-switch`, `spring-select`,
  `smooth-accordion`, `settle-modal`, `product-tour`, `form` (0.30.0): the state they held by hand (`form`'s
  `RadioGroup` and `Switch`) is held by `useControllableState`: theirs unless the page gives it, the page told of every
  change either way.
- `combobox` (0.30.0): `onChange`, as every control; `onValueChange`, its former name, still told where it alone is
  given, said once in development (removed in 1.0).
- `animated-tabs` (0.30.0): `value` and `defaultValue`, as every control; `activeTab` and `defaultTab`, their former
  names, read where they alone are given (removed in 1.0). A default is the tab shown first only: EasyUI's showed
  `defaultTab` again whenever it changed.
- `notification-bell` (0.30.0): `open`, as every layer, and `defaultOpen`; `isOpen`, its former name, read where it
  alone is given (removed in 1.0). `onOpenChange` given without `isOpen` took the place of the bell's own state, and its
  panel never opened: the bell holds it now, and tells `onOpenChange`.
- `otp-input` (0.30.0): `defaultValue`, the code its boxes start with. Held by the page, the boxes show its `value` as
  it is drawn, where an effect copied it a render later.
- `smooth-accordion` (0.30.0): `value` and `onChange`, the ids of the items open, and `defaultValue`; `defaultOpen`, its
  former name, read where it alone is given (removed in 1.0).
- `settle-modal` (0.30.0): `open`, `defaultOpen` and `onOpenChange`, as every layer: held by itself, it closes itself;
  `onClose` is told too, as it closes. `showCloseButton`; `hideCloseButton`, its former name the other way round, read
  where it alone is given (removed in 1.0).
- `product-tour` (0.30.0): `open`, `defaultOpen` and `onOpenChange` (with why it ended, `{ reason }`), as every layer;
  `onClose` is told too.
- `flysheet` (0.30.0): `showCloseButton`; `showClose`, its former name, read where it alone is given (removed in 1.0).
- `sidebar` (0.30.0): a badge's tones are a status's (`neutral`, `warning`, `danger`); `negative`, the former name of
  `danger`, is read as it, said once in development (removed in 1.0).
- `bar-chart` (0.30.0): `aria-label` names it and its table's caption, and `colorBy` colours its bars by series or by
  sign. `ariaLabel` and `tone`, their former names, are read as them, each said once in development; removed in 1.0.
- `donut-chart`, `funnel-chart`, `activity-heatmap`, `live-line-chart` (0.30.0): `aria-label` names it (and, for the
  donut and the funnel, their table's caption). `ariaLabel`, its former name, is read as it and said once in
  development; removed in 1.0.
- `advanced-data-table` (0.30.0): `loading` says the records are on their way, on `DataTable` and `AdvancedDataTable`
  (each warns under its own name), and to the parts through the context (`loading`, and `isLoading` with the same
  value). `isLoading`, EasyUI's name, is read as it and said once in development; removed in 1.0.
- `animated-file-upload` (0.30.0): `density="compact"` draws the inline zone. EasyUI's `variant="compact"` is read as it
  and said once in development; removed in 1.0. `density="regular"` wins over it.
- `settle-modal` (0.31.0): exported as `Dialog`, the name of its role, its props as `DialogProps`; `SettleModal` and
  `SettleModalProps`, EasyUI's, are deprecated: drawn as it, said once in development, removed in 1.0.
- `flysheet` (0.31.0): exported as `Sheet`, the name of its role, its parts and types with it (`SheetTrigger`,
  `SheetContent`, `SheetTitle`…, `SheetProps`, `SheetSide`…); `Flysheet` and its parts, the names this package gave
  EasyUI's sheet, are deprecated: each drawn as its part, said once in development, removed in 1.0.
- `spring-select` (0.31.0): exported as `SelectMenu`, the name of its role (`SelectMenuProps`, `SelectMenuOption`);
  `SpringSelect`, EasyUI's, is deprecated: drawn as it, said once in development, removed in 1.0.
- `velocity-toast` (0.31.0): exported as `Toast`, the name of its role (`ToastProps`, `ToastPosition`), its action
  useToast()'s `ToastAction`, the same shape; `VelocityToast`, EasyUI's, is deprecated: drawn as it, said once in
  development, removed in 1.0 (`VelocityToastAction` with it).
- `smooth-accordion` (0.31.0): exported as `Accordion`, the name of its role (`AccordionProps`); `SmoothAccordion`,
  EasyUI's, is deprecated: drawn as it, said once in development, removed in 1.0.
- `directional-tooltip` (0.31.0): exported as `Tooltip`, the name of its role (`TooltipProps`), and drawn by it in
  `selection-basket`; `DirectionalTooltip`, EasyUI's, is deprecated: drawn as it, said once in development, removed in
  1.0.
- `animated-tabs` (0.31.0): exported as `Tabs`, the name of its role (`TabsProps`); `AnimatedTabs`, EasyUI's, is
  deprecated: drawn as it, said once in development, removed in 1.0.
- `animated-file-upload` (0.31.0): exported as `FileUpload`, the name of its role (`FileUploadProps`);
  `AnimatedFileUpload`, EasyUI's, is deprecated: drawn as it, said once in development, removed in 1.0.
- `airport-matrix-clock` (0.31.0): exported as `WorldClock`, the name of its role (`WorldClockProps`, `WorldClockCity`);
  `AirportMatrixClock`, EasyUI's, is deprecated: drawn as it, said once in development, removed in 1.0.
- `smart-comparison` (0.31.0): exported as `ComparisonTable`, the name of its role (`ComparisonTableProps`);
  `SmartComparison`, EasyUI's, is deprecated: drawn as it, said once in development, removed in 1.0.
- `dynamic-island` (0.31.0): exported as `StatusIsland`, the name of its role (`StatusIslandProps`,
  `StatusIslandState`); `DynamicIsland`, EasyUI's, is deprecated: drawn as it, said once in development, removed in 1.0.
- `stretch-switch` (0.31.0): deprecated for the form's `Switch`, which takes the same props (`StretchSwitchProps` is
  `SwitchProps`): still drawn as it was, said once in development, removed in 1.0.
- `form` (0.31.0): `RadioGroup` is named by the label of a `Field` or a `FormItem` around it (`aria-labelledby`: a label
  names no group), which points to its id (its own in a `Field`), so that it names none of its radios and passes them no
  click; their description and error describe it and mark it; it takes a `ref` (the group) and `data-*` attributes.
  `Switch` takes `data-*` attributes. `FormLabel` has an id of its own in a `FormItem`, which names a control a label
  cannot: a group, a slider.
- `combobox` (0.31.0): takes `name` (its value sent with a form, a hidden input, empty while none is chosen), `ref` (its
  button) and `data-*` attributes; a `Field`'s or a `FormItem`'s label names it, its search and its list
  (`aria-labelledby`), and their description and error describe it and mark it, its id the item's in a `FormItem`.
- `spring-select` (0.31.0): takes `ref` (its button) and `data-*` attributes; named, described and marked by a `Field`
  or a `FormItem` around it too, its own `label` first, its id the item's in a `FormItem`.
- `stretch-switch` (0.31.0): takes `data-*` attributes, on its outermost element.
- `date-picker` (0.31.0): `DatePicker` and `DateRangePicker` take `name` (the day sent as a date field sends it,
  `yyyy-mm-dd`, a hidden input; a range's first day, then its last, under the same name), `ref` (its button) and
  `data-*` attributes; described and marked by a `FormItem` too, its id the item's.
- `otp-input` (0.31.0): takes `name` (its digits sent, a hidden input), `ref` (its first box), `aria-labelledby` and
  `data-*` attributes; the label of a `Field` or a `FormItem` around it names the group, over the provider's words, and
  a `FormItem`'s id goes to its first box.
- `flysheet` (0.31.0): the focus kept as every layer keeps it (`useFocusScope`, `src/lib/focus-scope.ts`), its own trap
  and its list of the sheets open gone. A sheet with a backdrop holds the page: the focus moved in on its dialog, kept
  in by Tab, given back to what opened it, Escape closing it wherever the focus is. A child keeps the focus while it is
  open, then its parent again: Tab goes round the child alone (it went round the child and its parent beside it, which
  stays in reach of the pointer). One without a backdrop (`modal={false}`, a pushed sheet) is a scope that holds no page
  (`contain: false`): the focus free, taken as it opens (not as it opens with the page), its Escape heard while the
  focus is in it. An Escape meant for a list or a menu open in it is still left to it.
- `spotlight-search` (0.31.0): the focus kept as every layer over the page keeps it (`useFocusScope`), its own trap gone:
  in its field as it opens, kept in by Tab from the page too, given back to what opened it as it leaves; Escape (back
  from a list, then closed) heard wherever the focus is. Tab and Escape reach the document, where the latest layer
  opened keeps them (a dialog or a sheet under it hears neither); its other keys stay its own (`stopPropagation`).
- `product-tour` (0.31.0): the focus kept as every layer over the page keeps it (`useFocusScope`), its own trap gone: on
  Next once its card is placed, kept in the card by Tab (every control in it, where its trap knew its buttons alone),
  given back to what had it as it ends, unless it went elsewhere meanwhile; Escape ends it (`dismiss`). A dialog opened
  over it keeps the keys: its Escape closes it alone, and the arrows move no step while it is open.
- `alert`, `form`, `flysheet`, `sidebar`, `stat-card` (0.31.0): the props of their parts named and exported, as every
  component's (`AlertTitleProps`, `FormControlProps`, `SheetBodyProps`…, `SidebarTriggerProps`, `StatGridProps`).
- `notification-bell` (0.32.0): a button of its list that goes once pressed (Read all, an entry's Mark as read, Try
  again) leaves the focus in the list: on the first control of an entry after its own, else on the list itself. It fell
  to the page's body, the list still open: its Escape no longer heard, the next Tab from the top of the page. Whenever
  the button goes: at once, or once the application has had its answer.
- `advanced-data-table` (0.32.0): a filter's list is an anchored layer (`useAnchoredLayer`, `src/lib/anchor.ts`), as
  every list beside its button, its placing by hand gone: on the side it opened on while its search shrinks it
  (`keepSide`), as high as the room the window leaves it there (it kept its height as the page scrolled), and its Tab
  its own, as its Escape was: in a dialog or a sheet, whose keeping of the focus pulled a Tab in the list back into it.
  A press on its empty space keeps the focus in it. The search is named in the provider's words ("Search the table":
  its placeholder alone named it), and so is its ×, a close button (`CLOSE_SM`, "Clear the search", its hint the same
  words) of 24 px (16 px, and no name), its 12 px icon where it was; pressed, it gives the focus back to the search.
- `split-button` (0.32.0): its chevron and its menu are named in the provider's language after the main action
  ("More Save options", `field.moreOptions`), `menuLabel` over it: EasyUI's English was written in the code.
- `combobox` (0.32.0): "No results." describes the list it stands beside, and is said to a screen reader once as it
  comes to be (`useAnnounceWhen`, `src/lib/announce.ts`), as MultiSelect says "Nothing matches": it was shown, and said
  to no one.
- `chart-primitives` (0.32.0): its `SegmentedControl`, which no chart drew, is gone (its radios each a stop of the
  keyboard, no arrow between them): a choice of a chart's view is the package's `SegmentedControl`.
- `settle-modal` (1.0.0): `SettleModal` and `SettleModalProps`, its former names, removed: `Dialog`, `DialogProps`.
- `flysheet` (1.0.0): `Flysheet` and the former names of its parts (`FlysheetTrigger`, `FlysheetContent`…) and of
  their types (`FlysheetProps`, `FlysheetContentProps`, `FlysheetCloseReason`, `FlysheetPadding`, `FlysheetSide`,
  `FlysheetSize`, `FlysheetType`), removed: `Sheet`, `SheetTrigger`, `SheetProps`…
- `spring-select` (1.0.0): `SpringSelect`, `SpringSelectProps` and `SpringSelectOption`, its former names, removed:
  `SelectMenu`, `SelectMenuProps`, `SelectMenuOption`.
- `velocity-toast` (1.0.0): `VelocityToast`, `VelocityToastProps`, `VelocityToastPosition` and `VelocityToastAction`,
  its former names, removed: `Toast`, `ToastProps`, `ToastPosition`, `ToastAction`.
- `smooth-accordion` (1.0.0): `SmoothAccordion` and `SmoothAccordionProps`, its former names, removed: `Accordion`,
  `AccordionProps`.
- `directional-tooltip` (1.0.0): `DirectionalTooltip` and `DirectionalTooltipProps`, its former names, removed:
  `Tooltip`, `TooltipProps`.
- `animated-tabs` (1.0.0): `AnimatedTabs` and `AnimatedTabsProps`, its former names, removed: `Tabs`, `TabsProps`.
- `animated-file-upload` (1.0.0): `AnimatedFileUpload` and `AnimatedFileUploadProps`, its former names, removed:
  `FileUpload`, `FileUploadProps`.
- `airport-matrix-clock` (1.0.0): `AirportMatrixClock`, `AirportMatrixClockProps` and `AirportMatrixCity`, its former
  names, removed: `WorldClock`, `WorldClockProps`, `WorldClockCity`.
- `smart-comparison` (1.0.0): `SmartComparison` and `SmartComparisonProps`, its former names, removed:
  `ComparisonTable`, `ComparisonTableProps`.
- `dynamic-island` (1.0.0): `DynamicIsland`, `DynamicIslandProps` and `DynamicIslandState`, its former names, removed:
  `StatusIsland`, `StatusIslandProps`, `StatusIslandState`.
- `stretch-switch` (1.0.0): removed, deprecated since 0.31.0 for the form's `Switch`, which takes the same props
  (`StretchSwitchProps`: `SwitchProps`).
- `velocity-toast` (1.0.0): `variant`, EasyUI's name, removed, and `VelocityToastVariant` with it: `tone`, a
  `StatusTone` (`danger` where it said `error`, `neutral` where it said `default`).
- `undo-toast` (1.0.0): `variant`, EasyUI's name, removed, and `UndoToastVariant` with it: `tone`, as Toast's.
- `drag-to-confirm` (1.0.0): `variant`, EasyUI's name, removed, and `DragConfirmVariant` with it: `tone` (`neutral` where
  it said `default`).
- `button` (1.0.0): `isLoading` and the variant `destructive`, EasyUI's names, removed: `pending` and `danger`.
- `combobox` (1.0.0): `onValueChange`, EasyUI's name, removed: `onChange`.
- `animated-tabs` (1.0.0): `activeTab` and `defaultTab`, EasyUI's names, removed: `value` and `defaultValue`.
- `notification-bell` (1.0.0): `isOpen`, EasyUI's name, removed: `open`.
- `smooth-accordion` (1.0.0): `defaultOpen`, EasyUI's name, removed: `defaultValue`.
- `settle-modal` (1.0.0): `hideCloseButton`, EasyUI's name, removed: `showCloseButton`, the other way round.
- `flysheet` (1.0.0): `showClose`, EasyUI's name, removed: `showCloseButton`.
- `sidebar` (1.0.0): a badge's tone `negative`, the former name of `danger`, removed: `danger`.
- `bar-chart` (1.0.0): `ariaLabel`, EasyUI's name, and `tone`, removed: `aria-label` and `colorBy`.
- `donut-chart`, `funnel-chart`, `activity-heatmap`, `live-line-chart` (1.0.0): `ariaLabel`, EasyUI's name, removed:
  `aria-label`.
- `advanced-data-table` (1.0.0): `isLoading`, EasyUI's name, removed from `DataTable`, `AdvancedDataTable` and the
  context their parts read: `loading`.
- `animated-file-upload` (1.0.0): `variant="compact"`, EasyUI's, removed: `density="compact"`. `variant` takes
  `standard` alone, its default.

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
- **No focus ring on a field that takes text** (`design.css`, 0.5.3), which a browser marks as reached by the
  keyboard at a click too: its caret and its border show its focus, the ring only under forced colours.
- **Gone:** `NotFoundDemo` (it led to EasyUI's site); `payment-status`'s name (above).
