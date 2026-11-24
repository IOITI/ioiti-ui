/**
 * The code editors (ioiti-ui/code): DiffEditor's words, and CodeMirror's own (its search, its folds, its lint, its merge
 * view), in CodeMirror's English, which its `EditorState.phrases` take: `$` is where CodeMirror puts a number.
 */
export const code = {
    /** "Original": the name of the version compared against, above it (DiffEditor's `originalLabel`, where it is given none). */
    original: 'Original',
    /** "Modified": the name of the version changed (DiffEditor's `modifiedLabel`, where it is given none). */
    modified: 'Modified',
    /** "Rule file: Modified": a side of DiffEditor named for a screen reader, what is compared and which version. */
    side: ({ label, version }) => `${label}: ${version}`,
    /** "No change", "1 change", "3 changes": how many changes DiffEditor holds, in its header. */
    changes: (count, { plural }) => (count === 0 ? 'No change' : plural(count, { one: '# change', other: '# changes' })),
    /** "Previous change": the button, and its hint, that goes to the change before. */
    previousChange: 'Previous change',
    /** "Next change": the button, and its hint, that goes to the change after. */
    nextChange: 'Next change',
    /** "Find": the search panel's field (⌘F), its placeholder and its name. */
    find: 'Find',
    /** "Replace": the search panel's field of what replaces a match. */
    replace: 'Replace',
    /** "next": the search panel's button to the next match. */
    findNext: 'next',
    /** "previous": the search panel's button to the match before. */
    findPrevious: 'previous',
    /** "all": the search panel's button that selects every match. */
    selectMatches: 'all',
    /** "match case": the search panel's box that tells capitals from small letters. */
    matchCase: 'match case',
    /** "regexp": the search panel's box that reads the search as a regular expression. */
    regexp: 'regexp',
    /** "by word": the search panel's box that finds whole words only. */
    byWord: 'by word',
    /** "replace": the search panel's button that replaces the match. */
    replaceMatch: 'replace',
    /** "replace all": the search panel's button that replaces every match. */
    replaceAll: 'replace all',
    /** "close": the button that closes a panel (the search, the problems, go to line). */
    close: 'close',
    /** "current match": said as the search reaches a match ("current match. … on line 3."). */
    currentMatch: 'current match',
    /** "on line": said before the line of a match. */
    onLine: 'on line',
    /** "replaced $ matches": said once every match is replaced, `$` how many. */
    replacedMatches: 'replaced $ matches',
    /** "replaced match on line $": said once a match is replaced, `$` its line. */
    replacedMatchOnLine: 'replaced match on line $',
    /** "Go to line": the field that goes to a line. */
    goToLine: 'Go to line',
    /** "go": its button. */
    go: 'go',
    /** "Control character": a character that is not shown (NUL, ESC), said with its name. */
    controlCharacter: 'Control character',
    /** "Selection deleted": said once the text selected is deleted. */
    selectionDeleted: 'Selection deleted',
    /** "Folded lines": said once lines are folded ("Folded lines 3 to 7."). */
    foldedLines: 'Folded lines',
    /** "Unfolded lines": said once lines are unfolded. */
    unfoldedLines: 'Unfolded lines',
    /** "to": between the first line folded and the last. */
    foldedTo: 'to',
    /** "folded code": the name of the mark that stands for code folded. */
    foldedCode: 'folded code',
    /** "unfold": that mark's hint. */
    unfold: 'unfold',
    /** "Fold line": the hint of a fold's marker, open. */
    foldLine: 'Fold line',
    /** "Unfold line": the hint of a fold's marker, folded. */
    unfoldLine: 'Unfold line',
    /** "Diagnostics": the name of the list of the problems found in the code. */
    diagnostics: 'Diagnostics',
    /** "No diagnostics": that list, empty. */
    noDiagnostics: 'No diagnostics',
    /** "$ unchanged lines": a stretch of a diff folded, `$` how many lines. */
    unchangedLines: '$ unchanged lines',
    /** "Accept": the button that takes a change of a diff. */
    accept: 'Accept',
    /** "Reject": the button that drops a change of a diff. */
    reject: 'Reject',
    /** "Revert this chunk": the button that puts a change of a diff back as it was. */
    revertChunk: 'Revert this chunk',
};
