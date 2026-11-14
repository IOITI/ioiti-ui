import { InteractiveTimeline } from 'ioiti-ui'

export default function InteractiveTimelineStatuses() {
  return (
    <InteractiveTimeline
      label="Release 4.2 of the shop"
      defaultExpandedIds={['tests', 'deploy']}
      items={[
        {
          id: 'build',
          title: 'Built',
          timestamp: '3 Nov, 14:02',
          status: 'completed',
          statusLabel: 'Done',
          tag: 'v4.2.0',
          commitHash: '8f3c2a1',
          author: { name: 'Léa Brun', role: 'Developer' },
          metrics: [
            { label: 'Duration', value: '2 min 14 s' },
            { label: 'Size', value: '1.8 MB' },
          ],
        },
        {
          id: 'tests',
          title: 'Tested',
          timestamp: '3 Nov, 14:05',
          status: 'warning',
          statusLabel: 'Slow',
          description: 'Every test passed; the checkout’s took twice its usual time.',
          metrics: [
            { label: 'Tests', value: '1,412' },
            { label: 'Duration', value: '6 min 40 s' },
          ],
        },
        {
          id: 'deploy',
          title: 'Deployed to the first server',
          timestamp: '3 Nov, 14:13',
          status: 'failed',
          statusLabel: 'Failed',
          description: 'The server refused the new database schema: nothing was changed, the old version still runs.',
        },
        { id: 'retry', title: 'Deploying again', timestamp: '3 Nov, 14:20', status: 'in-progress', statusLabel: 'Now', description: 'With the schema fixed.' },
        { id: 'everywhere', title: 'Deployed everywhere', timestamp: '—', status: 'pending' },
      ]}
    />
  )
}
