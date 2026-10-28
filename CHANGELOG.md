# Changelog

What changes from one version of ioiti-ui to the next. A version is a git tag (`v0.1.0`), which an
application installs as `github:IOITI/ioiti-ui#v0.1.0` (`docs/releasing.md`).

## [0.4.5] - 2026-10-28

- **What animates its layout in a `Popover` follows it at once as the page scrolls.** A `SegmentedControl`'s fill
  in it (as in a `TimeRangePicker`'s start and end), an `AnimatedTabs`' indicator, was measured from the window:
  the popover moved with its button, and the fill, seeing itself moved, slid after it for half a second, out of
  its place. The popover is the root of its content's layout animations now (framer-motion's `layout` and
  `layoutRoot`): the fill keeps its place in it, and still slides from one segment to the next. Nothing to change
  in an application.

## [0.4.4] - 2026-10-28

Three components could bring their page down, rendered again and again until React gave up ("Too many
re-renders", its error #301). Nothing to change in an application.

- **`RelativeTime` never brings its page down as its moment turns a minute, or two days, old.** It goes on to
  the clock read less often (each minute, each hour) once that clock too says the moment old enough, and is said
  each second (each minute) until then. It went on as soon as the clock it was on said so, while the other, read
  longer ago, still said the moment younger and sent it back: the two sent it to each other without end, wherever
  a time older kept the other clock going. The gallery's Data display page fell so 40 s after it was opened.
- **`LiveValue` and `NumberInput` take a value that is not a number (`NaN`) for none, as `null`**: a dash, an
  empty field (stepped from its minimum, or 0). Never equal to itself, it was a new value at every render, each
  asking for another, from the first.

## [0.4.3] - 2026-10-28

Nothing is wider than the screen on a phone any more, where pages scrolled sideways, onto nothing or onto a
chart drawn past its card. Nothing to change in an application.

- **The shell's page never scrolls sideways.** What would stand beyond its edges is cut there (`overflow-x:
  clip`, the page positioned), where the page slid sideways onto nothing; what sticks to its top still does.
  What is wider than the screen scrolls in a frame of its own (`Table`).
- **A chart takes its width from its container alone** (`LineChart`, `BarChart`, `DonutChart`, `FunnelChart`,
  `ActivityHeatmap`, `LiveLineChart`, `StatCard`'s line: `contain-inline-size`). Drawn 640 px wide before it
  was measured, a chart in a grid's single column (every grid on a phone) held the column open at that width,
  was measured so, and stayed wider than the screen.
- **A chart's table for screen readers is in a box of its own** (`LineChart`, `BarChart`, `DonutChart`,
  `FunnelChart`), read as before: a table is never narrower than its rows, and one made 1 px wide (`sr-only`)
  stood as wide as its text, beyond the page, which then scrolled sideways onto nothing.
- **A `Panel` is never wider than its place** (`min-w-0`). In a grid's single column, a line that does not wrap
  (`truncate`) held the column, and every card in it, wider than the screen; it is cut short now, as it was meant
  to be.
- **What scrolls sideways holds what it scrolls** (positioned): `Table`'s frame, the data table's table and its
  filters. The words of a cell for screen readers (`sr-only`, placed absolutely) stood out of a frame that was
  not, past the page. `SignedValue`'s rolling digits (`animate`) keep their words with them the same way.
- **`AnimatedTabs`' row is never wider than its container.** Where its tabs do not all fit (a phone), it scrolls
  in itself, without a bar, each name on one line; the names broke over two lines and the row stood past the
  page. `tabsContainerClassName` still adds to it.
- **`CopyChip`'s `truncate="end"` cuts the value to its chip**: the hint around it (`Hint`'s `wrap`) gives way
  where it is let to (`className="min-w-0"`, which no other use of the package gives), where the value was never
  cut and the chip stood as wide as the whole of it.
- Each is held by a test (`narrow-screens.test.tsx`, the shell's scrolling).

## [0.4.2] - 2026-10-28

- **The top bar's trail never runs under what stands beside it.** On a wide screen the whole trail is shown as
  long as it fits the room the top bar leaves it (the chips and the controls at its end take theirs first): the
  page's own name may be cut short, down to 8rem, the steps before it never. Where it does not fit, its last two
  steps take its place, as on a narrower screen; it comes back once there is room. The steps before the page kept
  their width whatever the room, so at 1,024 px a chip ("Restart needed") was drawn over them, and without one they
  ran under the controls. The whole trail that gives way stays laid out, out of sight, of the keyboard's reach and
  of screen readers (`inert`, `aria-hidden`), to be measured again; where there is no `ResizeObserver` it is shown,
  as before.
- `Breadcrumb`'s names carry `data-crumb-name`.

## [0.4.1] - 2026-10-27

- **`LineChart` writes a day as the rest of the design does**: "07 Oct" on its time axis and "07 Oct 2026" at
  the top of its tooltip, as `formatDay` and `formatDateTime` write them (and a `BarChart` of days, whose labels
  an application gives with `formatDay`). It wrote "7 Oct", so two charts of the same days one above the other
  read differently. `formatTimeTick` with it.

## [0.4.0] - 2026-10-27

What an application needs to give up its own bar of unsaved changes, its guard of leaving, its live figures and
its charts for the package's: the options they lacked. Each is new and off unless given; nothing to change in an
application but `formatRelative`'s "in 0 s" (below).

- **`SaveBar`**: `saveDisabled`, a Save that cannot be pressed while what there is to save is not valid yet;
  `error`, why it cannot (or why the last save failed), said at once to a screen reader (`role="alert"`). The
  gallery's bar says it when its limit is emptied.
- **`RouterLeaveGuard`**: `within`, the address under which the changes are kept, the page's own views sharing
  one draft (`/settings` for `/settings/mail` and `/settings/billing`): going from one to another is no leaving;
  `allowed`, the addresses the page may go to without asking, whatever is lost (the sign-in page a lapsed
  session is sent to, where staying would save nothing).
- **`SignedValue`**: `stale` (and `staleLabel`), as `LiveValue`'s: the figure muted, its sign kept, and
  "(stale)" for a screen reader; an animated one does not roll its digits anew as it goes stale.
- **`RelativeTime`**: `past`, a moment that has happened, read on a clock a little ahead of this one (a
  server's): said "0 s ago", never "in 2 s"; its full date stays the moment given.
- **`formatRelative`**: now itself, to the half second, is "0 s ago"; it was "in 0 s".
- **`useNow`**: a clock set back while nothing read it is read again; it kept the time ahead until the clock
  caught up with it.
- **`BarChart`**: `formatTitle`, a category's heading in the tooltip and its row of the table ("Monday" where
  the axis says "Mon"); `details`, more to say of a category, in the tooltip and a "Details" column of the
  table; `tickAt`, the categories the axis names (a time axis's round moments), as many as fit otherwise;
  `integer`, whole numbers on the value axis, for counts; `marked`, one category set apart among those it is set
  against (a result among random ones), for one series: its bar in the series colour and a line through it,
  named above the plot, the others in the muted grey. A missing value (`null`) is no bar, and a dash in the
  tooltip and the table.
- **`LineChart`**: `details`, as `BarChart`'s, under a moment's values; `connectGaps`, one line across the
  missing values where it would break.
- **`ChartLegend`**: the shape `marker`, a moment marked across the chart (`LineChart`'s markers).
- **`ChartDetail`**, the type of a detail (`{ label, value }`), exported.
- The gallery shows each of them: the charts' titles, details, a run set apart among random ones, a restart in
  the legend; a stale signed value; a moment received on a clock ahead.

## [0.3.0] - 2026-10-27

A fifth accent, `bloom`: the colours of a printed flyer, a soft gradient with a grain. A check box whose mark
draws itself, and a sheet that can push the page aside. And motion, calm and the same everywhere: a page and a
look that change in one cross-fade, toasts that leave, and one motion for everything in front of the page. And
the data tables' filters as Elastic UI's filter group.

And 37 components more, what pages wrote by hand or did without: charts (bars, a donut, lines over time,
sparklines, a legend, lists of bars, a progress), the data a page shows (terms and their details, code in the
design's code colours, changes from before to after, more on demand, a value to copy, a moment from now, a
figure watched, avatars), menus and inputs (a popover, a menu and a context menu, a segmented control, a number,
sliders, several values as chips, a value edited where it is, a range of time and its refresh), and the flow of
an application (a skip link, the bar of unsaved changes and the guard of leaving, keyboard shortcuts, panels to
resize, a tour of a page).

- **Bloom**: the flyer's orchid on what is chosen, current or primary, on links, the focus ring and one-series
  charts, as every accent's colour. A filled button and the application's mark take the flyer's gradient
  itself, lilac to pink to tangerine, under a fine grain, with the page's ink on it in both themes. With
  glass, the backdrop is the flyer: its pink, its tangerine and its mustard, grainy too. The grain's specks
  are the page's own colour (white in light, black in dark): they never bring the backdrop nearer the text on
  it. Text holds 4.5:1 on every surface of the 20 looks, on every point of the gradient, the grain's strongest
  speck included; the funnel ramps passed the dataviz validator.
- **Tokens** an accent with a gradient sets: `--brand-gradient`; `--brand-fill`, the gradient under its grain,
  for `accent:bg-(image:--brand-fill)`; `--brand-fill-foreground`, the text on it, for
  `accent:text-brand-fill-foreground` (the fill's own text where the accent has no gradient); `--brand-grain`;
  and the backdrop's other washes, `--brand-wash-2` and `--brand-wash-3`.
- **Two images**, `grain-white.png` and `grain-black.png`, beside `accents.css`, which names them: tiles of fine
  noise, a speck to a pixel of a retina screen, made by `scripts/grains.mjs`. An application's build writes
  them beside its own files, never inlined (`img-src 'self'` holds).
- **`Button`'s filled variants (and `ButtonLink`) and `AppBrand`'s mark** draw the gradient where the accent has
  one; with any other accent, nothing changes. `SplitButton`'s primary and the primary actions of
  `SelectionBasket` and `SmartComparison` keep the accent's fill.
- **The gallery**: bloom in the picker, the Themes, Colours and Chart colours pages; the contrast of the text on
  the gradient in every look.
- **`Checkbox` is EasyUI's draw-checkbox**: its mark draws itself and the box settles with a small pop, a soft
  box in the design's grey when checked (the accent's colour under an accent). The same props, and
  `indeterminate`, a bar, which screen readers hear as partly checked. The focus ring shows on it (the box it
  replaces hid it), and its label alone names it, its description read after. The boxes of `AdvancedDataTable`
  (rows, cards, header, column list) are the same box, no longer the browser's. A Check box demo in the gallery.
- **`Flysheet`**, EasyUI's sheet with what Elastic UI's flyout does: from any side, swiped away on a touch
  screen; a side sheet in three widths or any (`size`, `minWidth`, `maxWidth`), widened or narrowed by its edge
  or the arrow keys on it (`resizable`, `onResize`); pushing the page aside instead of covering it, from a
  window 1024 px wide (`type="push"`, `pushMinWidth`; `--flysheet-push-left` and `--flysheet-push-right` for
  what an application fixes to the window); without a backdrop, the page in use (`modal={false}`); its close
  button outside (`closePosition`); the padding of its parts (`padding`); a child sheet, a `Flysheet` in the
  content of another, beside its parent or over it on a narrow screen, closed with it; why it closed
  (`onOpenChange(false, { reason })`). Its parts: `FlysheetTrigger`, `FlysheetContent`, `FlysheetHeader`,
  `FlysheetTitle`, `FlysheetDescription`, `FlysheetBody`, `FlysheetFooter`, `FlysheetClose`. Shown on the
  gallery's Overlays page.
- **A change of page in one cross-fade** (`AppShell`, `RouterAppShell`): the page left fades out in 150 ms as
  the new one fades in and rises 6 px in 240 ms, the sidebar and the top bar staying as they are, and in use.
  React 19.3's `ViewTransition`, which React Router's changes of page start; with another router, a new
  `pathname` given to `AppShell` in a React transition. A change of the query alone, Back and Forward, and a
  browser without view transitions change the page at once; where motion is reduced, the new page fades in
  without rising. What is fixed over the page stays above it while it changes (a dialog, a sheet, the drawer,
  the toasts), its glass blurring the page behind it as ever. Another page opens at its top before the browser
  paints.
- **A change of look in one cross-fade**: a theme, an accent or a material chosen changes the whole page at once,
  where a mix of 150 ms colour fades and snaps did; the components' own transitions hold still meanwhile. A press
  is answered at once all the same: where the browser draws no frame soon, the change comes without its fade. The
  theme button's icon turns.
- **Within a page**: a toast leaves, its exit played, before the next one comes (`ToastProvider` took it away
  before its exit could play); what arrives where a skeleton was fades in (`QueryState`), what was there already
  is shown as it is; a meter slides to its ratio; the icon buttons and `ButtonLink` give when pressed, as
  `Button` does.
- **One motion for what floats**: popovers, menus, tooltips, peek cards, the palette and the toasts arrive with
  `springSnappy` and leave with `easeExit`, quicker than they came; sheets and the drawer slide with
  `springSheet`, the sidebar's width and pill too; scrims fade in with `easeFast` and out with `easeExit`.
  `SettleModal` grows from what opened it, without its overshoot. The components' own values are listed in
  `docs/easyui-changes.md`.
- **Tokens**: `motionTransitions.springSheet` and `.easeExit`. For the stylesheets, `ioiti-ui/motion.css`
  (imported by `design.css`): `ease-soft`, `ease-fast` and `ease-exit`, framer-motion's curves, and
  `animate-reveal`; every `transition-*` class takes `ease-fast`'s curve, its 150 ms kept. `motion-safe:` and
  `motion-reduce:` follow `IoitiProvider`'s `reducedMotion` as well as the system (`data-reduced-motion` on
  `<html>`), and the loops of spinners stop where motion is reduced. `over-page`, for a layer an application fixes over
  its pages, keeps it above a change of page. It only adds: the reference blocks of the design hold.
- **The gallery**: the Motion page shows the curves in CSS, a change of page and of look, what moves within a
  page and the motion of what floats.
- **The data tables' filters as one group of buttons** (`AdvancedDataTable`, `DataTableFilters`), as Elastic UI's
  filter group: a button for each column that filters, joined in one bar, saying how many options it has or how
  many are ticked. It opens its options in a list to tick, each with the rows it would leave under the search and
  the other filters, with a search of its own from eight options; a column of two options is an on/off pair,
  pressed one at a time. `ColumnDef`'s `filterDisplay` (`auto`, `list`, `toggle`) chooses; "Clear filters"
  clears them all. A list follows its button as the page scrolls; on a phone, a tap opens it without the
  keyboard, which comes when its search is tapped. `useDataTable()` gives `setFilter` and `countOptions`. Shown on the gallery's Data display
  page, the orders filtered by customer, status and channel.
- **`Kbd`**: the keys of a shortcut as this computer writes them: `mod+k` is ⌘K on an Apple computer, Ctrl K
  elsewhere; `g o` is G, then O. A screen reader hears them in words ("Command K").
- **`CopyButton`**: copies a value and says it did, a check for two seconds and its hint saying what came of it
  ("Copied", "Couldn't copy"), the words said to a screen reader; the focus stays on it.
- **`SegmentedControl`**: two to five choices in one bar, the chosen one filled as a primary button is (with the
  accent's fill), the fill sliding to the next. A radio group to the keyboard, its arrows moving and choosing;
  or the tabs of panels (`role="tablist"`).
- **`useNow`**: the time now, read again every interval; the components asking for the same interval share one
  timer, which stops when none is left.
- **The charts' small text** (StatCard, FunnelChart, ActivityHeatmap, LiveLineChart) is the design's muted text,
  4.5:1 on every surface of every look: it was 3.6:1 on the dark card. Their tooltips follow the pointer as what
  floats moves, and jump to it where motion is reduced; the focus on a chart is the global ring.
- **`Sparkline`**: the trend of a figure, small and without axes, for a `KpiTile` or a table's cell: a line in the
  colour of its direction (or the tone given, where down is good), or bars from zero, a loss below. A screen
  reader hears what it shows, from its first value to its last, its highest and lowest.
- **`ChartLegend`**: what a chart's colours stand for, each swatch drawn as the chart draws its series (a bar, a
  line, a dashed line, a point), a figure beside it where there is one; with `onToggle`, each item shows or hides
  its series. For an application's own charts too.
- **`BarChart`**, EasyUI's: values by category, side by side or stacked (changing it moves the bars from one to the
  other), in the design's colours: one series in the series colour, things compared in the four compare colours,
  never recycled. Losses are drawn below a zero line, each bar rounded at its far end, stacked by sign;
  `tone="sign"` colours each bar as a gain or a loss (daily margins). The arrow keys move from one category to
  the next; a table gives screen readers every figure; its legend shows and hides a series.
- **`DonutChart`**, EasyUI's: parts of a whole, or a gauge (`variant="semi"`). Four segments take the compare
  colours; the fifth and those after it are one segment, "Other" (`otherLabel`), in grey. Its centre and its legend
  say a segment's figure and share; a table gives screen readers every segment, those grouped included.
- **`LineChart`**: values over time, on an axis of the time zone's round moments: up to four series compared in
  the compare colours (a benchmark dashed), or one with an area under it; its `references` (a limit, in its tone)
  and `markers` (a restart); zero kept on the axis or the axis fitted to the values. A gap in the data is a gap
  in the line. The pointer or the arrow keys read a moment, every series in its tooltip; a table gives screen
  readers every one; its legend shows and hides a series. Where `LiveLineChart` shows a value as it arrives,
  `LineChart` shows a history.
- **`MeterTone`**, the type of `Meter`'s four tones, is exported: the tone of a chart's limit, and of what follows.
- **`ProgressBar`**: how far a piece of work has come, in words beside the bar and for a screen reader ("42 of 120
  files"), in a tone when it goes wrong; its length unknown, the fill breathes, still where motion is reduced.
  For a ratio against a limit, `Meter`.
- **`BarList`**: things ranked by a figure, a row each of its label, its bar and the figure, a row leading where
  it counts what is there.
- **`DescriptionList`**: terms and their details, a `<dl>`: a summary in rows, a record's details with its terms
  in a column of their own (`columns`), figures side by side, each term over its figure (`grid`), facts in a line
  (`inline`); `divided`, `boxed`, `compressed`, and `numeric` for figures that line up. As Elastic UI's
  description list does.
- **`CodeBlock`** and **`Code`**: code to read and copy (a payload, a configuration, a command), coloured in the
  design's code colours, which nothing drew with until now: json, js and ts (with jsx), css and a shell, or a
  tokeniser of the caller's (`highlight`). Its lines numbered, some marked, a label above it, a long one scrolled
  or wrapped, a button that copies it; on a surface every code colour is read on at 4.5:1 in every look, which
  the contrast tests now hold. `Code` is the word of code in a sentence. As Elastic UI's code block does. The
  gallery's code is drawn with them.
- **`ChangeList`**: what changes, each from its value before to its value after (a configuration about to be
  applied, a record edited), what is added new and what is removed said so, with a note, in groups; screen
  readers hear "from … to …".
- **`Disclosure`**: more, shown on demand, the browser's own `<details>` (find in the page opens it on what it
  finds), plain or boxed, held by its caller or not; its height follows what it holds where the browser can
  animate to a height of auto, at once where motion is reduced.
- **`Popover`**: a panel beside a button (filters, a few settings), in the page's body, beside its button where
  the window has room and following it as the page scrolls; the focus goes in, and Escape, a Tab past its end or
  a press elsewhere closes it and gives the focus back. Not modal; inside a dialog or a sheet, Escape and Tab stay
  its own. Every layer placed beside its trigger from now on is placed by the same code (`src/lib/anchor.ts`).
- **`DropdownMenu`** and **`ContextMenu`**: the actions on a thing, behind a button or at the pointer (a right
  click, a long press, Shift+F10, the menu key). An item acts, leads somewhere (a link, opened elsewhere with ⌘
  or Ctrl), is ticked, or is one of a few; groups under their names, separators, shortcuts shown with `Kbd`, the
  one that removes in the negative colour; more in a sub-menu, which takes the menu's place with a row going
  back, on a phone as on a computer (Elastic UI's context menu panels). The arrows move, a letter jumps to the
  next item that starts with it, Escape closes, Tab leaves; the focus is back on the button before an action
  runs, so that a dialog it opens gives it back there.
- **`NumberInput`**: a number to type, or to change with the arrow keys (ten at a time with Shift, Page Up and
  Down, Home and End to its bounds) and the − and + buttons; what is typed stays as it is until it leaves the
  field ("1." on the way to "1.5"), a comma or a point marking the decimals; it keeps to its minimum, its maximum
  and its step, whole numbers when asked, with a unit before or after it. A spin button to a screen reader, its
  value said with its unit.
- **`Slider`** and **`RangeSlider`**: a value along a scale, or a range between two, the browser's own range input
  (its arrows, Page Up and Down, Home and End, said in words to a screen reader), its thumb ringed in the accent;
  ticks with their labels, bands of the track in a tone (where a value is safe, to watch, too far), a field beside
  it to type the value. As Elastic UI's range and dual range do.
- **`MultiSelect`**: several values from a list, each a chip in the field: typing filters the list, the arrows
  move in it, Enter ticks or unticks, Backspace in an empty field removes the last chip; options in groups, with
  a second line, "+N" past `maxChips`; with `onCreateOption`, what is typed becomes a value of its own (a tag).
  The field keeps the focus, the list floats beside it; inside a dialog, Escape closes the list only. As Elastic
  UI's combo box does.
- **`Badge`**'s × has a name of its own (`removeLabel`: "Remove Lyon"), may be no stop of the keyboard
  (`removeFocusable`), draws no ring of its own, and takes a press 24 px wide.
- **`InlineEdit`**: a value edited where it is shown, a name or a title: it reads as text, a click or Enter turns
  it into a field, Enter saves and Escape gives up (inside a dialog, its Escape is its own). A save that takes its
  time shows it; one refused says why and keeps the field; the focus comes back to the value. As Elastic UI's
  inline edit does.
- **`TimeRangePicker`** and **`AutoRefresh`**: a range of time as people say it ("Last 15 minutes", "Today"), which
  stays true as time goes by, each end `now`, `now` moved and rounded (`now-15m`, `now/d`) or a moment: chosen in
  two clicks (a quick select, the ranges commonly used, those recently used), or its ends set one by one (a moment
  on the calendar, a time from now, now) and applied with Update; refreshed by a press or on a timer (`refresh`,
  `onRefreshChange`), which waits while the page's tab is hidden. `AutoRefresh` is the timer alone. As Elastic
  UI's super date picker does.
- **`resolveTimeRange`** gives a range's two moments now (for `rangeParams` and a query), **`formatTimeRange`** says
  it in words; type **`TimeRange`**.
- **A skip link in the shell** (`AppShell`, `RouterAppShell`): the first stop of the keyboard, "Skip to the page",
  shown once it has the focus, gives the focus to the page past the menu and the top bar; the address keeps no
  fragment of it.
- **`SaveBar`**: the bar of unsaved changes at the bottom of the page while there are any (what there is to save,
  Discard and Save, saving and an error), in sight as the page scrolls; a screen reader hears it once. The toasts
  rise above it while it is there (`ToastProvider` clears what sits at the bottom of the page). As Elastic UI's
  bottom bar does.
- **`RouterLeaveGuard`** (`ioiti-ui/react-router`): asks before the page is left with changes not saved, another
  page of the application (a dialog: Stay, Leave) or the tab closed or reloaded (the browser's own question); a
  change of the query or of the part shown is no leaving. Needs a data router (`createBrowserRouter`).
- **`SettleModal`**'s description is read with its title (`aria-describedby`).
- **`useShortcut`** and **`ShortcutsDialog`**: a keyboard shortcut registered where it means something, heard while
  that part is on the page: a combination (`mod+k`, ⌘K or Ctrl K), a sequence (`g o`), a character (`?`). Keys
  without ⌘ or Ctrl wait while text is typed, every key while a dialog is open. Those given a description are
  listed by group, with their keys, in `ShortcutsDialog`, which `AppShell` draws and `?` opens once there is one
  to list (`shortcutsDialog={false}` for none). Each application has its own registry (`IoitiProvider`).
- **`ResizablePanels`**, **`ResizablePanel`** and **`ResizableHandle`**: panels side by side or one over the other,
  each sized by the handle between them, dragged or moved with the arrow keys once it has the focus (Shift for
  more, Home and End to the panels' bounds, Enter to fold a collapsible panel away and back, a double click back
  to the first sizes); a separator with its value to a screen reader; one under the other under `stackBelow`. As
  Elastic UI's resizable container does.
- **`ProductTour`**, EasyUI's: a walk through a page, one part at a time, the page dimmed around it (the design's
  scrim, the glass's under glass) and scrolled to it, its step beside it, at the bottom on a phone; a part is an
  element's selector, a getter or a ref. A dialog named by its step's title: the arrows move, Escape ends it, Tab
  stays in its card, the focus comes back where it was. Its cutout glides as a sheet does, still where motion is
  reduced.
- **`Avatar`** and **`AvatarGroup`**: a person, as their picture (from the application's own origin) or their
  initials, named for a screen reader; together, overlapping, each named in a hint, "+N" naming the rest, an
  avatar lifting a little under the pointer (not where motion is reduced).
- **`LiveValue`**: a figure that changes as it is watched (a price, a queue): each change shows in its tone a moment
  and fades back, a fade that stays where motion is reduced; muted, and said stale to a screen reader, once what
  sends it stops; the tones swapped where down is good.
- **`RelativeTime`**: a moment said from now ("3 min ago", "in 2 h"), kept true as time goes by at the precision it
  is said in (each second under a minute, each minute up to two days, then each hour), its full date in a hint
  and for a screen reader; every time on a page shares one clock for each precision (`useNow`). The gallery's
  dashboard says its events' times so.
- **`CopyChip`**: a value to read and copy, in a chip with its `CopyButton` (a reference, an API key, a webhook's
  address); a long one cut in its middle, its ends telling it apart, or at its end, the whole of it in a hint and
  for a screen reader.
- **`DateRangeFilter`** takes the page's presets (`presets`: so many days, or a range of their own, type
  `DateRangePreset`), the day they end on (`today`: the last day there is data for), the calendar's bounds
  (`minDate`, `maxDate`) and no "All time" (`allTime={false}`). Without them, it is as it was.
- **`Input`** shows a unit before or after its value (`prefix`, `suffix`: "€", "ms", "https://"), its text kept
  clear of it; a screen reader hears it as the field's description, not in its name.
- **`KpiGrid`** lays its tiles in the columns asked (`columns`: 2 to 6 from a wide screen), two on a phone; four by
  default, as it was.
- **`SpotlightSearch`** draws what it was given and did not show: an entry's `icon`, its `shortcut` (its keys, with
  `Kbd`), and the `recentSearches`, offered while nothing is typed and typed again when chosen. `grouped` lists the
  entries under their categories. Without them, it is as it was.
- **`AnimatedTabs`** is a tablist where its tabs switch panels: tabs, the panel named by the tab shown, one stop of
  the keyboard whose arrows, Home and End move and choose (`label` names it). Tabs that lead to pages stay links.
  A badge of 0 is a badge, where a bare "0" was drawn.
- **`OTPInput`**'s boxes look like `Input` (its border, its surface and its text in both themes, its focus in the
  accent), where EasyUI's were grey with a violet focus: a code's boxes under a password field look like it.
  `boxClassName` still restyles them.
- **`NotificationBell`**'s button looks like the top bar's other buttons (`IconButton`): square, quiet until hovered,
  giving a little when pressed, held as pressed while its panel is open; EasyUI's was a bordered box that grew under
  the pointer. `triggerClassName` still restyles it.

An application changes nothing. `ioiti({ accent: 'bloom' })` makes bloom its own; `ACCENTS` and the type
`Accent` have one more value, which a `switch` naming every accent must handle. `Checkbox` keeps its name and
its props: the new box comes with the update. So does the motion, on React 19.3 at least: an application on
React 19.2 updates `react` and `react-dom`. `IoitiProvider reducedMotion="always"` reduces it everywhere. A
table's filters change their look: a column of two options becomes an on/off pair (`filterDisplay: 'list'`
keeps it a list), and `initialFilters` works as before.

The new components add names to the package's interface (`src/index.ts`; `RouterLeaveGuard` to
`ioiti-ui/react-router`), and change nothing an application has: what it sees change is the charts' small text,
lighter on dark (the design's muted text, where it was under 4.5:1); the shell's skip link, shown once the
keyboard reaches it; `?` listing the application's shortcuts once it registers one (`shortcutsDialog={false}`
for none); and `Badge`'s ×, which draws no ring of its own.

## [0.2.1] - 2026-10-27

Found while moving WATA's admin interface onto the package, the one place where it did not do what the
interface it came from did.

- **A link to a part of the page shown is the browser's again** (`RouterLink` of `ioiti-ui/react-router`): an
  address that is only a fragment (`#trust`, a check of `CheckList` leading to what says more of it) is drawn as a
  plain `<a>`. Through React Router's `Link` it became `/page#trust`, dropped the address's query and scrolled
  nothing: the router does not scroll to a fragment, and the shell's page, not the window, is what scrolls. Any
  other address still goes through the router.

An application changes nothing.

## [0.2.0] - 2026-10-27

Two more choices beside light and dark, each person's own: an accent and a material. Neutral and flat are
the design as it was: an application that gives neither looks as it did.

- **The accent and the material**: `useTheme()` gives `accent`, `material`, `setAccent` and `setMaterial`;
  `ACCENTS` and `MATERIALS` list them (types `Accent`, `Material`). A choice is kept in the browser beside the
  theme's (`<key>.accent`, `<key>.material`), and the pre-paint script writes `data-accent` and
  `data-material` on `<html>`: nothing for neutral and flat.
- **`LookPicker`**: the button that chooses them, for beside the theme's (`topBarEnd`).
- **`ioiti({ accent, material })`**: the application's own, shown from the first paint until a person picks
  another.
- **The stylesheets**: `ioiti-ui/accents.css` (the `brand` tokens of violet, indigo and blue, and the focus
  ring and one-series charts in their colour) and `ioiti-ui/glass.css` (the backdrop, deeper shadows, and the
  `glass-bar`, `glass-card` and `glass-float` utilities), both imported by `design.css`, with the variants
  `accent:` and `glass:` for an application's own classes. Text holds 4.5:1 on every surface of the 16
  looks, glass laid over its backdrop's strongest colours; the design's own blocks are unchanged.
- **The accent on the components**: what is chosen, current or primary (a filled button, a box checked, a
  switch on, the day picked, the step done, the tab, option, row or page shown, a progress, a link) in the
  accent, through `accent:` classes after the components' own (`docs/easyui-changes.md`). The tones keep their
  colours.
- **Glass on the components**: the sidebar and the top bar (`glass-bar`), panels, tiles and cards
  (`glass-card`), and what floats over the page, the only glass blurred (`glass-float`): popovers, menus,
  dialogs over a lighter scrim, toasts, tooltips, the drawer. Fields, rows and buttons stay solid.
- **The gallery**: the picker in its top bar; a Themes page; the accents' and the glass's tokens on the Colours
  page, with the contrast of the look shown and of every look; each accent's chart colours; glass on the
  Surfaces page.
- **The template**: the picker beside the theme's button, and how to give the application's own look.

An application changes nothing to look as it did. To give it a look of its own, add `accent` and `material`
to `ioiti()` in `vite.config.ts`; to let each person choose, put `<LookPicker />` before `<ThemeToggle />` in
the shell's `topBarEnd`. A canvas chart keyed on the theme to redraw should be keyed on the accent too.

## [0.1.0] - 2026-10-26

The first version: the design and the components of WATA's admin interface (WATA v0.50.1), as a package any
application can install. Held to the original's built CSS block by block, and compared in a browser: the same
tokens and the same shell, in both themes (`docs/fidelity.md`).

- **The design**: `ioiti-ui/styles.css` (Tailwind CSS 4 and the design in one import) or `ioiti-ui/design.css`
  (the design alone); the tokens of both themes, Geist and JetBrains Mono, the global focus ring; the
  pre-paint theme script (`ioiti-ui/theme.js`), under the application's own key.
- **The components**: EasyUI's 44, as WATA's admin had them (`docs/easyui-changes.md`); the blocks of WATA's
  pages (`Panel`, `PageHeader`, `KpiTile`, `Meter`, `Hint`, `ButtonLink`, `PeekLink`, `CheckList`,
  `ExportButton`, `DateRangeFilter`, `ConfirmAction`, `StatusBadge`, `SignedValue`, `QueryState`); and the
  recipes its pages wrote by hand (`Field`, `IconButton`, `Table` and its parts, `TextLink`, `EmptyText`,
  `ErrorText`, `KpiGrid`).
- **The shell**: `AppShell` (sidebar, top bar, the trail of where a page is), `AppBrand`,
  `SidebarFooterButton`, `StateChip`, `NotFoundState`, `NotFoundPage`, `AuthLayout`; the menu as data
  (`Menu`), the page's name (`PageHeader`, `usePageName`, `useTabTitle`).
- **The providers**: `IoitiProvider` (theme, animations, the application's name), `LinkProvider` (the
  application's links for every component), `ThemeProvider`, `ToastProvider`.
- **`ioiti-ui/react-router`**: `RouterRoot`, `RouterAppShell`, `RouterLink`.
- **`ioiti-ui/vite`**: `ioiti()`, the pre-paint script in the pages, no font as a `data:` URI, one React.
- **The gallery** (`npm run gallery`) and **the starter template** (`templates/app`).
