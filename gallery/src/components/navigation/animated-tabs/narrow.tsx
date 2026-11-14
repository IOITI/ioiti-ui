import { AnimatedTabs } from 'ioiti-ui'

export default function AnimatedTabsNarrow() {
  return (
    <div className="max-w-72 rounded-xl border border-dashed border-border p-3">
      <AnimatedTabs
        label="Settings"
        tabs={[
          { id: 'profile', label: 'Profile', content: <p>Your name, your picture and the language of the pages.</p> },
          { id: 'notifications', label: 'Notifications', badge: 2, content: <p>What is sent to you, and where.</p> },
          { id: 'billing', label: 'Billing', content: <p>The plan, the card and the invoices.</p> },
          { id: 'members', label: 'Members', content: <p>Who works in this workspace.</p> },
          { id: 'security', label: 'Security', content: <p>Sign-in, sessions and keys.</p> },
        ]}
      />
    </div>
  )
}
