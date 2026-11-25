import type { MessageKit } from '../../lib/messages.js';
/** AIResponse, AIAgentActivity, PromptComposer, AttachmentChip. */
export declare const ai: {
    /** "Link blocked for your safety": the hint of a link of an answer that is not followed (a script, a data address). */
    linkBlocked: string;
    /** "email": where a mail address leads, in place of a site's name (a source, a link's hint). */
    emailHost: string;
    /** "Table": the name of an answer's table that scrolls, for a screen reader. */
    table: string;
    /** "text": the label of an answer's code that names no language. */
    plainText: string;
    /** "Assistant": the header's title, where the application gives none. */
    assistant: string;
    /** "Streaming": the header while the answer is written. */
    streaming: string;
    /** "Thinking": the header while nothing of the answer is written yet. */
    thinking: string;
    /** "Stopped": the header of an answer stopped before its end. */
    stopped: string;
    /** "Generating response": the name of the lines drawn while nothing of the answer is written. */
    generating: string;
    /** "Couldn’t finish this response": the heading of an answer that failed. */
    unfinished: string;
    /** "The connection dropped or the model timed out.": why, where the application says nothing. */
    unfinishedReason: string;
    /** "Try again": the button that asks for the answer again, under its error. */
    tryAgain: string;
    /** "Ready when you are.": what an empty answer says. */
    idle: string;
    /** "Sources": the button that shows an answer's sources, where the application names it nothing. */
    sources: string;
    /** "Used 3 tools": the button that shows the tools an answer used. */
    toolsUsed: (count: number, { plural }: MessageKit) => string;
    /** "success": a tool's call that succeeded, said to a screen reader after its name. */
    toolSuccess: string;
    /** "running": a tool's call still running. */
    toolRunning: string;
    /** "error": a tool's call that failed. */
    toolError: string;
    /** "Copied": the copy button's hint once the answer is copied. */
    copied: string;
    /** "Copy": the copy button's hint. */
    copy: string;
    /** "Response copied": the copy button's name once the answer is copied. */
    responseCopied: string;
    /** "Copy response": the copy button's name. */
    copyResponse: string;
    /** "Regenerate": the hint of the button that asks for the answer again. */
    regenerate: string;
    /** "Regenerate response": its name. */
    regenerateResponse: string;
    /** "Good response": the button that says the answer was good, and its hint. */
    goodResponse: string;
    /** "Poor response": the button that says it was not, and its hint. */
    poorResponse: string;
    /** "AI response": the name of an answer, for a screen reader. */
    response: string;
    /** "Activity": the header's title, where the application gives none. */
    activityTitle: string;
    /** "Running": the header while the agent works. */
    activityRunning: string;
    /** "2 of 3 done": the header once nothing runs, the steps done among all of them. */
    stepsDone: ({ done, count }: {
        done: number;
        count: number;
    }, { number }: MessageKit) => string;
    /** "Not started": the header while there is no step. */
    notStarted: string;
    /** "Expand all": the button that opens every step's details. */
    expandAll: string;
    /** "Collapse all": the button that closes them. */
    collapseAll: string;
    /** "Code": the name of a step's code that names no language. */
    codeSnippet: string;
    /** "No activity recorded": what an agent with no step says. */
    noActivity: string;
    /** "Asked": the heading of what a step was given, where the application names it nothing. */
    inputLabel: string;
    /** "Answer": the heading of what came back. */
    outputLabel: string;
    /** "Notes": the name of a group of the agent's notes, for a screen reader. */
    notesLabel: string;
    /** "model:": a step's detail, before its value. */
    metadataEntry: (key: string) => string;
    /** "Send": the button that sends the request. */
    send: string;
    /** "Stop": the button that stops the request under way. */
    stop: string;
    /** "Requests to start from": the name of the requests offered, for a screen reader. */
    suggestions: string;
    /** "Attached": the name of what goes with the request, for a screen reader. */
    attachments: string;
    /** ", being made ready": said to a screen reader after the name of what is uploaded still. */
    attachmentPreparing: string;
    /** "Remove export.csv": the button that takes it away. */
    removeAttachment: (label: string) => string;
};
