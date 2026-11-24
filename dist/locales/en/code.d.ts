import type { MessageKit } from '../../lib/messages.js';
/**
 * The code editors (ioiti-ui/code): DiffEditor's words, and CodeMirror's own (its search, its folds, its lint, its merge
 * view), in CodeMirror's English, which its `EditorState.phrases` take: `$` is where CodeMirror puts a number.
 */
export declare const code: {
    /** "Original": the name of the version compared against, above it (DiffEditor's `originalLabel`, where it is given none). */
    original: string;
    /** "Modified": the name of the version changed (DiffEditor's `modifiedLabel`, where it is given none). */
    modified: string;
    /** "Rule file: Modified": a side of DiffEditor named for a screen reader, what is compared and which version. */
    side: ({ label, version }: {
        label: string;
        version: string;
    }) => string;
    /** "No change", "1 change", "3 changes": how many changes DiffEditor holds, in its header. */
    changes: (count: number, { plural }: MessageKit) => string;
    /** "Previous change": the button, and its hint, that goes to the change before. */
    previousChange: string;
    /** "Next change": the button, and its hint, that goes to the change after. */
    nextChange: string;
    /** "Find": the search panel's field (⌘F), its placeholder and its name. */
    find: string;
    /** "Replace": the search panel's field of what replaces a match. */
    replace: string;
    /** "next": the search panel's button to the next match. */
    findNext: string;
    /** "previous": the search panel's button to the match before. */
    findPrevious: string;
    /** "all": the search panel's button that selects every match. */
    selectMatches: string;
    /** "match case": the search panel's box that tells capitals from small letters. */
    matchCase: string;
    /** "regexp": the search panel's box that reads the search as a regular expression. */
    regexp: string;
    /** "by word": the search panel's box that finds whole words only. */
    byWord: string;
    /** "replace": the search panel's button that replaces the match. */
    replaceMatch: string;
    /** "replace all": the search panel's button that replaces every match. */
    replaceAll: string;
    /** "close": the button that closes a panel (the search, the problems, go to line). */
    close: string;
    /** "current match": said as the search reaches a match ("current match. … on line 3."). */
    currentMatch: string;
    /** "on line": said before the line of a match. */
    onLine: string;
    /** "replaced $ matches": said once every match is replaced, `$` how many. */
    replacedMatches: string;
    /** "replaced match on line $": said once a match is replaced, `$` its line. */
    replacedMatchOnLine: string;
    /** "Go to line": the field that goes to a line. */
    goToLine: string;
    /** "go": its button. */
    go: string;
    /** "Control character": a character that is not shown (NUL, ESC), said with its name. */
    controlCharacter: string;
    /** "Selection deleted": said once the text selected is deleted. */
    selectionDeleted: string;
    /** "Folded lines": said once lines are folded ("Folded lines 3 to 7."). */
    foldedLines: string;
    /** "Unfolded lines": said once lines are unfolded. */
    unfoldedLines: string;
    /** "to": between the first line folded and the last. */
    foldedTo: string;
    /** "folded code": the name of the mark that stands for code folded. */
    foldedCode: string;
    /** "unfold": that mark's hint. */
    unfold: string;
    /** "Fold line": the hint of a fold's marker, open. */
    foldLine: string;
    /** "Unfold line": the hint of a fold's marker, folded. */
    unfoldLine: string;
    /** "Diagnostics": the name of the list of the problems found in the code. */
    diagnostics: string;
    /** "No diagnostics": that list, empty. */
    noDiagnostics: string;
    /** "$ unchanged lines": a stretch of a diff folded, `$` how many lines. */
    unchangedLines: string;
    /** "Accept": the button that takes a change of a diff. */
    accept: string;
    /** "Reject": the button that drops a change of a diff. */
    reject: string;
    /** "Revert this chunk": the button that puts a change of a diff back as it was. */
    revertChunk: string;
};
