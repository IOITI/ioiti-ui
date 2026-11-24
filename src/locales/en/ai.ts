import type { MessageKit } from '../../lib/messages.js'

/** AIResponse, AIAgentActivity, PromptComposer, AttachmentChip. */
export const ai = {
  // AIResponse.
  /** "Link blocked for your safety": the hint of a link of an answer that is not followed (a script, a data address). */
  linkBlocked: 'Link blocked for your safety',
  /** "email": where a mail address leads, in place of a site's name (a source, a link's hint). */
  emailHost: 'email',
  /** "Table": the name of an answer's table that scrolls, for a screen reader. */
  table: 'Table',
  /** "text": the label of an answer's code that names no language. */
  plainText: 'text',
  /** "Assistant": the header's title, where the application gives none. */
  assistant: 'Assistant',
  /** "Streaming": the header while the answer is written. */
  streaming: 'Streaming',
  /** "Thinking": the header while nothing of the answer is written yet. */
  thinking: 'Thinking',
  /** "Stopped": the header of an answer stopped before its end. */
  stopped: 'Stopped',
  /** "Generating response": the name of the lines drawn while nothing of the answer is written. */
  generating: 'Generating response',
  /** "Couldn’t finish this response": the heading of an answer that failed. */
  unfinished: 'Couldn’t finish this response',
  /** "The connection dropped or the model timed out.": why, where the application says nothing. */
  unfinishedReason: 'The connection dropped or the model timed out.',
  /** "Try again": the button that asks for the answer again, under its error. */
  tryAgain: 'Try again',
  /** "Ready when you are.": what an empty answer says. */
  idle: 'Ready when you are.',
  /** "Sources": the button that shows an answer's sources, where the application names it nothing. */
  sources: 'Sources',
  /** "Used 3 tools": the button that shows the tools an answer used. */
  toolsUsed: (count: number, { plural }: MessageKit) => plural(count, { one: 'Used # tool', other: 'Used # tools' }),
  /** "success": a tool's call that succeeded, said to a screen reader after its name. */
  toolSuccess: 'success',
  /** "running": a tool's call still running. */
  toolRunning: 'running',
  /** "error": a tool's call that failed. */
  toolError: 'error',
  /** "Copied": the copy button's hint once the answer is copied. */
  copied: 'Copied',
  /** "Copy": the copy button's hint. */
  copy: 'Copy',
  /** "Response copied": the copy button's name once the answer is copied. */
  responseCopied: 'Response copied',
  /** "Copy response": the copy button's name. */
  copyResponse: 'Copy response',
  /** "Regenerate": the hint of the button that asks for the answer again. */
  regenerate: 'Regenerate',
  /** "Regenerate response": its name. */
  regenerateResponse: 'Regenerate response',
  /** "Good response": the button that says the answer was good, and its hint. */
  goodResponse: 'Good response',
  /** "Poor response": the button that says it was not, and its hint. */
  poorResponse: 'Poor response',
  /** "AI response": the name of an answer, for a screen reader. */
  response: 'AI response',

  // AIAgentActivity.
  /** "Activity": the header's title, where the application gives none. */
  activityTitle: 'Activity',
  /** "Running": the header while the agent works. */
  activityRunning: 'Running',
  /** "2 of 3 done": the header once nothing runs, the steps done among all of them. */
  stepsDone: ({ done, count }: { done: number; count: number }, { number }: MessageKit) => `${number(done)} of ${number(count)} done`,
  /** "Not started": the header while there is no step. */
  notStarted: 'Not started',
  /** "Expand all": the button that opens every step's details. */
  expandAll: 'Expand all',
  /** "Collapse all": the button that closes them. */
  collapseAll: 'Collapse all',
  /** "Code": the name of a step's code that names no language. */
  codeSnippet: 'Code',
  /** "No activity recorded": what an agent with no step says. */
  noActivity: 'No activity recorded',
  /** "Asked": the heading of what a step was given, where the application names it nothing. */
  inputLabel: 'Asked',
  /** "Answer": the heading of what came back. */
  outputLabel: 'Answer',
  /** "Notes": the name of a group of the agent's notes, for a screen reader. */
  notesLabel: 'Notes',
  /** "model:": a step's detail, before its value. */
  metadataEntry: (key: string) => `${key}:`,

  // PromptComposer.
  /** "Send": the button that sends the request. */
  send: 'Send',
  /** "Stop": the button that stops the request under way. */
  stop: 'Stop',
  /** "Requests to start from": the name of the requests offered, for a screen reader. */
  suggestions: 'Requests to start from',
  /** "Attached": the name of what goes with the request, for a screen reader. */
  attachments: 'Attached',

  // AttachmentChip.
  /** ", being made ready": said to a screen reader after the name of what is uploaded still. */
  attachmentPreparing: ', being made ready',
  /** "Remove export.csv": the button that takes it away. */
  removeAttachment: (label: string) => `Remove ${label}`,
}
