# ErrorState

What a page, or a part of one, shows in place of itself when it failed: what went wrong, in words for its kind, and the way on (Try again, Reload, home). `ErrorBoundary` keeps a part that throws as it draws from taking the page down with it: the part says it failed, the rest stays.

**You provide** `error` (what was thrown or caught: its kind chooses the words and the way on; in development, its message and stack show under Details); `onRetry` (Try again: a request made again, a boundary's `reset`; no button without it); `title` and `description` (the words of its kind by default); `home` (`{ href, label }`, `Back to home` at `/` on a page; `null` for none, a part's default); `page={false}` for a part of a page; on a page, `name` (what the trail and the tab call it, the title by default), `parents` (as `PageHeader` takes them) and `focusOnMount` (`false` where it is drawn in a part of a page). For `ErrorBoundary`: the part as `children`; `fallback` (a node, or a function given `{ error, reset }`; an `ErrorState` of a part by default), `onError(error, { componentStack })`, `resetKeys` (values which, once one changes, draw the part again).

```tsx
<ErrorBoundary>
  <SalesByShop />
</ErrorBoundary>

<ErrorBoundary fallback={({ error, reset }) => (
  <ErrorState page={false} title="The sales could not be shown" error={error} onRetry={reset} />
)}>
  <SalesByShop />
</ErrorBoundary>
```

- AppShell has one around the page: a page that throws as it draws shows an `ErrorState` in its place, the sidebar and the top bar kept, and another page clears it. With React Router, `RouterErrorPage` shows one for a route whose loader failed too.
- An `ErrorBoundary` goes around a part that may throw on what it does not control (a chart of another service's figures), not around every component: the page has the shell's already.
- Its words follow the error: "Something went wrong" (a part: "This part could not be shown") and Try again; "The server could not be reached" when a request found no network; "This page could not be loaded" and Reload when a part of the application failed to load, a new version published since the page was opened (trying again would load the same). Its icon says the kind in its tone: `negative`, `warning`, `info`.
- A page names the trail and the tab, and its heading takes the focus as it comes, for a screen reader; a part names nothing and is read out where the focus is (`role="alert"`).
- What the shell's boundary, an `ErrorBoundary` or the router's error page catches is told to the application once: `IoitiProvider`'s `onError`, with where it was caught, for its error tracker. The details show in development only: a production build keeps none of them.
- Data a page fetches and could not load is `QueryState`'s (what was on screen stays); a record that does not exist or an address that names nothing, `NotFoundState`; a list with nothing in it, `EmptyState`; an action that failed, `ErrorText` under its button.
