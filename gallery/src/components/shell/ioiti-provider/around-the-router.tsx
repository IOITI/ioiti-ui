import { CodeBlock, IoitiProvider, useAppName } from 'ioiti-ui'

const MAIN = `// main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IoitiProvider appName="My App" themeStorageKey="my-app.theme">
      <RouterProvider router={router} />
    </IoitiProvider>
  </StrictMode>,
)`

const PAGES = ['Orders', 'Invoice 2026-0042', 'Settings']

/** The tabs of a few pages, as the browser shows them: the page's title, then the application's name. */
function Tabs() {
  const appName = useAppName()
  return (
    <ul aria-label="Tabs" className="flex flex-wrap gap-1.5 border-b border-border">
      {PAGES.map((page) => (
        <li key={page} className="rounded-t-lg border border-b-0 border-border bg-surface-raised px-3 py-1.5 text-xs text-text-secondary">
          {page} · {appName}
        </li>
      ))}
    </ul>
  )
}

export default function IoitiProviderAroundTheRouter() {
  return (
    <div className="flex flex-col gap-4">
      <CodeBlock language="tsx" code={MAIN} />
      {/* Once in an application, around its router. Here around a part of this page, which it names. */}
      <IoitiProvider appName="My App">
        <Tabs />
      </IoitiProvider>
    </div>
  )
}
