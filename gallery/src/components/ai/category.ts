import { Sparkles } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const ai: CategoryInfo = {
  slug: 'ai',
  label: 'AI',
  icon: Sparkles,
  summary: 'An assistant’s answer, the steps it took to write it, and the request it answers: what it does is said in words, as it does it.',
  families: [
    {
      slug: 'ai-response',
      name: 'AIResponse',
      names: ['AIResponse', 'AIResponseHeader', 'AIResponseContent', 'AIResponseToolsSummary', 'AIResponseSources', 'AIResponseActions', 'AIResponseThinking'],
      keywords: ['assistant', 'chat', 'answer', 'markdown', 'stream', 'llm'],
      examples: [
        { id: 'streaming', title: 'Streamed, then complete', description: 'Markdown read as it streams (never as HTML), then its sources, copy, regenerate and feedback. A same-site link is the application’s; any other opens a new tab, and a dangerous one is no link at all.' },
        { id: 'working', title: 'Working, before its first word', description: 'In place of a skeleton: what it does now and for how long, then what it is about, a line at a time (held under the pointer). Only what it does is read out as it changes.' },
        { id: 'parts', title: 'Composed from its parts', description: 'Its header, its content, the tools it used, its sources and its actions, in the order an application needs; feedback given before shown pressed.' },
        { id: 'states', title: 'Stopped, failed, not asked', description: 'Stopped, what was written stays and says so; failed, it says why and offers to try again; before a question, it waits.' },
      ],
    },
    {
      slug: 'ai-agent-activity',
      name: 'AIAgentActivity',
      names: ['AIAgentActivity', 'AgentActivityHeader', 'AgentActivityTimeline', 'AgentActivityItem', 'AgentActivityNotes'],
      keywords: ['agent', 'steps', 'tool calls', 'trace', 'reasoning'],
      examples: [
        { id: 'running', title: 'Running, then done', description: 'What an assistant did, step by step: each step’s state in words beside its time, its input and output on demand; its notes between stretches of steps, as its words, the last one still being written.' },
        { id: 'folded', title: 'Folded under its heading', description: 'Whole from its props, folded when asked: its summary says what it holds. A step that failed says so in words, its output saying why.' },
        { id: 'parts', title: 'From its parts', description: 'A timeline the page lays out itself, from notes and items; or one step alone.' },
        { id: 'empty', title: 'Nothing done yet', description: 'Before its first step, it says so.' },
      ],
    },
    {
      slug: 'prompt-composer',
      name: 'PromptComposer',
      names: ['PromptComposer'],
      keywords: ['chat input', 'prompt', 'message', 'textarea', 'send'],
      examples: [
        { id: 'attachments', title: 'With what it goes with', description: 'It grows with its text, sends with Enter (Shift+Enter breaks a line, and so does Enter on a touch screen), is stopped while answered, and offers requests to start from. What it goes with is above its field: drop a file on it, or paste one.' },
        { id: 'sending', title: 'Sending, or switched off', description: 'Busy with no way to stop, nothing can be sent until the answer comes; disabled, its button says why.' },
        { id: 'floating', title: 'Floating', description: 'At the foot of what scrolls under it, with no band behind it: its frame lifted by a shadow.' },
      ],
    },
    {
      slug: 'attachment-chip',
      name: 'AttachmentChip',
      names: ['AttachmentChip'],
      keywords: ['file', 'upload', 'attachment', 'chip'],
      examples: [
        { id: 'states', title: 'Its states', description: 'Something attached to a request or a message: it may be taken away, lead somewhere, be made ready, or say why it could not be taken.' },
        { id: 'uploading', title: 'Made ready, then taken', description: 'Busy while it uploads, a spinner in place of its icon and said to screen readers; ready, its size.' },
        { id: 'narrow', title: 'Long names, narrow', description: 'Its label is cut where room ends; its detail and its remove button stay whole.' },
      ],
    },
  ],
}

export default ai
