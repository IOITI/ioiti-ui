import { ErrorState, Panel } from 'ioiti-ui'

// What the browser throws when the code of a part, a file of its own (React's lazy), is no longer on the server: a
// new version of the application was published since the page was opened.
const ERROR = new TypeError('Failed to fetch dynamically imported module: https://app.example.com/assets/MonthlyReport-3f9a1c.js')

export default function ErrorStateReload() {
  return (
    <div className="max-w-lg">
      <Panel title="Monthly report" description="Its code loaded as it is first shown.">
        {/* What an ErrorBoundary around it shows by default. Reload gets the new version: here, this page again. */}
        <ErrorState page={false} error={ERROR} />
      </Panel>
    </div>
  )
}
