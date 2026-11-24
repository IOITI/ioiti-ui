import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { history, historyKeymap, defaultKeymap } from '@codemirror/commands';
import { lintGutter, setDiagnostics } from '@codemirror/lint';
import { getChunks, goToNextChunk, goToPreviousChunk, MergeView, unifiedMergeView } from '@codemirror/merge';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { Annotation, Compartment, EditorState } from '@codemirror/state';
import { drawSelection, EditorView, highlightSpecialChars, keymap, lineNumbers } from '@codemirror/view';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IconButton } from '../components/IconButton.js';
import { cn } from '../lib/utils.js';
import { placeDiagnostics } from './diagnostics.js';
import { loadLanguage } from './languages.js';
import { editorTheme } from './theme.js';
/** A change the component makes itself (a new `modified` given): not reported back as the user's. */
const fromProps = Annotation.define();
const COLLAPSE = { margin: 3, minSize: 4 };
/**
 * Two versions of a text and what changed between them (CodeMirror's merge view): removed in the loss's
 * tone, added in the gain's, long unchanged stretches folded, the buttons of the header moving from one
 * change to the next. The changed side can be edited.
 */
export function DiffEditor({ original, modified, onChange, language = 'text', layout = 'split', collapseUnchanged = true, readOnly = false, label, originalLabel = 'Original', modifiedLabel = 'Modified', wrap = false, maxHeight, actions, diagnostics, onSave, className, }) {
    const host = useRef(null);
    // The editor that shows the changed version: the merge view's second, or the unified one.
    const changed = useRef(null);
    const parts = useRef(null);
    const handlers = useRef({ onChange, onSave });
    useLayoutEffect(() => {
        handlers.current = { onChange, onSave };
    });
    const [changes, setChanges] = useState(0);
    // The changed text when the view is made again (a new original, layout or option): the user's, kept.
    const latest = useRef(modified);
    const settings = useRef({ readOnly, wrap, label, originalLabel, modifiedLabel });
    useLayoutEffect(() => {
        settings.current = { readOnly, wrap, label, originalLabel, modifiedLabel };
    });
    const collapse = collapseUnchanged === false ? undefined : collapseUnchanged === true ? COLLAPSE : { ...COLLAPSE, ...collapseUnchanged };
    // Folding is compared by its values (an object given inline is new at each render).
    const collapseKey = collapse ? `${collapse.margin}:${collapse.minSize}` : 'none';
    const folding = useRef(collapse);
    useLayoutEffect(() => {
        folding.current = collapse;
    });
    useEffect(() => {
        const { readOnly: locked, wrap: wrapped, label: name, originalLabel: before, modifiedLabel: after } = settings.current;
        const languages = [new Compartment(), new Compartment()];
        const lock = new Compartment();
        const count = (state) => setChanges(getChunks(state)?.chunks.length ?? 0);
        const shared = (compartment, accessible) => [
            lineNumbers(),
            highlightSpecialChars(),
            drawSelection(),
            highlightSelectionMatches(),
            editorTheme,
            wrapped ? EditorView.lineWrapping : [],
            compartment.of([]),
            EditorView.contentAttributes.of({ 'aria-label': accessible }),
        ];
        const editable = [
            history(),
            lintGutter(),
            keymap.of([
                {
                    key: 'Mod-s',
                    preventDefault: true,
                    run: (target) => {
                        handlers.current.onSave?.(target.state.doc.toString());
                        return true;
                    },
                },
                ...defaultKeymap,
                ...historyKeymap,
                ...searchKeymap,
            ]),
            lock.of(EditorState.readOnly.of(locked)),
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    latest.current = update.state.doc.toString();
                    if (!update.transactions.every((tr) => tr.annotation(fromProps)))
                        handlers.current.onChange?.(latest.current);
                }
                count(update.state);
            }),
        ];
        let destroy;
        if (layout === 'split') {
            const merge = new MergeView({
                parent: host.current,
                a: {
                    doc: original,
                    extensions: [
                        shared(languages[0], `${name}: ${before}`),
                        EditorState.readOnly.of(true),
                        keymap.of(searchKeymap),
                        EditorView.contentAttributes.of({ 'aria-readonly': 'true' }),
                    ],
                },
                b: { doc: latest.current, extensions: [shared(languages[1], `${name}: ${after}`), editable] },
                collapseUnchanged: folding.current,
                gutter: true,
                highlightChanges: true,
            });
            changed.current = merge.b;
            destroy = () => merge.destroy();
        }
        else {
            const unified = new EditorView({
                parent: host.current,
                state: EditorState.create({
                    doc: latest.current,
                    extensions: [
                        shared(languages[1], `${name}: ${after}`),
                        editable,
                        unifiedMergeView({ original, mergeControls: false, gutter: true, highlightChanges: true, collapseUnchanged: folding.current }),
                    ],
                }),
            });
            changed.current = unified;
            destroy = () => unified.destroy();
        }
        parts.current = { language: languages, readOnly: lock };
        // The chunks are known once the diff has run: counted on the next frame as well as on each update.
        const frame = requestAnimationFrame(() => changed.current && count(changed.current.state));
        count(changed.current.state);
        return () => {
            cancelAnimationFrame(frame);
            destroy();
            changed.current = null;
            parts.current = null;
        };
        // The view is made again when what it compares or how it shows it changes; the rest reconfigures it.
    }, [original, layout, collapseKey, wrap, label, originalLabel, modifiedLabel]);
    useEffect(() => {
        const editor = changed.current;
        if (!editor || editor.state.doc.toString() === modified)
            return;
        latest.current = modified;
        editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: modified }, annotations: fromProps.of(true) });
    }, [modified]);
    useEffect(() => {
        let current = true;
        void loadLanguage(language).then((support) => {
            if (!current || !parts.current)
                return;
            const views = viewsOf(changed.current);
            parts.current.language.forEach((compartment, index) => {
                const target = views[index];
                if (target)
                    target.dispatch({ effects: compartment.reconfigure(support) });
            });
        });
        return () => {
            current = false;
        };
    }, [language, original, layout, collapseKey, wrap, label, originalLabel, modifiedLabel]);
    useEffect(() => {
        const editor = changed.current;
        if (editor && parts.current)
            editor.dispatch({ effects: parts.current.readOnly.reconfigure(EditorState.readOnly.of(readOnly)) });
    }, [readOnly]);
    // Placed again when the view is made again: a new original or layout starts it afresh.
    useEffect(() => {
        const editor = changed.current;
        if (!editor)
            return;
        editor.dispatch(setDiagnostics(editor.state, placeDiagnostics(editor.state.doc, diagnostics ?? [])));
    }, [diagnostics, original, layout, collapseKey, wrap, label, originalLabel, modifiedLabel]);
    const move = (direction) => {
        const editor = changed.current;
        if (!editor)
            return;
        const command = direction === 'next' ? goToNextChunk : goToPreviousChunk;
        command({ state: editor.state, dispatch: editor.dispatch });
        editor.focus();
    };
    const height = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
    return (_jsxs("section", { "aria-label": label, className: cn('min-w-0 overflow-hidden rounded-xl border border-border bg-surface', className), children: [_jsxs("header", { className: "flex items-center gap-2 border-b border-border py-1 pl-3 pr-1.5 text-xs text-text-secondary", children: [_jsx("span", { className: "min-w-0 truncate font-medium text-text-primary", children: label }), _jsx("span", { role: "status", className: "shrink-0", children: changes === 0 ? 'No change' : changes === 1 ? '1 change' : `${changes} changes` }), _jsxs("span", { className: "ml-auto flex shrink-0 items-center", children: [_jsx(IconButton, { label: "Previous change", hint: "Previous change", icon: _jsx(ChevronUp, {}), disabled: changes === 0, onClick: () => move('previous'), className: "size-7 disabled:opacity-40" }), _jsx(IconButton, { label: "Next change", hint: "Next change", icon: _jsx(ChevronDown, {}), disabled: changes === 0, onClick: () => move('next'), className: "size-7 disabled:opacity-40" }), actions] })] }), layout === 'split' && (_jsxs("div", { "aria-hidden": true, className: "grid grid-cols-2 border-b border-border text-xs text-text-secondary", children: [_jsx("span", { className: "truncate px-3 py-1", children: originalLabel }), _jsx("span", { className: "truncate border-l border-border px-3 py-1", children: modifiedLabel })] })), _jsx("div", { ref: host, "data-layout": layout, style: height ? { maxHeight: height } : undefined, className: cn('overflow-auto', layout === 'split' && '[&_.cm-mergeViewEditor]:min-w-0') })] }));
}
/** The editors of a diff, in the order of their language compartments: the original's, then the changed one's. */
function viewsOf(editor) {
    if (!editor)
        return [null, null];
    const merge = editor.dom.closest('.cm-mergeView');
    if (!merge)
        return [null, editor];
    const first = merge.querySelector('.cm-mergeViewEditor .cm-editor');
    return [first ? EditorView.findFromDOM(first) : null, editor];
}
