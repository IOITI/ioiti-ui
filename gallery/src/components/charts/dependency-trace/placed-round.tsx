import { DependencyTrace } from 'ioiti-ui'

export default function DependencyTracePlacedRound() {
  return (
    <div className="max-w-md">
      {/* No x or y: the nodes go round an ellipse on the canvas. */}
      <DependencyTrace
        label="Build pipeline"
        nodes={[
          { id: 'git', label: 'Repository', status: 'ok', statusLabel: 'Up' },
          { id: 'ci', label: 'Builds', status: 'ok', statusLabel: 'Up' },
          { id: 'registry', label: 'Registry', status: 'ok', statusLabel: 'Up' },
          { id: 'deploy', label: 'Deploys', status: 'warning', statusLabel: 'Queued', detail: '3 waiting' },
          { id: 'cdn', label: 'CDN' },
        ]}
        connections={[
          { from: 'ci', to: 'git', label: 'clone' },
          { from: 'ci', to: 'registry', label: 'push' },
          { from: 'deploy', to: 'registry', label: 'pull' },
          { from: 'deploy', to: 'cdn', label: 'upload' },
        ]}
      />
    </div>
  )
}
