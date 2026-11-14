import { AIAgentActivity } from 'ioiti-ui'

export default function AIAgentActivityEmpty() {
  return <AIAgentActivity activities={[]} title="A new question" agentName="Assistant" summary="Not started" />
}
