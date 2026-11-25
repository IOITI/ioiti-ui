import { EditorState } from '@codemirror/state';
// CodeMirror's English phrases, which it looks its words up by, and the catalogue's word for each: its view, its
// commands, its search panel, its folds, its lint and its merge view (@codemirror/view, commands, search, language,
// lint, merge).
// i18n-exempt: CodeMirror's own English, the ids of its phrases; their words are the catalogue's.
const PHRASES = {
    'Control character': 'controlCharacter',
    'Selection deleted': 'selectionDeleted',
    Find: 'find',
    Replace: 'replace',
    next: 'findNext',
    previous: 'findPrevious',
    all: 'selectMatches',
    'match case': 'matchCase',
    regexp: 'regexp',
    'by word': 'byWord',
    replace: 'replaceMatch',
    'replace all': 'replaceAll',
    close: 'close',
    'current match': 'currentMatch',
    'on line': 'onLine',
    'replaced $ matches': 'replacedMatches',
    'replaced match on line $': 'replacedMatchOnLine',
    'Go to line': 'goToLine',
    go: 'go',
    'Folded lines': 'foldedLines',
    'Unfolded lines': 'unfoldedLines',
    to: 'foldedTo',
    'folded code': 'foldedCode',
    unfold: 'unfold',
    'Fold line': 'foldLine',
    'Unfold line': 'unfoldLine',
    Diagnostics: 'diagnostics',
    'No diagnostics': 'noDiagnostics',
    '$ unchanged lines': 'unchangedLines',
    Accept: 'accept',
    Reject: 'reject',
    'Revert this chunk': 'revertChunk',
};
/** CodeMirror's phrases in the words given: what its own panels, marks and announcements say. */
export function codeMirrorPhrases(words) {
    return Object.fromEntries(Object.entries(PHRASES).map(([phrase, word]) => [phrase, words[word]]));
}
/** An editor's phrases (`EditorState.phrases`) in the words given, the provider's language's. */
export function phrasesExtension(words) {
    return EditorState.phrases.of(codeMirrorPhrases(words));
}
